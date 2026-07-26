# Baselines are at the repository root

They live in [`../../baselines/`](../../baselines/) — not here.

```
baselines/
  evlek-reel-v7-master.json     the approved master: sha256, stream properties,
                                eleven checkpoints with per-checkpoint PSNR
  frames/render/t*.png          lossless snapshots straight from the design.
                                A future render must match these byte for byte.
  frames/master/t*.png          the same frames decoded out of the approved MP4.
                                A future render is compared by PSNR, which
                                tolerates H.264 quantisation but not drift.
  reports/                      the verification evidence for the approved run
```

The MP4 itself is not in git — it is a large binary, and its identity is the
sha256 in the manifest. Never re-encode, overwrite, move or delete it.

Create and check baselines from the repository root:

```sh
npm run baseline:create        # pins the current master (only for a new approved reel)
npm run baseline:check         # renders the checkpoints, compares, exits non-zero on drift
```

`baseline:check` never writes to the master. If it reports drift, stop and report
it — do not re-create the baseline to make the check pass.
