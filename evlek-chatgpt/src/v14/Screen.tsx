// v13 · telefon ekranı (1179×2556 tasarım px). Evlek yüzeyleri GERÇEK PİKSEL (public/v12/w, cap/capture-v12.mjs).
// ChatGPT kabuğu temsilî; düzen Rumi'nin 15 Kas iOS ekran görüntülerine ve Onur'un kaydına (docs/eklenti-ref) göre.
// Üçüncü taraf logo/adı yok (yer tutucu); kişi/ofis adı, sabitlenen/kişisel sohbet listesi yok.
import React from 'react';
import {Easing, Img, staticFile} from 'remotion';
import {E, EvIcon, F, S, lin, mix} from '../v10/core';
import {SH, SW} from './Phone';
import {TL} from './tl';

const K = {bg: '#000000', surf: '#1C1C1E', surf2: '#2C2C2E', text: '#F2F2F2', sub: '#9B9B9B', dim: '#6E6E73', bubble: '#0D1A66', send: '#0A84FF', skel: '#1F1F22'};
const img = (p: string) => staticFile(p);
const W_ = (n: string) => img(`v12/w/${n}`);
const PT = 3;

export const press = (t: number, at: number) => {
  if (t < at || t > at + 0.3) return {s: 1, a: 0};
  const i = lin(t, at, at + 0.09), o = lin(t, at + 0.09, at + 0.3);
  return t < at + 0.09 ? {s: mix(1, 0.97, S(i)), a: S(i)} : {s: mix(0.97, 1, S(o)), a: 1 - S(o)};
};
const Ring: React.FC<{t: number; at: number; x: number; y: number; r?: number}> = ({t, at, x, y, r = 110}) => {
  const p = press(t, at);
  if (p.a <= 0) return null;
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: `rgba(255,255,255,${0.35 * p.a})`, transform: `scale(${mix(0.7, 1, p.a)})`, pointerEvents: 'none'}} />;
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * lin(t, a, b)));

