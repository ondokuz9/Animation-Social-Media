/* Evlek tanıtım reel v2 — 1080×1920 · 19 sn. Her kare t'nin saf fonksiyonu (useScene localTime). */
const { SceneStage, useScene, clamp } = window;

const KREM = '#F4F1EB', NAVY = '#14213D', KOBALT = '#2F5CFF';
const MONO = "'JetBrains Mono',ui-monospace,monospace";
const BASLIK = "'Hanken Grotesk',system-ui,sans-serif";
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const ABS = { position: 'absolute', inset: 0 };

/* Yaylı giriş: a→peak (ilk %62) → b (kalan) */
function popVal(x, a, peak, b) {
  if (x <= 0) return a; if (x >= 1) return b;
  if (x < 0.62) return a + (peak - a) * EASE(x / 0.62);
  return peak + (b - peak) * EASE((x - 0.62) / 0.38);
}
const popOp = (x) => x <= 0 ? 0 : Math.min(1, x / 0.35);
function popRise(lt, t0, d, dist = 24) {
  const x = clamp((lt - t0) / d, 0, 1);
  return { opacity: popOp(x), transform: `translateY(${popVal(x, dist, -4, 0)}px)` };
}
function popScale(lt, t0, d, from = 0.92, peak = 1.05) {
  const x = clamp((lt - t0) / d, 0, 1);
  return { opacity: popOp(x), transform: `scale(${popVal(x, from, peak, 1)})` };
}
const pulse = (lt, t0, d, amt = 0.03) => { const p = clamp((lt - t0) / d, 0, 1); return (p <= 0 || p >= 1) ? 1 : 1 + amt * Math.sin(Math.PI * p); };

const ROOMS = ['img/room-00-bos.jpg', 'img/room-01-akdeniz.jpg', 'img/room-02-minimal.jpg', 'img/room-03-dogal.jpg'];
const Q = "Girne'de deniz gören, Türk koçanlı 2+1";
const COMMA = Q.indexOf(',');
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='240' height='240' filter='url(%23g)'/></svg>")`;
const monoUp = { fontFamily: MONO, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase' };

/* Navy zemin: blur oda + %88 navy + radyal ışık + grain */
function NavyBase() {
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <img src="img/room-03-dogal.jpg" alt="" style={{ ...ABS, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)', filter: 'blur(28px)' }} />
      <div style={{ ...ABS, background: 'rgba(20,33,61,.88)' }} />
      <div style={{ ...ABS, background: 'radial-gradient(120% 62% at 50% 0%, rgba(27,43,82,.85) 0%, rgba(27,43,82,0) 58%)' }} />
      <div style={{ ...ABS, backgroundImage: GRAIN, opacity: 0.04, mixBlendMode: 'overlay' }} />
    </div>
  );
}

/* ---------- A · Dönüşüm kancası (B ilk karesi için settled de çağrılır) ---------- */
const CHIPS = [{ t: 'AKDENİZ', at: 1.3 }, { t: 'MİNİMALİST', at: 2.0 }, { t: 'DOĞAL', at: 3.1 }];
function roomFrame(lt, dur) {
  const k = dur / 4.2;
  const p = clamp(lt / dur, 0, 1);
  const W = [0.9, 2.0, 3.1].map((s) => s * k);
  const wlen = 0.2 * k, pd = 0.35 * k;
  const imgs = ROOMS.map((src, i) => {
    const st = { ...ABS, width: '100%', height: '100%', objectFit: 'cover' };
    if (i > 0) {
      const wp = clamp((lt - W[i - 1]) / wlen, 0, 1);
      if (wp <= 0) st.opacity = 0;
      else if (wp < 1) {
        const y = wp * 1980 - 30;
        const m = `linear-gradient(180deg,#000 ${y - 30}px,rgba(0,0,0,0) ${y + 30}px)`;
        st.WebkitMaskImage = m; st.maskImage = m;
      }
    }
    return <img key={i} src={src} alt="" style={st} />;
  });
  const w1 = popRise(lt, W[0], pd), w2 = popRise(lt, 1.15 * k, pd);
  const roz = popRise(lt, 1.1 * k, pd, 18);
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <div style={{ ...ABS, transform: `scale(${1 + 0.08 * p})`, transformOrigin: '72% 40%' }}>{imgs}</div>
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(11,18,32,.42) 0%,rgba(11,18,32,0) 22%,rgba(11,18,32,0) 62%,rgba(11,18,32,.6) 100%)' }} />
      <div style={{ position: 'absolute', left: 140, bottom: 470, display: 'flex', gap: 22, fontFamily: BASLIK, fontWeight: 800, fontSize: 84, letterSpacing: '-0.02em', lineHeight: 1, color: KREM }}>
        <span style={{ display: 'inline-block', ...w1 }}>Bu oda</span>
        <span style={{ display: 'inline-block', ...w2 }}>boştu.</span>
      </div>
      <div style={{ position: 'absolute', left: 140, bottom: 360, height: 58 }}>
        {CHIPS.map((c, i) => {
          const ent = popScale(lt, c.at * k, pd);
          const out = i < 2 ? 1 - clamp((lt - CHIPS[i + 1].at * k) / (0.15 * k), 0, 1) : 1;
          const o = ent.opacity * out;
          return o <= 0 ? null : (
            <span key={i} style={{ position: 'absolute', left: 0, bottom: 0, whiteSpace: 'nowrap', ...monoUp, letterSpacing: '.08em', fontSize: 28, color: '#fff', background: 'rgba(11,18,32,.55)', padding: '12px 22px', borderRadius: 999, opacity: o, transform: ent.transform }}>{c.t}</span>
          );
        })}
      </div>
      <div style={{ position: 'absolute', right: 140, bottom: 360, ...roz }}>
        <span className="rozet" style={{ fontSize: 28 }}>YZ İLE DÜZENLENDİ · TEMSİLÎ</span>
      </div>
    </div>
  );
}
function SceneA() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  return <div style={ABS} data-screen-label={`${Math.floor(lt)}s · Dönüşüm kancası`}>{roomFrame(lt, dur)}</div>;
}

