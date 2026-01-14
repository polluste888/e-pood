export class Order {
  constructor(cart) {
    this.orderDate = new Date();
    this.cart = cart;
  }

  printOrder() {
    console.log("Tellimuse kuupäev:", this.orderDate.toLocaleString());
    console.log("Tooted:");

    this.cart.items.forEach((item) => {
      const lineTotal = (item.product.price * item.quantity).toFixed(2);
      console.log(`- ${item.product.title} x${item.quantity} = €${lineTotal}`);
    });

    console.log("Kogusumma:", this.cart.calculateTotal().toFixed(2) + "€");
  }
}