// ---------- ikonlar ----------
const sv = (w: number, d: React.ReactNode, c: string, sw = 2) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const Ico = {
  menu: (c = K.text, w = 60) => sv(w, <path d="M4 9h16M4 15h10" />, c),
  edit: (c = K.text, w = 56) => sv(w, <><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" /></>, c, 1.8),
  close: (c = K.text, w = 54) => sv(w, <path d="M6 6l12 12M18 6L6 18" />, c, 2.2),
  back: (c = K.text, w = 60) => sv(w, <path d="M15 5l-7 7 7 7" />, c, 2.2),
  plus: (c = K.text, w = 60) => sv(w, <path d="M12 5v14M5 12h14" />, c),
  mic: (c = K.text, w = 56) => sv(w, <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>, c, 1.9),
  up: (c = '#fff', w = 52) => sv(w, <path d="M12 19V5M6 11l6-6 6 6" />, c, 2.6),
  search: (c = K.sub, w = 52) => sv(w, <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>, c),
  chev: (c = K.sub, w = 40) => sv(w, <path d="M9 6l6 6-6 6" />, c, 2.4),
  down: (c = K.text, w = 40) => sv(w, <path d="M6 9l6 6 6-6" />, c, 2.4),
  share: (c = K.text, w = 56) => sv(w, <path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />, c, 1.9),
  check: (c = '#3DDC97', w = 40) => sv(w, <path d="M5 12.5l4.5 4.5L19 7.5" />, c, 2.8),
  arrow: (c = '#0D0F13', w = 40) => sv(w, <path d="M5 12h14M13 6l6 6-6 6" />, c, 2.6),
  gear: (c = K.text, w = 56) => sv(w, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>, c, 1.6),
  // kenar menü (gerçek sıralama: Kitaplık, Projeler, Eklentiler, Planlanmış, Codex, Keşfet)
  lib: (c = K.text, w = 60) => sv(w, <><path d="M4 4h4v16H4zM10 4h4v16h-4z" /><path d="M16 5l4 1-3 14-4-1z" /></>, c, 1.7),
  folder: (c = K.text, w = 60) => sv(w, <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, c, 1.7),
  plugin: (c = K.text, w = 60) => sv(w, <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /><path d="M12 3.5v5M12 15.5v5" /></>, c, 1.7),
  clock: (c = K.text, w = 60) => sv(w, <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, c, 1.7),
  code: (c = K.text, w = 60) => sv(w, <><circle cx="12" cy="12" r="8.5" /><path d="M10 9l-3 3 3 3M14 9l3 3-3 3" /></>, c, 1.7),
  grid: (c = K.text, w = 60) => sv(w, <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>, c, 1.7),
};

const StatusBar: React.FC<{light?: boolean}> = ({light}) => {
  const c = light ? '#0D1520' : K.text;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 140, fontFamily: F, color: c}}>
      <div style={{position: 'absolute', left: 120, top: 48, fontSize: 50, fontWeight: 600, letterSpacing: '-0.01em'}}>10:24</div>
      <div style={{position: 'absolute', right: 100, top: 58, display: 'flex', gap: 18, alignItems: 'center'}}>
        <svg width="58" height="36" viewBox="0 0 29 18">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 7.5} y={14 - i * 4} width="5" height={4 + i * 4} rx="1.3" fill={c} />)}</svg>
        <svg width="52" height="38" viewBox="0 0 26 19"><path d="M13 17.5l3.2-3.7a4.6 4.6 0 0 0-6.4 0z M5.6 10.2a10.6 10.6 0 0 1 14.8 0l-2.2 2.4a7.4 7.4 0 0 0-10.4 0z M1.2 5.6a17 17 0 0 1 23.6 0l-2.2 2.4a13.8 13.8 0 0 0-19.2 0z" fill={c} /></svg>
        <div style={{width: 74, height: 36, borderRadius: 11, border: '3px solid rgba(238,240,243,.45)', padding: 3, boxSizing: 'border-box'}}><div style={{width: '82%', height: '100%', borderRadius: 6, background: c}} /></div>
      </div>
    </div>
  );
};
const HomeBar: React.FC = () => <div style={{position: 'absolute', left: SW / 2 - 200, bottom: 22, width: 400, height: 14, borderRadius: 7, background: 'rgba(238,240,243,.85)'}} />;
const Circ: React.FC<{x: number; y: number; children: React.ReactNode; r?: number}> = ({x, y, children, r = 62}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: K.surf, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.06)'}}>{children}</div>
);
const ChatHeader: React.FC<{t: number; menuTap?: number; closeX?: boolean}> = ({t, menuTap, closeX}) => (
  <>
    <Circ x={110} y={228}>{closeX ? Ico.close() : Ico.menu()}</Circ>
    <Circ x={SW - 110} y={228}>{Ico.edit()}</Circ>
    {menuTap !== undefined && <Ring t={t} at={menuTap} x={110} y={228} r={90} />}
  </>
);

// ---------- Evlek çipi (sabit genişlik → imza hareketinin hedefi ölçülebilir) ----------
export const CHIP_W = 210;
const EvChip: React.FC<{size?: number; o?: number}> = ({size = 48, o = 1}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.25, width: CHIP_W, verticalAlign: 'middle', fontWeight: 700, color: K.text, opacity: o}}>
    <EvIcon size={size * 0.95} r={0.28} />Evlek
  </span>
);

