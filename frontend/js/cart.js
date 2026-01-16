let promoDiscount = Number(localStorage.getItem("promoDiscount")) || 0;
let appliedVoucher = localStorage.getItem("appliedVoucher") || null;

// voucher wallet
let myVouchers = JSON.parse(localStorage.getItem("myVouchers")) || [];
let usedVouchers = JSON.parse(localStorage.getItem("usedVouchers")) || [];


let freeShipping = localStorage.getItem("freeShipping") === "true";


console.log("🔥 cart.js loaded");


const SHIPPING_FEE = 150;

document.addEventListener("DOMContentLoaded", () => {
  syncCartToServer();
  renderCart();
  renderVoucherWallet();
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
    const price = Number(item.price) || 0;
const qty = Number(item.quantity) || 0;
const rowTotal = price * qty;

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



// function applyPromo() {

//   const code = document.getElementById("promoCode").value.trim().toUpperCase();

// if (usedVouchers.includes(code)) {
//   alert("This voucher has already been used and cannot be used again.");
//   return;
// }

// // allow replacing existing voucher
// appliedVoucher = null;
// promoDiscount = 0;
// localStorage.removeItem("appliedVoucher");
// localStorage.removeItem("promoDiscount");

  
//   const code = document.getElementById("promoCode").value.trim();
  

//   fetch("/api/promo/validate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ code })
//   })
//     .then(res => {
//       if (!res.ok) throw new Error("Invalid");
//       return res.json();
//     })
//     .then(data => {
//   promoDiscount = data.discountPercent;
//   appliedVoucher = code.toUpperCase();

//   // if (!myVouchers.includes(appliedVoucher)) {
//   //   myVouchers.push(appliedVoucher);
//   //   localStorage.setItem("myVouchers", JSON.stringify(myVouchers));
//   // }

//   localStorage.setItem("appliedVoucher", appliedVoucher);
//   localStorage.setItem("promoDiscount", promoDiscount);

//   // remove voucher from wallet after use
// myVouchers = myVouchers.filter(v => v !== appliedVoucher);
// localStorage.setItem("myVouchers", JSON.stringify(myVouchers));

// alert(`🎉 Voucher ${appliedVoucher} applied and used!`);

//   renderCart();
//   renderVoucherWallet();
// })


//     .catch(() => alert("Invalid or expired promo code"));
// }
function applyPromo() {
  const code = document
    .getElementById("promoCode")
    .value
    .trim()
    .toUpperCase();

  if (!code) {
    alert("Please enter a promo code.");
    return;
  }

  // 🚫 block reused vouchers permanently
  if (usedVouchers.includes(code)) {
    alert("This voucher has already been used and cannot be used again.");
    return;
  }

  // allow replacing existing voucher
  appliedVoucher = null;
  promoDiscount = 0;
  localStorage.removeItem("appliedVoucher");
  localStorage.removeItem("promoDiscount");

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
      appliedVoucher = code;

      localStorage.setItem("promoDiscount", promoDiscount);
      localStorage.setItem("appliedVoucher", appliedVoucher);

      // ✅ permanently mark voucher as used
      usedVouchers.push(code);
      localStorage.setItem("usedVouchers", JSON.stringify(usedVouchers));

      // remove from wallet
      myVouchers = myVouchers.filter(v => v !== code);
      localStorage.setItem("myVouchers", JSON.stringify(myVouchers));

      alert(`🎉 Voucher ${code} applied and permanently used!`);

      renderCart();
      renderVoucherWallet();
    })
    .catch(() => alert("Invalid or expired promo code"));
}




function checkout() {
  const loggedInCustomer = JSON.parse(localStorage.getItem("customer"));

  if (!loggedInCustomer) {
    alert("Please login to continue checkout");
    window.location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // 🔥 Customer info
  const name = document.getElementById("cust-name").value || loggedInCustomer.name;
  const email = loggedInCustomer.email;   // FORCE real account email
  const phone = document.getElementById("cust-phone").value || loggedInCustomer.phone;
  const address = document.getElementById("cust-address").value;

  if (!name || !phone || !address) {
    alert("Please fill your name, phone and delivery address.");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const shippingCost = freeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shippingCost;

  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: {
        _id: loggedInCustomer._id, 
        name,
        email,
        phone,
        address
      },
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
      localStorage.removeItem("appliedVoucher");

      localStorage.removeItem("freeShipping");
      alert("Order placed successfully!");
      window.location.href = "my-orders.html";
    })
    .catch(err => {
      console.error(err);
      alert("Checkout failed");
    });
}




let voucherCountdown;


function renderVoucherWallet() {
  const wallet = document.getElementById("voucherWallet");

  if (!wallet) return;

  if (myVouchers.length === 0) {
    wallet.innerHTML = "<p class='text-muted'>No vouchers yet</p>";
    return;
  }

  wallet.innerHTML = "";

  function renderVoucherWallet() {
  const wallet = document.getElementById("voucherWallet");
  if (!wallet) return;

  if (myVouchers.length === 0) {
    wallet.innerHTML = "<p class='text-muted'>No vouchers available</p>";
    return;
  }

  wallet.innerHTML = "";

  myVouchers.forEach(code => {
    const card = document.createElement("div");
    card.className = "voucher-card d-flex justify-content-between align-items-center mb-2";

    card.innerHTML = `
      <strong>${code}</strong>
      <button class="btn btn-sm btn-dark">Use</button>
    `;

    card.querySelector("button").onclick = () => {
      if (appliedVoucher) {
        alert("You already used a voucher.");
        return;
      }

      document.getElementById("promoCode").value = code;
      applyPromo();
    };

    wallet.appendChild(card);
  });
}
}


function syncCartToServer() {
  const customer = JSON.parse(localStorage.getItem("customer"));
  if (!customer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  fetch("/api/customers/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: customer._id,
      cart: cart.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      }))
    })
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("checkoutBtn");

  console.log("Checkout button:", btn);

  if (btn) {
    btn.addEventListener("click", () => {
      console.log("🟢 Checkout button clicked");
      checkout();
    });
  }
});
