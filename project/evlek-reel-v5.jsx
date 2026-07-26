/* Evlek tanıtım reel v5 — 1080×1920 · 22.5 sn · ana marka filmi. Saf render(t). */
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
const Chev = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ display: 'block' }}><path d="M2 2 L8 8 L14 2" stroke={nvy(0.55)} strokeWidth="2" strokeLinecap="round" /></svg>
);
const lblS = { fontFamily: SANS, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' };
const Ornek = ({ style }) => (
  <span style={{ ...lblS, fontSize: 24, letterSpacing: '.06em', color: '#fff', background: NAVY, borderRadius: 999, padding: '7px 18px', ...style }}>ÖRNEK VERİ</span>
);

/* ============ S1–S3 · Karmaşa → Problem → Dönüşüm ============ */
const FILTRELER = ['Bölge', 'Fiyat', 'Oda', 'Koçan', 'Deniz manzarası', 'Metrekare'];
const SORULAR = ['Koçan bilgisi?', 'Bölge fiyatı?', 'Fiyat geçmişi?', 'İlan veren doğrulandı mı?'];
function BuyukKart({ src, fiyat, yer, w }) {
  return (
    <div style={{ width: w, background: BEYAZ, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 60px rgba(4,14,28,.45)' }}>
      <img src={src} alt="" style={{ width: '100%', height: w * 0.52, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '22px 28px 26px' }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: NAVY }}>{fiyat}</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: nvy(0.6), marginTop: 4 }}>{yer}</div>
      </div>
    </div>
  );
}
function KarmasaComposite({ entP, blurP, qPs, t1, t2 }) {
  const e = (i) => ({ opacity: EASE(entP * 3 - i * 0.35), transform: `translateY(${(1 - EASE(entP * 3 - i * 0.35)) * 30}px)` });
  return (
    <div style={{ ...ABS, background: '#0F1F38', overflow: 'hidden' }}>
      <div style={{ ...ABS, filter: blurP > 0 ? `blur(${8 * blurP}px)` : undefined, transform: `scale(${1.01 + 0.02 * blurP})` }}>
        <div style={{ position: 'absolute', left: 60, top: 120, width: 960, display: 'flex', flexWrap: 'wrap', gap: 16, ...e(0) }}>
          {FILTRELER.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: nvy(0.75), background: BEYAZ, borderRadius: 12, padding: '16px 24px' }}>{f}<Chev /></div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: -70, top: 370, ...e(1) }}><BuyukKart src="img/room-02-minimal.jpg" fiyat="£172.000" yer="Girne · Karaoğlanoğlu" w={660} /></div>
        <div style={{ position: 'absolute', right: -90, top: 560, ...e(2) }}><BuyukKart src="img/kiyi.jpg" fiyat="£149.000" yer="Lefkoşa · Merkez" w={640} /></div>
        <div style={{ position: 'absolute', left: 90, top: 1030, ...e(3) }}><BuyukKart src="img/room-03-dogal.jpg" fiyat="£158.000" yer="Girne · Alsancak" w={620} /></div>
        <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,20,38,.35) 0%,rgba(10,20,38,0) 25%,rgba(10,20,38,.12) 55%,rgba(10,20,38,.55) 70%,rgba(10,20,38,.9) 100%)' }} />
      </div>
      {qPs.some((q) => q > 0) && (
        <div style={{ position: 'absolute', left: 110, top: 600, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {SORULAR.map((s, i) => {
            const p = EASE(qPs[i]);
            return p <= 0 ? null : (
              <div key={i} style={{ alignSelf: 'flex-start', marginLeft: [0, 48, 16, 64][i], background: BEYAZ, color: NAVY, fontFamily: SANS, fontWeight: 700, fontSize: 32, padding: '18px 30px', borderRadius: 999, boxShadow: '0 14px 36px rgba(4,14,28,.4)', opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>{s}</div>
            );
          })}
        </div>
      )}
      <div style={{ position: 'absolute', left: 110, top: 1290, fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: '-0.02em', color: '#fff' }}>
        {t1 > 0 && <div style={{ opacity: t1 }}>İlan bulmak kolay.</div>}
        {t2 > 0 && <div style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', opacity: t2 }}>Doğru kararı vermek zor.</div>}
      </div>
    </div>
  );
}
function SceneKarmasa() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 0.65;
  return (
    <div style={ABS} data-screen-label={`${Math.floor(lt)}s · Karmaşa`}>
      <KarmasaComposite entP={EASE(lt / (0.4 * k))} blurP={0} qPs={[0, 0, 0, 0]} t1={EASE((lt - 0.15 * k) / (0.2 * k))} t2={0} />
    </div>
  );
}
function SceneProblem() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 1.2;
  const qPs = SORULAR.map((_, i) => clamp((lt - (0.15 + i * 0.14) * k) / (0.24 * k), 0, 1));
  return (
    <div style={ABS} data-screen-label={`${Math.floor(0.65 + lt)}s · Problem`}>
      <KarmasaComposite entP={1} blurP={EASE(lt / (0.4 * k))} qPs={qPs} t1={1 - EASE((lt - 0.42 * k) / (0.2 * k))} t2={EASE((lt - 0.58 * k) / (0.24 * k))} />
    </div>
  );
}
function SceneDonusum() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 0.85;
  const m = EASE(lt / (0.32 * k));
  const box = mv(lt, 0.22 * k, 0.3 * k, 30);
  const brand = mv(lt, 0.38 * k, 0.26 * k, 12);
  return (
    <div style={{ ...ABS, background: BEYAZ, overflow: 'hidden' }} data-screen-label={`${Math.floor(1.85 + lt)}s · Dönüşüm`}>
      {m < 1 && (
        <div style={{ ...ABS, opacity: 1 - m, transform: `scale(${1 - 0.06 * m})`, transformOrigin: '50% 44%' }}>
          <KarmasaComposite entP={1} blurP={1} qPs={[1, 1, 1, 1]} t1={0} t2={1} />
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', ...brand }}>
        <img src="img/wordmark.png" alt="Evlek" style={{ height: 46, display: 'block' }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: nvy(0.6), marginTop: 18 }}>Evlek bunun için var.</div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 640, width: 860, boxSizing: 'border-box', background: BEYAZ, borderRadius: 24, border: `2.5px solid ${nvy(0.14)}`, boxShadow: '0 18px 48px rgba(10,37,64,.1)', padding: '34px 36px', opacity: box.opacity, transform: `${box.transform} scale(${0.9 + 0.1 * EASE((lt - 0.22 * k) / (0.3 * k))})` }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, lineHeight: 1.55, color: nvy(0.35), minHeight: 50 }}>Evi tarif edin…</div>
      </div>
    </div>
  );
}

