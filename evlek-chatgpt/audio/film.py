"""Evlek "artık ChatGPT'de" filmi için müzik + efekt miksi (tamamen sentez).
Çalıştır:  python3 audio/film.py src/v14/tl.ts out/audio/v14
Çıktı: <out>_music.wav, <out>_sfx.wav, <out>_mix_raw.wav (mastering ffmpeg ile: loudnorm −14 LUFS, −1 dBTP)
Müzik: 96 BPM, 30 sn = 12 ölçü (dikişsiz döngü), D majör / B minör, akor başına bir ölçü.
"""
import json, re, sys
import numpy as np
from synth import *

DUR = 30.0
BPM = 96
BEAT = 60 / BPM          # 0,625 sn
BAR = 4 * BEAT           # 2,5 sn → 12 ölçü


def load_tl(path):
    s = open(path, encoding='utf-8').read()
    tl = {}
    for k, v in re.findall(r'(\w+):\s*(\[[^\]]*\]|[\d.]+)', s):
        tl[k] = json.loads(v)
    return tl


# akorlar (MIDI): 12 ölçü = 3 × [Gmaj9, D/F#, Bm9, A6sus]
PROG = [
    [55, 62, 66, 69, 71],   # Gmaj9  G D F# A B
    [54, 62, 66, 69, 73],   # D/F#   F# D F# A C#
    [47, 62, 66, 69, 73],   # Bm9    B D F# A C#
    [57, 64, 66, 69, 71],   # A6sus  A E F# A B
]
BASS = [43, 42, 47, 45]


def music(tl, dur=DUR):
    """bölümlere göre yoğunlaşan müzik; 4 sn kuyruk başa sarılır (dikişsiz döngü)."""
    tail = 4.0
    n = int((dur + tail) * SR)
    bus = {k: np.zeros((n, 2)) for k in ('pad', 'keys', 'bass', 'drums')}
    g_dev = tl.get('send', 6.2)               # gelişme: ritim gönderle girer
    g_res = tl.get('res', [7.8])[0]
    cut = tl.get('cut', 19.3)                 # sonuç bölümü
    back = tl.get('back', [25.35])[0]         # kapanış: çip → logo
    for bar in range(int((dur + tail) / BAR) + 1):
        t0 = bar * BAR
        ch = PROG[bar % 4]
        # ped: her zaman (döngünün yatağı)
        place(bus['pad'], pad(ch, BAR + 1.4, bright=2800 if t0 < g_res else 4200, amp=0.16 if t0 < g_res else 0.12, attack=0.6, release=1.4), t0)
        # elektrik piyano arpeji: yazma başlayınca (8'lik, insan zamanlaması)
        if tl.get('type', [3])[0] - 0.4 <= t0 < back:
            pat = [0, 2, 3, 4, 2, 3, 1, 4]
            for i, p in enumerate(pat):
                at = t0 + i * BEAT / 2 + RNG.normal(0, 0.006)
                vel = 0.9 if i % 2 == 0 else 0.7
                place(bus['keys'], epiano(ch[p] + 12, 1.2, 0.085 * vel, idx=2.0, pan=(-0.3 if i % 2 else 0.3)), at)
        # bas ve davul: sonuç gelince (gelişmenin ortası) başlar, kapanışta çekilir
        if g_res - 0.01 <= t0 < back:
            place(bus['bass'], sub(BASS[bar % 4] + 12, BAR * 0.95, 0.09), t0)
            for b in range(4):
                at = t0 + b * BEAT
                if b in (0, 2):
                    place(bus['drums'], kick(0.26), at)
                if b in (1, 3):
                    place(bus['drums'], rim(0.07), at + RNG.normal(0, 0.004))
                for h in range(2):
                    place(bus['drums'], hat(0.055 if h else 0.075), at + h * BEAT / 2 + RNG.normal(0, 0.003))
                if t0 >= cut:
                    place(bus['drums'], shaker(0.03), at + BEAT * 0.75)
        # ilk girişte (gönder) tek bir hafif vuruş
    place(bus['drums'], kick(0.35), g_dev + 0.02)
    # bölüm geçişi (sonuç): bir vuruşluk nefes — ped filtresi kısılır (ana bus'ta seviye ile)
    mix = bus['pad'] * 1.0 + bus['keys'] * 0.9 + bus['bass'] * 0.9 + bus['drums'] * 0.8
    mix = reverb(mix, 0.22)
    # kuyruğu başa sar (döngü)
    k = int(dur * SR)
    out = mix[:k].copy()
    out[: len(mix) - k] += mix[k:]
    return out


