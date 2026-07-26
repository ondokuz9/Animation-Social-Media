// Audio-marker export.
//
// Times are never typed by hand. The design page is loaded in the browser and
// window.OM_AUDIO_MARKERS / window.OM_SCENES are read back as the runtime sees
// them, together with the Stage's own summed duration. Whatever the design
// declares is what gets exported — this tool does not move a cue.
//
// Everything that is NOT in the design is labelled as a suggestion: the sound
// category, a starting gain, an intensity and a suggested length. Those are mix
// hints for the editor, derived from the cue name, and they are named so nobody
// mistakes them for authored timing.
//
//   node markers.mjs [--source dir] [--page file] [--out dir]

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startServer } from './server.mjs';
import { openStage, FPS } from './stage.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT = path.join(REPO, 'out');
const DEFAULT_SOURCE = path.join(REPO, 'project');
const DEFAULT_PAGE = 'Evlek Reel v7.dc.html';
const SAMPLE_RATE = 48000;

// Cue → mix guidance. `scene` is the scene the cue belongs to by intent, used
// only to flag a cue that has drifted out of it; it never changes a time.
const CUE_SPEC = {
  'intro-swell':          { category: 'music',       suggested_sound: 'music_intro_swell',   intensity: 'medium', gain: -6,  scene: 'Kanca',           dur: 1.2,  notes: 'Opening bed under the Girne harbour push-in.' },
  'match-cut-whoosh':     { category: 'transitions', suggested_sound: 'card_morph',          intensity: 'medium', gain: -9,  scene: 'Kanca',           dur: 0.35, notes: 'Directional cut from harbour to living room; keep the movement left-to-right.' },
  'morph-soft':           { category: 'transitions', suggested_sound: 'card_morph',          intensity: 'low',    gain: -12, scene: 'Arama',           dur: 0.4,  notes: 'Living room resolves into the search field.' },
  'price-tick':           { category: 'ui',          suggested_sound: 'query_parse_tick',    intensity: 'low',    gain: -14, scene: 'Arama',           dur: 0.12, notes: 'The "≤ £180K" clause lands in the query.' },
  'chip-tick':            { category: 'ui',          suggested_sound: 'query_parse_tick',    intensity: 'low',    gain: -15, scene: 'Arama',           dur: 0.1,  notes: 'One criterion chip confirms. Five chips stagger; vary pitch slightly per hit.' },
  'search-click':         { category: 'ui',          suggested_sound: 'search_click',        intensity: 'high',   gain: -8,  scene: 'Arama',           dur: 0.15, notes: 'Cursor presses Ara (button scales 1.00 → 0.96 → 1.00).' },
  'result-confirm':       { category: 'ui',          suggested_sound: 'result_confirmation', intensity: 'medium', gain: -9,  scene: 'Sonuçlar',        dur: 0.5,  notes: 'Main listing card settles, stack rises behind it.' },
  'verification-confirm': { category: 'data',        suggested_sound: 'verification_tick',   intensity: 'medium', gain: -11, scene: 'Okuma',           dur: 0.3,  notes: 'Verified-lister check mark. Confirm against the draw, which completes early in the scene.' },
  'chart-tonal-rise':     { category: 'data',        suggested_sound: 'chart_draw',          intensity: 'medium', gain: -12, scene: 'Okuma',           dur: 0.6,  notes: '12-month price line drawing left to right.' },
  'staging-swipe':        { category: 'staging',     suggested_sound: 'staging_swipe',       intensity: 'medium', gain: -10, scene: 'Sanal Düzenleme', dur: 1.2,  notes: 'Divider travels 110 → 970 px over 1.2 s; a moving sound, not a one-shot.' },
  'staging-snap':         { category: 'staging',     suggested_sound: 'staging_complete',    intensity: 'high',   gain: -8,  scene: 'Sanal Düzenleme', dur: 0.35, notes: 'Snap to final position with the gold confirmation ring.' },
  'index-countup':        { category: 'data',        suggested_sound: 'data_count',          intensity: 'medium', gain: -12, scene: 'Piyasa',          dur: 0.6,  notes: 'KKTC index value counting up to 142,8.' },
  'data-tick':            { category: 'data',        suggested_sound: 'data_count',          intensity: 'low',    gain: -13, scene: 'Piyasa',          dur: 0.25, notes: 'Gross yield figure emphasised.' },
  'sonic-logo':           { category: 'brand',       suggested_sound: 'sonic_logo',          intensity: 'high',   gain: -5,  scene: 'Kapanış',         dur: 1.5,  notes: 'Wordmark settle. Let the tail ring into the held CTA.' },
};

