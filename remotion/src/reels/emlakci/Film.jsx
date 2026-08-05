// Evlek · emlakçı tanıtım filmi — 20.00s, 1200 frames at 60fps.
//
// Eight acts, eight registers. The rule the whole assembly obeys: no two
// consecutive acts may share a ground colour, a camera behaviour and a subject.
// An earlier cut of this film was one phone from one camera position for eleven
// seconds — technically clean, and unwatchable. Variety is not decoration here,
// it is the mechanism that keeps a scrolling viewer in the frame.
//
//   #  act        s      ground        register                     person
//   1  Açılış     5.80   navy→cream    call-out, list, montage      agent
//   2  Yayınla    3.70   cream         device, macro → wide         agent
//   3  Diller     2.70   cream         typography only              —
//   4  Staging    3.20   photograph    full-bleed, no interface     —
//   5  Match      2.60   navy          drawn diagram                —
//   6  Arama      3.00   cream         full-frame interface         buyer
//   7  Asistan    2.20   navy          conversation, no surface     buyer
//   8  Kapanış    2.03   navy          brand plate                  —
//
// 25.000s / 1500 frames. The 20.5s cut was legible frame by frame and illegible
// in motion: the eye needs time to fixate, parse and move on, and several beats
// were under that threshold — a wipe the viewer could not compare the two ends
// of, five languages held for a quarter second each, sixteen words of answer
// streaming in 0.7s. Every act is now 15–30% longer, and the extra 1.8s in
// Açılış buys the one thing the film was missing entirely: a second and a half
// where it does nothing but say who it is talking to.
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
   a round total after the two overlaps are subtracted: 1500 frames, 25.000s. */
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
