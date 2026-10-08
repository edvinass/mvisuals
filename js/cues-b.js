// Gags, part B: verse 2, chorus 2, breakdown, verse 3, bridge, final chorus, drops, outro, credits.
import {
  W, H, TAU, INK, PINK, TEAL, PURPLE, YELLOW, CYAN, RED, E, UI, MONO, MARKER, IMPACT, clamp, lerp, sm, hash, hsl,
  text, memeText, emoji, rr, fillStroke, card, bubble, stamp, life, heart, star,
} from './util.js';
import { blob, sofa, phone, appWindow, clockFace, house, thermostat, dumbbell, bed, TANIA, GUY } from './art.js';
import { cue, at, sticker, bigText, barStart } from './cues-a.js';

const typed = (str, k) => str.slice(0, Math.floor(str.length * clamp(k)));
const flash = (t0, dur = 0.35, color = '255,255,255') =>
  cue(t0, t0 + dur, (ctx, f, c) => {
    ctx.fillStyle = `rgba(${color},${1 - E.outCubic(c.lt / c.d)})`;
    ctx.fillRect(0, 0, W, H);
  });

// ---------------------------------------------------------------------------
// VERSE 2: maths, spelling, chess, code
// ---------------------------------------------------------------------------
cue(75.5, 77.95, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.25);
  at(ctx, 640, 205, L.s, -0.01, () => {
    rr(ctx, -350, -150, 700, 300, 14);
    fillStroke(ctx, '#1f6f4a', 12, '#8a5a3a');
    text(ctx, typed('KISS + KISS = ?', c.lt / 0.7), -300, -70, 58, { font: MARKER, fill: '#f4f4f4', align: 'left' });
    text(ctx, typed('= 3  \u2713', (c.lt - 0.9) / 0.4), -300, 20, 58, { font: MARKER, fill: '#f4f4f4', align: 'left' });
    const k = E.outBack(clamp((c.lt - 1.5) / 0.3));
    text(ctx, '\u2717', 250, 30, 190 * k, { font: MARKER, fill: '#ff4d4d', rot: -0.1 });
  });
  bubble(ctx, "THE MATHS\nISN'T MATHING", 440, 430, 280, 490, { size: 30 });
});
cue(77.9, 79.85, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.25);
  house(ctx, 220, 330, 1.0 * L.s, { light: true });
  house(ctx, 1060, 330, 1.0 * L.s, { wall: '#c7d2fe', roof: '#7c3aed' });
  ctx.save();
  ctx.setLineDash([14, 14]);
  ctx.lineDashOffset = -c.lt * 40;
  ctx.beginPath();
  ctx.moveTo(320, 420);
  ctx.bezierCurveTo(480, 330, 800, 510, 960, 420);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 8;
  ctx.globalAlpha *= L.a;
  ctx.stroke();
  ctx.restore();
  const wx = 640 + Math.sin(c.lt * 2.2) * 180;
  emoji(ctx, '\uD83D\uDEB6', wx, 380 + Math.sin(c.lt * 7) * 4, 60 * L.s, { sx: Math.cos(c.lt * 2.2) > 0 ? 1 : -1 });
  memeText(ctx, 'HOME. BUT MILES APART.', 640, 150, 70, { sx: L.s, sy: L.s, maxW: 1000 });
  stamp(ctx, '0.4 MILES', 640, 250, 46 * L.s, { rot: -0.05, color: '#fff' });
});
cue(79.8, 81.7, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.25);
  at(ctx, 640, 220, L.s, 0, () => {
    appWindow(ctx, -270, -130, 540, 260, 'Document1 - Word-ish');
    const fixed = c.lt > 1.0;
    text(ctx, fixed ? 'Kiss me, miss my soap' : 'Kiss me, miss my stopp', -240, -40, 36, { font: MARKER, fill: INK, align: 'left', weight: '700' });
    if (!fixed) {
      ctx.beginPath();
      for (let x = 60; x < 250; x += 10) ctx.lineTo(x, -10 + (Math.floor(x / 10) % 2 ? 0 : 6));
      ctx.strokeStyle = RED;
      ctx.lineWidth = 3;
      ctx.stroke();
      card(ctx, 60, 20, 190, 56, { fill: '#fff', r: 8, lw: 3, shadow: 3 });
      text(ctx, 'Did you mean:', 155, 36, 14, { fill: '#666', weight: '700' });
      text(ctx, 'soap?', 155, 58, 22, { fill: '#2563eb', weight: '900' });
    } else {
      stamp(ctx, 'WORSE', 0, 50, 64, { rot: -0.1 });
    }
  });
});
cue(81.6, 83.7, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.25);
  at(ctx, 640, 220, L.s, 0, () => {
    card(ctx, -300, -90, 600, 180, { fill: '#fff', r: 20 });
    text(ctx, 'CONVINCING', -270, -52, 32, { font: IMPACT, fill: INK, weight: '400', align: 'left' });
    rr(ctx, -270, -10, 540, 44, 22);
    fillStroke(ctx, '#e5e7eb', 5);
    const fill = 0.12 + Math.sin(c.lt * 6) * 0.01;
    rr(ctx, -270, -10, 540 * fill, 44, 22);
    fillStroke(ctx, RED, 4);
    text(ctx, `${Math.round(fill * 100)}%  (LOW)`, 0, 62, 28, { fill: RED, weight: '900' });
  });
  emoji(ctx, '\uD83D\uDE05', 1020, 190, 100 * L.s, { rot: 0.2 });
});

