"""Evlek ses motoru · tamamen kodla sentez (numpy/scipy). Sample, kayıt ya da harici model YOK.
Lisans: bu dosyadaki kodla üretilen her ses Evlek projesine aittir; dış kaynak yoktur.
48 kHz, float32 stereo. Kullanım: from synth import *; bkz. film_v14.py
"""
import numpy as np
from scipy import signal

SR = 48000
RNG = np.random.default_rng(20261115)


def t_(dur):
    return np.arange(int(round(dur * SR))) / SR


def silence(dur):
    return np.zeros((int(round(dur * SR)), 2), np.float32)


def stereo(x, pan=0.0, width=0.0):
    """mono → stereo, eşit güç pan (−1 sol … +1 sağ)."""
    a = (pan + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], 1)


def env_adsr(n, a=0.005, d=0.1, s=0.7, r=0.2, sus_len=None):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n) if sus_len is None else int(sus_len * SR)
    e = np.concatenate([np.linspace(0, 1, a_n, endpoint=False) if a_n else [], np.linspace(1, s, d_n, endpoint=False) if d_n else [],
                        np.full(s_n, s), np.linspace(s, 0, r_n) if r_n else []])
    e = np.pad(e, (0, max(0, n - len(e))))[:n]
    return e


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def lp(x, f, order=2):
    sos = signal.butter(order, min(f, SR / 2 * 0.95), 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def hp(x, f, order=2):
    sos = signal.butter(order, f, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, min(hi, SR / 2 * 0.95)], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def peak(x, f, q, gain_db):
    """RBJ peaking EQ."""
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def shelf_low(x, f, gain_db):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f / SR; al = np.sin(w) / 2 * np.sqrt(2)
    c = np.cos(w); sa = 2 * np.sqrt(A) * al
    b = [A * ((A + 1) - (A - 1) * c + sa), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - sa)]
    a = [(A + 1) + (A - 1) * c + sa, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sa]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def sat(x, drive=1.5):
    """yumuşak analog doygunluk (tanh), seviye korunur."""
    return np.tanh(x * drive) / np.tanh(drive)


def noise(n):
    return RNG.standard_normal(n)


def saw_bl(f, t, maxf=9000):
    """bant sınırlı testere (toplamsal)."""
    y = np.zeros_like(t)
    k = 1
    while k * f < maxf:
        y += ((-1) ** (k + 1)) * np.sin(2 * np.pi * k * f * t) / k
        k += 1
    return y * (2 / np.pi)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------- reverb: sentetik oda/plaka darbe yanıtı ----------------
def make_ir(dur=2.4, predelay=0.018, damp=6500, size=1.0, seed=7):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        nz = r.standard_normal(n) * np.exp(-t * 3.2 / size)
        nz = lp(nz, damp) * 0.9 + lp(nz, 1800) * 0.25
        # erken yansımalar
        for k in range(8):
            d = int((predelay + 0.006 * (k + 1) * (1.3 if ch else 1.0) * size) * SR)
            if d < n:
                nz[d] += (0.6 / (k + 1)) * (1 if k % 2 == 0 else -1)
        ir[:, ch] = nz
    ir[: int(predelay * SR)] = 0
    return ir / np.max(np.abs(ir)) * 0.35


IR_ROOM = None


def reverb(x, wet=0.25, ir=None):
    global IR_ROOM
    if ir is None:
        if IR_ROOM is None:
            IR_ROOM = make_ir()
        ir = IR_ROOM
    if x.ndim == 1:
        x = stereo(x)
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x * (1 - wet * 0.5) + y * wet


# ---------------- enstrümanlar ----------------
def pad(notes, dur, bright=1800, detune=0.11, amp=0.12, attack=0.9, release=1.2):
    """sıcak ped: her nota 3 hafif detune testere, düşük geçiren filtre, yavaş zarf, stereo genişlik."""
    t = t_(dur)
    L = np.zeros_like(t); R = np.zeros_like(t)
    for m in notes:
        f = midi(m)
        for i, d in enumerate((-detune, 0, detune)):
            ph = RNG.uniform(0, 1)
            v = saw_bl(f * 2 ** (d / 12), t + ph / f, maxf=6000)
            if i == 0:
                L += v
            elif i == 2:
                R += v
            else:
                L += v * 0.7; R += v * 0.7
    e = env_adsr(len(t), a=attack, d=0.5, s=0.85, r=release)
    # filtre zarfı: yavaşça açılan ton
    x = np.stack([L, R], 1) / (len(notes) * 2.4)
    x = lp(x, bright, 2)
    return x * e[:, None] * amp