def sfx(tl, dur=DUR):
    n = int(dur * SR)
    bus = np.zeros((n, 2))
    g = lambda k, i=0, d=None: (tl[k][i] if isinstance(tl.get(k), list) else tl.get(k, d))
    # GİRİŞ: logo → çip
    if 'sig' in tl:
        place(bus, air(0.7, 0.035), tl['sig'][0])
        place(bus, tap(0.10), tl['sig'][1] - 0.02)
    # yazma: her harfte tık (gerçek yazma ritmi)
    q = "Lapta’da £160 bin altı,\ndeniz manzaralı 2+1 daire"
    if 'type' in tl:
        a, b = tl['type']; p0, p1 = tl.get('typePause', [a, a])
        n1 = q.index('\n') + 1
        times = [a + (p0 - a) * i / n1 for i in range(n1)] + [p1 + (b - p1) * i / (len(q) - n1) for i in range(len(q) - n1)]
        for i, at in enumerate(times):
            if q[i] in ' \n':
                place(bus, key_tick(0.05, RNG.uniform(-1, 1), 0.05), at)  # boşluk: daha tok
            else:
                place(bus, key_tick(0.07, RNG.uniform(-1, 1), RNG.uniform(-0.1, 0.1)), at + RNG.normal(0, 0.004))
    for k in ('send',):
        if k in tl: place(bus, send(0.11), tl[k])
    if 'search' in tl: place(bus, shimmer(tl['search'][1] - tl['search'][0] + 0.2, 0.03), tl['search'][0])
    if 'res' in tl: place(bus, settle(0.09), tl['res'][0])
    if 'drag' in tl: place(bus, swipe(tl['drag'][1] - tl['drag'][0] + 0.2, 0.045), tl['drag'][0] - 0.1)
    if 'scroll' in tl: place(bus, swipe(tl['scroll'][1] - tl['scroll'][0] + 0.1, 0.03, up=False), tl['scroll'][0])
    for k in ('tap', 'next', 'contact', 'menu', 'plug', 'searchTap', 'row', 'install', 'tryTap'):
        if k in tl: place(bus, tap(0.12), tl[k])
    if 'expand' in tl: place(bus, air(0.6, 0.05), tl['expand'][0])
    if 'portalOut' in tl: place(bus, air(0.8, 0.06), tl['portalOut'][0])
    if 'portalIn' in tl: place(bus, air(0.7, 0.045, rise=False), tl['portalIn'][0])
    if 'ptype' in tl:
        a, b = tl['ptype']
        for i in range(5):
            place(bus, key_tick(0.06, RNG.uniform(-1, 1)), a + (b - a) * i / 5)
    for k in ('side', 'plugOpen', 'page', 'newChat'):
        if k in tl: place(bus, swipe(0.35, 0.025), tl[k][0])
    if 'bound' in tl: place(bus, confirm(0.11), tl['bound'])
    if 'back' in tl: place(bus, sonic_logo(0.08), tl['back'][0] + 0.3)
    if 'title2' in tl:
        a, b = tl['title2']; s = "artık ChatGPT’de."
        for i in range(len(s)):
            if s[i] != ' ': place(bus, key_tick(0.045, RNG.uniform(-1, 1)), a + (b - a) * i / len(s))
    return bus


def main():
    tl = load_tl(sys.argv[1]); out = sys.argv[2]
    m = music(tl); s = sfx(tl)
    # müzik, efektlerin altında hafifçe çekilsin (ducking): efekt zarfı
    env = np.abs(s).max(1)
    env = np.convolve(env, np.ones(int(0.08 * SR)) / int(0.08 * SR), 'same')
    duck = 1 - np.clip(env * 2.5, 0, 0.35)
    m = m * duck[:, None]
    mix = m * 0.85 + s * 1.0
    mix = hp(mix, 45)
    mix = shelf_low(mix, 160, -4.0)          # telefon hoparlörü: çamur azalt
    mix = peak(mix, 2800, 0.8, 3.0)          # netlik
    mix = peak(mix, 9000, 0.7, 2.5)          # hava
    mix = sat(mix * 1.1, 1.1) * 0.8
    pk = np.max(np.abs(mix)); mix = mix / pk * 0.7
    to_wav(out + '_music.wav', m / np.max(np.abs(m)) * 0.7)
    to_wav(out + '_sfx.wav', s / np.max(np.abs(s)) * 0.7)
    to_wav(out + '_mix_raw.wav', mix)
    print('tamam', out, 'tepe', pk)


if __name__ == '__main__':
    main()
