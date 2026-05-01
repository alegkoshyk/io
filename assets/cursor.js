// Custom cursor + global mouse tracker for particles
(function(){
  // Skip on touch devices
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  // Global mouse state for particles
  var mouse = window.__cursorMouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    ndcX: 0,
    ndcY: 0,
    active: false
  };

  // Cursor elements
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.ndcX = (e.clientX / innerWidth) * 2 - 1;
    mouse.ndcY = -(e.clientY / innerHeight) * 2 + 1;
    mouse.active = true;
  }, { passive: true });

  document.addEventListener('mouseleave', function() { mouse.active = false; });
  document.addEventListener('mouseenter', function() { mouse.active = true; });

  // Smooth ring follow
  var rx = innerWidth / 2, ry = innerHeight / 2;
  function loop() {
    rx += (mouse.x - rx) * 0.18;
    ry += (mouse.y - ry) * 0.18;
    dot.style.transform = 'translate3d(' + mouse.x + 'px,' + mouse.y + 'px,0) translate(-50%,-50%)';
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Hover state for interactive elements
  var hoverSelector = 'a, button, .btn, .faq-question, .option-item, .tab, .question-item, .for-who-item, .format-card, .course-card, .scale-btn, .stat-item, .theme-toggle, .menu-toggle, input, textarea, select, .when-card, .level-card, .principle-tag, .forWho-tag, .mod-hold, .format-item, .change-item, .recog-item, .fw-item, .diff-card, .process-item, .expect-card, .timeline-item, .what-pillar, .what-pill, .who-card, .rec-card, .next-card, .conn-step, [data-cursor-hover]';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      dot.classList.add('hover');
      ring.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      var related = e.relatedTarget;
      if (!related || !related.closest || !related.closest(hoverSelector)) {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    }
  });

  // Click pulse
  document.addEventListener('mousedown', function() {
    ring.classList.add('click');
    setTimeout(function() { ring.classList.remove('click'); }, 250);
  });

  // Hide on text inputs (use native I-beam)
  document.addEventListener('focusin', function(e) {
    if (e.target.matches('input, textarea')) {
      dot.classList.add('hidden');
      ring.classList.add('hidden');
    }
  });
  document.addEventListener('focusout', function(e) {
    if (e.target.matches('input, textarea')) {
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
    }
  });
})();
