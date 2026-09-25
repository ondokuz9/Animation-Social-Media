// The agent: a line-drawn figure on a skeleton.
//
//   · Walk: stance-leg IK. The planted ankle moves back in step with the
//     body, so feet stay on the ground; heel strike, flat, toe-off; the hip
//     rises over the passing leg because the stance leg is a fixed length.
//   · Arms have anatomical roles: the right arm gestures, the left arm
//     carries the tablet. They move in angle space, so hands travel on arcs.
//   · The head can turn (yaw) and tilt; a nose tick shows where it looks.
//   · A turn from profile to front is a blend of two drawings of the same
//     joints — the 2D-animation way.
//
// Centimetres, x right, y up from the ground. Profile drawings face +x.

const lerp = (a, b, t) => a + (b - a) * t;
const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const TAU = Math.PI * 2;

const THIGH = 43, SHIN = 43, UPPER = 29, FORE = 27;
export const STEP = 67.3;          // one step, in rig centimetres (0.66 m in the world)
const FOOT = 22;

/* ── Legs ───────────────────────────────────────────────────────────────── */
/** Ankle target and foot angle for one leg at phase psi (profile, facing +x). */
const legTarget = (psi, walk) => {
  const u = (((psi % TAU) + TAU) % TAU) / Math.PI;   // 0..1 stance, 1..2 swing
  let ax, ay = 8, fa;
  if (u < 1) {
    ax = STEP * (0.5 - u);                            // linear: the foot does not slide
    fa = u < 0.12 ? 0.26 * (1 - u / 0.12) : u > 0.62 ? -0.5 * ((u - 0.62) / 0.38) ** 1.4 : 0;
    if (fa < 0) ay += FOOT * 0.8 * Math.sin(-fa);     // heel comes up, the toe stays down
  } else {
    const s = u - 1;
    ax = STEP * (smooth(s) - 0.5);
    ay = 8 + 10 * Math.sin(Math.PI * s);
    fa = lerp(-0.5, 0.26, smooth(clamp(s * 1.2)));
  }
  return { ax: ax * walk, ay: lerp(8, ay, walk), fa: fa * walk, stance: u < 1 };
};

