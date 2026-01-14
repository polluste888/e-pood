export class Cart {
  constructor() {
    this.items = [];
  }

  addProduct(product, qty = 1) {
    const existing = this.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ product, qty });
    }
  }

  changeQty(productId, newQty) {
    const item = this.items.find((i) => i.product.id === productId);
    if (item) {
      item.qty = parseInt(newQty);
    }
  }

  removeProduct(productId) {
    this.items = this.items.filter((i) => i.product.id !== productId);
  }

  clear() {
    this.items = [];
  }

  calculateTotals() {
    const subtotal = this.items.reduce(
      (sum, i) => sum + i.product.price * i.qty,
      0
    );
    const vat = subtotal * 0.2;
    const total = subtotal + vat;
    return { subtotal, vat, total };
  }
}
