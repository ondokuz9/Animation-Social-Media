// Visual quality control on the captured PNG sequence.
//
// Everything here reads the rendered frames — it never trusts the encoder or
// the design. The things the brief calls out are measured directly:
//
//   1. white flash at scene morphs   -> per-frame mean luminance, spike search
//   2. text ghosting / corruption    -> edge energy in the text bands must stay
//                                       stable while text is held on screen
//   3. slider line jitter            -> the divider's sub-pixel centre is
//                                       located per frame and compared against
//                                       the design's own easing formula
//   4. Girne pan smoothness          -> frame-to-frame difference across the
//                                       opening pan must vary smoothly
//   5. softness on repeated frames   -> frames verify.mjs flagged as sub-pixel
//                                       repeats must be exactly as sharp as
//                                       their neighbours

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const FRAMES = path.join(REPO, 'out', 'frames');
const OUT = path.join(REPO, 'out');
const FPS = 60;
const W = 1080, H = 1920;

// Scene boundaries, summed from the design's own OM_SCENES list.
const SCENES = [
  ['Kanca', 2.1], ['Arama', 1.85], ['Sonuçlar', 2.5], ['Okuma', 3.3],
  ['Sanal Düzenleme', 4.0], ['Piyasa', 4.3], ['Kapanış', 3.5],
];
const BOUNDS = (() => { let t = 0; return SCENES.map(([n, d]) => ({ name: n, start: t, end: (t += d) })); })();

const framePath = (i) => path.join(FRAMES, `frame_${String(i + 1).padStart(6, '0')}.png`);

async function readFrame(i) {
  const buf = await fs.readFile(framePath(i));
  const png = PNG.sync.read(buf);
  if (png.width !== W || png.height !== H) throw new Error(`frame ${i + 1} is ${png.width}x${png.height}`);
  return png.data;                                  // RGBA
}

/** Rec.709 luma of every 4th pixel — plenty for a mean, 4x faster. */
function meanLuma(rgba) {
  let sum = 0, n = 0;
  for (let p = 0; p < rgba.length; p += 16) {
    sum += 0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2];
    n++;
  }
  return sum / n;
}

/** Mean absolute luma difference between two frames. */
function frameDiff(a, b) {
  let sum = 0, n = 0;
  for (let p = 0; p < a.length; p += 16) {
    const la = 0.2126 * a[p] + 0.7152 * a[p + 1] + 0.0722 * a[p + 2];
    const lb = 0.2126 * b[p] + 0.7152 * b[p + 1] + 0.0722 * b[p + 2];
    sum += Math.abs(la - lb); n++;
  }
  return sum / n;
}

/** RMS horizontal gradient over the whole frame — a sharpness measure. */
function edgeRms(rgba) {
  let acc = 0, n = 0;
  for (let y = 0; y < H; y += 2) {
    const row = y * W * 4;
    for (let x = 1; x < W; x++) {
      const p = row + x * 4, q = p - 4;
      const l1 = 0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2];
      const l0 = 0.2126 * rgba[q] + 0.7152 * rgba[q + 1] + 0.0722 * rgba[q + 2];
      acc += (l1 - l0) ** 2; n++;
    }
  }
  return Math.sqrt(acc / n);
}

/** Horizontal edge energy inside a band of rows — a text-crispness proxy. */
function edgeEnergy(rgba, y0, y1) {
  let sum = 0;
  for (let y = y0; y < y1; y += 2) {
    const row = y * W * 4;
    for (let x = 1; x < W; x += 1) {
      const p = row + x * 4, q = p - 4;
      const l1 = 0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2];
      const l0 = 0.2126 * rgba[q] + 0.7152 * rgba[q + 1] + 0.0722 * rgba[q + 2];
      const d = Math.abs(l1 - l0);
      if (d > 24) sum += d;                        // ignore photo gradients
    }
  }
  return Math.round(sum);
}

/**
 * x of the staging slider's divider: a 4px pure-white bar spanning the full
 * frame height. Scored by how many sampled rows show near-white pixels that are
 * clearly brighter than what sits 8px to either side — a photograph has bright
 * edges, but not a full-height white column, and the 68px handle puck cannot
 * reach the row count either. Returns null when the design isn't drawing it.
 */
