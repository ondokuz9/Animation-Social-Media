/* Evlek tanıtım reel v3 — 1080×1920 · 19.5 sn · gerçek ürün odaklı. Saf render(t). */
const { SceneStage, useScene, clamp } = window;

const NAVY = '#0A2540', GOLD = '#C9A157', BLUE = '#2F5CFF', KREM = '#F4F1EB', BEYAZ = '#FFFFFF';
const MONO = "'JetBrains Mono',ui-monospace,monospace";
const SANS = "'Hanken Grotesk',system-ui,sans-serif";
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const ABS = { position: 'absolute', inset: 0 };
const nvy = (a) => `rgba(10,37,64,${a})`;

/* Sakin giriş: 180–320 ms, bounce yok */
function mv(lt, t0, d = 0.26, dist = 18) {
  const x = EASE((lt - t0) / d);
  return { opacity: x, transform: `translateY(${(1 - x) * dist}px)` };
}
const fade = (lt, t0, d = 0.24) => ({ opacity: EASE((lt - t0) / d) });
const out = (lt, t0, d = 0.24, dist = -16) => {
  const x = EASE((lt - t0) / d);
  return { opacity: 1 - x, transform: `translateY(${x * dist}px)` };
};

const Q3 = "Girne'de deniz gören,\nTürk koçanlı, £180 bin altı 2+1";
function typedCount(lt, t0, span) {
  const time = lt - t0; if (time <= 0) return 0;
  const pauses = []; for (let i = 0; i < Q3.length; i++) if (Q3[i] === ',') pauses.push(i);
  const pd = 0.12 * (span / 1.9), step = (span - pd * pauses.length) / (Q3.length - 1);
  let n = 0;
  for (let i = 0; i < Q3.length; i++) {
    const ti = i * step + pauses.filter((p) => p < i).length * pd;
    if (ti <= time) n = i + 1; else break;
  }
  return n;
}

const Check = ({ size = 30, color = GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="2" />
    <path d="M7.5 12.2 L10.6 15.3 L16.5 9.2" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const monoL = { fontFamily: MONO, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase' };

function AppBar({ back, title }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 120, background: BEYAZ, borderBottom: `1.5px solid ${nvy(0.08)}`, display: 'flex', alignItems: 'center', padding: '0 70px', gap: 28 }}>
      {back && (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M15 5 L8 12 L15 19" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
      <img src="img/wordmark.png" alt="Evlek" style={{ height: 38, display: 'block' }} />
      {title && <div style={{ ...monoL, fontSize: 22, color: nvy(0.5) }}>{title}</div>}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ width: 34, height: 2.5, background: NAVY }} /><div style={{ width: 34, height: 2.5, background: NAVY }} /><div style={{ width: 22, height: 2.5, background: NAVY }} />
      </div>
    </div>
  );
}

