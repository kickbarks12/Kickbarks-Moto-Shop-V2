function authFetch(url, options = {}) {
  const token = localStorage.getItem("customerToken");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }).then(res => {
    if (res.status === 401) {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customer");
      alert("Session expired. Please login again.");
      window.location.href = "login.html";
      throw new Error("Unauthorized");
    }
    return res;
  });
}
