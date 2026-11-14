import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {Film, ScreenOnly} from './v7/Film';
import {Master} from './v8/Master';
import {V10} from './v10/V10';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
export const Root: React.FC = () => (
  <>
    <Composition id="V10-916" component={V10} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="V8-916" component={Master} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="V7-916" component={Film} durationInFrames={1800} fps={60} width={1080} height={1920} />
    <Composition id="V7-SCREEN" component={ScreenOnly} durationInFrames={1} fps={60} width={1179} height={2556} defaultProps={{at: 9.2}} />
    <Composition id="Main916" component={Main} durationInFrames={720} fps={30} width={1080} height={1920} />
  </>
);
