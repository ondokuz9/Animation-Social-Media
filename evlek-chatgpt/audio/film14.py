"""VIDEO-1 v14 ses miksi — tamamen kodla sentez (numpy/scipy). Sample/kayıt/harici model yok.
Plan: docs/v14/kurul/plan.json (ses_plani). Zamanlar src/v14/tl.ts'den okunur.
Çalıştır: python3 audio/film14.py src/v14/tl.ts out/audio/v14  →  <out>_raw.wav (mastering: audio/master.sh)
Izgara: 104 BPM, 4/4, ölçü 2,30769 sn, faz 1,527 → 13 ölçü = 30,000 sn; dikişsiz döngü (kuyruk başa sarılır).
"""
import json, re, sys
import numpy as np
from scipy import signal
from synth import (SR, RNG, t_, silence, stereo, env_adsr, lp, hp, bp, peak, shelf_low, sat, noise, saw_bl, midi, make_ir, place, to_wav)

DUR = 30.0


def load_tl(path):
    s = open(path, encoding='utf-8').read()
    tl = {k: json.loads(v) for k, v in re.findall(r'(\w+):\s*(\[[^\]]*\]|[\d.]+)', s)}
    m = re.search(r'bpm:\s*([\d.]+),\s*phi:\s*([\d.]+)', s)
    return tl, float(m.group(1)), float(m.group(2))


def type_times(tl):
    q = "Lapta’da £160 bin altı,\ndeniz manzaralı 2+1 daire"
    t = tl['type'][0]; out = []
    for ch in q:
        out.append((np.ceil(t * 60) / 60, ch))
        t += 4 / 60 + (0.09 if ch == ' ' else 0.2 if ch == '\n' else 0)
    return out


# ---------------- akorlar (plan A) ----------------
CH = {
    'Gmaj9': (43, [55, 59, 62, 66, 69]), 'Em9': (40, [52, 55, 59, 62, 66]), 'Asus4': (45, [57, 62, 64]), 'A': (45, [57, 61, 64]),
    'Dmaj9': (38, [50, 54, 57, 61, 64]), 'Bm11': (35, [47, 50, 54, 57, 64]), 'Gmaj9#11': (43, [55, 59, 62, 66, 69, 73]),
    'A/C#': (37, [57, 61, 64]), 'D/F#': (42, [50, 54, 57, 62]), 'Dadd9': (38, [50, 57, 64, 66]), 'Bm9': (35, [47, 50, 54, 57, 61]),
}
# ölçü → [(vuruş, akor)]  (B0 = döngüden önceki B13)
PROG = {0: [(0, 'Gmaj9')], 1: [(0, 'Gmaj9')], 2: [(0, 'Em9')], 3: [(0, 'Asus4'), (2, 'A')], 4: [(0, 'Dmaj9')], 5: [(0, 'Bm11')],
        6: [(0, 'Gmaj9#11')], 7: [(0, 'Em9')], 8: [(0, 'Asus4'), (2, 'A/C#')], 9: [(0, 'D/F#')], 10: [(0, 'Gmaj9'), (3, 'A/C#')],
        11: [(0, 'Dadd9'), (2, 'Bm9')], 12: [(0, 'Em9')], 13: [(0, 'Gmaj9')], 14: [(0, 'Gmaj9')]}


# ---------------- enstrümanlar ----------------
def glass_pad(notes, dur, cutoff, amp=0.08):
    t = t_(dur)
    L = np.zeros_like(t); R = np.zeros_like(t)
    for m in notes:
        f = midi(m)
        for i, c in enumerate((-7, 0, 7)):
            v = saw_bl(f * 2 ** (c / 1200), t + RNG.uniform(0, 1) / f, maxf=7000)
            if i == 0: L += v
            elif i == 2: R += v
            else: L += 0.7 * v; R += 0.7 * v
        so = 0.1 * np.sin(2 * np.pi * f / 2 * t)
        L += so; R += so
    x = np.stack([L, R], 1) / (len(notes) * 2.6)
    x = lp(x, cutoff, 2)
    e = env_adsr(len(t), a=0.6, d=0.8, s=0.85, r=1.6)
    return x * e[:, None] * amp


