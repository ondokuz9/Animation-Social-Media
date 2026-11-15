// v14 · telefon ekranı (1179×2556). Evlek yüzeyleri GERÇEK PİKSEL (public/v12/w); ChatGPT kabuğu temsilî,
// düzen ve renkler Rumi'nin iOS ekran görüntüleri ile Onur'un kaydından ölçüldü (docs/v14/BULGULAR.md).
// Üçüncü taraf logo/adı yok; kişi/ofis adı yok; klavyede küre/mikrofon satırı ve dil etiketi yok (markasız).
import React from 'react';
import {Easing, Img, staticFile} from 'remotion';
import {E, EvIcon, F, S, lin, mix} from '../v10/core';
import {SH, SW} from './Phone';
import {QL, TL, typeTimes} from './tl';

const K = {accent: '#305BEE', bg: '#000000', comp: '#191919', surf: '#1C1C1E', surf2: '#2C2C2E', text: '#F2F2F2', sub: '#9B9B9B', dim: '#6E6E73', bubble: '#010456', stop: '#305BEE', skel: '#1F1F22'};
const img = (p: string) => staticFile(p);
const W_ = (n: string) => img(`v12/w/${n}`);
const PT = 3;
const IOS = Easing.bezier(0.38, 0.7, 0.125, 1);
const IOSOUT = Easing.bezier(0.3, 0, 0.2, 1);
const PUSH = Easing.bezier(0.4, 0, 0.2, 1);

export const press = (t: number, at: number) => {
  if (t < at || t > at + 0.22) return 1;
  return t < at + 0.1 ? mix(1, 0.96, S(lin(t, at, at + 0.1))) : mix(0.96, 1, S(lin(t, at + 0.1, at + 0.22)));
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * lin(t, a, b)));

// ---------- ikonlar ----------
const sv = (w: number, d: React.ReactNode, c: string, sw = 2) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const Ico = {
  menu: (c = K.text) => <svg width={56} height={32} viewBox="0 0 56 32" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round"><path d="M2.5 2.5h51M2.5 29.5h32" /></svg>,
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
  arrow: (c = '#0D0F13', w = 40) => sv(w, <path d="M5 12h14M13 6l6 6-6 6" />, c, 2.6),
  gear: (c = K.text, w = 56) => sv(w, <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></>, c, 1.8),
  xcirc: (c = K.sub, w = 44) => sv(w, <><circle cx="12" cy="12" r="9" fill={c} stroke="none" /><path d="M9 9l6 6M15 9l-6 6" stroke="#191919" /></>, c, 2.2),
  lib: (c = K.text, w = 60) => sv(w, <><path d="M4 4h4v16H4zM10 4h4v16h-4z" /><path d="M16 5l4 1-3 14-4-1z" /></>, c, 1.7),
  folder: (c = K.text, w = 60) => sv(w, <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, c, 1.7),
  plugin: (c = K.text, w = 60) => sv(w, <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /><path d="M12 3.5v5M12 15.5v5" /></>, c, 1.7),
  clock: (c = K.text, w = 60) => sv(w, <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, c, 1.7),
  code: (c = K.text, w = 60) => sv(w, <><circle cx="12" cy="12" r="8.5" /><path d="M10 9l-3 3 3 3M14 9l3 3-3 3" /></>, c, 1.7),
  grid: (c = K.text, w = 60) => sv(w, <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>, c, 1.7),
};

const StatusBar: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 140, fontFamily: F, color: K.text, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 136, top: 50, fontSize: 52, fontWeight: 600, letterSpacing: '-0.01em'}}>10:24</div>
    <div style={{position: 'absolute', right: 111, top: 66, display: 'flex', gap: 18, alignItems: 'center'}}>
      <svg width="58" height="36" viewBox="0 0 29 18">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 7.5} y={14 - i * 4} width="5" height={4 + i * 4} rx="1.3" fill={K.text} />)}</svg>
      <svg width="52" height="38" viewBox="0 0 26 19"><path d="M13 17.5l3.2-3.7a4.6 4.6 0 0 0-6.4 0z M5.6 10.2a10.6 10.6 0 0 1 14.8 0l-2.2 2.4a7.4 7.4 0 0 0-10.4 0z M1.2 5.6a17 17 0 0 1 23.6 0l-2.2 2.4a13.8 13.8 0 0 0-19.2 0z" fill={K.text} /></svg>
      <div style={{width: 74, height: 36, borderRadius: 11, border: '3px solid rgba(238,240,243,.45)', padding: 3, boxSizing: 'border-box'}}><div style={{width: '82%', height: '100%', borderRadius: 6, background: K.text}} /></div>
    </div>
  </div>
);
const HomeBar: React.FC = () => <div style={{position: 'absolute', left: SW / 2 - 200, bottom: 22, width: 400, height: 14, borderRadius: 7, background: 'rgba(238,240,243,.85)'}} />;
const Circ: React.FC<{x: number; y: number; children: React.ReactNode; r?: number; s?: number; bg?: string}> = ({x, y, children, r = 59, s = 1, bg = '#181818'}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.10)', transform: `scale(${s})`}}>{children}</div>
);
const ChatHeader: React.FC<{t: number; empty?: boolean}> = ({t, empty}) => (
  <>
    <Circ x={113} y={225} s={press(t, TL.menu)}>{Ico.menu()}</Circ>
    <Circ x={SW - 113} y={225}>{Ico.edit(empty ? '#3A3A3A' : K.text)}</Circ>
  </>
);

