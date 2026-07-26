const R = window.__resources;
/* Evlek tanıtım reel v7 — FINAL · 1080×1920 · 21.45 sn. Saf render(t). */
const { SceneStage, useScene, clamp } = window;

const NAVY = '#0A2540', GOLD = '#C9A157', KREM = '#F4F1EB', BEYAZ = '#FFFFFF', SICAK = '#F8F6F1', SICAK2 = '#F7F4EE';
const MONO = "'JetBrains Mono',ui-monospace,monospace";
const SANS = "'Hanken Grotesk',system-ui,sans-serif";
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const ABS = { position: 'absolute', inset: 0 };
const nvy = (a) => `rgba(10,37,64,${a})`;
const lerp = (a, b, m) => a + (b - a) * m;

function mv(lt, t0, d = 0.26, dist = 18) {
  const x = EASE((lt - t0) / d);
  return { opacity: x, transform: `translateY(${(1 - x) * dist}px)` };
}
const fade = (lt, t0, d = 0.24) => ({ opacity: EASE((lt - t0) / d) });

const Check = ({ size = 30, color = GOLD, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp(draw * 1.3, 0, 1)} />
    <path d="M7.5 12.2 L10.6 15.3 L16.5 9.2" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp((draw - 0.35) * 1.6, 0, 1)} />
  </svg>
);
const lblS = { fontFamily: SANS, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' };
const OrnekEkran = ({ style }) => (
  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: nvy(0.6), border: `1.5px solid ${nvy(0.2)}`, background: BEYAZ, borderRadius: 999, padding: '7px 18px', ...style }}>Örnek ekran</span>
);
const Cursor = ({ x, y, op }) => (
  <svg width="44" height="48" viewBox="0 0 24 26" style={{ position: 'absolute', left: x, top: y, opacity: op, filter: 'drop-shadow(0 3px 8px rgba(4,14,28,.35))' }}>
    <path d="M4 1 L4 19 L8.5 15.5 L11.5 22.5 L14.8 21 L11.8 14.2 L17.5 13.5 Z" fill="#fff" stroke={NAVY} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

/* ============ S1 · Kanca — 0–1.0 liman "Aklındaki evi…" · 1.0–2.1 salon "…sen tarif et." ============ */
function SceneKanca() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.1;
  const p = clamp(lt / dur, 0, 1);
  const wp = EASE((lt - 1.0 * k) / (0.21 * k));
  const t1 = mv(lt, 0.12 * k, 0.18 * k, 16);
  const t1out = 1 - EASE((lt - 1.0 * k) / (0.18 * k));
  const t2 = mv(lt, 1.18 * k, 0.2 * k, 16);
  let mask;
  if (wp > 0 && wp < 1) {
    const edge = (1 - wp) * 1300 - 110;
    mask = `linear-gradient(90deg, rgba(0,0,0,0) ${edge - 110}px, #000 ${edge + 110}px)`;
  }
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(lt)}s · Kanca`}>
      <div style={{ ...ABS, transform: `translateX(${lerp(-1.8, 1.2, p)}%) scale(${1.05 + 0.025 * EASE(p)})`, transformOrigin: '50% 42%' }}>
        <img src={R.hook} alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {wp > 0 && (
        <div style={{ ...ABS, transform: `translateX(${lerp(1.4, -0.6, p)}%) scale(${1.04 + 0.02 * p})`, transformOrigin: '50% 55%', WebkitMaskImage: mask, maskImage: mask }}>
          <img src={R.salon} alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: 104, top: 498, maxWidth: 650, fontFamily: SANS, fontWeight: 700, fontSize: 76, letterSpacing: '-0.02em', color: NAVY, opacity: Math.min(t1.opacity, t1out), transform: t1.transform }}>Aklındaki evi…</div>
      {wp > 0.3 && (
        <div style={{ position: 'absolute', left: 112, top: 608, maxWidth: 650, fontFamily: SANS, fontWeight: 700, fontSize: 74, letterSpacing: '-0.02em', color: NAVY, ...t2 }}>…sen tarif et.</div>
      )}
    </div>
  );
}

/* ============ S2 · Arama — "Evlek anlar." · 2.10–3.95 ============ */
const KRITER = ['Girne', 'Deniz manzarası', 'Türk Koçanı', '2+1', '≤ £180K'];
function SearchV7({ lt, k, dyn }) {
  const m = dyn ? EASE(lt / (0.55 * k)) : 1;
  const rect = { x: lerp(0, 110, m), y: lerp(0, 620, m), w: lerp(1080, 860, m), h: lerp(1920, 330, m), r: lerp(0, 24, m) };
  const hl = dyn ? mv(lt, 0.5 * k, 0.26 * k) : { opacity: 1 };
  const badge = dyn ? fade(lt, 0.66 * k, 0.2 * k) : { opacity: 1 };
  const qOp = dyn ? EASE((lt - 0.58 * k) / (0.16 * k)) : 1;
  const pOp = dyn ? EASE((lt - 0.85 * k) / (0.14 * k)) : 1;
  const pFlash = dyn ? pOp * (1 - EASE((lt - 1.15 * k) / (0.26 * k))) : 0;
  const pressP = dyn ? clamp((lt - 1.62 * k) / (0.18 * k), 0, 1) : 1;
  const scale = 1 - 0.04 * Math.sin(Math.PI * pressP);
  const ring = clamp(pressP * 1.3, 0, 1);
  const curP = dyn ? EASE((lt - 1.35 * k) / (0.28 * k)) : 1;
  const curOp = dyn ? Math.min(EASE((lt - 1.33 * k) / (0.12 * k)), 1 - EASE((lt - 1.72 * k) / (0.1 * k))) : 0;
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <div style={{ position: 'absolute', left: 110, top: 268, ...hl }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.1, letterSpacing: '-0.02em', color: NAVY }}>Evlek <span style={{ color: GOLD }}>anlar.</span></div>
      </div>
      <div style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, boxSizing: 'border-box', background: BEYAZ, borderRadius: rect.r, border: `2.5px solid ${m > 0.9 ? NAVY : 'rgba(10,37,64,0)'}`, boxShadow: m > 0.9 ? '0 0 0 7px rgba(201,161,87,.16)' : 'none', overflow: 'hidden' }}>
        {m < 1 && <img src={R.salon} alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 - m }} />}
        <div style={{ position: 'absolute', inset: 0, padding: '32px 36px 26px', opacity: qOp }}>
          <div style={{ position: 'absolute', right: 26, top: 26, ...badge }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, background: NAVY, color: '#fff', padding: '9px 20px', borderRadius: 999 }}>AI arama</span>
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, lineHeight: 1.55, color: NAVY, maxWidth: 620, paddingTop: 4 }}>
            Girne'de deniz gören, Türk koçanlı 2+1
            {pOp > 0 && <span style={{ opacity: pOp, background: `rgba(201,161,87,${0.34 * pFlash})`, borderRadius: 6 }}> ≤ £180K</span>}
          </div>
          <div style={{ position: 'absolute', left: 36, right: 36, bottom: 24, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }} />
            <div style={{ position: 'relative', background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 28, padding: '15px 42px', borderRadius: 999, transform: `scale(${scale})` }}>
              Ara
              <div style={{ position: 'absolute', inset: -8 * ring, borderRadius: 999, border: `2.5px solid rgba(201,161,87,${0.7 * (1 - ring)})` }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1000, display: 'flex', gap: 14, flexWrap: 'wrap', width: 860 }}>
        {KRITER.map((c, i) => {
          const t0 = (0.85 + i * 0.1) * k;
          const p2 = dyn ? EASE((lt - t0) / (0.18 * k)) : 1;
          const gold = i === 4;
          return p2 <= 0 ? null : (
            <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: NAVY, background: BEYAZ, border: `2px solid ${gold ? GOLD : nvy(0.16)}`, padding: '11px 22px', borderRadius: 999, opacity: p2, transform: `translateY(${(1 - p2) * 12}px)` }}>{c}</div>
          );
        })}
      </div>
      {dyn && curOp > 0 && <Cursor x={lerp(930, 852, curP)} y={lerp(1120, 878, curP)} op={curOp} />}
    </div>
  );
}
function SceneArama() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 1.85;
  return <div style={{ ...ABS, background: BEYAZ, overflow: 'hidden' }} data-screen-label={`${Math.floor(2.1 + lt)}s · Arama`}><SearchV7 lt={lt} k={k} dyn={true} /></div>;
}

/* ============ S3 · Sonuçlar — üçlü card deck ============ */
function KartV6({ c, sel, w, ph, priceFs }) {
  return (
    <div style={{ width: w, boxSizing: 'border-box', background: BEYAZ, borderRadius: 22, overflow: 'hidden', border: sel > 0 ? `3px solid rgba(201,161,87,${0.4 + 0.6 * sel})` : `1.5px solid ${nvy(0.1)}`, boxShadow: '0 24px 56px rgba(10,37,64,.16)', transform: `scale(${1 + 0.025 * sel})` }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={c.img} alt="" style={{ width: '100%', height: ph, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', left: 22, top: 22, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: '.02em', background: 'rgba(10,37,64,.92)', color: '#fff', border: '1px solid rgba(255,255,255,.28)', padding: '9px 20px', borderRadius: 999 }}>Türk Koçanı</div>
      </div>
      <div style={{ padding: '24px 30px 26px' }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: priceFs, letterSpacing: '-0.01em', color: NAVY }}>{c.fiyat}</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: nvy(0.72), marginTop: 6 }}>{c.yer} · 2+1</div>
      </div>
    </div>
  );
}
const C1 = { img: R.akdeniz, fiyat: '£165.000', yer: 'Girne · Zeytinlik' };
const STACK = [
  { img: R.peek, w: 775, top: 755, rot: -0.8, t0: 0.4 },   // en derin
  { img: R.kiyi, w: 810, top: 665, rot: 1.4, t0: 0.52 },
  { img: R.minimal, w: 845, top: 575, rot: -1, t0: 0.64 },
];
function ResultsV6({ lt, k, dyn }) {
  const selP = dyn ? EASE(clamp((lt - 1.5 * k) / (0.24 * k), 0, 1)) : 1;
  const m = dyn ? EASE(lt / (0.3 * k)) : 1;
  const st = (t0) => (dyn ? mv(lt, t0 * k, 0.26 * k, 26) : { opacity: 1 });
  const rect = { x: lerp(110, 100, m), y: lerp(620, 470, m), w: lerp(860, 880, m), h: lerp(330, 665, m), r: 22 };
  const cardOp = dyn ? EASE((lt - 0.2 * k) / (0.12 * k)) : 1;
  return (
    <div style={{ ...ABS, background: SICAK }}>
      <div style={{ position: 'absolute', left: 110, top: 280, ...st(0.24) }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, letterSpacing: '-0.02em', color: NAVY }}>Evlek bulur.</div>
      </div>
      {STACK.map((s, i) => {
        const e = dyn ? EASE((lt - s.t0 * k) / (0.32 * k)) : 1;
        if (e <= 0) return null;
        const y = (1 - e) * 520 - Math.sin(Math.PI * e) * 16;   // hafif settle
        return (
          <div key={i} style={{ position: 'absolute', left: (1080 - s.w) / 2, top: s.top, width: s.w, opacity: e, transform: `translateY(${y}px) rotate(${s.rot}deg)`, transformOrigin: '50% 100%' }}>
            <div style={{ width: s.w, height: 620, boxSizing: 'border-box', background: BEYAZ, borderRadius: 22, overflow: 'hidden', border: `1.5px solid ${nvy(0.12)}`, boxShadow: '0 26px 56px rgba(10,37,64,.2)' }}>
              <img src={s.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,0) 55%,rgba(10,37,64,.22) 100%)' }} />
            </div>
          </div>
        );
      })}
      {dyn && m < 1 && <div style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, background: BEYAZ, borderRadius: rect.r, border: `1.5px solid ${nvy(0.12)}`, boxShadow: '0 12px 32px rgba(10,37,64,.08)' }} />}
      <div style={{ position: 'absolute', left: 100, top: 470, opacity: cardOp }}><KartV6 c={C1} sel={selP} w={880} ph={480} priceFs={50} /></div>
    </div>
  );
}
function SceneSonuc() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.5;
  const oldOut = { opacity: 1 - EASE(lt / (0.2 * k)) };
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(3.95 + lt)}s · Sonuçlar`}>
      <ResultsV6 lt={lt} k={k} dyn={true} />
      {oldOut.opacity > 0 && <div style={{ ...ABS, ...oldOut, pointerEvents: 'none' }}><SearchV7 lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ============ S4 · Okuma — shared-element morph ============ */
function ModulV6({ y, mh, act, children }) {
  return (
    <div style={{ position: 'absolute', left: 110, top: y, width: 860, minHeight: mh, boxSizing: 'border-box', background: BEYAZ, border: `2px solid ${act > 0 ? `rgba(201,161,87,${0.35 + 0.65 * act})` : nvy(0.1)}`, borderRadius: 20, padding: '26px 32px', boxShadow: act > 0 ? '0 18px 48px rgba(10,37,64,.13)' : '0 8px 24px rgba(10,37,64,.05)', transform: `scale(${1 + 0.03 * act})` }}>{children}</div>
  );
}
const CHART = 'M0,150 L85,140 L170,146 L255,128 L340,132 L425,112 L510,118 L595,96 L680,102 L765,82 L850,70 L940,58';
function DetailV6({ lt, k, dyn }) {
  const m = dyn ? EASE(lt / (0.45 * k)) : 1;
  const bodySt = dyn ? mv(lt, 0.32 * k, 0.3 * k, 26) : { opacity: 1 };
  const W = [[0.7, 1.5], [1.5, 2.3], [2.3, 3.1]];
  const hls = W.map(([a, b]) => (dyn ? Math.min(EASE((lt - a * k) / (0.2 * k)), 1 - EASE((lt - b * k) / (0.2 * k))) : 0));
  const chkDraw = dyn ? EASE((lt - 0.75 * k) / (0.45 * k)) : 1;
  const barP = dyn ? EASE((lt - 2.3 * k) / (0.45 * k)) : 1;
  const chartP = dyn ? EASE((lt - 2.55 * k) / (0.55 * k)) : 1;
  const hlM = dyn ? Math.min(EASE((lt - 0.5 * k) / (0.24 * k)), 1 - EASE((lt - 3.12 * k) / (0.18 * k))) : 0;
  const rect = { x: lerp(100, 0, m), y: lerp(470, 0, m), w: lerp(880, 1080, m), h: lerp(480, 540, m), r: lerp(22, 0, m) };
  const priceP = { x: lerp(130, 110, m), y: lerp(974, 572, m), fs: lerp(50, 62, m) };
  const lbl = { ...lblS, fontSize: 24, color: nvy(0.5) };
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }}>
      <div style={{ ...ABS, ...bodySt }}>
        <ModulV6 y={692} mh={150} act={hls[0]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Check size={52} draw={chkDraw} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY }}>Doğrulanmış ilan veren</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 27, color: nvy(0.58), marginTop: 5 }}>Kimlik ve temel ilan bilgileri kontrol edildi</div>
            </div>
          </div>
        </ModulV6>
        <ModulV6 y={872} mh={120} act={hls[1]}>
          <div>
            <div style={lbl}>KOÇAN BİLGİSİ</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY, marginTop: 7 }}>Türk Koçanı</div>
          </div>
        </ModulV6>
        <ModulV6 y={1022} mh={470} act={hls[2]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={lbl}>BÖLGE FİYATI · £/m²</div>
            <div style={{ flex: 1 }} />
            <OrnekEkran />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 22 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: NAVY, width: 185 }}>Bu ilan</div>
            <div style={{ width: 370 * barP, height: 16, borderRadius: 8, background: NAVY }} />
            <div style={{ fontFamily: MONO, fontSize: 25, color: NAVY, opacity: barP }}>£1.941</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: nvy(0.55), width: 185 }}>Girne medyanı</div>
            <div style={{ width: 405 * barP, height: 16, borderRadius: 8, background: nvy(0.14) }} />
            <div style={{ fontFamily: MONO, fontSize: 25, color: nvy(0.55), opacity: barP }}>£2.115</div>
          </div>
          <div style={{ ...lbl, marginTop: 30 }}>SON 12 AY</div>
          <svg width="792" height="160" viewBox="0 0 940 190" style={{ display: 'block', marginTop: 14 }}>
            <path d={`${CHART} L940,190 L0,190 Z`} fill={nvy(0.05)} opacity={chartP} />
            <path d={CHART} fill="none" stroke={NAVY} strokeWidth="3.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - chartP} />
            <circle cx="940" cy="58" r="8" fill={GOLD} opacity={chartP > 0.96 ? 1 : 0} />
          </svg>
        </ModulV6>
      </div>
      <div style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r, overflow: 'hidden' }}>
        <img src={R.akdeniz} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.58) 0%,rgba(10,37,64,.34) 55%,rgba(10,37,64,0) 78%)', opacity: m }} />
      </div>
      <div style={{ position: 'absolute', left: priceP.x, top: priceP.y, display: 'flex', alignItems: 'baseline', gap: 26, whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: priceP.fs, letterSpacing: '-0.01em', color: NAVY }}>£165.000</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: nvy(0.65) }}>Girne · Zeytinlik · 2+1</div>
      </div>
      {dyn && hlM > 0 && (
        <div style={{ position: 'absolute', left: 110, top: 268, opacity: hlM }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}>Sadece bulmaz.<br />Açıklar.</div>
        </div>
      )}
    </div>
  );
}
function SceneOkuma() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 3.3;
  const bOut = 1 - EASE((lt - 0.1 * k) / (0.22 * k));
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(6.45 + lt)}s · Okuma`}>
      {bOut > 0 && <div style={{ ...ABS, opacity: bOut, pointerEvents: 'none' }}><ResultsV6 lt={1} k={0.1} dyn={false} /></div>}
      <DetailV6 lt={lt} k={k} dyn={true} />
    </div>
  );
}

/* ============ S5 · Sanal düzenleme — "Bugünkü hâli. Olabileceği hâli." ============ */
function StagingV6({ lt, k, dyn }) {
  const io = (p) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(p, 0, 1));
  const d = dyn ? io((lt - 1.0 * k) / (1.2 * k)) : 1;
  const snap = dyn ? Math.sin(Math.PI * clamp((lt - 2.2 * k) / (0.25 * k), 0, 1)) : 0;
  const handleOp = dyn ? Math.min(EASE((lt - 0.75 * k) / (0.2 * k)), 1 - EASE((lt - 2.28 * k) / (0.22 * k))) : 0;
  const t1 = dyn ? Math.min(EASE((lt - 0.08 * k) / (0.2 * k)), 1 - EASE((lt - 0.78 * k) / (0.2 * k))) : 0;
  const t2s = dyn ? mv(lt, 2.45 * k, 0.24 * k, 14) : { opacity: 1 };
  const pill = dyn ? fade(lt, 0.1 * k, 0.2 * k) : { opacity: 1 };
  const x = 110 + d * 860;
  const txt = { position: 'absolute', left: 110, top: 420, fontFamily: SANS, fontWeight: 700, fontSize: 70, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 2px 26px rgba(10,37,64,.45)' };
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <img src={R.bos} alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover' }} />
      <img src={R.akdeniz} alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 ${(1 - d) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - d) * 100}% 0 0)` }} />
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.46) 0%,rgba(10,37,64,.1) 30%,rgba(10,37,64,0) 55%,rgba(10,37,64,.35) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 2, width: 4, background: '#fff', opacity: handleOp }} />
      <div style={{ position: 'absolute', top: 890, left: x - 34, width: 68, height: 68, borderRadius: 999, background: '#fff', border: `3px solid ${GOLD}`, boxShadow: `0 0 0 ${10 * snap}px rgba(201,161,87,.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: handleOp }}>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M9 3 L3 10 L9 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M3 3 L9 10 L3 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 258, ...pill }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, background: 'rgba(10,37,64,.78)', color: 'rgba(255,255,255,.94)', padding: '11px 22px', borderRadius: 999 }}>AI ile görselleştirildi · Temsilî</span>
      </div>
      {t1 > 0 && <div style={{ ...txt, opacity: t1 }}>Bugünkü hâli.</div>}
      {t2s.opacity > 0 && <div style={{ ...txt, opacity: t2s.opacity, transform: t2s.transform }}>Olabileceği hâli.</div>}
    </div>
  );
}
function SceneStaging() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 4.0;
  const inY = 1 - EASE(lt / (0.32 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK }} data-screen-label={`${Math.floor(9.75 + lt)}s · Sanal düzenleme`}>
      {inY > 0 && <div style={ABS}><DetailV6 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <StagingV6 lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ============ S6 · Piyasa ============ */
function PiyasaV6({ lt, k, dyn }) {
  const hl = dyn ? mv(lt, 0.5 * k, 0.26 * k) : { opacity: 1 };
  const p1 = dyn ? mv(lt, 0.65 * k, 0.32 * k, 60) : { opacity: 1 };
  const p2 = dyn ? mv(lt, 1.9 * k, 0.34 * k, 70) : { opacity: 1 };
  const chartP = dyn ? EASE((lt - 0.9 * k) / (0.6 * k)) : 1;
  const cnt = dyn ? EASE((lt - 1.1 * k) / (0.6 * k)) : 1;
  const getiri = dyn ? EASE((lt - 2.7 * k) / (0.28 * k)) : 1;
  const val = (142.8 * cnt).toFixed(1).replace('.', ',');
  const box = { position: 'absolute', left: 110, width: 860, boxSizing: 'border-box', background: BEYAZ, border: `1.5px solid ${nvy(0.1)}`, borderRadius: 24, padding: '32px 36px', boxShadow: '0 20px 48px rgba(10,37,64,.1)' };
  return (
    <div style={{ ...ABS, background: SICAK2 }}>
      <div style={{ position: 'absolute', left: 110, top: 248, fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.12, letterSpacing: '-0.02em', color: NAVY, ...hl }}>Piyasayı gör.<br />Getiriyi hesapla.</div>
      <div style={{ position: 'absolute', right: 110, top: 268, ...(dyn ? fade(lt, 0.65 * k, 0.26 * k) : { opacity: 1 }) }}><OrnekEkran /></div>
      <div style={{ ...box, top: 540, ...p1 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>KKTC Fiyat Endeksi</div>
        <svg width="784" height="230" viewBox="0 0 940 276" style={{ display: 'block', marginTop: 22 }}>
          {[60, 134, 208].map((y) => <line key={y} x1="0" x2="940" y1={y} y2={y} stroke={nvy(0.08)} strokeWidth="1.5" />)}
          <path d="M0,244 L94,232 L188,238 L282,216 L376,222 L470,194 L564,200 L658,168 L752,156 L846,134 L940,112 L940,276 L0,276 Z" fill={nvy(0.05)} opacity={chartP} />
          <path d="M0,244 L94,232 L188,238 L282,216 L376,222 L470,194 L564,200 L658,168 L752,156 L846,134 L940,112" fill="none" stroke={NAVY} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - chartP} />
          <circle cx="940" cy="112" r="9" fill={GOLD} opacity={chartP > 0.96 ? 1 : 0} />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 20 }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 60, color: NAVY }}>{val}</div>
          <div style={{ fontFamily: MONO, fontSize: 32, color: NAVY }}>+%6,2 yıllık</div>
        </div>
      </div>
      <div style={{ ...box, top: 1160, boxShadow: '0 -12px 48px rgba(10,37,64,.12), 0 20px 48px rgba(10,37,64,.1)', ...p2 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>Yatırım hesaplayıcı</div>
        <div style={{ display: 'flex', gap: 40, marginTop: 18 }}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 27, color: nvy(0.55) }}>İlan fiyatı <span style={{ fontFamily: MONO, color: nvy(0.75) }}>£165.000</span></div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 27, color: nvy(0.55) }}>Tahmini kira <span style={{ fontFamily: MONO, color: nvy(0.75) }}>£750 / ay</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 26, paddingTop: 22, borderTop: `1.5px solid ${nvy(0.08)}`, opacity: 0.35 + 0.65 * getiri, transform: `scale(${1 + 0.03 * getiri * (1 - getiri) * 4})`, transformOrigin: 'left center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY }}>Brüt yıllık getiri</div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: MONO, fontSize: 50, color: GOLD }}>%5,45</div>
        </div>
      </div>
    </div>
  );
}
function ScenePiyasa() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 4.3;
  const inY = 1 - EASE(lt / (0.45 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK2 }} data-screen-label={`${Math.floor(13.75 + lt)}s · Piyasa`}>
      {inY > 0 && <div style={ABS}><StagingV6 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <PiyasaV6 lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ============ S7 · Kapanış ============ */
function SceneKapanis() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 3.5;
  const inY = 1 - EASE(lt / (0.3 * k));
  const wm = fade(lt, 0.28 * k, 0.24 * k);
  const wmS = 1.02 - 0.02 * EASE((lt - 0.28 * k) / (0.45 * k));
  const tag = fade(lt, 0.34 * k, 0.24 * k);
  const cta = fade(lt, 0.4 * k, 0.24 * k);
  const dst = fade(lt, 0.46 * k, 0.24 * k);
  const line = EASE(clamp((lt - 0.7 * k) / (0.45 * k), 0, 1));
  const swp = clamp((lt - 1.5 * k) / (0.45 * k), 0, 1);
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK2 }} data-screen-label={`${Math.floor(18.05 + lt)}s · Kapanış`}>
      {inY > 0 && <div style={ABS}><PiyasaV6 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, background: NAVY, transform: `translateY(${inY * 100}%)` }}>
        <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 170 }}>
          <img src={R.wm} alt="Evlek" style={{ width: 420, display: 'block', filter: 'invert(1)', opacity: wm.opacity, transform: `scale(${wmS})` }} />
          <div style={{ marginTop: 54, width: 240, height: 3, background: GOLD, transform: `scaleX(${line})`, transformOrigin: 'left center' }} />
          <div style={{ marginTop: 50, fontFamily: SANS, fontWeight: 500, fontSize: 40, color: 'rgba(255,255,255,.85)', ...tag }}>Kıbrıs'ta doğru ev.</div>
          <div style={{ marginTop: 58, ...cta }}>
            <div style={{ position: 'relative', overflow: 'hidden', minWidth: 470, height: 102, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: KREM, color: NAVY, fontFamily: SANS, fontWeight: 700, fontSize: 34, borderRadius: 999, padding: '0 60px' }}>
              Evlek.app'te ara
              {swp > 0 && swp < 1 && (
                <div style={{ ...ABS, background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,.5) 50%, transparent 68%)', transform: `translateX(${lerp(-100, 100, swp)}%)` }} />
              )}
            </div>
          </div>
          <div style={{ marginTop: 52, fontFamily: SANS, fontWeight: 500, fontSize: 27, color: 'rgba(255,255,255,.55)', ...dst }}>Web · iOS · Android · 5 dil</div>
        </div>
      </div>
    </div>
  );
}

function EvlekReel() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SceneStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={NAVY}>
        {{ 'Kanca': SceneKanca, 'Arama': SceneArama, 'Sonuçlar': SceneSonuc, 'Okuma': SceneOkuma, 'Sanal Düzenleme': SceneStaging, 'Piyasa': ScenePiyasa, 'Kapanış': SceneKapanis }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
