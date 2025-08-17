/*
  WellSpring Family Clinic — Condensed JS
  Same behaviour, less code. Keeps all existing IDs/classes.
  Modules: popup, nav, bmi, forms (appointment + contact), scrollAnims, a11y.
*/
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const show = (el) => el && (el.style.display = el.id === 'welcomePopup' ? 'flex' : 'block');
  const hide = (el) => el && (el.style.display = 'none');

  document.addEventListener('DOMContentLoaded', () => {
    popup.init();
    nav.init();
    bmi.init();
    forms.appointment();
    forms.contact();
    scrollAnims.init();
    a11y.init();
    console.log('%cWellSpring Family Clinic', 'color:#2c5aa0;font-size:16px;font-weight:bold;');
    console.log('%cBuilt for accessibility & performance', 'color:#4fc3f7;font-size:12px;');
  });

  // --- Welcome Popup ---
  const popup = (() => {
    const overlay = $('#welcomePopup');
    const startBtn = $('#getStartedBtn');
    const trigger = $('#studentInfoBtn');
    const VISITED = 'wellspring_visited';
    const isIndex = () => /(^\/$)|index\.html$|\/$/.test(location.pathname);

    function open(fromNav = false) {
      if (!overlay) return;
      overlay.style.display = 'flex';
      overlay.classList.add('show');
      if (fromNav) overlay.classList.add('from-nav');
    }
    function close() {
      if (!overlay) return;
      overlay.classList.add('closing');
      overlay.classList.remove('show', 'from-nav');
      setTimeout(() => { hide(overlay); overlay.classList.remove('closing'); }, 200);
    }
    function init() {
      if (!overlay) return;
      const visited = localStorage.getItem(VISITED);
      if (!visited && isIndex()) setTimeout(() => open(false), 500); else hide(overlay);

      on(startBtn, 'click', (e) => { e.preventDefault(); localStorage.setItem(VISITED, 'true'); close(); });
      on(overlay, 'click', (e) => { if (e.target === overlay) { localStorage.setItem(VISITED, 'true'); close(); }});
      on(document, 'keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('show')) close(); });
      on(trigger, 'click', (e) => { e.preventDefault(); localStorage.setItem(VISITED, 'true'); open(true); nav.close(); });
    }
    return { init, open, close };
  })();

  // --- Navigation ---
  const nav = (() => {
    const burger = $('.hamburger');
    const menu = $('.nav-menu');
    function toggle() { burger.classList.toggle('active'); menu.classList.toggle('active'); }
    function close() { burger && burger.classList.remove('active'); menu && menu.classList.remove('active'); }
    function init() {
      if (!burger || !menu) return;
      on(burger, 'click', toggle);
      $$('.nav-link').forEach((a) => on(a, 'click', close));
      on(document, 'click', (e) => { if (!burger.contains(e.target) && !menu.contains(e.target)) close(); });
    }
    return { init, close };
  })();

  // --- BMI Calculator ---
  const bmi = (() => {
    function init() { on($('#bmiForm'), 'submit', (e) => { e.preventDefault(); calc(); }); }
    const cmToM = (h, u) => (u === 'cm' ? h / 100 : h);
    const rangeOk = (m, w) => m >= 0.5 && m <= 2.5 && w >= 20 && w <= 300;

    function calc() {
      const h = parseFloat($('#height')?.value || '');
      const u = $('#heightUnit')?.value || 'm';
      const w = parseFloat($('#weight')?.value || '');
      if (!h || !w || h <= 0 || w <= 0) return err('Please enter valid height and weight values.');
      const m = cmToM(h, u);
      if (!rangeOk(m, w)) return err('Please enter height 50–250 cm (0.5–2.5 m) and weight 20–300 kg.');

      const value = w / (m * m);
      const r = value.toFixed(1);
      const [label, cls] = value < 18.5 ? ['Underweight', 'underweight'] : value < 25 ? ['Normal Weight', 'normal'] : value < 30 ? ['Overweight', 'overweight'] : ['Obese', 'obese'];

      $('#bmiValue').textContent = r;
      const cat = $('#bmiCategory');
      cat.textContent = label;
      cat.className = `bmi-category ${cls}`;
      $('#bmiDescription').textContent = `Your BMI is ${r} — ${label.replace(' Weight','')}`;

      show($('#results'));
      hide($('.calculator-form'));
      $('#results').classList.add('fade-in-up');
      hideErr();
    }
    function reset() { hide($('#results')); show($('.calculator-form')); $('#bmiForm')?.reset(); hideErr(); $('.calculator-form')?.classList.add('fade-in-up'); }
    function err(msg) { const box = $('#errorMessage'); box.querySelector('p').textContent = msg; show(box); box.classList.add('fade-in-up'); }
    function hideErr() { hide($('#errorMessage')); }
    return { init, reset };
  })();

  // --- Forms (Appointment + Contact) ---
  const forms = (() => {
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const phoneOk = (v) => { const s = (v || '').replace(/\s/g, ''); return /(^(\+61|0)[2-9]\d{8}$)|^(0[2-9]\s?\d{4}\s?\d{4})$|^(\(0[2-9]\)\s?\d{4}\s?\d{4})$/.test(s); };
    const nameOk = (v) => /^[a-zA-Z\s'-]+$/.test(v);
    const futureDate = (d) => { const sd = new Date(d), t = new Date(); t.setHours(0,0,0,0); return sd >= t; };

    function showField(id, msg) { const e = document.getElementById(id + 'Error'); if (e) { e.textContent = msg; e.style.display = 'block'; } const input = document.getElementById(id); if (input) input.style.borderColor = '#ef5350'; }
    function clearErrors(scope) { (scope ? scope.querySelectorAll('.error-text') : $$('.error-text')).forEach((e) => { e.style.display = 'none'; e.textContent = ''; }); (scope ? scope.querySelectorAll('input,select,textarea') : $$('input,select,textarea')).forEach((i) => (i.style.borderColor = '#e0e0e0')); }

    // Appointment form
    function appointment() {
      const form = $('#appointmentForm'); if (!form) return;
      on(form, 'submit', (e) => { e.preventDefault(); validate(); });
      const date = $('#preferredDate'); if (date) date.setAttribute('min', new Date().toISOString().split('T')[0]);

      function validate() {
        clearErrors(form); let ok = true; const fd = new FormData(form);
        const need = ['firstName', 'lastName', 'email', 'phone', 'preferredDate', 'consent'];
        need.forEach((n) => { const v = fd.get(n); if (!v || (n === 'consent' && !$('#consent')?.checked)) { showField(n, n === 'consent' ? 'You must consent to data collection' : `${label(n)} is required`); ok = false; } });
        const email = fd.get('email'); if (email && !emailOk(email)) { showField('email', 'Please enter a valid email address'); ok = false; }
        const phone = fd.get('phone'); if (phone && !phoneOk(phone)) { showField('phone', 'Please enter a valid Australian phone number'); ok = false; }
        const d = fd.get('preferredDate'); if (d && !futureDate(d)) { showField('preferredDate', 'Please select a future date'); ok = false; }
        const fn = fd.get('firstName'); if (fn && !nameOk(fn)) { showField('firstName', 'First name should only contain letters'); ok = false; }
        const ln = fd.get('lastName'); if (ln && !nameOk(ln)) { showField('lastName', 'Last name should only contain letters'); ok = false; }
        if (ok) submit();
      }
      function submit() { hide(form); show($('#successMessage')); $('#successMessage').classList.add('fade-in-up'); $('#successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }

    // Contact form
    function contact() {
      const form = $('#contactForm'); if (!form) return;
      on(form, 'submit', (e) => { e.preventDefault(); validate(); });

      function showC(id, msg) { const e = document.getElementById(id + 'Error'); if (e) { e.textContent = msg; e.style.display = 'block'; } const input = document.getElementById(id); if (input) input.style.borderColor = '#ef5350'; }
      function validate() {
        clearErrors(form); let ok = true; const fd = new FormData(form);
        const req = [
          { id: 'contactFirstName', name: 'firstName', msg: 'First name is required' },
          { id: 'contactLastName', name: 'lastName', msg: 'Last name is required' },
          { id: 'contactEmail', name: 'email', msg: 'Email address is required' },
          { id: 'contactSubject', name: 'subject', msg: 'Please select a subject' },
          { id: 'contactMessage', name: 'message', msg: 'Message is required' }
        ];
        req.forEach((f) => { const v = fd.get(f.name); if (!v) { showC(f.id, f.msg); ok = false; } });
        const email = fd.get('email'); if (email && !emailOk(email)) { showC('contactEmail', 'Please enter a valid email address'); ok = false; }
        const phone = fd.get('phone'); if (phone && phone.trim() !== '' && !phoneOk(phone)) { showC('contactPhone', 'Please enter a valid phone number'); ok = false; }
        const fn = fd.get('firstName'); if (fn && !nameOk(fn)) { showC('contactFirstName', 'First name should only contain letters'); ok = false; }
        const ln = fd.get('lastName'); if (ln && !nameOk(ln)) { showC('contactLastName', 'Last name should only contain letters'); ok = false; }
        const msg = fd.get('message'); if (msg && msg.length < 10) { showC('contactMessage', 'Message should be at least 10 characters long'); ok = false; }
        if (ok) submit();
      }
      function submit() { hide(form); show($('#contactSuccessMessage')); $('#contactSuccessMessage').classList.add('fade-in-up'); $('#contactSuccessMessage').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }

    const label = (n) => ({ firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone', preferredDate: 'Preferred date' }[n] || n);

    return { appointment, contact };
  })();

  // --- Scroll animations ---
  const scrollAnims = (() => {
    function init() {
      const opts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
      const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('fade-in-up'); io.unobserve(en.target); } }), opts);
      $$('.service-card, .action-item, .service-detail, .category-item, .doctor-card, .facility-item, .activity-item, .faq-item, .contact-method, .hero-content, .hero-image').forEach((t) => io.observe(t));
    }
    return { init };
  })();

  // --- Accessibility ---
  const a11y = (() => {
    function init() { addSkip(); keyboard(); aria(); focusMgmt(); }
    function addSkip() {
      const a = document.createElement('a');
      a.href = '#main-content'; a.textContent = 'Skip to main content'; a.className = 'skip-link';
      a.style.cssText = 'position:absolute;top:-40px;left:6px;background:#2c5aa0;color:#fff;padding:8px;text-decoration:none;border-radius:4px;z-index:1001;';
      a.addEventListener('focus', () => (a.style.top = '6px'));
      a.addEventListener('blur', () => (a.style.top = '-40px'));
      document.body.prepend(a);
      const main = $('main'); if (main && !main.id) main.id = 'main-content';
    }
    function keyboard() {
      $$('.cta-button, .action-button, .service-cta').forEach((b) => on(b, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } }));
      const h = $('.hamburger'); if (h) { h.tabIndex = 0; h.role = 'button'; h.setAttribute('aria-label', 'Toggle navigation menu'); on(h, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.click(); } }); }
    }
    function aria() {
      $$('.nav-link').forEach((l) => { if (!l.getAttribute('aria-label')) l.setAttribute('aria-label', `Navigate to ${l.textContent.trim()}`); });
      $$('input,select,textarea').forEach((i) => { const lbl = document.querySelector(`label[for="${i.id}"]`); if (!lbl && !i.getAttribute('aria-label')) { const ph = i.getAttribute('placeholder'); if (ph) i.setAttribute('aria-label', ph); } });
    }
    function focusMgmt() {
      const h = $('.hamburger'), m = $('.nav-menu');
      if (h && m) on(h, 'click', () => { if (m.classList.contains('active')) setTimeout(() => m.querySelector('.nav-link')?.focus(), 100); });
      $$('form').forEach((f) => on(f, 'submit', (e) => { if (e.defaultPrevented) { const err = f.querySelector('.error-text[style*="block"]'); const input = err?.previousElementSibling; input?.focus(); } }));
    }
    return { init };
  })();

  // Utilities
  function debounce(fn, wait) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; }

  // Global listeners
  window.addEventListener('popstate', () => nav.close());
  window.addEventListener('resize', debounce(() => { if (innerWidth >= 768) nav.close(); }, 250));

  // BMI reset handlers (Calculate Again / Reset)
  on(document, 'click', (e) => {
    const btn = e.target.closest('#recalculateBtn, .recalculate-btn, #resetBtn, .reset-btn, [data-bmi-reset]');
    if (btn) { e.preventDefault(); bmi.reset(); }
  });

  // Back-compat for inline onclick="resetCalculator()"
  window.resetCalculator = () => bmi.reset();
})();
