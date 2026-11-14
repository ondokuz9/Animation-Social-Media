// v12 · telefon ekranı (1179×2556 tasarım px = 393 pt × 3).
// Evlek yüzeyleri GERÇEK PİKSEL: public/v12/w/*.png, cap/capture-v12.mjs ile gerçek widget HTML'inden (live/listing-cards-v3-14.html)
// gerçek veriyle (live/w_*.json) yakalandı; filtre ve yeniden çizim yok. ChatGPT kabuğu ve Eklentiler ekranları temsilîdir.
// ChatGPT logosu yok; kişi/ofis adı, bildirim, abonelik bilgisi yok.
import React from 'react';
import {Easing, Img, staticFile} from 'remotion';
import {C, E, EvIcon, F, S, lin, mix} from '../v10/core';
import {SH, SW} from './Phone';
import {TL} from './tl';

// ---------- renkler: ChatGPT koyu tema (yakalamadaki ev sahibi değişkenleriyle aynı #212121) ----------
const K = {bg: '#212121', bg2: '#171717', text: '#ECECEC', sub: '#B4B4B4', dim: '#8E8E8E', bubble: '#303030', comp: '#303030', blue: '#7FB2FF', line: 'rgba(255,255,255,.08)'};
const img = (p: string) => staticFile(p);
const W_ = (n: string) => img(`v12/w/${n}`);

// ---------- dokunuş ----------
export const press = (t: number, at: number) => {
  if (t < at || t > at + 0.3) return {s: 1, a: 0};
  const i = lin(t, at, at + 0.09), o = lin(t, at + 0.09, at + 0.3);
  return t < at + 0.09 ? {s: mix(1, 0.97, S(i)), a: S(i)} : {s: mix(0.97, 1, S(o)), a: 1 - S(o)};
};
/** dokunuş halkası: r 110, beyaz %35, 0,3 sn */
const Ring: React.FC<{t: number; at: number; x: number; y: number; r?: number}> = ({t, at, x, y, r = 110}) => {
  const p = press(t, at);
  if (p.a <= 0) return null;
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: `rgba(255,255,255,${0.35 * p.a})`, transform: `scale(${mix(0.7, 1, p.a)})`, pointerEvents: 'none'}} />;
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * lin(t, a, b)));

// ---------- ikonlar ----------
const Ico = {
  menu: (c = K.text) => <svg width="64" height="64" viewBox="0 0 24 24"><path d="M4 8h16M4 16h10" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  edit: (c = K.text, w = 64) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>,
  back: (c = K.text) => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>,
  plus: (c = K.text, w = 64) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  mic: (c = K.text) => <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  up: (c = '#0D0F13') => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>,
  search: (c = K.sub, w = 52) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>,
  arrow: (c = '#0D0F13') => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  check: (c = '#3DDC97', w = 40) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  share: (c = K.text, w = 60) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>,
  close: (c = K.text, w = 54) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  lock: (c = '#5B6574', w = 30) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  grid: (c = K.text, w = 56) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></svg>,
  chev: (c = K.dim, w = 40) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>,
  fwd: (c = '#9AA3AE', w = 60) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>,
};

