let promoDiscount = 0;
const SHIPPING_FEE = 150;

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const discountEl = document.getElementById("cart-discount");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p class='text-center text-muted'>Your cart is empty.</p>";
    subtotalEl.textContent = "₱0";
    discountEl.textContent = "₱0";
    shippingEl.textContent = "₱0";
    totalEl.textContent = "₱0";
    return;
  }

  let subtotal = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const rowTotal = item.price * item.quantity;
    subtotal += rowTotal;

    const row = document.createElement("div");
    row.className = "row align-items-center mb-3";

    row.innerHTML = `
      <div class="col-md-4"><strong>${item.name}</strong></div>
      <div class="col-md-2">₱${item.price}</div>
      <div class="col-md-3">
        <button class="btn btn-sm btn-outline-secondary decrease">−</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary increase">+</button>
      </div>
      <div class="col-md-2 text-end">₱${rowTotal}</div>
      <div class="col-md-1 text-end">
        <button class="btn btn-sm btn-danger remove">✕</button>
      </div>
    `;

    row.querySelector(".decrease").onclick = () => {
      if (cart[index].quantity > 1) cart[index].quantity--;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    };

    row.querySelector(".increase").onclick = () => {
      cart[index].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    };

    row.querySelector(".remove").onclick = () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    };

    cartItemsContainer.appendChild(row);
  });

  const discount = (subtotal * promoDiscount) / 100;
  const total = subtotal - discount + SHIPPING_FEE;

  subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  discountEl.textContent = `₱${discount.toFixed(2)}`;
  shippingEl.textContent = `₱${SHIPPING_FEE.toFixed(2)}`;
  totalEl.textContent = `₱${total.toFixed(2)}`;
}

function applyPromo() {
  const code = document.getElementById("promoCode").value;

  fetch("/api/promo/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid promo");
      return res.json();
    })
    .then(data => {
      promoDiscount = data.discountPercent;
      alert(`Promo applied! ${promoDiscount}% discount`);
      renderCart();
    })
    .catch(() => alert("Invalid promo code"));
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

 const name = document.getElementById("cust-name").value;
const email = document.getElementById("cust-email").value;
const phone = document.getElementById("cust-phone").value;   // ✅
const address = document.getElementById("cust-address").value;


  if (!name || !email || !phone || !address) {
    alert("Please enter your name, email, phone, and delivery address.");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const total = subtotal - discount + SHIPPING_FEE;

  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: { name, email, phone, address },
      items: cart.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      })),
      subtotal,
      discount,
      shipping: SHIPPING_FEE,
      total
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Checkout failed");
      return res.json();
    })
    .then(() => {
      localStorage.removeItem("cart");
      alert("Order placed successfully!");
      window.location.href = "/shop.html";
    })
    .catch(() => alert("Checkout failed"));
}
