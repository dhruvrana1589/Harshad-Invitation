/* ============================================================
   WEDDING INVITATION — JAVASCRIPT
   Handles: Countdown, Animations, Gallery Lightbox, RSVP Form,
            Navigation, Particles, Confetti
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== CONFIGURATION ==========
  // Change this date to your actual wedding date
  const WEDDING_DATE = new Date('2026-07-27T09:00:00+05:30');

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ========== COUNTDOWN TIMER ==========
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '🎉';
      hoursEl.textContent = '🎉';
      minutesEl.textContent = '🎉';
      secondsEl.textContent = '🎉';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ========== HERO PARTICLES ==========
  const particlesContainer = document.getElementById('heroParticles');

  function createParticles() {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${2 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${4 + Math.random() * 6}s`;
      particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for sibling elements
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        let delay = 0;
        siblings.forEach(sib => {
          if (sib === entry.target) {
            entry.target.style.transitionDelay = `${delay * 0.15}s`;
          }
          delay++;
        });

        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== GALLERY LIGHTBOX ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryImages = [
    'images/gallery-1.png',
    'images/gallery-2.png',
    'images/gallery-3.png',
    'images/gallery-4.png',
    'images/gallery-5.png',
    'images/gallery-6.png'
  ];

  let currentImageIndex = 0;

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  // ========== RSVP FORM ==========
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const submitBtn = document.getElementById('submitBtn');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const formData = {
      name: document.getElementById('guestName').value.trim(),
      phone: document.getElementById('guestPhone').value.trim(),
      numGuests: document.getElementById('numGuests').value,
      dietary: document.getElementById('dietary').value,
      events: Array.from(document.querySelectorAll('input[name="events"]:checked')).map(cb => cb.value),
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    const allRSVPs = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    allRSVPs.push(formData);
    localStorage.setItem('weddingRSVPs', JSON.stringify(allRSVPs));

    // Button animation
    submitBtn.textContent = '✓ Confirmed!';
    submitBtn.style.pointerEvents = 'none';

    // Show success message
    setTimeout(() => {
      rsvpForm.style.display = 'none';
      rsvpSuccess.classList.add('show');
      launchConfetti();
    }, 600);
  });

  // ========== CONFETTI ANIMATION ==========
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);

  const confettiColors = ['#C9A84C', '#E8D48B', '#6B0F1A', '#D4A5A5', '#FFF8F0', '#8B1E2B', '#F2C94C'];
  let confettiPieces = [];
  let confettiActive = false;

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * confettiCanvas.width;
      this.y = -20;
      this.size = 4 + Math.random() * 8;
      this.speedY = 2 + Math.random() * 4;
      this.speedX = (Math.random() - 0.5) * 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.opacity = 1;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      this.speedX += (Math.random() - 0.5) * 0.2;
      this.opacity -= 0.003;
    }

    draw() {
      confettiCtx.save();
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate((this.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, this.opacity);
      confettiCtx.fillStyle = this.color;

      if (this.shape === 'rect') {
        confettiCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }

      confettiCtx.restore();
    }
  }

  function launchConfetti() {
    confettiPieces = [];
    confettiActive = true;

    // Create confetti in waves
    let waveCount = 0;
    const waveInterval = setInterval(() => {
      for (let i = 0; i < 25; i++) {
        confettiPieces.push(new ConfettiPiece());
      }
      waveCount++;
      if (waveCount >= 6) clearInterval(waveInterval);
    }, 300);

    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiActive) return;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 20 && p.opacity > 0);

    confettiPieces.forEach(piece => {
      piece.update();
      piece.draw();
    });

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== PARALLAX ON HERO (subtle) ==========
  const heroBg = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
    }
  });

  // ========== INVITATION CARD HOVER GLOW ==========
  const invitationCard = document.querySelector('.invitation-card');
  if (invitationCard) {
    invitationCard.addEventListener('mousemove', (e) => {
      const rect = invitationCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      invitationCard.style.background = `
        radial-gradient(circle at ${x}px ${y}px, rgba(201, 168, 76, 0.08) 0%, transparent 50%),
        linear-gradient(145deg, rgba(255, 248, 240, 0.07) 0%, rgba(201, 168, 76, 0.05) 100%)
      `;
    });

    invitationCard.addEventListener('mouseleave', () => {
      invitationCard.style.background = `
        linear-gradient(145deg, rgba(255, 248, 240, 0.07) 0%, rgba(201, 168, 76, 0.05) 100%)
      `;
    });
  }

  // ========== PRELOAD CRITICAL IMAGES ==========
  const criticalImages = ['images/hero-bg.png', 'images/couple.png'];
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

});
