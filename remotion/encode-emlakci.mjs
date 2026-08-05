// Emlakçı reel · PNG sequence → H.264 master.
//
// This does NOT re-implement the encode. It imports the same `encode()` the
// approved V7 pipeline uses, so the agent reel comes out of exactly the same
// single-pass ffmpeg invocation: High profile, progressive, yuv420p, BT.709
// limited range, CRF 17, preset slow, 16M/24M, faststart, no audio. Having one
// encoder for every Evlek film is the whole point of versioning the system —
// a second set of arguments is a second set of things that can drift.
//
//   node remotion/encode-emlakci.mjs
//
// Remotion writes its image sequence as element-0.png … element-1199.png, which
// ffmpeg's %06d pattern cannot read. The frames are hard-linked (not copied)
// into a frame_%06d.png view first: no extra disk, and the originals stay
// exactly as Remotion produced them.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { encode, run, FFPROBE } from '../render/encode.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SEQ = path.join(HERE, 'out', 'seq');
const LINKED = path.join(HERE, 'out', 'frames');
const OUT_DIR = path.join(HERE, 'out');
const NAME = 'evlek_emlakci_reel_1080x1920_60fps_silent_master.mp4';

const numberIn = (name) => {
  const m = name.match(/(\d+)\.png$/);
  return m ? Number(m[1]) : null;
};

async function link() {
  const names = (await fs.readdir(SEQ)).filter((n) => n.endsWith('.png'));
  if (!names.length) throw new Error(`no PNGs in ${SEQ} — render the sequence first`);
  const ordered = names
    .map((n) => ({ n, i: numberIn(n) }))
    .filter((e) => e.i !== null)
    .sort((a, b) => a.i - b.i);
  if (ordered.length !== names.length) throw new Error('unexpected file names in the sequence');

  // The sequence must be contiguous from 0. A gap means a frame failed to write
  // and the master would silently be short.
  ordered.forEach((e, k) => {
    if (e.i !== k) throw new Error(`frame ${k} missing (found ${e.i})`);
  });

  await fs.rm(LINKED, { recursive: true, force: true });
  await fs.mkdir(LINKED, { recursive: true });
  for (const [k, e] of ordered.entries()) {
    const target = path.join(LINKED, `frame_${String(k + 1).padStart(6, '0')}.png`);
    await fs.link(path.join(SEQ, e.n), target);
  }
  console.log(`[link] ${ordered.length} frames → ${path.relative(HERE, LINKED)}/frame_%06d.png`);
  return ordered.length;
}

const probe = async (file) => {
  const { out } = await run(FFPROBE, [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries',
    'stream=codec_name,profile,level,width,height,pix_fmt,color_space,color_primaries,color_transfer,color_range,field_order,r_frame_rate,nb_read_frames,duration',
    '-count_frames', '-of', 'json', file,
  ], { quiet: true });
  return JSON.parse(out).streams[0];
};

const count = await link();
const file = await encode({ framesDir: LINKED, outDir: OUT_DIR, name: NAME, fps: 60 });

const v = await probe(file);
const audio = await run(FFPROBE, ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', file], { quiet: true });

console.log('\n[verify]');
console.log(`  frames in       ${count}`);
console.log(`  frames out      ${v.nb_read_frames}`);
console.log(`  size            ${v.width}x${v.height}`);
console.log(`  codec           ${v.codec_name} ${v.profile} L${v.level}`);
console.log(`  pixel format    ${v.pix_fmt}`);
console.log(`  colour          ${v.color_space} / ${v.color_primaries} / ${v.color_transfer} / ${v.color_range}`);
console.log(`  field order     ${v.field_order}`);
console.log(`  frame rate      ${v.r_frame_rate}`);
console.log(`  duration        ${Number(v.duration).toFixed(3)}s`);
console.log(`  audio streams   ${audio.out.trim() === '' ? 0 : audio.out.trim().split('\n').length}`);

const problems = [];
if (Number(v.nb_read_frames) !== count) problems.push(`frame count ${v.nb_read_frames} != ${count}`);
if (v.r_frame_rate !== '60/1') problems.push(`frame rate ${v.r_frame_rate}`);
if (v.pix_fmt !== 'yuv420p') problems.push(`pixel format ${v.pix_fmt}`);
if (v.profile !== 'High') problems.push(`profile ${v.profile}`);
if (v.color_space !== 'bt709' || v.color_primaries !== 'bt709' || v.color_transfer !== 'bt709') problems.push('colour tags not BT.709');
if (v.field_order && v.field_order !== 'progressive') problems.push(`field order ${v.field_order}`);
if (audio.out.trim() !== '') problems.push('audio stream present');

if (problems.length) {
  console.error('\n[verify] FAILED:\n  - ' + problems.join('\n  - '));
  process.exit(1);
}
console.log('\n[verify] ok');
