// Gags, part A: intro, verse 1, chorus 1, drop 1.
import {
  W, H, TAU, INK, PINK, TEAL, PURPLE, YELLOW, CYAN, RED, E, UI, MONO, MARKER, IMPACT, clamp, lerp, sm, hash, hsl,
  text, memeText, emoji, rr, fillStroke, card, bubble, stamp, life, heart, star,
} from './util.js';
import { blob, sofa, phone, TANIA, GUY } from './art.js';
import { BEAT0, BPM } from './timeline.js';

export const cues = [];
export const cue = (t0, t1, fn) => cues.push({ t0, t1, fn });
export const at = (ctx, x, y, s, rot, fn) => {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.scale(s, s);
  fn();
  ctx.restore();
};
export const sticker = (t0, t1, ch, x, y, size, { rot = 0, spin = 0, wobble = 0, bob = 0, from = null } = {}) =>
  cue(t0, t1, (ctx, f, c) => {
    const L = life(c.lt, c.d);
    let px = x;
    let py = y;
    if (from) {
      const k = E.outCubic(clamp(c.lt / 0.45));
      px = lerp(from[0], x, k);
      py = lerp(from[1], y, k);
    }
    py += Math.sin(f.t * 4 + x) * bob;
    emoji(ctx, ch, px, py, size * L.s, { rot: rot + c.lt * spin + Math.sin(c.lt * 11) * wobble, alpha: L.a });
  });
export const bigText = (t0, t1, str, x, y, size, { fill = '#fff', rot = 0, from = 2.2, maxW = 1150, dur = 0.18 } = {}) =>
  cue(t0, t1, (ctx, f, c) => {
    const L = life(c.lt, c.d, 0.12, 0.2);
    const sc = lerp(from, 1, E.outCubic(clamp(c.lt / dur)));
    memeText(ctx, str, x, y, size, { fill, rot, sx: sc, sy: sc, maxW, alpha: L.a });
  });
export const barStart = (k) => BEAT0 + k * ((60 / BPM) * 4);

// ---------------------------------------------------------------------------
// INTRO
// ---------------------------------------------------------------------------
cue(0.3, 4.3, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.35, 0.5);
  memeText(ctx, 'A VERY SERIOUS', W / 2, 140, 66, { sx: L.s, sy: L.s, alpha: L.a });
  memeText(ctx, 'MUSIC VIDEO', W / 2, 214, 96, { fill: YELLOW, rot: -0.03, sx: L.s, sy: L.s, alpha: L.a });
  if (Math.floor(f.t * 2) % 2) text(ctx, '\u25B6 REC', 110, 56, 30, { font: MONO, fill: RED, weight: '900', align: 'left' });
});
cue(4.9, 8.9, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.4, 0.4);
  at(ctx, 240, 395, L.s, -0.04, () => {
    card(ctx, -125, -34, 250, 68, { fill: PINK, r: 16 });
    text(ctx, 'TANIA TINDER', 0, -4, 28, { font: IMPACT, weight: '400', fill: '#fff' });
    text(ctx, '(her username)', 0, 21, 15, { fill: '#fff', weight: '600' });
  });
  at(ctx, 1040, 395, L.s, 0.04, () => {
    card(ctx, -125, -34, 250, 68, { fill: TEAL, r: 16 });
    text(ctx, 'ORGY GUY', 0, -4, 28, { font: IMPACT, weight: '400', fill: INK });
    text(ctx, '(his username)', 0, 21, 15, { fill: INK, weight: '600' });
  });
});
cue(8.8, 11.9, (ctx, f, c) => {
  const k = c.lt / c.d;
  const x = lerp(-200, W + 200, E.inOut(k));
  emoji(ctx, '\uD83D\uDE86', x, 120, 150, { rot: 0 });
  memeText(ctx, 'CHOO CHOO', x - 270, 125, 54, { fill: YELLOW, rot: -0.05, alpha: sm(0, 0.15, k) });
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 6; i++) ctx.fillRect(x - 170 - i * 60, 90 + i * 11, 80, 4);
});
bigText(barStart(6), barStart(7), 'KISS ME,', W / 2, 150, 150, { fill: '#fff', rot: -0.04 });
cue(barStart(7), 15.7, (ctx, f, c) => {
  memeText(ctx, 'KISS ME,', W / 2, 150, 150, { fill: '#fff', rot: -0.04 });
  const sc = lerp(2.2, 1, E.outCubic(clamp(c.lt / 0.18)));
  memeText(ctx, 'MISS MY STOP', W / 2, 290, 150, { fill: YELLOW, rot: 0.03, sx: sc, sy: sc, maxW: 1100 });
  text(ctx, '124 BPM  \u2022  A LOVE STORY (SORT OF)', W / 2, 372, 30, { font: MONO, fill: '#fff', weight: '800', alpha: sm(0.8, 1.2, c.lt) });
});

