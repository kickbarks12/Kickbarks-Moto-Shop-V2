// SUMMARY
fetch("/api/reports/summary")
  .then(res => res.json())
  .then(data => {
    document.getElementById("totalRevenue").innerText = "₱" + data.totalRevenue;
    document.getElementById("totalOrders").innerText = data.totalOrders;
  });

// DAILY SALES
fetch("/api/reports/daily")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("dailySales");
    list.innerHTML = "";

    Object.entries(data).forEach(([date, total]) => {
      list.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
          <span>${date}</span>
          <strong>₱${total}</strong>
        </li>
      `;
    });
  });

// TOP PRODUCTS
fetch("/api/reports/top-products")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("topProducts");
    list.innerHTML = "";

    data.forEach(([name, qty]) => {
      list.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
          <span>${name}</span>
          <strong>${qty} sold</strong>
        </li>
      `;
    });
  });

  // ===== DAILY SALES CHART =====
fetch("/api/reports/daily")
  .then(res => res.json())
  .then(data => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    new Chart(document.getElementById("dailyChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Daily Sales (₱)",
          data: values,
          backgroundColor: "#212529"
        }]
      }
    });
  });

// ===== TOP PRODUCTS CHART =====
fetch("/api/reports/top-products")
  .then(res => res.json())
  .then(data => {
    const labels = data.map(x => x[0]);
    const values = data.map(x => x[1]);

    new Chart(document.getElementById("topProductsChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Units Sold",
          data: values,
          backgroundColor: "#198754"
        }]
      }
    });
  });
