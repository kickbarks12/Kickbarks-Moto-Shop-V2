// ================= FLASH SALE TIMER =================

let totalSeconds = 2 * 60 * 60; // 2 hours

function updateFlashTimer() {
  totalSeconds--;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hoursEl = document.getElementById("flashHours");
  const minutesEl = document.getElementById("flashMinutes");
  const secondsEl = document.getElementById("flashSeconds");

  if (!hoursEl) return; // prevents JS errors on other pages

  hoursEl.textContent = String(h).padStart(2, "0");
  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
}

// Run every second
setInterval(updateFlashTimer, 1000);

// ================= FLASH SALE CART =================

// Get existing cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add flash product to cart
function addFlashToCart(product) {
  let cart = getCart();

  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.quantity += 1;

  } else {
    cart.push({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  quantity: 1
});

  }

  saveCart(cart);
  // 🔐 If logged in, save to MongoDB
const customer = JSON.parse(localStorage.getItem("customer"));
if (customer) {
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
}

// 🛒 Add to cart button
document.addEventListener("click", function (e) {
  if (e.target.closest(".add-flash-cart")) {
    const btn = e.target.closest(".add-flash-cart");

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image
    };

    addFlashToCart(product);

    btn.innerHTML = "✔";
    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-cart-plus"></i>';
    }, 700);
  }
});

// ⚡ Buy Now button
document.addEventListener("click", function (e) {
  if (e.target.closest(".buy-flash-now")) {
    const btn = e.target.closest(".buy-flash-now");

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image
    };

    // overwrite cart with only this item
    const cart = [{ ...product, quantity: 1 }];
localStorage.setItem("cart", JSON.stringify(cart));

const customer = JSON.parse(localStorage.getItem("customer"));
if (customer) {
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


    window.location.href = "cart.html";
  }
});

