export function createFallbackSalesRepository({ primary, fallback, storageState }) {
  async function usePrimary(operation) {
    if (!primary) return { ok: false };

    try {
      const result = await operation(primary);
      storageState.mode = "sql-local";
      storageState.sales = "sql-local";
      storageState.sqlAvailable = true;
      return { ok: true, result };
    } catch (error) {
      if (error?.code && error?.status) throw error;
      storageState.mode = "fake-fallback";
      storageState.sales = "fake";
      storageState.sqlAvailable = false;
      return { ok: false };
    }
  }

  return {
    async checkout(input) {
      const primaryResult = await usePrimary((repository) => repository.checkout(input));
      return primaryResult.ok ? primaryResult.result : fallback.checkout(input);
    },

    async getTicket(input) {
      const primaryResult = await usePrimary((repository) => repository.getTicket(input));
      return primaryResult.ok ? primaryResult.result : fallback.getTicket(input);
    }
  };
}
