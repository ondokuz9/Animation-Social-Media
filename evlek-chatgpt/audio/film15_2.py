"""VIDEO-1 v15.2 ses miksi — v15 (film15.py) yapısı ve zamanlaması aynen; ses kaynakları gerçek kayıt.
  · Arayüz: Kenney Interface Sounds + Kenney UI Audio (CC0) — dokunuş, klavye, gönder, Bağlı …
  · Müzik : VCSL (CC0) — Steinway B piyano (keçe yerine), vibrafon (pluck yerine), glockenspiel (FM çan yerine),
            gerçek el çırpma ve hi-hat. Elektronik omurga (kick, bas, ped, impact) sentez olarak kalır.
  · Seviye: her örnek, değiştirdiği sentez sesin kısa süreli seviyesine eşitlenir → v15'te kurulan denge korunur.
Örnekler: bash audio/fetch_samples.sh   (kaynak, commit, lisans: audio/SAMPLES.md)
Çalıştır: cd audio && python3 film15_2.py ../src/v15/tl.ts ../out/audio/v15_2
"""
import sys
import numpy as np
from scipy import signal
import film15 as F
import samples as S
from synth import SR, RNG, t_, stereo, place, lp, hp, bp, noise, midi

KI = 'kenney-interface-sounds/addons/kenney_interface_sounds/'
KU = 'kenney-ui-audio/addons/kenney_ui_audio/'
RR = np.random.default_rng(20261116)

# ---------------- enstrümanlar (VCSL) ----------------
PIANO = {v: S.Pitched(S.files(f'vcsl/**/NoSus/*_vl{v}_rr1.wav'), r'Close_([A-G]#?\d)_', max_s=6.0) for v in (2, 3)}
VIBES = S.Pitched(S.files('vcsl/**/Soft Mallets/*.wav'), r'_([A-G]#?\d)_', max_s=5.0)
GLOCK = S.Pitched(S.files('vcsl/**/Glockenspiel/glock_soft_*.wav'), r'_([A-G]#?\d)_', max_s=4.0)
# ölçülen perde (FFT): VCSL vibrafon/glockenspiel adları bir oktav aşağıdadır; glockenspiel ≈ +0,15 yarım ses tiz
VIBES.offset, GLOCK.offset = 12, 12.15
for P in PIANO.values(): P.offset = 0


def _note(P, m, dur, vel_idx=None):
    return P.note(m - P.offset, dur, vel_idx)


_felt, _pluck, _bell, _clap, _mhat, _ohat = F.felt, F.ks_pluck, F.fm_bell, F.clap, F.mhat, F.open_hat


def felt(m, dur=1.8, amp=0.12, pan=0.0):
    ref = _felt(m, dur, amp, 0.0)
    y = _note(PIANO[3 if amp >= 0.05 else 2], m, dur)
    y = S.fade_out(y, dur, rel=min(0.45, dur * 0.35))
    return S.pan_st(S.match(y, ref, -1.0, 0.05), pan)


def ks_pluck(m, dur=0.9, amp=0.06, pan=0.0):
    ref = _pluck(m, dur, amp, 0.0)
    y = S.fade_out(_note(VIBES, m, dur), dur, rel=min(0.3, dur * 0.4))
    return S.pan_st(S.match(y, ref, 0.0, 0.05), pan)


def fm_bell(ms, dur=3.0, amp=0.03):
    ref = _bell(ms, dur, amp); out = np.zeros_like(ref)
    for i, m in enumerate(ms):
        y = S.pan_st(S.fade_out(_note(GLOCK, m, dur), dur, 0.6), (-0.3, 0.3, 0.0)[i % 3])
        out[: len(y)] += y[: len(out)]
    return S.match(out, ref, -2.0, 0.05)


def _rr(names):
    return S.load(names[RR.integers(len(names))])


CLAPS = [f'vcsl/Idiophones/Struck Idiophones/Claps/Clap_rr{i}.wav' for i in range(1, 7)]
HAT_C = [f'vcsl/Idiophones/Struck Idiophones/Hi-Hat Cymbal/HiHat_HitC_v{v}_rr{r}_Mid.wav' for v in (1, 2, 3, 4) for r in (1, 2)]
HAT_O = [f'vcsl/Idiophones/Struck Idiophones/Hi-Hat Cymbal/HiHat_HitO_rr{r}_Mid.wav' for r in (1, 2)]


def clap(amp=0.07, pan=0.0):
    return S.pan_st(S.match(S.fade_out(_rr(CLAPS), 0.35, 0.1), _clap(amp, 0.0)), pan)


