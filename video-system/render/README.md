# The renderer is at the repository root

It lives at [`../../render/`](../../render/) — not here.

That is deliberate. `render/` is the verified renderer that produced the approved
master: deterministic frame-by-frame capture through the design's own seek
protocol, one single-pass libx264 encode, then a design-state audit, a
reproducibility pass, an ffprobe verification and pixel QC. Its paths are
recorded in `baselines/evlek-reel-v7-master.json` and in every documented
command. Moving it would change all of that and improve nothing.

Read `../../render/README.md` for how it works, and
[`../docs/DO_NOT_BREAK.md`](../docs/DO_NOT_BREAK.md) before changing any of it.

Entry points, all run from the repository root:

```sh
npm run render                 # the approved V7 reel, full pipeline
npm run render:template -- --template video-system/templates/<name> --label <name>
npm run verify
npm run qc
npm run baseline:check
npm run markers:export
```
