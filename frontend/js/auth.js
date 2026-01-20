function getToken() {
  return localStorage.getItem("customerToken");
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem("customerToken");
  window.location.href = "login.html";
}