// ---------- durum çubuğu (markasız: 10:24) ----------
const StatusBar: React.FC<{light?: boolean}> = ({light}) => {
  const c = light ? '#0D1520' : K.text;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 140, fontFamily: F, color: c}}>
      <div style={{position: 'absolute', left: 120, top: 48, fontSize: 50, fontWeight: 600, letterSpacing: '-0.01em'}}>10:24</div>
      <div style={{position: 'absolute', right: 100, top: 58, display: 'flex', gap: 18, alignItems: 'center'}}>
        <svg width="58" height="36" viewBox="0 0 29 18">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 7.5} y={14 - i * 4} width="5" height={4 + i * 4} rx="1.3" fill={c} />)}</svg>
        <svg width="52" height="38" viewBox="0 0 26 19"><path d="M13 17.5l3.2-3.7a4.6 4.6 0 0 0-6.4 0z M5.6 10.2a10.6 10.6 0 0 1 14.8 0l-2.2 2.4a7.4 7.4 0 0 0-10.4 0z M1.2 5.6a17 17 0 0 1 23.6 0l-2.2 2.4a13.8 13.8 0 0 0-19.2 0z" fill={c} /></svg>
        <div style={{width: 74, height: 36, borderRadius: 11, border: `3px solid ${light ? 'rgba(13,21,32,.4)' : 'rgba(238,240,243,.45)'}`, padding: 3, boxSizing: 'border-box'}}><div style={{width: '82%', height: '100%', borderRadius: 6, background: c}} /></div>
      </div>
    </div>
  );
};
const HomeBar: React.FC<{light?: boolean}> = ({light}) => <div style={{position: 'absolute', left: SW / 2 - 200, bottom: 22, width: 400, height: 14, borderRadius: 7, background: light ? 'rgba(13,21,32,.75)' : 'rgba(238,240,243,.85)'}} />;
const NavBar: React.FC<{t: number; tapAt?: number}> = ({t, tapAt}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: 120, fontFamily: F, color: K.text}}>
    <div style={{position: 'absolute', left: 62, top: 28}}>{Ico.menu()}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontSize: 54, fontWeight: 600, letterSpacing: '-0.02em'}}>ChatGPT</div>
    <div style={{position: 'absolute', right: 62, top: 28}}>{Ico.edit()}</div>
    {tapAt !== undefined && <Ring t={t} at={tapAt} x={94} y={60} r={90} />}
  </div>
);

// ---------- Evlek çipi (sabit genişlik: imza hareketinin hedefi ölçülebilir) ----------
export const CHIP_W = 212;
const EvChip: React.FC<{size?: number; o?: number}> = ({size = 46, o = 1}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.2, width: CHIP_W, boxSizing: 'border-box', padding: `${size * 0.1}px 0 ${size * 0.1}px ${size * 0.12}px`, borderRadius: size, background: `rgba(127,178,255,${0.16 * o})`, color: K.blue, fontWeight: 600, fontSize: size, verticalAlign: 'middle', marginRight: size * 0.26, lineHeight: 1.15}}>
    <span style={{opacity: o, display: 'inline-flex', alignItems: 'center', gap: size * 0.2}}><EvIcon size={size * 1.1} r={0.3} />Evlek</span>
  </span>
);

