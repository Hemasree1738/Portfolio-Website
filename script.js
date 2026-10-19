/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT - HEMASREE RANDHI
 * Interactive Features: Neon Glow, Glassmorphism, 3D Tilt, Theme Switcher,
 * Animated Stat Counters, Project Filtering, Typing Hero & Smooth Scrolling
 * ==========================================================================
 */

// Run when the DOM content has fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomCursor();
  initScrollProgress();
  initMobileMenu();
  initTypingAnimation();
  initScrollAnimations();
  initStatCounters();
  initCardTiltAndSpotlight();
  initProjectFilters();
  initCopyEmail();
  initContactForm();
  initBackToTop();
  initActiveNavOnScroll();
});

/* --------------------------------------------------------------------------
   SHARED TOAST NOTIFICATION
   Displays temporary notifications (e.g. copying email, opening mail client)
   -------------------------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  const toastMessage = toast.querySelector('.toast-message');
  if (toastMessage) {
    toastMessage.textContent = message;
  }
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (Dark / Light Mode)
   Supports persistence in localStorage & respects OS prefers-color-scheme
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  // Retrieve saved preference or check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // Set default theme: dark (or saved theme)
  const currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-moon';
      }
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun';
      }
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      }
    }
  }
}

/* --------------------------------------------------------------------------
   2. CUSTOM GLOWING CURSOR (Desktop Only)
   Small cyan dot with a smooth trailing ring that expands on interactive items
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  // Do not initialize on touch devices or if elements don't exist
  if (!cursorDot || !cursorRing || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot snaps immediately to cursor
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth trailing ring loop using requestAnimationFrame
  function renderRing() {
    // Linear interpolation for smooth trailing follow
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Add hover scale state when hovering over clickable elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tilt-card, .filter-btn');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL PROGRESS BAR
   Updates the neon cyan/magenta line at the very top of the browser
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const scrollPercent = (totalScroll / windowHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. MOBILE HAMBURGER MENU
   Smooth glass slide-in panel with backdrop
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-drawer .nav-link');

  if (!menuBtn || !mobileDrawer || !drawerBackdrop) return;

  function openMenu() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMenu() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  drawerBackdrop.addEventListener('click', closeMenu);

  // Close drawer when any nav link is tapped
  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* --------------------------------------------------------------------------
   5. HERO TYPING ANIMATION
   Cycles through titles: "Computer Science Student", "ML Enthusiast", etc.
   -------------------------------------------------------------------------- */
function initTypingAnimation() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    'Computer Science Student',
    'ML Enthusiast',
    'Cyber Security Learner',
    'Web Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const backSpeed = 45;
  const holdDelay = 1800;

  function typeTick() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      typedTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Pause at full word before deleting
        isDeleting = true;
        setTimeout(typeTick, holdDelay);
        return;
      }
    } else {
      // Deleting backwards
      typedTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Move to the next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const currentSpeed = isDeleting ? backSpeed : typeSpeed;
    setTimeout(typeTick, currentSpeed);
  }

  // Start the typing loop
  setTimeout(typeTick, 600);
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL (IntersectionObserver)
   Fades and slides up elements when they enter the viewport
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!fadeElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Run animation once
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. ANIMATED STAT COUNTERS
   Animates numeric values (CGPA 9.47, 5 Projects, 3 Open Source Contributions, 3 Hackathons)
   Ensures values never get stuck at 0 even if animation or observer fails
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsContainer = document.querySelector('.stats-grid');
  if (!statNumbers.length || !statsContainer) return;

  let hasAnimated = false;

  function runCounterAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;

    statNumbers.forEach((stat) => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = stat.getAttribute('data-decimal') === 'true';
      const duration = 1600; // ms
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = easeProgress * target;

        if (isDecimal) {
          stat.textContent = currentVal.toFixed(2);
        } else {
          stat.textContent = Math.round(currentVal).toString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = isDecimal ? target.toFixed(2) : target.toString();
        }
      }

      // Reset to 0 and begin counting up
      stat.textContent = isDecimal ? '0.00' : '0';
      requestAnimationFrame(updateCount);
    });
  }

  // Use IntersectionObserver with fallback
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        runCounterAnimation();
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(statsContainer);

    // Fallback: If observer fails or doesn't trigger within 2.5s, display target values
    setTimeout(() => {
      if (!hasAnimated) {
        statNumbers.forEach((stat) => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const isDecimal = stat.getAttribute('data-decimal') === 'true';
          stat.textContent = isDecimal ? target.toFixed(2) : target.toString();
        });
      }
    }, 2500);
  } else {
    // If browser doesn't support IntersectionObserver, display target values directly
    statNumbers.forEach((stat) => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = stat.getAttribute('data-decimal') === 'true';
      stat.textContent = isDecimal ? target.toFixed(2) : target.toString();
    });
  }
}

/* --------------------------------------------------------------------------
   8. 3D TILT & MOUSE SPOTLIGHT ON CARDS
   Vanilla JS 3D perspective tilt that tracks cursor position on glass cards
   -------------------------------------------------------------------------- */
function initCardTiltAndSpotlight() {
  // Disable 3D tilt if user prefers reduced motion or on touch devices
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card

      // Update radial spotlight CSS variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate tilt angles (-6 to +6 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly reset back to neutral
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   9. PROJECT FILTER BUTTONS (All / ML / Web / Open Source)
   Filters cards with animated fade and scale transitions
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          // Trigger smooth fade-in
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. COPY EMAIL TO CLIPBOARD & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('contact-email-text');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailText.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Email copied to clipboard!');
    }
  });
}

/* --------------------------------------------------------------------------
   11. CONTACT FORM (Client-side Mailto handler with toast)
   Validates fields, shows success toast, and opens mail client
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    const recipient = 'hemasreerandhi1738@gmail.com';
    const subject = `Portfolio Contact from ${name}`;
    const body = `Sender Email: ${email}\n\nMessage:\n${message}`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Show feedback toast
    showToast('Opening your email app...');

    // Open user's default email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   12. BACK TO TOP BUTTON
   Appears after scrolling down 400px; scrolls back smoothly
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   13. ACTIVE NAVIGATION LINK ON SCROLL
   Highlights current visible section in top navigation
   -------------------------------------------------------------------------- */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120; // Offset for top navbar

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}
