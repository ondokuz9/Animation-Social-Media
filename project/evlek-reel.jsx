/* Evlek tanıtım reel — 1080×1920 · 20 sn. Her kare t'nin saf fonksiyonu (useScene localTime). */
const { SceneStage, useScene, clamp } = window;

const KREM = '#F4F1EB', NAVY = '#14213D', KOBALT = '#2F5CFF', MUREKKEP = '#0B1220';
const MONO = "'JetBrains Mono',ui-monospace,monospace";
const BASLIK = "'Hanken Grotesk',system-ui,sans-serif";
const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* cubic-bezier(0.22,1,0.36,1) yaklaşığı */
const EASE = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const MOTION = {
  enter(lt, t0, d, dist = 20) { const p = EASE((lt - t0) / d); return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` }; },
  wipe(lt, t0, d) { return clamp((lt - t0) / d, 0, 1); },
  pulse(lt, t0, d, amt = 0.03) { const p = clamp((lt - t0) / d, 0, 1); return (p <= 0 || p >= 1) ? 1 : 1 + amt * Math.sin(Math.PI * p); },
  breath(p) { return `scale(${1 + 0.012 * Math.sin(Math.PI * clamp(p, 0, 1))})`; },
};
const SETTLED = { opacity: 1, transform: 'translateY(0px)' };
const ABS = { position: 'absolute', inset: 0 };

const ROOMS = ['img/room-00-bos.jpg', 'img/room-01-akdeniz.jpg', 'img/room-02-minimal.jpg', 'img/room-03-dogal.jpg'];
const STYLES = ['AKDENİZ', 'MİNİMALİST', 'DOĞAL'];
const Q = "Girne'de deniz gören, Türk koçanlı 2+1";

const monoEtiket = { fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '.16em', textTransform: 'uppercase' };

/* ---------- A · Oda dönüşümü (B'nin arka planı için de settled halde çağrılır) ---------- */
function roomFrame(lt, dur) {
  const p = clamp(lt / dur, 0, 1);
  const scale = 1 + 0.07 * p;
  const W = [0.28, 0.52, 0.76].map((f) => f * dur);
  const wlen = 0.05 * dur;
  const imgs = ROOMS.map((src, i) => {
    const st = { ...ABS, width: '100%', height: '100%', objectFit: 'cover' };
    if (i > 0) {
      const wp = MOTION.wipe(lt, W[i - 1], wlen);
      if (wp <= 0) st.opacity = 0;
      else if (wp < 1) {
        const y = wp * 1980 - 30;
        const m = `linear-gradient(180deg,#000 ${y - 30}px,rgba(0,0,0,0) ${y + 30}px)`;
        st.WebkitMaskImage = m; st.maskImage = m;
      }
    }
    return <img key={i} src={src} alt="" style={st} />;
  });
  const labelSt = MOTION.enter(lt, 0.06 * dur, 0.08 * dur, 14);
  const badgeSt = MOTION.enter(lt, W[0], 0.06 * dur, 12);
  return (
    <div style={{ ...ABS, overflow: 'hidden', background: NAVY }}>
      <div style={{ ...ABS, transform: `scale(${scale})`, transformOrigin: '72% 40%' }}>{imgs}</div>
      <div style={{ ...ABS, background: 'linear-gradient(180deg,rgba(11,18,32,.5) 0%,rgba(11,18,32,0) 24%,rgba(11,18,32,0) 70%,rgba(11,18,32,.55) 100%)' }} />
      <div style={{ position: 'absolute', left: 96, top: 96, display: 'flex', alignItems: 'center', gap: 20, ...labelSt }}>
        <div style={{ width: 64, height: 3, background: KOBALT }} />
        <div style={{ ...monoEtiket, color: 'rgba(244,241,235,.85)' }}>BU ODA BOŞTU</div>
      </div>
      <div style={{ position: 'absolute', right: 96, bottom: 92, ...badgeSt }}>
        <span className="rozet">YZ İLE DÜZENLENDİ · TEMSİLÎ</span>
      </div>
      <div style={{ position: 'absolute', left: 96, bottom: 100, height: 34 }}>
        {STYLES.map((s, k) => {
          const start = W[k], end = k < 2 ? W[k + 1] : Infinity;
          const o = Math.min(EASE((lt - start) / wlen), 1 - EASE((lt - end) / wlen));
          return o <= 0 ? null : (
            <div key={k} style={{ position: 'absolute', left: 0, bottom: 0, whiteSpace: 'nowrap', ...monoEtiket, color: KREM, opacity: o }}>{s}</div>
          );
        })}
      </div>
    </div>
  );
}

function SceneA() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  return <div style={ABS} data-screen-label={`${Math.floor(lt)}s · Oda dönüşümü`}>{roomFrame(lt, dur)}</div>;
}

