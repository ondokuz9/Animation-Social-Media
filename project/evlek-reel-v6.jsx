/* Evlek tanıtım reel v6 — 1080×1920 · 19.3 sn · 6 sahne, sadeleştirilmiş. Saf render(t). */
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
const out = (lt, t0, d = 0.24, dist = -16) => {
  const x = EASE((lt - t0) / d);
  return { opacity: 1 - x, transform: `translateY(${x * dist}px)` };
};

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

/* ============ S1 · Arama (ilk kare dolu) ============ */
function SearchV6({ lt, k, dyn }) {
  const sup = dyn ? mv(lt, 0.22 * k, 0.24 * k, 12) : { opacity: 1 };
  const b1 = dyn ? EASE((lt - 0.5 * k) / (0.2 * k)) : 1;
  const b2 = dyn ? EASE((lt - 1.1 * k) / (0.2 * k)) : 1;
  const flash2 = dyn ? clamp((lt - 1.1 * k) / (0.1 * k), 0, 1) * (1 - EASE((lt - 1.4 * k) / (0.32 * k))) : 0;
  const caretOp = dyn && lt > 0.35 * k && lt < 1.6 * k ? 1 : 0;
  const pressP = dyn ? clamp((lt - 1.7 * k) / (0.2 * k), 0, 1) : 1;
  const scale = 1 - 0.04 * Math.sin(Math.PI * pressP);
  const ring = clamp(pressP * 1.3, 0, 1);
  const curP = dyn ? EASE((lt - 1.3 * k) / (0.35 * k)) : 1;
  const curOp = dyn ? Math.min(EASE((lt - 1.28 * k) / (0.14 * k)), 1 - EASE((lt - 1.95 * k) / (0.2 * k))) : 0;
  const anyTyped = !dyn || b1 > 0;
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <div style={{ position: 'absolute', left: 110, top: 250 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.1, letterSpacing: '-0.02em', color: NAVY }}>Girne'de deniz gören,<br />Türk koçanlı 2+1?</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: nvy(0.6), marginTop: 30, ...sup }}>Evlek'e söyle.</div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 620, width: 860, boxSizing: 'border-box', background: BEYAZ, borderRadius: 24, border: `2.5px solid ${anyTyped ? NAVY : nvy(0.14)}`, boxShadow: anyTyped ? '0 0 0 7px rgba(201,161,87,.16)' : '0 18px 48px rgba(10,37,64,.1)', padding: '34px 36px 28px' }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, lineHeight: 1.55, color: NAVY, minHeight: 150 }}>
          {b1 > 0 && <span style={{ opacity: b1 }}>Girne'de deniz gören, Türk koçanlı 2+1 </span>}
          {b2 > 0 && <span style={{ opacity: b2, background: `rgba(201,161,87,${0.32 * flash2})`, borderRadius: 6 }}>£180 bin altı</span>}
          <span style={{ display: 'inline-block', width: 3.5, height: 36, marginLeft: 6, verticalAlign: '-5px', background: GOLD, opacity: caretOp }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <div style={{ position: 'relative', background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 28, padding: '17px 44px', borderRadius: 999, transform: `scale(${scale})` }}>
            Ara
            <div style={{ position: 'absolute', inset: -8 * ring, borderRadius: 999, border: `2.5px solid rgba(201,161,87,${0.7 * (1 - ring)})` }} />
          </div>
        </div>
      </div>
      {dyn && curOp > 0 && <Cursor x={lerp(940, 848, curP)} y={lerp(1160, 852, curP)} op={curOp} />}
    </div>
  );
}
function SceneArama() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.3;
  return <div style={{ ...ABS, background: BEYAZ }} data-screen-label={`${Math.floor(lt)}s · Arama`}><SearchV6 lt={lt} k={k} dyn={true} /></div>;
}

