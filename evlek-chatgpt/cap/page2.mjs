import {chromium, devices} from 'playwright';
import fs from 'fs';
const url = 'https://evlek.app/tr/satilik/girne/lapta-da-deniz-manzarali-2-1-daire-evl-100102';
const b = await chromium.launch();
const ctx = await b.newContext({viewport: {width: 393, height: 647}, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'tr-TR', userAgent: devices['iPhone 15'].userAgent});
const p = await ctx.newPage();
await p.goto(url, {waitUntil: 'load', timeout: 90000});
await p.waitForTimeout(5000);
const rej = p.getByRole('button', {name: /^Reddet$/});
if (await rej.count()) await rej.first().click();
await p.waitForTimeout(1200);
// Ofis kartı (kişi adı + ofis adı) okunmaz hâle getirilir: yalnız bulanıklık, düzen değişmez
const info = await p.evaluate(() => {
  const cands = [...document.querySelectorAll('section,div,article,aside')].filter((el) => /BÜRO SAHİBİ|Büro sahibi/i.test(el.textContent || '') && /[ofis]/.test(el.textContent || ''))
    .map((el) => ({el, h: el.getBoundingClientRect().height})).filter((x) => x.h >= 150 && x.h <= 700).sort((a, b) => a.h - b.h);
  const card = cands[0]?.el;
  if (card) card.style.filter = 'blur(18px)';
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return {x: b.x, y: b.y, w: b.width, h: b.height}; };
  const img = [...document.images].filter((i) => i.getBoundingClientRect().width > 300).sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y)[0];
  const price = [...document.querySelectorAll('h1,h2,p,span,div')].find((el) => el.children.length === 0 && /^£139\.000$/.test((el.textContent || '').trim()) && el.getBoundingClientRect().y < 500);
  const wa = [...document.querySelectorAll('a,button')].find((el) => /WhatsApp/i.test(el.textContent || ''));
  return {card: r(card), photo: r(img?.closest('div') || img), img: r(img), price: r(price), wa: r(wa), h: document.documentElement.scrollHeight};
});
await p.waitForTimeout(400);
await p.screenshot({path: '../public/page/page_view.png'});
fs.writeFileSync('../public/page/page_rects.json', JSON.stringify(info, null, 1));
console.log(JSON.stringify(info));
await b.close();
