
class Product {
  constructor(id, title, price, category) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.category = category;
  }

  describe() {
    return `${this.title} – ${this.price} € (${this.category})`;
  }

  static discountedPrice(price, discountPercent) {
    return price - (price * discountPercent) / 100;
  }
}




















class Cart {
  constructor() {
    this.items = []; 
  }

  addProduct(product, quantity = 1) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeProduct(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  calculateTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}


class Order {
  constructor(cart) {
    this.orderDate = new Date();
    this.cart = cart;
  }

  printOrder() {
    console.log("Tellimuse kuupäev:", this.orderDate.toLocaleString());
    console.log("Tellimuse tooted:");
    this.cart.items.forEach(item => {
      console.log(
        `${item.product.title} x${item.quantity} – ${item.product.price} €/tk`
      );
    });
    console.log("Kokku:", this.cart.calculateTotal(), "€");
  }
}


class Customer {
  constructor(name) {
    this.name = name;
    this.orderHistory = [];
  }

  placeOrder(cart) {
    const order = new Order(cart);
    this.orderHistory.push(order);
    console.log(`${this.name} tegi uue tellimuse.`);
    return order;
  }

  printOrderHistory() {
    console.log(`Tellimuste ajalugu kliendil ${this.name}:`);
    this.orderHistory.forEach((order, index) => {
      console.log(
        `#${index + 1} – ${order.orderDate.toLocaleString()}, summa: ${order.cart.calculateTotal()} €`
      );
    });
  }
}




const laptop = new Product(1, "Sülearvuti", 999.99, "Elektroonika");
const phone = new Product(2, "Telefon", 499.99, "Elektroonika");

console.log(laptop.describe());
console.log("Allahinnatud hind:", Product.discountedPrice(laptop.price, 10));

const cart = new Cart();
cart.addProduct(laptop, 2);
cart.addProduct(phone, 1);

console.log("Ostukorvi kogusumma:", cart.calculateTotal());
console.log("Ostukorvis kokku tooteid:", cart.totalItems);

const customer = new Customer("Alice");
const order = customer.placeOrder(cart);
order.printOrder();

customer.printOrderHistory();
