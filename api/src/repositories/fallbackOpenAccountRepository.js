export function createFallbackOpenAccountRepository({ primary, fallback, storageState }) {
  async function usePrimary(operation) {
    if (!primary) return null;

    try {
      const result = await operation(primary);
      storageState.mode = "sql-local";
      storageState.openAccounts = "sql-local";
      storageState.sqlAvailable = true;
      return result;
    } catch (error) {
      if (error?.code && error?.status) throw error;
      storageState.mode = "fake-fallback";
      storageState.openAccounts = "fake";
      storageState.sqlAvailable = false;
      return null;
    }
  }

  return {
    async list(filters) {
      const sqlResult = await usePrimary((repository) => repository.list(filters));
      return sqlResult ?? fallback.list(filters);
    },

    async create(input) {
      const sqlResult = await usePrimary((repository) => repository.create(input));
      return sqlResult ?? fallback.create(input);
    },

    async get(input) {
      const sqlResult = await usePrimary((repository) => repository.get(input));
      return sqlResult ?? fallback.get(input);
    },

    async update(input) {
      const sqlResult = await usePrimary((repository) => repository.update(input));
      return sqlResult ?? fallback.update(input);
    },

    async addLine(input) {
      const sqlResult = await usePrimary((repository) => repository.addLine(input));
      return sqlResult ?? fallback.addLine(input);
    },

    async updateLine(input) {
      const sqlResult = await usePrimary((repository) => repository.updateLine(input));
      return sqlResult ?? fallback.updateLine(input);
    },

    async removeLine(input) {
      const sqlResult = await usePrimary((repository) => repository.removeLine(input));
      return sqlResult ?? fallback.removeLine(input);
    },

    async markPaid(input) {
      const sqlResult = await usePrimary((repository) => repository.markPaid(input));
      return sqlResult ?? fallback.markPaid(input);
    }
  };
}
