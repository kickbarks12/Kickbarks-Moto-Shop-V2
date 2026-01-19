// ================= PAGE TRANSITIONS =================
document.addEventListener("DOMContentLoaded", initPageTransitions);

function initPageTransitions() {
  const page = document.querySelector(".page");
  if (!page) return;

  document.addEventListener("click", handleLinkClick);
}

// ================= LINK HANDLER =================
function handleLinkClick(event) {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");

  // Ignore invalid or special links
  if (
    !href ||
    href.startsWith("#") ||
    link.target === "_blank" ||
    link.hasAttribute("download")
  ) {
    return;
  }

  // Ignore external links
  if (!isSameOrigin(link.href)) return;

  event.preventDefault();
  fadeOutAndNavigate(link.href);
}

// ================= FADE + NAVIGATE =================
function fadeOutAndNavigate(url) {
  const page = document.querySelector(".page");
  if (!page) {
    window.location.href = url;
    return;
  }

  page.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = url;
  }, 400);
}

// ================= HELPERS =================
function isSameOrigin(url) {
  try {
    return new URL(url).origin === window.location.origin;
  } catch {
    return false;
  }
}
