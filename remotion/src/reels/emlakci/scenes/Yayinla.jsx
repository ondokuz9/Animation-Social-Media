// Act 2 · one press, and the camera finds out what it did. 3.20s.
//
// This act exists to make a single point physically: the agent's entire input is
// one button. So the act OPENS on that button at 3×, close enough that nothing
// else is in frame, holds while a cursor arrives, presses — and only then does
// the camera pull back and reveal that the press belonged to a whole product.
//
// The pull-back is the one camera move in the film, and it is deliberately the
// slowest thing in it (0.62s, dur.xl). Everything inside the phone obeys
// interface timing — under 300ms. The camera obeys film timing. Mixing the two
// vocabularies is what makes a product film feel like a product film rather than
// a UI recording.
//
// Timeline, in act-local seconds:
//   0.00        macro, 3.0×, centred on the publish button
//   0.10–0.52   cursor travels in from the lower right
//   0.55        press down (120ms) and back (80ms)
//   0.68        the ring leaves the button; the label becomes "Yayınlandı"
//   0.74        the tick draws
//   0.78–1.40   camera pulls back 3.0× → 1.0×, phone tilts −0.4° → −2.2°
//   1.30–1.52   the form cross-fades into the written listing
//   1.44–2.32   the description writes itself, a word at a time
//   2.34        "Onayla" arrives in the same slot the publish button used
//   2.58        the agent confirms
//   2.72        confirmed; the first done-row slides in underneath

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, dur, at, ease, tp, press as pressAtT, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone, Cursor } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import content from '../content.json';

export const YAYINLA_SECONDS = 3.2;

/* Where the publish button sits in frame coordinates when the camera is at 1×.
   Derived from the layout: phone top 430 + bezel 14 + screen padding 46 + app bar
   60 + card border 1.5 + photo 400 + card padding 28 + price 55 + description
   132 + slot offset 10 + half a 76px button. Verified against a still render —
   if the button ever moves, this is the one number to re-measure. */
const ORIGIN_X = 364;
const ORIGIN_Y = 1278;   // measured off a rendered still, not derived on paper
const MACRO = 3.0;

/** The screen, as a pure function of act-local time. Nothing here reads a frame,
    which is what lets the cold open replay this same function at 8×. */
export const yayinlaState = (t) => ({
  form: 1 - tp(t, 1.30, 1.52, ease.out),
  press: Math.max(pressAtT(t, 0.55), pressAtT(t, 2.58)),
  published: tp(t, 0.68, 0.88),
  publishedCheck: tp(t, 0.74, 0.96, ease.out),
  desc: tp(t, 1.44, 2.32, ease.linear),
  confirm: tp(t, 2.34, 2.52),
  confirmed: tp(t, 2.72, 2.90),
  confirmedCheck: tp(t, 2.76, 2.98, ease.out),
  langs: 0,
  stageOn: 0,
  stage: 0,
  match: 0,
  rows: { desc: tp(t, 2.92, 3.20), lang: 0, photo: 0, match: 0 },
});

export const Yayinla = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const s = yayinlaState(t);

  // Camera. Held wide open at 3× for the first 0.78s — the hold is what makes
  // the pull-back land; a move that starts immediately has nothing to leave.
  const cam = interpolate(t, [0.78, 1.40], [MACRO, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut,
  });
  const camP = tp(t, 0.78, 1.40, ease.inOut);

  // A very small handheld drift at macro, dying out as we pull back. Perfectly
  // locked-off macro reads as a screenshot.
  const breathe = Math.sin(t * 2.2) * 3.2 * (1 - camP);

  // The button sits at x=364 in the 1×  layout, which is well left of centre.
  // Scaling around it alone would leave the macro shot hanging off the left edge,
  // so the camera also PANS the button to the middle of the frame and gives that
  // pan back over the pull-back. At camP=1 both offsets are zero and the layout
  // is exactly where every other act expects it.
  const lookX = (540 - ORIGIN_X) * (1 - camP);
  const lookY = (1090 - ORIGIN_Y) * (1 - camP);

  const tilt = interpolate(camP, [0, 1], [-0.4, -2.2]);
  const scale = 1 + camP * 0.004;

  // Cursor lives in frame coordinates, so it has to be scaled by the camera to
  // stay glued to the button it is pressing.
  const travel = tp(t, 0.10, 0.52, ease.out);
  const curVisible = Math.min(1, travel * 4) * (1 - tp(t, 0.92, 1.10)) + Math.min(1, tp(t, 2.16, 2.50, ease.out) * 4) * (1 - tp(t, 2.86, 3.02));
  const curX = t < 1.6
    ? interpolate(travel, [0, 1], [ORIGIN_X + 190, ORIGIN_X - 34])
    : interpolate(tp(t, 2.16, 2.50, ease.out), [0, 1], [ORIGIN_X + 150, ORIGIN_X - 44]);
  const curY = t < 1.6
    ? interpolate(travel, [0, 1], [ORIGIN_Y + 240, ORIGIN_Y - 8])
    : interpolate(tp(t, 2.16, 2.50, ease.out), [0, 1], [ORIGIN_Y + 210, ORIGIN_Y + 60]);

  // Headlines only exist once there is room for them, i.e. once we are wide.
  const l1 = holdLine(frame, 1.52, 2.30);
  const l2 = holdLine(frame, 2.42, 3.16);

  // The vignette is the depth cue that sells the macro. It leaves with the move.
  const vig = 1 - camP;

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 190 }}>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...l1 }}>{content.copy.line_written}</div>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...l2 }}>{content.copy.line_control}</div>
        </div>
      )}

      <AbsoluteFill
        style={{
          transform: `translate(${lookX + breathe * 0.4}px, ${lookY + breathe}px) scale(${cam})`,
          transformOrigin: `${ORIGIN_X}px ${ORIGIN_Y}px`,
        }}
      >
        <Phone tilt={tilt} scale={scale} top={430}>
          <AgentPhone s={s} />
        </Phone>

        {curVisible > 0.02 && (
          <Cursor
            x={curX}
            y={curY}
            opacity={Math.min(1, curVisible)}
            press={s.press}
          />
        )}
      </AbsoluteFill>

      {vig > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            opacity: vig,
            background:
              `radial-gradient(700px 800px at 540px 1090px, rgba(10,37,64,0) 40%, rgba(10,37,64,0.34) 100%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
