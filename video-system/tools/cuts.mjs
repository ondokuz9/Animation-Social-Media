// Platform derivatives from a finished master.
//
// The master is 1080×1920, 60 fps, CRF 17, silent. Nothing that ships is that
// file. Instagram wants a cover frame that is not frame 0, LinkedIn crops a
// vertical video to 4:5, the site wants something under a megabyte, WhatsApp
// wants something smaller still, and every one of those was cut by hand for the
// emlakçı reel. Hand-cutting is how the published file ends up at a bitrate
// nobody chose.
//
//   node video-system/tools/cuts.mjs mix      <master.mp4> <read.mp3>
//   node video-system/tools/cuts.mjs poster   <master.mp4> --at 5.2
//   node video-system/tools/cuts.mjs web      <master.mp4> [--height 1280]
//   node video-system/tools/cuts.mjs social   <master.mp4>            # 4:5, LinkedIn
//   node video-system/tools/cuts.mjs whatsapp <master.mp4>
//   node video-system/tools/cuts.mjs segments <master.mp4> --cut 0:1.8,3.3:5.4,10.3:11.6
//
// Everything lands in out/cuts/ and the master is opened read-only. `mix` is the
// one to read twice: it copies the video stream. Re-encoding a mixed master
// invalidates the golden baseline (CLAUDE.md rules 6 and 14), and every derived
// cut below is made FROM the mixed master, so a mistake there propagates to
// everything that ships.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const resolve = (mod, fallback, pick = (m) => m) => {
  for (const id of [`../../render/node_modules/${mod}`, mod]) {
    try { return pick(require(id)); } catch { /* next */ }
  }
  return fallback;
};
const FFMPEG = resolve('ffmpeg-static', 'ffmpeg');
const FFPROBE = resolve('ffprobe-static', 'ffprobe', (m) => m.path);

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const OUT = path.join(REPO, 'out', 'cuts');

