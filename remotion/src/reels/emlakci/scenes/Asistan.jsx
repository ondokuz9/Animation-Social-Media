// Act 7 · somebody else's assistant, answering out of your listing. 4.20s.
//
// The client's note on the version this replaces was "sanki evlek ai gibi" — as
// if Evlek had shipped a chatbot. They were right, and it was not a polish
// problem: the frame contained only one party's colours. Evlek navy ground,
// Evlek cobalt bloom, a filled gold sparkle sitting exactly where an assistant's
// identity belongs, and the citation typeset as one more Evlek card. Nothing in
// the picture belonged to anybody else, so the only available reading was that
// Evlek was the one talking.
//
// The claim is the opposite of that and it is far stronger: a buyer asks some
// OTHER assistant, and that assistant answers out of the agent's Evlek listing
// and points at it. Being the source that outside AI quotes is the proposition.
//
// Two mechanisms carry it, and neither is a label:
//
//   THE SEAM.  A graphite panel with 80px of Evlek navy visible around it on
//              every side. Ownership is a boundary, and you cannot draw a
//              boundary with one surface. Zero gold exists inside that panel
//              until 3.02 — 72% of the way through the act.
//
//   THE LIST.  The panel names THREE sources and only one of them — yours —
//              ever resolves. A first-party chatbot has no sources list, and
//              certainly does not list two others beside itself. This is the
//              logical proof of externality that no amount of colour can supply.
//
// And one structural inversion carries the CAUSAL claim: THE SOURCE CARD ARRIVES
// BEFORE THE ANSWER AND IS VISIBLY READ. A light sweeps down the agent's listing
// while the status says KAYNAK ARANIYOR; the status flips to KAYNAK BULUNDU;
// only then does the first word appear. Causality becomes a fact about ORDER,
// which a silent viewer cannot misparse — where a connector line drawn between
// two finished things reads as an infographic.
//
// The answer quotes, verbatim, the sentence the film showed Evlek writing in act
// 2 and translating in act 3. Evlek wrote it, the machine reads it back. Nobody
// has to be told. The previous answer asserted "yaklaşık 450 metre", a figure
// that appears nowhere in content.json and that the cited card could therefore
// never corroborate; it is gone.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate } from 'remotion';
import { C, T, SANS, MONO, dur, ease, tp, SAFE, holdLine } from '../../../brand/tokens.js';
import { asset, Grain } from '../parts.jsx';
import content from '../content.json';

export const ASISTAN_SECONDS = 4.2;

const A = content.copy.assistant;
const K = content.copy;

/* The host's surface. Deliberately none of Evlek's colours and none of Evlek's
   radii — 36, where every Evlek card in this film is 28. */
const HOST = { bg: '#171A20', x: 80, y: 476, w: 920, h: 1024, r: 36 };
const COL = { x: 114, w: 852 };
const CARD = { y: 1146, h: 212 };

const DESC = content.copy.description;
const CITE = A.cite_phrase;
const DESC_PRE = DESC.slice(0, DESC.indexOf(CITE));
const DESC_POST = DESC.slice(DESC.indexOf(CITE) + CITE.length);

/** A left-to-right highlight that survives line wrapping. An absolutely
    positioned rect behind an inline span paints the span's whole bounding box,
    which for a wrapping phrase is a full-width gold block; a background-size
    sweep with box-decoration-break: clone paints each line fragment correctly. */
const lit = (p) => ({
  backgroundImage: 'linear-gradient(rgba(201,161,87,0.26), rgba(201,161,87,0.26))',
  backgroundRepeat: 'no-repeat',
  backgroundSize: `${p * 100}% 100%`,
  boxDecorationBreak: 'clone',
  WebkitBoxDecorationBreak: 'clone',
  padding: '0.06em 0',
});

/** Word-at-a-time reveal over a fixed token list, so the three answer segments
    share one clock and the middle one can carry the highlight. */
const Seg = ({ text, shown, style }) => {
  const words = text.split(' ');
  return (
    <span style={style}>
      {words.map((w, i) => {
        const o = Math.max(0, Math.min(1, shown - i));
        return (
          <span key={i} style={{ opacity: o, marginRight: '0.28em', display: 'inline-block' }}>{w}</span>
        );
      })}
    </span>
  );
};

