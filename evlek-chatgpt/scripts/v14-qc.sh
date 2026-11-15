#!/usr/bin/env bash
# v14 QC: transfer etiketi (yeniden kodlamasız), ffprobe, 6 fps bloklar, döngü SSIM, siyah kare, kare farkı, ses mux (-c:v copy) ve doğrulama.
# Kullanım: bash scripts/v14-qc.sh
set -e
cd "$(dirname "$0")/.."
Q=out/v14qc; rm -rf $Q; mkdir -p $Q/f6
SIL=out/evlek_chatgpt_v14_1080x1920_60fps_sessiz.mp4
FIN=out/evlek_chatgpt_v14_1080x1920_60fps.mp4
ffmpeg -v error -y -i out/v14.mp4 -c copy -bsf:v h264_metadata=transfer_characteristics=1 -movflags +faststart $SIL
ffmpeg -v error -y -i $SIL -i out/audio/v14_master_48k.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart -shortest $FIN
echo "== ffprobe"; ffprobe -v error -show_entries stream=codec_name,pix_fmt,nb_frames,r_frame_rate,color_space,color_transfer,color_primaries,color_range,sample_rate,channels -show_entries format=duration,size -of compact $FIN
echo "== video md5 (sessiz = sesli olmalı)"; ffmpeg -v error -i $SIL -map 0:v -f md5 -; ffmpeg -v error -i $FIN -map 0:v -f md5 -
echo "== ses"; ffmpeg -hide_banner -i $FIN -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA):|Peak:"
sha256sum $SIL $FIN
ffmpeg -v error -i $SIL -vf "fps=6,scale=540:960" -q:v 3 $Q/f6/f_%03d.jpg
ffmpeg -v error -i $SIL -vf "select=eq(n\,0)" -vframes 1 $Q/first.png; ffmpeg -v error -i $SIL -vf "select=eq(n\,1799)" -vframes 1 $Q/last.png
echo "== döngü SSIM"; ffmpeg -i $Q/first.png -i $Q/last.png -lavfi ssim -f null - 2>&1 | grep -o "All:[0-9.]*"
echo "== siyah kare"; ffmpeg -i $SIL -vf blackdetect=d=0.05:pix_th=0.05 -an -f null - 2>&1 | grep -c black_start || true
ffmpeg -v error -i $SIL -vf "scale=270:480,format=gray,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=$Q/diff.txt" -f null -
python3 - <<'PY'
import re
from PIL import Image, ImageDraw
Q='out/v14qc'
v=[float(x) for x in re.findall(r'YAVG=([\d.]+)',open(f'{Q}/diff.txt').read())]
print('== sıçrama>20:',[(i+1,round(x,1)) for i,x in enumerate(v) if x>20])
for b in range(6):
    c=Image.new('RGB',(6*216,5*(384+22)),'white'); d=ImageDraw.Draw(c)
    for i in range(30):
        n=b*30+i+1; im=Image.open(f'{Q}/f6/f_{n:03d}.jpg').resize((216,384))
        x=(i%6)*216; y=(i//6)*406; c.paste(im,(x,y+22)); d.text((x+4,y+5),f'{(n-1)/6:.2f}s',fill='black')
    c.save(f'{Q}/blok_{b}.jpg',quality=85)
PY
