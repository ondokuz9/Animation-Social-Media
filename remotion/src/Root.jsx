import React from 'react';
import { Composition } from 'remotion';
import './brand/evlek.css';
import './brand/hanken-weights.css';
import { FPS, WIDTH, HEIGHT, f } from './brand/tokens.js';
import { Agent, AGENT_SECONDS } from './reels/emlakci/scenes/Agent.jsx';
import { Diller, DILLER_SECONDS } from './reels/emlakci/scenes/Diller.jsx';
import { Staging, STAGING_SECONDS } from './reels/emlakci/scenes/Staging.jsx';
import { Match, MATCH_SECONDS } from './reels/emlakci/scenes/Match.jsx';
import { Registers, REGISTERS_SECONDS } from './reels/emlakci/Registers.jsx';

const comp = (id, component, seconds) => (
  <Composition id={id} component={component} durationInFrames={f(seconds)}
               fps={FPS} width={WIDTH} height={HEIGHT} />
);

export const RemotionRoot = () => (
  <>
    {comp('A1-Agent', Agent, AGENT_SECONDS)}
    {comp('A3-Diller', Diller, DILLER_SECONDS)}
    {comp('A4-Staging', Staging, STAGING_SECONDS)}
    {comp('A5-Match', Match, MATCH_SECONDS)}
    {comp('PREVIEW-Registers', Registers, REGISTERS_SECONDS)}
  </>
);
