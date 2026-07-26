// Deterministic frame-by-frame capture.
//
// No screen recording, no requestAnimationFrame sampling: for every frame the
// timeline is seeked to exactly frameIndex / 60 and the committed DOM is
// serialised as a lossless PNG. Same index in, same pixels out, every run.

import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { startServer } from './server.mjs';
import { openStage, WIDTH, HEIGHT, FPS } from './stage.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '..');
export const PROJECT_DIR = path.join(REPO, 'project');
export const DESIGN_PAGE = 'Evlek Reel v7.dc.html';
export const OUT_DIR = path.join(REPO, 'out');
export const FRAMES_DIR = path.join(OUT_DIR, 'frames');

const pad6 = (n) => String(n).padStart(6, '0');

export async function captureFrames({
  framesDir = FRAMES_DIR,
  designPage = DESIGN_PAGE,
  projectDir = PROJECT_DIR,
  fps = FPS,
} = {}) {
  await fs.rm(framesDir, { recursive: true, force: true });
  await fs.mkdir(framesDir, { recursive: true });

  const server = await startServer(projectDir);
  console.log(`[capture] serving ${projectDir} at ${server.origin}`);

  const stage = await openStage({
    origin: server.origin,
    page: designPage,
    imgDir: path.join(projectDir, 'img'),
  });

  // Frame count comes from the design itself (the Stage publishes the summed
  // scene durations), never from a hardcoded guess.
  const duration = stage.duration;
  const frameCount = Math.round(duration * fps);
  console.log(`[capture] duration ${duration}s from design -> ${frameCount} frames @ ${fps}fps`);
  console.log(`[capture] viewport ${WIDTH}x${HEIGHT} @ dsf 1`);

  const hashes = new Array(frameCount);
  const started = Date.now();

  for (let i = 0; i < frameCount; i++) {
    const t = i / fps;
    await stage.seek(t);
    await stage.settle();
    const buf = await stage.page.screenshot({ clip: stage.clip, type: 'png' });
    await fs.writeFile(path.join(framesDir, `frame_${pad6(i + 1)}.png`), buf);
    hashes[i] = crypto.createHash('sha1').update(buf).digest('hex');

    if (i % 60 === 0 || i === frameCount - 1) {
      const done = i + 1;
      const rate = done / ((Date.now() - started) / 1000);
      const eta = Math.round((frameCount - done) / rate);
      process.stdout.write(
        `[capture] ${done}/${frameCount} (t=${t.toFixed(3)}s) ` +
        `${rate.toFixed(1)} fps · eta ${eta}s\n`);
    }
  }

  await stage.close();
  await server.close();

  const manifest = {
    design: designPage,
    width: WIDTH,
    height: HEIGHT,
    fps,
    durationSeconds: duration,
    frameCount,
    firstFrameTime: 0,
    lastFrameTime: (frameCount - 1) / fps,
    capturedAt: new Date().toISOString(),
    captureSeconds: Math.round((Date.now() - started) / 1000),
    fonts: stage.fonts.loaded,
    imagesDecoded: stage.imageCount,
    frameHashes: hashes,
  };
  await fs.writeFile(path.join(OUT_DIR, 'capture-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`[capture] wrote ${frameCount} PNGs in ${manifest.captureSeconds}s`);
  return manifest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  captureFrames().catch((e) => { console.error(e); process.exit(1); });
}
