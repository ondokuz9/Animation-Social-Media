// v12 kısa sürümler: master V12'den kesme listesi (yeni çizim yok; tek kodlama kuşağı).
// Kesme = [master başlangıç sn, master bitiş sn]. Toplamlar docs/v12/FINAL-RAPOR.md (G) ile aynı.
import React from 'react';
import {Sequence, Series} from 'remotion';
import {FPS} from '../v10/core';
import {V12} from './V12';

export const CUTS_15: [number, number][] = [[0, 3.45], [4.15, 6.25], [6.25, 7.7], [8.2, 8.65], [8.65, 11.05], [16.2, 17.25], [19.25, 20.4], [27.05, 29.45], [29.45, 30]];
export const CUTS_6: [number, number][] = [[0, 2.95], [2.95, 3.45], [26.9, 29.45]];
export const framesOf = (c: [number, number][]) => c.reduce((n, [a, b]) => n + Math.round(b * FPS) - Math.round(a * FPS), 0);

const Cut: React.FC<{cuts: [number, number][]}> = ({cuts}) => (
  <Series>
    {cuts.map(([a, b], i) => (
      <Series.Sequence key={i} durationInFrames={Math.round(b * FPS) - Math.round(a * FPS)}>
        <Sequence from={-Math.round(a * FPS)}><V12 /></Sequence>
      </Series.Sequence>
    ))}
  </Series>
);
export const V12_15: React.FC = () => <Cut cuts={CUTS_15} />;
export const V12_6: React.FC = () => <Cut cuts={CUTS_6} />;
