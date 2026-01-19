// ================= FLASH SALE TIMER =================
const FLASH_DURATION_SECONDS = 2 * 60 * 60; // 2 hours
let remainingSeconds = FLASH_DURATION_SECONDS;

const timerEls = {
  hours: document.getElementById("flashHours"),
  minutes: document.getElementById("flashMinutes"),
  seconds: document.getElementById("flashSeconds"),
};

if (timerEls.hours && timerEls.minutes && timerEls.seconds) {
  setInterval(updateFlashTimer, 1000);
}

function updateFlashTimer() {
  if (remainingSeconds <= 0) return;

  remainingSeconds--;

  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = remainingSeconds % 60;

  timerEls.hours.textContent = String(h).padStart(2, "0");
  timerEls.minutes.textContent = String(m).padStart(2, "0");
  timerEls.seconds.textContent = String(s).padStart(2, "0");
}

// ================= CART HELPERS =================
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCustomer() {
  try {
    return JSON.parse(localStorage.getItem("customer"));
  } catch {
    return null;
  }
}

// ================= CART SYNC =================
function syncCartToServer(cart) {
  const customer = getCustomer();
  if (!customer) return;

  fetch("/api/customers/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: customer._id,
      cart: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    }),
  }).catch((err) => console.error("Cart sync failed:", err));
}

// ================= FLASH SALE CART ACTIONS =================
function addFlashToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  syncCartToServer(cart);
}

function buyFlashNow(product) {
  const cart = [{ ...product, quantity: 1 }];
  saveCart(cart);
  syncCartToServer(cart);
  window.location.href = "cart.html";
}

// ================= EVENT DELEGATION =================
document.addEventListener("click", handleFlashActions);

function handleFlashActions(event) {
  const addBtn = event.target.closest(".add-flash-cart");
  const buyBtn = event.target.closest(".buy-flash-now");

  if (addBtn) {
    const product = extractProductData(addBtn);
    addFlashToCart(product);
    animateAddButton(addBtn);
    return;
  }

  if (buyBtn) {
    const product = extractProductData(buyBtn);
    buyFlashNow(product);
  }
}

// ================= HELPERS =================
function extractProductData(btn) {
  return {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: Number(btn.dataset.price),
    image: btn.dataset.image,
  };
}

function animateAddButton(button) {
  const originalHTML = button.innerHTML;
  button.innerHTML = "✔";
  setTimeout(() => {
    button.innerHTML = originalHTML;
  }, 700);
}
