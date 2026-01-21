import { FetchProducts } from "./api.js";
import { products, favorites, cart, stateActions } from "./state.js";
import { renderProducts } from "./Allviews/allProductsView.js";
import { renderCart } from "./Allviews/cartView.js";

async function initApp() {

    // 2. Andmete laadimine serverist
    const data = await FetchProducts();
    stateActions.setProducts(data);
    
    // 3. Keskne värskendamise loogika
    const refreshUI = () => { 
        handleRouting(); 
        stateActions.updateBadge(); 
    };

    const onCartAction = (p) => { 
        cart.addProduct(p, 1); 
        stateActions.updateBadge(); 
    };
    
    const onFavAction = (p) => { 
        stateActions.toggleFav(p); 
        refreshUI(); 
    };

    // 4. NAVIGATSIOON (Logo ja ikoonid)
    const setupNav = () => {
        const logo = document.querySelector(".header-logo img") || document.querySelector("header img");
        const navHome = document.querySelector(".fa-home")?.parentElement;
        const navFavs = document.querySelector(".fa-heart")?.parentElement;
        const navCart = document.querySelector(".fa-shopping-cart")?.parentElement;

        if (logo) logo.onclick = () => window.location.hash = "#home";
        if (navHome) navHome.onclick = () => window.location.hash = "#home";
        if (navFavs) navFavs.onclick = () => window.location.hash = "#favorites";
        if (navCart) navCart.onclick = () => window.location.hash = "#cart";
    };

    // 5. OTSING
    const setupSearch = () => {
        const searchInput = document.querySelector("#search-input");
        if (searchInput) {
            searchInput.oninput = (e) => {
                const term = e.target.value.toLowerCase();
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
    };

    // 6. ROUTING (Vaadete vahetamine)
    const handleRouting = () => {
        const hash = window.location.hash;
        const container = document.querySelector("#product-list");
        
        if (container) container.innerHTML = "";

        // Kontrollime hashi ja kuvame vastava vaate
        if (hash === "#cart") {
            renderCart(cart, refreshUI);
        } else if (hash === "#favorites") {
            renderProducts(favorites, favorites, onCartAction, onFavAction);
        } else if (hash === "#login") {
            renderLogin(); // Kutsub esile Allviews/loginView.js loogika
        } else {
            renderProducts(products, favorites, onCartAction, onFavAction);
        }
        
    };

    // KÄIVITAMINE
    setupNav();
    setupSearch();
    
    // Kuulame hashi muutust
    window.addEventListener("hashchange", handleRouting);
    
    // Esimene laadimine
    handleRouting(); 
    stateActions.updateBadge();
}

// Rakenduse start
initApp();