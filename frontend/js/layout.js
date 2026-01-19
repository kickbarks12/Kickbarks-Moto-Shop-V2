// ================= INIT =================
document.addEventListener("DOMContentLoaded", initLayout);

function initLayout() {
  loadNavbar();
  loadFooter();
}

// ================= LOAD NAVBAR =================
function loadNavbar() {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  fetch("partials/navbar.html")
    .then(handleHTMLResponse)
    .then((html) => {
      navbarContainer.innerHTML = html;
      updateNavbarState();
    })
    .catch((err) => console.error("Navbar load failed:", err));
}

// ================= LOAD FOOTER =================
function loadFooter() {
  const footerContainer = document.getElementById("footer");
  if (!footerContainer) return;

  fetch("partials/footer.html")
    .then(handleHTMLResponse)
    .then((html) => {
      footerContainer.innerHTML = html;
    })
    .catch((err) => console.error("Footer load failed:", err));
}

// ================= NAVBAR STATE =================
function updateNavbarState() {
  const customer = getStoredCustomer();

  const loginLink = document.getElementById("loginLink");
  const customerMenu = document.getElementById("customerMenu");
  const userName = document.getElementById("userName");

  if (!loginLink || !customerMenu || !userName) return;

  if (customer) {
    loginLink.classList.add("d-none");
    customerMenu.classList.remove("d-none");

    userName.textContent =
      customer.name?.trim() ||
      customer.email?.split("@")[0] ||
      "User";
  } else {
    loginLink.classList.remove("d-none");
    customerMenu.classList.add("d-none");
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("customer");
  localStorage.removeItem("cart");
  localStorage.removeItem("myVouchers");

  window.location.href = "index.html";
}

// ================= HELPERS =================
function handleHTMLResponse(res) {
  if (!res.ok) throw new Error("Failed to load partial");
  return res.text();
}

function getStoredCustomer() {
  try {
    return JSON.parse(localStorage.getItem("customer"));
  } catch {
    return null;
  }
}
