// ================= INIT =================
document.addEventListener("DOMContentLoaded", initUI);

function initUI() {
  showNewArrivalModal();
  showFreeShippingToast();
  bindSpinButton();
}

// ================= NEW ARRIVAL MODAL =================
function showNewArrivalModal() {
  if (localStorage.getItem("newArrivalShown")) return;

  const modalEl = document.getElementById("newArrivalModal");
  if (!modalEl) return;

  new bootstrap.Modal(modalEl).show();
  localStorage.setItem("newArrivalShown", "true");
}

// ================= FREE SHIPPING TOAST =================
function showFreeShippingToast() {
  const toastEl = document.getElementById("shippingToast");
  if (!toastEl) return;

  const toast = new bootstrap.Toast(toastEl);
  setTimeout(() => toast.show(), 2000);
}

// ================= PROMO BANNER =================
function closePromo() {
  const banner = document.getElementById("promoBanner");
  if (banner) banner.style.display = "none";
}

// ================= SPIN TO WIN =================
const prizes = [
  { label: "5% OFF", discount: 5 },
  { label: "10% OFF", discount: 10 },
  { label: "₱100 OFF", discount: 100 },
  { label: "FREE SHIPPING", freeShipping: true },
  { label: "Try Again", nothing: true },
];

let currentRotation = 0;

// ================= SPIN BUTTON =================
function bindSpinButton() {
  const spinBtn = document.getElementById("spinBtn");
  if (!spinBtn) return;

  spinBtn.addEventListener("click", openSpinModal);

  document.addEventListener("click", (e) => {
    if (e.target.closest("#wheel")) {
      spinWheel();
    }
  });
}

// ================= OPEN / CLOSE MODAL =================
function openSpinModal() {
  const lastSpin = localStorage.getItem("lastSpinDate");
  const today = new Date().toDateString();

  if (lastSpin === today) {
    alert("🎡 You already spun today! Come back tomorrow.");
    return;
  }

  const modal = document.getElementById("spinModal");
  if (modal) modal.classList.remove("d-none");
}

function closeSpin() {
  const modal = document.getElementById("spinModal");
  if (modal) modal.classList.add("d-none");
}

// ================= SPIN LOGIC =================
function spinWheel() {
  const wheel = document.getElementById("wheel");
  const resultEl = document.getElementById("spinResult");

  if (!wheel || !resultEl) return;

  const index = Math.floor(Math.random() * prizes.length);
  const spinDegree = 360 * 5 + index * (360 / prizes.length);

  currentRotation += spinDegree;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const prize = prizes[index];
    localStorage.setItem("lastSpinDate", new Date().toDateString());
    displaySpinResult(prize, resultEl);
  }, 2000);
}

// ================= RESULT =================
function displaySpinResult(prize, resultEl) {
  if (prize.discount) {
    resultEl.textContent = `🎉 You won ${prize.label}!`;
  } else if (prize.freeShipping) {
    resultEl.textContent = "🚚 You won FREE SHIPPING!";
  } else {
    resultEl.textContent = "😅 Try again next time!";
  }
}
