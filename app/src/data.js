export const business = {
  name: "Cafeteria Central",
  terminalId: 1,
  cashShiftId: 5,
  terminalName: "Caja 1",
  cashierName: "Cajero Demo",
  shiftBase: 25000,
  taxRate: 0.13,
  paymentMethods: ["Efectivo", "Tarjeta", "SINPE"]
};

export const products = [
  { id: "exp", name: "Espresso", category: "Cafe", price: 950, type: "Preparado", code: "CAF-001" },
  { id: "ame", name: "Americano", category: "Cafe", price: 1200, type: "Preparado", code: "CAF-002" },
  { id: "cap", name: "Capuchino", category: "Cafe", price: 1850, type: "Preparado", code: "CAF-003" },
  { id: "lat", name: "Latte vainilla", category: "Cafe", price: 2100, type: "Preparado", code: "CAF-004" },
  { id: "cro", name: "Croissant mantequilla", category: "Panaderia", price: 1600, type: "Comprado", code: "PAN-010" },
  { id: "que", name: "Queque zanahoria", category: "Panaderia", price: 1900, type: "Preparado", code: "PAN-014" },
  { id: "bot", name: "Agua botella", category: "Bebidas", price: 900, type: "Comprado", code: "BEB-021" },
  { id: "jugo", name: "Jugo naranja", category: "Bebidas", price: 1500, type: "Comprado", code: "BEB-022" },
  { id: "emp", name: "Emparedado pollo", category: "Comida", price: 2800, type: "Preparado", code: "COM-033" },
  { id: "dep", name: "Deposito envase", category: "Depositos", price: 500, type: "Deposito", code: "DEP-001" }
];

export const inventory = [
  { name: "Cafe en grano", unit: "g", stock: 7350, min: 2500, cost: 8.6 },
  { name: "Leche entera", unit: "ml", stock: 18200, min: 8000, cost: 1.2 },
  { name: "Vasos 8 oz", unit: "und", stock: 86, min: 100, cost: 42 },
  { name: "Tapas 8 oz", unit: "und", stock: 92, min: 100, cost: 28 },
  { name: "Harina", unit: "g", stock: 4200, min: 3000, cost: 1.1 },
  { name: "Azucar", unit: "g", stock: 1600, min: 2500, cost: 0.9 },
  { name: "Pollo preparado", unit: "g", stock: 3100, min: 1200, cost: 5.4 }
];

export const recipes = [
  {
    product: "Espresso",
    cost: 86,
    margin: "91%",
    ingredients: ["Cafe en grano: 10 g", "Vaso pequeno: 1 und"]
  },
  {
    product: "Americano",
    cost: 96,
    margin: "92%",
    ingredients: ["Cafe en grano: 10 g", "Agua caliente: 180 ml", "Vaso 8 oz: 1 und", "Tapa 8 oz: 1 und"]
  },
  {
    product: "Capuchino",
    cost: 232,
    margin: "87%",
    ingredients: ["Cafe en grano: 10 g", "Leche entera: 150 ml", "Vaso 8 oz: 1 und", "Tapa 8 oz: 1 und"]
  },
  {
    product: "Emparedado pollo",
    cost: 1160,
    margin: "59%",
    ingredients: ["Pan artesanal: 1 und", "Pollo preparado: 120 g", "Empaque: 1 und"]
  }
];

export const initialAccounts = [
  { id: "a1", name: "Mostrador 1", lines: [] },
  { id: "a2", name: "Cliente Laura", lines: [{ productId: "cap", qty: 2 }, { productId: "cro", qty: 1 }] },
  { id: "a3", name: "Para llevar", lines: [{ productId: "ame", qty: 1 }] }
];
