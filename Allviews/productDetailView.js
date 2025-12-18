import { cart, favorites } from "../main.js";
import { renderCart } from "./cartView.js";
import { renderFavorites } from "./favoritesView.js";

export function renderProductDetails(product) {
  const list = document.querySelector("#product-list");
  const details = document.querySelector("#product-details");

  list.style.display = "none";
  details.style.display = "block";

  details.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" alt="${product.title}" class="detail-image">
    <p>Kategooria: ${product.category}</p>
    <p>Hind: €${product.price.toFixed(2)}</p>
    <p id="product-description">Kirjeldus: Väga kvaliteetne ${
      product.title
    }.</p>

    <div class="detail-buttons">
      <button id="back-button">Tagasi</button>
      <button class="add-to-cart">Lisa korvi</button>
      <button class="add-to-favorites">Lisa lemmikutesse</button>
    </div>
  `;

  details.querySelector("#back-button").addEventListener("click", () => {
    details.style.display = "none";
    list.style.display = "flex";
  });

  details.querySelector(".add-to-cart").addEventListener("click", () => {
    cart.addProduct(product, 1);
    renderCart();
    console.log(`${product.title} lisatud ostukorvi.`);
  });

  details.querySelector(".add-to-favorites").addEventListener("click", () => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      favorites.push(product);
      renderFavorites();
      console.log(`${product.title} lisatud lemmikutesse.`);
    }
  });
}
