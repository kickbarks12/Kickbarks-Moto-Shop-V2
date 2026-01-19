// ================= AUTH CHECK =================
const customer = getStoredCustomer();

if (!customer) {
  window.location.href = "login.html";
}

// ================= ELEMENT REFERENCES =================
const elements = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  birthday: document.getElementById("birthday"),
  phone: document.getElementById("phone"),
  address: document.getElementById("address"),
  avatarInput: document.getElementById("avatarInput"),
  avatarPreview: document.getElementById("avatarPreview"),
  saveBtn: document.getElementById("saveProfileBtn"),
};

// ================= INIT =================
populateProfile();
bindEvents();

// ================= POPULATE PROFILE =================
function populateProfile() {
  elements.name.value = customer.name || "";
  elements.email.value = customer.email || "";
  elements.birthday.value = customer.birthday || "";
  elements.phone.value = customer.phone || "";
  elements.address.value = customer.address || "";
}

// ================= EVENTS =================
function bindEvents() {
  if (elements.avatarInput) {
    elements.avatarInput.addEventListener("change", previewAvatar);
  }

  if (elements.saveBtn) {
    elements.saveBtn.addEventListener("click", saveProfile);
  }
}

// ================= AVATAR PREVIEW (UI ONLY) =================
function previewAvatar() {
  const file = elements.avatarInput.files[0];
  if (!file) return;

  elements.avatarPreview.src = URL.createObjectURL(file);
}

// ================= SAVE PROFILE =================
function saveProfile() {
  if (!elements.name.value || !elements.phone.value) {
    alert("Name and phone are required.");
    return;
  }

  const payload = {
    name: elements.name.value.trim(),
    birthday: elements.birthday.value,
    phone: elements.phone.value.trim(),
    address: elements.address.value.trim(),
  };

  updateProfile(payload);
}

// ================= API CALL =================
function updateProfile(payload) {
  authFetch(`/api/customers/profile/${customer._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Profile update failed");
      return res.json();
    })
    .then(handleUpdateSuccess)
    .catch(() => {
      alert("Failed to update profile. Please try again.");
    });
}

// ================= UPDATE SUCCESS =================
function handleUpdateSuccess(updatedCustomer) {
  localStorage.setItem("customer", JSON.stringify(updatedCustomer));
  alert("Profile updated successfully");
}

// ================= HELPERS =================
function getStoredCustomer() {
  try {
    return JSON.parse(localStorage.getItem("customer"));
  } catch {
    return null;
  }
}
