// v14 · markasız 3D telefon (v12/Phone.tsx'in kopyası; v12 ve v13 değişmez). docs/v14/BULGULAR.md (telefon maddeleri).
// Koyu nötr metal gövde (açık titanyum yok), parlak pah ışığı (siluet zeminden ayrılır), 30 dilimli yan yüz + speküler şerit,
// sağda iki metal tuş (güç + ses), cam mürekkebi #0B0D10, delik kamera ekranın ortasında, ortam + yumuşak düşen gölge.
// Ekranın üstüne hiçbir katman binmez (filtre/karartma yok).
import React from 'react';
import {mix} from '../v10/core';

export const PW = 1299, PH = 2700, OX = 60, OY = 72, SW = 1179, SH = 2556;
const BX = 26, BY = 36, BW = 1247, BH = 2628, BR = 138; // gövde dış hattı
const SR = 104; // ekran köşe yarıçapı (BR − 34, eşmerkezli)
const DEPTH = 150, N = 30, PERSP = 3200;

export type Pose = {x: number; y: number; s: number; rx: number; ry: number; rz: number};
export const P = (x: number, y: number, s: number, rx = 0, ry = 0, rz = 0): Pose => ({x, y, s, rx, ry, rz});
export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), s: mix(a.s, b.s, k), rx: mix(a.rx, b.rx, k), ry: mix(a.ry, b.ry, k), rz: mix(a.rz, b.rz, k)});

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
export const projectOut = (p: Pose, sx: number, sy: number) => bodyToOut(p, OX + sx, OY + sy, 1);
export const bodyBox = (p: Pose) => {
  const pts = [[BX, BY], [BX + BW, BY], [BX, BY + BH], [BX + BW, BY + BH]].flatMap(([a, b]) => [bodyToOut(p, a, b, 0), bodyToOut(p, a, b, -DEPTH)]);
  return {x0: Math.min(...pts.map((q) => q.x)), x1: Math.max(...pts.map((q) => q.x)), y0: Math.min(...pts.map((q) => q.y)), y1: Math.max(...pts.map((q) => q.y))};
};

// yan yüz tonları (ön pah → arka pah), koyu nötr metal
const sideTone = (k: number): [string, string] => {
  if (k < 0.06) return ['#8A9298', '#5A6268'];
  if (k < 0.2) return ['#4A5157', '#30363B'];
  if (k < 0.42) return ['#6C747B', '#454C52']; // speküler şerit
  if (k < 0.85) return ['#2E3439', '#1C2024'];
  if (k < 0.94) return ['#23282C', '#15181B'];
  return ['#5A6268', '#2E3439'];
};
const Key: React.FC<{y0: number; y1: number}> = ({y0, y1}) => (
  <div style={{position: 'absolute', left: BX + BW - 2, top: y0, width: 9, height: y1 - y0, borderRadius: 4, background: 'linear-gradient(90deg, #3E454B 0%, #8A9298 45%, #4A5157 100%)'}} />
);

