// Act 1 · the cold open. 9.20s.
//
// Three previous cuts failed here, each in a way worth recording.
//
//   v1  opened straight into a montage. Five register changes with no frame of
//       reference is a showreel, not an argument.
//   v2  added "EVLEK · KKTC EMLAKÇILARI İÇİN" at 29px in a subordinate mono
//       style. Correct information, set exactly the way you set a line nobody
//       reads. Information is not address.
//   v3  made the address large and unmissable — and then framed the product as a
//       CHORE LIST: "tek bir ilan için yapılacaklar", ending on "bunların
//       hiçbirini sen yapmadın." Two problems. It positioned Evlek as a
//       labour-saver, which is the smallest true claim available; and it made
//       the agent the subject of a negative sentence. Telling a professional
//       what they did not do reads as praise and lands as diminishment.
//
// So the thesis is now the thing that actually changed:
//
//       İlan koymak değişti.
//
// and every capability is a sentence with EVLEK as its subject — writes,
// translates, furnishes, prepares, matches. The agent publishes; the product
// runs. Nobody is told what they failed to do.
//
// Four movements:
//
//   0.00–1.80  THE HOOK.  Navy, 86px, alone. "KKTC'de emlakçıysan / bunu görmen
//              lazım." A direct address and a reason to stay, and nothing else in
//              the frame competing for the 1.8 seconds it has.
//   1.80–5.00  THE THESIS. Cream. The claim, then the five things the product
//              does, 0.42s apart — slow enough that each one lands as a separate
//              promise rather than a paragraph that scrolled past.
//   5.00–8.00  THE FIVE CARDS. Each capability gets 0.60s of its own: a gold
//              index, the line at 64px on a clean ground, and a live frame of the
//              act that delivers it in a window that opens from the centre.
//              An earlier cut put these words at 34px over a photograph for
//              300ms. They were unreadable, and a word that is not read is worse
//              than no word — it is noise with a cost.
//   8.00–9.20  THE TURN. Everything stops on the form the agent actually touched.
//              "Bunları Evlek yaptı." The other half of the thought lands in the
//              next act, over the button being pressed.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, FPS, SANS, MONO, ease, tp, at, dur, SAFE, RADIUS } from '../../../brand/tokens.js';
import { Phone } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import { Grain } from '../parts.jsx';
import { Staging } from './Staging.jsx';
import { Diller } from './Diller.jsx';
import { Match } from './Match.jsx';
import { Arama } from './Arama.jsx';
import { Yayinla, yayinlaState } from './Yayinla.jsx';
import { Asistan } from './Asistan.jsx';
import content from '../content.json';

export const ACILIS_SECONDS = 9.2;

const HOOK_END = 108;                    // f0–107    1.80s  navy
const THESIS_END = 300;                  // f108–299  3.20s  cream
const CARD = 36;                         // 0.60s per card — twice the old montage
const CARDS_END = THESIS_END + CARD * 5; // f300–479  3.00s
                                         // f480–551  1.20s  the turn

const K = content.copy;
const CAPS = K.caps;

/* Each card names its capability and shows the act that delivers it, at a moment
   inside that act where the claim is visibly true. Grounds alternate so every cut
   is still a hard change of ground, but the type now lives on a clean field
   instead of on top of a photograph. */
const CARDS = [
  // `zoom` and `dy` frame the window on what each act is actually about. Without
  // them the window shows the same slab of every scene: the phone cropped
  // through its own bezels, the search field cut in half, the language ticker
  // below the sill.
  { Scene: Yayinla, from: 2.16, to: 2.52, dark: false, zoom: 1.20, dy: 10 },
  { Scene: Diller, from: 1.24, to: 1.56, dark: true, zoom: 1.00, dy: 132 },
  { Scene: Staging, from: 1.34, to: 1.70, dark: false, zoom: 1.00, dy: 0 },
  // 2.10, not 1.40: the citation card is what makes this capability legible, and
  // it does not exist in that act until 2.02.
  { Scene: Asistan, from: 2.12, to: 2.48, dark: true, zoom: 1.00, dy: 100 },
  // Match, not Arama. The capability is matching; showing the buyer's search
  // here illustrated a different sentence from the one written above it.
  { Scene: Match, from: 2.56, to: 2.94, dark: false, zoom: 0.90, dy: 0 },
];

/** One promise in the thesis list. The number carries the colour so the line
    itself can stay pure navy — a list where every row has two coloured elements
    reads as decoration rather than as a list. */
