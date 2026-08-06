/* ============================================
   FUUR STUDIO — Theme Toggle
   ============================================ */

const ThemeManager = {
  STORAGE_KEY: 'fuur-theme',
  
  init() {
    let saved = null;
    try {
      saved = localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {}

    if (saved) {
      this.setTheme(saved, false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'dark', false); // default dark
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {}
    });

    this.bindToggle();
  },

  setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      try {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } catch (e) {}
    }
    this.updateToggleIcon(theme);
    this.updateLogos(theme);
  },

  updateLogos(theme) {
    const logos = document.querySelectorAll('.js-theme-logo');
    logos.forEach(logo => {
      const newSrc = theme === 'dark' ? logo.getAttribute('data-logo-dark') : logo.getAttribute('data-logo-light');
      if (newSrc) {
        logo.src = newSrc;
      }
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  },

  updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    
    const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    
    btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  },

  bindToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }
};

window.ThemeManager = ThemeManager;
