/* Hero carousel — esports event splashes over the WebGL background.
   Auto-advances, reacts to the pointer (parallax + shader glow), and hands the
   shader a new accent colour on every slide so the background shifts with it. */

window.ApexHero = (function () {
  'use strict';

  const INTERVAL = 6500;

  function create(root, shader) {
    const slides = TRIBUNA_DATA.heroSlides;
    const p = v => I18N.pick(v);
    const track  = root.querySelector('#hero-track');
    const nav    = root.querySelector('#hero-nav');
    const counter= root.querySelector('#hero-counter');

    let index = 0;
    let timer = 0;
    let progressRaf = 0;
    let cycleStart = 0;
    let paused = false;

    /* --------------------------------------------------------- rendering */
    track.innerHTML = slides.map((s, i) => `
      <article class="hero-slide${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-hidden="${i === 0 ? 'false' : 'true'}">
        <div class="hero-slide__media hero-parallax" style="background-image:url('${s.image}')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-void/85 via-transparent to-transparent"></div>

        <div class="relative h-full max-w-container-max mx-auto px-6 md:px-margin-desktop flex items-center">
          <div class="hero-slide__content max-w-3xl">

            <div class="flex items-center gap-4 mb-6">
              <span class="flex items-center gap-2 ${s.live ? 'bg-live text-black live-pulse' : 'bg-glass-highlight text-on-surface border border-border-subtle'} font-label-caps text-[12px] px-3 py-1.5 rounded-full">
                ${s.live ? '<span class="w-1.5 h-1.5 rounded-full bg-black"></span>' : ''}${p(s.tag)}${s.countdown ? ' <span class="font-stat-value" data-countdown="' + i + '">--:--</span>' : ''}
              </span>
              <span class="font-label-caps text-label-caps text-on-surface-variant">${s.event}</span>
            </div>

            <h1 class="font-display-hero text-[clamp(40px,7vw,92px)] leading-[0.95] text-on-surface uppercase mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
              ${p(s.title)}
            </h1>

            <p class="font-stat-value text-[clamp(16px,1.6vw,24px)] text-primary-fixed-dim mb-6 tracking-wide">
              ${s.matchup}
            </p>

            <p class="font-body-lg text-[clamp(15px,1.3vw,20px)] text-on-surface-variant max-w-xl mb-10">
              ${p(s.blurb)}
            </p>

            <div class="flex flex-wrap items-center gap-8">
              <!-- Single CTA per slide: the Arena has its own dedicated block
                   further down the page, so a second button here only competed
                   with the one action the slide is actually about. -->
              <div class="flex gap-4">
                <button class="btn-primary clip-corner font-label-caps text-label-caps px-8 py-4 flex items-center gap-2" data-route="#/live">
                  <span class="material-symbols-outlined text-[18px]">${s.live ? 'play_arrow' : 'notifications'}</span>${p(s.cta)}
                </button>
              </div>
              <div class="flex gap-8 border-l border-border-subtle pl-8">
                ${s.meta.map(m => `
                  <div>
                    <div class="font-label-caps text-[11px] text-on-surface-variant mb-1">${p(m[0])}</div>
                    <div class="font-stat-value text-[18px] text-on-surface">${m[1]}</div>
                  </div>`).join('')}
              </div>
            </div>

          </div>
        </div>
      </article>
    `).join('');

    nav.innerHTML = slides.map((s, i) => `
      <button class="hero-dot${i === 0 ? ' is-active' : ''}" data-index="${i}"
              aria-label="Go to slide ${i + 1}: ${s.event}">
        <span class="hero-dot__fill"></span>
      </button>
    `).join('');

    // Horizontal gestures belong to the carousel, vertical ones to the page.
    root.style.touchAction = 'pan-y';

    const slideEls = Array.prototype.slice.call(track.querySelectorAll('.hero-slide'));
    const dotEls   = Array.prototype.slice.call(nav.querySelectorAll('.hero-dot'));
    const mediaEls = Array.prototype.slice.call(track.querySelectorAll('.hero-slide__media'));

    /* ---------------------------------------------------------- movement */
    function go(next, userInitiated) {
      const total = slides.length;
      index = (next + total) % total;

      slideEls.forEach((s, i) => {
        s.classList.toggle('is-active', i === index);
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dotEls.forEach((d, i) => d.classList.toggle('is-active', i === index));
      counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');

      if (shader) {
        shader.setAccent(slides[index].accent);
        shader.pulse();
      }

      cycleStart = performance.now();
      if (userInitiated) restart();
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => { if (!paused) next(); }, INTERVAL);
      cycleStart = performance.now();
    }

    /* Progress fill on the active dot, driven off rAF so pausing is exact. */
    function tickProgress(now) {
      progressRaf = requestAnimationFrame(tickProgress);
      const frac = paused ? null : Math.min(1, (now - cycleStart) / INTERVAL);
      dotEls.forEach((d, i) => {
        const fill = d.querySelector('.hero-dot__fill');
        if (i !== index) { fill.style.width = '0%'; return; }
        if (frac !== null) fill.style.width = (frac * 100) + '%';
      });
    }

    /* ---------------------------------------------------------- countdown */
    /* Slides with a `countdown` tick down in real time, so a visitor who sits
       on the hero sees the clock move rather than a frozen label. */
    const clocks = slides
      .map((s, i) => (s.countdown ? { i, left: s.countdown } : null))
      .filter(Boolean);

    const clockTimer = clocks.length ? setInterval(() => {
      clocks.forEach(c => {
        const el = track.querySelector('[data-countdown="' + c.i + '"]');
        if (!el) return;
        if (c.left <= 0) { el.textContent = 'NOW'; return; }
        c.left--;
        const m = String(Math.floor(c.left / 60)).padStart(2, '0');
        const sec = String(c.left % 60).padStart(2, '0');
        el.textContent = m + ':' + sec;
      });
    }, 1000) : 0;

    // Paint once immediately so the label never shows the placeholder.
    clocks.forEach(c => {
      const el = track.querySelector('[data-countdown="' + c.i + '"]');
      if (el) el.textContent = String(Math.floor(c.left / 60)).padStart(2, '0') + ':' + String(c.left % 60).padStart(2, '0');
    });

    /* --------------------------------------------------------- reactivity */
    // Pointer parallax: media drifts against the cursor, content drifts with it.
    root.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;   // touch drives the swipe, not parallax
      const rect = root.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width  - 0.5;
      const ny = (e.clientY - rect.top)  / rect.height - 0.5;
      mediaEls.forEach(m => {
        m.style.transform = 'scale(1.06) translate3d(' + (-nx * 26) + 'px,' + (-ny * 18) + 'px,0)';
      });
    });
    root.addEventListener('pointerleave', () => {
      mediaEls.forEach(m => { m.style.transform = ''; });
    });

    // Hold the current slide while the pointer is on the hero.
    root.addEventListener('mouseenter', () => { paused = true; });
    root.addEventListener('mouseleave', () => { paused = false; cycleStart = performance.now(); });

    nav.addEventListener('click', e => {
      const btn = e.target.closest('.hero-dot');
      if (btn) go(Number(btn.dataset.index), true);
    });

    root.querySelector('#hero-prev').addEventListener('click', () => go(index - 1, true));
    root.querySelector('#hero-next').addEventListener('click', () => go(index + 1, true));

    document.addEventListener('keydown', e => {
      if (location.hash && location.hash !== '#/home' && location.hash !== '#/') return;
      if (e.key === 'ArrowLeft')  go(index - 1, true);
      if (e.key === 'ArrowRight') go(index + 1, true);
    });

    /* ------------------------------------------------------------ swipe --
       A distance threshold alone makes a quick flick do nothing, which reads
       on a phone as "the carousel is broken". This tracks the gesture live and
       decides on velocity as well as distance:

         - the slide follows the finger, damped, so the drag is visible;
         - release commits on velocity > 0.11 px/ms (a flick is enough) OR on
           distance past a quarter of the hero;
         - otherwise it springs back;
         - `touch-action: pan-y` keeps vertical page scrolling intact;
         - extra touch points are ignored once a drag owns the gesture.        */

    const DAMP        = 0.42;   // finger travel -> slide travel
    const VEL_COMMIT  = 0.11;   // px/ms, per the gesture standard
    const DIST_FRAC   = 0.25;   // fraction of hero width that also commits

    let drag = null;

    function activeSlide() { return slideEls[index]; }

    function setDragOffset(px, animate) {
      const el = activeSlide();
      if (!el) return;
      const content = el.querySelector('.hero-slide__content');
      if (!content) return;
      content.style.transition = animate
        ? 'transform .45s var(--ease-out), opacity .45s var(--ease-out)'
        : 'none';
      content.style.transform = px ? `translate3d(${px}px,0,0)` : '';
      // Fade slightly as it moves so the swipe reads as "letting go of" the slide.
      content.style.opacity = px ? String(Math.max(0.45, 1 - Math.abs(px) / 420)) : '';
    }

    function clearDragOffset() {
      slideEls.forEach(el => {
        const c = el.querySelector('.hero-slide__content');
        if (!c) return;
        c.style.transition = '';
        c.style.transform = '';
        c.style.opacity = '';
      });
    }

    root.addEventListener('pointerdown', e => {
      if (drag) return;                       // a gesture already owns this
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // Let real controls handle their own taps.
      if (e.target.closest('button, a, input, .hero-dot')) return;
      drag = {
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        t0: performance.now(),
        dx: 0,
        locked: null                          // 'x' once we know it is a swipe
      };
      paused = true;
    });

    root.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;

      // Decide once whether this is a horizontal swipe or a vertical scroll.
      if (drag.locked === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        drag.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (drag.locked === 'x') {
          try { root.setPointerCapture(e.pointerId); } catch (err) { /* capture optional */ }
        }
      }
      if (drag.locked !== 'x') return;

      drag.dx = dx;
      setDragOffset(dx * DAMP, false);
    });

    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const { dx, t0, locked } = drag;
      drag = null;
      paused = false;

      if (locked !== 'x' || dx === 0) { clearDragOffset(); cycleStart = performance.now(); return; }

      const elapsed  = Math.max(1, performance.now() - t0);
      const velocity = Math.abs(dx) / elapsed;
      const commit   = velocity > VEL_COMMIT || Math.abs(dx) > root.offsetWidth * DIST_FRAC;

      if (commit) {
        // Carry the slide the rest of the way out before swapping.
        setDragOffset(dx < 0 ? -140 : 140, true);
        setTimeout(clearDragOffset, 260);
        dx < 0 ? go(index + 1, true) : go(index - 1, true);
      } else {
        setDragOffset(0, true);               // spring back
        setTimeout(clearDragOffset, 460);
        cycleStart = performance.now();
      }
    }

    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);

    /* -------------------------------------------------------------- boot */
    if (shader) shader.setAccent(slides[0].accent);
    counter.textContent = '01 / ' + String(slides.length).padStart(2, '0');
    restart();
    progressRaf = requestAnimationFrame(tickProgress);

    return {
      next, prev,
      pause() { paused = true; },
      resume() { paused = false; cycleStart = performance.now(); },
      destroy() { clearInterval(timer); clearInterval(clockTimer); cancelAnimationFrame(progressRaf); }
    };
  }

  return { create };
})();