// ---------- yazım kutusu ----------
const COMP_BOTTOM = 70, LH = 68;
const Composer: React.FC<{lines: string[]; chip: boolean; caret?: boolean; t: number; sendAt?: number}> = ({lines, chip, caret, t, sendAt}) => {
  const has = lines.some((l) => l.length > 0);
  const n = Math.max(1, lines.length);
  const h = 176 + (n - 1) * LH;
  const p = sendAt !== undefined ? press(t, sendAt) : {s: 1, a: 0};
  const blink = caret && Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 36, right: 36, bottom: COMP_BOTTOM, height: h, borderRadius: 88, background: K.comp, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.06)', fontFamily: F}}>
      <div style={{position: 'absolute', left: 40, bottom: 56}}>{Ico.plus(K.sub, 60)}</div>
      <div style={{position: 'absolute', left: 140, right: 250, top: 50, fontSize: 48, lineHeight: `${LH}px`, color: K.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
        {chip && <EvChip size={44} />}
        {!has && !caret && !chip && <span style={{color: K.dim}}>ChatGPT’ye sor</span>}
        {lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
        {caret && <span style={{display: 'inline-block', width: 4, height: 56, marginLeft: 4, verticalAlign: -10, background: blink ? K.blue : 'transparent'}} />}
      </div>
      <div style={{position: 'absolute', right: 150, bottom: 58}}>{Ico.mic(K.sub)}</div>
      <div style={{position: 'absolute', right: 26, bottom: 30, width: 112, height: 112, borderRadius: 56, background: has ? '#F2F4F7' : '#4A4A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p.s})`}}>
        {Ico.up(has ? '#0D0F13' : K.sub)}
      </div>
      <Ring t={t} at={sendAt ?? -9} x={SW - 72 - 26 - 56} y={h - 30 - 56} r={86} />
    </div>
  );
};

// ---------- sohbet akışı ----------
const TOP = 300;
const BUB = {w: 1010, right: 44, padX: 48, padY: 38};
const bubbleH = (n: number) => n * LH + 2 * BUB.padY;
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
const QG = ['Girne’de £160 bin altı,', 'deniz manzaralı 2+1 daire'];
const FLOW = {bubble: 40, trace: 40 + bubbleH(2) + 36, widget: 40 + bubbleH(2) + 36 + 84 + 30};
/** balondaki Evlek çipinin ekran merkezi ve yazı yüksekliği (sohbet kaydırması 0) */
export const BUBBLE_CHIP = {x: SW - BUB.right - BUB.w + BUB.padX + 44 * 0.12 + 44 * 1.1 + 44 * 0.2 + 64, y: TOP + FLOW.bubble + BUB.padY + LH / 2, h: 34};
const Bubble: React.FC<{lines: string[]; chipO: number}> = ({lines, chipO}) => (
  <div style={{position: 'absolute', right: BUB.right, width: BUB.w, boxSizing: 'border-box', padding: `${BUB.padY}px ${BUB.padX}px`, borderRadius: 60, background: K.bubble, fontFamily: F, fontSize: 48, lineHeight: `${LH}px`, color: K.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
    <EvChip size={44} o={chipO} />
    {lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
  </div>
);
const Trace: React.FC<{t: number; a: number; b: number; done: string}> = ({t, a, b, done}) => {
  const fin = t >= b;
  const sh = ((t - a) * 1.6) % 1;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 52, fontFamily: F, fontSize: 42, color: K.sub, height: 84}}>
      <EvIcon size={64} r={0.3} />
      {fin ? <span><span style={{color: K.text, fontWeight: 600}}>Evlek</span> · {done}</span>
        : <span style={{backgroundImage: `linear-gradient(90deg, ${K.dim} ${sh * 160 - 40}%, #E6EBF2 ${sh * 160 - 20}%, ${K.dim} ${sh * 160}%)`, WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 500}}>Evlek’te aranıyor…</span>}
    </div>
  );
};

// ---------- GERÇEK Lapta widget'ı (satır içi) ----------
const PT = 3;
const LAPTA = {mapH: 188 * PT, topH: 829, rowY: 829, rowH: 860, botY: 1689, botH: 171, x0pt: 742, cardY: 12 * PT, cardH: 262.67 * PT, cardW: 232 * PT};
export const WIDGET_H = 1860;
/** kart şeridi kaydırması: dizin i → scrollLeft 244·i pt (gerçek snap: kart solu 16 pt) */
const rowLeft = (idx: number) => (LAPTA.x0pt - 244 * idx) * PT;
export const cardIdx = (t: number) => (t < TL.slide[0] ? 3.6 : mix(3.6, 5, Easing.bezier(0.2, 0.7, 0.2, 1)(lin(t, TL.slide[0], TL.slide[1]))));
/** £139.000 kartının ekran dikdörtgeni (sohbet kaydırması sc ile) */
export const card5Rect = (sc: number) => ({x: 16 * PT, y: TOP + FLOW.widget - sc + LAPTA.rowY + LAPTA.cardY, w: LAPTA.cardW, h: LAPTA.cardH});
const LaptaWidget: React.FC<{t: number; idx: number; mapO: number; headO: number; tapAt?: number}> = ({t, idx, mapO, headO, tapAt}) => {
  return (
    <div style={{position: 'absolute', left: 0, width: SW, height: WIDGET_H}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: LAPTA.mapH, overflow: 'hidden', opacity: mapO}}><Img src={W_('wLaptaTop.png')} style={{width: SW, height: LAPTA.topH}} /></div>
      <div style={{position: 'absolute', left: 0, top: LAPTA.mapH, width: SW, height: LAPTA.topH - LAPTA.mapH, overflow: 'hidden', opacity: headO}}>
        <Img src={W_('wLaptaTop.png')} style={{position: 'absolute', top: -LAPTA.mapH, width: SW, height: LAPTA.topH}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: LAPTA.rowY, width: SW, height: LAPTA.rowH, overflow: 'hidden', opacity: headO}}>
        <Img src={W_('wLaptaRow.png')} style={{position: 'absolute', left: Math.round(rowLeft(idx)), top: 0, height: LAPTA.rowH}} />
        {tapAt !== undefined && <Ring t={t} at={tapAt} x={16 * PT + LAPTA.cardW / 2} y={LAPTA.cardY + 400} />}
      </div>
      <div style={{position: 'absolute', left: 0, top: LAPTA.botY, width: SW, height: LAPTA.botH, opacity: headO}}><Img src={W_('wLaptaBot.png')} style={{width: SW, height: LAPTA.botH}} /></div>
    </div>
  );
};
/** parmak halkası: kart şeridini sürükler (yalnız kaydırma sırasında) */
const Drag: React.FC<{t: number; sc: number}> = ({t, sc}) => {
  const a = TL.slide[0] - 0.05, b = TL.slide[1] + 0.1;
  if (t < a || t > b) return null;
  const k = Easing.bezier(0.2, 0.7, 0.2, 1)(lin(t, TL.slide[0], TL.slide[1]));
  const o = lin(t, a, a + 0.05) * (1 - lin(t, TL.slide[1], b));
  const y = TOP + FLOW.widget - sc + LAPTA.rowY + 420;
  return <div style={{position: 'absolute', left: mix(900, 420, k) - 110, top: y - 110, width: 220, height: 220, borderRadius: 110, background: 'rgba(255,255,255,.35)', opacity: o}} />;
};

// ---------- sohbet ekranları ----------
const ChatFrame: React.FC<{t: number; sc: number; children: React.ReactNode; composer: React.ReactNode; menuTap?: number}> = ({t, sc, children, composer, menuTap}) => (
  <div style={{position: 'absolute', inset: 0, background: K.bg}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: TOP, bottom: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: -sc}}>{children}</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: TOP, background: `linear-gradient(180deg, ${K.bg} 84%, rgba(33,33,33,0))`}} />
    <StatusBar />
    <NavBar t={t} tapAt={menuTap} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 290, background: `linear-gradient(0deg, ${K.bg} 72%, rgba(33,33,33,0))`}} />
    {composer}
    <HomeBar />
  </div>
);
export const LAPTA_SCROLL = 300;
const laptaScroll = (t: number) => (t < TL.cutCards ? 0 : LAPTA_SCROLL);
/** Lapta sohbeti: soru gönderilmiş; sonuç 4,5'te gelir */
const LaptaChat: React.FC<{t: number; menuTap?: number}> = ({t, menuTap}) => {
  const sc = laptaScroll(t);
  const chipO = lin(t, TL.sig[1] - 0.06, TL.sig[1]);
  const mapO = E(lin(t, TL.mapIn[0], TL.mapIn[1])), headO = E(lin(t, TL.headIn[0], TL.headIn[1]));
  return (
    <ChatFrame t={t} sc={sc} menuTap={menuTap} composer={<Composer lines={['']} chip={false} t={t} />}>
      <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.bubble}}><Bubble lines={QL} chipO={chipO} /></div>
      {t >= TL.trace[0] && <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.trace}}><Trace t={t} a={TL.trace[0]} b={TL.trace[1]} done="8 ilan" /></div>}
      {t >= TL.mapIn[0] && <div style={{position: 'absolute', left: 0, top: FLOW.widget}}><LaptaWidget t={t} idx={cardIdx(t)} mapO={mapO} headO={headO} tapAt={TL.tap} /></div>}
      <Drag t={t} sc={0} />
    </ChatFrame>
  );
};

