// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});

// CURSOR (only on fine pointer devices)
if (window.matchMedia('(pointer:fine)').matches) {
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  cursor.style.opacity = '1';
  cursorRing.style.opacity = '1';

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX - 16) * 0.1;
    ringY += (mouseY - ringY - 16) * 0.1;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .product-card, .benefit-card, .cat-btn, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => { el.classList.add('cursor-hover'); document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { el.classList.remove('cursor-hover'); document.body.classList.remove('cursor-hover'); });
  });
}

// NAVBAR
const navbar = document.getElementById('navbar');
const navProgress = document.getElementById('navProgress');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const current = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      // scrolled class
      navbar.classList.toggle('scrolled', current > 40);

      // hide/show on scroll direction
      if (current > 100 && current > lastScroll) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
      lastScroll = current;

      // progress bar
      if (navProgress) {
        navProgress.style.width = maxScroll > 0 ? (current / maxScroll) * 100 + '%' : '0%';
      }

      ticking = false;
    });
    ticking = true;
  }
});

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

function toggleMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(true));
closeMenu.addEventListener('click', () => toggleMenu(false));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);

// ACTIVE NAV LINK
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not([target="_blank"])');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => sectionObserver.observe(s));

// REVEAL ON SCROLL
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el, i) => {
  el.dataset.delay = i * 60;
  observer.observe(el);
});

// COUNTDOWN
const cdH = document.getElementById('cdH');
const cdM = document.getElementById('cdM');
const cdS = document.getElementById('cdS');

function updateCountdown() {
  let h = parseInt(cdH.textContent) || 0;
  let m = parseInt(cdM.textContent) || 0;
  let s = parseInt(cdS.textContent) || 0;
  let total = h * 3600 + m * 60 + s;
  if (total > 0) total--;
  cdH.textContent = String(Math.floor(total / 3600)).padStart(2, '0');
  cdM.textContent = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  cdS.textContent = String(total % 60).padStart(2, '0');
}
setInterval(updateCountdown, 1000);

// SWIPER
new Swiper('.swiper-testimonials', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  speed: 600,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

// FILTER CATEGORIES
function filterCat(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    if (show) {
      card.style.display = '';
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = 'fadeUp .45s ease forwards';
      });
    } else {
      card.style.display = 'none';
    }
  });
}

// PARALLAX HERO
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (hero) {
    const speed = 0.25;
    hero.style.setProperty('--scroll-y', window.scrollY * speed + 'px');
  }
});

// 3D TILT ON PRODUCT CARDS
const tiltCards = document.querySelectorAll('.product-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform =
      `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.boxShadow =
      `0 24px 60px rgba(0,0,0,.5), 0 0 40px rgba(56,189,248,.07)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1), box-shadow .5s';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// RIPPLE EFFECT
document.querySelectorAll('.btn-buy, .btn-primary, .btn-wpp, .btn-wpp-big').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,.2);
      width:${size}px;height:${size}px;
      top:${y}px;left:${x}px;
      transform:scale(0);
      animation:rippleAnim .6s ease-out;
      pointer-events:none;
    `;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
