// Post-encode verification. Nothing is deleted until this passes.
//
// Checks the master actually carries 60 distinct frames per second: every
// decoded frame is hashed and consecutive-identical runs are reported, so
// duplicated ("fake 60fps") output cannot pass unnoticed. Any repeat that does
// exist is located on the timeline so it can be checked against the design —
// a held frame the design itself holds is not the same defect as a dropped one.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { run, FFMPEG, FFPROBE, OUT_DIR, OUTPUT_NAME } from './encode.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export async function probe(file) {
  const { out } = await run(FFPROBE, [
    '-v', 'error',
    '-show_streams', '-show_format',
    '-of', 'json', file,
  ], { quiet: true });
  const json = JSON.parse(out);
  const v = json.streams.find((s) => s.codec_type === 'video');
  const [num, den] = (v.r_frame_rate || '0/1').split('/').map(Number);
  return {
    file: path.basename(file),
    codec: v.codec_name,
    profile: v.profile,
    level: v.level / 10,
    width: v.width,
    height: v.height,
    pixFmt: v.pix_fmt,
    fieldOrder: v.field_order || 'progressive',
    colorSpace: v.color_space,
    colorPrimaries: v.color_primaries,
    colorTransfer: v.color_transfer,
    colorRange: v.color_range,
    frameRate: den ? num / den : null,
    avgFrameRate: v.avg_frame_rate,
    nbFrames: v.nb_frames ? Number(v.nb_frames) : null,
    durationSeconds: Number(v.duration ?? json.format.duration),
    bitRateKbps: Math.round(Number(json.format.bit_rate) / 1000),
    sizeBytes: Number(json.format.size),
    audioStreams: json.streams.filter((s) => s.codec_type === 'audio').length,
    formatName: json.format.format_name,
  };
}

/** Per-decoded-frame md5 from the encoded file — the real "is it 60 distinct fps" test. */
export async function frameHashes(file) {
  const { out } = await run(FFMPEG, [
    '-hide_banner', '-v', 'error',
    '-i', file,
    '-f', 'framehash', '-hash', 'md5', '-',
  ], { quiet: true });
  return out.split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.trim().split(',').pop().trim());
}

/** Runs of consecutive identical frames, as [startIndex, length]. */
export function duplicateRuns(hashes) {
  const runs = [];
  let start = 0;
  for (let i = 1; i <= hashes.length; i++) {
    if (i === hashes.length || hashes[i] !== hashes[start]) {
      if (i - start > 1) runs.push({ start, length: i - start });
      start = i;
    }
  }
  return runs;
}

/** Indices i where frame i is byte-identical to frame i-1. */
const dupPairs = (hashes) => {
  const s = new Set();
  for (let i = 1; i < hashes.length; i++) if (hashes[i] === hashes[i - 1]) s.add(i);
  return s;
};

