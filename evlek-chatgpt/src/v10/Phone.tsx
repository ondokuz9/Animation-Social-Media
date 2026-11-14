// v10 · markasız 3D telefon. v9 hatası düzeltildi: scale3d ile kalınlık da ölçeklenir (tasarım kalınlığı 150 px).
// Kalınlık 18 dolu katmandan oluşur; yan tuşlar ön yüzde değil yan yüzde, kalınlığın ortasında.
// Gölge üç katman: temas, yayılım, ortam. Işık sol üstten (saat 10).
import React from 'react';
import {mix} from './core';

export const PW = 1299, PH = 2700, OX = 60, OY = 72, SW = 1179, SH = 2556;
const BX = 26, BY = 36, BW = 1247, BH = 2628, BR = 157; // gövde dış hattı
const DEPTH = 150, N = 18;

export type Pose = {x: number; y: number; s: number; rx: number; ry: number; rz: number};
export const P = (x: number, y: number, s: number, rx = 0, ry = 0, rz = 0): Pose => ({x, y, s, rx, ry, rz});
export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), s: mix(a.s, b.s, k), rx: mix(a.rx, b.rx, k), ry: mix(a.ry, b.ry, k), rz: mix(a.rz, b.rz, k)});
/** ekran noktası (sx, sy) → çıktı pikseli; yalnız rx=ry=rz=0 iken birebir doğrudur */
export const screenToOut = (p: Pose, sx: number, sy: number) => ({x: p.x + p.s * (OX + sx - PW / 2), y: p.y + p.s * (OY + sy - PH / 2)});

// yan yüz rengi derinliğe göre: önde parlak pah, ortada koyu anodize, arkada ince pah
const sideTone = (k: number) => {
  // k: 0 (ön) → 1 (arka)
  if (k < 0.08) return ['#C9D0D2', '#55666F'];
  if (k < 0.16) return ['#6F818B', '#24333E'];
  if (k > 0.92) return ['#7D8B92', '#26343F'];
  return ['#3A4C59', '#121D26'];
};

const Btn: React.FC<{x: number; y: number; h: number; w?: number}> = ({x, y, h, w = 10}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 5, background: '#2F404C'}} />
);

export const Phone: React.FC<{pose: Pose; children?: React.ReactNode; dark?: boolean; shadow?: number}> = ({pose, children, dark = true, shadow = 1}) => {
  const {x, y, s, rx, ry, rz} = pose;
  const left = x - PW / 2, top = y - PH / 2;
  // gölge kayması: ışık sol üstte, telefon eğildikçe gölge uzar
  const lift = 1 + Math.abs(rx) / 30 + Math.abs(ry) / 40;
  const sh = (dx: number, dy: number, blur: number, a: number, grow: number) => (
    <div style={{position: 'absolute', left: left + BX, top: top + BY, width: BW, height: BH, borderRadius: BR,
      transform: `translate(${dx * s * lift}px, ${dy * s * lift}px) rotate(${rz}deg) scale(${s * grow * Math.cos((ry * Math.PI) / 180)}, ${s * grow * Math.cos((rx * Math.PI) / 180)})`,
      background: `rgba(2,8,16,${a * shadow})`, filter: `blur(${blur * s}px)`}} />
  );
  return (
    <>
      {/* üç katman gölge (2D, telefonun altında) */}
      {sh(150, 260, 260, dark ? 0.55 : 0.30, 1.04)}
      {sh(70, 120, 90, dark ? 0.50 : 0.32, 1.0)}
      {sh(22, 36, 24, dark ? 0.55 : 0.38, 0.99)}
      <div style={{position: 'absolute', inset: 0, perspective: 3200, perspectiveOrigin: `${x}px ${y}px`}}>
        <div style={{position: 'absolute', left, top, width: PW, height: PH, transformStyle: 'preserve-3d', transformOrigin: 'center',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s})`}}>
          {/* arka plaka */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: 'linear-gradient(135deg,#2A3A46,#0E1820)', transform: `translateZ(${-DEPTH}px)`}} />
          {/* kalınlık katmanları */}
          {Array.from({length: N}, (_, i) => {
            const k = (i + 1) / (N + 1);
            const z = -k * DEPTH;
            const [a, b] = sideTone(k);
            const btn = k > 0.3 && k < 0.7;
            return (
              <div key={i} style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d'}}>
                <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: `linear-gradient(118deg, ${a} 0%, ${b} 46%, ${b} 70%, ${a} 100%)`}} />
                {btn && (
                  <>
                    <Btn x={BX - 9} y={492} h={132} />
                    <Btn x={BX - 9} y={672} h={164} />
                    <Btn x={BX + BW - 1} y={652} h={236} />
                  </>
                )}
              </div>
            );
          })}
          {/* ön yüz: metal çerçeve + siyah cam */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR,
            background: 'linear-gradient(125deg,#E3E6E2 0%,#8796A0 9%,#2B3B47 26%,#16232D 58%,#3C4D59 86%,#B9C0BE 100%)'}} />
          <div style={{position: 'absolute', left: BX + 9, top: BY + 9, width: BW - 18, height: BH - 18, borderRadius: BR - 9, background: '#030507', transform: 'translateZ(0.5px)'}} />
          {/* ekran */}
          <div style={{position: 'absolute', left: OX, top: OY, width: SW, height: SH, borderRadius: 117, overflow: 'hidden', background: '#000', transform: 'translateZ(1px)'}}>
            {children}
          </div>
          {/* sensör adası */}
          <div style={{position: 'absolute', left: PW / 2 - 186, top: OY + 34, width: 372, height: 108, borderRadius: 54, background: '#010203', transform: 'translateZ(1.5px)'}}>
            <div style={{position: 'absolute', right: 34, top: 34, width: 40, height: 40, borderRadius: 20, background: 'radial-gradient(circle at 40% 38%, #3B5363 0 18%, #0E1A22 46%, #05080A 70%)'}} />
          </div>
          {/* çerçeve ışığı: yalnız metal kenarda (ekranın üstünde efekt yok) */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.22)', transform: 'translateZ(1.6px)', pointerEvents: 'none',
            WebkitMaskImage: `radial-gradient(farthest-corner at ${30 - ry * 2}% ${10 + rx * 2}%, #000 0%, rgba(0,0,0,.25) 55%, #000 100%)`}} />
        </div>
      </div>
    </>
  );
};