// ---------------------------------------------------------------------------
// VERSE 1: the phone
// ---------------------------------------------------------------------------
const phoneScreens = [
  { t: 15.6, draw: scrReserve },
  { t: 18.6, draw: scrContact },
  { t: 20.7, draw: scrResearch },
  { t: 22.4, draw: scrInsta },
  { t: 24.9, draw: scrTinderT },
  { t: 26.3, draw: scrTinderG },
  { t: 28.2, draw: scrReviews },
  { t: 29.8, draw: scrIRL },
];

function scrReserve(s, lt) {
  s.fillStyle = '#fff8ee';
  s.fillRect(0, 0, 284, 552);
  s.fillStyle = '#e63946';
  s.fillRect(0, 0, 284, 74);
  text(s, 'TableBook', 142, 44, 28, { font: UI, fill: '#fff', weight: '900' });
  emoji(s, '\uD83C\uDF7D\uFE0F', 142, 190 + Math.sin(lt * 5) * 6, 112);
  text(s, 'TABLE FOR TWO', 142, 285, 30, { font: IMPACT, fill: INK, weight: '400' });
  text(s, 'SAT \u00B7 7:30 PM \u00B7 WINDOW SEAT', 142, 320, 16, { fill: '#777', weight: '700' });
  const k = E.outBack(clamp((lt - 0.4) / 0.4));
  at(s, 142, 395, k, 0, () => {
    rr(s, -105, -32, 210, 64, 32);
    fillStroke(s, '#22c55e', 5);
    text(s, 'CONFIRMED \u2713', 0, 2, 26, { fill: '#fff', weight: '900' });
  });
  text(s, 'name on booking:', 142, 460, 15, { fill: '#999', weight: '600' });
  text(s, 'THEIR REAL NAME', 142, 484, 22, { fill: RED, weight: '900' });
}
function scrContact(s, lt) {
  s.fillStyle = '#eef2ff';
  s.fillRect(0, 0, 284, 552);
  s.fillStyle = '#2563eb';
  s.fillRect(0, 0, 284, 74);
  text(s, 'Contacts', 142, 44, 28, { fill: '#fff', weight: '900' });
  emoji(s, '\uD83D\uDD75\uFE0F', 142, 150, 90);
  text(s, 'FULL NAME', 142, 235, 16, { fill: '#666', weight: '800' });
  text(s, 'Orgy Guy', 142, 275, 34, { font: IMPACT, fill: INK, weight: '400' });
  const cover = 1 - E.outCubic(clamp((lt - 0.6) / 0.5));
  text(s, 'Definitely', 142, 330, 34, { font: IMPACT, fill: RED, weight: '400' });
  text(s, 'Not Orgy Guy', 142, 372, 34, { font: IMPACT, fill: RED, weight: '400' });
  s.fillStyle = '#111';
  if (cover > 0.02) s.fillRect(30, 305, 224 * cover, 90);
  s.beginPath();
  s.moveTo(70, 276);
  s.lineTo(214 * sm(0.5, 0.8, lt) + 70, 276);
  s.strokeStyle = RED;
  s.lineWidth = 5;
  s.stroke();
  emoji(s, '\uD83D\uDCF1', 142, 470, 56, { rot: Math.sin(lt * 14) * 0.15 });
}
function scrResearch(s, lt) {
  s.fillStyle = '#f0fdf4';
  s.fillRect(0, 0, 284, 552);
  s.fillStyle = '#16a34a';
  s.fillRect(0, 0, 284, 74);
  text(s, 'Browser', 142, 44, 28, { fill: '#fff', weight: '900' });
  const n = Math.min(47, Math.floor(lt * 36));
  for (let i = 0; i < n; i++) {
    const cx = 22 + (i % 7) * 37;
    const cy = 100 + Math.floor(i / 7) * 28;
    rr(s, cx, cy, 32, 22, 6);
    fillStroke(s, hsl(i * 41, 70, 78), 3);
  }
  text(s, `${n} TABS OPEN`, 142, 330, 32, { font: IMPACT, fill: INK, weight: '400' });
  rr(s, 20, 370, 244, 44, 22);
  fillStroke(s, '#fff', 4);
  text(s, '\uD83D\uDD0E is he a real person', 142, 392, 15, { fill: '#555', weight: '700' });
  text(s, 'RESEARCH.docx', 142, 450, 22, { font: MARKER, fill: '#16a34a', weight: '700' });
  text(s, '"has a face (confirmed)"', 142, 482, 16, { font: MARKER, fill: '#555', weight: '600' });
}
function scrInsta(s, lt) {
  const g = s.createLinearGradient(0, 0, 284, 74);
  g.addColorStop(0, '#feda75');
  g.addColorStop(0.5, '#d62976');
  g.addColorStop(1, '#4f5bd5');
  s.fillStyle = '#fff';
  s.fillRect(0, 0, 284, 552);
  s.fillStyle = g;
  s.fillRect(0, 0, 284, 74);
  text(s, 'Instagram', 142, 44, 28, { fill: '#fff', weight: '900' });
  s.beginPath();
  s.arc(52, 126, 30, 0, TAU);
  fillStroke(s, '#ddd', 4);
  text(s, '?', 52, 128, 32, { fill: '#888', weight: '900' });
  ['0 posts', '0 followers', '0 following'].forEach((l, i) => {
    const [a, b] = l.split(' ');
    text(s, a, 126 + i * 60, 114, 22, { fill: INK, weight: '900' });
    text(s, b, 126 + i * 60, 138, 11, { fill: '#666', weight: '700' });
  });
  text(s, '\uD83E\uDEB4 nothing to see here', 20, 185, 17, { fill: INK, weight: '700', align: 'left' });
  for (let i = 0; i < 9; i++) {
    const x = 10 + (i % 3) * 89;
    const y = 215 + Math.floor(i / 3) * 89;
    s.fillStyle = '#eee';
    s.fillRect(x, y, 85, 85);
    if (i === 4) emoji(s, '\uD83E\uDEB4', x + 42, y + 44, 48, { rot: Math.sin(lt * 3) * 0.15 });
  }
  const k = E.outBack(clamp((lt - 0.8) / 0.4));
  if (k > 0) stamp(s, 'NOTHING GIVEN AWAY', 142, 300, 28, { rot: -0.2, alpha: 0.95 });
}
function tinderBase(s) {
  const g = s.createLinearGradient(0, 0, 0, 552);
  g.addColorStop(0, '#ff7854');
  g.addColorStop(1, '#fd267d');
  s.fillStyle = g;
  s.fillRect(0, 0, 284, 552);
  text(s, '\uD83D\uDD25 tinder-ish', 142, 40, 24, { fill: '#fff', weight: '900' });
}
function scrTinderT(s, lt) {
  tinderBase(s);
  const sw = E.inCubic(clamp((lt - 1.1) / 0.3));
  at(s, 142 + sw * 330, 285 + sw * 40, 1, sw * 0.5, () => {
    card(s, -118, -180, 236, 360, { fill: '#fff', r: 22, lw: 5, shadow: 0 });
    s.save();
    rr(s, -112, -174, 224, 250, 18);
    s.clip();
    s.fillStyle = '#ffd1e6';
    s.fillRect(-112, -174, 224, 250);
    blob(s, { x: 0, y: -50, s: 1.3, color: TANIA, expr: 'grin', t: lt, acc: ['bat'] });
    s.restore();
    text(s, 'Tania Tinder', 0, 105, 24, { fill: INK, weight: '900' });
    text(s, 'likes: trains, bad decisions', 0, 135, 14, { fill: '#666', weight: '700' });
    text(s, 'distance: 1 stop away', 0, 156, 13, { fill: '#999', weight: '700' });
  });
  if (lt > 0.9) stamp(s, 'LIKE', 70, 120, 38, { rot: -0.3, color: '#22c55e', alpha: clamp((lt - 0.9) * 5) });
}
function scrTinderG(s, lt) {
  tinderBase(s);
  const match = E.outBack(clamp((lt - 0.8) / 0.4));
  at(s, 142, 285, 1, 0, () => {
    card(s, -118, -180, 236, 360, { fill: '#fff', r: 22, lw: 5, shadow: 0 });
    s.save();
    rr(s, -112, -174, 224, 250, 18);
    s.clip();
    s.fillStyle = '#c7fff0';
    s.fillRect(-112, -174, 224, 250);
    blob(s, { x: 0, y: -50, s: 1.3, color: GUY, expr: 'smug', t: lt, acc: ['horns', 'leaf'] });
    s.restore();
    text(s, 'Orgy Guy', 0, 105, 26, { fill: INK, weight: '900' });
    text(s, '"just here for the snacks"', 0, 135, 14, { fill: '#666', weight: '700' });
  });
  if (match > 0) {
    s.fillStyle = `rgba(20,0,40,${0.78 * clamp(match)})`;
    s.fillRect(0, 0, 284, 552);
    at(s, 142, 250, match, -0.08, () => {
      text(s, "IT'S A", 0, -50, 40, { font: IMPACT, fill: '#fff', weight: '400' });
      text(s, 'MATCH!', 0, 10, 72, { font: IMPACT, fill: '#4dffb0', weight: '400' });
    });
    blob(s, { x: 60 + (1 - match) * -140, y: 400, s: 0.5, color: TANIA, expr: 'grin', t: lt, acc: ['bat'] });
    blob(s, { x: 224 + (1 - match) * 140, y: 400, s: 0.5, color: GUY, expr: 'grin', t: lt, flip: true, acc: ['horns'] });
  }
}
function scrReviews(s, lt) {
  s.fillStyle = '#fffbea';
  s.fillRect(0, 0, 284, 552);
  s.fillStyle = '#f59e0b';
  s.fillRect(0, 0, 284, 74);
  text(s, 'Reviews', 142, 44, 28, { fill: '#fff', weight: '900' });
  for (let i = 0; i < 5; i++) {
    const k = E.outBack(clamp((lt - i * 0.12) / 0.3));
    star(s, 40 + i * 51, 130, 22 * k, 5);
    s.fillStyle = i < 4 ? '#f59e0b' : '#ddd';
    s.fill();
    s.strokeStyle = INK;
    s.lineWidth = 3;
    s.stroke();
  }
  text(s, '4.2', 142, 205, 60, { font: IMPACT, fill: INK, weight: '400' });
  text(s, 'QUITE A REPUTATION', 142, 255, 20, { fill: '#b45309', weight: '900' });
  const rv = [['\u201CWould kiss again\u201D', '- a train'], ['\u201CLeft before the end\u201D', '- my stop'], ['\u201C10/10 distraction\u201D', '- a conductor']];
  rv.forEach(([a, b], i) => {
    const k = E.outCubic(clamp((lt - 0.5 - i * 0.25) / 0.3));
    at(s, 142 + (1 - k) * 300, 320 + i * 72, 1, 0, () => {
      card(s, -122, -28, 244, 60, { fill: '#fff', r: 12, lw: 4, shadow: 4 });
      text(s, a, 0, -8, 16, { fill: INK, weight: '800' });
      text(s, b, 0, 14, 13, { fill: '#888', weight: '700' });
    });
  });
}
function scrIRL(s, lt) {
  s.fillStyle = '#0f172a';
  s.fillRect(0, 0, 284, 552);
  text(s, 'MET IN REAL LIFE:', 142, 90, 20, { font: MONO, fill: '#7dd3fc', weight: '800' });
  text(s, '0', 142, 200, 150, { font: IMPACT, fill: '#fff', weight: '400', rot: Math.sin(lt * 9) * 0.03 });
  text(s, 'TIMES', 142, 290, 40, { font: IMPACT, fill: '#fb7185', weight: '400' });
  rr(s, 30, 340, 224, 26, 13);
  fillStroke(s, '#1e293b', 4, '#475569');
  text(s, '0%', 142, 354, 16, { fill: '#fff', weight: '900' });
  emoji(s, '\uD83E\uDD37', 142, 450, 80, { rot: Math.sin(lt * 4) * 0.12 });
}

