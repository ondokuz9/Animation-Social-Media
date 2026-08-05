// Act 3 · five languages, as typography. No device, no card, no photograph. 2.20s.
//
// The register here is type alone. The description the product wrote fills the
// frame and then becomes another language, and another — the sentence itself is
// the subject. Five chips reading "TR EN RU DE AR" would state the feature;
// watching the sentence turn into Russian demonstrates it, and demonstration is
// what a twenty-second film has time for.
//
// The holds accelerate: Turkish gets 0.55s because it is the only one this
// audience reads, then each language gets less than the one before. The
// acceleration is the argument — it says "and it keeps going" without a line of
// copy claiming it.
//
// Arabic is last and it flips the whole block right-to-left. That detail is the
// point: this is not a translation label bolted onto a Turkish layout, it is the
// listing as that buyer actually sees it.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, SANS, MONO, dur, at, ease, tp, SAFE, holdLine } from '../../../brand/tokens.js';
import content from '../content.json';

export const DILLER_SECONDS = 2.7;

const L = content.copy.translations;      // [{code, text, rtl}]

/** Where each language starts. Turkish is the one this audience reads and it now
    holds for 0.75s — long enough to actually finish the sentence — then each of
    the others gets a little less than the one before. The acceleration is the
    argument: it says "and it keeps going" without a line of copy claiming it.
    An earlier cut gave Turkish 0.55s and the rest 0.26–0.32s, which was below
    the threshold at which a reader even registers that the script changed. */
const START = [0.34, 1.09, 1.53, 1.92, 2.26];
const END = DILLER_SECONDS;
const TRANS = 0.20;                        // how long one language becomes the next

const TICK_W = 78;                         // ticker cell, fixed so the underline
const TICK_GAP = 14;                       // can slide to a computed position

export const Diller = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  // Index, and how far the handover to the next language has come.
  let i = 0;
  for (let k = 0; k < START.length; k++) if (t >= START[k]) i = k;
  const nextStart = i + 1 < START.length ? START[i + 1] : END + 1;
  const trans = tp(t, nextStart - TRANS, nextStart, ease.inOut);
  const j = Math.min(L.length - 1, i + 1);

  // Two headlines, one line each. "Sen Türkçe yaz." while the Turkish sentence is
  // on screen; "Beş dilde yayınlansın." as it starts turning into the others. The
  // single wrapping headline this replaces said both things at once and was read
  // as neither.
  // The handover matters. Turkish starts turning into English at 0.89, so
  //  "Sen Türkçe yaz." has to be gone by then — an earlier cut held it to 1.22
  // and there were 20 frames of that line sitting over an English sentence,
  // which is the exact opposite of what the act is claiming.
  const line1 = holdLine(frame, 0.10, 0.78);
  const line2 = holdLine(frame, 0.96, 2.52);
  const intro = tp(t, 0.24, 0.24 + dur.lg, ease.out);   // t, not frame — see Staging

  // A slow, continuous rise across the whole act. Between one language and the
  // next this scene has literally nothing moving, and a frame-hash audit found
  // 16 consecutive identical frames sitting on the Arabic. Every other act in the
  // film carries a push or a parallax; this is Diller's.
  const drift = interpolate(t, [0, DILLER_SECONDS], [7, -7]);

  // The underline slides between codes instead of jumping. A hard switch reads
  // as five separate states; a slide reads as one thing moving through them.
  const railX = interpolate(i + trans, [0, L.length - 1], [0, (L.length - 1) * (TICK_W + TICK_GAP)]);

  const Sentence = ({ item, opacity, blur, dy }) => (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, top: '50%',
        direction: item.rtl ? 'rtl' : 'ltr',
        textAlign: item.rtl ? 'right' : 'left',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: item.rtl ? 62 : 58,
        lineHeight: 1.34,
        letterSpacing: item.rtl ? '0' : '-0.015em',
        color: C.navy,
        opacity,
        filter: blur > 0.012 ? `blur(${blur * 8}px)` : 'none',
        transform: `translateY(-50%) translateY(${dy}px)`,
        willChange: 'filter, opacity, transform',
      }}
    >
      {item.text}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {/* One quiet rule, so the frame is composed rather than floating. */}
      <div
        style={{
          position: 'absolute', left: SAFE.left + 20, top: 476,
          width: 96, height: 3, background: C.gold,
          transform: `scaleX(${intro})`, transformOrigin: 'left center',
        }}
      />

      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...line1 }}>{content.copy.line_langs}</div>
          <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...line2 }}>{content.copy.line_langs_2}</div>
        </div>
      )}

      {/* Fixed block, vertically centred: Russian runs two lines longer than
          German and the sentence must not jump when it changes. */}
      <div style={{ position: 'absolute', left: SAFE.left + 20, right: SAFE.right, top: 580, height: 500, transform: `translateY(${drift}px)` }}>
        <Sentence item={L[i]} opacity={intro * (1 - trans)} blur={trans} dy={-trans * 12} />
        {trans > 0.001 && (
          <Sentence item={L[j]} opacity={trans} blur={1 - trans} dy={(1 - trans) * 16} />
        )}
      </div>

      {/* The language's own name for itself. It fills the band under the
          sentence, and it is the one place the act names what it is doing —
          in the language it is doing it in, which is the whole point. */}
      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 1120, height: 90, right: SAFE.right, transform: `translateY(${drift * 0.6}px)` }}>
        {L.map((l, k) => {
          const on = k === i ? 1 - trans : k === j && trans > 0 ? trans : 0;
          if (on <= 0.001) return null;
          return (
            <div
              key={l.code}
              style={{
                position: 'absolute', left: 0, top: 0,
                fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: '-0.01em',
                color: C.gold, opacity: on * intro,
                transform: `translateY(${(1 - on) * 12}px)`,
              }}
            >
              {l.name}
            </div>
          );
        })}
      </div>

      {/* Language codes with a sliding underline. */}
      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 1256, opacity: intro }}>
        <div style={{ display: 'flex', gap: TICK_GAP }}>
          {L.map((l, k) => (
            <div
              key={l.code}
              style={{
                width: TICK_W,
                fontFamily: MONO, fontWeight: 500, fontSize: 32, letterSpacing: '0.08em',
                color: k === i ? C.navy : C.ink(k < i ? 0.46 : 0.28),
                transform: `translateY(${k === i ? -2 : 0}px)`,
              }}
            >
              {l.code}
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', height: 3, marginTop: 12 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: C.ink(0.16) }} />
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: TICK_W, height: 3,
              background: C.gold, transform: `translateX(${railX}px)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
