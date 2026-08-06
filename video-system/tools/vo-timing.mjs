// Voiceover timing — plan a script against a film, then verify the recording.
//
// The problem this exists for: a text-to-speech read has no duration control.
// You write a script, you generate it, and it comes out however long it comes
// out. On the emlakçı reel that produced a 36.000s film and a 25.97s read — a
// ten second hole that no amount of retiming could close, because the script
// simply had not been written to a budget.
//
// So write to a budget. Turkish syllable count is exact (one vowel, one
// syllable, no exceptions), and a given voice at a given speed reads at a
// stable rate. Two numbers describe a read:
//
//   ART   syllables per second of actual speech      (articulation rate)
//   GAP   seconds of silence the model inserts per paragraph break
//
//   duration ≈ syllables / ART + lines × GAP
//
// The GAP term is the one that surprises people. Merging two paragraphs into
// one does not shorten the words — it removes a pause. On the emlakçı script
// that was 0.42s per break, so collapsing sixteen lines into eight silently
// took 3.4 seconds off the read.
//
//   node video-system/tools/vo-timing.mjs plan      script.vo.json
//   node video-system/tools/vo-timing.mjs measure   script.vo.json read.mp3
//   node video-system/tools/vo-timing.mjs calibrate script.vo.json read.mp3
//
// `calibrate` re-derives ART and GAP from a finished recording. Run it whenever
// the voice, the model or the speed setting changes; the defaults below are
// measured from Cicek / ElevenLabs v3 / sp100 and are wrong for anything else.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

/* Measured from ElevenLabs v3, voice "Cicek", speed 100: 136 syllables over
   23.74s of speech across 14 blocks with 5.91s of gaps. Recalibrate per voice. */
const DEFAULT_ART = 5.73;
const DEFAULT_GAP = 0.42;

/* Silence floor for speech detection. -42 dBFS sits well clear of the noise
   floor of an ElevenLabs render (measured at -87 dBFS) and well under speech. */
const FLOOR_DB = -42;
const HOP = 0.01;          // envelope resolution, seconds
const MIN_RUN = 0.08;      // shorter than this is a click, not a word
const MERGE_GAP = 0.28;    // silences below this are within-sentence, not between

const TURKISH_VOWELS = new Set('aeıioöuüâîûAEIİOÖUÜÂÎÛ');

/** Turkish is transparent: syllable count equals vowel count. No diphthongs. */
const syllables = (text) =>
  [...stripTags(text)].filter((ch) => TURKISH_VOWELS.has(ch)).length;

/** Audio tags are direction for the model, not words. They are never spoken. */
const stripTags = (text) => text.replace(/\[[^\]]*\]/g, '');

/* render/ owns the pinned ffmpeg. This tool only reads audio, so it falls back
   to a PATH ffmpeg when render/node_modules is not installed — it never encodes
   video and so can never disagree with the master's encoder. */
const require = createRequire(import.meta.url);
const FFMPEG = (() => {
  try { return require('../../render/node_modules/ffmpeg-static'); } catch { /* fall through */ }
  try { return require('ffmpeg-static'); } catch { return 'ffmpeg'; }
})();

/* ── speech detection ─────────────────────────────────────────────────────── */

/** Decode to mono 16 kHz PCM and return contiguous runs of speech. */
function speechRuns(file) {
  const { stdout, status, stderr } = spawnSync(
    FFMPEG,
    ['-v', 'error', '-i', file, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
    { maxBuffer: 1 << 28, encoding: 'buffer' },
  );
  if (status !== 0) throw new Error(`ffmpeg failed on ${file}: ${stderr}`);

  const sr = 16000;
  const pcm = new Int16Array(stdout.buffer, stdout.byteOffset, stdout.length >> 1);
  const hop = Math.round(sr * HOP);
  const floor = 10 ** (FLOOR_DB / 20);

  const voiced = [];
  for (let i = 0; i + hop <= pcm.length; i += hop) {
    let sum = 0;
    for (let k = i; k < i + hop; k++) { const v = pcm[k] / 32768; sum += v * v; }
    voiced.push(Math.sqrt(sum / hop) > floor);
  }

  const runs = [];
  let start = null;
  voiced.forEach((on, i) => {
    if (on && start === null) start = i;
    if (!on && start !== null) {
      if ((i - start) * HOP >= MIN_RUN) runs.push([start * HOP, i * HOP]);
      start = null;
    }
  });
  if (start !== null) runs.push([start * HOP, voiced.length * HOP]);

  const merged = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && r[0] - last[1] < MERGE_GAP) last[1] = r[1];
    else merged.push([...r]);
  }
  return { runs: merged, duration: pcm.length / sr };
}