// chess board geometry shared by three cues
const BOARD = { x: 464, y: 60, tile: 44 };
const WHITE = ['\u265C', '\u265E', '\u265D', '\u265B', '\u265A', '\u265D', '\u265E', '\u265C'];
function drawBoard(ctx, lt, { tiles = 64, pieces = true, undo = false } = {}) {
  const { x, y, tile } = BOARD;
  for (let r = 0; r < 8; r++) {
    for (let col = 0; col < 8; col++) {
      const i = r * 8 + col;
      if (i >= tiles) continue;
      ctx.fillStyle = (r + col) % 2 ? '#7a4a2a' : '#f0d9b5';
      ctx.fillRect(x + col * tile, y + r * tile, tile, tile);
    }
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.strokeRect(x, y, tile * 8, tile * 8);
  if (!pieces) return;
  ctx.font = `${tile * 0.9}px "Apple Symbols","Segoe UI Symbol","DejaVu Sans",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const put = (ch, col, row, fill, dy = 0) => {
    const px = x + col * tile + tile / 2;
    const py = y + row * tile + tile / 2 + dy;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000';
    ctx.strokeText(ch, px, py);
    ctx.fillStyle = fill;
    ctx.fillText(ch, px, py);
  };
  for (let col = 0; col < 8; col++) {
    put(WHITE[col], col, 0, '#222');
    put('\u265F', col, 1, '#222');
    put('\u265F', col, 6, '#fff');
    put(WHITE[col], col, 7, '#fff');
  }
}
cue(83.6, 85.4, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.2);
  at(ctx, 640, 230, L.s, 0, () => {
    ctx.translate(-640, -230);
    drawBoard(ctx, c.lt);
    // the pawn that keeps going back and forth
    const k = Math.abs(Math.sin(c.lt * 4.5));
    const T = BOARD.tile;
    ctx.font = `${T}px "Apple Symbols","Segoe UI Symbol",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText('\u265F', BOARD.x + 4 * T + T / 2, BOARD.y + (5 - k * 2) * T + T / 2);
    ctx.fillStyle = YELLOW;
    ctx.fillText('\u265F', BOARD.x + 4 * T + T / 2, BOARD.y + (5 - k * 2) * T + T / 2);
    const press = k > 0.9 ? 4 : 0;
    rr(ctx, 860, 170 + press, 180, 64, 14);
    fillStroke(ctx, '#2563eb', 5);
    text(ctx, '\u21A9 UNDO', 950, 203 + press, 30, { fill: '#fff', weight: '900' });
    text(ctx, `x${Math.floor(c.lt * 4.5 / Math.PI * 2) + 1}`, 950, 140, 34, { font: IMPACT, weight: '400', fill: YELLOW });
  });
  bubble(ctx, 'undo?', 330, 410, 270, 470, { size: 36 });
});
cue(85.3, 87.3, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.2);
  at(ctx, 640, 200, L.s, 0, () => {
    appWindow(ctx, -330, -140, 660, 280, 'kiss.js', { dark: true, body: '#1b1530' });
    const lines = [
      ['function kiss(you) {', '#c4b5fd'],
      ['  if (you.wantsUndo) {', '#c4b5fd'],
      ['    you.undo();', '#fca5a5'],
      ['  }', '#c4b5fd'],
      ['TypeError: undo is not a function', '#ff6b6b'],
      ["// Sorry, that's not in the code", '#6ee7b7'],
    ];
    lines.forEach(([l, col], i) => text(ctx, typed(l, (c.lt - i * 0.18) / 0.3), -310, -92 + i * 36, 22, { font: MONO, fill: col, align: 'left', weight: '700' }));
  });
});
cue(87.2, 89.35, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.15, 0.1);
  const n = Math.floor((c.lt / 1.9) * 64);
  at(ctx, 640, 230, L.s, 0, () => {
    ctx.translate(-640, -230);
    drawBoard(ctx, c.lt, { tiles: n, pieces: false });
  });
  const k = Math.abs(Math.sin(c.lt * 9));
  emoji(ctx, '\uD83D\uDD28', 870 - k * 60, 150 + k * 60, 110, { rot: -0.9 + k * 1.0 });
});
cue(89.3, 92.0, (ctx, f, c) => {
  const { x, y, tile } = BOARD;
  for (let i = 0; i < 64; i++) {
    const r = Math.floor(i / 8);
    const col = i % 8;
    const vx = (hash(i * 1.7) - 0.5) * 900;
    const vy = -300 - hash(i * 3.1) * 500;
    const lt = c.lt;
    const px = x + col * tile + vx * lt;
    const py = y + r * tile + vy * lt + 1700 * lt * lt;
    ctx.save();
    ctx.translate(px + tile / 2, py + tile / 2);
    ctx.rotate(lt * (hash(i) - 0.5) * 16);
    ctx.fillStyle = (r + col) % 2 ? '#7a4a2a' : '#f0d9b5';
    ctx.fillRect(-tile / 2, -tile / 2, tile, tile);
    ctx.restore();
  }
  emoji(ctx, '\uD83D\uDCA5', 640, 230, 260 * E.outCubic(clamp(c.lt / 0.3)), { alpha: 1 - clamp(c.lt / 0.7) });
  memeText(ctx, 'THEN BREAK IT', 640, 120, 90, { rot: -0.04, alpha: sm(0.1, 0.3, c.lt), fill: YELLOW });
});

