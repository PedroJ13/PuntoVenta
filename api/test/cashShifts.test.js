import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFallbackCashShiftRepository } from "../src/repositories/fallbackCashShiftRepository.js";
import { createFakePuntoVentaRepositories } from "../src/repositories/fakePuntoVentaRepositories.js";
import { createTestApp, jsonRequest } from "./testApp.js";

test("cash shift current returns the open daily cash summary", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/cash-shifts/current?terminalId=1");

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.cashShiftId, 5);
  assert.equal(result.body.data.status, "open");
  assert.equal(result.body.data.openingCashAmount, 25000);
  assert.equal(result.body.data.expectedCashAmount, 25000);
});

test("cash shift can be opened when terminal has no open shift", async () => {
  const app = createApp({
    repositories: createFakePuntoVentaRepositories({ cashShifts: [], initialOpenAccounts: [] })
  });

  const result = await jsonRequest(app, "/api/cash-shifts/open", {
    method: "POST",
    body: { terminalId: 1, openingCashAmount: 12500, note: "Apertura turno tarde" }
  });

  assert.equal(result.response.status, 201);
  assert.equal(result.body.data.cashShiftId, 6);
  assert.equal(result.body.data.status, "open");
  assert.equal(result.body.data.openingCashAmount, 12500);
  assert.equal(result.body.data.expectedCashAmount, 12500);
});

test("cash shift open rejects duplicate open shift and invalid opening amount", async () => {
  const app = createTestApp();

  const duplicate = await jsonRequest(app, "/api/cash-shifts/open", {
    method: "POST",
    body: { terminalId: 1, openingCashAmount: 10000 }
  });
  assert.equal(duplicate.response.status, 409);
  assert.equal(duplicate.body.error.code, "CONFLICT");

  const emptyApp = createApp({
    repositories: createFakePuntoVentaRepositories({ cashShifts: [], initialOpenAccounts: [] })
  });
  const invalidAmount = await jsonRequest(emptyApp, "/api/cash-shifts/open", {
    method: "POST",
    body: { terminalId: 1, openingCashAmount: -1 }
  });
  assert.equal(invalidAmount.response.status, 400);
  assert.equal(invalidAmount.body.error.code, "VALIDATION_ERROR");
});

test("cash movement validates reason and updates expected cash", async () => {
  const app = createTestApp();

  const missingReason = await jsonRequest(app, "/api/cash-shifts/5/movements", {
    method: "POST",
    user: "admin",
    body: { movementType: "cash_out", amount: 1000 }
  });
  assert.equal(missingReason.response.status, 400);
  assert.equal(missingReason.body.error.code, "VALIDATION_ERROR");

  const movement = await jsonRequest(app, "/api/cash-shifts/5/movements", {
    method: "POST",
    user: "admin",
    body: { movementType: "cash_out", amount: 1000, reason: "Compra menor" }
  });
  assert.equal(movement.response.status, 201);
  assert.equal(movement.body.data.signedAmount, -1000);

  const current = await jsonRequest(app, "/api/cash-shifts/current?terminalId=1", { user: "admin" });
  assert.equal(current.body.data.expectedCashAmount, 24000);
  assert.equal(current.body.data.manualMovements.length, 1);
});

test("cash close blocks open accounts, requires note on difference, and closes with arqueo", async () => {
  const app = createTestApp();

  const blocked = await jsonRequest(app, "/api/cash-shifts/5/close", {
    method: "POST",
    body: { countedCashAmount: 25000 }
  });
  assert.equal(blocked.response.status, 409);
  assert.equal(blocked.body.error.code, "INVALID_STATE");

  const cancelAccount = await jsonRequest(app, "/api/open-accounts/501", {
    method: "PATCH",
    body: { status: "cancelled", reason: "Sin consumo" }
  });
  assert.equal(cancelAccount.response.status, 200);

  const missingNote = await jsonRequest(app, "/api/cash-shifts/5/close", {
    method: "POST",
    body: { countedCashAmount: 24900 }
  });
  assert.equal(missingNote.response.status, 400);
  assert.equal(missingNote.body.error.code, "VALIDATION_ERROR");

  const closed = await jsonRequest(app, "/api/cash-shifts/5/close", {
    method: "POST",
    body: { countedCashAmount: 24900, notes: "Faltante revisado" }
  });
  assert.equal(closed.response.status, 200);
  assert.equal(closed.body.data.status, "closed");
  assert.equal(closed.body.data.expectedCashAmount, 25000);
  assert.equal(closed.body.data.countedCashAmount, 24900);
  assert.equal(closed.body.data.differenceAmount, -100);
});

test("checkout rejects payment when no open cash shift exists", async () => {
  const app = createApp({
    repositories: createFakePuntoVentaRepositories({ cashShifts: [], initialOpenAccounts: [] })
  });

  const result = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 1, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "cash", amount: 1808 }]
    }
  });

  assert.equal(result.response.status, 409);
  assert.equal(result.body.error.code, "SHIFT_REQUIRED");
});

test("cash shifts can be served by a configured primary repository", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories();
  const storageState = {
    mode: "fake",
    cashShifts: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async current() {
      return {
        cashShiftId: 801,
        terminalId: 1,
        status: "open",
        openingCashAmount: 10000,
        openedAt: "2026-06-22T12:00:00",
        openedByUserId: 2,
        openingNote: null,
        closedAt: null,
        closedByUserId: null,
        salesCount: 0,
        totalAmount: 0,
        payments: [],
        manualMovements: [],
        expectedCashAmount: 10000,
        countedCashAmount: null,
        differenceAmount: null,
        closingNote: null
      };
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      cashShifts: createFallbackCashShiftRepository({
        primary,
        fallback: fakeRepositories.cashShifts,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const result = await jsonRequest(app, "/api/cash-shifts/current?terminalId=1");

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.cashShiftId, 801);
  assert.equal(storageState.cashShifts, "sql-local");
  assert.equal(storageState.sqlAvailable, true);
});

test("cash shifts fall back to fake repository when primary storage fails", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories({ cashShifts: [], initialOpenAccounts: [] });
  const storageState = {
    mode: "fake",
    cashShifts: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async open() {
      throw new Error("local SQL unavailable");
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      cashShifts: createFallbackCashShiftRepository({
        primary,
        fallback: fakeRepositories.cashShifts,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const opened = await jsonRequest(app, "/api/cash-shifts/open", {
    method: "POST",
    body: { terminalId: 1, openingCashAmount: 12500, note: "Fallback apertura" }
  });

  assert.equal(opened.response.status, 201);
  assert.equal(opened.body.data.openingCashAmount, 12500);
  assert.equal(storageState.mode, "fake-fallback");
  assert.equal(storageState.cashShifts, "fake");
  assert.equal(storageState.sqlAvailable, false);
});

test("cash shifts keep SQL null current response without fake fallback", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories();
  const storageState = {
    mode: "fake",
    cashShifts: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async current() {
      return null;
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      cashShifts: createFallbackCashShiftRepository({
        primary,
        fallback: fakeRepositories.cashShifts,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const result = await jsonRequest(app, "/api/cash-shifts/current?terminalId=1");

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data, null);
  assert.equal(storageState.cashShifts, "sql-local");
  assert.equal(storageState.sqlAvailable, true);
});
