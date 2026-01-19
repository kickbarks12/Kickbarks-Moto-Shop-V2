document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
  const token = localStorage.getItem("adminToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // SUMMARY
  const summaryRes = await fetch("/api/reports/summary", { headers });
  const summary = await summaryRes.json();

  document.getElementById("totalOrders").textContent = summary.totalOrders;
  document.getElementById("totalRevenue").textContent =
    `₱${summary.totalRevenue.toFixed(2)}`;
  document.getElementById("todayRevenue").textContent =
    `₱${summary.todayRevenue.toFixed(2)}`;

  // STATUS
  const statusRes = await fetch("/api/reports/status", { headers });
  const statusData = await statusRes.json();

  const statusList = document.getElementById("statusList");
  statusList.innerHTML = "";

  Object.entries(statusData).forEach(([status, count]) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `<span>${status}</span><span>${count}</span>`;
    statusList.appendChild(li);
  });

  // TOP PRODUCTS
  const topRes = await fetch("/api/reports/top-products", { headers });
  const topProducts = await topRes.json();

  const topList = document.getElementById("topProducts");
  topList.innerHTML = "";

  topProducts.forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `<span>${p.name}</span><span>${p.qty}</span>`;
    topList.appendChild(li);
  });
}