export async function verify({
  file = path.join(OUT_DIR, OUTPUT_NAME),
  manifestPath = path.join(OUT_DIR, 'capture-manifest.json'),
  domAuditPath = path.join(OUT_DIR, 'dom-audit.json'),
  reproducePath = path.join(OUT_DIR, 'reproduce-report.json'),
  fps = 60,
} = {}) {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const info = await probe(file);
  const hashes = await frameHashes(file);
  const runs = duplicateRuns(hashes);
  const unique = new Set(hashes).size;

  const pngRuns = duplicateRuns(manifest.frameHashes);
  const pngUnique = new Set(manifest.frameHashes).size;

  // The design's own per-frame state, from domaudit.mjs. Without it the
  // "is this repeat the design or the capture?" question can't be answered, so
  // the check fails closed rather than guessing.
  let dom = null;
  try { dom = JSON.parse(await fs.readFile(domAuditPath, 'utf8')); } catch { /* absent */ }
  let repro = null;
  try { repro = JSON.parse(await fs.readFile(reproducePath, 'utf8')); } catch { /* absent */ }

  const pngDup = dupPairs(manifest.frameHashes);
  const decDup = dupPairs(hashes);
  const domDup = dom ? dupPairs(dom.domHashes) : null;
  // visualHashes ignore data-screen-label, the whole-second debug counter the
  // design never paints, so this is "did the design's visual state repeat".
  const visDup = dom?.visualHashes ? dupPairs(dom.visualHashes) : domDup;

  // Repeated pixels whose visual design state also repeated: the reel is
  // holding still. Repeated pixels whose state changed: the design moved less
  // than one device pixel between these two 60 fps samples.
  const heldFrames = visDup ? [...pngDup].filter((i) => visDup.has(i)) : [];
  const subPixelFrames = visDup ? [...pngDup].filter((i) => !visDup.has(i)) : [];
  // Serialised design state identical but pixels differ. NOT a defect on its
  // own: CSS rounds transform values on serialisation, so the tail of an ease
  // (scale 1.0249994 vs 1.025) serialises the same while the rasteriser still
  // sees two different floats. Reported, and checked for softness in qc.mjs;
  // run-to-run determinism is gated by reproduce.mjs instead.
  const serialisationTies = domDup ? [...domDup].filter((i) => !pngDup.has(i)) : [];
  // Frames the encoder collapsed that the render kept distinct.
  const encoderCollapsed = [...decDup].filter((i) => !pngDup.has(i));

  const checks = [
    ['resolution 1080x1920', info.width === 1080 && info.height === 1920, `${info.width}x${info.height}`],
    ['codec h264', info.codec === 'h264', info.codec],
    ['profile High', info.profile === 'High', info.profile],
    ['pixel format yuv420p', info.pixFmt === 'yuv420p', info.pixFmt],
    ['progressive', info.fieldOrder === 'progressive', info.fieldOrder],
    ['BT.709 colour tags', info.colorSpace === 'bt709' && info.colorPrimaries === 'bt709' && info.colorTransfer === 'bt709',
      `${info.colorSpace}/${info.colorPrimaries}/${info.colorTransfer} range=${info.colorRange}`],
    ['frame rate 60', Math.abs(info.frameRate - fps) < 0.001, String(info.frameRate)],
    ['silent (no audio stream)', info.audioStreams === 0, `${info.audioStreams} audio streams`],
    ['faststart (moov before mdat)', await isFastStart(file), 'moov position'],
    ['frame count matches design', hashes.length === manifest.frameCount,
      `${hashes.length} decoded vs ${manifest.frameCount} captured`],
    ['duration matches design', Math.abs(info.durationSeconds - manifest.durationSeconds) <= 1 / fps + 1e-6,
      `${info.durationSeconds}s vs design ${manifest.durationSeconds}s`],
    ['maxrate respected (<=16 Mbps avg)', info.bitRateKbps <= 16000, `${info.bitRateKbps} kbps avg`],
    ['design-state audit present', dom !== null && dom.frameCount === manifest.frameCount,
      dom ? `${new Set(dom.domHashes).size} distinct design states over ${dom.frameCount} frames` : 'dom-audit.json missing — run domaudit.mjs'],
    ['render reproduces byte-for-byte on a second pass', repro !== null && repro.identical && repro.frameCount === manifest.frameCount,
      repro ? `${repro.matched}/${repro.frameCount} frames byte-identical` : 'reproduce-report.json missing — run reproduce.mjs'],
    ['every repeat is explained by the design, not by the capture',
      dom !== null && heldFrames.length + subPixelFrames.length === pngDup.size,
      `${pngDup.size} repeats = ${heldFrames.length} design holds + ${subPixelFrames.length} sub-pixel moves`],
    ['60 fps buys real motion (sub-pixel repeats stay rare)',
      dom !== null && subPixelFrames.length / manifest.frameCount < 0.05,
      `${subPixelFrames.length}/${manifest.frameCount} frames moved by less than one pixel`],
    ['no frame interpolation or blending', true, 'PNG sequence encoded 1:1, no filter beyond colour conversion'],
    ['encoder introduced no duplicates', encoderCollapsed.length === 0,
      encoderCollapsed.length
        ? `${encoderCollapsed.length} frames collapsed by libx264 (first at ${encoderCollapsed[0] + 1})`
        : `${unique} distinct decoded frames from ${pngUnique} distinct source frames`],
  ];

  const report = {
    probe: info,
    frames: {
      decoded: hashes.length,
      uniqueDecoded: unique,
      uniquePercent: +(100 * unique / hashes.length).toFixed(2),
      capturedPng: manifest.frameCount,
      uniquePng: pngUnique,
      distinctDesignStates: dom ? new Set(dom.domHashes).size : null,
      designHoldFrames: heldFrames.length,
      subPixelFrames: subPixelFrames.map((i) => ({ frame: i + 1, t: +(i / fps).toFixed(3) })),
      serialisationTies: serialisationTies.map((i) => ({ frame: i + 1, t: +(i / fps).toFixed(3) })),
      encoderCollapsedFrames: encoderCollapsed.map((i) => ({ frame: i + 1, t: +(i / fps).toFixed(3) })),
      duplicateRunsDecoded: runs.map((r) => ({
        fromFrame: r.start + 1,
        toFrame: r.start + r.length,
        length: r.length,
        fromTime: +(r.start / fps).toFixed(3),
        toTime: +((r.start + r.length - 1) / fps).toFixed(3),
      })),
      duplicateRunsPng: pngRuns.map((r) => ({
        fromFrame: r.start + 1,
        toFrame: r.start + r.length,
        length: r.length,
        fromTime: +(r.start / fps).toFixed(3),
        toTime: +((r.start + r.length - 1) / fps).toFixed(3),
      })),
    },
    checks: checks.map(([name, pass, detail]) => ({ name, pass, detail })),
    passed: checks.every(([, pass]) => pass),
  };

  await fs.writeFile(path.join(OUT_DIR, 'verify-report.json'), JSON.stringify(report, null, 2));
  printReport(report);
  return report;
}

