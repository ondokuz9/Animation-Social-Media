// Gerçek Evlek widget'ını Playwright'ta sürer ve hareket kitabındaki (06) B hareketlerini kare kare (60 fps) kaydeder.
// Görünüm değişmez: yalnız Web Animations ile giriş/vurgu hareketleri eklenir, harita kendi MapLibre örneğiyle sürülür.
// Kullanım: node capture.mjs <A|B|C|all>
import {chromium} from 'playwright';
import fs from 'fs';
import path from 'path';
import {openWidget, stopServer} from './harness.mjs';

const OUT = path.resolve('../public/wcap');
const FPS = 60;
const T = JSON.parse(fs.readFileSync('../src/v7/wtimes.json', 'utf8')); // ortak zamanlar (Remotion ile aynı)

const launch = () => chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});

async function prepare(widget, result) {
  const b = await launch();
  const ctx = await b.newContext({viewport: {width: 364, height: 900}, deviceScaleFactor: 3, colorScheme: 'dark'});
  const p = await ctx.newPage();
  const fr = await openWidget(p, {widget, result});
  // MapLibre örneğini yakala (aynı modül URL'si aynı örneği verir)
  await fr.evaluate(async () => {
    window.__maps = [];
    const ml = await import('https://evlek.app/maplibre/maplibre-gl.mjs');
    const M = ml.Map;
    for (const k of ['fitBounds', 'jumpTo', 'resize', 'triggerRepaint']) {
      const o = M.prototype[k];
      M.prototype[k] = function (...a) { if (!window.__maps.includes(this)) window.__maps.push(this); return o.apply(this, a); };
    }
  });
  await p.waitForTimeout(8000);
  await fr.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))));
  const h = await p.evaluate(() => document.getElementById('f').offsetHeight);
  await p.setViewportSize({width: 364, height: h});
  await p.waitForTimeout(1500);
  return {b, p, fr, h};
}

const settle = (fr) => fr.evaluate(() => new Promise((res) => {
  const m = (window.__maps || []).find((x) => x.getContainer().isConnected);
  const raf2 = () => requestAnimationFrame(() => requestAnimationFrame(res));
  if (!m) return raf2();
  if (m.loaded() && m.areTilesLoaded()) return raf2();
  let done = false; const fin = () => { if (!done) { done = true; raf2(); } };
  m.once('idle', fin); setTimeout(fin, 4000);
}));

async function shoot(p, fr, name, frames, h) {
  fs.mkdirSync(path.join(OUT, name), {recursive: true});
  for (const f of frames) {
    const t = (f * 1000) / FPS;
    await fr.evaluate((t) => { for (const a of window.__anims || []) a.currentTime = t; if (window.__hook) window.__hook(t); }, t);
    await settle(fr);
    await p.screenshot({path: path.join(OUT, name, `${String(f).padStart(4, '0')}.png`), clip: {x: 0, y: 0, width: 364, height: h}});
  }
  fs.writeFileSync(path.join(OUT, name, 'frames.json'), JSON.stringify({fps: FPS, frames, heightPt: h, widthPt: 364, scale: 3}));
  console.log(name, frames.length, 'kare');
}

const range = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i);
const ms2f = (ms) => Math.round((ms * FPS) / 1000);

