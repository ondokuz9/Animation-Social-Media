// Orchestrator: capture -> encode -> verify -> visual QC. PNGs survive until
// verification passes, so a bad master can always be re-encoded without
// re-rendering.
//
//   node render.mjs                 full run, keeps frames/
//   node render.mjs --keep-frames   explicit (same as default)
//   node render.mjs --clean-frames  delete frames/ after verification passes
//   node render.mjs --encode-only   reuse existing frames/, skip capture

import path from 'node:path';
import fs from 'node:fs/promises';
import { captureFrames, FRAMES_DIR, OUT_DIR } from './capture.mjs';
import { encode, OUTPUT_NAME } from './encode.mjs';
import { verify } from './verify.mjs';
import { domAudit } from './domaudit.mjs';
import { reproduce } from './reproduce.mjs';

const argv = new Set(process.argv.slice(2));

async function main() {
  const started = Date.now();
  await fs.mkdir(OUT_DIR, { recursive: true });

  if (!argv.has('--encode-only')) {
    console.log('=== 1/6 capture ======================================');
    await captureFrames();
  } else {
    console.log('=== 1/6 capture (skipped, --encode-only) =============');
  }

  console.log('=== 2/6 encode =======================================');
  const output = await encode({ framesDir: FRAMES_DIR });

  console.log('=== 3/6 design-state audit ===========================');
  await domAudit();

  console.log('=== 4/6 reproducibility pass =========================');
  await reproduce();

  console.log('=== 5/6 verify =======================================');
  const report = await verify({ file: output });

  if (!report.passed) {
    console.error('verification failed — frames kept at ' + FRAMES_DIR);
    process.exit(1);
  }

  if (!argv.has('--skip-qc')) {
    console.log('=== 6/6 visual QC ====================================');
    const { qualityControl } = await import('./qc.mjs');
    const qc = await qualityControl();
    if (!qc.passed) {
      console.error('visual QC failed — frames kept at ' + FRAMES_DIR);
      process.exit(1);
    }
  } else {
    console.log('=== 6/6 visual QC (skipped, --skip-qc) ===============');
  }

  if (argv.has('--clean-frames')) {
    await fs.rm(FRAMES_DIR, { recursive: true, force: true });
    console.log(`[cleanup] removed ${FRAMES_DIR}`);
  } else {
    console.log(`[cleanup] frames kept at ${FRAMES_DIR} (pass --clean-frames to delete)`);
  }

  console.log(`\nmaster: ${path.join(OUT_DIR, OUTPUT_NAME)}`);
  console.log(`total: ${Math.round((Date.now() - started) / 1000)}s`);
}

main().catch((e) => { console.error(e); process.exit(1); });