// ---------- GERÇEK tam ekran detay (ChatGPT tam ekran kabuğu temsilî) ----------
export const FS_TOP = 275;
export const HERO_D = {x: 0, y: FS_TOP, w: SW, h: 294.75 * PT};
export const DV_NEXT = {x: (337 + 22) * PT, y: FS_TOP + (125.4 + 22) * PT};
const DV_OUT_Y = 1221.14 * PT, DV_OUT_H = 44 * PT;
export const FS_SCROLL = Math.round(DV_OUT_Y + FS_TOP - 1880);
export const DV_OUT = {x: SW / 2, y: FS_TOP + DV_OUT_Y - FS_SCROLL + DV_OUT_H / 2};
const FsDetail: React.FC<{t: number; n: 1 | 2; heroHidden?: boolean; scroll?: number}> = ({t, n, heroHidden, scroll = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F}}>
    <div style={{position: 'absolute', left: 0, top: FS_TOP, width: SW, height: SH - FS_TOP, overflow: 'hidden'}}>
      <Img src={W_(`dFull_${n}.png`)} style={{position: 'absolute', left: 0, top: -Math.round(scroll), width: SW}} />
      {heroHidden && <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: HERO_D.h, background: K.bg2}} />}
    </div>
    <Img src={W_('dBar.png')} style={{position: 'absolute', left: 0, top: FS_TOP + 691 * PT, width: SW, height: 69 * PT}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: FS_TOP, background: K.bg}} />
    <StatusBar />
    <div style={{position: 'absolute', left: 56, top: 168}}>{Ico.close(K.text, 60)}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 168, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontSize: 48, fontWeight: 600, color: K.text}}><EvIcon size={58} r={0.3} />Evlek</div>
    <Ring t={t} at={TL.nextTap} x={DV_NEXT.x} y={DV_NEXT.y} r={90} />
    <Ring t={t} at={TL.outTap} x={DV_OUT.x} y={DV_OUT.y} />
    <HomeBar />
  </div>
);

