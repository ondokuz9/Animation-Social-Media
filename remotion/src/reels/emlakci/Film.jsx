// Evlek · emlakçı tanıtım filmi — 20.00s, 1200 frames at 60fps.
//
// Eight acts, eight registers. The rule the whole assembly obeys: no two
// consecutive acts may share a ground colour, a camera behaviour and a subject.
// An earlier cut of this film was one phone from one camera position for eleven
// seconds — technically clean, and unwatchable. Variety is not decoration here,
// it is the mechanism that keeps a scrolling viewer in the frame.
//
//   #  act        s      ground        register                     person
//   1  Açılış     9.20   navy→cream    hook, thesis, five cards     agent
//   2  Yayınla    3.70   cream         device, macro → wide         agent
//   3  Diller     2.90   cream         typography only              —
//   4  Staging    3.30   photograph    full-bleed, no interface     —
//   5  Match      3.30   navy          a dendrite, growing          —
//   6  Arama      3.10   cream         full-frame interface         buyer
//   7  Asistan    2.70   navy          conversation + citation      buyer
//   8  Kapanış    2.03   navy          brand plate                  —
//
// 30.000s / 1800 frames. Three cuts of this film have now been too fast, each
// for a different reason. The 20.5s version was under the eye's fixate-parse-move
// threshold in half a dozen places. The 25s version fixed the acts and left the
// opening carrying too much: it spent 1.5s on a montage whose words were set at
// 34px over photographs, and it framed the product as a chore list. Açılış is now
// 9.2s and does three separate jobs in sequence instead of three at once —
// address, thesis, proof — and the proof is five cards with 64px type on clean
// ground rather than captions over pictures.
//
// Cuts. Five are hard, two are dissolves, and each dissolve is earned:
//
//   Yayınla → Diller   6 frames. Both grounds are cream and the SUBJECT is the
//                      same sentence — the description just written is the one
//                      about to be translated. A hard cut here would throw away
//                      the only genuine match in the film.
//   Asistan → Kapanış  8 frames. Navy to navy, an answer settling into a name.
//
// Everything else cuts hard, because the register change is the punctuation.

import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame } from 'remotion';
import { FPS } from '../../brand/tokens.js';

import { Acilis, ACILIS_SECONDS } from './scenes/Acilis.jsx';
import { Yayinla, YAYINLA_SECONDS } from './scenes/Yayinla.jsx';
import { Diller, DILLER_SECONDS } from './scenes/Diller.jsx';
import { Staging, STAGING_SECONDS } from './scenes/Staging.jsx';
import { Match, MATCH_SECONDS } from './scenes/Match.jsx';
import { Arama, ARAMA_SECONDS } from './scenes/Arama.jsx';
import { Asistan, ASISTAN_SECONDS } from './scenes/Asistan.jsx';
import { Kapanis } from './scenes/Kapanis.jsx';

/** A linear fade over the first `frames` frames. Linear on purpose: a dissolve
    is a cross-fade of two images, and easing one side of it makes the midpoint
    read as a dip rather than a hand-over. */
const FadeIn = ({ frames, children }) => {
  const f = useCurrentFrame();
  if (!frames) return children;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, (f + 1) / frames) }}>{children}</AbsoluteFill>
  );
};

const s = (sec) => Math.round(sec * FPS);

/* Kapanış is given its length in frames rather than seconds so the film lands on
   a round total after the two overlaps are subtracted: 1800 frames, 30.000s. */
const ACTS = [
  { key: 'acilis', Scene: Acilis, frames: s(ACILIS_SECONDS), overlap: 0 },
  { key: 'yayinla', Scene: Yayinla, frames: s(YAYINLA_SECONDS), overlap: 0 },
  { key: 'diller', Scene: Diller, frames: s(DILLER_SECONDS), overlap: 6 },
  { key: 'staging', Scene: Staging, frames: s(STAGING_SECONDS), overlap: 0 },
  { key: 'match', Scene: Match, frames: s(MATCH_SECONDS), overlap: 0 },
  { key: 'arama', Scene: Arama, frames: s(ARAMA_SECONDS), overlap: 0 },
  { key: 'asistan', Scene: Asistan, frames: s(ASISTAN_SECONDS), overlap: 0 },
  { key: 'kapanis', Scene: Kapanis, frames: 122, overlap: 8 },
];

export const FILM_FRAMES = ACTS.reduce((n, a) => n + a.frames - a.overlap, 0);

export const Film = () => (
  <Series>
    {ACTS.map(({ key, Scene, frames, overlap }) => (
      <Series.Sequence key={key} durationInFrames={frames} offset={-overlap} name={key}>
        <FadeIn frames={overlap}>
          <Scene />
        </FadeIn>
      </Series.Sequence>
    ))}
  </Series>
);
