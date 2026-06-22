/* ============================================================
   main.js  —  GreenEarth Produce
   Sections:
     1. Hero parallax
     2. Navbar scroll behaviour
     3. Feature blocks fade-in / fade-out
     4. Why-GEP cards stagger fade-in
   ============================================================ */

/*
  Moves the hero background at 35% of scroll speed,
  creating a subtle depth effect.
  Uses { passive: true } so the browser can optimise scroll.
*/
const heroBg = document.getElementById('heroBg');

function updateParallax() {
  heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
}

window.addEventListener('scroll', updateParallax, { passive: true });


/*
  Navbar starts invisible (opacity: 0, pointer-events: none).
  Once the user scrolls past 85% of the hero height,
  the .scrolled class is added — triggering frosted-glass styles in CSS.
*/
const navbar = document.getElementById('navbar');
const heroEl = document.getElementById('hero');

function updateNav() {
  const threshold = heroEl.offsetHeight * 0.85;
  navbar.classList.toggle('scrolled', window.scrollY > threshold);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run once on load in case page is already scrolled

/*
  Uses IntersectionObserver to:
  - Add .visible  when a block enters the viewport (20% threshold)
  - Add .fade-out when a block leaves after having been seen
  The `seen` Set prevents blocks from fading out before they've
  ever been in view (e.g. on initial page load).
*/
const featureBlocks = document.querySelectorAll('.feature-block');
const seen = new Set();

const fadeObserver = new IntersectionObserver((blocks) => {
  blocks.forEach(block => {
    const el = block.target;

    if (block.isIntersecting) {
      el.classList.add('visible');
      el.classList.remove('fade-out');
      seen.add(el);
    } else if (seen.has(el)) {
      el.classList.remove('visible');
      el.classList.add('fade-out');
    }
  });
}, {
  threshold: 0.75,  // trigger when 75% of block is visible
  rootMargin: '0px 0px -60px 0px'  // trigger 60px before bottom edge
});

featureBlocks.forEach(block => fadeObserver.observe(block));

/*
  Each card fades in once (freezes after first trigger).
  Transition delay is set inline so cards animate in sequence.
  unobserve() is called after first trigger to save resources.
*/
const whyCards = document.querySelectorAll('.why-card');
const STAGGER_MS = 60; // delay between each card in milliseconds

const cardObserver = new IntersectionObserver((blocks) => {
  blocks.forEach(block => {
    if (block.isIntersecting) {
      block.target.classList.add('visible');
      cardObserver.unobserve(block.target); // fire once only
    }
  });
}, { threshold: 0.15 });

whyCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * STAGGER_MS}ms`;
  cardObserver.observe(card);
});
