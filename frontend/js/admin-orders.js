document.addEventListener("DOMContentLoaded", loadAdminOrders);

async function loadAdminOrders() {
  try {
    const res = await fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load orders");

    const orders = await res.json();
    renderOrders(orders);
  } catch (err) {
    alert("Unable to load admin orders");
  }
}

function renderOrders(orders) {
  const container = document.getElementById("adminOrders");
  container.innerHTML = "";

  if (!orders.length) {
    container.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card mb-4 shadow-sm";

    const itemsHTML = o.items
      .map(
        (i) => `
        <div class="d-flex justify-content-between">
          <span>${i.name} × ${i.quantity}</span>
          <span>₱${(i.price * i.quantity).toFixed(2)}</span>
        </div>
      `
      )
      .join("");

    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between mb-2">
          <strong>${o.reference}</strong>
          <span class="badge bg-secondary">${o.status}</span>
        </div>

        ${itemsHTML}

        <hr />

        <div class="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>₱${o.total.toFixed(2)}</span>
        </div>

        ${
          o.status !== "Refunded"
            ? `<button class="btn btn-warning btn-sm mt-3 refund-btn">
                 Refund
               </button>`
            : ""
        }
      </div>
    `;

    const refundBtn = card.querySelector(".refund-btn");

    if (refundBtn) {
      refundBtn.addEventListener("click", async () => {
        if (!confirm("Refund this order?")) return;

        try {
          const res = await fetch(`/api/orders/${o._id}/refund`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          });

          if (!res.ok) throw new Error();

          alert("Order refunded");
          loadAdminOrders();
        } catch {
          alert("Refund failed");
        }
      });
    }

    container.appendChild(card);
  });
}
