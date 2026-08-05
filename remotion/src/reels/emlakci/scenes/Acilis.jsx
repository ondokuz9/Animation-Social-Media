// Act 1 · the cold open. 4.00s.
//
// An earlier cut opened straight into the montage. It looked good and it failed
// the only question the first second has to answer: who is this for and what am
// I looking at? Five register changes with no frame of reference is a showreel,
// not an argument — an agent scrolling past sees a nice video about nothing.
//
// So the act now runs in three movements:
//
//   0.00–1.48  THE JOB. One line naming the audience, then the four things an
//              agent does for every single listing, listed plainly in Turkish.
//              This is the setup, and everything after it is a payoff to it.
//   1.48–2.73  THE MONTAGE. Five hard cuts, one word each — and every word is
//              taken from the list just read. The cuts are no longer abstract;
//              each one is an item being answered.
//   2.73–4.00  THE TURN. Everything stops on an empty form, and the two lines
//              that reframe it: you did none of that, you pressed one button.
//
// Each montage shot is a REAL frame of a later act, driven by that act's own
// timeline at its own timecode. The montage does not imitate the film, it IS
// the film out of order — which is why the hook can promise what it promises.
//
// No white flashes between cuts, deliberately: five full-frame luminance jumps
// in a second and a half is genuinely unsafe for some viewers, and the register
// changes already punctuate themselves.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, FPS, SANS, MONO, ease, tp, at, dur, SAFE, holdLine } from '../../../brand/tokens.js';
import { Phone } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import { MontageWord } from '../parts.jsx';
import { Staging } from './Staging.jsx';
import { Diller } from './Diller.jsx';
import { Match } from './Match.jsx';
import { Arama } from './Arama.jsx';
import { Yayinla, yayinlaState } from './Yayinla.jsx';
import content from '../content.json';

export const ACILIS_SECONDS = 4.0;

const SETUP_END = 89;           // f0–88   the job
const CUT = 15;                 // 250ms per montage shot
const MONTAGE_END = SETUP_END + CUT * 5;   // f164

const K = content.copy;

/* Ordered so no two consecutive shots share a ground, and so each word is one
   of the four jobs the viewer has just read. The push direction alternates —
   five shots all pushing the same way turn into one strobing texture. */
const SHOTS = [
  { Scene: Staging, from: 1.50, to: 1.74, scale: [1.00, 1.045], origin: '54% 46%', dark: true },
  { Scene: Yayinla, from: 1.96, to: 2.16, scale: [1.04, 1.00], origin: '34% 60%', dark: false },
  { Scene: Match, from: 1.86, to: 2.08, scale: [1.00, 1.05], origin: '50% 56%', dark: true },
  // Turkish, not Russian. This is the film's first sight of the Diller act and
  // it has to read as a Turkish product; the other four languages are what the
  // product does, not what the agent writes in.
  { Scene: Diller, from: 0.52, to: 0.74, scale: [1.03, 1.00], origin: '24% 46%', dark: false },
  { Scene: Arama, from: 1.92, to: 2.14, scale: [1.00, 1.04], origin: '26% 54%', dark: false },
];

/** One line of the job list, with a small square that fills as it lands. */
const Job = ({ text, p }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center', gap: 26,
      opacity: p, transform: `translateY(${(1 - p) * 16}px)`,
      marginBottom: 22,
    }}
  >
    <div
      style={{
        width: 26, height: 26, borderRadius: 7, flexShrink: 0,
        border: `2.5px solid rgba(201,161,87,${0.45 + 0.55 * p})`,
        background: `rgba(201,161,87,${0.12 * p})`,
      }}
    />
    <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: '-0.01em', color: C.navy }}>
      {text}
    </span>
  </div>
);

