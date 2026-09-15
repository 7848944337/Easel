const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a, .nav-action, a[href^="#"]');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

function goToSection(target) {
  const destination = document.querySelector(target);
  if (!destination) return;
  const start = window.scrollY;
  const end = destination.getBoundingClientRect().top + start - 68;
  const distance = end - start;
  const duration = Math.min(1150, Math.max(500, Math.abs(distance) * .42));
  const began = performance.now();
  const ease = progress => 1 - Math.pow(1 - progress, 4);
  function animate(now) {
    const progress = Math.min((now - began) / duration, 1);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

navLinks.forEach(link => link.addEventListener('click', event => {
  const target = link.getAttribute('href');
  if (!target || !target.startsWith('#')) return;
  event.preventDefault();
  nav.classList.remove('menu-open');
  document.body.style.overflow = '';
  goToSection(target);
}));

addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); }
}), { threshold: .14, rootMargin: '0px 0px -25px' });
reveals.forEach(element => revealObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  document.querySelectorAll('.nav-links a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-42% 0px -48%', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const glow = document.querySelector('.cursor-glow');
addEventListener('pointermove', event => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, { passive: true });
