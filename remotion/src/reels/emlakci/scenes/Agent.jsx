// Acts 1–4 · the agent's side, one continuous shot (0.00 → 10.80).
//
// The whole act is driven by ONE function: stateAt(t) returns what the screen
// looks like at film-time t. The cold open then plays stateAt over a compressed
// clock and the rewind plays it backwards. That is why the hook can claim
// "you didn't do this" without lying — it is not a separate animation, it is
// this exact timeline at roughly 8×.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, dur, at, ease, f, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone, Cursor } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import content from '../content.json';

const K = content.copy;

/* ── The real timeline, in film seconds ──────────────────────────────────── */
const T0 = {
  publishPress: 2.10,
  published: 2.28,
  descFrom: 2.70, descTo: 3.90,
  confirmShow: 4.00, confirmPress: 4.35, confirmed: 4.49,
  rowDesc: 4.60,
  langsFrom: 4.85, langsTo: 5.55,
  rowLang: 5.60,
  stageToggle: 5.95, stageFrom: 6.35, stageTo: 7.55,
  rowPhoto: 7.75,
  matchFrom: 8.55, matchTo: 10.10,
  rowMatch: 10.20,
};

const p01 = (t, a, b, easing = ease.out) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** Everything the screen shows, as a pure function of film time. */
export const stateAt = (t) => {
  const isForm = t < T0.published;
  return {
    form: isForm ? 1 : 0,
    // Asymmetric on purpose: 120ms down (the human's deliberate act), 80ms back
    // (the machine's answer). Symmetric press timing is a craft finding.
    press: Math.max(
      Math.max(0, p01(t, T0.publishPress, T0.publishPress + 0.12) - p01(t, T0.publishPress + 0.12, T0.publishPress + 0.20)),
      Math.max(0, p01(t, T0.confirmPress, T0.confirmPress + 0.12) - p01(t, T0.confirmPress + 0.12, T0.confirmPress + 0.20)),
    ),
    published: p01(t, T0.published, T0.published + dur.md),
    desc: p01(t, T0.descFrom, T0.descTo, ease.linear),
    confirm: p01(t, T0.confirmShow, T0.confirmShow + dur.sm),
    confirmed: p01(t, T0.confirmed, T0.confirmed + dur.sm),
    langs: p01(t, T0.langsFrom, T0.langsTo, ease.linear),
    stageOn: p01(t, T0.stageToggle, T0.stageToggle + dur.md),
    stage: p01(t, T0.stageFrom, T0.stageTo, ease.inOut),
    match: p01(t, T0.matchFrom, T0.matchTo, ease.out),
    rows: {
      desc: p01(t, T0.rowDesc, T0.rowDesc + dur.md),
      lang: p01(t, T0.rowLang, T0.rowLang + dur.md),
      photo: p01(t, T0.rowPhoto, T0.rowPhoto + dur.md),
      match: p01(t, T0.rowMatch, T0.rowMatch + dur.md),
    },
  };
};

/* ── Cold open ────────────────────────────────────────────────────────────
   0.00–1.20 the journey at ~8×, 1.20–1.55 rewound to the start. */
const COLD_END = 1.20;
const REWIND_END = 1.55;
const JOURNEY_START = 2.28;
const JOURNEY_END = 10.30;

const clockFor = (t) => {
  if (t < COLD_END) {
    return interpolate(t, [0, COLD_END], [JOURNEY_START, JOURNEY_END], { easing: ease.inOut });
  }
  if (t < REWIND_END) {
    // Rewind: fast and it lands exactly on the form state. inOut, because this
    // is one element moving on screen rather than something entering or leaving.
    return interpolate(t, [COLD_END, REWIND_END], [JOURNEY_END, 1.95], { easing: ease.inOut });
  }
  return t;
};

export const Agent = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const s = stateAt(clockFor(t));

  // The device drifts for the entire film; a still phone reads as a slide.
  const drift = t / 10.8;
  const tilt = -2.4 + drift * 1.6;
  const scale = 1 + drift * 0.018;

  // During the rewind the screen scrubs backwards — a short blur sell.
  const rewinding = t >= COLD_END && t < REWIND_END ? 1 : 0;

  // Cursor: only present when it has something to press.
  const curPublish = at(frame, 1.70, 0.34, ease.out);
  const curConfirm = at(frame, 4.00, 0.30, ease.out);
  const cursorVisible =
    Math.min(1, curPublish * 3) * (1 - at(frame, 2.45, 0.2, ease.out)) +
    Math.min(1, curConfirm * 3) * (1 - at(frame, 4.70, 0.2, ease.out));

  const cursorX = t < 3
    ? interpolate(curPublish, [0, 1], [560, 322])
    : interpolate(curConfirm, [0, 1], [520, 300]);
  const cursorY = t < 3
    ? interpolate(curPublish, [0, 1], [1500, 1318])
    : interpolate(curConfirm, [0, 1], [1480, 1262]);

  /* ── Headlines on the canvas, above the device ─────────────────────── */
  const hook1 = holdLine(frame, 0.18, 1.18, { lenSec: dur.sm });
  const hook2 = holdLine(frame, 1.42, 2.55, { lenSec: dur.sm });
  const l1 = holdLine(frame, 2.72, 4.55);
  const l2 = holdLine(frame, 4.70, 5.85);
  const l3 = holdLine(frame, 6.00, 8.30);
  const l4 = holdLine(frame, 8.45, 10.70);

  const Line = ({ style, children, big }) => (
    <div
      style={{
        ...(big ? T.hook : T.headline),
        color: C.navy,
        position: 'absolute',
        left: 0, right: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: C.creamWarm }}>
      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 282, right: SAFE.right, height: 200 }}>
        <Line big style={hook1}>{K.hook_1}</Line>
        <Line big style={hook2}>{K.hook_2}</Line>
        <Line style={l1}>{K.line_written}</Line>
        <Line style={l2}>{K.line_langs}</Line>
        <Line style={l3}>{K.line_photo}</Line>
        <Line style={l4}>{K.line_match}</Line>
      </div>

      <Phone tilt={tilt} scale={scale} top={430}>
        <div style={{ filter: rewinding ? 'blur(1.4px)' : 'none' }}>
          <AgentPhone s={s} />
        </div>
        {cursorVisible > 0.02 && (
          <Cursor x={cursorX} y={cursorY} opacity={Math.min(1, cursorVisible)} press={s.press} />
        )}
      </Phone>
    </AbsoluteFill>
  );
};

export const AGENT_SECONDS = 10.8;
