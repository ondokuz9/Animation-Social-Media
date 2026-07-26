/* Evlek tanıtım reel v4 — 1080×1920 · 19.5 sn · marka reklamı kurgusu. Saf render(t). */
const { SceneStage, useScene, clamp } = window;

const NAVY = '#0A2540', GOLD = '#C9A157', KREM = '#F4F1EB', BEYAZ = '#FFFFFF';
const MONO = "'JetBrains Mono',ui-monospace,monospace";
const SANS = "'Hanken Grotesk',system-ui,sans-serif";
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const ABS = { position: 'absolute', inset: 0 };
const nvy = (a) => `rgba(10,37,64,${a})`;

function mv(lt, t0, d = 0.26, dist = 18) {
  const x = EASE((lt - t0) / d);
  return { opacity: x, transform: `translateY(${(1 - x) * dist}px)` };
}
const fade = (lt, t0, d = 0.24) => ({ opacity: EASE((lt - t0) / d) });
const out = (lt, t0, d = 0.24, dist = -16) => {
  const x = EASE((lt - t0) / d);
  return { opacity: 1 - x, transform: `translateY(${x * dist}px)` };
};
const lerp = (a, b, m) => a + (b - a) * m;

const Q3 = "Girne'de deniz gören,\nTürk koçanlı, £180 bin altı 2+1";
function typedCount(lt, t0, span) {
  const time = lt - t0; if (time <= 0) return 0;
  const pauses = []; for (let i = 0; i < Q3.length; i++) if (Q3[i] === ',') pauses.push(i);
  const pd = 0.1 * (span / 1.5), step = (span - pd * pauses.length) / (Q3.length - 1);
  let n = 0;
  for (let i = 0; i < Q3.length; i++) {
    const ti = i * step + pauses.filter((p) => p < i).length * pd;
    if (ti <= time) n = i + 1; else break;
  }
  return n;
}

const Check = ({ size = 30, color = GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="2" />
    <path d="M7.5 12.2 L10.6 15.3 L16.5 9.2" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Chev = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ display: 'block' }}><path d="M2 2 L8 8 L14 2" stroke={nvy(0.55)} strokeWidth="2" strokeLinecap="round" /></svg>
);
const monoL = { fontFamily: MONO, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase' };
const Ornek = ({ style }) => (
  <span style={{ ...monoL, fontSize: 23, letterSpacing: '.08em', color: nvy(0.45), border: `1.5px solid ${nvy(0.18)}`, borderRadius: 999, padding: '6px 16px', ...style }}>ÖRNEK VERİ</span>
);

/* ---------- S1 · Problem ---------- */
const FILTRELER = ['Fiyat', 'Oda sayısı', 'Bölge', 'Koçan', 'm²', 'Site', 'Balkon', 'Eşyalı', 'Kat'];
const MINIS = [
  ['img/room-02-minimal.jpg', '£172.000 · Girne'], ['img/kiyi.jpg', '£149.000 · Lefkoşa'],
  ['img/room-03-dogal.jpg', '£158.000 · Girne'], ['img/room-01-akdeniz.jpg', '£165.000 · Girne'],
  ['img/kiyi.jpg', '£181.000 · Gazimağusa'], ['img/room-02-minimal.jpg', '£176.000 · İskele'],
];
function Problem({ lt, k }) {
  const p = clamp(lt / (0.75 * k), 0, 1);
  const w1 = mv(lt, 0.06 * k, 0.22 * k), w2 = mv(lt, 0.2 * k, 0.22 * k);
  return (
    <div style={{ ...ABS, background: BEYAZ, overflow: 'hidden' }}>
      <div style={{ ...ABS, transform: `translateY(${-40 * p}px) scale(${1.02 + 0.04 * p})`, transformOrigin: '50% 30%' }}>
        <div style={{ position: 'absolute', left: 110, top: 150, width: 860, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {FILTRELER.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: SANS, fontWeight: 600, fontSize: 25, color: nvy(0.65), border: `1.5px solid ${nvy(0.16)}`, borderRadius: 12, padding: '13px 20px', background: BEYAZ }}>{f}<Chev /></div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 110, top: 380, width: 860, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, opacity: 0.8, filter: 'grayscale(.35)' }}>
          {MINIS.map(([src, tx], i) => (
            <div key={i} style={{ border: `1.5px solid ${nvy(0.12)}`, borderRadius: 14, overflow: 'hidden', background: BEYAZ }}>
              <img src={src} alt="" style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '14px 18px', fontFamily: SANS, fontWeight: 600, fontSize: 23, color: nvy(0.7) }}>{tx}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.92) 58%,rgba(255,255,255,.97) 100%)' }} />
      <div style={{ position: 'absolute', left: 110, top: 1180, fontFamily: SANS, fontWeight: 800, fontSize: 80, lineHeight: 1.08, letterSpacing: '-0.02em', color: NAVY }}>
        <div style={{ ...w1 }}>İlan çok.</div>
        <div style={{ ...w2 }}>Karar zor.</div>
      </div>
    </div>
  );
}
function SceneP() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 0.75;
  return <div style={ABS} data-screen-label={`${Math.floor(lt)}s · Problem`}><Problem lt={lt} k={k} /></div>;
}

