const customer = JSON.parse(localStorage.getItem("customer"));

if (!customer) {
  alert("Please login to view your orders");
  window.location.href = "login.html";
}

function getStatusColor(status) {
  if (status === "Pending") return "bg-warning text-dark";
  if (status === "Confirmed") return "bg-info";
  if (status === "Packed") return "bg-primary";
  if (status === "Shipped") return "bg-orange";
  if (status === "Delivered") return "bg-success";
  return "bg-secondary";
}

function loadOrders() {
  fetch("/api/orders/my?customerId=" + customer._id)
  .then(res => {
    if (!res.ok) {
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("customer");
        window.location.href = "login.html";
        return;
      }
      throw new Error("Failed to load orders");
    }
    return res.json();
  })
  .then(orders => {
    const list = document.getElementById("ordersList");
    list.innerHTML = "";

  // fetch("/api/orders/my?customerId=" + customer._id)

  //   .then(res => res.json())
  //   .then(orders => {
  //     const list = document.getElementById("ordersList");
  //     list.innerHTML = "";

      if (!orders.length) {
        list.innerHTML = "<p class='text-dark'>No orders yet.</p>";
        return;
      }

      orders.forEach(o => {
        const div = document.createElement("div");
        div.className = "card mb-4 shadow";

        const itemsHTML = o.items.map(item => `
          <div class="d-flex justify-content-between border-bottom py-1">
            <span>${item.name} × ${item.quantity}</span>
            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join("");

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

            <small class="text-muted d-block mt-2">
              ${new Date(o.createdAt).toLocaleString()}
            </small>

            <a class="btn btn-outline-dark btn-sm mt-3"
               href="/api/orders/${o._id}/invoice"
               target="_blank">
              Download Invoice
            </a>

          </div>
        `;

        list.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load orders");
    });
}

// Load immediately
loadOrders();

// Auto-refresh every 15 seconds
const ordersInterval = setInterval(loadOrders, 15000);

window.addEventListener("beforeunload", () => {
  clearInterval(ordersInterval);
});

