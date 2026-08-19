/* Animated SVG charts — no library, no canvas.
   Every builder returns markup in a "zero" state; call Charts.animate(root)
   after inserting it and CSS transitions carry it to the real values.

   Note on scaling: these SVGs deliberately do NOT use preserveAspectRatio="none".
   Non-uniform scaling stretches type and turns point markers into ellipses,
   which is most of what makes a chart look like a pasted screenshot. Instead the
   viewBox carries the aspect and CSS sets `width:100%; height:auto`, so the box
   always matches the viewBox and everything stays undistorted. */

window.Charts = (function () {
  'use strict';

  let uid = 0;
  const nextId = p => p + '-' + (++uid);

  const ACCENT = '#a855f7';
  const ACCENT_SOFT = '#ddb7ff';

  /* Catmull-Rom -> cubic Bezier, so trend lines curve instead of zig-zagging. */
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    let d = 'M ' + pts[0][0].toFixed(2) + ' ' + pts[0][1].toFixed(2);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  }

  /* ------------------------------------------------------------------ area */
  function area(values, opts) {
    const o = Object.assign({
      w: 900, h: 330, labels: [], color: ACCENT,
      min: null, max: null, suffix: '', ticks: 3, padL: 56
    }, opts || {});

    const gid  = nextId('g');
    const glow = nextId('f');
    const cid  = nextId('c');

    const padL = o.padL, padR = 26, padT = 46, padB = 52;
    const innerW = o.w - padL - padR;
    const innerH = o.h - padT - padB;

    const lo = o.min != null ? o.min : Math.min.apply(null, values);
    const hi = o.max != null ? o.max : Math.max.apply(null, values);
    const span = (hi - lo) || 1;

    const pts = values.map((v, i) => [
      padL + (innerW * i) / Math.max(1, values.length - 1),
      padT + innerH - ((v - lo) / span) * innerH
    ]);

    const line = smoothPath(pts);
    const baseY = padT + innerH;
    const fill = line +
      ` L ${pts[pts.length - 1][0].toFixed(2)} ${baseY} L ${pts[0][0].toFixed(2)} ${baseY} Z`;

    // Horizontal reference levels — hairlines, no boxy frame.
    let levels = '';
    for (let g = 0; g <= o.ticks; g++) {
      const y = padT + (innerH * g) / o.ticks;
      const val = Math.round(hi - (span * g) / o.ticks);
      levels += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${o.w - padR}" y2="${y.toFixed(1)}"
                   stroke="rgba(255,255,255,${g === o.ticks ? 0.14 : 0.045})" stroke-width="1"/>`;
      levels += `<text x="${padL - 14}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" class="chart-axis">${val}${o.suffix}</text>`;
    }

    // A tick under each point instead of a full vertical grid.
    let xAxis = '';
    pts.forEach((pt, i) => {
      xAxis += `<line x1="${pt[0].toFixed(1)}" y1="${baseY}" x2="${pt[0].toFixed(1)}" y2="${baseY + 6}"
                  stroke="rgba(255,255,255,0.16)" stroke-width="1"/>`;
      if (o.labels[i]) {
        xAxis += `<text x="${pt[0].toFixed(1)}" y="${baseY + 26}" text-anchor="middle" class="chart-axis">${o.labels[i]}</text>`;
      }
    });

    // The high point gets called out rather than sitting in a row of identical dots.
    let peakIdx = 0;
    values.forEach((v, i) => { if (v > values[peakIdx]) peakIdx = i; });
    const pk = pts[peakIdx];
    const peak = `
      <g class="chart-peak">
        <line x1="${pk[0].toFixed(1)}" y1="${(pk[1] + 8).toFixed(1)}" x2="${pk[0].toFixed(1)}" y2="${baseY}"
              stroke="${o.color}" stroke-width="1" stroke-dasharray="3 4" opacity=".45"/>
        <circle cx="${pk[0].toFixed(2)}" cy="${pk[1].toFixed(2)}" r="11" fill="${o.color}" opacity=".18"/>
        <circle cx="${pk[0].toFixed(2)}" cy="${pk[1].toFixed(2)}" r="5" fill="${o.color}"/>
        <circle cx="${pk[0].toFixed(2)}" cy="${pk[1].toFixed(2)}" r="5" fill="none" stroke="#0B0D12" stroke-width="1.5"/>
        <text x="${pk[0].toFixed(1)}" y="${(pk[1] - 20).toFixed(1)}" text-anchor="middle" class="chart-peak__value">
          ${values[peakIdx]}${o.suffix}
        </text>
      </g>`;

    const dots = pts.map((pt, i) => i === peakIdx ? '' : `
      <circle class="chart-dot" cx="${pt[0].toFixed(2)}" cy="${pt[1].toFixed(2)}" r="3.5"
              fill="#0B0D12" stroke="${o.color}" stroke-width="2"
              style="transition-delay:${i * 55 + 500}ms"/>`).join('');

    // Hover readout — a scanline plus a value chip that tracks the nearest point.
    const hover = `
      <g class="chart-hover" opacity="0">
        <line class="chart-hover__line" y1="${padT - 10}" y2="${baseY}" stroke="${ACCENT_SOFT}" stroke-width="1" opacity=".5"/>
        <circle class="chart-hover__dot" r="5.5" fill="${o.color}" stroke="#0B0D12" stroke-width="2"/>
        <g class="chart-hover__chip">
          <rect x="-34" y="-34" width="68" height="23" rx="4" fill="#0B0D12" stroke="${o.color}" stroke-width="1"/>
          <text class="chart-hover__value" y="-18" text-anchor="middle"></text>
        </g>
      </g>`;

    return `
<svg class="chart chart--area" viewBox="0 0 ${o.w} ${o.h}" role="img"
     data-points='${JSON.stringify(pts.map((pt, i) => ({ x: +pt[0].toFixed(1), y: +pt[1].toFixed(1), v: values[i] })))}'
     data-suffix="${o.suffix}">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${o.color}" stop-opacity="0.55"/>
      <stop offset="55%"  stop-color="${o.color}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${o.color}" stop-opacity="0"/>
    </linearGradient>
    <filter id="${glow}" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="${cid}"><rect class="chart-wipe" x="${padL}" y="0" width="0" height="${o.h}"/></clipPath>
  </defs>

  ${levels}
  ${xAxis}

  <g clip-path="url(#${cid})">
    <path d="${fill}" fill="url(#${gid})"/>
  </g>

  <path class="chart-line" d="${line}" fill="none" stroke="${o.color}" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" filter="url(#${glow})"/>

  ${dots}
  ${peak}
  ${hover}

  <rect class="chart-hit" x="${padL}" y="${padT - 12}" width="${innerW}" height="${innerH + 12}" fill="transparent"/>
</svg>`;
  }

  /* ------------------------------------------------------------------ bars */
  function bars(items, opts) {
    const o = Object.assign({ suffix: '%', max: 100, color: ACCENT }, opts || {});
    return `
<div class="chart-bars">
  ${items.map((it, i) => `
    <div class="chart-bars__row">
      <span class="chart-bars__label font-label-caps">${it.label}</span>
      <span class="chart-bars__track">
        <span class="chart-bars__fill" style="--scale:${(it.value / o.max).toFixed(4)}; transition-delay:${i * 80}ms;
              background:linear-gradient(90deg, ${it.color || o.color}, ${ACCENT_SOFT})"></span>
      </span>
      <span class="chart-bars__value font-stat-value">${it.value}${o.suffix}</span>
    </div>`).join('')}
</div>`;
  }

  /* ----------------------------------------------------------------- donut */
  function donut(segments, opts) {
    const o = Object.assign({
      size: 260, thickness: 26, gap: 3, centerLabel: '', centerValue: ''
    }, opts || {});

    const r = (o.size - o.thickness) / 2 - 10;
    const c = 2 * Math.PI * r;
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;

    // Ticks around the outside — reads as an instrument dial rather than a pie.
    let dial = '';
    for (let a = 0; a < 360; a += 6) {
      const rad = (a - 90) * Math.PI / 180;
      const r1 = r + o.thickness / 2 + 6;
      const r2 = r1 + (a % 30 === 0 ? 6 : 3);
      dial += `<line x1="${(o.size / 2 + Math.cos(rad) * r1).toFixed(1)}" y1="${(o.size / 2 + Math.sin(rad) * r1).toFixed(1)}"
                     x2="${(o.size / 2 + Math.cos(rad) * r2).toFixed(1)}" y2="${(o.size / 2 + Math.sin(rad) * r2).toFixed(1)}"
                     stroke="rgba(255,255,255,${a % 30 === 0 ? 0.22 : 0.09})" stroke-width="1"/>`;
    }

    let offset = 0;
    const rings = segments.map((s, i) => {
      const len = Math.max(0, (s.value / total) * c - o.gap);
      const dash = `${len.toFixed(2)} ${(c - len).toFixed(2)}`;
      const rot = (offset / c) * 360 - 90;
      offset += (s.value / total) * c;
      return `<circle class="chart-donut__seg" cx="${o.size / 2}" cy="${o.size / 2}" r="${r}"
                fill="none" stroke="${s.color}" stroke-width="${o.thickness}"
                stroke-dasharray="${dash}" stroke-dashoffset="${c}"
                transform="rotate(${rot.toFixed(2)} ${o.size / 2} ${o.size / 2})"
                style="--dash:${dash}; transition-delay:${i * 130}ms"/>`;
    }).join('');

    return `
<div class="chart-donut">
  <svg viewBox="0 0 ${o.size} ${o.size}" role="img">
    <g class="chart-donut__dial">${dial}</g>
    <circle cx="${o.size / 2}" cy="${o.size / 2}" r="${r}" fill="none"
            stroke="rgba(255,255,255,0.045)" stroke-width="${o.thickness}"/>
    ${rings}
  </svg>
  <div class="chart-donut__center">
    <div class="chart-donut__value font-stat-value">${o.centerValue}</div>
    <div class="font-label-caps chart-donut__label">${o.centerLabel}</div>
  </div>
</div>
<div class="chart-legend">
  ${segments.map(s => `
    <div class="chart-legend__row">
      <span class="chart-legend__swatch" style="background:${s.color}"></span>
      <span class="chart-legend__name font-label-caps">${s.label}</span>
      <span class="chart-legend__meter">
        <span class="chart-legend__meterFill" style="--scale:${(s.value / total).toFixed(4)}; background:${s.color}"></span>
      </span>
      <span class="chart-legend__pct font-stat-value">${Math.round((s.value / total) * 100)}%</span>
      <span class="chart-legend__val font-stat-value">${s.display || s.value}</span>
    </div>`).join('')}
</div>`;
  }

  /* ------------------------------------------------------------- split bar */
  function split(a, b, opts) {
    const o = Object.assign({ labelA: 'A', labelB: 'B', colorA: ACCENT, colorB: '#ff6b00' }, opts || {});
    const total = a + b || 1;
    const pctA = Math.round((a / total) * 100);
    return `
<div class="chart-split">
  <div class="chart-split__head">
    <span><span class="chart-legend__swatch" style="background:${o.colorA}"></span>
      <span class="font-label-caps text-[11px] text-on-surface-variant">${o.labelA}</span>
      <span class="font-stat-value text-[14px] text-on-surface ml-2">${pctA}%</span></span>
    <span><span class="font-stat-value text-[14px] text-on-surface mr-2">${100 - pctA}%</span>
      <span class="font-label-caps text-[11px] text-on-surface-variant">${o.labelB}</span>
      <span class="chart-legend__swatch" style="background:${o.colorB}"></span></span>
  </div>
  <div class="chart-split__track" style="background:${o.colorB}">
    <span class="chart-split__fill" style="--scale:${(pctA / 100).toFixed(4)}; background:linear-gradient(90deg, ${o.colorA}, ${ACCENT_SOFT})"></span>
  </div>
</div>`;
  }

  /* -------------------------------------------------------------- sparkline */
  function sparkline(values, opts) {
    const o = Object.assign({ w: 120, h: 34, color: ACCENT }, opts || {});
    const lo = Math.min.apply(null, values);
    const hi = Math.max.apply(null, values);
    const span = (hi - lo) || 1;
    const pts = values.map((v, i) => [
      2 + ((o.w - 4) * i) / Math.max(1, values.length - 1),
      o.h - 3 - ((v - lo) / span) * (o.h - 6)
    ]);
    const last = pts[pts.length - 1];
    return `
<svg class="chart chart--spark" viewBox="0 0 ${o.w} ${o.h}" preserveAspectRatio="none" aria-hidden="true">
  <path class="chart-line" d="${smoothPath(pts)}" fill="none" stroke="${o.color}"
        stroke-width="2" stroke-linecap="round"/>
  <circle class="chart-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.6" fill="${o.color}"
          style="transition-delay:900ms"/>
</svg>`;
  }

  /* ------------------------------------------------------------ form pills */
  function form(results, winLabel, lossLabel) {
    return `<div class="chart-form">${results.map((r, i) => `
      <span class="chart-form__pill ${r ? 'is-win' : 'is-loss'}" style="transition-delay:${i * 45}ms">
        ${r ? winLabel : lossLabel}
      </span>`).join('')}</div>`;
  }

  /* --------------------------------------------------------------- count-up */
  function countUp(el, to, opts) {
    const o = Object.assign({ duration: 1100, prefix: '', suffix: '', decimals: 0 }, opts || {});
    const start = performance.now();
    function step(now) {
      const k = Math.min(1, (now - start) / o.duration);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = o.prefix + (to * eased).toLocaleString('en-US', {
        minimumFractionDigits: o.decimals, maximumFractionDigits: o.decimals
      }) + o.suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ----------------------------------------------------------- area hover */
  function bindHover(svg) {
    if (svg.dataset.hoverBound) return;
    svg.dataset.hoverBound = '1';

    let points;
    try { points = JSON.parse(svg.dataset.points || '[]'); } catch (e) { return; }
    if (!points.length) return;

    const suffix = svg.dataset.suffix || '';
    const g    = svg.querySelector('.chart-hover');
    const line = svg.querySelector('.chart-hover__line');
    const dot  = svg.querySelector('.chart-hover__dot');
    const chip = svg.querySelector('.chart-hover__chip');
    const val  = svg.querySelector('.chart-hover__value');
    const hit  = svg.querySelector('.chart-hit');
    if (!g || !hit) return;

    const vbW = svg.viewBox.baseVal.width;

    function move(e) {
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * vbW;
      let best = points[0];
      points.forEach(p => { if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p; });

      line.setAttribute('x1', best.x);
      line.setAttribute('x2', best.x);
      dot.setAttribute('cx', best.x);
      dot.setAttribute('cy', best.y);
      chip.setAttribute('transform', `translate(${best.x} ${best.y})`);
      val.textContent = best.v + suffix;
      g.setAttribute('opacity', '1');
    }

    hit.addEventListener('pointermove', move);
    hit.addEventListener('pointerenter', move);
    hit.addEventListener('pointerleave', () => g.setAttribute('opacity', '0'));
  }


  /* Renders an area chart sized to its host in real pixels, and re-renders on
     resize. Scaling a fixed viewBox down to a phone shrinks the axis type with
     it — at 900 units wide inside a 300px box, 12px labels land at 4px. */
  function areaResponsive(host, values, opts) {
    if (!host) return;
    const draw = () => {
      const w = Math.max(240, Math.round(host.clientWidth || 900));
      const narrow = w < 560;
      host.innerHTML = area(values, Object.assign({}, opts, {
        w: w,
        h: Math.round(w * (narrow ? 0.82 : 0.49)),
        padL: narrow ? 40 : 56
      }));
      animate(host);
    };
    draw();
    host._redraw = draw;
    registerResize();
  }

  let resizeHooked = false;
  let resizeTimer = 0;
  function registerResize() {
    if (resizeHooked) return;
    resizeHooked = true;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.querySelectorAll('[data-chart-host]').forEach(h => h._redraw && h._redraw());
      }, 180);
    });
  }

  const DRAWABLE = '.chart, .chart-bars, .chart-donut, .chart-split, .chart-form, .chart-legend';

  /* Flips every chart inside `root` from its zero state to its real values.
     The double rAF lets the browser paint the zero state first so the
     transition actually runs — but rAF never fires while the document is
     hidden, so a timeout backs it up. Whichever lands first wins; adding the
     class twice is harmless. */
  function animate(root) {
    const scope = root || document;
    const draw = () => {
      scope.querySelectorAll(DRAWABLE).forEach(el => el.classList.add('is-drawn'));
      scope.querySelectorAll('.chart--area').forEach(bindHover);
    };
    requestAnimationFrame(() => requestAnimationFrame(draw));
    setTimeout(draw, 120);
  }

  return { area, areaResponsive, bars, donut, split, sparkline, form, countUp, animate };
})();