// ---------- yazım kutusu (gerçek düzen: üstte metin, altta + / mikrofon / gönder) ----------
const LH = 68, COMP = {bottom: 70, x: 36, padTop: 44, row: 132};
export const compH = (n: number) => COMP.padTop + n * LH + COMP.row;
export const compTop = (n: number) => SH - COMP.bottom - compH(n);
/** çipin "Evlek" sözcüğünün merkezi (tek satırlık kutu) */
export const CHIP_WORD = {x: COMP.x + 44 + 48 * 0.95 + 12 + 70, y: compTop(1) + COMP.padTop + LH / 2, h: 38};
const Composer: React.FC<{t: number; lines: string[]; chip: boolean; caret?: boolean; sendAt?: number}> = ({t, lines, chip, caret, sendAt}) => {
  const has = lines.some((l) => l.length > 0);
  const n = Math.max(1, lines.length);
  const p = sendAt !== undefined ? press(t, sendAt) : {s: 1, a: 0};
  const blink = caret && (t % 1) < 0.5;
  return (
    <div style={{position: 'absolute', left: COMP.x, right: COMP.x, bottom: COMP.bottom, height: compH(n), borderRadius: 64, background: K.surf, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.07)', fontFamily: F}}>
      <div style={{position: 'absolute', left: 44, right: 44, top: COMP.padTop, fontSize: 48, lineHeight: `${LH}px`, color: K.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
        {chip && <EvChip />}
        {!has && !chip && !caret && <span style={{color: K.dim}}>ChatGPT’ye sor</span>}
        {lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
        {caret && <span style={{display: 'inline-block', width: 4, height: 56, marginLeft: 4, verticalAlign: -10, background: blink ? '#8FB4FF' : 'transparent'}} />}
      </div>
      <div style={{position: 'absolute', left: 36, bottom: 36}}>{Ico.plus(K.text, 60)}</div>
      <div style={{position: 'absolute', right: 160, bottom: 38}}>{Ico.mic(K.text)}</div>
      <div style={{position: 'absolute', right: 26, bottom: 22, width: 104, height: 104, borderRadius: 52, background: has ? K.send : K.surf2, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p.s})`}}>{Ico.up(has ? '#fff' : K.sub)}</div>
      <Ring t={t} at={sendAt ?? -9} x={SW - 72 - 26 - 52} y={compH(n) - 22 - 52} r={86} />
    </div>
  );
};

// ---------- sohbet akışı ----------
const TOP = 300;
export const QL = ['Lapta’da £160 bin altı,', 'deniz manzaralı 2+1 daire'];
const FLOW = {bubble: 40, think: 300, label: 372, widget: 470};
const WS = 0.96, WX = 24; // widget ölçeği (küçültme: piksel kaybı yok)
const LAP = {mapH: 188 * PT, topH: 829, rowY: 829, rowH: 860, botY: 1689, botH: 171, x0pt: 742, cardY: 12 * PT, cardH: 262.67 * PT, cardW: 232 * PT};
export const WIDGET_H = 1860;
export const LAPTA_SCROLL = 900;
export const chatScroll = (t: number) => mix(0, LAPTA_SCROLL, Easing.bezier(0.3, 0, 0.2, 1)(lin(t, TL.scroll[0], TL.scroll[1])));
export const cardIdx = (t: number) => mix(3.1, 5, Easing.bezier(0.25, 0.6, 0.2, 1)(lin(t, TL.drag[0] - 0.4, TL.drag[1])));
const rowLeft = (idx: number) => (LAP.x0pt - 244 * idx) * PT;
/** £139.000 kartının ekran dikdörtgeni (kaydırma sonrası) */
export const card5Rect = () => ({x: WX + 16 * PT * WS, y: TOP + FLOW.widget - LAPTA_SCROLL + (LAP.rowY + LAP.cardY) * WS, w: LAP.cardW * WS, h: LAP.cardH * WS});
/** kart fotoğrafı (4:3, kartın üst kısmı) */
export const cardPhotoRect = () => { const c = card5Rect(); return {x: c.x, y: c.y, w: c.w, h: c.w * 0.75}; };

const Bubble: React.FC<{lines: string[]}> = ({lines}) => (
  <div style={{position: 'absolute', right: 40, maxWidth: 1000, padding: '34px 44px', borderRadius: 56, background: K.bubble, fontFamily: F, fontSize: 46, lineHeight: '64px', color: K.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
    <EvChip size={44} />{lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
  </div>
);
const LaptaWidget: React.FC<{t: number}> = ({t}) => {
  const mapO = E(lin(t, TL.res[0], TL.res[0] + 0.3)), headO = E(lin(t, TL.res[0] + 0.15, TL.res[1]));
  const idx = cardIdx(t);
  return (
    <div style={{position: 'absolute', left: WX, top: 0, width: SW, height: WIDGET_H, transform: `scale(${WS})`, transformOrigin: '0 0', borderRadius: 44, overflow: 'hidden', background: '#212121', opacity: lin(t, TL.res[0], TL.res[0] + 0.12), translate: `0 ${(1 - mapO) * 40}px`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: LAP.mapH, overflow: 'hidden', opacity: mapO}}><Img src={W_('wLaptaTop.png')} style={{width: SW, height: LAP.topH}} /></div>
      <div style={{position: 'absolute', left: 0, top: LAP.mapH, width: SW, height: LAP.topH - LAP.mapH, overflow: 'hidden', opacity: headO}}><Img src={W_('wLaptaTop.png')} style={{position: 'absolute', top: -LAP.mapH, width: SW, height: LAP.topH}} /></div>
      <div style={{position: 'absolute', left: 0, top: LAP.rowY, width: SW, height: LAP.rowH, overflow: 'hidden', opacity: headO}}>
        <Img src={W_('wLaptaRow.png')} style={{position: 'absolute', left: Math.round(rowLeft(idx)), top: 0, height: LAP.rowH}} />
        <Ring t={t} at={TL.tap} x={16 * PT + LAP.cardW / 2} y={LAP.cardY + 330} r={120} />
      </div>
      <div style={{position: 'absolute', left: 0, top: LAP.botY, width: SW, height: LAP.botH, opacity: headO}}><Img src={W_('wLaptaBot.png')} style={{width: SW, height: LAP.botH}} /></div>
    </div>
  );
};
const Drag: React.FC<{t: number; sc: number}> = ({t, sc}) => {
  const a = TL.drag[0] - 0.1, b = TL.drag[1] + 0.1;
  if (t < a || t > b) return null;
  const k = Easing.bezier(0.25, 0.6, 0.2, 1)(lin(t, TL.drag[0], TL.drag[1]));
  const o = lin(t, a, a + 0.08) * (1 - lin(t, TL.drag[1], b));
  const y = FLOW.widget - sc + (LAP.rowY + 420) * WS;
  return <div style={{position: 'absolute', left: mix(930, 360, k) - 110, top: y - 110, width: 220, height: 220, borderRadius: 110, background: 'rgba(255,255,255,.35)', opacity: o}} />;
};
const searchDone = (t: number) => t >= TL.res[0];
const LaptaChat: React.FC<{t: number; menuTap?: number}> = ({t, menuTap}) => {
  const sc = chatScroll(t);
  const bk = Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, TL.rise[0], TL.rise[1]));
  const sh = ((t - TL.search[0]) * 1.4) % 1;
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: TOP, bottom: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: -sc}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.bubble, transform: `translateY(${(1 - bk) * 1750}px)`}}><Bubble lines={QL} /></div>
          {searchDone(t) && <div style={{position: 'absolute', left: 52, top: FLOW.think, fontFamily: F, fontSize: 42, color: K.sub, display: 'flex', alignItems: 'center', gap: 8, opacity: lin(t, TL.res[0], TL.res[0] + 0.2)}}>Birkaç saniye düşündü {Ico.chev(K.sub, 38)}</div>}
          {t >= TL.search[0] && (
            <div style={{position: 'absolute', left: 52, top: FLOW.label, display: 'flex', alignItems: 'center', gap: 20, fontFamily: F, fontSize: 44, fontWeight: 500, opacity: lin(t, TL.search[0], TL.search[0] + 0.15)}}>
              <EvIcon size={60} r={0.28} />
              {searchDone(t) ? <span style={{color: K.text}}>Evlek</span>
                : <span style={{backgroundImage: `linear-gradient(90deg, ${K.dim} ${sh * 160 - 40}%, #FFFFFF ${sh * 160 - 20}%, ${K.dim} ${sh * 160}%)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>Evlek</span>}
            </div>
          )}
          {t >= TL.res[0] && <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.widget}}><LaptaWidget t={t} /></div>}
          <Drag t={t} sc={0} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: TOP, background: `linear-gradient(180deg, #000 82%, rgba(0,0,0,0))`}} />
      <StatusBar />
      <ChatHeader t={t} menuTap={menuTap} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: 'linear-gradient(0deg, #000 72%, rgba(0,0,0,0))'}} />
      <Composer t={t} lines={['']} chip={false} />
      <HomeBar />
    </div>
  );
};
/** boş yeni sohbet: kapak, yazma ve kapanış */
const NewChat: React.FC<{t: number; chip: boolean; lines?: string[]; caret?: boolean; sendAt?: number; closeX?: boolean}> = ({t, chip, lines = [''], caret, sendAt, closeX}) => (
  <div style={{position: 'absolute', inset: 0, background: K.bg}}>
    <StatusBar />
    <ChatHeader t={t} closeX={closeX} />
    <Composer t={t} lines={lines} chip={chip} caret={caret} sendAt={sendAt} />
    <HomeBar />
  </div>
);

