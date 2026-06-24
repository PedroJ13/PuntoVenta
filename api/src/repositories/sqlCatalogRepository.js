export function createSqlCatalogRepository({ sqlClient, companyTaxId }) {
  return {
    async listCategories({ active } = {}) {
      const params = [
        { name: "companyTaxId", value: companyTaxId },
        { name: "active", value: booleanToNullableBit(active) }
      ];

      return sqlClient.query(
        `
SELECT
    ca.id,
    ca.company_id AS companyId,
    ca.name,
    ca.sort_order AS sortOrder,
    CAST(ca.is_active AS bit) AS isActive
FROM dbo.categories ca
INNER JOIN dbo.companies c ON c.id = ca.company_id
WHERE c.tax_id = @companyTaxId
  AND (@active IS NULL OR ca.is_active = @active)
ORDER BY ca.sort_order, ca.name;
        `,
        params
      );
    },

    async listItems({ type = null, search = null, active = null } = {}) {
      const params = [
        { name: "companyTaxId", value: companyTaxId },
        { name: "type", value: type },
        { name: "search", value: search ? `%${search}%` : null },
        { name: "active", value: booleanToNullableBit(active) }
      ];

      return sqlClient.query(
        `
SELECT
    i.id,
    i.company_id AS companyId,
    i.category_id AS categoryId,
    i.item_type AS itemType,
    i.sku,
    i.barcode,
    i.name,
    i.description,
    i.base_unit AS baseUnit,
    i.sale_price AS salePrice,
    i.cost_amount AS costAmount,
    i.tax_rate AS taxRate,
    CAST(i.tracks_inventory AS bit) AS tracksInventory,
    i.stock_minimum AS stockMinimum,
    i.current_stock AS currentStock,
    CAST(i.is_favorite AS bit) AS isFavorite,
    CAST(i.is_active AS bit) AS isActive
FROM dbo.items i
INNER JOIN dbo.companies c ON c.id = i.company_id
WHERE c.tax_id = @companyTaxId
  AND (@type IS NULL OR i.item_type = @type)
  AND (@active IS NULL OR i.is_active = @active)
  AND (
      @search IS NULL
      OR i.name LIKE @search
      OR i.sku LIKE @search
      OR i.barcode LIKE @search
  )
ORDER BY i.is_favorite DESC, i.name;
        `,
        params
      );
    }
  };
}

function booleanToNullableBit(value) {
  if (value === true) return 1;
  if (value === false) return 0;
  return null;
}