// ---------- klavye (markasız Türkçe Q; küre/mikrofon satırı ve dil etiketi yok) ----------
export const KB = {top: 1715, h: SH - 1715};
const ROWS = ['qwertyuıopğü', 'asdfghjklşi', 'zxcvbnmöç'];
const Keyboard: React.FC<{k: number; search?: boolean}> = ({k, search}) => {
  if (k <= 0) return null;
  const kw = 79, gap = 18;
  const key = (ch: string, x: number, y: number, w = kw, fn = false, blue = false) => (
    <div key={`${ch}${x}${y}`} style={{position: 'absolute', left: x, top: y, width: w, height: 123, borderRadius: 15, background: blue ? '#006DFD' : '#343633', color: '#F2F2F2', fontFamily: F, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ch === 'S' ? Ico.search('#FFFFFF', 56) : ch === 'R' ? <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 5v7a3 3 0 0 1-3 3H5M9 11l-4 4 4 4" /></svg> : ch}</div>
  );
  const rowX = (n: number, w = kw) => (SW - (n * w + (n - 1) * gap)) / 2;
  const tops = [1781, 1932, 2083, 2234].map((y) => y - KB.top);
  const els: React.ReactNode[] = [];
  ROWS[0].split('').forEach((c, i) => els.push(key(c, rowX(12) + i * (kw + gap), tops[0])));
  ROWS[1].split('').forEach((c, i) => els.push(key(c, rowX(11) + i * (kw + gap), tops[1])));
  const x3 = rowX(9);
  ROWS[2].split('').forEach((c, i) => els.push(key(c, x3 + i * (kw + gap), tops[2])));
  els.push(key('⇧', 10, tops[2], x3 - 10 - gap, true), key('⌫', x3 + 9 * (kw + gap), tops[2], SW - 10 - (x3 + 9 * (kw + gap)), true));
  els.push(key('123', 10, tops[3], 150, true), key('☺', 178, tops[3], 120, true), key('', 316, tops[3], SW - 316 - 10 - 248 - gap), key(search ? 'S' : 'R', SW - 10 - 248, tops[3], 248, true, !!search));
  return (
    <div style={{position: 'absolute', left: 0, top: KB.top, width: SW, height: KB.h, background: '#161815', borderRadius: '42px 42px 0 0', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,.08)', transform: `translateY(${(1 - k) * KB.h}px)`}}>
      {els}
      <HomeBar />
    </div>
  );
};

// ---------- Evlek çipi ----------
export const CHIP_W = 190;
const EvChip: React.FC<{size?: number; o?: number}> = ({size = 48, o = 1}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 24, width: CHIP_W, verticalAlign: 'middle', fontWeight: 500, color: K.text, opacity: o}}>
    <EvIcon size={size * 0.75} r={0.28} />Evlek
  </span>
);

// ---------- yazım kutusu ----------
const LH = 68, COMP = {x: 36, padTop: 44, row: 132};
export const compH = (n: number) => COMP.padTop + n * LH + COMP.row;
const KB_BOTTOM = SH - KB.top + 30; // klavye açıkken kutunun alt payı (877)
/** çipin "Evlek" sözcüğünün merkezi (klavye açık, tek satır) */
export const CHIP_WORD = {x: COMP.x + 44 + 36 + 24 + 60, y: SH - KB_BOTTOM - compH(1) + COMP.padTop + LH / 2, h: 38};
export const INSTALL_BTN = {x: SW / 2, y: SH - 91 - 72};
export const SEND_BTN = {x: SW - COMP.x - 17 - 44, y: SH - KB_BOTTOM - 20 - 44};
/** yazım kutusu: kb=1 klavye açık (iki katlı kutu), kb=0 klavye kapalı (tek satırlık yüzen hap, gerçek kayıt 57_0) */
export const PILL = {left: 98, right: 101, bottom: 91, h: 127};
const Composer: React.FC<{t: number; lines: string[]; chip: boolean; caret?: boolean; kb: number; sendState?: 'empty' | 'ready' | 'stop'; textO?: number}> = ({t, lines, chip, caret, kb, sendState = 'empty', textO = 1}) => {
  const n = Math.max(1, lines.length);
  const blink = 0.5 + 0.5 * Math.cos(2 * Math.PI * (t % 1));
  const hasText = lines.some((l) => l);
  const H = mix(PILL.h, compH(n), kb);
  const bottom = mix(PILL.bottom, KB_BOTTOM, kb);
  const sp = press(t, TL.send);
  const showBtn = sendState !== 'empty';
  const bs = mix(86, 88, kb);
  return (
    <div style={{position: 'absolute', left: mix(PILL.left, COMP.x, kb), right: mix(PILL.right, COMP.x, kb), bottom, height: H, borderRadius: 64, background: kb < 1 ? `rgba(25,25,25,${mix(0.94, 1, kb)})` : K.comp, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.10)', fontFamily: F}}>
      <div style={{position: 'absolute', left: mix(138, 44, kb), right: 44, top: mix((PILL.h - 64) / 2, COMP.padTop, kb), fontSize: mix(46, 48, kb), lineHeight: `${mix(64, LH, kb)}px`, color: K.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap', opacity: textO}}>
        {chip && <EvChip />}
        {caret && !hasText && <span style={{display: 'inline-block', width: 4, height: 56, marginRight: 6, verticalAlign: -10, background: '#3A6BFF', opacity: blink}} />}
        {!chip && !hasText && <span style={{color: '#757575'}}>ChatGPT’ye sor</span>}
        {lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
        {caret && hasText && <span style={{display: 'inline-block', width: 4, height: 56, marginLeft: 4, verticalAlign: -10, background: '#3A6BFF', opacity: blink}} />}
      </div>
      <div style={{position: 'absolute', left: mix(41, 36, kb), bottom: mix((PILL.h - 48) / 2, 36, kb)}}>{Ico.plus(K.text, mix(48, 60, kb))}</div>
      <div style={{position: 'absolute', right: mix(164, 160, kb), bottom: mix((PILL.h - 56) / 2, 38, kb)}}>{Ico.mic(K.text)}</div>
      {showBtn && (
        <div style={{position: 'absolute', right: mix(19, 17, kb), bottom: mix((PILL.h - 86) / 2, 20, kb), width: bs, height: bs, borderRadius: bs / 2, background: K.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sp === 1 ? 1 : mix(1, 0.9, (1 - sp) / 0.04)})`}}>
          {sendState === 'stop' ? <div style={{width: 30, height: 30, borderRadius: 6, background: '#fff'}} /> : Ico.up('#fff', 48)}
        </div>
      )}
    </div>
  );
};

// ---------- parmak imleci (ekran koordinatı) ----------
type WP = [number, number, number]; // t, x, y
const CUR_TRACKS: {a: number; b: number; pts: WP[]; taps: number[]}[] = [
  {a: 6.95, b: 7.42, pts: [[6.95, 900, 1420], [7.22, SEND_BTN.x, SEND_BTN.y]], taps: [TL.send]},
  {a: 11.85, b: 13.2, pts: [[11.85, 980, 0], [12.0, 980, 0], [12.25, 680, 0], [12.85, 680, 0], [12.95, 396, 1], [13.065, 396, 1]], taps: [TL.tap]},
  {a: 17.25, b: 17.75, pts: [[17.25, 900, 715], [17.45, 900, 715], [17.681, 520, 715]], taps: []},
  {a: 18.12, b: 18.75, pts: [[18.12, 760, 2300], [18.3, 881, 2452], [18.45, 881, 2452], [18.6, 110, 208], [18.62, 110, 208]], taps: [TL.contact, TL.close]},
  {a: 19.7, b: 20.0, pts: [[19.7, 260, 420], [19.95, 110, 228]], taps: [TL.menu]},
  {a: 20.47, b: 20.87, pts: [[20.47, 420, 900], [20.82, 260, 614]], taps: [TL.plug]},
  {a: 21.34, b: 21.62, pts: [[21.34, 589, 1900], [21.58, 589, SH - 104 - 62]], taps: [TL.searchTap]},
  {a: 22.5, b: 22.9, pts: [[22.5, 589, 760], [22.85, 330, 430]], taps: [TL.row]},
  {a: 23.75, b: 24.05, pts: [[23.75, 700, 2000], [24.0, INSTALL_BTN.x, INSTALL_BTN.y]], taps: [TL.install]},
  {a: 24.9, b: 25.2, pts: [[24.9, 760, 2100], [25.16, INSTALL_BTN.x, INSTALL_BTN.y]], taps: [TL.tryTap]},
];
const Cursor: React.FC<{t: number; cardY: number}> = ({t, cardY}) => {
  const tr = CUR_TRACKS.find((c) => t >= c.a && t < c.b);
  if (!tr) return null;
  let i = 0;
  while (i < tr.pts.length - 1 && tr.pts[i + 1][0] <= t) i++;
  const a = tr.pts[i], b = tr.pts[Math.min(i + 1, tr.pts.length - 1)];
  const k = b === a ? 1 : Easing.bezier(0.4, 0, 0.2, 1)(lin(t, a[0], b[0]));
  let x = mix(a[1], b[1], k), y = mix(a[2], b[2], k);
  if (tr.a === 11.85) y = cardY; // kart şeridi: dikey konum şeride bağlı
  const o = lin(t, tr.a, tr.a + 0.1) * (1 - lin(t, tr.b - 0.1, tr.b));
  const pr = tr.taps.reduce((m, at) => Math.min(m, press(t, at)), 1);
  const down = t >= 12.0 && t < 12.25 && tr.a === 11.85 ? 0.88 : pr === 1 ? 1 : mix(1, 0.8, (1 - pr) / 0.04);
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 70, background: 'rgba(255,255,255,.34)', boxShadow: '0 0 0 4px rgba(10,37,64,.75), 0 6px 18px rgba(0,0,0,.35)', opacity: o, transform: `scale(${down})`}} />;
};

// ---------- sohbet akışı ----------
const TOP = 300;
const FLOW = {bubble: 40, think: 337, label: 450, widget: 529};
const WS = 1, WX = 0;
const LAP = {mapH: 188 * PT, topH: 829, rowY: 829, rowH: 860, botY: 1689, botH: 171, x0pt: 742, cardY: 12 * PT, cardH: 262.67 * PT, cardW: 232 * PT};
export const WIDGET_H = 1860;
export const LAPTA_SCROLL = 514;
export const chatScroll = (t: number) => mix(0, LAPTA_SCROLL, IOS(lin(t, TL.scroll[0], TL.scroll[1])));
// sürükle (1:1, 300 ekran px) + bırak (üstel yavaşlama τ 0,32) → £139.000 kartı yakalanır
const CARD_PX = 244 * PT * WS;
const DRAG_PX = 300, TAU = 0.32;
const V0 = DRAG_PX / (TL.drag[1] - TL.drag[0]);
const COAST_PX = V0 * TAU * (1 - Math.exp(-(TL.coast[1] - TL.coast[0]) / TAU));
const TOTAL_PX = DRAG_PX + COAST_PX;
const travelled = (t: number) => {
  if (t < TL.drag[0]) return 0;
  if (t < TL.drag[1]) return DRAG_PX * lin(t, TL.drag[0], TL.drag[1]);
  return DRAG_PX + V0 * TAU * (1 - Math.exp(-Math.min(t - TL.drag[1], TL.coast[1] - TL.coast[0]) / TAU));
};
export const cardIdx = (t: number) => 5 - (TOTAL_PX - travelled(t)) / CARD_PX;
const rowLeft = (idx: number) => (LAP.x0pt - 244 * idx) * PT;
export const card5Rect = () => ({x: WX + 16 * PT * WS, y: TOP + FLOW.widget - LAPTA_SCROLL + (LAP.rowY + LAP.cardY) * WS, w: LAP.cardW * WS, h: LAP.cardH * WS});

const Bubble: React.FC<{lines: string[]}> = ({lines}) => (
  <div style={{position: 'absolute', right: 40, maxWidth: 1000, padding: '34px 54px', borderRadius: 56, background: K.bubble, fontFamily: F, fontSize: 46, lineHeight: '69px', color: K.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
    <EvChip size={44} />{lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
  </div>
);
const LaptaWidget: React.FC<{t: number}> = ({t}) => {
  const k = IOS(lin(t, TL.res[0], TL.res[1]));
  const idx = cardIdx(t);
  const cp = press(t, TL.tap);
  return (
    <div style={{position: 'absolute', left: WX, top: (1 - k) * 24, width: SW, height: WIDGET_H, transform: `scale(${WS})`, transformOrigin: '0 0', overflow: 'hidden', background: '#212121', opacity: k}}>
      <Img src={W_('wLaptaTop.png')} style={{position: 'absolute', left: 0, top: 0, width: SW, height: LAP.topH}} />
      <div style={{position: 'absolute', left: 0, top: LAP.rowY, width: SW, height: LAP.rowH, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: LAP.rowH, transform: `scale(${cp})`, transformOrigin: `${16 * PT + LAP.cardW / 2}px ${LAP.cardY + LAP.cardH / 2}px`}}>
          <Img src={W_('wLaptaRow.png')} style={{position: 'absolute', left: Math.round(rowLeft(idx)), top: 0, height: LAP.rowH}} />
        </div>
      </div>
      <Img src={W_('wLaptaBot.png')} style={{position: 'absolute', left: 0, top: LAP.botY, width: SW, height: LAP.botH}} />
    </div>
  );
};
const LaptaChat: React.FC<{t: number}> = ({t}) => {
  const sc = chatScroll(t);
  const sh = ((t - TL.search[0]) * 1.6) % 1;
  const done = t >= TL.res[0];
  const stop = t >= TL.send && t < TL.stopOff;
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: TOP, bottom: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: -sc}}>
          {t >= TL.rise[1] - 0.001 && <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.bubble}}><Bubble lines={QL} /></div>}
          {t >= TL.think && <div style={{position: 'absolute', left: 46, top: FLOW.think, fontFamily: F, fontSize: 45, color: '#A1A1A1', display: 'flex', alignItems: 'center', gap: 8, opacity: lin(t, TL.think, TL.think + 0.15)}}>Birkaç saniye düşündü {Ico.chev(K.sub, 38)}</div>}
          {t >= TL.search[0] && (
            <div style={{position: 'absolute', left: 46, top: FLOW.label, display: 'flex', alignItems: 'center', gap: 24, fontFamily: F, fontSize: 38, fontWeight: 400, opacity: lin(t, TL.search[0], TL.search[0] + 0.12)}}>
              <EvIcon size={48} r={0.28} />
              {done ? <span style={{color: '#8E8E8E'}}>Evlek</span> : <span style={{backgroundImage: `linear-gradient(90deg, ${K.dim} ${sh * 160 - 40}%, #FFFFFF ${sh * 160 - 20}%, ${K.dim} ${sh * 160}%)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>Evlek</span>}
            </div>
          )}
          {t >= TL.res[0] && <div style={{position: 'absolute', left: 0, right: 0, top: FLOW.widget}}><LaptaWidget t={t} /></div>}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: TOP, background: 'linear-gradient(180deg, #000 82%, rgba(0,0,0,0))'}} />
      <ChatHeader t={t} />
      <Composer t={t} lines={['']} chip={false} kb={0} sendState={stop ? 'stop' : 'empty'} />
      <HomeBar />
    </div>
  );
};
/** yeni sohbet (kapak, yazma, kapanış): klavye açık */
const NewChat: React.FC<{t: number; chip: boolean; lines?: string[]; caret?: boolean; kb?: number; ready?: boolean; textO?: number}> = ({t, chip, lines = [''], caret, kb = 1, ready, textO}) => (
  <div style={{position: 'absolute', inset: 0, background: K.bg}}>
    <ChatHeader t={t} empty={!lines.some((l) => l)} />
    <Composer t={t} lines={lines} chip={chip} caret={caret} kb={kb} sendState={ready ? 'ready' : 'empty'} textO={textO} />
    <Keyboard k={kb} />
  </div>
);

// ---------- GERÇEK tam ekran ilan ----------
export const FS_TOP = 275;
export const HERO_D = {x: 0, y: FS_TOP, w: SW, h: 294.75 * PT};
export const CONTACT = {x: 881, y: FS_TOP + 691 * PT + 104.5, x0: 633, x1: 1130, y0: FS_TOP + 691 * PT + 39, y1: FS_TOP + 691 * PT + 170};
/** galeri: sürükle (1:1) + sayfa yayı → 2/14 */
const galleryOffset = (t: number) => {
  if (t < TL.swipe[0]) return 0;
  if (t < TL.swipe[1]) return 380 * lin(t, TL.swipe[0], TL.swipe[1]);
  return mix(380, SW, Easing.bezier(0.25, 0.9, 0.3, 1)(lin(t, TL.page2[0], TL.page2[1])));
};
const FsDetail: React.FC<{t: number; heroHidden?: boolean}> = ({t, heroHidden}) => {
  const off = galleryOffset(t);
  const n = off > SW * 0.5 ? 2 : 1;
  const cp = press(t, TL.contact);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#212121', fontFamily: F}}>
      <div style={{position: 'absolute', left: 0, top: FS_TOP, width: SW, height: SH - FS_TOP, overflow: 'hidden'}}>
        <Img src={W_(`dFull_${n}.png`)} style={{position: 'absolute', left: 0, top: 0, width: SW}} />
        {off > 0 && off < SW && (
          <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: HERO_D.h, overflow: 'hidden'}}>
            <Img src={W_('dFull_1.png')} style={{position: 'absolute', left: -off, top: 0, width: SW}} />
            <Img src={W_('dFull_2.png')} style={{position: 'absolute', left: SW - off, top: 0, width: SW}} />
          </div>
        )}
        {heroHidden && <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: HERO_D.h, background: '#151515'}} />}
      </div>
      <div style={{position: 'absolute', left: 0, top: FS_TOP + 691 * PT, width: SW, height: 69 * PT, transform: `scale(${cp})`, transformOrigin: `${CONTACT.x}px ${104}px`}}>
        <Img src={W_('dBar.png')} style={{width: SW, height: 69 * PT}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: FS_TOP, background: '#000'}} />
      <Circ x={110} y={208} s={press(t, TL.close)}>{Ico.close()}</Circ>
      <div style={{position: 'absolute', left: 0, right: 0, top: 176, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontSize: 48, fontWeight: 600, color: K.text}}><EvIcon size={58} r={0.28} />Evlek</div>
      <HomeBar />
    </div>
  );
};
/** paylaşılan öğe yakınlaşması: kartın kırpımı tam ekrana büyür, kahraman fotoğraf kartın fotoğrafıyla birebir eşleşir */
const Zoom: React.FC<{t: number; k: number; under: React.ReactNode; heroPool?: number}> = ({t, k, under, heroPool = 0}) => {
  const c = card5Rect();
  const sc = mix(c.w / SW, 1, k);
  const x = mix(c.x, 0, k), y = mix(c.y - FS_TOP * (c.w / SW), 0, k);
  const clipTop = mix(FS_TOP * sc, 0, k), clipH = mix(c.h, SH, k);
  return (
    <>
      {under}
      <div style={{position: 'absolute', left: x, top: y + clipTop, width: SW * sc, height: clipH, overflow: 'hidden', borderRadius: mix(36, 104, k)}}>
        <div style={{position: 'absolute', left: 0, top: -clipTop, width: SW, height: SH, transform: `scale(${sc})`, transformOrigin: '0 0'}}>
          <FsDetail t={t} />
          {heroPool > 0 && <Img src={img('v4/EVL-100102_00.jpg')} style={{position: 'absolute', left: 0, top: FS_TOP, width: SW, height: HERO_D.h, opacity: heroPool}} />}
        </div>
      </div>
    </>
  );
};

