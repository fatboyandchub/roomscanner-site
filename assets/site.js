// The site's only script, its own. Each clip shows its finished frame until
// it comes near the screen, then plays, rests two seconds on the last frame
// and plays again, and pauses while it's off the screen. Sections rise
// gently as they come up. With Reduce Motion on, nothing moves and the clips
// stay on their finished frame. Nothing is loaded from anywhere else and
// nothing is recorded.
(function () {
  document.documentElement.classList.add('js');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clips = Array.prototype.slice.call(document.querySelectorAll('video[data-src]'));
  var rises = Array.prototype.slice.call(document.querySelectorAll('.rise'));

  if (!('IntersectionObserver' in window)) {
    rises.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      seen.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px 15% 0px' });
  rises.forEach(function (el) { seen.observe(el); });

  if (still) return;

  function load(v) {
    if (v.getAttribute('src')) return;
    v.preload = 'auto';
    v.src = v.getAttribute('data-src');
    v.addEventListener('ended', function () {
      v.dataset.resting = '1';
      setTimeout(function () {
        delete v.dataset.resting;
        if (v.dataset.onScreen) { v.currentTime = 0; go(v); }
      }, 2000);
    });
  }
  function go(v) {
    if (!v.paused || v.dataset.resting) return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  // A screen ahead, the clip is fetched; on the screen, it plays.
  var near = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { load(e.target); near.unobserve(e.target); } });
  }, { rootMargin: '120% 0px' });
  var shown = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.dataset.onScreen = '1'; load(v); go(v); }
      else { delete v.dataset.onScreen; if (!v.paused) v.pause(); }
    });
  }, { threshold: 0.2 });
  clips.forEach(function (v) { near.observe(v); shown.observe(v); });

  function wake() { clips.forEach(function (v) { if (v.dataset.onScreen) go(v); }); }
  window.addEventListener('pageshow', wake);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
})();
