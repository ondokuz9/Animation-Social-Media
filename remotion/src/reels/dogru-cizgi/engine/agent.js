// The agent: a line-drawn figure on a skeleton. A real walk cycle (the feet
// find the ground, the body rises over the passing leg), a turn from profile
// to front done the 2D-animation way — by blending two drawings of the same
// joints — and three gestures: welcome, present, offer a hand.
//
// Units are centimetres, x right, y up from the ground. Every call returns
// strokes (arrays of [x, y]) with a weight, built fresh from the joints.

const lerp = (a, b, t) => a + (b - a) * t;
const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const THIGH = 43, SHIN = 43, UPPER = 29, FORE = 27;

/* ── Joint sets ─────────────────────────────────────────────────────────── */
/** Profile, walking toward +x. A = far side, B = near side. */
const profileJoints = ({ phase, walk, present, offer, hold }) => {
  const leg = (psi) => {
    const at = 0.42 * Math.sin(psi) * walk;
    const kf = (0.06 + 0.62 * Math.max(0, Math.cos(psi + 0.35)) ** 2) * walk + 0.04;
    const knee = [Math.sin(at) * THIGH, 93 - Math.cos(at) * THIGH];
    const sa = at - kf;
    return { hip: [0, 93], knee, ankle: [knee[0] + Math.sin(sa) * SHIN, knee[1] - Math.cos(sa) * SHIN] };
  };
  const legA = leg(phase + Math.PI), legB = leg(phase);
  const arm = (psi, near) => {
    let as = -0.36 * Math.sin(psi) * walk;
    let eb = 0.22 + 0.22 * Math.max(0, -Math.sin(psi)) * walk;
    if (near) {
      as = lerp(as, 1.2, present);   // an open hand toward what is being shown
      eb = lerp(eb, 0.18, present);
      as = lerp(as, 1.05, offer);    // a hand offered forward, a little lower
      eb = lerp(eb, 0.35, offer);
    } else {
      as = lerp(as, 0.08, hold);     // the far arm carries the tablet, forearm level
      eb = lerp(eb, 1.5, hold);
    }
    const sh = [1, 141];
    const el = add(sh, [Math.sin(as) * UPPER, -Math.cos(as) * UPPER]);
    const wr = add(el, [Math.sin(as + eb) * FORE, -Math.cos(as + eb) * FORE]);
    return { sh, el, wr, ang: as + eb };
  };
  return {
    head: [4, 167], neck: [1, 149],
    armA: arm(phase + Math.PI, false), armB: arm(phase, true),
    legA, legB,
  };
};

/** Front (or back): facing the camera. A = screen-left, B = screen-right. */
const frontJoints = ({ phase, walk, present, offer, wave, hold, side = 1 }) => {
  const leg = (sx, psi) => {
    const lift = Math.max(0, Math.sin(psi)) * walk;
    return { hip: [sx * 10, 93], knee: [sx * 10.5, 50 + 5 * lift], ankle: [sx * 11, 8 + 9 * lift], toeDir: 0, lift };
  };
  const arm = (sx, psi) => {
    const near = sx === side;
    const sh = [sx * 21, 141];
    let el = [sx * 25, 113], wr = [sx * 26, 86 + 4 * Math.sin(psi) * walk];
    if (near) {
      // present: the arm opens out to the side, palm up
      el = L2(el, [sx * 45, 122], present);
      wr = L2(wr, [sx * 70, 124], present);
      // welcome at the door: out and down toward the way in
      el = L2(el, [sx * 42, 118], wave);
      wr = L2(wr, [sx * 64, 104], wave);
      // offer: forward, toward the lens — foreshortened, so shorter and lower
      el = L2(el, [sx * 22, 116], offer);
      wr = L2(wr, [sx * 16, 104], offer);
    } else {
      el = L2(el, [sx * 20, 116], hold);
      wr = L2(wr, [sx * 6, 118], hold);
    }
    return { sh, el, wr, ang: Math.atan2(wr[0] - el[0], -(wr[1] - el[1])) };
  };
  return {
    head: [0, 167], neck: [0, 149],
    armA: arm(-1, phase), armB: arm(1, phase + Math.PI),
    legA: leg(-1, phase), legB: leg(1, phase + Math.PI),
  };
};