// ---------------------------------------------------------------------------
// CHORUS 2
// ---------------------------------------------------------------------------
cue(92.3, 93.9, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.1, 0.4);
  const sc = lerp(2, 1, E.outCubic(clamp(c.lt / 0.16)));
  memeText(ctx, 'KISS ME,', 640, 80, 100, { rot: 0.03, sx: sc, sy: sc, alpha: L.a });
  memeText(ctx, 'MISS MY STOP', 640, 180, 108, { fill: '#fff', stroke: '#c0125f', rot: -0.02, sx: sc, sy: sc, alpha: L.a, maxW: 1100 });
  stamp(ctx, '(AGAIN)', 1030, 240, 48 * L.s, { rot: 0.2, color: YELLOW });
});
cue(93.8, 95.8, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 240, 150, L.s, -0.04, () => {
    card(ctx, -190, -64, 380, 128, { fill: '#16a34a', r: 18 });
    ctx.save();
    ctx.rotate(c.lt * 9);
    text(ctx, '\u21BB', -130, 0, 70, { fill: '#fff', weight: '900' });
    ctx.restore();
    text(ctx, 'Recalculating\u2026', 40, -14, 30, { fill: '#fff', weight: '900' });
    text(ctx, 'Turn around when possible', 40, 24, 16, { fill: '#d1fae5', weight: '700' });
  });
});
cue(95.8, 97.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83E\uDDD1\u200D\u2708\uFE0F', 1060, 215, 120 * L.s, { rot: Math.sin(c.lt * 8) * 0.1 });
  bubble(ctx, 'SIR. THIS IS THE\nWRONG TRAIN.', 780, 140, 1020, 205, { size: 32 });
});
cue(97.6, 99.5, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83D\uDE0D', 280, 160, 130 * L.s, { rot: Math.sin(c.lt * 7) * 0.15 });
  at(ctx, 850, 170, L.s, 0.03, () => {
    card(ctx, -190, -60, 380, 120, { fill: '#fff', r: 16 });
    text(ctx, 'DISTRACTION LEVEL', 0, -30, 22, { fill: INK, weight: '900' });
    rr(ctx, -160, -6, 320, 34, 17);
    fillStroke(ctx, '#e5e7eb', 4);
    rr(ctx, -160, -6, 320 * E.outCubic(clamp(c.lt / 0.8)), 34, 17);
    fillStroke(ctx, PINK, 4);
    text(ctx, '100% (EXCELLENT)', 0, 46, 18, { fill: PINK, weight: '900' });
  });
});
cue(99.5, 101.3, (ctx, f, c) => {
  const labels = ['5 MINUTES LATER', '2 HOURS LATER', '3 DAYS LATER'];
  const i = Math.min(2, Math.floor(c.lt / 0.6));
  const lt = c.lt - i * 0.6;
  const k = E.outBack(clamp(lt / 0.2));
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 90, W, 130);
  memeText(ctx, labels[i], 640, 155, 92, { fill: '#ffe14d', stroke: '#000', sx: k, sy: k, rot: (i - 1) * 0.02 });
  emoji(ctx, '\u23F0', 150, 155, 90, { rot: Math.sin(c.lt * 20) * 0.3 });
  emoji(ctx, '\u23F0', 1130, 155, 90, { rot: -Math.sin(c.lt * 20) * 0.3 });
});
cue(101.3, 103.3, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  bubble(ctx, 'NOT ME', 330, 170, 480, 340, { size: 44 });
  bubble(ctx, 'NOT ME', 950, 170, 800, 340, { size: 44 });
  emoji(ctx, '\uD83D\uDC46', 640, 130, 80 * L.s, { rot: Math.sin(c.lt * 8) * 0.2 });
});
cue(103.3, 105.2, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  stamp(ctx, 'TOTALLY NORMAL', 640, 130, 74 * L.s, { rot: 0.05, color: '#16a34a', alpha: L.a });
  emoji(ctx, '\uD83D\uDCBC', 230, 190, 90 * L.s);
  emoji(ctx, '\uD83E\uDDD0', 1050, 190, 90 * L.s);
  text(ctx, 'adult.exe has stopped responding', 640, 205, 26, { font: MONO, fill: '#fff', weight: '800', alpha: L.a });
});
cue(105.2, 108.5, (ctx, f, c) => {
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU + c.lt * 2;
    const r = 260 + Math.sin(c.lt * 3 + i) * 40;
    emoji(ctx, i % 2 ? '\uD83D\uDC96' : '\uD83D\uDC8B', 640 + Math.cos(a) * r, 330 + Math.sin(a) * r * 0.55, 48, { alpha: 0.9 * (1 - sm(2.6, 3.2, c.lt)) });
  }
});

// ---------------------------------------------------------------------------
// BREAKDOWN
// ---------------------------------------------------------------------------
cue(110.6, 113.7, (ctx, f, c) => {
  bubble(ctx, 'is this\nour stop?', 520, 330, 560, 420, { size: 30, fill: '#fff' });
});
cue(114.0, 117.0, (ctx, f, c) => {
  bubble(ctx, 'probably not.', 720, 330, 680, 420, { size: 30, fill: '#ffd1e6' });
});
cue(117.2, 121.2, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.4, 0.5);
  memeText(ctx, '(THE TRAIN LEFT.', 640, 90, 62, { sx: L.s, sy: L.s, alpha: L.a });
  memeText(ctx, 'THEY DID NOT NOTICE.)', 640, 160, 62, { fill: YELLOW, sx: L.s, sy: L.s, alpha: L.a });
});