/* ============ S2 · Sonuçlar (2 kart) ============ */
function KartV6({ c, sel, w, ph, priceFs }) {
  return (
    <div style={{ width: w, boxSizing: 'border-box', background: BEYAZ, borderRadius: 22, overflow: 'hidden', border: sel > 0 ? `3px solid rgba(201,161,87,${0.4 + 0.6 * sel})` : `1.5px solid ${nvy(0.1)}`, boxShadow: sel > 0 ? '0 24px 56px rgba(10,37,64,.16)' : '0 12px 32px rgba(10,37,64,.08)', transform: `scale(${1 + 0.012 * sel})` }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={c.img} alt="" style={{ width: '100%', height: ph, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', left: 20, top: 20, fontFamily: SANS, fontWeight: 700, fontSize: 26, background: NAVY, color: '#fff', padding: '10px 22px', borderRadius: 999 }}>Türk Koçanı</div>
      </div>
      <div style={{ padding: '24px 30px 26px' }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: priceFs, letterSpacing: '-0.01em', color: NAVY }}>{c.fiyat}</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: nvy(0.62), marginTop: 6 }}>{c.yer} · 2+1</div>
      </div>
    </div>
  );
}
const C1 = { img: 'img/room-01-akdeniz.jpg', fiyat: '£165.000', yer: 'Girne · Zeytinlik' };
const C2 = { img: 'img/kiyi.jpg', fiyat: '£172.000', yer: 'Girne · Karaoğlanoğlu' };
function ResultsV6({ lt, k, dyn }) {
  const selP = dyn ? EASE(clamp((lt - 1.2 * k) / (0.24 * k), 0, 1)) : 1;
  const st = (t0) => (dyn ? mv(lt, t0 * k, 0.26 * k, 26) : { opacity: 1 });
  return (
    <div style={{ ...ABS, background: SICAK }}>
      <div style={{ position: 'absolute', left: 110, top: 280, ...st(0.28) }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, letterSpacing: '-0.02em', color: NAVY }}>Evlek bulur.</div>
      </div>
      <div style={{ position: 'absolute', left: 100, top: 460, ...st(0.4) }}><KartV6 c={C1} sel={selP} w={880} ph={460} priceFs={48} /></div>
      <div style={{ position: 'absolute', left: 110, top: 1620, ...st(0.5) }}><KartV6 c={C2} sel={0} w={800} ph={300} priceFs={40} /></div>
    </div>
  );
}
function SceneSonuc() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.2;
  const oldOut = out(lt, 0, 0.26 * k, -30);
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(2.3 + lt)}s · Sonuçlar`}>
      <ResultsV6 lt={lt} k={k} dyn={true} />
      {oldOut.opacity > 0 && <div style={{ ...ABS, ...oldOut, pointerEvents: 'none' }}><SearchV6 lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ============ S3 · Okuma (3 bilgi, tek Örnek ekran) ============ */
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
  const rect = { x: lerp(100, 0, m), y: lerp(460, 0, m), w: lerp(880, 1080, m), h: lerp(460, 540, m), r: lerp(22, 0, m) };
  const lbl = { ...lblS, fontSize: 24, color: nvy(0.5) };
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }}>
      <div style={{ ...ABS, ...bodySt }}>
        <div style={{ position: 'absolute', left: 110, top: 572, display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: '-0.01em', color: NAVY }}>£165.000</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: nvy(0.6) }}>Girne · Zeytinlik · 2+1</div>
        </div>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <div style={lbl}>KOÇAN BİLGİSİ</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY, marginTop: 7 }}>Türk Koçanı</div>
            </div>
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
        <img src="img/room-01-akdeniz.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.58) 0%,rgba(10,37,64,.34) 55%,rgba(10,37,64,0) 78%)', opacity: m }} />
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
  const m = EASE(lt / (0.45 * k));
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(4.5 + lt)}s · Okuma`}>
      <DetailV6 lt={lt} k={k} dyn={true} />
      {m < 0.9 && <div style={{ ...ABS, opacity: 1 - m, pointerEvents: 'none' }}><ResultsV6 lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ============ S4 · Sanal düzenleme (yavaşlatılmış) ============ */
function StagingV6({ lt, k, dyn }) {
  const d = dyn ? EASE(clamp((lt - 1.05 * k) / (1.15 * k), 0, 1)) : 1;
  const handleOp = dyn ? Math.min(EASE(clamp((lt - 0.95 * k) / (0.2 * k), 0, 1)), 1 - EASE(clamp((lt - 2.3 * k) / (0.26 * k), 0, 1))) : 0;
  const hl = dyn ? mv(lt, 2.25 * k, 0.28 * k, 20) : { opacity: 1 };
  const pill = dyn ? mv(lt, 0.42 * k, 0.24 * k, -12) : { opacity: 1 };
  const x = 110 + d * 860;
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <img src="img/room-00-bos.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover' }} />
      <img src="img/room-01-akdeniz.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 ${(1 - d) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - d) * 100}% 0 0)` }} />
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.35) 0%,rgba(10,37,64,0) 20%,rgba(10,37,64,0) 55%,rgba(10,37,64,.6) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 2, width: 4, background: '#fff', opacity: handleOp }} />
      <div style={{ position: 'absolute', top: 890, left: x - 34, width: 68, height: 68, borderRadius: 999, background: '#fff', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: handleOp }}>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M9 3 L3 10 L9 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M3 3 L9 10 L3 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: 'absolute', right: 110, top: 258, display: 'flex', gap: 12, ...pill }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, background: NAVY, color: '#fff', padding: '12px 24px', borderRadius: 999 }}>AI ile görselleştirildi</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, background: BEYAZ, color: NAVY, border: `2px solid ${GOLD}`, padding: '11px 20px', borderRadius: 999 }}>Temsilî</span>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1010, fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: '-0.02em', color: '#fff', ...hl }}>Evin potansiyelini gör.</div>
    </div>
  );
}
function SceneStaging() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 3.7;
  const inY = 1 - EASE(lt / (0.35 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK }} data-screen-label={`${Math.floor(7.8 + lt)}s · Sanal düzenleme`}>
      {inY > 0 && <div style={ABS}><DetailV6 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <StagingV6 lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ============ S5 · Piyasa (3 güçlü veri) ============ */
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
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK2 }} data-screen-label={`${Math.floor(11.5 + lt)}s · Piyasa`}>
      {inY > 0 && <div style={ABS}><StagingV6 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <PiyasaV6 lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ============ S6 · Kapanış (hep birlikte) ============ */
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
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK2 }} data-screen-label={`${Math.floor(15.8 + lt)}s · Kapanış`}>
      {inY > 0 && <div style={ABS}><PiyasaV6 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, background: NAVY, transform: `translateY(${inY * 100}%)` }}>
        <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 170 }}>
          <img src="img/wordmark.png" alt="Evlek" style={{ width: 420, display: 'block', filter: 'invert(1)', opacity: wm.opacity, transform: `scale(${wmS})` }} />
          <div style={{ marginTop: 54, width: 240, height: 3, background: GOLD, transform: `scaleX(${line})`, transformOrigin: 'left center' }} />
          <div style={{ marginTop: 50, fontFamily: SANS, fontWeight: 500, fontSize: 40, color: 'rgba(255,255,255,.85)', ...tag }}>Kıbrıs'ta doğru ev.</div>
          <div style={{ marginTop: 58, ...cta }}>
            <div style={{ position: 'relative', overflow: 'hidden', minWidth: 400, height: 90, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: KREM, color: NAVY, fontFamily: SANS, fontWeight: 700, fontSize: 30, borderRadius: 999, padding: '0 56px' }}>
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
        {{ 'Arama': SceneArama, 'Sonuçlar': SceneSonuc, 'Okuma': SceneOkuma, 'Sanal Düzenleme': SceneStaging, 'Piyasa': ScenePiyasa, 'Kapanış': SceneKapanis }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
