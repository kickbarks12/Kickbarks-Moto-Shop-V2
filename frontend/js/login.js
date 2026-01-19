// ================= INIT =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

// ================= HANDLE LOGIN =================
function handleLogin(event) {
  event.preventDefault();

  const emailOrPhone = getValue("email");
  const password = getValue("password");

  if (!emailOrPhone || !password) {
    alert("Please enter email and password.");
    return;
  }

  backupGuestCart();
  authenticate(emailOrPhone, password);
}

// ================= AUTH REQUEST =================
function authenticate(emailOrPhone, password) {
  fetch("/api/customers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone, password }),
  })
    .then(handleAuthResponse)
    .then(handleLoginSuccess)
    .catch(() => {
      alert("Login failed. Please try again.");
    });
}

// ================= RESPONSE HANDLER =================
function handleAuthResponse(res) {
  if (!res.ok) throw new Error("Login request failed");
  return res.json();
}

// ================= LOGIN SUCCESS =================
function handleLoginSuccess(data) {
  if (data.message) {
    alert("Invalid login credentials.");
    return;
  }

  storeCustomerSession(data);
  mergeCarts(data.cart || []);
  syncCartToServer();
  redirectHome();
}

// ================= CART HANDLING =================
function backupGuestCart() {
  const cart = getStoredCart();
  localStorage.setItem("guestCartBackup", JSON.stringify(cart));
}

function mergeCarts(userCart) {
  const guestCart =
    JSON.parse(localStorage.getItem("guestCartBackup")) || [];

  const normalizedUserCart = userCart.map((item) => ({
    id: `prod-${item.productId}`,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  const merged = [...normalizedUserCart];

  guestCart.forEach((guestItem) => {
    const existing = merged.find((i) => i.id === guestItem.id);
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem);
    }
  });

  localStorage.setItem("cart", JSON.stringify(merged));
}

// ================= SERVER SYNC =================
function syncCartToServer() {
  const token = localStorage.getItem("customerToken");
  if (!token) return;

  const cart = getCart();

  authFetch("/api/customers/cart", {
    method: "POST",
    body: JSON.stringify({ cart })
  }).catch(err => console.error("Cart sync failed", err));
}


// ================= SESSION =================
function storeCustomerSession(data) {
  localStorage.setItem("customer", JSON.stringify(data.customer));
localStorage.setItem("customerToken", data.token);

  localStorage.setItem("myVouchers", JSON.stringify(data.vouchers || []));
}

// ================= HELPERS =================
function getStoredCustomer() {
  try {
    return JSON.parse(localStorage.getItem("customer"));
  } catch {
    return null;
  }
}

function getStoredCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function redirectHome() {
  window.location.href = "index.html";
}
