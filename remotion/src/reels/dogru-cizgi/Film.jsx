import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SANS, MONO } from '../../brand/tokens.js';
import { W, H, LOCKUP, lockupScale, WORDMARK_PATHS, WORDMARK_VIEWBOX, LINE_Y } from './engine/shapes.js';
import { stateAt, FRAMES, T, HERO_Y, PILL_Y, TEXT_X, HERO_SIZE, COPY_SIZE, CHAPTERS, HUD_END, textWidth } from './engine/timeline.js';
import { drawFrame } from './engine/render.js';
import { ease, clamp, lerp } from './engine/math.js';

export const DOGRU_FRAMES = FRAMES;

const INKT = (a) => `rgba(236,244,252,${a})`;
const GOLD = (a) => `rgba(226,194,132,${a})`;   // Champagne #C9A157, lifted for type on navy
const OK = (a) => `rgba(96,206,150,${a})`;      // Success #2D8B5C, lifted: the verified mark


/* ── The lockup: the name stands on its gold line. ─────────────────────────── */
const Lockup = ({ rise, slogan, url, glint }) => {
  const w = LOCKUP.width, h = WORDMARK_VIEWBOX[3] * lockupScale;
  const top = LOCKUP.cy - h / 2;
  const box = LINE_Y - 14;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, width: W, top: box - 260, height: 260, overflow: 'hidden' }}>
        <svg viewBox={WORDMARK_VIEWBOX.join(' ')} width={w} height={h}
             style={{ position: 'absolute', left: LOCKUP.cx - w / 2, top: top - (box - 260), transform: `translateY(${(1 - rise) * 250}px)` }}>
          {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill="#FFFFFF" />)}
        </svg>
      </div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LINE_Y + 40 + (1 - slogan) * 14, textAlign: 'center',
        fontFamily: SANS, fontWeight: 500, fontSize: 54, letterSpacing: '-0.01em', color: INKT(slogan),
      }}>
        Kıbrıs'ta <span style={{ color: GOLD(slogan), textShadow: glint > 0.01 ? `0 0 ${24 * glint}px rgba(236,204,142,${0.8 * glint})` : 'none' }}>doğru</span> ev.
      </div>
      <div style={{
        position: 'absolute', left: 0, width: W, top: LINE_Y + 150 + (1 - url) * 12, textAlign: 'center',
        fontFamily: SANS, fontWeight: 600, fontSize: 58, letterSpacing: '0.01em', color: INKT(url),
      }}>evlek.app</div>
    </>
  );
};

