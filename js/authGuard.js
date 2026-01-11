const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// verify token with backend
fetch("/api/auth/verify", {
  headers: {
    Authorization: "Bearer " + token
  }
})
.then(res => {
  if (res.status !== 200) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
});

