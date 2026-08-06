// Act 4 · a production line, not a comparison. 4.03s.
//
// The act this replaces was a left-to-right wipe. A wipe is a COMPARISON
// instrument: it says "these two images differ". It cannot say "a system read
// your photograph and produced three new ones", because a wipe implies one image
// with a filter over it, and a handle implies the VIEWER is doing the work.
// Everything downstream of that — the 24px style blob at the bottom of frame, the
// disclosure floating as a legal sticker near a photograph, the headline with no
// information architecture under it — followed from having only ONE noun on
// screen: a rectangle of pixels that was the input on the left of a seam and the
// output on the right of it.
//
// So the act is now four states, and the source stays on screen ALONGSIDE its
// outputs at an identical crop:
//
//   SOURCE   your photograph, full bleed, plain, yours
//   DOCK     the same pixels physically shrink into a labelled source card,
//            and are then visibly READ
//   DEVELOP  a gold fan opens to three named slots which resolve top-to-bottom
//            out of a blurred copy of that same photograph
//   PROMOTE  a cursor picks one and it returns to full bleed — the dock played
//            backwards, which is what proves the 292px card was a complete image
//            all along rather than a crop
//
// Every card carries the SAME objectPosition, which is what makes the status line
// "AYNI ODA · AYNI AÇI" checkable by eye instead of merely asserted.
//
// DISCLOSURE. An adversarial read of the C2PA manifests found that every supplied
// photograph — including the empty room — is Google-generated
// (digitalSourceType: trainedAlgorithmicMedia). The panel's proposed sub-line
// "Oda gerçek, mobilya temsilî" would therefore have been a false statement
// printed inside the disclosure itself. The bar says what is true instead.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate } from 'remotion';
import { C, T, SANS, MONO, dur, ease, tp, press, SAFE, holdLine } from '../../../brand/tokens.js';
import { Cursor, DrawnCheck } from '../../../brand/ui.jsx';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const STAGING_SECONDS = 4.03;

const K = content.copy;
const VARIANTS = K.variants;                 // [{asset, label}] × 3

/* ── Geometry ──────────────────────────────────────────────────────────────
   Three output cards of 292 across a 920 column leave 22px gutters, which is
   what sets every x below. Source card and output cards share an aspect ratio
   to within 0.0005 and share objectPosition, so the four crops agree. */
const SRC = { x: 80, y: 492, w: 236, h: 340 };
const OUT = { y: 900, w: 292, h: 420, xs: [80, 394, 708] };
const FAN = { x: 198, y: 856 };
// Source 236x340 = 0.6941, outputs 292x420 = 0.6952. Sharing an aspect ratio and
// an objectPosition to three decimal places is what makes "AYNI ODA · AYNI AÇI"
// checkable by eye rather than merely asserted.
const OBJ_POS = '50% 46%';

/** The dock, as one progress value. Camera-level, so 420ms is legal here. */
const dockBox = (p) => ({
  left: interpolate(p, [0, 1], [0, SRC.x]),
  top: interpolate(p, [0, 1], [0, SRC.y]),
  width: interpolate(p, [0, 1], [1080, SRC.w]),
  height: interpolate(p, [0, 1], [1920, SRC.h]),
  borderRadius: interpolate(p, [0, 1], [0, 18]),
});

