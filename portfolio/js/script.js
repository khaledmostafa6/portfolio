/* ==========================================================================
   Khaled Mostafa — Portfolio
   Vanilla JavaScript only. No external libraries.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveSection();
  initScrollReveal();
  initStatsCounter();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initThemeToggle();
  initTypingAnimation();
  initHeroCodeTyping();
  initScrollProgress();
});

/* -------------------- Navbar background on scroll -------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* -------------------- Mobile hamburger menu -------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
}

/* -------------------- Smooth scrolling for in-page anchors -------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* -------------------- Active nav link on scroll (Intersection Observer) -------------------- */
function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* -------------------- Scroll reveal animations -------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* -------------------- Animated stat counters -------------------- */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* -------------------- Project filtering -------------------- */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('filtered-out', !matches);
      });
    });
  });
}

/* -------------------- Contact form validation (no page reload) -------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (field, message) => {
    field.el.closest('.form-group').classList.add('has-error');
    field.error.textContent = message;
  };

  const clearError = (field) => {
    field.el.closest('.form-group').classList.remove('has-error');
    field.error.textContent = '';
  };

  const validate = () => {
    let isValid = true;

    if (!fields.name.el.value.trim()) {
      setError(fields.name, 'Please enter your name.');
      isValid = false;
    } else {
      clearError(fields.name);
    }

    if (!fields.email.el.value.trim()) {
      setError(fields.email, 'Please enter your email.');
      isValid = false;
    } else if (!emailPattern.test(fields.email.el.value.trim())) {
      setError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(fields.email);
    }

    if (!fields.subject.el.value.trim()) {
      setError(fields.subject, 'Please add a subject.');
      isValid = false;
    } else {
      clearError(fields.subject);
    }

    if (!fields.message.el.value.trim()) {
      setError(fields.message, 'Please write a message.');
      isValid = false;
    } else if (fields.message.el.value.trim().length < 10) {
      setError(fields.message, 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      clearError(fields.message);
    }

    return isValid;
  };

  Object.values(fields).forEach(({ el }) => {
    el.addEventListener('input', validate);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successEl.textContent = '';

    if (!validate()) return;

    successEl.textContent = "Thanks! Your message has been noted — I'll get back to you soon.";
    form.reset();
    Object.values(fields).forEach(clearError);

    setTimeout(() => {
      successEl.textContent = '';
    }, 6000);
  });
}

/* -------------------- Back to top button -------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------- Dark / light theme toggle -------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const stored = getStoredTheme();
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';

    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    setStoredTheme(next);
  });
}

/* In-memory theme fallback (artifact/sandbox contexts may not persist
   localStorage across reloads, but this keeps behavior correct within
   a single session on a real static host too). */
let inMemoryTheme = null;

function getStoredTheme() {
  try {
    return window.localStorage.getItem('theme') || inMemoryTheme;
  } catch (err) {
    return inMemoryTheme;
  }
}

function setStoredTheme(value) {
  inMemoryTheme = value;
  try {
    window.localStorage.setItem('theme', value);
  } catch (err) {
    /* localStorage unavailable — in-memory value still applies this session */
  }
}

/* -------------------- Hero subtitle typing animation -------------------- */
function initTypingAnimation() {
  const target = document.getElementById('typingTarget');
  if (!target) return;

  const phrases = ['Flutter Developer & Software Engineer', 'Building with Flutter & Firebase', 'Crafting Clean, Scalable Code'];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? 35 : 55);
  };

  tick();
}

/* -------------------- Hero code editor typing effect -------------------- */
function initHeroCodeTyping() {
  const el = document.getElementById('codeTyping');
  if (!el) return;

  const lines = [
    { text: 'class Developer {', color: '#c084fc' },
    { text: '  String name = "Khaled";', indent: 1 },
    { text: '  String role = "Flutter Developer";', indent: 1 },
    { text: '', indent: 0 },
    { text: '  void buildAmazingApps() {', indent: 1 },
    { text: "    // Let's create something great", indent: 2, comment: true },
    { text: '  }', indent: 1 },
    { text: '}', indent: 0 },
  ];

  const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let lineIndex = 0;
  let charIndex = 0;
  let html = '';

  const typeNext = () => {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    charIndex++;

    const partial = line.text.slice(0, charIndex);
    const preview = html + escapeHtml(partial);
    el.innerHTML = preview;

    if (charIndex >= line.text.length) {
      html += escapeHtml(line.text) + '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 120);
      return;
    }

    setTimeout(typeNext, 18);
  };

  typeNext();
}

/* -------------------- Scroll progress indicator -------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
