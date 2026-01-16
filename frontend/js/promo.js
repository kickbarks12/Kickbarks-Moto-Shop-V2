document.addEventListener("DOMContentLoaded", () => {

  // New arrival popup
  if (!localStorage.getItem("newArrivalShown")) {
    const modalEl = document.getElementById("newArrivalModal");
if (modalEl) {
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

    localStorage.setItem("newArrivalShown", "true");
  }

  // Free shipping toast
  const toast = new bootstrap.Toast(
    document.getElementById("shippingToast")
  );
  setTimeout(() => toast.show(), 2000);

});

// Close promo banner
function closePromo() {
  document.getElementById("promoBanner").style.display = "none";
}

// 🎡 Spin to Win
const prizes = [
  { label: "5% OFF", discount: 5 },
  { label: "10% OFF", discount: 10 },
  { label: "₱100 OFF", discount: 100 },
  { label: "FREE SHIPPING", freeShipping: true },
  { label: "Try Again", nothing: true }
];

let currentRotation = 0;

document.getElementById("spinBtn").onclick = () => {
  const lastSpin = localStorage.getItem("lastSpinDate");
  const today = new Date().toDateString();

  if (lastSpin === today) {
    alert("🎡 You already spun today! Come back tomorrow.");
    return;
  }

  document.getElementById("spinModal").classList.remove("d-none");
};

function closeSpin() {
  document.getElementById("spinModal").classList.add("d-none");
}

document.addEventListener("click", e => {
  if (e.target.closest("#wheel")) {
    spinWheel();
  }
});

function spinWheel() {
  const wheel = document.getElementById("wheel");
  const resultEl = document.getElementById("spinResult");

  const spin = Math.floor(Math.random() * prizes.length);
  const deg = 360 * 5 + spin * 72;

  wheel.style.transform = `rotate(${deg}deg)`;

  setTimeout(() => {
    const prize = prizes[spin];
    localStorage.setItem("lastSpinDate", new Date().toDateString());

    if (prize.discount) {
      resultEl.textContent = `🎉 You won ${prize.label}!`;
    } else if (prize.freeShipping) {
      resultEl.textContent = "🚚 You won FREE SHIPPING!";
    } else {
      resultEl.textContent = "😅 Try again next time!";
    }
  }, 2000);
}
