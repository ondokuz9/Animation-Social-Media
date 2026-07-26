// Proves that repeated pixels come from the design, not from the capture.
//
// The reel's entire animation state lives in inline styles and text nodes, so
// the serialised stage DOM at time t IS render(t). This pass seeks the same
// 1293 timestamps as the capture and hashes that DOM — no screenshots — giving
// a per-frame fingerprint of what the design draws, independent of rasterising.
//
// Cross-referenced with the PNG hashes in the capture manifest:
//   DOM equal + pixels equal  -> the design is holding still. Correct output.
//   DOM differs + pixels equal -> the design moved by less than one device
//                                pixel at 60 fps (e.g. a dash offset already
//                                past 0.98 of its ease). Still a real render.
//   DOM equal + pixels differ  -> impossible; would mean nondeterminism.
//   a frame missing / stale    -> a dropped or duplicated capture. The defect
//                                this audit exists to catch.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startServer } from './server.mjs';
import { openStage, FPS } from './stage.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT = path.join(REPO, 'out');
const PROJECT_DIR = path.join(REPO, 'project');
const DESIGN_PAGE = 'Evlek Reel v7.dc.html';

export async function domAudit({ fps = FPS, designPage = DESIGN_PAGE, projectDir = PROJECT_DIR } = {}) {
  const server = await startServer(projectDir);
  const stage = await openStage({
    origin: server.origin,
    page: designPage,
    imgDir: path.join(projectDir, 'img'),
    quiet: true,
  });

  const frameCount = Math.round(stage.duration * fps);
  const hashes = new Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    await stage.seek(i / fps);
    hashes[i] = await stage.page.evaluate(() => {
      const el = document.querySelector('svg[data-om-exportable-video-with-duration-secs]');
      const full = el.outerHTML;
      // data-screen-label carries a whole-second counter the design never
      // paints. Hashing without it separates "the design moved" from "a debug
      // attribute ticked over".
      const visual = full.replace(/ data-screen-label="[^"]*"/g, '');
      // FNV-1a via Math.imul — plain `*` would exceed 2^53 and silently lose
      // the low bits, which turns the hash into a collision generator.
      const fnv = (s) => {
        let h = 0x811c9dc5;
        for (let k = 0; k < s.length; k++) h = Math.imul(h ^ s.charCodeAt(k), 0x01000193) >>> 0;
        return `${h.toString(16)}:${s.length}`;
      };
      return { full: fnv(full), visual: fnv(visual) };
    });
    if (i % 300 === 0) process.stdout.write(`[domaudit] ${i}/${frameCount}\n`);
  }

  await stage.close();
  await server.close();

  const out = {
    fps, frameCount, durationSeconds: stage.duration,
    domHashes: hashes.map((h) => h.full),
    visualHashes: hashes.map((h) => h.visual),
  };
  await fs.writeFile(path.join(OUT, 'dom-audit.json'), JSON.stringify(out));
  console.log(`[domaudit] hashed ${frameCount} DOM states, ` +
    `${new Set(out.domHashes).size} distinct (${new Set(out.visualHashes).size} ignoring the debug label)`);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  domAudit().catch((e) => { console.error(e); process.exit(1); });
}