def felt(m, dur=1.8, amp=0.12, pan=0.0):
    """keçe piyano: FM 1:1, hızla düşen indeks + çekiç gürültüsü."""
    t = t_(dur); f = midi(m)
    I = 1.4 * np.exp(-t / 0.25) + 0.1
    y = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t))
    y += 0.2 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.4)
    y *= env_adsr(len(t), a=0.003, d=0.7, s=0.2, r=0.45)
    ham = lp(noise(len(t)), 1200) * np.exp(-t / 0.006) * 0.1
    return stereo((y + ham) * amp, pan)


def ks_pluck(m, dur=0.9, amp=0.06, pan=0.0):
    """Karplus–Strong: pembe gürültü uyarımı, iki noktalı ortalama, geri besleme 0,985."""
    f = midi(m); N = int(round(SR / f)); n = int(dur * SR)
    buf = lp(noise(N), 6000); buf = buf / (np.max(np.abs(buf)) + 1e-9)
    out = np.zeros(n); idx = 0
    for i in range(n):
        j = (idx + 1) % N
        v = 0.985 * 0.5 * (buf[idx] + buf[j])
        out[i] = buf[idx]; buf[idx] = v; idx = j
    out = lp(out, 5500) * np.exp(-np.arange(n) / (0.6 * SR))
    return stereo(out * amp, pan)


def bass(m, dur, amp=0.12):
    t = t_(dur); f = midi(m)
    y = np.sin(2 * np.pi * f * t)
    y = np.tanh(2.2 * y) / np.tanh(2.2)          # 2.–5. harmonikler (telefonda duyulur)
    y = lp(y, 1100) * env_adsr(len(t), a=0.005, d=0.15, s=0.8, r=0.12)
    return stereo(y * amp)


def kick(amp=0.32):
    t = t_(0.5)
    f = 52 + 98 * np.exp(-t / 0.028)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
    knock = 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.035)
    click = hp(noise(len(t)), 2500) * np.exp(-t / 0.004) * 0.3
    return stereo(np.tanh(1.6 * (body + knock + click)) / np.tanh(1.6) * amp)


def rim(amp=0.06, pan=0.12):
    t = t_(0.12)
    y = (np.sin(2 * np.pi * 1700 * t) + 0.7 * np.sin(2 * np.pi * 2900 * t)) * np.exp(-t / 0.009)
    y += bp(noise(len(t)), 2000, 6000) * np.exp(-t / 0.006) * 0.5
    return stereo(y * amp, pan)


def mhat(amp=0.04, pan=0.18):
    """metalik hi-hat: 6 kare dalga (808 oranları) → HP 7,5 kHz, kapalı τ 22 ms."""
    t = t_(0.12)
    y = np.zeros_like(t)
    for f in (205.3, 304.4, 369.6, 522.7, 540.0, 800.0):
        y += signal.square(2 * np.pi * f * 3.5 * t)
    y = hp(y / 6, 7500, 4) * np.exp(-t / 0.022)
    return stereo(y * amp, pan)


def shimmer_gran(t0, t1, amp=0.018):
    """ton içi granüler ışıltı (D6 A6 E7 F#7), yoğunluk 8 → 24 tane/sn."""
    out = silence(t1 - t0 + 0.4)
    notes = [86, 93, 100, 102]; tt = 0.0; i = 0
    g = t_(0.04); win = np.hanning(len(g))
    while tt < t1 - t0:
        dens = 8 + 16 * (tt / (t1 - t0))
        m = notes[i % 4]; i += 1
        grain = np.sin(2 * np.pi * midi(m) * g) * win * amp
        place(out, stereo(grain, RNG.uniform(-0.5, 0.5)), tt)
        tt += 1 / dens
    return out


# ---------------- arayüz efektleri (3 katman; her vuruşta küçük varyasyon) ----------------
def vary():
    return 1 + RNG.uniform(-0.03, 0.03), 10 ** (RNG.uniform(-1.5, 1.5) / 20)


