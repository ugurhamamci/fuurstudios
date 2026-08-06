/* ============================================
   FUUR STUDIO — Navigation
   ============================================ */

const Navigation = {
  init() {
    this.nav = document.querySelector('.nav');
    this.hamburger = document.querySelector('.nav__hamburger');
    this.mobileMenu = document.querySelector('.nav__mobile-menu');
    this.links = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');

    this.handleScroll();
    this.bindEvents();
    this.observeSections();
  },

  handleScroll() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 60) {
            this.nav.classList.add('scrolled');
          } else {
            this.nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  bindEvents() {
    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    // Smooth scroll for all nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = this.nav.offsetHeight;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
          
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          this.closeMobile();
        }
      });
    });

    // Scroll to top
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  },

  toggleMobile() {
    this.hamburger.classList.toggle('open');
    this.mobileMenu.classList.toggle('open');
    document.body.style.overflow = this.mobileMenu.classList.contains('open') ? 'hidden' : '';
  },

  closeMobile() {
    if (this.hamburger && this.mobileMenu) {
      this.hamburger.classList.remove('open');
      this.mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  observeSections() {
    const options = {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.setActiveLink(id);
        }
      });
    }, options);

    this.sections.forEach(section => observer.observe(section));
  },

  setActiveLink(sectionId) {
    this.links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

window.Navigation = Navigation;
