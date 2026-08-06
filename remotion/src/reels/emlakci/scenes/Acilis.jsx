// Act 1 · the cold open. 10.30s.
//
// Three previous cuts failed here, each in a way worth recording.
//
//   v1  opened straight into a montage. Five register changes with no frame of
//       reference is a showreel, not an argument.
//   v2  added "EVLEK · KKTC EMLAKÇILARI İÇİN" at 29px in a subordinate mono
//       style. Correct information, set exactly the way you set a line nobody
//       reads. Information is not address.
//   v3  made the address large and unmissable — and then framed the product as a
//       CHORE LIST: "tek bir ilan için yapılacaklar", ending on "bunların
//       hiçbirini sen yapmadın." Two problems. It positioned Evlek as a
//       labour-saver, which is the smallest true claim available; and it made
//       the agent the subject of a negative sentence. Telling a professional
//       what they did not do reads as praise and lands as diminishment.
//
// So the thesis is now the thing that actually changed:
//
//       İlan koymak değişti.
//
// and every capability is a sentence with EVLEK as its subject — writes,
// translates, furnishes, prepares, matches. The agent publishes; the product
// runs. Nobody is told what they failed to do.
//
// Four movements:
//
//   0.00–1.80  THE HOOK.  Navy, 86px, alone. "KKTC'de emlakçıysan / bunu görmen
//              lazım." A direct address and a reason to stay, and nothing else in
//              the frame competing for the 1.8 seconds it has.
//   1.80–5.40  THE THESIS. Cream. The claim, then the five things the product
//              does, 0.50s apart — slow enough that each one lands as a separate
//              promise rather than a paragraph that scrolled past.
//   5.40–8.98  THE FIVE CARDS. Each capability gets 0.72s of its own: a gold
//              index, the line at 64px on a clean ground, and a live frame of the
//              act that delivers it in a window that opens from the centre.
//              An earlier cut put these words at 34px over a photograph for
//              300ms. They were unreadable, and a word that is not read is worse
//              than no word — it is noise with a cost.
//   8.98–10.30 THE TURN. Everything stops on the form the agent actually touched.
//              "Bunları Evlek yaptı." The other half of the thought lands in the
//              next act, over the button being pressed.

import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { C, T, FPS, SANS, MONO, ease, tp, at, dur, SAFE, RADIUS, trUpper, pulse } from '../../../brand/tokens.js';
import { Phone } from '../../../brand/ui.jsx';
import { AgentPhone } from '../AgentPhone.jsx';
import { asset, Grain, BrandPlate } from '../parts.jsx';
import { Staging } from './Staging.jsx';
import { Diller } from './Diller.jsx';
import { Match } from './Match.jsx';
import { Arama } from './Arama.jsx';
import { Yayinla, yayinlaState } from './Yayinla.jsx';
import { Asistan } from './Asistan.jsx';
import content from '../content.json';

export const ACILIS_SECONDS = 10.3;

const HOOK_END = 108;                    // f0–107    1.80s  navy
const THESIS_END = 324;                  // f108–323  3.60s  cream
const CARD = 43;                         // 0.717s per card
const CARDS_END = THESIS_END + CARD * 5; // f324–538  3.58s
                                         // f539–617  1.32s  the turn

const K = content.copy;
const CAPS = K.caps;

/* Each card names its capability and shows the act that delivers it, at a moment
   inside that act where the claim is visibly true. Grounds alternate so every cut
   is still a hard change of ground, but the type now lives on a clean field
   instead of on top of a photograph. */
const CARDS = [
  // `zoom` and `dy` frame the window on what each act is actually about. Without
  // them the window shows the same slab of every scene: the phone cropped
  // through its own bezels, the search field cut in half, the language ticker
  // below the sill.
  //
  // Every window sits inside a STABLE stretch of its act — never across a
  // text handover, a status flip or a pill entrance. A sampled transition
  // freezes both of its endpoints into one frame.
  // `dark` names the scene's own ground, which sets the headline ink and the
  // ghost numeral's colour. There is no window and no crop any more — every
  // scene plays FULL BLEED, exactly as its own act does later in the film.
  { Scene: Yayinla, from: 2.35, to: 2.65, dark: false },
  { Scene: Diller, from: 1.18, to: 1.33, dark: false },
  // 1.70–2.00 sits wholly inside the ÜRETİLİYOR status: two style cards are
  // mid-develop and the progress bar is filling, with no status flip inside
  // the window.
  { Scene: Staging, from: 1.70, to: 2.00, dark: true },
  // 3.78, not 3.40: at 3.40 the act was still mid-beat — the "Senin ilanın"
  // pill entering and the handoff dimming — and the inspection caught the pill
  // as a half-rendered ghost. By 3.78 everything in the panel has settled:
  // question, answer, resolved citation, pill.
  { Scene: Asistan, from: 3.78, to: 3.98, dark: true },
  // Match, not Arama. The capability is matching; showing the buyer's search
  // here illustrated a different sentence from the one written above it.
  { Scene: Match, from: 2.56, to: 2.94, dark: true },
];

