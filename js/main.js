import { W, H, TAU, INK, YELLOW, PINK, IMPACT, MONO, UI, clamp, lerp, sm, E, hash, rr, fillStroke, text, memeText, card, wrapLines } from './util.js';
import { BPM, BEAT0, DURATION, SECTIONS, LYRICS, sectionAt, lineAt, lineEnd } from './timeline.js';
import { drawStage, camera } from './scenes.js';
import { cues } from './cues-a.js';
import './cues-b.js';
import { sofa } from './art.js';

const BEAT = 60 / BPM;
const _consoleError = console.error.bind(console);
console.error = (...a) => {
  (window.__errs ||= []).push(a.map((x) => (x && x.stack) || String(x)).join(' '));
  _consoleError(...a);
};
const $ = (id) => document.getElementById(id);
const audio = $('song');
const canvas = $('c');
const ctx = canvas.getContext('2d');
const sceneCanvas = document.createElement('canvas');
const sctx = sceneCanvas.getContext('2d');
const tmpCanvas = document.createElement('canvas');
const tctx = tmpCanvas.getContext('2d');

let scale = 1;
let started = false;
let ended = false;
let analyser = null;
let freq = null;
const errs = new Set();

// ---------------------------------------------------------------------------
// Sizing
// ---------------------------------------------------------------------------
function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = Math.round(rect.width * dpr);
  if (w > 1920) w = 1920;
  const h = Math.round((w * 9) / 16);
  for (const c of [canvas, sceneCanvas, tmpCanvas]) {
    c.width = w;
    c.height = h;
  }
  scale = w / W;
}
window.addEventListener('resize', resize);

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------
function initAnalyser() {
  if (analyser) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();
    const src = ac.createMediaElementSource(audio);
    analyser = ac.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.6;
    src.connect(analyser);
    analyser.connect(ac.destination);
    freq = new Uint8Array(analyser.frequencyBinCount);
    audio._ac = ac;
  } catch (e) {
    console.warn('Analyser unavailable, falling back to the beat grid', e);
    analyser = null;
  }
}

let estT = 0;
let lastAudioT = -1;
let lastPerf = 0;
function clockTime(now) {
  const a = audio.currentTime;
  if (audio.paused) {
    lastAudioT = a;
    estT = a;
    return a;
  }
  if (a !== lastAudioT) {
    lastAudioT = a;
    lastPerf = now;
    estT = a;
  } else {
    estT = lastAudioT + ((now - lastPerf) / 1000) * audio.playbackRate;
  }
  return Math.min(estT, a + 0.1);
}

let prevBass = 0;
function audioBands() {
  if (!analyser || audio.paused) return { bass: 0, mid: 0, high: 0, live: false, bars: null };
  analyser.getByteFrequencyData(freq);
  const avg = (a, b) => {
    let s = 0;
    for (let i = a; i < b; i++) s += freq[i];
    return s / ((b - a) * 255);
  };
  const bass = avg(1, 5);
  const mid = avg(5, 40);
  const high = avg(40, 120);
  const bars = [];
  for (let i = 0; i < 8; i++) bars.push(avg(1 + i * 6, 7 + i * 6));
  return { bass, mid, high, live: true, bars };
}

// ---------------------------------------------------------------------------
// Frame
// ---------------------------------------------------------------------------
function makeFrame(t, dt) {
  const sec = sectionAt(t);
  const beat = (t - BEAT0) / BEAT;
  const bf = ((beat % 1) + 1) % 1;
  const a = audioBands();
  let kick = Math.exp(-bf * 5.5);
  if (t < BEAT0 - 0.05) kick = 0;
  if (a.live) kick = clamp(kick * (0.55 + 0.9 * a.bass));
  return { t, dt, beat, bf, bar: beat / 4, kick, bass: a.bass, mid: a.mid, high: a.high, bars: a.bars, sec, secT: t - sec.t0, secP: (t - sec.t0) / (sec.t1 - sec.t0) };
}

function drawWorld(g, f) {
  g.setTransform(scale, 0, 0, scale, 0, 0);
  g.clearRect(0, 0, W, H);
  g.save();
  const cam = camera(f);
  g.translate(W / 2 + cam.sx, H / 2 + cam.sy);
  if (cam.rot) g.rotate(cam.rot);
  g.scale(cam.z, cam.z);
  g.translate(-cam.cx, -cam.cy);
  try {
    drawStage(g, f);
  } catch (e) {
    if (!errs.has('stage' + f.sec.id)) {
      errs.add('stage' + f.sec.id);
      console.error('stage error', f.sec.id, e);
    }
  }
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    if (f.t < c.t0 || f.t >= c.t1) continue;
    g.save();
    try {
      c.fn(g, f, { lt: f.t - c.t0, d: c.t1 - c.t0, p: (f.t - c.t0) / (c.t1 - c.t0), t0: c.t0 });
    } catch (e) {
      if (!errs.has(i)) {
        errs.add(i);
        console.error('cue error', c.t0, e);
      }
    }
    g.restore();
  }
  g.restore();
}

