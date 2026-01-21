import { stateActions, cart } from "../state.js";

export function renderCart(cartObj, onUpdate) {
  const container = document.querySelector("#product-list");
  if (!container) return;

  container.innerHTML = `<h1 class="view-title">Sinu ostukorv</h1>`;

  // 1. Kontroll, kas ostukorv on tühi
  if (!cartObj.items || cartObj.items.length === 0) {
    container.innerHTML += `<p style="text-align:center; font-size:1.2rem; margin-top:20px;">Ostukorv on tühi.</p>`;

    stateActions.updateBadge();
    return;
  }

  const cartTable = document.createElement("div");
  cartTable.className = "cart-container";

  cartObj.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.style.cssText =
      "display: flex; align-items: center; gap: 20px; padding: 15px; border-bottom: 1px solid #eee; background: white;";

    row.innerHTML = `
            <img src="${item.image}" style="width: 60px; height: 60px; object-fit: contain;">
            <div style="flex: 1;">
                <h4 style="margin: 0;">${item.title}</h4>
                <p style="margin: 5px 0; color: #666;">€${item.price.toFixed(2)} / tk</p>
            </div>
            
            <div class="quantity-controls" style="display: flex; align-items: center; gap: 10px; border: 1px solid #ddd; padding: 5px; border-radius: 5px;">
                <button class="qty-btn minus" style="width:25px; height:25px; cursor:pointer; border:none; background:#eee; border-radius:3px;">-</button>
                <span style="font-weight:bold; min-width: 25px; text-align:center;">${item.quantity}</span>
                <button class="qty-btn plus" style="width:25px; height:25px; cursor:pointer; border:none; background:#eee; border-radius:3px;">+</button>
            </div>

            <div style="font-weight: bold; min-width: 90px; text-align: right;">
                €${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <div class="cart-actions">
                <button class="remove-item" style="color:red; background:none; border:none; cursor:pointer; font-size:1.5rem; padding: 0 10px;">×</button>
            </div>
        `;

    // --- SÜNDMUSTE SIDUMINE ---

    // Miinus nupp
    row.querySelector(".minus").onclick = (e) => {
      e.preventDefault();
      cart.updateQuantity(item.id, -1);
      onUpdate();
    };

    // Pluss nupp
    row.querySelector(".plus").onclick = (e) => {
      e.preventDefault();
      cart.updateQuantity(item.id, 1);
      onUpdate();
    };

    // Eemaldamise nupp (X märk)
    row.querySelector(".remove-item").onclick = (e) => {
      e.preventDefault();
      cart.removeProduct(item.id);
      onUpdate();
    };

    cartTable.appendChild(row);
  });

  //(Summad ja Kinnitamine)
  const subtotal = cart.getTotal();
  const total = subtotal * 1.2;

  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
        <div style="text-align: right; margin-top: 20px; padding: 25px; background: #f8f9fa; border-radius: 12px; border: 1px solid #eee;">
            <p style="margin: 5px 0;">Vahesumma: €${subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0; opacity: 0.7;">KM (20%): €${(subtotal * 0.2).toFixed(2)}</p>
            <h2 style="margin: 10px 0; color: #4a00e0;">Kokku: €${total.toFixed(2)}</h2>
            <button id="checkout-btn" style="margin-top: 15px; padding: 15px 35px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1rem; width: 100%; max-width: 300px;">
                KINNITA OST
            </button>
        </div>
    `;

  container.appendChild(cartTable);
  container.appendChild(totalDiv);

  // Ostu kinnitamise nupp
  const checkoutBtn = totalDiv.querySelector("#checkout-btn");
  checkoutBtn.onclick = () => {
    if (stateActions.checkout()) {
      window.location.hash = "#home";
      onUpdate();
    }
  };
}