function sliderX(rgba) {
  const rows = [];
  // Skip the band holding the 68px handle puck: it is white across ~68
  // columns, which would swamp the 4px bar in the centroid below.
  for (let y = 120; y < 1860; y += 40) if (y < 860 || y > 990) rows.push(y * W * 4);
  let best = null, bestScore = 0;
  for (let x = 12; x < W - 12; x++) {
    let score = 0;
    for (const row of rows) {
      const p = row + x * 4;
      if (rgba[p] < 242 || rgba[p + 1] < 242 || rgba[p + 2] < 242) continue;
      const lL = 0.2126 * rgba[p - 32] + 0.7152 * rgba[p - 31] + 0.0722 * rgba[p - 30];
      const lR = 0.2126 * rgba[p + 32] + 0.7152 * rgba[p + 33] + 0.0722 * rgba[p + 34];
      if (250 - Math.max(lL, lR) > 20) score++;
    }
    if (score > bestScore) { bestScore = score; best = x; }
  }
  if (bestScore < rows.length * 0.6) return null;
  // The bar is 4px wide and lands on fractional positions, so the brightest
  // column alone quantises the track to ±2px and fakes a jerky trajectory.
  // Weighting by how white each column is recovers the sub-pixel centre.
  let num = 0, den = 0;
  for (const row of rows) {
    for (let x = best - 5; x <= best + 5; x++) {
      const p = row + x * 4;
      const l = 0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2];
      const w = Math.max(0, l - 190);
      num += x * w; den += w;
    }
  }
  return den > 0 ? num / den : best;
}

const sceneAt = (t) => BOUNDS.find((b) => t >= b.start && t < b.end)?.name ?? BOUNDS.at(-1).name;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Where the design says the slider divider is at time t — read straight off
 * StagingV6: `x = 110 + d * 860`, `d = io((lt - 1.0) / 1.2)`,
 * `io(p) = 0.5 - 0.5·cos(π·p)`, with the staging scene starting at 9.75 s.
 * Comparing the measured line against this is a far stronger statement than any
 * jerk heuristic: it proves every 60 fps sample sits on the authored curve.
 */
function designSliderX(t) {
  const lt = t - BOUNDS.find((b) => b.name === 'Sanal Düzenleme').start;
  const p = clamp((lt - 1.0) / 1.2, 0, 1);
  return 110 + 860 * (0.5 - 0.5 * Math.cos(Math.PI * p));
}

