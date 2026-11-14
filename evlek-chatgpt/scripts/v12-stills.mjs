// node scripts/v12-stills.mjs <klasör> <saniye1,saniye2,...>  (V12-916; dosya adı 2 ondalıklı)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
const [outDir, list] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'V12-916'});
for (const s of list.split(',').map(Number)) {
  const frame = Math.min(1799, Math.round(s * 60));
  const file = path.join(outDir, `k_${s.toFixed(2).replace('.', ',')}.png`);
  await renderStill({composition, serveUrl, output: file, frame});
  console.log('ok', file);
}
