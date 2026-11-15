// v16 · AÇILIŞ DENEMESİ A · "evle açılan": gerçek Lapta ilanının fotoğrafı → gerçek £139.000 kartı → ChatGPT sohbeti.
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, EvIcon, F, FPS, IO, Logo, lin, mix, useFontsV10} from '../v10/core';
import {OX, OY, P, PH, PW, Phone, mixPose} from '../v15/Phone';
import {Screen} from './Screen';
import {CARD, QueryTag, WIN} from './V16';
import {CHUNKS, TL} from './tl';

const EXP = Easing.bezier(0.62, 0, 0.12, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const CARDS = P((PW / 2 - OX) * 1, (PH / 2 - OY - 560) * 1, 1);
const FULL = P(540, 1100, 0.58);
const A = {type: [0.25, 0.5, 0.75, 1.0], shrink: [1.7, 2.4], pull: [3.3, 4.1], title: [3.7, 4.3]};
const TS = TL.coast[1] + 0.05; // ekran durumu: kart şeridi £139.000'de durmuş
export const OpenA: React.FC = () => {
  const ok = useFontsV10();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: C.cream}} />;
  const k = EXP(lin(t, A.shrink[0], A.shrink[1]));
  const pan = Easing.out(Easing.quad)(lin(t, 0, A.shrink[0]));
  const R = 1600 / 1200;
  const a = {x: mix(-470, -400, pan) * R, y: 0, w: 1600 * R, h: 1600};
  const c = {x: mix(WIN.x, CARD.x, k), y: mix(WIN.y, CARD.y, k), w: mix(WIN.w, CARD.w, k), h: mix(WIN.h, CARD.h, k)};
  const i = {x: mix(a.x, 0, k), y: mix(a.y, 0, k), w: mix(a.w, CARD.w, k), h: mix(a.h, CARD.h, k)};
  const pk = IO(lin(t, A.pull[0], A.pull[1]));
  const pose = mixPose(CARDS, FULL, pk);
  const tk = OUT(lin(t, A.title[0], A.title[1]));
  return (
    <AbsoluteFill style={{background: C.cream, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(120% 70% at 30% 18%, #FFFEFB 0%, ${C.cream} 46%, #F0EBDF 100%)`}} />
      {t >= A.shrink[0] && <Phone pose={pose} lit={1} sweep={-1} flash={0}><Screen t={TS} noCursor /></Phone>}
      <QueryTag o={OUT(lin(t, A.shrink[1] - 0.15, A.shrink[1] + 0.2)) * (1 - lin(t, A.pull[0], A.pull[0] + 0.2))} />
      <AbsoluteFill style={{background: C.cream, opacity: 1 - lin(k, 0.3, 0.8)}} />
      {k < 1 && (
        <div style={{position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, overflow: 'hidden', borderRadius: mix(0, 36, lin(k, 0.4, 1)), opacity: 1 - lin(k, 0.96, 1)}}>
          <Img src={staticFile('v12/EVL-100102_00_l2560.png')} style={{position: 'absolute', left: i.x, top: i.y, width: i.w, height: i.h}} />
        </div>
      )}
      <div style={{position: 'absolute', left: 72, top: 250, fontFamily: F, color: C.navy, opacity: 1 - lin(t, A.shrink[0], A.shrink[0] + 0.2)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 36, fontWeight: 600}}><EvIcon size={54} r={0.28} />Evlek<span style={{fontWeight: 500, opacity: 0.6}}>· ChatGPT’de</span></div>
        <div style={{marginTop: 22, fontSize: 96, fontWeight: 700, lineHeight: '104px', letterSpacing: '-0.045em', whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"'}}>
          {CHUNKS.map((s, j) => { const o = OUT(lin(t, A.type[j], A.type[j] + 0.14)); return <div key={s} style={{opacity: o, transform: `translateY(${(1 - o) * 22}px)`}}>{s}</div>; })}
        </div>
      </div>
      {tk > 0 && (
        <div style={{position: 'absolute', left: 72, top: 120, display: 'flex', alignItems: 'flex-end', gap: 26, opacity: tk, transform: `translateY(${(1 - tk) * 20}px)`}}>
          <Logo h={92} color={C.navy} />
          <div style={{fontFamily: F, fontSize: 60, fontWeight: 700, letterSpacing: '-0.04em', color: C.navy, lineHeight: '74px', whiteSpace: 'nowrap'}}>artık ChatGPT’de.</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
