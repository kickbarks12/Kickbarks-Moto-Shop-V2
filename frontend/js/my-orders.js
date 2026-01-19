// ================= AUTH CHECK =================
const customer = getStoredCustomer();

if (!customer) {
  alert("Please login to view your orders.");
  window.location.href = "login.html";
}

// ================= INIT =================
loadOrders();
const refreshInterval = setInterval(loadOrders, 15000);

window.addEventListener("beforeunload", () => {
  clearInterval(refreshInterval);
});

// ================= LOAD ORDERS =================
function loadOrders() {
  authFetch(`/api/orders/my?customerId=${customer._id}`)
    .then(handleResponse)
    .then(renderOrders)
    .catch(handleLoadError);
}

// ================= RESPONSE HANDLER =================
function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("customer");
      window.location.href = "login.html";
    }
    throw new Error("Failed to load orders");
  }
  return res.json();
}

// ================= RENDER ORDERS =================
function renderOrders(orders) {
  const list = document.getElementById("ordersList");
  if (!list) return;

  list.innerHTML = "";

  if (!Array.isArray(orders) || orders.length === 0) {
    list.innerHTML = `<p class="text-muted">No orders yet.</p>`;
    return;
  }

  orders.forEach((order) => {
    list.appendChild(createOrderCard(order));
  });
}

// ================= ORDER CARD =================
function createOrderCard(order) {
  const card = document.createElement("div");
  card.className = "card mb-4 shadow";

  const itemsHTML = order.items
    .map(
      (item) => `
        <div class="d-flex justify-content-between border-bottom py-1">
          <span>${item.name} × ${item.quantity}</span>
          <span>₱${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `
    )
    .join("");

  div.innerHTML = `
  <div class="card-body text-dark">

    <div class="d-flex justify-content-between mb-2">
      <strong>Order: ${o.reference}</strong>
      <span class="badge ${getStatusColor(o.status)}">${o.status}</span>
    </div>

    <div class="mb-3">
      ${itemsHTML}
    </div>

    <div class="d-flex justify-content-between fw-bold border-top pt-2">
      <span>Total</span>
      <span>₱${o.total.toFixed(2)}</span>
    </div>

    ${
      ["Pending", "Confirmed"].includes(o.status)
        ? `<button class="btn btn-outline-danger btn-sm mt-3 cancel-order">
             Cancel Order
           </button>`
        : ""
    }

  </div>
`;
const cancelBtn = div.querySelector(".cancel-order");

if (cancelBtn) {
  cancelBtn.addEventListener("click", async () => {
    if (!confirm("Cancel this order?")) return;

    try {
      await authFetch(`/api/orders/${o._id}/cancel`, {
        method: "PUT",
      });

      alert("Order cancelled");
      loadOrders();
    } catch {
      alert("Unable to cancel order");
    }
  });
}


  return card;
}

// ================= STATUS COLOR =================
function getStatusClass(status) {
  const statusMap = {
    Pending: "bg-warning text-dark",
    Confirmed: "bg-info",
    Packed: "bg-primary",
    Shipped: "bg-orange",
    Delivered: "bg-success",
  };

  return statusMap[status] || "bg-secondary";
}

// ================= HELPERS =================
function formatDate(date) {
  return new Date(date).toLocaleString();
}

function getStoredCustomer() {
  try {
    return JSON.parse(localStorage.getItem("customer"));
  } catch {
    return null;
  }
}

// ================= ERROR HANDLER =================
function handleLoadError(err) {
  console.error("Order load error:", err);
  alert("Failed to load orders. Please try again.");
}
