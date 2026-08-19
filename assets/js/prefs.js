/* Prefs — tiny boolean-flag-per-key persistence, shared by the reminder bells
   and the article bookmark toggle. Loaded before hero.js/app.js so both can
   read state at render time (to paint the initial armed/saved look) and write
   it on click. */

window.Prefs = (function () {
  'use strict';

  const PREFIX = 'tribuna.pref.';

  function isSet(key) {
    try { return localStorage.getItem(PREFIX + key) === '1'; } catch (e) { return false; }
  }

  /* Flips the flag and returns the new state. */
  function toggle(key) {
    const next = !isSet(key);
    try {
      if (next) localStorage.setItem(PREFIX + key, '1');
      else localStorage.removeItem(PREFIX + key);
    } catch (e) { /* private mode: state just won't survive a reload */ }
    return next;
  }

  return { isSet, toggle };
})();
