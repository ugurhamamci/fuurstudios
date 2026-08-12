/* ============================================
   FUUR STUDIO — Main Entry Point
   ============================================ */

// Modules are loaded via script tags now.

function runInit() {
  if (!window.ThemeManager || !window.ScrollAnimations) {
    setTimeout(runInit, 50);
    return;
  }
  ThemeManager.init();
  LanguageManager.init();
  Navigation.init();
  ScrollAnimations.init();
  TestimonialsCarousel.init();

  // 🛠 Portfolio Filter 🛠
  initPortfolioFilter();

  // 🛠 Contact Form (WhatsApp) 🛠
  initContactForm();

  // 🛠 Quote Form (WhatsApp) 🛠
  initQuoteForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInit);
} else {
  runInit();
}

// ── Portfolio Filter Logic ──
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio__filter');
  const items = document.querySelectorAll('.portfolio__item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          // Re-trigger animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ── Contact Form → WhatsApp ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name')?.value?.trim() || '';
    const email = form.querySelector('#form-email')?.value?.trim() || '';
    const phone = form.querySelector('#form-phone')?.value?.trim() || '';
    const service = form.querySelector('#form-service')?.value || '';
    const message = form.querySelector('#form-message')?.value?.trim() || '';

    // Validation
    if (!name || !email || !message) {
      highlightEmptyFields(form);
      return;
    }

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
      `Merhaba FUUR STUDIO! 👋\n\n` +
      `📌 *İsim:* ${name}\n` +
      `📧 *E-posta:* ${email}\n` +
      `📱 *Telefon:* ${phone || 'Belirtilmedi'}\n` +
      `🔧 *Hizmet:* ${service || 'Belirtilmedi'}\n` +
      `💬 *Mesaj:* ${message}`
    );

    const waNumber = window.waNumber || '905448508960';
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    window.open(waUrl, '_blank');
  });
}

// ── Quote Form → WhatsApp ──
function initQuoteForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#quote-name')?.value?.trim() || '';
    const phone = form.querySelector('#quote-phone')?.value?.trim() || '';
    const service = form.querySelector('#quote-service')?.value || '';
    const budget = form.querySelector('#quote-budget')?.value || '';
    const timeline = form.querySelector('#quote-timeline')?.value || '';
    const details = form.querySelector('#quote-details')?.value?.trim() || '';

    if (!name || !phone) {
      highlightEmptyFields(form);
      return;
    }

    const lines = [
      'Merhaba FUUR STUDIO! 👋 Teklif almak istiyorum.',
      '',
      `📌 *İsim:* ${name}`,
      `📱 *Telefon:* ${phone}`,
      `🔧 *Hizmet:* ${service || 'Belirtilmedi'}`,
      `💰 *Bütçe:* ${budget || 'Belirtilmedi'}`,
      `🗓 *Başlangıç:* ${timeline || 'Belirtilmedi'}`,
    ];
    if (details) lines.push(`💬 *Detay:* ${details}`);

    const waNumber = window.waNumber || '905448508960';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  });
}

function highlightEmptyFields(form) {
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--brand-red)';
      field.style.boxShadow = '0 0 0 3px var(--brand-red-glow)';
      
      field.addEventListener('input', function handler() {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        field.removeEventListener('input', handler);
      });
    }
  });
}
