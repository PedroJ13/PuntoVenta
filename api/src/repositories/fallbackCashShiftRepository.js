import { markSqlAvailable, markSqlFallback } from "./fallbackStorageState.js";

export function createFallbackCashShiftRepository({ primary, fallback, storageState }) {
  async function usePrimary(operation) {
    if (!primary) return { ok: false };

    try {
      const result = await operation(primary);
      markSqlAvailable(storageState, "cashShifts");
      return { ok: true, result };
    } catch (error) {
      if (error?.code && error?.status) throw error;
      markSqlFallback(storageState, "cashShifts", error);
      return { ok: false };
    }
  }

  return {
    async current(input) {
      const primaryResult = await usePrimary((repository) => repository.current(input));
      return primaryResult.ok ? primaryResult.result : fallback.current(input);
    },

    async get(input) {
      const primaryResult = await usePrimary((repository) => repository.get(input));
      return primaryResult.ok ? primaryResult.result : fallback.get(input);
    },

    async open(input) {
      const primaryResult = await usePrimary((repository) => repository.open(input));
      return primaryResult.ok ? primaryResult.result : fallback.open(input);
    },

    async addMovement(input) {
      const primaryResult = await usePrimary((repository) => repository.addMovement(input));
      return primaryResult.ok ? primaryResult.result : fallback.addMovement(input);
    },

    async close(input) {
      const primaryResult = await usePrimary((repository) => repository.close(input));
      return primaryResult.ok ? primaryResult.result : fallback.close(input);
    },

    findOpenShift(input) {
      return primary?.findOpenShift(input) ?? fallback.findOpenShift(input);
    },

    async summarizeShift(input) {
      const primaryResult = await usePrimary((repository) => repository.summarizeShift(input));
      return primaryResult.ok ? primaryResult.result : fallback.summarizeShift(input);
    }
  };
}
