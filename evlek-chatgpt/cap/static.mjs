// node static.mjs <widget.html> <result.json> <out.png> [mode] [widthPt]
import {chromium} from 'playwright';
import fs from 'fs';
import {pathToFileURL} from 'url';
const [w, r, out, mode = 'inline', wpt = '364'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: +wpt, height: 900}, deviceScaleFactor: 3, colorScheme: 'dark'});
p.on('console', (m) => { const t = m.text(); if (!/DevTools/.test(t)) console.log('console', t.slice(0, 160)); });
p.on('requestfailed', (q) => console.log('FAIL', q.url().slice(0, 120)));
await p.addInitScript(([W, R, M]) => { window.__WIDGET__ = W; window.__RESULT__ = R; window.__MODE__ = M; }, [fs.readFileSync(w, 'utf8'), JSON.parse(fs.readFileSync(r, 'utf8')), mode]);
await p.goto(pathToFileURL(process.cwd() + '/host.html').href);
await p.waitForTimeout(+(process.env.WAIT||12000));
const h = await p.evaluate(() => document.getElementById('f').offsetHeight);
await p.setViewportSize({width: +wpt, height: Math.max(300, h)});
await p.waitForTimeout(1500);
await p.screenshot({path: out});
console.log('height', h);
await b.close();