/* ---------- Arama ekranı (S1 + S2) ---------- */
function SearchScreen({ hlSt, n, focus, caretOp, pressP, enterFlash }) {
  const typed = Q3.slice(0, n);
  const parts = typed.split('\n');
  const scale = 1 - 0.04 * Math.sin(Math.PI * pressP);
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <AppBar />
      <div style={{ position: 'absolute', left: 70, top: 300, ...hlSt }}>
        <div style={{ ...monoL, fontSize: 24, color: GOLD, marginBottom: 26 }}>EVLEK ARAMA</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.06, letterSpacing: '-0.02em', color: NAVY }}>Filtreleri değil,<br />evi tarif et.</div>
      </div>
      <div style={{ position: 'absolute', left: 70, top: 640, width: 940, boxSizing: 'border-box', background: BEYAZ, borderRadius: 24, border: `2px solid ${focus ? BLUE : nvy(0.14)}`, boxShadow: focus ? '0 0 0 6px rgba(47,92,255,.1)' : '0 10px 30px rgba(10,37,64,.06)', padding: '34px 36px 30px' }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, lineHeight: 1.55, color: n > 0 ? NAVY : nvy(0.35), minHeight: 100 }}>
          {n > 0 ? (
            <span>{parts[0]}{parts.length > 1 && <br />}{parts[1]}</span>
          ) : 'Evi tarif edin…'}
          <span style={{ display: 'inline-block', width: 3.5, height: 36, marginLeft: 6, verticalAlign: '-5px', background: BLUE, opacity: caretOp }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
          <div style={{ position: 'relative', overflow: 'hidden', background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 27, padding: '16px 40px', borderRadius: 999, transform: `scale(${scale})` }}>
            Ara
            <div style={{ ...ABS, background: BLUE, opacity: 0.55 * Math.sin(Math.PI * enterFlash), borderRadius: 999 }} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 70, top: 924, display: 'flex', gap: 16 }}>
        {['deniz manzaralı', 'site içinde', 'yeni koçan'].map((c, i) => (
          <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: nvy(0.6), background: nvy(0.06), padding: '13px 26px', borderRadius: 999 }}>{c}</div>
        ))}
      </div>
    </div>
  );
}
function SceneS1() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 1.3;
  const app = fade(lt, 0, 0.3 * k);
  return (
    <div style={{ ...ABS, background: KREM }} data-screen-label={`${Math.floor(lt)}s · Arama`}>
      <div style={{ ...ABS, ...app, transform: `scale(${0.985 + 0.015 * EASE(lt / (0.3 * k))})`, transformOrigin: '50% 45%' }}>
        <SearchScreen hlSt={mv(lt, 0.25 * k, 0.3 * k)} n={0} focus={false} caretOp={0} pressP={0} enterFlash={0} />
      </div>
    </div>
  );
}
function SceneS2() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.9;
  const hlSt = out(lt, 0.02 * k, 0.26 * k);
  const focus = lt > 0.3 * k && lt < 2.55 * k;
  const n = typedCount(lt, 0.5 * k, 1.65 * k);
  const done = n >= Q3.length;
  let caretOp = 0;
  if (lt > 0.3 * k && lt < 2.5 * k) caretOp = done ? (Math.floor(lt * 2.6) % 2 === 0 ? 1 : 0.1) : 1;
  const pressP = clamp((lt - 2.3 * k) / (0.2 * k), 0, 1);
  return (
    <div style={{ ...ABS, background: KREM }} data-screen-label={`${Math.floor(1.3 + lt)}s · Sorgu`}>
      <SearchScreen hlSt={hlSt} n={n} focus={focus} caretOp={caretOp} pressP={pressP} enterFlash={pressP} />
    </div>
  );
}

