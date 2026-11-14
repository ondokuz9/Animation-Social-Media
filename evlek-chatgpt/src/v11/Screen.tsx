// v11 · telefon ekranı (1179×2556 tasarım px). Arayüz temsilidir; bütün ilan verisi gerçektir.
// ChatGPT logosu yok; "ChatGPT" yalnız yazı. Kişi/ofis adı, bildirim, abonelik bilgisi yok.
// v10'dan farklar (kurul): tek Lapta sorgusu, dolu gelen sayfalar, iOS push/geri, 3 adımlı kart snap'i,
// galeri swipe'ı, "Evlek hazır" karşılaması yok, kart yeri boş kalmaz.
import React from 'react';
import {Easing, Img, staticFile} from 'remotion';
import {C, E, EIN, EvIcon, F, HERO, LAPTA, ALT, Listing, MAPS, MAP_H, MAP_W, MapView, S, cl, gbp, IO, lin, mix, project, win} from '../v10/core';
import {SH, SW} from '../v10/Phone';
import {TL} from './tl';
import SEMT_POLY from '../v10/semts.json';

// ---------- renkler (koyu tema) ----------
const K = {bg: '#0D0F13', bg2: '#15181E', card: '#1C2027', line: 'rgba(255,255,255,.08)', text: '#EEF0F3', sub: '#A3AAB5', dim: '#7A828E', bubble: '#2A2E36', blue: '#7FB2FF'};

// ---------- küçük yardımcılar ----------
const img = (p: string) => staticFile(p);
/** basma: 83 ms giriş + 100 ms çıkış; [ölçek, halka opaklığı] */
export const press = (t: number, at: number) => {
  if (t < at || t > at + 0.2) return {s: 1, a: 0};
  const i = lin(t, at, at + 0.083), o = lin(t, at + 0.083, at + 0.183);
  return t < at + 0.083 ? {s: mix(1, 0.96, S(i)), a: S(i)} : {s: mix(0.96, 1, S(o)), a: 1 - S(o)};
};
const Ring: React.FC<{t: number; at: number; x: number; y: number; r?: number}> = ({t, at, x, y, r = 70}) => {
  const p = press(t, at);
  if (p.a <= 0) return null;
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: `rgba(220,226,232,${0.34 * p.a})`, transform: `scale(${mix(0.7, 1, p.a)})`, pointerEvents: 'none'}} />;
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * lin(t, a, b)));

// ---------- ikonlar ----------
const Ico = {
  menu: (c = K.text) => <svg width="64" height="64" viewBox="0 0 24 24"><path d="M4 8h16M4 16h10" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  edit: (c = K.text) => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>,
  back: (c = K.text) => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>,
  plus: (c = K.text, w = 64) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  mic: (c = K.text) => <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  up: (c = '#0D0F13') => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>,
  search: (c = K.sub, w = 52) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>,
  arrow: (c = '#0D0F13') => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  out: (c = K.text) => <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 16L16 8M9 8h7v7" /></svg>,
  expand: (c = K.text) => <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>,
  check: (c = '#3DDC97', w = 40) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  share: (c = K.text) => <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>,
  pin: (c = K.sub) => <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>,
  close: (c = K.text) => <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  lock: (c = '#5B6574') => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
};

// ---------- durum çubuğu ve üst çubuk ----------
const StatusBar: React.FC<{light?: boolean}> = ({light}) => {
  const c = light ? '#0D1520' : K.text;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 150, fontFamily: F, color: c}}>
      <div style={{position: 'absolute', left: 128, top: 52, fontSize: 52, fontWeight: 600, letterSpacing: '-0.01em'}}>9:41</div>
      <div style={{position: 'absolute', right: 110, top: 62, display: 'flex', gap: 18, alignItems: 'center'}}>
        <svg width="58" height="36" viewBox="0 0 29 18">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 7.5} y={14 - i * 4} width="5" height={4 + i * 4} rx="1.3" fill={c} />)}</svg>
        <svg width="52" height="38" viewBox="0 0 26 19"><path d="M13 17.5l3.2-3.7a4.6 4.6 0 0 0-6.4 0z M5.6 10.2a10.6 10.6 0 0 1 14.8 0l-2.2 2.4a7.4 7.4 0 0 0-10.4 0z M1.2 5.6a17 17 0 0 1 23.6 0l-2.2 2.4a13.8 13.8 0 0 0-19.2 0z" fill={c} /></svg>
        <div style={{width: 74, height: 36, borderRadius: 11, border: `3px solid ${light ? 'rgba(13,21,32,.4)' : 'rgba(238,240,243,.45)'}`, padding: 3, boxSizing: 'border-box'}}><div style={{width: '82%', height: '100%', borderRadius: 6, background: c}} /></div>
      </div>
    </div>
  );
};
const NavBar: React.FC<{title?: string}> = ({title = 'ChatGPT'}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 160, height: 120, fontFamily: F, color: K.text}}>
    <div style={{position: 'absolute', left: 62, top: 28}}>{Ico.menu()}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontSize: 54, fontWeight: 600, letterSpacing: '-0.02em'}}>{title}</div>
    <div style={{position: 'absolute', right: 62, top: 28}}>{Ico.edit()}</div>
  </div>
);

