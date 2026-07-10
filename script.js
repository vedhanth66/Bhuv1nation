document.addEventListener('DOMContentLoaded', function () {

  /* ============================= CONSTANTS ============================= */
  var YT_URL = 'https://youtube.com/@bhuv1nation?si=a0fhy65wFQA2UdaK';
  var ADMIN_PASSCODE = 'bhuv2026'; /* Demo-only gate not secure auth. Change before real-world use. */

  /* ============================= PRELOADER ============================= */
  var isWindowLoaded = document.readyState === 'complete';
  if (!isWindowLoaded) {
    window.addEventListener('load', function () {
      isWindowLoaded = true;
    });
  }

  var progressFill = document.getElementById('preloaderProgressFill');
  var progressPercent = document.getElementById('preloaderPercentage');
  var preloader = document.getElementById('preloader');

  var currentProgress = 0;

  function updateLoaderProgress() {
    if (currentProgress < 100) {
      if (currentProgress < 99) {
        var increment = Math.max(0.4, (100 - currentProgress) * 0.035);
        if (isWindowLoaded) {
          increment = Math.max(1.8, (100 - currentProgress) * 0.12);
        }
        currentProgress += increment;
        if (currentProgress > 99) currentProgress = 99;
      } else if (isWindowLoaded) {
        currentProgress = 100;
      }

      var roundedProgress = Math.floor(currentProgress);
      if (progressFill) progressFill.style.width = roundedProgress + '%';
      if (progressPercent) progressPercent.textContent = (roundedProgress < 10 ? '0' : '') + roundedProgress;

      if (currentProgress < 100) {
        requestAnimationFrame(updateLoaderProgress);
      } else {
        setTimeout(function () {
          if (preloader) preloader.classList.add('hidden');
          setTimeout(function () {
            document.body.classList.add('loaded');
          }, 350);
        }, 300);
      }
    }
  }

  requestAnimationFrame(updateLoaderProgress);

  /* ============================= NAV: scroll shrink ============================= */
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ============================= NAV: mobile burger ============================= */
  var burgerBtn = document.getElementById('navBurger');
  var navLinksEl = document.getElementById('navLinks');
  var burgerIcon = document.getElementById('burgerIcon');
  function setBurgerIcon(open) {
    burgerIcon.innerHTML = open
      ? '<path d="M18 6 6 18M6 6l12 12"/>'
      : '<path d="M4 7h16M4 12h16M4 17h16"/>';
  }
  burgerBtn.addEventListener('click', function () {
    var open = navLinksEl.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', open);
    setBurgerIcon(open);
  });
  navLinksEl.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinksEl.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      setBurgerIcon(false);
    });
  });

  /* ============================= NAV: active link on scroll ============================= */
  var navAnchors = navLinksEl.querySelectorAll('a');
  var navSectionIds = ['home', 'about', 'content', 'collab', 'book', 'contact'];
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navAnchors.forEach(function (a) { a.classList.toggle('active', a.dataset.nav === id); });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  navSectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });

  /* ============================= HERO: Animations Removed ============================= */
  // Per user request, scroll and hover animations on the hero section have been removed.

  /* ============================= FILMSTRIP + TICKER ============================= */
  var filmTrack = document.getElementById('filmstripTrack');
  var rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCank4O_VJHoj_PtjzAIFcoA';
  
  function dots(n) { return '<span></span>'.repeat(n); }
  function filmCardHTML(item) {
    var imgUrl = item.thumbnail || '';
    return '<a class="film-card" href="' + item.link + '" target="_blank" rel="noopener" style="background-image:url('+imgUrl+'); background-size: cover; background-position: center;">' +
      '<div class="film-card-bg" style="background:rgba(0,0,0,0.4);"></div>' +
      '<div class="sprocket top">' + dots(6) + '</div>' +
      '<div class="sprocket bottom">' + dots(6) + '</div>' +
      '<div class="play-badge"><svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg></div>' +
      '<div class="caption" style="text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">' + item.title + '</div>' +
      '</a>';
  }

  fetch(rssUrl)
    .then(res => res.json())
    .then(data => {
      if (data && data.items) {
        var videos = data.items.slice(0, 8);
        var filmHTML = videos.map(filmCardHTML).join('');
        filmTrack.innerHTML = filmHTML + filmHTML;
        filmTrack.classList.add('is-animated');
      }
    })
    .catch(err => console.error('Error fetching YouTube videos:', err));

  var tickerWords = ['Daily Vlogs', 'Tech Reviews', 'Bengaluru Life', 'Real Stories'];
  var tickerTrack = document.getElementById('tickerTrack');
  var tickerHTML = '';
  for (var t = 0; t < 6; t++) {
    tickerWords.forEach(function (w) {
      tickerHTML += '<span>' + w + ' <span style="opacity:.5">✦</span></span>';
    });
  }
  tickerTrack.innerHTML = tickerHTML + tickerHTML;
  tickerTrack.classList.add('is-animated');

  /* ============================= SCROLL REVEAL ============================= */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 4) * 70 + 'ms';
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ============================= FAQ ACCORDION ============================= */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.faq-item').classList.toggle('open');
    });
  });

  /* ============================= TOAST ============================= */
  var toastTimer;
  function showToast(msg) {
    var toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 4200);
  }

  /* ============================= HELPERS ============================= */
  function setFieldError(fieldId, hasError) {
    var el = document.getElementById(fieldId);
    if (el) el.classList.toggle('has-error', hasError);
  }
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function genId() { return Date.now() + '-' + Math.random().toString(36).slice(2, 8); }

  /* ============================= SINGLE-SELECT CHIPS ============================= */
  function wireChips(containerId, hiddenInputId, onChange) {
    var chips = document.querySelectorAll('#' + containerId + ' .chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        document.getElementById(hiddenInputId).value = chip.dataset.value;
        if (onChange) onChange();
      });
    });
  }
  wireChips('collabChips', 'collabType');

  /* Custom Calendar UI Removed - Using Calendly Now */

  /* ============================= COLLAB FORM ============================= */
  var collabForm = document.getElementById('collabForm');
  if (collabForm) {
    collabForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      var name = document.getElementById('collabName').value.trim();
      var email = document.getElementById('collabEmail').value.trim();
      var message = document.getElementById('collabMsg').value.trim();
      
      if (!name || !isValidEmail(email) || message.length < 3) {
        showToast('Please fill in the required fields correctly.');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true; 
      submitBtn.textContent = 'Sending…';

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        showToast('Collab request sent thank you!');
        form.reset();
        document.querySelectorAll('#collabChips .chip').forEach(function (c) { c.classList.remove('is-active'); });
        document.getElementById('collabType').value = '';
      }).catch(error => {
        showToast('Error sending message. Opening email client instead.');
        window.open('mailto:collab@bhuv1nation.com', '_blank');
      }).finally(() => {
        submitBtn.disabled = false; 
        submitBtn.innerHTML = originalLabel;
      });
    });
  }

  /* 3D Avatar is handled by avatar3d.js */

  /* ============================= FOOTER YEAR ============================= */
  document.getElementById('year').textContent = new Date().getFullYear();

});