// ---------- GERÇEK tam ekran detay ----------
export const FS_TOP = 275;
export const HERO_D = {x: 0, y: FS_TOP, w: SW, h: 294.75 * PT};
export const DV_NEXT = {x: (337 + 22) * PT, y: FS_TOP + (125.4 + 22) * PT};
export const CONTACT = {x: 881, y: FS_TOP + 691 * PT + 104.5, x0: 633, x1: 1130, y0: FS_TOP + 691 * PT + 39, y1: FS_TOP + 691 * PT + 170};
const FsDetail: React.FC<{t: number; n: 1 | 2; heroHidden?: boolean}> = ({t, n, heroHidden}) => {
  const cp = press(t, TL.contact);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#212121', fontFamily: F}}>
      <div style={{position: 'absolute', left: 0, top: FS_TOP, width: SW, height: SH - FS_TOP, overflow: 'hidden'}}>
        <Img src={W_(`dFull_${n}.png`)} style={{position: 'absolute', left: 0, top: 0, width: SW}} />
        {heroHidden && <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: HERO_D.h, background: '#151515'}} />}
      </div>
      <Img src={W_('dBar.png')} style={{position: 'absolute', left: 0, top: FS_TOP + 691 * PT, width: SW, height: 69 * PT}} />
      {cp.a > 0 && <div style={{position: 'absolute', left: CONTACT.x0, top: CONTACT.y0, width: CONTACT.x1 - CONTACT.x0, height: CONTACT.y1 - CONTACT.y0, borderRadius: 66, background: `rgba(0,0,0,${0.22 * cp.a})`}} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: FS_TOP, background: '#000'}} />
      <StatusBar />
      <Circ x={110} y={208}>{Ico.close()}</Circ>
      <div style={{position: 'absolute', left: 0, right: 0, top: 176, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontSize: 48, fontWeight: 600, color: K.text}}><EvIcon size={58} r={0.28} />Evlek</div>
      <Ring t={t} at={TL.next} x={DV_NEXT.x} y={DV_NEXT.y} r={90} />
      <Ring t={t} at={TL.contact} x={CONTACT.x} y={CONTACT.y} r={130} />
      <HomeBar />
    </div>
  );
};

