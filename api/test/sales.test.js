import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFallbackSalesRepository } from "../src/repositories/fallbackSalesRepository.js";
import { createFakePuntoVentaRepositories } from "../src/repositories/fakePuntoVentaRepositories.js";
import { createTestApp, jsonRequest } from "./testApp.js";

test("checkout can charge an existing open account and generate a paid sale", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      openAccountId: 501,
      payments: [{ paymentMethod: "cash", amount: 2091, reference: null }]
    }
  });

  assert.equal(result.response.status, 201);
  assert.equal(result.body.data.saleId, 1001);
  assert.equal(result.body.data.ticketNumber, "PV-0001001");
  assert.equal(result.body.data.status, "paid");
  assert.equal(result.body.data.taxAmount, 241);
  assert.equal(result.body.data.totalAmount, 2091);
  assertIntegerMoney(result.body.data);
});

test("checkout can charge a quick sale with payload lines", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 1, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "card", amount: 1808, reference: "AUTH-123" }]
    }
  });

  assert.equal(result.response.status, 201);
  assert.equal(result.body.data.subtotalAmount, 1600);
  assert.equal(result.body.data.taxAmount, 208);
  assert.equal(result.body.data.totalAmount, 1808);
});

test("checkout rejects payments that do not match total", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 1, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "cash", amount: 1000 }]
    }
  });

  assert.equal(result.response.status, 400);
  assert.equal(result.body.error.code, "VALIDATION_ERROR");
});

test("checkout rejects simulated insufficient stock", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 99, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "cash", amount: 178992 }]
    }
  });

  assert.equal(result.response.status, 409);
  assert.equal(result.body.error.code, "INSUFFICIENT_STOCK");
});

test("checkout rejects invalid open account", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      openAccountId: 9999,
      payments: [{ paymentMethod: "cash", amount: 1 }]
    }
  });

  assert.equal(result.response.status, 404);
  assert.equal(result.body.error.code, "NOT_FOUND");
});

test("ticket endpoint returns MVP ticket payload and NOT_FOUND for missing sale", async () => {
  const app = createTestApp();

  const checkout = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 1, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "transfer", amount: 1808, reference: "SINPE-1" }]
    }
  });
  const saleId = checkout.body.data.saleId;

  const ticket = await jsonRequest(app, `/api/sales/${saleId}/ticket`);
  assert.equal(ticket.response.status, 200);
  assert.equal(ticket.body.data.ticketNumber, "PV-0001001");
  assert.equal(ticket.body.data.businessName, "Cafeteria Central");
  assert.equal(ticket.body.data.terminalName, "Caja 1");
  assert.equal(ticket.body.data.cashierName, "Cajero Demo");
  assert.equal(ticket.body.data.footerNote, "Comprobante interno - no es factura electronica");
  assert.equal(ticket.body.data.payments[0].paymentMethod, "transfer");
  assertIntegerMoney(ticket.body.data);
  assertIntegerMoney(ticket.body.data.lines[0]);
  assertIntegerMoney(ticket.body.data.payments[0]);

  const missing = await jsonRequest(app, "/api/sales/9999/ticket");
  assert.equal(missing.response.status, 404);
  assert.equal(missing.body.error.code, "NOT_FOUND");
});

test("ticket for prepared item keeps CRC amounts as integers after tax rounding", async () => {
  const app = createTestApp();

  const checkout = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      openAccountId: 501,
      payments: [{ paymentMethod: "cash", amount: 2091 }]
    }
  });
  const ticket = await jsonRequest(app, `/api/sales/${checkout.body.data.saleId}/ticket`);

  assert.equal(checkout.response.status, 201);
  assert.equal(checkout.body.data.subtotalAmount, 1850);
  assert.equal(checkout.body.data.taxAmount, 241);
  assert.equal(checkout.body.data.totalAmount, 2091);
  assert.equal(ticket.body.data.taxAmount, 241);
  assert.equal(ticket.body.data.totalAmount, 2091);
  assertIntegerMoney(checkout.body.data);
  assertIntegerMoney(ticket.body.data);
  assertIntegerMoney(ticket.body.data.lines[0]);
});

test("checkout can be served by a configured primary sales repository", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories();
  const storageState = {
    mode: "fake",
    sales: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async checkout() {
      return {
        saleId: 801,
        ticketNumber: "PV-0000801",
        status: "paid",
        subtotalAmount: 1000,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 1000,
        paidAt: "2026-06-22T12:00:00"
      };
    },
    async getTicket() {
      return {
        ticketNumber: "PV-0000801",
        status: "paid",
        businessName: "PuntoVenta Demo Local",
        paidAt: "2026-06-22T12:00:00",
        terminalName: "Caja Principal",
        cashierName: "Cajero Demo Local",
        accountName: null,
        lines: [],
        subtotalAmount: 1000,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 1000,
        payments: [{ paymentMethod: "cash", amount: 1000, reference: null }],
        footerNote: "Comprobante interno - no es factura electronica"
      };
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      sales: createFallbackSalesRepository({
        primary,
        fallback: fakeRepositories.sales,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const checkout = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 1, unitPrice: 1000, discountAmount: 0 }],
      payments: [{ paymentMethod: "cash", amount: 1000 }]
    }
  });
  const ticket = await jsonRequest(app, "/api/sales/801/ticket");

  assert.equal(checkout.response.status, 201);
  assert.equal(checkout.body.data.saleId, 801);
  assert.equal(ticket.response.status, 200);
  assert.equal(ticket.body.data.ticketNumber, "PV-0000801");
  assert.equal(storageState.sales, "sql-local");
  assert.equal(storageState.sqlAvailable, true);
});

test("checkout falls back to fake sales repository when primary storage fails", async () => {
  const fakeRepositories = createFakePuntoVentaRepositories();
  const storageState = {
    mode: "fake",
    sales: "fake",
    sqlConfigured: true,
    sqlAvailable: false
  };
  const primary = {
    async checkout() {
      throw new Error("local SQL unavailable");
    }
  };
  const app = createApp({
    repositories: {
      ...fakeRepositories,
      sales: createFallbackSalesRepository({
        primary,
        fallback: fakeRepositories.sales,
        storageState
      })
    },
    storageStatus: () => ({ ...storageState })
  });

  const checkout = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 1, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "cash", amount: 1808 }]
    }
  });

  assert.equal(checkout.response.status, 201);
  assert.equal(checkout.body.data.saleId, 1001);
  assert.equal(storageState.mode, "fake-fallback");
  assert.equal(storageState.sales, "fake");
  assert.equal(storageState.sqlAvailable, false);
});

function assertIntegerMoney(payload) {
  for (const [key, value] of Object.entries(payload)) {
    if (key.endsWith("Amount") || key === "amount" || key === "unitPrice" || key === "lineTotal") {
      assert.equal(Number.isInteger(value), true, `${key} should be an integer CRC amount`);
    }
  }
}