/* ============ S4 · Arama (blok yazım + cursor tıklama) ============ */
const BLOKLAR = ["Girne'de deniz gören,", 'Türk koçanlı,', '£180 bin altı 2+1'];
const CHIPS4 = [{ t: 'Girne', b: 0 }, { t: 'Deniz manzaralı', b: 0 }, { t: 'Türk koçanlı', b: 1 }, { t: '£180K altı', b: 2 }, { t: '2+1', b: 2 }];
const BLK_T = [0.5, 0.95, 1.4];
const Cursor = ({ x, y, op }) => (
  <svg width="44" height="48" viewBox="0 0 24 26" style={{ position: 'absolute', left: x, top: y, opacity: op, filter: 'drop-shadow(0 3px 8px rgba(4,14,28,.35))' }}>
    <path d="M4 1 L4 19 L8.5 15.5 L11.5 22.5 L14.8 21 L11.8 14.2 L17.5 13.5 Z" fill="#fff" stroke={NAVY} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
function SearchV5({ lt, k, dyn }) {
  const hl = dyn ? mv(lt, 0.08 * k, 0.28 * k) : { opacity: 1 };
  const introOut = dyn ? 1 - EASE(lt / (0.2 * k)) : 0;
  const blokEls = BLOKLAR.map((b, i) => {
    const p = dyn ? EASE((lt - BLK_T[i] * k) / (0.22 * k)) : 1;
    const flash = dyn ? clamp((lt - BLK_T[i] * k) / (0.1 * k), 0, 1) * (1 - EASE((lt - (BLK_T[i] + 0.28) * k) / (0.32 * k))) : 0;
    return p <= 0 ? null : (
      <span key={i} style={{ display: 'inline', opacity: p, background: `rgba(201,161,87,${0.32 * flash})`, borderRadius: 6, boxDecorationBreak: 'clone' }}>{b}{i < 2 ? ' ' : ''}<br /></span>
    );
  });
  const anyTyped = !dyn || lt > BLK_T[0] * k;
  const caretOp = dyn && lt > 0.3 * k && lt < 2.0 * k ? 1 : 0;
  const pressP = dyn ? clamp((lt - 2.05 * k) / (0.22 * k), 0, 1) : 1;
  const scale = 1 - 0.04 * Math.sin(Math.PI * pressP);
  const ring = clamp(pressP * 1.3, 0, 1);
  const curP = dyn ? EASE((lt - 1.6 * k) / (0.4 * k)) : 1;
  const curOp = dyn ? Math.min(EASE((lt - 1.55 * k) / (0.15 * k)), 1 - EASE((lt - 2.3 * k) / (0.2 * k))) : 0;
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <div style={{ position: 'absolute', left: 110, top: 250, ...hl }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.08, letterSpacing: '-0.02em', color: NAVY }}>Filtreleri değil,<br />aradığın evi tarif et.</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: introOut }}>
        <img src="img/wordmark.png" alt="Evlek" style={{ height: 46, display: 'block' }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: nvy(0.6), marginTop: 18 }}>Evlek bunun için var.</div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 640, width: 860, boxSizing: 'border-box', background: BEYAZ, borderRadius: 24, border: `2.5px solid ${anyTyped ? NAVY : nvy(0.14)}`, boxShadow: anyTyped ? '0 0 0 7px rgba(201,161,87,.16)' : '0 18px 48px rgba(10,37,64,.1)', padding: '34px 36px 28px' }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, lineHeight: 1.55, color: anyTyped ? NAVY : nvy(0.35), minHeight: 150 }}>
          {anyTyped ? blokEls : 'Evi tarif edin…'}
          <span style={{ display: 'inline-block', width: 3.5, height: 36, marginLeft: 6, verticalAlign: '-5px', background: GOLD, opacity: caretOp }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <div style={{ position: 'relative', background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 28, padding: '17px 44px', borderRadius: 999, transform: `scale(${scale})` }}>
            Ara
            <div style={{ position: 'absolute', inset: -8 * ring, borderRadius: 999, border: `2.5px solid rgba(201,161,87,${0.7 * (1 - ring)})` }} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 952, display: 'flex', gap: 16, flexWrap: 'wrap', width: 860 }}>
        {CHIPS4.map((c, i) => {
          const t0 = (BLK_T[c.b] + 0.18) * k;
          const p = dyn ? EASE((lt - t0) / (0.2 * k)) : 1;
          const gold = dyn ? 1 - EASE((lt - t0 - 0.3 * k) / (0.3 * k)) : 0;
          return p <= 0 ? null : (
            <div key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: NAVY, background: BEYAZ, border: `2px solid ${gold > 0.02 ? `rgba(201,161,87,${0.3 + 0.7 * gold})` : nvy(0.16)}`, padding: '12px 24px', borderRadius: 999, opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{c.t}</div>
          );
        })}
      </div>
      {dyn && curOp > 0 && <Cursor x={lerp(950, 848, curP)} y={lerp(1240, 868, curP)} op={curOp} />}
    </div>
  );
}
function SceneArama() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.45;
  return <div style={{ ...ABS, background: BEYAZ }} data-screen-label={`${Math.floor(2.7 + lt)}s · Arama`}><SearchV5 lt={lt} k={k} dyn={true} /></div>;
}