// ---------- GERÇEK evlek.app sayfası (uygulama içi tarayıcı; sayfa piksel kopyası public/page/page_view.png) ----------
const PV = {cut: 1765, h: 1941};
const WebPage: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: '#ECEFF4', fontFamily: F}}>
    <div style={{position: 'absolute', left: 0, top: 270, width: SW, height: PV.cut, overflow: 'hidden'}}><Img src={img('page/page_view.png')} style={{width: SW, height: PV.h}} /></div>
    <div style={{position: 'absolute', left: 0, top: 2131, width: SW, height: PV.h - PV.cut, overflow: 'hidden'}}><Img src={img('page/page_view.png')} style={{position: 'absolute', top: -PV.cut, width: SW, height: PV.h}} /></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 270, background: '#F7F7F7', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.06)'}}>
      <StatusBar light />
      <div style={{position: 'absolute', left: 56, top: 170}}>{Ico.close('#1A2330', 56)}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 178, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 40, fontWeight: 600, color: '#1A2330'}}>{Ico.lock('#5B6574', 32)}evlek.app</div>
      <div style={{position: 'absolute', right: 56, top: 166}}>{Ico.share('#1A2330', 58)}</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 2307, bottom: 0, background: '#F7F7F7', boxShadow: 'inset 0 2px 0 rgba(0,0,0,.06)'}}>
      <div style={{position: 'absolute', left: 120, top: 60, transform: 'scaleX(-1)'}}>{Ico.fwd('#1A2330')}</div>
      <div style={{position: 'absolute', left: 300, top: 60}}>{Ico.fwd('#B9C0C8')}</div>
      <div style={{position: 'absolute', right: 120, top: 58}}>{Ico.share('#1A2330', 60)}</div>
      <HomeBar light />
    </div>
  </div>
);

