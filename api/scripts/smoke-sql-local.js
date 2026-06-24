import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { sendNodeResponse, toWebRequest } from "../src/http/nodeAdapter.js";
import { createConfiguredPuntoVentaRepositories } from "../src/repositories/configuredPuntoVentaRepositories.js";

const port = Number.parseInt(process.env.PV_SMOKE_API_PORT || process.env.PORT || "7072", 10);
const host = process.env.PV_SMOKE_API_HOST || "127.0.0.1";
const httpTimeoutMs = Number.parseInt(process.env.PV_SMOKE_HTTP_TIMEOUT_MS || "60000", 10);
const skipWeb = process.env.PV_SMOKE_SKIP_WEB === "true";

const configured = createConfiguredPuntoVentaRepositories({ env: process.env });
const app = createApp({
  repositories: configured.repositories,
  storageStatus: configured.storageStatus
});

const server = createServer(async (nodeRequest, nodeResponse) => {
  if (nodeRequest.method === "OPTIONS") {
    sendCorsPreflight(nodeResponse);
    return;
  }

  const response = await app.handle(await toWebRequest(nodeRequest));
  await sendNodeResponse(nodeResponse, response);
});

try {
  await listen();
  log("server", { status: "listening", url: apiUrl("/api/health") });
  await runSmoke();
} finally {
  await closeServer();
}

async function runSmoke() {
  const context = {};

  await phase("health-initial", async () => {
    const health = await request("/api/health");
    assert(health.storageDetails?.sqlConfigured === true, "SQL local is not configured.");
    assertDoesNotLeakSqlConfig(health);
    context.healthInitial = health;
    return { storage: health.storage, storageDetails: health.storageDetails };
  });

  await phase("catalog", async () => {
    const [categories, items] = await Promise.all([
      request("/api/categories?active=true"),
      request("/api/items?active=true")
    ]);
    assert(categories.length > 0, "No SQL categories returned.");
    assert(items.length > 0, "No SQL items returned.");
    context.items = items;
    context.saleItem = pickSaleItem(items);
    return {
      categories: categories.length,
      items: items.length,
      saleItem: context.saleItem.name
    };
  });

  await phase("cash-shift", async () => {
    let cash = await request("/api/cash-shifts/current?terminalId=1");
    if (!cash) {
      cash = await request("/api/cash-shifts/open", {
        method: "POST",
        body: {
          terminalId: 1,
          openingCashAmount: 30000,
          note: "Smoke SQL local"
        }
      });
    }
    context.cashShift = cash;
    return {
      cashShiftId: cash.cashShiftId,
      status: cash.status,
      expectedCashAmount: cash.expectedCashAmount
    };
  });

  await phase("quick-sale-ticket", async () => {
    const total = totalFor(context.saleItem);
    const sale = await request("/api/sales/checkout", {
      method: "POST",
      body: {
        terminalId: 1,
        cashShiftId: context.cashShift.cashShiftId,
        customerId: null,
        lines: [
          {
            itemId: context.saleItem.id,
            quantity: 1,
            unitPrice: context.saleItem.salePrice,
            discountAmount: 0
          }
        ],
        payments: [{ paymentMethod: "cash", amount: total }]
      }
    });
    const ticket = await request(`/api/sales/${sale.saleId}/ticket`);
    assert(ticket.ticketNumber === sale.ticketNumber, "Quick sale ticket number mismatch.");
    context.quickSale = sale;
    return {
      saleId: sale.saleId,
      ticketNumber: ticket.ticketNumber,
      totalAmount: ticket.totalAmount
    };
  });

  await phase("open-account-sale-ticket", async () => {
    const account = await request("/api/open-accounts", {
      method: "POST",
      body: {
        terminalId: 1,
        cashShiftId: context.cashShift.cashShiftId,
        customerId: null,
        name: `Smoke cuenta ${Date.now()}`
      }
    });
    const withLine = await request(`/api/open-accounts/${account.id}/lines`, {
      method: "POST",
      body: {
        itemId: context.saleItem.id,
        quantity: 1,
        unitPrice: context.saleItem.salePrice,
        discountAmount: 0,
        notes: ""
      }
    });
    const sale = await request("/api/sales/checkout", {
      method: "POST",
      body: {
        terminalId: 1,
        cashShiftId: context.cashShift.cashShiftId,
        openAccountId: account.id,
        payments: [{ paymentMethod: "cash", amount: withLine.totals.totalAmount }]
      }
    });
    const ticket = await request(`/api/sales/${sale.saleId}/ticket`);
    assert(ticket.ticketNumber === sale.ticketNumber, "Open account ticket number mismatch.");
    context.accountSale = sale;
    return {
      accountId: account.id,
      saleId: sale.saleId,
      ticketNumber: ticket.ticketNumber,
      totalAmount: ticket.totalAmount
    };
  });

  await phase("reports", async () => {
    const [summary, salesByItem, topItems, lowStock, cash] = await Promise.all([
      request("/api/reports/sales-summary"),
      request("/api/reports/sales-by-item"),
      request("/api/reports/top-items?limit=5"),
      request("/api/reports/low-stock"),
      request(`/api/reports/cash-shift/${context.cashShift.cashShiftId}`)
    ]);
    assert(summary.salesCount >= 2, "Reports did not include smoke sales.");
    assert(salesByItem.length > 0, "sales-by-item report is empty.");
    assert(topItems.length > 0, "top-items report is empty.");
    return {
      salesCount: summary.salesCount,
      totalAmount: summary.totalAmount,
      salesByItem: salesByItem.length,
      topItems: topItems.length,
      lowStock: lowStock.length,
      cashExpected: cash.expectedCashAmount
    };
  });

  if (!skipWeb) {
    await phase("web-modules", async () => {
      const elements = installDom();
      const stateModule = await import("../../app/src/state.js");
      const ui = await import("../../app/src/ui.js");
      await stateModule.loadInitialState();
      ui.renderCashShift();
      await ui.refreshReports();
      const cashStatus = elements.get("#cash-status")?.textContent || "";
      const reportStatus = elements.get("#reports-status")?.textContent || "";
      assert(cashStatus.includes("SQL local"), "Web cash status did not show SQL local.");
      assert(reportStatus.includes("SQL local"), "Web reports status did not show SQL local.");
      return {
        cashStatus,
        reportStatus,
        reportSales: stateModule.state.reports.summary.salesCount
      };
    });
  }

  await phase("health-final", async () => {
    const health = await request("/api/health");
    const details = health.storageDetails || {};
    for (const key of ["catalog", "openAccounts", "cashShifts", "sales", "reports"]) {
      assert(details[key] === "sql-local", `storageDetails.${key} expected sql-local, got ${details[key]}.`);
    }
    assert(details.sqlAvailable === true, "storageDetails.sqlAvailable is not true.");
    assertDoesNotLeakSqlConfig(health);
    return { storage: health.storage, storageDetails: details };
  });
}