// ---------- Evlek çipi ----------
const EvChip: React.FC<{size?: number}> = ({size = 48}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.22, padding: `${size * 0.1}px ${size * 0.34}px ${size * 0.1}px ${size * 0.12}px`, borderRadius: size, background: 'rgba(127,178,255,.16)', color: K.blue, fontWeight: 600, fontSize: size, verticalAlign: 'middle', marginRight: size * 0.28, lineHeight: 1.15}}>
    <EvIcon size={size * 1.1} r={0.3} />Evlek
  </span>
);

// ---------- yazım kutusu ----------
const COMP_BOTTOM = 70, COMP_PAD = 40, LH = 68;
const Composer: React.FC<{lines: string[]; chip: boolean; caret?: boolean; t: number; sendAt?: number; placeholder?: string; focus?: number}> = ({lines, chip, caret, t, sendAt, placeholder = 'ChatGPT’ye sor', focus = 0}) => {
  const has = lines.some((l) => l.length > 0);
  const n = Math.max(1, lines.length) + (chip && has ? 1 : 0);
  const h = 176 + (n - 1) * LH;
  const p = sendAt !== undefined ? press(t, sendAt) : {s: 1, a: 0};
  const blink = caret && Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 36, right: 36, bottom: COMP_BOTTOM, height: h, borderRadius: 88, background: '#1F232A', boxShadow: `inset 0 0 0 2px ${focus ? `rgba(127,178,255,${0.35 * focus})` : 'rgba(255,255,255,.07)'}`, fontFamily: F}}>
      <div style={{position: 'absolute', left: 40, bottom: 56}}>{Ico.plus(K.sub, 60)}</div>
      <div style={{position: 'absolute', left: 140, right: 250, top: 50, fontSize: 50, lineHeight: `${LH}px`, color: K.text, letterSpacing: '-0.01em'}}>
        {chip && <EvChip size={46} />}
        {chip && has && <br />}
        {!has && !caret && <span style={{color: K.dim}}>{chip ? '' : placeholder}</span>}
        {lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
        {caret && <span style={{display: 'inline-block', width: 4, height: 56, marginLeft: 4, verticalAlign: -10, background: blink ? K.blue : 'transparent'}} />}
      </div>
      <div style={{position: 'absolute', right: 150, bottom: 58}}>{Ico.mic(K.sub)}</div>
      <div style={{position: 'absolute', right: 26, bottom: 30, width: 112, height: 112, borderRadius: 56, background: has ? '#F2F4F7' : '#3A3F48', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p.s})`}}>
        {Ico.up(has ? '#0D0F13' : K.sub)}
      </div>
      <Ring t={t} at={sendAt ?? -9} x={SW - 72 - 26 - 56} y={h - 30 - 56} r={86} />
    </div>
  );
};
export const composerTop = (n: number) => SH - COMP_BOTTOM - (176 + (n - 1) * LH);

// ---------- sohbet akışı yerleşimi (akış koordinatı) ----------
const TOP = 300;
const WID = {x: 40, w: SW - 80};
const MAPD = {h: 640}; // harita penceresi kırpılır: soru, widget ve kartlar kaydırmasız aynı ekrana sığar
const CARD = {w: 540, ph: 400, h: 680, gap: 24, pad: 24};
const WH = MAPD.h + 130 + 116 + CARD.h + 40 + 130;
const Q = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1'];
const Q3 = ['Bunu £127.000’likle', 'karşılaştır.'];
export const QTEXT = {q: Q, q3: Q3};
const bubbleH = (n: number) => n * LH + 76;
const Y = (() => {
  const y: Record<string, number> = {};
  let c = 40;
  y.q = c; c += bubbleH(Q.length) + 36;
  y.tr = c; c += 84 + 30;
  y.wB = c; c += WH + 40;
  y.aB = c; c += 190;
  y.q3 = c; c += bubbleH(Q3.length) + 36;
  y.tr3 = c; c += 84 + 30;
  y.cmp = c; c += 1130 + 40;
  y.end = c;
  return y;
})();
export const scrollAt = (t: number) => (t < TL.scrollC[0] ? 0 : mix(0, Y.q3 - 40, Easing.bezier(0.25, 0.1, 0, 1)(lin(t, TL.scrollC[0], TL.scrollC[1]))));
// kart snap'i: 3 adım; iniş anlarında sağa hizalı kart: 3 (£120.000), 4 (£127.000), 5 (£139.000)
const SNAP = Easing.bezier(0.3, 0, 0.1, 1);
const cxFor = (i: number) => CARD.pad + i * (CARD.w + CARD.gap) - (WID.w - CARD.gap - CARD.w);
const carX = (t: number) => {
  const st = [[TL.snaps[0] - 0.2, 0.5, 0, cxFor(3)], [TL.snaps[1], TL.snapDur, cxFor(3), cxFor(4)], [TL.snaps[2], TL.snapDur, cxFor(4), cxFor(5)]];
  let v = 0;
  for (const [a, d, x0, x1] of st) if (t >= a) v = mix(x0, x1, SNAP(lin(t, a, a + d)));
  return v;
};
/** basılan kartın ekran dikdörtgeni (portal için) */
export const heroCardRect = (t: number) => {
  const x = WID.x + CARD.pad + 5 * (CARD.w + CARD.gap) - carX(t);
  const y = TOP + Y.wB + MAPD.h + 130 + 116 - scrollAt(t);
  return {x, y, w: CARD.w, h: CARD.h, ph: CARD.ph};
};
/** yazım kutusundaki Evlek çipinin ekran merkezi (imza hareketi hedefi) */
export const CHIP = {x: 36 + 140 + 118, y: SH - COMP_BOTTOM - 176 + 50 + 34, h: 50};
/** "Eklentiyi kur" düğmesinin ekran merkezi */
export const INSTALL_BTN = {x: SW / 2, y: SH - 110 - 75};

// ---------- balon ----------
const Bubble: React.FC<{lines: string[]; chip?: boolean}> = ({lines, chip}) => (
  <div style={{display: 'flex', justifyContent: 'flex-end', paddingRight: 44}}>
    <div style={{maxWidth: 1010, padding: '38px 48px', borderRadius: 60, background: K.bubble, fontFamily: F, fontSize: 50, lineHeight: `${LH}px`, color: K.text, letterSpacing: '-0.01em'}}>
      {chip && <EvChip size={44} />}
      {lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
    </div>
  </div>
);
// Evlek yükleme izi: kısa ve şık
const Trace: React.FC<{t: number; a: number; b: number; done: string}> = ({t, a, b, done}) => {
  const k = lin(t, a, b);
  const fin = t >= b;
  const sh = ((t - a) * 1.6) % 1;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 52, fontFamily: F, fontSize: 42, color: K.sub, height: 84}}>
      <EvIcon size={76} r={0.3} />
      {fin ? (
        <span><span style={{color: K.text, fontWeight: 600}}>Evlek</span> · {done}</span>
      ) : (
        <span style={{backgroundImage: `linear-gradient(90deg, ${K.dim} ${sh * 160 - 40}%, #E6EBF2 ${sh * 160 - 20}%, ${K.dim} ${sh * 160}%)`, WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 500}}>Evlek’te aranıyor…</span>
      )}
      <div style={{flex: 1, maxWidth: 220, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.08)', overflow: 'hidden', opacity: fin ? 0 : 1}}>
        <div style={{width: `${k * 100}%`, height: '100%', background: K.blue}} />
      </div>
    </div>
  );
};

