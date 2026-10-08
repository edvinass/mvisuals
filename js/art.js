// Hand-drawn (well, code-drawn) cast and props.
import { INK, PINK, TEAL, PURPLE, YELLOW, RED, TAU, IMPACT, MONO, UI, card, rr, fillStroke, clamp, lerp, heart, text, emoji } from './util.js';

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

export const TANIA = PINK;
export const GUY = TEAL;

/**
 * A round, slightly stupid blob person.
 * o: { x, y, s, color, look, lookY, expr, eyes, rot, sq, acc[], armL, armR, t, flip }
 */
export function blob(ctx, o) {
  const { x, y, s = 1, color = PINK, look = 0, lookY = 0, expr = 'smile', eyes = 'open', rot = 0, sq = 0, acc = [], armL = 0, armR = 0, t = 0, flip = false } = o;
  const has = (k) => acc.includes(k);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale((flip ? -1 : 1) * s * (1 + sq * 0.14), s * (1 - sq * 0.14));
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (has('wings')) {
    const flap = Math.sin(t * 14) * 0.18;
    ctx.save();
    ctx.globalAlpha = 0.8;
    for (const sd of [-1, 1]) {
      ctx.save();
      ctx.translate(sd * 50, -10);
      ctx.rotate(sd * (0.7 + flap));
      ctx.beginPath();
      ctx.ellipse(sd * 30, -30, 26, 62, 0, 0, TAU);
      fillStroke(ctx, 'rgba(120,235,255,0.75)', 5);
      ctx.restore();
    }
    ctx.restore();
  }
  if (has('cape')) {
    const fl = Math.sin(t * 9) * 8;
    ctx.beginPath();
    ctx.moveTo(-46, -34);
    ctx.quadraticCurveTo(-96 - fl, 20, -110 - fl * 1.5, 92);
    ctx.lineTo(-30, 70);
    ctx.lineTo(30, 70);
    ctx.lineTo(110 + fl * 1.5, 92);
    ctx.quadraticCurveTo(96 + fl, 20, 46, -34);
    ctx.closePath();
    fillStroke(ctx, '#1d1330', 6);
  }
  if (has('bat')) {
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sd * 18, -62);
      ctx.lineTo(sd * 34, -112);
      ctx.lineTo(sd * 52, -52);
      ctx.closePath();
      fillStroke(ctx, '#1d1330', 6);
    }
  }
  if (has('horns')) {
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sd * 28, -60);
      ctx.quadraticCurveTo(sd * 54, -76, sd * 50, -112);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 24;
      ctx.stroke();
      ctx.strokeStyle = '#f6e7bf';
      ctx.lineWidth = 13;
      ctx.stroke();
    }
  }

  // feet
  for (const sd of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(sd * 24, 64, 24, 12, 0, 0, TAU);
    fillStroke(ctx, shade(color, -0.12), 5);
  }
  // arms
  for (const sd of [-1, 1]) {
    const up = sd < 0 ? armL : armR;
    ctx.save();
    ctx.translate(sd * 58, 6);
    ctx.rotate(sd * (0.35 + up * 2.2));
    ctx.beginPath();
    ctx.ellipse(0, 22, 13, 27, 0, 0, TAU);
    fillStroke(ctx, shade(color, -0.06), 5);
    ctx.restore();
  }
  // body
  ctx.beginPath();
  ctx.ellipse(0, 0, 62, 68, 0, 0, TAU);
  fillStroke(ctx, color, 6);
  ctx.beginPath();
  ctx.ellipse(-18, -30, 22, 14, -0.5, 0, TAU);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fill();
  // belly
  ctx.beginPath();
  ctx.ellipse(0, 40, 36, 22, 0, 0, TAU);
  ctx.fillStyle = shade(color, 0.16);
  ctx.fill();

  if (has('tie')) {
    ctx.beginPath();
    ctx.moveTo(-9, 34);
    ctx.lineTo(9, 34);
    ctx.lineTo(13, 62);
    ctx.lineTo(0, 72);
    ctx.lineTo(-13, 62);
    ctx.closePath();
    fillStroke(ctx, RED, 4);
  }
  if (has('chefbody')) {
    ctx.beginPath();
    ctx.ellipse(0, 46, 40, 18, 0, 0, TAU);
    fillStroke(ctx, '#fff', 4);
  }

  if (has('bat')) {
    rr(ctx, -52, -34, 104, 34, 16);
    fillStroke(ctx, '#1d1330', 5);
  }

  // eyes
  const blink = eyes === 'open' && t % 3.4 > 3.28;
  for (const sd of [-1, 1]) {
    const ex = sd * 21;
    const ey = -14;
    if (blink || eyes === 'closed') {
      ctx.beginPath();
      ctx.moveTo(ex - 11, ey + 2);
      ctx.quadraticCurveTo(ex, ey + 8, ex + 11, ey + 2);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.stroke();
    } else if (eyes === 'happy') {
      ctx.beginPath();
      ctx.arc(ex, ey + 6, 11, Math.PI * 1.1, Math.PI * 1.9);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.stroke();
    } else if (eyes === 'heart') {
      heart(ctx, ex, ey, 22);
      fillStroke(ctx, '#ff2e5f', 4);
    } else if (eyes === 'dead') {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(ex - 8, ey - 8);
      ctx.lineTo(ex + 8, ey + 8);
      ctx.moveTo(ex + 8, ey - 8);
      ctx.lineTo(ex - 8, ey + 8);
      ctx.stroke();
    } else {
      const wide = eyes === 'wide' ? 1.25 : 1;
      ctx.beginPath();
      ctx.ellipse(ex, ey, 14 * wide, 18 * wide, 0, 0, TAU);
      fillStroke(ctx, '#fff', 4);
      const pr = eyes === 'wide' ? 5 : 8;
      ctx.beginPath();
      ctx.arc(ex + look * 6, ey + lookY * 6, pr, 0, TAU);
      ctx.fillStyle = INK;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + look * 6 - 2, ey + lookY * 6 - 3, 2.4, 0, TAU);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
  }
  // blush
  if (expr !== 'sweat' && expr !== 'flat') {
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(sd * 38, 12, 9, 6, 0, 0, TAU);
      ctx.fillStyle = 'rgba(255,90,120,0.45)';
      ctx.fill();
    }
  }
  // mouth
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  switch (expr) {
    case 'grin':
      ctx.moveTo(-22, 14);
      ctx.quadraticCurveTo(0, 54, 22, 14);
      ctx.closePath();
      fillStroke(ctx, '#fff', 5);
      break;
    case 'o':
      ctx.ellipse(0, 28, 9, 12, 0, 0, TAU);
      fillStroke(ctx, '#5a1230', 4);
      break;
    case 'shout':
      ctx.ellipse(0, 28, 16, 18, 0, 0, TAU);
      fillStroke(ctx, '#5a1230', 4);
      break;
    case 'kiss':
      ctx.ellipse(0, 28, 14, 10, 0, 0, TAU);
      fillStroke(ctx, '#ff2e5f', 4);
      ctx.beginPath();
      ctx.moveTo(-10, 28);
      ctx.lineTo(10, 28);
      ctx.stroke();
      break;
    case 'frown':
      ctx.arc(0, 40, 16, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      break;
    case 'smug':
      ctx.moveTo(-16, 28);
      ctx.quadraticCurveTo(4, 36, 22, 16);
      ctx.stroke();
      break;
    case 'sweat':
      ctx.moveTo(-20, 32);
      for (let i = 0; i < 5; i++) ctx.lineTo(-20 + (i + 1) * 8, 32 + (i % 2 ? 0 : 6));
      ctx.stroke();
      break;
    case 'flat':
      ctx.moveTo(-14, 32);
      ctx.lineTo(14, 32);
      ctx.stroke();
      break;
    case 'whistle':
      ctx.ellipse(6, 30, 6, 7, 0, 0, TAU);
      fillStroke(ctx, '#5a1230', 4);
      break;
    default:
      ctx.arc(0, 18, 18, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
  }
  if (expr === 'sweat') {
    const dy = ((t * 40) % 30) - 5;
    ctx.beginPath();
    ctx.moveTo(48, -46 + dy);
    ctx.quadraticCurveTo(58, -28 + dy, 48, -22 + dy);
    ctx.quadraticCurveTo(38, -28 + dy, 48, -46 + dy);
    fillStroke(ctx, '#7de3ff', 3);
  }

  if (has('shades')) {
    rr(ctx, -50, -30, 42, 26, 10);
    fillStroke(ctx, '#0b0616', 4);
    rr(ctx, 8, -30, 42, 26, 10);
    fillStroke(ctx, '#0b0616', 4);
    ctx.beginPath();
    ctx.moveTo(-8, -20);
    ctx.lineTo(8, -20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-40, -26);
    ctx.lineTo(-30, -18);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (has('goggles')) {
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(sd * 21, -14, 20, 0, TAU);
      fillStroke(ctx, 'rgba(160,240,255,0.35)', 6, '#444');
    }
  }
  if (has('monocle')) {
    ctx.beginPath();
    ctx.arc(21, -14, 21, 0, TAU);
    fillStroke(ctx, 'rgba(255,255,255,0.18)', 5, '#c9a227');
    ctx.beginPath();
    ctx.moveTo(35, 1);
    ctx.quadraticCurveTo(52, 30, 44, 64);
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (has('leaf')) {
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * 1.05 + (i / 6) * Math.PI * 0.9;
      ctx.save();
      ctx.translate(Math.cos(a) * 58, Math.sin(a) * 62 - 6);
      ctx.rotate(a + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, 17, 0, 0, TAU);
      fillStroke(ctx, i % 2 ? '#3fbf5a' : '#2e9c47', 3);
      ctx.restore();
    }
  }
  if (has('flowers')) {
    const cols = ['#ffdf4d', '#ff6bd6', '#fff', '#7de3ff', '#ff9a3d', '#ffdf4d', '#ff6bd6'];
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * 1.05 + (i / 6) * Math.PI * 0.9;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 58, Math.sin(a) * 62 - 6, 10, 0, TAU);
      fillStroke(ctx, cols[i], 3);
    }
  }
  if (has('halo')) {
    ctx.beginPath();
    ctx.ellipse(0, -90 + Math.sin(t * 4) * 3, 32, 9, 0, 0, TAU);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.strokeStyle = YELLOW;
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  if (has('chef')) {
    ctx.beginPath();
    for (const [cx, cy, r] of [[-26, -84, 22], [0, -96, 26], [26, -84, 22]]) ctx.arc(cx, cy, r, 0, TAU);
    fillStroke(ctx, '#fff', 5);
    rr(ctx, -40, -76, 80, 24, 6);
    fillStroke(ctx, '#fff', 5);
  }
  if (has('party')) {
    ctx.beginPath();
    ctx.moveTo(-26, -58);
    ctx.lineTo(0, -120);
    ctx.lineTo(26, -58);
    ctx.closePath();
    fillStroke(ctx, '#ffe14d', 5);
    ctx.beginPath();
    ctx.arc(0, -122, 8, 0, TAU);
    fillStroke(ctx, '#ff4fa3', 3);
  }
  if (has('cap')) {
    ctx.beginPath();
    ctx.arc(0, -46, 52, Math.PI, 0);
    ctx.closePath();
    fillStroke(ctx, '#e63946', 5);
    rr(ctx, -4, -52, 70, 14, 7);
    fillStroke(ctx, '#e63946', 5);
  }
  if (has('headband')) {
    rr(ctx, -56, -52, 112, 16, 8);
    fillStroke(ctx, '#ffe14d', 4);
  }
  ctx.restore();
}

