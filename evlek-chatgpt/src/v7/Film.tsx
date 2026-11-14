import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {ActionRow, Caret, Chevron, ComposerIdle, ComposerOpen, EvBadge, ExpandIcon, F, HeaderChat, HeaderNew, K, KB_TOP, Keyboard, layoutRich, measure, RichText, richHeight, richHeightAt, StatusBar, Tag, Thinking, useFonts} from './ios';
import {BASE, FPS, SCR, T, TOTAL, TXT, WT} from './timeline';
import WCAP from './wcap.json';
import PAGE from '../../public/page/page_rects.json';
import {LOGO_PATHS} from '../logo';

// ---------------- yardımcılar ----------------
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lin = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const E = Easing.bezier(0.22, 1, 0.36, 1); // giriş eğrisi (hareket kitabı)
const IO = Easing.bezier(0.45, 0, 0.2, 1); // kamera: sönümlü, aşmasız
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
type R = {x: number; y: number; w: number; h: number};
const mixR = (a: R, b: R, k: number): R => ({x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)});

// ---------------- yazma ritmi (insan: 55–95 ms, boşluk 120–180 ms, bir 300 ms duraksama; sonra süreye ölçeklenir) ----------------
const typeTimes = (s: string, t0: number, t1: number, seed: number) => {
  let r = seed; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  const gaps = [...s].map((c, i) => (c === ' ' ? 120 + rnd() * 60 : 55 + rnd() * 40) + (i === Math.floor(s.length * 0.45) ? 300 : 0));
  const tot = gaps.reduce((a, b) => a + b, 0);
  const k = (t1 - t0) / (tot / 1000);
  let acc = t0; return gaps.map((g) => (acc += (g / 1000) * k));
};
const TT1 = typeTimes(TXT.q1, T.type1[0], T.type1[1], 11);
const TT2 = typeTimes(TXT.q2, T.type2[0], T.type2[1], 23);
const TT3 = typeTimes(TXT.q3, T.type3[0], T.type3[1], 37);
const typedAt = (tt: number[], t: number) => tt.filter((x) => x <= t).length;
const lastKey = (s: string, tt: number[], t: number) => { const n = typedAt(tt, t); if (!n) return null; const dt = t - tt[n - 1]; return dt < 0.1 ? {ch: s[n - 1], k: 1 - dt / 0.1 * 0.3} : null; };

// ---------------- widget kayıtları ----------------
const WImg: React.FC<{seq: 'A' | 'B' | 'C'; ms: number; style?: React.CSSProperties}> = ({seq, ms, style}) => {
  const fr = (WCAP as any)[seq].frames as number[];
  const want = Math.round((ms * 60) / 1000);
  let pick = fr[0];
  for (const x of fr) if (x <= want) pick = x;
  // B1: kutu 12 pt (36 px) aşağıdan ve %0 opaklıktan gelir (320 ms); kayıttaki zemin anında dolduğu için burada uygulanır
  const k = seq === 'C' ? 1 : E(cl(ms / 320));
  return <Img src={staticFile(`wcap/${seq}/${String(pick).padStart(4, '0')}.png`)} style={{display: 'block', width: 1092, opacity: k, transform: `translateY(${(1 - k) * 36}px)`, ...style}} />;
};

// ---------------- sohbet düzeni (içerik koordinatı) ----------------
const TURN_TOP = 640; // yeni tur başladığında kullanıcı balonunun ekrandaki yeri (kamera alt hizalı)
export const TEXT_X = 45, TEXT_W = 1089, WID_X = 43;
const BUB_MAX_IN = 772, BUB_LH = 69;
const TAG_W = () => measure('Ev ', 41, 700) + measure('Evlek ', 51, 600) + 6;
const bubbleGeo = (text: string, tag: boolean) => {
  const {lines} = layoutRich(text, BUB_MAX_IN, 51, tag ? TAG_W() : 0);
  const lw = lines.map((l, i) => l.glyphs.reduce((a, g) => a + measure(g.ch, 51), 0) + (i === 0 && tag ? TAG_W() : 0));
  return {lines, w: Math.min(BUB_MAX_IN, Math.max(...lw)) + 88, h: lines.length * BUB_LH + 60};
};
const THINK_H = 76, TOOL_H = 76;

