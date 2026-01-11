// 🔐 BASIC ADMIN PROTECTION
(function adminGuard() {
  const isAdmin = localStorage.getItem("isAdmin");

  if (!isAdmin) {
    const password = prompt("Enter admin password:");

    // ⚠️ Change this password
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Access denied");
      window.location.href = "/index.html";
    }
  }
})();



document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});

function loadOrders() {
  fetch("/api/orders")
    .then((res) => res.json())
    .then((orders) => {
      const tableBody = document.getElementById("orders-table");
      tableBody.innerHTML = "";

      if (!orders || orders.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted">
              No orders found
            </td>
          </tr>
        `;
        return;
      }

      orders.forEach((order, index) => {
  const customer = order.customer || {};

  const itemsText = order.items
    .map(item => `${item.name} (x${item.quantity})`)
    .join("<br>");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${order.reference || "—"}</td>
    <td>${new Date(order.createdAt).toLocaleString()}</td>

    <td>
      <strong>${customer.name || "No name"}</strong><br>
      📧 ${customer.email || "No email"}<br>
      📞 ${customer.phone || "No phone"}<br>
      📍 ${customer.address || "No address"}
    </td>

    <td>${itemsText}</td>
    <td>₱${order.total.toLocaleString()}</td>

    <td>
      <select class="form-select form-select-sm"
        onchange="updateStatus('${order._id}', this.value)">
        <option ${order.status=="Pending"?"selected":""}>Pending</option>
        <option ${order.status=="Confirmed"?"selected":""}>Confirmed</option>
        <option ${order.status=="Packed"?"selected":""}>Packed</option>
        <option ${order.status=="Shipped"?"selected":""}>Shipped</option>
        <option ${order.status=="Delivered"?"selected":""}>Delivered</option>
      </select>

      <button class="btn btn-sm btn-secondary mt-2"
        onclick="downloadInvoice('${order._id}')">
        📄 Invoice
      </button>

      <button class="btn btn-sm btn-danger mt-2"
        onclick="deleteOrder('${order._id}')">
        🗑 Delete
      </button>
    </td>
  `;

  tableBody.appendChild(row);
});

    })
    .catch((err) => {
      console.error("Failed to load orders:", err);
    });
}

function completeOrder(orderId) {
  if (!confirm("Mark this order as completed?")) return;

  fetch(`/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: "Completed" })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    })
    .then(() => {
      loadOrders(); // refresh table
    })
    .catch(() => {
      alert("Failed to update order status");
    });
}

function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  fetch(`/api/orders/${orderId}`, {
    method: "DELETE"
  })
    .then((res) => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(() => {
      loadOrders();
    })
    .catch(() => {
      alert("Failed to delete order");
    });
}

function logoutAdmin() {
  localStorage.removeItem("isAdmin");
  alert("Logged out successfully");
  window.location.href = "/index.html";
}

function updateStatus(orderId, status) {
  fetch(`/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }).then(() => loadOrders());
}

function downloadInvoice(orderId) {
  window.open(`/api/orders/${orderId}/invoice`);
}