/* ---------- S2 · Arama ---------- */
function SearchScreen({ hlSt, n, focus, caretOp, pressP }) {
  const typed = Q3.slice(0, n);
  const parts = typed.split('\n');
  const scale = 1 - 0.05 * Math.sin(Math.PI * pressP);
  const rip = clamp(pressP * 1.4, 0, 1);
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 120, background: BEYAZ, borderBottom: `1.5px solid ${nvy(0.08)}`, display: 'flex', alignItems: 'center', padding: '0 110px' }}>
        <img src="img/wordmark.png" alt="Evlek" style={{ height: 38, display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', left: 110, top: 250, ...hlSt }}>
        <div style={{ ...monoL, fontSize: 24, color: GOLD, marginBottom: 24 }}>EVLEK ARAMA</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.08, letterSpacing: '-0.02em', color: NAVY }}>Filtreleri değil,<br />evi tarif et.</div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 620, width: 860, boxSizing: 'border-box', background: BEYAZ, borderRadius: 24, border: `2.5px solid ${focus ? NAVY : nvy(0.14)}`, boxShadow: focus ? '0 0 0 7px rgba(201,161,87,.18)' : '0 10px 30px rgba(10,37,64,.06)', padding: '34px 36px 30px' }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, lineHeight: 1.55, color: n > 0 ? NAVY : nvy(0.35), minHeight: 100 }}>
          {n > 0 ? (<span>{parts[0]}{parts.length > 1 && <br />}{parts[1]}</span>) : 'Evi tarif edin…'}
          <span style={{ display: 'inline-block', width: 3.5, height: 36, marginLeft: 6, verticalAlign: '-5px', background: GOLD, opacity: caretOp }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <div style={{ position: 'relative', overflow: 'hidden', background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 28, padding: '17px 44px', borderRadius: 999, transform: `scale(${scale})` }}>
            Ara
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 220 * rip, height: 220 * rip, marginLeft: -110 * rip, marginTop: -110 * rip, borderRadius: 999, background: `rgba(201,161,87,${0.4 * (1 - rip)})` }} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 902, display: 'flex', gap: 16 }}>
        {['deniz manzaralı', 'site içinde', 'yeni koçan'].map((c, i) => (
          <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: nvy(0.6), background: nvy(0.06), padding: '13px 26px', borderRadius: 999 }}>{c}</div>
        ))}
      </div>
    </div>
  );
}
function SceneS2() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.65;
  const slide = EASE(lt / (0.24 * k));
  const focus = lt > 0.35 * k && lt < 2.5 * k;
  const n = typedCount(lt, 0.5 * k, 1.5 * k);
  const done = n >= Q3.length;
  let caretOp = 0;
  if (lt > 0.35 * k && lt < 2.45 * k) caretOp = done ? (Math.floor(lt * 2.6) % 2 === 0 ? 1 : 0.1) : 1;
  const pressP = clamp((lt - 2.2 * k) / (0.22 * k), 0, 1);
  return (
    <div style={{ ...ABS, background: BEYAZ, overflow: 'hidden' }} data-screen-label={`${Math.floor(0.75 + lt)}s · Arama`}>
      <SearchScreen hlSt={{ opacity: 1 }} n={n} focus={focus} caretOp={caretOp} pressP={pressP} />
      {slide < 1 && <div style={{ ...ABS, transform: `translateY(${-slide * 100}%)` }}><Problem lt={1} k={0.1} /></div>}
    </div>
  );
}

