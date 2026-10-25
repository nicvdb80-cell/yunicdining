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

  /* Open an enquiry in WhatsApp; the visitor reviews and sends it there. */
  var form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = [['f-name', 'Name'], ['f-contact', 'Contact'], ['f-date', 'Date'], ['f-loc', 'Location'], ['f-guests', 'Guests'], ['f-msg', 'Occasion']];
      var lines = ['Hello Yunic Dining, I would like to discuss an experience.', ''];
      fields.forEach(function (field) {
        var value = document.getElementById(field[0]).value.trim();
        if (value) lines.push(field[1] + ': ' + value);
      });
      window.location.href = 'https://wa.me/6281994807407?text=' + encodeURIComponent(lines.join('\n'));
    });
  }

  /* footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Optional music; the page opens immediately and silently. */
  var music = document.getElementById('bgMusic');
  var soundToggle = document.getElementById('soundToggle');
  if (music && soundToggle) {
    music.volume = 0.35;
    soundToggle.classList.add('visible');
    function reflectMusic() {
      var playing = !music.paused;
      soundToggle.setAttribute('aria-pressed', String(playing));
      soundToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    }
    music.addEventListener('play', reflectMusic);
    music.addEventListener('pause', reflectMusic);
    soundToggle.addEventListener('click', function () {
      if (music.paused) music.play().catch(reflectMusic);
      else music.pause();
    });
    reflectMusic();
  }
})();
