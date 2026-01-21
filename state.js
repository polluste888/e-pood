import { Cart } from "./constructors/cart.js";

export let products = [];
export let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
export const cart = new Cart();

export const stateActions = {
    setProducts: (data) => { products = data; },
    
    toggleFav: (product) => {
        const index = favorites.findIndex(f => f.id === product.id);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(product);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
    },
    
    // Uuendab ostukorvi numbrit päises
    updateBadge: () => {
        const badge = document.querySelector("#cart-count");
        if (badge) {
            const total = cart.items.reduce((sum, item) => sum + item.qty, 0);
            badge.textContent = total;
            badge.style.display = total > 0 ? "block" : "none";
        }
    }
};