document.addEventListener("DOMContentLoaded", () => {
  // ================= CONSTANTS =================
  const SHIPPING_FEE = 150;

  // ================= STATE =================
  let appliedVoucher = getStored("appliedVoucher");
  let myVouchers = getStored("myVouchers") || [];
  let usedVouchers = getStored("usedVouchers") || [];
  let freeShipping = localStorage.getItem("freeShipping") === "true";

  // ================= ELEMENTS =================
  const els = {
    items: document.getElementById("cart-items"),
    subtotal: document.getElementById("cart-subtotal"),
    discount: document.getElementById("cart-discount"),
    shipping: document.getElementById("cart-shipping"),
    total: document.getElementById("cart-total"),
    voucherRow: document.getElementById("voucher-row"),
    checkoutBtn: document.getElementById("checkoutBtn"),
  };

  // If this is NOT the cart page, stop safely
  if (!els.items) return;

  // ================= INIT =================
  syncCartToServer();
  renderCart();
  renderVoucherWallet();

  if (els.checkoutBtn) {
    els.checkoutBtn.addEventListener("click", checkout);
  }

  // ================= RENDER CART =================
  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      els.items.innerHTML =
        "<p class='text-center text-muted'>Your cart is empty.</p>";
      updateTotals(0, 0, 0, 0);
      if (els.voucherRow) els.voucherRow.classList.add("d-none");
      return;
    }

    els.items.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const rowTotal = price * qty;
      subtotal += rowTotal;

      const row = document.createElement("div");
      row.className = "row align-items-center mb-3 cart-row";

      row.innerHTML = `
        <div class="col-md-4"><strong>${item.name}</strong></div>
        <div class="col-md-2">₱${price.toFixed(2)}</div>
        <div class="col-md-3">
          <button class="btn btn-sm btn-outline-secondary decrease">−</button>
          <span class="mx-2">${qty}</span>
          <button class="btn btn-sm btn-outline-secondary increase">+</button>
        </div>
        <div class="col-md-2 text-end">₱${rowTotal.toFixed(2)}</div>
        <div class="col-md-1 text-end">
          <button class="btn btn-sm btn-danger remove">✕</button>
        </div>
      `;

      row.querySelector(".decrease").addEventListener("click", () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCart(cart);
          renderCart();
        }
      });

      row.querySelector(".increase").addEventListener("click", () => {
        cart[index].quantity++;
        saveCart(cart);
        renderCart();
      });

      row.querySelector(".remove").addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      });

      els.items.appendChild(row);
    });

    const voucherDiscount = calculateVoucherDiscount(subtotal);
    const shippingCost = freeShipping ? 0 : SHIPPING_FEE;
    const total = subtotal - voucherDiscount + shippingCost;

    updateVoucherRow(els.voucherRow, voucherDiscount);
    updateTotals(subtotal, voucherDiscount, shippingCost, total);
  }

  // ================= TOTALS =================
  function updateTotals(subtotal, discount, shipping, total) {
    els.subtotal.textContent = `₱${subtotal.toFixed(2)}`;
    els.discount.textContent = `₱${discount.toFixed(2)}`;
    els.shipping.textContent =
      shipping === 0 ? "₱0.00 (FREE)" : `₱${shipping.toFixed(2)}`;
    els.total.textContent = `₱${total.toFixed(2)}`;
  }
});
