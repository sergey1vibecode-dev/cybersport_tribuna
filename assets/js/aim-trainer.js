/* AIM ARENA — canvas aim trainer.
   30 second run, drifting targets with a headshot core, combo multiplier,
   rank on completion, personal best in localStorage. */

window.AimArena = (function () {
  'use strict';

  const DIFFICULTY = {
    rookie: { label: 'ROOKIE', spawnMs: 780, maxTargets: 5, life: 2600, radius: [30, 42], speed: 26,  mult: 0.7 },
    pro:    { label: 'PRO',    spawnMs: 520, maxTargets: 6, life: 1900, radius: [20, 32], speed: 62,  mult: 1.0 },
    insane: { label: 'INSANE', spawnMs: 360, maxTargets: 8, life: 1300, radius: [14, 24], speed: 118, mult: 1.4 }
  };

  const DURATION   = 30000;  // ms
  const BASE_SCORE = 40;
  const HS_RATIO   = 0.42;   // inner core as a fraction of target radius
  const STORE_KEY  = 'tribuna.aim.best';

  /* ------------------------------------------------------------- audio */
  /* Tiny WebAudio synth — no external assets, and silent until the player
     actually starts a run. */
  const Sfx = (function () {
    let ctx = null;
    let muted = false;

    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }

    function blip(freq, dur, type, gain) {
      if (muted) return;
      const c = ensure();
      if (!c) return;
      const osc = c.createOscillator();
      const amp = c.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.55, c.currentTime + dur);
      amp.gain.setValueAtTime(gain == null ? 0.06 : gain, c.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      osc.connect(amp).connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + dur);
    }

    return {
      hit()      { blip(660, 0.08, 'square', 0.05); },
      headshot() { blip(990, 0.13, 'square', 0.07); },
      miss()     { blip(150, 0.10, 'sawtooth', 0.035); },
      tick()     { blip(440, 0.05, 'sine', 0.04); },
      start()    { blip(880, 0.18, 'sine', 0.06); },
      over()     { blip(220, 0.45, 'triangle', 0.07); },
      toggle()   { muted = !muted; return muted; },
      isMuted()  { return muted; },
      warm()     { ensure(); }
    };
  })();

  /* ------------------------------------------------------------- helpers */
  const rand = (a, b) => a + Math.random() * (b - a);

  function rankFor(score) {
    const ranks = TRIBUNA_DATA.aimRanks;
    let out = ranks[0];
    for (const r of ranks) if (score >= r.min) out = r;
    return out;
  }

  function readBest() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeBest(entry) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(entry)); } catch (e) { /* private mode */ }
  }

  /* --------------------------------------------------------------- init */
  function create(root) {
    const canvas = root.querySelector('#aim-canvas');
    const frame  = root.querySelector('#aim-frame');
    const flash  = root.querySelector('#aim-flash');
    const ctx    = canvas.getContext('2d');

    const el = {
      score:    root.querySelector('[data-aim="score"]'),
      hits:     root.querySelector('[data-aim="hits"]'),
      acc:      root.querySelector('[data-aim="acc"]'),
      combo:    root.querySelector('[data-aim="combo"]'),
      hs:       root.querySelector('[data-aim="hs"]'),
      time:     root.querySelector('[data-aim="time"]'),
      bar:      root.querySelector('[data-aim="bar"]'),
      best:     root.querySelector('[data-aim="best"]'),
      intro:    root.querySelector('#aim-intro'),
      results:  root.querySelector('#aim-results'),
      resultIn: root.querySelector('#aim-results-inner'),
      startBtn: root.querySelector('[data-aim-action="start"]'),
      againBtn: root.querySelector('[data-aim-action="again"]'),
      muteBtn:  root.querySelector('[data-aim-action="mute"]'),
      chips:    Array.prototype.slice.call(root.querySelectorAll('[data-difficulty]'))
    };

    let cfg = DIFFICULTY.pro;

    const state = {
      phase: 'idle',        // idle | countdown | running | over
      targets: [],
      particles: [],
      floats: [],
      score: 0, hits: 0, shots: 0, headshots: 0,
      combo: 0, bestCombo: 0,
      startedAt: 0, lastSpawn: 0, lastFrame: 0,
      countdownFrom: 0,
      lastTickSecond: -1,
      pointer: { x: -999, y: -999, inside: false },
      raf: 0,
      w: 0, h: 0, dpr: 1
    };

    /* ------------------------------------------------------------ sizing */
    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = rect.width;
      state.h = rect.height;
      state.dpr = dpr;
      canvas.width  = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    /* ----------------------------------------------------------- targets */
    function spawn() {
      const r = rand(cfg.radius[0], cfg.radius[1]);
      const pad = r + 12;
      const angle = Math.random() * Math.PI * 2;
      state.targets.push({
        x: rand(pad, Math.max(pad + 1, state.w - pad)),
        y: rand(pad, Math.max(pad + 1, state.h - pad)),
        r: r,
        vx: Math.cos(angle) * cfg.speed,
        vy: Math.sin(angle) * cfg.speed,
        born: performance.now(),
        life: cfg.life,
        pop: 0
      });
    }

    function burst(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(40, 260);
        state.particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rand(260, 620),
          born: performance.now(),
          color
        });
      }
    }

    function floatText(x, y, text, color) {
      state.floats.push({ x, y, text, color, born: performance.now(), life: 750 });
    }

    /* -------------------------------------------------------------- HUD */
    function accuracy() {
      return state.shots ? Math.round((state.hits / state.shots) * 100) : 100;
    }

    function hsRate() {
      return state.hits ? Math.round((state.headshots / state.hits) * 100) : 0;
    }

    function paintHud() {
      el.score.textContent = String(state.score).padStart(4, '0');
      el.hits.textContent  = state.hits;
      el.acc.textContent   = accuracy() + '%';
      el.combo.textContent = 'x' + Math.max(1, state.combo);
      el.hs.textContent    = hsRate() + '%';
    }

    function paintBest() {
      const best = readBest();
      el.best.textContent = best ? (best.score + ' · ' + best.rank) : '—';
    }

    /* ------------------------------------------------------------ firing */
    function fire(clientX, clientY) {
      if (state.phase !== 'running') return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      state.shots++;

      // Front-most target wins the shot, so overlapping targets resolve the
      // same way they look.
      let idx = -1;
      for (let i = state.targets.length - 1; i >= 0; i--) {
        const t = state.targets[i];
        const d = Math.hypot(x - t.x, y - t.y);
        if (d <= t.r) { idx = i; break; }
      }

      if (idx === -1) {
        state.combo = 0;
        Sfx.miss();
        flash.classList.add('is-on');
        // Force a reflow so the transition re-runs on rapid consecutive misses.
        void flash.offsetWidth;
        flash.classList.remove('is-on');
        paintHud();
        return;
      }

      const t = state.targets[idx];
      const dist = Math.hypot(x - t.x, y - t.y);
      const isHeadshot = dist <= t.r * HS_RATIO;

      state.hits++;
      state.combo++;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      if (isHeadshot) state.headshots++;

      const sizeBonus = cfg.radius[1] / t.r;             // smaller target, more points
      const comboMult = Math.min(1 + state.combo * 0.1, 3);
      const gained = Math.round(
        BASE_SCORE * sizeBonus * comboMult * (isHeadshot ? 2 : 1) * cfg.mult
      );
      state.score += gained;

      burst(t.x, t.y, isHeadshot ? '#ff6b00' : '#a855f7', isHeadshot ? 22 : 12);
      floatText(t.x, t.y - t.r - 6, (isHeadshot ? 'HS +' : '+') + gained, isHeadshot ? '#ff6b00' : '#ddb7ff');
      isHeadshot ? Sfx.headshot() : Sfx.hit();

      state.targets.splice(idx, 1);
      paintHud();
    }

    /* ------------------------------------------------------------ drawing */
    function drawTarget(t, now) {
      const age = now - t.born;
      const remaining = 1 - age / t.life;

      // Spawn pop-in
      const grow = Math.min(1, age / 160);
      const r = t.r * (0.6 + 0.4 * grow) * (1 + 0.06 * Math.sin(age / 160));

      ctx.save();
      ctx.translate(t.x, t.y);

      // Outer glow
      const g = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.9);
      g.addColorStop(0, 'rgba(168, 85, 247, 0.30)');
      g.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = 'rgba(22, 25, 34, 0.85)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Lifetime ring — drains clockwise from 12 o'clock
      ctx.strokeStyle = remaining < 0.3 ? '#ff6b00' : '#ddb7ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, remaining));
      ctx.stroke();

      // Headshot core
      ctx.fillStyle = 'rgba(255, 107, 0, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, r * HS_RATIO, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair ticks
      ctx.strokeStyle = 'rgba(226, 226, 233, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r * 0.78, 0); ctx.lineTo(-r * 0.5, 0);
      ctx.moveTo(r * 0.5, 0);   ctx.lineTo(r * 0.78, 0);
      ctx.moveTo(0, -r * 0.78); ctx.lineTo(0, -r * 0.5);
      ctx.moveTo(0, r * 0.5);   ctx.lineTo(0, r * 0.78);
      ctx.stroke();

      ctx.restore();
    }

    function drawCrosshair() {
      if (!state.pointer.inside) return;
      const { x, y } = state.pointer;
      const gap = 5 + Math.min(state.combo, 10) * 0.4;
      const len = 11;

      ctx.save();
      ctx.strokeStyle = '#e2e2e9';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x - gap - len, y); ctx.lineTo(x - gap, y);
      ctx.moveTo(x + gap, y);       ctx.lineTo(x + gap + len, y);
      ctx.moveTo(x, y - gap - len); ctx.lineTo(x, y - gap);
      ctx.moveTo(x, y + gap);       ctx.lineTo(x, y + gap + len);
      ctx.stroke();

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawGrid() {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const step = 48;
      ctx.beginPath();
      for (let x = 0; x < state.w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, state.h); }
      for (let y = 0; y < state.h; y += step) { ctx.moveTo(0, y); ctx.lineTo(state.w, y); }
      ctx.stroke();
      ctx.restore();
    }

    function drawCountdown(now) {
      const left = Math.ceil((state.countdownFrom - now) / 1000);
      const label = left > 0 ? String(left) : 'GO';
      const sec = Math.ceil((state.countdownFrom - now) / 1000);
      if (sec !== state.lastTickSecond) {
        state.lastTickSecond = sec;
        Sfx.tick();
      }

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '400 120px Anton, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
      ctx.shadowBlur = 34;
      ctx.fillText(label, state.w / 2, state.h / 2);
      ctx.restore();
    }

    /* --------------------------------------------------------- main loop */
    function loop(now) {
      state.raf = requestAnimationFrame(loop);

      const dt = Math.min((now - state.lastFrame) / 1000, 0.05);
      state.lastFrame = now;

      ctx.clearRect(0, 0, state.w, state.h);
      drawGrid();

      if (state.phase === 'countdown') {
        if (now >= state.countdownFrom) {
          state.phase = 'running';
          state.startedAt = now;
          state.lastSpawn = now;
          Sfx.start();
        } else {
          drawCountdown(now);
          drawCrosshair();
          return;
        }
      }

      if (state.phase === 'running') {
        const elapsed = now - state.startedAt;
        const left = Math.max(0, DURATION - elapsed);

        el.time.textContent = (left / 1000).toFixed(1);
        const frac = left / DURATION;
        el.bar.style.transform = 'scaleX(' + frac + ')';
        el.bar.classList.toggle('is-low', frac < 0.25);

        if (left <= 0) { finish(); return; }

        // Spawn
        if (now - state.lastSpawn >= cfg.spawnMs && state.targets.length < cfg.maxTargets) {
          spawn();
          state.lastSpawn = now;
        }

        // Advance targets, expire the stale ones (an expiry breaks the combo)
        for (let i = state.targets.length - 1; i >= 0; i--) {
          const t = state.targets[i];
          t.x += t.vx * dt;
          t.y += t.vy * dt;
          if (t.x < t.r) { t.x = t.r; t.vx *= -1; }
          if (t.x > state.w - t.r) { t.x = state.w - t.r; t.vx *= -1; }
          if (t.y < t.r) { t.y = t.r; t.vy *= -1; }
          if (t.y > state.h - t.r) { t.y = state.h - t.r; t.vy *= -1; }

          if (now - t.born >= t.life) {
            state.targets.splice(i, 1);
            state.combo = 0;
            paintHud();
          }
        }
      }

      state.targets.forEach(t => drawTarget(t, now));

      // Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        const age = now - p.born;
        if (age >= p.life) { state.particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 220 * dt;
        ctx.globalAlpha = 1 - age / p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
      }

      // Floating score text
      for (let i = state.floats.length - 1; i >= 0; i--) {
        const f = state.floats[i];
        const age = now - f.born;
        if (age >= f.life) { state.floats.splice(i, 1); continue; }
        const k = age / f.life;
        ctx.save();
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = f.color;
        ctx.font = '700 16px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(f.text, f.x, f.y - k * 34);
        ctx.restore();
      }

      drawCrosshair();
    }

    /* ------------------------------------------------------- transitions */
    function start() {
      resize();
      Sfx.warm();

      state.phase = 'countdown';
      state.targets.length = 0;
      state.particles.length = 0;
      state.floats.length = 0;
      state.score = 0; state.hits = 0; state.shots = 0; state.headshots = 0;
      state.combo = 0; state.bestCombo = 0;
      state.countdownFrom = performance.now() + 3000;
      state.lastTickSecond = -1;
      state.lastFrame = performance.now();

      el.intro.hidden = true;
      el.results.hidden = true;
      frame.classList.add('is-running');
      el.time.textContent = (DURATION / 1000).toFixed(1);
      el.bar.style.transform = 'scaleX(1)';
      el.bar.classList.remove('is-low');
      paintHud();

      cancelAnimationFrame(state.raf);
      state.raf = requestAnimationFrame(loop);
    }

    function finish() {
      state.phase = 'over';
      cancelAnimationFrame(state.raf);
      frame.classList.remove('is-running');
      Sfx.over();

      const rank = rankFor(state.score);
      const acc = accuracy();
      const prev = readBest();
      const isBest = !prev || state.score > prev.score;
      if (isBest) writeBest({ score: state.score, rank: rank.name, acc: acc, at: Date.now() });
      paintBest();

      el.resultIn.innerHTML = [
        '<div class="flex flex-col items-center text-center px-8 py-10">',
        isBest
          ? '<span class="font-label-caps text-label-caps text-live mb-4 animate-pulse-fast">' + I18N.t('arena.newBest') + '</span>'
          : '<span class="font-label-caps text-label-caps text-on-surface-variant mb-4">' + I18N.t('arena.runComplete') + '</span>',
        '<div class="rank-badge mb-6" style="color:' + rank.color + '">',
        '  <span class="font-headline-md text-[20px] leading-none">' + rank.name + '</span>',
        '</div>',
        '<div class="font-display-xl text-[64px] leading-none text-on-surface mb-2">' + state.score + '</div>',
        '<p class="font-body-md text-on-surface-variant mb-8 max-w-sm">' + I18N.pick(rank.note) + '</p>',
        '<div class="grid grid-cols-4 gap-3 mb-8 w-full max-w-lg">',
        statCell(I18N.t('arena.hits'), state.hits),
        statCell(I18N.t('arena.accuracy'), acc + '%'),
        statCell(I18N.t('arena.headshot'), hsRate() + '%'),
        statCell(I18N.t('arena.bestCombo'), 'x' + state.bestCombo),
        '</div>',
        '<div class="flex gap-4">',
        '  <button data-aim-action="again" class="btn-primary clip-corner font-label-caps text-label-caps px-8 py-3">' + I18N.t('arena.again') + '</button>',
        '  <button data-aim-action="close" class="btn-secondary clip-corner font-label-caps text-label-caps px-8 py-3">' + I18N.t('arena.close') + '</button>',
        '</div>',
        '</div>'
      ].join('');

      el.results.hidden = false;

      el.resultIn.querySelectorAll('[data-aim-action="again"]').forEach(b => b.addEventListener('click', start));
      el.resultIn.querySelectorAll('[data-aim-action="close"]').forEach(b => b.addEventListener('click', () => {
        el.results.hidden = true;
        el.intro.hidden = false;
        state.phase = 'idle';
      }));
    }

    function statCell(label, value) {
      return '<div class="stat-tile clip-corner-sm text-center">' +
             '<div class="stat-tile__label font-label-caps">' + label + '</div>' +
             '<div class="stat-tile__value font-stat-value text-[22px] mt-1">' + value + '</div>' +
             '</div>';
    }

    function stop() {
      cancelAnimationFrame(state.raf);
      if (state.phase === 'running' || state.phase === 'countdown') {
        state.phase = 'idle';
        frame.classList.remove('is-running');
        el.intro.hidden = false;
      }
    }

    /* ------------------------------------------------------------- events */
    canvas.addEventListener('pointermove', e => {
      const rect = canvas.getBoundingClientRect();
      state.pointer.x = e.clientX - rect.left;
      state.pointer.y = e.clientY - rect.top;
      state.pointer.inside = true;
    });
    canvas.addEventListener('pointerleave', () => { state.pointer.inside = false; });
    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      fire(e.clientX, e.clientY);
    });
    // Suppress the context menu so right-click misfires don't interrupt a run.
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    el.startBtn.addEventListener('click', start);

    el.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        el.chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        cfg = DIFFICULTY[chip.dataset.difficulty] || DIFFICULTY.pro;
      });
    });

    el.muteBtn.addEventListener('click', () => {
      const muted = Sfx.toggle();
      el.muteBtn.querySelector('span').textContent = muted ? 'volume_off' : 'volume_up';
      el.muteBtn.setAttribute('aria-pressed', String(muted));
    });

    paintBest();
    paintHud();
    resize();

    return { start, stop, resize };
  }

  return { create };
})();
