// Bridge to a template's own apply-content.mjs.
//
// A template that carries content.json owns the script that inlines it. This
// just runs it, so a render can never use a page that has drifted from its
// manifest. Templates without content.json are rendered as-is.

import path from 'node:path';
import fs from 'node:fs/promises';

export async function applyContentIfPresent(templateDir, page) {
  const script = path.join(templateDir, 'apply-content.mjs');
  const content = path.join(templateDir, 'content.json');
  try {
    await fs.access(script);
    await fs.access(content);
  } catch {
    return { applied: false, reason: 'no content.json / apply-content.mjs in this template' };
  }
  const { applyContent } = await import(`file://${script}`);
  const res = await applyContent({
    contentFile: content,
    pageFile: path.join(templateDir, 'project', page),
  });
  return { applied: true, ...res };
}
