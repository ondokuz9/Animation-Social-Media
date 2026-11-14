// VIDEO-1 v12 · gerçek Evlek widget'ının durağan yakalamaları (yeniden çizim yok).
// Çalıştır: cd cap && node capture-v12.mjs   → ../public/v12/w/*.png + manifest.json
// Viewport 393 pt × DPR 3 = 1179 px (telefon ekranı genişliği). Koyu tema, ChatGPT benzeri ev sahibi.
// Veri: live/w_lapta.json, live/w_search52.json, live/w_detail_100102.json (ofis adı alanları null'a çekilir).
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {launch, openWidget, stopServer} from './harness-v12.mjs';

const OUT = path.resolve('../public/v12/w');
fs.mkdirSync(OUT, {recursive: true});
const TMP = path.resolve('../out/v12cap'); // geçici (git dışı)
const man = {};
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const save = (name, meta = {}) => { man[name] = {...meta, sha256: sha(path.join(OUT, name))}; console.log(name, JSON.stringify(meta).slice(0, 200)); };
const R = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; };
const b = await launch();
const ctxOf = (h) => b.newContext({viewport: {width: 393, height: h}, deviceScaleFactor: 3, colorScheme: 'dark'});
const imgsDone = (fr) => fr.evaluate(() => Promise.race([new Promise((r) => setTimeout(r, 6000)), Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))))]));

// ---- satır içi sonuç (Lapta / Girne): tam görüntü + kart şeridinin dikişli tam içeriği
async function inline(tag, result) {
  const ctx = await ctxOf(900); const p = await ctx.newPage();
  const fr = await openWidget(p, {widget: '../live/listing-cards-v3-14.html', result});
  await p.waitForTimeout(12000); await imgsDone(fr);
  const h = await p.evaluate(() => document.getElementById('f').offsetHeight);
  await p.setViewportSize({width: 393, height: h}); await p.waitForTimeout(2000);
  const f = `w${tag}.png`; await p.screenshot({path: path.join(OUT, f)});
  const info = await fr.evaluate(() => {
    const R = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; };
    const cards = [...document.querySelectorAll('.evlek-card')];
    let sc = cards[0]; while (sc && !(sc.scrollWidth > sc.clientWidth + 20)) sc = sc.parentElement;
    return {cards: cards.map((c) => ({r: R(c), t: c.innerText.replace(/\s+/g, ' ').slice(0, 60)})), sc: R(sc), sw: sc.scrollWidth, cw: sc.clientWidth,
      top: R(document.querySelector('.evlek-top')), wrap: R(document.getElementById('evlek-carousel-wrap')), acts: R(document.querySelector('.evlek-acts'))};
  });
  save(f, {h, ...info, cards: info.cards});
  if (tag === 'Lapta') {
    // kart şeridi: scrollLeft adımlarıyla yakala (gerçek piksel; kaydırma yalnız konum). Dikiş compose-v12.py'de.
    const sc = info.sc, cw = info.cw, sw = info.sw, tiles = [];
    fs.mkdirSync(TMP, {recursive: true});
    for (let s = 0, i = 0; ; s = Math.min(s + cw - 40, sw - cw), i++) {
      await fr.evaluate((s) => { const c = document.querySelector('.evlek-card'); let e = c; while (!(e.scrollWidth > e.clientWidth + 20)) e = e.parentElement; e.style.scrollSnapType = 'none'; e.style.scrollBehavior = 'auto'; e.scrollLeft = s; }, s);
      await p.waitForTimeout(700);
      const real = await fr.evaluate(() => { const c = document.querySelector('.evlek-card'); let e = c; while (!(e.scrollWidth > e.clientWidth + 20)) e = e.parentElement; return e.scrollLeft; });
      const tf = path.join(TMP, `row_${i}.png`);
      await p.screenshot({path: tf, clip: {x: sc.x, y: sc.y, width: cw, height: sc.h}});
      tiles.push({f: tf, scrollLeft: real});
      if (s >= sw - cw) break;
    }
    fs.writeFileSync(path.join(TMP, 'lapta.json'), JSON.stringify({full: path.join(OUT, f), tiles, info}, null, 1));
  }
  await ctx.close();
}

