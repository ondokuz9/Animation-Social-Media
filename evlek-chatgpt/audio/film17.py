"""V17 · FINAL ses miksi · 22,0 sn · 120 BPM, Re majör. Müzik film16 ile aynı yapı (CC0 kayıtlar + sentez omurga),
zaman noktaları v17 kurgusuna eşlenir; arayüz sesleri v17 akışına göre yeniden yerleşir (eklenti adımları dahil).
Çalıştır: cd audio && python3 film17.py ../src/v17/tl.ts ../out/audio/v17
"""
import sys
import numpy as np
from scipy import signal
import film16 as M
from film16 import F, F2, KI, KU, CH, BEAT, pad, load_tl
from synth import SR, RNG, t_, stereo, bp, hp, lp, noise, midi, env_adsr, make_ir, place, to_wav

M.DUR = 22.0
DUR = M.DUR


def to16(tl):
    """v17 olaylarını film16 müziğinin beklediği adlara eşle."""
    return {**tl, 'expand2': tl['portalOut'], 'land': tl['portalIn'], 'cut': 13.5, 'end': tl['end'], 'shrink': [tl['push'][0], tl['push'][1]]}


def music17(tl):
    """film16.music'in v17 kopyası (ses uzmanı turu): eklenti bölümüne akor yürüyüşü, ızgaraya oturan yarım groove,
    açılışta 'Ev·lek' motifi + kapalı hat, 320 Hz −3 dB, Em9'dan E3 çıkarıldı."""
    DURm = DUR
    n = int((DURm + 4) * SR)
    bus = {k: np.zeros((n, 2)) for k in ('pad', 'keys', 'pluck', 'bass', 'drums', 'fx')}
    RES, OPEN, HOUSE, LAND, CTA, BOUND, END = tl['res'][0], 8.0, tl['portalOut'][1], 11.5, 13.5, tl['bound'], tl['end'][0]
    # ---- açılış (0–2,4): Ev·lek motifi (A4 → D5) + açık ped + kapalı hat sekizlikleri
    place(bus['pad'], pad(CH['Glyd'][1], 2.3, 2600, 5200, 1.2, amp=0.06, a=0.08, r=0.5), 0.0)
    place(bus['keys'], F.felt(69, 2.0, 0.05), 0.0); place(bus['keys'], F.felt(74, 2.2, 0.05, 0.1), 0.5)
    for i in range(int(4.4 / (BEAT / 2))): place(bus['drums'], F.mhat(0.03 if i * BEAT / 2 < 2.4 else 0.04), i * BEAT / 2 + RNG.normal(0, 0.003))  # yazma boyunca da (2–5 kHz netlik)
    place(bus['pad'], pad([55, 59, 62, 66], 2.3, 1400, 3200, 2.0, amp=0.05, a=0.3, r=0.4), tl['push'][0])
    for i in range(10):
        place(bus['pluck'], lp(F.ks_pluck([69, 76][i % 2], 0.6, 0.025 + 0.02 * i / 9, pan=0.25 if i % 2 else -0.25), 1200 + 1500 * i / 9), 2.0 + i * BEAT / 2)
    place(bus['fx'], F.reverse_swell(0.95, 0.05, 700, 5000), RES - 1.0)
    for i in range(3): place(bus['drums'], F.clap(0.02 + 0.012 * i), RES - 0.5 + i * BEAT / 4)
    # ---- SONUÇ: ritmik vuruş + groove
    place(bus['fx'], F.impact(0.42, bells=(86, 93)), RES)
    place(bus['drums'], F.kick(0.3), RES); place(bus['drums'], F.clap(0.14), RES)
    place(bus['fx'], F.fm_bell((86, 93, 98), 2.2, 0.07), RES); place(bus['keys'], F.saw_stab([62, 66, 69, 73], 1.2, 0.08), RES)
    for i, m in enumerate((62, 66, 69, 74, 78)):
        place(bus['keys'], F.felt(m, 2.2, 0.075, pan=(i - 2) * 0.1), RES + 0.004 * i)
    place(bus['pad'], pad(CH['Dmaj9'][1], 2.0 + 0.8, 4200, amp=0.07, a=0.02, r=0.8), RES)
    place(bus['pad'], pad(CH['Bm11'][1], 1.0 + 0.5, 3600, amp=0.065, a=0.05, r=0.5), RES + 2.0)
    kicks = []
    def groove(t0, t1, full=True, bassn=50):
        b = 0; at = t0
        while at < t1 - 1e-6:
            if b % 2 == 0: place(bus['drums'], F.kick(0.24 if full else 0.16), at); kicks.append(at)
            if full and b % 2 == 1: place(bus['drums'], F.clap(0.06, 0.05), at + RNG.normal(0, 0.003))
            place(bus['drums'], F.mhat(0.06), at + RNG.normal(0, 0.003))
            place(bus['drums'], (F.open_hat(0.03) if full else F.mhat(0.035)), at + BEAT / 2 + RNG.normal(0, 0.003))
            if full:
                for h in range(2): place(bus['bass'], F.synth_bass(bassn(at) if callable(bassn) else bassn, BEAT / 2 * 0.9, 0.05), at + h * BEAT / 2)
            at += BEAT; b += 1
    groove(RES + BEAT, HOUSE - BEAT, True, lambda at: 50 if at < RES + 2.0 else (47 if at < OPEN else 55))
    place(bus['pad'], pad(CH['Gmaj9'][1], 2.0 + 0.4, 4200, amp=0.07, a=0.03, r=0.4), OPEN)
    place(bus['drums'], F.kick(0.26), OPEN)
    for i, m in enumerate((67, 71, 74, 78)):
        place(bus['keys'], F.felt(m, 1.8, 0.04, pan=(i - 1.5) * 0.12), OPEN + 0.006 * i)
    for i, m in enumerate([74, 71, 78, 71, 74, 71, 76, 71]):
        place(bus['pluck'], F.ks_pluck(m, 0.8, 0.06, pan=0.25 if i % 2 else -0.25), OPEN + i * BEAT / 2)
    for i, m in enumerate([74, 69, 76, 69, 78, 69, 76, 69]):
        place(bus['pluck'], F.ks_pluck(m, 0.8, 0.06, pan=0.25 if i % 2 else -0.25), RES + BEAT + i * BEAT / 2)
    # ---- EV: davul yok, lidyen akor, filtre açılır, tek piyano notası
    place(bus['pad'], pad(CH['Glyd'][1], 1.5 + 1.2, 1800, 6000, 0.6, amp=0.024, a=0.35, r=1.4), HOUSE)
    place(bus['keys'], F.felt(78, 3.0, 0.028), HOUSE + 0.02)
    place(bus['bass'], stereo(np.sin(2 * np.pi * midi(31) * t_(2.0)) * env_adsr(int(2.0 * SR), a=0.3, d=0.4, s=0.6, r=1.0) * 0.035), HOUSE)
    place(bus['keys'], F.felt(81, 2.0, 0.03, 0.1), HOUSE + 0.75)
    # ---- ilan → emlakçı (11,5–13,5): yarım groove ızgarada, Asus4 → A
    place(bus['pad'], pad(CH['Asus4'][1], 1.0 + 0.6, 4200, amp=0.065, a=0.1, r=0.5), LAND)
    place(bus['pad'], pad(CH['A'][1], 1.0 + 0.5, 4200, amp=0.065, a=0.05, r=0.4), LAND + 1.0)
    groove(LAND, CTA - BEAT, False)
    for i in range(4): place(bus['bass'], F.synth_bass(45, BEAT * 0.9, 0.04), LAND + i * BEAT)
    place(bus['fx'], F.reverse_swell(0.45, 0.04), CTA - 0.47)
    # ---- EKLENTİLER (13,5–19,5): akor yürüyüşü adımlarla örtüşür, Bağlı'da Bm9 → A → bitişte D
    walk = [(13.5, 'Dmaj9', 1.0), (14.5, 'Gmaj9', 1.0), (15.5, 'Em9', 1.0), (16.5, 'A', 1.0), (17.5, 'Asus4', 0.5), (BOUND, 'Bm9', 0.5), (BOUND + 0.5, 'A', 1.0)]
    for at, name, d in walk:
        place(bus['pad'], pad(CH[name][1], d + 0.4, 4200, amp=0.058, a=0.03, r=0.4), at)
    place(bus['drums'], F.kick(0.28), CTA); place(bus['drums'], F.clap(0.07), CTA)
    for i, m in enumerate((62, 66, 69, 76)):
        place(bus['keys'], F.felt(m, 1.6, 0.04, pan=(i - 1.5) * 0.12), CTA + 0.006 * i)
    root = lambda at: 50 if at < 14.5 else 55 if at < 15.5 else 52 if at < 16.5 else 45 if at < BOUND else 47 if at < BOUND + 0.5 else 45
    groove(CTA + BEAT, END - BEAT, True, root)
    for i, m in enumerate([74, 69, 76, 69]):
        place(bus['pluck'], F.ks_pluck(m, 0.8, 0.06, pan=0.25 if i % 2 else -0.25), CTA + i * BEAT / 2)
    for i, m in enumerate([74, 71, 78, 71, 74, 71, 76, 71] + [74, 71, 76, 71, 78, 71, 76, 73, 76, 73]):
        place(bus['pluck'], F.ks_pluck(m, 0.8, 0.045 if i >= 8 else 0.05, pan=0.25 if i % 2 else -0.25), 14.5 + i * BEAT / 2)
    place(bus['fx'], F.impact(0.24, bells=(86, 90)), BOUND)
    for i in range(4): place(bus['drums'], F.clap(0.02 + 0.012 * i), END - 0.5 + i * BEAT / 4)
    place(bus['fx'], F.reverse_swell(0.4, 0.045), END - 0.42)
    # ---- BİTİŞ: en yüksek an; Dadd9 uzun kuyruk
    place(bus['fx'], F.impact(0.8, 36.7, 80, 0.06, (86, 93, 98)), END)
    place(bus['drums'], F.kick(0.32), END); place(bus['drums'], F.clap(0.14), END)
    place(bus['fx'], F.fm_bell((86, 93, 98), 3.0, 0.08), END)
    place(bus['keys'], F.saw_stab([50, 54, 57, 61, 64], 2.2, 0.12), END)
    place(bus['pad'], pad(CH['Dadd9'][1], 3.6, 5000, amp=0.07, a=0.02, r=2.4), END)
    for i, m in enumerate((62, 69, 74, 78, 81)):
        place(bus['keys'], F.felt(m, 3.2, 0.05, pan=(i - 2) * 0.14), END + 0.008 * i)
    # 200–500 Hz çamur: ped ve tuş busu 320 Hz −3 dB
    bus['pad'] = F.peak(F.peak(bus['pad'], 300, 0.8, -6.0), 3000, 0.9, 2.0); bus['keys'] = F.peak(bus['keys'], 320, 0.9, -4.0); bus['bass'] = F.peak(bus['bass'], 260, 1.0, -2.0)
    trig = np.zeros(n)
    for at in kicks + [RES, CTA, BOUND, END]: trig[int(at * SR)] = 1
    kk = np.arange(int(0.5 * SR)) / SR; duck = np.clip(np.convolve(trig, (1 - np.exp(-kk / 0.005)) * np.exp(-kk / 0.12))[:n], 0, 1)
    for b_, d_ in (('pad', 0.4), ('pluck', 0.35), ('bass', 0.55)): bus[b_] *= (1 - d_ * duck)[:, None]
    mix = bus['pad'] + bus['keys'] + bus['pluck'] * 0.9 + bus['bass'] + bus['drums'] * 0.85 + bus['fx']
    for b0 in (RES, END):
        i0, i1 = int((b0 - 0.144) * SR), int(b0 * SR)
        mix[i0:i1] = bus['pad'][i0:i1] + (mix[i0:i1] - bus['pad'][i0:i1]) * 0.25
    tt = np.arange(n) / SR
    hs = 1 + 0.5 * np.clip((tt - HOUSE) / 0.3, 0, 1) * np.clip((tl['portalIn'][0] - tt) / 0.5, 0, 1)
    send = bus['pad'] * 0.30 * hs[:, None] + bus['keys'] * 0.30 + bus['pluck'] * 0.22 + bus['fx'] * 0.35
    plate = make_ir(2.6, predelay=0.022, damp=6000, size=1.1, seed=3)
    wet = np.stack([signal.fftconvolve(send[:, c], plate[:, c])[:n] for c in range(2)], 1)
    mix = mix + lp(hp(wet, 250), 9000)
    return mix[: int(DURm * SR)].copy()


