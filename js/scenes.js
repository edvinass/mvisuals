// Per-section stages: backgrounds + the recurring cast (Tania, Guy, the Purple Sofa, the train).
import {
  W, H, TAU, INK, PINK, TEAL, PURPLE, YELLOW, CYAN, RED, E, clamp, lerp, sm, hash, hsl, text, memeText, emoji, rr, fillStroke, heart, life,
} from './util.js';
import { blob, sofa, trainCar, TANIA, GUY } from './art.js';
import { bgIntro, bgApp, bgTrain, lampPosts, stopSign, bgKaleido, bgChess, bgNight, bgMap, bgLiving, sparkles, speedLines } from './backgrounds.js';
import { BEAT0, BPM } from './timeline.js';

export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;

// step-function keyframes: kf(t, [[t0, v], ...]) -> value of the last keyframe with t0 <= t
export function kf(t, frames) {
  let v = frames[0][1];
  for (const [t0, val] of frames) {
    if (t >= t0) v = val;
    else break;
  }
  return v;
}

const barIndex = (t) => Math.floor((t - BEAT0) / BAR);

// ---------------------------------------------------------------------------
// Train stage (chorus scenes)
// ---------------------------------------------------------------------------
const COMMUTERS_L = ['\uD83E\uDDD1\u200D\uD83D\uDCBC', '\uD83E\uDD71', '\uD83E\uDDD0', '\uD83D\uDE10'];
const COMMUTERS_R = ['\uD83D\uDC15', '\uD83E\uDD86', '\uD83D\uDC08', '\uD83E\uDD89'];

export const SIGNS = [
  { t: 46.7, label: 'YOUR STOP' },
  { t: 52.3, label: 'ALMOST YOUR STOP' },
  { t: 57.9, label: 'NEXT STOP: KISSING' },
  { t: 91.9, label: 'YOUR STOP (AGAIN)' },
  { t: 97.7, label: 'STOP STOP STOP' },
  { t: 103.5, label: 'WRONG STOP' },
  { t: 169.9, label: 'RETIRED STOP' },
  { t: 175.6, label: 'SKIP THIS STATION' },
  { t: 181.4, label: 'NO MORE STOPS' },
];

function kissWindow(f, { shades = false, party = false, kiss = 1 } = {}) {
  return (ctx, w, h) => {
    const { t, kick, beat } = f;
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, '#ff9ec7');
    g.addColorStop(1, '#ffd9a8');
    ctx.fillStyle = g;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    const lean = 0.2 + 0.08 * Math.sin(beat * Math.PI);
    const tAcc = party ? ['party'] : shades ? ['shades'] : [];
    const gAcc = party ? ['party'] : shades ? ['shades'] : ['horns'];
    blob(ctx, { x: -48, y: 30, s: 0.6, color: TANIA, rot: lean * kiss, expr: 'kiss', eyes: shades ? 'open' : 'closed', acc: ['bat', ...tAcc.filter((a) => a !== 'party'), ...(party ? ['party'] : [])], t, sq: kick * 0.5, armR: 0.2 });
    blob(ctx, { x: 48, y: 30, s: 0.6, color: GUY, rot: -lean * kiss, expr: 'kiss', eyes: shades ? 'open' : 'closed', acc: gAcc, t, sq: kick * 0.5, flip: false, armL: 0.2 });
  };
}

function commuterWindow(list, idx, f, flipLook = 1) {
  return (ctx, w, h) => {
    const bar = barIndex(f.t);
    const ch = list[Math.abs(bar + idx) % list.length];
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, '#cfd9ff');
    g.addColorStop(1, '#fff3c4');
    ctx.fillStyle = g;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    const shock = f.beat % 4 > 2 ? 0.0 : 1;
    emoji(ctx, ch, 0, 8 + Math.sin(f.t * 5 + idx) * 3, 62 + shock * 4, { rot: Math.sin(f.t * 2 + idx) * 0.1 });
    if (f.secT > 0.5) emoji(ctx, '\uD83D\uDC40', flipLook * 36, -30, 22);
  };
}