/** Purple sofa with googly eyes. mood: neutral | guilty | proud | sleep | smug | shock */
export function sofa(ctx, { x, y, s = 1, mood = 'neutral', t = 0, rot = 0, color = PURPLE, look = 0, sq = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s * (1 + sq * 0.08), s * (1 - sq * 0.08));
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const light = shade(color, 0.12);
  const dark = shade(color, -0.1);
  for (const sd of [-1, 1]) {
    rr(ctx, sd * 138 - 11, 58, 22, 34, 8);
    fillStroke(ctx, '#3b2410', 5);
  }
  rr(ctx, -150, -112, 300, 130, 36);
  fillStroke(ctx, dark, 6);
  for (const sd of [-1, 1]) {
    rr(ctx, sd < 0 ? -134 : 12, -98, 122, 92, 28);
    fillStroke(ctx, color, 5);
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(sd * 70, -22, 4, 0, TAU);
    ctx.fill();
  }
  rr(ctx, -166, -22, 332, 84, 26);
  fillStroke(ctx, dark, 6);
  rr(ctx, -132, -18, 264, 56, 20);
  fillStroke(ctx, light, 5);
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(0, 34);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  ctx.stroke();
  for (const sd of [-1, 1]) {
    rr(ctx, sd < 0 ? -196 : 138, -62, 58, 128, 28);
    fillStroke(ctx, color, 6);
    ctx.beginPath();
    ctx.ellipse(sd * 167, -40, 16, 10, 0, 0, TAU);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fill();
  }

  // face
  const ex = 52;
  const ey = -62;
  const sleeping = mood === 'sleep';
  for (const sd of [-1, 1]) {
    if (sleeping) {
      ctx.beginPath();
      ctx.arc(sd * ex, ey + 4, 14, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.stroke();
      continue;
    }
    ctx.beginPath();
    ctx.arc(sd * ex, ey, 22, 0, TAU);
    fillStroke(ctx, '#fff', 4);
    let px = look * 8;
    let py = 0;
    let pr = 10;
    if (mood === 'guilty') {
      px = Math.sin(t * 2.6) > 0 ? 9 : -9;
      py = 3;
    }
    if (mood === 'proud') py = -4;
    if (mood === 'shock') pr = 6;
    ctx.beginPath();
    ctx.arc(sd * ex + px, ey + py, pr, 0, TAU);
    ctx.fillStyle = INK;
    ctx.fill();
    if (mood === 'smug') {
      ctx.beginPath();
      ctx.moveTo(sd * ex - 24, ey - 24);
      ctx.lineTo(sd * ex + 24, ey - 24);
      ctx.lineTo(sd * ex + 24, ey - 4);
      ctx.lineTo(sd * ex - 24, ey - 4);
      ctx.closePath();
      fillStroke(ctx, color, 4);
    }
    if (mood === 'guilty') {
      ctx.beginPath();
      ctx.moveTo(sd * ex - sd * 22, ey - 32);
      ctx.lineTo(sd * ex + sd * 20, ey - 22);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (mood === 'guilty') {
    ctx.moveTo(-30, -20);
    for (let i = 0; i < 6; i++) ctx.lineTo(-30 + (i + 1) * 10, -20 + (i % 2 ? 0 : -7));
    ctx.stroke();
    const dy = (t * 50) % 40;
    ctx.beginPath();
    ctx.moveTo(110, -96 + dy);
    ctx.quadraticCurveTo(124, -72 + dy, 110, -62 + dy);
    ctx.quadraticCurveTo(96, -72 + dy, 110, -96 + dy);
    fillStroke(ctx, '#7de3ff', 4);
  } else if (mood === 'proud' || mood === 'smug') {
    ctx.moveTo(-26, -26);
    ctx.quadraticCurveTo(0, mood === 'proud' ? 2 : -14, 26, -30);
    ctx.stroke();
  } else if (mood === 'shock') {
    ctx.ellipse(0, -22, 10, 14, 0, 0, TAU);
    fillStroke(ctx, '#5a1230', 4);
  } else {
    ctx.arc(0, -38, 20, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }
  if (sleeping) {
    for (let i = 0; i < 3; i++) {
      const a = ((t * 0.6 + i / 3) % 1);
      text(ctx, 'z', 130 + a * 40, -90 - a * 70, 26 + i * 8, { font: UI, fill: '#fff', alpha: 1 - a });
    }
  }
  ctx.restore();
}

/** Metro car, side-on. windows[i](ctx, w, h) draws inside window i (origin = window centre). */
export function trainCar(ctx, { x, y, t = 0, color = '#6d28d9', stripe = PINK, windows = [], sign = 'NOT YOUR STOP', speed = 1, w = 1000 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  const bounce = Math.sin(t * 18 * speed) * 1.6;
  ctx.translate(0, bounce);
  rr(ctx, -w / 2, -120, w, 236, 46);
  fillStroke(ctx, color, 7);
  ctx.save();
  rr(ctx, -w / 2, -120, w, 236, 46);
  ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(-w / 2, -120, w, 34);
  ctx.fillStyle = stripe;
  ctx.fillRect(-w / 2, 58, w, 26);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(-w / 2, 84, w, 8);
  ctx.restore();
  rr(ctx, -w / 2, -120, w, 236, 46);
  ctx.lineWidth = 7;
  ctx.strokeStyle = INK;
  ctx.stroke();

  // windows: [{ k: widthWeight, fn(ctx, w, h) }]
  const wins = windows.length ? windows : [{ k: 1 }, { k: 1 }, { k: 1 }];
  const n = wins.length;
  const avail = w - 150;
  const gapPx = 40;
  const totalK = wins.reduce((a, b) => a + (b.k || 1), 0);
  const unit = (avail - gapPx * (n - 1)) / totalK;
  let cursor = -avail / 2;
  const wy = -16;
  const wh = 104;
  for (let i = 0; i < n; i++) {
    const ww = unit * (wins[i].k || 1);
    const cx = cursor + ww / 2;
    cursor += ww + gapPx;
    rr(ctx, cx - ww / 2, wy - wh / 2, ww, wh, 22);
    ctx.fillStyle = '#ffe9a8';
    ctx.fill();
    ctx.save();
    rr(ctx, cx - ww / 2, wy - wh / 2, ww, wh, 22);
    ctx.clip();
    ctx.translate(cx, wy);
    if (wins[i].fn) wins[i].fn(ctx, ww, wh);
    ctx.restore();
    rr(ctx, cx - ww / 2, wy - wh / 2, ww, wh, 22);
    ctx.lineWidth = 6;
    ctx.strokeStyle = INK;
    ctx.stroke();
    // door seams between windows
    if (i < n - 1) {
      ctx.beginPath();
      ctx.moveTo(cx + ww / 2 + gapPx / 2, -76);
      ctx.lineTo(cx + ww / 2 + gapPx / 2, 56);
      ctx.strokeStyle = 'rgba(22,10,43,0.45)';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
  // LED destination sign
  rr(ctx, -w / 2 + 70, -112, 250, 34, 8);
  fillStroke(ctx, '#0d0618', 4);
  text(ctx, sign, -w / 2 + 195, -94, 24, { font: MONO, fill: '#ffb000', weight: '800' });
  // headlight
  ctx.beginPath();
  ctx.arc(w / 2 - 20, 30, 12, 0, TAU);
  fillStroke(ctx, '#fff7b0', 4);
  // wheels
  for (const wx of [-w * 0.34, -w * 0.28, w * 0.28, w * 0.34]) {
    ctx.save();
    ctx.translate(wx, 120);
    ctx.rotate(t * 10 * speed);
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, TAU);
    fillStroke(ctx, '#2a2144', 5);
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 18);
    ctx.strokeStyle = '#8a7fb5';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function phone(ctx, x, y, s, rot, drawScreen, { color = '#1c1233' } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  card(ctx, -160, -300, 320, 600, { fill: color, r: 46, lw: 7, shadow: 12 });
  ctx.save();
  rr(ctx, -142, -276, 284, 552, 32);
  ctx.clip();
  ctx.translate(-142, -276);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 284, 552);
  drawScreen(ctx);
  ctx.restore();
  rr(ctx, -38, -290, 76, 14, 7);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();
}

export function thermostat(ctx, x, y, s, { temp = 19, mode = 'ok', t = 0, label = '' } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  card(ctx, -90, -90, 180, 180, { fill: '#f4f1ff', r: 90, lw: 7, shadow: 8 });
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, TAU);
  fillStroke(ctx, mode === 'hot' ? '#ff7a3d' : mode === 'broken' ? '#444' : '#3b82f6', 5);
  text(ctx, mode === 'broken' ? 'ERR' : `${temp}\u00B0`, 0, -4, mode === 'broken' ? 48 : 58, { font: IMPACT, fill: '#fff', weight: '400' });
  if (label) text(ctx, label, 0, 40, 18, { fill: '#fff', weight: '800' });
  if (mode === 'hot') {
    for (let i = 0; i < 3; i++) emoji(ctx, '\uD83D\uDD25', -30 + i * 30, -80 - Math.sin(t * 9 + i) * 6, 26);
  }
  ctx.restore();
}

export function clockFace(ctx, x, y, r, tHours, { fill = '#fff' } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  fillStroke(ctx, fill, 6);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82);
    ctx.lineTo(Math.cos(a) * r * 0.94, Math.sin(a) * r * 0.94);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  const hh = (tHours / 12) * TAU - Math.PI / 2;
  const mm = tHours * TAU - Math.PI / 2;
  ctx.strokeStyle = INK;
  ctx.lineCap = 'round';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(hh) * r * 0.5, Math.sin(hh) * r * 0.5);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(mm) * r * 0.78, Math.sin(mm) * r * 0.78);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, TAU);
  ctx.fillStyle = RED;
  ctx.fill();
  ctx.restore();
}

export function house(ctx, x, y, s, { wall = '#ffd8a8', roof = '#e63946', light = false } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  rr(ctx, -70, -50, 140, 110, 6);
  fillStroke(ctx, wall, 6);
  ctx.beginPath();
  ctx.moveTo(-90, -48);
  ctx.lineTo(0, -120);
  ctx.lineTo(90, -48);
  ctx.closePath();
  fillStroke(ctx, roof, 6);
  rr(ctx, -16, 8, 32, 52, 4);
  fillStroke(ctx, '#7a4a2a', 5);
  rr(ctx, 30, -26, 28, 28, 4);
  fillStroke(ctx, light ? '#ffe14d' : '#9ad7ff', 4);
  rr(ctx, -58, -26, 28, 28, 4);
  fillStroke(ctx, light ? '#ffe14d' : '#9ad7ff', 4);
  ctx.restore();
}

/** Tiny "OS window" frame. Content is drawn by the caller inside (x+6, y+46). */
export function appWindow(ctx, x, y, w, h, title, { bar = '#e9e4f5', body = '#fff', dark = false } = {}) {
  card(ctx, x, y, w, h, { fill: body, r: 14, lw: 5, shadow: 8 });
  ctx.save();
  rr(ctx, x, y, w, h, 14);
  ctx.clip();
  ctx.fillStyle = dark ? '#2b2342' : bar;
  ctx.fillRect(x, y, w, 40);
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.lineTo(x + w, y + 40);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.stroke();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(x + 24 + i * 24, y + 20, 8, 0, TAU);
    ctx.fillStyle = c;
    ctx.fill();
  });
  text(ctx, title, x + w / 2, y + 21, 17, { font: UI, fill: dark ? '#cfc6ee' : '#5d5578', weight: '700' });
}

export function dumbbell(ctx, x, y, s, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-40, 0);
  ctx.lineTo(40, 0);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 18;
  ctx.stroke();
  ctx.strokeStyle = '#9aa0b4';
  ctx.lineWidth = 8;
  ctx.stroke();
  for (const sd of [-1, 1]) {
    rr(ctx, sd * 48 - 14, -34, 28, 68, 8);
    fillStroke(ctx, '#3a3f58', 5);
    rr(ctx, sd * 70 - 10, -24, 20, 48, 6);
    fillStroke(ctx, '#3a3f58', 5);
  }
  ctx.restore();
}

export function bed(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  rr(ctx, -150, -20, 300, 70, 14);
  fillStroke(ctx, '#7aa7ff', 6);
  rr(ctx, -150, -90, 36, 140, 12);
  fillStroke(ctx, '#8a5a3a', 6);
  rr(ctx, -112, -50, 80, 36, 16);
  fillStroke(ctx, '#fff', 5);
  rr(ctx, -150, 40, 300, 22, 6);
  fillStroke(ctx, '#8a5a3a', 6);
  ctx.restore();
}

export function lerpColor(a, b, k) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const m = (s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, clamp(k)));
  return `rgb(${m(16)},${m(8)},${m(0)})`;
}