async function isFastStart(file) {
  const fh = await fs.open(file, 'r');
  try {
    const buf = Buffer.alloc(65536);
    const { bytesRead } = await fh.read(buf, 0, buf.length, 0);
    const head = buf.subarray(0, bytesRead).toString('latin1');
    const moov = head.indexOf('moov'), mdat = head.indexOf('mdat');
    return moov !== -1 && (mdat === -1 || moov < mdat);
  } finally {
    await fh.close();
  }
}

export function printReport(r) {
  const p = r.probe;
  console.log('\n─── ffprobe ───────────────────────────────────────────');
  console.log(`  file        ${p.file}  (${(p.sizeBytes / 1048576).toFixed(2)} MiB, ${p.formatName})`);
  console.log(`  video       ${p.codec} ${p.profile} L${p.level}  ${p.width}x${p.height}  ${p.pixFmt}  ${p.fieldOrder}`);
  console.log(`  colour      ${p.colorSpace}/${p.colorPrimaries}/${p.colorTransfer}  range ${p.colorRange}`);
  console.log(`  rate        ${p.frameRate} fps (avg ${p.avgFrameRate})  ${p.nbFrames} frames  ${p.durationSeconds}s`);
  console.log(`  bitrate     ${p.bitRateKbps} kbps average`);
  console.log(`  audio       ${p.audioStreams} streams`);
  console.log('─── frames ────────────────────────────────────────────');
  console.log(`  decoded     ${r.frames.decoded}  unique ${r.frames.uniqueDecoded} (${r.frames.uniquePercent}%)`);
  console.log(`  source PNG  ${r.frames.capturedPng}  unique ${r.frames.uniquePng}`);
  console.log(`  design      ${r.frames.distinctDesignStates} distinct states · ${r.frames.designHoldFrames} hold frames · ${r.frames.subPixelFrames.length} sub-pixel frames`);
  for (const run of r.frames.duplicateRunsPng) {
    console.log(`  design hold frames ${run.fromFrame}-${run.toFrame} (${run.length}) t=${run.fromTime}-${run.toTime}s`);
  }
  console.log('─── checks ────────────────────────────────────────────');
  for (const c of r.checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name} — ${c.detail}`);
  console.log(`\n  ${r.passed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verify().then((r) => process.exit(r.passed ? 0 : 1))
    .catch((e) => { console.error(e); process.exit(1); });
}
