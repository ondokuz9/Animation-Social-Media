import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SANS, MONO } from '../../brand/tokens.js';
import { W, H, LOCKUP, lockupScale, WORDMARK_PATHS, WORDMARK_VIEWBOX } from './engine/shapes.js';
import { stateAt, FRAMES, T, isFast } from './engine/timeline.js';
import { drawFrame } from './engine/render.js';
import { ease, clamp } from './engine/math.js';

export const DOGRU_FRAMES = FRAMES;

const SAFE_TOP = 250;     // below the Reels header
const INKT = (a) => `rgba(236,244,252,${a})`;
const GOLD = (a) => `rgba(201,161,87,${a})`;

const Lockup = ({ fill, slogan, url }) => {
  const w = LOCKUP.width, h = WORDMARK_VIEWBOX[3] * lockupScale;
  return (
    <>
      <svg viewBox={WORDMARK_VIEWBOX.join(' ')} width={w} height={h}
           style={{ position: 'absolute', left: LOCKUP.cx - w / 2, top: LOCKUP.cy - h / 2, opacity: fill }}>
        {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill="#FFFFFF" />)}
      </svg>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LOCKUP.cy + h / 2 + 64 + (1 - slogan) * 16, textAlign: 'center',
        fontFamily: SANS, fontWeight: 500, fontSize: 50, letterSpacing: '-0.01em', color: INKT(slogan),
      }}>Kıbrıs'ta doğru ev.</div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LOCKUP.cy + h / 2 + 142 + (1 - url) * 12, textAlign: 'center',
        fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.22em', color: GOLD(url * 0.95),
      }}>EVLEK.APP</div>
    </>
  );
};

/* A chapter label that types itself in like a set of drawn letters:
   the rule draws, the number lands, each letter rises on its own beat. */
const Label = ({ l }) => {
  const k = l.in * 24;
  const rule = ease.settle(clamp(k / 14));
  const exitY = -12 * l.out;
  return (
    <div style={{ position: 'absolute', left: 84, top: SAFE_TOP + exitY, opacity: 1 - l.out, display: 'flex', alignItems: 'center' }}>
      <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.12em', color: GOLD(0.95 * ease.settle(clamp(k / 8))) }}>{l.n}</span>
      <span style={{ width: 56 * rule, height: 1.5, marginLeft: 20, marginRight: 22 * rule + 2, background: INKT(0.55) }} />
      <span style={{ display: 'flex' }}>
        {[...l.t].map((ch, i) => {
          const p = ease.settle(clamp((k - 4 - i * 2.2) / 12));
          return (
            <span key={i} style={{
              fontFamily: SANS, fontWeight: 600, fontSize: 42, color: INKT(0.97 * p),
              transform: `translateY(${(1 - p) * 22}px)`, display: 'inline-block', marginRight: `${0.16 + (1 - p) * 0.2}em`,
            }}>{ch}</span>
          );
        })}
      </span>
    </div>
  );
};

export const DogruCizgi = () => {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  const s = useMemo(() => stateAt(frame), [frame]);
  const still = frame < T.hold || frame >= T.urlIn[1];

  useLayoutEffect(() => {
    drawFrame(ref.current.getContext('2d'), stateAt, frame, still, s, isFast(frame));
  }, [s, frame, still]);

  const pinLabels = s.pins.filter((p) => p.label > 0.01).map((p) => {
    const r = s.project(p.p);
    return r ? { ...p, x: r[0], y: r[1] } : null;
  }).filter(Boolean);
  const tags = s.tags.map((t) => { const r = s.project(t.p); return r ? { ...t, x: r[0], y: r[1] } : null; }).filter(Boolean);

  return (
    <AbsoluteFill style={{ background: '#0A2540' }}>
      <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', inset: 0 }} />
      {pinLabels.map((p) => (
        <div key={p.name} style={{
          position: 'absolute', left: p.x, top: p.y + (p.isG ? -96 - 30 * p.lift : p.name === 'GÜZELYURT' ? -84 : 18), transform: 'translateX(-50%)',
          fontFamily: MONO, fontWeight: 500, fontSize: p.isG ? 28 : 22, letterSpacing: '0.16em',
          color: p.isG ? GOLD(p.label) : INKT(p.label * 0.78), whiteSpace: 'nowrap',
        }}>{p.name}</div>
      ))}
      {tags.map((t) => (
        <div key={t.name} style={{ position: 'absolute', left: t.x, top: t.y, transform: 'translate(-50%, -100%)', opacity: t.a, textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.2em', color: INKT(0.9) }}>{t.name}</div>
          <div style={{ width: 1.5, height: 26, margin: '8px auto 0', background: INKT(0.5) }} />
        </div>
      ))}
      {s.labels.map((l) => <Label key={l.n} l={l} />)}
      <Lockup fill={s.fill} slogan={s.slogan} url={s.url} />
    </AbsoluteFill>
  );
};
