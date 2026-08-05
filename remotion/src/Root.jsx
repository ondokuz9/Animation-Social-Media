import React from 'react';
import { Composition } from 'remotion';
import './brand/evlek.css';
import './brand/hanken-weights.css';
import { FPS, WIDTH, HEIGHT, f } from './brand/tokens.js';
import { Tamamlama, TAMAMLAMA_SECONDS } from './reels/emlakci/scenes/Tamamlama.jsx';

// One composition per scene while the film is being built, so any beat can be
// scrubbed and rendered on its own. They are assembled into the full reel with
// <Series> once each scene is signed off.
export const RemotionRoot = () => (
  <>
    <Composition
      id="P2-Tamamlama"
      component={Tamamlama}
      durationInFrames={f(TAMAMLAMA_SECONDS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