/* ---------- Sonuçlar (S3) ---------- */
const CARDS = [
  { img: 'img/room-01-akdeniz.jpg', fiyat: '£165.000', yer: 'Girne · Zeytinlik', meta: '2+1 · 85 m² · Deniz manzarası' },
  { img: 'img/room-02-minimal.jpg', fiyat: '£172.000', yer: 'Girne · Karaoğlanoğlu', meta: '2+1 · 78 m² · Deniz manzarası' },
  { img: 'img/room-03-dogal.jpg', fiyat: '£158.000', yer: 'Girne · Alsancak', meta: '2+1 · 82 m² · Deniz manzarası' },
];
function Card({ c, feat, dim, h }) {
  return (
    <div style={{ width: 940, boxSizing: 'border-box', background: BEYAZ, borderRadius: 22, overflow: 'hidden', border: feat ? `3px solid ${GOLD}` : `1.5px solid ${nvy(0.1)}`, boxShadow: feat ? '0 24px 56px rgba(10,37,64,.16)' : '0 12px 32px rgba(10,37,64,.08)', opacity: 1 - 0.45 * dim, transform: `scale(${1 + 0.015 * feat - 0.005 * dim})` }}>
      <div style={{ position: 'relative' }}>
        <img src={c.img} alt="" style={{ width: '100%', height: h, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', left: 20, top: 20, ...monoL, fontSize: 20, letterSpacing: '.1em', background: NAVY, color: '#fff', padding: '10px 18px', borderRadius: 999 }}>TÜRK KOÇANI</div>
      </div>
      <div style={{ padding: '26px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, letterSpacing: '-0.01em', color: NAVY }}>{c.fiyat}</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Check size={28} /><span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 25, color: NAVY }}>Evlek kontrolü</span>
          </div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 27, color: nvy(0.62), marginTop: 8 }}>{c.yer} · {c.meta}</div>
      </div>
    </div>
  );
}
function ResultsScreen({ lt, k, dyn }) {
  const featP = dyn ? EASE(clamp((lt - 1.5 * k) / (0.24 * k), 0, 1)) : 1;
  const st = (t0) => (dyn ? mv(lt, t0 * k, 0.3 * k, 24) : { opacity: 1 });
  return (
    <div style={{ ...ABS, background: '#F8F7F3' }}>
      <AppBar title="SONUÇLAR" />
      <div style={{ position: 'absolute', left: 70, top: 152, width: 940, ...st(0.15) }}>
        <div style={{ boxSizing: 'border-box', background: BEYAZ, border: `1.5px solid ${nvy(0.12)}`, borderRadius: 999, padding: '16px 28px', fontFamily: MONO, fontSize: 24, color: nvy(0.7), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Girne'de deniz gören, Türk koçanlı, £180 bin altı 2+1</div>
      </div>
      <div style={{ position: 'absolute', left: 70, top: 268, ...st(0.28) }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 92, letterSpacing: '-0.02em', color: NAVY }}>Evlek bulur.</div>
        <div style={{ ...monoL, fontSize: 23, color: nvy(0.5), marginTop: 14 }}>3 SONUÇ · GİRNE</div>
      </div>
      <div style={{ position: 'absolute', left: 70, top: 486, display: 'flex', flexDirection: 'column', gap: 34 }}>
        <div style={{ ...st(0.45) }}><Card c={CARDS[0]} feat={featP} dim={0} h={350} /></div>
        <div style={{ ...st(0.6) }}><Card c={CARDS[1]} feat={0} dim={featP} h={300} /></div>
        <div style={{ ...st(0.75) }}><Card c={CARDS[2]} feat={0} dim={featP} h={300} /></div>
      </div>
    </div>
  );
}
function SceneS3() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.8;
  const oldOut = out(lt, 0, 0.26 * k, -60);
  return (
    <div style={{ ...ABS, background: '#F8F7F3', overflow: 'hidden' }} data-screen-label={`${Math.floor(4.2 + lt)}s · Sonuçlar`}>
      {oldOut.opacity > 0 && <div style={{ ...ABS, ...oldOut }}><SearchScreen hlSt={{ opacity: 0 }} n={Q3.length} focus={false} caretOp={0} pressP={1} enterFlash={1} /></div>}
      <div style={{ ...ABS, ...fade(lt, 0.12 * k, 0.24 * k) }}><ResultsScreen lt={lt} k={k} dyn={true} /></div>
    </div>
  );
}

/* ---------- Detay sayfası (S4) ---------- */
function Modul({ y, hl, children }) {
  return (
    <div style={{ position: 'absolute', left: 70, top: y, width: 940, boxSizing: 'border-box', background: BEYAZ, border: `2px solid ${hl > 0 ? `rgba(47,92,255,${0.75 * hl})` : nvy(0.1)}`, borderRadius: 18, padding: '26px 32px', boxShadow: '0 8px 24px rgba(10,37,64,.05)' }}>{children}</div>
  );
}
const CHART = 'M0,150 L85,140 L170,146 L255,128 L340,132 L425,112 L510,118 L595,96 L680,102 L765,82 L850,70 L940,58';
function DetailPage({ hls }) {
  const lbl = { ...monoL, fontSize: 21, color: nvy(0.48) };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1880, background: '#F8F7F3' }}>
      <AppBar back title="İLAN" />
      <img src="img/room-01-akdeniz.jpg" alt="" style={{ position: 'absolute', left: 0, top: 120, width: 1080, height: 520, objectFit: 'cover' }} />
      <div style={{ position: 'absolute', left: 70, top: 668 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: '-0.01em', color: NAVY }}>£165.000</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: nvy(0.6), marginTop: 6 }}>Girne · Zeytinlik · 2+1 · 85 m² · Deniz manzarası</div>
      </div>
      <Modul y={830} hl={hls[0]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Check size={52} />
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY }}>Evlek kontrolü</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 25, color: nvy(0.55), marginTop: 4 }}>Belgeler ve ilan sahada doğrulandı</div>
          </div>
        </div>
      </Modul>
      <Modul y={1000} hl={hls[1]}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={lbl}>KOÇAN</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY, marginTop: 8 }}>Türk Koçanı</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 360 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: NAVY }} />
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: nvy(0.12) }} />
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: nvy(0.12) }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <span style={{ ...monoL, fontSize: 19, color: BLUE }}>DÜŞÜK RİSK</span>
              <span style={{ ...monoL, fontSize: 19, color: nvy(0.35) }}>YÜKSEK</span>
            </div>
          </div>
        </div>
      </Modul>
      <Modul y={1170} hl={hls[2]}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <div style={lbl}>BİRİM FİYAT</div>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 44, color: NAVY }}>£1.941 / m²</div>
        </div>
      </Modul>
      <Modul y={1330} hl={hls[3]}>
        <div style={lbl}>BÖLGE KARŞILAŞTIRMASI</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 16 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: NAVY, width: 190 }}>Bu ilan</div>
          <div style={{ width: 430, height: 16, borderRadius: 8, background: NAVY }} />
          <div style={{ fontFamily: MONO, fontSize: 24, color: NAVY }}>£1.941</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: nvy(0.55), width: 190 }}>Girne medyanı</div>
          <div style={{ width: 470, height: 16, borderRadius: 8, background: nvy(0.14) }} />
          <div style={{ fontFamily: MONO, fontSize: 24, color: nvy(0.55) }}>£2.115</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 25, color: GOLD, marginTop: 16, letterSpacing: '.06em' }}>%8 MEDYAN ALTI</div>
      </Modul>
      <Modul y={1560} hl={hls[4]}>
        <div style={lbl}>FİYAT GEÇMİŞİ · SON 12 AY</div>
        <svg width="876" height="180" viewBox="0 0 940 180" style={{ display: 'block', marginTop: 18 }}>
          <path d={`${CHART} L940,180 L0,180 Z`} fill={nvy(0.05)} transform="scale(1,0.85)" />
          <path d={CHART} fill="none" stroke={NAVY} strokeWidth="3.5" transform="scale(1,0.85)" />
          <circle cx="940" cy="49" r="8" fill={BLUE} />
        </svg>
      </Modul>
    </div>
  );
}
const CAM = [{ at: 0.5, y: 905 }, { at: 1.15, y: 1075 }, { at: 1.8, y: 1225 }, { at: 2.45, y: 1425 }, { at: 3.05, y: 1660 }, { at: 3.6, y: null }];
function camera(lt, k) {
  let cur = { s: 1, tx: 0, ty: 0 };
  for (const c of CAM) {
    const m = EASE(clamp((lt - c.at * k) / (0.3 * k), 0, 1));
    if (m <= 0) break;
    const t = c.y == null ? { s: 1, tx: 0, ty: 0 } : { s: 1.5, tx: -270, ty: clamp(960 - c.y * 1.5, -900, 0) };
    cur = { s: cur.s + (t.s - cur.s) * m, tx: cur.tx + (t.tx - cur.tx) * m, ty: cur.ty + (t.ty - cur.ty) * m };
  }
  return cur;
}
function SceneS4() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 4;
  const push = EASE(lt / (0.28 * k));
  const cam = camera(lt, k);
  const hls = CAM.slice(0, 5).map((c, i) => {
    const on = EASE(clamp((lt - c.at * k) / (0.25 * k), 0, 1));
    const nx = CAM[i + 1];
    return Math.min(on, 1 - EASE(clamp((lt - nx.at * k) / (0.25 * k), 0, 1)));
  });
  const hl = { ...mv(lt, 0.4 * k, 0.28 * k), ...(lt > 2.2 * k ? out(lt, 2.2 * k, 0.25 * k) : {}) };
  return (
    <div style={{ ...ABS, background: '#F8F7F3', overflow: 'hidden' }} data-screen-label={`${Math.floor(7 + lt)}s · Okuma`}>
      {push < 1 && <div style={{ ...ABS, opacity: 1 - push }}><ResultsScreen lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translate(${cam.tx + (1 - push) * 1080}px, ${cam.ty}px) scale(${cam.s})`, transformOrigin: '0 0' }}>
        <DetailPage hls={hls} />
      </div>
      <div style={{ position: 'absolute', left: 70, top: 280, background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: '-0.01em', padding: '20px 36px', borderRadius: 16, ...hl }}>Sadece bulmaz. Okur.</div>
    </div>
  );
}

/* ---------- Sanal düzenleme (S5) ---------- */
function StagingView({ lt, k, dyn }) {
  const d = dyn ? EASE(clamp((lt - 0.35 * k) / (0.9 * k), 0, 1)) : 1;
  const handleOp = dyn ? Math.min(EASE(clamp((lt - 0.3 * k) / (0.2 * k), 0, 1)), 1 - EASE(clamp((lt - 1.35 * k) / (0.25 * k), 0, 1))) : 0;
  const hl = dyn ? mv(lt, 1.3 * k, 0.28 * k, 20) : { opacity: 1 };
  const pill = dyn ? mv(lt, 0.15 * k, 0.24 * k, -12) : { opacity: 1 };
  const x = 70 + d * 940;
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <img src="img/room-00-bos.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover' }} />
      <img src="img/room-01-akdeniz.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 ${(1 - d) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - d) * 100}% 0 0)` }} />
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.35) 0%,rgba(10,37,64,0) 20%,rgba(10,37,64,0) 62%,rgba(10,37,64,.62) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 2, width: 4, background: '#fff', opacity: handleOp }} />
      <div style={{ position: 'absolute', top: 910, left: x - 34, width: 68, height: 68, borderRadius: 999, background: '#fff', border: `3px solid ${BLUE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: handleOp }}>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M9 3 L3 10 L9 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        <svg width="14" height="20" viewBox="0 0 12 20"><path d="M3 3 L9 10 L3 17" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: 'absolute', right: 70, top: 288, ...pill }}>
        <span style={{ ...monoL, fontSize: 22, letterSpacing: '.1em', background: NAVY, color: '#fff', padding: '13px 22px', borderRadius: 999 }}>YAPAY ZEKÂYLA DÜZENLENDİ · TEMSİLÎ</span>
      </div>
      <div style={{ position: 'absolute', left: 70, top: 1120, fontFamily: SANS, fontWeight: 800, fontSize: 76, letterSpacing: '-0.02em', color: '#fff', ...hl }}>Potansiyelini gösterir.</div>
    </div>
  );
}
function SceneS5() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.3;
  const inY = 1 - EASE(lt / (0.26 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: '#F8F7F3' }} data-screen-label={`${Math.floor(11 + lt)}s · Sanal düzenleme`}>
      {inY > 0 && <div style={ABS}><DetailPage hls={[0, 0, 0, 0, 0]} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <StagingView lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ---------- Bağlam ekranları (S6) ---------- */
function Panel({ children }) {
  return <div style={{ position: 'absolute', left: 70, top: 470, width: 940, boxSizing: 'border-box', background: BEYAZ, border: `1.5px solid ${nvy(0.1)}`, borderRadius: 24, padding: '40px 44px', boxShadow: '0 16px 40px rgba(10,37,64,.07)' }}>{children}</div>;
}
function ScreenEndeks() {
  return (
    <div style={{ ...ABS, background: '#F8F7F3' }}>
      <AppBar title="VERİ" />
      <Panel>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: NAVY }}>KKTC Fiyat Endeksi</div>
          <div style={{ flex: 1 }} />
          <div style={{ ...monoL, fontSize: 21, color: nvy(0.5) }}>2026 Q2</div>
        </div>
        <svg width="852" height="330" viewBox="0 0 940 360" style={{ display: 'block', marginTop: 30 }}>
          {[60, 150, 240, 330].map((y) => <line key={y} x1="0" x2="940" y1={y} y2={y} stroke={nvy(0.08)} strokeWidth="1.5" />)}
          <path d="M0,320 L94,306 L188,312 L282,284 L376,290 L470,258 L564,264 L658,222 L752,204 L846,178 L940,150 L940,360 L0,360 Z" fill={nvy(0.05)} />
          <path d="M0,320 L94,306 L188,312 L282,284 L376,290 L470,258 L564,264 L658,222 L752,204 L846,178 L940,150" fill="none" stroke={NAVY} strokeWidth="4" />
          <circle cx="940" cy="150" r="9" fill={BLUE} />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 30 }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 62, color: NAVY }}>142,8</div>
          <div style={{ fontFamily: MONO, fontSize: 28, color: GOLD }}>+%6,2 yıllık</div>
          <div style={{ flex: 1 }} />
          <div style={{ ...monoL, fontSize: 21, color: nvy(0.45) }}>2019=100</div>
        </div>
      </Panel>
    </div>
  );
}
function ScreenHesap() {
  const row = (l, v, big) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '22px 0', borderBottom: big ? 'none' : `1.5px solid ${nvy(0.08)}` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: big ? 34 : 29, color: big ? NAVY : nvy(0.65) }}>{l}</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: MONO, fontSize: big ? 44 : 30, color: big ? GOLD : NAVY }}>{v}</div>
    </div>
  );
  return (
    <div style={{ ...ABS, background: '#F8F7F3' }}>
      <AppBar title="HESAPLA" />
      <Panel>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: NAVY }}>Yatırım hesaplayıcı</div>
        <div style={{ marginTop: 18 }}>
          {row('İlan fiyatı', '£165.000')}
          {row('Tahmini kira', '£750 / ay')}
          <div style={{ padding: '30px 0 10px' }}>
            <div style={{ position: 'relative', height: 8, borderRadius: 4, background: nvy(0.1) }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '58%', borderRadius: 4, background: NAVY }} />
              <div style={{ position: 'absolute', left: '58%', top: -12, width: 32, height: 32, marginLeft: -16, borderRadius: 999, background: '#fff', border: `3px solid ${BLUE}`, boxShadow: '0 2px 8px rgba(10,37,64,.25)' }} />
            </div>
            <div style={{ ...monoL, fontSize: 20, color: nvy(0.45), marginTop: 16 }}>DOLULUK VARSAYIMI · %85</div>
          </div>
          {row('Brüt yıllık getiri', '%5,45', true)}
        </div>
      </Panel>
    </div>
  );
}
function ScreenDil() {
  return (
    <div style={{ ...ABS, background: '#F8F7F3' }}>
      <AppBar title="DİL" />
      <Panel>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: NAVY }}>5 dilde.</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
          {['TR', 'EN', 'RU', 'DE', 'EL'].map((d, i) => (
            <div key={d} style={{ fontFamily: MONO, fontSize: 28, letterSpacing: '.08em', color: i === 1 ? BLUE : nvy(0.6), border: `2px solid ${i === 1 ? BLUE : nvy(0.14)}`, background: i === 1 ? 'rgba(47,92,255,.07)' : 'transparent', padding: '14px 26px', borderRadius: 14 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 26, marginTop: 36, border: `1.5px solid ${nvy(0.1)}`, borderRadius: 18, padding: 22, alignItems: 'center' }}>
          <img src="img/room-01-akdeniz.jpg" alt="" style={{ width: 210, height: 150, objectFit: 'cover', borderRadius: 12, display: 'block' }} />
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 31, color: NAVY }}>Sea-view 2+1 · Girne</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: nvy(0.6), marginTop: 8 }}>Turkish title deed · £165,000</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <Check size={26} /><span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: nvy(0.75) }}>Verified by Evlek</span>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
function SceneS6() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 3.5;
  const inP = EASE(lt / (0.26 * k));
  const s1 = EASE(clamp((lt - 1.1 * k) / (0.24 * k), 0, 1));
  const s2 = EASE(clamp((lt - 2.2 * k) / (0.24 * k), 0, 1));
  const tx = -(s1 + s2) * 1080;
  const hl = mv(lt, 0.25 * k, 0.28 * k);
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: '#F8F7F3' }} data-screen-label={`${Math.floor(13.3 + lt)}s · Bağlam`}>
      {inP < 1 && <div style={{ ...ABS, opacity: 1 - inP }}><StagingView lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, opacity: inP }}>
        <div style={{ ...ABS, transform: `translateX(${tx}px)` }}>
          <div style={{ ...ABS }}><ScreenEndeks /></div>
          <div style={{ ...ABS, left: 1080, right: -1080 }}><ScreenHesap /></div>
          <div style={{ ...ABS, left: 2160, right: -2160 }}><ScreenDil /></div>
        </div>
        <div style={{ position: 'absolute', left: 70, top: 280, fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.1, letterSpacing: '-0.02em', color: NAVY, ...hl }}>Karar için daha fazla bağlam.</div>
      </div>
    </div>
  );
}

/* ---------- Kapanış (S7) ---------- */
function SceneS7() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.7;
  const inY = 1 - EASE(lt / (0.28 * k));
  const wm = mv(lt, 0.35 * k, 0.3 * k, 22);
  const tag = mv(lt, 0.55 * k, 0.28 * k, 16);
  const cta = mv(lt, 0.75 * k, 0.28 * k, 14);
  const line = EASE(clamp((lt - 0.95 * k) / (0.3 * k), 0, 1));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: KREM }} data-screen-label={`${Math.floor(16.8 + lt)}s · Kapanış`}>
      <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, paddingBottom: 140 }}>
        <img src="img/wordmark.png" alt="Evlek" style={{ width: 440, display: 'block', ...wm }} />
        <div style={{ marginTop: 52, fontFamily: SANS, fontWeight: 500, fontSize: 44, color: nvy(0.75), ...tag }}>Kıbrıs'ta doğru ev.</div>
        <div style={{ marginTop: 64, ...cta }}>
          <div style={{ ...monoL, fontSize: 28, letterSpacing: '.14em', background: NAVY, color: '#fff', padding: '24px 52px', borderRadius: 999 }}>EVLEK.APP'TE ARA</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', bottom: 170, width: 240 * line, height: 3, background: GOLD, transform: 'translateX(-50%)' }} />
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)`, overflow: 'hidden' }}>
        <ScreenDil />
        <div style={{ position: 'absolute', left: 70, top: 280, fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.1, letterSpacing: '-0.02em', color: NAVY }}>Karar için daha fazla bağlam.</div>
      </div>
    </div>
  );
}

function EvlekReel() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SceneStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={KREM}>
        {{ 'Arama': SceneS1, 'Sorgu': SceneS2, 'Sonuçlar': SceneS3, 'Okuma': SceneS4, 'Sanal Düzenleme': SceneS5, 'Bağlam': SceneS6, 'Kapanış': SceneS7 }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
