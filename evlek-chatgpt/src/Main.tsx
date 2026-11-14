import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOGO_PATHS, LOGO_VIEWBOX, MARK_VIEWBOX} from './logo';

// ---------- design tokens ----------
const NAVY = '#0A2540';
const CORAL = '#B84E3B';
const GREY = '#5A6B7D';
const WARM = '#FAF8F2';
const LINE = '#E8ECF1';
const FONT = 'Inter, system-ui, sans-serif';

// ---------- timeline (30 fps, 120 BPM: 1 beat = 15 frames, 1 bar = 60) ----------
const T = {
  phoneIn: [54, 96],
  type1: [108, 166],
  send1: 178,
  search1: [184, 222],
  widget1: 222,
  scroll1: [258, 292],
  tapCard: 298,
  photos: [304, 366],
  back: [360, 386],
  type2: [388, 414],
  send2: 420,
  search2: [424, 446],
  widget2: 446,
  tapOpen: 492,
  sheet: [496, 516],
  tapWa: 552,
  end: 596,
};

const Q1 = 'Girne’de 200 bin £ altı satılık 2+1 daire göster.';
const Q2 = 'Deniz manzaralı olsun.';

type Card = {img: string; price: string; place: string; meta: string; office: string};
const CARDS1: Card[] = [
  {img: 'img/EVL-101431_00.jpg', price: '£170.000', place: 'Alsancak', meta: '2+1 · 90 m² brüt', office: '[ofis]'},
  {img: 'img/EVL-100086_01.jpg', price: '£155.000', place: 'Alsancak', meta: '2+1 · 2 banyo · Havuz', office: '[ofis] Gayrimenkul'},
  {img: 'img/EVL-100464_00.jpg', price: '£190.000', place: 'Girne Merkez', meta: '2+1 · Eşyalı', office: '[ofis] Gayrimenkul'},
  {img: 'img/EVL-101433_00.jpg', price: '£127.000', place: 'Lapta', meta: '2+1 · 104 m² brüt', office: '[ofis]'},
];
const CARDS2: Card[] = [
  {img: 'img/EVL-101438_00.jpg', price: '£199.000', place: 'Lapta', meta: '2+1 · 100 m² brüt', office: '[ofis]'},
  {img: 'img/EVL-101431_00.jpg', price: '£170.000', place: 'Alsancak', meta: '2+1 · 90 m² brüt', office: '[ofis]'},
  {img: 'img/EVL-101327_00.jpg', price: '£155.000', place: 'Yukarı Girne', meta: '2+1 · 100 m² brüt', office: '[ofis]'},
  {img: 'img/EVL-101433_00.jpg', price: '£127.000', place: 'Lapta', meta: '2+1 · 104 m² brüt', office: '[ofis]'},
];

// ---------- helpers ----------
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, a: number, b: number, e = EASE) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const track = (f: number, pts: [number, number][]) => {
  if (f <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [f0, v0] = pts[i];
    const [f1, v1] = pts[i + 1];
    if (f <= f1) return interpolate(f, [f0, f1], [v0, v1], {...clamp, easing: INOUT});
  }
  return pts[pts.length - 1][1];
};

const Logo: React.FC<{width: number; color?: string}> = ({width, color = NAVY}) => (
  <svg viewBox={LOGO_VIEWBOX} width={width} height={(width * 165) / 530}>
    {LOGO_PATHS.map((d, i) => (
      <path key={i} d={d} fill={color} />
    ))}
  </svg>
);
const Mark: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.28, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg viewBox={MARK_VIEWBOX} width={size * 0.5} height={size * 0.62}>
      <path d={LOGO_PATHS[0]} fill="#fff" />
    </svg>
  </div>
);

const Tap: React.FC<{f: number; at: number; x: number; y: number}> = ({f, at, x, y}) => {
  const p = (f - at) / 14;
  if (p < -0.4 || p > 1) return null;
  const press = p < 0 ? 1 + p / 0.4 : 1;
  const r = 18 + Math.max(0, p) * 26;
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: `rgba(10,37,64,${0.18 * press * (1 - Math.max(0, p))})`, border: `2px solid rgba(255,255,255,${0.9 * (1 - Math.max(0, p))})`, boxShadow: '0 2px 10px rgba(10,37,64,0.25)', zIndex: 50}} />
  );
};

// ---------- phone screen (device px 412 x 892) ----------
const SW = 412;
const SH = 892;

