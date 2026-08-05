// Act 2 · one press, and the camera finds out what it did. 3.70s.
//
// This act makes a single point physically: the agent's entire input is one
// button. So it OPENS on that button at 3×, close enough that nothing else is in
// frame, holds while a cursor arrives, presses — and only then does the camera
// pull back and reveal that the press belonged to a whole product.
//
// The pull-back is the one camera move in the film and deliberately the slowest
// thing in it (0.67s). Everything inside the phone obeys interface timing, under
// 300ms. The camera obeys film timing. Mixing the two vocabularies is what makes
// a product film feel like a product film rather than a UI recording.
//
// The act also carries the second half of the cold open's thought. "Bunların
// hiçbirini sen yapmadın." was said over a still form; "Sen sadece Yayınla'ya
// bastın." lands here, at 1.05, as the camera pulls off the button that was just
// pressed. Word and picture arrive together, which is the only reason a claim
// like that is believed.
//
// Timeline, act-local seconds:
//   0.00–0.85  macro, 3.0×, centred on the publish button
//   0.15–0.62  cursor travels in from the lower right
//   0.68       press down (120ms) and back (80ms)
//   0.82       the ring leaves the button; the label becomes "Yayınlandı"
//   0.88–1.12  the tick draws
//   0.95–1.62  camera pulls back 3.0× → 1.0×, phone tilts −0.4° → −2.2°
//   1.05–2.00  "Sen sadece Yayınla'ya bastın."
//   1.58–1.82  the form cross-fades into the written listing
//   1.74–2.72  the description writes itself, a word at a time
//   2.14–3.00  "Açıklamayı Evlek yazdı."
//   2.20–2.72  the card turns to the second photograph
//   2.76       "Onayla" arrives in the slot the publish button used
//   3.02       the agent confirms
//   3.10–3.66  "Onayı sen veriyorsun."
//   3.16–3.42  confirmed, tick drawn
//   3.40–3.68  the first done-row slides in underneath

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, dur, ease, tp, press as pressAtT, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone, Cursor } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import content from '../content.json';

export const YAYINLA_SECONDS = 3.7;

/* Where the publish button sits in frame coordinates at 1×. Measured off a
   rendered still, not derived on paper — the macro shot is centred on it, so a
   20px error is a 60px drift during the pull-back. Re-measure if the layout of
   AgentPhone ever changes. */
const ORIGIN_X = 364;
const ORIGIN_Y = 1278;
const MACRO = 3.0;

/** The screen, as a pure function of act-local time. Nothing here reads a frame,
    which is what lets the cold open replay this same function at its own speed. */
export const yayinlaState = (t) => ({
  form: 1 - tp(t, 1.58, 1.82, ease.out),
  press: Math.max(pressAtT(t, 0.68), pressAtT(t, 3.02)),
  published: tp(t, 0.82, 1.02),
  publishedCheck: tp(t, 0.88, 1.12, ease.out),
  desc: tp(t, 1.74, 2.72, ease.linear),
  photoIdx: tp(t, 2.20, 2.72, ease.inOut),
  confirm: tp(t, 2.76, 2.96),
  confirmed: tp(t, 3.16, 3.34),
  confirmedCheck: tp(t, 3.20, 3.42, ease.out),
  langs: 0,
  stageOn: 0,
  stage: 0,
  match: 0,
  rows: { desc: tp(t, 3.40, 3.68), lang: 0, photo: 0, match: 0 },
});

export const Yayinla = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const s = yayinlaState(t);

  // Held at 3× for the first 0.95s. The hold is what makes the pull-back land; a
  // move that starts immediately has nothing to leave.
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
  const travel2 = tp(t, 2.58, 2.96, ease.out);
  const curVisible =
    Math.min(1, travel * 4) * (1 - tp(t, 1.10, 1.30)) +
    Math.min(1, travel2 * 4) * (1 - tp(t, 3.30, 3.46));
  const curX = t < 2.0
    ? interpolate(travel, [0, 1], [ORIGIN_X + 190, ORIGIN_X - 34])
    : interpolate(travel2, [0, 1], [ORIGIN_X + 150, ORIGIN_X - 44]);
  const curY = t < 2.0
    ? interpolate(travel, [0, 1], [ORIGIN_Y + 240, ORIGIN_Y - 8])
    : interpolate(travel2, [0, 1], [ORIGIN_Y + 210, ORIGIN_Y + 60]);

  // Three lines, each on screen for roughly a second, each one line long. A 60px
  // headline that wraps to two is a headline that gets skipped at this speed.
  const l1 = holdLine(frame, 1.05, 2.00);
  const l2 = holdLine(frame, 2.14, 3.00);
  const l3 = holdLine(frame, 3.10, 3.66);

  // The vignette is the depth cue that sells the macro. It leaves with the move.
  const vig = 1 - camP;

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 200 }}>
          <div style={{ ...T.hook, fontSize: 68, color: C.navy, position: 'absolute', ...l1 }}>{content.copy.hook_2}</div>
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
          <Cursor x={curX} y={curY} opacity={Math.min(1, curVisible)} press={s.press} />
        )}
      </AbsoluteFill>

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
