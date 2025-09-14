/**
 * JavaScript pro interaktivní komponenty
 * Implementujte funkčnost hamburger menu a accordion
 *
 * Implementujte:
 * 1. Hamburger menu toggle pro mobilní zobrazení (header komponenta)
 * 2. Accordion funkčnost pro FAQ (accordion komponenta)
 *    - Klik na otázku otevře/zavře odpověď
 *    - Pouze jedna odpověď otevřená najednou (nebo více podle designu)
 *    - Smooth animace při otevírání/zavírání
 *    - Příslušné ARIA atributy pro přístupnost
 */

// 1. Hamburger menu toggle pro mobilní zobrazení (header komponenta)
const toggle = document.querySelector(".js-nav-toggle");
const nav = document.getElementById("header-nav");
const body = document.body;
const mq = matchMedia("(min-width: 481px)");
const container = document.querySelector(".header");
const focusable =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

let abort;

function getFocusable() {
  return [...container.querySelectorAll(focusable)];
}

function trapFocus(active) {
  abort?.abort();
  if (!active || mq.matches) return;

  const ctrl = new AbortController();
  abort = ctrl;

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") return setNav(false);
      if (e.key !== "Tab") return;

      const f = getFocusable();
      if (!f.length) return;
      const [first, last] = [f[0], f[f.length - 1]];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    { capture: true, signal: ctrl.signal }
  );
}

function setNav(open) {
  toggle.setAttribute("aria-expanded", open);
  nav.classList.toggle("header__nav--active", open);
  nav.toggleAttribute("inert", !open);
  nav.setAttribute("aria-hidden", !open);
  body.classList.toggle("body--lock", open && !mq.matches);

  if (!mq.matches) {
    if (open) {
      (getFocusable()[0] || nav).focus();
    } else {
      toggle.focus();
    }
  }

  trapFocus(open);
}

toggle.addEventListener("click", () =>
  setNav(toggle.getAttribute("aria-expanded") !== "true")
);

mq.addEventListener("change", () => setNav(mq.matches));
setNav(mq.matches);

// 2. Accordion funkčnost pro FAQ (accordion komponenta)
const questionButtons = document.querySelectorAll(".faq__question-button");

questionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.closest(".faq__item");
    const answer = faqItem.querySelector(".faq__answer");

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    faqItem.classList.toggle("faq__item--open", !isExpanded);

    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.setAttribute("aria-hidden", String(isExpanded));
  });
});