export const Asistan = ({ tOverride, bare = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tOverride ?? frame / fps;

  const panel = tp(t, 0.00, 0.30, ease.out);
  // 0.22, not 0.34: the act's first sampled frame used to be the panel sitting
  // empty for most of half a second. The question now enters while the panel is
  // still settling — an app opening onto a conversation, not before one.
  const q = tp(t, 0.22, 0.50, ease.out);
  const chip = tp(t, 0.58, 0.78, ease.out);
  const card = tp(t, 0.96, 1.24, ease.out);
  const divider = tp(t, 0.96, 1.24, ease.out);
  const others = (i) => tp(t, 1.06 + i * 0.06, 1.34 + i * 0.06, ease.out);
  const scan = tp(t, 1.10, 1.52, ease.inOut);
  const flip = tp(t, 1.46, 1.62, ease.out);
  // The flip is a SWAP with disjoint windows — the two states never share more
  // than a sliver of opacity. The old single-progress cross-move left ARANIYOR
  // and BULUNDU superimposed at 50/50 in a sampled frame: an unreadable pile of
  // letters at the exact moment the act proves its causal claim.
  const flipOut = tp(flip, 0, 0.55);
  const flipIn = tp(flip, 0.45, 1);
  // The card's text is skeleton-dim until the scan has passed over it: a source
  // whose description is readable while the status still says ARANIYOR has
  // already been found.
  const readIn = 0.35 + 0.65 * tp(t, 1.34, 1.58, ease.out);
  const ansIn = tp(t, 1.60, 1.88, ease.out);
  const railGrey = tp(t, 1.60, 1.88, ease.out);
  // 13 tokens over 1.18s = 11.0 tokens/s, under the film's 12/s ceiling.
  const write = tp(t, 1.66, 2.84, ease.linear) * 13;
  const railGold = tp(t, 3.02, 3.42, ease.inOut);
  const resolve = tp(t, 3.06, 3.34, ease.out);
  const proof = tp(t, 3.30, 3.52, ease.out);
  const pill = tp(t, 3.42, 3.62, ease.out);
  const handoff = tp(t, 3.46, 3.68, ease.out);

  const line1 = holdLine(frame, 0.08, 2.72);
  const line2 = holdLine(frame, 2.86, 4.06);

  // Achromatic. The cobalt bloom this replaces was bleeding Evlek's interaction
  // colour onto the host's panel — a quiet half of the "evlek ai" reading.
  const bloomY = interpolate(t, [0, ASISTAN_SECONDS], [36, 46]);
  const groupDrift = interpolate(t, [0, ASISTAN_SECONDS], [5, -7]);

  // Cream, reached by interpolating the components — never filter: brightness.
  const cardBg = `rgba(${Math.round(255 * (1 - resolve) + 244 * resolve)},${Math.round(255 * (1 - resolve) + 241 * resolve)},${Math.round(255 * (1 - resolve) + 235 * resolve)},${0.055 + 0.945 * resolve + 0.045 * scan * (1 - resolve)})`;
  const inkOn = (a) => `rgba(${Math.round(255 * (1 - resolve) + 10 * resolve)},${Math.round(255 * (1 - resolve) + 37 * resolve)},${Math.round(255 * (1 - resolve) + 64 * resolve)},${a})`;

  return (
    <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(1200px 900px at 50% ${bloomY}%, rgba(255,255,255,0.06), rgba(10,37,64,0) 66%)` }}
      />
      {handoff > 0.01 && (
        <AbsoluteFill
          style={{
            opacity: handoff,
            background: 'radial-gradient(700px 300px at 50% 68%, rgba(201,161,87,0.14), rgba(10,37,64,0) 70%)',
          }}
        />
      )}
      <Grain opacity={0.05} />

      {/* Evlek narrating somebody else's screen, from outside the panel. */}
      {!bare && (
        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 170 }}>
          <div style={{ ...T.headline, color: C.white, position: 'absolute', ...line1 }}>{K.line_assistant_1}</div>
          <div style={{ ...T.headline, color: C.white, position: 'absolute', ...line2 }}>{K.line_assistant}</div>
        </div>
      )}

      {/* ── THE FOREIGN PANEL ─────────────────────────────────────────────
          It arrives EMPTY and complete, header already filled. The viewer must
          read "an application" before they read "a message". */}
      <div
        style={{
          position: 'absolute', left: HOST.x, top: HOST.y, width: HOST.w, height: HOST.h,
          borderRadius: HOST.r, background: HOST.bg,
          border: '1.5px solid rgba(255,255,255,0.15)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 44px 110px rgba(0,0,0,0.55), 0 0 90px rgba(255,255,255,0.05)',
          opacity: Math.min(1, panel * 1.7),
          transform: `translateY(${(1 - panel) * 30 + groupDrift}px) scale(${0.976 + 0.024 * panel})`,
          overflow: 'hidden',
        }}
      >
        {/* Header. A six-point stroked asterisk — punctuation, not a logo, and
            deliberately not Evlek's filled gold star. */}
        <div style={{ position: 'absolute', left: 34, top: 26, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 15,
              background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              {[0, 60, 120].map((a) => (
                <line
                  key={a} x1={15 - 11 * Math.cos((a * Math.PI) / 180)} y1={15 - 11 * Math.sin((a * Math.PI) / 180)}
                  x2={15 + 11 * Math.cos((a * Math.PI) / 180)} y2={15 + 11 * Math.sin((a * Math.PI) / 180)}
                  stroke="rgba(255,255,255,0.78)" strokeWidth="2.4" strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 25, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)' }}>
            {A.surface}
          </span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 104, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Everything inside the panel is positioned in frame coordinates so the
          group can drift as one without nesting transforms. */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${groupDrift}px)`, opacity: panel }}>
        {/* The buyer's question — a discovery question, not a detail lookup. */}
        <div
          style={{
            position: 'absolute', right: 1080 - 966, top: 622, maxWidth: 700,
            opacity: q, transform: `translateY(${(1 - q) * 18}px) translateX(${(1 - q) * 20}px)`,
          }}
        >
          <div
            style={{
              fontFamily: SANS, fontWeight: 500, fontSize: 36, lineHeight: 1.3,
              background: '#E7E8EB', color: '#16181D',
              padding: '22px 30px', borderRadius: 28, borderBottomRightRadius: 10,
            }}
          >
            {A.question}
          </div>
        </div>

        {/* Status chip. This, not an icon, is what locates the assistant out on
            the open web rather than inside our product. */}
        <div
          style={{
            position: 'absolute', left: COL.x, top: 764, height: 48, width: 268,
            borderRadius: 12, background: 'rgba(255,255,255,0.07)',
            border: `1px solid rgba(255,255,255,${0.14 + 0.08 * flip})`,
            display: 'flex', alignItems: 'center', paddingLeft: 18,
            overflow: 'hidden',
            opacity: chip, transform: `translateY(${(1 - chip) * 8}px)`,
          }}
        >
          {/* An odometer flip, not a crossfade: one leaves upward, one arrives
              from below, 100ms, so the state CHANGES rather than dissolving. */}
          <span style={{ position: 'absolute', left: 18, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', opacity: 1 - flipOut, transform: `translateY(${-14 * flipOut}px)` }}>
            {A.state_1}
          </span>
          <span style={{ position: 'absolute', left: 18, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.72)', opacity: flipIn, transform: `translateY(${14 * (1 - flipIn)}px)` }}>
            {A.state_2}
          </span>
        </div>

        {/* THE ANSWER. No bubble — a system answer is not a person speaking; the
            rail is its container. Grey while it belongs to the assistant. */}
        <div style={{ position: 'absolute', left: COL.x, top: 842, width: COL.w, opacity: ansIn * (1 - 0.38 * handoff) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 3, height: 182, background: 'rgba(255,255,255,0.15)', transform: `scaleY(${railGrey * (1 - railGold)})`, transformOrigin: 'top center' }} />
          <div
            style={{
              paddingLeft: 36, fontFamily: SANS, fontWeight: 500, fontSize: 40, lineHeight: 1.44,
              color: 'rgba(255,255,255,0.93)', minHeight: 182,
              transform: `translateY(${(1 - ansIn) * 12}px)`,
            }}
          >
            <Seg text={A.answer_pre} shown={write} />
            <Seg text={A.answer_cite} shown={write - 4} style={proof > 0.001 ? lit(proof) : undefined} />
            <Seg text={A.answer_post} shown={write - 7} />
          </div>
        </div>

        {/* THE GOLD RAIL — the first gold pixel in the act, at 72% of it. It
            draws BOTTOM-UP, from the card's foot to the answer's cap line:
            upward is the direction of causality, source → answer, and it is also
            what stops the line reading as a progress bar. */}
        {railGold > 0.001 && (
          <>
            <div
              style={{
                position: 'absolute', left: COL.x, top: 842, width: 3, height: CARD.y + CARD.h - 842,
                background: C.gold, transform: `scaleY(${railGold})`, transformOrigin: 'bottom center',
              }}
            />
            {railGold < 0.999 && (
              <div
                style={{
                  position: 'absolute', left: COL.x - 2.5,
                  top: interpolate(railGold, [0, 1], [CARD.y + CARD.h, 842]) - 4,
                  width: 8, height: 8, borderRadius: 999, background: '#FFF4DE',
                  boxShadow: '0 0 22px rgba(201,161,87,0.95)',
                }}
              />
            )}
          </>
        )}

        {/* KAYNAKLAR */}
        <div style={{ position: 'absolute', left: COL.x + 36, top: 1064, opacity: divider, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.42)' }}>
          {A.sources}
        </div>
        <div style={{ position: 'absolute', left: COL.x + 190, right: 1080 - 966, top: 1074, height: 1, background: 'rgba(255,255,255,0.12)', transform: `scaleX(${divider})`, transformOrigin: 'left center' }} />

        {/* THE SOURCE CARD — arrives before the answer, unresolved, and is read. */}
        <div
          style={{
            position: 'absolute', left: COL.x, top: CARD.y, width: COL.w, height: CARD.h,
            borderRadius: 20, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            background: cardBg,
            border: `1px solid rgba(255,255,255,${0.1 * (1 - resolve)})`,
            boxShadow: resolve > 0.02 ? `0 24px 60px rgba(0,0,0,0.42), 0 0 ${40 * resolve}px rgba(201,161,87,0.26)` : 'none',
            opacity: card,
            transform: `translateY(${(1 - card) * 24 - 8 * handoff}px)`,
            display: 'flex', alignItems: 'center', gap: 20, padding: 16,
            overflow: 'hidden', boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'relative', width: 156, height: 180, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            <Img
              src={asset('stage_akdeniz')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.34 + 0.28 * scan + 0.38 * resolve }}
            />
            {/* The thumbnail is an AI visualisation and says so. */}
            <div
              style={{
                position: 'absolute', left: 6, bottom: 6,
                fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.92)', background: 'rgba(4,14,28,0.72)',
                padding: '3px 8px', borderRadius: 6, opacity: resolve,
              }}
            >
              {A.temsili}
            </div>
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: resolve > 0.4 ? C.gold : 'transparent',
                  border: `1.5px solid rgba(255,255,255,${0.3 * (1 - resolve)})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontWeight: 500, fontSize: 18, color: '#1B1204',
                }}
              >
                {resolve > 0.4 ? '1' : ''}
              </div>
              <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '0.06em', color: inkOn(0.3 + 0.3 * resolve) }}>
                {A.domain}
              </span>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 37, color: inkOn((0.3 + 0.7 * resolve) * readIn), marginTop: 6 }}>
              {content.listing.price}
            </div>
            {/* The sentence the film showed Evlek writing in act 2. */}
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: inkOn((0.3 + 0.44 * resolve) * readIn), marginTop: 5 }}>
              {DESC_PRE}
              <span style={proof > 0.001 ? lit(proof) : undefined}>{CITE}</span>
              {DESC_POST}
            </div>
          </div>

          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: 6, opacity: 0.35 + 0.3 * resolve }}>
            <path d="M7 17 L17 7 M17 7 H9 M17 7 V15" stroke={resolve > 0.5 ? 'rgba(10,37,64,0.5)' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* TWO MORE SOURCES that never resolve. A system that lists other sources
            cannot be the thing it is citing. No readable text, ever — a domain
            here would be either a fake competitor or a trademark. */}
        <div style={{ position: 'absolute', left: COL.x, top: 1382, display: 'flex', gap: 14 }}>
          {[210, 210, 130].map((w, i) => (
            <div
              key={i}
              style={{
                width: w, height: 64, borderRadius: 14, background: 'rgba(255,255,255,0.045)',
                display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
                opacity: others(i),
                transform: `translateY(${(1 - others(i)) * 10}px)`,
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
              <div style={{ width: Math.min(92, w - 60), height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.10)' }} />
            </div>
          ))}
        </div>

        {/* THE SCAN — the assistant visibly reading the agent's listing. A
            reading indicator should show WHAT is being read. */}
        {scan > 0.001 && scan < 0.999 && (
          <div
            style={{
              position: 'absolute', left: COL.x, width: COL.w,
              top: CARD.y + scan * CARD.h, height: 3,
              background: 'rgba(255,255,255,0.55)', boxShadow: '0 0 30px rgba(255,255,255,0.6)',
            }}
          />
        )}

        {/* The pill the agent was taught three seconds ago in Arama — same
            geometry, same colour, same string. It straddles the card's top edge. */}
        {pill > 0.02 && (
          <div
            style={{
              position: 'absolute', right: 1080 - 950, top: CARD.y - 22,
              height: 46, display: 'flex', alignItems: 'center', padding: '0 22px',
              borderRadius: 999, background: C.gold, color: '#1B1204',
              fontFamily: SANS, fontWeight: 600, fontSize: 25,
              opacity: pill, transform: `scale(${0.88 + 0.12 * pill})`,
              boxShadow: '0 10px 26px rgba(4,14,28,0.4)',
            }}
          >
            {A.mine}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