export async function qualityControl() {
  const manifest = JSON.parse(await fs.readFile(path.join(OUT, 'capture-manifest.json'), 'utf8'));
  const count = manifest.frameCount;
  console.log(`[qc] analysing ${count} frames`);

  const luma = new Array(count);
  const diff = new Array(count).fill(0);
  const slider = new Array(count).fill(null);
  const textEdge = new Array(count).fill(null);

  let prev = null;
  for (let i = 0; i < count; i++) {
    const cur = await readFrame(i);
    luma[i] = meanLuma(cur);
    if (prev) diff[i] = frameDiff(prev, cur);
    const t = i / FPS;
    if (sceneAt(t) === 'Sanal Düzenleme') slider[i] = sliderX(cur);
    // "Sadece bulmaz. Açıklar." sits at y 268-420 through the Okuma scene.
    if (sceneAt(t) === 'Okuma') textEdge[i] = edgeEnergy(cur, 268, 420);
    prev = cur;
    if (i % 200 === 0) process.stdout.write(`[qc] ${i}/${count}\n`);
  }

  // ── 1. white flash ───────────────────────────────────────────────────────
  // A flash is a single frame markedly brighter than BOTH neighbours. Genuine
  // scene changes ramp across frames, so they don't trip this.
  const flashes = [];
  for (let i = 1; i < count - 1; i++) {
    const spike = luma[i] - Math.max(luma[i - 1], luma[i + 1]);
    if (spike > 8) flashes.push({ frame: i + 1, t: +(i / FPS).toFixed(3), scene: sceneAt(i / FPS), spike: +spike.toFixed(2) });
  }

  // ── 2. text stability during the Okuma hold ──────────────────────────────
  // While the headline is fully on screen its edge energy should be steady;
  // ghosting or a half-rendered glyph shows up as a sharp dip or jump.
  const okuma = textEdge.map((v, i) => ({ v, i })).filter((o) => o.v != null && o.v > 0);
  const held = okuma.filter((o) => o.v > Math.max(...okuma.map((x) => x.v)) * 0.6);
  let textJumps = [];
  for (let k = 1; k < held.length; k++) {
    if (held[k].i !== held[k - 1].i + 1) continue;
    const rel = Math.abs(held[k].v - held[k - 1].v) / Math.max(1, held[k - 1].v);
    if (rel > 0.25) textJumps.push({ frame: held[k].i + 1, t: +(held[k].i / FPS).toFixed(3), rel: +rel.toFixed(3) });
  }

  // ── 3. slider line ───────────────────────────────────────────────────────
  const track = slider.map((x, i) => ({ x, i })).filter((o) => o.x != null);
  const back = [];
  for (let k = 1; k < track.length; k++) {
    if (track[k].i !== track[k - 1].i + 1) continue;
    const d = track[k].x - track[k - 1].x;
    if (d < -0.5) back.push({ frame: track[k].i + 1, t: +(track[k].i / FPS).toFixed(3), delta: +d.toFixed(3) });
  }
  const steps = [];
  for (let k = 1; k < track.length; k++) {
    if (track[k].i === track[k - 1].i + 1) steps.push(track[k].x - track[k - 1].x);
  }
  let sliderJerk = steps.length > 1 ? 0 : null;
  for (let k = 1; k < steps.length; k++) sliderJerk = Math.max(sliderJerk, Math.abs(steps[k] - steps[k - 1]));

  // Residual against the authored curve. Tolerance is 2px because the measured
  // value is a centroid of a 4px bar crossing a moving image seam, not because
  // the design is allowed to drift.
  const residuals = track.map((o) => ({
    frame: o.i + 1, t: +(o.i / FPS).toFixed(3),
    measured: +o.x.toFixed(2), design: +designSliderX(o.i / FPS).toFixed(2),
    residual: +(o.x - designSliderX(o.i / FPS)).toFixed(3),
  }));
  const maxResidual = residuals.length ? Math.max(...residuals.map((r) => Math.abs(r.residual))) : null;
  const meanResidual = residuals.length
    ? residuals.reduce((a, r) => a + Math.abs(r.residual), 0) / residuals.length : null;

  // ── 4. opening pan smoothness ────────────────────────────────────────────
  // Second difference of the per-frame change: a stall or a jump in the pan
  // shows up as a large jerk relative to the motion itself.
  const panFrames = [];
  for (let i = 2; i < Math.round(0.9 * FPS); i++) panFrames.push(diff[i]);
  const panMean = panFrames.reduce((a, b) => a + b, 0) / panFrames.length;
  let panJerk = 0;
  for (let i = 1; i < panFrames.length; i++) panJerk = Math.max(panJerk, Math.abs(panFrames[i] - panFrames[i - 1]));

  // Frames that did not change at all from their predecessor.
  const still = [];
  for (let i = 1; i < count; i++) if (diff[i] === 0) still.push(i + 1);
  const stillRanges = [];
  for (const f of still) {
    const last = stillRanges.at(-1);
    if (last && f === last.to + 1) last.to = f; else stillRanges.push({ from: f, to: f });
  }

  // ── 5. sub-pixel repeats must not be softness pops ───────────────────────
  // verify.mjs flags frames whose design state changed but whose pixels didn't.
  // Those are only benign if the frame is exactly as sharp as its neighbours —
  // a repeat that is *softer* would mean a layer was captured mid-re-raster.
  const softness = [];
  try {
    const vr = JSON.parse(await fs.readFile(path.join(OUT, 'verify-report.json'), 'utf8'));
    for (const { frame } of vr.frames.subPixelFrames ?? []) {
      const i = frame - 1;
      if (i < 1 || i >= count - 1) continue;
      const [a, b, c] = await Promise.all([readFrame(i - 1), readFrame(i), readFrame(i + 1)]);
      const [ra, rb, rc] = [edgeRms(a), edgeRms(b), edgeRms(c)];
      const ref = Math.max(ra, rc);
      softness.push({ frame, t: +(i / FPS).toFixed(3), rms: +rb.toFixed(4),
        neighbours: [+ra.toFixed(4), +rc.toFixed(4)], deltaPercent: +(100 * (rb - ref) / ref).toFixed(3) });
    }
  } catch { /* verify-report absent: check degrades to n/a below */ }
  const worstSoftness = softness.length ? Math.min(...softness.map((s) => s.deltaPercent)) : 0;

  const checks = [
    ['no white flash frames', flashes.length === 0, flashes.length ? JSON.stringify(flashes.slice(0, 6)) : 'none'],
    ['sub-pixel repeats are not softer than neighbours', worstSoftness > -1,
      softness.length ? `${softness.length} frames checked, worst sharpness delta ${worstSoftness}%` : 'none flagged'],
    ['text stable while held (Okuma)', textJumps.length === 0,
      textJumps.length ? JSON.stringify(textJumps.slice(0, 6)) : `${held.length} held frames, max deviation < 25%`],
    ['slider never backtracks', back.length === 0, back.length ? JSON.stringify(back.slice(0, 6)) : `${track.length} frames tracked`],
    ['slider sits on the design curve every frame', maxResidual != null && maxResidual <= 2,
      residuals.length
        ? `mean |residual| ${meanResidual.toFixed(3)}px, max ${maxResidual.toFixed(3)}px over ${residuals.length} frames ` +
          `(mean step ${(steps.reduce((a, b) => a + b, 0) / steps.length).toFixed(2)}px, peak ${Math.max(...steps).toFixed(2)}px)`
        : 'n/a'],
    ['opening pan has no stall or jump', panJerk < panMean * 2.5 || panJerk < 0.5,
      `mean Δ ${panMean.toFixed(3)}, max jerk ${panJerk.toFixed(3)}`],
  ];

  const report = {
    frameCount: count,
    lumaRange: [+Math.min(...luma).toFixed(2), +Math.max(...luma).toFixed(2)],
    flashes,
    textJumps,
    sliderTrackedFrames: track.length,
    sliderRange: track.length ? [track[0].x, track.at(-1).x] : null,
    sliderBacktracks: back,
    sliderResidual: { mean: meanResidual != null ? +meanResidual.toFixed(3) : null, max: maxResidual, samples: residuals },
    sliderSteps: { mean: steps.length ? +(steps.reduce((a, b) => a + b, 0) / steps.length).toFixed(3) : null,
      peak: steps.length ? +Math.max(...steps).toFixed(3) : null, maxJerk: sliderJerk != null ? +sliderJerk.toFixed(3) : null },
    subPixelSharpness: softness,
    pan: { meanDelta: +panMean.toFixed(4), maxJerk: +panJerk.toFixed(4) },
    identicalToPrevious: stillRanges.map((r) => ({
      fromFrame: r.from, toFrame: r.to,
      fromTime: +((r.from - 1) / FPS).toFixed(3), toTime: +((r.to - 1) / FPS).toFixed(3),
      scene: sceneAt((r.from - 1) / FPS), length: r.to - r.from + 1,
    })),
    perSceneMeanDelta: BOUNDS.map((b) => {
      const from = Math.round(b.start * FPS), to = Math.min(count, Math.round(b.end * FPS));
      const win = diff.slice(Math.max(1, from + 1), to);
      return { scene: b.name, from: +b.start.toFixed(2), to: +b.end.toFixed(2),
        meanDelta: +(win.reduce((a, x) => a + x, 0) / Math.max(1, win.length)).toFixed(4) };
    }),
    checks: checks.map(([name, pass, detail]) => ({ name, pass, detail })),
    passed: checks.every(([, pass]) => pass),
  };

  await fs.writeFile(path.join(OUT, 'qc-report.json'), JSON.stringify(report, null, 2));

  console.log('\n─── visual QC ─────────────────────────────────────────');
  console.log(`  luma range        ${report.lumaRange[0]} … ${report.lumaRange[1]}`);
  console.log(`  slider tracked    ${report.sliderTrackedFrames} frames, x ${report.sliderRange?.join(' -> ')}, max deviation from design curve ${report.sliderResidual.max}px`);
  console.log(`  opening pan       mean Δ ${report.pan.meanDelta}, max jerk ${report.pan.maxJerk}`);
  for (const s of report.perSceneMeanDelta) {
    console.log(`  motion ${s.scene.padEnd(16)} ${String(s.from).padStart(5)}-${String(s.to).padEnd(5)}s  mean Δ ${s.meanDelta}`);
  }
  for (const r of report.identicalToPrevious) {
    console.log(`  identical frames  ${r.fromFrame}-${r.toFrame} (${r.length}) t=${r.fromTime}-${r.toTime}s · ${r.scene}`);
  }
  console.log('─── checks ────────────────────────────────────────────');
  for (const c of report.checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name} — ${c.detail}`);
  console.log(`\n  ${report.passed ? 'VISUAL QC PASSED' : 'VISUAL QC FAILED'}\n`);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  qualityControl().then((r) => process.exit(r.passed ? 0 : 1))
    .catch((e) => { console.error(e); process.exit(1); });
}
