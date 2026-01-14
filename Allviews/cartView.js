import { cart } from "../main.js";

export function renderCart() {
  const container = document.querySelector("#cart-view");
  container.innerHTML = "<h2>Ostukorv</h2>";

  if (cart.items.length === 0) {
    container.innerHTML += "<p>Ostukorv on tühi.</p>";
    return;
  }

  cart.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.product.image}" alt="${
      item.product.title
    }" class="cart-image">
      <p>${item.product.title}</p>

      <div class="quantity-controls">
        <button class="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="increase">+</button>
      </div>

      <button class="remove">Remove</button>

      <p>€${(item.product.price * item.quantity).toFixed(2)}</p>
    `;

    div.querySelector(".increase").addEventListener("click", () => {
      item.quantity++;
      renderCart();
    });

    div.querySelector(".decrease").addEventListener("click", () => {
      item.quantity--;
      if (item.quantity <= 0) {
        cart.removeProduct(item.product.id);
      }
      renderCart();
    });

    div.querySelector(".remove").addEventListener("click", () => {
      cart.removeProduct(item.product.id);
      renderCart();
    });

    container.appendChild(div);
  });

  const total = document.createElement("p");
  total.innerHTML = `<strong>Kogusumma: €${cart
    .calculateTotal()
    .toFixed(2)}</strong>`;
  container.appendChild(total);
}