// ---------------------------------------------------------------------------
// VERSE 3
// ---------------------------------------------------------------------------
cue(121.5, 123.8, (ctx, f, c) => {
  const k = clamp(c.lt / 0.5);
  const drop = (1 - E.outBack(k)) * -300;
  const L = life(c.lt, c.d, 0.3, 0.25);
  emoji(ctx, '\uD83D\uDCCD', 640, 360 + drop, 120);
  at(ctx, 640, 150, L.s, 0, () => {
    card(ctx, -260, -62, 520, 124, { fill: '#fff', r: 18 });
    text(ctx, '\uD83D\uDCCD THE PLACE YOU SUGGESTED', 0, -26, 26, { fill: INK, weight: '900' });
    text(ctx, '\u2605\u2605\u2605\u2605\u2605  5.0  \u2022  BOOKED \u2713', 0, 20, 26, { fill: '#f59e0b', weight: '900' });
  });
});
cue(123.7, 125.6, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  const k = E.outCubic(clamp(c.lt / 0.7));
  at(ctx, 640, 265, L.s, 0, () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 130, Math.PI / 2, Math.PI / 2 + Math.PI * k);
    ctx.closePath();
    fillStroke(ctx, PINK, 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 130, Math.PI / 2 + Math.PI, Math.PI / 2 + Math.PI + Math.PI * k);
    ctx.closePath();
    fillStroke(ctx, TEAL, 6);
    memeText(ctx, 'BLAME', 0, -158, 56, {});
    text(ctx, '50%', -70, 6, 40, { font: IMPACT, weight: '400', fill: '#fff' });
    text(ctx, '50%', 70, 6, 40, { font: IMPACT, weight: '400', fill: INK });
  });
  if (c.lt > 1.0) memeText(ctx, '(actually 100% the train)', 640, 440, 40, { alpha: sm(1, 1.3, c.lt), font: MARKER, fill: '#fff' });
});
cue(125.5, 127.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  const k = clamp(c.lt / 1.9);
  at(ctx, 640, 210, L.s, 0, () => {
    clockFace(ctx, 0, 0, 120, lerp(11, 18, E.inOut(k)));
  });
  emoji(ctx, k < 0.5 ? '\uD83C\uDF19' : '\u2600\uFE0F', 360, 150, 100 * L.s, { rot: Math.sin(c.lt * 3) * 0.15 });
  emoji(ctx, '\uD83D\uDE89', 920, 160, 100 * L.s);
  if (k > 0.85) text(ctx, '6:00 AM', 640, 380, 54, { font: IMPACT, weight: '400', fill: '#fff' });
});
cue(127.6, 129.8, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 210, L.s, 0.02, () => {
    card(ctx, -230, -130, 460, 260, { fill: '#fffbea', r: 12 });
    text(ctx, 'IMPORTANT THINGS TO DO', 0, -96, 24, { font: MARKER, fill: RED, weight: '800' });
    const items = ['kiss', 'kiss (again)', 'kiss (research)', 'go home'];
    items.forEach((it, i) => {
      const k = E.outBack(clamp((c.lt - 0.3 - i * 0.35) / 0.25));
      text(ctx, it, -170, -50 + i * 46, 30, { font: MARKER, fill: INK, align: 'left', weight: '700' });
      if (i < 3) text(ctx, '\u2611', 170, -50 + i * 46, 40 * k, { fill: '#16a34a' });
      else text(ctx, '\u2610', 170, -50 + i * 46, 40 * k, { fill: '#999' });
    });
  });
});
cue(129.7, 131.6, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 190, L.s, 0, () => {
    appWindow(ctx, -280, -90, 560, 180, 'KISSING.EXE (Not Responding)');
    rr(ctx, -240, -10, 480, 40, 20);
    fillStroke(ctx, '#e5e7eb', 4);
    const p = Math.min(0.99, c.lt * 1.5);
    rr(ctx, -240, -10, 480 * p, 40, 20);
    fillStroke(ctx, '#3b82f6', 4);
    text(ctx, `${Math.floor(p * 100)}%`, 0, 52, 26, { fill: INK, weight: '900' });
  });
  emoji(ctx, '\uD83C\uDF00', 940, 190, 80 * L.s, { rot: c.lt * 8 });
});
cue(131.5, 133.1, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83E\uDDEA', 760, 190, 130 * L.s, { rot: Math.sin(c.lt * 6) * 0.15 });
  for (let i = 0; i < 5; i++) emoji(ctx, '\uD83E\uDEE7', 760 + Math.sin(c.lt * 5 + i) * 20, 150 - ((c.lt * 90 + i * 30) % 130), 28, { alpha: 0.9 });
  emoji(ctx, '\uD83E\uDD7C', 520, 190, 120 * L.s);
  memeText(ctx, 'FOR SCIENCE', 640, 320, 90, { sx: L.s, sy: L.s, rot: -0.03, fill: '#7dffb0' });
});
function panel(ctx, x, y, w, h, bg, title, fn) {
  card(ctx, x, y, w, h, { fill: bg, r: 20, lw: 7 });
  ctx.save();
  rr(ctx, x, y, w, h, 20);
  ctx.clip();
  ctx.translate(x, y);
  fn();
  ctx.restore();
  card(ctx, x + 16, y + 14, 210, 44, { fill: '#000', r: 10, lw: 0, shadow: 0 });
  text(ctx, title, x + 121, y + 37, 24, { font: MONO, fill: '#fff', weight: '900' });
}
cue(133.0, 137.0, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.25, 0.25);
  const up = Math.abs(Math.sin(c.lt * 4));
  at(ctx, 330, 270, L.s, 0, () => {
    panel(ctx, -290, -170, 580, 340, '#ffb35c', 'GYM 07:00', () => {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(0, 260, 580, 80);
      blob(ctx, { x: 290, y: 250 - up * 8, s: 1.3, color: TANIA, expr: up > 0.5 ? 'shout' : 'grin', t: f.t, armL: 0.85, armR: 0.85, acc: ['headband', 'bat'], sq: up * 0.3 });
      dumbbell(ctx, 290, 120 - up * 26, 1.0, 0);
    });
  });
});
cue(135.2, 137.0, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.25, 0.2);
  at(ctx, 950, 270, L.s, 0, () => {
    panel(ctx, -290, -170, 580, 340, '#7fb1ff', 'BED 07:01', () => {
      bed(ctx, 290, 230, 1.4);
      blob(ctx, { x: 235, y: 170, s: 0.95, color: GUY, expr: 'smug', eyes: 'closed', t: f.t, armR: 1 });
      ctx.save();
      ctx.translate(390, 110);
      ctx.rotate(Math.sin(c.lt * 9) * 0.6 - 0.8);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -90);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.restore();
      emoji(ctx, '\uD83C\uDFBC', 450, 70 + Math.sin(c.lt * 4) * 10, 50);
    });
  });
});
cue(137.0, 138.95, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83E\uDD43', 380, 200, 150 * L.s, { rot: Math.sin(c.lt * 5) * 0.15 });
  memeText(ctx, '=', 640, 200, 130 * L.s, {});
  at(ctx, 900, 200, L.s, 0.05, () => {
    rr(ctx, -80, -100, 160, 200, 18);
    fillStroke(ctx, YELLOW, 6);
    text(ctx, 'PRE-', 0, -40, 40, { font: IMPACT, weight: '400', fill: INK });
    text(ctx, 'WORKOUT', 0, 6, 34, { font: IMPACT, weight: '400', fill: INK });
    emoji(ctx, '\uD83D\uDCAA', 0, 60, 54);
  });
  emoji(ctx, '\uD83E\uDD14', 640, 330, 90 * L.s);
});
flash(138.9, 0.4);
cue(138.9, 140.6, (ctx, f, c) => {
  const k = E.outBack(clamp(c.lt / 0.35));
  const L = life(c.lt, c.d, 0.01, 0.2);
  at(ctx, 640, 230 + (1 - k) * -200, k * L.s + 0.0001, 0.06, () => {
    card(ctx, -170, -190, 340, 380, { fill: '#fff', r: 8 });
    ctx.fillStyle = '#ffd9a0';
    ctx.fillRect(-150, -170, 300, 280);
    blob(ctx, { x: 0, y: -30, s: 1.3, color: TANIA, expr: 'grin', t: f.t, armL: 1, armR: 1, acc: ['headband', 'bat'] });
    emoji(ctx, '\uD83E\uDD43', 90, 30, 64, { rot: 0.3 });
    text(ctx, 'proof.jpg', 0, 150, 38, { font: MARKER, fill: INK, weight: '700' });
  });
});
cue(140.5, 142.5, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  const tilt = Math.sin(clamp(c.lt / 0.6) * Math.PI) * -0.4;
  emoji(ctx, '\u2615', 640, 210, 190 * L.s, { rot: tilt });
  if (c.lt > 0.5) {
    emoji(ctx, '\uD83D\uDCA5', 700, 150, 90 * E.outBack(clamp((c.lt - 0.5) / 0.2)), { alpha: 1 - clamp((c.lt - 0.9) / 0.4) });
    memeText(ctx, 'CHEERS', 640, 340, 100, { rot: -0.04, fill: '#ffd98a' });
  }
});
cue(142.4, 144.3, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 210, L.s, 0, () => {
    card(ctx, -270, -80, 540, 160, { fill: '#fff', r: 20 });
    text(ctx, 'EFFORT LEVEL', -240, -42, 30, { font: IMPACT, weight: '400', fill: INK, align: 'left' });
    rr(ctx, -240, -2, 480, 40, 20);
    fillStroke(ctx, '#e5e7eb', 4);
    rr(ctx, -240, -2, 480 * 0.07 * E.outCubic(clamp(c.lt / 0.5)), 40, 20);
    fillStroke(ctx, RED, 4);
    text(ctx, '7%  (MAXIMUM)', 0, 58, 26, { fill: RED, weight: '900' });
  });
  emoji(ctx, '\uD83D\uDC4D', 1010, 200, 110 * L.s, { rot: Math.sin(c.lt * 12) * 0.1 });
});

