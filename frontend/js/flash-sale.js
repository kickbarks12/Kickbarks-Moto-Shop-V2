// ================= FLASH SALE TIMER =================

let totalSeconds = 2 * 60 * 60; // 2 hours

function updateFlashTimer() {
  totalSeconds--;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hoursEl = document.getElementById("flashHours");
  const minutesEl = document.getElementById("flashMinutes");
  const secondsEl = document.getElementById("flashSeconds");

  if (!hoursEl) return; // prevents JS errors on other pages

  hoursEl.textContent = String(h).padStart(2, "0");
  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
}

// Run every second
setInterval(updateFlashTimer, 1000);