/* ============ S5 · Sonuçlar (morph pill + kartlar) ============ */
const CARDS = [
  { img: 'img/room-01-akdeniz.jpg', fiyat: '£165.000', yer: 'Girne · Zeytinlik', meta: '2+1 · 85 m²' },
  { img: 'img/kiyi.jpg', fiyat: '£172.000', yer: 'Girne · Karaoğlanoğlu', meta: '2+1 · 78 m²' },
  { img: 'img/room-02-minimal.jpg', flip: true, fiyat: '£158.000', yer: 'Girne · Alsancak', meta: '2+1 · 82 m²' },
];
function KartV5({ c, feat, dim, w, ph }) {
  return (
    <div style={{ width: w, boxSizing: 'border-box', background: BEYAZ, borderRadius: 22, overflow: 'hidden', border: feat ? `3px solid ${GOLD}` : `1.5px solid ${nvy(0.1)}`, boxShadow: feat ? '0 24px 56px rgba(10,37,64,.16)' : '0 12px 32px rgba(10,37,64,.08)', opacity: 1 - 0.42 * dim }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={c.img} alt="" style={{ width: '100%', height: ph, objectFit: 'cover', display: 'block', transform: c.flip ? 'scaleX(-1)' : undefined, objectPosition: c.flip ? '30% 62%' : undefined }} />
        <div style={{ position: 'absolute', left: 20, top: 20, ...lblS, fontSize: 24, letterSpacing: '.08em', background: NAVY, color: '#fff', padding: '10px 18px', borderRadius: 999 }}>TÜRK KOÇANI</div>
      </div>
      <div style={{ padding: '24px 30px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: feat ? 46 : 40, letterSpacing: '-0.01em', color: NAVY }}>{c.fiyat}</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Check size={27} /><span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 25, color: NAVY }}>Doğrulanmış hesap</span>
          </div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: nvy(0.62), marginTop: 6 }}>{c.yer} · {c.meta}</div>
      </div>
    </div>
  );
}
function ResultsV5({ lt, k, dyn }) {
  const m = dyn ? EASE(lt / (0.3 * k)) : 1;
  const featP = dyn ? EASE(clamp((lt - 1.15 * k) / (0.24 * k), 0, 1)) : 1;
  const st = (t0) => (dyn ? mv(lt, t0 * k, 0.26 * k, 26) : { opacity: 1 });
  const fr = { top: lerp(640, 210, m), h: lerp(300, 62, m), r: lerp(24, 999, m) };
  return (
    <div style={{ ...ABS, background: SICAK }}>
      <div style={{ position: 'absolute', left: 110, top: fr.top, width: 860, height: fr.h, boxSizing: 'border-box', background: BEYAZ, border: `1.5px solid ${nvy(0.13)}`, borderRadius: fr.r, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 28px' }}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: nvy(0.7), whiteSpace: 'nowrap', opacity: m < 1 ? m : 1 }}>Girne · 2+1 · Türk Koçanı · £180K altı</div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 300, ...st(0.32) }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, letterSpacing: '-0.02em', color: NAVY }}>Evlek bulur.</div>
      </div>
      <div style={{ position: 'absolute', left: 100, top: 452, ...st(0.42) }}><KartV5 c={CARDS[0]} feat={featP} dim={0} w={880} ph={410} /></div>
      <div style={{ position: 'absolute', left: 110, top: 1122, ...st(0.52) }}><KartV5 c={CARDS[1]} feat={0} dim={featP} w={780} ph={290} /></div>
      <div style={{ position: 'absolute', left: 110, top: 1592, ...st(0.62) }}><KartV5 c={CARDS[2]} feat={0} dim={featP} w={780} ph={290} /></div>
    </div>
  );
}
function SceneSonuc() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.05;
  const oldOut = out(lt, 0, 0.26 * k, -30);
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(5.15 + lt)}s · Sonuçlar`}>
      <ResultsV5 lt={lt} k={k} dyn={true} />
      {oldOut.opacity > 0 && <div style={{ ...ABS, ...oldOut, pointerEvents: 'none' }}><SearchV5 lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ============ S6 · Okuma (morph + 4 focus) ============ */
function ModulV5({ y, mh, act, dim, children }) {
  return (
    <div style={{ position: 'absolute', left: 110, top: y, width: 860, minHeight: mh, boxSizing: 'border-box', background: BEYAZ, border: `2px solid ${act > 0 ? `rgba(201,161,87,${0.35 + 0.65 * act})` : nvy(0.1)}`, borderRadius: 20, padding: '26px 32px', boxShadow: act > 0 ? '0 18px 48px rgba(10,37,64,.13)' : '0 8px 24px rgba(10,37,64,.05)', opacity: 1 - 0.38 * dim, transform: `scale(${1 + 0.04 * act - 0.01 * dim})` }}>{children}</div>
  );
}
const CHART = 'M0,150 L85,140 L170,146 L255,128 L340,132 L425,112 L510,118 L595,96 L680,102 L765,82 L850,70 L940,58';
const FOKUS = [[0.55, 1.3], [1.3, 2.05], [2.05, 2.8], [2.8, 3.42]];
const KAPS = ['Doğrulanmış hesap', 'Türk Koçanı', 'Piyasayla karşılaştırır', 'Fiyat geçmişini gösterir'];
function DetailV5({ lt, k, dyn }) {
  const m = dyn ? EASE(lt / (0.45 * k)) : 1;
  const bodySt = dyn ? mv(lt, 0.32 * k, 0.3 * k, 26) : { opacity: 1 };
  const hls = FOKUS.map(([a, b]) => (dyn ? Math.min(EASE((lt - a * k) / (0.2 * k)), 1 - EASE((lt - b * k) / (0.2 * k))) : 0));
  const dims = hls.map((_, i) => Math.max(...hls.filter((__, j) => j !== i)));
  const chkDraw = dyn ? EASE((lt - 0.6 * k) / (0.45 * k)) : 1;
  const barP = dyn ? EASE((lt - 2.05 * k) / (0.5 * k)) : 1;
  const chartP = dyn ? EASE((lt - 2.82 * k) / (0.55 * k)) : 1;
  const hlM = dyn ? Math.min(EASE((lt - 0.5 * k) / (0.24 * k)), 1 - EASE((lt - 3.42 * k) / (0.18 * k))) : 0;
  const rect = { x: lerp(100, 0, m), y: lerp(452, 0, m), w: lerp(880, 1080, m), h: lerp(410, 540, m), r: lerp(22, 0, m) };
  const lbl = { ...lblS, fontSize: 24, color: nvy(0.5) };
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }}>
      <div style={{ ...ABS, ...bodySt }}>
        <div style={{ position: 'absolute', left: 110, top: 572 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: '-0.01em', color: NAVY }}>£165.000</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: nvy(0.6) }}>Girne · Zeytinlik · 2+1 · 85 m²</div>
          </div>
        </div>
        <ModulV5 y={692} mh={150} act={hls[0]} dim={dims[0]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Check size={52} draw={chkDraw} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY }}>İlan veren doğrulandı</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 27, color: nvy(0.58), marginTop: 5 }}>Kimlik ve temel ilan bilgileri kontrol edildi</div>
            </div>
          </div>
        </ModulV5>
        <ModulV5 y={872} mh={130} act={hls[1]} dim={dims[1]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <div style={lbl}>KOÇAN BİLGİSİ</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY, marginTop: 7 }}>Türk Koçanı</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ ...lblS, fontSize: 24, color: NAVY, border: `2px solid ${nvy(0.16)}`, borderRadius: 999, padding: '10px 22px' }}>BELGE İLANDA</div>
          </div>
        </ModulV5>
        <ModulV5 y={1032} mh={255} act={hls[2]} dim={dims[2]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={lbl}>BÖLGE KARŞILAŞTIRMASI · £/m²</div><div style={{ flex: 1 }} /><Ornek />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 22 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: NAVY, width: 185 }}>Bu ilan</div>
            <div style={{ width: 380 * barP, height: 16, borderRadius: 8, background: NAVY }} />
            <div style={{ fontFamily: MONO, fontSize: 25, color: NAVY, opacity: barP }}>£1.941</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: nvy(0.55), width: 185 }}>Girne medyanı</div>
            <div style={{ width: 415 * barP, height: 16, borderRadius: 8, background: nvy(0.14) }} />
            <div style={{ fontFamily: MONO, fontSize: 25, color: nvy(0.55), opacity: barP }}>£2.115</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, opacity: barP }}>
            <div style={{ width: 12, height: 12, background: GOLD, borderRadius: 3 }} />
            <div style={{ ...lblS, fontSize: 25, color: NAVY, letterSpacing: '.06em' }}>%8 MEDYAN ALTI</div>
          </div>
        </ModulV5>
        <ModulV5 y={1318} mh={280} act={hls[3]} dim={dims[3]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={lbl}>FİYAT GEÇMİŞİ · SON 12 AY</div><div style={{ flex: 1 }} /><Ornek />
          </div>
          <svg width="792" height="176" viewBox="0 0 940 210" style={{ display: 'block', marginTop: 18 }}>
            <path d={`${CHART} L940,210 L0,210 Z`} fill={nvy(0.05)} opacity={chartP} />
            <path d={CHART} fill="none" stroke={NAVY} strokeWidth="3.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - chartP} />
            <circle cx="940" cy="58" r="8" fill={GOLD} opacity={chartP > 0.96 ? 1 : 0} />
          </svg>
        </ModulV5>
      </div>
      <div style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r, overflow: 'hidden' }}>
        <img src="img/room-01-akdeniz.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(10,37,64,.58) 0%,rgba(10,37,64,.34) 55%,rgba(10,37,64,0) 78%)', opacity: m }} />
        <div style={{ position: 'absolute', right: 24, top: 24, ...lblS, fontSize: 24, letterSpacing: '.08em', background: NAVY, color: '#fff', padding: '10px 18px', borderRadius: 999 }}>TÜRK KOÇANI</div>
      </div>
      {dyn && hlM > 0 && (
        <div style={{ position: 'absolute', left: 110, top: 268, opacity: hlM }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}>Sadece bulmaz.<br />Açıklar.</div>
        </div>
      )}
      {dyn && KAPS.map((c, i) => {
        const o = Math.min(EASE((lt - FOKUS[i][0] * k) / (0.15 * k)), 1 - EASE((lt - FOKUS[i][1] * k) / (0.15 * k)));
        return o <= 0 ? null : (
          <div key={i} style={{ position: 'absolute', left: 110, top: 462, background: NAVY, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 32, padding: '14px 26px', borderRadius: 12, opacity: o }}>{c}</div>
        );
      })}
    </div>
  );
}
function SceneOkuma() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 3.6;
  const m = EASE(lt / (0.45 * k));
  return (
    <div style={{ ...ABS, background: SICAK, overflow: 'hidden' }} data-screen-label={`${Math.floor(7.2 + lt)}s · Okuma`}>
      <DetailV5 lt={lt} k={k} dyn={true} />
      {m < 0.9 && <div style={{ ...ABS, opacity: 1 - m, pointerEvents: 'none' }}><ResultsV5 lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ============ S7 · Sanal düzenleme ============ */
function StagingV5({ lt, k, dyn }) {
  const d = dyn ? EASE(clamp((lt - 0.8 * k) / (0.9 * k), 0, 1)) : 1;
  const handleOp = dyn ? Math.min(EASE(clamp((lt - 0.72 * k) / (0.18 * k), 0, 1)), 1 - EASE(clamp((lt - 1.78 * k) / (0.24 * k), 0, 1))) : 0;
  const hl = dyn ? mv(lt, 2.25 * k, 0.26 * k, 20) : { opacity: 1 };
  const pill = dyn ? mv(lt, 0.32 * k, 0.24 * k, -12) : { opacity: 1 };
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
      <div style={{ position: 'absolute', right: 110, top: 258, ...pill }}>
        <span style={{ ...lblS, fontSize: 24, letterSpacing: '.06em', background: NAVY, color: '#fff', padding: '13px 24px', borderRadius: 999 }}>AI İLE DÜZENLENDİ · TEMSİLÎ</span>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1010, fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: '-0.02em', color: '#fff', ...hl }}>Potansiyelini gösterir.</div>
    </div>
  );
}
function SceneStaging() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.9;
  const inY = 1 - EASE(lt / (0.25 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK }} data-screen-label={`${Math.floor(10.8 + lt)}s · Sanal düzenleme`}>
      {inY > 0 && <div style={ABS}><DetailV5 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <StagingV5 lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ============ S8 · Piyasa araçları ============ */
function PiyasaV5({ lt, k, dyn }) {
  const hl = dyn ? mv(lt, 0.15 * k, 0.26 * k) : { opacity: 1 };
  const p1 = dyn ? mv(lt, 0.3 * k, 0.32 * k, 60) : { opacity: 1 };
  const p2 = dyn ? mv(lt, 0.9 * k, 0.34 * k, 70) : { opacity: 1 };
  const chartP = dyn ? EASE((lt - 0.5 * k) / (0.6 * k)) : 1;
  const cnt = dyn ? EASE((lt - 0.7 * k) / (0.6 * k)) : 1;
  const getiri = dyn ? EASE((lt - 1.7 * k) / (0.26 * k)) : 1;
  const val = (142.8 * cnt).toFixed(1).replace('.', ',');
  const box = { position: 'absolute', left: 110, width: 860, boxSizing: 'border-box', background: BEYAZ, border: `1.5px solid ${nvy(0.1)}`, borderRadius: 24, padding: '32px 36px', boxShadow: '0 20px 48px rgba(10,37,64,.1)' };
  const row = (l, v) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 0', borderBottom: `1.5px solid ${nvy(0.08)}` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: nvy(0.65) }}>{l}</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: MONO, fontSize: 28, color: NAVY }}>{v}</div>
    </div>
  );
  return (
    <div style={{ ...ABS, background: SICAK2 }}>
      <div style={{ position: 'absolute', left: 110, top: 248, fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.12, letterSpacing: '-0.02em', color: NAVY, ...hl }}>Piyasayı gör.<br />Getiriyi hesapla.</div>
      <div style={{ ...box, top: 540, ...p1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>KKTC Fiyat Endeksi</div>
          <div style={{ flex: 1 }} /><Ornek />
        </div>
        <svg width="784" height="234" viewBox="0 0 940 280" style={{ display: 'block', marginTop: 22 }}>
          {[60, 135, 210].map((y) => <line key={y} x1="0" x2="940" y1={y} y2={y} stroke={nvy(0.08)} strokeWidth="1.5" />)}
          <path d="M0,248 L94,236 L188,242 L282,220 L376,226 L470,198 L564,204 L658,170 L752,158 L846,136 L940,114 L940,280 L0,280 Z" fill={nvy(0.05)} opacity={chartP} />
          <path d="M0,248 L94,236 L188,242 L282,220 L376,226 L470,198 L564,204 L658,170 L752,158 L846,136 L940,114" fill="none" stroke={NAVY} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - chartP} />
          <circle cx="940" cy="114" r="9" fill={GOLD} opacity={chartP > 0.96 ? 1 : 0} />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 18 }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 54, color: NAVY }}>{val}</div>
          <div style={{ fontFamily: MONO, fontSize: 27, color: NAVY, opacity: 0.75 }}>+%6,2 yıllık</div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: MONO, fontSize: 24, color: nvy(0.45) }}>2019=100</div>
        </div>
      </div>
      <div style={{ ...box, top: 1120, boxShadow: '0 -12px 48px rgba(10,37,64,.12), 0 20px 48px rgba(10,37,64,.1)', ...p2 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY }}>Yatırım hesaplayıcı</div>
          <div style={{ flex: 1 }} /><Ornek />
        </div>
        <div style={{ marginTop: 8 }}>
          {row('İlan fiyatı', '£165.000')}
          {row('Tahmini kira', '£750 / ay')}
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0 6px', opacity: 0.35 + 0.65 * getiri, transform: `scale(${1 + 0.03 * getiri * (1 - getiri) * 4})`, transformOrigin: 'left center' }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: NAVY }}>Brüt yıllık getiri</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: MONO, fontSize: 44, color: GOLD }}>%5,45</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ScenePiyasa() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.5;
  const inY = 1 - EASE(lt / (0.25 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: SICAK2 }} data-screen-label={`${Math.floor(13.7 + lt)}s · Piyasa`}>
      {inY > 0 && <div style={ABS}><StagingV5 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, transform: `translateY(${inY * 100}%)` }}>
        <PiyasaV5 lt={lt} k={k} dyn={true} />
      </div>
    </div>
  );
}

/* ============ S9 · Cihazlar ============ */
function CihazV5({ lt, k, dyn }) {
  const hl = dyn ? mv(lt, 0.1 * k, 0.26 * k) : { opacity: 1 };
  const b1 = dyn ? mv(lt, 0.22 * k, 0.3 * k, 40) : { opacity: 1 };
  const b2 = dyn ? mv(lt, 0.34 * k, 0.3 * k, 50) : { opacity: 1 };
  const dl = dyn ? mv(lt, 0.5 * k, 0.26 * k, 14) : { opacity: 1 };
  return (
    <div style={{ ...ABS, background: BEYAZ }}>
      <div style={{ position: 'absolute', left: 110, top: 300, fontFamily: SANS, fontWeight: 800, fontSize: 60, letterSpacing: '-0.02em', color: NAVY, ...hl }}>Web · iOS · Android</div>
      <div style={{ position: 'absolute', left: 120, top: 560, width: 610, background: BEYAZ, border: `2px solid ${nvy(0.12)}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 28px 64px rgba(10,37,64,.14)', ...b1 }}>
        <div style={{ height: 54, background: nvy(0.05), display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px' }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 13, height: 13, borderRadius: 999, background: nvy(0.18) }} />)}
        </div>
        <div style={{ padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="img/wordmark.png" alt="Evlek" style={{ height: 26, display: 'block' }} />
            <div style={{ flex: 1, border: `1.5px solid ${nvy(0.14)}`, borderRadius: 999, padding: '10px 18px', fontFamily: MONO, fontSize: 24, color: nvy(0.5), whiteSpace: 'nowrap', overflow: 'hidden' }}>Girne · 2+1 · £180K altı</div>
          </div>
          <img src="img/kiyi.jpg" alt="" style={{ width: '100%', height: 210, objectFit: 'cover', borderRadius: 14, display: 'block', marginTop: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: NAVY }}>£172.000</div>
            <div style={{ flex: 1 }} />
            <Check size={24} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 680, top: 620, width: 280, background: BEYAZ, border: `2.5px solid ${nvy(0.14)}`, borderRadius: 36, overflow: 'hidden', boxShadow: '0 28px 64px rgba(10,37,64,.16)', ...b2 }}>
        <div style={{ height: 34, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div style={{ width: 90, height: 9, borderRadius: 999, background: nvy(0.14) }} /></div>
        <div style={{ padding: '10px 18px 22px' }}>
          <img src="img/room-03-dogal.jpg" alt="" style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 14, display: 'block' }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 27, color: NAVY, marginTop: 14 }}>£158.000</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: nvy(0.6), marginTop: 4 }}>Girne · Alsancak</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1290, display: 'flex', alignItems: 'baseline', gap: 26, ...dl }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: NAVY }}>5 dil</div>
        <div style={{ fontFamily: MONO, fontSize: 27, color: nvy(0.6) }}>TR · EN · RU · DE · AR</div>
      </div>
    </div>
  );
}
function SceneCihaz() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 1.3;
  const inP = EASE(lt / (0.22 * k));
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: BEYAZ }} data-screen-label={`${Math.floor(16.2 + lt)}s · Cihazlar`}>
      <CihazV5 lt={lt} k={k} dyn={true} />
      {inP < 1 && <div style={{ ...ABS, opacity: 1 - inP, transform: `translateY(${-inP * 50}px)` }}><PiyasaV5 lt={1} k={0.1} dyn={false} /></div>}
    </div>
  );
}

