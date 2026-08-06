// Act 2 · one press, and the camera finds out what it did. 5.00s.
//
// This act makes a single point physically: the agent's entire input is one
// button. So it OPENS on that button at 2.4×, close enough that the button owns
// the frame but the price and the empty description stay in it for context,
// holds while a fingertip arrives, presses — and only then does the camera pull
// back and reveal that the press belonged to a whole product.
//
// The pull-back is the one camera move in the film and deliberately the slowest
// thing in it (0.67s). Everything inside the phone obeys interface timing, under
// 300ms. The camera obeys film timing. Mixing the two vocabularies is what makes
// a product film feel like a product film rather than a UI recording.
//
// A 0.4s-interval frame inspection retimed this act from 3.70s. The three
// headlines were sharing 2.6 seconds with six interface beats; the first one
// entered at 1.05 — while the pull-back still had the scaled phone covering the
// headline band, so "bastın." spent ten frames clipped behind the bezel — and
// the last one held for under half a second. Every line now enters after the
// camera has settled and holds for at least a second, and the act paid for it
// with 1.3 seconds of new length rather than with someone else's beats.
//
// Timeline, act-local seconds:
//   0.00–0.85  macro, 2.4×, centred on the publish button
//   0.15–0.62  a fingertip travels in from the lower right
//   0.68       press down (120ms) and back (80ms)
//   0.82       the ring leaves the button; the label becomes "Yayınlandı"
//   0.88–1.06  the tick draws
//   0.95–1.62  camera pulls back 2.4× → 1.0×, phone tilts −0.4° → −2.2°
//   1.10–1.95  "Evlek yazıyor…" holds the empty description field
//   1.66–2.76  "Sen sadece "Yayınla"ya bastın."
//   1.90–2.14  the form cross-fades into the written listing
//   2.05–3.15  the description writes itself, a word at a time
//   2.86–3.86  "Açıklamayı Evlek yazdı."
//   3.15–3.60  the card turns to the second photograph
//   3.30       "Onayla" arrives in the slot the publish button used
//   3.62       the agent confirms
//   3.96–4.92  "Onayı sen veriyorsun."
//   3.76–4.00  confirmed, tick drawn
//   4.00–4.28  the first done-row slides in underneath
//
// The act ends on a settled, confirmed card — which is also what fills the
// Yayınla → Diller dissolve. The inspection found a completely blank cream
// frame at the act boundary; content on both sides of the overlap is the fix.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, dur, ease, tp, press as pressAtT, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import { Touch, BrandPlate } from '../parts.jsx';
import content from '../content.json';

export const YAYINLA_SECONDS = 5.0;

/* Where the publish button sits in frame coordinates at 1×. Measured off a
   rendered still, not derived on paper — the macro shot is centred on it, so a
   20px error is a 60px drift during the pull-back. Re-measure if the layout of
   AgentPhone ever changes. */
const ORIGIN_X = 364;
const ORIGIN_Y = 1278;
/* 2.4, down from 3.0. At 3.0 the macro was a button with no context: the card's
   top edge cut the photograph at an arbitrary line and the carousel dots were
   half-cropped at the frame's right edge. At 2.4 the price, the empty
   description and the button share the opening frame — which is the argument. */
const MACRO = 2.4;

/** The screen, as a pure function of act-local time. Nothing here reads a frame,
    which is what lets the cold open replay this same function at its own speed. */
export const yayinlaState = (t) => ({
  form: 1 - tp(t, 1.90, 2.14, ease.out),
  press: Math.max(pressAtT(t, 0.68), pressAtT(t, 3.62)),
  published: tp(t, 0.82, 1.02),
  publishedCheck: tp(t, 0.88, 1.06, ease.out),
  writing: tp(t, 1.10, 1.30, ease.out) * (1 - tp(t, 1.95, 2.10)),
  writingT: t,
  desc: tp(t, 2.05, 3.15, ease.linear),
  photoIdx: tp(t, 3.15, 3.60, ease.inOut),
  confirm: tp(t, 3.30, 3.50),
  confirmed: tp(t, 3.76, 3.94),
  confirmedCheck: tp(t, 3.80, 4.00, ease.out),
  langs: 0,
  stageOn: 0,
  stage: 0,
  match: 0,
  rows: { desc: tp(t, 4.00, 4.28), lang: 0, photo: 0, match: 0 },
});