/* ---------- B başlığı (C ilk karesi için de) ---------- */
const HL_TOP = 810, HL_LINES = [
  { t: 'Kuzey Kıbrıs\u2019ta', c: KREM, at: 0.3 },
  { t: 'ev aramak', c: KREM, at: 0.7 },
  { t: 'değişti.', c: KOBALT, at: 1.1 },
];
function Headline({ lt, k, dyn, shrink }) {
  const hp = shrink ? EASE(lt / (0.45 * k)) : 0;
  return (
    <div style={{ position: 'absolute', left: 140, top: HL_TOP + (220 - HL_TOP) * hp, transform: `scale(${1 - 0.6 * hp})`, transformOrigin: 'left top' }}>
      {HL_LINES.map((L, i) => {
        const st = dyn ? (i === 2 ? popScale(lt, L.at * k, 0.35 * k, 0.94, 1.06) : popRise(lt, L.at * k, 0.35 * k)) : { opacity: 1 };
        return <div key={i} style={{ fontFamily: BASLIK, fontWeight: 800, fontSize: 96, lineHeight: 1.04, letterSpacing: '-0.02em', color: L.c, ...st, transformOrigin: 'left center' }}>{L.t}</div>;
      })}
    </div>
  );
}
function SceneB() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.2;
  const q = EASE(lt / (0.159 * dur));
  const clip = q >= 1 ? undefined : `polygon(0% 100%, 0% ${100 - 220 * q}%, ${220 * q}% 100%)`;
  const alt = popRise(lt, 1.6 * k, 0.35 * k, 16);
  return (
    <div style={ABS} data-screen-label={`${Math.floor(4.2 + lt)}s · Kırılma`}>
      {roomFrame(4.2, 4.2)}
      <div style={{ ...ABS, clipPath: clip, WebkitClipPath: clip }}><NavyBase /></div>
      <Headline lt={lt} k={k} dyn={true} shrink={false} />
      <div style={{ position: 'absolute', left: 140, top: 1210, ...monoUp, fontSize: 30, color: 'rgba(244,241,235,.78)', ...alt }}>Sorular artık yapay zekâya soruluyor.</div>
    </div>
  );
}

