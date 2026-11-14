// iOS ChatGPT kabuğu (koyu tema), 1179×2556 mantıksal piksel. Ölçüler ref/chatgpt-gercek-1…5.jpg'den alındı (×1,28).
// Kabuk süslenmez: gren yok, renk düzeltmesi yok, ekran dışına taşan öğe yok.
import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

export const F = 'InterV, -apple-system, sans-serif';
export const K = {
  bg: '#000000', bubble: '#303030', text: '#ECECEC', text2: '#9B9B9B', line: '#2A2A2A',
  pill: '#181818', comp: '#161616', compBorder: '#262626', kb: '#141414', key: '#3C3C3C', key2: '#2A2A2A',
};

// ---------- font ----------
export const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const R: Record<string, string> = {
      latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
      'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
    };
    Promise.all(['400', '500', '600', '700'].flatMap((w) => Object.entries(R).map(([s, u]) =>
      new FontFace('InterV', `url(${staticFile(`fonts/inter-${s}-${w}-normal.woff2`)}) format('woff2')`, {weight: w, unicodeRange: u}).load().then((ff) => document.fonts.add(ff)))))
      .then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

let _cv: HTMLCanvasElement | null = null;
export const measure = (s: string, size: number, weight = 400) => {
  _cv = _cv ?? document.createElement('canvas');
  const c = _cv.getContext('2d')!;
  c.font = `${weight} ${size}px InterV`;
  return c.measureText(s).width;
};

// ---------- zengin metin düzeni (kalın **…**, paragraflar) ----------
export type Glyph = {ch: string; bold: boolean; i: number};
export type Line = {glyphs: Glyph[]; para: number};
export const parseRich = (src: string) => {
  const out: Glyph[] = [];
  let bold = false, i = 0;
  for (let k = 0; k < src.length; k++) {
    if (src[k] === '*' && src[k + 1] === '*') { bold = !bold; k++; continue; }
    out.push({ch: src[k], bold, i: i++});
  }
  return out;
};
export const layoutRich = (src: string, width: number, size: number, indent = 0) => {
  const gl = parseRich(src);
  const lines: Line[] = [];
  let para = 0, cur: Glyph[] = [], curW = 0, word: Glyph[] = [], wordW = 0;
  const w = (g: Glyph) => measure(g.ch, size, g.bold ? 600 : 400);
  const flushWord = () => {
    const lim = lines.length === 0 ? width - indent : width;
    if (curW + wordW > lim && (cur.length || lines.length === 0 && indent > 0)) { lines.push({glyphs: cur, para}); cur = []; curW = 0; while (word.length && word[0].ch === ' ') { wordW -= w(word[0]); word.shift(); } }
    cur.push(...word); curW += wordW; word = []; wordW = 0;
  };
  for (let k = 0; k < gl.length; k++) {
    const g = gl[k];
    if (g.ch === '\n') { flushWord(); if (cur.length) lines.push({glyphs: cur, para}); cur = []; curW = 0; if (gl[k + 1]?.ch === '\n') { k++; para++; } continue; }
    if (g.ch === ' ') { flushWord(); word.push(g); wordW += w(g); flushWord(); continue; }
    word.push(g); wordW += w(g);
  }
  flushWord(); if (cur.length) lines.push({glyphs: cur, para});
  return {lines, count: gl.filter((g) => g.ch !== '\n').length};
};

/** ChatGPT akışı: 2–4 karakterlik parçalar, her parça 120 ms'de 0→1. */
export const chunkStarts = (count: number, t0: number, t1: number, seed = 7) => {
  const starts: number[] = [];
  let i = 0, s = seed, k = 0;
  const sizes: number[] = [];
  while (i < count) { s = (s * 9301 + 49297) % 233280; const n = 2 + Math.floor((s / 233280) * 3); sizes.push(n); i += n; }
  const dt = (t1 - t0) / Math.max(1, sizes.length);
  sizes.forEach((n, j) => { for (let q = 0; q < n && k < count; q++) starts[k++] = t0 + j * dt; });
  return starts;
};