/** onPhoto: fotoğraf zeminine geçişte gölge biraz daha yumuşak ve açık */
export const Phone: React.FC<{pose: Pose; children?: React.ReactNode; shadow?: number; onPhoto?: number; lit?: number; sweep?: number; flash?: number}> = ({pose, children, shadow = 1, onPhoto = 0, lit = 1, sweep = -1, flash = 0}) => {
  const {x, y, s, rx, ry, rz} = pose;
  const left = x - PW / 2, top = y - PH / 2;
  const sh = (dx: number, dy: number, blur: number, a: number, grow: number) => (
    <div style={{position: 'absolute', left: left + BX, top: top + BY, width: BW, height: BH, borderRadius: BR,
      transform: `translate(${dx}px, ${dy}px) rotate(${rz}deg) scale(${s * grow * Math.cos((ry * Math.PI) / 180)}, ${s * grow * Math.cos((rx * Math.PI) / 180)})`,
      background: `rgba(0,6,14,${a * shadow})`, filter: `blur(${blur}px)`}} />
  );
  const mx = 30 - ry * 2, my = 10 + rx * 2;
  return (
    <>
      {/* ortam gölgesi + yumuşak düşen gölge */}
      {sh(0, 24 * s, 40 * s, mix(0.45, 0.38, onPhoto), 0.98)}
      {sh(-0.25 * ry * s, 110 * s, 150 * s, mix(0.32, 0.26, onPhoto), 0.96)}
      <div style={{position: 'absolute', inset: 0, perspective: PERSP, perspectiveOrigin: `${x}px ${y}px`}}>
        <div style={{position: 'absolute', left, top, width: PW, height: PH, transformStyle: 'preserve-3d', transformOrigin: 'center',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s})`}}>
          {/* arka kapak */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: 'linear-gradient(135deg, #262B30, #14171A)', transform: `translateZ(${-DEPTH}px)`}} />
          {/* yan yüz: 30 dilim */}
          {Array.from({length: N}, (_, i) => {
            const k = (i + 0.5) / N;
            const [a, b] = sideTone(k);
            return (
              <div key={i} style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `translateZ(${-k * DEPTH}px)`, transformStyle: 'preserve-3d'}}>
                <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: `linear-gradient(118deg, ${a} 0%, ${b} 46%, ${b} 70%, ${a} 100%)`}} />
                {k > 0.34 && k < 0.66 && (
                  <>
                    <Key y0={700} y1={930} />
                    <Key y0={1040} y1={1480} />
                  </>
                )}
              </div>
            );
          })}
          {/* ön metal halka */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR,
            background: 'linear-gradient(135deg, #5C636A 0%, #3A4046 22%, #23282C 55%, #30363B 80%, #4E555B 100%)'}} />
          {/* pah ışığı (siluet) */}
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, boxShadow: `inset 0 0 0 4px rgba(255,255,255,${0.25 + 0.3 * lit})`, transform: 'translateZ(0.3px)', pointerEvents: 'none',
            WebkitMaskImage: `radial-gradient(farthest-corner at ${mx}% ${my}%, #000 0%, rgba(0,0,0,.25) 55%, #000 100%)`}} />
          {/* kenar ışığı süpürmesi (yalnız gövde bandında; ekranın üstüne binmez) */}
          {sweep >= 0 && sweep <= 1 && (() => {
            const pp = -15 + 130 * sweep;
            const m = `linear-gradient(118deg, transparent ${pp - 9}%, rgba(0,0,0,.35) ${pp - 4}%, #000 ${pp}%, rgba(0,0,0,.35) ${pp + 4}%, transparent ${pp + 9}%)`;
            return (
              <>
                <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, boxShadow: 'inset 0 0 0 5px rgba(250,248,242,.95)', transform: 'translateZ(0.35px)', pointerEvents: 'none', WebkitMaskImage: m}} />
                {[45, 50, 55].map((z) => <div key={z} style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, background: '#E6E2D8', transform: `translateZ(${-z}px)`, WebkitMaskImage: m, opacity: 0.55}} />)}
              </>
            );
          })()}
          {flash > 0.002 && <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: BR, boxShadow: `inset 0 0 0 5px rgba(250,248,242,${0.6 * flash}), 0 0 36px 4px rgba(178,185,189,${0.35 * flash})`, transform: 'translateZ(0.36px)', pointerEvents: 'none'}} />}
          {/* cam mürekkebi */}
          <div style={{position: 'absolute', left: BX + 12, top: BY + 12, width: BW - 24, height: BH - 24, borderRadius: BR - 12, background: '#0B0D10', transform: 'translateZ(0.5px)'}} />
          {/* cam kenarı parıltısı: yalnız mürekkep halkasında (ekran dikdörtgeni dışarıda) */}
          <div style={{position: 'absolute', left: BX + 12, top: BY + 12, width: BW - 24, height: BH - 24, borderRadius: BR - 12, transform: 'translateZ(0.6px)', pointerEvents: 'none',
            boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.09)', background: 'radial-gradient(120% 60% at 15% 0%, rgba(255,255,255,.07), transparent 60%)'}} />
          {/* ekran */}
          <div style={{position: 'absolute', left: OX, top: OY, width: SW, height: SH, borderRadius: SR, overflow: 'hidden', background: '#000', transform: 'translateZ(1px)'}}>
            {children}
          </div>
          {/* ekranın 1,5 px dışında ince halka (bordür üstünde) */}
          <div style={{position: 'absolute', left: OX - 1.5, top: OY - 1.5, width: SW + 3, height: SH + 3, borderRadius: SR + 1.5, boxShadow: '0 0 0 1.5px rgba(255,255,255,.06)', transform: 'translateZ(1.2px)', pointerEvents: 'none'}} />
          {/* delik kamera: merkez gövdede (649,5; 148) */}
          <div style={{position: 'absolute', left: 627.5, top: 126, width: 44, height: 44, borderRadius: 22, background: 'radial-gradient(circle at 42% 38%, #3A4B5A 0 9%, #0E1418 30%, #000 62%)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.06)', transform: 'translateZ(1.5px)'}}>
            <div style={{position: 'absolute', left: 27, top: 27, width: 3, height: 3, borderRadius: 2, background: 'rgba(140,170,200,.55)'}} />
          </div>
        </div>
      </div>
    </>
  );
};
