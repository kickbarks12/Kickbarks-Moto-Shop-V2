const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

fetch("/api/auth/verify", {
  headers: {
    Authorization: "Bearer " + token
  }
})
.then(res => {
  if (res.status !== 200) {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
  }
});