// ---------- harita ----------
type View = {lng: number; lat: number; z: number};
const viewAt = (k: number): View => {
  // Girne → Lapta: zum logaritmik, merkez zumla birlikte
  const a = MAPS.girne, b = MAPS.lapta;
  const z = mix(a.z, b.z, k);
  const kk = (Math.pow(2, z - a.z) - 1) / (Math.pow(2, b.z - a.z) - 1); // ekranda düzgün yaklaşma
  return {z, lng: mix(a.lng, b.lng, kk), lat: mix(a.lat, b.lat, kk)};
};
const MapLayer: React.FC<{v: MapView; view: View; o: number}> = ({v, view, o}) => {
  if (o <= 0.001) return null;
  const sc = Math.pow(2, view.z - v.z);
  const c = project(view, v.lng, v.lat);
  return <Img src={img(v.img)} style={{position: 'absolute', left: c.x - (MAP_W / 2) * sc, top: c.y - (MAP_H / 2) * sc, width: MAP_W * sc, height: MAP_H * sc, opacity: o}} />;
};
const polyPath = (view: View, pts: number[][]) => pts.map(([lng, lat], i) => { const p = project(view, lng, lat); return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join('') + 'Z';
const Capsule: React.FC<{x: number; y: number; top: string; bottom: string; hot?: number; o?: number; dx?: number; dy?: number; scale?: number}> = ({x, y, top, bottom, hot = 0, o = 1, dx = 0, dy = -70, scale = 1}) => (
  <>
    <div style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: hot ? C.coral : '#E8EEF5', boxShadow: '0 0 0 5px rgba(232,238,245,.18)', opacity: o}} />
    <div style={{position: 'absolute', left: x + dx, top: y + dy, transform: `translate(-50%,-50%) scale(${scale})`, opacity: o, padding: '12px 26px 14px', borderRadius: 30, whiteSpace: 'nowrap', textAlign: 'center', fontFamily: F,
      background: hot ? `rgba(184,78,59,${0.82 + 0.1 * hot})` : 'rgba(16,28,42,.72)', backdropFilter: 'blur(14px)', boxShadow: `inset 0 0 0 2px rgba(255,255,255,${hot ? 0.28 : 0.16}), 0 10px 30px rgba(0,0,0,.35)`, color: C.cream}}>
      <div style={{fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>{top}</div>
      <div style={{fontSize: 30, fontWeight: 500, opacity: 0.85, marginTop: 2}}>{bottom}</div>
    </div>
  </>
);

// ---------- Lapta widget'ı (tek sorgu) ----------
const FLY = Easing.bezier(0.45, 0, 0.15, 1);
const WidgetMap: React.FC<{t: number}> = ({t}) => {
  const k = FLY(lin(t, TL.fly[0], TL.fly[1]));
  const view = viewAt(k);
  const oMid = lin(view.z, 11.0, 11.7) * (1 - lin(view.z, 12.7, 13.25));
  const oLap = lin(view.z, 12.7, 13.25);
  const sc = WID.w / MAP_W;
  const off = (MAP_H * sc - MAPD.h) / 2; // dikey kırpma
  const draw = lin(t, TL.poly[0], TL.poly[1]);
  const capK = E(lin(t, TL.cap, TL.cap + 0.25));
  const lap = (SEMT_POLY as Record<string, number[][]>)['Lapta'];
  const p = project(view, 33.17025, 35.33413);
  return (
    <div style={{position: 'relative', width: WID.w, height: MAPD.h, overflow: 'hidden', borderRadius: '52px 52px 0 0', background: '#081624'}}>
      <div style={{position: 'absolute', left: 0, top: -off, width: MAP_W, height: MAP_H, transform: `scale(${sc})`, transformOrigin: '0 0'}}>
        <MapLayer v={MAPS.girne} view={view} o={1} />
        <MapLayer v={MAPS.mid} view={view} o={oMid} />
        <MapLayer v={MAPS.lapta} view={view} o={oLap} />
        {draw > 0 && (
          <svg width={MAP_W} height={MAP_H} style={{position: 'absolute', left: 0, top: 0}}>
            <path d={polyPath(view, lap)} pathLength={1} fill={`rgba(184,78,59,${0.2 * draw})`} stroke="rgba(226,120,98,1)" strokeWidth={4} strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - draw} />
          </svg>
        )}
        {capK > 0 && <Capsule x={p.x} y={p.y} top="£105–147 bin" bottom="Lapta · 8 ilan" hot={1} o={capK} dy={-130} scale={mix(0.9, 1.25, capK)} />}
      </div>
      <div style={{position: 'absolute', right: 26, top: 26, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', borderRadius: 28, background: 'rgba(16,28,42,.7)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.12)', fontFamily: F, fontSize: 34, fontWeight: 600, color: K.text}}>{Ico.expand()}Tam ekran</div>
      <div style={{position: 'absolute', right: 20, bottom: 14, fontFamily: F, fontSize: 24, color: 'rgba(230,236,244,.72)'}}>© OpenFreeMap · © OpenStreetMap</div>
    </div>
  );
};
const Widget: React.FC<{t: number}> = ({t}) => {
  const cx = carX(t);
  const pp = press(t, TL.tap);
  const lifted = t >= TL.portal[0] && t < TL.portal[1] + 0.05; // yalnız portal sırasında boş
  const sel = E(lin(t, TL.select, TL.select + 0.2));
  return (
    <div style={{position: 'absolute', left: WID.x, width: WID.w, height: WH, borderRadius: 52, background: K.bg2, boxShadow: `inset 0 0 0 2px ${K.line}`, overflow: 'hidden', opacity: E(lin(t, TL.wB, TL.wB + 0.25))}}>
      <WidgetMap t={t} />
      <div style={{height: 130, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', fontFamily: F}}>
        <div style={{fontSize: 54, fontWeight: 700, color: K.text, letterSpacing: '-0.02em'}}>Lapta <span style={{color: K.dim, fontWeight: 400}}>·</span> Satılık</div>
        <div style={{fontSize: 44, fontWeight: 600, color: K.sub}}><span style={{color: K.text}}>8</span> ilan</div>
      </div>
      <Chips items={[['Ucuzdan pahalıya', true], ['Satılık', false], ['Filtreler · 5', false], ['Deniz manzarası', false]]} />
      <div style={{position: 'relative', height: CARD.h}}>
        <div style={{position: 'absolute', left: CARD.pad - cx, top: 0, display: 'flex', gap: CARD.gap}}>
          {LAPTA.map((L, i) => {
            const hot = i === 5;
            return (
              <div key={L.ref} style={{transform: `scale(${hot ? mix(1, 1.02, sel) * pp.s : 1})`, visibility: hot && lifted ? 'hidden' : 'visible', borderRadius: 40, boxShadow: hot && sel > 0 ? `0 0 0 ${3 * sel}px rgba(250,248,242,.95)` : 'none'}}>
                <ListingCard L={L} w={CARD.w} ph={CARD.ph} />
              </div>
            );
          })}
        </div>
        {(() => { const x = CARD.pad + 5 * (CARD.w + CARD.gap) - cx + CARD.w / 2; return <Ring t={t} at={TL.tap} x={x} y={CARD.ph / 2} r={90} />; })()}
      </div>
      <div style={{height: 40}} />
      <div style={{display: 'flex', gap: 24, padding: '0 34px', fontFamily: F}}>
        {[['Haritada tümü', Ico.expand()], ['Evlek’te aç', Ico.out()]].map(([s, ic], i) => (
          <div key={i} style={{flex: 1, height: 104, borderRadius: 52, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 40, fontWeight: 600, color: K.text}}>{i === 0 && ic}{s as string}{i === 1 && ic}</div>
        ))}
      </div>
    </div>
  );
};

// ---------- sohbet ----------
const typedLines = (q: string[], t: number, a: number, b: number) => typed(q.join('\n'), t, a, b).split('\n');
const Chat: React.FC<{t: number}> = ({t}) => {
  const sc = scrollAt(t);
  let lines: string[] = [''], sendAt: number | undefined, caret = false, chip = false;
  if (t >= TL.logoDrop[1] && t < TL.send + 0.08) {
    chip = true;
    if (t < TL.qType[0]) caret = true;
    else lines = typedLines(Q, t, TL.qType[0], TL.qType[1]);
    if (t < TL.qType[1]) caret = true;
    sendAt = TL.send;
  }
  if (t >= TL.q3Type[0] && t < TL.send3 + 0.08) { lines = typedLines(Q3, t, TL.q3Type[0], TL.q3Type[1]); caret = t < TL.q3Type[1]; sendAt = TL.send3; }
  const bub = (q: string[], at: number[], y: number, chipOn = false) => {
    if (t < at[0]) return null;
    const k = Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, at[0], at[1]));
    const from = composerTop(q.length + (chipOn ? 1 : 0)) - (TOP + y - sc);
    return <div style={{position: 'absolute', left: 0, right: 0, top: y, transform: `translateY(${(1 - k) * from}px)`}}><Bubble lines={q} chip={chipOn} /></div>;
  };
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: TOP, bottom: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: -sc}}>
          {bub(Q, TL.bubble, Y.q, true)}
          {t >= TL.trace[0] && <div style={{position: 'absolute', left: 0, right: 0, top: Y.tr}}><Trace t={t} a={TL.trace[0]} b={TL.trace[1]} done="8 ilan" /></div>}
          {t >= TL.wB && <div style={{position: 'absolute', left: 0, right: 0, top: Y.wB}}><Widget t={t} /></div>}
          {bub(Q3, TL.bubble3, Y.q3)}
          {t >= TL.bubble3[1] && <div style={{position: 'absolute', left: 0, right: 0, top: Y.tr3}}><Trace t={t} a={TL.bubble3[1]} b={TL.cmp} done="2 ilan" /></div>}
          {t >= TL.cmp && <div style={{position: 'absolute', left: 0, right: 0, top: Y.cmp}}><CompareCard t={t} /></div>}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: TOP, background: `linear-gradient(180deg, ${K.bg} 82%, rgba(13,15,19,0))`}} />
      <StatusBar />
      <NavBar />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: `linear-gradient(0deg, ${K.bg} 70%, rgba(13,15,19,0))`}} />
      <Composer lines={lines} chip={chip} caret={caret} t={t} sendAt={sendAt} focus={chip ? 1 : 0} />
      <HomeBar />
    </div>
  );
};
/** kanca ve kapanış: boş sohbet, boş yazım kutusu (döngünün ilk karesi) */
const EmptyChat: React.FC<{t: number; chip?: boolean}> = ({t, chip}) => (
  <div style={{position: 'absolute', inset: 0, background: K.bg}}>
    <StatusBar />
    <NavBar />
    <Composer lines={['']} chip={!!chip} caret={!!chip} t={t} focus={chip ? 1 : 0} />
    <HomeBar />
  </div>
);