/** Two-bone IK with the knee bending forward (+x). */
const ik2 = (hip, ank, l1 = THIGH, l2 = SHIN) => {
  const dx = ank[0] - hip[0], dy = ank[1] - hip[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const base = Math.atan2(dy, dx);
  const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const k1 = [hip[0] + Math.cos(base + a) * l1, hip[1] + Math.sin(base + a) * l1];
  const k2 = [hip[0] + Math.cos(base - a) * l1, hip[1] + Math.sin(base - a) * l1];
  const knee = k1[0] > k2[0] ? k1 : k2;
  // if out of reach, the ankle is where a straight leg ends
  const ankle = [hip[0] + Math.cos(base) * Math.min(Math.hypot(dx, dy), l1 + l2), hip[1] + Math.sin(base) * Math.min(Math.hypot(dx, dy), l1 + l2)];
  return { knee, ankle: Math.hypot(dx, dy) > l1 + l2 ? ankle : ank };
};

/* ── Arms ───────────────────────────────────────────────────────────────── */
// front view: [abduction from hanging, forearm direction]; + is outward
const FRONT = { rest: [0.12, 0.04], present: [1.25, 1.45], usher: [0.8, 1.15], offer: [0.62, 1.2], tablet: [0.2, -1.32] };
// profile: [shoulder angle, elbow bend]; + is forward
const PROF = { rest: [0, 0.22], present: [1.35, 0.15], usher: [0.9, 0.2], offer: [1.1, 0.3], tablet: [-0.08, 1.5] };

const pose = (table, w) => {
  // weighted blend away from rest; negative weights (anticipation) pull in
  let a = table.rest[0], b = table.rest[1];
  for (const k of ['present', 'usher', 'offer']) { a += (w[k] || 0) * (table[k][0] - table.rest[0]); b += (w[k] || 0) * (table[k][1] - table.rest[1]); }
  return [a, b];
};
const frontArm = (sx, abd, a2, foreK = 1) => {
  const sh = [sx * 23, 141];
  const el = [sh[0] + sx * Math.sin(abd) * UPPER, sh[1] - Math.cos(abd) * UPPER];
  return { sh, el, wr: [el[0] + sx * Math.sin(a2) * FORE * foreK, el[1] - Math.cos(a2) * FORE * foreK] };
};
const profArm = (as, eb) => {
  const sh = [1, 141];
  const el = [sh[0] + Math.sin(as) * UPPER, sh[1] - Math.cos(as) * UPPER];
  return { sh, el, wr: [el[0] + Math.sin(as + eb) * FORE, el[1] - Math.cos(as + eb) * FORE] };
};

/* ── Drawing helpers ────────────────────────────────────────────────────── */
const limb = (chain, widths) => {
  const n = chain.length;
  const norms = chain.map((p, i) => {
    const a = chain[Math.max(0, i - 1)], b = chain[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
  const left = chain.map((p, i) => [p[0] + norms[i][0] * widths[i], p[1] + norms[i][1] * widths[i]]);
  const right = chain.map((p, i) => [p[0] - norms[i][0] * widths[i], p[1] - norms[i][1] * widths[i]]);
  return [...left, ...right.reverse()];
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
const ellipse = (c, rx, ry, n = 28, a0 = 0, a1 = TAU) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([c[0] + Math.cos(t) * rx, c[1] + Math.sin(t) * ry]); }
  return out;
};
const rot = (p, c, a) => { const dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };

/* Torso outlines with matching point counts, so front ↔ profile blends. */
const TORSO_F = [[-6, 150], [-22, 144], [-23, 128], [-18, 106], [-19, 78], [-6, 77], [6, 77], [19, 78], [18, 106], [23, 128], [22, 144], [6, 150]];
const TORSO_P = [[-4, 150], [-8, 143], [-10, 128], [-11, 104], [-12, 78], [-4, 77], [4, 77], [13, 78], [12, 104], [11, 124], [8, 140], [5, 150]];
const LAPEL_F = [[-6, 149], [-3, 128], [0, 110], [3, 128], [6, 149]];
const LAPEL_P = [[5, 149], [6, 134], [8, 112], [6, 134], [5, 149]];
const SHOE_P = [[-5, 3], [-7, -6], [20, -7], [22, -3], [12, 1], [-5, 3]];
const SHOE_F = [[-6, 2], [-8, -6], [-2, -7], [4, -7], [8, -6], [6, 2]];

/**
 * The figure. Parameters (all optional):
 *   facing −1…1 (profile left … front … profile right), phase, walk 0…1,
 *   present / usher / offer: gesture weights for the right arm (may dip < 0),
 *   yaw −1…1 head turn, tilt (rad), breath −1…1, weight −1…1 (which leg bears it).
 * Returns strokes [{ pts, w, part }] with .hand (right hand centre).
 */
export const agentDrawing = ({ facing = 0, phase = 0, walk = 0, present = 0, usher = 0, offer = 0, yaw = 0, tilt = 0, breath = 0, weight = 1 } = {}) => {
  const k = smooth(clamp(Math.abs(facing)));
  const sg = facing < 0 ? -1 : 1;
  const mir = (p) => [p[0] * sg, p[1]];
  const J = (fp, pp) => L2(fp, mir(pp), k);

  /* legs: profile IK, front stance (with contrapposto when still) */
  const tA = legTarget(phase + Math.PI, walk), tB = legTarget(phase, walk);
  const stanceAx = tA.stance ? tA.ax : tB.ax;
  const hipY = Math.min(93, 8 + Math.sqrt(85.5 ** 2 - stanceAx ** 2));
  const hipP = [3 * walk, hipY];                      // a slight forward lean when walking
  const legP = (t) => { const r = ik2(hipP, [t.ax, t.ay]); return { hip: hipP, knee: r.knee, ankle: r.ankle, fa: t.fa }; };
  const pA = legP(tA), pB = legP(tB);                 // A far, B near (facing right)
  const still = 1 - walk;
  const shift = 3 * weight * still;                   // weight onto one leg
  const liftF = (sx, psi) => Math.max(0, Math.sin(psi)) * walk;
  const frontLeg = (sx, psi) => {
    const free = sx === -Math.sign(weight || 1) ? still : 0;
    return { hip: [sx * 10 + shift, hipY], knee: [sx * 10.5 + shift * 0.5 - sx * 2 * free, 50 + 5 * liftF(sx, psi)], ankle: [sx * 11 - sx * 1.5 * free, 8 + 9 * liftF(sx, psi) + 1.5 * free], fa: 0 };
  };
  const fR = frontLeg(-1, phase), fL = frontLeg(1, phase + Math.PI);
  // right leg is near when facing right
  const pR = sg > 0 ? pB : pA, pL = sg > 0 ? pA : pB;
  const legR = { hip: J(fR.hip, pR.hip), knee: J(fR.knee, pR.knee), ankle: J(fR.ankle, pR.ankle), fa: pR.fa * k };
  const legL = { hip: J(fL.hip, pL.hip), knee: J(fL.knee, pL.knee), ankle: J(fL.ankle, pL.ankle), fa: pL.fa * k };

  /* arms: right gestures, left carries the tablet */
  const swingR = walk * -0.36 * ((sg > 0 ? tB.ax : tA.ax) / (STEP / 2 || 1));
  const w = { present, usher, offer };
  const [fa1, fa2] = pose(FRONT, w);
  const [pa1, pa2] = pose(PROF, w);
  const foreK = lerp(1, 0.85, clamp(offer));           // an offered hand comes at the lens: foreshortened
  const fArmR = frontArm(-1, fa1, fa2, foreK), fArmL = frontArm(1, ...FRONT.tablet);
  const pArmR = profArm(pa1 + swingR, pa2 + Math.max(0, -swingR) * 0.5), pArmL = profArm(...PROF.tablet);
  const armR = { sh: J(fArmR.sh, pArmR.sh), el: J(fArmR.el, pArmR.el), wr: J(fArmR.wr, pArmR.wr) };
  const armL = { sh: J(fArmL.sh, pArmL.sh), el: J(fArmL.el, pArmL.el), wr: J(fArmL.wr, pArmL.wr) };

  const minY = Math.min(legR.ankle[1], legL.ankle[1]);
  const lift = walk > 0 ? 0 : 8 - minY;
  const up = (p) => [p[0], p[1] + lift];
  const strokes = [];
  const push = (pts, wgt, part) => strokes.push({ pts: pts.map(up), w: wgt, part });

  const breathe = (p) => (p[1] > 120 ? [p[0], p[1] + 0.6 * breath * ((p[1] - 120) / 30)] : p);

  /* head: turns, tilts, looks */
  const neck = J([0, 149], [1, 149]);
  const look = clamp(sg * k + yaw * (1 - k), -1, 1);
  const hc0 = add(J([0, 167], [4, 167]), [2.5 * yaw * (1 - k), breath * 0.6]);
  const R = (p) => rot(p, neck, tilt);
  push(ellipse(hc0, lerp(9.5, 9, k), 11.5, 30).map(R), 1, 'head');
  const hairW = Math.max(k, 0.5 * Math.abs(yaw));
  const side = look < 0 ? -1 : 1;
  const hairF = Array.from({ length: 19 }, (_, i) => { const t = Math.PI * (0.06 + 0.88 * (i / 18)); const part = Math.max(0, Math.cos(t - (side > 0 ? 0.9 : 2.2))) * 1.2; const r = 2.6 * Math.sin(t) ** 2 + part; return [hc0[0] + Math.cos(t) * (9.5 + r), hc0[1] + Math.sin(t) * (11.5 + r)]; });
  const hairP = Array.from({ length: 19 }, (_, i) => { const t = side > 0 ? Math.PI * (0.3 + 1.05 * (i / 18)) : Math.PI * (-0.35 + 1.05 * (i / 18)); return [hc0[0] + Math.cos(t) * (9 + 2.4 * Math.sin(t) ** 2 + 1.2), hc0[1] + Math.sin(t) * (11.5 + 2.2)]; });
  push(hairF.map((p, i) => R(L2(p, hairP[i], hairW))), 0.9, 'hair');
  if (Math.abs(look) > 0.12) push([[hc0[0] + look * 8.6, hc0[1] + 1.5], [hc0[0] + look * 11.2, hc0[1] - 2.2], [hc0[0] + look * 8.8, hc0[1] - 3.8]].map(R), 0.85, 'nose');
  push([J([-4.5, 150], [-2, 150]), J([-4.5, 156], [-1, 157])], 0.9, 'neck');
  push([J([4.5, 150], [5, 150]), J([4.5, 156], [6, 157])], 0.9, 'neck');

  /* body */
  const torso = TORSO_F.map((p, i) => breathe(J(p, TORSO_P[i])));
  const farW = lerp(1, 0.5, k);
  // in profile the far arm and leg sit behind the body
  const rNear = sg > 0 ? k > 0.25 : k < 0.25;
  const armStroke = (a, wgt, part) => {
    const chain = smoothChain([breathe(a.sh), a.el, a.wr], 4);
    push(limb(chain, chain.map((_, i) => lerp(5.2, 3.6, i / (chain.length - 1)))), wgt, part);
    const d = [a.wr[0] - a.el[0], a.wr[1] - a.el[1]];
    const l = Math.hypot(d[0], d[1]) || 1;
    const c = [a.wr[0] + (d[0] / l) * 6, a.wr[1] + (d[1] / l) * 6];
    const ang = Math.atan2(d[1], d[0]);
    const hand = ellipse([0, 0], 7, 3.6, 18).map(([x, y]) => [c[0] + x * Math.cos(ang) - y * Math.sin(ang), c[1] + x * Math.sin(ang) + y * Math.cos(ang)]);
    push(hand, wgt, part === 'armR' ? 'handR' : 'handL');
    return { c, ang };
  };
  const legStroke = (l, wgt, part) => {
    const chain = smoothChain([l.hip, l.knee, l.ankle], 4);
    push(limb(chain, chain.map((_, i) => lerp(8.5, 5.5, i / (chain.length - 1)))), wgt, part);
    const a = l.ankle;
    const shoe = SHOE_F.map((p, i) => { const q = L2(p, [SHOE_P[i][0] * sg, SHOE_P[i][1]], k); return add(a, q); }).map((p) => rot(p, a, l.fa * sg));
    push([...shoe, shoe[0]], wgt, part === 'legR' ? 'shoeR' : 'shoeL');
  };
  const tabletStroke = (hand, wgt) => {
    const c = hand.c;
    const fr = [[-11, 3.5], [11, 3.5], [9, -3.5], [-13, -3.5]];
    const pr = [[-3 * sg, 2], [12 * sg, 2.5], [12 * sg, 0.5], [-3 * sg, 0]];
    const pts = fr.map((p, i) => add(c, L2(p, pr[i], k)));
    push([...pts, pts[0]], wgt, 'tablet');
  };

  // far limbs first (profile), then the body, then near limbs
  if (k > 0.25) {
    if (rNear) { legStroke(legL, farW, 'legL'); const h = armStroke(armL, farW, 'armL'); tabletStroke(h, farW); }
    else { legStroke(legR, farW, 'legR'); var farHandR = armStroke(armR, farW, 'armR'); }
  }
  push([...smoothChain([...torso, torso[0]], 3)], 1, 'torso');
  push(LAPEL_F.map((p, i) => breathe(J(p, LAPEL_P[i]))), 0.8, 'lapel');
  push(ellipse(J([0, 106], [9, 106]), 1.4, 1.4, 8), 0.8, 'lapel');
  let handR = farHandR;
  if (k <= 0.25) {
    legStroke(legR, 1, 'legR'); legStroke(legL, 1, 'legL');
    handR = armStroke(armR, 1, 'armR');
    const h = armStroke(armL, 1, 'armL'); tabletStroke(h, 1);
  } else if (rNear) {
    legStroke(legR, 1, 'legR'); handR = armStroke(armR, 1, 'armR');
  } else {
    legStroke(legL, 1, 'legL'); const h = armStroke(armL, 1, 'armL'); tabletStroke(h, 1);
  }
  // a thumb on the gesturing hand
  if (handR && (present > 0.3 || offer > 0.3 || usher > 0.3)) {
    const c = handR.c, a = handR.ang + (offer > 0.3 ? -1.2 : -0.9) * (sg < 0 && k > 0.5 ? -1 : 1);
    push([c, [c[0] + Math.cos(a) * 7, c[1] + Math.sin(a) * 7]], 0.9, 'handR');
  }
  strokes.hand = up(handR ? handR.c : armR.wr);
  return strokes;
};
