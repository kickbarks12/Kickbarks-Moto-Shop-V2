// ================= ADMIN AUTH GUARD =================
document.addEventListener("DOMContentLoaded", verifyAdminSession);

function verifyAdminSession() {
  const token = getAdminToken();

  if (!token) {
    redirectToLogin();
    return;
  }

  validateToken(token);
}

// ================= VERIFY TOKEN =================
function validateToken(token) {
  fetch("/api/auth/verify", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid token");
    })
    .catch(() => {
      clearAdminSession();
      redirectToLogin();
    });
}

// ================= HELPERS =================
function getAdminToken() {
  return localStorage.getItem("adminToken");
}

function clearAdminSession() {
  localStorage.removeItem("adminToken");
}

function redirectToLogin() {
  window.location.href = "admin-login.html";
}
