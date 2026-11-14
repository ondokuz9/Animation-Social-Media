import {chromium} from 'playwright';
import {openWidget, stopServer} from './harness.mjs';
const [w, r] = process.argv.slice(2);
const b = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
const ctx = await b.newContext({viewport: {width: 364, height: 900}, deviceScaleFactor: 3, colorScheme: 'dark'});
const p = await ctx.newPage();
const fr = await openWidget(p, {widget: w, result: r});
await p.waitForTimeout(9000);
const out = await fr.evaluate(() => {
  const walk = (el, d) => {
    if (d > 6) return '';
    const r = el.getBoundingClientRect();
    const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.split(/\s+/).slice(0, 3).join('.') : '';
    const id = el.id ? '#' + el.id : '';
    const txt = el.children.length === 0 ? (el.textContent || '').trim().slice(0, 30) : '';
    let s = `${'  '.repeat(d)}${el.tagName.toLowerCase()}${id}${cls} [${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}] ${txt}\n`;
    if (el.tagName === 'svg' || el.classList?.contains('maplibregl-canvas-container')) return s;
    for (const c of el.children) s += walk(c, d + 1);
    return s;
  };
  return walk(document.body, 0);
});
console.log(out.split('\n').filter((l) => !/\[0,0 0x0\]/.test(l)).slice(0, 120).join('\n'));
await b.close(); stopServer();