def key_tick(level_db=-42, space=False, pan=0.0):
    pf, g = vary(); t = t_(0.055 if space else 0.04)
    click = bp(np.sin(np.pi * np.clip(t / 0.0015, 0, 1)) * (t < 0.0015) + noise(len(t)) * (t < 0.002) * 0.3, 3500, 6000)
    res = sum(np.sin(2 * np.pi * f * pf * t) for f in ((1400,) if space else (1900, 3100))) * np.exp(-t / 0.006) * 0.4
    th = np.sin(2 * np.pi * (320 if space else 420) * pf * t) * np.exp(-t / 0.008) * 0.25
    y = click * 2 + res + th
    y = y / (np.max(np.abs(y)) + 1e-9) * 10 ** (level_db / 20) * g
    return stereo(y, pan)


def tap(level_db=-22, pan=0.0):
    pf, g = vary(); t = t_(0.09)
    click = hp(noise(len(t)), 3000) * np.exp(-t / 0.0008) * 0.32
    f = (310 - 50 * (t / 0.02).clip(0, 1)) * pf
    tok = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.022)
    body = bp(noise(len(t)), 900, 1500) * np.exp(-t / 0.01) * 0.4
    hapt = np.tanh(3 * signal.square(2 * np.pi * 170 * t)) * np.exp(-t / 0.012) * 0.12 * (t < 0.025)
    y = click + tok + body + hapt
    return stereo(y / np.max(np.abs(y)) * 10 ** (level_db / 20) * g, pan)


def send_snd(level_db=-17):
    t = t_(0.2)
    f = 380 + 380 * (1 - np.exp(-t / 0.02))
    pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06)
    air = bp(noise(len(t)), 1000, 4000) * np.exp(-t / 0.015) * 0.3 * (t < 0.03)
    y = pop + air
    return stereo(y / np.max(np.abs(y)) * 10 ** (level_db / 20))


def tone_pair(f1, f2, tau, dur, level_db, paper=False):
    t = t_(dur)
    y = (np.sin(2 * np.pi * f1 * t) + 0.6 * np.sin(2 * np.pi * f2 * t)) * np.exp(-t / tau)
    if paper:
        y += bp(noise(len(t)), 600, 2000) * np.exp(-t / 0.025) * 0.5
    return stereo(y / np.max(np.abs(y)) * 10 ** (level_db / 20))


def detent(level_db=-36):
    t = t_(0.03)
    y = hp(noise(len(t)), 3000) * np.exp(-t / 0.0006) + np.sin(2 * np.pi * 2600 * t) * np.exp(-t / 0.005) * 0.6
    return stereo(y / np.max(np.abs(y)) * 10 ** (level_db / 20))


def friction(dur, level_db, env):
    t = t_(dur)
    env = np.interp(np.linspace(0, 1, len(t)), np.linspace(0, 1, len(env)), env)
    x = lp(noise(len(t)), 5000)
    x = hp(x, 2000)
    y = x * env
    m = np.sin(2 * np.pi * 220 * t) * env * 0.05
    y = y + m
    return y / (np.max(np.abs(y)) + 1e-9) * 10 ** (level_db / 20)


def sea(dur, amp=0.012):
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for c in range(2):
        b = np.cumsum(RNG.standard_normal(n)); b = hp(b - np.mean(b), 40); b = lp(b, 700)
        b = b / (np.max(np.abs(b)) + 1e-9)
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * np.arange(n) / SR + c * 1.3 + RNG.uniform(0, 6))
        spr = bp(RNG.standard_normal(n), 3000, 8000) * 0.04
        out[:, c] = (b * lfo + spr) * amp
    e = env_adsr(n, a=0.6, d=0.1, s=1.0, r=0.6)
    return out * e[:, None]


IR_UI = None


def ui_room(x, wet=0.08):
    global IR_UI
    if IR_UI is None:
        IR_UI = make_ir(0.35, predelay=0.007, damp=7000, size=0.4, seed=11)
    y = np.stack([signal.fftconvolve(x[:, c], IR_UI[:, c])[: len(x)] for c in range(2)], 1)
    return x + y * wet * 3


def logo_note(m, level_db, sub=False):
    t = t_(3.2); f = midi(m)
    k = felt(m, 3.2, 1.0)[:, 0]
    gl = (0.12 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)) * np.exp(-t / 1.2)
    y = k + gl
    if sub:
        y += 0.5 * (np.sin(2 * np.pi * 73.4 * t) + 0.5 * np.sin(2 * np.pi * 147 * t)) * np.exp(-t / 0.9)
    y = y / np.max(np.abs(y)) * 10 ** (level_db / 20)
    return stereo(y)


