/* Tropical Surf Expeditions — shared behaviour
   Motion spec: brand/visual-direction.html §07 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- nav */
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');

  function setNav() {
    if (!nav) return;
    // Solid once the hero has passed; if a page has no hero, solid from the top.
    var trigger = hero ? hero.offsetHeight - nav.offsetHeight : 8;
    nav.classList.toggle('solid', window.scrollY > trigger);
  }
  setNav();
  window.addEventListener('scroll', setNav, { passive: true });
  window.addEventListener('resize', setNav);

  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close when a link is chosen, and on Escape.
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* -------------------------------------------------------------- video
     Source files are 4K originals, so nothing loads until it is needed and
     everything pauses when it leaves the viewport. */
  var vids = document.querySelectorAll('video[data-src]');
  if (vids.length) {
    if (reduce) {
      // Poster frames only — never autoplay.
      vids.forEach(function (v) { v.removeAttribute('autoplay'); });
    } else {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) {
            if (!v.src) {
              v.src = v.getAttribute('data-src');
              v.style.opacity = '0';
              v.style.transition = 'opacity 1600ms cubic-bezier(.16,1,.3,1)';
              v.addEventListener('loadeddata', function () { v.style.opacity = '1'; }, { once: true });
            }
            var p = v.play();
            if (p && p.catch) p.catch(function () { /* autoplay refused — poster stands in */ });
          } else if (!v.paused) {
            v.pause();
          }
        });
      }, { threshold: 0.15 });
      vids.forEach(function (v) { vio.observe(v); });
    }
  }

  /* ------------------------------------------------------------- reveal */
  var rv = document.querySelectorAll('.rv');
  if (rv.length && !reduce) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var i = parseInt(el.getAttribute('data-rv-i') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, i * 90);
        rio.unobserve(el); // fires once, never on scroll back
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { rio.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* --------------------------------------------------------------- form
     No backend is wired yet. We validate, then show the thank-you state so
     the flow can be reviewed end to end. */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    var err = form.querySelector('.form-err');
    var thanks = document.getElementById(form.getAttribute('data-thanks'));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [];
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = f.type === 'checkbox' ? !f.checked : !String(f.value).trim();
        if (f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value)) bad = true;
        if (bad) missing.push(f);
      });

      if (missing.length) {
        if (err) {
          err.textContent = 'Please add your name and a valid email, and tick the consent box.';
          err.classList.add('show');
        }
        missing[0].focus();
        return;
      }
      if (err) err.classList.remove('show');
      form.classList.add('sent');
      if (thanks) {
        thanks.classList.add('show');
        thanks.setAttribute('tabindex', '-1');
        thanks.focus({ preventScroll: true });
        thanks.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
    });
  });
})();