def ui(tl):
    n = int(DUR * SR); bus = np.zeros((n, 2))
    pan = lambda x: 0.35 * (x - 540) / 540
    k, tuned, jit = F2.k, F2.tuned, F2.jit
    TAP = -6.0
    # açılış: başlık notası (piyano) + yaklaşma havası
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
    taps = {'menu': ('select_002', 110), 'plug': ('select_007', 260), 'searchTap': ('select_002', 589), 'row': ('select_007', 330), 'install': ('select_002', 540, -20), 'tryTap': ('select_007', 540)}
    for key, v in taps.items():
        nm, x = v[0], v[1]; lvl = v[2] if len(v) > 2 else -18
        place(bus, k(KI + nm, F.tap(lvl), TAP, jit(), pan(x)), tl[key])
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
    m = music17(tl); u = ui(tl)
    e = np.abs(u).max(1); e = signal.lfilter([1 - np.exp(-1 / (0.18 * SR))], [1, -np.exp(-1 / (0.18 * SR))], e)
    duck = 1 - np.clip(e / (np.max(e) + 1e-9) * 1.2, 0, 0.2)
    mix = m * duck[:, None] + u * 1.3
    R_, H_, L_, C_ = tl['res'][0], tl['portalOut'][1], tl['portalIn'][0], 13.5
    pts = [(0, 7.0), (1.0, 8.0), (2.4, 7.0), (R_ - 0.6, 5.5), (R_ - 0.12, 3.0), (R_ - 0.02, -3.0), (5.75, -3.0), (6.0, 0), (H_ - 0.6, 0), (H_, 6.5), (L_ - 0.1, 6.5), (L_ + 0.1, 7.0),
           (13.4, 7.0), (13.5, 2.0), (17.8, 2.0), (18.0, 0), (19.4, 0), (19.48, 2.0), (20.4, 2.0), (21.0, 0), (DUR, 0)]  # ses uzmanı: eklenti bölümü dolu, bitiş en yüksek
    tg = np.arange(len(mix)) / SR
    mix = mix * (10 ** (np.interp(tg, [a_ for a_, _ in pts], [b_ for _, b_ in pts]) / 20))[:, None]
    g = np.ones(len(mix))
    for b0, dep in ((tl['res'][0], 0.9), (tl['bound'], 0.5), (tl['end'][0], 0.9)):  # Bağlı'ya hafif nefes
        g = np.minimum(g, 1 - dep * np.clip((tg - (b0 - 0.17)) / 0.03, 0, 1) * (tg < b0 - 0.002))
    mix = mix * g[:, None]
    mid = mix.mean(1, keepdims=True); mix = mid + (mix - mid) * 0.67
    pad_n = SR // 2
    mix = F2.F.master_pre(np.concatenate([np.zeros((pad_n, 2)), mix, np.zeros((pad_n, 2))]))[pad_n:-pad_n]
    # kuyruk: 21,20–21,92 yükseltilmiş kosinüs, sonra sıfır (görüntü son 0,5 sn'de açılıyor)
    fo = np.clip((tg[:len(mix)] - 21.2) / 0.72, 0, 1); mix = mix * (0.5 + 0.5 * np.cos(np.pi * fo))[:, None]; mix[tg[:len(mix)] >= 21.92] = 0
    mix = mix / np.max(np.abs(mix)) * 0.5
    to_wav(out + '_raw.wav', mix)
    print('tamam', out)


if __name__ == '__main__':
    main()
