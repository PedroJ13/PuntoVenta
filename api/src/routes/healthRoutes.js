import { dataResponse } from "../http/responses.js";

export function createHealthRoutes({ clock, storageStatus = () => ({ mode: "fake" }) }) {
  return [
    {
      method: "GET",
      path: "/api/health",
      handler: async () => {
        const storage = storageStatus();
        const storageDetails = {
          catalog: storage.catalog || storage.mode,
          openAccounts: storage.openAccounts || storage.mode,
          cashShifts: storage.cashShifts || storage.mode,
          sales: storage.sales || storage.mode,
          reports: storage.reports || storage.mode,
          sqlConfigured: Boolean(storage.sqlConfigured),
          sqlAvailable: Boolean(storage.sqlAvailable)
        };

        if (storage.sqlLastError) {
          storageDetails.sqlLastError = storage.sqlLastError;
        }

        return dataResponse({
          status: "ok",
          app: "PuntoVenta API",
          storage: storage.mode,
          storageDetails,
          timestamp: clock().toISOString()
        });
      }
    }
  ];
}
