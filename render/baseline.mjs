// Golden-baseline creation and checking.
//
// The approved master is the reference for every future render. This module
// pins it two ways:
//
//   * metadata — sha256 of the file plus the container/stream properties, in
//     baselines/<id>.json. The MP4 itself is never committed, moved, deleted or
//     re-encoded; this manifest is how git knows which file is the approved one.
//   * pixels — PNG snapshots at eleven timestamps, in two flavours:
//       baselines/frames/render/  lossless, straight from the design. A future
//                                 render must match these byte for byte.
//       baselines/frames/master/  decoded from the approved MP4. A future render
//                                 is compared against these by PSNR, which
//                                 tolerates H.264 quantisation but not drift.
//
// `check` never touches the master. It renders, compares and reports.

import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { run, FFMPEG, FFPROBE, OUTPUT_NAME } from './encode.mjs';
import { probe } from './verify.mjs';
import { startServer } from './server.mjs';
import { openStage, WIDTH, HEIGHT, FPS } from './stage.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '..');
export const OUT = path.join(REPO, 'out');
export const BASELINES = path.join(REPO, 'baselines');

export const DEFAULT_ID = 'evlek-reel-v7-master';
export const DEFAULT_VIDEO = path.join(OUT, OUTPUT_NAME);
export const DEFAULT_SOURCE = path.join(REPO, 'project');
export const DEFAULT_PAGE = 'Evlek Reel v7.dc.html';

// The moments the baseline is anchored at. Chosen to land in every scene and on
// both sides of each transition the reel depends on.
export const CHECKPOINTS = [0.50, 1.40, 2.70, 4.50, 7.20, 9.30, 10.80, 13.20, 16.50, 19.50, 21.30];

// A render identical to the baseline reproduces the recorded PSNR against the
// master exactly. So the check compares against that per-checkpoint value rather
// than one global floor: anything more than this much below it is drift, not
// H.264 quantisation noise.
const PSNR_TOLERANCE_DB = 1.5;
// Absolute backstop for a checkpoint the baseline has no recorded value for.
const PSNR_FLOOR = 30;

const sha256File = async (file) =>
  crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');

const stamp = (t) => t.toFixed(2).replace('.', 'p');
const frameIndex = (t, fps = FPS) => Math.round(t * fps);

/** PSNR in dB between two RGBA buffers; Infinity when identical. */
export function psnr(a, b) {
  let sse = 0, n = 0;
  for (let p = 0; p < a.length; p += 4) {
    for (let c = 0; c < 3; c++) { const d = a[p + c] - b[p + c]; sse += d * d; n++; }
  }
  if (sse === 0) return Infinity;
  return 10 * Math.log10((255 ** 2) / (sse / n));
}

const readPng = async (file) => {
  const png = PNG.sync.read(await fs.readFile(file));
  return { data: png.data, width: png.width, height: png.height };
};

/** Renders the checkpoint timestamps from a design source. No PNG sequence, no encode. */
export async function renderCheckpoints({
  source = DEFAULT_SOURCE, page = DEFAULT_PAGE, checkpoints = CHECKPOINTS, fps = FPS, quiet = false,
} = {}) {
  const server = await startServer(source);
  const stage = await openStage({ origin: server.origin, page, imgDir: path.join(source, 'img'), quiet: true });
  const frames = [];
  for (const t of checkpoints) {
    // Snap to the frame grid so a checkpoint always names one real frame.
    const i = frameIndex(t, fps);
    await stage.seek(i / fps);
    await stage.settle();
    const buf = await stage.page.screenshot({ clip: stage.clip, type: 'png' });
    frames.push({ t, frame: i + 1, exactTime: i / fps, buf, sha256: crypto.createHash('sha256').update(buf).digest('hex') });
    if (!quiet) console.log(`  rendered t=${t.toFixed(2)}s (frame ${i + 1})`);
  }
  const duration = stage.duration;
  await stage.close();
  await server.close();
  return { frames, duration };
}

/** Extracts the same timestamps out of an encoded video, exact frame numbers. */
export async function extractCheckpoints({ video, dir, checkpoints = CHECKPOINTS, fps = FPS }) {
  await fs.mkdir(dir, { recursive: true });
  const idx = checkpoints.map((t) => frameIndex(t, fps));
  const select = idx.map((n) => `eq(n\\,${n})`).join('+');
  const tmp = path.join(dir, '_extract_%02d.png');
  await run(FFMPEG, [
    '-hide_banner', '-v', 'error', '-y',
    '-i', video,
    '-vf', `select='${select}'`,
    '-vsync', '0',
    tmp,
  ], { quiet: true });
  const written = [];
  for (let k = 0; k < checkpoints.length; k++) {
    const from = path.join(dir, `_extract_${String(k + 1).padStart(2, '0')}.png`);
    const to = path.join(dir, `t${stamp(checkpoints[k])}.png`);
    await fs.rename(from, to);
    written.push({ t: checkpoints[k], frame: idx[k] + 1, file: path.basename(to) });
  }
  return written;
}

