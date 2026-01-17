// LOAD NAVBAR
const navbarContainer = document.getElementById("navbar");

if (navbarContainer) {
  fetch("partials/navbar.html")
    .then(res => res.text())
    .then(html => {
      navbarContainer.innerHTML = html;
      updateNavbar();
    });
}

// LOAD FOOTER
const footerContainer = document.getElementById("footer");

if (footerContainer) {
  fetch("partials/footer.html")
    .then(res => res.text())
    .then(html => {
      footerContainer.innerHTML = html;
    });
}

function updateNavbar() {
  const customer = JSON.parse(localStorage.getItem("customer"));

  const loginLink = document.getElementById("loginLink");
  const customerMenu = document.getElementById("customerMenu");
  const userName = document.getElementById("userName");

  if (!loginLink || !customerMenu || !userName) return;

  if (customer) {
    loginLink.classList.add("d-none");
    customerMenu.classList.remove("d-none");
    userName.textContent =
      customer.name?.trim() || customer.email.split("@")[0];
  } else {
    loginLink.classList.remove("d-none");
    customerMenu.classList.add("d-none");
  }
}

function logout() {
  localStorage.removeItem("customer");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
