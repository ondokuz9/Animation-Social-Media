// Evlek · emlakçı tanıtım filmi — 20.00s, 1200 frames at 60fps.
//
// Eight acts, eight registers. The rule the whole assembly obeys: no two
// consecutive acts may share a ground colour, a camera behaviour and a subject.
// An earlier cut of this film was one phone from one camera position for eleven
// seconds — technically clean, and unwatchable. Variety is not decoration here,
// it is the mechanism that keeps a scrolling viewer in the frame.
//
//   #  act        s      ground        register                     person
//   1  Açılış     4.00   cream→mixed   the job, then the montage    agent
//   2  Yayınla    3.20   cream         device, macro → wide         agent
//   3  Diller     2.20   cream         typography only              —
//   4  Staging    2.85   photograph    full-bleed, no interface     —
//   5  Match      2.40   navy          drawn diagram                —
//   6  Arama      2.50   cream         full-frame interface         buyer
//   7  Asistan    1.90   navy          conversation, no surface     buyer
//   8  Kapanış    1.68   navy          brand plate                  —
//
// Açılış carries the extra 1.2s on purpose. An earlier cut opened straight into
// the montage and never said who the film was for; five register changes with no
// frame of reference is a showreel, not an argument. It now names the audience in
// the first tenth of a second, lists the four jobs an agent does for every
// listing, and only then spends the montage answering them.
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
   a round total after the two overlaps are subtracted: 1230 frames, 20.500s. */
const ACTS = [
  { key: 'acilis', Scene: Acilis, frames: s(ACILIS_SECONDS), overlap: 0 },
  { key: 'yayinla', Scene: Yayinla, frames: s(YAYINLA_SECONDS), overlap: 0 },
  { key: 'diller', Scene: Diller, frames: s(DILLER_SECONDS), overlap: 6 },
  { key: 'staging', Scene: Staging, frames: s(STAGING_SECONDS), overlap: 0 },
  { key: 'match', Scene: Match, frames: s(MATCH_SECONDS), overlap: 0 },
  { key: 'arama', Scene: Arama, frames: s(ARAMA_SECONDS), overlap: 0 },
  { key: 'asistan', Scene: Asistan, frames: s(ASISTAN_SECONDS), overlap: 0 },
  { key: 'kapanis', Scene: Kapanis, frames: 101, overlap: 8 },
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