export const Staging = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  /* ── State ────────────────────────────────────────────────────────────── */
  const dock = tp(t, 0.58, 1.00, ease.inOut);
  const backdrop = tp(t, 0.58, 0.80, ease.out);
  const srcLabel = tp(t, 0.86, 1.06, ease.out);
  const scan = tp(t, 0.96, 1.24, ease.inOut);
  const fan = (i) => tp(t, 1.12 + i * 0.05, 1.34 + i * 0.05, ease.out);
  const slot = (i) => tp(t, 1.18 + i * 0.05, 1.38 + i * 0.05, ease.out);
  const develop = (i) => tp(t, 1.30 + i * 0.14, 1.72 + i * 0.14, ease.inOut);
  const bar = tp(t, 1.30, 1.58, ease.out);
  const cursorIn = tp(t, 2.30, 2.42, ease.out);
  const cursorGo = tp(t, 2.30, 2.58, ease.inOut);
  const cursorOut = tp(t, 2.86, 2.98, ease.out);
  const pick = tp(t, 2.64, 2.86, ease.out);
  const tap = tp(t, 2.62, 2.84, ease.out);
  const clear = tp(t, 2.92, 3.12, ease.out);
  // PROMOTE is the dock played backwards. It must also UNWIND the selection —
  // an adversarial read caught that the promoted hero would otherwise render at
  // scale 1.045 with a 42px gold glow bleeding off every edge of the frame.
  const promote = tp(t, 3.04, 3.46, ease.inOut);
  const grow = tp(t, 3.28, 3.60, ease.inOut);
  const subline = tp(t, 3.44, 3.66, ease.out);

  const h1 = holdLine(frame, 0.14, 1.16, { lenSec: dur.md, outLenSec: dur.sm });
  const h2 = holdLine(frame, 1.28, 2.94, { lenSec: dur.md, outLenSec: dur.sm });
  const h3 = holdLine(frame, 3.20, 3.90, { lenSec: dur.md, outLenSec: dur.sm });

  const statusIdx = t >= 2.02 ? 2 : t >= 1.30 ? 1 : 0;
  const statusIn = tp(t, 0.96, 1.16, ease.out) * (1 - clear);
  const progress = tp(t, 1.30, 2.00, ease.linear);

  // Full-bleed drift, for the first shot and the last.
  const drift = t < 1.0
    ? interpolate(t, [0, 1.0], [1.0, 1.016])
    : interpolate(t, [3.46, STAGING_SECONDS], [1.0, 1.026], { extrapolateLeft: 'clamp' });

  const scrims = Math.max(1 - tp(t, 0.58, 0.82), tp(t, 3.10, 3.42));
  const heroBox = dockBox(promote > 0 ? 1 - promote : dock);

  const FILL = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: OBJ_POS, display: 'block' };

  return (
    <AbsoluteFill style={{ background: '#0B1522', overflow: 'hidden' }}>
      {/* The blurred, darkened workbench the outputs are made on. It is the same
          photograph, so the outputs are visibly derived rather than fetched. */}
      <AbsoluteFill style={{ opacity: backdrop * (1 - promote) }}>
        <Img src={asset('stage_base')} style={{ ...FILL, filter: 'blur(34px) brightness(0.34) saturate(0.6)', transform: 'scale(1.08)' }} />
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(8,18,30,0.55) 0%, rgba(8,18,30,0.3) 40%, rgba(8,18,30,0.62) 100%)' }} />
      </AbsoluteFill>

      {/* THE SOURCE — full bleed, then docked, then promoted back out as the
          chosen render. One element for the whole act. */}
      <div
        style={{
          position: 'absolute',
          ...heroBox,
          overflow: 'hidden',
          transform: `scale(${(dock < 1 || promote > 0) ? drift : 1})`,
          opacity: 1 - clear * (promote > 0.001 ? 0 : 1),
          border: promote > 0.001 ? 'none' : `1.5px solid rgba(${255 - 54 * scan},${255 - 94 * scan},${255 - 168 * scan},${0.16 + 0.34 * scan})`,
          boxSizing: 'border-box',
        }}
      >
        <Img src={asset('stage_base')} style={{ ...FILL, opacity: promote > 0.001 ? 0 : 1 }} />
        {/* The promoted choice occupies the identical box, so the move reads as
            one object travelling rather than a swap. */}
        {promote > 0.001 && <Img src={asset(VARIANTS[1].asset)} style={FILL} />}

        {/* THE READ. A hairline sweeping the source, with a warm trailing band. */}
        {scan > 0.001 && scan < 0.999 && dock > 0.5 && (
          <>
            <div style={{ position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 2, background: 'rgba(255,246,228,0.9)', boxShadow: '0 0 26px rgba(255,240,210,0.7)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 56, marginTop: -56, background: 'linear-gradient(180deg, rgba(201,161,87,0) 0%, rgba(201,161,87,0.22) 100%)' }} />
          </>
        )}
      </div>

      {/* Source label, under the docked card. */}
      {srcLabel > 0.01 && clear < 0.99 && (
        <div
          style={{
            position: 'absolute', left: SRC.x + SRC.w + 24, top: SRC.y + SRC.h / 2 - 16,
            fontFamily: MONO, fontWeight: 500, fontSize: 26,
            letterSpacing: '0.14em', color: 'rgba(255,255,255,0.62)',
            opacity: srcLabel * (1 - clear), transform: `translateY(${clear * 6}px)`,
          }}
        >
          {K.stage_src_label}
        </div>
      )}

      {/* THE FAN — three strands from the source to three empty slots. */}
      {clear < 0.99 && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - clear }}>
          {OUT.xs.map((x, i) => {
            const p = fan(i);
            if (p <= 0.001) return null;
            const cx = x + OUT.w / 2;
            return (
              <path
                key={x}
                d={`M ${FAN.x} ${FAN.y} Q ${FAN.x} ${(FAN.y + OUT.y) / 2} ${cx} ${OUT.y}`}
                fill="none" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round"
                pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} opacity={0.72}
              />
            );
          })}
          {fan(0) > 0.001 && <circle cx={FAN.x} cy={FAN.y} r={5} fill={C.gold} opacity={0.9} />}
        </svg>
      )}

      {/* THE THREE OUTPUTS. Each slot already holds a blurred copy of the source,
          so the furnished image resolves OUT OF the agent's own photograph. */}
      {OUT.xs.map((x, i) => {
        const s = slot(i);
        if (s <= 0.001) return null;
        const d = develop(i);
        const chosen = i === 1;
        const sel = chosen ? pick : 0;
        const gone = chosen ? clear * 0 : clear;
        // Promote unwinds the pick: by the time the hero is full bleed there is
        // no lifted card and no glow left anywhere in the frame.
        const un = 1 - promote;
        return (
          <div key={x} style={{ position: 'absolute', left: x, top: OUT.y, width: OUT.w, opacity: (1 - gone) * (chosen ? un : 1) }}>
            <div
              style={{
                position: 'relative', width: OUT.w, height: OUT.h,
                borderRadius: 18, overflow: 'hidden',
                transform: `scale(${(0.965 + 0.035 * s) * (1 + 0.045 * sel * un) * (1 - 0.035 * (chosen ? 0 : clear))})`,
                border: `${1.5 + 1.5 * sel * un}px solid rgba(201,161,87,${0.12 + 0.83 * sel * un})`,
                boxShadow: sel > 0.02 ? `0 0 ${42 * sel * un}px rgba(201,161,87,0.5)` : 'none',
                opacity: chosen ? 1 : 1 - 0.66 * pick,
                filter: chosen ? 'none' : `saturate(${1 - 0.45 * pick})`,
                boxSizing: 'border-box',
              }}
            >
              <Img src={asset('stage_base')} style={{ ...FILL, filter: 'blur(16px) brightness(0.5)' }} />
              {d > 0.001 && (
                <Img src={asset(VARIANTS[i].asset)} style={{ ...FILL, clipPath: `inset(0 0 ${(1 - d) * 100}% 0)` }} />
              )}
              {d > 0.02 && d < 0.98 && (
                <div style={{ position: 'absolute', left: 0, right: 0, top: `${d * 100}%`, height: 3, background: '#FFF6E4', boxShadow: '0 0 22px rgba(201,161,87,0.9)' }} />
              )}
              {chosen && pick > 0.02 && (
                <div
                  style={{
                    position: 'absolute', left: OUT.w / 2 - 26, top: 14, width: 52, height: 52,
                    borderRadius: 16, background: 'rgba(10,37,64,0.86)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: pick * un,
                  }}
                >
                  <DrawnCheck p={tp(t, 2.68, 2.90, ease.out)} size={28} color={C.gold} width={2.8} />
                </div>
              )}
            </div>
            <div
              style={{
                marginTop: 14, textAlign: 'center',
                fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: chosen && pick > 0.4 ? C.gold : 'rgba(255,255,255,0.66)',
                opacity: s,
              }}
            >
              {VARIANTS[i].label}
            </div>
            {chosen && pick > 0.02 && (
              <div style={{ height: 3, background: C.gold, transform: `scaleX(${pick * un})`, marginTop: 8 }} />
            )}
          </div>
        );
      })}

      {/* Tap ring — the choice has a visible cause. */}
      {tap > 0.01 && tap < 0.999 && (
        <div
          style={{
            position: 'absolute', left: 540 - 24 - 54 * tap, top: 1110 - 24 - 54 * tap,
            width: 48 + 108 * tap, height: 48 + 108 * tap, borderRadius: 999,
            border: `2px solid rgba(201,161,87,${0.62 * (1 - tap)})`,
          }}
        />
      )}

      {cursorIn > 0.02 && cursorOut < 0.98 && (
        <Cursor
          x={interpolate(cursorGo, [0, 1], [830, 533])}
          y={interpolate(cursorGo, [0, 1], [1560, 1102])}
          opacity={cursorIn * (1 - cursorOut)}
          press={press(t, 2.60)}
        />
      )}

      {/* Scrims for the full-bleed states only. */}
      <AbsoluteFill
        style={{
          opacity: scrims,
          background: 'linear-gradient(180deg, rgba(6,22,40,0.86) 0%, rgba(6,22,40,0.62) 18%, rgba(8,28,50,0.2) 36%, rgba(10,37,64,0) 58%, rgba(10,37,64,0.5) 100%)',
        }}
      />
      <Grain opacity={0.045} />

      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 160 }}>
          {[[K.line_photo, h1], [K.line_variants, h2], [K.line_stage_ready, h3]].map(([txt, st], i) => (
            <div key={i} style={{ ...T.headline, color: C.white, textShadow: '0 2px 24px rgba(4,14,28,0.8)', position: 'absolute', ...st }}>
              {txt}
            </div>
          ))}
        </div>
      )}

      {/* STATUS. A determinate bar, not a spinner: a spinner says "waiting", a
          filling rule says "a machine is producing a known number of things". */}
      {statusIn > 0.02 && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 396, opacity: statusIn }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {statusIdx === 2
              ? <DrawnCheck p={tp(t, 2.04, 2.26, ease.out)} size={26} color={C.gold} width={2.8} />
              : (
                <svg width="26" height="26" viewBox="0 0 26 26">
                  <circle cx="13" cy="13" r="10" stroke="rgba(255,255,255,0.18)" strokeWidth="2.6" fill="none" />
                  <circle cx="13" cy="13" r="10" stroke={C.gold} strokeWidth="2.6" fill="none" strokeLinecap="round"
                          pathLength="1" strokeDasharray="0.28 0.72" strokeDashoffset={-((t * 1.15) % 1)} />
                </svg>
              )}
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 25, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)' }}>
              {K.stage_status[statusIdx]}
            </span>
          </div>
          {statusIdx === 1 && (
            <div style={{ width: 380, height: 3, marginTop: 14, background: 'rgba(255,255,255,0.14)' }}>
              <div style={{ height: 3, background: C.gold, transform: `scaleX(${progress})`, transformOrigin: 'left center' }} />
            </div>
          )}
        </div>
      )}

      {/* THE DISCLOSURE. One element that escalates — it arrives on the exact
          frame the first generated pixel exists and never leaves. The bar makes
          room first and the sub-line arrives second; two moves, never at once. */}
      {bar > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: interpolate(grow, [0, 1], [1416, 1296]),
            width: 920,
            height: interpolate(grow, [0, 1], [58, 116]),
            borderRadius: interpolate(grow, [0, 1], [999, 20]),
            borderLeft: `${5 * grow}px solid ${C.gold}`,
            background: `rgba(6,22,40,${0.72 + 0.16 * grow})`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            paddingLeft: interpolate(grow, [0, 1], [0, 26]),
            alignItems: grow > 0.5 ? 'flex-start' : 'center',
            opacity: bar,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width={22 + 4 * grow} height={22 + 4 * grow} viewBox="0 0 40 40">
              <path d="M20 2 Q22.4 15.6 38 20 Q22.4 24.4 20 38 Q17.6 24.4 2 20 Q17.6 15.6 20 2 Z" fill={C.gold} />
            </svg>
            <span
              style={{
                fontFamily: SANS, fontWeight: 600,
                fontSize: interpolate(grow, [0, 1], [30, 34]),
                color: 'rgba(255,255,255,0.95)',
              }}
            >
              {K.disclosure}
            </span>
          </div>
          {subline > 0.01 && (
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: 'rgba(255,255,255,0.6)', marginTop: 6, opacity: subline }}>
              {K.disclosure_sub}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
