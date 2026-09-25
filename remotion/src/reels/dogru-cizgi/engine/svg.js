// Turns SVG path data into polylines using the browser's own geometry
// (SVGPathElement.getPointAtLength). Runs once per path and is memoised; the
// result is identical on every frame and every run.

const cache = new Map();
const NS = 'http://www.w3.org/2000/svg';

let host = null;
const getHost = () => {
  if (host) return host;
  host = document.createElementNS(NS, 'svg');
  host.setAttribute('width', '0');
  host.setAttribute('height', '0');
  host.style.position = 'absolute';
  host.style.visibility = 'hidden';
  document.body.appendChild(host);
  return host;
};

/** Split "M…Z M…Z" into subpaths so each stroke is sampled on its own. */
const splitSubpaths = (d) => d.match(/[Mm][^Mm]*/g) || [d];

/**
 * Sample path data into strokes: [[x,y]…] per subpath, `step` user units apart.
 */
export const sampleStrokes = (d, step = 2) => {
  const key = d + '|' + step;
  if (cache.has(key)) return cache.get(key);
  const svg = getHost();
  const strokes = splitSubpaths(d).map((sub) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', sub);
    svg.appendChild(el);
    const L = el.getTotalLength();
    const n = Math.max(2, Math.ceil(L / step));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const q = el.getPointAtLength((i / n) * L);
      pts.push([q.x, q.y]);
    }
    svg.removeChild(el);
    return pts;
  });
  cache.set(key, strokes);
  return strokes;
};