def mhat(amp=0.04, pan=0.18):
    v = 0 if amp < 0.05 else 2
    y = S.load(HAT_C[2 * v + RR.integers(4)])
    y = hp(S.fade_out(y, 0.14, 0.05), 3000)
    return S.pan_st(S.match(y, _mhat(amp, 0.0)), pan)


def open_hat(amp=0.035, pan=0.2):
    y = hp(S.fade_out(_rr(HAT_O), 0.32, 0.15), 3000)
    return S.pan_st(S.match(y, _ohat(amp, 0.0)), pan)


F.felt, F.ks_pluck, F.fm_bell, F.clap, F.mhat, F.open_hat = felt, ks_pluck, fm_bell, clap, mhat, open_hat


# ---------------- arayüz (Kenney) ----------------
def k(name, ref, db=0.0, semis=0.0, pan=0.0, dur=None):
    y = S.load(name + '.wav')
    if semis: y = S.shift(y, semis)
    if dur: y = S.fade_out(y, dur, min(0.05, dur / 3))
    return S.pan_st(S.match(y, ref, db), pan)


def tuned(name, midi_now, midi_want, ref, db=0.0, pan=0.0):
    """tonal örneği Re majör ölçeğindeki hedef notaya çek (müzikle çatışmasın)."""
    return k(name, ref, db, midi_want - midi_now, pan)


def jit():
    return RR.uniform(-0.35, 0.35)   # yarım ses: aynı ses iki kez aynı çıkmasın


