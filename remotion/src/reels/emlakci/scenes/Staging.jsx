// Act 4 · the photograph, full-bleed. No device.
//
// Register change, on purpose. The previous act lives inside a phone; this one
// throws the phone away and gives the room the entire 1080×1920. It is the most
// beautiful image in the film and the only beat where the product disappears and
// the thing being sold is on screen alone.
//
// The shared element carries the cut: the card's photo in the previous act is
// this same frame, so the transition reads as a push into it rather than a jump.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from 'remotion';
import { C, T, dur, at, ease, SAFE, holdLine } from '../../../brand/tokens.js';
import { Disclosure } from '../../../brand/ui.jsx';
import content from '../content.json';

export const STAGING_SECONDS = 2.8;

export const Staging = ({ tOverride }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  // The push never stops: 1.00 → 1.06 across the whole act.
  const push = interpolate(t, [0, STAGING_SECONDS], [1, 1.06], { extrapolateRight: 'clamp' });

  // Wipe: held long enough at each end that the viewer reads both states.
  const wipe = interpolate(t, [0.55, 1.95], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut,
  });

  // A gold confirmation ring when it lands.
  const snap = Math.sin(Math.PI * Math.max(0, Math.min(1, (t - 1.95) / 0.3)));

  const label = holdLine(frame, 0.15, 2.45);
  const pill = at(frame, 0.25, dur.md);

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '52% 46%' }}>
        <Img
          src={staticFile(content.assets.staging_before)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Img
          src={staticFile(content.assets.staging_after)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
          }}
        />
      </div>

      {/* The wipe edge, with a soft light so it reads as a moving seam. */}
      {wipe > 0 && wipe < 1 && (
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${wipe * 100}%`, width: 5, marginLeft: -2.5,
            background: C.white, boxShadow: '0 0 40px rgba(255,255,255,0.55)',
          }}
        />
      )}

      {/* Handle, so the reveal reads as something being done, not something happening. */}
      {wipe > 0 && wipe < 1 && (
        <div
          style={{
            position: 'absolute', top: 940, left: `${wipe * 100}%`,
            width: 76, height: 76, marginLeft: -38, borderRadius: 999,
            background: C.white, border: `3px solid ${C.gold}`,
            boxShadow: `0 0 0 ${14 * snap}px rgba(201,161,87,0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
        >
          <svg width="15" height="22" viewBox="0 0 12 20"><path d="M9 3 L3 10 L9 17" stroke={C.navy} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
          <svg width="15" height="22" viewBox="0 0 12 20"><path d="M3 3 L9 10 L3 17" stroke={C.navy} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        </div>
      )}

      {/* Scrims: the image is bright, the type must stay readable at a glance. */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,37,64,0.62) 0%, rgba(10,37,64,0.12) 34%, rgba(10,37,64,0) 62%, rgba(10,37,64,0.34) 100%)',
        }}
      />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
        <div style={{ ...T.headline, color: C.white, textShadow: '0 2px 30px rgba(10,37,64,0.5)', ...label }}>
          {content.copy.line_photo}
        </div>
      </div>

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 470, opacity: pill }}>
        <Disclosure />
      </div>
    </AbsoluteFill>
  );
};