async function phase(name, fn) {
  const startedAt = Date.now();
  log(name, { status: "start" });
  try {
    const result = await fn();
    log(name, { status: "ok", ms: Date.now() - startedAt, ...result });
  } catch (error) {
    log(name, { status: "fail", ms: Date.now() - startedAt, error: sanitize(error.message) });
    throw error;
  }
}

async function request(path, { method = "GET", body, user = "admin" } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), httpTimeoutMs);
  try {
    const response = await fetch(apiUrl(path), {
      method,
      headers: {
        "content-type": "application/json",
        "x-pv-fake-user": user
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`${method} ${path} -> ${response.status} ${payload.error?.code || ""} ${payload.error?.message || ""}`);
    }
    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
}

function pickSaleItem(items) {
  const item =
    items.find((candidate) => candidate.itemType === "purchased_product" && candidate.salePrice !== null && candidate.isActive) ||
    items.find((candidate) => candidate.salePrice !== null && candidate.isActive);
  assert(item, "No saleable item found.");
  return item;
}

function totalFor(item) {
  return Math.round(item.salePrice * (1 + (item.taxRate || 0)));
}

function apiUrl(path) {
  return `http://${host}:${port}${path}`;
}

function listen() {
  return new Promise((resolve, reject) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        reject(new Error(`Smoke API port ${host}:${port} is already in use. Set PV_SMOKE_API_PORT to a free port.`));
        return;
      }
      reject(error);
    });
    server.listen(port, host, resolve);
  });
}

function closeServer() {
  return new Promise((resolve) => {
    if (!server.listening) {
      resolve();
      return;
    }
    server.close(resolve);
  });
}

function installDom() {
  const elements = new Map();
  global.document = {
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, makeElement(selector));
      }
      return elements.get(selector);
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {}
  };
  global.window = {
    localStorage: {
      getItem(key) {
        return key === "pvApiBaseUrl" ? `http://${host}:${port}` : null;
      },
      setItem() {},
      removeItem() {}
    }
  };
  return elements;
}

function makeElement(selector) {
  return {
    selector,
    textContent: "",
    innerHTML: "",
    value: "",
    disabled: false,
    className: "",
    title: "",
    children: [],
    addEventListener() {},
    closest() {
      return null;
    },
    classList: {
      add() {},
      remove() {},
      toggle() {}
    },
    showModal() {},
    close() {}
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDoesNotLeakSqlConfig(payload) {
  const text = JSON.stringify(payload);
  for (const pattern of ["Password", "PV_SQLSERVER_PASSWORD", "SQLEXPRESS", process.env.PV_SQLSERVER_DATABASE]) {
    if (pattern && text.includes(pattern)) {
      throw new Error("Health payload exposes SQL local configuration.");
    }
  }
}

function sendCorsPreflight(nodeResponse) {
  nodeResponse.statusCode = 204;
  nodeResponse.setHeader("access-control-allow-origin", "*");
  nodeResponse.setHeader("access-control-allow-methods", "GET,POST,PATCH,DELETE,OPTIONS");
  nodeResponse.setHeader("access-control-allow-headers", "content-type,x-pv-fake-user");
  nodeResponse.end();
}

function log(phaseName, details) {
  console.log(JSON.stringify({ phase: phaseName, ...details }));
}

function sanitize(message) {
  return String(message).replace(/Password=[^;\r\n]+/gi, "Password=<redacted>");
}
