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
    blk = s[s.index('export const TL'):]
    blk = blk[: blk.index('};')]
    tl = {k: json.loads(v) for k, v in re.findall(r'(\w+):\s*(\[[^\]]*\]|[\d.]+)', blk)}
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


# ---------------- lansman katmanları (v15) ----------------
def clap(amp=0.07, pan=0.0):
    t = t_(0.25); y = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        s0 = int(d * SR); seg = bp(noise(len(t) - s0), 900, 3200) * np.exp(-np.arange(len(t) - s0) / (0.006 * SR)); y[s0:] += seg
    y += bp(noise(len(t)), 1000, 2500) * np.exp(-t / 0.09) * 0.5
    return stereo(y / np.max(np.abs(y)) * amp, pan)


def open_hat(amp=0.035, pan=0.2):
    t = t_(0.3); y = np.zeros_like(t)
    for f in (205.3, 304.4, 369.6, 522.7, 540.0, 800.0):
        y += signal.square(2 * np.pi * f * 3.5 * t)
    y = hp(y / 6, 7000, 4) * np.exp(-t / 0.09)
    return stereo(y * amp, pan)


def synth_bass(m, dur, amp=0.05):
    t = t_(dur); f = midi(m)
    y = saw_bl(f, t, 3000) * 0.6 + np.sin(2 * np.pi * f * t)
    cut = 300 + 1500 * np.exp(-t / 0.08)
    y = lp(y, 900) * 0.6 + lp(y, 2400) * np.exp(-t / 0.08) * 0.4
    y = np.tanh(1.8 * y) * env_adsr(len(t), a=0.004, d=0.12, s=0.6, r=0.06)
    return stereo(y * amp)


def fm_bell(ms, dur=3.0, amp=0.03):
    out = None
    for i, m in enumerate(ms):
        t = t_(dur); f = midi(m)
        y = np.sin(2 * np.pi * f * t + 1.8 * np.exp(-t / 0.5) * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t / 1.1)
        y = stereo(y * amp, (-0.3, 0.3, 0.0)[i % 3])
        out = y if out is None else out + y
    return out


def impact(amp=0.5, f0=36.7, fs=110, tau=0.05, bells=(86, 93)):
    t = t_(2.2)
    f = f0 + fs * np.exp(-t / tau)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45)
    air = hp(noise(len(t)), 6000) * np.exp(-t / 0.25) * 0.08
    y = stereo(np.tanh(1.5 * sub) * amp) + stereo(air)
    y[: len(t)] += fm_bell(bells, 2.2, 0.035)[: len(t)]
    return y


def reverse_swell(dur, amp=0.05, lo=800, hi=5000):
    t = t_(dur); k = t / dur
    x = noise(len(t))
    y = lp(x, hi) * 0.5 + bp(x, lo, hi) * 0.5
    return stereo(y * (k ** 2.2) * amp)


def saw_stab(notes, dur=1.6, amp=0.06):
    t = t_(dur); y = np.zeros_like(t)
    for m in notes:
        for c in (-8, 0, 8):
            y += saw_bl(midi(m) * 2 ** (c / 1200), t, 6000)
    y = lp(y / (len(notes) * 3), 3500) * np.exp(-t / 0.5)
    return stereo(y * amp)