/* ── script ───────────────────────────────────────────────────────────────── */

function readScript(file) {
  const s = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(s.lines) || !s.lines.length) throw new Error(`${file}: no lines`);
  s.art = s.voice?.art ?? DEFAULT_ART;
  s.gap = s.voice?.gap ?? DEFAULT_GAP;
  s.videoSeconds = s.target?.video_seconds ?? null;
  s.tailSeconds = s.target?.tail_seconds ?? 1.0;
  return s;
}

const predict = (s) =>
  s.lines.reduce((n, l) => n + syllables(l.text), 0) / s.art + s.lines.length * s.gap;

const fmt = (n, w = 6, d = 2) => n.toFixed(d).padStart(w);

/* ── commands ─────────────────────────────────────────────────────────────── */

function plan(scriptFile) {
  const s = readScript(scriptFile);
  const total = s.lines.reduce((n, l) => n + syllables(l.text), 0);
  const spoken = total / s.art;
  const pauses = s.lines.length * s.gap;
  const predicted = spoken + pauses;

  console.log(`\n  ${path.basename(scriptFile)} · ${s.voice?.name ?? 'voice'} · ${s.art} syl/s + ${s.gap}s per break\n`);
  console.log('   #   in     out   syl  tag           line');
  console.log('  ' + '─'.repeat(96));
  let t = 0;
  s.lines.forEach((l, i) => {
    const n = syllables(l.text);
    const d = n / s.art;
    console.log(`  ${String(i + 1).padStart(2)} ${fmt(t)} ${fmt(t + d)} ${String(n).padStart(4)}  ${(l.tag ? `[${l.tag}]` : '—').padEnd(13)} ${stripTags(l.text)}`);
    t += d + s.gap;
  });
  console.log('  ' + '─'.repeat(96));
  console.log(`  ${s.lines.length} lines · ${total} syllables · ${spoken.toFixed(2)}s spoken + ${pauses.toFixed(2)}s pauses`);
  console.log(`  predicted read: ${predicted.toFixed(2)}s`);

  if (s.videoSeconds) {
    const head = s.videoSeconds - predicted;
    const verdict = head < 0 ? 'OVER — cut lines or merge paragraphs'
      : head < s.tailSeconds ? `TIGHT — under the ${s.tailSeconds}s tail you asked for`
      : 'fits';
    console.log(`  film: ${s.videoSeconds.toFixed(2)}s · headroom ${head >= 0 ? '+' : ''}${head.toFixed(2)}s · ${verdict}`);
    if (head < 0) {
      const perLine = s.gap;
      console.log(`  merging two paragraphs buys ${perLine.toFixed(2)}s without cutting a word.`);
    }
  }
  console.log();
}

