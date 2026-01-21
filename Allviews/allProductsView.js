export function renderProducts(items, currentFavs, onCartClick, onFavClick) {
    const container = document.querySelector("#product-list");
    if (!container) return;
    container.innerHTML = "";

    items.forEach(p => {
        const isFav = currentFavs.some(f => f.id === p.id);
        const count = p.rating?.count ?? 0;
        const card = document.createElement("div");
        card.className = "product-card";
        
        card.innerHTML = `
            <img src="${p.image}" class="product-image">
            <h3 class="product-title">${p.title}</h3>
            <div class="product-rating">⭐ ${p.rating?.rate || 0}</div>
            <div class="stock-status">Laos: ${count} tk</div>
            <p class="price">€${p.price.toFixed(2)}</p>
            <button class="add-to-cart" ${count <= 0 ? "disabled" : ""}>
                ${count <= 0 ? "Otsas" : "Lisa korvi"}
            </button>
            <button class="add-to-favorites">
                ${isFav ? "❤️ Lemmik" : "🤍 Lemmikuks"}
            </button>
        `;

        card.querySelector(".add-to-cart").onclick = () => onCartClick(p);
        card.querySelector(".add-to-favorites").onclick = () => onFavClick(p);
        
        container.appendChild(card);
    });
}