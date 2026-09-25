import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SANS, MONO } from '../../brand/tokens.js';
import { W, H, LOCKUP, lockupScale, WORDMARK_PATHS, WORDMARK_VIEWBOX, LINE_Y } from './engine/shapes.js';
import { stateAt, FRAMES, T, HERO_Y } from './engine/timeline.js';
import { drawFrame } from './engine/render.js';
import { ease, clamp, lerp } from './engine/math.js';

export const DOGRU_FRAMES = FRAMES;

const INKT = (a) => `rgba(236,244,252,${a})`;
const GOLD = (a) => `rgba(226,194,132,${a})`;   // Champagne #C9A157, lifted for type on navy

/* Approximate advance widths for Hanken Grotesk, to lay out the pun. */
const textWidth = (t, size, weight = 500) => [...t].reduce((w, ch) => w + (ch === ' ' ? 0.26 : /[ilıİ.'?]/.test(ch) ? 0.27 : /[mwMW]/.test(ch) ? 0.82 : /[A-ZĞŞÜÖÇ]/.test(ch) ? 0.64 : 0.55), 0) * size * (weight >= 600 ? 1.03 : 1);

/* ── The lockup: the name stands on its gold line. ─────────────────────────── */
const Lockup = ({ rise, slogan, url, glint }) => {
  const w = LOCKUP.width, h = WORDMARK_VIEWBOX[3] * lockupScale;
  const top = LOCKUP.cy - h / 2;
  const box = LINE_Y - 14;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, width: W, top: box - 260, height: 260, overflow: 'hidden' }}>
        <svg viewBox={WORDMARK_VIEWBOX.join(' ')} width={w} height={h}
             style={{ position: 'absolute', left: LOCKUP.cx - w / 2, top: top - (box - 260), transform: `translateY(${(1 - rise) * 250}px)` }}>
          {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill="#FFFFFF" />)}
        </svg>
      </div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LINE_Y + 40 + (1 - slogan) * 14, textAlign: 'center',
        fontFamily: SANS, fontWeight: 500, fontSize: 54, letterSpacing: '-0.01em', color: INKT(slogan),
      }}>
        Kıbrıs'ta <span style={{ color: GOLD(slogan), textShadow: glint > 0.01 ? `0 0 ${24 * glint}px rgba(236,204,142,${0.8 * glint})` : 'none' }}>doğru</span> ev.
      </div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LINE_Y + 150 + (1 - url) * 12, textAlign: 'center',
        fontFamily: SANS, fontWeight: 600, fontSize: 58, letterSpacing: '0.01em', color: INKT(url),
      }}>evlek.app</div>
    </>
  );
};

