import { Cart } from "./constructors/cart.js";

import { FetchProducts } from "./api.js";

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

const products = await FetchProducts();
const cart = new Cart();
const favorites = [];


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
  ].forEach((id) => {
    const el = document.querySelector(id);
    if (el) el.style.display = "none";
  });
}


function renderProducts() {
  hideAllViews();
  setTitle("Kõik tooted");

  const container = document.querySelector("#product-list");
  container.style.display = "flex";
  container.innerHTML = "";

  products.forEach((p) => {   
    const card = document.createElement("div");
    card.className = "product-card";

    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = p.title;
    title.addEventListener("click", () => renderProductDetails(p));

    const cat = document.createElement("p");
    cat.textContent = `Kategooria: ${p.category}`;

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
    favBtn.textContent = favorites.some((f) => f.id === p.id)
      ? "❤️ Eemalda"
      : "🤍 Lemmik";
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(p);
    });

    card.appendChild(title);
    card.appendChild(cat);
    card.appendChild(price);
    card.appendChild(addBtn);
    card.appendChild(favBtn);

    container.appendChild(card);
  });
}



function renderCart() {
  hideAllViews();
  setTitle("Ostukorv");
  const container = document.querySelector("#cart-view");
  container.style.display = "block";
  container.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.textContent = "Ostukorv";
  container.appendChild(h2);

  if (cart.items.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Ostukorv on tühi";
    container.appendChild(empty);
    return;
  }

  cart.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const t = document.createElement("span");
    t.className = "cart-title";
    t.textContent = item.product.title;

    const qty = document.createElement("input");
    qty.type = "number";
    qty.min = "1";
    qty.value = String(item.qty);
    qty.className = "cart-qty";
    qty.addEventListener("change", () => {
      cart.changeQty(item.product.id, qty.value);
      updateCartBadge();
      renderCart();
    });

    const lineSum = document.createElement("span");
    lineSum.className = "cart-line-sum";
    lineSum.textContent = `€${(item.product.price * item.qty).toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "cart-remove";
    removeBtn.textContent = "❌";
    removeBtn.addEventListener("click", () => {
      cart.removeProduct(item.product.id);
      updateCartBadge();
      renderCart();
    });

    row.appendChild(t);
    row.appendChild(qty);
    row.appendChild(lineSum);
    row.appendChild(removeBtn);

    container.appendChild(row);
  });

  const totals = cart.calculateTotals();

  const hr = document.createElement("hr");
  container.appendChild(hr);

  const net = document.createElement("p");
  net.textContent = `Netosumma: €${totals.subtotal.toFixed(2)}`;
  const vat = document.createElement("p");
  vat.textContent = `Käibemaks (20%): €${totals.vat.toFixed(2)}`;
  const total = document.createElement("p");
  total.innerHTML = `<strong>Kokku: €${totals.total.toFixed(2)}</strong>`;

  const buyBtn = document.createElement("button");
  buyBtn.textContent = "Osta";
  buyBtn.addEventListener("click", () => confirmOrder());

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Tühista ostukorv";
  clearBtn.addEventListener("click", () => {
    clearCart();

    renderCart();
  });

  container.appendChild(net);
  container.appendChild(vat);
  container.appendChild(total);
  container.appendChild(buyBtn);
  container.appendChild(clearBtn);
}

document.querySelector("#nav-home").addEventListener("click", () => {
  renderProducts();
  updateCartBadge();
});

document.querySelector("#nav-cart").addEventListener("click", () => {
  renderCart();
  updateCartBadge();
});

document.querySelector("#nav-favorites").addEventListener("click", () => {
  hideAllViews();
  const favView = document.querySelector("#favorites-view");
  favView.style.display = "block";
  renderFavorites();
  updateCartBadge();
});

document.querySelector("#nav-logo").addEventListener("click", (e) => {
  e.preventDefault();
  renderProducts();
  updateCartBadge();
});

function updateCartBadge() {
  const badge = document.querySelector("#cart-count");
  if (!badge) return;
  const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);

  badge.textContent = `🛒 ${totalQty}`;
}

function toggleFavorite(product) {
  const index = favorites.findIndex((f) => f.id === product.id);
  if (index === -1) favorites.push(product);
  else favorites.splice(index, 1);

  const isFavOpen =
    document.querySelector("#favorites-view")?.style.display === "block";
  if (isFavOpen) renderFavorites();

  renderProducts();
  updateCartBadge();
}

function clearCart() {
  cart.clear();
  updateCartBadge();
}

function confirmOrder() {
  if (cart.items.length === 0) {
    alert("Ostukorv on tühi!");
    return;
  }
  alert(`Tellimus kinnitatud! Aitäh ostu eest, ${customer.name}`);
  clearCart();
}


updateCartBadge();
