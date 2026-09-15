// PLINTH — shared interactions
(function(){
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
      });
    });
  }

  /* Active nav link by current page */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')){
      a.classList.add('is-active');
    }
  });

  /* Scroll reveal — restrained, single pattern, used on gallery pieces & .reveal blocks */
  var revealTargets = document.querySelectorAll('.reveal, .piece');
  if('IntersectionObserver' in window && revealTargets.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* Hero frame crossfade — the one orchestrated moment on the homepage */
  var slides = document.querySelectorAll('.hero-frame .hf-slide');
  if(slides.length > 1){
    var current = 0;
    setInterval(function(){
      slides[current].classList.remove('is-on');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-on');
    }, 4200);
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('is-open'); });
      if(!wasOpen){ item.classList.add('is-open'); }
    });
  });

  /* Timeline — highlight nearest open item on load (illustrative) */
  var tlOpen = document.querySelector('.tl-item[data-open="true"]');
  if(tlOpen){ tlOpen.classList.add('is-open'); }

  /* Category tabs (awards page) */
  var tabs = document.querySelectorAll('[data-cat-tab]');
  var panels = document.querySelectorAll('[data-cat-panel]');
  if(tabs.length){
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('is-active'); });
        panels.forEach(function(p){ p.style.display = 'none'; });
        tab.classList.add('is-active');
        var target = document.querySelector('[data-cat-panel="' + tab.getAttribute('data-cat-tab') + '"]');
        if(target){ target.style.display = ''; }
      });
    });
  }

  /* Generic form -> success state (no backend yet) */
  document.querySelectorAll('form[data-fake-submit]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var success = document.querySelector(form.getAttribute('data-fake-submit'));
      if(success){
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior:'smooth', block:'center' });
      }
      form.reset();
    });
  });

  /* Image fallback — swap broken artwork photos for a neutral placeholder */
  document.querySelectorAll('img[data-fallback]').forEach(function(img){
    img.addEventListener('error', function(){
      if(img.src !== img.getAttribute('data-fallback')){
        img.src = img.getAttribute('data-fallback');
      }
    }, { once:true });
  });
})();