/* ---------- B içeriği (C'nin ilk karesi için de kullanılır) ---------- */
function BContent({ lt, dur, dyn }) {
  const h = dyn ? MOTION.enter(lt, 0.192 * dur, 0.19 * dur, 24) : SETTLED;
  const items = ['İNCELENMİŞ İLANLAR', '6 ŞEHİR', '5 DİL'];
  return (
    <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 72, padding: '0 96px' }}>
      <div style={{ ...h, fontFamily: BASLIK, fontWeight: 800, fontSize: 88, lineHeight: 1.05, letterSpacing: '-0.02em', color: KREM, textAlign: 'center' }}>
        Kuzey Kıbrıs'ta<br />ev aramak <span style={{ color: KOBALT }}>değişti.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        {items.map((s, i) => {
          const st = dyn ? MOTION.enter(lt, (0.308 + i * 0.058) * dur, 0.15 * dur, 14) : SETTLED;
          return (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'rgba(244,241,235,.5)', fontFamily: MONO, fontSize: 26, opacity: st.opacity }}>·</span>}
              <span style={{ display: 'inline-block', ...monoEtiket, fontSize: 24, color: 'rgba(244,241,235,.78)', ...st }}>{s}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function SceneB() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const p = clamp(lt / dur, 0, 1);
  const rise = EASE(lt / (0.154 * dur));
  return (
    <div style={ABS} data-screen-label={`${Math.floor(5 + lt)}s · Yeni çağ`}>
      {roomFrame(5, 5)}
      <div style={{ ...ABS, background: NAVY, transform: `translateY(${(1 - rise) * 100}%)`, overflow: 'hidden' }}>
        <div style={{ ...ABS, transform: MOTION.breath(p) }}>
          <BContent lt={lt} dur={dur} dyn={true} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Soru + cevap kartı kompozisyonu (C, D, E, F ortak) ---------- */
const LABELS = [
  { t: 'KOÇAN', pos: { top: -30, left: -38 } },
  { t: 'FİYAT GEÇMİŞİ', pos: { top: -30, right: -38 } },
  { t: 'ONAYLI EMLAKÇI', pos: { bottom: -30, left: -38 } },
  { t: '5 DİL', pos: { bottom: -30, right: -38 } },
];
function QAC({ typed, curOp, cardSt, srcSt, pulse, labelTs }) {
  const line = (w) => <div style={{ height: 24, width: w, background: 'rgba(20,33,61,.16)', borderRadius: 6 }} />;
  return (
    <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 110px' }}>
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 44, lineHeight: 1.5, color: KREM, textAlign: 'center', maxWidth: 860 }}>
          {typed}
          <span style={{ display: 'inline-block', width: 22, height: 44, marginLeft: 8, verticalAlign: '-7px', background: KREM, opacity: curOp }} />
        </div>
      </div>
      <div style={{ height: 64 }} />
      <div style={{ position: 'relative', opacity: cardSt.opacity, transform: `${cardSt.transform} scale(${pulse})` }}>
        <div style={{ width: 760, background: KREM, borderRadius: 24, padding: '64px', display: 'flex', flexDirection: 'column', gap: 30, boxShadow: '0 24px 64px rgba(0,0,0,.28)' }}>
          {line('92%')}{line('76%')}{line('54%')}
        </div>
        {LABELS.map((L, i) => {
          const e = EASE(labelTs[i]);
          return e <= 0 ? null : (
            <div key={i} style={{ position: 'absolute', ...L.pos, opacity: e, transform: `translateY(${(1 - e) * 12}px)`, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: '.12em', color: KREM, background: NAVY, border: `2px solid ${KOBALT}`, borderRadius: 999, padding: '12px 24px', whiteSpace: 'nowrap' }}>{L.t}</div>
          );
        })}
      </div>
      <div style={{ height: 36 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...srcSt }}>
        <div style={{ width: 52, height: 3, background: KOBALT }} />
        <div style={{ ...monoEtiket, fontSize: 24, color: 'rgba(244,241,235,.8)' }}>KAYNAK: EVLEK.APP</div>
      </div>
    </div>
  );
}
function navyRoot(p, label, children) {
  return (
    <div style={{ ...ABS, background: NAVY, overflow: 'hidden' }} data-screen-label={label}>
      <div style={{ ...ABS, transform: MOTION.breath(p) }}>{children}</div>
    </div>
  );
}

function SceneC() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const p = clamp(lt / dur, 0, 1);
  const out = 1 - EASE(lt / (0.071 * dur));            // B içeriği 0.2 sn'de çıkar
  const typT0 = 0.071 * dur, typD = 0.571 * dur;        // 0.2–1.8
  const typP = clamp((lt - typT0) / typD, 0, 1);
  const n = Math.floor(typP * Q.length);
  const cardT0 = 0.714 * dur, cardD = 0.143 * dur;      // 2.0–2.4
  const cardSt = MOTION.enter(lt, cardT0, cardD, 20);
  let curOp = EASE(lt / (0.05 * dur));                  // giriş
  if (typP >= 1) curOp *= Math.floor(lt * 2.4) % 2 === 0 ? 1 : 0.15;  // bekleme yanıp sönme
  curOp *= 1 - EASE((lt - cardT0) / cardD);             // kart gelince söner
  return navyRoot(p, `${Math.floor(7.6 + lt)}s · Soru`, (
    <React.Fragment>
      {out > 0 && <div style={{ ...ABS, opacity: out }}><BContent lt={dur} dur={dur} dyn={false} /></div>}
      <QAC typed={Q.slice(0, n)} curOp={curOp} cardSt={cardSt} srcSt={{ opacity: 0 }} pulse={1} labelTs={[0, 0, 0, 0]} />
    </React.Fragment>
  ));
}

