// ================= LOAD NAVBAR =================
const navbarContainer = document.getElementById("navbar");

if (navbarContainer) {
  fetch("partials/navbar.html")
    .then(res => res.text())
    .then(html => {
      navbarContainer.innerHTML = html;

      const nav = document.querySelector(".navbar");

      window.addEventListener("scroll", () => {
        if (!nav) return;

        if (window.scrollY > 50) {
          nav.classList.add("glass");
        } else {
          nav.classList.remove("glass");
        }

        // Keep customer name black
        const menu = document.getElementById("customerMenu");
        if (menu) {
          const toggle = menu.querySelector(".dropdown-toggle");
          if (toggle) toggle.style.setProperty("color", "#000", "important");
        }
      });

      updateNavbar();
    });
}

// ================= LOAD FOOTER =================
const footerContainer = document.getElementById("footer");

if (footerContainer) {
  fetch("partials/footer.html")
    .then(res => res.text())
    .then(html => {
      footerContainer.innerHTML = html;
    });
}

// ================= CUSTOMER NAVBAR =================
function updateNavbar() {
  const customer = JSON.parse(localStorage.getItem("customer"));

  const loginLink = document.getElementById("loginLink");
  const customerMenu = document.getElementById("customerMenu");
  const userName = document.getElementById("userName");

  if (!loginLink || !customerMenu || !userName) return;

  if (customer) {
    loginLink.classList.add("d-none");
    customerMenu.classList.remove("d-none");

    if (customer.name && customer.name.trim() !== "") {
      userName.textContent = customer.name;
    } else {
      userName.textContent = customer.email.split("@")[0];
    }

    userName.style.setProperty("color", "#000", "important");
  } else {
    loginLink.classList.remove("d-none");
    customerMenu.classList.add("d-none");
  }
}

// ================= LOGOUT =================
function logout() {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

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

  localStorage.removeItem("customer");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
