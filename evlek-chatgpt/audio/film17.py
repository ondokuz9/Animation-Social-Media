"""V17 · FINAL ses miksi · 22,0 sn · 120 BPM, Re majör. Müzik film16 ile aynı yapı (CC0 kayıtlar + sentez omurga),
zaman noktaları v17 kurgusuna eşlenir; arayüz sesleri v17 akışına göre yeniden yerleşir (eklenti adımları dahil).
Çalıştır: cd audio && python3 film17.py ../src/v17/tl.ts ../out/audio/v17
"""
import sys
import numpy as np
from scipy import signal
import film16 as M
from film16 import F, F2, KI, KU, load_tl
from synth import SR, RNG, t_, stereo, bp, noise, place, to_wav

M.DUR = 22.0
DUR = M.DUR


def to16(tl):
    """v17 olaylarını film16 müziğinin beklediği adlara eşle."""
    return {**tl, 'expand2': tl['portalOut'], 'land': tl['portalIn'], 'cut': 13.5, 'end': tl['end'], 'shrink': [tl['push'][0], tl['push'][1]]}


def ui(tl):
    n = int(DUR * SR); bus = np.zeros((n, 2))
    pan = lambda x: 0.35 * (x - 540) / 540
    k, tuned, jit = F2.k, F2.tuned, F2.jit
    TAP = -6.0
    # açılış: başlık notası (piyano) + yaklaşma havası
    place(bus, F.logo_note(74, -26), 0.1)
    a = t_(tl['push'][1] - tl['push'][0]); kk = a / a[-1]
    place(bus, stereo(bp(noise(len(a)), 500, 3500) * np.sin(np.pi * kk) ** 2 * 0.012), tl['push'][0])
    # yazma: çip + 4 öbek (öbek başına iki tık + yükselen vibrafon notası)
    place(bus, k(KI + 'select_002', F.tap(-24), TAP, jit()), tl['chunks'][0])
    for i, at in enumerate(tl['chunks'][1:]):
        place(bus, k(KI + 'click_003', F.key_tick(-27, False), 0, jit()), at)
        place(bus, k(KI + 'click_005', F.key_tick(-33, False), 0, jit()), at + 0.05)
        place(bus, F.ks_pluck([74, 76, 78, 81][i], 0.7, 0.04, pan=(i - 1.5) * 0.15), at)
    place(bus, k(KI + 'select_002', F.tap(-22), TAP, jit(), pan(1000)), tl['send'] - 0.01)
    place(bus, k(KI + 'maximize_009', F.send_snd(-17), -3.0), tl['send'])
    place(bus, tuned(KI + 'drop_003', 77.85, 78, F.tone_pair(240, 480, 0.06, 0.4, -24, paper=True)), tl['res'][0] + 0.02)
    # kaydırma + sürükleme
    d = tl['scroll'][1] - tl['scroll'][0]; e = np.sin(np.pi * np.linspace(0, 1, int(d * SR))) ** 1.5
    place(bus, stereo(F.friction(d, -40, e)), tl['scroll'][0])
    d = tl['coast'][1] - tl['drag'][0]; tt = np.linspace(0, d, int(d * SR)); dd = tl['drag'][1] - tl['drag'][0]
    place(bus, stereo(F.friction(d, -35, np.where(tt < dd, 1.0, np.exp(-(tt - dd) / 0.32)))), tl['drag'][0])
    for i in range(2): place(bus, k(KI + 'tick_001', F.detent(-32), 0, jit() + 2), tl['drag'][0] + 0.22 + i * 0.22)
    place(bus, tuned(KI + 'drop_002', 78.6, 79, F.tone_pair(240, 480, 0.06, 0.3, -24, paper=True), -1), tl['coast'][1])
    # kart → ilan → galeri
    place(bus, k(KI + 'select_007', F.tap(-17), TAP, jit(), pan(396)), tl['tap'])
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -26)), tl['expand'][1] - 0.02)
    d = tl['page2'][0] - tl['swipe'][0] + 0.1; place(bus, stereo(F.friction(d, -33, np.sin(np.pi * np.linspace(0, 1, int(d * SR))))), tl['swipe'][0])
    place(bus, tuned(KI + 'glass_006', 89.6, 90, F.tone_pair(200, 400, 0.05, 0.3, -28), -2), tl['page2'][1] - 0.05)
    # ev: hava + deniz, ilana dönüş
    a = t_(tl['portalOut'][1] - tl['portalOut'][0]); kk = a / a[-1]
    place(bus, stereo(bp(noise(len(a)), 500, 4000) * kk ** 2 * 0.02), tl['portalOut'][0])
    place(bus, bp(F.sea(tl['portalIn'][1] - tl['portalOut'][1] + 0.6, amp=0.022), 400, 4000), tl['portalOut'][1] - 0.4)
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -24)), tl['portalIn'][1] - 0.03)
    # emlakçıya sor, kapat, karta küçülme
    place(bus, k(KI + 'select_002', F.tap(-16), TAP, jit(), pan(881)), tl['contact'])
    place(bus, k(KI + 'select_007', F.tap(-17), TAP, jit(), pan(110)), tl['close'])
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -28), -2), tl['collapse'][1])
    # eklentiler: adım notaları (piyano + vibrafon), dokunuşlar, panel geçişleri, "evlek" yazımı
    for at, m in ((tl['menu'], 69), (tl['searchTap'], 71), (tl['page'][0], 73)):
        place(bus, F.felt(m, 1.4, 0.045), at); place(bus, F.ks_pluck(m + 12, 0.6, 0.02), at)
    taps = {'menu': ('select_002', 110), 'plug': ('select_007', 260), 'searchTap': ('select_002', 589), 'row': ('select_007', 330), 'install': ('select_002', 540), 'tryTap': ('select_007', 540)}
    for key, (nm, x) in taps.items():
        place(bus, k(KI + nm, F.tap(-18), TAP, jit(), pan(x)), tl[key])
    for key in ('side', 'plugOpen', 'page', 'newChat'):
        place(bus, k(KU + 'switch13', F.detent(-36), -2, jit()), tl[key][1])
    a0, b0 = tl['ptype']
    for i in range(5): place(bus, k(KI + ['click_002', 'click_003', 'click_005'][i % 3], F.key_tick(-30 if i == 0 else -36), 0, jit()), a0 + i * (b0 - a0) / 5)
    place(bus, tuned(KI + 'select_005', 86.3, 86, F.tone_pair(240, 480, 0.05, 0.3, -32, paper=True)), tl['pres'])
    place(bus, k(KI + 'toggle_001', F.detent(-27), 0), tl['bound'])
    place(bus, tuned(KI + 'confirmation_002', 86.0, 86, F.felt(86, 0.6, 0.05), -2), tl['bound'] + 0.01)
    place(bus, F.felt(74, 1.6, 0.05, -0.1), tl['bound'] + 0.012); place(bus, F.felt(81, 1.6, 0.04, 0.1), tl['bound'] + 0.019)
    # bitiş imzası 'Ev·lek'
    place(bus, F.logo_note(69, -22), tl['end'][0])
    place(bus, F.logo_note(74, -19, sub=True), tl['end'][0] + 0.5)
    place(bus, F.ks_pluck(86, 1.0, 0.04), tl['cta'][0] + 0.1)
    bus = F.ui_room(bus, 0.08)
    pn = signal.lfilter([0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400], RNG.standard_normal((n, 2)), axis=0)
    fade = np.clip((DUR - np.arange(n) / SR) / 1.0, 0, 1)[:, None]
    return bus + pn / np.sqrt(np.mean(pn ** 2)) * 10 ** (-62 / 20) * fade


