'use strict';
/* ================================================================
   ASHEN PAUL — main.js  (Task 2 update)
   Handles:
   1. Theme toggle (dark / light) with localStorage persistence
   2. Mobile nav toggle
   3. Scroll-reveal (IntersectionObserver)
   4. Project category filter
   5. Contact form validation
   ================================================================ */


/* ── 1. THEME TOGGLE ─────────────────────────────────────────── */
const html      = document.documentElement;
const themeBtn  = document.getElementById('theme-btn');
const DARK  = 'dark';
const LIGHT = 'light';

/* Read saved preference, fall back to dark (site default) */
function getSavedTheme() {
  return localStorage.getItem('ap-theme') || DARK;
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (themeBtn) {
    const isDark = theme === DARK;
    themeBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

/* Apply on load — prevents flash of wrong theme */
applyTheme(getSavedTheme());

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current  = html.getAttribute('data-theme') || DARK;
    const next     = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    localStorage.setItem('ap-theme', next);
  });
}


/* ── 2. MOBILE NAV ───────────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (navToggle && primaryNav) {

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navToggle.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
    primaryNav.classList.toggle('open', !open);
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !primaryNav.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      primaryNav.classList.remove('open');
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
      navToggle.focus();
    }
  });
}


/* ── 3. SCROLL REVEAL (IntersectionObserver) ─────────────────── */
function initReveal() {
  /* Bail out for reduced-motion users */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); /* fire once */
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

initReveal();


/* ── 4. PROJECT FILTER ───────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projItems    = document.querySelectorAll('#proj-list li');
const filterStatus = document.getElementById('filter-status');

if (filterBtns.length && projItems.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      /* Update button pressed states */
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      /* Show / hide project items */
      let count = 0;
      projItems.forEach(item => {
        const cats = (item.dataset.category || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);
        item.hidden = !show;
        if (show) count++;
      });

      /* Announce result to screen readers */
      if (filterStatus) {
        filterStatus.textContent =
          `Showing ${count} project${count !== 1 ? 's' : ''} — ${
            filter === 'all' ? 'all categories' : filter
          }.`;
      }
    });
  });
}


/* ── 5. CONTACT FORM ─────────────────────────────────────────── */
const form = document.getElementById('contact-form');

if (form) {
  const nameEl    = form.querySelector('#name');
  const emailEl   = form.querySelector('#email');
  const messageEl = form.querySelector('#message');
  const consentEl = form.querySelector('#consent');
  const charCount = document.getElementById('char-count');
  const formMsg   = document.getElementById('form-msg');
  const submitBtn = form.querySelector('[type="submit"]');
  const spinner   = submitBtn && submitBtn.querySelector('.btn-spinner');

  /* Live character count */
  if (messageEl && charCount) {
    messageEl.addEventListener('input', () => {
      const n = messageEl.value.length;
      charCount.textContent = n > 0 ? `${n} character${n !== 1 ? 's' : ''} so far.` : '';
    });
  }

  /* Helpers */
  function showErr(input, errId, msg) {
    const el = document.getElementById(errId);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearErr(input, errId) {
    const el = document.getElementById(errId);
    if (!el) return;
    el.textContent = '';
    el.hidden = true;
    input.removeAttribute('aria-invalid');
  }

  /* Validators */
  function checkName() {
    if (!nameEl.value.trim()) {
      showErr(nameEl, 'name-err', 'Please enter your name.'); return false;
    }
    clearErr(nameEl, 'name-err'); return true;
  }

  function checkEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl.value.trim()) {
      showErr(emailEl, 'email-err', 'Please enter your email address.'); return false;
    }
    if (!re.test(emailEl.value.trim())) {
      showErr(emailEl, 'email-err', "That doesn't look like a valid email address."); return false;
    }
    clearErr(emailEl, 'email-err'); return true;
  }

  function checkMessage() {
    if (!messageEl.value.trim()) {
      showErr(messageEl, 'message-err', 'Please write a message.'); return false;
    }
    if (messageEl.value.trim().length < 10) {
      showErr(messageEl, 'message-err', 'Message needs to be at least 10 characters.'); return false;
    }
    clearErr(messageEl, 'message-err'); return true;
  }

  function checkConsent() {
    if (!consentEl.checked) {
      showErr(consentEl, 'consent-err', 'Please tick the box to continue.'); return false;
    }
    clearErr(consentEl, 'consent-err'); return true;
  }

  /* Validate on blur */
  nameEl.addEventListener('blur', checkName);
  emailEl.addEventListener('blur', checkEmail);
  messageEl.addEventListener('blur', checkMessage);
  consentEl.addEventListener('change', checkConsent);

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const valid = [
      checkName(),
      checkEmail(),
      checkMessage(),
      checkConsent()
    ].every(Boolean);

    if (!valid) {
      const bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      showFeedback('error', 'A few things need fixing above before sending.');
      return;
    }

    /* Loading state */
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }
    if (spinner) spinner.hidden = false;

    /* Simulated network request — replace with real fetch() in production */
    await new Promise(r => setTimeout(r, 1400));

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
    if (spinner) spinner.hidden = true;

    showFeedback('success', "Message sent! I'll get back to you soon.");
    form.reset();
    if (charCount) charCount.textContent = '';
  });

  function showFeedback(type, msg) {
    if (!formMsg) return;
    formMsg.textContent   = msg;
    formMsg.className     = `form-feedback ${type}`;
    formMsg.hidden        = false;
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    formMsg.focus();
  }
}