export function trainStage(ctx, f, o = {}) {
  const { t, kick } = f;
  const {
    top = '#2b1055', bot = '#ff6fb5', sun = YELLOW, rainbow = false, night = false, sofaOnRoof = false, shades = false, party = false,
    sign = 'NOT YOUR STOP', signs = SIGNS, y = 430, scale = 1.1, withBg = true, kiss = 1, sparkle = false,
  } = o;
  if (withBg) bgTrain(ctx, f, { top, bot, sun, rainbow, night });
  if (withBg) speedLines(ctx, t, 14, 0.12, '#fff', 120, 500);
  ctx.save();
  ctx.translate(W / 2, y);
  ctx.scale(scale, scale);
  if (sofaOnRoof) {
    const hop = Math.max(0, Math.sin(f.beat * Math.PI)) * 10;
    sofa(ctx, { x: 30, y: -178 - hop * 0.3, s: 0.62, mood: f.secT < 4 ? 'proud' : 'smug', t, sq: kick * 0.6 });
    blob(ctx, { x: -250, y: -158, s: 0.5, color: TANIA, expr: 'grin', t, armL: Math.sin(f.beat * Math.PI) * 0.5 + 0.5, acc: party ? ['party'] : ['halo'] });
    blob(ctx, { x: 310, y: -158, s: 0.5, color: GUY, expr: 'grin', t, armR: Math.sin(f.beat * Math.PI + 1) * 0.5 + 0.5, acc: party ? ['party'] : ['horns'], flip: true });
  }
  trainCar(ctx, {
    x: 0, y: 0, t, sign, color: rainbow ? hsl(f.t * 40 + 250, 70, 45) : '#6d28d9', stripe: rainbow ? hsl(f.t * 40, 90, 60) : PINK,
    windows: [{ k: 1, fn: commuterWindow(COMMUTERS_L, 0, f, 1) }, { k: 2.1, fn: kissWindow(f, { shades, party, kiss }) }, { k: 1, fn: commuterWindow(COMMUTERS_R, 1, f, -1) }],
  });
  ctx.restore();
  lampPosts(ctx, t, 900);
  // rushing station signs (foreground)
  for (const s of signs) {
    const dt = t - s.t;
    if (dt > -0.1 && dt < 1.9) stopSign(ctx, W + 280 - dt * 1750, 520, s.label, 0);
  }
  // hearts / kisses float out of the window
  for (let j = 0; j < 8; j++) {
    const p = (t * 0.7 + j / 8) % 1;
    const x = W / 2 + Math.sin(j * 2.3 + p * 4) * 70 + (j - 4) * 22;
    const yy = y - 120 - p * 230;
    emoji(ctx, j % 3 ? '\uD83D\uDC96' : '\uD83D\uDC8B', x, yy, 24 + hash(j) * 22, { alpha: 1 - p, rot: Math.sin(j + t * 3) * 0.3 });
  }
  if (sparkle) sparkles(ctx, t, 16, '#fff', 0, 480);
}

// ---------------------------------------------------------------------------
// Drops
// ---------------------------------------------------------------------------
function slam(ctx, f, words, startT, { y = 190, size = 150, colors = [YELLOW, '#fff', CYAN, PINK] } = {}) {
  const b0 = barIndex(startT + 0.05);
  const bi = barIndex(f.t) - b0;
  if (bi < 0) return;
  const w = words[Math.min(bi, words.length - 1)];
  const barStart = BEAT0 + barIndex(f.t) * BAR;
  const age = f.t - barStart;
  const k = E.outCubic(clamp(age / 0.16));
  const sc = lerp(1.8, 1, k);
  const rot = (bi % 2 ? 1 : -1) * 0.05;
  memeText(ctx, w, W / 2, y, size, { fill: colors[bi % colors.length], rot, sx: sc, sy: sc, maxW: 1100, alpha: clamp(age / 0.04) });
}