type Layout = {blocks: Record<string, {y: number; h: number}>; bottom: number; turnTops: [number, number][]};
export const layoutAt = (t: number): Layout => {
  const b: Layout['blocks'] = {};
  let y = 0;
  const turnTops: [number, number][] = [];
  const put = (k: string, h: number, gap = 0) => { y += gap; b[k] = {y, h}; y += h; };
  // 1. tur
  if (t >= T.send1) {
    const g1 = bubbleGeo(TXT.q1, true);
    turnTops.push([T.send1, y]);
    put('b1', g1.h);
    put('th1', THINK_H, 48);
    if (t >= T.tool1) put('tool1', TOOL_H, 6);
    if (t >= T.widgetA) put('wA', (WCAP as any).A.h, 30);
    if (t >= T.ans1[0]) { put('a1', richHeightAt(TXT.ans1, TEXT_W, t, T.ans1[0], T.ans1[1], 51, 1.42, 0.75, 3), 54); if (t >= T.ans1[1]) put('act1', 60, 34); }
  }
  if (t >= T.send2) {
    const g2 = bubbleGeo(TXT.q2, false);
    y += 96; turnTops.push([T.send2, y]);
    put('b2', g2.h);
    put('th2', THINK_H, 48);
    if (t >= T.tool2) put('tool2', TOOL_H, 6);
    if (t >= T.widgetB) {
      const k = E(lin(t, T.detail, T.detail + T.detailDur));
      put('wB', mix((WCAP as any).B.h, (WCAP as any).C.h, k), 30);
    }
    if (t >= T.ans2[0]) { put('a2', richHeightAt(TXT.ans2, TEXT_W, t, T.ans2[0], T.ans2[1], 51, 1.42, 0.75, 5), 54); if (t >= T.ans2[1]) put('act2', 60, 34); }
  }
  if (t >= T.send3) {
    const g3 = bubbleGeo(TXT.q3, false);
    y += 96; turnTops.push([T.send3, y]);
    put('b3', g3.h);
    put('th3', THINK_H, 48);
    if (t >= T.table[0]) put('tab', tableHeightAt(t), 40);
    if (t >= T.diff) put('diff', 72, 46);
    if (t >= T.para[0]) put('para', richHeightAt(TXT.para, TEXT_W, t, T.para[0], T.para[1], 51, 1.42, 0.75, 9), 40);
    if (t >= T.links[0]) put('links', 144, 40);
  }
  return {blocks: b, bottom: y, turnTops};
};

// ---------------- tablo ----------------
const COLS = [330, 320, 440];
const TFS = 45;
const cellLines = (s: string, w: number, bold = false) => {
  const words = s.split(' '); const out: string[] = []; let cur = '';
  for (const wd of words) { const n = cur ? cur + ' ' + wd : wd; if (measure(n, TFS, bold ? 600 : 400) > w - 24 && cur) { out.push(cur); cur = wd; } else cur = n; }
  if (cur) out.push(cur); return out;
};
const rowH = (r: string[], bold = false) => Math.max(...r.map((c, i) => cellLines(c, COLS[i], bold).length)) * 60 + 40;
const tableRowsAll = () => [TXT.tableHead, ...TXT.tableRows];
const TITLE_H = 150;
const tableTimes = () => { const n = tableRowsAll().length + 1; const [a, b] = T.table; return Array.from({length: n}, (_, i) => a + ((b - a) * i) / n); };
const tableHeightAt = (t: number) => {
  const ts = tableTimes(); let h = 0;
  if (t >= ts[0]) h += TITLE_H;
  tableRowsAll().forEach((r, i) => { if (t >= ts[i + 1]) h += rowH(r, i === 0); });
  return h;
};

// ---------------- kaydırma (iOS: yavaşlayan eğri; tur başı + akış sırasında alta takip) ----------------
let SCROLL: number[] | null = null;
const viewBottomAt = (t: number) => (kbUpAt(t) > 0.5 ? KB_TOP - 330 : 2290) - 40;
const scrollTargetAt = (t: number) => {
  const L = layoutAt(t);
  let target = 0;
  for (const [ts, y] of L.turnTops) if (t >= ts) target = y - TURN_TOP; // yeni tur: balon üste
  // akış sırasında alta takip (yalnız metin/tablo büyürken; widget gelişi itmez)
  const textKeys = ['a1', 'act1', 'a2', 'act2', 'tab', 'diff', 'para', 'links'];
  let follow = -1e9;
  for (const k of textKeys) if (L.blocks[k]) follow = Math.max(follow, L.blocks[k].y + L.blocks[k].h - viewBottomAt(t));
  // ilan detayı ve galeri sırasında detay widget'ı bütünüyle kadrajda (kullanıcı yukarı kaydırmış gibi)
  if (t >= T.detail && t < T.kb3Up && L.blocks.wB) return L.blocks.wB.y - 560;
  return Math.max(target, follow);
};
export const scrollAt = (f: number) => {
  if (!SCROLL) {
    SCROLL = [];
    let s = 0;
    for (let i = 0; i < TOTAL; i++) {
      const t = i / FPS;
      const tg = scrollTargetAt(t);
      if (i > 0 && Math.abs(tg - s) > 900 && L_JUMP(t)) s = tg - Math.sign(tg - s) * 900; // uzun sıçrama: kısalt
      s += (tg - s) * (1 - Math.exp(-(1 / FPS) / 0.11));
      SCROLL.push(s);
    }
  }
  return SCROLL[Math.min(TOTAL - 1, Math.max(0, Math.round(f)))];
};
const L_JUMP = (t: number) => [T.send1, T.send2, T.send3].some((s) => t >= s && t < s + 0.02);

