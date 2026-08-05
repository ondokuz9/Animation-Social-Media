// Act 1 · the cold open. 2.80s.
//
// The first three seconds decide whether the other seventeen are watched at all,
// and this audience — working estate agents, scrolling — will not sit through a
// slow build for a product they have never heard of. So the film opens by
// spending its whole inventory in a second and a half: five hard cuts, five
// registers, one word each. Photograph, type, diagram, interface, result.
//
// Every shot is a REAL frame of a later act, driven by that act's own timeline at
// its own timecode — not a separate animation made to resemble one. That is why
// the montage can promise what it promises. Nothing in it is a mock-up of the
// film; it IS the film, out of order.
//
// Then everything stops. One still frame, an empty form, and the two lines that
// reframe everything just shown:
//
//     "Bunları sen yapmadın."
//     "Sen sadece Yayınla'ya bastın."
//
// The claim survives scrutiny because the next act performs it in one shot.
//
// No white flash between cuts, deliberately. Five full-frame luminance flashes in
// 1.4s crosses into territory that is genuinely unsafe for some viewers, and the
// register changes are already violent enough to punctuate themselves.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, FPS, ease, tp, at, dur, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import { MontageWord } from '../parts.jsx';
import { Staging } from './Staging.jsx';
import { Diller } from './Diller.jsx';
import { Match } from './Match.jsx';
import { Arama } from './Arama.jsx';
import { Yayinla, yayinlaState } from './Yayinla.jsx';
import content from '../content.json';

export const ACILIS_SECONDS = 2.8;

const CUT = 17;                 // frames per montage shot — 283ms, five of them
const MONTAGE_END = CUT * 5;    // f85

const W = content.copy.montage_words;

/* Each shot names the act it comes from, the moment inside that act, and how the
   camera behaves during its 283ms. Alternating push in / ease back is what keeps
   five cuts from turning into one strobing texture. */
const SHOTS = [
  { Scene: Staging, from: 1.52, to: 1.78, scale: [1.00, 1.045], origin: '54% 46%', dark: true },
  { Scene: Diller, from: 1.19, to: 1.34, scale: [1.035, 1.00], origin: '22% 46%', dark: false },
  { Scene: Match, from: 1.88, to: 2.12, scale: [1.00, 1.05], origin: '50% 56%', dark: true },
  { Scene: Yayinla, from: 1.94, to: 2.16, scale: [1.04, 1.00], origin: '34% 62%', dark: false },
  { Scene: Arama, from: 1.94, to: 2.18, scale: [1.00, 1.04], origin: '26% 56%', dark: false },
];

export const Acilis = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  /* ── Montage ─────────────────────────────────────────────────────────── */
  if (frame < MONTAGE_END) {
    const i = Math.floor(frame / CUT);
    const shot = SHOTS[i];
    const local = (frame - i * CUT) / CUT;              // 0 → 1 within the shot
    const { Scene } = shot;
    const sc = interpolate(local, [0, 1], shot.scale, { easing: ease.linear });

    return (
      <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: shot.origin }}>
          <Scene tOverride={interpolate(local, [0, 1], [shot.from, shot.to])} bare />
        </AbsoluteFill>
        <MontageWord dark={shot.dark}>{W[i]}</MontageWord>
      </AbsoluteFill>
    );
  }

  /* ── The still ───────────────────────────────────────────────────────── */
  // Everything stops on the one screen the agent actually touches. The push runs
  // toward the publish button and hands straight over to the next act, which
  // opens on that button at 3× — the cut reads as an acceleration, not a jump.
  const s = yayinlaState(0);
  const stillT = t - MONTAGE_END / FPS;
  const cam = interpolate(stillT, [0, ACILIS_SECONDS - MONTAGE_END / FPS], [1.0, 1.16], {
    extrapolateRight: 'clamp', easing: ease.inOut,
  });

  const h1 = holdLine(frame, 1.50, 2.08, { lenSec: dur.sm, outLenSec: 0.14 });
  // The second line never exits. It is still on screen when the cut happens, so
  // the next act begins mid-sentence rather than after one.
  const h2p = at(frame, 2.16, dur.sm, ease.out);
  const h2 = { opacity: h2p, transform: `translateY(${(1 - h2p) * 18}px)` };

  // A scrim behind the type: the phone is bright cream and 76px navy on cream is
  // strong, but the push brings the card up into the headline band.
  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '364px 1278px' }}>
        <Phone tilt={-0.9} top={430}>
          <AgentPhone s={s} />
        </Phone>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(248,246,241,1) 0%, rgba(248,246,241,0.98) 24%, rgba(248,246,241,0) 40%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 292, right: SAFE.right, height: 300 }}>
        <div style={{ ...T.hook, color: C.navy, position: 'absolute', ...h1 }}>{content.copy.hook_1}</div>
        <div style={{ ...T.hook, color: C.navy, position: 'absolute', ...h2 }}>{content.copy.hook_2}</div>
      </div>
    </AbsoluteFill>
  );
};
