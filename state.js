// 1. KASUTAJA ID PARANDUS

let savedUserId = localStorage.getItem("shop_user_id");
if (!savedUserId) {
  savedUserId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("shop_user_id", savedUserId);
}
export const currentUserId = savedUserId;

export let products = [];
export let favorites = [];
export let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// 2. OSTUKORVI LOOGIKA
export const cart = {
  items: [],

  load() {
    const savedCart = localStorage.getItem(`cart_${currentUserId}`);
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  },

  save() {
    localStorage.setItem(`cart_${currentUserId}`, JSON.stringify(this.items));
  },

  addProduct(product, quantity = 1) {
    if (!product || !product.id) return;

    const stockAvailable = product.rating?.count || 0;
    const existing = this.items.find((item) => item.id === product.id);
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (currentQtyInCart + quantity > stockAvailable) {
      alert(
        `Kahjuks ei ole rohkem tooteid laos! (Lao jääk: ${stockAvailable})`,
      );
      return;
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      // Salvestame vaid vajalikud andmed
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }
    this.save();
  },

  updateQuantity(productId, change) {
    const item = this.items.find((i) => i.id === productId);
    if (!item) return;

    const product = products.find((p) => p.id === productId);
    const stockAvailable = product?.rating?.count || 0;
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      this.removeProduct(productId);
    } else if (newQuantity > stockAvailable) {
      alert(`Rohkem tooteid pole laos! (Limiit: ${stockAvailable})`);
    } else {
      item.quantity = newQuantity;
    }

    this.save();
  },

  removeProduct(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.save();
  },

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  },
};

// 3. RAKENDUSE TEGEVUSED
export const stateActions = {
  setProducts(data) {
    const savedProducts = localStorage.getItem("local_products");
    if (savedProducts) {
      products = JSON.parse(savedProducts);
    } else {
      products = Array.isArray(data) ? data : data.products || [];
    }
  },

  saveProducts() {
    localStorage.setItem("local_products", JSON.stringify(products));
  },

  loadFavorites() {
    const saved = localStorage.getItem("last_favorites");
    favorites = saved ? JSON.parse(saved) : [];
  },

  setCategory(category) {
    selectedCategory = category;
    localStorage.setItem("selectedCategory", category);
  },

  toggleFav(product) {
    if (!product || !product.id) return;
    const index = favorites.findIndex((f) => f.id === product.id);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(product);
    }
    localStorage.setItem("last_favorites", JSON.stringify(favorites));
  },

  updateBadge() {
    const badge = document.querySelector("#cart-badge");
    if (badge) {
      const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      badge.innerText = total;
      badge.style.display = total > 0 ? "flex" : "none";
    }
  },

  checkout() {
    if (cart.items.length === 0) {
      alert("Ostukorv on tühi!");
      return false;
    }

    cart.items.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (product && product.rating) {
        product.rating.count -= cartItem.quantity;
      }
    });

    this.saveProducts();
    cart.items = [];
    cart.save();

    alert("Ost sooritatud! Täname tellimuse eest.");
    return true;
  },
};
