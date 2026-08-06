/* ============================================
   FUUR STUDIO — Testimonials Carousel
   ============================================ */

const TestimonialsCarousel = {
  currentIndex: 0,
  totalSlides: 0,
  autoPlayInterval: null,
  autoPlayDelay: 5000,

  init() {
    this.track = document.querySelector('.testimonials__track');
    this.slides = document.querySelectorAll('.testimonials__slide');
    this.dots = document.querySelectorAll('.testimonials__dot');
    this.prevBtn = document.getElementById('testimonial-prev');
    this.nextBtn = document.getElementById('testimonial-next');

    if (!this.track || this.slides.length === 0) return;

    this.totalSlides = this.slides.length;
    this.bindEvents();
    this.startAutoPlay();
    this.goTo(0);
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoPlay();
      });
    }

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        this.goTo(i);
        this.resetAutoPlay();
      });
    });

    // Touch / Swipe support
    let startX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
        this.resetAutoPlay();
      }
      isDragging = false;
    }, { passive: true });

    // Pause on hover
    const container = document.querySelector('.testimonials__carousel');
    if (container) {
      container.addEventListener('mouseenter', () => this.stopAutoPlay());
      container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  },

  goTo(index) {
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;

    this.currentIndex = index;
    const offset = -index * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  },

  next() {
    this.goTo(this.currentIndex + 1);
  },

  prev() {
    this.goTo(this.currentIndex - 1);
  },

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
  },

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  },

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
};

window.TestimonialsCarousel = TestimonialsCarousel;
