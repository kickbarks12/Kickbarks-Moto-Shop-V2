document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".page");

  document.querySelectorAll("a").forEach(link => {
    if (link.href && !link.href.includes("#")) {
      link.addEventListener("click", e => {
        e.preventDefault();
        page.classList.add("fade-out");

        setTimeout(() => {
          window.location = link.href;
        }, 400);
      });
    }
  });
});
