export class Cart {
    constructor() {
        this.items = [];
    }

    addProduct(product, quantity) {
        const existing = this.items.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
    }

    removeProduct(productId) {
        this.items = this.items.filter(i => i.product.id !== productId);
    }

calculateTotal() {
    const sum = this.items
        .reduce((total, i) => total + i.product.price * i.quantity, 0);

    return Number(sum.toFixed(2));
}

    get totalItems() {
        return this.items.reduce((sum, i) => sum + i.quantity, 0);
    }
}