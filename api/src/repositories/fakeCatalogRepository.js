import { fakeCategories, fakeItems } from "../testDoubles/fakeCatalogData.js";

export function createFakeCatalogRepository({ categories = fakeCategories, items = fakeItems } = {}) {
  return {
    async listCategories({ active } = {}) {
      return categories.filter((category) => active === null || active === undefined || category.isActive === active);
    },

    async listItems({ type = null, search = null, active = null } = {}) {
      const normalizedSearch = search?.toLowerCase();
      return items.filter((item) => {
        const matchesType = !type || item.itemType === type;
        const matchesActive = active === null || active === undefined || item.isActive === active;
        const matchesSearch =
          !normalizedSearch ||
          `${item.name} ${item.sku} ${item.barcode || ""}`.toLowerCase().includes(normalizedSearch);

        return matchesType && matchesActive && matchesSearch;
      });
    }
  };
}
