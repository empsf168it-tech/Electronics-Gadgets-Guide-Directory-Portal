/* ==========================================================================
   GADGEX — Electronics Gadgets Guide & Directory Portal
   Includes:
   - Scroll Progress Indicator
   - Custom Desktop Cursor
   - Sticky Navigation Glass Shift
   - Scroll Reveal Animations (IntersectionObserver with stagger)
   - 3D Card Tilt Micro-interactions
   - Stats Counter Animation
   - Video Lightbox Modal
   - Directory & Guides Filtering
   - Consultation / Recommendation Request Form Handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // 2. Custom Desktop Cursor
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .experience-card, .drink-card, .event-card, .filter-btn, .menu-row-item');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 3. Sticky Navigation on Scroll
  const navbar = document.querySelector('.navbar-noir');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 4. Mobile Navigation Toggle
  const hamburgerBtn = document.querySelector('.hamburger-toggle');
  const mobileNavPanel = document.querySelector('.mobile-nav-panel');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-panel a');

  if (hamburgerBtn && mobileNavPanel) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNavPanel.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeMobileNav = () => {
    if (mobileNavPanel) {
      mobileNavPanel.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  };

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // 5. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-slide-left, .reveal-slide-right, .reveal-scale');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('reveal-active');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 6. 3D Tilt Effect on Feature & Experience Cards
  const tiltCards = document.querySelectorAll('.experience-card, .drink-card');
  if (window.innerWidth > 992) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // 7. Video Lightbox Modal
  const playBtn = document.querySelector('.play-btn-pulse');
  const videoModal = document.querySelector('.video-lightbox-modal');
  const modalClose = document.querySelector('.lightbox-close');

  if (playBtn && videoModal) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('active');
    });
  }

  if (modalClose && videoModal) {
    modalClose.addEventListener('click', () => {
      videoModal.classList.remove('active');
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
      }
    });
  }

  // 8. Number Counter Animation for Stats
  const statNumbers = document.querySelectorAll('.stat-count');
  if (statNumbers.length > 0) {
    const animateStats = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'), 10);
          const prefix = target.getAttribute('data-prefix') || '';
          const suffix = target.getAttribute('data-suffix') || '';
          let startValue = 0;

          const timer = setInterval(() => {
            startValue += Math.ceil(endValue / 35);
            if (startValue >= endValue) {
              target.innerText = prefix + endValue + suffix;
              clearInterval(timer);
            } else {
              target.innerText = prefix + startValue + suffix;
            }
          }, 35);

          observer.unobserve(target);
        }
      });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
      threshold: 0.4
    });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // 9. Menu Filtering on menu.html
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCategories = document.querySelectorAll('.menu-category-block');

  if (filterBtns.length > 0 && menuCategories.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        menuCategories.forEach(category => {
          if (filterValue === 'all' || category.getAttribute('data-category') === filterValue) {
            category.style.display = 'block';
          } else {
            category.style.display = 'none';
          }
        });
      });
    });
  }

  // 10. Consultation & Recommendation Form Handler
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName').value;
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const guests = document.getElementById('resGuests').value;

      const modalElement = document.getElementById('reservationConfirmModal');
      const confirmDetails = document.getElementById('modalReservationDetails');
      
      if (confirmDetails) {
        confirmDetails.innerHTML = `
          <strong>Contact Name:</strong> ${name}<br>
          <strong>Consultation Schedule:</strong> ${date} at ${time}<br>
          <strong>Gadget Category & Topic:</strong> ${guests}
        `;
      }

      if (window.bootstrap && window.bootstrap.Modal) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }

      reservationForm.reset();
    });
  }

  // 11. Tech Glow Light Particle Generator for Hero Sections
  const heroSections = document.querySelectorAll('.hero-section, .page-hero');
  heroSections.forEach(hero => {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'beer-bubble-container';
    
    // Spawn 20 glowing cyber particles with randomized size, position and duration
    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'beer-bubble';
      
      const size = Math.floor(Math.random() * 16) + 6; // 6px to 22px
      const left = Math.floor(Math.random() * 100); // 0% to 100%
      const duration = (Math.random() * 6 + 4).toFixed(1); // 4s to 10s
      const delay = (Math.random() * 5).toFixed(1); // 0s to 5s
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${delay}s`;
      
      bubbleContainer.appendChild(bubble);
    }
    
    hero.appendChild(bubbleContainer);
  });

  // 12. Back to Top Button Functionality
  let backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '<i class="bi bi-chevron-up"></i>';
    document.body.appendChild(backToTopBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});


