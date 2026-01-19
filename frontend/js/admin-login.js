fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem("adminToken", data.token);
  window.location.href = "admin-dashboard.html";
});
s