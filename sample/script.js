/* ═══════════════════════════════════════════════════════════════════
   ATELIER — Premium Art Magazine & Fine Art Awards
   Interactions, Animations & Scroll Effects
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Page Loader ───────────────────────────────────────────────
  const pageLoader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('loaded');
      // Remove from DOM after transition
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 600);
    }, 1600); // Wait for loader bar animation
  });


  // ─── Navbar Scroll Effect ──────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });


  // ─── Mobile Menu ───────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ─── Smooth Scroll for Anchor Links ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });


  // ─── Scroll Reveal (IntersectionObserver) ──────────────────────
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  // ─── Gallery Clip-Path Reveal ──────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');

  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add slight delay based on index
          const index = Array.from(galleryItems).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 120);
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  galleryItems.forEach(item => galleryObserver.observe(item));


  // ─── Gallery Drag to Scroll ────────────────────────────────────
  const galleryTrack = document.getElementById('galleryTrack');
  let isDown = false;
  let startX;
  let scrollLeft;

  galleryTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    galleryTrack.style.cursor = 'grabbing';
    startX = e.pageX - galleryTrack.offsetLeft;
    scrollLeft = galleryTrack.scrollLeft;
  });

  galleryTrack.addEventListener('mouseleave', () => {
    isDown = false;
    galleryTrack.style.cursor = 'grab';
  });

  galleryTrack.addEventListener('mouseup', () => {
    isDown = false;
    galleryTrack.style.cursor = 'grab';
  });

  galleryTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryTrack.scrollLeft = scrollLeft - walk;
  });


  // ─── Counter Animation ─────────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
        // Add "+" suffix for large numbers
        if (target >= 100) {
          el.textContent = target.toLocaleString() + '+';
        }
      }
    }

    requestAnimationFrame(step);
  }


  // ─── Parallax Effect ───────────────────────────────────────────
  const aboutImages = document.querySelector('.about-images');
  const aboutImgMain = document.querySelector('.about-img--main');
  const aboutImgSecondary = document.querySelector('.about-img--secondary');

  function handleParallax() {
    if (!aboutImages || window.innerWidth < 768) return;

    const rect = aboutImages.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.top < viewportHeight && rect.bottom > 0) {
      const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const offset = (scrollProgress - 0.5) * 40;

      if (aboutImgMain) {
        aboutImgMain.style.transform = `translateY(${offset * -0.5}px)`;
      }
      if (aboutImgSecondary) {
        aboutImgSecondary.style.transform = `translateY(${offset * 0.8}px)`;
      }
    }
  }

  let parallaxTicking = false;
  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(() => {
        handleParallax();
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }, { passive: true });


  // ─── Newsletter Form ───────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const btn = newsletterForm.querySelector('.newsletter-btn');
      const originalText = btn.textContent;

      btn.textContent = '✓';
      btn.style.background = '#4CAF50';
      input.value = '';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2500);
    });
  }


  // ─── Active Nav Link Highlight ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    }
  );

  sections.forEach(section => sectionObserver.observe(section));


  // ─── Subtle Hover Tilt on Bento Cards ──────────────────────────
  const bentoCards = document.querySelectorAll('.bento-card');

  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });


  // ─── Keyboard Accessibility ────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

})();
