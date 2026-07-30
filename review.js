/* Review furniture — not part of either design.

   Two jobs:
   1. Switching direction keeps your place. The two designs are different
      heights, so we carry the scroll *fraction* rather than the pixel offset;
      you land at roughly the same point in the page in the other version.
   2. The bar fades down while you're reading and comes back when you stop,
      so it never sits on top of the design you're trying to judge. */
(function () {
  'use strict';
  var bar = document.querySelector('.reviewbar');
  if (!bar) return;

  var KEY = 'tse-review-pos';
  var page = location.pathname.split('/').pop() || 'index.html';

  function fraction() {
    var h = document.body.scrollHeight - window.innerHeight;
    return h > 0 ? window.scrollY / h : 0;
  }

  // Hand the current position to the other direction.
  bar.querySelector('.rb-alt').addEventListener('click', function () {
    try { sessionStorage.setItem(KEY, JSON.stringify({ page: page, f: fraction() })); } catch (e) {}
  });

  // Pick it up on the way in, once layout has settled.
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved && saved.page === page && saved.f > 0.01) {
      sessionStorage.removeItem(KEY);
      var restore = function () {
        var h = document.body.scrollHeight - window.innerHeight;
        window.scrollTo({ top: h * saved.f, behavior: 'auto' });
      };
      window.addEventListener('load', function () {
        restore();
        setTimeout(restore, 350); // again once fonts and posters have landed
      });
    }
  } catch (e) {}

  // Get out of the way while reading.
  var idle;
  window.addEventListener('scroll', function () {
    bar.classList.add('tucked');
    clearTimeout(idle);
    idle = setTimeout(function () { bar.classList.remove('tucked'); }, 900);
  }, { passive: true });
})();