/* ---------- Soru satırı ---------- */
function typedCount(lt, t0, span) {
  const pauseT = 0.15 * (span / 1.8), step = (span - pauseT) / (Q.length - 1);
  const time = lt - t0;
  if (time <= 0) return 0;
  let n = 0;
  for (let i = 0; i < Q.length; i++) { if (i * step + (i > COMMA ? pauseT : 0) <= time) n = i + 1; else break; }
  return n;
}
function Query({ n, curOp }) {
  return (
    <div style={{ position: 'absolute', left: 140, top: 430, width: 800, fontFamily: MONO, fontWeight: 500, fontSize: 52, lineHeight: 1.5, color: KREM }}>
      {Q.slice(0, n)}
      <span style={{ display: 'inline-block', width: 26, height: 52, marginLeft: 10, verticalAlign: '-8px', background: KREM, opacity: curOp }} />
    </div>
  );
}
function SceneC() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 2.8;
  const n = typedCount(lt, 0.2 * k, 1.8 * k);
  const done = n >= Q.length;
  let curOp = popOp(clamp(lt / (0.2 * k), 0, 1));
  if (done) {
    const bl = lt < 2.55 * k ? (Math.floor((lt - 2.0 * k) * 3) % 2 === 0 ? 1 : 0.15) : 1; // sona doğru sabitlenir
    curOp = bl;
  }
  const altOut = { opacity: 1 - EASE(lt / (0.3 * k)) };
  return (
    <div style={ABS} data-screen-label={`${Math.floor(6.4 + lt)}s · Soru`}>
      <NavyBase />
      <Headline lt={lt} k={k} dyn={false} shrink={true} />
      <div style={{ position: 'absolute', left: 140, top: 1210, ...monoUp, fontSize: 30, color: 'rgba(244,241,235,.78)', ...altOut }}>Sorular artık yapay zekâya soruluyor.</div>
      <Query n={n} curOp={curOp} />
    </div>
  );
}

