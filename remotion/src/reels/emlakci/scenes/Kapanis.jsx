// Act 8 · the close. 1.90s.
//
// The last two seconds of a vertical film are the only place a viewer decides
// whether to act, and they decide on one sentence, not on a feature list. So the
// close carries exactly one idea — the division of labour the whole film has been
// demonstrating — and then the address.
//
//   "Sen ilanı koy."      what the agent does
//   "Gerisi Evlek'te."    what the product does
//
// Girne sits behind it all at 16%, pushing very slowly. The place matters: this
// is a product for a specific market, and the last frame is where it should say
// so without a word.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate } from 'remotion';
import { C, T, SANS, MONO, dur, at, ease, tp, holdLine } from '../../../brand/tokens.js';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const KAPANIS_SECONDS = 2.05;

export const Kapanis = ({ tOverride }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const push = interpolate(t, [0, KAPANIS_SECONDS], [1.06, 1.0], { extrapolateRight: 'clamp' });

  const mark = tp(t, 0.10, 0.10 + dur.lg, ease.out);
  const rule = tp(t, 0.38, 0.38 + dur.lg, ease.out);
  const l1 = tp(t, 0.54, 0.54 + dur.md, ease.out);
  const l2 = tp(t, 0.76, 0.76 + dur.md, ease.out);
  const cta = tp(t, 1.16, 1.16 + dur.md, ease.out);
  const mail = tp(t, 1.42, 1.42 + dur.md, ease.out);

  const Reveal = ({ p, dy = 20, children, style }) => (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>
  );

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Img
          src={asset('girne')}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.16 }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: 'radial-gradient(1000px 1000px at 50% 46%, rgba(47,92,255,0.16), rgba(10,37,64,0.55) 72%)' }}
      />
      <Grain opacity={0.05} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
        <Reveal p={mark} dy={14}>
          <Img
            src={asset('wordmark')}
            style={{ width: 420, height: 129, objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }}
          />
        </Reveal>

        <div style={{ height: 3, width: 200, marginTop: 30, position: 'relative' }}>
          <div
            style={{
              position: 'absolute', inset: 0, background: C.gold,
              transform: `scaleX(${rule})`, transformOrigin: 'center',
            }}
          />
        </div>

        <div style={{ marginTop: 62, textAlign: 'center' }}>
          <Reveal p={l1}>
            <div style={{ ...T.hook, fontSize: 68, color: 'rgba(255,255,255,0.96)' }}>{content.copy.close_1}</div>
          </Reveal>
          <Reveal p={l2} style={{ marginTop: 8 }}>
            <div style={{ ...T.hook, fontSize: 68, color: C.gold }}>{content.copy.close_2}</div>
          </Reveal>
        </div>

        <Reveal p={cta} dy={16} style={{ marginTop: 76 }}>
          <div
            style={{
              fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: '-0.01em',
              color: C.navy, background: C.white,
              padding: '22px 54px', borderRadius: 999,
              boxShadow: '0 20px 50px rgba(4,14,28,0.4)',
            }}
          >
            {content.copy.cta}
          </div>
        </Reveal>

        <Reveal p={mail} dy={12} style={{ marginTop: 30 }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.62)' }}>
            {content.copy.contact}
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
