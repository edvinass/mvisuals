// Small drawing + math helpers shared by every scene.
export const W = 1280;
export const H = 720;
export const TAU = Math.PI * 2;

export const INK = '#160a2b';
export const PINK = '#ff4fa3';
export const TEAL = '#2fd6b4';
export const PURPLE = '#7c3aed';
export const YELLOW = '#ffe14d';
export const CYAN = '#27e1ff';
export const RED = '#ff3b3b';

export const IMPACT = 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif';
export const MARKER = '"Marker Felt", "Chalkboard SE", "Comic Sans MS", "Comic Neue", cursive';
export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
export const UI = '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
export const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const sm = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const pick = (arr, n) => arr[Math.floor(hash(n) * arr.length) % arr.length];

export const E = {
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inCubic: (t) => t * t * t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t) => {
    const c = 1.70158;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  outElastic: (t) =>
    t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1,
};

// Pop-in / pop-out envelope for a cue living `d` seconds. Returns scale (0..1+) and alpha.
export function life(lt, d, inT = 0.28, outT = 0.22) {
  const a = E.outBack(clamp(lt / inT));
  const o = 1 - E.inCubic(clamp((lt - (d - outT)) / outT));
  return { s: Math.max(0, a * o), a: clamp(o * 2), in: clamp(lt / inT), out: o };
}

export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function fillStroke(ctx, fill, lw = 6, ink = INK) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (lw) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = ink;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

// Flat cartoon card with a hard offset shadow. (x, y) is the top-left corner.
export function card(ctx, x, y, w, h, { fill = '#fff', r = 18, lw = 6, shadow = 8, ink = INK } = {}) {
  if (shadow) {
    rr(ctx, x + shadow, y + shadow, w, h, r);
    ctx.fillStyle = 'rgba(10,0,30,0.45)';
    ctx.fill();
  }
  rr(ctx, x, y, w, h, r);
  fillStroke(ctx, fill, lw, ink);
}

export function emoji(ctx, ch, x, y, size, { rot = 0, alpha = 1, sx = 1, sy = 1 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.globalAlpha *= alpha;
  ctx.font = `${size}px ${EMOJI}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(ch, 0, size * 0.06);
  ctx.restore();
}

export function text(ctx, str, x, y, size, { font = UI, weight = '700', fill = '#fff', align = 'center', base = 'middle', rot = 0, alpha = 1 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.globalAlpha *= alpha;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillStyle = fill;
  ctx.fillText(str, 0, 0);
  ctx.restore();
}

// Classic white-with-black-outline meme text. Shrinks to fit maxW if given.
export function memeText(ctx, str, x, y, size, { fill = '#fff', stroke = '#000', align = 'center', rot = 0, maxW = 0, lw = 0.16, alpha = 1, sx = 1, sy = 1, font = IMPACT } = {}) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.globalAlpha *= alpha;
  ctx.font = `${size}px ${font}`;
  if (maxW) {
    const w = ctx.measureText(str).width;
    if (w > maxW) {
      size = size * (maxW / w);
      ctx.font = `${size}px ${font}`;
    }
  }
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.lineWidth = size * lw;
  ctx.strokeStyle = stroke;
  ctx.strokeText(str, 0, 0);
  ctx.fillStyle = fill;
  ctx.fillText(str, 0, 0);
  ctx.restore();
}

export function wrapLines(ctx, str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (cur && ctx.measureText(test).width > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

// Speech bubble with a tail pointing at (tx, ty). (x, y) is the centre.
export function bubble(ctx, str, x, y, tx, ty, { size = 26, fill = '#fff', pad = 18, font = UI, weight = '800', color = INK } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`;
  const lines = str.split('\n');
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + pad * 2;
  const h = lines.length * size * 1.2 + pad * 1.4;
  const bx = x - w / 2;
  const by = y - h / 2;
  // tail
  const ang = Math.atan2(ty - y, tx - x);
  const ax = clamp(x + Math.cos(ang) * w * 0.3, bx + 20, bx + w - 20);
  const ay = y + (ty > y ? h / 2 : -h / 2);
  ctx.beginPath();
  ctx.moveTo(ax - 14, ay);
  ctx.lineTo(tx, ty);
  ctx.lineTo(ax + 14, ay);
  ctx.closePath();
  fillStroke(ctx, fill, 6);
  rr(ctx, bx, by, w, h, 22);
  fillStroke(ctx, fill, 6);
  // cover tail seam
  ctx.fillStyle = fill;
  ctx.fillRect(ax - 11, ay + (ty > y ? -5 : 2), 22, 4);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, x, by + pad * 0.7 + size * 0.6 + i * size * 1.2));
  ctx.restore();
}

export function stamp(ctx, str, x, y, size, { rot = -0.18, color = RED, alpha = 1 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha *= alpha;
  ctx.font = `${size}px ${IMPACT}`;
  const w = ctx.measureText(str).width + size * 0.9;
  const h = size * 1.35;
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.12;
  rr(ctx, -w / 2, -h / 2, w, h, size * 0.2);
  ctx.stroke();
  ctx.lineWidth = size * 0.04;
  rr(ctx, -w / 2 + size * 0.14, -h / 2 + size * 0.14, w - size * 0.28, h - size * 0.28, size * 0.12);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, 0, size * 0.04);
  ctx.restore();
}

export function hsl(h, s = 90, l = 60, a = 1) {
  return `hsla(${((h % 360) + 360) % 360},${s}%,${l}%,${a})`;
}

export function star(ctx, x, y, r, n = 5, inner = 0.45, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 ? r * inner : r;
    const a = rot + (i * Math.PI) / n;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
}

export function heart(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 0.9, y - s * 0.2, x - s * 0.5, y - s * 0.9, x, y - s * 0.4);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.9, x + s * 0.9, y - s * 0.2, x, y + s * 0.35);
  ctx.closePath();
}