cue(15.6, 33.0, (ctx, f, c) => {
  const t = f.t;
  const enter = E.outBack(clamp(c.lt / 0.55));
  const exit = E.inCubic(clamp((t - 32.3) / 0.65));
  const px = lerp(-320, 330, enter) - exit * 760;
  let idx = 0;
  phoneScreens.forEach((p, i) => {
    if (t >= p.t) idx = i;
  });
  const cur = phoneScreens[idx];
  const prev = phoneScreens[Math.max(0, idx - 1)];
  const sk = idx === 0 ? 1 : E.outCubic(clamp((t - cur.t) / 0.22));
  phone(ctx, px, 345 + Math.sin(t * 2) * 4, 0.84, (1 - enter) * -0.6 + Math.sin(t * 1.4) * 0.025 + exit * 0.4, (s) => {
    if (sk < 1) {
      s.save();
      s.translate(-284 * sk, 0);
      prev.draw(s, t - prev.t + 3);
      s.restore();
    }
    s.save();
    s.translate(284 * (1 - sk), 0);
    cur.draw(s, t - cur.t);
    s.restore();
  });
});
cue(17.9, 19.5, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.15, 0.25);
  stamp(ctx, 'COVER BLOWN', 330, 330, 70 * L.s, { rot: -0.25, alpha: L.a });
});
cue(20.7, 22.4, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83D\uDD0D', 540, 260, 110 * L.s, { rot: Math.sin(c.lt * 6) * 0.4, alpha: L.a });
});

