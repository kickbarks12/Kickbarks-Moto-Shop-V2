const customer = JSON.parse(localStorage.getItem("customer"));

if (!customer) {
  alert("Please login to view your orders");
  window.location.href = "login.html";
}

function getStatusColor(status) {
  if (status === "Pending") return "bg-warning text-dark";
  if (status === "Confirmed") return "bg-info";
  if (status === "Packed") return "bg-purple";
  if (status === "Shipped") return "bg-orange";
  if (status === "Delivered") return "bg-success";
  return "bg-secondary";
}

function loadOrders() {
  fetch("/api/orders/my/" + customer.email)
    .then(res => res.json())
    .then(orders => {
      const list = document.getElementById("ordersList");
      list.innerHTML = "";

      if (!orders.length) {
        list.innerHTML = "<p class='text-muted'>No orders yet.</p>";
        return;
      }

      orders.forEach(o => {
        const div = document.createElement("div");
        div.className = "card mb-3 shadow-sm";

        div.innerHTML = `
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <strong>Order: ${o.reference}</strong>
              <span class="badge ${getStatusColor(o.status)}">
                ${o.status}
              </span>
            </div>

            <p class="mt-2 mb-1"><b>Total:</b> ₱${o.total}</p>
            <p class="mb-2"><b>Date:</b> ${new Date(o.createdAt).toLocaleString()}</p>

            <a class="btn btn-sm btn-outline-dark"
               href="/api/orders/${o._id}/invoice"
               target="_blank">
              Download Invoice
            </a>
          </div>
        `;

        list.appendChild(div);
      });
    });
}

// Load immediately
loadOrders();

// Auto-refresh every 15 seconds
setInterval(loadOrders, 15000);
