import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFallbackOpenAccountRepository } from "../src/repositories/fallbackOpenAccountRepository.js";
import { createFakePuntoVentaRepositories } from "../src/repositories/fakePuntoVentaRepositories.js";
import { createTestApp, jsonRequest } from "./testApp.js";

test("open accounts can be created and listed for the authenticated company", async () => {
  const app = createTestApp();

  const created = await jsonRequest(app, "/api/open-accounts", {
    method: "POST",
    body: { terminalId: 1, cashShiftId: 5, customerId: null, name: "Pedido Laura" }
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.name, "Pedido Laura");

  const listed = await jsonRequest(app, "/api/open-accounts");
  assert.equal(listed.response.status, 200);
  assert.ok(listed.body.data.some((account) => account.id === created.body.data.id));
  assert.ok(listed.body.data.every((account) => account.status === "open"));

  const seededAccount = listed.body.data.find((account) => account.id === 501);
  assert.equal(seededAccount.totalAmount, 2091);
  assert.equal(Number.isInteger(seededAccount.totalAmount), true);
});

test("open account detail supports add, update and remove line", async () => {
  const app = createTestApp();

  const created = await jsonRequest(app, "/api/open-accounts", {
    method: "POST",
    body: { terminalId: 1, cashShiftId: 5, name: "Mostrador prueba" }
  });
  const accountId = created.body.data.id;

  const added = await jsonRequest(app, `/api/open-accounts/${accountId}/lines`, {
    method: "POST",
    body: { itemId: 11, quantity: 2, unitPrice: 1600, discountAmount: 0 }
  });
  assert.equal(added.response.status, 201);
  assert.equal(added.body.data.lines[0].name, "Croissant mantequilla");
  assert.equal(added.body.data.totals.totalAmount, 3616);

  const lineId = added.body.data.lines[0].id;
  const updated = await jsonRequest(app, `/api/open-accounts/${accountId}/lines/${lineId}`, {
    method: "PATCH",
    body: { quantity: 3 }
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.lines[0].quantity, 3);

  const removed = await jsonRequest(app, `/api/open-accounts/${accountId}/lines/${lineId}`, {
    method: "DELETE"
  });
  assert.equal(removed.response.status, 200);
  assert.equal(removed.body.data.lines.length, 0);
});

test("cancelling an open account requires a reason", async () => {
  const app = createTestApp();

  const response = await jsonRequest(app, "/api/open-accounts/501", {
    method: "PATCH",
    body: { status: "cancelled" }
  });

  assert.equal(response.response.status, 400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("auditor cannot manage open accounts", async () => {
  const app = createTestApp();
  const result = await jsonRequest(app, "/api/open-accounts", { user: "auditor" });

  assert.equal(result.response.status, 403);
  assert.equal(result.body.error.code, "FORBIDDEN");
});

test("open accounts can be served by a configured primary repository", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories();
  const storageState = {
    mode: "fake",
    openAccounts: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async list() {
      return [
        {
          id: 701,
          name: "SQL Mostrador",
          status: "open",
          terminalId: 1,
          cashShiftId: null,
          lineCount: 0,
          totalAmount: 0,
          createdAt: "2026-06-22T12:00:00"
        }
      ];
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      openAccounts: createFallbackOpenAccountRepository({
        primary,
        fallback: fakeRepositories.openAccounts,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const result = await jsonRequest(app, "/api/open-accounts");

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data[0].name, "SQL Mostrador");
  assert.equal(storageState.openAccounts, "sql-local");
  assert.equal(storageState.sqlAvailable, true);
});

test("open accounts fall back to fake repository when primary storage fails", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories({ initialOpenAccounts: [] });
  const storageState = {
    mode: "fake",
    openAccounts: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async create() {
      throw new Error("local SQL unavailable");
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      openAccounts: createFallbackOpenAccountRepository({
        primary,
        fallback: fakeRepositories.openAccounts,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const created = await jsonRequest(app, "/api/open-accounts", {
    method: "POST",
    body: { terminalId: 1, cashShiftId: 5, customerId: null, name: "Fallback local" }
  });

  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.name, "Fallback local");
  assert.equal(storageState.mode, "fake-fallback");
  assert.equal(storageState.openAccounts, "fake");
  assert.equal(storageState.sqlAvailable, false);
});
