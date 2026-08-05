// Act 1 · the cold open. 5.80s.
//
// Two earlier cuts failed here and both failed the same way: an agent scrolling
// past could not tell, in the first second, that the film was addressed to them.
// The first version opened straight into a montage. The second added a mono
// kicker reading "EVLEK · KKTC EMLAKÇILARI İÇİN" — correct information, set at
// 29px in a subordinate style above a headline, which is exactly how you make a
// line that nobody reads. Information is not the same as address.
//
// So the audience call-out is now the largest thing in the frame, alone, on navy,
// for 1.4 seconds. Nothing competes with it. It is also the only place in the
// film that grounds is dark and typographic, which makes it the strongest cut in
// the picture when it hands over to the list.
//
// Four movements:
//
//   0.00–1.40  THE CALL-OUT.  "KKTC'de emlakçıysan / bu listeyi ezbere bilirsin."
//              The second line is a promise the next cut pays off in 100ms, and
//              it reframes the list as recognition rather than instruction — this
//              audience does not need to be told what their job is.
//   1.40–3.30  THE LIST. The four things an agent does for every single listing,
//              at 0.20s apart instead of 0.14. The listing itself rises into the
//              lower half so the checklist is visibly about something.
//   3.30–4.80  THE MONTAGE. Five hard cuts at 300ms each, one word each, every
//              word taken from the list just read.
//   4.80–5.80  THE TURN. Everything stops on the empty form. "Bunların hiçbirini
//              sen yapmadın." The second half of that thought is deliberately NOT
//              here — it lands in the next act, over the button being pressed,
//              where the picture can carry it.
//
// Each montage shot is a REAL frame of a later act at its own timecode. The
// montage does not imitate the film; it is the film out of order.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, FPS, SANS, MONO, ease, tp, at, dur, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import { MontageWord, Grain } from '../parts.jsx';
import { Staging } from './Staging.jsx';
import { Diller } from './Diller.jsx';
import { Match } from './Match.jsx';
import { Arama } from './Arama.jsx';
import { Yayinla, yayinlaState } from './Yayinla.jsx';
import content from '../content.json';

export const ACILIS_SECONDS = 5.8;

const CALL_END = 84;                       // f0–83    1.40s  navy
const LIST_END = 198;                      // f84–197  1.90s  cream
const CUT = 18;                            // 300ms per montage shot
const MONTAGE_END = LIST_END + CUT * 5;    // f198–287 1.50s
                                           // f288–347 1.00s  the turn

const K = content.copy;

/* Ordered so no two consecutive shots share a ground, and so each word is one of
   the four jobs the viewer has just read. Push direction alternates — five shots
   pushing the same way turn into one strobing texture. Each `from → to` is a
   300ms slice of the real act, slow enough that the eye resolves an image rather
   than a flicker. */
const SHOTS = [
  { Scene: Staging, from: 1.62, to: 1.92, scale: [1.00, 1.045], origin: '54% 46%', dark: true },
  { Scene: Yayinla, from: 2.32, to: 2.60, scale: [1.04, 1.00], origin: '34% 60%', dark: false },
  { Scene: Match, from: 2.02, to: 2.30, scale: [1.00, 1.05], origin: '50% 56%', dark: true },
  // Turkish, not Russian. This is the film's first sight of the Diller act and it
  // has to read as a Turkish product; the other four languages are what the
  // product does, not what the agent writes in.
  { Scene: Diller, from: 0.62, to: 0.90, scale: [1.03, 1.00], origin: '24% 46%', dark: false },
  { Scene: Arama, from: 2.30, to: 2.58, scale: [1.00, 1.04], origin: '26% 54%', dark: false },
];

/** One line of the job list, with a small square that fills as it lands. */
const Job = ({ text, p }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center', gap: 26,
      opacity: p, transform: `translateY(${(1 - p) * 16}px)`,
      marginBottom: 24,
    }}
  >
    <div
      style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        border: `2.5px solid rgba(201,161,87,${0.45 + 0.55 * p})`,
        background: `rgba(201,161,87,${0.12 * p})`,
      }}
    />
    <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: '-0.01em', color: C.navy }}>
      {text}
    </span>
  </div>
);

