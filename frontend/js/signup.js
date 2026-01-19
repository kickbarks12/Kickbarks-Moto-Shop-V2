// ================= SIGNUP FORM HANDLER =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

// ================= HANDLE SIGNUP =================
function handleSignup(event) {
  event.preventDefault();

  const name = getValue("name");
  const email = getValue("email");
  const phone = getValue("phone");
  const password = getValue("password");

  if (!name || !email || !phone || !password) {
    alert("All fields are required.");
    return;
  }

  registerCustomer({ name, email, phone, password });
}

// ================= REGISTER REQUEST =================
function registerCustomer(payload) {
  fetch("/api/customers/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Signup failed");
      return res.json();
    })
    .then(handleSignupResponse)
    .catch(() => {
      alert("Signup failed. Please try again.");
    });
}

// ================= RESPONSE HANDLER =================
function handleSignupResponse(data) {
  if (data.message) {
    alert(data.message);
    return;
  }

  alert("Account created successfully. Please log in.");
  window.location.href = "login.html";
}

// ================= HELPERS =================
function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}