// VERSE 1 second half: costume chaos
cue(32.7, 35.6, (ctx, f, c) => {
  const k = c.lt / 2.4;
  const L = life(c.lt, c.d, 0.2, 0.3);
  emoji(ctx, '\uD83E\uDE73', lerp(480, 760, k), 440 - Math.sin(k * Math.PI) * 330, 100, { rot: c.lt * 9, alpha: L.a });
  emoji(ctx, '\uD83D\uDCA5', 480, 450, 120 * E.outBack(clamp(c.lt / 0.25)), { alpha: 1 - clamp((c.lt - 0.5) / 0.5) });
  stamp(ctx, 'DISASTER', 640, 170, 96 * L.s, { rot: -0.1, alpha: L.a });
});
cue(35.1, 36.3, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  bubble(ctx, 'um.', 480, 300, 480, 380, { size: 34 });
  emoji(ctx, '\uD83D\uDCDE', 700, 250, 70 * L.s);
});
cue(36.2, 39.2, (ctx, f, c) => {
  const k = clamp(c.lt / 0.7);
  for (let i = 0; i < 7; i++) {
    const x = lerp(-100, 800, E.outCubic(k)) - i * 70;
    emoji(ctx, '\uD83E\uDD87', x, 300 + Math.sin(c.lt * 8 + i) * 40 - i * 12, 44 + i * 4, { alpha: Math.max(0, 1 - i * 0.12) * (1 - clamp((c.lt - 2.2) / 0.8)), rot: Math.sin(c.lt * 10 + i) * 0.3 });
  }
  const L = life(c.lt, 3, 0.2, 0.5);
  memeText(ctx, 'BATGIRL', 640, 150, 130, { fill: '#1d1330', stroke: YELLOW, rot: -0.05, sx: L.s, sy: L.s, lw: 0.18 });
  if (c.lt > 1.4) bubble(ctx, "I'VE GOT THIS", 1010, 250, 840, 380, { size: 30 });
  if (c.lt < 0.9) emoji(ctx, '\u26A1', 800, 260, 120 * E.outBack(clamp((c.lt - 0.5) / 0.3)));
});
cue(39.2, 43.0, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.25, 0.3);
  for (let i = 0; i < 8; i++) {
    const a = c.lt * 2 + (i / 8) * TAU;
    emoji(ctx, '\u2728', 480 + Math.cos(a) * 130, 430 + Math.sin(a) * 100, 36, { alpha: L.a });
  }
  at(ctx, 480, 190, L.s, 0.04, () => {
    card(ctx, -190, -36, 380, 72, { fill: '#c7fff0', r: 18 });
    text(ctx, 'NYMPH OUTFIT: READY \uD83E\uDDDA', 0, 2, 27, { fill: INK, weight: '900' });
  });
});
cue(43.0, 46.9, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.3);
  at(ctx, 640, 170, L.s, -0.02, () => {
    card(ctx, -230, -100, 460, 200, { fill: '#fffdf2', r: 20 });
    text(ctx, '\uD83D\uDD0D DRESS CODE CHECK', 0, -66, 26, { fill: INK, weight: '900' });
    const rows = [['faun pants', '\u2717'], ['batgirl cape', '\u2717'], ['nymph wings', '\u2717']];
    rows.forEach(([a, b], i) => {
      const k = E.outBack(clamp((c.lt - 0.5 - i * 0.55) / 0.3));
      text(ctx, a, -190, -22 + i * 42, 26, { fill: INK, weight: '700', align: 'left' });
      text(ctx, b, 175, -22 + i * 42, 46 * k, { fill: RED, weight: '900' });
    });
  });
  if (c.lt > 2.2) bubble(ctx, 'no.', 800, 270, 800, 340, { size: 40 });
});