/* Words standing on a line and rising out of it, one letter at a time. */
const Rising = ({ parts, rise, sink, size, weight, tracking, y, stagger = 2.2 }) => {
  const chars = parts.flatMap(({ t, gold }) => [...t].map((ch) => ({ ch, gold })));
  const n = chars.length;
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: y - size * 1.3, height: size * 1.3 - 12, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      {chars.map(({ ch, gold }, i) => {
        const k = stagger / 22;
        const pi = ease.settle(clamp(rise * (1 + (n - 1) * k) - i * k));
        const po = ease.launch(clamp(sink * (1 + (n - 1) * k) - (n - 1 - i) * k));
        const dy = (1 - pi) * size * 1.15 + po * size * 1.15;
        return (
          <span key={i} style={{
            display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${dy}px)`,
            fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: tracking,
            color: gold ? GOLD(1) : INKT(0.98), paddingBottom: size * 0.1,
          }}>{ch}</span>
        );
      })}
    </div>
  );
};

/* "Hangisi doğru?" — at the snap the question falls away and "doğru" stays
   on the straightened line, then rides it up to the horizon. */
const Pun = ({ p }) => {
  const size = 96;
  const wH = textWidth('Hangisi ', size) - 16, wD = textWidth('doğru', size) - 6, wQ = textWidth('?', size);
  const start = W / 2 - (wH + wD + wQ) / 2;          // the whole question, centred
  const dLeft = lerp(start + wH, W / 2 - wD / 2, p.center);
  const top = p.y - size * 1.3;
  const piece = (text, left, rise, drop, gold) => {
    const dy = (1 - ease.settle(rise)) * size * 1.15 + ease.launch(drop) * size * 1.15;
    return (
      <div style={{ position: 'absolute', left, top, height: size * 1.3 - 12, overflow: 'hidden' }}>
        <div style={{ transform: `translateY(${dy + size * 0.2}px)`, fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1, whiteSpace: 'pre', color: gold, paddingBottom: size * 0.12 }}>{text}</div>
      </div>
    );
  };
  return (
    <>
      {piece('Hangisi', dLeft - wH, p.rise, p.drop, INKT(0.98))}
      {piece('doğru', dLeft, p.rise, p.sink, `rgba(${Math.round(lerp(236, 236, p.gold))},${Math.round(lerp(244, 204, p.gold))},${Math.round(lerp(252, 142, p.gold))},1)`)}
      {piece('?', dLeft + wD - 2, p.rise, p.drop, INKT(0.98))}
    </>
  );
};

/* The search field. The brand sits in it where a lens would be. */
const QUERY = 'Girne · deniz manzarası';
const Pill = ({ p }) => {
  const pw = 820, ph = 104, x = (W - pw) / 2, y = 1236;
  const per = 2 * (pw + ph);
  const n = Math.round(QUERY.length * p.typed);
  const lw = 104, lh = (WORDMARK_VIEWBOX[3] / WORDMARK_VIEWBOX[2]) * lw;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: pw, height: ph, opacity: p.a }}>
      <svg width={pw} height={ph} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <rect x={1.5} y={1.5} width={pw - 3} height={ph - 3} rx={(ph - 3) / 2} fill="rgba(6,20,38,0.78)" stroke={INKT(0.9)} strokeWidth={2.4}
              strokeDasharray={per} strokeDashoffset={per * (1 - p.draw)} />
        <line x1={170} y1={26} x2={170} y2={ph - 26} stroke={INKT(0.35 * p.draw)} strokeWidth={1.6} />
      </svg>
      <svg viewBox={WORDMARK_VIEWBOX.join(' ')} width={lw} height={lh} style={{ position: 'absolute', left: 42, top: (ph - lh) / 2, opacity: p.draw }}>
        {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill="#FFFFFF" />)}
      </svg>
      <div style={{ position: 'absolute', left: 196, top: 0, height: ph, display: 'flex', alignItems: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 42, color: INKT(0.97), whiteSpace: 'pre' }}>
        {QUERY.slice(0, n)}
        <span style={{ display: 'inline-block', width: 3, height: 46, marginLeft: 4, background: p.caret ? GOLD(1) : 'transparent' }} />
      </div>
    </div>
  );
};

/* The chosen listing, named, with the mark that makes it the right one. */
const Popover = ({ p }) => {
  const cw = 760, ch = 196, x = p.x - cw / 2, y = p.y - 150 - ch;
  const sweepX = lerp(-200, cw + 200, p.sweep);
  return (
    <div style={{ position: 'absolute', left: x, top: y + (1 - p.a) * 20, width: cw, height: ch, opacity: p.a }}>
      <svg width={cw} height={ch + 22} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="sw" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="rgba(236,204,142,0)" />
            <stop offset="0.5" stopColor="rgba(236,204,142,0.16)" />
            <stop offset="1" stopColor="rgba(236,204,142,0)" />
          </linearGradient>
          <clipPath id="card"><rect x={0} y={0} width={cw} height={ch} rx={22} /></clipPath>
        </defs>
        <path d={`M 22 1.5 H ${cw - 22} A 20.5 20.5 0 0 1 ${cw - 1.5} 22 V ${ch - 22} A 20.5 20.5 0 0 1 ${cw - 22} ${ch - 1.5} H ${cw / 2 + 18} L ${cw / 2} ${ch + 18} L ${cw / 2 - 18} ${ch - 1.5} H 22 A 20.5 20.5 0 0 1 1.5 ${ch - 22} V 22 A 20.5 20.5 0 0 1 22 1.5 Z`}
              fill="rgba(6,20,38,0.86)" stroke={INKT(0.92)} strokeWidth={2.4} />
        <g clipPath="url(#card)"><rect x={sweepX - 120} y={0} width={240} height={ch} fill="url(#sw)" /></g>
        <rect x={22} y={22} width={150} height={ch - 44} rx={12} fill="none" stroke={INKT(0.55)} strokeWidth={2} />
        <path d={`M 56 ${ch - 50} V ${ch / 2 + 4} L 97 ${ch / 2 - 30} L 138 ${ch / 2 + 4} V ${ch - 50} Z M 86 ${ch - 50} V ${ch / 2 + 22} H 108 V ${ch - 50}`} fill="none" stroke={INKT(0.9)} strokeWidth={2.4} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 200, top: 34, fontFamily: SANS, fontWeight: 600, fontSize: 44, color: INKT(0.98), whiteSpace: 'nowrap' }}>Deniz manzaralı villa</div>
      <div style={{ position: 'absolute', left: 200, top: 112, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.08em', color: GOLD(1), whiteSpace: 'nowrap' }}>
        <svg width={30} height={30}><path d="M 4 16 L 12 24 L 26 7" fill="none" stroke={GOLD(1)} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
        EVLEK ONAYLI EMLAKÇI
      </div>
    </div>
  );
};

/* City labels sit beside their pins, never under them. [dx, dy, anchor] */
const CITY_LABEL = {
  'GÜZELYURT': [-18, -58, 'right'], LEFKE: [-14, 16, 'right'], 'LEFKOŞA': [0, 18, 'center'],
  'GAZİMAĞUSA': [22, -18, 'left'], 'İSKELE': [22, -58, 'left'], 'GİRNE': [0, -128, 'center'],
};

export const DogruCizgi = () => {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  const s = useMemo(() => stateAt(frame), [frame]);
  const still = frame < T.hold || frame >= FRAMES - 1;

  useLayoutEffect(() => {
    drawFrame(ref.current.getContext('2d'), stateAt, frame, still, s);
  }, [s, frame, still]);

  const pinLabels = s.pins.filter((p) => p.label > 0.01).map((p) => { const r = s.project(p.p); return r ? { ...p, x: r[0], y: r[1] } : null; }).filter(Boolean);
  const tags = s.tags.map((t) => { const r = s.project(t.p); return r ? { ...t, x: r[0], y: r[1] } : null; }).filter(Boolean);

  return (
    <AbsoluteFill style={{ background: '#0A2540' }}>
      <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', inset: 0 }} />
      {s.scrims.map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: b.y - b.h / 2 - 90, width: W, height: b.h + 180, opacity: b.a, background: 'linear-gradient(180deg, rgba(3,12,24,0) 0%, rgba(3,12,24,0.8) 30%, rgba(3,12,24,0.8) 70%, rgba(3,12,24,0) 100%)' }} />
      ))}
      {pinLabels.map((p) => {
        const [dx, dy, anchor] = CITY_LABEL[p.name] || [0, 18, 'center'];
        const tx = anchor === 'right' ? '-100%' : anchor === 'left' ? '0%' : '-50%';
        return (
          <div key={p.name} style={{
            position: 'absolute', left: p.x + dx, top: p.y + dy - (p.isG ? 40 * p.lift : 0), transform: `translateX(${tx})`,
            fontFamily: MONO, fontWeight: 500, fontSize: p.isG ? 34 + 6 * p.lift : 27, letterSpacing: '0.12em',
            color: p.isG ? GOLD(p.label) : INKT(p.label * 0.82), whiteSpace: 'nowrap',
          }}>{p.name}</div>
        );
      })}
      {tags.map((t) => (
        <div key={t.name} style={{ position: 'absolute', left: t.x, top: t.y, transform: 'translate(-50%, -100%)', opacity: t.a, textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.2em', color: INKT(0.94) }}>{t.name}</div>
          <div style={{ width: 1.5, height: 30, margin: '8px auto 0', background: INKT(0.5) }} />
          <div style={{ width: 7, height: 7, borderRadius: 4, margin: '0 auto', background: INKT(0.8) }} />
        </div>
      ))}
      {s.note && (
        <div style={{ position: 'absolute', left: s.note.x, top: s.note.y + 26, transform: 'translateX(-50%)', opacity: s.note.a, fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.24em', color: GOLD(0.95), whiteSpace: 'nowrap' }}>{s.note.text}</div>
      )}
      {s.popover && <Popover p={s.popover} />}
      {s.pill && <Pill p={s.pill} />}
      {s.copy.map((c) => <Rising key={c.t} parts={[{ t: c.t }]} rise={c.rise} sink={c.sink} size={72} weight={500} tracking="-0.01em" y={HERO_Y} stagger={0.9} />)}
      {s.pun && <Pun p={s.pun} />}
      {s.heroes.map((h) => (
        <Rising key={h.t} parts={h.gold ? [{ t: h.gold, gold: true }, { t: h.t.slice(h.gold.length) }] : [{ t: h.t }]} rise={h.rise} sink={h.sink} size={112} weight={600} tracking="-0.01em" y={HERO_Y} stagger={1.6} />
      ))}
      <Lockup rise={s.wordRise} slogan={s.slogan} url={s.url} glint={s.sloganGlint} />
    </AbsoluteFill>
  );
};
