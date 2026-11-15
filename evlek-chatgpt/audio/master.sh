#!/usr/bin/env bash
# Mastering: iki geçişli loudnorm (−14 LUFS, −1,5 dBTP, doğrusal) → 48 kHz 24-bit WAV.
# Kullanım: bash audio/master.sh out/audio/v14_raw.wav out/audio/v14_master_48k.wav
set -e
IN=$1; OUT=$2
if [ "${GAIN:-0}" = "1" ]; then
  I=$(ffmpeg -hide_banner -i "$IN" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  G=$(python3 -c "print(round(-14.0 - ($I), 2))")
  ffmpeg -hide_banner -v error -y -i "$IN" -af "volume=${G}dB,aresample=48000" -c:a pcm_s24le "$OUT"
  TP=$(ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A1 "True peak" | tail -1 | awk '{print $2}')
  echo "doğrusal kazanç ${G} dB · gerçek tepe ${TP} dBTP"
  python3 -c "import sys; sys.exit(0 if float('$TP') <= -1.5 else 1)" || { echo "HATA: gerçek tepe −1,5 dBTP'yi aşıyor"; exit 1; }
  ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA):|Peak:"
  exit 0
fi
J=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=${LRA:-7}:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -v error -y -i "$IN" -af "loudnorm=I=-14:TP=-1.5:LRA=${LRA:-7}:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s24le "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA):|Peak:"