function SceneD() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const p = clamp(lt / dur, 0, 1);
  const srcSt = MOTION.enter(lt, 0.222 * dur, 0.1 * dur, 14);   // 0.8'de kaynak satırı
  const pulse = MOTION.pulse(lt, 0.222 * dur, 0.111 * dur, 0.03);
  return navyRoot(p, `${Math.floor(10.4 + lt)}s · Kaynak`,
    <QAC typed={Q} curOp={0} cardSt={SETTLED} srcSt={srcSt} pulse={pulse} labelTs={[0, 0, 0, 0]} />);
}

function SceneE() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const p = clamp(lt / dur, 0, 1);
  const labelTs = LABELS.map((_, i) => clamp((lt - (0.1 + i * 0.0833) * dur) / (0.117 * dur), 0, 1));
  return navyRoot(p, `${Math.floor(14 + lt)}s · Veri katmanı`,
    <QAC typed={Q} curOp={0} cardSt={SETTLED} srcSt={SETTLED} pulse={1} labelTs={labelTs} />);
}

/* ---------- F · Kapanış ---------- */
const WAVE_ON = 'M0,150 C170,70 360,190 545,125 C735,60 925,175 1080,105 L1080,360 L0,360 Z';
const WAVE_ARKA = 'M0,110 C200,190 410,65 620,140 C820,205 950,85 1080,150 L1080,360 L0,360 Z';
function SceneF() {
  const { localTime, dur } = useScene();
  const lt = REDUCED ? dur : localTime;
  const lift = EASE(lt / (0.167 * dur));                                  // navy yukarı çekilir (0.5 sn)
  const wArka = EASE(clamp((lt - 0.067 * dur) / (0.3 * dur), 0, 1));      // 0.2–1.1
  const wOn = EASE(clamp((lt - 0.117 * dur) / (0.3 * dur), 0, 1));        // 0.35–1.25
  const wmSt = MOTION.enter(lt, 0.2 * dur, 0.267 * dur, 22);              // 0.6–1.4
  const tagSt = MOTION.enter(lt, 0.3 * dur, 0.233 * dur, 16);             // 0.9–1.6
  const ftSt = MOTION.enter(lt, 0.4 * dur, 0.2 * dur, 10);                // 1.2–1.8
  return (
    <div style={{ ...ABS, background: KREM, overflow: 'hidden' }} data-screen-label={`${Math.floor(17 + lt)}s · Kapanış`}>
      <div style={{ ...ABS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, paddingBottom: 160 }}>
        <img src="img/wordmark.png" alt="Evlek" style={{ width: 420, display: 'block', ...wmSt }} />
        <div style={{ ...tagSt, fontFamily: BASLIK, fontStyle: 'italic', fontWeight: 400, fontSize: 40, color: 'rgba(20,33,61,.7)' }}>Yeni çağa göre kurulmuş.</div>
      </div>
      <svg width="1080" height="360" viewBox="0 0 1080 360" style={{ position: 'absolute', left: 0, bottom: 0, display: 'block', transform: `translateY(${(1 - wArka) * 110}%)` }}>
        <path d={WAVE_ARKA} fill={NAVY} fillOpacity="0.1" />
      </svg>
      <svg width="1080" height="360" viewBox="0 0 1080 360" style={{ position: 'absolute', left: 0, bottom: 0, display: 'block', transform: `translateY(${(1 - wOn) * 105}%)` }}>
        <path d={WAVE_ON} fill={NAVY} />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 72, display: 'flex', justifyContent: 'center', ...ftSt }}>
        <div style={{ ...monoEtiket, color: KREM }}>evlek.app</div>
      </div>
      <div style={{ ...ABS, background: NAVY, transform: `translateY(${-lift * 100}%)`, overflow: 'hidden' }}>
        <QAC typed={Q} curOp={0} cardSt={SETTLED} srcSt={SETTLED} pulse={1} labelTs={[1, 1, 1, 1]} />
      </div>
    </div>
  );
}

function EvlekReel() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SceneStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={NAVY}>
        {{ 'Oda Dönüşümü': SceneA, 'Yeni Çağ': SceneB, 'Soru': SceneC, 'Kaynak': SceneD, 'Veri Katmanı': SceneE, 'Kapanış': SceneF }}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Zaman çizelgesi" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.EvlekReel = EvlekReel;
