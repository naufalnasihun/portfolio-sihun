(function() {
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function(carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var slides = Array.from(track.children);
      if (!slides.length) return;
      var index = 0;
      var interval = parseInt(carousel.dataset.interval || '3000', 10);
      track.style.width = (slides.length * 100) + '%';
      slides.forEach(function(slide) { slide.style.width = (100 / slides.length) + '%'; });
      function goTo(i) {
        index = i % slides.length;
        if (index < 0) index = slides.length - 1;
        track.style.transform = 'translateX(' + (-index * (100 / slides.length)) + '%)';
      }
      var timer = null;
      function start() {
        if (timer) return;
        timer = setInterval(function() { goTo(index + 1); }, interval);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      if (carousel.dataset.autoplay !== 'false') start();
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      var prevBtn = carousel.querySelector('.prev');
      var nextBtn = carousel.querySelector('.next');
      if (!prevBtn) {
        prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.textContent = '‹';
        carousel.appendChild(prevBtn);
      }
      if (!nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.textContent = '›';
        carousel.appendChild(nextBtn);
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent default button behavior
          stop(); // Stop autoplay when interacting
          goTo(index - 1);
          // Optional: restart autoplay after interaction if desired, or let mouseleave handle it
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          stop();
          goTo(index + 1);
        });
      }

      goTo(0);
    });
  }

  function setupNavActive() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var links = Array.from(nav.querySelectorAll('a'));
    var path = location.pathname.split('/').pop() || 'index.html';
    links.forEach(function(l) { l.classList.remove('active'); });
    var current = links.find(function(l) {
      var href = l.getAttribute('href');
      var file = href.split('/').pop();
      if (!file) return false;
      if (path === '' || path === 'index.html') return file === 'home.html';
      return file === path;
    });
    if (current) current.classList.add('active');
  }

  function setupScrollState() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    function apply() {
      if (window.scrollY > 10) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    apply();
    window.addEventListener('scroll', apply, { passive: true });
  }

  function setupCardTilt() {
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function(card) {
      var rect = null;
      card.addEventListener('mouseenter', function() { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function(e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rx = (-y * 6).toFixed(2);
        var ry = (x * 6).toFixed(2);
        card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  function setupBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.textContent = '↑';
    document.body.appendChild(btn);
    function toggle() {
      if (window.scrollY > 240) btn.style.opacity = '1';
      else btn.style.opacity = '0';
    }
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupFAQAccordion() {
    var items = document.querySelectorAll('.faq .faq-item');
    items.forEach(function(item) {
      var q = item.querySelector('.faq-question');
      if (!q) return;
      q.addEventListener('click', function() {
        if (item.classList.contains('open')) {
          item.classList.remove('open');
        } else {
          items.forEach(function(i) { i.classList.remove('open'); });
          item.classList.add('open');
        }
      });
    });
  }

  function revealOnScroll() {
    document.querySelectorAll('.section').forEach(function(el) { el.classList.add('reveal'); });
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.section').forEach(function(el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initCarousels();
    setupNavActive();
    setupScrollState();
    setupCardTilt();
    setupBackToTop();
    setupFAQAccordion();
    revealOnScroll();
  });
})();
