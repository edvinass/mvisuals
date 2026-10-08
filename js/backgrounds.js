// Full-screen backgrounds, one per section "mood". All are pure functions of time.
import { W, H, TAU, INK, hash, hsl, clamp, lerp, sm, rr, fillStroke, star, YELLOW, PINK, PURPLE, CYAN } from './util.js';

function vgrad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([p, c]) => g.addColorStop(p, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, y0, W, y1 - y0);
}

export function halftone(ctx, color, spacing, maxR, t = 0, { dir = 1, y0 = 0, y1 = H } = {}) {
  ctx.fillStyle = color;
  const off = (t * 24 * dir) % spacing;
  for (let y = y0 - spacing; y < y1 + spacing; y += spacing) {
    const row = Math.round(y / spacing);
    for (let x = -spacing + (row % 2 ? spacing / 2 : 0) - off; x < W + spacing; x += spacing) {
      const d = Math.hypot(x - W / 2, y - H / 2) / (W * 0.6);
      const r = maxR * clamp(d);
      if (r > 0.6) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
    }
  }
}

export function rays(ctx, cx, cy, n, rot, c1, c2, len = 1600) {
  for (let i = 0; i < n; i++) {
    const a0 = rot + (i / n) * TAU;
    const a1 = rot + ((i + 0.5) / n) * TAU;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * len, cy + Math.sin(a0) * len);
    ctx.lineTo(cx + Math.cos(a1) * len, cy + Math.sin(a1) * len);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? c1 : c2;
    ctx.fill();
  }
}

export function speedLines(ctx, t, n = 22, alpha = 0.5, color = '#fff', y0 = 0, y1 = H) {
  ctx.fillStyle = color;
  ctx.globalAlpha *= alpha;
  for (let i = 0; i < n; i++) {
    const sp = 1400 + hash(i * 3.1) * 1800;
    const len = 180 + hash(i * 7.7) * 380;
    const x = W + 200 - ((t * sp + hash(i) * 3000) % (W + 700));
    const y = y0 + hash(i * 1.9) * (y1 - y0);
    ctx.fillRect(x, y, len, 2 + hash(i * 5.3) * 3);
  }
  ctx.globalAlpha /= alpha;
}

export function bgIntro(ctx, f) {
  const { t, kick, beat } = f;
  vgrad(ctx, 0, 470, [[0, '#12052e'], [0.55, '#5b1a8f'], [1, '#ff4fa3']]);
  for (let i = 0; i < 70; i++) {
    const x = hash(i) * W;
    const y = hash(i + 50) * 360;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (1 + hash(i + 9) * 2) + i));
    ctx.fillStyle = `rgba(255,255,255,${tw * 0.8})`;
    ctx.fillRect(x, y, 3, 3);
  }
  // striped sun
  const sy = 330 - kick * 6;
  ctx.save();
  ctx.beginPath();
  ctx.arc(W / 2, sy, 190, 0, TAU);
  ctx.clip();
  const sg = ctx.createLinearGradient(0, sy - 190, 0, sy + 190);
  sg.addColorStop(0, '#ffe14d');
  sg.addColorStop(1, '#ff4fa3');
  ctx.fillStyle = sg;
  ctx.fillRect(W / 2 - 200, sy - 200, 400, 400);
  ctx.fillStyle = '#5b1a8f';
  for (let i = 0; i < 8; i++) {
    const yy = sy + 20 + i * 24 + ((t * 16) % 24);
    ctx.fillRect(W / 2 - 200, yy, 400, 3 + i * 1.6);
  }
  ctx.restore();
  // mountains
  ctx.fillStyle = '#240a4a';
  ctx.beginPath();
  ctx.moveTo(0, 470);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 470 - 50 - Math.abs(Math.sin(x * 0.011 + 1)) * 90 - Math.sin(x * 0.04) * 14);
  ctx.lineTo(W, 470);
  ctx.fill();
  // grid floor
  ctx.fillStyle = '#12052e';
  ctx.fillRect(0, 470, W, H - 470);
  ctx.strokeStyle = `rgba(255,79,163,${0.55 + kick * 0.4})`;
  ctx.lineWidth = 2.5;
  for (let i = -16; i <= 16; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * 20, 470);
    ctx.lineTo(W / 2 + i * 220, H);
    ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    const p = ((i + (beat % 1)) / 12);
    const y = 470 + Math.pow(p, 2.2) * (H - 470);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