const Shimmer: React.FC<{f: number; text: string}> = ({f, text}) => {
  const x = ((f * 6) % 260) - 60;
  return (
    <span style={{position: 'relative', color: '#8a94a3', fontWeight: 500}}>
      {text}
      <span style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent ${x - 40}px, rgba(255,255,255,0.95) ${x}px, transparent ${x + 40}px)`, mixBlendMode: 'screen'}} />
    </span>
  );
};

const CardView: React.FC<{c: Card; f: number; delay: number; start: number}> = ({c, f, delay, start}) => {
  const a = ramp(f, start + delay, start + delay + 16);
  return (
    <div style={{width: 250, flex: '0 0 250px', borderRadius: 20, overflow: 'hidden', background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 6px 18px rgba(10,37,64,0.10)', opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${0.94 + 0.06 * a})`}}>
      <div style={{height: 176, overflow: 'hidden'}}>
        <Img src={staticFile(c.img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 - 0.06 * a})`}} />
      </div>
      <div style={{padding: '12px 14px 14px'}}>
        <div style={{fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: -0.4}}>{c.price}</div>
        <div style={{fontSize: 14, fontWeight: 600, color: NAVY, marginTop: 2}}>{c.place} · {c.meta}</div>
        <div style={{fontSize: 12, color: GREY, marginTop: 3}}>{c.office}</div>
      </div>
    </div>
  );
};

const Chip: React.FC<{t: string; on?: boolean; pop?: number}> = ({t, on, pop = 1}) => (
  <div style={{padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', color: on ? '#fff' : NAVY, background: on ? NAVY : '#fff', border: `1px solid ${on ? NAVY : '#D5DCE5'}`, transform: `scale(${pop})`}}>{t}</div>
);

const Widget: React.FC<{f: number; start: number; cards: Card[]; scrollX: number; extraChip?: boolean}> = ({f, start, cards, scrollX, extraChip}) => {
  const a = ramp(f, start, start + 14);
  const pop = extraChip ? interpolate(f, [start + 4, start + 12, start + 20], [0.6, 1.12, 1], clamp) : 1;
  return (
    <div style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
      <div style={{display: 'flex', gap: 6, flexWrap: 'nowrap', overflow: 'hidden', marginBottom: 12}}>
        {extraChip ? <Chip t="✓ Deniz manzarası" on pop={pop} /> : null}
        <Chip t="Girne" />
        <Chip t="Satılık" />
        <Chip t="2+1" />
        <Chip t="≤ £200.000" />
      </div>
      <div style={{display: 'flex', gap: 12, transform: `translateX(${scrollX}px)`}}>
        {cards.map((c, i) => (
          <CardView key={i} c={c} f={f} delay={i * 4} start={start + 4} />
        ))}
      </div>
    </div>
  );
};

const ToolRow: React.FC<{f: number; s: number; done: number; label: string}> = ({f, s, done, label}) => {
  const a = ramp(f, s, s + 8);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: a, margin: '18px 0 10px', fontSize: 15}}>
      <Mark size={24} />
      {f < done ? <Shimmer f={f} text="Evlek’te aranıyor…" /> : <span style={{fontWeight: 600, color: NAVY}}>Evlek</span>}
      {f >= done ? <span style={{color: GREY}}>· {label}</span> : null}
    </div>
  );
};

const Bubble: React.FC<{f: number; at: number; text: string}> = ({f, at, text}) => {
  const a = ramp(f, at, at + 10);
  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>
      <div style={{maxWidth: 300, background: '#F0F1F3', borderRadius: 22, padding: '11px 16px', fontSize: 16, lineHeight: '22px', color: '#111'}}>{text}</div>
    </div>
  );
};

const Screen: React.FC<{f: number}> = ({f}) => {
  // composer text
  let comp = '';
  if (f >= T.type1[0] && f < T.send1) comp = Q1.slice(0, Math.round(interpolate(f, T.type1, [0, Q1.length], clamp)));
  if (f >= T.type2[0] && f < T.send2) comp = Q2.slice(0, Math.round(interpolate(f, T.type2, [0, Q2.length], clamp)));
  const caret = Math.floor(f / 8) % 2 === 0;
  const typing = (f >= T.type1[0] && f < T.send1) || (f >= T.type2[0] && f < T.send2);
  const sendOn = comp.length > 0;
  const scroll1 = interpolate(f, T.scroll1, [0, -262], {...clamp, easing: INOUT});
  const chatScroll = interpolate(f, [T.send2, T.send2 + 22], [0, -478], {...clamp, easing: INOUT});
  const sheetY = interpolate(f, T.sheet, [SH, 56], {...clamp, easing: EASE});
  const toast = ramp(f, T.tapWa + 6, T.tapWa + 16);

  return (
    <div style={{position: 'absolute', inset: 0, background: '#fff', fontFamily: FONT, color: '#111', overflow: 'hidden'}}>
      {/* status bar */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 30px 0', fontSize: 15, fontWeight: 600, zIndex: 5, background: '#fff'}}>
        <span>9:41</span>
        <span style={{display: 'flex', gap: 5, alignItems: 'center'}}>
          <span style={{width: 17, height: 10, display: 'inline-flex', gap: 2, alignItems: 'flex-end'}}>{[4, 6, 8, 10].map((h) => <span key={h} style={{width: 3, height: h, background: '#111', borderRadius: 1}} />)}</span>
          <span style={{width: 24, height: 11, border: '1.5px solid #111', borderRadius: 3, padding: 1}}><span style={{display: 'block', width: '100%', height: '100%', background: '#111', borderRadius: 1}} /></span>
        </span>
      </div>
      {/* header */}
      <div style={{position: 'absolute', top: 46, left: 0, right: 0, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', zIndex: 5, background: '#fff'}}>
        <div style={{width: 22}}><div style={{height: 2, background: '#111', borderRadius: 2, marginBottom: 6}} /><div style={{height: 2, width: 14, background: '#111', borderRadius: 2}} /></div>
        <div style={{fontSize: 17, fontWeight: 600}}>ChatGPT <span style={{color: '#999', fontSize: 13}}>⌄</span></div>
        <div style={{width: 20, height: 20, border: '2px solid #111', borderRadius: 6}} />
      </div>
      {/* messages */}
      <div style={{position: 'absolute', top: 108, left: 16, right: 16, transform: `translateY(${chatScroll}px)`}}>
        {f >= T.send1 ? <Bubble f={f} at={T.send1} text={Q1} /> : null}
        {f >= T.search1[0] ? <ToolRow f={f} s={T.search1[0]} done={T.widget1} label="Girne · satılık · 2+1" /> : null}
        {f >= T.widget1 ? (
          <div style={{fontSize: 16, lineHeight: '23px', marginBottom: 12, opacity: ramp(f, T.widget1, T.widget1 + 10)}}>Girne’de 200 bin £ altındaki satılık 2+1 daireler:</div>
        ) : null}
        {f >= T.widget1 ? <Widget f={f} start={T.widget1 + 6} cards={CARDS1} scrollX={scroll1} /> : <div style={{height: 0}} />}
        <div style={{height: 26}} />
        {f >= T.send2 ? <Bubble f={f} at={T.send2} text={Q2} /> : null}
        {f >= T.search2[0] ? <ToolRow f={f} s={T.search2[0]} done={T.widget2} label="deniz manzarası eklendi" /> : null}
        {f >= T.widget2 ? (
          <div style={{fontSize: 16, lineHeight: '23px', marginBottom: 12, opacity: ramp(f, T.widget2, T.widget2 + 10)}}>Deniz manzaralı olanlar:</div>
        ) : null}
        {f >= T.widget2 ? <Widget f={f} start={T.widget2 + 4} cards={CARDS2} scrollX={0} extraChip /> : null}
      </div>
      {/* composer */}
      <div style={{position: 'absolute', left: 12, right: 12, bottom: 22, borderRadius: 28, background: '#fff', border: '1px solid #E3E5E8', boxShadow: '0 4px 18px rgba(0,0,0,0.06)', padding: '12px 12px 10px 14px', zIndex: 6}}>
        <div style={{fontSize: 17, lineHeight: '23px', minHeight: 23, color: comp ? '#111' : '#9aa0a6', marginBottom: 10}}>
          {comp || (typing ? '' : 'Sorunuzu yazın')}
          {typing && caret ? <span style={{display: 'inline-block', width: 2, height: 20, background: '#111', verticalAlign: -3, marginLeft: 1}} /> : null}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <div style={{width: 32, height: 32, borderRadius: 16, border: '1px solid #E3E5E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#333'}}>+</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 5px', borderRadius: 999, background: '#EEF2F7', fontSize: 14, fontWeight: 600, color: NAVY}}>
              <Mark size={22} /> Evlek
            </div>
          </div>
          <div style={{width: 36, height: 36, borderRadius: 18, background: sendOn ? '#111' : '#D9DCE0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></svg>
          </div>
        </div>
      </div>
      {/* home indicator */}
      <div style={{position: 'absolute', bottom: 7, left: '50%', width: 134, height: 5, marginLeft: -67, borderRadius: 3, background: '#111', zIndex: 20}} />

      {/* taps */}
      <Tap f={f} at={T.send1 - 2} x={366} y={SH - 50} />
      <Tap f={f} at={T.tapCard} x={141} y={414} />
      <Tap f={f} at={T.send2 - 2} x={366} y={SH - 50} />
      <Tap f={f} at={T.tapOpen} x={140} y={470} />

      {/* evlek.app sheet */}
      {f >= T.sheet[0] ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: sheetY, height: SH - 56, background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.18)', zIndex: 30, overflow: 'hidden'}}>
          <div style={{height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${LINE}`}}>
            <span style={{fontSize: 22, color: '#333'}}>×</span>
            <span style={{fontSize: 14, color: '#333', background: '#F1F3F5', padding: '6px 14px', borderRadius: 10}}>🔒︎ evlek.app</span>
            <span style={{width: 18}} />
          </div>
          <div style={{height: 250, overflow: 'hidden'}}>
            <Img src={staticFile('img/EVL-101438_00.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 - 0.06 * ramp(f, T.sheet[0], T.sheet[1] + 30)})`}} />
          </div>
          <div style={{padding: '16px 18px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}><Logo width={64} /></div>
            <div style={{fontSize: 28, fontWeight: 800, color: NAVY, letterSpacing: -0.5}}>£199.000</div>
            <div style={{fontSize: 17, fontWeight: 600, color: NAVY, marginTop: 4}}>Lapta’da Ortak Havuzlu 2+1 Daire</div>
            <div style={{fontSize: 14, color: GREY, marginTop: 6}}>Lapta, Girne · 2+1 · 100 m² brüt · Deniz manzarası</div>
            <div style={{height: 1, background: LINE, margin: '16px 0'}} />
            <div style={{fontSize: 13, color: GREY}}>İlan veren</div>
            <div style={{fontSize: 16, fontWeight: 600, color: NAVY, marginTop: 2}}>[ofis]</div>
            <div style={{display: 'flex', gap: 10, marginTop: 18}}>
              <div style={{flex: 1, height: 50, borderRadius: 14, background: '#1FAF5A', color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transform: `scale(${f >= T.tapWa - 3 && f < T.tapWa + 4 ? 0.96 : 1})`}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z" /></svg>
                WhatsApp’tan yaz
              </div>
              <div style={{width: 92, height: 50, borderRadius: 14, border: `1.5px solid ${NAVY}`, color: NAVY, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Ara</div>
            </div>
          </div>
          <Tap f={f} at={T.tapWa} x={150} y={250 + 52 + 16 + 245} />
          {toast > 0 ? (
            <div style={{position: 'absolute', left: 20, right: 20, bottom: 40, padding: '14px 16px', borderRadius: 16, background: NAVY, color: '#fff', fontSize: 15, fontWeight: 600, opacity: toast, transform: `translateY(${(1 - toast) * 20}px)`, display: 'flex', gap: 10, alignItems: 'center'}}>
              <span style={{width: 8, height: 8, borderRadius: 4, background: '#1FAF5A'}} /> Ofisle WhatsApp yazışması açılıyor
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

// ---------- phone with camera ----------
const PHONE_SCALE = 1.62;
const PW = (SW + 24) * PHONE_SCALE;
const PH = (SH + 24) * PHONE_SCALE;

const Phone: React.FC<{f: number}> = ({f}) => {
  const s = track(f, [[54, 0.92], [96, 1], [112, 1.0], [140, 1.42], [176, 1.42], [196, 1.25], [222, 1.25], [250, 1.2], [292, 1.2], [300, 1.3], [314, 3.6], [359, 3.6], [360, 1.62], [384, 1.4], [414, 1.4], [430, 1.08], [452, 1.2], [486, 1.2], [500, 1.04], [590, 1.06]]);
  const ty = track(f, [[54, 1500], [96, 40], [112, 40], [140, -760], [176, -760], [196, 420], [222, 420], [250, 120], [292, 120], [300, 110], [314, 107], [359, 107], [360, -860], [384, -740], [414, -740], [430, 60], [452, 40], [486, 40], [500, 40], [590, 40], [620, 1800]]);
  const tx = track(f, [[250, 0], [292, 0], [300, 60], [314, 379], [359, 379], [360, 0]]);
  const rx = track(f, [[54, 22], [96, 6], [140, 0], [196, 4], [250, 2], [430, 3], [590, 4], [620, 28]]);
  const ry = track(f, [[54, -14], [96, -6], [140, 0], [196, -5], [292, 3], [384, 0], [452, -4], [500, 4], [590, -3]]);
  const op = interpolate(f, [52, 62, 600, 618], [0, 1, 1, 0], clamp);
  const dpr = 1;
  return (
    <div style={{position: 'absolute', left: 540 - PW / 2, top: 1080 - PH / 2, width: PW, height: PH, opacity: op, transform: `perspective(2600px) translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s * dpr})`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 66 * PHONE_SCALE, background: '#0d0f12', boxShadow: '0 60px 120px rgba(10,37,64,0.35), 0 20px 40px rgba(10,37,64,0.2), inset 0 0 0 2px #2a2e35'}} />
      <div style={{position: 'absolute', left: 12 * PHONE_SCALE, top: 12 * PHONE_SCALE, width: SW, height: SH, borderRadius: 54, overflow: 'hidden', transform: `scale(${PHONE_SCALE})`, transformOrigin: '0 0'}}>
        <Screen f={f} />
      </div>
    </div>
  );
};

// ---------- overlays ----------
const Caption: React.FC<{f: number; a: number; b: number; text: string; dark?: boolean}> = ({f, a, b, text, dark}) => {
  if (f < a - 2 || f > b + 12) return null;
  const words = text.split(' ');
  const out = ramp(f, b, b + 10);
  return (
    <div style={{position: 'absolute', top: 120, left: 50, right: 50, zIndex: 40, fontFamily: FONT, fontSize: 74, lineHeight: '84px', fontWeight: 800, letterSpacing: -2.2, color: dark ? '#fff' : NAVY, opacity: 1 - out, transform: `translateY(${-out * 20}px)`, padding: '26px 30px 30px', borderRadius: 40, background: 'rgba(250,248,242,0.78)', backdropFilter: 'blur(24px)', boxShadow: '0 10px 40px rgba(10,37,64,0.08)'}}>
      {words.map((w, i) => {
        const p = ramp(f, a + i * 4, a + i * 4 + 12);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: 20, opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 18}px)`}}>{w}</span>
        );
      })}
    </div>
  );
};

const PhotoBurst: React.FC<{f: number}> = ({f}) => {
  const [a, b] = T.photos;
  if (f < a || f > b + 14) return null;
  const inA = ramp(f, a, a + 12);
  const outA = ramp(f, b - 6, b, INOUT);
  const shots = [
    {src: 'img/EVL-100086_01.jpg', from: a, pos: '50% 60%'},
    {src: 'img/EVL-100086_00.jpg', from: a + 22, pos: '40% 55%'},
    {src: 'img/EVL-100086_01.jpg', from: a + 40, pos: '70% 75%', zoom: 1.6},
  ];
  const cur = [...shots].reverse().find((s) => f >= s.from) || shots[0];
  const local = f - cur.from;
  const z = (cur.zoom || 1.12) - local * 0.004;
  const info = ramp(f, a + 10, a + 22);
  return (
    <AbsoluteFill style={{opacity: inA * (1 - outA), zIndex: 35}}>
      <Img src={staticFile(cur.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: cur.pos, transform: `scale(${z + (1 - inA) * 0.3})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,37,64,0) 45%, rgba(10,37,64,0.75) 100%)'}} />
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 200, fontFamily: FONT, color: '#fff', opacity: info, transform: `translateY(${(1 - info) * 30}px)`}}>
        <div style={{fontSize: 120, fontWeight: 800, letterSpacing: -4}}>£155.000</div>
        <div style={{fontSize: 46, fontWeight: 600, marginTop: 6}}>Alsancak · 2+1 · Havuz</div>
        <div style={{fontSize: 30, opacity: 0.85, marginTop: 10}}>[ofis]</div>
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC<{f: number}> = ({f}) => {
  if (f > 90) return null;
  const out = ramp(f, 50, 78, INOUT);
  const logo = ramp(f, 6, 22);
  const line = ramp(f, 16, 32);
  return (
    <AbsoluteFill style={{zIndex: 45, opacity: 1 - out}}>
      <Img src={staticFile('img/EVL-100086_01.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '45% 50%', transform: `scale(${1.22 - f * 0.002 + out * 0.1})`, filter: `blur(${out * 20}px)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,37,64,0.55) 0%, rgba(10,37,64,0.15) 45%, rgba(10,37,64,0.6) 100%)'}} />
      <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT}}>
        <div style={{opacity: logo, filter: `blur(${(1 - logo) * 16}px)`, transform: `scale(${0.9 + 0.1 * logo})`}}>
          <Logo width={600} color="#fff" />
        </div>
        <div style={{marginTop: 40, fontSize: 92, fontWeight: 800, color: '#fff', letterSpacing: -2.5, opacity: line, transform: `translateY(${(1 - line) * 26}px)`, filter: `blur(${(1 - line) * 10}px)`}}>artık ChatGPT’de.</div>
      </div>
    </AbsoluteFill>
  );
};

const Background: React.FC<{f: number}> = ({f}) => {
  const sweep = interpolate(f, [222, 262], [-60, 160], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 30%, #FFFFFF 0%, ${WARM} 55%, #F1E8D8 100%)`}}>
      <Img src={staticFile('img/EVL-100086_01.jpg')} style={{position: 'absolute', inset: -80, width: 'calc(100% + 160px)', height: 'calc(100% + 160px)', objectFit: 'cover', filter: 'blur(60px) saturate(1.2)', opacity: 0.22, transform: `scale(${1.1 + f * 0.0002})`}} />
      <AbsoluteFill style={{background: `linear-gradient(115deg, transparent ${sweep - 12}%, rgba(255,255,255,0.55) ${sweep}%, transparent ${sweep + 12}%)`}} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  if (f < T.end) return null;
  const a = ramp(f, T.end, T.end + 18);
  const img = ramp(f, T.end + 4, T.end + 30);
  const logo = ramp(f, T.end + 16, T.end + 32);
  const l1 = ramp(f, T.end + 24, T.end + 40);
  const l2 = ramp(f, T.end + 34, T.end + 50);
  const coral = ramp(f, T.end + 30, T.end + 48);
  const sweep = interpolate(f, [T.end + 36, T.end + 70], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{background: WARM, opacity: a, zIndex: 60, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 120, right: 120, top: 150, height: 760, borderRadius: '420px 420px 36px 36px', overflow: 'hidden', opacity: img, transform: `translateY(${(1 - img) * 40}px)`, boxShadow: '0 30px 80px rgba(10,37,64,0.18)'}}>
        <Img src={staticFile('img/EVL-100086_01.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 50%', transform: `scale(${1.15 - img * 0.08 - (f - T.end) * 0.0006})`}} />
        <AbsoluteFill style={{background: `linear-gradient(115deg, transparent ${sweep - 10}%, rgba(255,255,255,0.35) ${sweep}%, transparent ${sweep + 10}%)`}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 990, opacity: logo, transform: `translateY(${(1 - logo) * 20}px)`}}>
        <Logo width={520} />
      </div>
      <div style={{position: 'absolute', left: 124, top: 1190, fontSize: 84, fontWeight: 800, color: NAVY, letterSpacing: -2.4, opacity: l1, transform: `translateY(${(1 - l1) * 20}px)`}}>artık ChatGPT’de.</div>
      <div style={{position: 'absolute', left: 128, top: 1312, width: 150 * coral, height: 8, borderRadius: 4, background: CORAL}} />
      <div style={{position: 'absolute', left: 126, right: 120, top: 1360, fontSize: 38, lineHeight: '52px', color: GREY, opacity: l2}}>ChatGPT’de Eklentiler bölümünde Evlek’i arayın.</div>
      <div style={{position: 'absolute', left: 126, top: 1500, fontSize: 52, fontWeight: 700, color: NAVY, opacity: l2}}>evlek.app</div>
      <div style={{position: 'absolute', left: 126, right: 120, bottom: 70, fontSize: 21, lineHeight: '30px', color: '#8A96A5', opacity: l2}}>
        Arayüz temsilidir; ilanlar ve fiyatlar Evlek’teki gerçek ilanlardır (13 Kasım 2026). ChatGPT, OpenAI’ın ticari markasıdır.
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: WARM}}>
      <Background f={f} />
      <Phone f={f} />
      <Caption f={f} a={104} b={172} text="Kendi cümlenizle sorun." />
      <Caption f={f} a={228} b={292} text="Güncel ilanlar, fotoğraflarıyla." />
      <Caption f={f} a={432} b={486} text="Cümleniz filtreye dönüşür." />
      <Caption f={f} a={510} b={590} text="Ofise doğrudan yazın." />
      <PhotoBurst f={f} />
      <Hook f={f} />
      <EndCard f={f} />
    </AbsoluteFill>
  );
};
