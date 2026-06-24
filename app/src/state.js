import { createApiClient } from "./apiClient.js";
import { business, initialAccounts, inventory, products as localProducts } from "./data.js";

export const apiClient = createApiClient();

export const state = {
  api: {
    connected: false,
    error: null,
    storage: "fake",
    storageDetails: {}
  },
  accounts: structuredClone(initialAccounts),
  categories: [],
  products: structuredClone(localProducts),
  activeAccountId: initialAccounts[0].id,
  activeCategory: "Todos",
  activePayment: business.paymentMethods[0],
  cashShift: createFallbackCashShift(),
  cashMessage: null,
  lastTicket: null,
  reports: createEmptyReports(),
  searchTerm: ""
};

export function getActiveAccount() {
  return state.accounts.find((account) => account.id === state.activeAccountId);
}

export function getProduct(productId) {
  return state.products.find((product) => product.id === String(productId));
}

export function getCategories() {
  return ["Todos", ...new Set(state.products.map((product) => product.category))];
}

export function getVisibleProducts() {
  const search = state.searchTerm.trim().toLowerCase();
  return state.products.filter((product) => {
    const matchesCategory = state.activeCategory === "Todos" || product.category === state.activeCategory;
    const matchesSearch = `${product.name} ${product.code}`.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
}

export function calculateTotals(account = getActiveAccount()) {
  if (account.totals) {
    return {
      subtotal: account.totals.subtotalAmount,
      discount: account.totals.discountAmount || 0,
      tax: account.totals.taxAmount,
      total: account.totals.totalAmount
    };
  }

  const subtotal = account.lines.reduce((sum, line) => {
    const product = getProduct(line.productId);
    return sum + product.price * line.qty;
  }, 0);
  const tax = Math.round(subtotal * business.taxRate);
  return { subtotal, discount: 0, tax, total: subtotal + tax };
}

export async function loadInitialState() {
  try {
    await refreshApiHealth();
    const [categories, items, accounts, cashShift] = await Promise.all([
      apiClient.listCategories(),
      apiClient.listItems(),
      apiClient.listOpenAccounts(),
      apiClient.getCurrentCashShift(business.terminalId)
    ]);

    state.categories = categories;
    state.products = mapApiProducts({ categories, items });
    state.accounts = await mapOpenAccountsWithDetails(accounts);
    state.activeAccountId = state.accounts[0]?.id || null;
    state.cashShift = cashShift || createNoOpenCashShift();
    state.cashMessage = null;
    state.api.connected = true;
    state.api.error = null;
    await loadReports();
  } catch (error) {
    state.api.connected = false;
    state.api.error = error.message;
    state.api.storage = "fake";
    state.api.storageDetails = {};
    state.products = structuredClone(localProducts);
    state.accounts = structuredClone(initialAccounts);
    state.activeAccountId = initialAccounts[0].id;
    state.cashShift = createFallbackCashShift();
    state.cashMessage = "API local no disponible. Caja diaria en fallback local.";
    state.reports = createLocalFallbackReports();
  }
}

export async function loadReports() {
  if (!state.api.connected) {
    state.reports = createLocalFallbackReports();
    return;
  }

  try {
    const [summary, salesByItem, topItems, lowStock, cashShift] = await Promise.all([
      apiClient.getSalesSummary(),
      apiClient.getSalesByItem(),
      apiClient.getTopItems(),
      apiClient.getLowStock(),
      apiClient.getCashShiftReport(getCurrentCashShiftId())
    ]);
    await refreshApiHealth();
    state.reports = {
      mode: getStorageMode("reports"),
      error: null,
      summary,
      salesByItem,
      topItems,
      lowStock,
      cashShift
    };
  } catch (error) {
    state.reports = { ...createLocalFallbackReports(), error: error.message };
  }
}

async function refreshApiHealth() {
  const health = await apiClient.health();
  state.api.storage = health.storage || "fake";
  state.api.storageDetails = health.storageDetails || {};
}

export function getStorageMode(scope) {
  return state.api.storageDetails?.[scope] || state.api.storage || (state.api.connected ? "api" : "local");
}

export function getStorageLabel(scope) {
  if (!state.api.connected) return "Fallback local";
  const mode = getStorageMode(scope);
  if (mode === "sql-local") return "SQL local";
  if (mode === "fake-fallback") return "Fallback API";
  if (mode === "fake") return "API fake";
  return "API local";
}

export async function addProduct(productId) {
  const account = getActiveAccount();
  const product = getProduct(productId);
  if (!account || !product) return;

  if (state.api.connected) {
    const line = account.lines.find((item) => item.productId === String(productId));
    const updatedAccount = line
      ? await apiClient.updateLine(account.apiId, line.apiLineId, { quantity: line.qty + 1 })
      : await apiClient.addLine(account.apiId, {
          itemId: product.apiId,
          quantity: 1,
          unitPrice: product.price,
          discountAmount: 0,
          notes: ""
        });
    replaceAccount(updatedAccount);
    return;
  }

  const line = account.lines.find((item) => item.productId === productId);
  if (line) {
    line.qty += 1;
    return;
  }
  account.lines.push({ productId, qty: 1 });
}

export async function changeQty(productId, direction) {
  const account = getActiveAccount();
  if (!account) return;
  const line = account.lines.find((item) => item.productId === productId);
  if (!line) return;

  if (state.api.connected) {
    const newQty = line.qty + direction;
    const updatedAccount =
      newQty <= 0
        ? await apiClient.removeLine(account.apiId, line.apiLineId)
        : await apiClient.updateLine(account.apiId, line.apiLineId, { quantity: newQty });
    replaceAccount(updatedAccount);
    return;
  }

  line.qty += direction;
  if (line.qty <= 0) {
    account.lines = account.lines.filter((item) => item.productId !== productId);
  }
}

export async function createAccount() {
  const name = `Cuenta ${state.accounts.length + 1}`;
  if (state.api.connected) {
    if (!isCashShiftOpen()) {
      throw uiError("Abre caja antes de crear cuentas.");
    }
    const account = await apiClient.createOpenAccount(createAccountPayload(name));
    state.accounts.push(mapApiAccount(account));
    state.activeAccountId = String(account.id);
    return;
  }

  const account = { id: `a${Date.now()}`, name: `Cuenta ${state.accounts.length + 1}`, lines: [] };
  state.accounts.push(account);
  state.activeAccountId = account.id;
}

export async function renameActiveAccount(name) {
  const cleanName = name.trim();
  if (!cleanName) return;
  const account = getActiveAccount();

  if (state.api.connected) {
    replaceAccount(await apiClient.renameOpenAccount(account.apiId, cleanName));
    return;
  }

  account.name = cleanName;
}

export async function checkoutActiveAccount() {
  const account = getActiveAccount();
  if (!account || !account.lines.length) return null;
  if (!isCashShiftOpen()) {
    throw uiError("Abre caja antes de cobrar.");
  }

  if (!state.api.connected) {
    const totals = calculateTotals(account);
    return {
      businessName: business.name,
      status: "paid",
      ticketNumber: `PV-${String(Math.floor(Date.now() / 1000)).slice(-7)}`,
      paidAt: new Date().toISOString(),
      terminalName: business.terminalName,
      cashierName: business.cashierName,
      accountName: account.name,
      lines: account.lines.map((line) => {
        const product = getProduct(line.productId);
        return {
          name: product.name,
          quantity: line.qty,
          unitPrice: product.price,
          discountAmount: 0,
          taxAmount: Math.round(product.price * line.qty * business.taxRate),
          lineTotal: product.price * line.qty
        };
      }),
      subtotalAmount: totals.subtotal,
      discountAmount: totals.discount,
      taxAmount: totals.tax,
      totalAmount: totals.total,
      payments: [{ paymentMethod: paymentMethodToApi(state.activePayment), amount: totals.total, reference: null }],
      footerNote: "Comprobante interno - no es factura electronica"
    };
  }

  const totals = calculateTotals(account);
  const sale = await apiClient.checkout({
    terminalId: business.terminalId,
    cashShiftId: getCurrentCashShiftId(),
    openAccountId: account.apiId,
    customerId: null,
    payments: [{ paymentMethod: paymentMethodToApi(state.activePayment), amount: totals.total, reference: null }]
  });
  const ticket = await apiClient.getTicket(sale.saleId);
  state.lastTicket = ticket;
  await loadInitialState();
  await loadReports();
  return ticket;
}

export async function refreshCashShift() {
  if (!state.api.connected) return state.cashShift;
  state.cashShift = (await apiClient.getCurrentCashShift(business.terminalId)) || createNoOpenCashShift();
  state.cashMessage = null;
  return state.cashShift;
}

export async function openCashShift({ openingCashAmount, note }) {
  const amount = normalizeNonNegativeAmount(openingCashAmount, "El monto inicial debe ser cero o mayor.");
  if (!state.api.connected) {
    state.cashShift = {
      ...createFallbackCashShift(),
      status: "open",
      openingCashAmount: amount,
      expectedCashAmount: amount,
      openedAt: new Date().toISOString(),
      openingNote: note?.trim() || null
    };
    state.cashMessage = "Caja abierta en fallback local.";
    return state.cashShift;
  }

  state.cashShift = await apiClient.openCashShift({
    terminalId: business.terminalId,
    openingCashAmount: amount,
    note: note?.trim() || undefined
  });
  state.cashMessage = "Caja abierta.";
  return state.cashShift;
}

export async function addCashMovement({ movementType, amount, reason, reference, direction }) {
  if (!isCashShiftOpen()) {
    throw uiError("Abre caja antes de registrar movimientos.");
  }
  const normalizedAmount = normalizePositiveAmount(amount, "El monto debe ser mayor a cero.");
  if (!reason?.trim()) {
    throw uiError("Agrega un motivo para registrar este movimiento.");
  }

  if (!state.api.connected) {
    const signedAmount = movementType === "cash_out" || direction === "decrease" ? -normalizedAmount : normalizedAmount;
    state.cashShift.manualMovements.push({
      id: Date.now(),
      movementType,
      amount: normalizedAmount,
      signedAmount,
      direction: direction || null,
      reason: reason.trim(),
      reference: reference?.trim() || null,
      createdAt: new Date().toISOString()
    });
    state.cashShift.expectedCashAmount += signedAmount;
    state.cashMessage = "Movimiento registrado en fallback local.";
    return state.cashShift;
  }

  await apiClient.addCashMovement(getCurrentCashShiftId(), {
    movementType,
    amount: normalizedAmount,
    reason: reason.trim(),
    reference: reference?.trim() || undefined,
    direction: movementType === "cash_adjustment" ? direction || "increase" : undefined
  });
  state.cashShift = await apiClient.getCashShift(getCurrentCashShiftId());
  state.cashMessage = "Movimiento registrado.";
  return state.cashShift;
}

export async function closeCashShift({ countedCashAmount, notes }) {
  if (!isCashShiftOpen()) {
    throw uiError("No hay una caja abierta para cerrar.");
  }
  const counted = normalizeNonNegativeAmount(countedCashAmount, "El efectivo contado debe ser cero o mayor.");
  const expected = state.cashShift.expectedCashAmount || 0;
  const difference = counted - expected;
  if (difference !== 0 && !notes?.trim()) {
    throw uiError("Explica la diferencia antes de cerrar caja.");
  }

  if (!state.api.connected) {
    state.cashShift = {
      ...state.cashShift,
      status: "closed",
      countedCashAmount: counted,
      differenceAmount: difference,
      closingNote: notes?.trim() || null,
      closedAt: new Date().toISOString()
    };
    state.cashMessage = "Caja cerrada en fallback local.";
    return state.cashShift;
  }

  state.cashShift = await apiClient.closeCashShift(getCurrentCashShiftId(), {
    countedCashAmount: counted,
    notes: notes?.trim() || undefined
  });
  state.cashMessage = difference === 0 ? "Caja cerrada sin diferencia." : "Caja cerrada con diferencia registrada.";
  await loadReports();
  return state.cashShift;
}

export function isCashShiftOpen() {
  return state.cashShift?.status === "open";
}

function createEmptyReports() {
  return {
    mode: "empty",
    error: null,
    summary: {
      salesCount: 0,
      subtotalAmount: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0
    },
    salesByItem: [],
    topItems: [],
    lowStock: [],
    cashShift: {
      cashShiftId: business.cashShiftId,
      status: "open",
      openingCashAmount: business.shiftBase,
      salesCount: 0,
      totalAmount: 0,
      payments: [],
      expectedCashAmount: business.shiftBase
    }
  };
}

function createFallbackCashShift() {
  return {
    cashShiftId: business.cashShiftId,
    terminalId: business.terminalId,
    status: "open",
    openingCashAmount: business.shiftBase,
    openedAt: new Date().toISOString(),
    salesCount: 0,
    totalAmount: 0,
    payments: [],
    manualMovements: [],
    expectedCashAmount: business.shiftBase,
    countedCashAmount: null,
    differenceAmount: null,
    closingNote: null
  };
}

function createNoOpenCashShift() {
  return {
    ...createFallbackCashShift(),
    cashShiftId: null,
    status: "none",
    openingCashAmount: 0,
    expectedCashAmount: 0,
    openedAt: null,
    manualMovements: []
  };
}

function createLocalFallbackReports() {
  const lowStock = inventory
    .filter((item) => item.stock < item.min)
    .map((item) => ({
      itemId: item.name,
      sku: item.name,
      name: item.name,
      currentStock: item.stock,
      stockMinimum: item.min,
      baseUnit: item.unit,
      shortage: item.min - item.stock
    }));

  return {
    ...createEmptyReports(),
    mode: "local",
    lowStock
  };
}

function replaceAccount(apiAccount) {
  const mapped = mapApiAccount(apiAccount);
  const index = state.accounts.findIndex((account) => account.id === mapped.id);
  if (index === -1) {
    state.accounts.push(mapped);
  } else {
    state.accounts[index] = mapped;
  }
  state.activeAccountId = mapped.id;
}

function mapApiProducts({ categories, items }) {
  const categoriesById = new Map(categories.map((category) => [category.id, category.name]));
  return items
    .filter((item) => ["prepared_product", "purchased_product"].includes(item.itemType) && item.salePrice !== null)
    .map((item) => ({
      id: String(item.id),
      apiId: item.id,
      name: item.name,
      category: categoriesById.get(item.categoryId) || "Catalogo",
      price: item.salePrice,
      type: item.itemType === "prepared_product" ? "Preparado" : "Comprado",
      code: item.sku
    }));
}

function mapApiAccount(account) {
  return {
    id: String(account.id),
    apiId: account.id,
    name: account.name,
    status: account.status,
    totals: account.totals,
    lines: (account.lines || []).map((line) => ({
      apiLineId: line.id,
      productId: String(line.itemId),
      qty: line.quantity,
      unitPrice: line.unitPrice,
      discountAmount: line.discountAmount || 0
    }))
  };
}

async function mapOpenAccountsWithDetails(accounts) {
  const details = await Promise.all(accounts.map((account) => apiClient.getOpenAccount(account.id)));
  return details.map(mapApiAccount);
}

function createAccountPayload(name) {
  return {
    terminalId: business.terminalId,
    cashShiftId: getCurrentCashShiftId(),
    customerId: null,
    name
  };
}

function getCurrentCashShiftId() {
  return state.cashShift?.cashShiftId || business.cashShiftId;
}

function normalizePositiveAmount(value, message) {
  const amount = Math.round(Number(value));
  if (!Number.isFinite(amount) || amount <= 0) throw uiError(message);
  return amount;
}

function normalizeNonNegativeAmount(value, message) {
  const amount = Math.round(Number(value));
  if (!Number.isFinite(amount) || amount < 0) throw uiError(message);
  return amount;
}

function uiError(message) {
  const error = new Error(message);
  error.code = "UI_VALIDATION";
  return error;
}

function paymentMethodToApi(method) {
  const map = {
    Efectivo: "cash",
    Tarjeta: "card",
    SINPE: "transfer"
  };
  return map[method] || "other";
}
