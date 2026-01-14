import { Cart } from "./constructors/cart.js";
import {
  FetchProducts,
  FetchCategories,
  FetchProductsByCategory,
  FetchCustomer,
  FetchFavorites,
  AddFavorite,
  RemoveFavorite,
} from "./api.js";
import { renderFavorites } from "./Allviews/favoritesView.js";
import { renderProductDetails } from "./Allviews/productDetailView.js";

export {
  cart,
  favorites,
  renderProducts,
  renderCart,
  renderFavorites,
  renderProductDetails,
  updateCartBadge,
  toggleFavorite,
  clearCart,
  confirmOrder,
};

let products = [];
let customer = { name: "Klient" };
const cart = new Cart();
let favorites = [];

const savedCart = localStorage.getItem("shopping-cart");
if (savedCart) {
  const parsed = JSON.parse(savedCart);

  cart.items = parsed.items || [];
}

function setTitle(text) {
  const el = document.querySelector("#page-title");
  if (el) el.textContent = text;
}

function hideAllViews() {
  [
    "#product-list",
    "#product-details",
    "#cart-view",
    "#favorites-view",
    "#category-filters",
  ].forEach((id) => {
    const el = document.querySelector(id);
    if (el) el.style.display = "none";
  });
}

function updateCartBadge() {
  const badge = document.querySelector("#cart-count");
  if (!badge) return;

  const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = `🛒 ${totalQty}`;

  localStorage.setItem("shopping-cart", JSON.stringify(cart));
}

async function renderCategoryFilters() {
  const categories = await FetchCategories();
  const filterContainer = document.querySelector("#category-filters");
  if (!filterContainer) return;

  filterContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "Kõik";
  allBtn.className = "filter-btn";
  allBtn.addEventListener("click", () => renderProducts(products));
  filterContainer.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.className = "filter-btn";
    btn.addEventListener("click", async () => {
      const filtered = await FetchProductsByCategory(cat);
      renderProducts(filtered);
    });
    filterContainer.appendChild(btn);
  });
}

function renderProducts(itemsToRender = null) {
  hideAllViews();
  setTitle("Tooted");

  const filterContainer = document.querySelector("#category-filters");
  if (filterContainer) filterContainer.style.display = "flex";

  const container = document.querySelector("#product-list");
  container.style.display = "flex";
  container.innerHTML = "";

  const list = itemsToRender || products;

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = p.image;
    img.className = "product-image";
    img.alt = p.title;

    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = p.title;
    title.addEventListener("click", () => renderProductDetails(p));

    const price = document.createElement("p");
    price.textContent = `Hind: €${p.price.toFixed(2)}`;

    const addBtn = document.createElement("button");
    addBtn.className = "add-to-cart";
    addBtn.textContent = "Lisa korvi";
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cart.addProduct(p, 1);
      updateCartBadge();
    });

    const favBtn = document.createElement("button");
    favBtn.className = "add-to-favorites";
    const isFav = favorites.some((f) => f.id === p.id);
    favBtn.textContent = isFav ? "❤️" : "🤍";

    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(p);
    });

    card.append(img, title, price, addBtn, favBtn);
    container.appendChild(card);
  });
}

function renderCart() {
  hideAllViews();
  setTitle("Ostukorv");
  const container = document.querySelector("#cart-view");
  container.style.display = "block";
  container.innerHTML = "<h2>Ostukorv</h2>";

  if (cart.items.length === 0) {
    container.innerHTML += "<p>Ostukorv on tühi</p>";
    return;
  }

  cart.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${item.product.title}</span>
      <input type="number" min="1" value="${item.qty}" class="cart-qty">
      <span>€${(item.product.price * item.qty).toFixed(2)}</span>
      <button class="remove-item">❌</button>
    `;

    row.querySelector(".cart-qty").addEventListener("change", (e) => {
      cart.changeQty(item.product.id, parseInt(e.target.value));
      updateCartBadge();
      renderCart();
    });

    row.querySelector(".remove-item").addEventListener("click", () => {
      cart.removeProduct(item.product.id);
      updateCartBadge();
      renderCart();
    });

    container.appendChild(row);
  });

  const totals = cart.calculateTotals();
  const summary = document.createElement("div");
  summary.innerHTML = `
    <hr>
    <p>Neto: €${totals.subtotal.toFixed(2)}</p>
    <p>KM: €${totals.vat.toFixed(2)}</p>
    <p><strong>Kokku: €${totals.total.toFixed(2)}</strong></p>
    <button id="btn-buy">Osta</button>
    <button id="btn-clear">Tühjenda</button>
  `;

  summary.querySelector("#btn-buy").addEventListener("click", confirmOrder);
  summary.querySelector("#btn-clear").addEventListener("click", () => {
    clearCart();
    renderCart();
  });

  container.appendChild(summary);
}

document
  .querySelector("#nav-home")
  .addEventListener("click", () => renderProducts(products));
document.querySelector("#nav-cart").addEventListener("click", renderCart);
document.querySelector("#nav-favorites").addEventListener("click", () => {
  hideAllViews();
  document.querySelector("#favorites-view").style.display = "block";
  renderFavorites();
});

async function toggleFavorite(product) {
  const index = favorites.findIndex((f) => f.id === product.id);

  if (index === -1) {
    favorites = await AddFavorite(product);
  } else {
    favorites = await RemoveFavorite(product.id);
  }

  const isFavView =
    document.querySelector("#favorites-view").style.display === "block";
  if (isFavView) {
    renderFavorites();
  } else {
    renderProducts();
  }
}

function clearCart() {
  cart.clear();
  updateCartBadge();
}

function confirmOrder() {
  if (cart.items.length === 0) return alert("Ostukorv on tühi!");
  alert(`Tellimus kinnitatud! Aitäh, ${customer.name}!`);
  clearCart();
  renderProducts(products);
}

async function initApp() {
  try {
    const savedCustomer = localStorage.getItem("shop-customer");

    const [fetchedProducts, fetchedFavorites] = await Promise.all([
      FetchProducts(),
      FetchFavorites(),
    ]);

    products = fetchedProducts;
    favorites = fetchedFavorites;

    if (savedCustomer) {
      customer = JSON.parse(savedCustomer);
    } else {
      const serverCustomer = await FetchCustomer();
      if (serverCustomer) {
        customer = serverCustomer;
        localStorage.setItem("shop-customer", JSON.stringify(customer));
      }
    }

    await renderCategoryFilters();
    renderProducts(products);

    updateCartBadge();
  } catch (err) {
    console.error("Rakenduse käivitamine ebaõnnestus:", err);
  }
}

initApp();