# ---------------- müzik ----------------
def music(tl, bpm, phi):
    beat = 60 / bpm; bar = 4 * beat
    tail = 4.0; n = int((DUR + tail + bar) * SR)
    off = bar                                       # B0'ı çizebilmek için (negatif zaman) kaydırma
    bus = {k: np.zeros((n, 2)) for k in ('pad', 'keys', 'pluck', 'bass', 'drums', 'fx')}
    T = lambda bi, b=0: phi + (bi - 1) * bar + b * beat + off
    drums_on = (4, 11, 2)                           # B4 → B11 3. vuruş
    for bi in range(0, 15):
        chords = PROG.get(bi, [(0, 'Gmaj9')])
        for j, (b, name) in enumerate(chords):
            end_b = chords[j + 1][0] if j + 1 < len(chords) else 4
            root, notes = CH[name]
            t0 = T(bi, b); d = (end_b - b) * beat
            # ped filtresi: kamera açılışı ve build
            tc = t0 - off
            cut = 900 if tc < 2.4 else 1600 if tc < 7.296 else 4000 if tc < 8.45 else 4200
            place(bus['pad'], glass_pad(notes, d + 1.6, cut, 0.075), t0)
            # keçe: ölçü başı akorları (6–12 ms strum)
            if b == 0 or name in ('A', 'A/C#', 'Bm9'):
                for i, m in enumerate(notes[1:]):
                    place(bus['keys'], felt(m + 12, 2.0, 0.034, pan=(i - 2) * 0.1), t0 + 0.008 * i)
            # bas
            if (4 <= bi < 11) or (bi == 11 and b < 2):
                place(bus['bass'], bass(root + 12, d * 0.96, 0.055), t0)
        # pluck ostinato (B2–B10, B7 hariç), 8'lik; 7,873–8,45 16'lık
        if 2 <= bi <= 10 and bi != 7:
            pat = [74, 69, 76, 69, 78, 69, 76, 69]
            for i, m in enumerate(pat):
                at = T(bi, i * 0.5) + RNG.normal(0, 0.005)
                place(bus['pluck'], ks_pluck(m, 0.8, 0.07, pan=0.25 if i % 2 else -0.25), at)
        if bi == 3:
            for i in range(8):
                at = T(3, 2.7) + i * beat / 4
                if at - off < 8.45: place(bus['pluck'], ks_pluck(81 if i % 2 else 76, 0.4, 0.035, pan=0.2 * (-1) ** i), at)
        # davul
        if 4 <= bi <= 11:
            last = 4 if bi < 11 else 2
            for b in range(last):
                at = T(bi, b)
                if bi != 7 and b == 0: place(bus['drums'], kick(0.2), at)
                if bi != 7 and b == 2 and last > 2: place(bus['drums'], kick(0.14), at + beat / 2)
                if b == 2: place(bus['drums'], rim(0.05), at + RNG.normal(0, 0.004))
                for h in range(2):
                    place(bus['drums'], mhat(0.11 if h == 0 else 0.07), at + h * beat / 2 + RNG.normal(0, 0.005))
    # ışıltı (build)
    place(bus['fx'], shimmer_gran(7.8, 8.45), 7.8 + off)
    # sidechain: bas kick'e (−4 dB)
    k_env = np.abs(bus['drums'][:, 0]); k_env = signal.lfilter([1], [1, -np.exp(-1 / (0.11 * SR))], k_env) * (1 - np.exp(-1 / (0.11 * SR)))
    bus['bass'] *= (1 - np.clip(k_env * 6, 0, 0.37))[:, None]
    mix = bus['pad'] + bus['keys'] * 1.0 + bus['pluck'] * 0.9 + bus['bass'] * 1.0 + bus['drums'] * 0.85 + bus['fx']
    # nefes: düşüşten önceki 16'lık (ped dışında −12 dB)
    a, b = int((8.306 + off) * SR), int((8.45 + off) * SR)
    mix[a:b] = bus['pad'][a:b] + (mix[a:b] - bus['pad'][a:b]) * 0.25
    plate = make_ir(2.6, predelay=0.022, damp=6000, size=1.1, seed=3)
    wet = np.stack([signal.fftconvolve(mix[:, c], plate[:, c])[: len(mix)] for c in range(2)], 1)
    mix = mix + wet * 0.28
    # döngü: [off, off+30) al; öncesi ve sonrası başa/sona sarılır
    s0 = int(off * SR); k = int(DUR * SR)
    out = mix[s0:s0 + k].copy()
    rest = mix[s0 + k:]; out[: min(k, len(rest))] += rest[:k]
    pre = mix[:s0]; out[k - len(pre):] += pre
    return out


