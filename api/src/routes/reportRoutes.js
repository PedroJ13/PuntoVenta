import { requirePermission } from "../auth/fakeAuth.js";
import { dataResponse, listResponse } from "../http/responses.js";

export function createReportRoutes({ reportRepository }) {
  return [
    {
      method: "GET",
      path: "/api/reports/sales-summary",
      handler: async ({ auth, url }) => {
        requirePermission(auth, "reports.read");
        return dataResponse(await reportRepository.salesSummary(buildReportQuery(auth, url)));
      }
    },
    {
      method: "GET",
      path: "/api/reports/sales-by-item",
      handler: async ({ auth, url }) => {
        requirePermission(auth, "reports.read");
        const query = buildReportQuery(auth, url);
        const rows = await reportRepository.salesByItem(query);
        return listResponse(rows, { limit: query.limit, offset: 0, total: rows.length });
      }
    },
    {
      method: "GET",
      path: "/api/reports/top-items",
      handler: async ({ auth, url }) => {
        requirePermission(auth, "reports.read");
        const query = buildReportQuery(auth, url, 10);
        const rows = await reportRepository.topItems(query);
        return listResponse(rows, { limit: query.limit, offset: 0, total: rows.length });
      }
    },
    {
      method: "GET",
      path: "/api/reports/low-stock",
      handler: async ({ auth, url }) => {
        requirePermission(auth, "reports.read");
        const limit = parseLimit(url.searchParams.get("limit"), 50);
        const rows = await reportRepository.lowStock({ companyId: auth.companyId, limit });
        return listResponse(rows, { limit, offset: 0, total: rows.length });
      }
    },
    {
      method: "GET",
      path: "/api/reports/cash-shift/{shiftId}",
      handler: async ({ auth, params }) => {
        requirePermission(auth, "reports.read");
        return dataResponse(await reportRepository.cashShift({ companyId: auth.companyId, shiftId: params.shiftId }));
      }
    }
  ];
}

function buildReportQuery(auth, url, defaultLimit = 50) {
  return {
    companyId: auth.companyId,
    from: normalizeDate(url.searchParams.get("from"), "from"),
    to: normalizeDate(url.searchParams.get("to"), "to"),
    terminalId: normalizeOptionalInt(url.searchParams.get("terminalId")),
    limit: parseLimit(url.searchParams.get("limit"), defaultLimit)
  };
}

function normalizeDate(value, field) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const error = new Error("Invalid report date.");
    error.code = "VALIDATION_ERROR";
    error.publicMessage = "One or more fields are invalid.";
    error.status = 400;
    error.details = [{ field, message: "Invalid ISO date." }];
    throw error;
  }
  return date.toISOString();
}

function normalizeOptionalInt(value) {
  if (!value) return null;
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function parseLimit(value, defaultLimit) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) return defaultLimit;
  return Math.min(number, 100);
}