def epiano(m, dur=1.6, amp=0.16, idx=1.6, pan=0.0):
    """FM elektrik piyano (Rhodes benzeri): taşıyıcı 1:1, modülasyon indeksi hızla düşer + hafif tremolo."""
    t = t_(dur)
    f = midi(m)
    I = idx * np.exp(-t / 0.35) + 0.15
    car = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t))
    tine = 0.18 * np.sin(2 * np.pi * f * 7.0 * t) * np.exp(-t / 0.05)
    y = (car + tine) * env_adsr(len(t), a=0.003, d=0.6, s=0.25, r=0.5) * (1 + 0.06 * np.sin(2 * np.pi * 4.2 * t))
    return stereo(y * amp, pan)


def bell(m, dur=2.5, amp=0.12, ratio=3.5, idx=2.2, pan=0.0):
    t = t_(dur)
    f = midi(m)
    I = idx * np.exp(-t / 0.6)
    y = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * ratio * t)) * np.exp(-t / 0.9)
    y *= env_adsr(len(t), a=0.002, d=0.01, s=1, r=0.05)
    return stereo(y * amp, pan)


def sub(m, dur, amp=0.22):
    t = t_(dur)
    f = midi(m)
    y = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * 2 * f * t) + 0.2 * np.sin(2 * np.pi * 3 * f * t)
    return stereo(sat(y * env_adsr(len(t), a=0.01, d=0.1, s=0.9, r=0.12), 1.2) * amp)


def kick(amp=0.5):
    t = t_(0.45)
    f = 55 + 100 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.11)
    click = hp(noise(len(t)), 2500) * np.exp(-t / 0.005) * 0.45
    return stereo(sat((body + click) * amp, 1.4))


def hat(amp=0.05, open_=False, pan=0.15):
    t = t_(0.25 if open_ else 0.07)
    y = hp(noise(len(t)), 7000, 4) * np.exp(-t / (0.06 if open_ else 0.014))
    return stereo(y * amp, pan)


def shaker(amp=0.035, pan=-0.25):
    t = t_(0.09)
    y = bp(noise(len(t)), 4000, 11000) * env_adsr(len(t), a=0.02, d=0.03, s=0.3, r=0.03)
    return stereo(y * amp, pan)


def rim(amp=0.08, pan=0.1):
    t = t_(0.12)
    y = bp(noise(len(t)), 1500, 5000) * np.exp(-t / 0.008) + 0.5 * np.sin(2 * np.pi * 820 * t) * np.exp(-t / 0.02)
    return stereo(y * amp, pan)


# ---------------- arayüz efektleri (gerçekçi, kısa, kuru) ----------------
def key_tick(amp=0.08, var=0.0, pan=0.0):
    """dokunmatik klavye tıkı: çok kısa bant geçiren gürültü + küçük gövde rezonansı; her vuruşta hafif farklı."""
    t = t_(0.045)
    c = 3200 * (1 + 0.18 * var)
    y = bp(noise(len(t)), c * 0.6, c * 1.6) * np.exp(-t / 0.006)
    y += 0.35 * np.sin(2 * np.pi * (210 + 40 * var) * t) * np.exp(-t / 0.009)
    return stereo(y * amp, pan)


def tap(amp=0.12, pan=0.0):
    """parmak dokunuşu: yumuşak düşük 'tok' + çok kısa yüzey tıkı."""
    t = t_(0.09)
    y = np.sin(2 * np.pi * 150 * t) * np.exp(-t / 0.018) * 0.9
    y += hp(noise(len(t)), 2500) * np.exp(-t / 0.0025) * 0.35
    return stereo(y * amp, pan)


