import {chromium} from 'playwright';
import {openWidget, stopServer} from './harness.mjs';
const [w, r] = process.argv.slice(2);
const b = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
const ctx = await b.newContext({viewport: {width: 364, height: 900}, deviceScaleFactor: 3, colorScheme: 'dark'});
const p = await ctx.newPage();
// Harita örneğini yakalamak için: maplibre modülü yüklenince Map.prototype'a kanca (görünümü değiştirmez)
await ctx.addInitScript(() => {
  window.__maps = [];
  const iv = setInterval(() => {}, 1000);
});
const fr = await openWidget(p, {widget: w, result: r});
await fr.evaluate(async () => {
  const ml = await import('https://evlek.app/maplibre/maplibre-gl.mjs');
  const M = ml.Map || ml.default?.Map;
  window.__mlKeys = Object.keys(ml).slice(0, 12);
  if (M) { const orig = M.prototype.fitBounds; M.prototype.fitBounds = function (...a) { (window.__maps ||= []).push(this); return orig.apply(this, a); }; const oj = M.prototype.jumpTo; M.prototype.jumpTo = function (...a) { (window.__maps ||= []).includes(this) || window.__maps.push(this); return oj.apply(this, a); }; }
});
await p.waitForTimeout(9000);
const info = await fr.evaluate(() => ({keys: window.__mlKeys, n: (window.__maps || []).length, cam: window.__maps?.[0] ? {c: window.__maps[0].getCenter(), z: window.__maps[0].getZoom()} : null}));
console.log(JSON.stringify(info));
await b.close(); stopServer();