// ---------------------------------------------------------------------------
// BRIDGE
// ---------------------------------------------------------------------------
cue(144.4, 147.0, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.15, 0.25);
  const sc = lerp(3, 1, E.outCubic(clamp(c.lt / 0.25)));
  at(ctx, 640, 190, sc * L.s, -0.06, () => {
    card(ctx, -190, -140, 380, 280, { fill: '#fff', r: 18 });
    ctx.save();
    rr(ctx, -190, -140, 380, 280, 18);
    ctx.clip();
    ctx.fillStyle = RED;
    ctx.fillRect(-190, -140, 380, 70);
    ctx.restore();
    text(ctx, 'SATURDAY', 0, -104, 46, { font: IMPACT, weight: '400', fill: '#fff' });
    text(ctx, '5:30', 0, -4, 130, { font: IMPACT, weight: '400', fill: INK });
    text(ctx, 'PM', 0, 88, 54, { font: IMPACT, weight: '400', fill: RED });
  });
});
cue(146.8, 148.0, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83C\uDF5D', 390, 210, 130 * L.s, { rot: -0.15 });
  emoji(ctx, '\uD83C\uDFAC', 890, 210, 130 * L.s, { rot: 0.15 });
});
cue(147.8, 150.1, (ctx, f, c) => {
  const k = sm(0, 0.4, c.lt) * (1 - sm(c.d - 0.3, c.d, c.lt));
  const g = ctx.createRadialGradient(640, 400, 70, 640, 400, 560);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${0.82 * k})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  emoji(ctx, '\uD83D\uDCA1', 640, 70 + Math.sin(c.lt * 3) * 6, 90 * k);
  stamp(ctx, 'GUILTY', 960, 240, 100 * E.outBack(clamp((c.lt - 0.3) / 0.25)), { rot: 0.12 });
});
cue(150.0, 151.8, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  for (let i = 0; i < 3; i++) {
    const b = Math.max(0, Math.sin(c.lt * 7 - i * 0.8));
    ctx.beginPath();
    ctx.arc(560 + i * 80, 170 - b * 24, 26, 0, TAU);
    fillStroke(ctx, '#fff', 6);
  }
  stamp(ctx, 'FINDERS KEEPERS', 640, 255, 72 * L.s, { rot: -0.07, color: '#ffd23d' });
});
cue(151.7, 154.0, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  ctx.beginPath();
  ctx.ellipse(740, 505, 44, 24, 0.2, 0, TAU);
  ctx.fillStyle = `rgba(70,35,18,${0.6 * L.a})`;
  ctx.fill();
  emoji(ctx, '\uD83E\uDE79', 445, 440, 56 * L.s, { rot: 0.4 });
  at(ctx, 960, 330, L.s, 0.05, () => {
    card(ctx, -140, -34, 280, 68, { fill: '#fff', r: 14 });
    text(ctx, 'CHARACTER', 0, -4, 40, { font: IMPACT, weight: '400', fill: INK });
    text(ctx, '(a stain)', 0, 24, 16, { fill: '#777', weight: '800' });
  });
  ctx.beginPath();
  ctx.moveTo(830, 345);
  ctx.quadraticCurveTo(780, 400, 750, 485);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.globalAlpha *= L.a;
  ctx.stroke();
});
cue(153.9, 155.4, (ctx, f, c) => {
  const items = ['\uD83E\uDDE6', '\uD83E\uDE99', '\uD83C\uDF74', '\uD83D\uDD0B', '\uD83C\uDF7F', '\uD83D\uDCCE', '\uD83D\uDD11'];
  items.forEach((ch, i) => {
    const a = -Math.PI / 2 + (i - 3) * 0.32;
    const sp = 650 + hash(i) * 160;
    const px = 640 + Math.cos(a) * sp * c.lt * 1.4;
    const py = 470 + Math.sin(a) * sp * c.lt + 760 * c.lt * c.lt;
    emoji(ctx, ch, px, py, 56, { rot: c.lt * 6 * (i % 2 ? 1 : -1), alpha: 1 - clamp((c.lt - 1.0) / 0.4) });
  });
});
cue(155.2, 157.5, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 140, L.s, -0.02, () => {
    card(ctx, -230, -44, 460, 88, { fill: '#ffedd5', r: 18 });
    text(ctx, '\u2668\uFE0F HUMAN HEATING: ON', 0, -6, 34, { fill: '#c2410c', weight: '900' });
    text(ctx, '36.6\u00B0C  \u2022  FREE', 0, 26, 18, { fill: '#9a3412', weight: '800' });
  });
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    const x0 = 540 + i * 50;
    for (let y = 0; y < 90; y += 6) ctx.lineTo(x0 + Math.sin(y * 0.15 + c.lt * 8 + i) * 8, 400 - y);
    ctx.strokeStyle = `rgba(255,170,90,${0.7 * L.a})`;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
});
// Thermostat life: found -> broken -> hot
cue(157.4, 164.8, (ctx, f, c) => {
  const t = f.t;
  const L = life(c.lt, c.d, 0.25, 0.4);
  const broken = t >= 159.0 && t < 160.9;
  const hotK = sm(160.9, 164.0, t);
  const temp = Math.round(lerp(19, 27, hotK));
  const mode = broken ? 'broken' : hotK > 0.05 ? 'hot' : 'ok';
  thermostat(ctx, 900, 270, 1.15 * L.s, { temp, mode, t });
  if (t < 159.0) {
    stamp(ctx, 'FOUND IT', 900, 160, 52 * E.outBack(clamp((t - 157.6) / 0.25)), { rot: 0.08, color: '#16a34a' });
    emoji(ctx, '\uD83D\uDD0D', 780, 330, 80 * L.s, { rot: Math.sin(t * 6) * 0.2 });
  }
  if (broken) {
    ctx.save();
    ctx.translate(900, 270);
    ctx.rotate(-0.5);
    ctx.fillStyle = '#d9d2c3';
    ctx.fillRect(-140, -16, 280, 32);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let x = -140; x < 140; x += 22) ctx.fillRect(x, -16, 3, 32);
    ctx.restore();
    ctx.save();
    ctx.translate(900, 270);
    ctx.rotate(0.45);
    ctx.fillStyle = '#d9d2c3';
    ctx.fillRect(-140, -16, 280, 32);
    ctx.restore();
    at(ctx, 900, 400, E.outBack(clamp((t - 159.2) / 0.3)), -0.04, () => {
      card(ctx, -140, -30, 280, 60, { fill: '#fff', r: 6, lw: 4 });
      text(ctx, 'OUT OF ORDER', 0, 2, 38, { font: IMPACT, weight: '400', fill: RED });
    });
  }
});
cue(160.9, 162.7, (ctx, f, c) => {
  bubble(ctx, 'NO NEED\nFOR THAT', 400, 400, 300, 490, { size: 34, fill: '#ffd1e6' });
});
cue(162.6, 164.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  for (let i = 0; i < 6; i++) {
    const p = (c.lt * 0.8 + i / 6) % 1;
    emoji(ctx, i % 2 ? '\uD83D\uDD25' : '\uD83D\uDC95', 520 + i * 48, 400 - p * 200, 40, { alpha: 1 - p });
  }
});
cue(164.6, 168.8, (ctx, f, c) => {
  const msgs = [['so', 'L'], ['anyway', 'L'], ['u up?', 'L'], ['hello??', 'L'], ['\uD83D\uDC40', 'L'], ['seen \u2713\u2713', 'R']];
  msgs.forEach(([m, side], i) => {
    const k = E.outBack(clamp((c.lt - i * 0.55) / 0.25));
    if (k <= 0) return;
    const x = side === 'L' ? 200 + (i % 3) * 60 : 1090;
    at(ctx, x, 120 + i * 62, k, 0, () => {
      ctx.font = '800 28px ' + UI;
      const w = ctx.measureText(m).width + 40;
      rr(ctx, -w / 2, -26, w, 52, 26);
      fillStroke(ctx, side === 'L' ? '#e5e7eb' : '#3b82f6', 4);
      text(ctx, m, 0, 2, 28, { fill: side === 'L' ? INK : '#fff', weight: '800' });
    });
  });
  const dots = Math.floor(c.lt * 4) % 4;
  text(ctx, 'typing' + '.'.repeat(dots), 150, 440, 26, { font: MONO, fill: '#fff', weight: '800', align: 'left' });
});
cue(168.8, 170.6, (ctx, f, c) => {
  const n = 4 - Math.min(3, Math.floor(c.lt / ((60 / 124.25))));
  const lt = c.lt % (60 / 124.25);
  const k = E.outCubic(clamp(lt / 0.15));
  const sc = lerp(1.9, 1, k);
  ctx.beginPath();
  ctx.arc(640, 290, 170 * sc, 0, TAU);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fill();
  memeText(ctx, String(n), 640, 290, 280, { sx: sc, sy: sc, fill: YELLOW });
});
flash(170.35, 0.45);