// ---- tam ekran detay: karta dokunuş → gerçek get_listing yanıtı → detay görünümü
async function detail() {
  const H = 760; // 852 pt ekran − 47 durum çubuğu − 45 ChatGPT tam ekran başlığı
  const ctx = await ctxOf(H); const p = await ctx.newPage();
  const fr = await openWidget(p, {widget: '../live/listing-cards-v3-14.html', result: '../live/w_lapta.json', mode: 'fullscreen', detail: '../live/w_detail_100102.json', height: H});
  await p.waitForTimeout(9000);
  await fr.evaluate(() => [...document.querySelectorAll('.evlek-card')].find((e) => /139\.000/.test(e.innerText)).click());
  await p.waitForTimeout(7000);
  // Konum bölümündeki mini harita bu ev sahibinde kahramanın üstüne taşıyor (yerleşim hatası); widget'ın kendi
  // hata dalı gibi (mini.remove()) kaldırılır.
  await fr.evaluate(() => document.querySelectorAll('.dv__mini').forEach((e) => e.remove()));
  await imgsDone(fr); await p.waitForTimeout(1500);
  const geo = async () => fr.evaluate(() => { const R = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return {x: r.x, y: r.y + scrollY, w: r.width, h: r.height}; };
    return {sh: document.scrollingElement.scrollHeight, hero: R(document.querySelector('.dv__hero')), next: R(document.querySelector('.dv__next')), out: R(document.querySelector('.dv__out')), outT: document.querySelector('.dv__out').innerText, bar: R(document.querySelector('.dv__bar')), pos: document.querySelector('.dv__pos')?.innerText}; });
  await p.screenshot({path: path.join(OUT, 'dBar.png'), clip: {x: 0, y: H - 69, width: 393, height: 69}});
  const g1 = await geo();
  save('dBar.png', {y: H - 69, h: 69});
  // uzun görüntü: sabit alt çubuk gizli, tüm sayfa (kaydırma Remotion'da konumla)
  const tall = async (name) => {
    await fr.evaluate(() => { const b = document.querySelector('.dv__bar'); if (b) b.style.visibility = 'hidden'; });
    await p.setViewportSize({width: 393, height: g1.sh}); await p.evaluate((h) => { document.getElementById('f').style.height = h + 'px'; }, g1.sh);
    await p.waitForTimeout(1500); await imgsDone(fr);
    await p.screenshot({path: path.join(OUT, name)});
    const g = await geo();
    await p.setViewportSize({width: 393, height: H}); await p.evaluate((h) => { document.getElementById('f').style.height = h + 'px'; }, H);
    await fr.evaluate(() => { const b = document.querySelector('.dv__bar'); if (b) b.style.visibility = ''; });
    await p.waitForTimeout(800);
    return g;
  };
  save('dFull_1.png', await tall('dFull_1.png'));
  await fr.evaluate(() => document.querySelector('.dv__next').click());
  await p.waitForTimeout(3000); await imgsDone(fr);
  save('dFull_2.png', await tall('dFull_2.png'));
  const ev = await p.evaluate(() => { window.__events.length = 0; return 1; });
  await fr.evaluate(() => document.querySelector('.dv__out').click()); await p.waitForTimeout(400);
  man.dv_out_opens = (await p.evaluate(() => window.__events)).find((e) => e.__evlekHost === 'open')?.href || null;
  console.log('dv__out →', man.dv_out_opens);
  await ctx.close();
}

await inline('Lapta', '../live/w_lapta.json');
await inline('Girne', '../live/w_search52.json');
await detail();
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(man, null, 1));
await b.close(); stopServer();