/* Words standing on a line and rising out of it, one letter at a time. */
const Rising = ({ parts, rise, sink, size, weight, tracking, y, stagger = 2.2, left = null }) => {
  const chars = parts.flatMap(({ t, gold }) => [...t].map((ch) => ({ ch, gold })));
  const n = chars.length;
  return (
    <div style={{ position: 'absolute', left: left ?? 0, width: left != null ? W - left : W, top: y - size * 1.3, height: size * 1.3 - 12, overflow: 'hidden', display: 'flex', justifyContent: left != null ? 'flex-start' : 'center', alignItems: 'flex-end' }}>
      {chars.map(({ ch, gold }, i) => {
        const k = stagger / 22;
        const pi = ease.settle(clamp(rise * (1 + (n - 1) * k) - i * k));
        const po = ease.launch(clamp(sink * (1 + (n - 1) * k) - (n - 1 - i) * k));
        const dy = (1 - pi) * size * 1.15 + po * size * 1.15;
        return (
          <span key={i} style={{
            display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${dy}px)`,
            fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: tracking,
            color: gold ? GOLD(1) : INKT(0.98), paddingBottom: size * 0.1,
          }}>{ch}</span>
        );
      })}
    </div>
  );
};

/* "Hangisi doğru?" — at the snap the question falls away and "doğru" stays
   on the straightened line, then rides it up to the horizon. */
const Pun = ({ p }) => {
  const size = 96;
  const wH = textWidth('Hangisi ', size) - 16, wD = textWidth('doğru', size) - 6, wQ = textWidth('?', size);
  const start = W / 2 - (wH + wD + wQ) / 2;          // the whole question, centred
  const dLeft = lerp(start + wH, W / 2 - wD / 2, p.center);
  const top = p.y - size * 1.3;
  const piece = (text, left, rise, drop, gold) => {
    const dy = (1 - ease.settle(rise)) * size * 1.15 + ease.launch(drop) * size * 1.15;
    return (
      <div style={{ position: 'absolute', left, top, height: size * 1.3 - 12, overflow: 'hidden' }}>
        <div style={{ transform: `translateY(${dy + size * 0.2}px)`, fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1, whiteSpace: 'pre', color: gold, paddingBottom: size * 0.12 }}>{text}</div>
      </div>
    );
  };
  return (
    <>
      {piece('Hangisi', dLeft - wH, p.rise, p.drop, INKT(0.98))}
      {piece('doğru', dLeft, p.rise, p.sink, `rgba(${Math.round(lerp(236, 236, p.gold))},${Math.round(lerp(244, 204, p.gold))},${Math.round(lerp(252, 142, p.gold))},1)`)}
      {piece('?', dLeft + wD - 2, p.rise, p.drop, INKT(0.98))}
    </>
  );
};

/* The search field. The brand sits in it where a lens would be. */
const QUERY = 'Girne · deniz manzarası';
const Pill = ({ p }) => {
  const pw = 820, ph = 104, x = (W - pw) / 2, y = PILL_Y;
  const per = 2 * (pw + ph);
  const n = Math.round(QUERY.length * p.typed);
  const lw = 104, lh = (WORDMARK_VIEWBOX[3] / WORDMARK_VIEWBOX[2]) * lw;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: pw, height: ph, opacity: p.a }}>
      <svg width={pw} height={ph} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <rect x={1.5} y={1.5} width={pw - 3} height={ph - 3} rx={(ph - 3) / 2} fill="rgba(6,20,38,0.78)" stroke={INKT(0.9)} strokeWidth={2.4}
              strokeDasharray={per} strokeDashoffset={per * (1 - p.draw)} />
        <line x1={170} y1={26} x2={170} y2={ph - 26} stroke={INKT(0.35 * p.draw)} strokeWidth={1.6} />
      </svg>
      <svg viewBox={WORDMARK_VIEWBOX.join(' ')} width={lw} height={lh} style={{ position: 'absolute', left: 42, top: (ph - lh) / 2, opacity: p.draw }}>
        {Object.values(WORDMARK_PATHS).map((d, i) => <path key={i} d={d} fill="#FFFFFF" />)}
      </svg>
      <div style={{ position: 'absolute', left: 196, top: 0, height: ph, display: 'flex', alignItems: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 42, color: INKT(0.97), whiteSpace: 'pre' }}>
        {QUERY.slice(0, n)}
        <span style={{ display: 'inline-block', width: 3, height: 46, marginLeft: 4, background: p.caret ? INKT(0.95) : 'transparent' }} />
      </div>
    </div>
  );
};

/* The chosen listing, named, with the mark that makes it the right one. */
const Popover = ({ p }) => {
  const cw = 880, ch = 232, x = Math.max(60, Math.min(W - 60 - cw, p.x - cw / 2)), y = p.y - 150 - ch;
  const sweepX = lerp(-200, cw + 200, p.sweep);
  return (
    <div style={{ position: 'absolute', left: x, top: y + (1 - p.a) * 20, width: cw, height: ch, opacity: p.a }}>
      <svg width={cw} height={ch + 22} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="sw" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="rgba(236,204,142,0)" />
            <stop offset="0.5" stopColor="rgba(236,204,142,0.16)" />
            <stop offset="1" stopColor="rgba(236,204,142,0)" />
          </linearGradient>
          <clipPath id="card"><rect x={0} y={0} width={cw} height={ch} rx={22} /></clipPath>
        </defs>
        <path d={`M 22 1.5 H ${cw - 22} A 20.5 20.5 0 0 1 ${cw - 1.5} 22 V ${ch - 22} A 20.5 20.5 0 0 1 ${cw - 22} ${ch - 1.5} H ${p.x - x + 18} L ${p.x - x} ${ch + 18} L ${p.x - x - 18} ${ch - 1.5} H 22 A 20.5 20.5 0 0 1 1.5 ${ch - 22} V 22 A 20.5 20.5 0 0 1 22 1.5 Z`}
              fill="rgba(6,20,38,0.86)" stroke={INKT(0.92)} strokeWidth={2.4} />
        <g clipPath="url(#card)"><rect x={sweepX - 120} y={0} width={240} height={ch} fill="url(#sw)" /></g>
        <rect x={22} y={22} width={150} height={ch - 44} rx={12} fill="none" stroke={INKT(0.55)} strokeWidth={2} />
        <path d={`M 56 ${ch - 50} V ${ch / 2 + 4} L 97 ${ch / 2 - 30} L 138 ${ch / 2 + 4} V ${ch - 50} Z M 86 ${ch - 50} V ${ch / 2 + 22} H 108 V ${ch - 50}`} fill="none" stroke={INKT(0.9)} strokeWidth={2.4} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: 200, top: 34, fontFamily: SANS, fontWeight: 600, fontSize: 48, color: INKT(0.98), whiteSpace: 'nowrap' }}>Deniz manzaralı villa</div>
      <div style={{ position: 'absolute', left: 200, top: 126, display: 'flex', alignItems: 'center', gap: 14, fontFamily: SANS, fontWeight: 600, fontSize: 40, color: OK(1), whiteSpace: 'nowrap' }}>
        <svg width={44} height={44}><circle cx={22} cy={22} r={20} fill={OK(0.18)} stroke={OK(1)} strokeWidth={2.4} /><path d="M 12 23 L 19 30 L 32 15" fill="none" stroke={OK(1)} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
        Evlek Onaylı Emlakçı
      </div>
    </div>
  );
};


/* ── Kicker: a mono line above the headline, revealed left to right ──────── */
const Kicker = ({ text, k, y, gold }) => (
  <div style={{ position: 'absolute', left: TEXT_X, top: y - 8, height: 48, width: W - TEXT_X * 2, overflow: 'hidden' }}>
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap',
      clipPath: `inset(0 ${100 - 100 * k}% 0 0)`, transform: `translateX(${(1 - k) * -12}px)`,
      fontFamily: MONO, fontWeight: 500, fontSize: 32, letterSpacing: '0.16em', color: gold ? OK(0.95) : INKT(0.8),
    }}>
      <span style={{ display: 'inline-block', width: 26, height: 2, background: gold ? OK(0.95) : INKT(0.55) }} />
      {text}
    </div>
  </div>
);

/* ── HUD: the page this film is printed on ───────────────────────────────
   Corner marks, the chapter, a progress rule, where we are, and how many
   listings are left — from hundreds to one. */
const pad = (n) => String(n).padStart(3, ' ');
const Hud = ({ h }) => {
  if (!h || h.a <= 0.001) return null;
  const X0 = 58, X1 = W - 58, Y0 = 118, Y1 = 1790, arm = 34;
  const per = arm * 2;
  const corner = (x, y, sx, sy, i) => (
    <path key={i} d={`M ${x} ${y + sy * arm} L ${x} ${y} L ${x + sx * arm} ${y}`} fill="none" stroke={INKT(0.55)} strokeWidth={1.6}
          strokeDasharray={per} strokeDashoffset={per * (1 - h.draw)} />
  );
  const RX0 = TEXT_X, RX1 = W - TEXT_X, RY = 214;
  const px = (f) => RX0 + (RX1 - RX0) * Math.min(1, f / HUD_END);
  const cur = CHAPTERS[h.ci], prev = CHAPTERS[Math.max(0, h.ci - 1)];
  const chap = (c, dy, a) => (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${dy}px)`, opacity: a, whiteSpace: 'nowrap' }}>
      <span style={{ color: INKT(0.95) }}>{c[1]}</span><span style={{ color: INKT(0.4) }}> · </span>{c[2]}
    </div>
  );
  const mono = { fontFamily: MONO, fontWeight: 500, fontVariantNumeric: 'tabular-nums' };
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: h.a }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {corner(X0, Y0, 1, 1, 0)}{corner(X1, Y0, -1, 1, 1)}{corner(X0, Y1, 1, -1, 2)}{corner(X1, Y1, -1, -1, 3)}
        <line x1={RX0} y1={RY} x2={RX0 + (RX1 - RX0) * h.draw} y2={RY} stroke={INKT(0.22)} strokeWidth={1.2} />
        {CHAPTERS.map(([at], i) => <line key={i} x1={px(at)} y1={RY - 6} x2={px(at)} y2={RY + 6} stroke={i <= h.ci ? INKT(0.8) : INKT(0.35)} strokeWidth={1.4} />)}
        {Array.from({ length: 41 }, (_, i) => <line key={`t${i}`} x1={RX0 + ((RX1 - RX0) * i) / 40} y1={RY} x2={RX0 + ((RX1 - RX0) * i) / 40} y2={RY + 3} stroke={INKT(0.2 * h.draw)} strokeWidth={1} />)}
        <line x1={RX0} y1={RY} x2={RX0 + (RX1 - RX0) * h.prog} y2={RY} stroke={INKT(0.85)} strokeWidth={2.4} />
        <path d={`M ${RX0 + (RX1 - RX0) * h.prog - 7} ${RY - 16} L ${RX0 + (RX1 - RX0) * h.prog + 7} ${RY - 16} L ${RX0 + (RX1 - RX0) * h.prog} ${RY - 7} Z`} fill={INKT(0.9)} />
      </svg>
      {CHAPTERS.map(([at, no], i) => (
        <div key={no} style={{ position: 'absolute', left: px(at), top: RY + 12, transform: 'translateX(-50%)', ...mono, fontSize: 15, letterSpacing: '0.1em', color: i <= h.ci ? INKT(0.75) : INKT(0.35) }}>{no}</div>
      ))}
      <div style={{ position: 'absolute', left: RX0, top: 146, height: 30, width: 520, overflow: 'hidden', ...mono, fontSize: 23, letterSpacing: '0.26em', color: INKT(0.82) }}>
        {h.ci > 0 && h.ct < 1 && chap(prev, -30 * h.ct, 1 - h.ct)}
        {chap(cur, 30 * (1 - h.ct), h.ci > 0 ? h.ct : 1)}
      </div>
      <div style={{ position: 'absolute', right: W - RX1, top: 146, textAlign: 'right', ...mono, fontSize: 23, letterSpacing: '0.34em', color: INKT(0.82), marginRight: -8, opacity: 0.7 }}>EVLEK</div>

      {h.n != null && (
        <>
          <div style={{ position: 'absolute', right: W - RX1, top: 1672, textAlign: 'right', ...mono, fontSize: 14, letterSpacing: '0.3em', color: INKT(0.42), opacity: h.countA }}>{h.label}</div>
          <div style={{ position: 'absolute', right: W - RX1, top: 1692, textAlign: 'right', ...mono, fontSize: 46, letterSpacing: '0.02em', color: INKT(0.9), opacity: h.countA, whiteSpace: 'pre' }}>{pad(h.n)}</div>
        </>
      )}
    </div>
  );
};

const TAG_NO = { SALON: '01', MUTFAK: '02', TERAS: '03' };

/* City labels sit beside their pins, never under them. [dx, dy, anchor] */
const CITY_LABEL = {
  'GÜZELYURT': [-18, -58, 'right'], LEFKE: [-14, 16, 'right'], 'LEFKOŞA': [0, 18, 'center'],
  'GAZİMAĞUSA': [22, -18, 'left'], 'İSKELE': [22, -58, 'left'], 'GİRNE': [0, -128, 'center'],
};

export const DogruCizgi = () => {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  const s = useMemo(() => stateAt(frame), [frame]);
  const still = frame < T.hold || frame >= FRAMES - 1;

  useLayoutEffect(() => {
    drawFrame(ref.current.getContext('2d'), stateAt, frame, still, s);
  }, [s, frame, still]);

  const pinLabels = s.pins.filter((p) => p.label > 0.01).map((p) => { const r = s.project(p.p); return r ? { ...p, x: r[0], y: r[1] } : null; }).filter(Boolean);
  const tags = s.tags.map((t) => { const r = s.project(t.p); return r ? { ...t, x: r[0], y: r[1] } : null; }).filter(Boolean);

  return (
    <AbsoluteFill style={{ background: '#0A2540' }}>
      <canvas ref={ref} width={W} height={H} style={{ position: 'absolute', inset: 0 }} />
      {s.scrims.map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: b.y - b.h / 2 - 90, width: W, height: b.h + 180, opacity: b.a, background: 'linear-gradient(180deg, rgba(3,12,24,0) 0%, rgba(3,12,24,0.8) 30%, rgba(3,12,24,0.8) 70%, rgba(3,12,24,0) 100%)' }} />
      ))}
      {pinLabels.map((p) => {
        const [dx, dy, anchor] = CITY_LABEL[p.name] || [0, 18, 'center'];
        const tx = anchor === 'right' ? '-100%' : anchor === 'left' ? '0%' : '-50%';
        return (
          <div key={p.name} style={{
            position: 'absolute', left: p.x + dx, top: p.y + dy - (p.isG ? 40 * p.lift : 0), transform: `translateX(${tx})`,
            fontFamily: MONO, fontWeight: 500, fontSize: p.isG ? 34 + 6 * p.lift : 27, letterSpacing: '0.12em',
            color: p.isG ? GOLD(p.label) : INKT(p.label * 0.82), whiteSpace: 'nowrap',
          }}>{p.name}</div>
        );
      })}
      {tags.map((t) => (
        <div key={t.name} style={{ position: 'absolute', left: t.x, top: t.y, transform: 'translate(-50%, -100%)', opacity: t.a, textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.2em', color: INKT(0.94), whiteSpace: 'nowrap' }}>
            <span style={{ color: INKT(0.55), marginRight: 14 }}>{TAG_NO[t.name]}</span>{t.name}
          </div>
          <div style={{ width: 1.5, height: 36 * t.a, margin: '8px auto 0', background: INKT(0.5) }} />
          <div style={{ width: 13, height: 13, borderRadius: 7, margin: '0 auto', border: `1.6px solid ${INKT(0.8)}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: INKT(1) }} />
          </div>
        </div>
      ))}
      {s.note && (
        <div style={{ position: 'absolute', left: s.note.x, top: s.note.y + 26, transform: 'translateX(-50%)', opacity: s.note.a, fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.24em', color: INKT(0.85), whiteSpace: 'nowrap' }}>{s.note.text}</div>
      )}
      {s.prices.map((p) => (
        <div key={p.text} style={{ position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%, -100%) translateY(${(1 - p.a) * 10}px)`, opacity: p.a, fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', color: INKT(0.98), whiteSpace: 'nowrap', textShadow: '0 2px 14px rgba(3,12,24,0.9)' }}>{p.text}</div>
      ))}
      <Hud h={s.hud} />
      {s.popover && <Popover p={s.popover} />}
      {s.pill && <Pill p={s.pill} />}
      {s.copy.map((c) => (
        <React.Fragment key={c.t}>
          {c.kicker && <Kicker text={c.kicker} k={c.kick} y={HERO_Y - COPY_SIZE * 1.3 - 44} />}
          <Rising parts={[{ t: c.t }]} rise={c.rise} sink={c.sink} size={COPY_SIZE} weight={600} tracking="-0.015em" y={HERO_Y} stagger={0.9} left={TEXT_X - 4} />
        </React.Fragment>
      ))}
      {s.pun && <Pun p={s.pun} />}
      {s.heroes.map((h) => (
        <React.Fragment key={h.t}>
          {h.kicker && <Kicker text={h.kicker} k={h.kick} y={HERO_Y - HERO_SIZE * 1.3 - 46} gold={h.ok} />}
          <Rising parts={h.gold ? [{ t: h.gold, gold: true }, { t: h.t.slice(h.gold.length) }] : [{ t: h.t }]} rise={h.rise} sink={h.sink} size={HERO_SIZE} weight={700} tracking="-0.025em" y={HERO_Y} stagger={1.6} left={TEXT_X - 6} />
        </React.Fragment>
      ))}
      <Lockup rise={s.wordRise} slogan={s.slogan} url={s.url} glint={s.sloganGlint} />
    </AbsoluteFill>
  );
};