// ---------- ilan detayı: galeri swipe'ı dış dünyayla eşleşir ----------
export const galSwiped = (t: number) => t >= (TL.swipe[0] + TL.swipe[1]) / 2;
const Detail: React.FC<{t: number}> = ({t}) => {
  const sw = Easing.bezier(0.3, 0, 0.1, 1)(lin(t, TL.swipe[0], TL.swipe[1]));
  const n = galSwiped(t) ? 2 : 1;
  const feats = ['Deniz manzarası', 'Ortak havuz', 'Otopark', 'Balkon', 'Eşyalı'];
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: 1300, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -sw * SW, top: 0, width: SW * 2, height: 1300, display: 'flex'}}>
          <Img src={img('v4/EVL-100102_00.jpg')} style={{width: SW, height: 1300, objectFit: 'cover', objectPosition: '45% 55%'}} />
          <Img src={img('v4/EVL-100102_01.jpg')} style={{width: SW, height: 1300, objectFit: 'cover', objectPosition: '50% 60%'}} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,15,19,.55) 0%, rgba(13,15,19,0) 22%, rgba(13,15,19,0) 70%, rgba(13,15,19,.9) 100%)'}} />
        <div style={{position: 'absolute', right: 40, bottom: 60, padding: '12px 28px', borderRadius: 30, background: 'rgba(8,14,22,.6)', fontSize: 38, fontWeight: 600, color: C.cream}}>{n} / 14</div>
      </div>
      <Ring t={t} at={TL.swipe[0] - 0.05} x={mix(800, 300, sw)} y={700} r={70} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1350}}>
        <div style={{fontSize: 40, fontWeight: 600, color: K.sub, display: 'flex', alignItems: 'center', gap: 14}}><span style={{width: 16, height: 16, borderRadius: 8, background: '#3DDC97'}} />Satılık · EVL-100102</div>
        <div style={{marginTop: 20, fontSize: 132, fontWeight: 800, letterSpacing: '-0.045em', color: K.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>£139.000</div>
        <div style={{marginTop: 30, fontSize: 56, fontWeight: 600, color: K.text}}>2+1 · 2 banyo · 107 m²</div>
        <div style={{marginTop: 16, fontSize: 48, color: K.sub, display: 'flex', alignItems: 'center', gap: 10}}>{Ico.pin()}Lapta, Girne</div>
        <div style={{marginTop: 44, display: 'flex', flexWrap: 'wrap', gap: 18}}>
          {feats.map((f) => <div key={f} style={{padding: '16px 30px', borderRadius: 34, fontSize: 38, color: '#D9DEE5', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.14)'}}>{f}</div>)}
        </div>
      </div>
      <StatusBar />
      <HomeBar />
    </div>
  );
};

// ---------- iOS push / geri ----------
const PUSH = Easing.bezier(0.2, 0.8, 0.2, 1);
const Push: React.FC<{k: number; under: React.ReactNode; over: React.ReactNode}> = ({k, under, over}) => (
  <>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${-0.3 * SW * k}px)`}}>{under}<div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.2 * k})`}} /></div>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - k) * SW}px)`, boxShadow: '-20px 0 60px rgba(0,0,0,.5)'}}>{over}</div>
  </>
);

/** ekran: zaman → arayüz durumu */
export const Screen: React.FC<{t: number}> = ({t}) => {
  if (t < TL.logoDrop[1]) return <EmptyChat t={t} />;
  if (t >= TL.chipLift[0]) return <EmptyChat t={t} />;
  if (t >= TL.newChat) return <Push k={PUSH(lin(t, ...TL.newChatPush as [number, number]))} under={<EvlekPage t={t} connected={false} />} over={<EmptyChat t={t} chip />} />;
  if (t >= TL.page) return <Push k={PUSH(lin(t, ...TL.pagePush as [number, number]))} under={<Plugins t={t} />} over={<EvlekPage t={t} connected={false} />} />;
  if (t >= TL.plug) return <Push k={PUSH(lin(t, ...TL.plugPush as [number, number]))} under={<Chat t={t} />} over={<Plugins t={t} />} />;
  if (t >= TL.phoneIn[0] && t < TL.iosBack[1]) {
    const k = 1 - PUSH(lin(t, TL.iosBack[0], TL.iosBack[1]));
    return <Push k={k} under={<Chat t={t} />} over={<Detail t={t} />} />;
  }
  return <Chat t={t} />;
};
export const LAYOUT = {Y, TOP, WID, CARD, MAPD};

// ---------- ilan kartı ----------
export const ListingCard: React.FC<{L: Listing; w?: number; ph?: number; hot?: boolean; style?: React.CSSProperties}> = ({L, w = CARD.w, ph = CARD.ph, hot, style}) => (
  <div style={{width: w, height: CARD.h * (w / CARD.w), borderRadius: 40, overflow: 'hidden', background: K.card, boxShadow: hot ? `inset 0 0 0 3px rgba(250,248,242,.55)` : `inset 0 0 0 2px ${K.line}`, fontFamily: F, flexShrink: 0, position: 'relative', ...style}}>
    <div style={{position: 'relative', width: '100%', height: ph, overflow: 'hidden'}}>
      <Img src={img(L.img)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: L.pos ?? '50% 50%'}} />
      <div style={{position: 'absolute', right: 20, bottom: 20, padding: '8px 20px', borderRadius: 22, background: 'rgba(8,14,22,.62)', backdropFilter: 'blur(8px)', fontSize: 30, fontWeight: 600, color: C.cream}}>{L.photos} foto</div>
    </div>
    <div style={{padding: '30px 34px 0'}}>
      <div style={{fontSize: 80, fontWeight: 800, letterSpacing: '-0.04em', color: K.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{gbp(L.price)}</div>
      <div style={{marginTop: 22, fontSize: 36, fontWeight: 500, color: '#CDD3DC', whiteSpace: 'nowrap', overflow: 'hidden'}}>{L.rooms} · {L.bath} banyo{L.area ? ` · ${L.area}` : ''}</div>
      <div style={{marginTop: 12, fontSize: 38, color: K.dim, display: 'flex', alignItems: 'center', gap: 8}}>{Ico.pin(K.dim)}{L.district}, Girne</div>
    </div>
  </div>
);

const Chips: React.FC<{items: [string, boolean][]}> = ({items}) => (
  <div style={{display: 'flex', gap: 18, padding: '0 34px', height: 116, alignItems: 'center', fontFamily: F, overflow: 'hidden'}}>
    {items.map(([s, on], i) => (
      <div key={i} style={{flexShrink: 0, padding: '18px 34px', borderRadius: 40, fontSize: 38, fontWeight: 600, whiteSpace: 'nowrap', color: on ? '#0D0F13' : K.text, background: on ? '#EEF0F3' : 'transparent', boxShadow: on ? 'none' : `inset 0 0 0 2px rgba(255,255,255,.16)`}}>{s}</div>
    ))}
  </div>
);

// ---------- karşılaştırma kartı (yeniden tasarım; yalnız gerçek alanlar) ----------
const CompareCard: React.FC<{t: number}> = ({t}) => {
  const t0 = TL.cmp;
  const col = (L: Listing, i: number) => {
    const k = E(lin(t, t0, t0 + 0.25));
    return (
      <div style={{flex: 1, opacity: k, transform: `translateY(${(1 - k) * 40}px)`}}>
        <div style={{height: 400, borderRadius: 34, overflow: 'hidden'}}>
          <Img src={img(L.img)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: L.pos ?? '50% 50%'}} />
        </div>
        <div style={{marginTop: 30, fontSize: 76, fontWeight: 800, letterSpacing: '-0.04em', color: K.text, fontVariantNumeric: 'tabular-nums'}}>{gbp(L.price)}</div>
        <div style={{marginTop: 14, fontSize: 40, color: '#CDD3DC', lineHeight: '58px'}}>{L.rooms} · {L.bath} banyo<br />{L.area}</div>
        <div style={{marginTop: 6, fontSize: 34, color: K.dim}}>{L.ref}</div>
      </div>
    );
  };
  const d = E(lin(t, t0 + 0.1, t0 + 0.35));
  return (
    <div style={{position: 'absolute', left: WID.x, width: WID.w, height: 1130, borderRadius: 52, background: K.bg2, boxShadow: `inset 0 0 0 2px ${K.line}`, fontFamily: F, padding: '40px 40px', boxSizing: 'border-box', opacity: E(lin(t, t0, t0 + 0.3))}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 46, fontWeight: 700, color: K.text}}><EvIcon size={58} r={0.3} />Lapta · karşılaştırma</div>
      <div style={{display: 'flex', gap: 34, marginTop: 36}}>{col(ALT, 0)}{col(HERO, 1)}</div>
      <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 128, borderRadius: 34, background: 'rgba(184,78,59,.16)', boxShadow: 'inset 0 0 0 2px rgba(184,78,59,.5)', display: 'flex', alignItems: 'center', padding: '0 38px', opacity: d}}>
        <span style={{fontSize: 50, fontWeight: 700, color: '#F3D9D2', letterSpacing: '-0.02em'}}>Fiyat farkı £12.000</span>
        <span style={{marginLeft: 18, fontSize: 44, color: '#D9A99C'}}>(%9,4)</span>
      </div>
    </div>
  );
};

const HomeBar: React.FC<{light?: boolean}> = ({light}) => <div style={{position: 'absolute', left: SW / 2 - 200, bottom: 22, width: 400, height: 14, borderRadius: 7, background: light ? 'rgba(13,21,32,.75)' : 'rgba(238,240,243,.85)'}} />;
const SkelRow: React.FC<{y: number; w: number}> = ({y, w}) => (
  <div style={{position: 'absolute', left: 64, top: y, display: 'flex', gap: 34, alignItems: 'center'}}>
    <div style={{width: 112, height: 112, borderRadius: 30, background: '#1F232A'}} />
    <div><div style={{width: w, height: 30, borderRadius: 15, background: '#23272E'}} /><div style={{marginTop: 22, width: w * 1.5, height: 24, borderRadius: 12, background: '#1B1E24'}} /></div>
  </div>
);
const Plugins: React.FC<{t: number}> = ({t}) => {
  const q = typed('evlek', t, TL.plugType[0], TL.plugType[1]);
  const res = E(lin(t, TL.plugRes, TL.plugRes + 0.3));
  const rp = press(t, TL.rowTap);
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 50, top: 186}}>{Ico.back()}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 188, textAlign: 'center', fontSize: 54, fontWeight: 600}}>Eklentiler</div>
      {/* arama */}
      <div style={{position: 'absolute', left: 50, right: 50, top: 330, height: 128, borderRadius: 64, background: '#1F232A', boxShadow: `inset 0 0 0 2px ${q ? 'rgba(127,178,255,.45)' : 'rgba(255,255,255,.07)'}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 44px', fontSize: 50}}>
        {Ico.search(K.sub, 56)}
        {q ? <span>{q}</span> : <span style={{color: K.dim}}>Eklenti ara</span>}
        <span style={{width: 4, height: 58, background: blink && t < TL.plugRes + 0.4 ? K.blue : 'transparent'}} />
      </div>
      {/* arama öncesi bölümler: üçüncü taraf logoları gösterilmez */}
      <div style={{opacity: 1 - res}}>
        <div style={{position: 'absolute', left: 64, top: 540, fontSize: 44, fontWeight: 600, color: K.sub}}>Popüler ›</div>
        {[660, 860, 1060, 1260, 1460].map((y, i) => <SkelRow key={y} y={y} w={[300, 380, 260, 420, 330][i]} />)}
      </div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 540, opacity: res, transform: `translateY(${(1 - res) * 30}px) scale(${rp.s})`}}>
        <div style={{fontSize: 40, fontWeight: 600, color: K.sub, padding: '0 34px 26px'}}>Sonuçlar</div>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 34, padding: '30px 34px', borderRadius: 44, background: t > TL.rowTap ? '#1A1E25' : 'transparent'}}>
          <EvIcon size={132} r={0.28} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 54, fontWeight: 700}}>Evlek</div>
            <div style={{fontSize: 40, color: K.sub, marginTop: 6}}>Northern Cyprus property data</div>
          </div>
          {Ico.plus(K.sub, 64)}
          <Ring t={t} at={TL.rowTap} x={300} y={96} r={120} />
        </div>
      </div>
      <HomeBar />
    </div>
  );
};

