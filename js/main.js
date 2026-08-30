/**
 * Portafolio Jair Hernández (CloverJH17)
 * Script principal: Modo Oscuro/Claro, Navegación, Filtros y Utilidades
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Selector de Tema (Dark / Light Mode)
  initTheme();

  // 2. Navegación Móvil
  initMobileMenu();

  // 3. Resaltado de sección activa en navegación (Scrollspy)
  initScrollSpy();

  // 4. Filtro interactivo de proyectos
  initProjectFilters();

  // 5. Copiar correo al portapapeles
  initCopyEmail();

  // 6. Botón volver arriba & Actualización de año
  initUtilities();
});

/**
 * Gestión del Tema (Persistencia en localStorage y detección de preferencia del sistema)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  
  // Obtener tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}

/**
 * Menú de Navegación Móvil
 */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-active');
    mobileBtn.classList.toggle('open', isOpen);
    mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cerrar menú al hacer clic en un enlace
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
        mobileBtn.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('nav-active') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
      navLinks.classList.remove('nav-active');
      mobileBtn.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Resaltar enlace de navegación activo según la sección visible
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Filtro de Proyectos
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Activar botón seleccionado
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filtrar tarjetas
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * Copiar correo al portapapeles con feedback visual
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-btn-text');
  const emailElement = document.getElementById('email-text');

  if (!copyBtn || !emailElement || !copyText) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailElement.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      const originalText = copyText.textContent;
      copyText.textContent = '¡Copiado!';
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-outline');

      setTimeout(() => {
        copyText.textContent = originalText;
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-outline');
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  });
}

/**
 * Utilidades: Año actual en footer y botón volver arriba
 */
function initUtilities() {
  // Año dinámico
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Botón Volver Arriba
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
