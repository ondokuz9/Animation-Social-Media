// Renders a template instance without touching the approved V7 outputs.
//
// Same capture engine, same encode settings, different paths: its own frames
// directory, its own manifest, its own MP4 name. Nothing here can overwrite
// out/capture-manifest.json or the approved master.
//
//   node render-template.mjs --template ../video-system/templates/brand-reel-v7 \
//                            --label brand-reel-v7 \
//                            [--page "Evlek Reel v7.dc.html"] \
//                            [--compare ../out/capture-manifest.json] \
//                            [--keep-frames]
//
// --compare takes a capture manifest and asserts every frame hash matches, which
// is how a template is proven to render an approved reel unchanged.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { captureFrames, OUT_DIR } from './capture.mjs';
import { encode } from './encode.mjs';
import { probe } from './verify.mjs';
import { checkBaseline, BASELINES } from './baseline.mjs';
import { applyContentIfPresent } from './template-content.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');

function parseArgs(argv) {
  const o = { label: null, template: null, page: 'Evlek Reel v7.dc.html', compare: null, keepFrames: false, baseline: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--template') o.template = path.resolve(argv[++i]);
    else if (a === '--label') o.label = argv[++i];
    else if (a === '--page') o.page = argv[++i];
    else if (a === '--compare') o.compare = path.resolve(argv[++i]);
    else if (a === '--baseline') o.baseline = argv[++i];
    else if (a === '--keep-frames') o.keepFrames = true;
  }
  if (!o.template) throw new Error('--template <dir> is required');
  o.label ??= path.basename(o.template);
  return o;
}

export async function renderTemplate(opts) {
  const { template, label, page, compare, keepFrames, baseline } = opts;
  const projectDir = path.join(template, 'project');
  await fs.access(path.join(projectDir, page));

  // Keep the page's inlined content in step with content.json before rendering,
  // so a stale page can never silently produce the previous reel's copy.
  await applyContentIfPresent(template, page);

  const framesDir = path.join(OUT_DIR, `frames-${label}`);
  const manifestPath = path.join(OUT_DIR, `capture-manifest-${label}.json`);
  const outputName = `evlek_${label}_1080x1920_60fps_silent.mp4`;

  console.log(`=== 1/4 capture (${label}) ===========================`);
  const manifest = await captureFrames({ framesDir, manifestPath, projectDir, designPage: page });

  console.log(`=== 2/4 encode =======================================`);
  const output = await encode({ framesDir, name: outputName });
  const info = await probe(output);

  console.log(`=== 3/4 compare ======================================`);
  const comparison = { reference: null, frames: manifest.frameCount, mismatches: [], identical: null };
  if (compare) {
    const ref = JSON.parse(await fs.readFile(compare, 'utf8'));
    comparison.reference = path.relative(REPO, compare);
    if (ref.frameCount !== manifest.frameCount) {
      comparison.mismatches.push({ reason: 'frame count', got: manifest.frameCount, want: ref.frameCount });
    } else {
      for (let i = 0; i < manifest.frameCount; i++) {
        if (manifest.frameHashes[i] !== ref.frameHashes[i]) {
          comparison.mismatches.push({ frame: i + 1, t: +(i / manifest.fps).toFixed(3) });
        }
      }
    }
    comparison.identical = comparison.mismatches.length === 0;
    console.log(comparison.identical
      ? `  all ${manifest.frameCount} frames byte-identical to ${comparison.reference}`
      : `  ${comparison.mismatches.length}/${manifest.frameCount} frames differ from ${comparison.reference}`);
    console.log(`  duration ${info.durationSeconds}s · ${info.nbFrames} frames · ${info.frameRate}fps · ` +
      `${info.codec} ${info.profile} · ${info.width}x${info.height} · ${info.pixFmt}`);
  } else {
    console.log('  no --compare manifest given, skipping frame-hash comparison');
  }

  console.log(`=== 4/4 baseline check ===============================`);
  let check = null;
  if (baseline) {
    check = await checkBaseline({ id: baseline, video: output, source: projectDir, page, label });
  } else {
    console.log(`  no --baseline given; run: node baseline.mjs check --source ${path.relative(REPO, projectDir)}`);
  }

  const report = {
    label, template: path.relative(REPO, template), page, output: path.relative(REPO, output),
    probe: info, comparison, baseline_check: check ? { id: baseline, passed: check.passed } : null,
    frames_kept: keepFrames ? path.relative(REPO, framesDir) : null,
    rendered_at: new Date().toISOString(),
  };
  await fs.writeFile(path.join(OUT_DIR, `render-template-${label}.json`), JSON.stringify(report, null, 2) + '\n');

  if (!keepFrames) {
    await fs.rm(framesDir, { recursive: true, force: true });
    console.log(`[cleanup] removed ${path.relative(REPO, framesDir)} (pass --keep-frames to keep)`);
  }

  const ok = (comparison.identical !== false) && (check ? check.passed : true);
  console.log(`\n${ok ? 'TEMPLATE RENDER OK' : 'TEMPLATE RENDER DIFFERS'} — ${path.relative(REPO, output)}`);
  return { ...report, passed: ok };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  renderTemplate(parseArgs(process.argv.slice(2)))
    .then((r) => process.exit(r.passed ? 0 : 1))
    .catch((e) => { console.error(e.message); process.exit(1); });
}

export { BASELINES };