export async function exportMarkers({ source = DEFAULT_SOURCE, page = DEFAULT_PAGE, outDir = OUT } = {}) {
  const server = await startServer(source);
  const stage = await openStage({ origin: server.origin, page, imgDir: path.join(source, 'img'), quiet: true });

  const declared = await stage.page.evaluate(() => ({
    markers: window.OM_AUDIO_MARKERS ?? null,
    scenes: window.OM_SCENES ?? null,
    playback: window.OM_PLAYBACK ?? null,
  }));
  const duration = stage.duration;                 // the Stage's own summed total
  await stage.close();
  await server.close();

  if (!declared.markers) throw new Error('the design declares no OM_AUDIO_MARKERS');
  const raw = typeof declared.markers === 'string' ? JSON.parse(declared.markers) : declared.markers;
  const sceneList = typeof declared.scenes === 'string' ? JSON.parse(declared.scenes) : declared.scenes;

  let acc = 0;
  const scenes = sceneList.map((s) => {
    const start = acc; acc = +(acc + s.dur).toFixed(6);
    return { name: s.name, start, end: acc, duration: s.dur };
  });
  const sceneAt = (t) => scenes.find((s) => t >= s.start && t < s.end) ?? scenes.at(-1);

  const seen = new Map();
  const markers = raw
    .slice()
    .sort((a, b) => a.t - b.t)
    .map((m) => {
      const spec = CUE_SPEC[m.cue] ?? {};
      const n = (seen.get(m.cue) ?? 0) + 1;
      seen.set(m.cue, n);
      const scene = sceneAt(m.t);
      const end = spec.dur != null ? +Math.min(m.t + spec.dur, duration).toFixed(3) : null;
      return {
        id: `${m.cue}-${String(n).padStart(2, '0')}`,
        cue: m.cue,
        time_seconds: m.t,
        frame: Math.round(m.t * FPS) + 1,
        end_seconds: end,
        duration_seconds: end != null ? +(end - m.t).toFixed(3) : null,
        scene: scene.name,
        scene_local_seconds: +(m.t - scene.start).toFixed(3),
        category: spec.category ?? 'unclassified',
        label: m.cue.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()),
        suggested_sound: spec.suggested_sound ?? null,
        intensity: spec.intensity ?? null,
        suggested_gain_db: spec.gain ?? null,
        notes: spec.notes ?? null,
        // True when the cue sits in the scene it is meant for. `false` is not an
        // error the exporter may fix — it is something to confirm in the mix.
        scene_as_intended: spec.scene == null ? null : spec.scene === scene.name,
      };
    });

  const drifted = markers.filter((m) => m.scene_as_intended === false)
    .map((m) => ({ id: m.id, time_seconds: m.time_seconds, in_scene: m.scene, intended_scene: CUE_SPEC[m.cue].scene }));

  const json = {
    video_duration_seconds: duration,
    fps: FPS,
    total_frames: Math.round(duration * FPS),
    audio_sample_rate: SAMPLE_RATE,
    source: { design: path.relative(REPO, source), page, read_from: 'window.OM_AUDIO_MARKERS' },
    playback: declared.playback ?? null,
    scenes,
    field_provenance: {
      authored_by_the_design: ['cue', 'time_seconds', 'scene', 'scene_local_seconds', 'frame'],
      mix_suggestions_not_authored: ['end_seconds', 'duration_seconds', 'category', 'suggested_sound',
        'intensity', 'suggested_gain_db', 'notes'],
      note: 'The design declares cue onsets only. Every length and level here is a starting point for the mix, not a timing the design specifies.',
    },
    review: drifted,
    markers,
    exported_at: new Date().toISOString(),
  };

  await fs.mkdir(outDir, { recursive: true });
  const jsonPath = path.join(outDir, 'evlek_audio_markers.json');
  await fs.writeFile(jsonPath, JSON.stringify(json, null, 2) + '\n');

  const cols = ['id', 'cue', 'time_seconds', 'frame', 'end_seconds', 'duration_seconds', 'scene',
    'scene_local_seconds', 'category', 'label', 'suggested_sound', 'intensity', 'suggested_gain_db',
    'scene_as_intended', 'notes'];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(','), ...markers.map((m) => cols.map((c) => esc(m[c])).join(','))].join('\n') + '\n';
  const csvPath = path.join(outDir, 'evlek_audio_markers.csv');
  await fs.writeFile(csvPath, csv);

  console.log(`[markers] ${markers.length} cues read from the running timeline (${duration}s, ${json.total_frames} frames @ ${FPS}fps)`);
  console.log(`[markers] ${path.relative(REPO, jsonPath)}`);
  console.log(`[markers] ${path.relative(REPO, csvPath)}`);
  for (const d of drifted) {
    console.log(`[markers] review: ${d.id} at ${d.time_seconds}s falls in "${d.in_scene}" but reads as a "${d.intended_scene}" cue`);
  }
  const unclassified = markers.filter((m) => m.category === 'unclassified');
  for (const u of unclassified) console.log(`[markers] review: no mix guidance for cue "${u.cue}"`);
  return json;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--source') opts.source = path.resolve(argv[++i]);
    else if (argv[i] === '--page') opts.page = argv[++i];
    else if (argv[i] === '--out') opts.outDir = path.resolve(argv[++i]);
  }
  exportMarkers(opts).catch((e) => { console.error(e); process.exit(1); });
}
