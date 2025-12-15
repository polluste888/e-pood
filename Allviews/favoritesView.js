import { favorites } from "../main.js";

export function renderFavorites() {
  const container = document.querySelector("#favorites-view");
  container.innerHTML = "<h2>Lemmikud</h2>";

  
  if (favorites.length === 0) {
    container.innerHTML += "<p>Lemmikuid pole veel lisatud.</p>";
    return;
  }

  
  favorites.forEach((product) => {
    const div = document.createElement("div");
    div.className = "favorite-item";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="favorite-image">
      <p>${product.title} – €${product.price.toFixed(2)}</p>
      <button class="remove-fav">Remove</button>
    `;

    
    div.querySelector(".remove-fav").addEventListener("click", () => {
      const index = favorites.findIndex(f => f.id === product.id);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
      renderFavorites(); 
    });

    container.appendChild(div);
  });
}
