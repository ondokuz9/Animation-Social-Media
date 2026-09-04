#!/usr/bin/env node
/**
 * hafta.mjs — the weekly one-command pipeline.
 *
 *   node scripts/hafta.mjs <Format> <içerik.json> [--skip-render]
 *
 * Does, in order: content check → ProRes render → H.264 social encode →
 * ffprobe gate (exact frame count, 60 CFR, single stream, BT.709) → contact
 * sheet → sha256 → baseline pin. It refuses to ship a file that fails the gate,
 * which is the whole point: the weekly cadence must never lower the bar.
 *
 * Data honesty is enforced upstream, in the content JSON: a median that the
 * live source withheld must simply be absent — never invented here.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const [, , format, contentPath, ...flags] = process.argv;
if (!format || !contentPath) {
  console.error('kullanım: node scripts/hafta.mjs <Format> <content/dosya.json>');
  process.exit(1);
}
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FRAMES = { PazarRaporu: 1500, PazarNabzi: 900, EvlekBrandFilm15: 900, EvlekBrandFilm06: 360 };
const CHROME = process.env.CHROME_PATH
  || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const FFPROBE = process.env.FFPROBE_PATH || 'ffprobe';

const content = JSON.parse(readFileSync(path.join(ROOT, contentPath), 'utf8'));
const week = content.week;
if (!week) throw new Error('içerik JSON içinde "week" alanı yok');
if (!content.source || !/EVLEK\.APP/i.test(content.source)) {
  throw new Error('kaynak satırı eksik — veri gösteren her kare kaynak taşımak zorunda');
}

const out = path.join(ROOT, 'out');
mkdirSync(out, { recursive: true });
const mov = path.join(out, `${format.toLowerCase()}-${week}.mov`);
const mp4 = path.join(out, `Evlek_${format}_${week}_9x16_60fps.mp4`);
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

if (!flags.includes('--skip-render')) {
  console.log(`▶ render ${format} ← ${contentPath}`);
  run('npx', ['remotion', 'render', 'src/index.js', format, mov,
    `--props=${path.join(ROOT, contentPath)}`, '--codec=prores', '--prores-profile=hq',
    '--muted', `--browser-executable=${CHROME}`, '--concurrency=3', '--log=error'],
    path.join(ROOT, 'remotion'));
}

console.log('▶ sosyal encode (CRF 15 · preset slow · GOP 120 · BT.709 · sessiz)');
run(FFMPEG, ['-y', '-v', 'error', '-i', mov, '-c:v', 'libx264', '-preset', 'slow', '-crf', '15',
  '-tune', 'grain', '-profile:v', 'high', '-level', '4.2', '-pix_fmt', 'yuv420p', '-r', '60',
  '-fps_mode', 'cfr', '-x264-params', 'keyint=120:min-keyint=120:scenecut=0:open-gop=0',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
  '-movflags', '+faststart', '-an', mp4]);

const probe = (entries) => execFileSync(FFPROBE,
  ['-v', 'error', '-select_streams', 'v:0', '-show_entries', entries, '-of', 'default=nw=1:nk=1', mp4],
  { encoding: 'utf8' }).trim().split('\n');
const [nbFrames, rate, pix, prim] = probe('stream=nb_frames,r_frame_rate,pix_fmt,color_primaries');
const streams = execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=nb_streams',
  '-of', 'default=nw=1:nk=1', mp4], { encoding: 'utf8' }).trim();

const want = FRAMES[format];
const fail = [];
if (want && Number(nbFrames) !== want) fail.push(`kare sayısı ${nbFrames} ≠ ${want}`);
if (rate !== '60/1') fail.push(`fps ${rate} ≠ 60/1`);
if (pix !== 'yuv420p') fail.push(`pix_fmt ${pix}`);
if (prim !== 'bt709') fail.push(`renk ${prim} ≠ bt709`);
if (streams !== '1') fail.push(`${streams} stream — ses izi sızmış`);
if (fail.length) { console.error('✗ KAPI GEÇİLMEDİ: ' + fail.join(' · ')); process.exit(2); }

const sheet = path.join(out, 'audit', `contact_${format.toLowerCase()}_${week}.png`);
mkdirSync(path.dirname(sheet), { recursive: true });
run(FFMPEG, ['-y', '-v', 'error', '-i', mp4, '-vf',
  'fps=1.2,scale=216:-1,tile=6x5:padding=4:margin=4:color=white', '-frames:v', '1', sheet]);

const sha = createHash('sha256').update(readFileSync(mp4)).digest('hex');
const pin = path.join(ROOT, 'baselines', `evlek-${format.toLowerCase()}-${week}.json`);
writeFileSync(pin, JSON.stringify({
  name: `${format} — ${week}`, composition: format, props: contentPath,
  generatedAt: content.generatedAt ?? null,
  dataSource: 'Evlek MCP live_active_listings',
  social: { file: path.relative(ROOT, mp4), sha256: sha, frames: Number(nbFrames),
            fps: '60 CFR', codec: 'H.264 High@4.2 CRF15 slow · yuv420p · BT.709 tv · GOP120 · sessiz' },
}, null, 2) + '\n');

console.log(`✓ ${path.basename(mp4)} — ${nbFrames} kare · 60 CFR · BT.709 · tek stream`);
console.log(`  sha256 ${sha}`);
console.log(`  kontak sayfası ${path.relative(ROOT, sheet)}`);
console.log(`  pin ${path.relative(ROOT, pin)}`);