// ---------- kenar menü ve Eklentiler (gerçek düzen, üçüncü taraf içeriği yer tutucu) ----------
const SIDE_W = 885;
const SIDE_ITEMS: [string, (c?: string, w?: number) => JSX.Element][] = [['Kitaplık', Ico.lib], ['Projeler', Ico.folder], ['Eklentiler', Ico.plugin], ['Planlanmış', Ico.clock], ['Codex', Ico.code], ['Keşfet', Ico.grid]];
const Sidebar: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SIDE_W, height: SH, background: '#000', fontFamily: F, color: K.text, boxShadow: 'inset -2px 0 0 rgba(255,255,255,.06)'}}>
    <StatusBar />
    <div style={{position: 'absolute', left: 86, top: 192, fontSize: 60, fontWeight: 700, letterSpacing: '-0.02em'}}>ChatGPT</div>
    <Circ x={SIDE_W - 120} y={226}>{Ico.search(K.text, 54)}</Circ>
    {SIDE_ITEMS.map(([s, ic], i) => (
      <div key={s} style={{position: 'absolute', left: 50, right: 40, top: 300 + i * 128, height: 116, borderRadius: 36, display: 'flex', alignItems: 'center', gap: 34, padding: '0 36px', fontSize: 50, fontWeight: 500,
        background: s === 'Eklentiler' && t >= TL.plug ? K.surf : 'transparent'}}>{ic(K.text, 60)}{s}</div>
    ))}
    <div style={{position: 'absolute', left: 86, top: 1110, width: 300, height: 30, borderRadius: 15, background: K.skel}} />
    {[1200, 1320, 1440].map((y, i) => <div key={y} style={{position: 'absolute', left: 86, top: y, width: [520, 430, 580][i], height: 30, borderRadius: 15, background: '#141416'}} />)}
    <div style={{position: 'absolute', left: 100, bottom: 120, height: 130, padding: '0 50px', borderRadius: 65, background: '#F2F2F2', color: '#000', display: 'flex', alignItems: 'center', gap: 20, fontSize: 48, fontWeight: 600}}>{Ico.edit('#000', 52)}Sohbet</div>
    <Circ x={SIDE_W - 120} y={SH - 185}>{Ico.gear()}</Circ>
    <Ring t={t} at={TL.plug} x={260} y={300 + 2 * 128 + 58} />
  </div>
);
const Skel: React.FC<{y: number; w: number}> = ({y, w}) => (
  <div style={{position: 'absolute', left: 50, right: 50, top: y, display: 'flex', alignItems: 'center', gap: 36}}>
    <div style={{width: 128, height: 128, borderRadius: 32, background: K.surf}} />
    <div><div style={{width: w, height: 34, borderRadius: 17, background: K.skel}} /><div style={{marginTop: 20, width: w * 1.45, height: 26, borderRadius: 13, background: '#151517'}} /></div>
  </div>
);
const Plugins: React.FC<{t: number}> = ({t}) => {
  const q = typed('evlek', t, TL.ptype[0], TL.ptype[1]);
  const searching = t >= TL.searchTap;
  const res = E(lin(t, TL.pres, TL.pres + 0.2));
  const rp = press(t, TL.row);
  const blink = (t % 1) < 0.5;
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <StatusBar />
      <Circ x={110} y={228}>{Ico.menu()}</Circ>
      <div style={{position: 'absolute', left: 0, right: 0, top: 196, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 52, fontWeight: 600}}>Eklentiler{Ico.down(K.text, 40)}</div>
      <div style={{opacity: 1 - res}}>
        <div style={{position: 'absolute', left: 60, top: 370, fontSize: 48, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>Kurulu{Ico.chev(K.text, 40)}</div>
        <div style={{position: 'absolute', left: 50, top: 480, display: 'flex', gap: 30}}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{width: 132, height: 132, borderRadius: 34, background: K.surf, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.05)'}} />)}</div>
        <div style={{position: 'absolute', left: 60, top: 720, fontSize: 48, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>Popüler{Ico.chev(K.text, 40)}</div>
        {[850, 1065, 1280, 1495].map((y, i) => <Skel key={y} y={y} w={[220, 300, 250, 340][i]} />)}
      </div>
      {res > 0 && (
        <div style={{position: 'absolute', left: 30, right: 30, top: 330, opacity: res, transform: `translateY(${(1 - res) * 24}px) scale(${rp.s})`}}>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 36, padding: '28px 30px', borderRadius: 44, background: t > TL.row ? K.surf : 'transparent'}}>
            <EvIcon size={132} r={0.28} />
            <div style={{flex: 1}}><div style={{fontSize: 52, fontWeight: 600}}>Evlek</div><div style={{fontSize: 40, color: K.sub, marginTop: 6}}>Northern Cyprus property data</div></div>
            {Ico.plus(K.text, 60)}
            <Ring t={t} at={TL.row} x={330} y={94} r={120} />
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 50, right: searching ? 200 : 50, bottom: 120, height: 128, borderRadius: 64, background: K.surf, boxShadow: `inset 0 0 0 2px ${searching ? 'rgba(143,180,255,.45)' : 'rgba(255,255,255,.06)'}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 44px', fontSize: 48}}>
        {Ico.search(K.sub, 54)}
        {q ? <span>{q}</span> : <span style={{color: K.dim}}>Eklenti ara</span>}
        {searching && <span style={{width: 4, height: 56, background: blink ? '#8FB4FF' : 'transparent'}} />}
        <Ring t={t} at={TL.searchTap} x={300} y={64} r={100} />
      </div>
      {searching && <Circ x={SW - 110} y={SH - 184}>{Ico.close()}</Circ>}
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
  const ip = press(t, TL.install), tp = press(t, TL.tryTap);
  const spin = t >= TL.spin[0] && t < TL.spin[1];
  const bound = t >= TL.bound;
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <StatusBar />
      <Circ x={110} y={228}>{Ico.back()}</Circ>
      <div style={{position: 'absolute', left: 0, right: 0, top: 196, textAlign: 'center', fontSize: 52, fontWeight: 600}}>Evlek</div>
      <Circ x={SW - 110} y={228}>{Ico.share()}</Circ>
      <div style={{position: 'absolute', left: 64, right: 64, top: 340}}>
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
            {bound && <div style={{fontSize: 42, color: '#3DDC97', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600}}>{Ico.check('#3DDC97', 42)}Bağlı</div>}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 110, height: 150, borderRadius: 75, background: bound ? '#3A3A3C' : '#F2F2F2', color: bound ? K.text : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 700,
        transform: `scale(${bound ? tp.s : ip.s})`}}>
        {spin ? <div style={{width: 60, height: 60, borderRadius: 30, border: '7px solid rgba(0,0,0,.2)', borderTopColor: '#000', transform: `rotate(${(t - TL.spin[0]) * 900}deg)`}} /> : bound ? 'Sohbette dene' : 'Eklentiyi kur'}
      </div>
      <Ring t={t} at={TL.install} x={INSTALL_BTN.x} y={INSTALL_BTN.y} r={130} />
      <Ring t={t} at={TL.tryTap} x={INSTALL_BTN.x} y={INSTALL_BTN.y} r={130} />
      <HomeBar />
    </div>
  );
};

// ---------- geçişler ----------
const PUSH = Easing.bezier(0.4, 0, 0.2, 1);
const Push: React.FC<{k: number; under: React.ReactNode; over: React.ReactNode}> = ({k, under, over}) => (
  <>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${-0.3 * SW * k}px)`}}>{under}<div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.3 * k})`}} /></div>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - k) * SW}px)`, boxShadow: '-20px 0 60px rgba(0,0,0,.5)'}}>{over}</div>
  </>
);
/** karta dokunuş → tam ekran ilan: kartın fotoğrafı kahraman alanına uçar, ilan sayfası arkadan belirir (iç içe ekran yok) */
const Expand: React.FC<{t: number; k: number; under: React.ReactNode}> = ({t, k, under}) => {
  const a = cardPhotoRect(), b = HERO_D;
  const r = {x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)};
  return (
    <>
      {under}
      <div style={{position: 'absolute', inset: 0, opacity: lin(k, 0.25, 0.85)}}><FsDetail t={t} n={1} heroHidden /></div>
      <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: mix(30, 0, k), overflow: 'hidden'}}>
        <Img src={img('v4/EVL-100102_00.jpg')} style={{width: '100%', height: '100%'}} />
      </div>
    </>
  );
};
/** saf durum fonksiyonu (QC): her durum ≥0,3 sn, geri dönüş yok */
export const stateAt = (t: number) =>
  t < TL.sig[1] ? 'kapak' : t < TL.type[0] ? 'cip' : t < TL.send + 0.05 ? 'yazma' : t < TL.res[0] ? 'arama' : t < TL.expand[0] ? 'lapta-sonuc' : t < TL.next ? 'ilan-1' : t < TL.cut ? 'ilan-2' :
  t < TL.side[0] ? 'sohbet' : t < TL.plugOpen[0] ? 'kenar-menu' : t < TL.pres ? 'eklentiler' : t < TL.page[0] ? 'eklenti-arama' : t < TL.spin[0] ? 'evlek-sayfa' : t < TL.bound ? 'kuruluyor' : t < TL.newChat[0] ? 'bagli' : t < TL.back[0] ? 'yeni-sohbet-cip' : 'kapak';