const Cap = ({ cap, p }) => (
  <div
    style={{
      display: 'flex', alignItems: 'baseline', gap: 26,
      opacity: p, transform: `translateY(${(1 - p) * 18}px)`,
      marginBottom: 26,
    }}
  >
    <span
      style={{
        fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.06em',
        color: C.gold, width: 56, flexShrink: 0,
      }}
    >
      {cap.no}
    </span>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: '-0.015em', color: C.navy }}>
      {cap.line}
    </span>
  </div>
);

export const Acilis = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── 1 · The hook ────────────────────────────────────────────────────── */
  if (frame < HOOK_END) {
    // Line one is NOT animated in. Frame 0 of a reel is its cover and the frame a
    // scrolling thumb lands on; a title fading up is half a second of nothing to
    // stop for. It is already there, and everything else moves around it.
    const l2 = at(frame, 0.62, dur.md);
    const rule = at(frame, 0.02, 0.34, ease.out);
    const bloom = interpolate(frame, [0, HOOK_END], [42, 58]);

    return (
      <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
        <AbsoluteFill
          style={{ background: `radial-gradient(1200px 1000px at 32% ${bloom}%, rgba(47,92,255,0.24), rgba(10,37,64,0) 68%)` }}
        />
        <Grain opacity={0.05} />

        <div
          style={{
            position: 'absolute', left: SAFE.left + 20, right: SAFE.right,
            top: '50%', transform: 'translateY(-58%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 46 }}>
            <span
              style={{
                width: 52, height: 4, background: C.gold, display: 'block',
                transform: `scaleX(${rule})`, transformOrigin: 'left center',
              }}
            />
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.62)' }}>
              EVLEK
            </span>
          </div>

          <div style={{ ...T.hook, fontSize: 86, color: C.white }}>{K.callout_1}</div>
          <div
            style={{
              ...T.hook, fontSize: 86, color: C.gold, marginTop: 10,
              opacity: l2, transform: `translateY(${(1 - l2) * 22}px)`,
            }}
          >
            {K.callout_2}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 2 · The thesis ──────────────────────────────────────────────────── */
  if (frame < THESIS_END) {
    const b = (frame - HOOK_END) / FPS;
    const lp = (atSec, len = dur.md) => tp(b, atSec, atSec + len, ease.out);

    const kick = lp(0.02, dur.sm);
    const head = lp(0.12);
    const sub = lp(2.72);
    const creep = interpolate(b, [0, 3.20], [5, -7]);

    return (
      <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
        {/* Centred, not hung from the top. The block is ~900px tall in a 1920
            frame; anchored at 330 it left the bottom third empty for the whole
            3.2 seconds. */}
        <div
          style={{
            position: 'absolute', left: SAFE.left + 20, right: SAFE.right,
            top: '50%', transform: `translateY(calc(-52% + ${creep}px))`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: kick, marginBottom: 34 }}>
            <span style={{ width: 34, height: 4, background: C.gold, display: 'block' }} />
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.18em', color: C.ink(0.6) }}>
              {K.thesis_kicker}
            </span>
          </div>

          <div
            style={{
              ...T.hook, fontSize: 78, color: C.navy, marginBottom: 56,
              opacity: head, transform: `translateY(${(1 - head) * 20}px)`,
            }}
          >
            {K.thesis}
          </div>

          {/* An editorial rule down the left of the list, growing with it. It
              gives the five promises a spine, and it is the only thing on this
              frame that moves once the last line has landed. */}
          <div style={{ position: 'relative', paddingLeft: 46 }}>
            <div
              style={{
                position: 'absolute', left: 0, top: 6, width: 2, height: 'calc(100% - 40px)',
                background: C.ink(0.16),
                transform: `scaleY(${lp(0.58, 1.9)})`, transformOrigin: 'top center',
              }}
            />
            {CAPS.map((cap, i) => (
              <Cap key={cap.no} cap={cap} p={lp(0.62 + i * 0.42)} />
            ))}
          </div>

          <div
            style={{
              fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink(0.58),
              marginTop: 26, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`,
            }}
          >
            {K.thesis_sub}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 3 · The five cards ──────────────────────────────────────────────── */
  if (frame < CARDS_END) {
    const i = Math.floor((frame - THESIS_END) / CARD);
    const card = CARDS[i];
    const cap = CAPS[i];
    const local = (frame - THESIS_END - i * CARD) / CARD;   // 0 → 1
    const { Scene } = card;

    // The window opens from the centre in 200ms, then the scene pushes for the
    // rest of the card. Two moves, never at the same time.
    const open = tp(local, 0.0, 0.33, ease.out);
    const push = interpolate(local, [0, 1], [1.0, 1.045]);
    const ink = card.dark ? '#FFFFFF' : C.navy;

    return (
      <AbsoluteFill style={{ background: card.dark ? C.navy : C.creamWarm, overflow: 'hidden' }}>
        {card.dark && (
          <AbsoluteFill
            style={{ background: 'radial-gradient(1100px 900px at 30% 30%, rgba(47,92,255,0.20), rgba(10,37,64,0) 66%)' }}
          />
        )}

        <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.14em', color: C.gold }}>
              {cap.no}
            </span>
            <span style={{ flex: 1, height: 2, background: card.dark ? 'rgba(255,255,255,0.16)' : C.ink(0.14) }} />
            <span
              style={{
                fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: card.dark ? 'rgba(255,255,255,0.5)' : C.ink(0.45),
              }}
            >
              {cap.note}
            </span>
          </div>

          <div style={{ ...T.hook, fontSize: 68, color: ink, marginTop: 26 }}>{cap.line}</div>

          {/* A rule that fills across the card's own 600ms. It is the only thing
              on the card that moves other than the picture, and it quietly tells
              the eye how long it has. */}
          <div style={{ height: 4, marginTop: 26, background: card.dark ? 'rgba(255,255,255,0.12)' : C.ink(0.1) }}>
            <div style={{ height: 4, background: C.gold, transform: `scaleX(${local})`, transformOrigin: 'left center' }} />
          </div>
        </div>

        {/* The proof, in a window. Not full-bleed: the type needs a clean field,
            and a windowed frame reads as a citation rather than as a cutaway. */}
        <div
          style={{
            position: 'absolute', left: 44, right: 44, top: 636, height: 908,
            borderRadius: RADIUS.card + 12,
            overflow: 'hidden',
            boxShadow: card.dark
              ? '0 40px 90px rgba(0,0,0,0.5)'
              : '0 34px 80px rgba(10,37,64,0.18)',
            clipPath: `inset(${(1 - open) * 50}% 0% ${(1 - open) * 50}% 0% round ${RADIUS.card + 12}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute', left: -44, right: -44, top: -636, height: 1920,
              transform: `translateY(${card.dy}px) scale(${push * card.zoom})`,
              transformOrigin: '540px 1090px',
            }}
          >
            <Scene tOverride={interpolate(local, [0, 1], [card.from, card.to])} bare />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 4 · The turn ────────────────────────────────────────────────────── */
  // Everything stops on the one screen the agent actually touches. The camera
  // pushes toward the publish button and a gold ring pulses on it — the eye is
  // told where the next shot is going before the cut to a macro, so the cut
  // reads as an acceleration rather than a jump.
  const b = (frame - CARDS_END) / FPS;
  const cam = interpolate(b, [0, ACILIS_SECONDS - CARDS_END / FPS], [1.0, 1.15], {
    extrapolateRight: 'clamp', easing: ease.inOut,
  });
  const s = { ...yayinlaState(0), photoIdx: 1 - tp(b, 0.08, 0.62, ease.inOut), published: 0 };
  const hint = Math.max(
    Math.sin(Math.PI * Math.max(0, Math.min(1, (b - 0.34) / 0.46))),
    Math.sin(Math.PI * Math.max(0, Math.min(1, (b - 0.78) / 0.46))),
  );
  const h1 = tp(b, 0.14, 0.14 + dur.md, ease.out);

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '364px 1278px' }}>
        <Phone tilt={-0.9} top={430}>
          <AgentPhone s={s} />
        </Phone>

        {hint > 0.01 && (
          <div
            style={{
              position: 'absolute', left: 364 - 172, top: 1278 - 44,
              width: 344, height: 88, borderRadius: 999,
              border: `3px solid rgba(201,161,87,${0.85 * (1 - hint)})`,
              transform: `scale(${1 + hint * 0.14})`,
            }}
          />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(248,246,241,1) 0%, rgba(248,246,241,0.99) 26%, rgba(248,246,241,0) 42%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 300 }}>
        <div
          style={{
            ...T.hook, color: C.navy, position: 'absolute',
            opacity: h1, transform: `translateY(${(1 - h1) * 20}px)`,
          }}
        >
          {K.hook_1}
        </div>
      </div>
    </AbsoluteFill>
  );
};
