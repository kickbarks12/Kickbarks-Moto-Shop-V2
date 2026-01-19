// ================= STATE =================
let allProducts = [];

// ================= URL FILTER =================
const params = new URLSearchParams(window.location.search);
const brandFilter = params.get("brand");

// ================= INIT =================
document.addEventListener("DOMContentLoaded", initShop);

function initShop() {
  fetchProducts();
}

// ================= FETCH PRODUCTS =================
function fetchProducts() {
  fetch("/api/products")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    })
    .then((data) => {
      allProducts = Array.isArray(data) ? data : data.products || [];
      applyFiltersAndRender();
    })
    .catch((err) => {
      console.error("Product fetch error:", err);
      showEmptyState("Unable to load products.");
    });
}

// ================= APPLY FILTERS =================
function applyFiltersAndRender() {
  const products = brandFilter
    ? allProducts.filter((p) => p.brand === brandFilter)
    : allProducts;

  renderProducts(products);
  updateShopStatus(products.length);
}

// ================= RENDER PRODUCTS =================
function renderProducts(products) {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = "";

  if (!products.length) {
    showEmptyState("No products found.");
    return;
  }

  products.forEach((product) => {
    productList.appendChild(createProductCard(product));
  });
}

// ================= PRODUCT CARD =================
function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-4 col-lg-3";

  const productId = product._id
    ? `prod-${product._id}`
    : `name-${product.name}`;

  col.innerHTML = `
    <div class="card product-card h-100">
      <div class="position-relative product-img-wrapper">
        <span class="product-price">₱${product.price}</span>
        <span class="stock-badge">
          ${product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
        <img
          src="${product.image}"
          class="img-fluid"
          alt="${product.name}"
        />
      </div>

      <div class="card-body text-center">
        <h6 class="fw-bold">${product.name}</h6>
        <p class="text-muted small">${product.category}</p>
        <button
          class="btn btn-dark w-100 add-to-cart"
          ${product.stock <= 0 ? "disabled" : ""}
        >
          ${product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  `;

  col.querySelector(".add-to-cart").addEventListener("click", () =>
    handleAddToCart(product, productId)
  );

  return col;
}

// ================= SEARCH =================
function searchProducts() {
  const keyword =
    document.getElementById("searchBox")?.value.toLowerCase() || "";

  const baseList = brandFilter
    ? allProducts.filter((p) => p.brand === brandFilter)
    : allProducts;

  const filtered = baseList.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
  );

  renderProducts(filtered);
  updateShopStatus(filtered.length);
}

// ================= SHOP STATUS =================
function updateShopStatus(count) {
  const status = document.getElementById("shopStatus");
  if (status) {
    status.textContent = `${count} product(s) found`;
  }
}

// ================= EMPTY STATE =================
function showEmptyState(message) {
  const productList = document.getElementById("product-list");
  if (productList) {
    productList.innerHTML = `
      <p class="text-center text-muted">${message}</p>
    `;
  }
}

// ================= CART =================
function handleAddToCart(product, productId) {
  if (product.stock <= 0) {
    alert("This product is out of stock.");
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
  syncCartWithServer(cart);
  alert("Added to cart!");
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

function syncCartWithServer(cart) {
  const customer = JSON.parse(localStorage.getItem("customer"));
  if (!customer) return;

  fetch("/api/customers/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: customer._id,
      cart: cart.map((i) => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    }),
  }).catch((err) => console.error("Cart sync failed:", err));
}
