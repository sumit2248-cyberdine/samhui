document.documentElement.classList.add("js-enabled");
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
const mobile = window.matchMedia("(max-width: 800px)");

function closeNavigation(returnFocus = false) {
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
  if (returnFocus) toggle.focus();
}

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});

links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (mobile.matches) {
      closeNavigation();
      // Keep keyboard focus at the section the visitor chose.
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && links.classList.contains("open")) closeNavigation(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) closeNavigation();
});
links.addEventListener("focusout", (event) => {
  if (!links.contains(event.relatedTarget) && event.relatedTarget !== toggle) closeNavigation();
});
mobile.addEventListener("change", () => closeNavigation());

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((element) => {
    // Animate below the first viewport; never hide already visible content.
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add("reveal-ready");
      observer.observe(element);
    }
  });
}
document.getElementById("year").textContent = new Date().getFullYear();