// ---------- A: 52 ilan, giriş (B1, B2, B3, B5) + cümle→çip vurgusu (B4) ----------
async function seqA() {
  const {b, p, fr, h} = await prepare('../live/listing-cards-v3-14.html', '../live/w_search52.json');
  await fr.evaluate((T) => {
    const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const A = (window.__anims = []);
    const add = (el, kf, o) => { if (!el) return; const a = el.animate(kf, {fill: 'both', easing: E, ...o}); a.pause(); A.push(a); };
    add(document.getElementById('evlek-root'), [{transform: 'translateY(12px)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 320});
    add(document.querySelector('.es-map'), [{filter: 'blur(12px)'}, {filter: 'blur(0px)'}], {duration: 400});
    const lbls = [...document.querySelectorAll('.es-lbl')].sort((x, y) => x.getBoundingClientRect().x - y.getBoundingClientRect().x);
    const host = document.querySelector('.es-labels');
    lbls.forEach((l, i) => {
      const d = 250 + 70 * i;
      add(l, [{transform: 'scale(0.85)', opacity: 0}, {transform: 'scale(1)', opacity: 1}], {delay: d, duration: 240});
      const r = l.getBoundingClientRect(), hr = host.getBoundingClientRect();
      const ring = document.createElement('div');
      ring.style.cssText = `position:absolute;left:${r.x - hr.x + r.width / 2}px;top:${r.y - hr.y + r.height / 2}px;width:0;height:0;border-radius:50%;border:1.5px solid #fff;transform:translate(-50%,-50%);pointer-events:none;`;
      host.appendChild(ring);
      add(ring, [{width: '0px', height: '0px', opacity: 0.4}, {width: '56px', height: '56px', opacity: 0}], {delay: d - 40, duration: 420, easing: 'ease-out'});
    });
    const c = document.querySelector('.evlek-ttl .c');
    add(c, [{clipPath: 'inset(0 0 100% 0)', transform: 'translateY(70%)'}, {clipPath: 'inset(0 0 0 0)', transform: 'none'}], {delay: 300, duration: 240});
    [...document.querySelectorAll('.evlek-card')].slice(0, 3).forEach((card, i) => {
      const d = 380 + 60 * i;
      add(card, [{transform: 'translateX(48px)', opacity: 0}, {transform: 'none', opacity: 1}], {delay: d, duration: 360});
      add(card.querySelector('img'), [{transform: 'translateX(-4px) scale(1.04)'}, {transform: 'none'}], {delay: d, duration: 400});
      add(card.querySelector('.evlek-card__cnt'), [{opacity: 0}, {opacity: 1}], {delay: d + 120, duration: 200});
    });
    // B4: cümledeki ifadeler sırayla → karşılık gelen çip ince beyaz kenarla parlar
    const seg = document.querySelector('.evlek-seg button');
    const filt = document.querySelector('.evlek-chip');
    const glow = (el, at) => add(el, [{boxShadow: '0 0 0 0 rgba(255,255,255,0)'}, {boxShadow: '0 0 0 2px rgba(255,255,255,0.95)', offset: 0.35}, {boxShadow: '0 0 0 0 rgba(255,255,255,0)'}], {delay: at, duration: 420, easing: 'ease-in-out'});
    T.b4.forEach((at, i) => glow(i === 3 ? seg : filt, at));
  }, T.A);
  const end = ms2f(T.A.b4[3] + 450);
  await shoot(p, fr, 'A', range(0, end), h);
  await b.close();
}

// ---------- B: Lapta (B7 haritanın Lapta'ya inişi, B8 sıralı kartlar, B6 kaydırma, dokunma) ----------
async function seqB() {
  const {b, p, fr, h} = await prepare('../live/listing-cards-v3-14.html', '../live/w_lapta.json');
  await fr.evaluate((T) => {
    const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const A = (window.__anims = []);
    const add = (el, kf, o) => { if (!el) return; const a = el.animate(kf, {fill: 'both', easing: E, ...o}); a.pause(); A.push(a); };
    add(document.getElementById('evlek-root'), [{transform: 'translateY(12px)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 320});
    const lbls = [...document.querySelectorAll('.es-lbl')];
    const host = document.querySelector('.es-labels');
    lbls.forEach((l) => {
      add(l, [{transform: 'scale(0.85)', opacity: 0}, {transform: 'scale(1)', opacity: 1}], {delay: T.flyEnd - 120, duration: 260});
      const r = l.getBoundingClientRect(), hr = host.getBoundingClientRect();
      const ring = document.createElement('div');
      ring.style.cssText = `position:absolute;left:${r.x - hr.x + r.width / 2}px;top:${r.y - hr.y + r.height / 2}px;width:0;height:0;border-radius:50%;border:1.5px solid #fff;transform:translate(-50%,-50%);pointer-events:none;`;
      host.appendChild(ring);
      add(ring, [{width: '0px', height: '0px', opacity: 0.4}, {width: '56px', height: '56px', opacity: 0}], {delay: T.flyEnd - 160, duration: 420, easing: 'ease-out'});
    });
    const c = document.querySelector('.evlek-ttl .c');
    add(c, [{clipPath: 'inset(0 0 100% 0)', transform: 'translateY(70%)'}, {clipPath: 'inset(0 0 0 0)', transform: 'none'}], {delay: 300, duration: 240});
    const cards = [...document.querySelectorAll('.evlek-card')];
    cards.forEach((card, i) => {
      const d = 420 + 90 * Math.min(i, 3);
      add(card, [{transform: 'translateX(64px)', opacity: 0}, {transform: 'none', opacity: 1}], {delay: d, duration: 360});
      add(card.querySelector('img'), [{transform: 'translateX(-5px) scale(1.04)'}, {transform: 'none'}], {delay: d, duration: 400});
      add(card.querySelector('.evlek-card__price'), [{clipPath: 'inset(0 0 100% 0)', transform: 'translateY(60%)'}, {clipPath: 'inset(0 0 0 0)', transform: 'none'}], {delay: d + 360 + 80, duration: 240});
      add(card.querySelector('.evlek-card__cnt'), [{opacity: 0}, {opacity: 1}], {delay: d + 120, duration: 200});
    });
    // B6: kart şeridi momentumla kayar; fotoğraflar ters yöne %6 iç parallax; uçta ≤30 px lastik
    const track = document.getElementById('evlek-track');
    const target = cards[T.tapIndex].offsetLeft - 16;
    const imgs = cards.map((cd) => cd.querySelector('img'));
    // B7: harita Girne genelinden Lapta'ya iner (flyTo eğrisine yakın ease-in-out, 900 ms)
    const m = window.__maps.find((x) => x.getContainer().isConnected);
    const end = {c: m.getCenter(), z: m.getZoom()};
    const start = {c: {lng: T.flyFrom[0], lat: T.flyFrom[1]}, z: T.flyFromZ};
    const io = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    window.__hook = (t) => {
      const k = Math.max(0, Math.min(1, (t - T.flyStart) / (T.flyEnd - T.flyStart)));
      const e = io(k);
      const zArc = Math.sin(Math.PI * e) * -0.35; // flyTo gibi hafif yükselip inme
      m.jumpTo({center: [start.c.lng + (end.c.lng - start.c.lng) * e, start.c.lat + (end.c.lat - start.c.lat) * e], zoom: start.z + (end.z - start.z) * e + zArc});
      // kaydırma
      const s = Math.max(0, Math.min(1, (t - T.scroll[0]) / (T.scroll[1] - T.scroll[0])));
      const dec = 1 - Math.pow(1 - s, 3.2);
      const over = Math.sin(Math.PI * Math.min(1, s * 1.15)) * 0; // aşma yok (iOS snap)
      const x = target * dec + over;
      track.scrollLeft = x;
      const vel = target * (3.2 * Math.pow(1 - s, 2.2)) * (s > 0 && s < 1 ? 1 : 0);
      imgs.forEach((im) => { if (im && t >= T.scroll[0]) im.style.translate = `${Math.min(18, vel * 0.06 * 0.04)}px 0`; });
      // dokunma: basılan kart 80 ms'de %8 koyulaşır, bırakınca döner
      const pr = t >= T.press && t < T.press + 160 ? (t < T.press + 80 ? (t - T.press) / 80 : 1 - (t - T.press - 80) / 80) : 0;
      cards[T.tapIndex].style.filter = pr > 0 ? `brightness(${1 - 0.08 * pr})` : '';
    };
  }, T.B);
  const frames = [...range(0, ms2f(T.B.flyEnd + 700)), ...range(ms2f(T.B.scroll[0]), ms2f(T.B.scroll[1] + 50)), ...range(ms2f(T.B.press), ms2f(T.B.press + 200))];
  await shoot(p, fr, 'B', [...new Set(frames)].sort((a, b) => a - b), h);
  await b.close();
}

// ---------- C: ilan detayı (B10 galeri: 2 kaydırma, sayaç alttan maskeyle) ----------
async function seqC() {
  const {b, p, fr, h} = await prepare('../live/listing-detail-v3-11.html', '../live/w_detail_100102.json');
  const photos = JSON.parse(fs.readFileSync('../live/w_detail_100102.json', 'utf8'))._meta['evlek/widget'].photos.map((x) => x.url);
  await fr.evaluate(({T, photos}) => {
    const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const A = (window.__anims = []);
    const add = (el, kf, o) => { if (!el) return; const a = el.animate(kf, {fill: 'both', easing: E, ...o}); a.pause(); A.push(a); };
    const cover = document.querySelector('.di__cover');
    const img = cover.querySelector('img');
    const pos = cover.querySelector('.dv__pos');
    const W = cover.clientWidth;
    // Kayan şerit: aynı fotoğraflar, aynı kadraj (object-fit cover)
    const strip = document.createElement('div');
    strip.style.cssText = `position:absolute;inset:0;overflow:hidden;border-radius:inherit;`;
    const cs = getComputedStyle(img);
    [0, 1, 2].forEach((k) => {
      const box = document.createElement('div');
      box.style.cssText = `position:absolute;top:0;bottom:0;left:${k * W}px;width:${W}px;overflow:hidden;`;
      const im = document.createElement('img'); im.src = photos[k];
      im.style.cssText = `width:100%;height:100%;object-fit:${cs.objectFit || 'cover'};display:block;`;
      box.appendChild(im); strip.appendChild(box);
      box.dataset.k = k;
    });
    cover.insertBefore(strip, pos);
    img.style.visibility = 'hidden';
    const boxes = [...strip.children];
    // sayaç: alttan maskeyle değişen sayı
    const num = document.createElement('span');
    pos.textContent = '';
    pos.style.overflow = 'hidden';
    const labels = ['1 / 14', '2 / 14', '3 / 14'].map((s) => { const sp = document.createElement('span'); sp.textContent = s; sp.style.cssText = 'display:block;'; return sp; });
    const stack = document.createElement('span'); stack.style.cssText = 'display:block;height:1.25em;position:relative;';
    labels.forEach((l, i) => { l.style.position = i ? 'absolute' : 'relative'; l.style.left = '0'; l.style.top = '0'; stack.appendChild(l); });
    pos.appendChild(stack);
    window.__hook = (t) => {
      let x = 0;
      T.swipes.forEach((s, i) => { const k = Math.max(0, Math.min(1, (t - s) / T.swipeDur)); x += (1 - Math.pow(1 - k, 3)) * 1; });
      boxes.forEach((bx, k) => {
        bx.style.transform = `translateX(${-x * W}px)`;
        const im = bx.firstChild; const rel = k - x; im.style.transform = `translateX(${-rel * W * 0.08}px)`; // iç parallax
      });
      labels.forEach((l, i) => {
        const s = i === 0 ? -1 : T.swipes[i - 1];
        const inK = i === 0 ? 1 : Math.max(0, Math.min(1, (t - s - 60) / 220));
        const outS = T.swipes[i];
        const outK = outS === undefined ? 0 : Math.max(0, Math.min(1, (t - outS - 60) / 220));
        const ein = 1 - Math.pow(1 - inK, 3), eout = 1 - Math.pow(1 - outK, 3);
        l.style.transform = `translateY(${(1 - ein) * 100 - eout * 100}%)`;
        l.style.opacity = String(Math.min(ein, 1 - eout));
      });
      const pb = document.querySelector('.dv__pri');
      const pr = t >= T.press && t < T.press + 160 ? (t < T.press + 80 ? (t - T.press) / 80 : 1 - (t - T.press - 80) / 80) : 0;
      if (pb) pb.style.filter = pr > 0 ? `brightness(${1 - 0.08 * pr})` : '';
    };
  }, {T: T.C, photos});
  await fr.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))));
  const frames = [0, ...T.C.swipes.flatMap((s) => range(ms2f(s), ms2f(s + T.C.swipeDur + 120)))];
  await shoot(p, fr, 'C', [...new Set(frames)].sort((a, b) => a - b), h);
  await b.close();
}

const which = process.argv[2] || 'all';
try {
  if (which === 'A' || which === 'all') await seqA();
  if (which === 'B' || which === 'all') await seqB();
  if (which === 'C' || which === 'all') await seqC();
} finally { stopServer(); }