export async function createBaseline({
  id = DEFAULT_ID, video = DEFAULT_VIDEO, source = DEFAULT_SOURCE, page = DEFAULT_PAGE,
} = {}) {
  const info = await probe(video);
  const sha256 = await sha256File(video);

  const manifest = {
    filename: path.basename(video),
    sha256,
    width: info.width,
    height: info.height,
    fps: info.frameRate,
    duration_seconds: info.durationSeconds,
    total_frames: info.nbFrames,
    codec: info.codec,
    profile: info.profile,
    level: info.level,
    pixel_format: info.pixFmt,
    color_space: info.colorSpace,
    color_primaries: info.colorPrimaries,
    color_transfer: info.colorTransfer,
    color_range: info.colorRange,
    field_order: info.fieldOrder,
    audio_stream_count: info.audioStreams,
    size_bytes: info.sizeBytes,
    bitrate_kbps: info.bitRateKbps,
    container: info.formatName,
    created_at: new Date().toISOString(),
    design: { source: path.relative(REPO, source), page },
    checkpoints: [],
    notes: [
      'This file is the approved golden master. Never re-encode, overwrite, move or delete it.',
      'The MP4 is not tracked in git (large binary); this sha256 is its identity.',
      'To add audio, mux with -c:v copy so the video stream is bit-identical.',
    ],
  };

  console.log('[baseline] rendering checkpoint snapshots from the design…');
  const { frames } = await renderCheckpoints({ source, page });
  const renderDir = path.join(BASELINES, 'frames', 'render');
  await fs.mkdir(renderDir, { recursive: true });
  for (const f of frames) await fs.writeFile(path.join(renderDir, `t${stamp(f.t)}.png`), f.buf);

  console.log('[baseline] extracting the same frames from the approved master…');
  const masterDir = path.join(BASELINES, 'frames', 'master');
  const extracted = await extractCheckpoints({ video, dir: masterDir });

  for (const f of frames) {
    const m = extracted.find((e) => e.t === f.t);
    const a = await readPng(path.join(renderDir, `t${stamp(f.t)}.png`));
    const b = await readPng(path.join(masterDir, m.file));
    manifest.checkpoints.push({
      time_seconds: f.t,
      exact_time_seconds: +f.exactTime.toFixed(6),
      frame: f.frame,
      render_png: path.relative(REPO, path.join(renderDir, `t${stamp(f.t)}.png`)),
      render_sha256: f.sha256,
      master_png: path.relative(REPO, path.join(masterDir, m.file)),
      master_vs_render_psnr_db: +psnr(a.data, b.data).toFixed(3),
    });
  }

  await fs.mkdir(BASELINES, { recursive: true });
  const file = path.join(BASELINES, `${id}.json`);
  await fs.writeFile(file, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[baseline] wrote ${path.relative(REPO, file)}`);
  console.log(`[baseline] sha256 ${sha256}`);
  return manifest;
}

export async function checkBaseline({
  id = DEFAULT_ID, video = DEFAULT_VIDEO, source = DEFAULT_SOURCE, page = DEFAULT_PAGE, label = 'source',
} = {}) {
  const manifest = JSON.parse(await fs.readFile(path.join(BASELINES, `${id}.json`), 'utf8'));
  const checks = [];
  const add = (name, pass, detail) => checks.push({ name, pass, detail });

  // ── container / stream properties ────────────────────────────────────────
  let info = null;
  try {
    info = await probe(video);
  } catch (e) {
    add('video present and probeable', false, e.message.split('\n')[0]);
  }
  if (info) {
    const cmp = (name, got, want) => add(name, got === want, `${got}${got === want ? '' : ` (baseline ${want})`}`);
    cmp('width', info.width, manifest.width);
    cmp('height', info.height, manifest.height);
    cmp('fps', info.frameRate, manifest.fps);
    cmp('total frames', info.nbFrames, manifest.total_frames);
    cmp('codec', info.codec, manifest.codec);
    cmp('profile', info.profile, manifest.profile);
    cmp('pixel format', info.pixFmt, manifest.pixel_format);
    cmp('colour space', info.colorSpace, manifest.color_space);
    cmp('audio streams', info.audioStreams, manifest.audio_stream_count);
    add('duration', Math.abs(info.durationSeconds - manifest.duration_seconds) <= 1 / (manifest.fps || 60),
      `${info.durationSeconds}s (baseline ${manifest.duration_seconds}s)`);
    const sha = await sha256File(video);
    add('sha256 matches the approved master', sha === manifest.sha256,
      sha === manifest.sha256 ? sha.slice(0, 16) + '…' : `${sha.slice(0, 16)}… differs from ${manifest.sha256.slice(0, 16)}…`);
  }

  // ── pixels ───────────────────────────────────────────────────────────────
  console.log(`[baseline:check] rendering ${manifest.checkpoints.length} checkpoints from ${label}…`);
  const { frames } = await renderCheckpoints({ source, page, checkpoints: manifest.checkpoints.map((c) => c.time_seconds), quiet: true });

  const pixels = [];
  for (const c of manifest.checkpoints) {
    const f = frames.find((x) => x.t === c.time_seconds);
    const exact = f.sha256 === c.render_sha256;
    let vsRender = Infinity, vsMaster = null;
    if (!exact) {
      const ref = await readPng(path.join(REPO, c.render_png));
      const got = PNG.sync.read(f.buf);
      vsRender = psnr(ref.data, got.data);
    }
    try {
      const mast = await readPng(path.join(REPO, c.master_png));
      vsMaster = psnr(mast.data, PNG.sync.read(f.buf).data);
    } catch { /* master snapshot absent */ }
    pixels.push({
      time_seconds: c.time_seconds, frame: c.frame, byte_identical: exact,
      psnr_vs_render_baseline_db: vsRender === Infinity ? 'identical' : +vsRender.toFixed(3),
      psnr_vs_master_db: vsMaster == null ? null : (vsMaster === Infinity ? 'identical' : +vsMaster.toFixed(3)),
      baseline_master_psnr_db: c.master_vs_render_psnr_db,
    });
  }

  const notIdentical = pixels.filter((p) => !p.byte_identical);
  add('every checkpoint renders byte-identically to the baseline', notIdentical.length === 0,
    notIdentical.length ? `${notIdentical.length}/${pixels.length} differ: ` +
      notIdentical.map((p) => `t=${p.time_seconds}s (${p.psnr_vs_render_baseline_db} dB)`).join(', ')
      : `${pixels.length}/${pixels.length} identical`);

  // Drift against the approved video: measured PSNR must not fall meaningfully
  // below what the baseline recorded for that same checkpoint.
  const drift = pixels
    .filter((p) => typeof p.psnr_vs_master_db === 'number' && typeof p.baseline_master_psnr_db === 'number')
    .map((p) => ({ t: p.time_seconds, delta: +(p.psnr_vs_master_db - p.baseline_master_psnr_db).toFixed(3) }));
  const worstDrift = drift.length ? Math.min(...drift.map((d) => d.delta)) : 0;
  const identicalToMaster = pixels.filter((p) => p.psnr_vs_master_db === 'identical').length;
  const absolute = pixels.map((p) => p.psnr_vs_master_db).filter((v) => typeof v === 'number');
  add('every checkpoint stays within tolerance of the approved master',
    worstDrift >= -PSNR_TOLERANCE_DB && (absolute.length === 0 || Math.min(...absolute) >= PSNR_FLOOR),
    drift.length
      ? `worst drift ${worstDrift.toFixed(3)} dB vs the recorded baseline PSNR (tolerance ${PSNR_TOLERANCE_DB} dB)`
      : `${identicalToMaster} checkpoints identical, no PSNR to compare`);

  const report = {
    baseline: id, checked_video: path.relative(REPO, video),
    design: { source: path.relative(REPO, source), page }, label,
    psnr_tolerance_db: PSNR_TOLERANCE_DB, psnr_floor_db: PSNR_FLOOR,
    worst_drift_db: drift.length ? worstDrift : null, drift, pixels, checks,
    passed: checks.every((c) => c.pass),
    checked_at: new Date().toISOString(),
  };
  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(path.join(OUT, `baseline-check-${label}.json`), JSON.stringify(report, null, 2) + '\n');

  console.log('\n─── baseline check ────────────────────────────────────');
  for (const p of pixels) {
    console.log(`  t=${String(p.time_seconds).padEnd(5)} frame ${String(p.frame).padStart(4)}  ` +
      `${p.byte_identical ? 'byte-identical' : `PSNR ${p.psnr_vs_render_baseline_db} dB`}  ` +
      `· vs master ${p.psnr_vs_master_db} dB`);
  }
  console.log('─── checks ────────────────────────────────────────────');
  for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name} — ${c.detail}`);
  console.log(`\n  ${report.passed ? 'BASELINE CHECK PASSED' : 'BASELINE CHECK FAILED'}\n`);
  return report;
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--id') o.id = argv[++i];
    else if (a === '--video') o.video = path.resolve(argv[++i]);
    else if (a === '--source') o.source = path.resolve(argv[++i]);
    else if (a === '--page') o.page = argv[++i];
    else if (a === '--label') o.label = argv[++i];
  }
  return o;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [mode, ...rest] = process.argv.slice(2);
  const opts = parseArgs(rest);
  const job = mode === 'create' ? createBaseline(opts)
    : mode === 'check' ? checkBaseline(opts)
      : Promise.reject(new Error('usage: node baseline.mjs <create|check> [--id X] [--video f.mp4] [--source dir] [--page file] [--label name]'));
  job.then((r) => process.exit(r.passed === false ? 1 : 0))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