def ui(tl):
    n = int(F.DUR * SR); bus = np.zeros((n, 2))
    pan = lambda x: 0.4 * (x - 540) / 540
    # giriş: logo → çip (logo notası artık piyano: felt üzerinden)
    place(bus, F.logo_note(74, -27), tl['sig'][0])
    a = np.linspace(0, 1, int(0.65 * SR)); place(bus, stereo(bp(noise(len(a)), 800, 3000) * np.sin(np.pi * a) * 0.01), tl['sig'][0])
    place(bus, F.logo_note(69, -27), tl['sig'][1])
    place(bus, k(KI + 'select_002', F.tap(-28), 0, jit()), tl['sig'][1])
    # yazma: harf = Kenney click_002/003/005, boşluk/satır = tick_002 (daha pes "tok", iOS'taki gibi)
    prev = ' '; letters = ['click_002', 'click_003', 'click_005']
    for at, ch in F.type_times(tl):
        if ch in ' \n':
            place(bus, k(KI + 'tick_002', F.key_tick(-25, True), -1.0, jit()), at)
        else:
            ref = F.key_tick(-26 if prev in ' \n' else -33, False)
            place(bus, k(KI + letters[RR.integers(3)], ref, 0.0, jit(), RR.uniform(-0.1, 0.1)), at)
        prev = ch
    place(bus, k(KI + 'select_002', F.tap(-22), 0, jit(), pan(900)), tl['send'] - 0.01)
    place(bus, k(KI + 'maximize_009', F.send_snd(-17), -1.0), tl['send'])
    t = t_(0.38); place(bus, stereo(lp(np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1318.5 * 1.001 * t), 3000) * np.sin(np.pi * t / 0.38) * 0.02), tl['rise'][0])
    place(bus, tuned(KI + 'drop_003', 77.85, 78, F.tone_pair(240, 480, 0.06, 0.4, -19, paper=True)), tl['res'][0])
    place(bus, F.felt(78, 1.6, 0.05), tl['slogan'][1])
    # kaydırma + sürükleme (sürtünme sentez kalır: kayıtlı karşılığı yok), mandallar Kenney tick
    d = tl['scroll'][1] - tl['scroll'][0]; e = np.sin(np.pi * np.linspace(0, 1, int(d * SR))) ** 1.5
    place(bus, stereo(F.friction(d, -40, e)), tl['scroll'][0])
    d = tl['coast'][1] - tl['drag'][0]; tt = np.linspace(0, d, int(d * SR))
    v = np.where(tt < tl['drag'][1] - tl['drag'][0], 1.0, np.exp(-(tt - (tl['drag'][1] - tl['drag'][0])) / 0.32))
    place(bus, stereo(F.friction(d, -34, v), 0.0), tl['drag'][0])
    for i in range(2): place(bus, k(KI + 'tick_001', F.detent(-30), 0, jit() + 2), tl['drag'][0] + 0.28 + i * 0.3)
    place(bus, tuned(KI + 'drop_002', 78.6, 79, F.tone_pair(240, 480, 0.06, 0.3, -22, paper=True), -1), tl['coast'][1])
    place(bus, k(KI + 'select_007', F.tap(-17), 0, jit(), pan(420)), tl['tap'])
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -24)), tl['expand'][1])
    # ev: deniz (sentez ambiyans)
    place(bus, F.sea(tl['portalIn'][1] - tl['portalOut'][0] + 0.3), tl['portalOut'][0])
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -26), -1), tl['portalIn'][1])
    # galeri, emlakçıya sor, kapat
    d = tl['swipe'][1] - tl['swipe'][0] + 0.1; place(bus, stereo(F.friction(d, -34, np.sin(np.pi * np.linspace(0, 1, int(d * SR))))), tl['swipe'][0])
    place(bus, tuned(KI + 'glass_006', 89.6, 90, F.tone_pair(200, 400, 0.05, 0.3, -28), -2), tl['page2'][1])
    place(bus, k(KI + 'select_002', F.tap(-16), 0, jit(), pan(881)), tl['contact'])
    place(bus, k(KI + 'select_007', F.tap(-16), 0, jit(), pan(110)), tl['close'])
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -28), -1), tl['collapse'][1])
    # eklenti: bölüm notaları (piyano + vibrafon), dokunuşlar, panel geçişleri
    for at, m in ((tl['menu'], 69), (tl['plugOpen'][0], 71), (tl['page'][0], 73)):
        place(bus, F.felt(m, 1.4, 0.05), at); place(bus, F.ks_pluck(m + 12, 0.6, 0.02), at)
    taps = {'menu': 'select_002', 'plug': 'select_007', 'searchTap': 'select_002', 'row': 'select_007', 'tryTap': 'select_002'}
    for key, x in (('menu', 110), ('plug', 260), ('searchTap', 589), ('row', 330), ('tryTap', 589)):
        place(bus, k(KI + taps[key], F.tap(-20 if key == 'tryTap' else -17 if key != 'searchTap' else -19), 0, jit(), pan(x)), tl[key])
    for key in ('side', 'plugOpen', 'page', 'newChat'):
        place(bus, k(KU + 'switch13', F.detent(-36), -2, jit()), tl[key][1])
    a, b = tl['ptype']
    for i in range(5):
        place(bus, k(KI + letters[RR.integers(3)], F.key_tick(-30 if i == 0 else -40), 0, jit()), np.ceil((a + i * 4 / 60) * 60) / 60)
    place(bus, tuned(KI + 'select_005', 86.3, 86, F.tone_pair(240, 480, 0.05, 0.3, -32, paper=True)), tl['pres'])
    place(bus, k(KI + 'select_002', F.tap(-18), 0, jit()), tl['install'])
    for i in range(3):
        ref = stereo(np.sin(2 * np.pi * 2400 * t_(0.03)) * np.exp(-t_(0.03) / 0.004) * 10 ** (-36 / 20))
        place(bus, k(KU + 'switch14', ref, -2, 1.0 * i), tl['spin'][0] + 0.15 * i)
    # Bağlı: mandal (toggle_001) + Kenney onay çanı (confirmation_002 = tam Re6) + piyano D5/A5
    place(bus, k(KI + 'toggle_001', F.detent(-26), 0), tl['bound'])
    place(bus, tuned(KI + 'confirmation_002', 86.0, 86, F.felt(86, 0.6, 0.05), -3), tl['bound'] + 0.01)
    place(bus, F.felt(74, 1.8, 0.05, -0.1), tl['bound'] + 0.012); place(bus, F.felt(81, 1.8, 0.04, 0.1), tl['bound'] + 0.019)
    # kapanış imzası 'Ev·lek' (piyano + cam parıltı + sub)
    place(bus, F.logo_note(69, -24), tl['back'][0])
    a = t_(0.12); place(bus, stereo(bp(noise(len(a)), 800, 3000) * np.sin(np.pi * a / 0.12) * 10 ** (-40 / 20)), tl['back'][1] - 0.12)
    place(bus, F.logo_note(74, -19, sub=True), tl['back'][1])
    bus = F.ui_room(bus, 0.08)
    pn = signal.lfilter([0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400], RNG.standard_normal((n, 2)), axis=0)
    pn = pn / np.sqrt(np.mean(pn ** 2)) * 10 ** (-62 / 20)
    return bus + pn


F.ui = ui

if __name__ == '__main__':
    F.main()