// ---------------- klavye ----------------
const kbUpAt = (t: number) => {
  const segs: [number, number][] = [[T.kb1Up, T.send1], [T.kb2Up, T.send2], [T.kb3Up, T.send3]];
  for (const [a, b] of segs) if (t >= a && t < b + 0.28) return t < b ? Easing.out(Easing.poly(5))(lin(t, a, a + 0.28)) : 1 - Easing.out(Easing.poly(5))(lin(t, b, b + 0.28));
  return 0;
};

// ---------------- kamera (en fazla 7 hareket; aşma yok; olaydan 4 kare önce yönelir, 10 kare sonra durur) ----------------
type Cam = {z: number; cx: number; cy: number};
const DEF: Cam = {z: 1, cx: SCR.w / 2, cy: SCR.h - (1920 - 0.45 * 1920) / BASE}; // alt hizalı
const camKeys = (): [number, Cam][] => {
  const ansFocusY = () => { const L = layoutAt(11.2); const sc = scrollAt(11.2 * FPS); return (L.blocks.a1?.y ?? 0) - sc + 36; };
  const pre = measure("Evlek'te kriterlerine uyan ", 51); const fw = measure('52 satılık daire', 51, 600);
  const diffY = () => { const L = layoutAt(22.9); const sc = scrollAt(22.9 * FPS); return (L.blocks.diff?.y ?? 0) - sc + 36; };
  return [
    [0, DEF],
    [4.85, DEF], [5.25, {z: 1.25, cx: 500, cy: KB_TOP - 220}], // 1: yazarken giriş kutusuna
    [7.05, {z: 1.25, cx: 500, cy: KB_TOP - 220}], [7.55, DEF], // 2: cevap için açılır
    [10.9, DEF], [11.45, {z: 1.25, cx: TEXT_X + pre + fw / 2, cy: ansFocusY()}], // 3: "52 satılık daire"
    [12.0, {z: 1.25, cx: TEXT_X + pre + fw / 2, cy: ansFocusY()}], [12.45, DEF], // 4
    [22.6, DEF], [23.1, {z: 1.3, cx: TEXT_X + 360, cy: diffY()}], // 5: "Fiyat farkı"
    [23.65, {z: 1.3, cx: TEXT_X + 360, cy: diffY()}], [24.1, DEF], // 6
  ];
};
let CK: [number, Cam][] | null = null;
const camAt = (t: number): Cam => {
  CK = CK ?? camKeys();
  let i = 0; while (i < CK.length - 1 && CK[i + 1][0] <= t) i++;
  const [ta, a] = CK[i], [tb, b] = CK[Math.min(i + 1, CK.length - 1)];
  const k = tb === ta ? 1 : IO(lin(t, ta, tb));
  const z = mix(a.z, b.z, k);
  // kadraj ekran sınırlarını aşmaz
  const vw = 1080 / (BASE * z), vh = 1920 / (BASE * z);
  const cx = cl(mix(a.cx, b.cx, k), vw / 2, SCR.w - vw / 2);
  const cy = cl(mix(a.cy, b.cy, k), 0.45 * vh, SCR.h - 0.55 * vh);
  return {z, cx, cy};
};