export const Screen: React.FC<{t: number}> = ({t}) => {
  // GİRİŞ + yazma
  if (t < TL.send + 0.05) {
    const typing = t >= TL.type[0];
    const all = QL.join('\n');
    // 'altı,' sonrasında duraklama: ilk satır [type0, pause0], ikinci satır [pause1, type1]
    const n1 = QL[0].length + 1;
    const c = t < TL.typePause[0] ? Math.round(n1 * lin(t, TL.type[0], TL.typePause[0])) : t < TL.typePause[1] ? n1 : n1 + Math.round((all.length - n1) * lin(t, TL.typePause[1], TL.type[1]));
    const lines = typing ? all.slice(0, c).split('\n') : [''];
    return <NewChat t={t} chip={t >= TL.sig[1] - 0.06} lines={lines} caret={t >= TL.sig[1]} sendAt={TL.send} />;
  }
  // GELİŞME: sonuç → kart → ilan
  if (t < TL.expand[0]) return <LaptaChat t={t} />;
  if (t < TL.cut) {
    const k = Easing.bezier(0.4, 0, 0.2, 1)(lin(t, TL.expand[0], TL.expand[1]));
    const n = t >= TL.next ? 2 : 1;
    const hidden = t >= TL.portalOut[0] && t < TL.portalIn[1];
    const d = <FsDetail t={t} n={n} heroHidden={hidden} />;
    return k >= 1 ? d : <Expand t={t} k={k} under={<LaptaChat t={t} />} />;
  }
  // SONUÇ: Eklentiler'den ekle
  if (t < TL.plugOpen[1]) {
    const k = Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, TL.side[0], TL.side[1]));
    const close = Easing.bezier(0.4, 0, 0.2, 1)(lin(t, TL.plugOpen[0], TL.plugOpen[1]));
    const under = t >= TL.plugOpen[0] ? <Plugins t={t} /> : <LaptaChat t={t} menuTap={TL.menu} />;
    const kk = k * (1 - close);
    return (
      <>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${kk * SIDE_W}px)`}}>{under}<div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.45 * kk})`}} /></div>
        {kk > 0 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${(kk - 1) * SIDE_W}px)`}}><Sidebar t={t} /></div>}
      </>
    );
  }
  if (t < TL.newChat[0]) {
    const k = PUSH(lin(t, TL.page[0], TL.page[1]));
    return k <= 0 ? <Plugins t={t} /> : k >= 1 ? <EvlekPage t={t} /> : <Push k={k} under={<Plugins t={t} />} over={<EvlekPage t={t} />} />;
  }
  const k = PUSH(lin(t, TL.newChat[0], TL.newChat[1]));
  const chip = t < TL.back[0] + 0.05;
  const nc = <NewChat t={t} chip={chip} caret={chip} closeX={false} />;
  return k >= 1 ? nc : <Push k={k} under={<EvlekPage t={t} />} over={nc} />;
};