// ---------------------------------------------------------------------------
// FINAL CHORUS
// ---------------------------------------------------------------------------
cue(170.4, 171.95, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.1, 0.4);
  const sc = lerp(2, 1, E.outCubic(clamp(c.lt / 0.16)));
  memeText(ctx, 'KISS ME,', 640, 70, 100, { fill: hsl(f.t * 120, 100, 70), sx: sc, sy: sc, rot: -0.03, alpha: L.a });
  memeText(ctx, 'MISS MY STOP', 640, 168, 112, { fill: hsl(f.t * 120 + 120, 100, 70), sx: sc, sy: sc, rot: 0.02, alpha: L.a, maxW: 1100 });
});
cue(171.9, 173.9, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 100, L.s, -0.03, () => {
    card(ctx, -260, -48, 520, 96, { fill: '#fff', r: 18 });
    text(ctx, 'THAT SITUATION', 0, -2, 68, { font: IMPACT, weight: '400', fill: INK });
  });
  stamp(ctx, 'RETIRED', 640, 108, 96 * E.outBack(clamp((c.lt - 0.4) / 0.2)), { rot: -0.15 });
  for (let i = 0; i < 10; i++) emoji(ctx, ['\uD83C\uDF89', '\uD83E\uDD73', '\uD83C\uDF8A'][i % 3], 120 + hash(i) * 1040, 180 + ((c.lt * 120 + i * 50) % 140), 40, { alpha: L.a });
});
cue(173.8, 175.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83D\uDC68\u200D\uD83C\uDF73', 260, 190, 130 * L.s, { rot: Math.sin(c.lt * 9) * 0.1 });
  emoji(ctx, '\uD83C\uDF73', 1020, 190, 120 * L.s, { rot: Math.sin(c.lt * 12) * 0.15 });
  for (let i = 0; i < 4; i++) emoji(ctx, '\uD83D\uDD25', 970 + i * 28, 250 - Math.abs(Math.sin(c.lt * 9 + i)) * 20, 36, { alpha: L.a });
  memeText(ctx, 'COOKING!', 640, 100, 100, { sx: L.s, sy: L.s, rot: 0.03, fill: '#ffb066' });
});
cue(175.6, 177.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 100, L.s, 0, () => {
    card(ctx, -270, -46, 540, 92, { fill: YELLOW, r: 14 });
    text(ctx, 'RAILWAY STATION', 0, 0, 58, { font: IMPACT, weight: '400', fill: INK });
    ctx.beginPath();
    ctx.arc(0, 0, 76, 0, TAU);
    ctx.moveTo(-54, -54);
    ctx.lineTo(54, 54);
    ctx.strokeStyle = RED;
    ctx.lineWidth = 14 * E.outCubic(clamp(c.lt / 0.3));
    ctx.stroke();
  });
  stamp(ctx, '\u23ED SKIP', 1010, 215, 64 * L.s, { rot: -0.05, color: '#fff' });
});
cue(177.6, 179.4, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 220, 160, L.s, -0.04, () => {
    card(ctx, -150, -64, 300, 128, { fill: '#fff', r: 18 });
    text(ctx, 'KISSES', 0, -34, 26, { fill: '#777', weight: '900' });
    text(ctx, c.lt > 0.7 ? '+1' : '', 0, 20, 76, { font: IMPACT, weight: '400', fill: PINK });
    text(ctx, c.lt > 0.7 ? '' : '1', 0, 20, 76, { font: IMPACT, weight: '400', fill: INK });
  });
});
cue(179.3, 181.3, (ctx, f, c) => {
  const k = E.outCubic(clamp(c.lt / 0.5));
  const o = 1 - sm(1.7, 2, c.lt);
  ctx.save();
  ctx.globalAlpha *= o;
  ctx.fillStyle = '#9d174d';
  ctx.fillRect(0, 0, 330 * k, 330);
  ctx.fillRect(W - 330 * k, 0, 330 * k, 330);
  ctx.strokeStyle = '#be185d';
  ctx.lineWidth = 6;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 36 * k, 0);
    ctx.lineTo(i * 36 * k, 330);
    ctx.moveTo(W - i * 36 * k, 0);
    ctx.lineTo(W - i * 36 * k, 330);
    ctx.stroke();
  }
  ctx.restore();
  for (let i = 0; i < 6; i++) emoji(ctx, '\uD83D\uDC40', 420 + i * 90 + Math.sin(c.lt * 3 + i) * 10, 230 - c.lt * c.lt * 30, 40, { alpha: o });
  stamp(ctx, 'NO AUDIENCE', 640, 110, 76 * E.outBack(clamp((c.lt - 0.3) / 0.25)), { rot: -0.04, color: '#fff', alpha: o });
});
cue(181.2, 183.4, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83D\uDCBF', 230, 180, 120 * L.s, { rot: c.lt * 6 });
  emoji(ctx, '\uD83C\uDFA7', 1050, 180, 130 * L.s, { rot: Math.sin(c.lt * 8) * 0.1 });
  for (let i = 0; i < 5; i++) emoji(ctx, '\uD83C\uDFB5', 340 + i * 150, 190 + Math.sin(c.lt * 6 + i) * 24, 44, { alpha: L.a });
  at(ctx, 640, 100, L.s, 0.02, () => {
    card(ctx, -260, -40, 520, 80, { fill: '#0d0618', r: 18 });
    text(ctx, '\u25B6 NOW PLAYING: THIS SONG', 0, -8, 28, { font: MONO, fill: '#4dffb0', weight: '900' });
    text(ctx, "DJ'S CHOICE (you chose it)", 0, 22, 16, { font: MONO, fill: '#9aa', weight: '700' });
  });
});
cue(183.3, 186.0, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  emoji(ctx, '\uD83C\uDF7D\uFE0F', 450, 170, 140 * L.s);
  emoji(ctx, '\uD83D\uDD6F\uFE0F', 340, 170, 80 * L.s, { rot: Math.sin(c.lt * 7) * 0.05 });
  emoji(ctx, '\uD83D\uDD6F\uFE0F', 560, 170, 80 * L.s, { rot: Math.sin(c.lt * 7 + 1) * 0.05 });
  stamp(ctx, 'ON TIME \u2713', 640, 100, 80 * E.outBack(clamp((c.lt - 0.5) / 0.25)), { rot: -0.05, color: '#16a34a' });
  emoji(ctx, '\u23F0', 920, 180, 110 * L.s, { rot: Math.sin(c.lt * 20) * 0.15 });
});

