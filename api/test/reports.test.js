import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createFallbackReportRepository } from "../src/repositories/fallbackReportRepository.js";
import { createFakePuntoVentaRepositories } from "../src/repositories/fakePuntoVentaRepositories.js";
import { createTestApp, jsonRequest } from "./testApp.js";

test("reports summarize fake sales and aggregate by item", async () => {
  const app = createTestApp();
  await checkoutSeedSales(app);

  const summary = await jsonRequest(app, "/api/reports/sales-summary", { user: "admin" });
  assert.equal(summary.response.status, 200);
  assert.equal(summary.body.data.salesCount, 2);
  assert.equal(summary.body.data.subtotalAmount, 5050);
  assert.equal(summary.body.data.taxAmount, 657);
  assert.equal(summary.body.data.totalAmount, 5707);

  const byItem = await jsonRequest(app, "/api/reports/sales-by-item", { user: "admin" });
  assert.equal(byItem.response.status, 200);
  assert.equal(byItem.body.pagination.total, 2);
  assert.deepEqual(
    byItem.body.data.map((row) => ({ itemId: row.itemId, quantity: row.quantity, totalAmount: row.totalAmount })),
    [
      { itemId: 10, quantity: 1, totalAmount: 2091 },
      { itemId: 11, quantity: 2, totalAmount: 3616 }
    ]
  );
});

test("top-items orders fake sales by quantity", async () => {
  const app = createTestApp();
  await checkoutSeedSales(app);

  const result = await jsonRequest(app, "/api/reports/top-items?limit=1", { user: "admin" });

  assert.equal(result.response.status, 200);
  assert.equal(result.body.pagination.total, 1);
  assert.equal(result.body.data[0].itemId, 11);
  assert.equal(result.body.data[0].name, "Croissant mantequilla");
  assert.equal(result.body.data[0].quantity, 2);
});

test("cash shift report returns fake closure numbers", async () => {
  const app = createTestApp();
  await checkoutSeedSales(app);

  const result = await jsonRequest(app, "/api/reports/cash-shift/5", { user: "admin" });

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.cashShiftId, 5);
  assert.equal(result.body.data.openingCashAmount, 25000);
  assert.equal(result.body.data.salesCount, 2);
  assert.equal(result.body.data.totalAmount, 5707);
  assert.equal(result.body.data.expectedCashAmount, 30707);
});

test("low-stock report returns active items below minimum", async () => {
  const app = createTestApp();

  const result = await jsonRequest(app, "/api/reports/low-stock", { user: "admin" });

  assert.equal(result.response.status, 200);
  assert.equal(result.body.pagination.total, 1);
  assert.equal(result.body.data[0].itemId, 11);
  assert.equal(result.body.data[0].currentStock, 18);
  assert.equal(result.body.data[0].stockMinimum, 20);
  assert.equal(result.body.data[0].shortage, 2);
});

test("cashier without reports permission cannot read reports", async () => {
  const app = createTestApp();
  const result = await jsonRequest(app, "/api/reports/sales-summary");

  assert.equal(result.response.status, 403);
  assert.equal(result.body.error.code, "FORBIDDEN");
});

test("reports can be served by a configured primary repository", async () => {
  const repositories = createFakePuntoVentaRepositories();
  const app = createApp({
    repositories: {
      ...repositories,
      reports: {
        async salesSummary() {
          return {
            from: null,
            to: null,
            terminalId: null,
            salesCount: 1,
            subtotalAmount: 1000,
            discountAmount: 0,
            taxAmount: 130,
            totalAmount: 1130
          };
        }
      }
    }
  });

  const result = await jsonRequest(app, "/api/reports/sales-summary", { user: "admin" });

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.salesCount, 1);
  assert.equal(result.body.data.totalAmount, 1130);
});

test("reports fall back to fake repository when primary storage fails", async () => {
  const fallbackApp = createTestApp();
  await checkoutSeedSales(fallbackApp);

  const fallbackReports = {
    async salesSummary(input) {
      const result = await jsonRequest(fallbackApp, "/api/reports/sales-summary", { user: "admin" });
      assert.equal(input.companyId, 1);
      return result.body.data;
    }
  };
  const storageState = { mode: "sql-local", reports: "sql-local", sqlAvailable: true };
  const repositories = createFakePuntoVentaRepositories();
  const app = createApp({
    repositories: {
      ...repositories,
      reports: createFallbackReportRepository({
        primary: {
          async salesSummary() {
            throw new Error("SQL unavailable");
          }
        },
        fallback: fallbackReports,
        storageState
      })
    }
  });

  const result = await jsonRequest(app, "/api/reports/sales-summary", { user: "admin" });

  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.salesCount, 2);
  assert.equal(result.body.data.totalAmount, 5707);
  assert.equal(storageState.mode, "fake-fallback");
  assert.equal(storageState.reports, "fake");
  assert.equal(storageState.sqlAvailable, false);
});

async function checkoutSeedSales(app) {
  const accountSale = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    user: "admin",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      openAccountId: 501,
      payments: [{ paymentMethod: "cash", amount: 2091 }]
    }
  });
  assert.equal(accountSale.response.status, 201);

  const quickSale = await jsonRequest(app, "/api/sales/checkout", {
    method: "POST",
    user: "admin",
    body: {
      terminalId: 1,
      cashShiftId: 5,
      lines: [{ itemId: 11, quantity: 2, unitPrice: 1600, discountAmount: 0 }],
      payments: [{ paymentMethod: "cash", amount: 3616 }]
    }
  });
  assert.equal(quickSale.response.status, 201);
}