export function bgApp(ctx, f, { hue = 330 } = {}) {
  const { t, kick } = f;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, hsl(hue, 90, 52));
  g.addColorStop(1, hsl(hue + 50, 85, 30));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  halftone(ctx, 'rgba(255,255,255,0.13)', 34, 12 + kick * 3, t);
  // slow floating hearts
  for (let i = 0; i < 12; i++) {
    const x = hash(i * 2.2) * W;
    const y = H + 60 - ((t * (30 + hash(i) * 40) + hash(i + 4) * 900) % (H + 160));
    ctx.font = `${30 + hash(i + 8) * 30}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
    ctx.globalAlpha = 0.25;
    ctx.fillText(i % 3 ? '\u2764' : '\uD83D\uDD25', x, y);
    ctx.globalAlpha = 1;
  }
}

// Train / station scene backdrop. Returns nothing; the train itself is an actor.
export function bgTrain(ctx, f, { top = '#2b1055', bot = '#ff6fb5', sun = YELLOW, rainbow = false, night = false, scroll = 420, tint = 0 } = {}) {
  const { t, kick } = f;
  let c1 = top;
  let c2 = bot;
  if (rainbow) {
    c1 = hsl(t * 40, 80, 35);
    c2 = hsl(t * 40 + 70, 90, 62);
  }
  vgrad(ctx, 0, 540, [[0, c1], [1, c2]]);
  // sun / moon
  const sx = W * 0.72;
  ctx.beginPath();
  ctx.arc(sx, 190 + kick * -4, 110, 0, TAU);
  ctx.fillStyle = night ? '#f4f1ff' : sun;
  ctx.fill();
  if (night) {
    ctx.fillStyle = 'rgba(20,10,60,0.18)';
    ctx.beginPath();
    ctx.arc(sx - 30, 170, 24, 0, TAU);
    ctx.arc(sx + 30, 224, 16, 0, TAU);
    ctx.fill();
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * Math.abs(Math.sin(t * 2 + i))})`;
      ctx.fillRect(hash(i) * W, hash(i + 77) * 260, 3, 3);
    }
  }
  // skyline layers
  const layers = [
    { k: 0.12, base: 520, minH: 90, rng: 140, col: night ? '#1b0f3d' : 'rgba(60,20,110,0.55)', bw: 110 },
    { k: 0.28, base: 560, minH: 100, rng: 170, col: night ? '#120a2e' : 'rgba(35,10,70,0.8)', bw: 84 },
  ];
  for (const L of layers) {
    const off = t * scroll * L.k;
    const first = Math.floor(off / L.bw);
    const n = Math.ceil(W / L.bw) + 2;
    for (let i = first; i < first + n; i++) {
      const h = L.minH + hash(i * (L.k * 20 + 1)) * L.rng;
      const x = i * L.bw - off;
      ctx.fillStyle = L.col;
      ctx.fillRect(x, L.base - h, L.bw - 6, h + 60);
      if (night || L.k > 0.2) {
        ctx.fillStyle = night ? 'rgba(255,225,120,0.75)' : 'rgba(255,225,120,0.35)';
        for (let wy = L.base - h + 14; wy < L.base - 10; wy += 22)
          for (let wx = 10; wx < L.bw - 20; wx += 20) if (hash(i * 13 + wy + wx) > 0.55) ctx.fillRect(x + wx, wy, 8, 10);
      }
    }
  }
  // platform
  ctx.fillStyle = night ? '#150b30' : '#2a1250';
  ctx.fillRect(0, 574, W, H - 574);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 590, W, 9);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  const toff = (t * scroll) % 120;
  for (let x = -toff; x < W; x += 120) ctx.fillRect(x, 612, 4, H);
  // rails
  ctx.fillStyle = '#0d0618';
  ctx.fillRect(0, 558, W, 14);
}

// Foreground lamp posts rushing past (drawn after the train).
export function lampPosts(ctx, t, scroll = 900) {
  const sp = 520;
  const off = (t * scroll) % sp;
  for (let x = W + 100 - off; x > -100; x -= sp) {
    ctx.fillStyle = '#0d0618';
    ctx.fillRect(x - 6, 200, 12, 410);
    ctx.fillRect(x - 6, 200, 56, 10);
    ctx.beginPath();
    ctx.arc(x + 50, 220, 14, 0, TAU);
    ctx.fillStyle = '#fff7b0';
    ctx.fill();
  }
}

export function stopSign(ctx, x, y, label, tilt = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.fillStyle = '#0d0618';
  ctx.fillRect(-120, 30, 12, 200);
  ctx.fillRect(108, 30, 12, 200);
  rr(ctx, -170, -50, 340, 100, 12);
  fillStroke(ctx, YELLOW, 7);
  ctx.fillStyle = INK;
  ctx.font = '48px Impact, "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 4);
  ctx.restore();
}

