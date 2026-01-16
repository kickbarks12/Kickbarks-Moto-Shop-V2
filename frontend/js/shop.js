


let allProducts = [];

const urlParams = new URLSearchParams(window.location.search);
const brandFilter = urlParams.get("brand");


document.addEventListener("DOMContentLoaded", () => {

  const status = document.getElementById("shopStatus");
if (status) status.textContent = "Loading products...";
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = Array.isArray(data) ? data : data.products;

// apply brand filter once (if present)
const productsToRender = brandFilter
  ? allProducts.filter(p => p.brand === brandFilter)
  : allProducts;

renderProducts(productsToRender);

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
          <button
  class="btn btn-dark w-100 add-to-cart"
  ${product.stock <= 0 ? "disabled" : ""}
>
  ${product.stock > 0 ? "Add to Cart" : "Out of Stock"}
</button>

        </div>
      </div>
    `;

    col.querySelector(".add-to-cart").onclick = () => {
  if (product.stock <= 0) {
    alert("This product is out of stock.");
    return;
  }
  addToCart(product);
};

    productList.appendChild(col);
//     let filteredProducts = products;

// if (brandFilter) {
//   filteredProducts = products.filter(p => p.brand === brandFilter);
// }

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
  let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}


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

// If logged in, save cart to MongoDB
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

alert("Added to cart!");

}
