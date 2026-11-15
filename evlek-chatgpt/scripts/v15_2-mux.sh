#!/usr/bin/env bash
# v15.2: görüntü v15.1 ile birebir (sessiz dosya), yalnız ses değişti (gerçek kayıt CC0 örnekler, audio/film15_2.py).
# Mux -c:v copy → video akışı yeniden kodlanmaz; MD5 ile doğrulanır.  Kullanım: bash scripts/v15_2-mux.sh
set -e
cd "$(dirname "$0")/.."
SIL=out/evlek_chatgpt_v15_1_1080x1920_60fps_sessiz.mp4
FIN=out/evlek_chatgpt_v15_2_1080x1920_60fps.mp4
WAV=out/audio/v15_2_master_48k.wav
ffmpeg -v error -y -i $SIL -i $WAV -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart -shortest $FIN
echo "== ffprobe"; ffprobe -v error -show_entries stream=codec_name,pix_fmt,nb_frames,r_frame_rate,color_space,color_transfer,sample_rate,channels -show_entries format=duration,size -of compact $FIN
echo "== video md5 (sessiz = sesli olmalı)"; ffmpeg -v error -i $SIL -map 0:v -f md5 -; ffmpeg -v error -i $FIN -map 0:v -f md5 -
echo "== ses"; ffmpeg -hide_banner -i $FIN -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA):|Peak:"
sha256sum $FIN $WAV