function dancers(ctx, f, { y = 560, sofaS = 1.0, sofaY = 560, acc = ['shades'] } = {}) {
  const { t, kick, beat } = f;
  const up = Math.abs(Math.sin(beat * Math.PI));
  blob(ctx, { x: 230, y: y - up * 36, s: 1.15, color: TANIA, expr: 'grin', t, sq: kick * 0.6, armL: up, armR: 1 - up, acc: ['bat', ...acc.filter((a) => a !== 'horns')] });
  blob(ctx, { x: 1050, y: y - (1 - up) * 36, s: 1.15, color: GUY, expr: 'grin', t, sq: kick * 0.6, armL: 1 - up, armR: up, acc: ['horns', ...acc] });
  sofa(ctx, { x: W / 2, y: sofaY - up * 22, s: sofaS, mood: 'proud', t, sq: kick, rot: Math.sin(beat * Math.PI * 0.5) * 0.05 });
}

function stageDrop1(ctx, f) {
  bgKaleido(ctx, f, { hue: 300, strobe: 0.5 });
  slam(ctx, f, ['WRONG TRAIN', 'WRONG STOP', 'WRONG DECISION', 'RIGHT PERSON', 'CLOSE TO ME', 'MISS MY STOP', 'MISS MY STOP'], 62.3);
  dancers(ctx, f, { y: 530, sofaS: 1.05, sofaY: 540 });
  for (let i = 0; i < 10; i++) {
    const p = (f.t * 0.45 + i / 10) % 1;
    const x = hash(i * 3.3) * W;
    emoji(ctx, ['\uD83D\uDE86', '\uD83D\uDC8B', '\uD83D\uDECB\uFE0F', '\uD83D\uDE82', '\uD83D\uDC96'][i % 5], x, H + 80 - p * (H + 200), 54 + hash(i) * 34, { rot: p * 6 * (i % 2 ? 1 : -1), alpha: 0.9 });
  }
}

