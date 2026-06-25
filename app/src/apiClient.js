export const localApiBaseUrl = "http://127.0.0.1:7071";
export const pilotApiBaseUrl = "https://func-puntoventa-pilot-eastus2.azurewebsites.net";

const pilotWebHosts = new Set(["gray-beach-00a0f870f.7.azurestaticapps.net"]);
const fakeUserHeader = "cashier";

export class ApiUnavailableError extends Error {
  constructor(message = "Local API is unavailable.") {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

export function resolveApiBaseUrl({
  baseUrl = localApiBaseUrl,
  config = globalThis.window?.PUNTO_VENTA_CONFIG,
  location = globalThis.window?.location,
  storage = globalThis.window?.localStorage
} = {}) {
  const overrideBaseUrl = storage?.getItem("pvApiBaseUrl");
  if (overrideBaseUrl) return overrideBaseUrl;

  if (config?.apiBaseUrl) return config.apiBaseUrl;
  if (pilotWebHosts.has(location?.hostname)) return pilotApiBaseUrl;

  return baseUrl;
}

export function createApiClient({ baseUrl = localApiBaseUrl } = {}) {
  const apiBaseUrl = resolveApiBaseUrl({ baseUrl });

  async function request(path, { method = "GET", body, user = fakeUserHeader } = {}) {
    let response;
    try {
      response = await fetch(`${apiBaseUrl}${path}`, {
        method,
        headers: {
          "content-type": "application/json",
          "x-pv-fake-user": user
        },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch (error) {
      throw new ApiUnavailableError(error.message);
    }

    const payload = await response.json();
    if (!response.ok) {
      const apiError = new Error(toUserMessage(payload.error));
      apiError.code = payload.error?.code || "API_ERROR";
      apiError.details = payload.error?.details || [];
      apiError.status = response.status;
      throw apiError;
    }

    return payload.data;
  }

  return {
    apiBaseUrl,
    health: () => request("/api/health"),
    listCategories: () => request("/api/categories?active=true"),
    listItems: () => request("/api/items?active=true"),
    listOpenAccounts: () => request("/api/open-accounts"),
    getOpenAccount: (accountId) => request(`/api/open-accounts/${accountId}`),
    createOpenAccount: (payload) => request("/api/open-accounts", { method: "POST", body: payload }),
    renameOpenAccount: (accountId, name) => request(`/api/open-accounts/${accountId}`, { method: "PATCH", body: { name } }),
    cancelOpenAccount: (accountId, reason) =>
      request(`/api/open-accounts/${accountId}`, { method: "PATCH", body: { status: "cancelled", reason } }),
    addLine: (accountId, payload) => request(`/api/open-accounts/${accountId}/lines`, { method: "POST", body: payload }),
    updateLine: (accountId, lineId, payload) =>
      request(`/api/open-accounts/${accountId}/lines/${lineId}`, { method: "PATCH", body: payload }),
    removeLine: (accountId, lineId) => request(`/api/open-accounts/${accountId}/lines/${lineId}`, { method: "DELETE" }),
    checkout: (payload) => request("/api/sales/checkout", { method: "POST", body: payload }),
    getTicket: (saleId) => request(`/api/sales/${saleId}/ticket`),
    getCurrentCashShift: (terminalId = 1) => request(`/api/cash-shifts/current?terminalId=${terminalId}`),
    getCashShift: (shiftId) => request(`/api/cash-shifts/${shiftId}`),
    openCashShift: (payload) => request("/api/cash-shifts/open", { method: "POST", body: payload }),
    addCashMovement: (shiftId, payload) =>
      request(`/api/cash-shifts/${shiftId}/movements`, { method: "POST", body: payload, user: "admin" }),
    closeCashShift: (shiftId, payload) =>
      request(`/api/cash-shifts/${shiftId}/close`, { method: "POST", body: payload }),
    getSalesSummary: () => request("/api/reports/sales-summary", { user: "admin" }),
    getSalesByItem: () => request("/api/reports/sales-by-item", { user: "admin" }),
    getTopItems: () => request("/api/reports/top-items?limit=5", { user: "admin" }),
    getLowStock: () => request("/api/reports/low-stock", { user: "admin" }),
    getCashShiftReport: (shiftId) => request(`/api/reports/cash-shift/${shiftId}`, { user: "admin" })
  };
}

function toUserMessage(error = {}) {
  if (error.code === "SHIFT_REQUIRED") return "Abre caja antes de cobrar.";
  if (error.code === "INSUFFICIENT_STOCK") return "No hay inventario suficiente para completar la venta.";
  if (error.code === "INVALID_STATE") {
    const detail = error.details?.[0]?.message || "";
    if (detail.toLowerCase().includes("open accounts")) {
      return "Cobra, cancela o cierra las cuentas abiertas antes de cerrar caja.";
    }
    return "El estado actual no permite completar la accion.";
  }
  if (error.code === "NOT_FOUND") return "No se encontro el registro solicitado. Actualiza la vista e intenta de nuevo.";
  if (error.code === "VALIDATION_ERROR") return error.details?.[0]?.message || "Revisa los datos ingresados.";
  if (error.code === "FORBIDDEN") return "El usuario actual no tiene permiso para esta accion.";
  if (error.code === "UNAUTHORIZED") return "La sesion local no esta activa.";
  return error.message || "No se pudo completar la accion.";
}
