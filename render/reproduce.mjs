// Determinism gate: renders the whole timeline a second time and compares
// against the captured PNG hashes.
//
// This is the property that actually matters — "the same frame index always
// produces the same pixels" — and the only way to establish it is to render it
// again. It is not the same as "identical serialised DOM implies identical
// pixels": CSS rounds transform values on serialisation (a card at
// scale(1.0249994) and at scale(1.025) both serialise to "scale(1.025)"), while
// the rasteriser works from the unrounded float. So DOM equality can never be
// a pixel-equality gate; a second render can.
//
// The traversal is identical to the capture's (frame 0 upward, same warm pass),
// because that is what the capture does and what has to be reproducible.

import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { startServer } from './server.mjs';
import { openStage, FPS } from './stage.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT = path.join(REPO, 'out');
const PROJECT_DIR = path.join(REPO, 'project');
const DESIGN_PAGE = 'Evlek Reel v7.dc.html';

export async function reproduce({
  fps = FPS,
  designPage = DESIGN_PAGE,
  projectDir = PROJECT_DIR,
  manifestPath = path.join(OUT, 'capture-manifest.json'),
} = {}) {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const server = await startServer(projectDir);
  const stage = await openStage({
    origin: server.origin, page: designPage,
    imgDir: path.join(projectDir, 'img'), quiet: true,
  });

  const frameCount = Math.round(stage.duration * fps);
  const mismatches = [];
  const hashes = new Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    await stage.seek(i / fps);
    await stage.settle();
    const buf = await stage.page.screenshot({ clip: stage.clip, type: 'png' });
    hashes[i] = crypto.createHash('sha1').update(buf).digest('hex');
    if (hashes[i] !== manifest.frameHashes[i]) {
      mismatches.push({ frame: i + 1, t: +(i / fps).toFixed(3) });
    }
    if (i % 300 === 0) process.stdout.write(`[reproduce] ${i}/${frameCount} (${mismatches.length} mismatched)\n`);
  }

  await stage.close();
  await server.close();

  const report = {
    frameCount,
    matched: frameCount - mismatches.length,
    mismatches,
    identical: mismatches.length === 0,
  };
  await fs.writeFile(path.join(OUT, 'reproduce-report.json'), JSON.stringify(report, null, 2));
  console.log(`[reproduce] ${report.matched}/${frameCount} frames byte-identical to the capture`);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  reproduce().then((r) => process.exit(r.identical ? 0 : 1))
    .catch((e) => { console.error(e); process.exit(1); });
}