function stageDrop2(ctx, f) {
  const { t, kick, beat } = f;
  bgKaleido(ctx, f, { hue: 160, strobe: 0.9 });
  slam(ctx, f, ['SAME TRAIN', 'SAME SOFA', 'NO AUDIENCE', 'NO SEAFOOD', 'NO MUSHROOMS', 'ONE MORE KISS', 'ONE MORE KISS'], 186.0, { y: 150, size: 140 });
  speedLines(ctx, t, 24, 0.35, '#fff', 280, 700);
  ctx.save();
  ctx.translate(W / 2, 540);
  ctx.scale(1.0, 1.0);
  const up = Math.abs(Math.sin(beat * Math.PI));
  sofa(ctx, { x: 40, y: -190 - up * 14, s: 0.7, mood: 'proud', t, sq: kick });
  blob(ctx, { x: -280, y: -150 - up * 20, s: 0.6, color: TANIA, expr: 'shout', t, armL: up, armR: 1, acc: ['bat', 'party'] });
  blob(ctx, { x: 360, y: -150 - (1 - up) * 20, s: 0.6, color: GUY, expr: 'shout', t, armL: 1, armR: up, acc: ['horns', 'party'], flip: true });
  trainCar(ctx, {
    x: 0, y: 0, t, sign: 'EXPRESS TO DINNER', color: hsl(t * 60 + 250, 70, 45), stripe: hsl(t * 60, 95, 60), speed: 1.4,
    windows: [{ k: 1, fn: commuterWindow(COMMUTERS_L, 2, f, 1) }, { k: 2.1, fn: kissWindow(f, { party: true }) }, { k: 1, fn: commuterWindow(COMMUTERS_R, 3, f, -1) }],
  });
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Individual stages
// ---------------------------------------------------------------------------
function stageIntro(ctx, f) {
  const { t, kick } = f;
  bgIntro(ctx, f);
  const rise = E.outBack(clamp((t - 1.2) / 1.1));
  sofa(ctx, { x: W / 2, y: 545 + (1 - rise) * 320, s: 1.0, mood: t < 8.5 ? 'smug' : t < 12 ? 'shock' : 'proud', t, sq: kick * 0.7 });
  const inK = E.outBack(clamp((t - 4.2) / 0.9));
  const ax = -140 + inK * 380;
  const bx = W + 140 - inK * 380;
  blob(ctx, { x: ax, y: 540, s: 1.1, color: TANIA, expr: t < 8 ? 'smile' : 'grin', look: 1, t, sq: kick * 0.5, armL: t > 10 ? Math.abs(Math.sin(f.beat * Math.PI)) : 0, acc: ['bat'] });
  blob(ctx, { x: bx, y: 540, s: 1.1, color: GUY, expr: t < 8 ? 'sweat' : 'grin', look: -1, t, sq: kick * 0.5, armR: t > 10 ? Math.abs(Math.sin(f.beat * Math.PI + 1)) : 0, acc: ['horns'], flip: true });
}

const V1_PRE = { G: [1105, 470, 1.45], T: [890, 470, 1.45] };
const V1_POST = { G: [460, 450, 1.55], T: [820, 450, 1.55] };

function stageV1(ctx, f) {
  const { t, kick } = f;
  bgApp(ctx, f, { hue: 330 });
  const mv = E.outCubic(clamp((t - 32.6) / 0.6));
  const pos = (k) => V1_PRE[k].map((v, i) => lerp(v, V1_POST[k][i], mv));
  const [gx, gy, gs] = pos('G');
  let [tx, ty, ts] = pos('T');
  // Tania runs off to change into Batgirl, then flies back in
  let tAcc = kf(t, [[0, []], [20.7, ['monocle']], [24.9, []]]);
  if (t >= 35.0 && t < 36.2) tx = lerp(tx, W + 220, E.inCubic(clamp((t - 35.0) / 0.8)));
  let flyY = 0;
  if (t >= 36.2) {
    const k = clamp((t - 36.2) / 0.7);
    tx = lerp(-220, V1_POST.T[0], E.outCubic(k));
    flyY = -Math.sin(k * Math.PI) * 120;
    tAcc = ['bat', 'cape'];
  }
  const gAcc = kf(t, [[0, []], [32.7, ['horns', 'leaf']], [39.2, ['flowers', 'wings']]]);
  const gExpr = kf(t, [[0, 'smile'], [18.0, 'o'], [18.8, 'sweat'], [22.4, 'smile'], [24.9, 'grin'], [28.2, 'smug'], [32.7, 'o'], [34.0, 'shout'], [36.2, 'sweat'], [39.2, 'grin'], [43.0, 'smug']]);
  const gEyes = kf(t, [[0, 'open'], [18.0, 'wide'], [22.4, 'open'], [32.7, 'wide'], [36.2, 'open']]);
  const tExpr = kf(t, [[0, 'smug'], [24.9, 'grin'], [32.7, 'o'], [35.0, 'smile'], [36.2, 'grin'], [43.0, 'flat']]);
  const lookT = t < 32 ? -1 : 0;
  blob(ctx, { x: tx, y: ty + flyY, s: ts, color: TANIA, expr: tExpr, eyes: 'open', look: lookT, t, sq: kick * 0.5, acc: tAcc, armL: t > 36.2 && t < 37.5 ? 1 : 0, rot: t >= 36.2 ? Math.sin(clamp((t - 36.2) / 0.7) * Math.PI) * -0.3 : 0 });
  blob(ctx, { x: gx, y: gy, s: gs, color: GUY, expr: gExpr, eyes: gEyes, look: t < 32 ? 1 : 0, t, sq: kick * 0.5, acc: gAcc, armL: t >= 39.2 && t < 41.5 ? 1 : 0, flip: false, rot: t >= 33.5 && t < 36 ? Math.sin(t * 22) * 0.07 : 0 });
}

function stageC1(ctx, f) {
  trainStage(ctx, f, { top: '#2b1055', bot: '#ff6fb5', sun: YELLOW, signs: SIGNS.slice(0, 3) });
}

function stageV2(ctx, f) {
  const { t, kick } = f;
  bgChess(ctx, f);
  // far apart on "miles apart", closer for chess
  const apart = sm(77.7, 78.2, t) * (1 - sm(79.6, 80.1, t));
  const tx = lerp(250, 70, apart);
  const gx = lerp(1030, 1210, apart);
  const tExpr = kf(t, [[0, 'flat'], [77.9, 'frown'], [79.8, 'smug'], [83.6, 'grin'], [85.3, 'flat'], [89.3, 'o']]);
  const gExpr = kf(t, [[0, 'sweat'], [79.8, 'o'], [81.6, 'sweat'], [83.6, 'frown'], [85.3, 'sweat'], [87.2, 'grin'], [89.3, 'shout']]);
  blob(ctx, { x: tx, y: 520, s: 1.0, color: TANIA, expr: tExpr, eyes: t >= 89.3 ? 'wide' : 'open', look: 0.5, t, sq: kick * 0.4, acc: t > 75.5 && t < 77.9 ? ['monocle'] : [] });
  blob(ctx, { x: gx, y: 520, s: 1.0, color: GUY, expr: gExpr, eyes: t >= 89.3 ? 'wide' : 'open', look: -0.5, t, sq: kick * 0.4, acc: t >= 87.2 && t < 89.3 ? ['headband', 'goggles'] : ['horns'], flip: true, armR: t >= 87.2 && t < 89.3 ? Math.abs(Math.sin(t * 9)) : 0 });
}

function stageC2(ctx, f) {
  trainStage(ctx, f, { top: '#ff5e3a', bot: '#ffd36b', sun: '#ff4fa3', shades: true, signs: SIGNS.slice(3, 6), sign: 'STILL NOT YOUR STOP', sparkle: true });
}

function stageBrk(ctx, f) {
  const { t, kick } = f;
  bgNight(ctx, f, { moonX: 1000 });
  // far away platform + parked train that eventually leaves without them
  ctx.fillStyle = '#150b30';
  ctx.fillRect(0, 470, W, H - 470);
  ctx.fillStyle = '#0d0618';
  ctx.fillRect(0, 466, W, 8);
  const depart = Math.max(0, t - 113.9);
  const tx = 760 + depart * depart * 70;
  ctx.save();
  ctx.translate(tx, 395);
  ctx.scale(0.55, 0.55);
  trainCar(ctx, { x: 0, y: 0, t: t * 0.5, sign: depart > 0 ? 'BYE' : 'LAST TRAIN', color: '#5b21b6', stripe: PINK, speed: depart > 0 ? 1 + depart : 0.1 });
  ctx.restore();
  ctx.fillStyle = '#2a1250';
  ctx.fillRect(0, 510, W, H - 510);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 518, W, 8);
  // street lamp with pool of light
  const lx = 330;
  ctx.fillStyle = '#0d0618';
  ctx.fillRect(lx - 6, 150, 12, 380);
  ctx.beginPath();
  ctx.arc(lx, 150, 20, 0, TAU);
  ctx.fillStyle = '#fff7b0';
  ctx.shadowColor = '#fff7b0';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.shadowBlur = 0;
  const g = ctx.createRadialGradient(lx, 300, 10, lx, 460, 360);
  g.addColorStop(0, 'rgba(255,240,170,0.28)');
  g.addColorStop(1, 'rgba(255,240,170,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 100, 760, 620);
  // bench
  rr(ctx, 340, 570, 480, 30, 10);
  fillStroke(ctx, '#8a5a3a', 6);
  rr(ctx, 360, 490, 440, 24, 10);
  fillStroke(ctx, '#8a5a3a', 6);
  for (const x of [380, 780]) {
    ctx.fillStyle = INK;
    ctx.fillRect(x, 596, 14, 50);
  }
  const lean = 0.16 + 0.05 * Math.sin(f.beat * Math.PI * 0.5);
  blob(ctx, { x: 505, y: 500, s: 1.3, color: TANIA, rot: lean, expr: 'kiss', eyes: 'closed', t, sq: kick * 0.3, armR: 0.3 });
  blob(ctx, { x: 655, y: 500, s: 1.3, color: GUY, rot: -lean, expr: 'kiss', eyes: 'closed', t, sq: kick * 0.3, acc: ['horns'], armL: 0.3 });
  for (let j = 0; j < 6; j++) {
    const p = (t * 0.25 + j / 6) % 1;
    emoji(ctx, j % 2 ? '\uD83D\uDC96' : '\u2728', 580 + Math.sin(j * 3 + p * 3) * 50, 430 - p * 260, 30 + hash(j) * 14, { alpha: Math.sin(p * Math.PI) });
  }
}

function stageV3(ctx, f) {
  const { t, kick } = f;
  bgMap(ctx, f, { dawn: sm(125.2, 127.4, t) });
  const tExpr = kf(t, [[0, 'smile'], [127.6, 'grin'], [129.7, 'smug'], [133, 'grin']]);
  const gExpr = kf(t, [[0, 'smile'], [125.5, 'o'], [127.6, 'smile'], [129.7, 'grin'], [131.5, 'smug']]);
  const lookOff = Math.sin(t * 1.2) * 0.5;
  blob(ctx, { x: 190, y: 530, s: 1.2, color: TANIA, expr: tExpr, look: 0.6 + lookOff, t, sq: kick * 0.4, acc: ['bat'] });
  blob(ctx, { x: 1090, y: 530, s: 1.2, color: GUY, expr: gExpr, look: -0.6 - lookOff, t, sq: kick * 0.4, acc: t >= 131.5 && t < 133.0 ? ['horns', 'goggles'] : ['horns'], flip: true });
}

export function huggy(t) {
  return Math.max(sm(155.0, 155.6, t) * (1 - sm(157.2, 157.6, t)), sm(162.4, 162.9, t) * (1 - sm(164.4, 164.8, t)));
}

function stageBridge(ctx, f) {
  const { t, kick } = f;
  const dim = kf(t, [[0, 0.25], [147.7, 0.45], [150.0, 0.25]]);
  bgLiving(ctx, f, { dim: t > 166 ? 0.35 : dim * 0.6 });
  const mood = kf(t, [[0, 'neutral'], [147.8, 'guilty'], [151.7, 'neutral'], [155.2, 'shock'], [157.4, 'smug'], [159.0, 'smug'], [162.6, 'proud'], [164.6, 'smug'], [167, 'shock']]);
  const shake = t > 166 ? Math.sin(t * 60) * (t - 166) * 0.9 : 0;
  const hop = t >= 150.0 && t < 151.7 ? Math.abs(Math.sin((t - 150) * 9)) * 14 : 0;
  sofa(ctx, { x: W / 2 + shake, y: 485 - hop, s: 1.25, mood, t, sq: kick * 0.5, rot: t >= 151.7 && t < 153.9 ? Math.sin(t * 7) * 0.03 : 0, look: Math.sin(t * 0.8) });
  const h = huggy(t);
  const tx = lerp(250, 560, h);
  const gx = lerp(1030, 720, h);
  const tExpr = kf(t, [[0, 'smile'], [147.8, 'smug'], [155.2, 'kiss'], [157.4, 'smile'], [160.9, 'flat'], [162.6, 'kiss'], [164.6, 'smug']]);
  const gExpr = kf(t, [[0, 'smile'], [147.8, 'sweat'], [150.0, 'grin'], [155.2, 'kiss'], [157.4, 'o'], [159.0, 'whistle'], [160.9, 'sweat'], [162.6, 'kiss'], [164.6, 'grin']]);
  const hugLean = h * 0.22;
  blob(ctx, { x: tx, y: 560 - h * 80, s: 1.0, color: TANIA, expr: tExpr, eyes: h > 0.5 ? 'closed' : 'open', look: 0.7, rot: hugLean, t, sq: kick * 0.4, armL: h, armR: h, acc: ['bat'] });
  blob(ctx, { x: gx, y: 560 - h * 80, s: 1.0, color: GUY, expr: gExpr, eyes: h > 0.5 ? 'closed' : 'open', look: -0.7, rot: -hugLean, t, sq: kick * 0.4, armL: h, armR: h, acc: ['horns'], flip: true });
}

function stageC3(ctx, f) {
  trainStage(ctx, f, { rainbow: true, sofaOnRoof: true, party: true, signs: SIGNS.slice(6, 9), sign: 'EXPRESS TO DINNER', sparkle: true });
}

function pillow(ctx, x, y, s, col, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  rr(ctx, -42, -42, 84, 84, 20);
  fillStroke(ctx, col, 5);
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, TAU);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();
  ctx.restore();
}

