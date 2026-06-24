import { business, inventory, products, recipes } from "./data.js";
import {
  addCashMovement,
  calculateTotals,
  closeCashShift,
  checkoutActiveAccount,
  getActiveAccount,
  getCategories,
  getProduct,
  getStorageLabel,
  getVisibleProducts,
  isCashShiftOpen,
  loadReports,
  openCashShift,
  refreshCashShift,
  state
} from "./state.js";

export const money = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0
});

export const $ = (selector) => document.querySelector(selector);

export function formatMoney(value) {
  return money.format(value);
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

export function renderCategories() {
  $("#category-tabs").innerHTML = getCategories()
    .map((category) => `<button class="category-tab ${category === state.activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`)
    .join("");
}

export function renderProducts() {
  $("#product-grid").innerHTML = getVisibleProducts()
    .map((product) => `
      <button class="product-card" data-product="${product.id}">
        <span class="product-visual">${initials(product.name)}</span>
        <strong>${product.name}</strong>
        <small>${formatMoney(product.price)} - ${product.type}</small>
      </button>
    `)
    .join("");
}

export function renderApiStatus() {
  const status = $("#api-status");
  if (!status) return;
  const hasSql = Object.values(state.api.storageDetails || {}).includes("sql-local");
  status.textContent = state.api.connected ? (hasSql ? "API SQL local" : "API local") : "Modo local";
  status.className = `api-status ${state.api.connected ? "connected" : "fallback"}`;
  status.title = state.api.error || "";
}

export function renderAccounts() {
  $("#account-tabs").innerHTML = state.accounts
    .map((account) => {
      const qty = account.lines.reduce((sum, line) => sum + line.qty, 0);
      return `<button class="account-tab ${account.id === state.activeAccountId ? "active" : ""}" data-account="${account.id}">${account.name} (${qty})</button>`;
    })
    .join("");

  $("#active-account-name").textContent = getActiveAccount()?.name || "Sin cuenta";
  renderCheckoutState();
}

export function renderCart() {
  const account = getActiveAccount();

  if (!account || account.lines.length === 0) {
    $("#cart-lines").innerHTML = `<div class="empty-cart">Seleccione articulos para iniciar la venta.</div>`;
  } else {
    $("#cart-lines").innerHTML = account.lines
      .map((line) => {
        const product = getProduct(line.productId);
        return `
          <div class="cart-line">
            <div>
              <strong>${product.name}</strong>
              <small>${line.qty} x ${formatMoney(line.unitPrice || product.price)}</small>
            </div>
            <div>
              <strong>${formatMoney((line.unitPrice || product.price) * line.qty)}</strong>
              <div class="qty-control">
                <button data-action="decrease" data-product="${product.id}">-</button>
                <span>${line.qty}</span>
                <button data-action="increase" data-product="${product.id}">+</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  const totals = account ? calculateTotals(account) : { subtotal: 0, tax: 0, total: 0 };
  $("#subtotal").textContent = formatMoney(totals.subtotal);
  $("#tax").textContent = formatMoney(totals.tax);
  $("#total").textContent = formatMoney(totals.total);
  renderCheckoutState();
}

export function renderPaymentMethods() {
  $("#payment-row").innerHTML = business.paymentMethods
    .map((method) => `<button class="pay-option ${method === state.activePayment ? "active" : ""}" data-method="${method}">${method}</button>`)
    .join("");
}

export function renderInventory() {
  const lowItems = inventory.filter((item) => item.stock < item.min);
  $("#inventory-summary").innerHTML = `
    <div><span>Cafe disponible</span><strong>7.35 kg</strong></div>
    <div><span>Leche disponible</span><strong>18.2 L</strong></div>
    <div><span>Bajo minimo</span><strong>${lowItems.length} insumos</strong></div>
  `;

  $("#inventory-table").innerHTML = inventory
    .map((item) => {
      const low = item.stock < item.min;
      return `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td>${item.unit}</td>
          <td>${item.stock.toLocaleString("es-CR")} ${item.unit}</td>
          <td>${item.min.toLocaleString("es-CR")} ${item.unit}</td>
          <td>${formatMoney(item.cost)} / ${item.unit}</td>
          <td><span class="status-pill ${low ? "warn" : ""}">${low ? "Bajo minimo" : "Disponible"}</span></td>
        </tr>
      `;
    })
    .join("");
}

export function renderItems() {
  $("#item-board").innerHTML = products
    .map((product) => `
      <article class="item-card">
        <header>
          <div>
            <strong>${product.name}</strong>
            <small>${product.code}</small>
          </div>
          <strong>${formatMoney(product.price)}</strong>
        </header>
        <div class="item-meta">
          <div><span>Categoria</span><strong>${product.category}</strong></div>
          <div><span>Tipo</span><strong>${product.type}</strong></div>
        </div>
      </article>
    `)
    .join("");
}

export function renderRecipes() {
  $("#recipe-list").innerHTML = recipes
    .map((recipe) => `
      <article class="recipe-card">
        <header>
          <div>
            <strong>${recipe.product}</strong>
            <small>Costo teorico: ${formatMoney(recipe.cost)}</small>
          </div>
          <strong>${recipe.margin}</strong>
        </header>
        <ul>
          ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
        </ul>
      </article>
    `)
    .join("");

  $("#recipe-detail").innerHTML = `
    <span class="panel-label">Ejemplo de regla</span>
    <h2>1 kg de cafe no se convierte antes de vender</h2>
    <p>
      El inventario guarda cafe en gramos. Cada venta descuenta la receta real:
      express, americano o capuchino. Asi el kilo puede terminar en cualquier mezcla.
    </p>
    <div class="formula-box">
      <strong>Disponibilidad teorica</strong>
      <span>7350 g cafe / 10 g por taza = hasta 735 bebidas base</span>
      <small>La leche, vasos y otros insumos pueden limitar antes.</small>
    </div>
  `;
}

export async function refreshReports() {
  await loadReports();
  renderReports();
}

export async function refreshCash() {
  await refreshCashShift();
  renderCashShift();
  renderCheckoutState();
}

export async function submitOpenCashShift() {
  await openCashShift({
    openingCashAmount: $("#cash-open-amount").value,
    note: $("#cash-open-note").value
  });
  $("#cash-open-note").value = "";
  renderCashShift();
  renderCheckoutState();
}

export async function submitCashMovement() {
  await addCashMovement({
    movementType: $("#cash-movement-type").value,
    direction: $("#cash-adjustment-direction").value,
    amount: $("#cash-movement-amount").value,
    reason: $("#cash-movement-reason").value,
    reference: $("#cash-movement-reference").value
  });
  $("#cash-movement-amount").value = "";
  $("#cash-movement-reason").value = "";
  $("#cash-movement-reference").value = "";
  renderCashShift();
}

export async function submitCloseCashShift() {
  await closeCashShift({
    countedCashAmount: $("#cash-counted-amount").value,
    notes: $("#cash-close-note").value
  });
  $("#cash-counted-amount").value = "";
  $("#cash-close-note").value = "";
  renderCashShift();
  renderCheckoutState();
}

export function renderCashShift() {
  const shift = state.cashShift;
  const isOpen = isCashShiftOpen();
  const modeText = getStorageLabel("cashShifts");
  const statusText = shift.status === "open" ? "Abierta" : shift.status === "closed" ? "Cerrada" : "Sin abrir";
  const difference = shift.differenceAmount ?? 0;
  $("#cash-status").textContent = `${modeText} - ${statusText}`;
  $("#cash-open-panel").classList.toggle("is-hidden", isOpen);
  $("#cash-movement-form").classList.toggle("is-disabled", !isOpen);
  $("#cash-close-form").classList.toggle("is-disabled", !isOpen);

  $("#cash-message").textContent = state.cashMessage || (state.api.connected ? "" : "API local no disponible. Usando fallback local.");
  $("#cash-message").className = `cash-message ${state.cashMessage || !state.api.connected ? "visible" : ""}`;

  $("#cash-summary").innerHTML = `
    <div><span>Estado</span><strong>${statusText}</strong></div>
    <div><span>Base</span><strong>${formatMoney(shift.openingCashAmount || 0)}</strong></div>
    <div><span>Efectivo esperado</span><strong>${formatMoney(shift.expectedCashAmount || 0)}</strong></div>
    <div><span>Ventas</span><strong>${shift.salesCount || 0}</strong></div>
    <div><span>Contado</span><strong>${shift.countedCashAmount === null ? "-" : formatMoney(shift.countedCashAmount || 0)}</strong></div>
    <div><span>Diferencia</span><strong class="${difference < 0 ? "danger-text" : difference > 0 ? "ok-text" : ""}">${shift.differenceAmount === null ? "-" : formatMoney(difference)}</strong></div>
  `;

  const payments = normalizePayments(shift.payments || []);
  $("#cash-payments").innerHTML = payments
    .map((payment) => `
      <div>
        <span>${paymentMethodLabel(payment.paymentMethod)}</span>
        <strong>${formatMoney(payment.amount || 0)}</strong>
        <small>${payment.count || 0} pagos</small>
      </div>
    `)
    .join("");

  $("#cash-movements").innerHTML = renderReportRows(shift.manualMovements || [], (movement) => `
    <tr>
      <td><strong>${cashMovementLabel(movement.movementType)}</strong><small>${movement.direction || ""}</small></td>
      <td>${formatMoney(movement.signedAmount || movement.amount || 0)}</td>
      <td>${movement.reason || "-"}</td>
    </tr>
  `);
}

export function renderReports() {
  const reports = state.reports;
  const modeText = reports.mode === "sql-local" ? "SQL local" : reports.mode === "fake" ? "API fake" : reports.mode === "fake-fallback" ? "Fallback API" : "Fallback local";
  $("#reports-status").textContent = reports.error ? `${modeText} - ${reports.error}` : modeText;

  $("#reports-summary").innerHTML = `
    <div><span>Ventas</span><strong>${reports.summary.salesCount}</strong></div>
    <div><span>Total vendido</span><strong>${formatMoney(reports.summary.totalAmount)}</strong></div>
    <div><span>Impuesto</span><strong>${formatMoney(reports.summary.taxAmount)}</strong></div>
    <div><span>Caja esperada</span><strong>${formatMoney(reports.cashShift.expectedCashAmount || 0)}</strong></div>
  `;

  $("#reports-top-items").innerHTML = renderReportRows(reports.topItems, (item) => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.quantity}</td>
      <td>${formatMoney(item.totalAmount)}</td>
    </tr>
  `);

  $("#reports-sales-by-item").innerHTML = renderReportRows(reports.salesByItem, (item) => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.quantity}</td>
      <td>${formatMoney(item.subtotalAmount)}</td>
      <td>${formatMoney(item.taxAmount)}</td>
      <td>${formatMoney(item.totalAmount)}</td>
    </tr>
  `);

  $("#reports-low-stock").innerHTML = renderReportRows(reports.lowStock, (item) => `
    <tr>
      <td><strong>${item.name}</strong><small>${item.sku || ""}</small></td>
      <td>${item.currentStock.toLocaleString("es-CR")} ${item.baseUnit}</td>
      <td>${item.stockMinimum.toLocaleString("es-CR")} ${item.baseUnit}</td>
      <td><span class="status-pill warn">${item.shortage.toLocaleString("es-CR")} ${item.baseUnit}</span></td>
    </tr>
  `);

  $("#reports-cash").innerHTML = `
    <div><span>Turno</span><strong>#${reports.cashShift.cashShiftId}</strong></div>
    <div><span>Estado</span><strong>${reports.cashShift.status}</strong></div>
    <div><span>Base</span><strong>${formatMoney(reports.cashShift.openingCashAmount || 0)}</strong></div>
    <div><span>Ventas</span><strong>${reports.cashShift.salesCount || 0}</strong></div>
    <div><span>Total caja</span><strong>${formatMoney(reports.cashShift.totalAmount || 0)}</strong></div>
    <div><span>Efectivo esperado</span><strong>${formatMoney(reports.cashShift.expectedCashAmount || 0)}</strong></div>
  `;
}

export async function showReceipt() {
  const account = getActiveAccount();
  if (account.lines.length === 0) return;

  const ticket = await checkoutActiveAccount();
  if (!ticket) return;

  $("#receipt-business").textContent = ticket.businessName || business.name;
  $("#receipt-status").textContent = ticket.status === "paid" ? "PAGADO" : ticket.status.toUpperCase();
  $("#receipt-meta").textContent = ticket.accountName || account.name;
  $("#receipt-number").textContent = ticket.ticketNumber;
  $("#receipt-date").textContent = new Date(ticket.paidAt).toLocaleString("es-CR");
  $("#receipt-terminal").textContent = ticket.terminalName || business.terminalName;
  $("#receipt-cashier").textContent = ticket.cashierName || business.cashierName;
  $("#receipt-lines").innerHTML = ticket.lines
    .map((line) => {
      return `
        <div class="receipt-line">
          <div>
            <strong>${line.name}</strong>
            <small>${line.quantity} x ${formatMoney(line.unitPrice)}</small>
          </div>
          <strong>${formatMoney(line.lineTotal)}</strong>
        </div>
      `;
    })
    .join("");
  $("#receipt-subtotal").textContent = formatMoney(ticket.subtotalAmount);
  $("#receipt-discount").textContent = formatMoney(ticket.discountAmount || 0);
  $("#receipt-tax").textContent = formatMoney(ticket.taxAmount);
  $("#receipt-total").textContent = formatMoney(ticket.totalAmount);
  $("#receipt-payments").innerHTML = ticket.payments
    .map((payment) => `
      <div>
        <span>${paymentMethodLabel(payment.paymentMethod)}</span>
        <strong>${formatMoney(payment.amount)}</strong>
      </div>
    `)
    .join("");
  $("#ticket-dialog").showModal();
}

export function renderCheckoutState() {
  const warning = $("#checkout-warning");
  const checkout = $("#checkout");
  if (!warning || !checkout) return;
  const account = getActiveAccount();
  const blockedByCash = !isCashShiftOpen();
  const blockedByCart = !account || !account.lines.length;
  checkout.disabled = blockedByCash || blockedByCart;
  if (blockedByCash) {
    warning.textContent = "Abre caja antes de cobrar.";
  } else if (state.api.error && state.api.error.includes("cash shift")) {
    warning.textContent = "No se pudo confirmar caja abierta.";
  } else {
    warning.textContent = "";
  }
}

export function renderAll() {
  $("[data-shift-base]").textContent = formatMoney(business.shiftBase);
  renderApiStatus();
  renderCategories();
  renderProducts();
  renderAccounts();
  renderCart();
  renderPaymentMethods();
  renderInventory();
  renderItems();
  renderRecipes();
  renderReports();
  renderCashShift();
  renderCheckoutState();
}

function paymentMethodLabel(method) {
  const labels = {
    cash: "Pago efectivo",
    card: "Pago tarjeta",
    transfer: "Pago SINPE",
    other: "Pago otro"
  };
  return labels[method] || method;
}

function cashMovementLabel(type) {
  const labels = {
    cash_in: "Ingreso",
    cash_out: "Egreso",
    cash_adjustment: "Ajuste"
  };
  return labels[type] || type;
}

function normalizePayments(payments) {
  const byMethod = new Map(payments.map((payment) => [payment.paymentMethod, payment]));
  return ["cash", "card", "transfer", "other"].map((paymentMethod) => {
    return byMethod.get(paymentMethod) || { paymentMethod, count: 0, amount: 0 };
  });
}

function renderReportRows(rows, renderRow) {
  if (!rows.length) {
    return `<tr><td colspan="5" class="empty-table">Sin datos todavia.</td></tr>`;
  }
  return rows.map(renderRow).join("");
}