// DROP 2 echo
cue(189.9, 193.6, (ctx, f, c) => {
  for (let i = 3; i >= 0; i--) {
    const k = clamp((c.lt - i * 0.22) / 0.18);
    if (k <= 0) continue;
    const sc = 1 + i * 0.28 + (1 - E.outCubic(k)) * 1.2;
    memeText(ctx, 'ON TIME', 640, 330, 160, { fill: i === 0 ? '#4dffb0' : 'rgba(0,0,0,0)', stroke: i === 0 ? '#000' : `rgba(255,255,255,${0.5 - i * 0.12})`, sx: sc, sy: sc, lw: i === 0 ? 0.16 : 0.05, alpha: 1 - clamp((c.lt - 2.6) / 0.9) });
  }
});
flash(185.9, 0.5);

// ---------------------------------------------------------------------------
// OUTRO
// ---------------------------------------------------------------------------
function prohibit(ctx, x, y, ch, k, lt) {
  at(ctx, x, y, k, Math.sin(lt * 4) * 0.05, () => {
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, TAU);
    fillStroke(ctx, 'rgba(255,255,255,0.92)', 8);
    emoji(ctx, ch, 0, 0, 100);
    ctx.beginPath();
    ctx.arc(0, 0, 86, 0, TAU);
    ctx.moveTo(-61, -61);
    ctx.lineTo(61, 61);
    ctx.strokeStyle = RED;
    ctx.lineWidth = 14;
    ctx.stroke();
  });
}
cue(199.3, 203.5, (ctx, f, c) => {
  prohibit(ctx, 330, 190, '\uD83E\uDD90', E.outBack(clamp(c.lt / 0.35)) * (1 - sm(3.8, 4.1, c.lt)), c.lt);
  if (c.lt > 2.4) prohibit(ctx, 950, 190, '\uD83C\uDF44', E.outBack(clamp((c.lt - 2.4) / 0.35)) * (1 - sm(3.8, 4.1, c.lt)), c.lt);
  memeText(ctx, 'ABSOLUTELY NOT', 640, 330, 70, { alpha: sm(0.3, 0.6, c.lt) * (1 - sm(3.8, 4.1, c.lt)), rot: -0.02, fill: YELLOW });
});
cue(203.4, 206.7, (ctx, f, c) => {
  const L = life(c.lt, c.d);
  at(ctx, 640, 210, L.s, 0.03, () => {
    card(ctx, -240, -140, 480, 280, { fill: '#fffbea', r: 10 });
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-190, -140);
    ctx.lineTo(-190, 140);
    ctx.stroke();
    ctx.strokeStyle = '#bfdbfe';
    for (let y = -100; y < 140; y += 40) {
      ctx.beginPath();
      ctx.moveTo(-240, y);
      ctx.lineTo(240, y);
      ctx.stroke();
    }
    text(ctx, 'THE LIST', 0, -108, 34, { font: MARKER, fill: RED, weight: '900' });
    ['no seafood', 'no mushrooms', 'purple sofa', 'pillows (many)'].forEach((s, i) => {
      const k = E.outBack(clamp((c.lt - 0.3 - i * 0.5) / 0.25));
      text(ctx, s, -160, -58 + i * 48, 32, { font: MARKER, fill: INK, align: 'left', weight: '700' });
      text(ctx, '\u2713', 190, -58 + i * 48, 50 * k, { font: MARKER, fill: '#16a34a' });
    });
  });
});
cue(206.5, 210.1, (ctx, f, c) => {
  ['PROJECTOR', 'PILLOWS', 'PURPLE SOFA'].forEach((s, i) => {
    const k = E.outBack(clamp((c.lt - i * 0.55) / 0.3));
    at(ctx, 180, 130 + i * 70, k, -0.04 + i * 0.03, () => {
      card(ctx, -140, -28, 280, 56, { fill: '#fff', r: 12 });
      text(ctx, '\u2713 ' + s, 0, 2, 30, { font: IMPACT, weight: '400', fill: INK });
    });
  });
});
cue(210.0, 215.0, (ctx, f, c) => {
  const L = life(c.lt, c.d, 0.3, 0.8);
  memeText(ctx, "WE'LL SEE.", 640, 140, 150, { sx: L.s, sy: L.s, rot: -0.03, alpha: L.a, fill: '#fff' });
  emoji(ctx, '\uD83E\uDD1E', 1060, 240, 110 * L.s, { rot: Math.sin(c.lt * 5) * 0.15 });
});

