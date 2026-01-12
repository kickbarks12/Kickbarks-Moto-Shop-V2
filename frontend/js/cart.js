let promoDiscount = Number(localStorage.getItem("promoDiscount")) || 0;
let appliedVoucher = localStorage.getItem("appliedVoucher") || null;
let myVouchers = JSON.parse(localStorage.getItem("myVouchers")) || [];
let freeShipping = localStorage.getItem("freeShipping") === "true";



const SHIPPING_FEE = 150;

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderVoucherWallet();
  showDailyVoucherPopup();
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
row.className = "row align-items-center mb-3 cart-row";


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

// 🚚 Shipping logic
const shippingCost = freeShipping ? 0 : SHIPPING_FEE;
const total = subtotal - discount + shippingCost;

/* ===== Voucher display ===== */
const voucherRow = document.getElementById("voucher-row");

if (appliedVoucher && promoDiscount > 0) {
  voucherRow.classList.remove("d-none");
  voucherRow.querySelector(".voucher-code").textContent = appliedVoucher;
  voucherRow.querySelector(".voucher-amount").textContent = `-₱${discount.toFixed(2)}`;
} else {
  voucherRow.classList.add("d-none");
}

/* ===== Totals ===== */
subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
discountEl.textContent = `₱${discount.toFixed(2)}`;
shippingEl.textContent = freeShipping ? "₱0 (FREE)" : `₱${SHIPPING_FEE.toFixed(2)}`;
totalEl.textContent = `₱${total.toFixed(2)}`;


}

function applyPromo() {
  const code = document.getElementById("promoCode").value.trim();
  

  fetch("/api/promo/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid");
      return res.json();
    })
    .then(data => {
  promoDiscount = data.discountPercent;
  appliedVoucher = code.toUpperCase();

  if (!myVouchers.includes(appliedVoucher)) {
    myVouchers.push(appliedVoucher);
    localStorage.setItem("myVouchers", JSON.stringify(myVouchers));
  }

  localStorage.setItem("appliedVoucher", appliedVoucher);
  localStorage.setItem("promoDiscount", promoDiscount);

  alert(`🎉 Voucher ${appliedVoucher} applied!`);
  renderCart();
  renderVoucherWallet();
})


    .catch(() => alert("Invalid or expired promo code"));
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
     shipping: shippingCost,
      total
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Checkout failed");
      return res.json();
    })
    .then(() => {
      localStorage.removeItem("cart");
localStorage.removeItem("promoDiscount");
localStorage.removeItem("freeShipping");
      alert("Order placed successfully!");
      window.location.href = "/shop.html";
    })
    .catch(() => alert("Checkout failed"));
}

let voucherCountdown;

function showFreeShipOffer() {
  let time = 5;
  document.getElementById("voucherTimer").textContent = time;
  document.getElementById("freeShipPopup").classList.remove("d-none");

  voucherCountdown = setInterval(() => {
    time--;
    document.getElementById("voucherTimer").textContent = time;

    if (time <= 0) {
      clearInterval(voucherCountdown);
      closeVoucherPopup();
      checkout(); // continue checkout normally
    }
  }, 1000);
}

function closeVoucherPopup() {
  document.getElementById("freeShipPopup").classList.add("d-none");
}

function claimFreeShipping() {
  clearInterval(voucherCountdown);
  document.getElementById("freeShipPopup").classList.add("d-none");

  fetch("/api/promo/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "FREEDEL" })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
  if (!data.freeShipping) {
    alert("This voucher does not give free shipping");
    return;
  }

  freeShipping = true;
localStorage.setItem("freeShipping", "true");

  appliedVoucher = "FREEDEL";

  // 🔐 Mark as claimed today
  localStorage.setItem("lastFreeDelClaim", new Date().toDateString());

  // 💼 Save in wallet
  if (!myVouchers.includes("FREEDEL")) {
    myVouchers.push("FREEDEL");
    localStorage.setItem("myVouchers", JSON.stringify(myVouchers));
  }

  alert("🎉 Free shipping voucher saved to your wallet!");
  renderCart();
  renderVoucherWallet();
})

    .catch(() => alert("Voucher not available"));
}


function renderVoucherWallet() {
  const wallet = document.getElementById("voucherWallet");

  if (!wallet) return;

  if (myVouchers.length === 0) {
    wallet.innerHTML = "<p class='text-muted'>No vouchers yet</p>";
    return;
  }

  wallet.innerHTML = "";

  myVouchers.forEach(code => {
    const card = document.createElement("div");
    card.className = "voucher-card";

    card.innerHTML = `
      <strong>${code}</strong>
      <button class="btn btn-sm btn-dark mt-2">Use</button>
    `;

    card.querySelector("button").onclick = () => {
      document.getElementById("promoCode").value = code;
      applyPromo();
    };

    wallet.appendChild(card);
  });
}

function showDailyVoucherPopup() {
  const lastClaim = localStorage.getItem("lastFreeDelClaim");
  const today = new Date().toDateString();

  if (lastClaim === today) return; // already claimed today

  document.getElementById("freeShipPopup").classList.remove("d-none");
}
