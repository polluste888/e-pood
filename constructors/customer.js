import { Order } from "../constructors/order.js";

export class Customer {
  constructor(name) {
    this.name = name;
    this.orderHistory = [];
  }

  placeOrder(cart) {
    const order = new Order(cart);
    this.orderHistory.push(order);
    return order;
  }

  getLastOrder() {
    return this.orderHistory[this.orderHistory.length - 1] || null;
  }

  printOrderHistory() {
    console.log(`Tellimuste ajalugu – ${this.name}`);

    if (this.orderHistory.length === 0) {
      console.log("Kliendil pole veel tellimusi.");
      return;
    }

    this.orderHistory.forEach((order, index) => {
      console.log(
        `${index + 1}. Kuupäev: ${order.orderDate.toLocaleString()} | Summa: ${order.cart.calculateTotal()} €`
      );
    });
  }
}
