(function () {
  const token = localStorage.getItem("customerToken");
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
  }
})();