def ui(tl):
    n = int(DUR * SR); bus = np.zeros((n, 2))
    pan = lambda x: 0.4 * (x - 540) / 540
    # giriş: logo → çip
    place(bus, logo_note(74, -27), tl['sig'][0])
    a = np.linspace(0, 1, int(0.65 * SR)); hv = stereo(bp(noise(len(a)), 800, 3000) * np.sin(np.pi * a) * 0.01)
    place(bus, hv, tl['sig'][0])
    place(bus, logo_note(69, -27), tl['sig'][1]); place(bus, tap(-28), tl['sig'][1])
    # yazma
    prev = ' '
    for at, ch in type_times(tl):
        if ch in ' \n':
            place(bus, key_tick(-25, True), at)
        else:
            place(bus, key_tick(-26 if prev in ' \n' else -33, False, RNG.uniform(-0.1, 0.1)), at)
        prev = ch
    place(bus, tap(-22, pan(900)), tl['send'] - 0.01); place(bus, send_snd(-17), tl['send'])
    t = t_(0.38); bal = stereo(lp(np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1318.5 * 1.001 * t), 3000) * np.sin(np.pi * t / 0.38) * 0.02)
    place(bus, bal, tl['rise'][0])
    place(bus, tone_pair(240, 480, 0.06, 0.4, -19, paper=True), tl['res'][0])
    place(bus, felt(78, 1.6, 0.05), tl['slogan'][1])
    # kaydırma + sürükleme
    d = tl['scroll'][1] - tl['scroll'][0]; e = np.sin(np.pi * np.linspace(0, 1, int(d * SR))) ** 1.5
    place(bus, stereo(friction(d, -38, e)), tl['scroll'][0])
    d = tl['coast'][1] - tl['drag'][0]; tt = np.linspace(0, d, int(d * SR))
    v = np.where(tt < tl['drag'][1] - tl['drag'][0], 1.0, np.exp(-(tt - (tl['drag'][1] - tl['drag'][0])) / 0.32))
    place(bus, stereo(friction(d, -32, v), 0.0), tl['drag'][0])
    for k in range(2): place(bus, detent(-30), tl['drag'][0] + 0.28 + k * 0.3)
    place(bus, tone_pair(240, 480, 0.06, 0.3, -22, paper=True), tl['coast'][1])
    place(bus, tap(-17, pan(420)), tl['tap'])
    place(bus, tone_pair(180, 360, 0.08, 0.5, -24), tl['expand'][1])
    # ev: deniz
    place(bus, sea(tl['portalIn'][1] - tl['portalOut'][0] + 0.3), tl['portalOut'][0])
    place(bus, tone_pair(180, 360, 0.08, 0.5, -26), tl['portalIn'][1])
    # galeri, emlakçıya sor, kapat
    d = tl['swipe'][1] - tl['swipe'][0] + 0.1; place(bus, stereo(friction(d, -32, np.sin(np.pi * np.linspace(0, 1, int(d * SR))))), tl['swipe'][0])
    place(bus, tone_pair(200, 400, 0.05, 0.3, -28), tl['page2'][1])
    place(bus, tap(-16, pan(881)), tl['contact'])
    place(bus, tap(-16, pan(110)), tl['close'])
    place(bus, tone_pair(180, 360, 0.08, 0.5, -28), tl['collapse'][1])
    # eklenti
    for at, m in ((tl['menu'], 69), (tl['plugOpen'][0], 71), (tl['page'][0], 73)):
        place(bus, felt(m, 1.4, 0.05), at); place(bus, ks_pluck(m + 12, 0.6, 0.02), at)
    for k, x in (('menu', 110), ('plug', 260), ('searchTap', 589), ('row', 330), ('tryTap', 589)):
        place(bus, tap(-17 if k != 'searchTap' else -19, pan(x)), tl[k])
    for k in ('side', 'plugOpen', 'page', 'newChat'):
        place(bus, detent(-36), tl[k][1])
    a, b = tl['ptype']
    for i in range(5): place(bus, key_tick(-30 if i == 0 else -40), np.ceil((a + i * 4 / 60) * 60) / 60)
    place(bus, tone_pair(240, 480, 0.05, 0.3, -32, paper=True), tl['pres'])
    place(bus, tap(-18, 0.0), tl['install'])
    for k in range(3): place(bus, stereo(np.sin(2 * np.pi * (2400 + 200 * k) * t_(0.03)) * np.exp(-t_(0.03) / 0.004) * 10 ** (-36 / 20)), tl['spin'][0] + 0.15 * k)
    # Bağlı: mandal (iki klik 9 ms) + D5/A5 keçe
    m1 = detent(-22); place(bus, m1, tl['bound']); place(bus, m1, tl['bound'] + 0.009)
    place(bus, felt(74, 1.8, 0.09, -0.1), tl['bound'] + 0.012); place(bus, felt(81, 1.8, 0.07, 0.1), tl['bound'] + 0.019)
    # kapanış imzası 'Ev·lek'
    place(bus, logo_note(69, -24), tl['back'][0])
    a = t_(0.12); place(bus, stereo(bp(noise(len(a)), 800, 3000) * np.sin(np.pi * a / 0.12) * 10 ** (-40 / 20)), tl['back'][1] - 0.12)
    place(bus, logo_note(74, -19, sub=True), tl['back'][1])
    bus = ui_room(bus, 0.08)
    # oda tonu: pembe gürültü −62 dBFS RMS
    pn = signal.lfilter([0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400], RNG.standard_normal((n, 2)), axis=0)
    pn = pn / np.sqrt(np.mean(pn ** 2)) * 10 ** (-62 / 20)
    return bus + pn