function stageOutro(ctx, f) {
  const { t, kick } = f;
  const dusk = sm(199, 215, t);
  bgLiving(ctx, f, { dim: 0.35 + dusk * 0.2, warm: 1.2 });
  // projector beam (from 206.5)
  const beam = sm(205.8, 206.8, t) * (1 - sm(209.9, 210.6, t));
  if (beam > 0) {
    const sx0 = W / 2 - 230;
    const sy0 = 70;
    const sw = 460;
    const sh = 240;
    ctx.save();
    ctx.globalAlpha = beam;
    // light cone from a ceiling projector on the right, onto the screen
    ctx.beginPath();
    ctx.moveTo(1010, 78);
    ctx.lineTo(sx0 + sw, sy0 + 6);
    ctx.lineTo(sx0 + sw, sy0 + sh - 6);
    ctx.closePath();
    const g = ctx.createLinearGradient(1010, 0, sx0 + sw, 0);
    g.addColorStop(0, 'rgba(255,245,200,0.5)');
    g.addColorStop(1, 'rgba(255,245,200,0.1)');
    ctx.fillStyle = g;
    ctx.fill();
    rr(ctx, sx0, sy0, sw, sh, 10);
    fillStroke(ctx, '#10062a', 7, '#f1e6c8');
    // the film: a train, obviously
    ctx.save();
    rr(ctx, sx0, sy0, sw, sh, 10);
    ctx.clip();
    const tx = (((t - 206.5) * 120) % 640) - 90;
    emoji(ctx, '\uD83D\uDE86', sx0 + tx, sy0 + 130, 96);
    emoji(ctx, '\uD83D\uDC8B', sx0 + tx - 110, sy0 + 130, 46, { rot: -0.3 });
    memeText(ctx, 'THE FILM', sx0 + sw / 2, sy0 + 40, 36, { fill: '#fff' });
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 12; i++) ctx.fillRect(sx0 + hash(i + Math.floor(t * 12)) * sw, sy0, 2, sh);
    ctx.restore();
    // projector body
    rr(ctx, 1010, 58, 78, 44, 8);
    fillStroke(ctx, '#2a2144', 5);
    ctx.beginPath();
    ctx.arc(1010, 80, 13, 0, TAU);
    fillStroke(ctx, '#9ad7ff', 3);
    ctx.restore();
  }
  // sofa + the two lovebirds sinking into it
  const sx = W / 2;
  const sy = 490;
  sofa(ctx, { x: sx, y: sy, s: 1.4, mood: kf(t, [[0, 'neutral'], [203.4, 'proud'], [210.0, 'smug']]), t, sq: kick * 0.3, look: Math.sin(t * 0.9) * 0.6 });
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, sy + 18);
  ctx.clip();
  const sway = Math.sin(f.beat * Math.PI * 0.5) * 0.04;
  blob(ctx, { x: sx - 190, y: sy - 78, s: 0.95, color: TANIA, expr: 'smile', look: 0.2, rot: 0.16 + sway, t, acc: ['bat'] });
  blob(ctx, { x: sx + 190, y: sy - 78, s: 0.95, color: GUY, expr: 'smile', look: -0.2, rot: -0.16 - sway, t, acc: ['horns'], flip: true });
  ctx.restore();
  // pillows pop onto the sofa (from 206.5)
  const pops = [[sx - 280, sy - 30, '#ff4fa3', -0.3, 207.0], [sx + 275, sy - 34, '#ffe14d', 0.25, 207.4], [sx - 230, sy + 22, '#27e1ff', 0.4, 207.8], [sx + 230, sy + 22, '#6bd66b', -0.2, 208.2], [sx, sy + 8, '#ff9a3d', 0.1, 208.6]];
  for (const [px, py, col, rot, t0] of pops) {
    const k = E.outBack(clamp((t - t0) / 0.35));
    if (k > 0) pillow(ctx, px, py - (1 - k) * 200, 0.55 * k, col, rot);
  }
}

