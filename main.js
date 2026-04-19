/**
 * PORTFOLIO MAIN.JS
 * Author: Alex Johnson
 * Description: Vanilla JS for portfolio interactivity
 * Features: theme toggle, typewriter, counters, skill bars,
 *           scroll animations, active nav, contact form, parallax
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. THEME TOGGLE (Dark / Light Mode)
     ============================================================ */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  /**
   * Apply saved theme from localStorage on page load.
   * Default is dark mode; 'light' in storage enables light mode.
   */
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });


  /* ============================================================
     2. HAMBURGER MENU (Mobile Navigation)
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    hamburger.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });


  /* ============================================================
     3. NAVBAR HIDE / SHOW ON SCROLL DIRECTION
     ============================================================ */
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down — hide navbar
          navbar.classList.add('nav-hidden');
          // Also close mobile menu if open
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
          // Scrolling up — show navbar
          navbar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  /* ============================================================
     4. ACTIVE SECTION DETECTION
        Updates navbar links and side dots based on visible section
     ============================================================ */
  const sections = document.querySelectorAll('.section');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sideDots = document.querySelectorAll('#side-nav a');

  /**
   * Set the active state on nav links and side dots
   * matching the given section id.
   */
  function setActiveSection(id) {
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    sideDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.section === id);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70px'} 0px 0px 0px`
    }
  );

  sections.forEach(section => sectionObserver.observe(section));


  /* ============================================================
     5. TYPEWRITER EFFECT
        Cycles through phrases with typing and deleting animation
     ============================================================ */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Data Science Student',
    'Aspiring Data Analyst',
    'Python Developer',
    'Cloud Enthusiast',
    'Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typewriterTimeout;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing — pause then start deleting
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    typewriterTimeout = setTimeout(typeWriter, delay);
  }

  // Start typewriter after a short delay
  setTimeout(typeWriter, 800);


  /* ============================================================
     6. ANIMATED COUNTERS (About Section)
        Count up from 0 to target value when section is visible
     ============================================================ */
  const aboutStats = document.querySelector('.about-stats');
  let countersStarted = false;

  /**
   * Animate a single counter element from 0 to its data-target value.
   */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target + '+';
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (aboutStats) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            document.querySelectorAll('.stat-number').forEach(animateCounter);
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    counterObserver.observe(aboutStats);
  }


  /* ============================================================
     7. SKILL PROGRESS BARS
        Animate bar widths when the skills section enters viewport
     ============================================================ */
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;

            document.querySelectorAll('.skill-progress').forEach((bar, index) => {
              // Stagger each bar by 100ms
              setTimeout(() => {
                bar.style.width = bar.dataset.width;
              }, index * 100);
            });

            skillsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    skillsObserver.observe(skillsSection);
  }


  /* ============================================================
     8. SCROLL FADE-IN ANIMATIONS
        Elements with .fade-in-up get .visible when they enter viewport
     ============================================================ */
  const fadeElements = document.querySelectorAll('.fade-in-up');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, no need to keep observing
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  fadeElements.forEach(el => fadeObserver.observe(el));


  /* ============================================================
     9. SMOOTH SCROLL FOR ANCHOR LINKS
        Handles all href="#..." links with smooth scrolling
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70',
        10
      );

      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });


  /* ============================================================
     10. CONTACT FORM SUBMISSION
         Validates fields, shows toast, resets form
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  let toastTimeout;

  /**
   * Show the toast notification for a given duration.
   */
  function showToast(message, duration = 3500) {
    const toastText = toast.querySelector('span');
    if (toastText) toastText.textContent = message;

    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const subject = contactForm.querySelector('[name="subject"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.');
        return;
      }

      // Simple email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Simulate form submission (replace with real API call)
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showToast('Message sent successfully!');
      }, 1500);
    });
  }


  /* ============================================================
     11. PARALLAX EFFECT ON HERO BACKGROUND
         Subtle depth effect as user scrolls past hero
     ============================================================ */
  const heroSection = document.getElementById('hero');

  function handleParallax() {
    if (!heroSection) return;
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY < heroHeight) {
      // Move the pseudo-element background at 40% scroll speed
      heroSection.style.setProperty('--parallax-offset', `${scrollY * 0.4}px`);
    }
  }

  // Apply parallax offset via CSS custom property
  // The ::before pseudo-element uses this in its transform
  const heroStyle = document.createElement('style');
  heroStyle.textContent = `
    #hero::before {
      transform: translateY(var(--parallax-offset, 0px));
    }
  `;
  document.head.appendChild(heroStyle);

  window.addEventListener('scroll', handleParallax, { passive: true });


  /* ============================================================
     12. KEYBOARD ACCESSIBILITY
         Allow Enter/Space on interactive non-button elements
     ============================================================ */
  document.querySelectorAll('.social-btn, .btn-icon').forEach(el => {
    if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    }
  });


  /* ============================================================
     13. ACTIVE NAV LINK ON PAGE LOAD
         Set correct active state based on current scroll position
     ============================================================ */
  function setInitialActiveSection() {
    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    if (closestSection) {
      setActiveSection(closestSection.id);
    }
  }

  setInitialActiveSection();


  /* ============================================================
     14. SMOOTH REVEAL FOR HERO ELEMENTS ON LOAD
         Stagger hero text elements on initial page load
     ============================================================ */
  const heroElements = document.querySelectorAll(
    '.hero-name, .hero-tagline, .hero-intro, .hero-buttons, .hero-scroll, .hero-image'
  );

  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;

    // Trigger after a brief paint delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

}); // end DOMContentLoaded
