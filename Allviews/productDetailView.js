import { cart, favorites, stateActions } from "../state.js";

export function renderProductDetails(product) {
    const container = document.querySelector("#product-list");
    const filters = document.querySelector("#category-filters");
    const count = product.rating?.count ?? 0; // Võtame laoseisu

    if (filters) filters.style.display = "none";

    container.innerHTML = `
        <div class="product-details-content">
            <button id="back-button" class="back-link" style="cursor:pointer; margin-bottom: 20px; background:none; border:none; font-size:1.1rem; color:#4a00e0;">
                ← Tagasi tootenimekirja
            </button>
            
            <div class="details-layout" style="display: flex; gap: 40px; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <div class="details-image-container">
                    <img src="${product.image}" alt="${product.title}" style="max-width: 380px; width: 100%; border-radius: 10px; object-fit: contain;">
                </div>
                
                <div class="details-info" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <h1 style="margin-top: 0; font-size: 2rem; color: #333;">${product.title}</h1>
                    <span class="category-tag" style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; width: fit-content; color: #666; margin-bottom: 15px;">
                        ${product.category}
                    </span>
                    
                    <div class="description-box" style="margin: 20px 0; border-top: 1px solid #eee; padding-top: 20px;">
                        <h4 style="margin-bottom: 10px; color: #444;">Toote kirjeldus</h4>
                        <p style="line-height: 1.6; color: #555;">${product.description || 'Kirjeldus puudub.'}</p>
                        <p style="font-weight: bold; color: ${count <= 0 ? 'red' : '#444'}">
                            Lao seis: ${count > 0 ? count + ' tk' : 'LÄBI MÜÜDUD'}
                        </p>
                    </div>

                    <p class="price-large" style="font-size: 1.8rem; font-weight: bold; color: #4a00e0; margin-bottom: 30px;">
                        €${product.price.toFixed(2)}
                    </p>
                    
                    <div class="detail-buttons" style="display: flex; gap: 15px;">
                        <button class="auth-submit" id="detail-add-cart" 
                            ${count <= 0 ? "disabled style='background: gray; cursor: not-allowed;'" : "style='flex: 2; padding: 15px; background: #4a00e0; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1rem;'"}>
                            ${count <= 0 ? "Otsas" : "Lisa ostukorvi"}
                        </button>
                        <button id="detail-add-fav" style="flex: 1; padding: 15px; background: #f8f8f8; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                            ${favorites.some((f) => f.id === product.id) ? "❤️ Lemmik" : "🤍 Lemmikuks"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // TAGASI NUPP
    document.querySelector("#back-button").onclick = () => {
        window.location.hash = "#home";
    };

    // LISA OSTUKORVI
    const cartBtn = document.querySelector("#detail-add-cart");
    if (cartBtn && count > 0) {
        cartBtn.onclick = () => {
            cart.addProduct(product, 1);
            stateActions.updateBadge();
            
            cartBtn.innerText = "✅ Lisatud!";
            cartBtn.style.background = "#28a745";
            setTimeout(() => {
                cartBtn.innerText = "Lisa ostukorvi";
                cartBtn.style.background = "#4a00e0";
            }, 1500);
        };
    }

    // LEMMIKUD
    document.querySelector("#detail-add-fav").onclick = () => {
        stateActions.toggleFav(product);
        renderProductDetails(product); 
    };
}