const API = "/api/products";
let editId = null;



async function loadProducts() {
  const res = await fetch(API);
  const products = await res.json();

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>₱${p.price}</td>
        <td>${p.category}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editProduct('${p._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

async function addProduct() {
const nameEl = document.getElementById("name");
  const priceEl = document.getElementById("price");
  const categoryEl = document.getElementById("category");
  const descriptionEl = document.getElementById("description");
  const stockEl = document.getElementById("stock");
  const imageEl = document.getElementById("image");

    if (
  !nameEl.value ||
  !priceEl.value ||
  !categoryEl.value ||
  !descriptionEl.value ||
  !stockEl.value
) {
  alert("Please fill in all required fields");
  return;
}


  let imageUrl = "";

  if (imageEl.files.length > 0) {

    const fd = new FormData();
    fd.append("image", imageEl.files[0]);


    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fd
    });

    const uploadData = await uploadRes.json();
    imageUrl = uploadData.imageUrl;
  }

  const product = {
  name: nameEl.value,
  price: priceEl.value,
  category: categoryEl.value,
  description: descriptionEl.value,
  image: imageUrl,
  stock: stockEl.value
};


  if (editId) {
    await fetch("/api/products/" + editId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    editId = null;
    document.querySelector("button").innerText = "Add Product";
  } else {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
  }

  clearForm();
  loadProducts();
}


async function editProduct(id) {
  const res = await fetch(API + "/" + id);
  const p = await res.json();

  name.value = p.name;
  price.value = p.price;
  category.value = p.category;
  description.value = p.description;
  image.value = p.image;
  stock.value = p.stock;

  editId = id;
  document.querySelector("button").innerText = "Save Changes";
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  await fetch(API + "/" + id, { method: "DELETE" });
  loadProducts();
}

function clearForm() {
  name.value = "";
  price.value = "";
  category.value = "";
  description.value = "";
  image.value = "";
  stock.value = "";
}

loadProducts();
