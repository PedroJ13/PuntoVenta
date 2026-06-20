const products = [
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

const inventory = [
  { name: "Cafe en grano", unit: "g", stock: 7350, min: 2500, cost: 8.6 },
  { name: "Leche entera", unit: "ml", stock: 18200, min: 8000, cost: 1.2 },
  { name: "Vasos 8 oz", unit: "und", stock: 86, min: 100, cost: 42 },
  { name: "Tapas 8 oz", unit: "und", stock: 92, min: 100, cost: 28 },
  { name: "Harina", unit: "g", stock: 4200, min: 3000, cost: 1.1 },
  { name: "Azucar", unit: "g", stock: 1600, min: 2500, cost: 0.9 },
  { name: "Pollo preparado", unit: "g", stock: 3100, min: 1200, cost: 5.4 }
];

const recipes = [
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

let accounts = [
  { id: "a1", name: "Mostrador 1", lines: [] },
  { id: "a2", name: "Cliente Laura", lines: [{ productId: "cap", qty: 2 }, { productId: "cro", qty: 1 }] },
  { id: "a3", name: "Para llevar", lines: [{ productId: "ame", qty: 1 }] }
];

let activeAccountId = "a1";
let activeCategory = "Todos";
let activePayment = "Efectivo";
let searchTerm = "";

const money = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0
});

const $ = (selector) => document.querySelector(selector);

function formatMoney(value) {
  return money.format(value);
}

function getActiveAccount() {
  return accounts.find((account) => account.id === activeAccountId);
}

function renderCategories() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  $("#category-tabs").innerHTML = categories
    .map((category) => `<button class="category-tab ${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`)
    .join("");
}

function renderProducts() {
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.code}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  $("#product-grid").innerHTML = visibleProducts
    .map((product) => {
      const initials = product.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("");

      return `
        <button class="product-card" data-product="${product.id}">
          <span class="product-visual">${initials}</span>
          <strong>${product.name}</strong>
          <small>${formatMoney(product.price)} · ${product.type}</small>
        </button>
      `;
    })
    .join("");
}

function renderAccounts() {
  $("#account-tabs").innerHTML = accounts
    .map((account) => {
      const qty = account.lines.reduce((sum, line) => sum + line.qty, 0);
      return `<button class="account-tab ${account.id === activeAccountId ? "active" : ""}" data-account="${account.id}">${account.name} (${qty})</button>`;
    })
    .join("");

  $("#active-account-name").textContent = getActiveAccount().name;
}

function calculateTotals(account) {
  const subtotal = account.lines.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + product.price * line.qty;
  }, 0);
  const tax = Math.round(subtotal * 0.13);
  return { subtotal, tax, total: subtotal + tax };
}

function renderCart() {
  const account = getActiveAccount();

  if (account.lines.length === 0) {
    $("#cart-lines").innerHTML = `<div class="empty-cart">Seleccione articulos para iniciar la venta.</div>`;
  } else {
    $("#cart-lines").innerHTML = account.lines
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        return `
          <div class="cart-line">
            <div>
              <strong>${product.name}</strong>
              <small>${line.qty} x ${formatMoney(product.price)}</small>
            </div>
            <div>
              <strong>${formatMoney(product.price * line.qty)}</strong>
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

  const totals = calculateTotals(account);
  $("#subtotal").textContent = formatMoney(totals.subtotal);
  $("#tax").textContent = formatMoney(totals.tax);
  $("#total").textContent = formatMoney(totals.total);
}

function renderInventory() {
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

function renderItems() {
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

function renderRecipes() {
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
}

function addProduct(productId) {
  const account = getActiveAccount();
  const line = account.lines.find((item) => item.productId === productId);
  if (line) {
    line.qty += 1;
  } else {
    account.lines.push({ productId, qty: 1 });
  }
  renderAccounts();
  renderCart();
}

function changeQty(productId, direction) {
  const account = getActiveAccount();
  const line = account.lines.find((item) => item.productId === productId);
  if (!line) return;

  line.qty += direction;
  if (line.qty <= 0) {
    account.lines = account.lines.filter((item) => item.productId !== productId);
  }

  renderAccounts();
  renderCart();
}

function showReceipt() {
  const account = getActiveAccount();
  if (account.lines.length === 0) return;

  const totals = calculateTotals(account);
  $("#receipt-meta").textContent = `${new Date().toLocaleString("es-CR")} · ${activePayment}`;
  $("#receipt-lines").innerHTML = account.lines
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      return `
        <div class="receipt-line">
          <div>
            <strong>${product.name}</strong>
            <small>${line.qty} x ${formatMoney(product.price)}</small>
          </div>
          <strong>${formatMoney(product.price * line.qty)}</strong>
        </div>
      `;
    })
    .join("");
  $("#receipt-total").textContent = formatMoney(totals.total);
  $("#ticket-dialog").showModal();
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest(".nav-item");
  if (nav) {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    nav.classList.add("active");
    $(`#${nav.dataset.view}-view`).classList.add("active");
  }

  const category = event.target.closest(".category-tab");
  if (category) {
    activeCategory = category.dataset.category;
    renderCategories();
    renderProducts();
  }

  const product = event.target.closest(".product-card");
  if (product) addProduct(product.dataset.product);

  const account = event.target.closest(".account-tab");
  if (account) {
    activeAccountId = account.dataset.account;
    renderAccounts();
    renderCart();
  }

  const qty = event.target.closest("[data-action]");
  if (qty) {
    changeQty(qty.dataset.product, qty.dataset.action === "increase" ? 1 : -1);
  }

  const payment = event.target.closest(".pay-option");
  if (payment) {
    activePayment = payment.dataset.method;
    document.querySelectorAll(".pay-option").forEach((item) => item.classList.remove("active"));
    payment.classList.add("active");
  }
});

$("#product-search").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
});

$("#clear-search").addEventListener("click", () => {
  searchTerm = "";
  $("#product-search").value = "";
  renderProducts();
});

$("#new-account").addEventListener("click", () => {
  const next = accounts.length + 1;
  const account = { id: `a${Date.now()}`, name: `Cuenta ${next}`, lines: [] };
  accounts.push(account);
  activeAccountId = account.id;
  renderAccounts();
  renderCart();
});

$("#rename-account").addEventListener("click", () => {
  const account = getActiveAccount();
  const name = prompt("Nombre de la cuenta", account.name);
  if (name && name.trim()) {
    account.name = name.trim();
    renderAccounts();
  }
});

$("#checkout").addEventListener("click", showReceipt);
$("#close-receipt").addEventListener("click", () => $("#ticket-dialog").close());

renderCategories();
renderProducts();
renderAccounts();
renderCart();
renderInventory();
renderItems();
renderRecipes();