export const Acilis = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  /* ── 1 · The job ─────────────────────────────────────────────────────── */
  if (frame < SETUP_END) {
    // The kicker and the headline are NOT animated in. Frame 0 of a reel is the
    // cover image and the frame a scrolling thumb lands on; three frames of empty
    // cream while a title fades up is three frames of nothing to stop for. The
    // title card is simply already there, and the list is what moves.
    const sub = at(frame, 1.02, dur.md);
    const dev = at(frame, 0.50, dur.lg);
    // The title is static, but the frame must not be. The rule draws itself from
    // frame 1 — the same drawn-line motif the source line and the close use — and
    // the whole block creeps upward, so the opening reads as alive rather than as
    // a slide that has stopped. A frame-hash audit is unforgiving about this: 18
    // byte-identical frames is a third of a second of a paused video.
    const rule = at(frame, 0.01, 0.24, ease.out);
    const creep = interpolate(frame, [0, SETUP_END], [4, -5]);

    return (
      <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
        {/* The listing itself, rising into the lower half while the list is still
            being written. It answers the other half of the first-second question —
            not just who this is for, but what it is — and it means the checklist
            above is visibly a checklist ABOUT something, not an abstraction. */}
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
            position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right,
            transform: `translateY(${creep}px)`,
          }}
        >
          {/* Who this is for, in the first tenth of a second. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                width: 34, height: 4, background: C.gold, display: 'block',
                transform: `scaleX(${rule})`, transformOrigin: 'left center',
              }}
            />
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 29, letterSpacing: '0.16em', color: C.ink(0.62) }}>
              {K.kicker}
            </span>
          </div>

          <div style={{ ...T.headline, color: C.navy, marginTop: 34 }}>{K.setup_head}</div>

          <div style={{ marginTop: 60 }}>
            {K.setup_items.map((item, i) => (
              <Job key={item} text={item} p={at(frame, 0.30 + i * 0.14, dur.md)} />
            ))}
          </div>

          <div
            style={{
              fontFamily: SANS, fontWeight: 600, fontSize: 38, color: C.ink(0.55),
              marginTop: 26, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`,
            }}
          >
            {K.setup_sub}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 2 · The montage ─────────────────────────────────────────────────── */
  if (frame < MONTAGE_END) {
    const i = Math.floor((frame - SETUP_END) / CUT);
    const shot = SHOTS[i];
    const local = (frame - SETUP_END - i * CUT) / CUT;
    const { Scene } = shot;
    const sc = interpolate(local, [0, 1], shot.scale, { easing: ease.linear });

    return (
      <AbsoluteFill style={{ background: C.navy, overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: shot.origin }}>
          <Scene tOverride={interpolate(local, [0, 1], [shot.from, shot.to])} bare />
        </AbsoluteFill>
        <MontageWord dark={shot.dark}>{content.copy.montage_words[i]}</MontageWord>
      </AbsoluteFill>
    );
  }

  /* ── 3 · The turn ────────────────────────────────────────────────────── */
  // Everything stops on the one screen the agent actually touches. The push runs
  // toward the publish button and hands straight over to the next act, which
  // opens on that button at 3× — the cut reads as an acceleration, not a jump.
  const stillT = t - MONTAGE_END / FPS;
  // Scrubbing back to the first photograph, so the cut into the publish act
  // lands on the frame that act opens on.
  const s = { ...yayinlaState(0), photoIdx: 1 - tp(stillT, 0.08, 0.52, ease.inOut) };
  const cam = interpolate(stillT, [0, ACILIS_SECONDS - MONTAGE_END / FPS], [1.0, 1.15], {
    extrapolateRight: 'clamp', easing: ease.inOut,
  });

  const h1 = holdLine(frame, 2.82, 3.36, { lenSec: dur.sm, outLenSec: 0.14 });
  // The second line never exits. It is still on screen when the cut happens, so
  // the next act begins mid-sentence rather than after one.
  const h2p = at(frame, 3.44, dur.sm, ease.out);
  const h2 = { opacity: h2p, transform: `translateY(${(1 - h2p) * 18}px)` };

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '364px 1278px' }}>
        <Phone tilt={-0.9} top={430}>
          <AgentPhone s={s} />
        </Phone>
      </AbsoluteFill>

      {/* The push brings the card up into the headline band; the type wins. */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(248,246,241,1) 0%, rgba(248,246,241,0.99) 26%, rgba(248,246,241,0) 42%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 292, right: SAFE.right, height: 300 }}>
        <div style={{ ...T.hook, color: C.navy, position: 'absolute', ...h1 }}>{K.hook_1}</div>
        <div style={{ ...T.hook, color: C.navy, position: 'absolute', ...h2 }}>{K.hook_2}</div>
      </div>
    </AbsoluteFill>
  );
};
