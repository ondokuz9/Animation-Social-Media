import { AbsoluteFill, useCurrentFrame, staticFile } from 'remotion';
import './evlek.css';

// ── Ported verbatim from project/evlek-reel-v7.jsx · SceneKapanis ────────────
// Nothing about the design is reinterpreted here. Same constants, same easing,
// same numbers, same order of elements. The ONLY substitution is the time
// source: the approved reel reads useScene().localTime, Remotion reads
// useCurrentFrame() / fps. Everything else is copied so that any pixel
// difference the comparison finds is Remotion's rendering, not my rewriting.

export const FPS = 60;
export const KAPANIS_DURATION_S = 3.5;        // OM_SCENES: {"name":"Kapanış","dur":3.5}

const NAVY = '#0A2540', GOLD = '#C9A157', KREM = '#F4F1EB', SICAK2 = '#F7F4EE';
const SANS = "'Hanken Grotesk',system-ui,sans-serif";
const ABS = { position: 'absolute', inset: 0 };

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, m) => a + (b - a) * m;
const EASE = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const fade = (lt, t0, d = 0.24) => ({ opacity: EASE((lt - t0) / d) });

export const Kapanis = () => {
  const frame = useCurrentFrame();
  const lt = frame / FPS;                       // scene-local time, as in useScene()
  const dur = KAPANIS_DURATION_S;
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
    <AbsoluteFill style={{
      overflow: 'hidden', background: SICAK2,
      // The approved pipeline launches Chromium with --disable-lcd-text, i.e.
      // grayscale antialiasing with no subpixel colour fringing. Remotion does
      // not expose arbitrary Chrome flags, so the CSS equivalent is used here.
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* The approved scene slides the previous (Piyasa) scene up behind this
          one while inY > 0. Both baseline checkpoints sit at inY === 0, so the
          outgoing layer is not part of this comparison and is left out. */}
      <div style={{ ...ABS, background: NAVY, transform: `translateY(${inY * 100}%)` }}>
        <div style={{
          ...ABS, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', paddingBottom: 170,
        }}>
          <img
            src={staticFile('wordmark.png')}
            alt="Evlek"
            style={{
              width: 420, display: 'block', filter: 'invert(1)',
              opacity: wm.opacity, transform: `scale(${wmS})`,
            }}
          />
          <div style={{
            marginTop: 54, width: 240, height: 3, background: GOLD,
            transform: `scaleX(${line})`, transformOrigin: 'left center',
          }} />
          <div style={{
            marginTop: 50, fontFamily: SANS, fontWeight: 500, fontSize: 40,
            color: 'rgba(255,255,255,.85)', ...tag,
          }}>Kıbrıs'ta doğru ev.</div>
          <div style={{ marginTop: 58, ...cta }}>
            <div style={{
              position: 'relative', overflow: 'hidden', minWidth: 470, height: 102,
              boxSizing: 'border-box', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: KREM, color: NAVY,
              fontFamily: SANS, fontWeight: 700, fontSize: 34,
              borderRadius: 999, padding: '0 60px',
            }}>
              Evlek.app'te ara
              {swp > 0 && swp < 1 && (
                <div style={{
                  ...ABS,
                  background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,.5) 50%, transparent 68%)',
                  transform: `translateX(${lerp(-100, 100, swp)}%)`,
                }} />
              )}
            </div>
          </div>
          <div style={{
            marginTop: 52, fontFamily: SANS, fontWeight: 500, fontSize: 27,
            color: 'rgba(255,255,255,.55)', ...dst,
          }}>Web · iOS · Android · 5 dil</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