/* ---------- S3 · Sonuçlar ---------- */
const CARDS = [
  { img: 'img/room-01-akdeniz.jpg', fiyat: '£165.000', yer: 'Girne · Zeytinlik', meta: '2+1 · 85 m² · Deniz manzarası' },
  { img: 'img/kiyi.jpg', fiyat: '£172.000', yer: 'Girne · Karaoğlanoğlu', meta: '2+1 · 78 m² · Deniz manzarası' },
  { img: 'img/room-03-dogal.jpg', fiyat: '£158.000', yer: 'Girne · Alsancak', meta: '2+1 · 82 m² · Deniz manzarası' },
];
function Card({ c, feat, dim, h }) {
  return (
    <div style={{ width: 860, boxSizing: 'border-box', background: BEYAZ, borderRadius: 22, overflow: 'hidden', border: feat ? `3px solid ${GOLD}` : `1.5px solid ${nvy(0.1)}`, boxShadow: feat ? '0 24px 56px rgba(10,37,64,.16)' : '0 12px 32px rgba(10,37,64,.08)', opacity: 1 - 0.45 * dim, transform: `scale(${1 + 0.015 * feat - 0.005 * dim})` }}>
      <div style={{ position: 'relative' }}>
        <img src={c.img} alt="" style={{ width: '100%', height: h, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', left: 20, top: 20, ...monoL, fontSize: 23, letterSpacing: '.1em', background: NAVY, color: '#fff', padding: '10px 18px', borderRadius: 999 }}>TÜRK KOÇANI</div>
      </div>
      <div style={{ padding: '26px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: '-0.01em', color: NAVY }}>{c.fiyat}</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Check size={28} /><span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: NAVY }}>Evlek kontrolü</span>
          </div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: nvy(0.62), marginTop: 8 }}>{c.yer} · {c.meta}</div>
      </div>
    </div>
  );
}
function ResultsScreen({ lt, k, dyn }) {
  const featP = dyn ? EASE(clamp((lt - 1.2 * k) / (0.24 * k), 0, 1)) : 1;
  const st = (t0) => (dyn ? mv(lt, t0 * k, 0.28 * k, 24) : { opacity: 1 });
  return (
    <div style={{ ...ABS, background: '#F8F7F3' }}>
      <div style={{ position: 'absolute', left: 110, top: 210, width: 860, boxSizing: 'border-box', ...st(0.1) }}>
        <div style={{ background: BEYAZ, border: `1.5px solid ${nvy(0.12)}`, borderRadius: 999, padding: '15px 28px', fontFamily: MONO, fontSize: 24, color: nvy(0.7), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Girne'de deniz gören, Türk koçanlı, £180 bin altı 2+1</div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 306, ...st(0.2) }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 30 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, letterSpacing: '-0.02em', color: NAVY }}>Evlek bulur.</div>
          <div style={{ ...monoL, fontSize: 24, color: nvy(0.5) }}>3 SONUÇ</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 470, display: 'flex', flexDirection: 'column', gap: 35 }}>
        <div style={{ ...st(0.32) }}><Card c={CARDS[0]} feat={featP} dim={0} h={400} /></div>
        <div style={{ ...st(0.43) }}><Card c={CARDS[1]} feat={0} dim={featP} h={330} /></div>
        <div style={{ ...st(0.54) }}><Card c={CARDS[2]} feat={0} dim={featP} h={330} /></div>
      </div>
    </div>
  );
}
function SceneS3() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.1;
  const oldOut = out(lt, 0, 0.24 * k, -70);
  return (
    <div style={{ ...ABS, background: '#F8F7F3', overflow: 'hidden' }} data-screen-label={`${Math.floor(3.4 + lt)}s · Sonuçlar`}>
      <div style={{ ...ABS, ...fade(lt, 0.08 * k, 0.22 * k) }}><ResultsScreen lt={lt} k={k} dyn={true} /></div>
      {oldOut.opacity > 0 && <div style={{ ...ABS, ...oldOut }}><SearchScreen hlSt={{ opacity: 1 }} n={Q3.length} focus={false} caretOp={0} pressP={1} /></div>}
    </div>
  );
}

/* ---------- S4 · Okuma (morph + 3 veri kartı) ---------- */
function ModulV4({ y, h, act, dim, children }) {
  return (
    <div style={{ position: 'absolute', left: 110, top: y, width: 860, minHeight: h, boxSizing: 'border-box', background: BEYAZ, border: `2px solid ${act > 0 ? `rgba(201,161,87,${0.4 + 0.6 * act})` : nvy(0.1)}`, borderRadius: 20, padding: '30px 34px', boxShadow: act > 0 ? '0 18px 48px rgba(10,37,64,.14)' : '0 8px 24px rgba(10,37,64,.05)', opacity: 1 - 0.4 * dim, transform: `scale(${1 + 0.045 * act - 0.012 * dim})`, transformOrigin: '50% 50%' }}>{children}</div>
  );
}
const CHART = 'M0,150 L85,140 L170,146 L255,128 L340,132 L425,112 L510,118 L595,96 L680,102 L765,82 L850,70 L940,58';
function DetailView({ lt, k, dyn }) {
  const m = dyn ? EASE(lt / (0.42 * k)) : 1;
  const bodySt = dyn ? mv(lt, 0.3 * k, 0.3 * k, 26) : { opacity: 1 };
  const HL = [[0.8, 1.6], [1.6, 2.4], [2.4, 3.1]];
  const hls = HL.map(([a, b]) => (dyn ? Math.min(EASE((lt - a * k) / (0.22 * k)), 1 - EASE((lt - b * k) / (0.22 * k))) : 0));
  const dims = hls.map((_, i) => Math.max(...hls.filter((__, j) => j !== i)));
  const CAPS = ['Kontrol eder.', 'Karşılaştırır.', 'Geçmişi gösterir.'];
  const lbl = { ...monoL, fontSize: 24, color: nvy(0.48) };
  const rect = { x: lerp(110, 0, m), y: lerp(470, 0, m), w: lerp(860, 1080, m), h: lerp(400, 540, m), r: lerp(22, 0, m) };
  return (
    <div style={{ ...ABS, background: '#F8F7F3', overflow: 'hidden' }}>
      <div style={{ ...ABS, ...bodySt }}>
        <div style={{ position: 'absolute', left: 110, top: 580 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: '-0.01em', color: NAVY }}>£165.000</div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: nvy(0.6) }}>£1.941 / m²</div>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: nvy(0.6), marginTop: 8 }}>Girne · Zeytinlik · 2+1 · 85 m² · Deniz manzarası</div>
        </div>
        <ModulV4 y={760} h={170} act={hls[0]} dim={dims[0]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Check size={54} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>İlan sahibi doğrulandı</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: nvy(0.58), marginTop: 6 }}>Temel ilan bilgileri kontrol edildi</div>
            </div>
          </div>
        </ModulV4>
        <ModulV4 y={975} h={280} act={hls[1]} dim={dims[1]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={lbl}>BÖLGE KARŞILAŞTIRMASI · £/m²</div><div style={{ flex: 1 }} /><Ornek />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 24 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: NAVY, width: 185 }}>Bu ilan</div>
            <div style={{ width: 380, height: 16, borderRadius: 8, background: NAVY }} />
            <div style={{ fontFamily: MONO, fontSize: 25, color: NAVY }}>£1.941</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: nvy(0.55), width: 185 }}>Girne medyanı</div>
            <div style={{ width: 415, height: 16, borderRadius: 8, background: nvy(0.14) }} />
            <div style={{ fontFamily: MONO, fontSize: 25, color: nvy(0.55) }}>£2.115</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: GOLD, marginTop: 20, letterSpacing: '.06em' }}>%8 MEDYAN ALTI</div>
        </ModulV4>
        <ModulV4 y={1300} h={300} act={hls[2]} dim={dims[2]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={lbl}>FİYAT GEÇMİŞİ · SON 12 AY</div><div style={{ flex: 1 }} /><Ornek />
          </div>
          <svg width="792" height="185" viewBox="0 0 940 220" style={{ display: 'block', marginTop: 20 }}>
            <path d={`${CHART} L940,220 L0,220 Z`} fill={nvy(0.05)} />
            <path d={CHART} fill="none" stroke={NAVY} strokeWidth="3.5" />
            <circle cx="940" cy="58" r="8" fill={GOLD} />
          </svg>
        </ModulV4>
      </div>
      <div style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r, overflow: 'hidden' }}>
        <img src="img/room-01-akdeniz.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', left: 20, top: 20, ...monoL, fontSize: 23, letterSpacing: '.1em', background: NAVY, color: '#fff', padding: '10px 18px', borderRadius: 999 }}>KOÇAN BİLGİSİ · TÜRK KOÇANI</div>
      </div>
      {dyn && CAPS.map((c, i) => {
        const o = Math.min(EASE((lt - HL[i][0] * k) / (0.16 * k)), 1 - EASE((lt - HL[i][1] * k) / (0.16 * k)));
        return o <= 0 ? null : (
          <div key={i} style={{ position: 'absolute', left: 110, top: 292, background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: '-0.01em', padding: '18px 34px', borderRadius: 16, opacity: o }}>{c}</div>
        );
      })}
    </div>
  );
}
function SceneS4() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 3.3;
  const m = EASE(lt / (0.42 * k));
  return (
    <div style={{ ...ABS, background: '#F8F7F3', overflow: 'hidden' }} data-screen-label={`${Math.floor(5.5 + lt)}s · Okuma`}>
      <DetailView lt={lt} k={k} dyn={true} />
      {m < 0.9 && <div style={{ ...ABS, opacity: 1 - m, pointerEvents: 'none' }}><ResultsScreen lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ---------- S5 · Sanal düzenleme ---------- */
function StagingView({ lt, k, dyn }) {
  const d = dyn ? EASE(clamp((lt - 0.75 * k) / (0.95 * k), 0, 1)) : 1;
  const handleOp = dyn ? Math.min(EASE(clamp((lt - 0.68 * k) / (0.18 * k), 0, 1)), 1 - EASE(clamp((lt - 1.8 * k) / (0.24 * k), 0, 1))) : 0;
  const hl = dyn ? mv(lt, 1.55 * k, 0.28 * k, 20) : { opacity: 1 };
  const pill = dyn ? mv(lt, 0.28 * k, 0.24 * k, -12) : { opacity: 1 };
  const x = 110 + d * 860;
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <img src="img/room-00-bos.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover' }} />
      <img src="img/room-01-akdeniz.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 ${(1 - d) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - d) * 100}% 0 0)` }} />
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.35) 0%,rgba(10,37,64,0) 20%,rgba(10,37,64,0) 60%,rgba(10,37,64,.65) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 2, width: 4, background: '#fff', opacity: handleOp }} />
      <div style={{ position: 'absolute', top: 910, left: x - 34, width: 68, height: 68, borderRadius: 999, background: '#fff', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: handleOp }}>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M9 3 L3 10 L9 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M3 3 L9 10 L3 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: 'absolute', right: 110, top: 260, ...pill }}>
        <span style={{ ...monoL, fontSize: 23, letterSpacing: '.1em', background: NAVY, color: '#fff', padding: '13px 22px', borderRadius: 999 }}>YAPAY ZEKÂYLA DÜZENLENDİ · TEMSİLÎ</span>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1130, fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: '-0.02em', color: '#fff', ...hl }}>Potansiyelini gösterir.</div>
    </div>
  );
}
function SceneS5() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.4;
  const inY = 1 - EASE(lt / (0.26 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: '#F8F7F3' }} data-screen-label={`${Math.floor(8.8 + lt)}s · Sanal düzenleme`}>
      {inY > 0 && <div style={ABS}><DetailView lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <StagingView lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ---------- S6 · Veri (endeks + hesaplayıcı tek sahne) ---------- */
function VeriScreen({ lt, k, dyn }) {
  const hl = dyn ? mv(lt, 0.3 * k, 0.28 * k) : { opacity: 1 };
  const p1 = dyn ? mv(lt, 0.42 * k, 0.3 * k, 26) : { opacity: 1 };
  const p2 = dyn ? mv(lt, 0.56 * k, 0.3 * k, 26) : { opacity: 1 };
  const row = (l, v, big) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: big ? '18px 0 4px' : '13px 0', borderBottom: big ? 'none' : `1.5px solid ${nvy(0.08)}` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: big ? 32 : 28, color: big ? NAVY : nvy(0.65) }}>{l}</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: MONO, fontSize: big ? 42 : 28, color: big ? GOLD : NAVY }}>{v}</div>
    </div>
  );
  const box = { position: 'absolute', left: 110, width: 860, boxSizing: 'border-box', background: BEYAZ, border: `1.5px solid ${nvy(0.1)}`, borderRadius: 24, padding: '34px 38px', boxShadow: '0 16px 40px rgba(10,37,64,.07)' };
  return (
    <div style={{ ...ABS, background: '#F8F7F3' }}>
      <div style={{ position: 'absolute', left: 110, top: 250, fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.12, letterSpacing: '-0.02em', color: NAVY, ...hl }}>Piyasayı gör.<br />Getiriyi hesapla.</div>
      <div style={{ ...box, top: 520, ...p1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>KKTC Fiyat Endeksi</div>
          <div style={{ flex: 1 }} /><Ornek />
        </div>
        <svg width="784" height="250" viewBox="0 0 940 300" style={{ display: 'block', marginTop: 24 }}>
          {[60, 140, 220].map((y) => <line key={y} x1="0" x2="940" y1={y} y2={y} stroke={nvy(0.08)} strokeWidth="1.5" />)}
          <path d="M0,265 L94,252 L188,258 L282,234 L376,240 L470,212 L564,218 L658,182 L752,168 L846,146 L940,122 L940,300 L0,300 Z" fill={nvy(0.05)} />
          <path d="M0,265 L94,252 L188,258 L282,234 L376,240 L470,212 L564,218 L658,182 L752,168 L846,146 L940,122" fill="none" stroke={NAVY} strokeWidth="4" />
          <circle cx="940" cy="122" r="9" fill={GOLD} />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 22 }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 56, color: NAVY }}>142,8</div>
          <div style={{ fontFamily: MONO, fontSize: 28, color: GOLD }}>+%6,2 yıllık</div>
          <div style={{ flex: 1 }} />
          <div style={{ ...monoL, fontSize: 23, color: nvy(0.45) }}>2019=100</div>
        </div>
      </div>
      <div style={{ ...box, top: 1120, ...p2 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>Yatırım hesaplayıcı</div>
          <div style={{ flex: 1 }} /><Ornek />
        </div>
        <div style={{ marginTop: 10 }}>
          {row('İlan fiyatı', '£165.000')}
          {row('Tahmini kira', '£750 / ay')}
          {row('Brüt yıllık getiri', '%5,45', true)}
        </div>
      </div>
    </div>
  );
}
function SceneS6() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.3;
  const inY = 1 - EASE(lt / (0.26 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: '#F8F7F3' }} data-screen-label={`${Math.floor(11.2 + lt)}s · Veri`}>
      {inY > 0 && <div style={ABS}><StagingView lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <VeriScreen lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ---------- S7 · Destek satırı ---------- */
function DestekScreen({ lt, k, dyn }) {
  const hl = dyn ? mv(lt, 0.18 * k, 0.28 * k) : { opacity: 1 };
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, letterSpacing: '-0.02em', color: NAVY, ...hl }}>5 dil · Web · iOS · Android</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 56 }}>
          {['TR', 'EN', 'RU', 'DE', 'AR'].map((d, i) => {
            const st = dyn ? mv(lt, (0.34 + i * 0.08) * k, 0.24 * k, 14) : { opacity: 1 };
            return <div key={d} style={{ fontFamily: MONO, fontSize: 28, letterSpacing: '.08em', color: i === 0 ? '#fff' : nvy(0.65), background: i === 0 ? NAVY : 'transparent', border: `2px solid ${i === 0 ? NAVY : nvy(0.16)}`, padding: '15px 28px', borderRadius: 14, ...st }}>{d}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
function SceneS7() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 1.7;
  const inP = EASE(lt / (0.24 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: BEYAZ }} data-screen-label={`${Math.floor(13.5 + lt)}s · Destek`}>
      <DestekScreen lt={lt} k={k} dyn={true} />
      {inP < 1 && <div style={{ ...ABS, opacity: 1 - inP, transform: `translateY(${-inP * 60}px)` }}><VeriScreen lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ---------- S8 · Marka kapanışı ---------- */
function SceneS8() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 4.3;
  const oldOut = out(lt, 0, 0.25 * k, -20);
  const bg = EASE(lt / (0.35 * k));
  const wm = mv(lt, 0.45 * k, 0.3 * k, 22);
  const tag = mv(lt, 0.75 * k, 0.28 * k, 16);
  const cta = fade(lt, 1.05 * k, 0.27 * k);
  const line = EASE(clamp((lt - 1.5 * k) / (1.5 * k), 0, 1));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: BEYAZ }} data-screen-label={`${Math.floor(15.2 + lt)}s · Kapanış`}>
      <div style={{ ...ABS, background: KREM, opacity: bg }} />
      {oldOut.opacity > 0 && <div style={{ ...ABS, ...oldOut }}><DestekScreen lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 150 }}>
        <img src="img/wordmark.png" alt="Evlek" style={{ width: 440, display: 'block', ...wm }} />
        <div style={{ marginTop: 50, fontFamily: SANS, fontWeight: 500, fontSize: 36, color: nvy(0.75), ...tag }}>Kıbrıs'ta doğru ev.</div>
        <div style={{ marginTop: 62, ...cta }}>
          <div style={{ ...monoL, fontSize: 28, letterSpacing: '.14em', background: NAVY, color: '#fff', padding: '24px 52px', borderRadius: 999 }}>EVLEK.APP'TE ARA</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', bottom: 190, width: 240 * line, height: 3, background: GOLD, transform: 'translateX(-50%)' }} />
    </div>
  );
}

function EvlekReel() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SceneStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={KREM}>
        {{ 'Problem': SceneP, 'Arama': SceneS2, 'Sonuçlar': SceneS3, 'Okuma': SceneS4, 'Sanal Düzenleme': SceneS5, 'Veri': SceneS6, 'Destek': SceneS7, 'Kapanış': SceneS8 }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
