/**
 * PsySite — main.js
 * Minimal vanilla JS: nav toggle, FAQ accordion, scroll animations, sticky header
 */

/* ============================================
   1. MOBILE NAVIGATION TOGGLE
   ============================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');

  if (!toggle || !nav) return;

  let scrollY = 0;

  function openNav() {
    scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-active');
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    const firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    document.body.style.top = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    window.scrollTo(0, scrollY);
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  // Close when any nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  // Close when clicking outside (the overlay)
  document.addEventListener('click', (e) => {
    if (
      nav.classList.contains('is-open') &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeNav();
    }
  });
}

/* ============================================
   2. FAQ ACCORDION
   ============================================ */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq__item');

  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (single-open accordion)
      items.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          other.querySelector('.faq__question')
               .setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ============================================
   3. SCROLL-TRIGGERED ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  // Skip animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animating — no need to observe again
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Observe single-element reveals and stagger containers
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================
   4. STICKY HEADER SCROLL STATE
   ============================================ */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Run once on page load
}

/* ============================================
   5. CONTACT FORM — SUCCESS STATE
   ============================================ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const nameInput    = form.querySelector('#name');
    const contactInput = form.querySelector('#contact');

    if (!nameInput.value.trim() || !contactInput.value.trim()) {
      // Highlight empty required fields
      [nameInput, contactInput].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#C4896F';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });
      return;
    }

    // Show success state (form action would go here in production)
    form.hidden = true;
    success.hidden = false;
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initScrollAnimations();
  initStickyHeader();
  initContactForm();
});
