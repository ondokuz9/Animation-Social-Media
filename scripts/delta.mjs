#!/usr/bin/env node
/**
 * delta.mjs — week-over-week change from two stored snapshots.
 *
 *   node scripts/delta.mjs content/snapshots/<önceki>.json content/snapshots/<yeni>.json
 *
 * Prints the `delta` block to paste into the week's content JSON. Deltas are
 * only ever computed between snapshots the pipeline actually stored — never
 * estimated, never back-filled.
 */
import { readFileSync } from 'node:fs';
const [, , aPath, bPath] = process.argv;
if (!aPath || !bPath) { console.error('kullanım: node scripts/delta.mjs <eski.json> <yeni.json>'); process.exit(1); }
const a = JSON.parse(readFileSync(aPath, 'utf8'));
const b = JSON.parse(readFileSync(bPath, 'utf8'));
const sum = (o) => Object.values(o.cities).reduce((x, y) => x + y, 0);
const days = Math.round((new Date(b.generatedAt) - new Date(a.generatedAt)) / 86400000);
const d = sum(b) - sum(a);
const label = days >= 6 ? 'BU HAFTA' : `SON ${days} GÜN`;
const perCity = Object.keys(b.cities).map((c) => ({ name: c, delta: b.cities[c] - (a.cities[c] ?? 0) }));
console.log(JSON.stringify({
  delta: { label, value: `${d >= 0 ? '+' : ''}${d}`, days, perCity },
  _not: days < 6 ? 'UYARI: 6 günden kısa aralık haftalık delta olarak sunulamaz.' : undefined,
}, null, 2));