/* ---------- D · Cevap + kanıt (E ilk karesi için settled de çağrılır) ---------- */
const GRID = ['KOÇAN', 'FİYAT GEÇMİŞİ', 'ONAYLI EMLAKÇI', '5 DİL'];
function DContent({ lt, k }) {
  const card = popRise(lt, 0.001, 0.4 * k, 40);
  const pl = pulse(lt, 1.6 * k, 0.4 * k);
  const lines = [['92%', 0.3], ['76%', 0.65], ['54%', 1.0]];
  const srcLine = EASE(clamp((lt - 1.6 * k) / (0.2 * k), 0, 1));
  const srcTxt = popRise(lt, 1.65 * k, 0.3 * k, 12);
  const ust = popRise(lt, 2.4 * k, 0.35 * k, 16);
  const her = popRise(lt, 2.9 * k, 0.35 * k, 14);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', left: 140, top: 640, ...monoUp, fontSize: 34, color: 'rgba(244,241,235,.9)', ...ust }}>CEVABIN KAYNAĞI ÖNEMLİ.</div>
      <div style={{ position: 'absolute', left: 140, top: 710, width: 800, opacity: card.opacity, transform: `${card.transform} scale(${pl})`, transformOrigin: 'center' }}>
        <div style={{ background: KREM, borderRadius: 24, padding: 56, display: 'flex', flexDirection: 'column', gap: 28, boxShadow: '0 24px 64px rgba(11,18,32,.35)' }}>
          {lines.map(([w, at], i) => (
            <div key={i} style={{ height: 24, width: `calc(${w} * ${EASE(clamp((lt - at * k) / (0.35 * k), 0, 1))})`, background: 'rgba(20,33,61,.16)', borderRadius: 6 }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 972, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 52 * srcLine, height: 3, background: KOBALT }} />
        <div style={{ ...monoUp, fontSize: 30, color: 'rgba(244,241,235,.85)', ...srcTxt }}>KAYNAK: EVLEK.APP</div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 1062, fontFamily: BASLIK, fontWeight: 800, fontSize: 44, letterSpacing: '-0.01em', color: KREM, ...her }}>Her ilanda:</div>
      <div style={{ position: 'absolute', left: 140, top: 1140, width: 800, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {GRID.map((g, i) => {
          const st = popScale(lt, (3.0 + i * 0.3) * k, 0.3 * k, 0.9, 1.06);
          return (
            <div key={i} style={{ height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${KOBALT}`, borderRadius: 14, background: 'rgba(11,18,32,.35)', ...monoUp, fontSize: 28, color: KREM, ...st }}>{g}</div>
          );
        })}
      </div>
    </React.Fragment>
  );
}
function NavyFull({ lt, k, curOp }) {
  return (
    <React.Fragment>
      <NavyBase />
      <Headline lt={1} k={1} dyn={false} shrink={true} />
      <Query n={Q.length} curOp={curOp} />
      <DContent lt={lt} k={k} />
    </React.Fragment>
  );
}
function SceneD() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 5;
  const curOp = 1 - EASE(lt / (0.3 * k));
  return (
    <div style={ABS} data-screen-label={`${Math.floor(9.2 + lt)}s · Cevap + kanıt`}>
      <NavyFull lt={lt} k={k} curOp={curOp} />
    </div>
  );
}

/* ---------- E · Kapanış ---------- */
const WAVE_ON = 'M0,170 C170,80 360,210 545,140 C735,70 925,195 1080,120 L1080,440 L0,440 Z';
const WAVE_ARKA = 'M0,120 C200,210 410,75 620,155 C820,225 950,95 1080,165 L1080,440 L0,440 Z';
function SceneE() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const k = dur / 4.8;
  const lift = EASE(lt / (0.4 * k));
  const rB = EASE(clamp((lt - 0.3 * k) / (0.7 * k), 0, 1));
  const rF = EASE(clamp((lt - 0.45 * k) / (0.7 * k), 0, 1));
  const env = Math.min(rF, 1 - EASE((lt - 3.4 * k) / (0.4 * k)));   // 18.0'da tamamen durur
  const swayB = env * 6 * Math.sin(lt * 2.0);
  const swayF = env * 6 * Math.sin(lt * 2.0 + 1.9);
  const wm = popRise(lt, 0.8 * k, 0.4 * k, -28);
  const tag = popRise(lt, 1.4 * k, 0.35 * k, 18);
  const cta = popRise(lt, 2.2 * k, 0.35 * k, 16);
  const arrow = env <= 0 ? 0 : Math.min(env, clamp((lt - 2.6 * k) / (0.3 * k), 0, 1)) * 4 * Math.sin(lt * 3.1);
  return (
    <div style={{ ...ABS, background: KREM, overflow: 'hidden' }} data-screen-label={`${Math.floor(14.2 + lt)}s · Kapanış`}>
      <img src="img/wordmark.png" alt="Evlek" style={{ position: 'absolute', left: 280, top: 726, width: 520, ...wm }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', fontFamily: BASLIK, fontStyle: 'italic', fontWeight: 400, fontSize: 44, color: 'rgba(20,33,61,.7)', ...tag }}>Yeni çağa göre kurulmuş.</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1044, display: 'flex', justifyContent: 'center', ...cta }}>
        <div style={{ ...monoUp, fontSize: 32, color: KOBALT, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span>ARAMAYA BAŞLA</span>
          <span style={{ display: 'inline-block', transform: `translateX(${arrow}px)` }}>→</span>
          <span>EVLEK.APP</span>
        </div>
      </div>
      <svg width="1080" height="440" viewBox="0 0 1080 440" style={{ position: 'absolute', left: 0, bottom: 0, display: 'block', transform: `translateY(${(1 - rB) * 484 + swayB}px)` }}>
        <path d={WAVE_ARKA} fill={NAVY} fillOpacity="0.1" />
      </svg>
      <svg width="1080" height="440" viewBox="0 0 1080 440" style={{ position: 'absolute', left: 0, bottom: 0, display: 'block', transform: `translateY(${(1 - rF) * 462 + swayF}px)` }}>
        <path d={WAVE_ON} fill={NAVY} />
      </svg>
      <div style={{ ...ABS, transform: `translateY(${-lift * 100}%)`, overflow: 'hidden' }}>
        <NavyFull lt={5} k={1} curOp={0} />
      </div>
    </div>
  );
}

function EvlekReel() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SceneStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={NAVY}>
        {{ 'Dönüşüm Kancası': SceneA, 'Kırılma': SceneB, 'Soru': SceneC, 'Cevap + Kanıt': SceneD, 'Kapanış': SceneE }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
