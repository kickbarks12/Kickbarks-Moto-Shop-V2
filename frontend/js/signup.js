const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.password) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await fetch("/api/customers/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    alert("Account created successfully");
    window.location.href = "login.html";
  } catch (err) {
    alert("Server error");
  }
});