def master_pre(x):
    x = hp(hp(x, 30), 30)                   # 24 dB/okt
    x = shelf_low(x, 150, -4.0)
    x = peak(x, 250, 1.0, -2.0)
    x = peak(x, 1600, 0.8, 1.5)
    x = peak(x, 2800, 0.9, 2.5)
    x = peak(x, 7000, 0.6, 4.0)
    x = peak(x, 11000, 0.7, 3.0)
    # yapıştırıcı kompresör 2:1 (RMS, atak 30 ms, bırakma 200 ms), ≤2 dB
    env = np.sqrt(signal.lfilter([1 - np.exp(-1 / (0.03 * SR))], [1, -np.exp(-1 / (0.03 * SR))], np.mean(x ** 2, 1)))
    lvl = 20 * np.log10(env + 1e-9); thr = np.percentile(lvl, 85)
    gr = np.clip((lvl - thr) * 0.5, 0, 2.0)
    x = x * (10 ** (-gr / 20))[:, None]
    x = np.tanh(1.3 * x) / np.tanh(1.3) if np.max(np.abs(x)) > 0 else x
    return x


def main():
    tl, bpm, phi = load_tl(sys.argv[1]); out = sys.argv[2]
    m = music(tl, bpm, phi); u = ui(tl)
    # sidechain: müzik UI'ya −2,5 dB
    e = np.abs(u).max(1); e = signal.lfilter([1 - np.exp(-1 / (0.18 * SR))], [1, -np.exp(-1 / (0.18 * SR))], e)
    duck = 1 - np.clip(e / (np.max(e) + 1e-9) * 1.2, 0, 0.25)
    mix = m * duck[:, None] + u * 1.6
    pad_n = SR  # dairesel dolgu: filtreler döngü dikişinde süreksizlik üretmesin
    mix = master_pre(np.concatenate([mix[-pad_n:], mix, mix[:pad_n]]))[pad_n:-pad_n]
    mix = mix / np.max(np.abs(mix)) * 0.5
    to_wav(out + '_raw.wav', mix)
    to_wav(out + '_music.wav', m / np.max(np.abs(m)) * 0.5)
    to_wav(out + '_ui.wav', u / np.max(np.abs(u)) * 0.5)
    print('tamam', out)


if __name__ == '__main__':
    main()
