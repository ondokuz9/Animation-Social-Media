"""VIDEO-1 v16 ses miksi · 19,0 sn · 120 BPM (vuruş 0,5 sn), Re majör. Plan: docs/v16/V16-KREATIF-RAPOR.md (ses bölümü).
Kaynaklar film15_2 ile aynı: CC0 kayıtlar (Kenney arayüz, VCSL piyano/vibrafon/glockenspiel/klap/hat) + sentez omurga.
İki an AYRI işlev taşır:
  · sonuç (2,5 sn)  = ritmik vuruş: 144 ms nefes, sonra kick + klap + glockenspiel + piyano; groove girer.
  · ev    (5,5 sn)  = ritmin açılması: davul bir vuruş önce çıkar, uzun lidyen akor, filtre açılır, deniz girer, tek piyano notası.
Dinamik fader otomasyonuyla değil katman giriş/çıkışıyla kurulur. Ped panla yayılır (mono uyumu).
Çalıştır: cd audio && python3 film16.py ../src/v16/tl.ts ../out/audio/v16
"""
import re, sys, json
import numpy as np
from scipy import signal
import film15_2 as F2          # film15'i CC0 örneklerle yamalar
import film15 as F
from synth import SR, RNG, t_, stereo, env_adsr, lp, hp, bp, noise, saw_bl, midi, make_ir, place, to_wav

DUR = 19.0
KI, KU = F2.KI, F2.KU
BEAT = 0.5


def load_tl(path):
    s = open(path, encoding='utf-8').read()
    tl = {}
    for k, v in re.findall(r'(\w+):\s*(\[[-\d., ]*\]|-?[\d.]+)', s[s.index('export const TL'):]):
        try: tl[k] = json.loads(v)
        except Exception: pass
    return tl


CH = {'Gmaj9': (43, [55, 59, 62, 66, 69]), 'Dmaj9': (38, [50, 54, 57, 61, 64]), 'Bm11': (35, [47, 50, 54, 57, 64]), 'A': (45, [57, 61, 64]),
      'Glyd': (43, [55, 59, 62, 66, 73]), 'Em9': (40, [52, 55, 59, 62, 66]), 'Asus4': (45, [57, 62, 64]), 'Bm9': (35, [47, 50, 54, 57, 61]), 'Dadd9': (38, [50, 57, 64, 66])}


def pad(notes, dur, cut0, cut1=None, sweep=0.6, amp=0.06, a=0.5, r=1.4):
    """cam ped: üç ses panla yayılır (±0,5), detune ±5 cent her kanalda ortak → mono toplamda kayıp az."""
    t = t_(dur); out = np.zeros((len(t), 2))
    for m in notes:
        f = midi(m)
        for c, p in ((-5, -0.28), (0, 0.0), (5, 0.28)):
            v = saw_bl(f * 2 ** (c / 1200), t + RNG.uniform(0, 1) / f, maxf=7000)
            out += stereo(v, p) * (0.8 if c == 0 else 0.6)
        out += stereo(0.12 * np.sin(2 * np.pi * f / 2 * t))
    out /= len(notes) * 2.4
    y = lp(out, cut0, 2)
    if cut1:
        k = np.clip(t / sweep, 0, 1)[:, None]
        y = y * (1 - k) + lp(out, cut1, 2) * k
    y = F.peak(y, 500, 1.0, -3.0)
    return y * env_adsr(len(t), a=a, d=0.6, s=0.85, r=r)[:, None] * amp


