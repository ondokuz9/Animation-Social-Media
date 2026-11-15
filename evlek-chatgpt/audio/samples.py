"""CC0 örnek bankası — Kenney (arayüz) + VCSL (enstrüman). Kaynak/lisans: audio/SAMPLES.md.
Örnekler git'e girmez; audio/fetch_samples.sh sabit commit'lerden indirir (SFX_DIR, varsayılan audio/_samples).
Her örnek: 48 kHz stereo float, baştaki sessizlik kırpılmış (atak tam olay zamanına oturur).
"""
import os, re, glob
from fractions import Fraction
from functools import lru_cache
import numpy as np
from scipy import signal
from scipy.io import wavfile
from synth import SR

ROOT = os.environ.get('SFX_DIR', os.path.join(os.path.dirname(os.path.abspath(__file__)), '_samples'))
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def name2midi(s):
    m = re.match(r'([A-G]#?)(-?\d)', s)
    return NOTE[m.group(1)] + 12 * (int(m.group(2)) + 1)


def _read(path):
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        sr, x = wavfile.read(path)
    if x.dtype == np.int16: x = x / 32768.0
    elif x.dtype == np.int32: x = x / 2147483648.0
    elif x.dtype == np.uint8: x = (x - 128) / 128.0
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x[:, :2]
    return sr, x


@lru_cache(maxsize=None)
def load(rel, max_s=None):
    """rel: ROOT'a göreli yol. 48 kHz'e çevrilir, atak öncesi sessizlik kırpılır (−50 dB, 1 ms pay)."""
    sr, x = _read(os.path.join(ROOT, rel))
    if max_s: x = x[: int(max_s * sr)]
    if sr != SR:
        fr = Fraction(SR, sr).limit_denominator(1000)
        x = signal.resample_poly(x, fr.numerator, fr.denominator, axis=0)
    a = np.abs(x).max(1); pk = a.max() + 1e-12
    i0 = int(np.argmax(a > pk * 10 ** (-50 / 20)))
    x = x[max(0, i0 - int(0.001 * SR)):]
    return x / pk


def shift(x, semis, max_s=None):
    """varispeed perde kaydırma (kalite: polifaz yeniden örnekleme). semis>0 → tiz ve kısa."""
    if max_s is not None:
        x = x[: int(max_s * SR * 2 ** (semis / 12)) + 64]
    if abs(semis) < 1e-3: return x.copy()
    fr = Fraction(2 ** (-semis / 12)).limit_denominator(400)
    return signal.resample_poly(x, fr.numerator, fr.denominator, axis=0)


def st_level(x, win=0.02):
    """kısa süreli tepe seviyesi: 20 ms kayan RMS'in en büyüğü (mono toplam)."""
    m = x.mean(1) if x.ndim > 1 else x
    w = max(8, int(win * SR))
    e = np.convolve(m ** 2, np.ones(w) / w, 'valid') if len(m) > w else np.array([np.mean(m ** 2)])
    return np.sqrt(e.max()) + 1e-12


def match(y, ref, db=0.0, win=0.02):
    """y'yi ref'in kısa süreli seviyesine eşitle (+db). Önceki miks dengesini korur."""
    return y * (st_level(ref, win) / st_level(y, win)) * 10 ** (db / 20)


def fade_out(y, dur, rel=0.3):
    n = min(len(y), int(dur * SR))
    y = y[:n].copy(); r = min(n, int(rel * SR))
    if r > 0: y[n - r:] *= (np.cos(np.linspace(0, np.pi / 2, r)) ** 2)[:, None]
    return y


def pan_st(y, pan):
    if pan == 0: return y
    g = np.array([np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)]) * np.sqrt(2)
    return y * g[None, :]


class Pitched:
    """Perdeli enstrüman: {midi: [dosya,...]} → en yakın örnek + varispeed."""

    def __init__(self, files, rx, max_s=None):
        self.map = {}
        for f in files:
            m = re.search(rx, os.path.basename(f))
            if m: self.map.setdefault(name2midi(m.group(1)), []).append(os.path.relpath(f, ROOT))
        self.max_s = max_s; self.rr = 0

    def note(self, m, dur, vel_idx=None):
        k = min(self.map, key=lambda q: (abs(q - m), q < m))
        fs = sorted(self.map[k])
        f = fs[vel_idx % len(fs)] if vel_idx is not None else fs[self.rr % len(fs)]
        self.rr += 1
        return shift(load(f, self.max_s), m - k, max_s=dur + 0.05)


def files(pattern):
    return sorted(glob.glob(os.path.join(ROOT, pattern), recursive=True))
