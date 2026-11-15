#!/usr/bin/env bash
# v16 QC: transfer etiketi (yeniden kodlamasız), ses mux (-c:v copy), ffprobe, video MD5, ses ölçümü, 6 fps bloklar,
# 360 px okunurluk ızgarası, siyah kare, kare farkı, telefon bandı ses testi.   Kullanım: bash scripts/v16-qc.sh
set -e
cd "$(dirname "$0")/.."
# ses masteri: LRA=20 bash audio/master.sh out/audio/v16_raw.wav out/audio/v16_master_48k.wav (doğrusal kazanç; dinamik moda düşmesin)
Q=out/v16qc; rm -rf $Q; mkdir -p $Q/f6
SIL=out/evlek_chatgpt_FINAL_1080x1920_60fps_sessiz.mp4
FIN=out/evlek_chatgpt_FINAL_1080x1920_60fps.mp4
ffmpeg -v error -y -i out/v16.mp4 -c copy -bsf:v h264_metadata=transfer_characteristics=1 -movflags +faststart $SIL
ffmpeg -v error -y -i $SIL -i out/audio/v16_master_48k.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart -shortest $FIN
echo "== ffprobe"; ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height,nb_frames,r_frame_rate,color_space,color_transfer,color_primaries,sample_rate,channels -show_entries format=duration,size -of compact $FIN
echo "== video md5 (sessiz = sesli olmalı)"; ffmpeg -v error -i $SIL -map 0:v -f md5 -; ffmpeg -v error -i $FIN -map 0:v -f md5 -
echo "== ses"; ffmpeg -hide_banner -i $FIN -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA):|Peak:"
ffmpeg -hide_banner -i out/audio/v16_master_48k.wav -af loudnorm=print_format=summary -f null - 2>&1 | grep "Input True Peak"
sha256sum $SIL $FIN out/audio/v16_master_48k.wav
ffmpeg -v error -i $SIL -vf "fps=6,scale=540:960" -q:v 3 $Q/f6/f_%03d.jpg
ffmpeg -v error -y -ss 0.8 -i $SIL -frames:v 1 out/evlek_chatgpt_FINAL_kapak.png
echo "== siyah kare"; ffmpeg -i $SIL -vf blackdetect=d=0.05:pix_th=0.05 -an -f null - 2>&1 | grep -c black_start || true
ffmpeg -v error -i $SIL -vf "scale=270:480,format=gray,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=$Q/diff.txt" -f null -
python3 - <<'PY'
import re, glob
import numpy as np
from PIL import Image, ImageDraw
Q='out/v16qc'
v=[float(x) for x in re.findall(r'YAVG=([\d.]+)',open(f'{Q}/diff.txt').read())]
print('== sıçrama>20:',[(i+1,round((i+1)/60,2),round(x,1)) for i,x in enumerate(v) if x>20])
fs=sorted(glob.glob(f'{Q}/f6/f_*.jpg')); print('kare (6 fps):',len(fs))
for b in range((len(fs)+29)//30):
    c=Image.new('RGB',(6*216,5*(384+22)),'white'); d=ImageDraw.Draw(c)
    for i in range(30):
        n=b*30+i
        if n>=len(fs): break
        im=Image.open(fs[n]).resize((216,384)); x=(i%6)*216; y=(i//6)*406; c.paste(im,(x,y+22)); d.text((x+4,y+5),f'{n/6:.2f}s',fill='black')
    c.save(f'{Q}/blok_{b}.jpg',quality=85)
# siyah oranı (maks kanal < 26), saniyede bir
bl=[]
for n in range(0,len(fs),6):
    a=np.array(Image.open(fs[n]).convert('RGB')).max(2); bl.append(round(float((a<26).mean())*100))
print('== siyah oranı % (her sn):',bl,'| en çok',max(bl))
# 360 px okunurluk: 2 fps
k=fs[::3]; c=Image.new('RGB',(10*364,((len(k)+9)//10)*(640+22)),'white'); d=ImageDraw.Draw(c)
for i,f in enumerate(k):
    im=Image.open(f).resize((360,640)); x=(i%10)*364; y=(i//10)*662; c.paste(im,(x,y+22)); d.text((x+4,y+5),f'{i/2:.1f}s',fill='black')
c.save(f'{Q}/izgara_360.jpg',quality=85)
PY
python3 - <<'PY'
# ses testi (ses raporu): 300 Hz–12 kHz mono; olaydan 50 ms önce/sonra RMS farkı
import re, json, subprocess, numpy as np
from scipy import signal
from scipy.io import wavfile
sr,x=wavfile.read('out/audio/v16_master_48k.wav'); x=x.astype(float); m=x.mean(1)
y=signal.sosfilt(signal.butter(4,[300,12000],'bandpass',fs=sr,output='sos'),m)
s=open('src/v16/tl.ts').read(); g=lambda k: json.loads(re.search(r'\b'+k+r':\s*(\[[^\]]*\]|-?[\d.]+)',s).group(1))
def jump(t): i=int(t*sr); w=int(0.05*sr); r=lambda z: np.sqrt(np.mean(z**2)+1e-12); return 20*np.log10(r(y[i:i+w])/r(y[i-w:i]))
ev={'sonuç':g('res')[0],'dokunuş (kart)':g('tap'),'dokunuş (emlakçı)':g('contact'),'dokunuş (kur)':g('install'),'Bağlı':g('bound'),'kapanış':g('end')[0]}
print('== telefon bandı sıçrama (dB):',{k:round(jump(v),1) for k,v in ev.items()})
L=x[:,0]; R=x[:,1]; st=signal.sosfilt(signal.butter(4,[300,12000],'bandpass',fs=sr,output='sos'),x,axis=0)
r=lambda z: 10*np.log10(np.mean(z**2)+1e-12)
print('== mono toplama kaybı (dB):', round((r(st[:,0])+r(st[:,1]))/2 - r(st.mean(1)),2))
sec=[('açılış',0,1.4),('yazma',2.0,3.5),('sonuç+groove',4.5,8.9),('ev',9.5,11.5),('ilan',11.5,13.5),('CTA',13.5,16.0),('kapanış',16.0,17.5)]
print('== bölüm seviyesi (dBFS):',{n:round(r(m[int(a*sr):int(b*sr)]),1) for n,a,b in sec})
PY
