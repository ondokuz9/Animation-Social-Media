// v12 · markasız 3D telefon (v10/Phone.tsx'in kopyası; v10 değişmez).
// Kurul kararı: hap ada yok → Ø44 delik kamera; gövde yarıçapı 128, ekran yarıçapı 96; tek tonlu grafit çerçeve;
// sol yan tuşlar yok (yalnız sağda güç tuşu). Fotoğraf üstünde temas gölgesi. projectOut: doğru 3B izdüşüm.
import React from 'react';
import {mix} from '../v10/core';

export const PW = 1299, PH = 2700, OX = 60, OY = 72, SW = 1179, SH = 2556;
const BX = 26, BY = 36, BW = 1247, BH = 2628, BR = 128; // gövde dış hattı
const SR = 96; // ekran köşe yarıçapı
const DEPTH = 150, N = 18, PERSP = 3200;

export type Pose = {x: number; y: number; s: number; rx: number; ry: number; rz: number};
export const P = (x: number, y: number, s: number, rx = 0, ry = 0, rz = 0): Pose => ({x, y, s, rx, ry, rz});
export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), s: mix(a.s, b.s, k), rx: mix(a.rx, b.rx, k), ry: mix(a.ry, b.ry, k), rz: mix(a.rz, b.rz, k)});

/** gövde düzlemindeki nokta (gövde koordinatı, merkez PW/2, PH/2) → çıktı pikseli.
 *  CSS ile aynı zincir: perspective(3200, köken = poz merkezi) · rotateX · rotateY · rotateZ · scale3d(s). */
export const bodyToOut = (p: Pose, bx: number, by: number, bz = 1) => {
  const r = Math.PI / 180;
  let x = (bx - PW / 2) * p.s, y = (by - PH / 2) * p.s, z = bz * p.s;
  const cz = Math.cos(p.rz * r), sz = Math.sin(p.rz * r);
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  const cy = Math.cos(p.ry * r), sy = Math.sin(p.ry * r);
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  const cx = Math.cos(p.rx * r), sx = Math.sin(p.rx * r);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  const f = PERSP / (PERSP - z);
  return {x: p.x + x * f, y: p.y + y * f};
};
/** ekran noktası (ekran koordinatı, 1179×2556) → çıktı pikseli */
export const projectOut = (p: Pose, sx: number, sy: number) => bodyToOut(p, OX + sx, OY + sy, 1);
/** gövde dış hattının çıktıdaki sınır kutusu (QC ve yerleşim payları için) */
export const bodyBox = (p: Pose) => {
  const pts = [[BX, BY], [BX + BW, BY], [BX, BY + BH], [BX + BW, BY + BH]].flatMap(([a, b]) => [bodyToOut(p, a, b, 0), bodyToOut(p, a, b, -DEPTH)]);
  return {x0: Math.min(...pts.map((q) => q.x)), x1: Math.max(...pts.map((q) => q.x)), y0: Math.min(...pts.map((q) => q.y)), y1: Math.max(...pts.map((q) => q.y))};
};

const sideTone = (k: number) => {
  if (k < 0.08) return ['#AEB7BB', '#4F5F68'];
  if (k < 0.16) return ['#66777F', '#24333E'];
  if (k > 0.92) return ['#6E7C83', '#26343F'];
  return ['#384955', '#121D26'];
};
const Btn: React.FC<{x: number; y: number; h: number; w?: number}> = ({x, y, h, w = 10}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 5, background: '#2F404C'}} />
);

/** onPhoto: net fotoğraf zemininde temas + ortam gölgesi (kurul); aksi halde lacivert zeminde üç katman */
export const Phone: React.FC<{pose: Pose; children?: React.ReactNode; shadow?: number; onPhoto?: number}> = ({pose, children, shadow = 1, onPhoto = 0}) => {
  const {x, y, s, rx, ry, rz} = pose;
  const left = x - PW / 2, top = y - PH / 2;
  const lift = 1 + Math.abs(rx) / 30 + Math.abs(ry) / 40;
  const sh = (dx: number, dy: number, blur: number, a: number, grow: number) => (
    <div style={{position: 'absolute', left: left + BX, top: top + BY, width: BW, height: BH, borderRadius: BR,
      transform: `translate(${dx * s * lift}px, ${dy * s * lift}px) rotate(${rz}deg) scale(${s * grow * Math.cos((ry * Math.PI) / 180)}, ${s * grow * Math.cos((rx * Math.PI) / 180)})`,
      background: `rgba(2,8,16,${a * shadow})`, filter: `blur(${blur * s}px)`}} />
  );
  const d = 1 - onPhoto;
  return (
    <>
      {d > 0 && sh(150, 260, 260, 0.55 * d, 1.04)}
      {d > 0 && sh(70, 120, 90, 0.5 * d, 1.0)}
      {d > 0 && sh(22, 36, 24, 0.55 * d, 0.99)}
      {onPhoto > 0 && sh(0, 140, 220, 0.22 * onPhoto, 1.02)}
      {onPhoto > 0 && sh(-40, 60, 80, 0.35 * onPhoto, 1.0)}
      <div style={{position: 'absolute', inset: 0, perspective: PERSP, perspectiveOrigin: `${x}px ${y}px`}}>
        <div style={{position: 'absolute', left, top, width: PW, height: PH, transformStyle: 'preserve-3d', transformOrigin: 'center',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s})`}}>
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: 'linear-gradient(135deg,#2A3A46,#0E1820)', transform: `translateZ(${-DEPTH}px)`}} />
          {Array.from({length: N}, (_, i) => {
            const k = (i + 1) / (N + 1);
            const [a, b] = sideTone(k);
            return (
              <div key={i} style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `translateZ(${-k * DEPTH}px)`, transformStyle: 'preserve-3d'}}>
                <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: `linear-gradient(118deg, ${a} 0%, ${b} 46%, ${b} 70%, ${a} 100%)`}} />
                {k > 0.3 && k < 0.7 && <Btn x={BX + BW - 1} y={640} h={140} />}
              </div>
            );
          })}
          {/* ön yüz: tek tonlu grafit çerçeve + siyah cam */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR,
            background: 'linear-gradient(125deg,#3C4D59 0%,#2B3B47 30%,#16232D 70%,#2B3B47 100%)'}} />
          <div style={{position: 'absolute', left: BX + 9, top: BY + 9, width: BW - 18, height: BH - 18, borderRadius: BR - 9, background: '#030507', transform: 'translateZ(0.5px)'}} />
          <div style={{position: 'absolute', left: OX, top: OY, width: SW, height: SH, borderRadius: SR, overflow: 'hidden', background: '#000', transform: 'translateZ(1px)'}}>
            {children}
          </div>
          {/* delik kamera */}
          <div style={{position: 'absolute', left: 589.5 - 22, top: 50 + OY - 22 + 8, width: 44, height: 44, borderRadius: 22, background: 'radial-gradient(circle at 40% 38%, #2E4250 0 16%, #0B151C 44%, #020405 70%)', transform: 'translateZ(1.5px)'}} />
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.16)', transform: 'translateZ(1.6px)', pointerEvents: 'none',
            WebkitMaskImage: `radial-gradient(farthest-corner at ${30 - ry * 2}% ${10 + rx * 2}%, #000 0%, rgba(0,0,0,.25) 55%, #000 100%)`}} />
        </div>
      </div>
    </>
  );
};
