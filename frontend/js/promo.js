document.addEventListener("DOMContentLoaded", () => {

  // New arrival popup
  if (!localStorage.getItem("newArrivalShown")) {
    const modal = new bootstrap.Modal(
      document.getElementById("newArrivalModal")
    );
    modal.show();
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
