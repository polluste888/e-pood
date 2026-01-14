import { Product } from "./constructors/product.js";
import { Cart } from "./constructors/cart.js";
import { Customer } from "./constructors/customer.js";

import { renderCart } from "./Allviews/cartView.js";
import { renderFavorites } from "./Allviews/favoritesView.js";
import { renderProductDetails } from "./Allviews/productDetailView.js";


const products = [
  new Product(1, "Apple iPhone 17 Pro Max", 1700, "Nutitelefonid", "pilt.jpg"),
  new Product(2, "LG 55 4K Smart LED TV", 799.99, "Telerid", "pilt.jpg"),
  new Product(3, "Lenovo IdeaPad 3 15 Laptop", 530, "Sülearvutid", "pilt.jpg"),
  new Product(4, "Sony WH‑1000XM5 Wireless Headphones", 350.99, "Kõrvaklapid", "pilt.jpg"),
  new Product(5, "JBL Flip 6 Bluetooth Speaker", 110, "Kõlarid", "pilt.jpg"),
];

const cart = new Cart();
const favorites = [];
const customer = new Customer("Rasmus Linde");


function hideAllViews() {
  document.querySelector("#product-list").style.display = "none";
  document.querySelector("#product-details").style.display = "none";
  document.querySelector("#cart-view").style.display = "none";
  document.querySelector("#favorites-view").style.display = "none";
}


function renderProducts() {
  hideAllViews();

  const container = document.querySelector("#product-list");
  container.style.display = "flex";
  container.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3 class="product-title">${p.title}</h3>
      <p>Kategooria: ${p.category}</p>
      <p>Hind: €${p.price.toFixed(2)}</p>
      <button class="add-to-cart">Lisa korvi</button>
      <button class="add-to-favorites">Lisa lemmikutesse</button>
    `;

    
    card.querySelector(".product-title").addEventListener("click", () => {
      renderProductDetails(p);
    });

    
    card.querySelector(".add-to-cart").addEventListener("click", () => {
      cart.addProduct(p, 1);
      renderCart();
    });

    
    card.querySelector(".add-to-favorites").addEventListener("click", () => {
      if (!favorites.some(f => f.id === p.id)) {
        favorites.push(p);
      }
      renderFavorites();
    });

    container.appendChild(card);
  });
}


document.querySelector("#nav-home").addEventListener("click", () => {
  renderProducts();
});

document.querySelector("#nav-cart").addEventListener("click", () => {
  hideAllViews();
  document.querySelector("#cart-view").style.display = "block";
  renderCart();
});

document.querySelector("#nav-favorites").addEventListener("click", () => {
  hideAllViews();
  document.querySelector("#favorites-view").style.display = "block";
  renderFavorites();
});


renderProducts();

export { cart, favorites, renderCart, renderFavorites, renderProductDetails };