def music(tl):
    n = int((DUR + 4) * SR)
    bus = {k: np.zeros((n, 2)) for k in ('pad', 'keys', 'pluck', 'bass', 'drums', 'fx')}
    RES, OPEN, HOUSE, LAND, CTA, BOUND, END = tl['shrink'][1], tl['expand'][1], tl['expand2'][1], tl['land'][0], tl['cut'], tl['bound'], tl['end'][0]
    # ---- açılış (0–1,75): fotoğraf kadrajda → havadar. açık ped (lidyen), sub yok, vibrafon öbeklerle (ui)
    place(bus['pad'], pad(CH['Glyd'][1], 2.3, 2600, 5200, 1.2, amp=0.06, a=0.08, r=0.5), 0.0)
    place(bus['keys'], F.felt(78, 2.4, 0.045), 0.02); place(bus['keys'], F.felt(66, 2.4, 0.03, -0.15), 0.02)
    # fotoğraf karta inerken: emme (1,5–2,5), 16'lık klap merdiveni son vuruşta
    place(bus['fx'], F.reverse_swell(0.95, 0.05, 700, 5000), RES - 1.0)
    for i in range(3): place(bus['drums'], F.clap(0.02 + 0.012 * i), RES - 0.5 + i * BEAT / 4)
    # ---- SONUÇ (2,5): ritmik vuruş + groove (2,5–5,0)
    place(bus['fx'], F.impact(0.42, bells=(86, 93)), RES)
    place(bus['drums'], F.kick(0.3), RES); place(bus['drums'], F.clap(0.14), RES)
    place(bus['fx'], F.fm_bell((86, 93, 98), 2.2, 0.07), RES); place(bus['keys'], F.saw_stab([62, 66, 69, 73], 1.2, 0.08), RES)
    for i, m in enumerate((62, 66, 69, 74, 78)):
        place(bus['keys'], F.felt(m, 2.2, 0.075, pan=(i - 2) * 0.1), RES + 0.004 * i)
    place(bus['pad'], pad(CH['Dmaj9'][1], 2.0 + 0.8, 4200, amp=0.07, a=0.02, r=0.8), RES)
    place(bus['pad'], pad(CH['Bm11'][1], 1.0 + 0.5, 3600, amp=0.065, a=0.05, r=0.5), RES + 2.0)
    kicks = []
    def groove(t0, t1, full=True, bassn=50):
        b = 0
        at = t0
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
    # ---- EV (5,5): davul yok, lidyen akor 2,5 sn, filtre 1800 → 6000 Hz / 0,6 sn, tek piyano notası (F#5)
    place(bus['pad'], pad(CH['Glyd'][1], 2.5 + 1.2, 1800, 6000, 0.6, amp=0.045, a=0.35, r=1.4), HOUSE)
    place(bus['keys'], F.felt(78, 3.0, 0.04), HOUSE + 0.02)
    place(bus['bass'], stereo(np.sin(2 * np.pi * midi(31) * t_(2.4)) * env_adsr(int(2.4 * SR), a=0.3, d=0.4, s=0.6, r=1.0) * 0.06), HOUSE)
    place(bus['keys'], F.felt(81, 2.6, 0.045, 0.1), HOUSE + 1.0); place(bus['keys'], F.felt(74, 2.4, 0.03, -0.15), HOUSE + 1.5)
    for i, m in enumerate([71, 78, 74, 78]):
        place(bus['pluck'], F.ks_pluck(m, 0.9, 0.03, pan=0.3 if i % 2 else -0.3), HOUSE + 1.0 + i * BEAT / 2)
    # ---- ilan (10,0–12,0): ritim hafifçe döner (yarım groove), Asus4 → A
    place(bus['pad'], pad(CH['Asus4'][1], 1.0 + 0.6, 4200, amp=0.065, a=0.1, r=0.5), LAND)
    place(bus['pad'], pad(CH['A'][1], 1.0 + 0.5, 4200, amp=0.065, a=0.05, r=0.4), LAND + 1.0)
    groove(LAND, CTA - BEAT, False)
    for i in range(4): place(bus['bass'], F.synth_bass(45, BEAT * 0.9, 0.04), LAND + i * BEAT)
    place(bus['fx'], F.reverse_swell(0.45, 0.04), CTA - 0.47)
    # ---- CTA (12,0–15,0): groove tam; Bağlı (13,5) ikinci vuruş
    place(bus['pad'], pad(CH['Dmaj9'][1], 1.5 + 0.6, 4500, amp=0.07, a=0.02, r=0.5), CTA)
    place(bus['pad'], pad(CH['Bm9'][1], 1.0 + 0.5, 4500, amp=0.07, a=0.03, r=0.4), BOUND)
    place(bus['pad'], pad(CH['A'][1], 0.5 + 0.4, 5000, amp=0.07, a=0.03, r=0.3), BOUND + 1.0)
    place(bus['drums'], F.kick(0.28), CTA); place(bus['drums'], F.clap(0.07), CTA)
    for i, m in enumerate((62, 66, 69, 76)):
        place(bus['keys'], F.felt(m, 1.6, 0.04, pan=(i - 1.5) * 0.12), CTA + 0.006 * i)
    groove(CTA + BEAT, END - BEAT, True, lambda at: 50 if at < BOUND else (47 if at < BOUND + 1.0 else 45))
    for i, m in enumerate([74, 69, 76, 69, 78, 69, 76, 69, 74, 69]):
        place(bus['pluck'], F.ks_pluck(m, 0.8, 0.06, pan=0.25 if i % 2 else -0.25), CTA + i * BEAT / 2)
    place(bus['fx'], F.impact(0.24, bells=(86, 90)), BOUND)
    for i in range(4): place(bus['drums'], F.clap(0.02 + 0.012 * i), END - 0.5 + i * BEAT / 4)
    place(bus['fx'], F.reverse_swell(0.4, 0.045), END - 0.42)
    # ---- KAPANIŞ (15,0): en yüksek an; Dadd9 uzun kuyruk
    place(bus['fx'], F.impact(0.8, 36.7, 80, 0.06, (86, 93, 98)), END)
    place(bus['drums'], F.kick(0.32), END); place(bus['drums'], F.clap(0.14), END)
    place(bus['fx'], F.fm_bell((86, 93, 98), 3.0, 0.08), END)
    place(bus['keys'], F.saw_stab([50, 54, 57, 61, 64], 2.2, 0.12), END)
    place(bus['pad'], pad(CH['Dadd9'][1], 3.6, 5000, amp=0.07, a=0.02, r=2.4), END)
    for i, m in enumerate((62, 69, 74, 78, 81)):
        place(bus['keys'], F.felt(m, 3.2, 0.05, pan=(i - 2) * 0.14), END + 0.008 * i)
    # sidechain (kick)
    trig = np.zeros(n)
    for at in kicks + [RES, CTA, BOUND, END]: trig[int(at * SR)] = 1
    kk = np.arange(int(0.5 * SR)) / SR; duck = np.clip(np.convolve(trig, (1 - np.exp(-kk / 0.005)) * np.exp(-kk / 0.12))[:n], 0, 1)
    for b_, d_ in (('pad', 0.4), ('pluck', 0.35), ('bass', 0.55)): bus[b_] *= (1 - d_ * duck)[:, None]
    mix = bus['pad'] + bus['keys'] + bus['pluck'] * 0.9 + bus['bass'] + bus['drums'] * 0.85 + bus['fx']
    # nefesler: sonuçtan ve kapanıştan 144 ms önce ped dışı her şey −12 dB
    for b0 in (RES, END):
        i0, i1 = int((b0 - 0.144) * SR), int(b0 * SR)
        mix[i0:i1] = bus['pad'][i0:i1] + (mix[i0:i1] - bus['pad'][i0:i1]) * 0.25
    # reverb gönderimi; ev bölümünde ped gönderimi +3,5 dB
    tt = np.arange(n) / SR
    hs = 1 + 0.5 * (np.clip((tt - HOUSE) / 0.3, 0, 1) * np.clip((LAND - tt) / 0.5, 0, 1) + np.clip((RES - 0.8 - tt) / 0.3, 0, 1))
    send = bus['pad'] * 0.30 * hs[:, None] + bus['keys'] * 0.30 + bus['pluck'] * 0.22 + bus['fx'] * 0.35
    plate = make_ir(2.6, predelay=0.022, damp=6000, size=1.1, seed=3)
    wet = np.stack([signal.fftconvolve(send[:, c], plate[:, c])[:n] for c in range(2)], 1)
    mix = mix + lp(hp(wet, 250), 9000)
    out = mix[: int(DUR * SR)].copy()
    t2 = np.arange(len(out)) / SR
    return out * np.where(t2 < 17.4, 1.0, np.clip(1 - (t2 - 17.4) / 1.5, 0, 1) ** 2.0)[:, None]


