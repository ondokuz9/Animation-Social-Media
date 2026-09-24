// Inlines content.json into the design page as window.EVLEK_CONTENT.
//
// Why inline rather than fetch: the reel must stay a pure function of t. A
// runtime fetch would make the first frames depend on when a response arrived.
// The manifest is therefore written into the page's <helmet> as a literal, the
// same way the design already declares OM_SCENES and OM_AUDIO_MARKERS.
//
//   node apply-content.mjs [--content content.json] [--page "Evlek Reel v7.dc.html"] [--check]
//
// --check exits non-zero if the page is out of date with the manifest, without
// writing anything. Use it in a pre-render step.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BEGIN = '<!--EVLEK-CONTENT-BEGIN-->';
const END = '<!--EVLEK-CONTENT-END-->';

function block(content) {
  // JSON.stringify twice: once for the data, once to make it a safe JS string
  // literal. </script> inside a string would end the tag, so escape the slash.
  const json = JSON.stringify(JSON.stringify(content)).replace(/<\//g, '<\\/');
  return `${BEGIN}\n  <script>window.EVLEK_CONTENT = JSON.parse(${json});</script>\n  ${END}`;
}

export async function applyContent({
  contentFile = path.join(HERE, 'content.json'),
  pageFile = path.join(HERE, 'project', 'Evlek Reel v7.dc.html'),
  check = false,
} = {}) {
  const content = JSON.parse(await fs.readFile(contentFile, 'utf8'));
  const page = await fs.readFile(pageFile, 'utf8');
  const next = block(content);

  let updated;
  if (page.includes(BEGIN) && page.includes(END)) {
    const start = page.indexOf(BEGIN);
    const stop = page.indexOf(END) + END.length;
    updated = page.slice(0, start) + next + page.slice(stop);
  } else {
    // First run: place it directly after the scene declarations so it is set
    // before any component module evaluates.
    const anchor = page.indexOf('<style>');
    if (anchor < 0) throw new Error(`cannot find an insertion point in ${pageFile}`);
    updated = page.slice(0, anchor) + next + '\n  ' + page.slice(anchor);
  }

  if (check) {
    const ok = updated === page;
    console.log(ok
      ? '[content] page is in sync with content.json'
      : '[content] page is OUT OF SYNC with content.json — run: node apply-content.mjs');
    return { inSync: ok };
  }

  if (updated === page) {
    console.log('[content] already in sync, page untouched');
    return { inSync: true, written: false };
  }
  await fs.writeFile(pageFile, updated);
  console.log(`[content] wrote window.EVLEK_CONTENT into ${path.basename(pageFile)} ` +
    `(project_id=${content.project_id}, ${Object.keys(content.copy || {}).length} copy keys, ` +
    `${Object.keys(content.assets || {}).length} asset keys)`);
  return { inSync: false, written: true };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const opts = { check: argv.includes('--check') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--content') opts.contentFile = path.resolve(argv[++i]);
    else if (argv[i] === '--page') opts.pageFile = path.resolve(argv[++i]);
  }
  applyContent(opts)
    .then((r) => process.exit(opts.check && !r.inSync ? 1 : 0))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
