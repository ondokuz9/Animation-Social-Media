# capture-v12.mjs sonrası: Lapta kart şeridini dikişler, üst/alt kırpımları çıkarır, insanlı/CGI kartları varlık dışında bırakır.
# Çalıştır: cd cap && python3 compose-v12.py
import json, os, hashlib
from PIL import Image
OUT = os.path.abspath('../public/v12/w'); TMP = os.path.abspath('../out/v12cap'); S = 3
L = json.load(open(f'{TMP}/lapta.json')); info = L['info']; sc = info['sc']
man = json.load(open(f'{OUT}/manifest.json')) if os.path.exists(f'{OUT}/manifest.json') else {}
sha = lambda f: hashlib.sha256(open(f, 'rb').read()).hexdigest()
H = round(sc['h'] * S)
strip = Image.new('RGB', (info['sw'] * S, H))
for t in L['tiles']:
    im = Image.open(t['f']).convert('RGB'); strip.paste(im, (round(t['scrollLeft'] * S), 0))
c3 = info['cards'][3]['r']; x0 = round((c3['x'] - sc['x']) * S) - 6 * S
# kart konumları içerik koordinatında (scrollLeft=0'da ölçüldü)
row = strip.crop((x0, 0, strip.width, H)); row.save(f'{OUT}/wLaptaRow.png')
cards = [{'x': (c['r']['x'] - sc['x']) - x0 / S, 'w': c['r']['w'], 'y': c['r']['y'] - sc['y'], 'h': c['r']['h'], 't': c['t']} for c in info['cards'][3:]]
full = Image.open(L['full']).convert('RGB')
yT = round(sc['y'] * S); full.crop((0, 0, full.width, yT)).save(f'{OUT}/wLaptaTop.png')
yB = round((sc['y'] + sc['h']) * S); full.crop((0, yB, full.width, full.height)).save(f'{OUT}/wLaptaBot.png')
man.pop('wLapta.png', None); os.remove(L['full'])
man['wLaptaRow.png'] = {'x0_pt': x0 / S, 'sc': sc, 'cards': cards, 'sha256': sha(f'{OUT}/wLaptaRow.png')}
man['wLaptaTop.png'] = {'h_pt': yT / S, 'sha256': sha(f'{OUT}/wLaptaTop.png')}
man['wLaptaBot.png'] = {'y_pt': yB / S, 'h_pt': (full.height - yB) / S, 'sha256': sha(f'{OUT}/wLaptaBot.png')}
json.dump(man, open(f'{OUT}/manifest.json', 'w'), indent=1, ensure_ascii=False)
print('row', row.size, 'top', yT, 'bot', yB, [ (round(c['x']), c['t'][:20]) for c in cards])
