/* ═══════════════════════════════════════════════════════════
   CAP-GEO 2026 – Main JavaScript
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navbar scroll effect ─────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ── Mobile nav toggle ────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
      spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
      spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => s.removeAttribute('style'));
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => s.removeAttribute('style'));
    });
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => s.removeAttribute('style'));
    }
  });

  /* ── Active nav link highlighting ────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function highlightNavLink() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  /* ── Back to top button ───────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Intersection Observer – fade-in animations ───────── */
  function initFadeIn() {
    const targets = document.querySelectorAll([
      '.about-card',
      '.objective-card',
      '.session-card',
      '.day-card',
      '.outcome-item',
      '.takeaway-card',
      '.fee-card',
      '.team-card',
      '.contact-card',
      '.accom-card',
      '.stat-item',
    ].join(','));

    targets.forEach(function (el) {
      el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (index * 80) + 'ms';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  if ('IntersectionObserver' in window) {
    initFadeIn();
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Section header animations ───────────────────────── */
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(function (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(20px)';
    header.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const headerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sectionHeaders.forEach(function (header) { headerObserver.observe(header); });

  /* ── Countdown timer ─────────────────────────────────── */
  function createCountdown() {
    const deadline = new Date('2026-03-10T23:59:59');
    const container = document.querySelector('.hero-deadline');
    if (!container) return;

    const timerEl = document.createElement('span');
    timerEl.className = 'countdown-inline';
    timerEl.style.cssText = 'margin-left: 8px; font-weight: 800; color: #e5b34e;';
    container.appendChild(timerEl);

    function tick() {
      const now  = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        timerEl.textContent = '(Closed)';
        return;
      }

      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000)  / 60000);
      const seconds = Math.floor((diff % 60000)    / 1000);

      timerEl.textContent =
        days + 'd ' +
        String(hours).padStart(2, '0') + 'h ' +
        String(minutes).padStart(2, '0') + 'm ' +
        String(seconds).padStart(2, '0') + 's';
    }

    tick();
    setInterval(tick, 1000);
  }

  createCountdown();

  /* ── Smooth scroll for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
