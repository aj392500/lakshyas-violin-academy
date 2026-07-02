/* ═══════════════════════════════════════════════════════════════
   Lakshya's Violin Academy — shared navigation behaviour
   (hamburger menu, mobile accordions, current-page highlight,
    one-time first-visit welcome tour)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var nav = document.querySelector('.lva-nav');
  if (!nav) return;

  var burger = nav.querySelector('.lva-burger');
  var menu = nav.querySelector('.lva-menu');

  /* ── hamburger toggle ── */
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeAllDrops();
    });
  }

  /* ── dropdown buttons (tap-friendly, works on mobile & desktop) ── */
  var drops = nav.querySelectorAll('.lva-drop');
  function closeAllDrops(except) {
    drops.forEach(function (d) {
      if (d !== except) {
        d.classList.remove('open');
        var b = d.querySelector('.lva-drop-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }
  drops.forEach(function (drop) {
    var btn = drop.querySelector('.lva-drop-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAllDrops(open ? drop : null);
    });
  });

  /* ── close menu when a link is chosen or user taps outside ── */
  nav.querySelectorAll('.lva-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
      closeAllDrops();
    });
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      nav.classList.remove('open');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
      closeAllDrops();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      nav.classList.remove('open');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
      closeAllDrops();
    }
  });

  /* ═══════════════════════════════════════════════════════════
     FIRST-VISIT WELCOME TOUR
     Shows once per browser; never again after it is closed.
     ═══════════════════════════════════════════════════════════ */
  (function welcomeTour() {
    var KEY = 'lva_welcome_done';
    var seen = false;
    try { seen = !!localStorage.getItem(KEY); } catch (e) { seen = true; }
    if (seen) return;

    function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

    var overlay = document.createElement('div');
    overlay.className = 'lva-welcome-overlay';
    overlay.innerHTML =
      '<div class="lva-welcome" role="dialog" aria-modal="true" aria-labelledby="lvaWelcomeTitle">' +
        '<button class="lva-welcome-close" aria-label="Close welcome guide">✕</button>' +
        '<h2 id="lvaWelcomeTitle">👋 Welcome to Lakshya’s Violin Academy!</h2>' +
        '<p class="sub">First time here? Here’s how to find your way around:</p>' +
        '<div class="lva-welcome-tip"><div class="ti">🧭</div><div><b>Use the top menu</b><span>It’s the same on every page. On a phone, tap the ☰ button in the corner.</span></div></div>' +
        '<div class="lva-welcome-tip"><div class="ti">🎮</div><div><b>Games &amp; Labs</b><span>12 fun musical games for kids — hear ragas, tap thalas, train your ears!</span></div></div>' +
        '<div class="lva-welcome-tip"><div class="ti">📖</div><div><b>New to Carnatic music?</b><span>Open <b>Learn</b> in the menu for a friendly introduction, step by step.</span></div></div>' +
        '<div class="lva-welcome-tip"><div class="ti">🎻</div><div><b>Ready for classes?</b><span>Tap the orange <b>Enroll Now</b> button to book a free trial.</span></div></div>' +
        '<button class="lva-welcome-go">Got it — let’s make music! 🎶</button>' +
        '<p class="lva-welcome-note">This little guide appears only once. 🎵</p>' +
      '</div>';

    function close() {
      markSeen();
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.lva-welcome-close').addEventListener('click', close);
    overlay.querySelector('.lva-welcome-go').addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    setTimeout(function () {
      document.body.appendChild(overlay);
      overlay.querySelector('.lva-welcome-go').focus();
    }, 700);
  })();

  /* ── highlight the current page ── */
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  nav.querySelectorAll('.lva-menu a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (href && href === here) {
      a.classList.add('cur');
      var drop = a.closest('.lva-drop');
      if (drop) drop.classList.add('cur');
    }
  });
})();
