import { FetchProducts } from "./api.js";
import {
  products,
  favorites,
  cart,
  stateActions,
  currentUserId,
} from "./state.js";
import { renderProducts } from "./Allviews/allProductsView.js";
import { renderCart } from "./Allviews/cartView.js";
import { renderProductDetails } from "./Allviews/productDetailView.js";

async function initApp() {
  console.log("Sessiooni ID:", currentUserId);

  // 1. ANDMETE JA OSTUKORVI LAADIMINE
  try {
    cart.load();
    stateActions.loadFavorites();

    const data = await FetchProducts();
    stateActions.setProducts(data);
  } catch (err) {
    console.error("Viga rakenduse käivitamisel:", err);
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

  // 3. NAVIGATSIOONI SÜNDMUSED (Hashide haldus)

  document.querySelectorAll("nav a").forEach((link) => {
    link.onclick = (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        stateActions.updateBadge();
      }
    };
  });

  // Logo viib alati koju
  const logo = document.querySelector("#nav-logo");
  if (logo) {
    logo.onclick = () => {
      window.location.hash = "#home";
    };
  }

  // 4. OTSINGU LOOGIKA
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.oninput = (e) => {
      const term = e.target.value.toLowerCase();

      // Kui kasutaja trükib, viime ta pealehele
      if (window.location.hash !== "" && window.location.hash !== "#home") {
        window.location.hash = "#home";
      }

      const filtered = products.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
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
    document.querySelectorAll(".filter-btn").forEach((btn) => {
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
    const pageTitle = document.querySelector("#page-title");

    if (!container) return;
    container.innerHTML = "";

    const isHome = hash === "" || hash === "#home";
    if (filters) filters.style.display = isHome ? "flex" : "none";
    if (searchInput)
      searchInput.parentElement.style.display = isHome ? "block" : "none";

    if (hash === "#cart") {
      if (pageTitle) pageTitle.innerText = "Sinu ostukorv";
      renderCart(cart, () => refreshUI(false));
    } else if (hash === "#favorites") {
      if (pageTitle) pageTitle.innerText = "Minu lemmikud";
      if (favorites.length === 0) {
        container.innerHTML = `<p style="text-align:center; margin-top:50px;">Sul pole veel ühtegi lemmikut.</p>`;
      } else {
        renderProducts(favorites, favorites, onCartAction, onFavAction);
      }
    } else if (hash.startsWith("#product/")) {
      const productId = hash.split("/")[1];
      const product = products.find((p) => p.id == productId);
      if (pageTitle) pageTitle.innerText = "Toote detailid";
      if (product) {
        renderProductDetails(product, favorites, onCartAction, onFavAction);
      }
    } else {
      if (pageTitle) pageTitle.innerText = "Kõik tooted";
      const currentCat = localStorage.getItem("selectedCategory") || "all";

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.getAttribute("data-category") === currentCat,
        );
      });

      const filtered =
        currentCat === "all"
          ? products
          : products.filter(
              (p) => p.category.toLowerCase() === currentCat.toLowerCase(),
            );

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