// ---------------- yazılar ----------------
const LetterCaption: React.FC<{text: string; t: number; t0: number; t1: number; style: React.CSSProperties; size: number}> = ({text, t, t0, t1, style, size}) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const out = Easing.in(Easing.cubic)(lin(t, t1, t1 + 0.22));
  let acc = 0;
  return (
    <div style={{...style, fontFamily: F, fontWeight: 600, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.015em', color: 'rgba(255,255,255,0.94)', textShadow: '0 2px 24px rgba(0,0,0,.35)', opacity: 1 - out, transform: `translateY(${-8 * out}px)`, whiteSpace: 'pre-wrap'}}>
      {(() => {
        // harf harf; kelimeler bölünmez
        let i = 0;
        return text.split(' ').map((w, wi) => (
          <span key={wi} style={{display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.26em'}}>
            {[...w].map((c) => {
              const st = t0 + i * 0.012 + acc; i++;
              const k = E(lin(t, st, st + 0.28));
              return <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - k) * 14}px)`, filter: `blur(${(1 - k) * 4}px)`, opacity: k}}>{c}</span>;
            })}
            {(() => { acc += 0.03; i++; return null; })()}
          </span>
        ));
      })()}
    </div>
  );
};

// ---------------- iOS ekranı (1179×2556) ----------------
export const Screen: React.FC<{t: number; f: number; minScroll?: number; mk?: number}> = ({t, f, minScroll, mk = 0}) => {
  const L = layoutAt(t);
  const sc0 = scrollAt(f);
  const sc = minScroll === undefined ? sc0 : sc0 + (Math.max(sc0, minScroll) - sc0) * mk;
  const kb = kbUpAt(t);
  const kbY = mix(SCR.h, KB_TOP, kb);
  const yOf = (k: string) => (L.blocks[k]?.y ?? 0) - sc;
  // giriş kutusu içeriği
  const phase = t < T.send1 + 0.01 ? 1 : t < T.send2 + 0.01 ? 2 : 3;
  let compChildren: React.ReactNode = null, hasText = false, lines = 1, press = 0;
  const pressAt = (s: number) => (t >= s && t < s + 0.16 ? (t < s + 0.08 ? (t - s) / 0.08 : 1 - (t - s - 0.08) / 0.08) : 0);
  let key: {ch: string; k: number} | null = null;
  if (phase === 1 && t >= T.kb1Up) {
    if (t < T.tagIn) {
      const s = t >= T.mentionTypeV ? '@Ev' : t >= T.mentionTypeE ? '@E' : t >= T.at ? '@' : '';
      compChildren = s ? <span>{s}<Caret t={t} /></span> : <span><Caret t={t} /><span style={{color: '#8E8E8E'}}>{TXT.composer}</span></span>;
      hasText = !!s;
      const lk = t >= T.mentionTypeV && t < T.mentionTypeV + 0.1 ? 'v' : t >= T.mentionTypeE && t < T.mentionTypeE + 0.1 ? 'E' : null;
      if (lk) key = {ch: lk, k: 1};
    } else {
      const n = typedAt(TT1, t);
      const txt = TXT.q1.slice(0, n);
      compChildren = <span><Tag /> {txt}<Caret t={t} /></span>;
      hasText = true; key = lastKey(TXT.q1, TT1, t);
      lines = layoutRich(txt, 1000, 51, TAG_W()).lines.length || 1;
      press = pressAt(T.send1 - 0.08);
    }
  } else if (phase === 2 && t >= T.kb2Up) {
    const n = typedAt(TT2, t); const txt = TXT.q2.slice(0, n);
    compChildren = n ? <span>{txt}<Caret t={t} /></span> : <span><Caret t={t} /><span style={{color: '#8E8E8E'}}>{TXT.composer}</span></span>;
    hasText = n > 0; key = lastKey(TXT.q2, TT2, t); lines = layoutRich(txt, 1000, 51).lines.length || 1; press = pressAt(T.send2 - 0.08);
  } else if (phase === 3 && t >= T.kb3Up) {
    const n = typedAt(TT3, t); const txt = TXT.q3.slice(0, n);
    compChildren = n ? <span>{txt}<Caret t={t} /></span> : <span><Caret t={t} /><span style={{color: '#8E8E8E'}}>{TXT.composer}</span></span>;
    hasText = n > 0; key = lastKey(TXT.q3, TT3, t); lines = layoutRich(txt, 1000, 51).lines.length || 1; press = pressAt(T.send3 - 0.08);
  }
  const compH = 172 + Math.max(1, lines) * 68;
  const compTop = kbY - 38 - compH;

  // balonlar
  const Bubble: React.FC<{k: string; text: string; tag: boolean; ts: number; hl?: (i: number) => number}> = ({k, text, tag, ts, hl}) => {
    if (!L.blocks[k]) return null;
    const g = bubbleGeo(text, tag);
    const rise = E(lin(t, ts, ts + 0.42));
    const y = yOf(k);
    const fromY = compTop + 30;
    return (
      <div style={{position: 'absolute', left: 1134 - g.w, top: mix(fromY, y, rise), width: g.w, height: g.h, borderRadius: 52, background: K.bubble, padding: '30px 44px', boxSizing: 'border-box', fontFamily: F, fontSize: 51, lineHeight: `${BUB_LH}px`, color: K.text}}>
        {g.lines.map((ln, li) => (
          <div key={li} style={{whiteSpace: 'pre', height: BUB_LH}}>
            {li === 0 && tag && <><Tag /> </>}
            {ln.glyphs.map((gl) => <span key={gl.i} style={{background: hl ? `rgba(255,255,255,${0.12 * hl(gl.i)})` : undefined, borderRadius: 8}}>{gl.ch}</span>)}
          </div>
        ))}
      </div>
    );
  };
  // B4: balondaki ifadeler (WT.A.b4 ile çiplerle eşzamanlı)
  const phr = TXT.q1Phrases.map((p) => { const i = TXT.q1.indexOf(p); return [i, i + p.length] as [number, number]; });
  const hl1 = (gi: number) => {
    let v = 0;
    phr.forEach(([a, b], k) => { if (gi >= a && gi < b) { const s = T.widgetA + WT.A.b4[k] / 1000; v = Math.max(v, t >= s && t < s + 0.42 ? Math.sin(Math.PI * lin(t, s, s + 0.42)) : 0); } });
    return v;
  };

  const ThinkBlock: React.FC<{k: string; tk: string; a: number; b: number; tool: boolean}> = ({k, tk, a, b, tool}) => {
    if (!L.blocks[k]) return null;
    return (
      <>
        <div style={{position: 'absolute', left: TEXT_X, top: yOf(k), height: THINK_H, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 51, color: K.text2}}>
          {t < b ? <Thinking t={t - a} /> : <span>{TXT.thought}<Chevron /></span>}
        </div>
        {tool && L.blocks[tk] && (
          <div style={{position: 'absolute', left: TEXT_X, top: yOf(tk), height: TOOL_H, display: 'flex', alignItems: 'center', gap: 22, fontFamily: F, fontSize: 42, color: K.text2, whiteSpace: "nowrap", opacity: lin(t, b, b + 0.15)}}>
            <EvBadge size={46} bg="#1D2A3A" />{TXT.toolLine}<ExpandIcon />
          </div>
        )}
      </>
    );
  };

  // B kartı → C detay (paylaşılan öğe)
  const dk = lin(t, T.detail, T.detail + T.detailDur);
  const cardR: R = {x: 51, y: 867, w: 690, h: 519}; // B'deki 6. kartın fotoğrafı (pt×3)
  const coverR: R = {x: 0, y: 0, w: 1092, h: 615};
  const share = mixR(cardR, coverR, E(dk));

  // tablo
  const ts = tableTimes();
  // bağlantı satırı ve dokunuş
  const linkPress = pressAt(T.linkTap);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR.h, background: K.bg, overflow: 'hidden', fontFamily: F}}>
      {/* içerik */}
      <Bubble k="b1" text={TXT.q1} tag ts={T.send1} hl={hl1} />
      <ThinkBlock k="th1" tk="tool1" a={T.think1[0]} b={T.think1[1]} tool />
      {L.blocks.wA && <div style={{position: 'absolute', left: 0, width: SCR.w, top: yOf('wA'), height: L.blocks.wA.h, background: '#212121', opacity: E(cl((t - T.widgetA) / 0.32))}} />}
      {L.blocks.wB && <div style={{position: 'absolute', left: 0, width: SCR.w, top: yOf('wB'), height: L.blocks.wB.h, background: '#212121', opacity: E(cl((t - T.widgetB) / 0.32))}} />}
      {L.blocks.wA && <div style={{position: 'absolute', left: WID_X, top: yOf('wA')}}><WImg seq="A" ms={(t - T.widgetA) * 1000} /></div>}
      {L.blocks.a1 && <div style={{position: 'absolute', left: TEXT_X, top: yOf('a1')}}><RichText src={TXT.ans1} t={t} t0={T.ans1[0]} t1={T.ans1[1]} width={TEXT_W} seed={3} /></div>}
      {L.blocks.act1 && <div style={{position: 'absolute', left: TEXT_X, top: yOf('act1')}}><ActionRow o={lin(t, T.ans1[1], T.ans1[1] + 0.2)} /></div>}
      <Bubble k="b2" text={TXT.q2} tag={false} ts={T.send2} />
      <ThinkBlock k="th2" tk="tool2" a={T.think2[0]} b={T.think2[1]} tool />
      {L.blocks.wB && (
        <div style={{position: 'absolute', left: WID_X, top: yOf('wB'), width: 1092, height: L.blocks.wB.h, overflow: 'hidden', borderRadius: 0}}>
          <div style={{opacity: 1 - E(dk)}}><WImg seq="B" ms={(t - T.widgetB) * 1000} /></div>
          {t >= T.detail && (
            <div style={{position: 'absolute', left: 0, top: 0, opacity: E(lin(t, T.detail + 0.1, T.detail + T.detailDur))}}><WImg seq="C" ms={(t - T.detail) * 1000} /></div>
          )}
          {t >= T.detail && dk < 1 && (
            <div style={{position: 'absolute', left: share.x, top: share.y, width: share.w, height: share.h, overflow: 'hidden', borderRadius: mix(0, 0, dk)}}>
              <Img src={staticFile('v4/EVL-100102_00.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          )}
        </div>
      )}
      {L.blocks.a2 && <div style={{position: 'absolute', left: TEXT_X, top: yOf('a2')}}><RichText src={TXT.ans2} t={t} t0={T.ans2[0]} t1={T.ans2[1]} width={TEXT_W} seed={5} /></div>}
      {L.blocks.act2 && <div style={{position: 'absolute', left: TEXT_X, top: yOf('act2')}}><ActionRow o={lin(t, T.ans2[1], T.ans2[1] + 0.2)} /></div>}
      <Bubble k="b3" text={TXT.q3} tag={false} ts={T.send3} />
      <ThinkBlock k="th3" tk="tool3" a={T.think3[0]} b={T.think3[1]} tool={false} />
      {L.blocks.tab && (
        <div style={{position: 'absolute', left: TEXT_X, top: yOf('tab'), width: TEXT_W, fontFamily: F, color: K.text}}>
          <div style={{height: TITLE_H, fontSize: 50, lineHeight: '64px', fontWeight: 600, opacity: lin(t, ts[0], ts[0] + 0.12)}}>{TXT.tableTitle}</div>
          {tableRowsAll().map((r, i) => t >= ts[i + 1] && (
            <div key={i} style={{display: 'flex', height: rowH(r, i === 0), borderBottom: `1.5px solid ${i === 0 ? '#3A3A3A' : '#262626'}`, alignItems: 'center', opacity: lin(t, ts[i + 1], ts[i + 1] + 0.12)}}>
              {r.map((c, j) => (
                <div key={j} style={{width: COLS[j], fontSize: TFS, lineHeight: '60px', fontWeight: i === 0 ? 600 : 400, paddingRight: 24, boxSizing: 'border-box'}}>
                  {cellLines(c, COLS[j], i === 0).map((ln, q) => <div key={q}>{ln}</div>)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {L.blocks.diff && <div style={{position: 'absolute', left: TEXT_X, top: yOf('diff')}}><RichText src={TXT.diff} t={t} t0={T.diff} t1={T.diff + 0.25} width={TEXT_W} seed={8} /></div>}
      {L.blocks.para && <div style={{position: 'absolute', left: TEXT_X, top: yOf('para')}}><RichText src={TXT.para} t={t} t0={T.para[0]} t1={T.para[1]} width={TEXT_W} seed={9} /></div>}
      {L.blocks.links && (
        <div style={{position: 'absolute', left: TEXT_X, top: yOf('links'), width: TEXT_W, fontFamily: F, fontSize: 51, lineHeight: '72px', color: K.text, opacity: lin(t, T.links[0], T.links[1])}}>
          {TXT.links.map((s, i) => (i % 2 === 1
            ? <span key={i} style={{whiteSpace: 'nowrap', textDecoration: 'underline', textDecorationColor: '#7A7A7A', textUnderlineOffset: 8, borderRadius: 8, background: i === 3 ? `rgba(255,255,255,${0.12 * linkPress})` : undefined}}>{s}</span>
            : <span key={i} style={{whiteSpace: 'pre-wrap'}}>{s}</span>))}
        </div>
      )}

      {/* üst ve alt geçiş (içerik başlığın ve giriş alanının altından geçer) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 2250, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 40%)', opacity: 1 - kb}} />
      <StatusBar />
      <div style={{opacity: 1 - lin(t, T.send1, T.send1 + 0.15)}}><HeaderNew /></div>
      <div style={{opacity: lin(t, T.send1, T.send1 + 0.15)}}><HeaderChat /></div>

      {/* giriş alanı + klavye */}
      {kb < 0.02 ? <ComposerIdle /> : (
        <div style={{opacity: 1}}>
          <ComposerOpen top={mix(2330, compTop, kb)} height={mix(125, compH, kb)} hasText={hasText} press={press}>{kb > 0.6 ? compChildren : null}</ComposerOpen>
        </div>
      )}
      {/* @ bahsetme listesi: yalnız Evlek */}
      {t >= T.mentionOpen && t < T.tagIn + 0.15 && (() => {
        const o = lin(t, T.mentionOpen, T.mentionOpen + 0.2) * (1 - lin(t, T.tagIn, T.tagIn + 0.15));
        const pr = pressAt(T.mentionTap);
        return (
          <div style={{position: 'absolute', left: 33, top: compTop - 186, width: 1111, height: 170, borderRadius: 44, background: '#262626', opacity: o, transform: `translateY(${(1 - o) * 12}px)`, overflow: 'hidden', fontFamily: F}}>
            <div style={{position: 'absolute', inset: 10, borderRadius: 34, background: `rgba(255,255,255,${0.1 * pr})`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 30px'}}>
              <div style={{width: 96, height: 96, borderRadius: 24, background: '#0F1C2B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 46}}>Ev</div>
              <div style={{fontSize: 51, fontWeight: 600, color: K.text}}>{TXT.mentionName}</div>
              <div style={{fontSize: 44, color: K.text2}}>{TXT.mentionDesc}</div>
            </div>
          </div>
        );
      })()}
      {kb > 0 && <Keyboard y={kbY} press={key?.ch && /[a-zçğıöşü]/i.test(key.ch) ? key.ch : null} pressK={key?.k ?? 0} />}

      {/* uygulama içi tarayıcı (evlek.app) */}
      {t >= T.sheet && <Sheet t={t} />}
    </div>
  );
};

// ---------------- iOS sayfası: evlek.app ----------------
const SHEET_TOP = SCR.h - 1941 - 156;
const Sheet: React.FC<{t: number}> = ({t}) => {
  const k = Easing.out(Easing.cubic)(lin(t, T.sheet, T.sheet + T.sheetDur));
  const y = mix(SCR.h, SHEET_TOP, k);
  const content = lin(t, T.sheet + T.sheetDur + T.skeleton, T.sheet + T.sheetDur + T.skeleton + 0.15);
  const wa = (PAGE as any).waPx as R;
  const pr = t >= T.waTap && t < T.waTap + 0.16 ? (t < T.waTap + 0.08 ? (t - T.waTap) / 0.08 : 1 - (t - T.waTap - 0.08) / 0.08) : 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: 0.45 * k}} />
      <div style={{position: 'absolute', left: 0, top: y, width: SCR.w, height: SCR.h - SHEET_TOP + 40, background: '#F2F2F7', borderTopLeftRadius: 44, borderTopRightRadius: 44, overflow: 'hidden', fontFamily: F}}>
        <div style={{height: 156, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: '#F7F7F7', borderBottom: '1px solid #DADADA'}}>
          <svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="#1C1C1E" strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 46, fontWeight: 600, color: '#1C1C1E'}}>
            <svg width="30" height="36" viewBox="0 0 20 24"><rect x="2" y="10" width="16" height="12" rx="3" fill="#6B6B6B" /><path d="M5.5 10V7a4.5 4.5 0 019 0v3" stroke="#6B6B6B" strokeWidth="2.4" fill="none" /></svg>
            evlek.app
          </div>
          <svg width="44" height="50" viewBox="0 0 22 26"><path d="M11 16V3M6.5 7.5L11 3l4.5 4.5M4 12v10h14V12" stroke="#007AFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{position: 'relative', width: SCR.w, height: 1941}}>
          {/* iskelet: 300 ms */}
          <div style={{position: 'absolute', inset: 0, background: '#EEF2F7', opacity: 1 - content}}>
            <div style={{position: 'absolute', left: 36, top: 380, width: 1107, height: 664, borderRadius: 60, background: '#DDE3EA'}} />
            {[[1100, 360], [1190, 620], [1300, 900], [1420, 700]].map(([yy, w], i) => <div key={i} style={{position: 'absolute', left: 36, top: yy, width: w, height: 54, borderRadius: 27, background: '#DDE3EA'}} />)}
          </div>
          <Img src={staticFile('page/page_view.png')} style={{position: 'absolute', inset: 0, width: SCR.w, opacity: content}} />
          {pr > 0 && <div style={{position: 'absolute', left: wa.x, top: wa.y, width: wa.w, height: wa.h, borderRadius: wa.h / 2, background: `rgba(0,0,0,${0.08 * pr})`}} />}
        </div>
      </div>
    </>
  );
};

// ---------------- film ----------------
const PHONE_SMALL = 0.42;
export const Film: React.FC = () => {
  const ok = useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  // H1 → arayüz itmesi
  const push = Easing.bezier(0.22, 1, 0.36, 1)(lin(t, T.push[0], T.push[1]));
  const showUI = t >= T.ui && t < T.toH3[1];
  const c = camAt(t);
  const s = BASE * c.z;
  const tx = 540 - c.cx * s, ty = 0.45 * 1920 - c.cy * s;
  // telefon küçük hâli (H1 içindeki telefon ekranı gibi): ortada
  const sm = BASE * PHONE_SMALL;
  const smX = 540 - (SCR.w * sm) / 2, smY = 960 - (SCR.h * sm) / 2;
  const S_ = mix(sm, s, push), X_ = mix(smX, tx, push), Y_ = mix(smY, ty, push);
  const bright = lin(t, T.brighten[0], T.brighten[1]);
  const toH3 = lin(t, T.toH3[0], T.toH3[1]);
  const W = (
    <AbsoluteFill style={{background: '#0B0B0C'}}>
      {/* H1 yer tutucu (düz koyu) */}
      {showUI && (
        <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${X_}px, ${Y_}px) scale(${S_})`}}>
          <div style={{position: 'absolute', left: -60, top: -60, width: SCR.w + 120, height: SCR.h + 120, borderRadius: 220, background: '#1A1A1C', opacity: 1 - push, boxShadow: '0 0 0 6px #2A2A2E'}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR.h, borderRadius: mix(170, 0, push), overflow: 'hidden'}}>
            <Screen t={t} f={f} />
          </div>
        </div>
      )}
      {/* WhatsApp sonrası hafif aydınlanma → H3 */}
      <AbsoluteFill style={{background: '#fff', opacity: 0.22 * bright * (1 - toH3)}} />
      {t >= T.toH3[0] && <AbsoluteFill style={{background: '#0B0B0C', opacity: toH3}} />}
      {/* yazı 1 */}
      <LetterCaption text={TXT.cap1} t={t} t0={T.cap1[0]} t1={T.cap1[1]} size={68} style={{position: 'absolute', left: 72, right: 72, top: 1300, textAlign: 'left'}} />
      {/* yazı 2: küçük etiket */}
      {t >= T.label2[0] - 0.05 && t < T.label2[1] + 0.25 && (
        <div style={{position: "absolute", left: 56, top: 52, padding: "14px 24px", borderRadius: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', opacity: lin(t, T.label2[0], T.label2[0] + 0.28) * (1 - lin(t, T.label2[1], T.label2[1] + 0.22))}}>
          <LetterCaption text={TXT.label2} t={t} t0={T.label2[0]} t1={T.label2[1]} size={34} style={{fontWeight: 500}} />
        </div>
      )}
      {/* kapanış: logo + "artık ChatGPT'de." + ince çizgi → mercan */}
      {t >= T.logo && <Closing t={t} />}
    </AbsoluteFill>
  );
  const blur = (t >= T.push[0] && t <= T.push[1]) || (t >= T.toH3[0] && t <= T.toH3[1]);
  return blur ? <CameraMotionBlur shutterAngle={180} samples={8}>{W}</CameraMotionBlur> : W;
};

const Closing: React.FC<{t: number}> = ({t}) => {
  const lw = 420, lh = (lw * 165) / 530;
  const lg = E(lin(t, T.logo, T.logo + 0.45));
  const draw = lin(t, T.logo + 0.7, T.logo + 1.3);
  const coral = lin(t, T.logo + 1.3, T.logo + 1.55);
  return (
    <>
      <div style={{position: 'absolute', left: (1080 - lw) / 2, top: 760, width: lw, height: lh, opacity: lg, transform: `translateY(${(1 - lg) * 14}px)`, filter: `blur(${(1 - lg) * 4}px)`}}>
        <svg viewBox="1240 325 530 165" width={lw} height={lh}>{LOGO_PATHS.map((d, i) => <path key={i} d={d} fill="rgba(255,255,255,0.96)" />)}</svg>
      </div>
      <LetterCaption text={TXT.closing} t={t} t0={T.logo + 0.3} t1={99} size={68} style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center'}} />
      {/* ince çizgi: 1 px, %35 beyaz, 600 ms'de soldan sağa; bitince mercan 120 px */}
      <div style={{position: 'absolute', left: 540 - mix(lw / 2, 60, coral), top: 1060, height: mix(1, 4, coral), width: mix(lw * draw, 120, coral), borderRadius: 2, background: coral > 0 ? `rgba(184,78,59,${0.35 + 0.65 * coral})` : 'rgba(255,255,255,0.35)'}} />
    </>
  );
};

/** Karşılaştırma için: kamera olmadan tam iOS ekranı (1179×2556). */
export const ScreenOnly: React.FC<{at: number}> = ({at}) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  return <Screen t={at} f={Math.round(at * FPS)} />;
};
