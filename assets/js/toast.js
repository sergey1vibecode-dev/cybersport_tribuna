/* Toast — tiny, dependency-free confirmation strip for actions that have no
   other visible feedback (copied a link, set a reminder, saved an article).
   Loaded early so hero.js and app.js can both call Toast.show(...). */

window.Toast = (function () {
  'use strict';

  const ICONS = {
    check: 'check_circle',
    link:  'link',
    bell:  'notifications_active',
    bookmark: 'bookmark',
    info:  'info'
  };

  let stack = null;

  function ensureStack() {
    if (stack) return stack;
    stack = document.createElement('div');
    stack.id = 'toast-stack';
    stack.setAttribute('role', 'status');
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
    return stack;
  }

  /* show(message, opts?) — opts.icon is one of ICONS' keys, opts.duration in ms. */
  function show(message, opts) {
    const o = Object.assign({ icon: 'check', duration: 2600 }, opts || {});
    const root = ensureStack();

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML =
      '<span class="material-symbols-outlined text-[18px]">' + (ICONS[o.icon] || ICONS.check) + '</span>' +
      '<span class="toast__text"></span>';
    el.querySelector('.toast__text').textContent = message;   // textContent — never trust interpolated text as markup
    root.appendChild(el);

    requestAnimationFrame(() => el.classList.add('is-in'));

    const remove = () => {
      el.classList.remove('is-in');
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 260);
    };
    const timer = setTimeout(remove, o.duration);
    el.addEventListener('click', () => { clearTimeout(timer); remove(); });

    return { close: remove };
  }

  return { show };
})();