// ---------- kenar menü ve Eklentiler ----------
const SIDE_W = 885;
const SIDE_ITEMS: [string, (c?: string, w?: number) => JSX.Element][] = [['Kitaplık', Ico.lib], ['Projeler', Ico.folder], ['Eklentiler', Ico.plugin], ['Planlanmış', Ico.clock], ['Codex', Ico.code], ['Keşfet', Ico.grid]];
const Sidebar: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SIDE_W, height: SH, background: '#000', fontFamily: F, color: K.text, boxShadow: 'inset -2px 0 0 rgba(255,255,255,.06)'}}>
    <div style={{position: 'absolute', left: 86, top: 192, fontSize: 60, fontWeight: 700, letterSpacing: '-0.02em'}}>ChatGPT</div>
    <Circ x={SIDE_W - 120} y={226}>{Ico.search(K.text, 54)}</Circ>
    {SIDE_ITEMS.map(([s, ic], i) => (
      <div key={s} style={{position: 'absolute', left: 50, right: 40, top: 300 + i * 128, height: 116, borderRadius: 36, display: 'flex', alignItems: 'center', gap: 34, padding: '0 36px', fontSize: 51, fontWeight: 500,
        background: s === 'Eklentiler' && t >= TL.plug ? 'rgba(255,255,255,.08)' : 'transparent'}}>{ic(K.text, 60)}{s}</div>
    ))}
    <div style={{position: 'absolute', left: 100, bottom: 120, height: 130, padding: '0 50px', borderRadius: 65, background: '#F2F2F2', color: '#000', display: 'flex', alignItems: 'center', gap: 20, fontSize: 48, fontWeight: 600}}>{Ico.edit('#000', 52)}Sohbet</div>
    <Circ x={SIDE_W - 120} y={SH - 185}>{Ico.gear()}</Circ>
  </div>
);
const Skel: React.FC<{y: number; w: number}> = ({y, w}) => (
  <div style={{position: 'absolute', left: 50, right: 50, top: y, display: 'flex', alignItems: 'center', gap: 36}}>
    <div style={{width: 128, height: 128, borderRadius: 32, background: K.surf}} />
    <div><div style={{width: w, height: 34, borderRadius: 17, background: K.skel}} /><div style={{marginTop: 20, width: w * 1.45, height: 26, borderRadius: 13, background: '#151517'}} /></div>
  </div>
);
const Plugins: React.FC<{t: number}> = ({t}) => {
  const q = typed('evlek', t, TL.ptype[0], TL.ptype[1] + 0.01);
  const kb = t < TL.page[0] ? IOS(lin(t, TL.kbd[0], TL.kbd[1])) : 1 - IOSOUT(lin(t, TL.page[0], TL.page[0] + 0.3));
  const searching = t >= TL.searchTap;
  const res = E(lin(t, TL.pres, TL.pres + 0.2));
  const rowS = press(t, TL.row);
  const pillBottom = mix(104, SH - KB.top + 34, kb);
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <Circ x={110} y={228}>{Ico.menu()}</Circ>
      <div style={{position: 'absolute', left: 0, right: 0, top: 196, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 52, fontWeight: 600}}>Eklentiler{Ico.down(K.text, 40)}</div>
      {!searching && (
        <>
          <div style={{position: 'absolute', left: 60, top: 370, fontSize: 48, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>Kurulu{Ico.chev(K.text, 40)}</div>
          <div style={{position: 'absolute', left: 50, top: 480, display: 'flex', gap: 30}}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{width: 132, height: 132, borderRadius: 34, background: K.surf}} />)}</div>
          <div style={{position: 'absolute', left: 60, top: 720, fontSize: 48, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>Popüler{Ico.chev(K.text, 40)}</div>
          {[850, 1065, 1280].map((y, i) => <Skel key={y} y={y} w={[220, 300, 250][i]} />)}
        </>
      )}
      {searching && res < 1 && <div style={{opacity: 1 - res}}>{[330, 545, 760].map((y, i) => <Skel key={y} y={y} w={[260, 200, 300][i]} />)}</div>}
      {res > 0 && (
        <div style={{position: 'absolute', left: 30, right: 30, top: 330, opacity: res, transform: `translateY(${(1 - res) * 24}px) scale(${rowS})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 36, padding: '28px 30px', borderRadius: 44, background: t > TL.row ? K.surf2 : 'transparent'}}>
            <EvIcon size={132} r={0.28} />
            <div style={{flex: 1}}><div style={{fontSize: 51, fontWeight: 600}}>Evlek</div><div style={{fontSize: 45, color: K.sub, marginTop: 6}}>Northern Cyprus property data</div></div>
            {Ico.plus(K.text, 60)}
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: searching ? 36 : 103, right: searching ? 189 : 103, bottom: pillBottom, height: searching ? 127 : 125, borderRadius: 64, background: searching ? '#121212' : 'rgba(18,18,18,.92)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 30, padding: '0 35px', fontSize: 46, transform: `scale(${press(t, TL.searchTap)})`}}>
        {Ico.search(K.sub, 54)}
        {q ? <span>{q}</span> : <span style={{color: K.dim}}>Eklenti ara</span>}
        {searching && <span style={{width: 4, height: 56, background: '#8FB4FF', opacity: 0.5 + 0.5 * Math.cos(2 * Math.PI * (t % 1))}} />}
        <span style={{flex: 1}} />
        {q && Ico.xcirc(K.sub, 44)}
      </div>
      {searching && <div style={{opacity: lin(t, TL.searchTap, TL.searchTap + 0.15)}}><Circ x={1080} y={SH - pillBottom - 64} r={60}>{Ico.close()}</Circ></div>}
      <Keyboard k={kb} search />
    </div>
  );
};
const PROMPTS = [
  ['@Evlek', ' Show me apartments for sale in Kyrenia under £300,000.'],
  ['@Evlek', ' What are the median asking prices for apartments for sale in Kyrenia?'],
  ['@Evlek', ' Compare EVL-101366 and EVL-101348.'],
];
const EvlekPage: React.FC<{t: number}> = ({t}) => {
  const spin = t >= TL.spin[0] && t < TL.bound;
  const bound = t >= TL.bound;
  const gearK = lin(t, TL.bound, TL.bound + 0.2);
  return (
    <div style={{position: 'absolute', inset: 0, background: K.bg, fontFamily: F, color: K.text}}>
      <Circ x={110} y={228}>{Ico.back()}</Circ>
      <div style={{position: 'absolute', left: 0, right: 0, top: 196, textAlign: 'center', fontSize: 52, fontWeight: 600}}>Evlek</div>
      <Circ x={SW - 110} y={228}><div style={{position: 'relative', width: 56, height: 56}}><div style={{position: 'absolute', inset: 0, opacity: 1 - gearK}}>{Ico.share()}</div><div style={{position: 'absolute', inset: 0, opacity: gearK}}>{Ico.gear()}</div></div></Circ>
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
        <div style={{marginTop: 44, fontSize: 40, lineHeight: '58px', color: '#C5CBD4'}}>Evlek brings live Northern Cyprus (KKTC/TRNC) property listings into ChatGPT. Ask in Turkish, English, Russian, German or Arabic and… <span style={{color: '#4A9EFF'}}>Daha fazla</span></div>
        <div style={{marginTop: 40, fontSize: 44, fontWeight: 600}}>Uygulama</div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 28}}>
          <EvIcon size={104} r={0.28} />
          <div>
            <div style={{fontSize: 46, fontWeight: 600}}>Evlek</div>
            {bound && <div style={{fontSize: 42, color: '#9B9B9B', opacity: lin(t, TL.bound, TL.bound + 0.15)}}>Bağlı</div>}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 83, right: 83, bottom: 91, height: 144, borderRadius: 72, background: bound ? '#9E9E9E' : '#F2F2F2', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 600,
        transform: `scale(${bound ? press(t, TL.tryTap) : press(t, TL.install)})`}}>
        {spin ? <div style={{width: 60, height: 60, borderRadius: 30, border: '7px solid rgba(0,0,0,.2)', borderTopColor: '#000', transform: `rotate(${(t - TL.spin[0]) * 900}deg)`}} /> : bound ? 'Sohbette dene' : 'Eklentiyi kur'}
      </div>
    </div>
  );
};

/** saf durum fonksiyonu (QC) */
export const stateAt = (t: number) =>
  t < TL.sig[1] ? 'kapak-klavye' : t < TL.type[0] ? 'cip' : t < TL.send ? 'yazma' : t < TL.res[0] ? 'gonder-arama' : t < TL.drag[0] ? 'lapta-sonuc' : t < TL.expand[0] ? 'kart' : t < TL.portalOut[0] ? 'ilan-1' : t < TL.portalIn[1] ? 'ev' :
  t < TL.collapse[0] ? 'ilan-2' : t < TL.side[0] ? 'sohbet' : t < TL.plugOpen[0] ? 'kenar-menu' : t < TL.kbd[0] ? 'eklentiler' : t < TL.page[0] ? 'eklenti-arama' : t < TL.spin[0] ? 'evlek-sayfa' : t < TL.bound ? 'kuruluyor' : t < TL.newChat[0] ? 'bagli' : t < TL.back[0] + 0.05 ? 'yeni-sohbet-cip' : 'kapak-klavye';

/** kart şeridinin ekran y'si (imleç için) */
const cardCenterY = (t: number) => TOP + FLOW.widget - chatScroll(t) + (LAP.rowY + LAP.cardY + LAP.cardH * 0.42) * WS;

const ScreenBody: React.FC<{t: number}> = ({t}) => {
  // GİRİŞ + yazma (klavye açık)
  if (t < TL.rise[0]) {
    const tt = typeTimes();
    const all = QL.join('\n');
    const n = tt.filter((x) => x <= t).length;
    const lines = all.slice(0, n).split('\n');
    return <NewChat t={t} chip={t >= TL.sig[1] - 0.06} lines={lines} caret ready={n > 0} />;
  }
  // gönder: metin kutudan balona uçar, klavye iner, kutu boşalır
  if (t < TL.rise[1]) {
    const k = IOS(lin(t, TL.rise[0], TL.rise[1]));
    const kb = 1 - IOSOUT(lin(t, TL.kbdDown[0], TL.kbdDown[1]));
    const fromY = SH - KB_BOTTOM - compH(2) - TOP + 10, toY = FLOW.bubble;
    return (
      <>
        <NewChat t={t} chip={false} kb={kb} />
        <div style={{position: 'absolute', left: 0, right: 0, top: TOP + mix(fromY, toY, k), opacity: lin(k, 0, 0.15)}}>
          <div style={{position: 'absolute', right: 40, padding: '34px 54px', borderRadius: 56, background: `rgba(1,4,86,${k})`, fontFamily: F, fontSize: mix(48, 46, k), lineHeight: '69px', color: K.text, whiteSpace: 'nowrap'}}>
            <EvChip size={44} />{QL.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
          </div>
        </div>
      </>
    );
  }
  if (t < TL.expand[0]) return <LaptaChat t={t} />;
  // ilan (yakınlaşma, galeri, kapanış)
  if (t < TL.collapse[1]) {
    const hidden = t >= TL.portalOut[0] && t < TL.portalIn[1];
    if (t < TL.expand[1]) return <Zoom t={t} k={PUSH(lin(t, TL.expand[0], TL.expand[1]))} under={<LaptaChat t={t} />} />;
    if (t < TL.collapse[0]) return <FsDetail t={t} heroHidden={hidden} />;
    const k = 1 - PUSH(lin(t, TL.collapse[0], TL.collapse[1]));
    return <Zoom t={t} k={k} under={<LaptaChat t={t} />} heroPool={1 - lin(k, 0.15, 0.6)} />;
  }
  // SONUÇ
  if (t < TL.plugOpen[1]) {
    const k = Easing.bezier(0.2, 0.8, 0.2, 1)(lin(t, TL.side[0], TL.side[1]));
    const close = PUSH(lin(t, TL.plugOpen[0], TL.plugOpen[1]));
    const under = t >= TL.plugOpen[0] ? <Plugins t={t} /> : <LaptaChat t={t} />;
    const kk = k * (1 - close);
    return (
      <>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${kk * SIDE_W}px)`, borderRadius: mix(0, 165, kk), overflow: 'hidden', boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,${0.14 * kk})`}}>{under}<div style={{position: 'absolute', inset: 0, background: `rgba(255,255,255,${0.07 * kk})`, borderRadius: mix(0, 165, kk), boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,${0.14 * kk})`}} /></div>
        {kk > 0 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${(kk - 1) * SIDE_W}px)`}}><Sidebar t={t} /></div>}
      </>
    );
  }
  if (t < TL.newChat[0]) {
    const k = PUSH(lin(t, TL.page[0], TL.page[1]));
    if (k <= 0) return <Plugins t={t} />;
    if (k >= 1) return <EvlekPage t={t} />;
    return (
      <>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-0.3 * SW * k}px)`}}><Plugins t={t} /><div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.3 * k})`}} /></div>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - k) * SW}px)`, boxShadow: '-20px 0 60px rgba(0,0,0,.5)'}}><EvlekPage t={t} /></div>
      </>
    );
  }
  const k = PUSH(lin(t, TL.newChat[0], TL.newChat[1]));
  const chip = t < TL.back[0] + 0.05;
  const nc = <NewChat t={t} chip={chip} caret />;
  if (k >= 1) return nc;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${-0.3 * SW * k}px)`}}><EvlekPage t={t} /></div>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - k) * SW}px)`, boxShadow: '-20px 0 60px rgba(0,0,0,.5)'}}>{nc}</div>
    </>
  );
};

export const Screen: React.FC<{t: number}> = ({t}) => (
  <>
    <ScreenBody t={t} />
    <StatusBar />
    <Cursor t={t} cardY={cardCenterY(t)} />
  </>
);
