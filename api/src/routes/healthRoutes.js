import { dataResponse } from "../http/responses.js";

export function createHealthRoutes({ clock, storageStatus = () => ({ mode: "fake" }) }) {
  return [
    {
      method: "GET",
      path: "/api/health",
      handler: async () => {
        const storage = storageStatus();
        return dataResponse({
          status: "ok",
          app: "PuntoVenta API",
          storage: storage.mode,
          storageDetails: {
            catalog: storage.catalog || storage.mode,
            openAccounts: storage.openAccounts || storage.mode,
            cashShifts: storage.cashShifts || storage.mode,
            sales: storage.sales || storage.mode,
            reports: storage.reports || storage.mode,
            sqlConfigured: Boolean(storage.sqlConfigured),
            sqlAvailable: Boolean(storage.sqlAvailable)
          },
          timestamp: clock().toISOString()
        });
      }
    }
  ];
}
