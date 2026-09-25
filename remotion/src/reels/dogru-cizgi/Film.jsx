import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SANS, MONO } from '../../brand/tokens.js';
import { W, H, LOCKUP, lockupScale, WORDMARK_PATHS, WORDMARK_VIEWBOX } from './engine/shapes.js';
import { stateAt, FRAMES } from './engine/timeline.js';
import { drawFrame, parcelDims } from './engine/render.js';

export const DOGRU_FRAMES = FRAMES;

// keep text readable: never rotate a label past vertical
const uprightAngle = (a) => { let x = a; while (x > Math.PI / 2) x -= Math.PI; while (x < -Math.PI / 2) x += Math.PI; return x; };

const SAFE_TOP = 250;     // below the Reels header
const TEXT = 'rgba(240,246,252,';

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
        fontFamily: SANS, fontWeight: 500, fontSize: 50, letterSpacing: '-0.01em', color: `${TEXT}${slogan})`,
      }}>Kıbrıs'ta doğru ev.</div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LOCKUP.cy + h / 2 + 142 + (1 - url) * 12, textAlign: 'center',
        fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.22em', color: `rgba(201,161,87,${url * 0.95})`,
      }}>EVLEK.APP</div>
    </>
  );
};

const Label = ({ l }) => (
  <div style={{ position: 'absolute', left: 84, top: SAFE_TOP + l.y, opacity: l.a, display: 'flex', alignItems: 'center', gap: 22 }}>
    <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.12em', color: `rgba(201,161,87,0.95)` }}>{l.n}</span>
    <span style={{ width: 56, height: 1.5, background: `${TEXT}0.5)` }} />
    <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: '0.16em', color: `${TEXT}0.96)` }}>{l.t}</span>
  </div>
);

export const DogruCizgi = () => {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  const s = useMemo(() => stateAt(frame), [frame]);
  const pinsRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = ref.current.getContext('2d');
    drawFrame(ctx, s);
  }, [s]);

  // pin labels are laid out from the same projection the canvas uses
  const pinLabels = (s.pins || []).filter((p) => p.visible && p.labelAlpha > 0.01).map((p) => {
    const r = s.project(p.p);
    return r ? { ...p, x: r[0], y: r[1] } : null;
  }).filter(Boolean);
  const dims = s.dims ? parcelDims(s) : [];

  return (
    <AbsoluteFill style={{ background: '#0A2540' }}>
      <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', inset: 0 }} />
      {pinLabels.map((p) => (
        <div key={p.name} style={{
          position: 'absolute', left: p.x, top: p.y + (p.isGirne ? -58 : p.name === 'GÜZELYURT' ? -48 : 22), transform: 'translateX(-50%)',
          fontFamily: MONO, fontWeight: 500, fontSize: p.isGirne ? 28 : 22, letterSpacing: '0.16em',
          color: p.isGirne ? `rgba(201,161,87,${p.labelAlpha})` : `${TEXT}${p.labelAlpha * 0.78})`, whiteSpace: 'nowrap',
        }}>{p.name}</div>
      ))}
      {dims.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y, transform: `translate(-50%,-50%) rotate(${uprightAngle(d.angle)}rad)`,
          fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.06em', color: `${TEXT}${s.dims.alpha * 0.8})`, whiteSpace: 'nowrap',
        }}>{d.len.toFixed(2).replace('.', ',')} m</div>
      ))}
      {s.labels.map((l) => <Label key={l.n} l={l} />)}
      <Lockup fill={s.fill} slogan={s.slogan} url={s.url} />
    </AbsoluteFill>
  );
};
