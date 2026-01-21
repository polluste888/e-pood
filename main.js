import { FetchProducts } from "./api.js";
import { products, favorites, cart, stateActions, currentUserId } from "./state.js";
import { renderProducts } from "./Allviews/allProductsView.js";
import { renderCart } from "./Allviews/cartView.js";
import { renderProductDetails } from "./Allviews/productDetailView.js";

async function initApp() {
    console.log("Sessiooni ID:", currentUserId);

    // 1. ANDMETE LAADIMINE
    try {
        const data = await FetchProducts();
        stateActions.setProducts(data); 
        stateActions.loadFavorites(); 
    } catch (err) {
        console.error("Viga andmete laadimisel:", err);
    }

    // 2. UI VÄRSKENDAMISE ABIFUNKTSIOONID
    const refreshUI = (shouldScroll = true) => { 
        handleRouting(shouldScroll); 
        stateActions.updateBadge(); 
    };

    const onCartAction = (p) => { 
        cart.addProduct(p, 1); 
        stateActions.updateBadge(); 
    };
    
    const onFavAction = (p) => { 
        stateActions.toggleFav(p); 
        refreshUI(false); 
    };

    // 3. NAVIGATSIOON
    const homeBtn = document.querySelector(".fa-home")?.closest("a") || document.querySelector(".fa-home");
    const favsBtn = document.querySelector(".fa-heart")?.closest("a") || document.querySelector(".fa-heart");
    const cartBtn = document.querySelector(".fa-shopping-cart")?.closest("a") || document.querySelector(".fa-shopping-cart");

    if (homeBtn) homeBtn.onclick = (e) => { e.preventDefault(); window.location.hash = "#home"; };
    if (favsBtn) favsBtn.onclick = (e) => { e.preventDefault(); window.location.hash = "#favorites"; };
    if (cartBtn) cartBtn.onclick = (e) => { e.preventDefault(); window.location.hash = "#cart"; };

    // 4. OTSINGU LOOGIKA
    const searchInput = document.querySelector("#search-input");
    if (searchInput) {
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            if (window.location.hash !== "" && window.location.hash !== "#home") {
                window.location.hash = "#home";
            }
            const filtered = products.filter(p => 
                p.title.toLowerCase().includes(term) || 
                p.category.toLowerCase().includes(term)
            );
            const container = document.querySelector("#product-list");
            if (container) {
                container.innerHTML = "";
                renderProducts(filtered, favorites, onCartAction, onFavAction);
            }
        };
    }

    // 5. KATEGOORIA FILTRID
    const setupFilters = () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.onclick = () => {
                const cat = btn.getAttribute("data-category");
                stateActions.setCategory(cat);
                window.location.hash = "#home";
                if (searchInput) searchInput.value = "";
                refreshUI(true);
            };
        });
    };

    // 6. MARSRUUTIMINE (Routing)
    const handleRouting = (shouldScroll = true) => {
        const hash = window.location.hash;
        const container = document.querySelector("#product-list");
        const filters = document.querySelector("#category-filters");
        
        if (!container) return;
        container.innerHTML = "";

        // Filtrite haldus
        if (filters) {
            const isHome = hash === "" || hash === "#home";
            filters.style.display = isHome ? "flex" : "none";
            if (isHome) {
                const currentCat = localStorage.getItem("selectedCategory") || "all";
                filters.querySelectorAll(".filter-btn").forEach(btn => {
                    btn.classList.toggle("active", btn.getAttribute("data-category") === currentCat);
                });
            }
        }

        // Vaadete joonistamine
        if (hash === "#cart") {
    renderCart(cart, () => {
        refreshUI(false); // See kutsub updateBadge() ja handleRouting()
    });
    
        } else if (hash === "#favorites") {
            renderProducts(favorites, favorites, onCartAction, onFavAction);
        } else if (hash.startsWith("#product/")) {
            const productId = hash.split("/")[1];
            const product = products.find(p => p.id == productId);
            if (product) renderProductDetails(product, favorites, onCartAction, onFavAction);
        } else {
            const currentCat = localStorage.getItem("selectedCategory") || "all";
            const filtered = currentCat === "all" 
                ? products 
                : products.filter(p => p.category.toLowerCase() === currentCat.toLowerCase());
            
            renderProducts(filtered, favorites, onCartAction, onFavAction);
        }

        if (shouldScroll) window.scrollTo(0, 0);
    };

    // 7. KÄIVITAMINE
    setupFilters();
    window.addEventListener("hashchange", () => handleRouting(true));
    
    handleRouting(true); 
    stateActions.updateBadge();
}

initApp();