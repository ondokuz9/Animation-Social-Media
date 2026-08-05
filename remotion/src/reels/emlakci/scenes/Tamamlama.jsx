// P2 · "Evlek tamamlıyor" — the listing builds itself.
//
// This is the film's craft test. The agent pressed publish once; from here the
// system works and the agent only confirms. The approval beat is not decoration:
// an agent's first objection to any automation is "so it writes whatever it wants
// in my name?" — showing the confirm answers it before it is asked, and it is
// what the product actually does.

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { C, T, dur, at, enter, holdLine, ease, RADIUS, SAFE } from '../../../brand/tokens.js';
import { Phone, Card, Chip, Button, Cursor, WordReveal, Caret } from '../../../brand/ui.jsx';
import content from '../content.json';

const DESC = content.copy.description;
const LANGS = content.copy.languages;

/** The languages flip one after another; the description crossfades to each. */
const langAt = (frame, i, fps) => {
  const start = 2.25 + i * 0.22;
  const flip = at(frame, start, 0.22, ease.inOut);
  // rotateX 0 → 90 → 0 reads as a physical flip without a library.
  const angle = flip < 0.5 ? flip * 2 * 90 : (1 - flip) * 2 * 90;
  return { angle, done: flip >= 1, started: flip > 0 };
};

export const Tamamlama = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone keeps drifting for the whole film; a still device reads as a slide.
  const drift = at(frame, 0, 3.2, ease.linear);
  const tilt = -2.4 + drift * 0.9;
  const scale = 1 + drift * 0.008;

  const cardIn = at(frame, 0.05, dur.lg, ease.out);
  const descP = at(frame, 0.45, 1.05, ease.linear);
  const descDone = descP >= 1;

  // Cursor travels to the confirm button, then presses. The delay between the
  // press and its result is deliberate — instant reactions read as fake.
  const cursorP = at(frame, 1.55, 0.4, ease.out);
  const press = at(frame, 1.95, dur.xs, ease.inOut);
  const pressOut = at(frame, 2.05, dur.xs, ease.out);
  const pressAmt = Math.min(press, 1 - pressOut);
  const confirmed = at(frame, 2.09, dur.sm, ease.out);   // 140ms after the press

  const metrics = enter(frame, 2.16, { dy: 14 });
  const line1 = holdLine(frame, 0.35, 2.05);
  const line2 = enter(frame, 2.20);

  return (
    <AbsoluteFill style={{ background: C.creamWarm }}>
      {/* Headline lives on the canvas, above the device, inside the safe zone. */}
      <div style={{ position: 'absolute', left: SAFE.left + 20, top: 286, right: SAFE.right }}>
        <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...line1 }}>
          Açıklaman yazıldı.
        </div>
        <div style={{ ...T.headline, color: C.navy, position: 'absolute', ...line2 }}>
          Beş dile çevriliyor.
        </div>
      </div>

      <Phone tilt={tilt} scale={scale} top={430}>
        <div style={{ padding: 40, paddingTop: 54 }}>
          <Card
            style={{
              opacity: cardIn,
              transform: `translateY(${(1 - cardIn) * 20}px) scale(${0.98 + 0.02 * cardIn})`,
            }}
          >
            <Img
              src={staticFile(content.assets.listing_image)}
              style={{ width: '100%', height: 400, objectFit: 'cover', display: 'block' }}
            />

            <div style={{ padding: '30px 32px 34px' }}>
              {/* The description the product wrote, revealed a word at a time. */}
              <div style={{ ...T.uiBody, color: C.ink(0.82), minHeight: 140 }}>
                <WordReveal text={DESC} progress={descP} />
                {!descDone && <Caret frame={frame} fps={fps} />}
              </div>

              {/* Metrics land only after the description is confirmed. */}
              <div
                style={{
                  ...T.uiBody, fontSize: 28, color: C.ink(0.55),
                  marginTop: 20, ...metrics,
                }}
              >
                {content.listing.meta}
              </div>

              {/* Confirm — the agent stays in control. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 28 }}>
                <Button press={pressAmt} ring={confirmed} style={{ height: 76, minWidth: 220, fontSize: 30 }}>
                  {confirmed > 0.6 ? 'Onaylandı' : 'Onayla'}
                </Button>
                <div style={{ ...T.uiBody, fontSize: 27, color: C.ink(0.45), opacity: 1 - confirmed }}>
                  Sen kontrol et
                </div>
              </div>

              {/* Language chips flip in sequence once the copy is approved. */}
              <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
                {LANGS.map((l, i) => {
                  const { angle, started, done } = langAt(frame, i, fps);
                  if (!started) return null;
                  return (
                    <div
                      key={l}
                      style={{
                        transform: `perspective(600px) rotateX(${angle}deg)`,
                        transformOrigin: 'center',
                      }}
                    >
                      <Chip active={done ? 1 : 0} style={{ height: 50, fontSize: 27, padding: '0 18px' }}>
                        {l}
                      </Chip>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {cursorP > 0 && (
          <Cursor
            x={330 - cursorP * 90}
            y={1080 - cursorP * 128}
            opacity={Math.min(1, cursorP * 3)}
            press={pressAmt}
          />
        )}
      </Phone>
    </AbsoluteFill>
  );
};

export const TAMAMLAMA_SECONDS = 3.2;