// ---------------------------------------------------------------------------
// CHORUS 1
// ---------------------------------------------------------------------------
cue(47.1, 49.0, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.1, 0.4);
  const sc = lerp(2, 1, E.outCubic(clamp(c.lt / 0.16)));
  memeText(ctx, 'KISS ME,', 640, 80, 100, { rot: -0.03, sx: sc, sy: sc, alpha: L.a });
  memeText(ctx, 'MISS MY STOP', 640, 180, 108, { fill: YELLOW, rot: 0.02, sx: sc, sy: sc, alpha: L.a, maxW: 1100 });
});
cue(47.1, 48.2, (ctx, f, c) => {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    const r = E.outCubic(c.lt / c.d) * (240 + hash(i) * 120);
    emoji(ctx, '\uD83D\uDC8B', 640 + Math.cos(a) * r, 340 + Math.sin(a) * r * 0.7, 56, { alpha: 1 - c.lt / c.d, rot: a });
  }
});
cue(48.9, 50.6, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 210, 180, L.s * 0.78, 0, () => {
    card(ctx, -100, -100, 200, 200, { fill: '#e8f9ff', r: 100 });
    ctx.save();
    ctx.rotate(c.lt * 14 + Math.sin(c.lt * 30));
    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 78);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    fillStroke(ctx, RED, 4);
    ctx.restore();
    text(ctx, 'N', 0, -88, 20, { fill: INK, weight: '900' });
  });
  stamp(ctx, 'SENSE OF DIRECTION: 0%', 420, 150, 22 * L.s, { rot: -0.08, alpha: L.a });
});
cue(50.6, 52.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  const shake = Math.sin(c.lt * 40) * 3;
  at(ctx, 640 + shake, 90 - (1 - L.s) * 200, 1, 0, () => {
    card(ctx, -300, -52, 600, 104, { fill: '#0d0618', r: 14 });
    text(ctx, 'WRONG TRAIN', 0, -8, 62, { font: IMPACT, fill: '#ffb000', weight: '400' });
    text(ctx, 'PLATFORM 9\u00BE \u2022 CANCELLED \u2022 ON FIRE (LIGHTLY)', 0, 30, 18, { font: MONO, fill: '#ffb000', weight: '800' });
  });
  emoji(ctx, '\uD83D\uDE86', lerp(W + 100, -200, E.inOut(c.lt / c.d)), 190, 100);
});
cue(52.7, 54.5, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83D\uDC49', 330 + Math.sin(c.lt * 12) * 14, 255, 110 * L.s, { alpha: L.a });
  bubble(ctx, 'THIS IS ALL\nYOUR FAULT', 250, 150, 290, 225, { size: 30 });
  emoji(ctx, '\uD83D\uDE07', 960, 190, 100 * L.s);
});
cue(54.5, 56.3, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  const secLeft = Math.max(0, 60 - c.lt * 33);
  at(ctx, 220, 140, L.s, -0.05, () => {
    card(ctx, -120, -60, 240, 120, { fill: '#0d0618', r: 16 });
    text(ctx, `00:${String(Math.floor(secLeft)).padStart(2, '0')}`, 0, -6, 66, { font: MONO, fill: '#4dffb0', weight: '900' });
    text(ctx, 'ONE MORE MINUTE', 0, 38, 16, { font: MONO, fill: '#9aa', weight: '800' });
  });
  for (let i = 0; i < 4; i++) emoji(ctx, '\uD83D\uDC8B', 640 + (i - 1.5) * 80, 220 - ((c.lt * 80 + i * 40) % 120), 50, { alpha: 0.9 });
});
cue(56.3, 58.4, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  for (let i = 0; i < 3; i++) emoji(ctx, '\u2753', 330 + i * 310, 160 + Math.sin(c.lt * 6 + i * 2) * 20, (90 + i * 14) * L.s, { rot: Math.sin(c.lt * 5 + i) * 0.3 });
  emoji(ctx, '\uD83E\uDD37', 640, 180, 100 * L.s);
  memeText(ctx, 'WHO DECIDED?!', 640, 255, 56, { sx: L.s, sy: L.s, rot: -0.03, alpha: L.a });
});
cue(58.4, 60.3, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  stamp(ctx, 'CERTIFIED SENSIBLE ADULTS', 640, 130, 56 * L.s, { rot: -0.06, color: '#16a34a', alpha: L.a });
  emoji(ctx, '\uD83E\uDDD0', 220, 210, 90 * L.s);
  emoji(ctx, '\uD83D\uDCBC', 1060, 210, 90 * L.s, { rot: Math.sin(c.lt * 6) * 0.2 });
});
cue(60.3, 62.4, (ctx, f, c) => {
  const k = c.lt / c.d;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU + c.lt * 3;
    const r = (1 - k) * 420 + 20;
    emoji(ctx, '\uD83D\uDC96', 640 + Math.cos(a) * r, 400 + Math.sin(a) * r * 0.6, 40 + k * 30, { alpha: 0.3 + k * 0.7 });
  }
  ctx.fillStyle = `rgba(255,255,255,${E.inCubic(k) * 0.9})`;
  ctx.fillRect(0, 0, W, H);
});

// DROP 1: vocal chop echo
cue(67.6, 71.0, (ctx, f, c) => {
  for (let i = 3; i >= 0; i--) {
    const k = clamp((c.lt - i * 0.22) / 0.18);
    if (k <= 0) continue;
    const sc = 1 + i * 0.28 + (1 - E.outCubic(k)) * 1.2;
    memeText(ctx, 'CLOSE TO ME', 640, 330, 112, { fill: i === 0 ? YELLOW : 'rgba(255,255,255,0.0)', stroke: i === 0 ? '#000' : `rgba(255,255,255,${0.5 - i * 0.12})`, sx: sc, sy: sc, rot: i * 0.02, lw: i === 0 ? 0.16 : 0.05, alpha: 1 - clamp((c.lt - 2.4) / 0.9) });
  }
});
