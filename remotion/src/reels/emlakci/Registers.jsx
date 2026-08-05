import React from 'react';
import { Series } from 'remotion';
import { f } from '../../brand/tokens.js';
import { Diller, DILLER_SECONDS } from './scenes/Diller.jsx';
import { Staging, STAGING_SECONDS } from './scenes/Staging.jsx';
import { Match, MATCH_SECONDS } from './scenes/Match.jsx';

// Three registers back to back, to judge the cuts between them: type on cream,
// a photograph filling the frame, then a diagram on navy.
export const Registers = () => (
  <Series>
    <Series.Sequence durationInFrames={f(DILLER_SECONDS)}><Diller /></Series.Sequence>
    <Series.Sequence durationInFrames={f(STAGING_SECONDS)}><Staging /></Series.Sequence>
    <Series.Sequence durationInFrames={f(MATCH_SECONDS)}><Match /></Series.Sequence>
  </Series>
);
export const REGISTERS_SECONDS = DILLER_SECONDS + STAGING_SECONDS + MATCH_SECONDS;
