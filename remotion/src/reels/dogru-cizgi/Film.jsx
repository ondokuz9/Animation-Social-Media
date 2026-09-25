import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SANS, MONO } from '../../brand/tokens.js';
import { W, H, LOCKUP, lockupScale, WORDMARK_PATHS, WORDMARK_VIEWBOX, LINE_Y } from './engine/shapes.js';
import { stateAt, FRAMES, T, isFast, HERO_Y, CORNER } from './engine/timeline.js';
import { drawFrame } from './engine/render.js';
import { ease, clamp } from './engine/math.js';

export const DOGRU_FRAMES = FRAMES;

const INKT = (a) => `rgba(236,244,252,${a})`;
const GOLD = (a) => `rgba(201,161,87,${a})`;
const OK = (a) => `rgba(96,206,150,${a})`;
const GLOW = '0 0 18px rgba(110,160,255,0.35)';

/* ── The lockup: the name stands on its line. ─────────────────────────────── */
const Lockup = ({ rise, slogan, url }) => {
  const w = LOCKUP.width, h = WORDMARK_VIEWBOX[3] * lockupScale;
  const top = LOCKUP.cy - h / 2;
  const box = LINE_Y - 14;             // the name disappears just above the line
  return (
    <>
      <div style={{ position: 'absolute', left: 0, width: W, top: box - 260, height: 260, overflow: 'hidden' }}>
        <svg viewBox={WORDMARK_VIEWBOX.join(' ')} width={w} height={h}
             style={{ position: 'absolute', left: LOCKUP.cx - w / 2, top: top - (box - 260), transform: `translateY(${(1 - rise) * 250}px)` }}>
          {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill="#FFFFFF" />)}
        </svg>
      </div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LINE_Y + 38 + (1 - slogan) * 14, textAlign: 'center',
        fontFamily: SANS, fontWeight: 500, fontSize: 50, letterSpacing: '-0.01em', color: INKT(slogan),
      }}>Kıbrıs'ta doğru ev.</div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LINE_Y + 116 + (1 - url) * 10, textAlign: 'center',
        fontFamily: MONO, fontWeight: 500, fontSize: 34, letterSpacing: '0.2em', color: GOLD(url),
      }}>EVLEK.APP</div>
    </>
  );
};