function rgbSplit(px) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for (const [col, dx] of [['#ff0000', -px], ['#00ff00', 0], ['#0000ff', px]]) {
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalCompositeOperation = 'source-over';
    tctx.drawImage(sceneCanvas, 0, 0);
    tctx.globalCompositeOperation = 'multiply';
    tctx.fillStyle = col;
    tctx.fillRect(0, 0, w, h);
    ctx.drawImage(tmpCanvas, dx, 0);
  }
  ctx.globalCompositeOperation = 'source-over';
}

// scanline pattern
const scan = document.createElement('canvas');
scan.width = 4;
scan.height = 4;
{
  const s = scan.getContext('2d');
  s.fillStyle = 'rgba(0,0,0,0.10)';
  s.fillRect(0, 0, 4, 1);
}
let scanPattern = null;

function drawCaption(g, f) {
  const { t } = f;
  const i = lineAt(t);
  if (i < 0) return;
  const [t0, str] = LYRICS[i];
  const end = lineEnd(i);
  if (t > end + 0.4) return;
  const age = t - t0;
  const alpha = 1 - sm(end, end + 0.4, t);
  const upper = str.toUpperCase();
  const size = 54;
  g.save();
  g.font = `${size}px ${IMPACT}`;
  const lines = wrapLines(g, upper, 1120);
  const pop = lerp(1.18, 1, E.outCubic(clamp(age / 0.14)));
  const total = upper.replace(/ /g, '').length;
  const prog = clamp(age / Math.max(0.4, end - t0 - 0.15)) * total;
  let consumed = 0;
  const lh = size * 1.02;
  const baseY = H - 52 - (lines.length - 1) * lh;
  g.translate(W / 2, 0);
  g.globalAlpha = alpha;
  g.lineJoin = 'round';
  g.miterLimit = 2;
  lines.forEach((line, li) => {
    const y = baseY + li * lh;
    const words = line.split(' ');
    const widths = words.map((w) => g.measureText(w).width);
    const space = g.measureText(' ').width;
    const totalW = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
    let x = -totalW / 2;
    g.save();
    g.translate(0, y);
    g.scale(pop, pop);
    g.translate(0, -y);
    words.forEach((w, wi) => {
      const n = w.length;
      const sung = clamp((prog - consumed) / n);
      consumed += n;
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.lineWidth = size * 0.17;
      g.strokeStyle = '#000';
      g.strokeText(w, x, y);
      g.fillStyle = '#fff';
      g.fillText(w, x, y);
      if (sung > 0) {
        g.save();
        g.beginPath();
        g.rect(x - 4, y - size, widths[wi] * sung + 4, size * 2);
        g.clip();
        g.fillStyle = YELLOW;
        g.fillText(w, x, y);
        g.restore();
      }
      x += widths[wi] + space;
    });
    g.restore();
  });
  g.restore();
}

const SOFA_MOOD = { v1: 'shock', c1: 'proud', drop1: 'proud', v2: 'guilty', c2: 'proud', brk: 'sleep', v3: 'smug' };
function drawHud(g, f) {
  const { t, sec, kick } = f;
  // now playing + equalizer
  g.save();
  const x = 26;
  const y = 24;
  g.globalAlpha = 0.92;
  rr(g, x, y, 300, 46, 12);
  g.fillStyle = 'rgba(10,0,30,0.62)';
  g.fill();
  const bars = f.bars || Array.from({ length: 8 }, (_, i) => 0.25 + 0.5 * Math.abs(Math.sin(f.beat * 0.8 + i)) * (0.4 + kick));
  bars.forEach((b, i) => {
    const h = 6 + clamp(b * 1.6) * 28;
    g.fillStyle = `hsl(${320 + i * 14},90%,65%)`;
    g.fillRect(x + 14 + i * 9, y + 38 - h, 6, h);
  });
  text(g, 'KISS ME, MISS MY STOP', x + 96, y + 18, 15, { font: MONO, fill: '#fff', weight: '900', align: 'left' });
  text(g, `${sec.label.toUpperCase()}  \u2022  ${BPM.toFixed(0)} BPM`, x + 96, y + 35, 12, { font: MONO, fill: '#c9b8ff', weight: '700', align: 'left' });
  g.restore();

  // sofa cam
  const mood = SOFA_MOOD[sec.id];
  if (mood) {
    g.save();
    const px = W - 198;
    const py = 18;
    const pw = 178;
    const ph = 108;
    rr(g, px, py, pw, ph, 12);
    g.fillStyle = '#12082a';
    g.fill();
    g.save();
    rr(g, px, py, pw, ph, 12);
    g.clip();
    const grd = g.createLinearGradient(0, py, 0, py + ph);
    grd.addColorStop(0, '#2a1458');
    grd.addColorStop(1, '#4a2a85');
    g.fillStyle = grd;
    g.fillRect(px, py, pw, ph);
    sofa(g, { x: px + pw / 2, y: py + 70, s: 0.29, mood, t, sq: kick * 0.5, look: Math.sin(t * 0.7) });
    g.fillStyle = 'rgba(255,255,255,0.05)';
    for (let yy = py; yy < py + ph; yy += 4) g.fillRect(px, yy, pw, 1);
    g.restore();
    rr(g, px, py, pw, ph, 12);
    g.strokeStyle = '#fff';
    g.lineWidth = 3;
    g.stroke();
    if (Math.floor(t * 1.5) % 2 === 0) {
      g.beginPath();
      g.arc(px + 18, py + 18, 5, 0, TAU);
      g.fillStyle = '#ff3b3b';
      g.fill();
    }
    text(g, 'SOFA CAM', px + 30, py + 19, 12, { font: MONO, fill: '#fff', weight: '900', align: 'left' });
    g.restore();
  }
}

