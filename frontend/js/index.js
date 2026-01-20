document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    console.log("Guest user");
  } else {
    console.log("Logged in user");
  }
});
