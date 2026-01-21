// state.js

// 1. Genereerime unikaalse sessiooni ID (iga refresh loob uue sessiooni korvi jaoks)
const generateNewUserID = () => 'user_' + Math.random().toString(36).substr(2, 9);
export const currentUserId = generateNewUserID();

export let products = [];
export let favorites = []; 
export let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// 2. Ostukorvi loogika
export const cart = {
    items: [],
    
    save() {
        localStorage.setItem(`cart_${currentUserId}`, JSON.stringify(this.items));
    },

    // Lisab toote ostukorvi (kasutatakse pealehel ja detailvaates)
    addProduct(product, quantity = 1) {
        if (!product || !product.id) return;

        const stockAvailable = product.rating?.count || 0;
        const existing = this.items.find(item => item.id === product.id);
        const currentQtyInCart = existing ? existing.quantity : 0;

        if (currentQtyInCart + quantity > stockAvailable) {
            alert(`Kahjuks ei ole rohkem tooteid laos! (Lao jääk: ${stockAvailable})`);
            return;
        }

        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.save();
    },

    // UUS: Muudab kogust otse ostukorvis (+ ja - nupud)
    updateQuantity(productId, change) {
        const item = this.items.find(i => i.id === productId);
        if (!item) return;

        // Leiame toote originaalse laoseisu peamisest massiivist
        const product = products.find(p => p.id === productId);
        const stockAvailable = product?.rating?.count || 0;

        const newQuantity = item.quantity + change;

        if (newQuantity < 1) {
            // Kui kogus läheb alla ühe, eemaldame toote
            this.removeProduct(productId);
        } else if (newQuantity > stockAvailable) {
            // Kontrollime, et ei ületaks laoseisu
            alert(`Rohkem tooteid pole laos! (Limiit: ${stockAvailable})`);
        } else {
            item.quantity = newQuantity;
        }

        this.save();
    },

    removeProduct(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    }
};

// 3. Rakenduse seisundi tegevused (Actions)
export const stateActions = {
    // Laeb tooted ja kontrollib, kas localStorage-is on juba salvestatud muudetud laoseisud
    setProducts(data) {
        const savedProducts = localStorage.getItem('local_products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        } else {
            products = Array.isArray(data) ? data : (data.products || []);
        }
    },

    // Salvestab toodete seisukorra (laoseisud) localStorage-isse
    saveProducts() {
        localStorage.setItem('local_products', JSON.stringify(products));
    },

    loadFavorites() {
        const saved = localStorage.getItem('last_favorites');
        favorites = saved ? JSON.parse(saved) : [];
    },

    setCategory(category) {
        selectedCategory = category;
        localStorage.setItem("selectedCategory", category);
    },

    toggleFav(product) {
        if (!product || !product.id) return;
        const index = favorites.findIndex(f => f.id === product.id);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(product);
        }
        localStorage.setItem('last_favorites', JSON.stringify(favorites));
    },

    updateBadge() {
        const badge = document.querySelector("#cart-badge");
        if (badge) {
            const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.innerText = total;
            badge.style.display = total > 0 ? "flex" : "none";
        }
    },

    // Sooritab ostu: vähendab laoseisu ja salvestab uue seisu püsivalt
    checkout() {
        if (cart.items.length === 0) {
            alert("Ostukorv on tühi!");
            return false;
        }

        // Vähendame toodete koguseid peamises massiivis
        cart.items.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product && product.rating) {
                product.rating.count -= cartItem.quantity;
            }
        });

        // Salvestame muudetud laoseisud, et need refreshi ajal ei kaoks
        this.saveProducts();

        // Tühjendame ostukorvi
        cart.items = [];
        cart.save();
        
        alert("Ost sooritatud! Täname tellimuse eest.");
        return true;
    }
};