def send(amp=0.11):
    """gönder: kısa yukarı kayan yumuşak 'pop' + hava."""
    t = t_(0.22)
    f = 420 + 520 * (1 - np.exp(-t / 0.03))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05)
    y += lp(hp(noise(len(t)), 1500), 7000) * np.exp(-t / 0.04) * 0.12
    return reverb(stereo(y * amp), 0.18)


def shimmer(dur=0.8, amp=0.035, base=84):
    """arama ışıltısı: yumuşak yüksek sinüs kümeleri, titreşimli; 'düşünme' hissi, alarm değil."""
    t = t_(dur)
    y = np.zeros_like(t)
    for k, m in enumerate((base, base + 7, base + 12, base + 16)):
        y += np.sin(2 * np.pi * midi(m) * t + k) * (0.5 + 0.5 * np.sin(2 * np.pi * (3 + k) * t + k))
    y *= env_adsr(len(t), a=0.15, d=0.1, s=0.8, r=0.25) / 4
    return reverb(stereo(y * amp, 0.0), 0.5)


def settle(amp=0.12, notes=(62, 69, 74)):
    """sonuç oturdu: yumuşak, sıcak, kısa akor 'tok'u (zil değil)."""
    out = None
    for i, m in enumerate(notes):
        e = epiano(m, 1.4, amp * (0.9 if i else 1.0), idx=0.9, pan=(-0.2, 0.2, 0.0)[i % 3])
        out = e if out is None else out + e
    return reverb(out, 0.3)


def swipe(dur=0.8, amp=0.05, up=True):
    """kaydırma/sürükleme: el hareketi; filtre süpürmeli yumuşak gürültü (whoosh klişesi değil, kısık)."""
    t = t_(dur)
    x = noise(len(t))
    k = t / dur
    fc = 900 + 2600 * (k if up else (1 - k))
    y = np.zeros_like(x)
    # zamanla değişen basit tek kutuplu LPF
    a = np.exp(-2 * np.pi * fc / SR)
    yy = 0.0
    for i in range(len(x)):
        yy = (1 - a[i]) * x[i] + a[i] * yy
        y[i] = yy
    y = hp(y, 300) * np.sin(np.pi * k) ** 1.5
    return stereo(y * amp, -0.3 if up else 0.3)


def air(dur=0.7, amp=0.06, rise=True):
    """ilanın açılışı / portal: hava basıncı, açılan filtre; reverb ile oda hissi."""
    t = t_(dur)
    x = noise(len(t))
    lo = lp(x, 900) * 0.8 + bp(x, 1500, 6000) * 0.25
    e = (t / dur) ** 1.4 * np.exp(-((t / dur) - 1) ** 2 * 0) if rise else (1 - t / dur) ** 1.4
    e = e * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.6
    return reverb(stereo(lo * e * amp), 0.35)


def confirm(amp=0.12):
    """Bağlı: iki notalı yumuşak marimba (beşli), zil değil."""
    def mar(m, d=0.6):
        t = t_(d)
        f = midi(m)
        y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.18) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)
        return y
    a = mar(74); b = mar(81)
    y = np.zeros(int(0.9 * SR)); y[: len(a)] += a; off = int(0.09 * SR); y[off: off + len(b)] += b * 0.85
    return reverb(stereo(y * amp), 0.3)


def sonic_logo(amp=0.13):
    """Evlek ses imzası: yükselen üç notalı FM çan (D–A–F#) + yumuşak ped kabarması."""
    out = silence(3.2)
    for i, (m, d) in enumerate(((74, 0.0), (81, 0.12), (78, 0.24))):
        b = bell(m, 2.6, amp * (1.0 - 0.15 * i), ratio=3.5, idx=1.6, pan=(-0.25, 0.25, 0.0)[i])
        s = int(d * SR); out[s: s + len(b)] += b[: len(out) - s]
    return reverb(out, 0.45)


def place(bus, x, at, gain=1.0):
    s = int(round(at * SR))
    if s >= len(bus):
        return
    e = min(len(bus), s + len(x))
    bus[s:e] += x[: e - s] * gain


def to_wav(path, x):
    import wave
    y = np.clip(x, -1, 1)
    y16 = (y * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y16.tobytes())
