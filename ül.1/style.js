class Product {
    constructor(id, title, price, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.category = category;
    }

    describe() {
        return `${this.title} | Hind: ${this.price}€ | Kategooria: ${this.category}`;
    }

    static discountedPrice(price, percent) {
        return price - (price * (percent / 100));
    }
}

class Cart {
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
        return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    }

    get totalItems() {
        return this.items.reduce((sum, i) => sum + i.quantity, 0);
    }
}

class Order {
    constructor(cart) {
        this.orderDate = new Date();
        this.cart = cart;
    }

    printOrder() {
        console.log("Tellimuse kuupäev:", this.orderDate.toLocaleString());
        console.log("Tooted:");

        this.cart.items.forEach(i => {
            console.log(`- ${i.product.title} x${i.quantity} = ${i.product.price * i.quantity}€`);
        });

        console.log("Kogusumma:", this.cart.calculateTotal() + "€");
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
        return order;
    }

    printOrderHistory() {
        console.log(`Tellimuste ajalugu: ${this.name}`);
        this.orderHistory.forEach((order, index) => {
            console.log(
                `${index + 1}. Kuupäev: ${order.orderDate.toLocaleString()} | Summa: ${order.cart.calculateTotal()}€`
            );
        });
    }
}

const phone = new Product(1, "Iphone 17 Pro Max", 1500, "Telefon");
console.log(phone.describe());
console.log(Product.discountedPrice(phone.price, 10));

const cart = new Cart();
cart.addProduct(phone, 5);

console.log("Kokku:", cart.calculateTotal());
console.log("Tooteid:", cart.totalItems);

const customer = new Customer("Rasmus");
const order = customer.placeOrder(cart);
order.printOrder();

customer.printOrderHistory();


