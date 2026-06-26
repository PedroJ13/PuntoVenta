import { markSqlAvailable, markSqlFallback } from "./fallbackStorageState.js";

export function createFallbackCatalogRepository({ primary, fallback, storageState }) {
  async function usePrimary(operation) {
    if (!primary) return null;

    try {
      const result = await operation(primary);
      markSqlAvailable(storageState, "catalog");
      return result;
    } catch (error) {
      markSqlFallback(storageState, "catalog", error);
      return null;
    }
  }

  return {
    async listCategories(filters) {
      const sqlResult = await usePrimary((repository) => repository.listCategories(filters));
      return sqlResult ?? fallback.listCategories(filters);
    },

    async listItems(filters) {
      const sqlResult = await usePrimary((repository) => repository.listItems(filters));
      return sqlResult ?? fallback.listItems(filters);
    }
  };
}
