export function createFallbackCatalogRepository({ primary, fallback, storageState }) {
  async function usePrimary(operation) {
    if (!primary) return null;

    try {
      const result = await operation(primary);
      storageState.mode = "sql-local";
      storageState.catalog = "sql-local";
      storageState.sqlAvailable = true;
      return result;
    } catch {
      storageState.mode = "fake-fallback";
      storageState.catalog = "fake";
      storageState.sqlAvailable = false;
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