export const RichText: React.FC<{src: string; t: number; t0: number; t1: number; width: number; size?: number; lh?: number; paraGap?: number; color?: string; seed?: number}> = ({src, t, t0, t1, width, size = 51, lh = 1.42, paraGap = 0.75, color = K.text, seed}) => {
  const {lines, count} = layoutRich(src.replace(/’/g, "'"), width, size);
  const st = chunkStarts(count, t0, t1, seed);
  let lastPara = 0;
  return (
    <div style={{fontFamily: F, fontSize: size, lineHeight: `${size * lh}px`, color, width}}>
      {lines.map((ln, li) => {
        const gap = ln.para !== lastPara ? size * lh * paraGap : 0; lastPara = ln.para;
        return (
          <div key={li} style={{marginTop: gap, whiteSpace: 'pre', height: size * lh}}>
            {ln.glyphs.map((g) => {
              const a = Math.max(0, Math.min(1, (t - st[g.i]) / 0.12));
              return <span key={g.i} style={{opacity: a, fontWeight: g.bold ? 600 : 400}}>{g.ch}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};
export const richHeight = (src: string, width: number, size = 51, lh = 1.42, paraGap = 0.75) => {
  const {lines} = layoutRich(src.replace(/’/g, "'"), width, size);
  const paras = lines.length ? lines[lines.length - 1].para : 0;
  return lines.length * size * lh + paras * size * lh * paraGap;
};
/** Akış sırasında görünen yükseklik (otomatik kaydırma için). */
export const richHeightAt = (src: string, width: number, t: number, t0: number, t1: number, size = 51, lh = 1.42, paraGap = 0.75, seed?: number) => {
  const {lines, count} = layoutRich(src.replace(/’/g, "'"), width, size);
  if (t < t0) return 0;
  const st = chunkStarts(count, t0, t1, seed);
  let h = 0, last = 0, lp = 0;
  lines.forEach((ln) => {
    const gap = ln.para !== lp ? size * lh * paraGap : 0; lp = ln.para;
    h += gap + size * lh;
    if (ln.glyphs.some((g) => st[g.i] <= t)) last = h;
  });
  return last;
};

// ---------- durum çubuğu ----------
export const StatusBar: React.FC<{dark?: boolean}> = ({dark}) => {
  const c = dark ? '#000' : '#fff';
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 150, fontFamily: F, color: c}}>
      <div style={{position: 'absolute', left: 150, top: 58, fontSize: 46, fontWeight: 600, letterSpacing: '-0.01em'}}>9:41</div>
      <svg style={{position: 'absolute', left: 836, top: 66}} width="60" height="36" viewBox="0 0 30 18">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 7.5} y={14 - i * 4} width="5" height={4 + i * 4} rx="1.2" fill={c} />)}</svg>
      <svg style={{position: 'absolute', left: 914, top: 64}} width="54" height="40" viewBox="0 0 27 20"><path d="M13.5 18.5l3.2-3.6a4.5 4.5 0 00-6.4 0z M13.5 6.2c3.4 0 6.5 1.3 8.8 3.5l2-2.2A15.3 15.3 0 0013.5 3.2 15.3 15.3 0 002.7 7.5l2 2.2c2.3-2.2 5.4-3.5 8.8-3.5zm0 4.6c2.2 0 4.2.8 5.7 2.2l2-2.2a11.4 11.4 0 00-15.4 0l2 2.2c1.5-1.4 3.5-2.2 5.7-2.2z" fill={c} /></svg>
      <div style={{position: 'absolute', left: 990, top: 62, width: 82, height: 40, borderRadius: 12, border: `3px solid ${dark ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.45)'}`}}>
        <div style={{position: 'absolute', inset: 4, borderRadius: 7, background: c}} />
      </div>
      <div style={{position: 'absolute', left: 1078, top: 75, width: 5, height: 14, borderRadius: 3, background: dark ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.45)'}} />
    </div>
  );
};

// ---------- başlık ----------
const Circle: React.FC<{x: number; children: React.ReactNode}> = ({x, children}) => (
  <div style={{position: 'absolute', left: x, top: 166, width: 118, height: 118, borderRadius: 59, background: K.pill, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);
const MenuIcon = () => <svg width="50" height="36" viewBox="0 0 25 18"><path d="M2 4h21M2 14h13" stroke="#ECECEC" strokeWidth="2.4" strokeLinecap="round" /></svg>;
export const HeaderNew: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, fontFamily: F}}>
    <Circle x={54}><MenuIcon /></Circle>
    <div style={{position: 'absolute', left: 333, top: 164, width: 512, height: 125, borderRadius: 63, background: K.pill, display: 'flex', alignItems: 'center', padding: 9}}>
      <div style={{flex: 1, height: '100%', borderRadius: 54, background: '#3A3A3A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: K.text, fontSize: 44, fontWeight: 500}}>Sohbet</div>
      <div style={{flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: K.text, fontSize: 44, fontWeight: 500}}>Çalışma</div>
    </div>
    <Circle x={1007}><svg width="52" height="52" viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 016.9 13.4M12 20.5A8.5 8.5 0 015.1 7.1M3 9l2.1-1.9L7.3 9M21 15l-2.1 1.9-2.2-1.9" stroke="#ECECEC" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></Circle>
  </div>
);
export const HeaderChat: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, fontFamily: F}}>
    <Circle x={54}><MenuIcon /></Circle>
    <div style={{position: 'absolute', left: 851, top: 169, width: 273, height: 113, borderRadius: 57, background: K.pill, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 18px'}}>
      <svg width="50" height="50" viewBox="0 0 24 24"><path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M17.5 3.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z" stroke="#ECECEC" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <svg width="50" height="14" viewBox="0 0 25 7"><circle cx="3" cy="3.5" r="2.6" fill="#ECECEC" /><circle cx="12.5" cy="3.5" r="2.6" fill="#ECECEC" /><circle cx="22" cy="3.5" r="2.6" fill="#ECECEC" /></svg>
    </div>
  </div>
);

// ---------- küçük simgeler ----------
export const EvBadge: React.FC<{size: number; bg?: string}> = ({size, bg = 'transparent'}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size * 1.3, height: size, borderRadius: size * 0.22, background: bg, fontFamily: F, fontWeight: 700, fontSize: size * 0.62, color: '#BDBDBD', letterSpacing: '-0.02em', verticalAlign: 'middle'}}>Ev</span>
);
export const Plus = ({c = '#ECECEC', s = 54}) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>;
export const Mic = ({c = '#ECECEC', s = 54}) => <svg width={s} height={s} viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" stroke={c} strokeWidth="2" fill="none" /><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>;
export const Gauge = ({c = '#ECECEC', s = 54}) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M5 18a8.5 8.5 0 1114 0" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M12 14l3.5-4" stroke={c} strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="14" r="1.6" fill={c} /></svg>;
const SendCircle: React.FC<{mode: 'wave' | 'up'; press?: number}> = ({mode, press = 0}) => (
  <div style={{width: 84, height: 84, borderRadius: 42, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `brightness(${1 - 0.08 * press})`}}>
    {mode === 'up'
      ? <svg width="44" height="44" viewBox="0 0 24 24"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" stroke="#000" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      : <svg width="44" height="44" viewBox="0 0 24 24">{[4, 8, 12, 16, 20].map((x, i) => <path key={i} d={`M${x} ${12 - [3, 6, 8, 5, 2][i]}v${[6, 12, 16, 10, 4][i]}`} stroke="#000" strokeWidth="2.4" strokeLinecap="round" />)}</svg>}
  </div>
);

// ---------- giriş alanı ----------
/** Klavye kapalı: altta yuvarlak kapsül. */
export const ComposerIdle: React.FC<{y?: number}> = ({y = 2330}) => (
  <div style={{position: 'absolute', left: 102, top: y, width: 973, height: 125, borderRadius: 63, background: K.comp, border: `2px solid ${K.compBorder}`, display: 'flex', alignItems: 'center', fontFamily: F}}>
    <div style={{width: 120, display: 'flex', justifyContent: 'center'}}><Plus /></div>
    <div style={{flex: 1, fontSize: 51, color: '#8E8E8E'}}>ChatGPT’ye sor</div>
    <div style={{width: 110, display: 'flex', justifyContent: 'center'}}><Mic /></div>
    <div style={{marginRight: 20}}><SendCircle mode="wave" /></div>
  </div>
);
/** Klavye açık: büyük kutu (ref/chatgpt-gercek-4). */
export const ComposerOpen: React.FC<{top: number; height: number; children: React.ReactNode; hasText: boolean; press?: number}> = ({top, height, children, hasText, press}) => (
  <div style={{position: 'absolute', left: 33, top, width: 1111, height, borderRadius: 64, background: K.comp, border: `2px solid ${K.compBorder}`, fontFamily: F}}>
    <div style={{position: 'absolute', left: 42, right: 42, top: 52, fontSize: 51, lineHeight: '68px', color: K.text}}>{children}</div>
    <div style={{position: 'absolute', left: 50, bottom: 40}}><Plus /></div>
    <div style={{position: 'absolute', right: 286, bottom: 40}}><Gauge /></div>
    <div style={{position: 'absolute', right: 160, bottom: 40}}><Mic /></div>
    <div style={{position: 'absolute', right: 30, bottom: 26, opacity: 1}}><SendCircle mode={hasText ? 'up' : 'wave'} press={press} /></div>
  </div>
);

export const Caret: React.FC<{t: number}> = ({t}) => <span style={{display: 'inline-block', width: 4, height: 62, background: '#0A84FF', marginLeft: 2, verticalAlign: '-12px', opacity: Math.floor(t * 2) % 2 === 0 ? 1 : 0}} />;

/** Etiket: küçük "Ev" + kalın "Evlek" (gerçek ChatGPT bahsetme etiketi). */
export const Tag: React.FC<{size?: number}> = ({size = 51}) => (
  <span style={{whiteSpace: 'nowrap'}}><EvBadge size={size * 0.8} /><b style={{fontWeight: 600, marginLeft: size * 0.12}}>Evlek</b></span>
);

// ---------- iOS klavye (TR, koyu) ----------
export const KB_TOP = 1713;
const ROWS = ['qwertyuıopğü', 'asdfghjklşi', 'zxcvbnmöç'];
const keyRect = (ch: string) => {
  const r = ROWS.findIndex((row) => row.includes(ch.toLowerCase()));
  if (r < 0) return null;
  const i = ROWS[r].indexOf(ch.toLowerCase());
  const pitch = 97, w = 84, h = 120;
  const x0 = r === 0 ? 14 : r === 1 ? 62 : 207;
  const y = [1774, 1922, 2070][r];
  return {x: x0 + i * pitch, y, w, h};
};
export const Keyboard: React.FC<{y: number; press?: string | null; pressK?: number; num?: boolean}> = ({y, press, pressK = 0, num}) => {
  const k = press ? keyRect(press) : null;
  const Key: React.FC<{x: number; y: number; w: number; label?: React.ReactNode; dark?: boolean; size?: number}> = ({x, y: yy, w, label, dark, size = 58}) => (
    <div style={{position: 'absolute', left: x, top: yy, width: w, height: 120, borderRadius: 14, background: dark ? K.key2 : K.key, boxShadow: '0 3px 0 rgba(0,0,0,0.55)', color: '#fff', fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F}}>{label}</div>
  );
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, height: SCR_H - KB_TOP + 40, background: K.kb, borderTopLeftRadius: 44, borderTopRightRadius: 44, fontFamily: F}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-KB_TOP}px)`}}>
        {ROWS.map((row) => row.split('').map((c) => { const r = keyRect(c)!; return <Key key={c} x={r.x} y={r.y} w={r.w} label={num ? '' : c} />; }))}
        <Key x={14} y={2070} w={128} dark label={<svg width="52" height="52" viewBox="0 0 24 24"><path d="M12 4l8 8h-4.5v7h-7v-7H4z" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinejoin="round" /></svg>} />
        <Key x={1037} y={2070} w={128} dark label={<svg width="58" height="44" viewBox="0 0 28 20"><path d="M9 2h16a2 2 0 012 2v12a2 2 0 01-2 2H9l-7-8z" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinejoin="round" /><path d="M13 7l6 6M19 7l-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
        <Key x={14} y={2218} w={128} dark label="123" size={46} />
        <Key x={160} y={2218} w={128} dark label={<svg width="52" height="52" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" fill="none" /><circle cx="9" cy="10" r="1.2" fill="#fff" /><circle cx="15" cy="10" r="1.2" fill="#fff" /><path d="M8 14.5c1 1.6 2.4 2.3 4 2.3s3-.7 4-2.3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>} />
        <Key x={306} y={2218} w={566} label={<span style={{position: 'absolute', right: 26, bottom: 10, fontSize: 30, color: '#9a9a9a', letterSpacing: '0.04em'}}>TR EN</span>} />
        <Key x={888} y={2218} w={277} dark label={<svg width="58" height="46" viewBox="0 0 28 22"><path d="M24 3v8a3 3 0 01-3 3H5M9 9l-5 5 5 5" stroke="#fff" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <svg style={{position: 'absolute', left: 86, top: 2420}} width="62" height="62" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#bdbdbd" strokeWidth="1.6" fill="none" /><path d="M3 12h18M12 3c2.8 3.2 2.8 14.8 0 18M12 3c-2.8 3.2-2.8 14.8 0 18" stroke="#bdbdbd" strokeWidth="1.6" fill="none" /></svg>
        <div style={{position: 'absolute', left: 1036, top: 2420}}><Mic c="#bdbdbd" s={62} /></div>
        {/* basılan tuşun büyütülmüş önizlemesi */}
        {k && pressK > 0 && (
          <div style={{position: 'absolute', left: k.x - 22, top: k.y - 150, width: k.w + 44, height: 150 + k.h, opacity: pressK}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 158, borderRadius: 24, background: '#6E6E6E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 92}}>{press}</div>
            <div style={{position: 'absolute', left: 22, right: 22, top: 140, bottom: 0, background: '#6E6E6E', borderRadius: '0 0 14px 14px'}} />
          </div>
        )}
      </div>
    </div>
  );
};
const SCR_H = 2556;

// ---------- düşünme ----------
export const Thinking: React.FC<{t: number}> = ({t}) => {
  const ph = ((t % 1.2) / 1.2) * 160 - 30;
  return (
    <span style={{fontFamily: F, fontSize: 51, backgroundImage: `linear-gradient(90deg, #7A7A7A ${ph - 25}%, #E8E8E8 ${ph}%, #7A7A7A ${ph + 25}%)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>Düşünüyor</span>
  );
};
export const Chevron = () => <svg width="28" height="34" viewBox="0 0 12 16" style={{marginLeft: 12, verticalAlign: '-3px'}}><path d="M3 2l6 6-6 6" stroke="#9B9B9B" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>;
export const ExpandIcon = () => <svg width="36" height="36" viewBox="0 0 24 24" style={{marginLeft: 16, verticalAlign: '-4px'}}><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="#9B9B9B" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>;

/** Cevap altı işlem satırı (kopyala, seslendir, paylaş, daha fazla). */
export const ActionRow: React.FC<{o: number}> = ({o}) => (
  <div style={{display: 'flex', gap: 46, opacity: o, height: 60, alignItems: 'center'}}>
    <svg width="46" height="46" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5" stroke="#9B9B9B" strokeWidth="1.8" fill="none" /><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="#9B9B9B" strokeWidth="1.8" fill="none" /></svg>
    <svg width="46" height="46" viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11" stroke="#9B9B9B" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    <svg width="46" height="46" viewBox="0 0 24 24"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7" stroke="#9B9B9B" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    <svg width="46" height="12" viewBox="0 0 24 6"><circle cx="3" cy="3" r="2.2" fill="#9B9B9B" /><circle cx="12" cy="3" r="2.2" fill="#9B9B9B" /><circle cx="21" cy="3" r="2.2" fill="#9B9B9B" /></svg>
  </div>
);
