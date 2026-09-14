'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

function onMediaChange(query, listener) {
  if (query.addEventListener) query.addEventListener('change', listener);
  else query.addListener(listener);
}

// Keep anchor offsets and the scrollable mobile menu aligned with the actual header.
const headerBar = document.querySelector('.header-inner');
function syncHeaderHeight() {
  document.documentElement.style.setProperty('--header-bar-height', `${headerBar.getBoundingClientRect().height}px`);
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(headerBar);

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.hidden = !willOpen;
});

mobileMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileMenu.hidden) closeMenu(true);
});

document.addEventListener('click', (event) => {
  if (!mobileMenu.hidden && !event.target.closest('.site-header')) closeMenu();
});

onMediaChange(window.matchMedia('(max-width: 68.75em)'), (event) => {
  if (!event.matches) closeMenu();
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

// Non-clickable review ribbon; native scrolling also works without animation or JS.
const reviewsViewport = document.querySelector('.reviews-viewport');
const reviewsTrack = document.querySelector('.reviews-track');
const reviewsGroup = document.querySelector('.reviews-group');

if (reviewsViewport && reviewsTrack && reviewsGroup && 'ResizeObserver' in window && 'IntersectionObserver' in window) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duplicate = reviewsGroup.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  duplicate.querySelectorAll('[aria-describedby]').forEach((node) => node.removeAttribute('aria-describedby'));
  reviewsTrack.append(duplicate);

  let hovering = false;
  let hasFocus = false;
  let pointerFocus = false;
  let interacting = false;
  let visible = false;
  let resumeAt = 0;
  let frame = 0;
  let previousTime = 0;
  let position = reviewsViewport.scrollLeft;
  let cycleWidth = reviewsGroup.getBoundingClientRect().width;

  function canMove() {
    return visible && !document.hidden && !reducedMotion.matches && !hovering && !hasFocus && !interacting;
  }

  function tick(time) {
    frame = 0;
    if (!canMove()) return;
    const elapsed = previousTime ? Math.min(time - previousTime, 64) : 0;
    previousTime = time;
    if (time >= resumeAt && cycleWidth > 0) {
      // A fractional position avoids jitter from scrollLeft rounding.
      position += elapsed * 0.028;
      if (position >= cycleWidth) position %= cycleWidth;
      reviewsViewport.scrollLeft = position;
    }
    frame = requestAnimationFrame(tick);
  }

  function syncMovement() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    position = reviewsViewport.scrollLeft;
    if (canMove()) frame = requestAnimationFrame(tick);
  }

  function syncMotionPreference() {
    // Never enable automatic motion when the visitor requests reduced motion.
    duplicate.hidden = reducedMotion.matches;
    duplicate.style.display = reducedMotion.matches ? 'none' : '';
    if (cycleWidth && reviewsViewport.scrollLeft >= cycleWidth) {
      reviewsViewport.scrollLeft %= cycleWidth;
    }
    syncMovement();
  }

  reviewsViewport.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      hovering = true;
      syncMovement();
    }
  });
  reviewsViewport.addEventListener('pointerleave', () => {
    hovering = false;
    syncMovement();
  });
  reviewsViewport.addEventListener('focusin', () => {
    hasFocus = !pointerFocus;
    syncMovement();
  });
  reviewsViewport.addEventListener('keydown', () => {
    pointerFocus = false;
    hasFocus = true;
    syncMovement();
  });
  reviewsViewport.addEventListener('focusout', (event) => {
    hasFocus = reviewsViewport.contains(event.relatedTarget);
    pointerFocus = false;
    syncMovement();
  });
  reviewsViewport.addEventListener('pointerdown', () => {
    pointerFocus = true;
    hasFocus = false;
    interacting = true;
    syncMovement();
  }, { passive: true });
  function endInteraction() {
    if (!interacting) return;
    interacting = false;
    resumeAt = performance.now() + 2200;
    syncMovement();
  }
  window.addEventListener('pointerup', endInteraction, { passive: true });
  window.addEventListener('pointercancel', endInteraction, { passive: true });
  reviewsViewport.addEventListener('wheel', () => {
    resumeAt = performance.now() + 2200;
  }, { passive: true });
  reviewsViewport.addEventListener('scroll', () => {
    if (!canMove() || performance.now() < resumeAt) {
      position = reviewsViewport.scrollLeft;
    }
  }, { passive: true });

  new ResizeObserver(() => {
    cycleWidth = reviewsGroup.getBoundingClientRect().width;
    syncMovement();
  }).observe(reviewsGroup);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncMovement();
  }, { threshold: 0 }).observe(reviewsViewport);
  document.addEventListener('visibilitychange', syncMovement);
  onMediaChange(reducedMotion, syncMotionPreference);
  syncMotionPreference();
}
