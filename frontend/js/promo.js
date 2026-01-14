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

document.getElementById("wheel").onclick = () => {
  const wheel = document.getElementById("wheel");
  const resultEl = document.getElementById("spinResult");

  const slice = Math.floor(Math.random() * prizes.length);
  const degrees = 360 * 6 + slice * (360 / prizes.length);

  currentRotation += degrees;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  const prize = prizes[slice];

  setTimeout(() => {
    localStorage.setItem("lastSpinDate", new Date().toDateString());

    if (prize.discount) {
      const code = "SPIN" + prize.discount;
      localStorage.setItem("promoDiscount", prize.discount);
      localStorage.setItem("appliedVoucher", code);

      let myVouchers = JSON.parse(localStorage.getItem("myVouchers")) || [];
      if (!myVouchers.includes(code)) {
        myVouchers.push(code);
        localStorage.setItem("myVouchers", JSON.stringify(myVouchers));
      }

      resultEl.textContent = `🎉 You won ${prize.label}!`;
    }
    else if (prize.freeShipping) {
      const code = "SPIN-FREEDEL";
      localStorage.setItem("freeShipping", "true");
      localStorage.setItem("appliedVoucher", code);

      let myVouchers = JSON.parse(localStorage.getItem("myVouchers")) || [];
      if (!myVouchers.includes(code)) {
        myVouchers.push(code);
        localStorage.setItem("myVouchers", JSON.stringify(myVouchers));
      }

      resultEl.textContent = "🚚 You won FREE SHIPPING!";
    }
    else {
      resultEl.textContent = "😅 Try again next time!";
    }
  }, 4000);
};
