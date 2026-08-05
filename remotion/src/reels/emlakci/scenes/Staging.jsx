// Act 4 · the photograph, full-bleed. No device. 3.00s.
//
// Register change, on purpose. The previous act is typography on cream; this one
// throws everything away and gives the room the entire 1080×1920. It is the most
// beautiful image in the film and the only beat where the product disappears and
// the thing being sold is on screen alone.
//
// Two moves, in this order and never overlapping:
//
//   0.45 → 1.80  the wipe. Empty room becomes a furnished one. Slow enough that
//                the viewer reads BOTH states — the whole claim of the act is the
//                difference between them, and a fast wipe hides exactly that.
//   2.20, 2.60   the variations. Cross-dissolves, not cuts, because dissolving
//                two photographs of the same room from the same camera makes the
//                furniture appear to transform. That only works if the source
//                photographs share a camera — see the asset brief.
//
// The disclosure pill is on screen the entire time a rendered image is. It is
// trust infrastructure for an audience that sells property for a living, not a
// legal afterthought, and it is the reason an agent can post this.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate } from 'remotion';
import { C, T, dur, at, ease, tp, pulse, SAFE, MONO, holdLine } from '../../../brand/tokens.js';
import { Disclosure } from '../../../brand/ui.jsx';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const STAGING_SECONDS = 2.85;

const V = content.copy.variants;          // [{asset, label}]
const VAR_AT = [null, 2.10, 2.46];        // index 0 is the wipe's own result

export const Staging = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  // The push never stops. A still full-bleed photograph reads as a slide the
  // moment it holds for more than half a second.
  const push = interpolate(t, [0, STAGING_SECONDS], [1, 1.055], { extrapolateRight: 'clamp' });

  const wipe = tp(t, 0.45, 1.80, ease.inOut);
  const snap = pulse(t, 1.78, 0.34);

  const line1 = holdLine(frame, 0.15, 1.72);
  const line2 = holdLine(frame, 1.86, 2.74);
  const pill = at(frame, 0.28, dur.md);
  const strip = at(frame, 1.95, dur.lg);

  // Which variation is showing, and how far the dissolve has come.
  const varP = VAR_AT.map((s, i) => (i === 0 ? 1 : tp(t, s, s + 0.30, ease.out)));
  const activeIdx = varP[2] > 0.5 ? 2 : varP[1] > 0.5 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '52% 46%' }}>
        {/* Empty room — what the agent actually photographed. */}
        <Img src={asset('stage_base')} style={FILL} />

        {/* The furnished one, wiping across it. */}
        <Img
          src={asset(V[0].asset)}
          style={{ ...FILL, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}
        />

        {/* The other two styles, dissolving in on top once the wipe has landed. */}
        {V.slice(1).map((v, i) => (
          varP[i + 1] > 0.001 && (
            <Img
              key={v.asset}
              src={asset(v.asset)}
              style={{
                ...FILL,
                opacity: varP[i + 1],
                transform: `scale(${1.018 - 0.018 * varP[i + 1]})`,
              }}
            />
          )
        ))}
      </div>

      {/* The wipe edge. A hairline alone reads as a clipping artefact; the glow
          is what makes it read as a moving seam of light. */}
      {wipe > 0.002 && wipe < 0.998 && (
        <>
          <div
            style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${wipe * 100}%`, width: 5, marginLeft: -2.5,
              background: C.white, boxShadow: '0 0 44px rgba(255,255,255,0.6)',
            }}
          />
          {/* Handle. The reveal has to read as something being DONE — by the
              agent, in the product — not as something merely happening. */}
          <div
            style={{
              position: 'absolute', top: 900, left: `${wipe * 100}%`,
              width: 78, height: 78, marginLeft: -39, borderRadius: 999,
              background: C.white, border: `3px solid ${C.gold}`,
              boxShadow: '0 8px 26px rgba(4,14,28,0.34)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            <svg width="15" height="22" viewBox="0 0 12 20"><path d="M9 3 L3 10 L9 17" stroke={C.navy} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
            <svg width="15" height="22" viewBox="0 0 12 20"><path d="M3 3 L9 10 L3 17" stroke={C.navy} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
          </div>
        </>
      )}

      {/* The landing: one ring, expanding outward from where the handle stopped. */}
      {snap > 0.01 && (
        <div
          style={{
            position: 'absolute', top: 900, left: '100%',
            width: 78, height: 78, marginLeft: -39, borderRadius: 999,
            border: `3px solid rgba(201,161,87,${0.75 * (1 - snap)})`,
            transform: `scale(${1 + snap * 2.4})`,
          }}
        />
      )}

      {/* Scrims. The photograph is bright and the type has to survive a glance. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(6,22,40,0.86) 0%, rgba(6,22,40,0.66) 18%, rgba(8,28,50,0.22) 36%, rgba(10,37,64,0) 58%, rgba(10,37,64,0.46) 100%)',
        }}
      />
      <Grain opacity={0.045} />

      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 180 }}>
          <div style={{ ...T.headline, color: C.white, textShadow: '0 2px 24px rgba(4,14,28,0.8)', position: 'absolute', ...line1 }}>
            {content.copy.line_photo}
          </div>
          <div style={{ ...T.headline, color: C.white, textShadow: '0 2px 24px rgba(4,14,28,0.8)', position: 'absolute', ...line2 }}>
            {content.copy.line_variants}
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 490, opacity: pill }}>
        <Disclosure />
      </div>

      {/* The variation strip. Small, low, and it only appears once there is
          something to choose between. */}
      <div
        style={{
          position: 'absolute', left: SAFE.left + 20, top: 1130,
          display: 'flex', gap: 18,
          padding: '18px 20px 14px',
          borderRadius: 28,
          background: 'rgba(4,14,28,0.66)',
          backdropFilter: 'blur(14px)',
          opacity: strip, transform: `translateY(${(1 - strip) * 26}px)`,
        }}
      >
        {V.map((v, i) => {
          const on = i === activeIdx ? 1 : 0;
          return (
            <div key={v.asset} style={{ width: 190 }}>
              <div
                style={{
                  height: 132, borderRadius: 16, overflow: 'hidden',
                  border: `3px solid rgba(201,161,87,${on ? 0.95 : 0})`,
                  boxShadow: on ? '0 0 30px rgba(201,161,87,0.3)' : '0 8px 22px rgba(4,14,28,0.3)',
                  transform: `scale(${0.96 + 0.04 * on})`,
                }}
              >
                <Img src={asset(v.asset)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: on ? 'none' : 'saturate(0.72) brightness(0.82)' }} />
              </div>
              <div
                style={{
                  fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginTop: 12,
                  color: on ? C.gold : 'rgba(255,255,255,0.72)',
                }}
              >
                {v.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FILL = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