// ---------------------------------------------------------------------------
// CREDITS
// ---------------------------------------------------------------------------
const CREDITS = [
  ['h', 'KISS ME, MISS MY STOP'],
  ['s', 'A 124 BPM PRODUCTION'],
  ['g', ''],
  ['h', 'STARRING'],
  ['n', 'TANIA TINDER as herself'],
  ['n', 'ORGY GUY as himself'],
  ['s', 'Perfectly sensible adults'],
  ['n', 'THE PURPLE SOFA as "guilty"'],
  ['g', ''],
  ['h', 'SPECIAL APPEARANCES'],
  ['n', 'BATGIRL (briefly)'],
  ['n', 'THE WRONG TRAIN'],
  ['n', 'THE THERMOSTAT (broken, allegedly)'],
  ['n', 'A CHESS BOARD (retired)'],
  ['g', ''],
  ['h', 'NO SEAFOOD WERE HARMED'],
  ['s', 'NO MUSHROOMS EITHER'],
  ['g', ''],
  ['s', 'Song made with Suno. Nonsense added locally.'],
  ['g', ''],
  ['e', 'THE END'],
];
const LINE_H = { h: 74, s: 52, n: 56, g: 40, e: 120 };
const OFFS = [];
let acc = 0;
CREDITS.forEach(([k]) => {
  OFFS.push(acc);
  acc += LINE_H[k];
});
cue(215.0, 232.4, (ctx, f, c) => {
  const t = f.t;
  ctx.fillStyle = `rgba(7,3,26,${0.55 * sm(0, 1, c.lt)})`;
  ctx.fillRect(0, 0, W, H);
  const y0 = H + 40;
  const D = y0 + OFFS[OFFS.length - 1] - H * 0.46;
  const scroll = E.inOut(clamp((t - 215.3) / 14.0)) * D;
  CREDITS.forEach(([kind, str], i) => {
    const y = y0 + OFFS[i] - scroll;
    if (y < -60 || y > H + 60 || !str) return;
    if (kind === 'h') memeText(ctx, str, 640, y, 54, { fill: YELLOW, maxW: 1000 });
    else if (kind === 's') text(ctx, str, 640, y, 28, { font: MONO, fill: '#fff', weight: '800' });
    else if (kind === 'n') memeText(ctx, str, 640, y, 40, { maxW: 1000 });
    else if (kind === 'e') {
      const p = Math.sin(t * 3) * 0.02;
      memeText(ctx, str, 640, y, 130, { fill: '#fff', rot: p });
    }
  });
  const fade = sm(231.2, 232.3, t);
  if (fade > 0) {
    ctx.fillStyle = `rgba(0,0,0,${fade})`;
    ctx.fillRect(0, 0, W, H);
  }
});