# ---------------- müzik (v15: döngü sarması yok, lansman yapısı) ----------------
def music(tl, bpm, phi):
    beat = 60 / bpm; bar = 4 * beat
    n = int((DUR + 5) * SR)
    bus = {k: np.zeros((n, 2)) for k in ('pad', 'keys', 'pluck', 'bass', 'drums', 'fx')}
    T = lambda bi, b=0: phi + (bi - 1) * bar + b * beat
    FINAL = tl['back'][1]                        # 26,911 (B12)
    # açılış (0–1,4): filtreli ostinato + D2 drone + sub nabzı
    for i in range(12):
        at = 0.08 + i * beat / 2
        m = [74, 69, 76, 69][i % 4]
        p = ks_pluck(m, 0.7, 0.03 + 0.03 * i / 11, pan=0.25 if i % 2 else -0.25)
        place(bus['pluck'], lp(p, 500 + 700 * i / 11), at)
    dr = stereo(np.sin(2 * np.pi * midi(38) * t_(3.0)) * env_adsr(int(3.0 * SR), a=0.45, d=0.3, s=0.8, r=1.2) * 0.05)
    place(bus['pad'], dr, 0.12)
    for k, at in enumerate((0.373, 0.950, 1.527, 2.104, 2.681)):
        tt = t_(0.5); place(bus['bass'], stereo(np.sin(2 * np.pi * 55 * tt) * np.exp(-tt / 0.18) * (0.05 + 0.025 * k)), at)
    # kamera itişi (2,2–3,12): Asus4 testere swell + 3,12 mini varış
    d = tl['push'][1] - tl['push'][0]
    sw = saw_stab([57, 62, 64, 69], d + 0.05, 1.0)[:, 0] * 0
    tt = t_(d); y = np.zeros_like(tt)
    for m in (57, 62, 64, 69):
        y += saw_bl(midi(m), tt, 5000)
    cut = 800 + 4200 * (tt / d) ** 1.5
    y = lp(y, 1600) * (1 - tt / d) + lp(y, 5000) * (tt / d)
    place(bus['fx'], stereo(y / 4 * (0.012 + 0.06 * (tt / d) ** 2)), tl['push'][0])
    place(bus['bass'], stereo(np.sin(2 * np.pi * midi(38) * t_(0.9)) * np.exp(-t_(0.9) / 0.4) * 0.08), tl['push'][1])
    for i, m in enumerate((54, 62, 66, 69)):
        place(bus['keys'], felt(m + 12, 1.8, 0.028, pan=(i - 1.5) * 0.12), tl['push'][1] + 0.008 * i)
    # akorlar B1–B12 (B13 yeniden vuruşu yok)
    for bi in range(1, 13):
        chords = PROG.get(bi, [(0, 'Gmaj9')])
        for j, (b, name) in enumerate(chords):
            end_b = chords[j + 1][0] if j + 1 < len(chords) else 4
            root, notes = CH[name]
            t0 = T(bi, b); dd = (end_b - b) * beat
            if bi == 12:  # final: uzun Dmaj9 ped kuyruğu
                root, notes = CH['Dmaj9']; dd = 3.0
            cut = 900 if t0 < 2.2 else 1800 if t0 < tl['send'] else 4200
            place(bus['pad'], glass_pad(notes, dd + 1.6, cut, 0.05 if t0 < tl['send'] else 0.075), t0)
            if t0 > 3.0 and (b == 0 or name in ('A', 'A/C#', 'Bm9')) and bi < 12:
                for i, m in enumerate(notes[1:]):
                    place(bus['keys'], felt(m + 12, 2.0, 0.018 if t0 < tl['send'] else 0.034, pan=(i - 2) * 0.1), t0 + 0.008 * i)
        # pluck ostinato (B2–B10, B7 hariç)
        if 2 <= bi <= 10 and bi != 7:
            pat = [74, 69, 76, 69, 78, 69, 76, 69]
            for i, m in enumerate(pat):
                place(bus['pluck'], ks_pluck(m, 0.8, 0.04 if bi < 4 else 0.065, pan=0.25 if i % 2 else -0.25), T(bi, i * 0.5) + RNG.normal(0, 0.005))
        # groove B4–B11 (B7 seyrek), final vuruşunda biter
        if 4 <= bi <= 11:
            for b in range(4):
                at = T(bi, b)
                if at >= FINAL - 0.15: break
                if bi != 7:
                    if b in (0, 2): place(bus['drums'], kick(0.24), at)
                    if b in (1, 3): place(bus['drums'], clap(0.06, 0.05), at + RNG.normal(0, 0.003))
                    place(bus['drums'], open_hat(0.03), at + beat / 2 + RNG.normal(0, 0.004))
                    for h in range(2): place(bus['bass'], synth_bass(BASS_N(bi) , beat / 2 * 0.9, 0.05), at + h * beat / 2)
                place(bus['drums'], mhat(0.06), at + RNG.normal(0, 0.004))
                if bi == 7 and b == 2: place(bus['drums'], rim(0.05), at)
    # build (7,85–8,45): iki kick, klap, ters emme, nefes
    for at in (7.874, 8.162): place(bus['drums'], kick(0.2), at)
    for at in (8.018, 8.162): place(bus['drums'], clap(0.05), at)
    place(bus['fx'], reverse_swell(0.45, 0.05), 7.85)
    # vurgular
    place(bus['fx'], impact(0.42), tl['res'][0])
    place(bus['drums'], kick(0.3), tl['res'][0])
    place(bus['bass'], stereo(np.sin(2 * np.pi * np.cumsum(36.7 + 40 * np.exp(-t_(1.2) / 0.3)) / SR) * np.exp(-t_(1.2) / 0.5) * 0.18), 15.373)
    place(bus['fx'], reverse_swell(0.29, 0.04), 17.39)
    tc = t_(0.8); place(bus['fx'], stereo(hp(noise(len(tc)), 7000) * np.exp(-tc / 0.3) * 0.05), tl['menu'])
    for i in range(7):  # 16'lık merdiven
        at = 24.027 + i * beat / 4
        if at < 24.46: place(bus['drums'], clap(0.02 + 0.006 * i), at); place(bus['keys'], felt(69 + [0, 2, 4, 5, 7, 9, 11][i], 0.5, 0.025), at)
    place(bus['fx'], impact(0.24), tl['bound'])
    # final HIT
    place(bus['fx'], impact(0.85, 36.7, 80, 0.06, (86, 93, 98)), FINAL)
    place(bus['drums'], kick(0.32), FINAL)
    place(bus['keys'], saw_stab([50, 54, 57, 61, 64], 2.2, 0.14), FINAL)
    # sidechain pompası (kick tetiği)
    trig = np.zeros(n)
    for bi in range(4, 12):
        for b in (0, 2):
            at = T(bi, b)
            if at < FINAL - 0.15 and bi != 7: trig[int(at * SR)] = 1
    for at in (tl['res'][0], tl['bound'], FINAL): trig[int(at * SR)] = 1
    k = np.arange(int(0.6 * SR)) / SR; shape = (1 - np.exp(-k / 0.005)) * np.exp(-k / 0.14)
    duck = np.convolve(trig, shape)[:n]
    bus['pad'] *= (1 - 0.44 * np.clip(duck, 0, 1))[:, None]
    bus['pluck'] *= (1 - 0.44 * np.clip(duck, 0, 1))[:, None]
    bus['bass'] *= (1 - 0.6 * np.clip(duck, 0, 1))[:, None]
    mix = bus['pad'] + bus['keys'] + bus['pluck'] * 0.9 + bus['bass'] + bus['drums'] * 0.85 + bus['fx']
    # nefesler
    for a0, b0 in ((8.306, 8.45), (FINAL - 0.144, FINAL)):
        i0, i1 = int(a0 * SR), int(b0 * SR)
        mix[i0:i1] = bus['pad'][i0:i1] + (mix[i0:i1] - bus['pad'][i0:i1]) * 0.25
    # send reverb: kick/bas hariç
    send = bus['pad'] * 0.30 + bus['keys'] * 0.28 + bus['pluck'] * 0.22 + bus['fx'] * 0.35
    plate = make_ir(2.6, predelay=0.022, damp=6000, size=1.1, seed=3)
    wet = np.stack([signal.fftconvolve(send[:, c], plate[:, c])[: len(send)] for c in range(2)], 1)
    wet = lp(hp(wet, 250), 9000)
    mix = mix + wet
    out = mix[: int(DUR * SR)].copy()
    # kuyruk: 27,95'ten sonra yavaşça söner, 29,9'da ≤ −45 dBFS
    tt = np.arange(len(out)) / SR
    fade = np.where(tt < 27.95, 1.0, np.clip(1 - (tt - 27.95) / 1.95, 0, 1) ** 2.2)
    return out * fade[:, None]