// ---------- kenar menü, Eklentiler, Evlek sayfası (temsilî; Onur'un ekran kaydındaki düzen) ----------
const SIDE_W = 943;
const Sidebar: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SIDE_W, height: SH, background: '#171717', fontFamily: F, color: K.text}}>
    <div style={{position: 'absolute', left: 50, right: 50, top: 170, height: 112, borderRadius: 56, background: '#2A2A2A', display: 'flex', alignItems: 'center', gap: 22, padding: '0 40px', fontSize: 46, color: K.dim}}>{Ico.search(K.dim, 52)}Ara</div>
    {[['Yeni sohbet', Ico.edit(K.text, 58), 360], ['Eklentiler', Ico.grid(K.text, 58), 500]].map(([s, ic, y]) => (
      <div key={s as string} style={{position: 'absolute', left: 30, right: 30, top: y as number, height: 120, borderRadius: 36, display: 'flex', alignItems: 'center', gap: 34, padding: '0 34px', fontSize: 50, fontWeight: 500,
        background: s === 'Eklentiler' && t >= TL.plugTap ? '#2A2A2A' : 'transparent'}}>{ic}{s}</div>
    ))}
    <div style={{position: 'absolute', left: 64, top: 720, fontSize: 40, fontWeight: 600, color: K.dim}}>Sohbetler</div>
    {[820, 930, 1040, 1150].map((y, i) => <div key={y} style={{position: 'absolute', left: 64, top: y, width: [560, 470, 620, 400][i], height: 34, borderRadius: 17, background: '#242424'}} />)}
    <Ring t={t} at={TL.plugTap} x={250} y={560} />
  </div>
);
const PluginsHome: React.FC<{t: number}> = ({t}) => {
  const q = typed('evlek', t, TL.type[0], TL.type[1]);
  const searching = t >= TL.searchTap;
  const res = E(lin(t, TL.res, TL.res + 0.2));
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 50, top: 176}}>{Ico.back()}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontSize: 52, fontWeight: 600}}>Eklentiler</div>
      <div style={{opacity: 1 - res}}>
        <div style={{position: 'absolute', left: 40, right: 40, top: 310, height: 116, borderRadius: 40, background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', fontSize: 44}}>
          <span>İzinler</span><span style={{color: K.dim, display: 'flex', alignItems: 'center', gap: 6}}>Düşük riske izin ver{Ico.chev()}</span>
        </div>
        <div style={{position: 'absolute', left: 70, right: 70, top: 446, fontSize: 32, lineHeight: '44px', color: K.dim}}>Eklentileri kullanırken ChatGPT’nin ne zaman izin istemesi gerektiğini seç.</div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 600, height: 116, borderRadius: 40, background: '#2A2A2A', display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px', fontSize: 44}}>{Ico.grid(K.text, 50)}<span style={{flex: 1}}>Eklentilere göz at</span>{Ico.chev()}</div>
      </div>
      {res > 0 && (
        <div style={{position: 'absolute', left: 30, right: 30, top: 320, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <div style={{fontSize: 40, fontWeight: 600, color: K.sub, padding: '0 34px 26px'}}>Sonuçlar</div>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 34, padding: '30px 34px', borderRadius: 44, background: t > TL.rowTap ? '#2A2A2A' : 'transparent'}}>
            <EvIcon size={132} r={0.28} />
            <div style={{flex: 1}}><div style={{fontSize: 54, fontWeight: 700}}>Evlek</div><div style={{fontSize: 40, color: K.sub, marginTop: 6}}>Northern Cyprus property data</div></div>
            {Ico.plus(K.sub, 64)}
            <Ring t={t} at={TL.rowTap} x={300} y={96} r={120} />
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 50, right: 50, bottom: 150, height: 120, borderRadius: 60, background: '#2A2A2A', boxShadow: `inset 0 0 0 2px ${searching ? 'rgba(127,178,255,.5)' : 'rgba(255,255,255,.06)'}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 44px', fontSize: 48}}>
        {Ico.search(K.sub, 54)}
        {q ? <span>{q}</span> : <span style={{color: K.dim}}>Eklenti ara</span>}
        {searching && <span style={{width: 4, height: 56, background: blink && t < TL.res + 0.3 ? K.blue : 'transparent'}} />}
        <Ring t={t} at={TL.searchTap} x={300} y={60} r={100} />
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
export const INSTALL_BTN = {x: SW / 2, y: SH - 110 - 75};
const EvlekPage: React.FC<{t: number}> = ({t}) => {
  const ip = press(t, TL.installTap), tp = press(t, TL.tryTap);
  const spin = t >= TL.spin[0] && t < TL.spin[1];
  const bound = t >= TL.bound; // spin[1] === bound: aynı karede; geri dönüş yok
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <StatusBar />
      <div style={{position: 'absolute', left: 50, top: 176}}>{Ico.back()}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontSize: 52, fontWeight: 600}}>Evlek</div>
      <div style={{position: 'absolute', right: 56, top: 174}}>{Ico.share()}</div>
      <div style={{position: 'absolute', left: 64, right: 64, top: 320}}>
        <EvIcon size={168} r={0.26} />
        <div style={{marginTop: 40, fontSize: 84, fontWeight: 700, letterSpacing: '-0.03em'}}>Evlek</div>
        <div style={{marginTop: 8, fontSize: 44, color: K.sub}}>Northern Cyprus property data</div>
        <div style={{marginTop: 50, borderRadius: 56, padding: 36, background: 'linear-gradient(135deg,#6FC3D9 0%,#5B9BEA 38%,#8FD6C9 78%,#B9E6C4 100%)'}}>
          {PROMPTS.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '30px 34px', borderRadius: 38, background: 'rgba(255,255,255,.80)', marginTop: i ? 24 : 0, color: '#0D1520', fontSize: 38, lineHeight: '52px'}}>
              <div style={{flex: 1}}><b>{a}</b>{b}</div>
              <div style={{width: 72, height: 72, borderRadius: 36, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{Ico.arrow()}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 44, fontSize: 40, lineHeight: '58px', color: '#C5CBD4'}}>Evlek brings live Northern Cyprus (KKTC/TRNC) property listings into ChatGPT. Ask in Turkish, English, Russian, German or Arabic…</div>
        <div style={{marginTop: 40, fontSize: 44, fontWeight: 600}}>Uygulama</div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 28}}>
          <EvIcon size={104} r={0.28} />
          <div>
            <div style={{fontSize: 46, fontWeight: 600}}>Evlek</div>
            {bound && <div style={{fontSize: 40, color: '#3DDC97', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600}}>{Ico.check('#3DDC97', 42)}Bağlı</div>}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 110, height: 150, borderRadius: 75, background: bound ? '#3A3A3A' : '#F2F4F7', color: bound ? K.text : '#0D0F13', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 52, fontWeight: 700,
        transform: `scale(${bound ? tp.s : ip.s})`}}>
        {spin ? <div style={{width: 60, height: 60, borderRadius: 30, border: '7px solid rgba(13,15,19,.2)', borderTopColor: '#0D0F13', transform: `rotate(${(t - TL.spin[0]) * 900}deg)`}} /> : bound ? 'Sohbette dene' : 'Eklentiyi kur'}
      </div>
      <Ring t={t} at={TL.installTap} x={INSTALL_BTN.x} y={INSTALL_BTN.y} r={130} />
      <Ring t={t} at={TL.tryTap} x={INSTALL_BTN.x} y={INSTALL_BTN.y} r={130} />
      <HomeBar />
    </div>
  );
};

// ---------- Girne: kurulumdan sonraki ilk deneme (GERÇEK widget, 52 ilan) ----------
export const GIRNE_SCROLL = 300;
const GirneChat: React.FC<{t: number}> = ({t}) => {
  const sent = t >= TL.send + 0.03;
  const sc = mix(0, GIRNE_SCROLL, Easing.bezier(0.25, 0.1, 0, 1)(lin(t, TL.gScroll[0], TL.gScroll[1])));
  const typedL = typed(QG.join('\n'), t, TL.gType[0], TL.gType[1]).split('\n');
  const bk = Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, TL.bubble[0], TL.bubble[1]));
  const wO = E(lin(t, TL.girne[0], TL.girne[1]));
  return (
    <ChatFrame t={t} sc={sc} composer={<Composer lines={sent ? [''] : typedL} chip={!sent} caret={!sent} t={t} sendAt={TL.send} />}>
      {sent && <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.bubble, transform: `translateY(${(1 - bk) * 1700}px)`}}><Bubble lines={QG} chipO={1} /></div>}
      {t >= TL.gTrace[0] && <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.trace}}><Trace t={t} a={TL.gTrace[0]} b={TL.gTrace[1]} done="52 ilan" /></div>}
      {t >= TL.girne[0] && <div style={{position: 'absolute', left: 0, top: FLOW.widget, opacity: wO, transform: `translateY(${(1 - wO) * 30}px)`}}><Img src={W_('wGirne.png')} style={{width: SW, height: WIDGET_H}} /></div>}
    </ChatFrame>
  );
};

// ---------- iOS geçişleri ----------
const PUSH = Easing.bezier(0.4, 0, 0.2, 1);
const Push: React.FC<{k: number; under: React.ReactNode; over: React.ReactNode}> = ({k, under, over}) => (
  <>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${-0.3 * SW * k}px)`}}>{under}<div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.25 * k})`}} /></div>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - k) * SW}px)`, boxShadow: '-20px 0 60px rgba(0,0,0,.5)'}}>{over}</div>
  </>
);
const Modal: React.FC<{k: number; under: React.ReactNode; over: React.ReactNode}> = ({k, under, over}) => (
  <>
    {under}
    <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.35 * k})`}} />
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - k) * SH}px)`}}>{over}</div>
  </>
);
/** tam ekran açılışı: dokunulan kartın dikdörtgeninden ekrana (temsilî ölçek) */
const Expand: React.FC<{k: number; from: {x: number; y: number; w: number; h: number}; under: React.ReactNode; over: React.ReactNode}> = ({k, from, under, over}) => {
  const sx = mix(from.w / SW, 1, k), sy = mix(from.h / SH, 1, k);
  return (
    <>
      {under}
      <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: SH, transformOrigin: '0 0', transform: `translate(${mix(from.x, 0, k)}px, ${mix(from.y, 0, k)}px) scale(${sx}, ${sy})`, opacity: lin(k, 0, 0.35), borderRadius: mix(60, 0, k) / Math.max(sx, 0.01), overflow: 'hidden'}}>{over}</div>
    </>
  );
};

