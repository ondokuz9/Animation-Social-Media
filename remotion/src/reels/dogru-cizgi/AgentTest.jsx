import React from 'react';
import { AbsoluteFill } from 'remotion';
import { agentDrawing } from './engine/agent.js';

// Pose sheet for reviewing the agent rig. Not part of the film.
const POSES = [
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ facing: 1, walk: 1, phase: (i / 8) * Math.PI * 2 })),
  { facing: 0 }, { facing: 0, present: 1, yaw: -0.7 }, { facing: 0.35, usher: 1, yaw: 0.8 }, { facing: 0.35, offer: 1, yaw: 0, tilt: 0.1 },
  { facing: 0.5, present: 1, yaw: 0.7 }, { facing: -1, walk: 1, phase: 2 }, { facing: 1, offer: 1 }, { facing: 0, present: -0.12 },
];
export const AgentTest = () => (
  <AbsoluteFill style={{ background: '#0A2540' }}>
    <svg width={1080} height={1920}>
      {POSES.map((p, i) => {
        const x = 135 + (i % 4) * 270, y = 440 + Math.floor(i / 4) * 460;
        return agentDrawing(p).map((st, j) => (
          <polyline key={`${i}-${j}`} fill="none" stroke={`rgba(240,230,210,${st.w})`} strokeWidth={1.6} strokeLinejoin="round"
                    points={st.pts.map(([px, py]) => `${x + px * 2},${y - py * 2}`).join(' ')} />
        ));
      })}
      {POSES.map((_, i) => <line key={`g${i}`} x1={135 + (i % 4) * 270 - 110} x2={135 + (i % 4) * 270 + 110} y1={440 + Math.floor(i / 4) * 460} y2={440 + Math.floor(i / 4) * 460} stroke="rgba(255,255,255,0.2)" />)}
    </svg>
  </AbsoluteFill>
);
