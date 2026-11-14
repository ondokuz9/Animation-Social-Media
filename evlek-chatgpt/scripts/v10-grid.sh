#!/usr/bin/env bash
# v10 teslim görselleri: 2 fps ızgara + 360×640 okunurluk ızgarası (ffmpeg ile MP4'ten)
# kullanım: bash scripts/v10-grid.sh out/v10.mp4 docs/v10
set -e
IN=$1; OUT=$2; mkdir -p "$OUT"
ffmpeg -v error -y -i "$IN" -vf "fps=2,scale=180:320,tile=12x5" -frames:v 1 -q:v 3 "$OUT/v10_izgara_2fps.jpg"
ffmpeg -v error -y -i "$IN" -vf "fps=2,scale=360:640,tile=10x6" -frames:v 1 -q:v 4 "$OUT/v10_okunurluk_360x640.jpg"