/* ============ S10 · Lacivert kapanış ============ */
function SceneKapanis() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 5;
  const inY = 1 - EASE(lt / (0.3 * k));
  const wmO = fade(lt, 0.4 * k, 0.25 * k);
  const wmS = 1.02 - 0.02 * EASE((lt - 0.4 * k) / (0.5 * k));
  const line = EASE(clamp((lt - 0.7 * k) / (0.5 * k), 0, 1));
  const tag = mv(lt, 0.8 * k, 0.28 * k, 14);
  const cta = fade(lt, 1.05 * k, 0.25 * k);
  const dst = fade(lt, 1.3 * k, 0.25 * k);
  const swp = clamp((lt - 1.9 * k) / (0.45 * k), 0, 1);
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: BEYAZ }} data-screen-label={`${Math.floor(17.5 + lt)}s · Kapanış`}>
      {inY > 0 && <div style={ABS}><CihazV5 lt={1} k={0.1} dyn={false} /></div>}
      <div style={{ ...ABS, background: NAVY, transform: `translateY(${inY * 100}%)` }}>
        <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 170 }}>
          <img src="img/wordmark.png" alt="Evlek" style={{ width: 440, display: 'block', filter: 'invert(1)', opacity: wmO.opacity, transform: `scale(${wmS})` }} />
          <div style={{ marginTop: 56, width: 240, height: 3, background: GOLD, transform: `scaleX(${line})`, transformOrigin: 'left center' }} />
          <div style={{ marginTop: 52, fontFamily: SANS, fontWeight: 500, fontSize: 40, color: 'rgba(255,255,255,.85)', ...tag }}>Kıbrıs'ta doğru ev.</div>
          <div style={{ marginTop: 60, ...cta }}>
            <div style={{ position: 'relative', overflow: 'hidden', minWidth: 400, height: 90, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: KREM, color: NAVY, fontFamily: SANS, fontWeight: 700, fontSize: 30, borderRadius: 999, padding: '0 56px' }}>
              Evlek.app'te ara
              {swp > 0 && swp < 1 && (
                <div style={{ ...ABS, background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,.5) 50%, transparent 68%)', transform: `translateX(${lerp(-100, 100, swp)}%)` }} />
              )}
            </div>
          </div>
          <div style={{ marginTop: 54, fontFamily: SANS, fontWeight: 500, fontSize: 27, color: 'rgba(255,255,255,.55)', ...dst }}>Web · iOS · Android · 5 dil</div>
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
        {{ 'Karmaşa': SceneKarmasa, 'Problem': SceneProblem, 'Dönüşüm': SceneDonusum, 'Arama': SceneArama, 'Sonuçlar': SceneSonuc, 'Okuma': SceneOkuma, 'Sanal Düzenleme': SceneStaging, 'Piyasa': ScenePiyasa, 'Cihazlar': SceneCihaz, 'Kapanış': SceneKapanis }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