function render(t, now) {
  const f = makeFrame(t, 0);
  const isDrop = f.sec.id.startsWith('drop');
  const split = isDrop ? Math.max(0, f.kick - 0.2) * 7 * scale : 0;
  if (split > 0.5) {
    drawWorld(sctx, f);
    rgbSplit(split);
  } else {
    drawWorld(ctx, f);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  // section punch flash
  if (f.secT < 0.4 && f.sec.id !== 'intro') {
    const strength = isDrop ? 0.85 : f.sec.id === 'bridge' || f.sec.id === 'brk' ? 0.15 : 0.35;
    ctx.fillStyle = `rgba(255,255,255,${(1 - f.secT / 0.4) * strength})`;
    ctx.fillRect(0, 0, W, H);
  }
  // soft vignette + caption band
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.0);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  const band = ctx.createLinearGradient(0, H - 170, 0, H);
  band.addColorStop(0, 'rgba(0,0,0,0)');
  band.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = band;
  ctx.fillRect(0, H - 170, W, 170);
  if (!scanPattern) scanPattern = ctx.createPattern(scan, 'repeat');
  if (isDrop) {
    ctx.fillStyle = scanPattern;
    ctx.fillRect(0, 0, W, H);
  }
  drawCaption(ctx, f);
  if (f.sec.id !== 'credits') drawHud(ctx, f);
}

let lastNow = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const t = clockTime(now);
  render(t, now);
  lastNow = now;
  updateUi(t);
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------
const splash = $('splash');
const playBtn = $('play');
const seek = $('seek');
const timeEl = $('time');
const endEl = $('ended');
const bar = $('bar');
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
let seeking = false;
let idleTimer = 0;

function updateUi(t) {
  if (!seeking) seek.value = String((t / DURATION) * 1000);
  timeEl.textContent = `${fmt(t)} / ${fmt(DURATION)}`;
  playBtn.textContent = audio.paused ? '\u25B6' : '\u275A\u275A';
}

async function start() {
  if (!started) {
    started = true;
    initAnalyser();
  }
  if (audio._ac && audio._ac.state === 'suspended') await audio._ac.resume();
  splash.classList.add('hide');
  endEl.classList.remove('show');
  if (audio.ended || audio.currentTime >= DURATION - 0.3) audio.currentTime = 0;
  try {
    await audio.play();
  } catch (e) {
    console.warn(e);
  }
}
function toggle() {
  if (audio.paused) start();
  else audio.pause();
}
function seekTo(t) {
  audio.currentTime = clamp(t, 0, DURATION - 0.05);
  lastAudioT = -1;
}

$('start').addEventListener('click', start);
playBtn.addEventListener('click', toggle);
$('replay').addEventListener('click', () => {
  seekTo(0);
  start();
});
canvas.addEventListener('click', () => {
  if (started) toggle();
});
seek.addEventListener('input', () => {
  seeking = true;
  seekTo((Number(seek.value) / 1000) * DURATION);
});
seek.addEventListener('change', () => {
  seeking = false;
});
$('mute').addEventListener('click', () => {
  audio.muted = !audio.muted;
  $('mute').textContent = audio.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
});
$('full').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $('stage').requestFullscreen?.();
});
audio.addEventListener('ended', () => {
  ended = true;
  endEl.classList.add('show');
});
audio.addEventListener('play', () => {
  ended = false;
  endEl.classList.remove('show');
});
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    toggle();
  } else if (e.key === 'f') $('full').click();
  else if (e.key === 'm') $('mute').click();
  else if (e.key === 'ArrowRight') seekTo(audio.currentTime + 5);
  else if (e.key === 'ArrowLeft') seekTo(audio.currentTime - 5);
});
// auto-hide the control bar while playing
function wake() {
  bar.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!audio.paused) bar.classList.add('idle');
  }, 2500);
}
window.addEventListener('mousemove', wake);
window.addEventListener('touchstart', wake);

// dev helper: ?t=47.5 jumps there (paused) so any moment can be inspected
const q = new URLSearchParams(location.search);
const jump = () => {
  if (q.has('t')) {
    splash.classList.add('hide');
    audio.currentTime = Number(q.get('t'));
  }
};
if (audio.readyState >= 1) jump();
else audio.addEventListener('loadedmetadata', jump, { once: true });
window.__mv = { audio, seekTo, start };

resize();
requestAnimationFrame(frame);
