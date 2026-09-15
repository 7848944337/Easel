const loader=document.querySelector('.loader');
window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),450));

const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const reveals=document.querySelectorAll('.reveal');
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
reveals.forEach(el=>io.observe(el));

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.main-nav a')];
const navIO=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))}
}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>navIO.observe(s));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id==='#')return;
    const target=document.querySelector(id);
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  })
});
