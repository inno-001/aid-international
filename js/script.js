"use strict";

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const dropdownItems = document.querySelectorAll("[data-dropdown]");

function closeMobileMenu() {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");

  dropdownItems.forEach((item) => {
    item.classList.remove("open");
    const toggle = item.querySelector(".dropdown-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("open", !isOpen);

    if (isOpen) {
      dropdownItems.forEach((item) => {
        item.classList.remove("open");
        const toggle = item.querySelector(".dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 980px)").matches) {
        closeMobileMenu();
      }
    });
  });
}

dropdownItems.forEach((item) => {
  const toggle = item.querySelector(".dropdown-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = item.classList.contains("open");

    dropdownItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("open");
        const otherToggle = otherItem.querySelector(".dropdown-toggle");
        if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
      }
    });

    const shouldOpen =
      window.matchMedia("(min-width: 981px)").matches || !isOpen;
    item.classList.toggle("open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
  });

  item.addEventListener("mouseenter", () => {
    if (!window.matchMedia("(min-width: 981px)").matches) return;
    item.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  });

  item.addEventListener("mouseleave", () => {
    if (!window.matchMedia("(min-width: 981px)").matches) return;
    item.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-dropdown]")) return;

  dropdownItems.forEach((item) => {
    item.classList.remove("open");
    const toggle = item.querySelector(".dropdown-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (window.matchMedia("(min-width: 981px)").matches) {
      const openItem = document.querySelector("[data-dropdown].open");
      if (openItem) {
        openItem.classList.remove("open");
        const toggle = openItem.querySelector(".dropdown-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      }
      return;
    }

    closeMobileMenu();
    if (menuToggle) menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 981px)").matches) {
    closeMobileMenu();
  }
});

const backToTopButton = document.querySelector("[data-back-to-top]");

if (backToTopButton) {
  const updateBackToTop = () => {
    backToTopButton.classList.toggle("visible", window.scrollY > 600);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const newsletterForm = document.querySelector("[data-newsletter-form]");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const status = newsletterForm.querySelector("[role='status']");

    if (!emailInput || !status) return;

    const email = emailInput.value.trim();

    if (!email || !emailInput.checkValidity()) {
      status.textContent = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.focus();
      return;
    }

    emailInput.removeAttribute("aria-invalid");
    status.textContent = "Thank you. Newsletter delivery is not connected yet.";
    newsletterForm.reset();
  });
}

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  const status = form.querySelector("[role='status']");
  const controls = form.querySelectorAll("input, select, textarea");

  controls.forEach((control) => {
    control.addEventListener("input", () => {
      if (control.checkValidity()) {
        control.removeAttribute("aria-invalid");
      }
    });

    control.addEventListener("change", () => {
      if (control.checkValidity()) {
        control.removeAttribute("aria-invalid");
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!status) return;

    let firstInvalidControl = null;
    controls.forEach((control) => {
      if (!control.checkValidity()) {
        control.setAttribute("aria-invalid", "true");
        if (!firstInvalidControl) firstInvalidControl = control;
      } else {
        control.removeAttribute("aria-invalid");
      }
    });

    if (firstInvalidControl) {
      status.textContent = "Please complete the required fields with valid information.";
      firstInvalidControl.focus();
      firstInvalidControl.reportValidity();
      return;
    }

    status.textContent = "Form validated in this browser only. No information was sent or stored.";
  });
});

document.querySelectorAll("[data-faq-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panelId = toggle.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });
});