function stageCredits(ctx, f) {
  const { t } = f;
  trainStage(ctx, f, { night: true, top: '#07031a', bot: '#2a1565', sun: '#f4f1ff', sofaOnRoof: true, signs: [], sign: 'THE END?', y: 400, scale: 0.8 });
}

const STAGES = {
  intro: stageIntro, v1: stageV1, c1: stageC1, drop1: stageDrop1, v2: stageV2, c2: stageC2, brk: stageBrk, v3: stageV3, bridge: stageBridge, c3: stageC3,
  drop2: stageDrop2, outro: stageOutro, credits: stageCredits,
};

export function drawStage(ctx, f) {
  (STAGES[f.sec.id] || stageIntro)(ctx, f);
}

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------
const ZOOMS = [
  { t0: 54.5, t1: 56.1, z: 2.2, cx: 640, cy: 410 },
  { t0: 60.3, t1: 62.2, z: 2.5, cx: 640, cy: 410 },
  { t0: 105.2, t1: 108.0, z: 2.1, cx: 640, cy: 410 },
  { t0: 157.4, t1: 159.0, z: 2.0, cx: 900, cy: 290 },
];

export function camera(f) {
  const { t, sec, kick, beat } = f;
  const K = { c1: 0.018, c2: 0.018, c3: 0.026, drop1: 0.05, drop2: 0.06, intro: 0.01 };
  let z = 1 + (K[sec.id] ?? 0.006) * kick;
  let cx = W / 2;
  let cy = H / 2;
  let rot = 0;
  let sx = 0;
  let sy = 0;
  if (sec.id.startsWith('drop')) {
    const n = Math.floor(t * 40);
    sx = (hash(n) - 0.5) * kick * 16;
    sy = (hash(n + 9) - 0.5) * kick * 16;
    rot = Math.sin(beat * Math.PI * 0.5) * 0.014;
  }
  for (const zm of ZOOMS) {
    if (t >= zm.t0 - 0.05 && t <= zm.t1 + 0.05) {
      const amt = sm(zm.t0, zm.t0 + 0.35, t) * (1 - sm(zm.t1 - 0.3, zm.t1, t));
      z *= lerp(1, zm.z, amt);
      cx = lerp(cx, zm.cx, amt);
      cy = lerp(cy, zm.cy, amt);
    }
  }
  return { z, cx, cy, rot, sx, sy };
}
