// carousel.html -> sayfa_XX.png (1080x1350, dsf 1) + PDF (1080x1350 px sayfa) + yerleşim raporu
const {chromium} = require('playwright');
const path = require('path');
(async () => {
  const src = __dirname, out = path.dirname(src);
  const b = await chromium.launch();
  const pg = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 1});
  await pg.goto('file://' + path.join(src, 'carousel.html'));
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(300);
  const fonts = await pg.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
  console.log('yüklü font yüzü:', fonts);
  const pages = await pg.$$('section.page');
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({path: path.join(out, `sayfa_${String(i + 1).padStart(2, '0')}.png`)});
  }
  const rep = await pg.evaluate(() => {
    const r = [];
    document.querySelectorAll('section.page').forEach((s, i) => {
      const P = s.getBoundingClientRect();
      const y = el => Math.round(el.getBoundingClientRect().top - P.top), yb = el => Math.round(el.getBoundingClientRect().bottom - P.top);
      s.querySelectorAll('h1,p,li,.tagrow,.pricerow,.cue,.who,.end,blockquote,.eyebrow').forEach(el => {
        const bb = el.getBoundingClientRect();
        if (bb.right > P.right - 79.5 || bb.left < P.left + 79.5) r.push(`p${i + 1} TAŞMA ${el.className || el.tagName} ${Math.round(bb.left - P.left)}-${Math.round(bb.right - P.left)}`);
        // tek satırda tek kelime kalan başlık kontrolü için satır sayısı
      });
      const body = s.querySelector('.body');
      const nxt = s.querySelector('.card,.items,.figs,.stp,.end');
      let line = `p${i + 1} body ${y(body)}-${yb(body)}`;
      if (nxt) line += ` | sonraki öğe ${y(nxt)}-${yb(nxt)} (boşluk ${y(nxt) - yb(body)})`;
      const f = s.querySelector('.foot'); if (f) line += ` | foot ${y(f)}`;
      r.push(line);
    });
    return r;
  });
  console.log(rep.join('\n'));
  // PDF, PNG'lerden pdf.py ile üretilir (Chromium page.pdf sayfa yüksekliğini 1013.04 pt'ye yuvarlıyor ve altta 1 px boşluk bırakıyordu)
  await b.close();
})();
