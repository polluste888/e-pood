export class Product {
  constructor(id, title, price, category, image) {
    this.id = id;
    this.title = title;
    this.price = Number(price);
    this.category = category;
    this.image = image || "placeholder.jpg"; 
  }

  describe() {
    return `${this.title} | Hind: €${this.price.toFixed(2)} | Kategooria: ${this.category}`;
  }

  static discountedPrice(price, percent) {
    const discount = price - (price * percent / 100);
    return Number(discount.toFixed(2));
  }
}
