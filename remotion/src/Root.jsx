import React from 'react';
import { Composition } from 'remotion';
import './brand/evlek.css';
import './brand/hanken-weights.css';
import './brand/nonlatin.css';
import { FPS, WIDTH, HEIGHT, f } from './brand/tokens.js';

import { Film, FILM_FRAMES } from './reels/emlakci/Film.jsx';
import { StyleProof, STYLEPROOF_FRAMES } from './reels/brandfilm/StyleProof.jsx';
import { Acilis, ACILIS_SECONDS } from './reels/emlakci/scenes/Acilis.jsx';
import { Yayinla, YAYINLA_SECONDS } from './reels/emlakci/scenes/Yayinla.jsx';
import { Diller, DILLER_SECONDS } from './reels/emlakci/scenes/Diller.jsx';
import { Staging, STAGING_SECONDS } from './reels/emlakci/scenes/Staging.jsx';
import { Match, MATCH_SECONDS } from './reels/emlakci/scenes/Match.jsx';
import { Arama, ARAMA_SECONDS } from './reels/emlakci/scenes/Arama.jsx';
import { Asistan, ASISTAN_SECONDS } from './reels/emlakci/scenes/Asistan.jsx';
import { Kapanis, KAPANIS_SECONDS } from './reels/emlakci/scenes/Kapanis.jsx';

const comp = (id, component, frames) => (
  <Composition id={id} component={component} durationInFrames={frames}
               fps={FPS} width={WIDTH} height={HEIGHT} />
);

export const RemotionRoot = () => (
  <>
    {/* The deliverable. */}
    {comp('EmlakciReel', Film, FILM_FRAMES)}

    {/* Brand film — style proof (paper / snap / line / light). */}
    {comp('BrandProof', StyleProof, STYLEPROOF_FRAMES)}

    {/* Acts on their own, so one can be worked on without rendering twenty
        seconds to see three of them. */}
    {comp('a1-acilis', Acilis, f(ACILIS_SECONDS))}
    {comp('a2-yayinla', Yayinla, f(YAYINLA_SECONDS))}
    {comp('a3-diller', Diller, f(DILLER_SECONDS))}
    {comp('a4-staging', Staging, f(STAGING_SECONDS))}
    {comp('a5-match', Match, f(MATCH_SECONDS))}
    {comp('a6-arama', Arama, f(ARAMA_SECONDS))}
    {comp('a7-asistan', Asistan, f(ASISTAN_SECONDS))}
    {comp('a8-kapanis', Kapanis, f(KAPANIS_SECONDS))}
  </>
);
