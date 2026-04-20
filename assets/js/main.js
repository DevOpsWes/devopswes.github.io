// Theme toggle
(function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
  });
})();

// Sticky header shadow
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Mobile menu toggle
(function () {
  var btn  = document.getElementById('mobile-menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var isOpen = !menu.hidden;
    menu.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }
  });
})();

// Scroll-reveal animation for post cards
(function () {
  var cards = document.querySelectorAll('.post-card');
  if (!cards.length) return;

  // Skip animation if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (c) { c.classList.add('visible'); });
    return;
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // Stagger each card by 80ms
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function (card) { observer.observe(card); });
  } else {
    // Fallback for browsers without IntersectionObserver
    cards.forEach(function (c) { c.classList.add('visible'); });
  }
})();

// Homepage search redirect
(function () {
  var inp = document.getElementById('home-search-input');
  var btn = document.getElementById('home-search-btn');
  if (!inp) return;

  function go() {
    var q = inp.value.trim();
    if (q) window.location.href = '/search?q=' + encodeURIComponent(q);
  }

  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  if (btn) btn.addEventListener('click', go);
})();
