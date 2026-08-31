import React from 'react';
import { Composition } from 'remotion';
import './brand/evlek.css';
import './brand/hanken-weights.css';
import './brand/nonlatin.css';
import { FPS, WIDTH, HEIGHT, f } from './brand/tokens.js';

import { Film, FILM_FRAMES } from './reels/emlakci/Film.jsx';
import { StyleProof, STYLEPROOF_FRAMES } from './reels/brandfilm/StyleProof.jsx';
import { Film30, FILM30_FRAMES } from './reels/brandfilm/Film30.jsx';
import { SF1, SF2, SF3, SF4, SF_FRAMES } from './reels/brandfilm/Styleframes.jsx';
import { MotionTest1, MT1_FRAMES, MotionTest2, MT2_FRAMES } from './reels/brandfilm/MotionTests.jsx';
import { Film30v4, FILM_V4_FRAMES } from './reels/brandfilm/Film30v4.jsx';
import { Film15, FILM15_FRAMES, Film06, FILM06_FRAMES } from './reels/brandfilm/Cutdowns.jsx';
import { CoverProblem1920, CoverProblem1350, CoverFinal1920, Still03Info, POSTER_FRAMES } from './reels/brandfilm/DeliveryPosters.jsx';
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

    {/* Brand film — the locked 30s final cut ("Yerine Oturdu"). */}
    {comp('BrandFilm30', Film30, FILM30_FRAMES)}

    {/* Brand film — the council's four styleframes (static posters first). */}
    {comp('SF1-Problem', SF1, SF_FRAMES)}
    {comp('SF2-Evlek', SF2, SF_FRAMES)}
    {comp('SF3-Info', SF3, SF_FRAMES)}
    {comp('SF4-Final', SF4, SF_FRAMES)}

    {/* Brand film — the council's two motion tests (art direction locked). */}
    {comp('MT1-Cobalt', MotionTest1, MT1_FRAMES)}
    {comp('MT2-Final', MotionTest2, MT2_FRAMES)}

    {/* Brand film — V4: the approved full 30s rebuild. */}
    {comp('BrandFilmV4', Film30v4, FILM_V4_FRAMES)}

    {/* Brand film — delivery cutdowns (re-timed remixes, master untouched). */}
    {comp('EvlekBrandFilm15', Film15, FILM15_FRAMES)}
    {comp('EvlekBrandFilm06', Film06, FILM06_FRAMES)}

    {/* Brand film — delivery covers & re-composed stills (single frame). */}
    {comp('CoverProblem1920', CoverProblem1920, POSTER_FRAMES)}
    <Composition id="CoverProblem1350" component={CoverProblem1350} durationInFrames={POSTER_FRAMES}
                 fps={FPS} width={1080} height={1350} />
    {comp('CoverFinal1920', CoverFinal1920, POSTER_FRAMES)}
    {comp('Still03Info', Still03Info, POSTER_FRAMES)}

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
