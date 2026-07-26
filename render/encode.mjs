// PNG sequence -> H.264 master, one single-pass encode.
//
// The PNG sequence is full-range sRGB RGB; the master is limited-range
// yuv420p tagged BT.709, so the matrix conversion is stated explicitly in the
// scale filter rather than left to swscale's defaults.

import path from 'node:path';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '..');
export const OUT_DIR = path.join(REPO, 'out');
export const FFMPEG = ffmpegPath;
export const FFPROBE = ffprobeStatic.path;
export const OUTPUT_NAME = 'evlek_reel_v7_1080x1920_60fps_silent_master.mp4';

export function run(bin, args, { quiet = false } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args);
    let out = '', err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => {
      err += d;
      if (!quiet) {
        const line = String(d).trim().split('\n').pop();
        if (/^frame=/.test(line)) process.stdout.write(`\r  ${line.slice(0, 110)}`);
      }
    });
    p.on('error', reject);
    p.on('close', (code) => {
      if (!quiet) process.stdout.write('\n');
      code === 0 ? resolve({ out, err }) : reject(new Error(`${path.basename(bin)} exited ${code}\n${err.slice(-3000)}`));
    });
  });
}

export function encodeArgs({ framesGlob, output, fps = 60 }) {
  return [
    '-hide_banner',
    '-y',
    '-framerate', String(fps),
    '-i', framesGlob,
    '-vf', 'scale=1080:1920:in_range=full:out_range=tv:in_color_matrix=bt709:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '17',
    '-profile:v', 'high',
    '-level:v', '4.2',
    '-pix_fmt', 'yuv420p',
    '-maxrate', '16M',
    '-bufsize', '24M',
    '-g', '30',
    '-x264-params', 'interlaced=0',            // progressive, stated not assumed
    '-colorspace', 'bt709',
    '-color_primaries', 'bt709',
    '-color_trc', 'bt709',
    '-color_range', 'tv',
    '-movflags', '+faststart',
    '-an',
    '-r', String(fps),
    output,
  ];
}

export async function encode({ framesDir, outDir = OUT_DIR, name = OUTPUT_NAME, fps = 60 } = {}) {
  const output = path.join(outDir, name);
  const args = encodeArgs({ framesGlob: path.join(framesDir, 'frame_%06d.png'), output, fps });
  console.log(`[encode] ffmpeg ${args.join(' ')}`);
  await run(FFMPEG, args);
  const { size } = await fs.stat(output);
  console.log(`[encode] wrote ${name} (${(size / 1048576).toFixed(2)} MiB)`);
  return output;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  encode({ framesDir: path.join(OUT_DIR, 'frames') })
    .catch((e) => { console.error(e); process.exit(1); });
}