export function bgKaleido(ctx, f, { hue = 300, strobe = 0 } = {}) {
  const { t, kick, beat } = f;
  ctx.fillStyle = hsl(hue + 180, 80, 14);
  ctx.fillRect(0, 0, W, H);
  const rot = t * 0.35;
  rays(ctx, W / 2, H / 2, 24, rot, hsl(hue + t * 20, 95, 55, 0.9), hsl(hue + 60 + t * 20, 95, 40, 0.9));
  ctx.globalCompositeOperation = 'overlay';
  rays(ctx, W / 2, H / 2, 12, -rot * 1.7, 'rgba(255,255,255,0.35)', 'rgba(0,0,0,0.2)');
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 6; i++) {
    const p = ((beat * 0.5 + i / 6) % 1);
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, p * 900, 0, TAU);
    ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.5})`;
    ctx.lineWidth = 6 + (1 - p) * 20;
    ctx.stroke();
  }
  if (strobe && kick > 0.82) {
    ctx.fillStyle = `rgba(255,255,255,${(kick - 0.82) * 2.2 * strobe})`;
    ctx.fillRect(0, 0, W, H);
  }
}

export function bgChess(ctx, f, { hueShift = 0, speed = 20 } = {}) {
  const { t, kick } = f;
  ctx.fillStyle = hsl(200 + hueShift, 70, 25);
  ctx.fillRect(0, 0, W, H);
  const sz = 90;
  const off = (t * speed) % (sz * 2);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.12);
  ctx.translate(-W / 2, -H / 2);
  for (let r = -4; r < 11; r++) {
    for (let c = -4; c < 18; c++) {
      if ((r + c) % 2) {
        ctx.fillStyle = hsl(200 + hueShift, 70, 32 + kick * 6);
        ctx.fillRect(c * sz + off, r * sz + off * 0.5, sz, sz);
      }
    }
  }
  ctx.restore();
  const g = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 800);
  g.addColorStop(0, 'rgba(10,0,40,0)');
  g.addColorStop(1, 'rgba(10,0,40,0.65)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function bgNight(ctx, f, { moonX = 980 } = {}) {
  const { t } = f;
  vgrad(ctx, 0, H, [[0, '#07031a'], [0.6, '#1b0f4d'], [1, '#3a1d6e']]);
  for (let i = 0; i < 120; i++) {
    const x = hash(i * 1.3) * W;
    const y = hash(i * 2.7) * H * 0.8;
    const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.6 + hash(i) * 1.5) + i));
    ctx.fillStyle = `rgba(255,255,255,${tw})`;
    const r = 1 + hash(i + 3) * 2.4;
    ctx.fillRect(x, y, r, r);
  }
  // moon
  ctx.beginPath();
  ctx.arc(moonX, 150, 80, 0, TAU);
  ctx.fillStyle = '#fff6d6';
  ctx.shadowColor = '#fff6d6';
  ctx.shadowBlur = 50;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(200,180,140,0.35)';
  for (const [dx, dy, r] of [[-24, -10, 16], [22, 22, 12], [10, -30, 9]]) {
    ctx.beginPath();
    ctx.arc(moonX + dx, 150 + dy, r, 0, TAU);
    ctx.fill();
  }
  // clouds
  for (let i = 0; i < 4; i++) {
    const x = ((t * (10 + i * 6) + i * 420) % (W + 400)) - 200;
    ctx.fillStyle = 'rgba(120,100,200,0.22)';
    ctx.beginPath();
    for (const [dx, dy, r] of [[0, 0, 40], [44, -14, 52], [96, 2, 40], [48, 12, 46]]) ctx.arc(x + dx, 260 + i * 70 + dy, r, 0, TAU);
    ctx.fill();
  }
}

export function bgMap(ctx, f, { dawn = 0 } = {}) {
  const { t } = f;
  ctx.fillStyle = '#f3ecd9';
  ctx.fillRect(0, 0, W, H);
  const off = (t * 14) % 160;
  ctx.save();
  ctx.translate(-off, -off * 0.6);
  // blocks
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 12; c++) {
      const h = hash(r * 31 + c * 7);
      ctx.fillStyle = h > 0.8 ? '#bfe7b2' : h > 0.65 ? '#e8dfc4' : '#fbf8ef';
      ctx.fillRect(c * 160 + 14, r * 160 + 14, 132, 132);
    }
  }
  // roads
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#e1d6b8';
  ctx.lineWidth = 3;
  for (let i = 0; i < 13; i++) {
    ctx.fillRect(i * 160 - 14, 0, 28, 1400);
    ctx.fillRect(0, i * 160 - 14, 2200, 28);
  }
  ctx.restore();
  // river
  ctx.strokeStyle = '#9fd6ff';
  ctx.lineWidth = 60;
  ctx.beginPath();
  ctx.moveTo(-50, 560);
  ctx.bezierCurveTo(300, 420, 700, 700, 1330, 500);
  ctx.stroke();
  // dawn tint
  if (dawn) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgba(255,120,60,${0.55 * dawn})`);
    g.addColorStop(1, `rgba(255,220,120,${0.15 * dawn})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

export function bgLiving(ctx, f, { dim = 0, warm = 1, lampOn = true } = {}) {
  const { t } = f;
  // wall
  ctx.fillStyle = '#4a2a85';
  ctx.fillRect(0, 0, W, 520);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let x = 0; x < W; x += 80) ctx.fillRect(x, 0, 40, 520);
  // wallpaper dots
  ctx.fillStyle = 'rgba(255,225,120,0.10)';
  for (let y = 30; y < 500; y += 70) for (let x = 40 + ((y / 70) % 2) * 40; x < W; x += 80) {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, TAU);
    ctx.fill();
  }
  // floor
  vgrad(ctx, 520, H, [[0, '#6b3f1d'], [1, '#3b200d']]);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 512, W, 12);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 540 + i * 24 + i * i);
    ctx.lineTo(W, 540 + i * 24 + i * i);
    ctx.stroke();
  }
  // rug
  ctx.beginPath();
  ctx.ellipse(W / 2, 640, 440, 70, 0, 0, TAU);
  fillStroke(ctx, '#e63a8a', 6);
  ctx.beginPath();
  ctx.ellipse(W / 2, 640, 340, 48, 0, 0, TAU);
  ctx.strokeStyle = '#ffd1e6';
  ctx.lineWidth = 4;
  ctx.stroke();
  // window w/ night city
  rr(ctx, 70, 80, 250, 260, 14);
  fillStroke(ctx, '#142a66', 8);
  ctx.save();
  rr(ctx, 70, 80, 250, 260, 14);
  ctx.clip();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = '#0a1438';
    const h = 60 + hash(i) * 90;
    ctx.fillRect(70 + i * 44, 340 - h, 40, h);
    ctx.fillStyle = '#ffe14d';
    for (let k = 0; k < 6; k++) if (hash(i * 9 + k) > 0.5) ctx.fillRect(78 + i * 44, 340 - h + 12 + k * 20, 8, 8);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(195, 80);
  ctx.lineTo(195, 340);
  ctx.moveTo(70, 210);
  ctx.lineTo(320, 210);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 8;
  ctx.stroke();
  // picture frames
  rr(ctx, 900, 90, 160, 120, 8);
  fillStroke(ctx, '#ffd9a0', 8);
  ctx.fillStyle = '#7de3ff';
  ctx.fillRect(912, 102, 136, 96);
  ctx.fillStyle = '#e63946';
  ctx.fillRect(930, 140, 100, 34);
  ctx.fillStyle = '#fff';
  ctx.fillRect(940, 148, 18, 14);
  ctx.fillRect(966, 148, 18, 14);
  ctx.fillRect(992, 148, 18, 14);
  // lamp
  if (lampOn) {
    ctx.beginPath();
    ctx.moveTo(1130, 300);
    ctx.lineTo(1130, 520);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1090, 300);
    ctx.lineTo(1170, 300);
    ctx.lineTo(1150, 230);
    ctx.lineTo(1110, 230);
    ctx.closePath();
    fillStroke(ctx, '#ffd36b', 6);
    const g = ctx.createRadialGradient(1130, 300, 10, 1130, 360, 330);
    g.addColorStop(0, `rgba(255,220,120,${0.35 * warm})`);
    g.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(800, 200, 480, 520);
  }
  if (dim) {
    ctx.fillStyle = `rgba(10,0,30,${dim})`;
    ctx.fillRect(0, 0, W, H);
  }
}

export function sparkles(ctx, t, n = 14, color = '#fff', y0 = 0, y1 = H) {
  for (let i = 0; i < n; i++) {
    const x = hash(i * 4.4) * W;
    const y = y0 + hash(i * 9.1) * (y1 - y0);
    const tw = Math.abs(Math.sin(t * 3 + i * 1.7));
    ctx.fillStyle = color;
    ctx.globalAlpha = tw;
    star(ctx, x, y, 6 + tw * 14, 4, 0.2, 0);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