def main():
    tl = load_tl(sys.argv[1]); out = sys.argv[2]
    t16 = to16(tl)
    m = M.music(t16); u = ui(tl)
    e = np.abs(u).max(1); e = signal.lfilter([1 - np.exp(-1 / (0.18 * SR))], [1, -np.exp(-1 / (0.18 * SR))], e)
    duck = 1 - np.clip(e / (np.max(e) + 1e-9) * 1.2, 0, 0.2)
    mix = m * duck[:, None] + u * 1.3
    R_, H_, L_, C_ = tl['res'][0], tl['portalOut'][1], tl['portalIn'][0], 13.5
    pts = [(0, 4.0), (1.6, 4.0), (2.4, 5.5), (R_ - 0.6, 5.5), (R_ - 0.1, 0), (H_ - 0.6, 0), (H_, 6.5), (L_ - 0.1, 6.5), (L_ + 0.1, 7.0), (C_ - 0.1, 7.0), (C_, 0), (DUR, 0)]
    tg = np.arange(len(mix)) / SR
    mix = mix * (10 ** (np.interp(tg, [a_ for a_, _ in pts], [b_ for _, b_ in pts]) / 20))[:, None]
    g = np.ones(len(mix))
    for b0 in (tl['res'][0], tl['end'][0]):
        g = np.minimum(g, 1 - 0.9 * np.clip((tg - (b0 - 0.17)) / 0.03, 0, 1) * (tg < b0 - 0.002))
    mix = mix * g[:, None]
    mid = mix.mean(1, keepdims=True); mix = mid + (mix - mid) * 0.67
    pad_n = SR // 2
    mix = F2.F.master_pre(np.concatenate([np.zeros((pad_n, 2)), mix, np.zeros((pad_n, 2))]))[pad_n:-pad_n]
    mix = mix / np.max(np.abs(mix)) * 0.5
    to_wav(out + '_raw.wav', mix)
    print('tamam', out)


if __name__ == '__main__':
    main()