def ui(tl):
    n = int(DUR * SR); bus = np.zeros((n, 2))
    pan = lambda x: 0.35 * (x - 540) / 540
    k, tuned, jit = F2.k, F2.tuned, F2.jit
    TAP = -6.0  # ses raporu: dokunuşlar sonuç vuruşunun altında kalmalı
    # sorgu öbekleri: öbek başına tek tık + yükselen vibrafon notası (D5 E5 F#5)
    for i, at in enumerate(tl['chunks'][1:]):
        place(bus, k(KI + 'click_003', F.key_tick(-27, False), 0, jit()), at)
        place(bus, k(KI + 'click_005', F.key_tick(-33, False), 0, jit()), at + 0.05)
        place(bus, F.ks_pluck([74, 76, 78][i], 0.7, 0.04, pan=(i - 1) * 0.2), at)
    # açılış: deniz (fotoğraf), karta inerken alçalan hava, sonuç oturması
    place(bus, bp(F.sea(tl['shrink'][1] + 0.2, amp=0.04), 400, 4000)[int(0.5 * SR):], 0.0)
    a = t_(tl['shrink'][1] - tl['shrink'][0]); kk = a / a[-1]
    place(bus, stereo(bp(noise(len(a)), 400, 3000) * np.sin(np.pi * kk) ** 2 * 0.012), tl['shrink'][0])
    place(bus, tuned(KI + 'drop_003', 77.85, 78, F.tone_pair(240, 480, 0.06, 0.4, -24, paper=True)), tl['shrink'][1] + 0.02)
    # karta dokunuş → ilan
    place(bus, k(KI + 'select_007', F.tap(-17), TAP, jit(), pan(396)), tl['tap'])
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -26)), tl['expand'][1] - 0.02)
    # galeri kaydırma
    d = tl['page2'][0] - tl['swipe'][0] + 0.1; place(bus, stereo(F.friction(d, -33, np.sin(np.pi * np.linspace(0, 1, int(d * SR))))), tl['swipe'][0])
    place(bus, tuned(KI + 'glass_006', 89.6, 90, F.tone_pair(200, 400, 0.05, 0.3, -28), -2), tl['page2'][1] - 0.05)
    # ev: açılırken hava, sonra deniz (400–4000 Hz), ilana dönüşte söner
    a = t_(tl['expand2'][1] - tl['expand2'][0]); kk = a / a[-1]
    place(bus, stereo(bp(noise(len(a)), 500, 4000) * kk ** 2 * 0.02), tl['expand2'][0])
    sea = F.sea(tl['land'][1] - tl['expand2'][1] + 0.6, amp=0.03)
    place(bus, bp(sea, 400, 4000), tl['expand2'][1] - 0.4)
    place(bus, tuned(KI + 'drop_004', 74.7, 74, F.tone_pair(180, 360, 0.08, 0.5, -24)), tl['land'][1] - 0.03)
    place(bus, k(KI + 'select_002', F.tap(-16), TAP, jit(), pan(881)), tl['contact'])
    # CTA
    place(bus, k(KU + 'switch13', F.detent(-34), 0), tl['ctaIn'][1])
    place(bus, k(KI + 'select_002', F.tap(-17), TAP, jit()), tl['install'])
    place(bus, k(KI + 'toggle_001', F.detent(-27), 0), tl['bound'])
    place(bus, tuned(KI + 'confirmation_002', 86.0, 86, F.felt(86, 0.6, 0.05), -2), tl['bound'] + 0.01)
    place(bus, F.felt(74, 1.6, 0.05, -0.1), tl['bound'] + 0.012); place(bus, F.felt(81, 1.6, 0.04, 0.1), tl['bound'] + 0.019)
    # kapanış imzası 'Ev·lek': A4 (logo) → D5 (başlık tamam), CTA satırında yumuşak nota
    place(bus, F.logo_note(69, -22), tl['end'][0])
    place(bus, F.logo_note(74, -19, sub=True), tl['etitle'][1])
    place(bus, F.ks_pluck(86, 1.0, 0.04), tl['cta'][0] + 0.1)
    bus = F.ui_room(bus, 0.08)
    pn = signal.lfilter([0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400], RNG.standard_normal((n, 2)), axis=0)
    fade = np.clip((DUR - np.arange(n) / SR) / 1.0, 0, 1)[:, None]
    return bus + pn / np.sqrt(np.mean(pn ** 2)) * 10 ** (-62 / 20) * fade