export const Yayinla = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const s = yayinlaState(t);

  // Held at 2.4× for the first 0.95s. The hold is what makes the pull-back land;
  // a move that starts immediately has nothing to leave.
  const cam = interpolate(t, [0.95, 1.62], [MACRO, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut,
  });
  const camP = tp(t, 0.95, 1.62, ease.inOut);

  // A very small handheld drift at macro, dying out as we pull back. A perfectly
  // locked-off macro reads as a screenshot.
  const breathe = Math.sin(t * 2.2) * 3.2 * (1 - camP);

  // The button sits at x=364, well left of centre. Scaling around it alone leaves
  // the macro hanging off the left edge, so the camera also PANS it to the middle
  // of the frame and gives that pan back over the pull-back. At camP=1 both
  // offsets are zero and the layout is where every other act expects it.
  const lookX = (540 - ORIGIN_X) * (1 - camP);
  const lookY = (1090 - ORIGIN_Y) * (1 - camP);

  const tilt = interpolate(camP, [0, 1], [-0.4, -2.2]);
  const scale = 1 + camP * 0.004;

  const travel = tp(t, 0.15, 0.62, ease.out);
  const travel2 = tp(t, 3.18, 3.55, ease.out);
  const curVisible =
    Math.min(1, travel * 4) * (1 - tp(t, 1.10, 1.30)) +
    Math.min(1, travel2 * 4) * (1 - tp(t, 3.90, 4.06));
  const curX = t < 2.6
    ? interpolate(travel, [0, 1], [ORIGIN_X + 190, ORIGIN_X - 34])
    : interpolate(travel2, [0, 1], [ORIGIN_X + 150, ORIGIN_X - 44]);
  const curY = t < 2.6
    ? interpolate(travel, [0, 1], [ORIGIN_Y + 240, ORIGIN_Y - 8])
    : interpolate(travel2, [0, 1], [ORIGIN_Y + 210, ORIGIN_Y + 60]);

  // Three lines, each fully readable for at least a second, and none of them on
  // screen before the pull-back has settled — the headline band belongs to the
  // scaled phone until 1.62, and a line that enters under it gets clipped.
  const l1 = holdLine(frame, 1.66, 2.76);
  const l2 = holdLine(frame, 2.86, 3.86);
  const l3 = holdLine(frame, 3.96, 4.92);

  // The vignette is the depth cue that sells the macro. It leaves with the move.
  const vig = 1 - camP;

  // A tap leaves a ring. The button already presses and rings on its own state
  // change, but the FINGER's contact point deserves its own physics — one gold
  // ripple per press, dying as it expands.
  const rip1 = tp(t, 0.68, 1.06, ease.out);
  const rip2 = tp(t, 3.62, 4.00, ease.out);

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 200 }}>
          {/* 54px, not 68: at 68 this sentence wraps and its second line sits
              behind the phone's bezel — the inspection's "clipped bastın." was
              a wrap, not a timing accident. One line or no line. */}
          <div style={{ ...T.hook, fontSize: 54, color: C.navy, position: 'absolute', whiteSpace: 'nowrap', ...l1 }}>{content.copy.hook_2}</div>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...l2 }}>{content.copy.line_written}</div>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...l3 }}>{content.copy.line_control}</div>
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
          <Touch x={curX} y={curY} opacity={Math.min(1, curVisible)} press={s.press} />
        )}

        {[[rip1, ORIGIN_X - 34, ORIGIN_Y - 8], [rip2, ORIGIN_X - 44, ORIGIN_Y + 60]].map(([r, x, y], i) =>
          r > 0.01 && r < 0.999 ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 30 - 80 * r, top: y - 30 - 80 * r,
                width: 60 + 160 * r, height: 60 + 160 * r,
                borderRadius: 999,
                border: `2.5px solid rgba(201,161,87,${0.55 * (1 - r)})`,
              }}
            />
          ) : null
        )}
      </AbsoluteFill>

      {/* The brand, while the app bar that normally carries it is out of frame.
          At 2.4x the macro shows a button and a price and belongs to nobody;
          the plate leaves with the pull-back, exactly when the phone's own
          EVLEK app bar re-enters. */}
      {!bare && vig > 0.02 && <BrandPlate opacity={vig} left={80} top={306} />}

      {vig > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            opacity: vig,
            background:
              'radial-gradient(700px 800px at 540px 1090px, rgba(10,37,64,0) 40%, rgba(10,37,64,0.34) 100%)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
