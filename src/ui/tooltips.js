/**
 * Shared tooltip behavior for settings/result explanation labels.
 */

const TOOLTIP_SELECTOR = '.settings-grid label[title], .card-label[title]';
const ENHANCED_CLASS = 'tooltip-anchor';
const OPEN_CLASS = 'is-tooltip-open';

let hasGlobalHandlers = false;

function isNaturallyFocusable(el) {
  return (
    el.matches('a[href], button, input, select, textarea, summary') ||
    el.hasAttribute('tabindex')
  );
}

function closeAllTooltips(except) {
  document.querySelectorAll(`.${OPEN_CLASS}`).forEach((el) => {
    if (el !== except) {
      el.classList.remove(OPEN_CLASS);
      if (el.hasAttribute('aria-expanded')) {
        el.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function toggleTooltip(anchor) {
  const shouldOpen = !anchor.classList.contains(OPEN_CLASS);
  closeAllTooltips(anchor);
  anchor.classList.toggle(OPEN_CLASS, shouldOpen);
  anchor.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
}

function attachGlobalHandlers() {
  if (hasGlobalHandlers) return;
  hasGlobalHandlers = true;

  document.addEventListener('click', (event) => {
    const icon = event.target.closest('.info-icon');
    if (icon) {
      const anchor = icon.closest(`.${ENHANCED_CLASS}`);
      if (anchor) {
        event.preventDefault();
        event.stopPropagation();
        toggleTooltip(anchor);
      }
      return;
    }

    if (!event.target.closest(`.${ENHANCED_CLASS}`)) {
      closeAllTooltips();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllTooltips();
    }
  });
}

export function upgradeTooltips(root = document) {
  const scope = root instanceof Element ? root : document;
  scope.querySelectorAll(TOOLTIP_SELECTOR).forEach((el) => {
    const tooltipText = el.getAttribute('title');
    if (!tooltipText) return;

    el.dataset.tooltip = tooltipText;
    el.removeAttribute('title');
    el.classList.add(ENHANCED_CLASS);

    if (!isNaturallyFocusable(el)) {
      el.setAttribute('tabindex', '0');
    }

    el.setAttribute('role', 'button');
    el.setAttribute('aria-expanded', 'false');
  });
}

export function initTooltips(root = document) {
  upgradeTooltips(root);
  attachGlobalHandlers();
}