def BASS_N(bi):
    return [43, 40, 45, 38, 35, 43, 40, 45, 42, 43, 38, 40, 43][(bi - 1) % 13] + 12


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
        place(bus, tap(-20 if k == 'tryTap' else -17 if k != 'searchTap' else -19, pan(x)), tl[k])
    for k in ('side', 'plugOpen', 'page', 'newChat'):
        place(bus, detent(-36), tl[k][1])
    a, b = tl['ptype']
    for i in range(5): place(bus, key_tick(-30 if i == 0 else -40), np.ceil((a + i * 4 / 60) * 60) / 60)
    place(bus, tone_pair(240, 480, 0.05, 0.3, -32, paper=True), tl['pres'])
    place(bus, tap(-18, 0.0), tl['install'])
    for k in range(3): place(bus, stereo(np.sin(2 * np.pi * (2400 + 200 * k) * t_(0.03)) * np.exp(-t_(0.03) / 0.004) * 10 ** (-36 / 20)), tl['spin'][0] + 0.15 * k)
    # Bağlı: mandal (iki klik 9 ms) + D5/A5 keçe
    m1 = detent(-26); place(bus, m1, tl['bound']); place(bus, m1, tl['bound'] + 0.009)
    place(bus, felt(74, 1.8, 0.05, -0.1), tl['bound'] + 0.012); place(bus, felt(81, 1.8, 0.04, 0.1), tl['bound'] + 0.019)
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
    # fader otomasyonu: bölüm hedeflerine göre yumuşak kazanç (±8 dB), lansman dinamiği (sakin açılış → vurgular → en yüksek final)
    F_ = tl['back'][1]
    TG = [(0, -26), (1.4, -21), (3.15, -19.5), (7.3, -17), (8.4, -16), (8.45, -9), (8.95, -14.5), (14.7, -17), (17.68, -15), (19.99, -15), (24.55, -15), (24.6, -10.5), (25.1, -15),
          (F_ - 0.25, -17), (F_, -7), (F_ + 0.6, -9), (27.6, -13), (28.6, -22), (30, -34)]
    hop = int(0.1 * SR); win = int(0.4 * SR)
    pw = np.convolve(np.mean(mix ** 2, 1), np.ones(win) / win, 'same')
    lv = 10 * np.log10(pw[::hop] + 1e-12)
    tt = np.arange(len(lv)) * hop / SR
    tgt = np.interp(tt, [a for a, _ in TG], [b for _, b in TG])
    ref = np.median(lv[(tt > 9) & (tt < 14)] - tgt[(tt > 9) & (tt < 14)])
    g = np.clip(tgt - (lv - ref), -8, 8)
    g = np.convolve(g, np.ones(3) / 3, 'same')
    gl = np.interp(np.arange(len(mix)) / SR, tt, g)
    mix = mix * (10 ** (gl / 20))[:, None]
    pad_n = SR  # dairesel dolgu: filtreler döngü dikişinde süreksizlik üretmesin
    mix = master_pre(np.concatenate([mix[-pad_n:], mix, mix[:pad_n]]))[pad_n:-pad_n]
    mix = mix / np.max(np.abs(mix)) * 0.5
    to_wav(out + '_raw.wav', mix)
    to_wav(out + '_music.wav', m / np.max(np.abs(m)) * 0.5)
    to_wav(out + '_ui.wav', u / np.max(np.abs(u)) * 0.5)
    print('tamam', out)


if __name__ == '__main__':
    main()
