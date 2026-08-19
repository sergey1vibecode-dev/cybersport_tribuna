/* WebGL energy-flow background.
   Grown out of the standalone shader.html export, with three additions the
   hero needs: a smoothed value-noise field (the original hash produced harsh
   static), an accent colour the carousel lerps per slide, and a pulse uniform
   fired on every slide change. Falls back to a CSS gradient if WebGL is out. */

window.ApexShader = (function () {
  'use strict';

  const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform vec3  u_accent;
uniform float u_pulse;

varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Smoothed value noise — the flowing-energy look the design system asks for.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv    = v_uv;
  vec2 mouse = u_mouse / u_resolution;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  vec3 colorBg     = vec3(0.043, 0.051, 0.071);   // #0B0D12
  vec3 colorAccent = u_accent;

  // Layered advection — each octave drifts at its own rate.
  float flow = 0.0;
  float amp  = 1.0;
  float norm = 0.0;
  for (int i = 1; i < 6; i++) {
    float fi = float(i);
    vec2 p = uv;
    p.x += sin(uv.y * 3.0 + u_time * 0.20 * fi) * 0.12;
    p.y += cos(uv.x * 2.0 + u_time * 0.13 * fi) * 0.12;
    flow += noise(p * (4.0 * fi)) * amp;
    norm += amp;
    amp  *= 0.55;
  }
  flow /= norm;

  // Vertical energy bias: brighter toward the lower half, like stage haze.
  flow *= 0.55 + 0.75 * smoothstep(0.0, 0.85, uv.y);

  // Pointer glow, aspect-corrected so it stays circular on wide screens.
  vec2 d = (uv - mouse) * vec2(aspect, 1.0);
  float dist = length(d);
  float mouseGlow = smoothstep(0.42, 0.0, dist) * 0.45;

  // Slide-change shockwave.
  float wave = 0.0;
  if (u_pulse > 0.001) {
    float r = (1.0 - u_pulse) * 1.15;
    wave = smoothstep(0.14, 0.0, abs(dist - r)) * u_pulse * 0.55;
  }

  vec3 col = mix(colorBg, colorAccent * 0.30, flow);
  col += colorAccent * mouseGlow;
  col += colorAccent * wave;

  // Tactical grid overlay.
  vec2 grid = fract(uv * vec2(40.0 * aspect / 1.777, 40.0));
  float gridLine = smoothstep(0.02, 0.0, grid.x) + smoothstep(0.02, 0.0, grid.y);
  col += vec3(0.10, 0.10, 0.15) * gridLine * 0.22;

  // Vignette so hero copy always has contrast to sit on.
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5) * 1.6);
  col *= 0.45 + 0.55 * vig;

  gl_FragColor = vec4(col, 1.0);
}`;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[ApexShader]', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  /* Returns a handle with setAccent()/pulse()/destroy(), or null on failure. */
  function mount(canvas) {
    if (!canvas) return null;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
            || canvas.getContext('experimental-webgl');
    if (!gl) {
      canvas.parentElement && canvas.parentElement.classList.add('shader-fallback');
      return null;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[ApexShader]', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime   = gl.getUniformLocation(prog, 'u_time');
    const uRes    = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
    const uAccent = gl.getUniformLocation(prog, 'u_accent');
    const uPulse  = gl.getUniformLocation(prog, 'u_pulse');

    // Cap the drawing buffer — a full-res 5K hero costs frames for no gain.
    const DPR_CAP = 1.5;

    function syncSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round((canvas.clientWidth  || 1280) * dpr));
      const h = Math.max(1, Math.round((canvas.clientHeight || 720)  * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(syncSize).observe(canvas);
    syncSize();

    const mouse  = { x: canvas.width / 2, y: canvas.height / 2 };
    const accent = { cur: [0.659, 0.333, 0.969], target: [0.659, 0.333, 0.969] };
    let pulse = 0;
    let running = true;
    let raf = 0;

    function onPointer(e) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      mouse.x = nx * canvas.width;
      mouse.y = ny * canvas.height;
    }
    window.addEventListener('mousemove', onPointer, { passive: true });

    // Idle in the background rather than burning GPU on a hidden tab.
    function onVisibility() { running = !document.hidden; if (running) raf = requestAnimationFrame(render); }
    document.addEventListener('visibilitychange', onVisibility);

    function render(t) {
      if (!running) return;
      if (typeof ResizeObserver === 'undefined') syncSize();

      for (let i = 0; i < 3; i++) {
        accent.cur[i] += (accent.target[i] - accent.cur[i]) * 0.045;
      }
      pulse *= 0.955;
      if (pulse < 0.002) pulse = 0;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform3f(uAccent, accent.cur[0], accent.cur[1], accent.cur[2]);
      gl.uniform1f(uPulse, pulse);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return {
      setAccent(rgb) { if (rgb && rgb.length === 3) accent.target = rgb.slice(); },
      pulse() { pulse = 1; },
      destroy() {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onPointer);
        document.removeEventListener('visibilitychange', onVisibility);
      }
    };
  }

  return { mount };
})();