export const Acilis = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  /* ── 1 · The call-out ────────────────────────────────────────────────── */
  if (frame < CALL_END) {
    // Line one is NOT animated in. Frame 0 of a reel is its cover and the frame a
    // scrolling thumb lands on; a title fading up is half a second of nothing to
    // stop for. It is simply already there, and everything else moves around it.
    const l2 = at(frame, 0.52, dur.md);
    const rule = at(frame, 0.02, 0.30, ease.out);
    const bloom = interpolate(frame, [0, CALL_END], [44, 56]);

    return (
      <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
        <AbsoluteFill
          style={{ background: `radial-gradient(1200px 1000px at 32% ${bloom}%, rgba(47,92,255,0.22), rgba(10,37,64,0) 68%)` }}
        />
        <Grain opacity={0.05} />

        {/* Vertically centred rather than hung from the top. A title card with
            1200px of empty navy under it reads as a frame that has not finished
            loading; centred, the same emptiness reads as confidence. */}
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
              opacity: l2, transform: `translateY(${(1 - l2) * 20}px)`,
            }}
          >
            {K.callout_2}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 2 · The list ────────────────────────────────────────────────────── */
  if (frame < LIST_END) {
    const b = (frame - CALL_END) / FPS;          // seconds inside this movement
    const lp = (atSec, len = dur.md) => tp(b, atSec, atSec + len, ease.out);

    const label = lp(0.02, dur.sm);
    const sub = lp(1.32);
    const dev = lp(0.24, dur.lg);
    const creep = interpolate(b, [0, 1.90], [4, -6]);

    return (
      <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
        {/* The listing itself, rising into the lower half while the list is still
            being written. The checklist is visibly about something. */}
        <div style={{ opacity: dev, transform: `translateY(${(1 - dev) * 70}px)` }}>
          <Phone tilt={-0.9} top={1010}>
            <AgentPhone s={{ ...yayinlaState(0), photoIdx: 1 }} />
          </Phone>
        </div>
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(248,246,241,1) 0%, rgba(248,246,241,1) 47%, rgba(248,246,241,0) 56%)',
          }}
        />

        <div
          style={{
            position: 'absolute', left: SAFE.left + 20, top: 330, right: SAFE.right,
            transform: `translateY(${creep}px)`,
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: label, marginBottom: 44,
            }}
          >
            <span style={{ width: 34, height: 4, background: C.gold, display: 'block' }} />
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.18em', color: C.ink(0.6) }}>
              {K.setup_label}
            </span>
          </div>

          {K.setup_items.map((item, i) => (
            <Job key={item} text={item} p={lp(0.16 + i * 0.20)} />
          ))}

          <div
            style={{
              fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink(0.55),
              marginTop: 22, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`,
            }}
          >
            {K.setup_sub}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 3 · The montage ─────────────────────────────────────────────────── */
  if (frame < MONTAGE_END) {
    const i = Math.floor((frame - LIST_END) / CUT);
    const shot = SHOTS[i];
    const local = (frame - LIST_END - i * CUT) / CUT;
    const { Scene } = shot;
    const sc = interpolate(local, [0, 1], shot.scale, { easing: ease.linear });

    return (
      <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: shot.origin }}>
          <Scene tOverride={interpolate(local, [0, 1], [shot.from, shot.to])} bare />
        </AbsoluteFill>
        <MontageWord dark={shot.dark}>{K.montage_words[i]}</MontageWord>
      </AbsoluteFill>
    );
  }

  /* ── 4 · The turn ────────────────────────────────────────────────────── */
  // Everything stops on the one screen the agent actually touches. The camera
  // pushes toward the publish button and a gold ring pulses on it — the eye is
  // being told where the next shot is going, so the cut into a 3× macro reads as
  // an acceleration rather than a jump.
  const b = (frame - MONTAGE_END) / FPS;
  const cam = interpolate(b, [0, ACILIS_SECONDS - MONTAGE_END / FPS], [1.0, 1.16], {
    extrapolateRight: 'clamp', easing: ease.inOut,
  });
  const s = {
    ...yayinlaState(0),
    photoIdx: 1 - tp(b, 0.06, 0.50, ease.inOut),
    // Not a press — a hint. It rings twice, 400ms apart.
    published: 0,
  };
  const hint = Math.max(
    Math.sin(Math.PI * Math.max(0, Math.min(1, (b - 0.30) / 0.45))),
    Math.sin(Math.PI * Math.max(0, Math.min(1, (b - 0.70) / 0.45))),
  );

  const h1 = at(frame, MONTAGE_END / FPS + 0.16, dur.md);

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '364px 1278px' }}>
        <Phone tilt={-0.9} top={430}>
          <AgentPhone s={s} />
        </Phone>

        {/* The ring sits in frame coordinates on top of the button. */}
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
