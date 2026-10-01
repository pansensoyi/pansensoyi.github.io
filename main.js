(function () {
  var root = document.documentElement;

  // Theme toggle: follows the system until the visitor picks one.
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  if (!('IntersectionObserver' in window)) return;

  // Reveal blocks as they scroll into view.
  var revealTargets = document.querySelectorAll(
    '.stats li, .role, .stack-row, .build, .project, .cred-list li'
  );
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    revealer.observe(el);
  });

  // Highlight the section currently in view in the nav.
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links[entry.target.id];
      if (!link || !entry.isIntersecting) return;
      Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
      link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) spy.observe(section);
  });
})();
