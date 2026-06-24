export const fakeCategories = [
  { id: 1, companyId: 1, name: "Cafe", sortOrder: 10, isActive: true },
  { id: 2, companyId: 1, name: "Panaderia", sortOrder: 20, isActive: true },
  { id: 3, companyId: 1, name: "Materia prima", sortOrder: 30, isActive: true },
  { id: 4, companyId: 1, name: "Archivada", sortOrder: 99, isActive: false }
];

export const fakeItems = [
  {
    id: 10,
    companyId: 1,
    categoryId: 1,
    itemType: "prepared_product",
    sku: "CAF-003",
    barcode: null,
    name: "Capuchino",
    baseUnit: "unit",
    salePrice: 1850,
    taxRate: 0.13,
    currentStock: 0,
    stockMinimum: 0,
    isActive: true
  },
  {
    id: 11,
    companyId: 1,
    categoryId: 2,
    itemType: "purchased_product",
    sku: "PAN-010",
    barcode: null,
    name: "Croissant mantequilla",
    baseUnit: "unit",
    salePrice: 1600,
    taxRate: 0.13,
    currentStock: 18,
    stockMinimum: 20,
    isActive: true
  },
  {
    id: 21,
    companyId: 1,
    categoryId: 3,
    itemType: "raw_material",
    sku: "MAT-CAFE",
    barcode: null,
    name: "Cafe en grano",
    baseUnit: "g",
    salePrice: null,
    taxRate: 0,
    currentStock: 7350,
    stockMinimum: 2500,
    isActive: true
  },
  {
    id: 99,
    companyId: 1,
    categoryId: 2,
    itemType: "purchased_product",
    sku: "OLD-001",
    barcode: null,
    name: "Producto archivado",
    baseUnit: "unit",
    salePrice: 1,
    taxRate: 0,
    currentStock: 0,
    stockMinimum: 0,
    isActive: false
  }
];

export const fakeRecipes = [
  {
    id: 300,
    companyId: 1,
    outputItemId: 10,
    name: "Capuchino",
    isActive: true,
    ingredients: [{ ingredientItemId: 21, quantity: 18, unit: "g" }]
  }
];