/* ── Words that stand on a line and rise out of it, letter by letter. ────── */
const Rising = ({ text, rise, sink, size, weight, tracking, y, stagger = 2.6 }) => {
  const chars = [...text];
  const n = chars.length;
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: y - size * 1.25, height: size * 1.25 - 12, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      {chars.map((ch, i) => {
        // each letter has its own beat in and out
        const pi = ease.settle(clamp(rise * (1 + (n - 1) * stagger / 22) - (i * stagger) / 22));
        const po = ease.launch(clamp(sink * (1 + (n - 1) * stagger / 22) - ((n - 1 - i) * stagger) / 22));
        const dy = (1 - pi) * size * 1.1 + po * size * 1.1;
        return (
          <span key={i} style={{
            display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${dy}px)`,
            fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: tracking,
            color: INKT(0.98), textShadow: GLOW, paddingBottom: size * 0.08,
          }}>{ch}</span>
        );
      })}
    </div>
  );
};

const Corner = ({ c }) => (
  <>
    <div style={{ position: 'absolute', left: CORNER.x, top: CORNER.y - 21 + (1 - c.a) * 10, opacity: c.a, fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.1em', color: GOLD(0.95) }}>{c.n}</div>
    <div style={{ position: 'absolute', left: CORNER.x + 130, top: CORNER.y - 26 + (1 - c.a) * 14, opacity: c.a, fontFamily: SANS, fontWeight: 600, fontSize: 42, letterSpacing: '0.16em', color: INKT(0.97), textShadow: GLOW }}>{c.t}</div>
  </>
);

/* The search field. Drawn, not photographed: a pill, a lens, a query. */
const QUERY = 'Girne · deniz manzarası';
const Pill = ({ p }) => {
  const pw = 700, ph = 96, x = (W - pw) / 2, y = 1440;
  const per = 2 * (pw + ph);
  const n = Math.round(QUERY.length * p.typed);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: pw, height: ph, opacity: p.a }}>
      <svg width={pw} height={ph} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 0 10px rgba(110,160,255,0.55))' }}>
        <rect x={1.5} y={1.5} width={pw - 3} height={ph - 3} rx={(ph - 3) / 2} fill="rgba(6,20,38,0.55)" stroke={INKT(0.9)} strokeWidth={2.2}
              strokeDasharray={per} strokeDashoffset={per * (1 - p.draw)} />
        <circle cx={52} cy={ph / 2 - 3} r={14} fill="none" stroke={INKT(0.9 * p.draw)} strokeWidth={2.4} />
        <line x1={62} y1={ph / 2 + 7} x2={72} y2={ph / 2 + 17} stroke={INKT(0.9 * p.draw)} strokeWidth={2.4} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: 96, top: 0, height: ph, display: 'flex', alignItems: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 38, color: INKT(0.96), whiteSpace: 'pre' }}>
        {QUERY.slice(0, n)}
        <span style={{ display: 'inline-block', width: 2.5, height: 42, marginLeft: 4, background: p.caret ? GOLD(0.95) : 'transparent' }} />
      </div>
    </div>
  );
};

/* The chosen listing, named above its pin. */
const Popover = ({ p }) => {
  const cw = 470, ch = 132, x = p.x - cw / 2, y = p.y - 108 - ch;
  return (
    <div style={{ position: 'absolute', left: x, top: y + (1 - p.a) * 16, width: cw, height: ch, opacity: p.a }}>
      <svg width={cw} height={ch + 18} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 0 12px rgba(110,160,255,0.5))' }}>
        <path d={`M 18 1.5 H ${cw - 18} A 16.5 16.5 0 0 1 ${cw - 1.5} 18 V ${ch - 18} A 16.5 16.5 0 0 1 ${cw - 18} ${ch - 1.5} H ${cw / 2 + 14} L ${cw / 2} ${ch + 14} L ${cw / 2 - 14} ${ch - 1.5} H 18 A 16.5 16.5 0 0 1 1.5 ${ch - 18} V 18 A 16.5 16.5 0 0 1 18 1.5 Z`}
              fill="rgba(6,20,38,0.72)" stroke={INKT(0.9)} strokeWidth={2} />
        {/* a house, drawn in the photo well */}
        <rect x={16} y={16} width={100} height={ch - 32} rx={8} fill="none" stroke={INKT(0.55)} strokeWidth={1.6} />
        <path d={`M 36 ${ch - 34} V ${ch / 2 + 2} L 66 ${ch / 2 - 22} L 96 ${ch / 2 + 2} V ${ch - 34} Z M 58 ${ch - 34} V ${ch / 2 + 16} H 74 V ${ch - 34}`} fill="none" stroke={INKT(0.85)} strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 136, top: 24, fontFamily: SANS, fontWeight: 600, fontSize: 29, color: INKT(0.97), whiteSpace: 'nowrap' }}>Deniz manzaralı villa</div>
      <div style={{ position: 'absolute', left: 136, top: 72, display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.1em', color: OK(0.95) }}>
        <svg width={22} height={22}><path d="M 3 12 L 9 18 L 19 5" fill="none" stroke={OK(0.95)} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
        ONAYLI EMLAKÇI
      </div>
    </div>
  );
};

export const DogruCizgi = () => {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  const s = useMemo(() => stateAt(frame), [frame]);
  const still = frame < T.hold || frame >= FRAMES - 1;

  useLayoutEffect(() => {
    drawFrame(ref.current.getContext('2d'), stateAt, frame, still, s, isFast(frame));
  }, [s, frame, still]);

  const pinLabels = s.pins.filter((p) => p.label > 0.01).map((p) => { const r = s.project(p.p); return r ? { ...p, x: r[0], y: r[1] } : null; }).filter(Boolean);
  const tags = s.tags.map((t) => { const r = s.project(t.p); return r ? { ...t, x: r[0], y: r[1] } : null; }).filter(Boolean);
  // labels that would sit on top of each other are nudged apart
  const LABEL_DY = { 'GÜZELYURT': -86, LEFKE: 22, 'LEFKOŞA': 22, 'GAZİMAĞUSA': 22, 'İSKELE': -86 };

  return (
    <AbsoluteFill style={{ background: '#0A2540' }}>
      <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', inset: 0 }} />
      {s.scrim > 0 && (
        <div style={{ position: 'absolute', left: 0, top: HERO_Y - 420, width: W, height: 640, opacity: s.scrim, background: 'linear-gradient(180deg, rgba(3,12,24,0) 0%, rgba(3,12,24,0.62) 45%, rgba(3,12,24,0.62) 70%, rgba(3,12,24,0) 100%)' }} />
      )}
      {pinLabels.map((p) => (
        <div key={p.name} style={{
          position: 'absolute', left: p.x, top: p.y + (p.isG ? -112 - 30 * p.lift : LABEL_DY[p.name] ?? 22), transform: 'translateX(-50%)',
          fontFamily: MONO, fontWeight: 500, fontSize: p.isG ? 34 : 27, letterSpacing: '0.14em',
          color: p.isG ? GOLD(p.label) : INKT(p.label * 0.8), whiteSpace: 'nowrap',
        }}>{p.name}</div>
      ))}
      {tags.map((t) => (
        <div key={t.name} style={{ position: 'absolute', left: t.x, top: t.y, transform: 'translate(-50%, -100%)', opacity: t.a, textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '0.22em', color: INKT(0.92), textShadow: GLOW }}>{t.name}</div>
          <div style={{ width: 1.5, height: 30, margin: '8px auto 0', background: INKT(0.5) }} />
          <div style={{ width: 7, height: 7, borderRadius: 4, margin: '0 auto', background: INKT(0.8) }} />
        </div>
      ))}
      {s.note && (
        <div style={{ position: 'absolute', left: s.note.x, top: s.note.y + 26, transform: 'translateX(-50%)', opacity: s.note.a, fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '0.16em', color: GOLD(0.95), whiteSpace: 'nowrap' }}>{s.note.text}</div>
      )}
      {s.popover && <Popover p={s.popover} />}
      {s.pill && <Pill p={s.pill} />}
      {s.copy.map((c) => <Rising key={c.t} text={c.t} rise={c.rise} sink={c.sink} size={76} weight={500} tracking="-0.01em" y={HERO_Y} stagger={1.1} />)}
      {s.heroes.map((h) => <Rising key={h.t} text={h.t} rise={h.rise} sink={h.sink} size={168} weight={600} tracking="0.08em" y={HERO_Y} />)}
      {s.corner && <Corner c={s.corner} />}
      <Lockup rise={s.wordRise} slogan={s.slogan} url={s.url} />
    </AbsoluteFill>
  );
};
