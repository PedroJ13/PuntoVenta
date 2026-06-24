import { addProduct, changeQty, createAccount, loadInitialState, renameActiveAccount, state } from "./state.js";
import {
  $,
  refreshCash,
  renderApiStatus,
  renderAccounts,
  renderAll,
  renderCart,
  renderCategories,
  renderCashShift,
  renderCheckoutState,
  renderPaymentMethods,
  renderProducts,
  refreshReports,
  submitCashMovement,
  submitCloseCashShift,
  submitOpenCashShift,
  showReceipt
} from "./ui.js";

document.addEventListener("click", async (event) => {
  const nav = event.target.closest(".nav-item");
  if (nav) {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    nav.classList.add("active");
    $(`#${nav.dataset.view}-view`).classList.add("active");
    if (nav.dataset.view === "reports") {
      await withUiUpdate(refreshReports);
    }
    if (nav.dataset.view === "cash") {
      await withUiUpdate(refreshCash);
    }
  }

  const category = event.target.closest(".category-tab");
  if (category) {
    state.activeCategory = category.dataset.category;
    renderCategories();
    renderProducts();
  }

  const product = event.target.closest(".product-card");
  if (product) {
    await withUiUpdate(() => addProduct(product.dataset.product));
    renderAccounts();
    renderCart();
  }

  const account = event.target.closest(".account-tab");
  if (account) {
    state.activeAccountId = account.dataset.account;
    renderAccounts();
    renderCart();
  }

  const qty = event.target.closest("[data-action]");
  if (qty) {
    await withUiUpdate(() => changeQty(qty.dataset.product, qty.dataset.action === "increase" ? 1 : -1));
    renderAccounts();
    renderCart();
  }

  const payment = event.target.closest(".pay-option");
  if (payment) {
    state.activePayment = payment.dataset.method;
    renderPaymentMethods();
  }
});

$("#product-search").addEventListener("input", (event) => {
  state.searchTerm = event.target.value;
  renderProducts();
});

$("#clear-search").addEventListener("click", () => {
  state.searchTerm = "";
  $("#product-search").value = "";
  renderProducts();
});

$("#new-account").addEventListener("click", async () => {
  await withUiUpdate(() => createAccount());
  renderAccounts();
  renderCart();
});

$("#rename-account").addEventListener("click", async () => {
  const activeName = $("#active-account-name").textContent;
  const name = prompt("Nombre de la cuenta", activeName);
  if (!name) return;
  await withUiUpdate(() => renameActiveAccount(name));
  renderAccounts();
});

$("#checkout").addEventListener("click", async () => {
  await withUiUpdate(showReceipt);
  renderAll();
});
$("#close-receipt").addEventListener("click", () => $("#ticket-dialog").close());
$("#print-receipt").addEventListener("click", () => window.print());
$("#refresh-reports").addEventListener("click", () => withUiUpdate(refreshReports));
$("#refresh-cash").addEventListener("click", () => withUiUpdate(refreshCash));
$("#cash-open-form").addEventListener("submit", (event) => {
  event.preventDefault();
  withUiUpdate(submitOpenCashShift);
});
$("#cash-movement-form").addEventListener("submit", (event) => {
  event.preventDefault();
  withUiUpdate(submitCashMovement);
});
$("#cash-close-form").addEventListener("submit", (event) => {
  event.preventDefault();
  withUiUpdate(submitCloseCashShift);
});

await loadInitialState();
renderAll();

async function withUiUpdate(action) {
  try {
    await action();
    state.api.error = null;
  } catch (error) {
    state.api.error = error.message;
    state.cashMessage = error.message;
  } finally {
    renderApiStatus();
    renderCashShift();
    renderCheckoutState();
  }
}
