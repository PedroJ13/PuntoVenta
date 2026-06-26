import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFakeCatalogRepository } from "../src/repositories/fakeCatalogRepository.js";

test("GET /api/health returns local fake storage status", async () => {
  const app = createApp({
    clock: () => new Date("2026-06-21T12:00:00Z"),
    repositories: {
      catalog: createFakeCatalogRepository()
    }
  });

  const response = await app.handle(new Request("http://local.test/api/health"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    data: {
      status: "ok",
      app: "PuntoVenta API",
      storage: "fake",
      storageDetails: {
        catalog: "fake",
        openAccounts: "fake",
        cashShifts: "fake",
        sales: "fake",
        reports: "fake",
        sqlConfigured: false,
        sqlAvailable: false
      },
      timestamp: "2026-06-21T12:00:00.000Z"
    }
  });
});

test("GET /api/health returns configured storage details without secrets", async () => {
  const app = createApp({
    clock: () => new Date("2026-06-21T12:00:00Z"),
    storageStatus: () => ({
      mode: "sql-local",
      catalog: "sql-local",
      openAccounts: "sql-local",
      cashShifts: "sql-local",
      sales: "sql-local",
      reports: "sql-local",
      sqlConfigured: true,
      sqlAvailable: true
    }),
    repositories: {
      catalog: createFakeCatalogRepository()
    }
  });

  const response = await app.handle(new Request("http://local.test/api/health"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.storage, "sql-local");
  assert.deepEqual(body.data.storageDetails, {
    catalog: "sql-local",
    openAccounts: "sql-local",
    cashShifts: "sql-local",
    sales: "sql-local",
    reports: "sql-local",
    sqlConfigured: true,
    sqlAvailable: true
  });
  assert.equal(JSON.stringify(body).includes("Password"), false);
  assert.equal(JSON.stringify(body).includes("localhost"), false);
});

test("GET /api/health refreshes SQL storage state before responding", async () => {
  const storageState = {
    mode: "fake",
    catalog: "fake",
    openAccounts: "fake",
    cashShifts: "fake",
    sales: "fake",
    reports: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };

  const app = createApp({
    clock: () => new Date("2026-06-21T12:00:00Z"),
    storageStatus: () => ({ ...storageState }),
    storageHealthCheck: async () => {
      storageState.mode = "sql-local";
      storageState.catalog = "sql-local";
      storageState.openAccounts = "sql-local";
      storageState.cashShifts = "sql-local";
      storageState.sales = "sql-local";
      storageState.reports = "sql-local";
      storageState.sqlAvailable = true;
    },
    repositories: {
      catalog: createFakeCatalogRepository()
    }
  });

  const response = await app.handle(new Request("http://local.test/api/health"));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.storage, "sql-local");
  assert.deepEqual(body.data.storageDetails, {
    catalog: "sql-local",
    openAccounts: "sql-local",
    cashShifts: "sql-local",
    sales: "sql-local",
    reports: "sql-local",
    sqlConfigured: true,
    sqlAvailable: true
  });
});

test("unknown routes return standard NOT_FOUND error", async () => {
  const app = createApp({
    repositories: {
      catalog: createFakeCatalogRepository()
    }
  });

  const response = await app.handle(new Request("http://local.test/api/missing"));
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error.code, "NOT_FOUND");
});
