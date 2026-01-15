import { cart, favorites, updateCartBadge, toggleFavorite } from "../main.js";

export function renderProductDetails(product) {
  const list = document.querySelector("#product-list");
  const filters = document.querySelector("#category-filters");
  const details = document.querySelector("#product-details");

 
  if (list) list.style.display = "none";
  if (filters) filters.style.display = "none";
  details.style.display = "block";

  
  details.innerHTML = `
    <div class="product-details-content">
      <button id="back-button" class="filter-btn">← Tagasi</button>
      
      <div class="details-layout">
        <div class="details-image-container">
          <img src="${product.image}" alt="${product.title}" class="detail-image">
        </div>
        
        <div class="details-info">
          <h2>${product.title}</h2>
          <span class="category-tag">${product.category}</span>
          <p class="price-large">€${product.price.toFixed(2)}</p>
          
          <div class="description-box">
            <h4>Toote kirjeldus</h4>
            <p>${product.description || 'Kirjeldus puudub.'}</p>
          </div>

          <div class="detail-buttons">
            <button class="add-to-cart" id="detail-add-cart">Lisa korvi</button>
            <button class="add-to-favorites" id="detail-add-fav">
              ${favorites.some((f) => f.id === product.id) ? "❤️ Lemmikutes" : "🤍 Lisa lemmikuks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  

  details.querySelector("#back-button").addEventListener("click", () => {
    details.style.display = "none";
    if (list) list.style.display = "flex";
    if (filters) filters.style.display = "flex";
  });

  
  details.querySelector("#detail-add-cart").addEventListener("click", () => {
    cart.addProduct(product, 1);
    updateCartBadge(); 
  });

  
  details.querySelector("#detail-add-fav").addEventListener("click", async () => {
    await toggleFavorite(product);
    renderProductDetails(product); 
  });
}