/** One promise in the thesis list. The number carries the colour so the line
    itself can stay pure navy — a list where every row has two coloured elements
    reads as decoration rather than as a list. */
const Cap = ({ cap, p }) => (
  <div
    style={{
      display: 'flex', alignItems: 'baseline', gap: 26,
      opacity: p, transform: `translateY(${(1 - p) * 18}px)`,
      marginBottom: 26,
    }}
  >
    <span
      style={{
        fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: '0.06em',
        color: C.gold, width: 56, flexShrink: 0,
      }}
    >
      {cap.no}
    </span>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: '-0.015em', color: C.navy }}>
      {cap.line}
    </span>
  </div>
);

export const Acilis = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── 1 · The hook ────────────────────────────────────────────────────── */
  // A photograph, not a plane. The flat-navy title card said the right words
  // and gave a scrolling thumb no visual reason to believe them — a client
  // test put it plainly: nobody stops for text on a blank ground. The rules
  // this shot now follows are the ones every scroll-stopping property reel
  // follows: open on the thing that is impossible to ignore (here, the sea
  // through a balcony door), put the address text on it from frame zero, and
  // keep the camera moving from the very first frame.
  //
  //   frame 0    the cover: photo + wordmark + "KKTC'de emlakçıysan" already
  //              set. Nothing fades in later than the thumb's first glance.
  //   0.00–1.80  the camera pushes slowly INTO the photograph (1.06 → 1.13)
  //   0.50–0.95  "bunu görmen lazım." lands a word at a time — each word
  //              snaps from blur, 100ms apart, the one kinetic-type gesture
  //              in the film
  //   0.95–1.30  a gold rule sweeps under the promise
  // Four lines of 800-weight display type SLAM into the frame in sequence —
  // huge, high-contrast, unmissable. The photograph survives only as a dark
  // ember behind them: the client's brief for this shot was explicit — thick
  // heavy type hitting the screen with contrast is what makes a KKTC agent
  // stop, not an aesthetic. Each line lands with a 180ms scale-slam and the
  // whole block takes a 5px settle on impact, which is what makes weight FELT
  // rather than merely large.
  if (frame < HOOK_END) {
    const push = 1.06 + 0.07 * (frame / HOOK_END);
    const c1 = K.callout_1.split(' ');                       // KKTC'de · emlakçıysan
    const c2 = K.callout_2.split(' ');                       // bunu · görmen · lazım.
    const LINES = [
      { text: trUpper(c1[0]), color: C.white, at: -1 },      // on the cover
      { text: trUpper(c1[1]), color: C.gold, at: 0.26 },
      { text: trUpper(`${c2[0]} ${c2[1]}`), color: C.white, at: 0.58 },
      { text: trUpper(c2[2]), color: C.gold, at: 0.90 },
    ];
    const slam = (a) => (a < 0 ? 1 : at(frame, a, 0.18, ease.out));
    // The block dips on every impact after the first — cumulative, so late
    // lines land on a surface that visibly carries their weight.
    const dip = LINES.slice(1).reduce((d, l) => d + 5 * pulse(frame / FPS, l.at + 0.06, 0.22), 0);
    const sweep = at(frame, 1.14, 0.30, ease.inOut);

    return (
      <AbsoluteFill style={{ background: '#050D18', overflow: 'hidden' }}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '58% 42%' }}>
          <Img
            src={asset('detay_balkon')}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '50% 38%',
              opacity: 0.5, filter: 'brightness(0.62) saturate(0.85)',
            }}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(4,10,20,0.72) 0%, rgba(4,10,20,0.30) 36%, rgba(4,10,20,0.44) 62%, rgba(3,9,18,0.92) 100%)',
          }}
        />
        <Grain opacity={0.05} />

        <div style={{ position: 'absolute', left: SAFE.left + 20, right: SAFE.right, top: 668, transform: `translateY(${dip}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 44 }}>
            <span style={{ width: 52, height: 4, background: C.gold, display: 'block' }} />
            <Img
              src={asset('wordmark')}
              style={{ height: 44, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)', opacity: 0.96 }}
            />
          </div>

          {LINES.map((l, k) => {
            const p = slam(l.at);
            if (p <= 0.001) return null;
            return (
              <div
                key={k}
                style={{
                  fontFamily: SANS, fontWeight: 800, fontSize: 128, lineHeight: 1.06,
                  letterSpacing: '-0.022em', color: l.color,
                  textShadow: '0 4px 40px rgba(0,0,0,0.55)',
                  opacity: p,
                  transform: `scale(${1.3 - 0.3 * p}) translateY(${(1 - p) * 10}px)`,
                  transformOrigin: 'left center',
                  filter: p < 0.99 ? `blur(${(1 - p) * 5}px)` : 'none',
                }}
              >
                {l.text}
              </div>
            );
          })}

          <div
            style={{
              width: 430, height: 5, marginTop: 34, background: C.gold,
              transform: `scaleX(${sweep})`, transformOrigin: 'left center',
              boxShadow: '0 0 22px rgba(201,161,87,0.55)',
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 2 · The thesis ──────────────────────────────────────────────────── */
  if (frame < THESIS_END) {
    const b = (frame - HOOK_END) / FPS;
    const lp = (atSec, len = dur.md) => tp(b, atSec, atSec + len, ease.out);

    const kick = lp(0.02, dur.sm);
    const head = lp(0.12);
    // 2.86, not 3.10, and the list is staggered at 0.44s rather than 0.50s to
    // pay for it: the inspection clocked "Sen yayınla. Gerisini Evlek
    // yönetsin." — the film's actual thesis — at a single fully-visible 0.4s
    // sample before the cards cut in. It now holds for over two seconds.
    const sub = lp(2.86);
    const creep = interpolate(b, [0, 3.60], [5, -8]);

    return (
      <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
        {/* Centred, not hung from the top. The block is ~900px tall in a 1920
            frame; anchored at 330 it left the bottom third empty for the whole
            3.2 seconds. */}
        <div
          style={{
            position: 'absolute', left: SAFE.left + 20, right: SAFE.right,
            top: '50%', transform: `translateY(calc(-52% + ${creep}px))`,
          }}
        >
          {/* The wordmark opens the row, not a bare gold tick. A client review
              caught an agent reading this frame with no idea whose claim it
              was — the thesis is the one screen a viewer must be able to
              attribute without having seen the hook. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: kick, marginBottom: 34 }}>
            <Img src={asset('wordmark')} style={{ height: 46, width: 'auto', display: 'block', opacity: 0.92 }} />
            <span style={{ width: 34, height: 4, background: C.gold, display: 'block' }} />
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.18em', color: C.ink(0.6) }}>
              {K.thesis_kicker}
            </span>
          </div>

          <div
            style={{
              ...T.hook, fontSize: 78, color: C.navy, marginBottom: 56,
              opacity: head, transform: `translateY(${(1 - head) * 20}px)`,
            }}
          >
            {K.thesis}
          </div>

          {/* An editorial rule down the left of the list, growing with it. It
              gives the five promises a spine, and it is the only thing on this
              frame that moves once the last line has landed. */}
          <div style={{ position: 'relative', paddingLeft: 46 }}>
            <div
              style={{
                position: 'absolute', left: 0, top: 6, width: 2, height: 'calc(100% - 40px)',
                background: C.ink(0.16),
                transform: `scaleY(${lp(0.60, 2.3)})`, transformOrigin: 'top center',
              }}
            />
            {CAPS.map((cap, i) => (
              <Cap key={cap.no} cap={cap} p={lp(0.64 + i * 0.44)} />
            ))}
          </div>

          <div
            style={{
              fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink(0.58),
              // Aligned with the list's spine, not the headline's margin — the
              // sentence answers the list, so it hangs from the same rule.
              paddingLeft: 46,
              marginTop: 26, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`,
            }}
          >
            {K.thesis_sub}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ── 3 · The five beats ──────────────────────────────────────────────── */
  // FIVE SCENES FROM THE FILM ITSELF, full bleed — not five framed slides.
  // Two client reviews killed the previous designs in turn: hard-cut cards
  // read as flicker, and a windowed layout with an index row, a note line, a
  // progress bar and a border read as a slide template — "çiğ ve yabancı",
  // raw and foreign, was the verdict, and it was right: the film never
  // speaks that chrome language anywhere else. So the montage now speaks the
  // film's own: each capability IS its act, playing full frame exactly as it
  // will later, with the film's standard headline over it and one editorial
  // signature — a giant ghost numeral, top right, rolling 01 → 05 — to say
  // where we are. Handover is a single full-frame push: the incoming act
  // slides in under a gold seam, the outgoing gives way beneath it, and the
  // headline and numeral travel in the same 150ms.
  if (frame < CARDS_END) {
    const seg = (frame - THESIS_END) / CARD;                 // 0 → 5, continuous
    const i = Math.min(4, Math.floor(seg));
    const local = seg - i;                                   // 0 → 1 in this beat
    const cap = CAPS[i];
    const card = CARDS[i];
    const { Scene } = card;

    // One progress value drives every layer of the handover.
    const hand = i === 0 ? 1 : tp(local, 0, 0.22, ease.inOut);
    const prevCard = i > 0 ? CARDS[i - 1] : null;
    const prevCap = i > 0 ? CAPS[i - 1] : null;

    // Beat 0 enters on its own: a 200ms scale-settle out of the thesis.
    const entry = i === 0 ? tp(local, 0.0, 0.20, ease.out) : 1;

    const ink = card.dark ? '#FFFFFF' : C.navy;
    const prevInk = prevCard && prevCard.dark ? '#FFFFFF' : C.navy;
    const ghost = card.dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,37,64,0.09)';
    const prevGhost = prevCard && prevCard.dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,37,64,0.09)';
    const darkShadow = '0 2px 26px rgba(4,14,28,0.8)';

    return (
      <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
        {/* Outgoing act, giving way beneath the push — frozen at its last
            sampled moment; 150ms is below the threshold at which a frozen
            scene reads as frozen. */}
        {prevCard && hand < 0.999 && (
          <AbsoluteFill style={{ transform: `translateX(${-hand * 26}%)`, filter: `brightness(${1 - 0.15 * hand})` }}>
            <prevCard.Scene tOverride={prevCard.to} bare />
          </AbsoluteFill>
        )}

        {/* Incoming act, full bleed, sliding in from the right — and pushing
            very slowly for its whole beat. Some sampled windows (Diller's
            stable English hold) are near-static at this compression, and a
            frame-hash audit caught 33 identical frames there: the push is
            what guarantees no beat ever freezes. */}
        <AbsoluteFill
          style={{
            transform: `translateX(${(1 - hand) * 100}%) scale(${(1.04 - 0.04 * entry) * (1 + 0.028 * local)})`,
            opacity: i === 0 ? Math.min(1, entry * 2.5) : 1,
          }}
        >
          <Scene tOverride={interpolate(local, [0, 1], [card.from, card.to])} bare />
        </AbsoluteFill>

        {/* The seam — a gold edge riding the push, full height, so the
            handover has one visible physical cause. */}
        {hand > 0.001 && hand < 0.999 && (
          <div
            style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(1 - hand) * 100}%`, width: 3, marginLeft: -1.5,
              background: C.gold, boxShadow: '0 0 30px rgba(201,161,87,0.9)',
            }}
          />
        )}

        {/* The signature: a giant ghost numeral rolling 01 → 05, top right,
            BEHIND the headline — the magazine layering that replaces a whole
            rail of chrome. It says the position and the count and never
            competes with the scene under it. */}
        <div style={{ position: 'absolute', right: SAFE.right, top: 176, width: 330, textAlign: 'right', opacity: i === 0 ? entry : 1 }}>
          <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
            {prevCap && hand < 0.999 && (
              <div
                style={{
                  position: 'absolute', right: 0, top: 0,
                  fontFamily: SANS, fontWeight: 800, fontSize: 236, lineHeight: 1,
                  letterSpacing: '-0.04em', color: prevGhost,
                  transform: `translateY(${-240 * hand}px)`,
                }}
              >
                {prevCap.no}
              </div>
            )}
            <div
              style={{
                position: 'absolute', right: 0, top: 0,
                fontFamily: SANS, fontWeight: 800, fontSize: 236, lineHeight: 1,
                letterSpacing: '-0.04em', color: ghost,
                transform: `translateY(${(1 - hand) * 240}px)`,
              }}
            >
              {cap.no}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center',
                background: 'rgba(4,14,28,0.55)', padding: '10px 18px', borderRadius: 11,
              }}
            >
              <Img
                src={asset('wordmark')}
                style={{ height: 24, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
        </div>

        {/* The headline — the film's own register, rolling through a mask.
            Every bare scene keeps its top band empty, which is exactly the
            space this line owns in every other act. */}
        <div style={{ position: 'absolute', left: SAFE.left + 20, right: SAFE.right, top: 300, height: 100, overflow: 'hidden' }}>
          {prevCap && hand < 0.999 && (
            <div
              style={{
                ...T.hook, fontSize: 68, color: prevInk,
                textShadow: prevCard.dark ? darkShadow : 'none',
                position: 'absolute', left: 0, right: 0, top: 0,
                transform: `translateY(${-100 * hand}px)`, opacity: 1 - hand * 0.5,
              }}
            >
              {prevCap.line}
            </div>
          )}
          <div
            style={{
              ...T.hook, fontSize: 68, color: ink,
              textShadow: card.dark ? darkShadow : 'none',
              position: 'absolute', left: 0, right: 0, top: 0,
              transform: `translateY(${(1 - hand) * 100}px)`,
              opacity: i === 0 ? entry : 1,
            }}
          >
            {cap.line}
          </div>
        </div>

      </AbsoluteFill>
    );
  }

  /* ── 4 · The turn ────────────────────────────────────────────────────── */
  // Everything stops on the one screen the agent actually touches. The camera
  // pushes toward the publish button and a gold ring pulses on it — the eye is
  // told where the next shot is going before the cut to a macro, so the cut
  // reads as an acceleration rather than a jump.
  const b = (frame - CARDS_END) / FPS;
  const cam = interpolate(b, [0, ACILIS_SECONDS - CARDS_END / FPS], [1.0, 1.15], {
    extrapolateRight: 'clamp', easing: ease.inOut,
  });
  // The FINISHED listing, not the empty form. "Bunları Evlek yaptı." is a
  // past-tense claim, and the inspection put its earlier staging plainly: the
  // headline said "done" over a card whose description still read "Açıklama
  // ekle…" and whose button still read "Yayınla" — the claim and the picture
  // contradicted each other. The card now shows the end state of act 2 —
  // description written, confirmed — and the ring pulses on the one control the
  // agent ever touched. The cut to act 2's macro then reads as a flashback to
  // the press itself.
  const s = { ...yayinlaState(4.95), press: 0, writing: 0 };
  const hint = Math.max(
    Math.sin(Math.PI * Math.max(0, Math.min(1, (b - 0.34) / 0.46))),
    Math.sin(Math.PI * Math.max(0, Math.min(1, (b - 0.78) / 0.46))),
  );
  const h1 = tp(b, 0.14, 0.14 + dur.md, ease.out);

  return (
    <AbsoluteFill style={{ background: C.creamWarm, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '364px 1278px' }}>
        <Phone tilt={-0.9} top={430}>
          <AgentPhone s={s} />
        </Phone>

        {hint > 0.01 && (
          <div
            style={{
              position: 'absolute', left: 364 - 172, top: 1278 - 44,
              width: 344, height: 88, borderRadius: 999,
              border: `3px solid rgba(201,161,87,${0.85 * (1 - hint)})`,
              transform: `scale(${1 + hint * 0.14})`,
            }}
          />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(248,246,241,1) 0%, rgba(248,246,241,0.99) 26%, rgba(248,246,241,0) 42%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 300, right: SAFE.right, height: 300 }}>
        <div
          style={{
            ...T.hook, color: C.navy, position: 'absolute',
            opacity: h1, transform: `translateY(${(1 - h1) * 20}px)`,
          }}
        >
          {K.hook_1}
        </div>
      </div>
    </AbsoluteFill>
  );
};