const ff = (args, label) => {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${label} failed`);
};

const probe = (file) => {
  const r = spawnSync(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate',
    '-show_entries', 'format=duration', '-of', 'json', file,
  ], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`cannot probe ${file}`);
  const j = JSON.parse(r.stdout);
  const s = j.streams[0];
  return { width: s.width, height: s.height, duration: Number(j.format.duration) };
};

const stem = (file) => path.basename(file).replace(/\.[^.]+$/, '').replace(/_master$/, '');
const out = (file, suffix, ext = 'mp4') => {
  fs.mkdirSync(OUT, { recursive: true });
  return path.join(OUT, `${stem(file)}-${suffix}.${ext}`);
};
const done = (p) => console.log(`  → ${path.relative(REPO, p)}  ${(fs.statSync(p).size / 1e6).toFixed(2)} MB`);

const flag = (argv, name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

/* ── commands ─────────────────────────────────────────────────────────────── */

/** Mux a voiceover onto the silent master. The video stream is COPIED. */
function mix(master, audio) {
  const o = out(master, 'mixed');
  ff([
    '-i', master, '-i', audio,
    '-filter_complex', '[1:a]aresample=48000,loudnorm=I=-14:TP=-1:LRA=11[a]',
    '-map', '0:v', '-map', '[a]',
    '-c:v', 'copy',                    // rule 14 — never re-encode the master
    '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', '-shortest', o, '-y',
  ], 'mix');
  const m = probe(master), r = probe(o);
  console.log(`  master ${m.duration.toFixed(3)}s → mixed ${r.duration.toFixed(3)}s (video stream copied)`);
  done(o);
}

/**
 * The cover frame. Never frame 0: the hook types itself on, so frame 0 is half
 * a sentence — the emlakçı reel's first frame reads "KKTC'DE" and that is what
 * Instagram used in the grid until it was overridden.
 */
function poster(master, at) {
  const o = out(master, 'poster', 'jpg');
  ff(['-ss', String(at), '-i', master, '-frames:v', '1', '-q:v', '2', o, '-y'], 'poster');
  console.log(`  cover frame at ${at}s — check it reads as a whole sentence`);
  done(o);
}

/** Site playback. 720p tall is plenty for a phone-shaped video in a page. */
function web(master, height = 1280) {
  const o = out(master, `web-${height}`);
  ff([
    '-i', master, '-vf', `scale=-2:${height}`, '-r', '30',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', o, '-y',
  ], 'web');
  done(o);
}

/** LinkedIn crops vertical video. Give it 4:5 so nothing important is lost. */
function social(master) {
  const { width } = probe(master);
  const h = Math.round((width * 5) / 4 / 2) * 2;
  const o = out(master, 'social-4x5');
  ff([
    '-i', master, '-vf', `crop=${width}:${h}:0:(ih-${h})/2`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'copy', '-movflags', '+faststart', o, '-y',
  ], 'social');
  console.log(`  centre 4:5 crop — verify the lower third survives (language row, disclosure badge)`);
  done(o);
}

function whatsapp(master) {
  const o = out(master, 'whatsapp');
  ff([
    '-i', master, '-vf', 'scale=-2:1280', '-r', '30',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
    '-profile:v', 'main', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', o, '-y',
  ], 'whatsapp');
  done(o);
}

/**
 * A shorter cut assembled from segments of the master, e.g. a 15s version for
 * cold traffic. Segments are `in:out` seconds, comma separated, in play order.
 * Re-encoded because it is a new edit — the master is untouched.
 */
function segments(master, spec) {
  const parts = spec.split(',').map((s) => s.split(':').map(Number));
  if (!parts.length || parts.some(([a, b]) => !(b > a))) {
    throw new Error('--cut wants in:out pairs, e.g. 0:1.8,3.3:5.4');
  }
  const total = parts.reduce((n, [a, b]) => n + (b - a), 0);
  const v = parts.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[v${i}]`).join(';');
  const chain = parts.map((_, i) => `[v${i}]`).join('');
  const o = out(master, `cut-${total.toFixed(1).replace('.', 'p')}s`);
  ff([
    '-i', master,
    '-filter_complex', `${v};${chain}concat=n=${parts.length}:v=1[out]`,
    '-map', '[out]', '-r', '60',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', o, '-y',
  ], 'segments');
  console.log(`  ${parts.length} segments · ${total.toFixed(2)}s · silent — mix a matching read separately`);
  done(o);
}

/* ── entry ────────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const [cmd, master, second] = argv;
const usage = `
  node video-system/tools/cuts.mjs mix      <master.mp4> <read.mp3>
  node video-system/tools/cuts.mjs poster   <master.mp4> --at 5.2
  node video-system/tools/cuts.mjs web      <master.mp4> [--height 1280]
  node video-system/tools/cuts.mjs social   <master.mp4>
  node video-system/tools/cuts.mjs whatsapp <master.mp4>
  node video-system/tools/cuts.mjs segments <master.mp4> --cut 0:1.8,3.3:5.4
`;

try {
  if (!cmd || !master || !fs.existsSync(master)) { console.log(usage); process.exit(1); }
  const { width, height, duration } = probe(master);
  console.log(`\n  ${path.basename(master)}  ${width}×${height}  ${duration.toFixed(3)}s\n`);

  if (cmd === 'mix' && second) mix(master, second);
  else if (cmd === 'poster') poster(master, Number(flag(argv, 'at', '1.0')));
  else if (cmd === 'web') web(master, Number(flag(argv, 'height', '1280')));
  else if (cmd === 'social') social(master);
  else if (cmd === 'whatsapp') whatsapp(master);
  else if (cmd === 'segments') segments(master, flag(argv, 'cut') ?? '');
  else { console.log(usage); process.exit(1); }
  console.log();
} catch (err) {
  console.error(`\n  ${err.message}\n`);
  process.exit(1);
}
