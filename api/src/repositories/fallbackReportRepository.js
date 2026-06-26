import { markSqlAvailable, markSqlFallback } from "./fallbackStorageState.js";

export function createFallbackReportRepository({ primary, fallback, storageState }) {
  async function usePrimary(operation) {
    if (!primary) return { ok: false };

    try {
      const result = await operation(primary);
      markSqlAvailable(storageState, "reports");
      return { ok: true, result };
    } catch (error) {
      if (error?.code && error?.status) throw error;
      markSqlFallback(storageState, "reports", error);
      return { ok: false };
    }
  }

  return {
    async salesSummary(input) {
      const primaryResult = await usePrimary((repository) => repository.salesSummary(input));
      return primaryResult.ok ? primaryResult.result : fallback.salesSummary(input);
    },

    async salesByItem(input) {
      const primaryResult = await usePrimary((repository) => repository.salesByItem(input));
      return primaryResult.ok ? primaryResult.result : fallback.salesByItem(input);
    },

    async topItems(input) {
      const primaryResult = await usePrimary((repository) => repository.topItems(input));
      return primaryResult.ok ? primaryResult.result : fallback.topItems(input);
    },

    async lowStock(input) {
      const primaryResult = await usePrimary((repository) => repository.lowStock(input));
      return primaryResult.ok ? primaryResult.result : fallback.lowStock(input);
    },

    async cashShift(input) {
      const primaryResult = await usePrimary((repository) => repository.cashShift(input));
      return primaryResult.ok ? primaryResult.result : fallback.cashShift(input);
    }
  };
}
