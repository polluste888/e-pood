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
            <a href="#product/${p.id}" class="product-detail-link" style="text-decoration: none; color: inherit;">
                <img src="${p.image}" class="product-image" style="cursor: pointer;">
                <h3 class="product-title" style="cursor: pointer;">${p.title}</h3>
            </a>
            
            <div class="product-rating">⭐ ${p.rating?.rate || 0}</div>
            <div class="stock-status" style="color: ${count <= 0 ? 'red' : 'green'}">
                ${count <= 0 ? "Otsas" : `Laos: ${count} tk`}
            </div>
            <p class="price">€${p.price.toFixed(2)}</p>
            
            <button class="add-to-cart" ${count <= 0 ? "disabled style='background: gray; cursor: not-allowed;'" : ""}>
                ${count <= 0 ? "Otsas" : "Lisa korvi"}
            </button>
            <button class="add-to-favorites">
                ${isFav ? "❤️ Lemmik" : "🤍 Lemmikuks"}
            </button>
        `;

        card.querySelector(".add-to-cart").onclick = (e) => {
            e.preventDefault();    
            e.stopPropagation();   
            onCartClick(p);        
        };

        card.querySelector(".add-to-favorites").onclick = (e) => {
            e.stopPropagation();
            onFavClick(p);
        };
        
        container.appendChild(card);
    });
}