def main():
    tl = load_tl(sys.argv[1]); out = sys.argv[2]
    m = music(tl); u = ui(tl)
    e = np.abs(u).max(1); e = signal.lfilter([1 - np.exp(-1 / (0.18 * SR))], [1, -np.exp(-1 / (0.18 * SR))], e)
    duck = 1 - np.clip(e / (np.max(e) + 1e-9) * 1.2, 0, 0.2)
    mix = m * duck[:, None] + u * 1.3
    # nefes: sonuçtan ve kapanıştan önce 150 ms gerçek boşluk (−20 dB), vuruşta tam açılır
    tt = np.arange(len(mix)) / SR; g = np.ones(len(mix))
    for b0 in (tl['shrink'][1], tl['end'][0]):
        g = np.minimum(g, 1 - 0.9 * np.clip((tt - (b0 - 0.17)) / 0.03, 0, 1) * (tt < b0 - 0.002))
    mix = mix * g[:, None]
    pad_n = SR // 2
    mix = F2.F.master_pre(np.concatenate([np.zeros((pad_n, 2)), mix, np.zeros((pad_n, 2))]))[pad_n:-pad_n]
    mix = mix / np.max(np.abs(mix)) * 0.5
    to_wav(out + '_raw.wav', mix)
    to_wav(out + '_music.wav', m / np.max(np.abs(m)) * 0.5)
    to_wav(out + '_ui.wav', u / np.max(np.abs(u)) * 0.5)
    print('tamam', out)


if __name__ == '__main__':
    main()
