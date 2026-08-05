// The agent's screen — one continuous surface for the whole first half.
//
// Architecture note that matters: this component is a PURE FUNCTION OF STATE. It
// never reads the frame. Every act drives the same state object on its own
// schedule, which is what lets the cold open be honest — the hook is literally
// this screen driven from 0 to 1 in 1.2s, then rewound. Nothing is faked for the
// hook, because the hook is the film.
//
// The listing card is the constant. Everything the product does happens TO it:
// the description writes into it, the photo transforms inside it, and the work
// stacks up beneath it. That is the spine — one listing, travelling.

import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, T, RADIUS, SHADOW, MONO } from '../../brand/ui-deps.js';
import { Card, Chip, Button, Cursor, WordReveal, Disclosure } from '../../brand/ui.jsx';
import content from './content.json';

const DESC = content.copy.description;

/** A completed step. These stack under the card and are the visible proof that
    one press produced many outcomes. */
const DoneRow = ({ label, p }) => {
  if (p <= 0) return null;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
        padding: '18px 4px',
      }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="11" fill="rgba(201,161,87,0.14)" />
        <path
          d="M7 12.3 L10.4 15.6 L17 8.9"
          stroke={C.gold} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          pathLength="1" strokeDasharray="1"
          strokeDashoffset={1 - Math.max(0, Math.min(1, (p - 0.25) * 1.9))}
        />
      </svg>
      <span style={{ ...T.uiBody, fontSize: 30, color: C.ink(0.72) }}>{label}</span>
    </div>
  );
};

/**
 * @param s.desc      0→1  description writing into the card
 * @param s.confirm   0→1  the agent's confirmation landing
 * @param s.langs     0→1  five languages flipping through
 * @param s.stage     0→1  the photo being prepared (the reveal wipe)
 * @param s.stageOn   0→1  the "leave it to Evlek" toggle
 * @param s.match     0→1  buyer criteria locking on
 * @param s.rows      {desc, lang, photo, match} each 0→1
 * @param s.press     0→1  the publish/confirm button being pressed
 */
export const AgentPhone = ({ s }) => {
  const showForm = s.form ?? 0;          // 1 = still the empty publish form
  const photoH = 400;

  return (
    <div style={{ padding: '46px 40px 0' }}>
      {/* App bar — small, quiet, just enough to read as a product. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <span style={{ ...T.uiLabel, fontSize: 28, color: C.ink(0.45) }}>İlanım</span>
        <span style={{ ...T.monoSm, fontSize: 24, color: C.ink(0.3) }}>EVLEK</span>
      </div>

      <Card lifted={s.match > 0.4 ? 1 : 0} selected={s.match ?? 0}>
        {/* The photo. During staging the prepared version wipes over the raw one,
            inside the card — the listing never leaves the frame. */}
        <div style={{ position: 'relative', height: photoH, overflow: 'hidden' }}>
          <Img
            src={staticFile(content.assets.staging_before)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: photoH, objectFit: 'cover' }}
          />
          {s.stage > 0 && (
            <Img
              src={staticFile(content.assets.staging_after)}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: photoH, objectFit: 'cover',
                clipPath: `inset(0 ${(1 - s.stage) * 100}% 0 0)`,
              }}
            />
          )}
          {s.stage > 0 && s.stage < 1 && (
            <div
              style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${s.stage * 100}%`, width: 4, marginLeft: -2,
                background: C.white, boxShadow: '0 0 18px rgba(255,255,255,0.6)',
              }}
            />
          )}
          {s.stageOn > 0 && (
            <div style={{ position: 'absolute', left: 20, top: 20, opacity: s.stageOn }}>
              <Disclosure style={{ fontSize: 24, padding: '9px 18px' }} />
            </div>
          )}
        </div>

        <div style={{ padding: '28px 30px 30px' }}>
          <div style={{ ...T.price, color: C.navy, fontSize: 46 }}>{content.listing.price}</div>

          {/* Description: empty field before publish, written copy after. */}
          <div style={{ ...T.uiBody, color: C.ink(0.8), marginTop: 14, minHeight: 118 }}>
            {showForm > 0.5 ? (
              <span style={{ color: C.ink(0.32) }}>{content.copy.placeholder}</span>
            ) : (
              <WordReveal text={DESC} progress={s.desc ?? 0} />
            )}
          </div>

          {/* Confirm. The agent stays in control — this beat answers the first
              objection any agent has to automation. */}
          {(s.confirm ?? 0) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6, opacity: Math.min(1, s.confirm * 2) }}>
              <Button
                press={s.press ?? 0}
                ring={s.confirmed ?? 0}
                style={{ height: 72, minWidth: 200, fontSize: 29 }}
              >
                {(s.confirmed ?? 0) > 0.5 ? content.copy.confirmed : content.copy.confirm}
              </Button>
            </div>
          )}

          {/* Publish, only in the form state. */}
          {showForm > 0.5 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
              <Button press={s.press ?? 0} ring={s.published ?? 0} style={{ height: 76, minWidth: 240, fontSize: 30 }}>
                {content.copy.publish}
              </Button>
            </div>
          )}

          {/* Languages. */}
          {(s.langs ?? 0) > 0 && (
            <div style={{ display: 'flex', gap: 11, marginTop: 24 }}>
              {content.copy.languages.map((l, i) => {
                const p = Math.max(0, Math.min(1, (s.langs * content.copy.languages.length) - i));
                if (p <= 0) return null;
                const angle = p < 0.5 ? p * 2 * 90 : (1 - p) * 2 * 90;
                return (
                  <div key={l} style={{ transform: `perspective(600px) rotateX(${angle}deg)` }}>
                    <Chip active={p >= 1 ? 1 : 0} style={{ height: 48, fontSize: 26, padding: '0 16px' }}>{l}</Chip>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* The work, stacking up. One press above; a list of outcomes below. */}
      <div style={{ marginTop: 14 }}>
        <DoneRow label={content.copy.row_desc} p={s.rows?.desc ?? 0} />
        <DoneRow label={content.copy.row_lang} p={s.rows?.lang ?? 0} />
        <DoneRow label={content.copy.row_photo} p={s.rows?.photo ?? 0} />
        <DoneRow label={content.copy.row_match} p={s.rows?.match ?? 0} />
      </div>

      {/* Buyer criteria locking onto the listing. */}
      {(s.match ?? 0) > 0 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          {content.copy.buyer_chips.map((c, i) => {
            const p = Math.max(0, Math.min(1, (s.match * 3.4) - i));
            if (p <= 0) return null;
            const dropped = i === 2;
            return (
              <div
                key={c}
                style={{
                  opacity: dropped ? p * (1 - Math.max(0, (s.match - 0.75) * 3)) * 0.9 + 0.1 : p,
                  transform: `translateX(${dropped ? Math.max(0, (s.match - 0.75) * 3) * 20 : 0}px) scale(${0.9 + 0.1 * Math.min(1, p * 1.1)})`,
                  filter: dropped && s.match > 0.8 ? 'saturate(0.3)' : 'none',
                }}
              >
                <Chip active={dropped ? 0 : Math.max(0, Math.min(1, (s.match - 0.55) * 4))}
                      style={{ height: 46, fontSize: 25, padding: '0 16px' }}>
                  {c}
                </Chip>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