/* ── Drawing ────────────────────────────────────────────────────────────── */
/** Outline of a limb: two offset sides joined round the end. */
const limb = (chain, widths, cap = true) => {
  const n = chain.length;
  const norms = chain.map((p, i) => {
    const a = chain[Math.max(0, i - 1)], b = chain[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
  const left = chain.map((p, i) => [p[0] + norms[i][0] * widths[i], p[1] + norms[i][1] * widths[i]]);
  const right = chain.map((p, i) => [p[0] - norms[i][0] * widths[i], p[1] - norms[i][1] * widths[i]]);
  const out = [...left];
  if (cap) {
    const e = chain[n - 1], w = widths[n - 1], nn = norms[n - 1];
    const a0 = Math.atan2(nn[1], nn[0]);
    for (let k = 1; k < 8; k++) { const t = a0 - (Math.PI * k) / 8; out.push([e[0] + Math.cos(t) * w, e[1] + Math.sin(t) * w]); }
  }
  out.push(...right.reverse());
  return out;
};

const smoothChain = (pts, per = 5) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

const ellipse = (c, rx, ry, n = 28, a0 = 0, a1 = Math.PI * 2) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([c[0] + Math.cos(t) * rx, c[1] + Math.sin(t) * ry]); }
  return out;
};

/* Torso outlines with matching point counts, so front ↔ profile blends. */
const torsoFront = () => [[-6, 150], [-20, 143], [-22, 128], [-20, 104], [-19, 78], [-6, 77], [6, 77], [19, 78], [20, 104], [22, 128], [20, 143], [6, 150]];
const torsoProfile = () => [[-4, 150], [-8, 143], [-10, 128], [-11, 104], [-12, 78], [-4, 77], [4, 77], [13, 78], [12, 104], [11, 124], [8, 140], [5, 150]];
const lapelFront = () => [[-6, 149], [-3, 128], [0, 110], [3, 128], [6, 149]];
const lapelProfile = () => [[5, 149], [6, 134], [8, 112], [6, 134], [5, 149]];

/**
 * Build the figure. facing ∈ [−1, 1]: −1 profile to the left, 0 front,
 * 1 profile to the right. Returns [{ pts, w }] in centimetres.
 */
export const agentDrawing = ({ facing = 0, phase = 0, walk = 0, present = 0, offer = 0, wave = 0, hold = 1, side = 1 } = {}) => {
  const k = clamp(Math.abs(facing));
  const sg = facing < 0 ? -1 : 1;
  const P = profileJoints({ phase, walk, present, offer, hold });
  const F = frontJoints({ phase, walk, present, offer, wave, hold, side });
  const mir = (p) => [p[0] * sg, p[1]];
  const J = (a, b) => L2(a, mir(b), k);
  const blendArm = (fa, pa) => ({ sh: J(fa.sh, pa.sh), el: J(fa.el, pa.el), wr: J(fa.wr, pa.wr) });
  const blendLeg = (fl, pl) => ({ hip: J(fl.hip, pl.hip), knee: J(fl.knee, pl.knee), ankle: J(fl.ankle, pl.ankle), toe: lerp(0, 1, k) });
  // near/far: in profile the B limbs face the viewer
  const armA = blendArm(F.armA, sg > 0 ? P.armA : P.armB), armB = blendArm(F.armB, sg > 0 ? P.armB : P.armA);
  const legA = blendLeg(F.legA, sg > 0 ? P.legA : P.legB), legB = blendLeg(F.legB, sg > 0 ? P.legB : P.legA);

  // plant the lowest foot on the ground — the bob of a walk falls out of this
  const minY = Math.min(legA.ankle[1], legB.ankle[1]);
  const lift = 8 - minY;
  const up = (p) => [p[0], p[1] + lift];

  const strokes = [];
  const farW = lerp(1, 0.5, k);
  const push = (pts, w = 1) => strokes.push({ pts: pts.map(up), w });

  const legStroke = (l, w) => {
    const chain = smoothChain([l.hip, l.knee, l.ankle], 4);
    push(limb(chain, chain.map((_, i) => lerp(8.5, 5.5, i / (chain.length - 1))), false), w);
    // shoe: forward in profile, a small oval from the front
    const a = l.ankle;
    const shoe = k > 0.5
      ? [[a[0] - 5 * sg, a[1] + 3], [a[0] - 7 * sg, a[1] - 6], [a[0] + 20 * sg, a[1] - 7], [a[0] + 22 * sg, a[1] - 3], [a[0] + 12 * sg, a[1] + 1], [a[0] - 5 * sg, a[1] + 3]]
      : ellipse([a[0], a[1] - 4], 6.5, 3.5, 16);
    push(shoe, w);
  };
  const armStroke = (a, w) => {
    const chain = smoothChain([a.sh, a.el, a.wr], 4);
    push(limb(chain, chain.map((_, i) => lerp(5.2, 3.6, i / (chain.length - 1))), false), w);
    // hand: a tapered oval continuing the forearm
    const d = [a.wr[0] - a.el[0], a.wr[1] - a.el[1]];
    const l = Math.hypot(d[0], d[1]) || 1;
    const c = [a.wr[0] + (d[0] / l) * 6, a.wr[1] + (d[1] / l) * 6];
    const ang = Math.atan2(d[1], d[0]);
    const hand = ellipse([0, 0], 7, 3.6, 18).map(([x, y]) => [c[0] + x * Math.cos(ang) - y * Math.sin(ang), c[1] + x * Math.sin(ang) + y * Math.cos(ang)]);
    push(hand, w);
    return c;
  };

  // far limbs first, dimmer; then body; then near limbs
  const farLeg = sg > 0 ? legA : legB, nearLeg = sg > 0 ? legB : legA;
  // in profile the near arm gestures; from the front, the `side` arm does
  const gestureB = k > 0.5 ? sg > 0 : side > 0;
  const farArm = gestureB ? armA : armB, nearArm = gestureB ? armB : armA;
  legStroke(farLeg, farW);
  const farHand = armStroke(farArm, farW);
  // tablet in the far hand
  if (hold > 0.05) {
    const c = farHand;
    const tw = lerp(15, 5, k), th = 21;
    push([[c[0] - tw / 2, c[1] - th / 2], [c[0] + tw / 2, c[1] - th / 2], [c[0] + tw / 2, c[1] + th / 2], [c[0] - tw / 2, c[1] + th / 2], [c[0] - tw / 2, c[1] - th / 2]], farW * hold);
  }
  const torso = torsoFront().map((p, i) => J(p, torsoProfile()[i]));
  push([...smoothChain([...torso, torso[0]], 3)], 1);
  push(lapelFront().map((p, i) => J(p, lapelProfile()[i])), 0.8);
  push(ellipse(J([0, 106], [9, 106]), 1.4, 1.4, 8), 0.8);
  // neck
  push([J([-4.5, 150], [-2, 150]), J([-4.5, 156], [-1, 157])], 0.9);
  push([J([4.5, 150], [5, 150]), J([4.5, 156], [6, 157])], 0.9);
  // head and hair
  const hc = J(F.head, P.head);
  push(ellipse(hc, lerp(9.5, 9, k), 11.5, 30), 1);
  // hair: the head's own outline, lifted over the crown, parted on one side
  const hr = (t, part) => 2.6 * Math.sin(t) ** 2 + part * Math.max(0, Math.cos(t - 0.9)) * 1.2;
  const hairF = Array.from({ length: 19 }, (_, i) => { const t = Math.PI * (0.06 + 0.88 * (i / 18)); return [hc[0] + Math.cos(t) * (9.5 + hr(t, 1)), hc[1] + Math.sin(t) * (11.5 + hr(t, 1))]; });
  const hairP = Array.from({ length: 19 }, (_, i) => { const t = sg > 0 ? Math.PI * (0.3 + 1.05 * (i / 18)) : Math.PI * (-0.35 + 1.05 * (i / 18)); return [hc[0] + Math.cos(t) * (9 + 2.4 * Math.sin(t) ** 2 + 1.2), hc[1] + Math.sin(t) * (11.5 + 2.2)]; });
  push(hairF.map((p, i) => L2(p, hairP[i], k)), 0.9);
  legStroke(nearLeg, 1);
  armStroke(nearArm, 1);
  return strokes;
};

/** The near hand's position (cm), for the handshake hand-off. */
export const AGENT_HEIGHT_CM = 180;
