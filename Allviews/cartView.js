export function renderCart(cart, onUpdate) {
    const container = document.querySelector("#product-list");
    if (!container) return;

    // Pealkiri kasutab nüüd CSS-is olevat gradient-stiili
    container.innerHTML = `<h1 class="view-title">Sinu ostukorv</h1>`;

    if (cart.items.length === 0) {
        container.innerHTML += `<p style="text-align:center; font-size:1.2rem; margin-top:20px;">Ostukorv on tühi.</p>`;
        return;
    }

    const cartTable = document.createElement("div");
    cartTable.className = "cart-container";

    cart.items.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-row"; // Vastab sinu CSS grid-süsteemile
        row.innerHTML = `
            <img src="${item.product.image}" class="cart-thumb">
            <div class="cart-info">
                <h4>${item.product.title}</h4>
                <p>${item.qty} tk x €${item.product.price.toFixed(2)}</p>
            </div>
            <div class="cart-subtotal">
                €${(item.product.price * item.qty).toFixed(2)}
            </div>
            <div class="cart-actions">
                <button class="remove-item">×</button>
            </div>
        `;

        // Eemaldamise nupp kasutab sinu CSS-i ümmargust .remove-item stiili
        row.querySelector(".remove-item").onclick = () => {
            cart.removeProduct(item.product.id);
            onUpdate(); 
        };

        cartTable.appendChild(row);
    });

    // Jaluse osa koos kogusummaga
    const totals = cart.calculateTotals(); // Kasutame sinu Cart klassi põhjalikku arvutust
    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total-section";
    totalDiv.innerHTML = `
        <div style="margin-bottom: 10px; opacity: 0.8;">
            <p>Vahesumma: €${totals.subtotal.toFixed(2)}</p>
            <p>KM (20%): €${totals.vat.toFixed(2)}</p>
        </div>
        <h2 style="margin: 0; color: #4a00e0;">Kokku: €${totals.total.toFixed(2)}</h2>
        <button id="btn-checkout" style="margin-top: 20px;">Kinnita ost</button>
    `;

    container.appendChild(cartTable);
    container.appendChild(totalDiv);

    // Lisa funktsionaalsus "Kinnita ost" nupule
    const checkoutBtn = totalDiv.querySelector("#btn-checkout");
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            alert("Täname ostu eest! Sinu tellimus on vormistatud.");
            cart.clear();
            onUpdate();
        };
    }
}