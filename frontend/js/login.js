document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      emailOrPhone: document.getElementById("emailOrPhone").value.trim(),
      password: document.getElementById("password").value.trim(),
    };

    if (!payload.emailOrPhone || !payload.password) {
      alert("All fields required");
      return;
    }

    const res = await fetch("/api/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    localStorage.setItem("customerToken", data.token);
    window.location.href = "index.html";
  });
});