/** saf durum fonksiyonu: zaman → ekran durumu adı (QC: her durum ≥18 kare, geri dönüş yok) */
export const stateAt = (t: number): string => {
  if (t < TL.cutQ) return t < TL.rportal[1] ? 'detail1-hero-gizli' : 'detail1';
  if (t < TL.tap + 0.05) return 'lapta-sohbet';
  if (t < TL.next) return 'detail1';
  if (t < TL.scroll[0]) return 'detail2';
  if (t < TL.web[0]) return 'detail2-kaydir';
  if (t < TL.ext) return 'evlek.app';
  if (t < TL.side[0]) return 'lapta-sohbet';
  if (t < TL.plugPush[0]) return 'kenar-menu';
  if (t < TL.res) return 'eklentiler';
  if (t < TL.pagePush[0]) return 'eklenti-arama';
  if (t < TL.spin[0]) return 'evlek-sayfa';
  if (t < TL.bound) return 'kuruluyor';
  if (t < TL.newPush[0]) return 'bagli';
  if (t < TL.send) return 'yeni-sohbet';
  return 'girne';
};

export const Screen: React.FC<{t: number}> = ({t}) => {
  if (t < TL.cutQ) return <FsDetail t={t} n={1} heroHidden={t < TL.rportal[1]} />;
  if (t < TL.fsOpen[0]) return <LaptaChat t={t} />;
  if (t < TL.next) {
    const k = Easing.bezier(0.4, 0, 0.2, 1)(lin(t, TL.fsOpen[0], TL.fsOpen[1]));
    return k >= 1 ? <FsDetail t={t} n={1} /> : <Expand k={k} from={card5Rect(LAPTA_SCROLL)} under={<LaptaChat t={t} />} over={<FsDetail t={t} n={1} />} />;
  }
  if (t < TL.ext) {
    const scroll = mix(0, FS_SCROLL, Easing.bezier(0.3, 0, 0.1, 1)(lin(t, TL.scroll[0], TL.scroll[1])));
    const d = <FsDetail t={t} n={2} scroll={scroll} />;
    if (t < TL.web[0]) return d;
    return <Modal k={Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, TL.web[0], TL.web[1]))} under={d} over={<WebPage />} />;
  }
  if (t < TL.plugPush[0]) {
    const k = Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, TL.side[0], TL.side[1]));
    return (
      <>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${k * SIDE_W}px)`}}><LaptaChat t={t} menuTap={TL.menuTap} /><div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.4 * k})`}} /></div>
        {k > 0 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${(k - 1) * SIDE_W}px)`}}><Sidebar t={t} /></div>}
      </>
    );
  }
  if (t < TL.pagePush[0]) {
    const k = PUSH(lin(t, TL.plugPush[0], TL.plugPush[1]));
    if (k >= 1) return <PluginsHome t={t} />;
    return <Push k={k} under={<><div style={{position: 'absolute', inset: 0, transform: `translateX(${SIDE_W}px)`}}><LaptaChat t={t} /><div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)'}} /></div><Sidebar t={t} /></>} over={<PluginsHome t={t} />} />;
  }
  if (t < TL.newPush[0]) {
    const k = PUSH(lin(t, TL.pagePush[0], TL.pagePush[1]));
    return k >= 1 ? <EvlekPage t={t} /> : <Push k={k} under={<PluginsHome t={t} />} over={<EvlekPage t={t} />} />;
  }
  const k = PUSH(lin(t, TL.newPush[0], TL.newPush[1]));
  return k >= 1 ? <GirneChat t={t} /> : <Push k={k} under={<EvlekPage t={t} />} over={<GirneChat t={t} />} />;
};
