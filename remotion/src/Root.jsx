import React from 'react';
import { Composition } from 'remotion';
import './brand/evlek.css';
import './brand/hanken-weights.css';
import { FPS, WIDTH, HEIGHT, f } from './brand/tokens.js';
import { Agent, AGENT_SECONDS } from './reels/emlakci/scenes/Agent.jsx';

// While the film is being built each act is its own composition, so any beat can
// be scrubbed and rendered alone. They get assembled with <Series> once signed off.
export const RemotionRoot = () => (
  <>
    <Composition
      id="A1-Agent"
      component={Agent}
      durationInFrames={f(AGENT_SECONDS)}
      fps={FPS} width={WIDTH} height={HEIGHT}
    />
  </>
);
