/* Yunic Dining — interactions
   Nav state, mobile overlay, scroll reveals, flip cards (touch),
   band parallax, contact form, footer year */

(function () {
  'use strict';

  /* nav shadow on scroll */
  var nav = document.getElementById('siteNav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu overlay */
  var toggle = document.querySelector('.nav-toggle');
  var overlay = document.querySelector('.menu-overlay');
  function setMenu(open) {
    toggle.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () {
    setMenu(!overlay.classList.contains('open'));
  });
  overlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* scroll reveals — IO-driven, with an immediate pass for anything
     already in view at load (also covers edge cases where IO is late) */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.94 && r.bottom > 0;
  }
  function revealVisible() {
    reveals.forEach(function (el) {
      if (!el.classList.contains('in') && inView(el)) el.classList.add('in');
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  }
  /* fallback so content can never stay hidden: re-check in-view items
     on scroll (rAF-throttled) and once more shortly after load */
  var rvTicking = false;
  window.addEventListener('scroll', function () {
    if (rvTicking) return;
    rvTicking = true;
    requestAnimationFrame(function () { revealVisible(); rvTicking = false; });
  }, { passive: true });
  window.addEventListener('load', revealVisible);
  setTimeout(revealVisible, 2600);
  revealVisible();

  /* flip cards — tap/click + keyboard for touch devices */
  document.querySelectorAll('.flip').forEach(function (card) {
    function flip() { card.classList.toggle('flipped'); }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
  });

  /* gentle parallax on photo bands */
  var bands = document.querySelectorAll('[data-parallax]');
  if (bands.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function parallax() {
      bands.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        img.style.transform = 'translateY(' + (progress * -46) + 'px)';
      });
    }
    window.addEventListener('scroll', parallax, { passive: true });
    parallax();
  }

  /* contact form — friendly inline confirmation (no backend, as on current site) */
  var form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.innerHTML = '<p style="padding:2rem 0;font-family:var(--serif-it);font-style:italic;font-size:1.2rem;color:var(--gold-deep)">Thank you — we will be in touch within 24 hours. For a faster reply, WhatsApp us directly.</p>';
    });
  }

  /* footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
