let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = Array.isArray(data) ? data : data.products;
      renderProducts(allProducts);
    });
});

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card product-card h-100">
        <div class="position-relative product-img-wrapper">
          <span class="product-price">₱${product.price}</span>
          <span class="stock-badge">${product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          <img src="${product.image}" class="img-fluid" alt="${product.name}">
        </div>

        <div class="card-body text-center">
          <h6 class="fw-bold">${product.name}</h6>
          <p class="text-muted small">${product.category}</p>
          <button class="btn btn-dark w-100 add-to-cart">Add to Cart</button>
        </div>
      </div>
    `;

    col.querySelector(".add-to-cart").onclick = () => addToCart(product);
    productList.appendChild(col);
  });
}

function searchProducts() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.category.toLowerCase().includes(keyword)
  );

  renderProducts(filtered);
}

// 🧺 CART
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productId = product._id || product.name;
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}
