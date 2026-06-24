import { listResponse } from "../http/responses.js";

export function createCatalogRoutes({ catalogRepository }) {
  return [
    {
      method: "GET",
      path: "/api/categories",
      handler: async ({ url }) => {
        const active = parseBooleanQuery(url.searchParams.get("active"));
        const categories = await catalogRepository.listCategories({ active });
        return listResponse(categories, {
          limit: categories.length,
          offset: 0,
          total: categories.length
        });
      }
    },
    {
      method: "GET",
      path: "/api/items",
      handler: async ({ url }) => {
        const filters = {
          type: emptyToNull(url.searchParams.get("type")),
          search: emptyToNull(url.searchParams.get("search")),
          active: parseBooleanQuery(url.searchParams.get("active"))
        };
        const items = await catalogRepository.listItems(filters);
        return listResponse(items, {
          limit: items.length,
          offset: 0,
          total: items.length
        });
      }
    }
  ];
}

function emptyToNull(value) {
  return value && value.trim() ? value.trim() : null;
}

function parseBooleanQuery(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}
