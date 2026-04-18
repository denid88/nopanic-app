(function () {
  'use strict';

  // Mark JS as available so CSS can hide the no-JS fallback.
  document.documentElement.classList.add('js-enabled');

  var sliders = document.querySelectorAll('.slider');
  for (var i = 0; i < sliders.length; i++) {
    initSlider(sliders[i]);
  }

  function initSlider(root) {
    var track = root.querySelector('.slider__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.slider__slide'));
    var prevBtn = root.querySelector('.slider__prev');
    var nextBtn = root.querySelector('.slider__next');
    var dotsContainer = root.querySelector('.slider__dots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    var count = slides.length;
    if (!count) return;
    var index = 0;
    var dots = [];

    for (var i = 0; i < count; i++) {
      (function (slideIndex) {
        var b = document.createElement('button');
        b.className = 'slider__dot';
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Go to slide ' + (slideIndex + 1));
        b.addEventListener('click', function () { go(slideIndex); });
        dotsContainer.appendChild(b);
        dots.push(b);
      })(i);
    }

    function go(i) {
      index = ((i % count) + count) % count;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      for (var s = 0; s < slides.length; s++) {
        slides[s].setAttribute('aria-hidden', s !== index ? 'true' : 'false');
      }
      for (var d = 0; d < dots.length; d++) {
        dots[d].setAttribute('aria-selected', d === index ? 'true' : 'false');
      }
    }

    prevBtn.addEventListener('click', function () { go(index - 1); });
    nextBtn.addEventListener('click', function () { go(index + 1); });

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    });

    var dragStartX = 0;
    var dragging = false;
    function onStart(x, e) {
      dragStartX = x;
      dragging = true;
      if (e && e.preventDefault) e.preventDefault();
    }
    function onEnd(x) {
      if (!dragging) return;
      dragging = false;
      var dx = x - dragStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) go(index + 1); else go(index - 1);
    }
    root.addEventListener('touchstart', function (e) { onStart(e.touches[0].clientX, null); }, { passive: true });
    root.addEventListener('touchend', function (e) { onEnd(e.changedTouches[0].clientX); });
    root.addEventListener('mousedown', function (e) { onStart(e.clientX, e); });
    window.addEventListener('mouseup', function (e) { onEnd(e.clientX); });

    go(0);
  }
})();
