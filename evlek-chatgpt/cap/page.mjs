import {chromium, devices} from 'playwright';
const url = 'https://evlek.app/tr/satilik/girne/lapta-da-deniz-manzarali-2-1-daire-evl-100102';
const b = await chromium.launch();
const ctx = await b.newContext({viewport: {width: 393, height: 852}, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'tr-TR', userAgent: devices['iPhone 15'].userAgent});
const p = await ctx.newPage();
await p.goto(url, {waitUntil: 'load', timeout: 90000});
await p.waitForTimeout(5000);
// Çerez bandı: en gizlilikçi seçenek (Reddet)
const rej = p.getByRole('button', {name: /^Reddet$/});
if (await rej.count()) { await rej.first().click(); console.log('cookie: reddedildi'); }
await p.waitForTimeout(1200);
await p.screenshot({path: 'page_top.png'});
await p.screenshot({path: 'page_full.png', fullPage: true});
const info = await p.evaluate(() => ({h: document.documentElement.scrollHeight, title: document.title}));
console.log(JSON.stringify(info));
await b.close();