function measure(scriptFile, audioFile) {
  const s = readScript(scriptFile);
  const { runs, duration } = speechRuns(audioFile);

  console.log(`\n  ${path.basename(audioFile)} · ${duration.toFixed(2)}s · ${runs.length} blocks (script has ${s.lines.length} lines)\n`);

  if (runs.length !== s.lines.length) {
    console.log('  ⚠ Block count does not match the script. The model merged or split');
    console.log('    paragraphs, so the per-line comparison below is not trustworthy.');
    console.log('    Check the blank lines between paragraphs and regenerate.\n');
  }

  console.log('   #   planned        actual        drift   line');
  console.log('  ' + '─'.repeat(96));
  let t = 0, worst = 0;
  s.lines.forEach((l, i) => {
    const d = syllables(l.text) / s.art;
    const r = runs[i];
    if (!r) {
      console.log(`  ${String(i + 1).padStart(2)} ${fmt(t)}-${fmt(t + d, 5)}   ${'missing'.padStart(13)}      —   ${stripTags(l.text)}`);
    } else {
      const drift = r[0] - t;
      worst = Math.max(worst, Math.abs(drift));
      const flag = Math.abs(drift) <= 0.3 ? '' : drift < 0 ? '  early' : '  late';
      console.log(`  ${String(i + 1).padStart(2)} ${fmt(t)}-${fmt(t + d, 5)} ${fmt(r[0])}-${fmt(r[1], 5)} ${(drift >= 0 ? '+' : '') + drift.toFixed(2)}s  ${stripTags(l.text)}${flag}`);
    }
    t += d + s.gap;
  });
  console.log('  ' + '─'.repeat(96));

  if (s.videoSeconds) {
    const over = duration - s.videoSeconds;
    console.log(over > 0
      ? `  ⚠ the read is ${over.toFixed(2)}s LONGER than the film — the last line will be cut off`
      : `  read fits the ${s.videoSeconds.toFixed(2)}s film with ${(-over).toFixed(2)}s to spare`);
  }
  console.log(`  largest drift: ${worst.toFixed(2)}s${worst > 0.3 ? '  (regenerate, or shorten the line before it)' : ''}`);

  const master = s.target?.master ?? '<silent-master>.mp4';
  const out = s.target?.output ?? 'evlek_reel_mixed.mp4';
  console.log(`
  Mux — note -c:v copy. Re-encoding the video invalidates the golden master
  (CLAUDE.md rule 14), and the master is the product.

  ffmpeg -i ${master} -i ${audioFile} \\
    -filter_complex "[1:a]aresample=48000,loudnorm=I=-14:TP=-1:LRA=11[a]" \\
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest \\
    ${out} -y
`);
}

function calibrate(scriptFile, audioFile) {
  const s = readScript(scriptFile);
  const { runs, duration } = speechRuns(audioFile);
  const total = s.lines.reduce((n, l) => n + syllables(l.text), 0);
  const spoken = runs.reduce((n, [a, b]) => n + (b - a), 0);
  const gaps = runs.length > 1 ? (duration - spoken) / runs.length : 0;

  console.log(`\n  Calibration from ${path.basename(audioFile)}\n`);
  console.log(`  ${total} syllables · ${runs.length} blocks · ${duration.toFixed(2)}s total, ${spoken.toFixed(2)}s speech\n`);
  console.log(`    art: ${(total / spoken).toFixed(2)}     (was ${s.art})`);
  console.log(`    gap: ${gaps.toFixed(2)}     (was ${s.gap})`);
  if (runs.length !== s.lines.length) {
    console.log(`\n  ⚠ ${runs.length} blocks vs ${s.lines.length} lines — the gap figure is only`);
    console.log('    meaningful when they match. Fix the script or the read first.');
  }
  console.log(`
  Put these in the script's voice block so every later plan uses them:

    "voice": { "name": ${JSON.stringify(s.voice?.name ?? '')}, "art": ${(total / spoken).toFixed(2)}, "gap": ${gaps.toFixed(2)} }
`);
}

/* ── entry ────────────────────────────────────────────────────────────────── */

const [cmd, a, b] = process.argv.slice(2);
const usage = `
  node video-system/tools/vo-timing.mjs plan      <script.vo.json>
  node video-system/tools/vo-timing.mjs measure   <script.vo.json> <read.mp3>
  node video-system/tools/vo-timing.mjs calibrate <script.vo.json> <read.mp3>
`;

try {
  if (cmd === 'plan' && a) plan(a);
  else if (cmd === 'measure' && a && b) measure(a, b);
  else if (cmd === 'calibrate' && a && b) calibrate(a, b);
  else { console.log(usage); process.exit(1); }
} catch (err) {
  console.error(`\n  ${err.message}\n`);
  process.exit(1);
}