const PROMPTS = [
  ['@Evlek', ' Show me apartments for sale in Kyrenia under £300,000.'],
  ['@Evlek', ' What are the median asking prices for apartments for sale in Kyrenia?'],
  ['@Evlek', ' Compare EVL-101366 and EVL-101348.'],
];
export const EvlekPage: React.FC<{t: number; connected: boolean; t0?: number}> = ({t, connected, t0 = TL.page}) => {
  const ip = press(t, TL.installTap);
  const tp = press(t, TL.tryTap);
  const spin = t >= TL.spin[0] && t < TL.spin[1];
  const bound = connected || t >= TL.bound;
  const bk = connected ? 1 : E(lin(t, TL.bound, TL.bound + 0.3));
  const k = (_i: number) => 1; // sayfa dolu gelir (kurul: stagger yok)
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 50, top: 186}}>{Ico.back()}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 188, textAlign: 'center', fontSize: 54, fontWeight: 600}}>Evlek</div>
      <div style={{position: 'absolute', right: 56, top: 184}}>{Ico.share()}</div>
      <div style={{position: 'absolute', left: 64, right: 64, top: 330}}>
        <div style={{opacity: k(0), transform: `translateY(${(1 - k(0)) * 30}px)`}}><EvIcon size={168} r={0.26} /></div>
        <div style={{marginTop: 40, fontSize: 84, fontWeight: 700, letterSpacing: '-0.03em', opacity: k(1)}}>Evlek</div>
        <div style={{marginTop: 8, fontSize: 44, color: K.sub, opacity: k(1)}}>Northern Cyprus property data</div>
        {/* degrade soru kartları */}
        <div style={{marginTop: 50, borderRadius: 56, padding: 36, background: 'linear-gradient(135deg,#6FC3D9 0%,#5B9BEA 38%,#8FD6C9 78%,#B9E6C4 100%)', opacity: k(2), transform: `translateY(${(1 - k(2)) * 40}px)`, boxShadow: '0 30px 80px rgba(60,140,200,.25)'}}>
          {PROMPTS.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '30px 34px', borderRadius: 38, background: 'rgba(255,255,255,.80)', marginTop: i ? 24 : 0, color: '#0D1520', fontSize: 38, lineHeight: '52px'}}>
              <div style={{flex: 1}}><b>{a}</b>{b}</div>
              <div style={{width: 72, height: 72, borderRadius: 36, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{Ico.arrow()}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 44, fontSize: 40, lineHeight: '58px', color: '#C5CBD4', opacity: k(3)}}>
          Evlek brings live Northern Cyprus (KKTC/TRNC) property listings into ChatGPT. Ask in Turkish, English, Russian, German or Arabic…
        </div>
        <div style={{marginTop: 40, fontSize: 44, fontWeight: 600, opacity: k(3)}}>Uygulama</div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 28, opacity: k(3)}}>
          <EvIcon size={104} r={0.28} />
          <div>
            <div style={{fontSize: 46, fontWeight: 600}}>Evlek</div>
            {bound && <div style={{fontSize: 38, color: '#3DDC97', display: 'flex', alignItems: 'center', gap: 6, opacity: bk}}>{Ico.check('#3DDC97', 40)}Bağlı</div>}
          </div>
        </div>
      </div>
      {/* ana düğme */}
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 110, height: 150, borderRadius: 75, opacity: k(4),
        background: bound ? '#2A2F37' : '#F2F4F7', color: bound ? K.text : '#0D0F13', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 52, fontWeight: 700,
        transform: `scale(${bound ? tp.s : ip.s})`, boxShadow: bound ? 'inset 0 0 0 2px rgba(255,255,255,.12)' : '0 10px 40px rgba(255,255,255,.12)'}}>
        {spin ? <div style={{width: 60, height: 60, borderRadius: 30, border: '7px solid rgba(13,15,19,.2)', borderTopColor: '#0D0F13', transform: `rotate(${(t - TL.spin[0]) * 900}deg)`}} /> : bound ? 'Sohbette dene' : 'Eklentiyi kur'}
      </div>
      <Ring t={t} at={TL.installTap} x={SW / 2} y={SH - 110 - 75} r={130} />
      <Ring t={t} at={TL.tryTap} x={SW / 2} y={SH - 110 - 75} r={130} />
      <HomeBar />
    </div>
  );
};
