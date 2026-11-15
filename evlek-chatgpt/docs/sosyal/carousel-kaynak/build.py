"""content.json -> img/*.png (film kırpmaları) + carousel.html (9 sayfa, 1080x1350)."""
import json, os, subprocess, html, sys
from PIL import Image

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
IMG = os.path.join(SRC, 'img'); os.makedirs(IMG, exist_ok=True)
FR = os.path.join(SRC, 'frames'); os.makedirs(FR, exist_ok=True)
FONT = '/home/user/Animation-Social-Media/evlek-chatgpt/node_modules/@fontsource/inter/files'

C = json.load(open(os.path.join(SRC, 'content.json'), encoding='utf-8'))
N = C['toplam']
W, H, M = 1080, 1350, 80
INNER = W - 2 * M

LOGO_VB = '1240 325 530 165'
LOGO_D = [
    'M1254.4 333H1353.4V357H1281.6V395.2H1349.4V419.2H1281.6V458H1353.4V482H1254.4Z',
    'M1361.15 373.2H1389.75L1415 442.942L1441.35 373.2H1469.95L1427.15 482H1403.95Z',
    'M1484.43 482V330.6H1510.63V482H1484.43Z',
    'M1586.42 484.4C1575.22 484.4 1565.42 481.867 1557.02 476.8C1548.62 471.733 1542.08 464.867 1537.42 456.2C1532.75 447.533 1530.42 437.933 1530.42 427.4C1530.42 416.467 1532.75 406.8 1537.42 398.4C1542.22 389.867 1548.68 383.133 1556.82 378.2C1565.08 373.267 1574.28 370.8 1584.42 370.8C1592.95 370.8 1600.42 372.2 1606.82 375C1613.35 377.8 1618.88 381.667 1623.42 386.6C1627.95 391.533 1631.42 397.2 1633.82 403.6C1636.22 409.867 1637.42 416.667 1637.42 424C1637.42 425.867 1637.28 427.8 1637.02 429.8C1636.88 431.8 1636.55 433.533 1636.02 435H1552.02V415H1621.22L1608.82 424.4C1610.02 418.267 1609.68 412.8 1607.82 408C1606.08 403.2 1603.15 399.4 1599.02 396.6C1595.02 393.8 1590.15 392.4 1584.42 392.4C1578.95 392.4 1574.08 393.8 1569.82 396.6C1565.55 399.267 1562.28 403.267 1560.02 408.6C1557.88 413.8 1557.08 420.133 1557.62 427.6C1557.08 434.267 1557.95 440.2 1560.22 445.4C1562.62 450.467 1566.08 454.4 1570.62 457.2C1575.28 460 1580.62 461.4 1586.62 461.4C1592.62 461.4 1597.68 460.133 1601.82 457.6C1606.08 455.067 1609.42 451.667 1611.82 447.4L1633.02 457.8C1630.88 463 1627.55 467.6 1623.02 471.6C1618.48 475.6 1613.08 478.733 1606.82 481C1600.68 483.267 1593.88 484.4 1586.42 484.4Z',
    'M1657.28 330.6H1683.48V416.33L1724.68 373.2H1757.28L1717.08 417L1758.08 482H1728.08L1697.57 433.672L1683.48 448.799V482H1657.28Z',
]

def logo(h, color='var(--navy)'):
    w = h * 530 / 165
    return (f'<svg class="logo" viewBox="{LOGO_VB}" width="{w:.1f}" height="{h}" aria-label="Evlek">'
            f'<path d="{" ".join(LOGO_D)}" fill="{color}"/></svg>')

def frame(t):
    p = os.path.join(FR, f'f_{t:.2f}.png')
    if not os.path.exists(p):
        subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', C['film'], '-frames:v', '1', '-y', p], check=True)
    return Image.open(p).convert('RGB')

def crop_card(name, t, x0, x1, y0, out_w, out_h):
    """Kaynak karede x0..x1 genişliği out_w'ye ölçeklenir; yükseklik out_h'den geri hesaplanır."""
    s = out_w / (x1 - x0)
    y1 = y0 + out_h / s
    im = frame(t)
    assert y1 <= im.height + 0.5, (name, y1)
    c = im.crop((x0, y0, x1, round(y1))).resize((out_w, out_h), Image.LANCZOS)
    c.save(os.path.join(IMG, name))
    return s

def crop_scale(name, t, x0, x1, y0, y1, s):
    im = frame(t).crop((x0, y0, x1, y1))
    w, h = round((x1 - x0) * s), round((y1 - y0) * s)
    im.resize((w, h), Image.LANCZOS).save(os.path.join(IMG, name))
    return w, h

e = lambda s: html.escape(s).replace('\n', '<br>')

def chrome(p):
    return (f'<div class="top">{logo(30)}<span class="num">{p["id"]:02d}<i>/</i>{N:02d}</span></div>')

def eyebrow(t):
    return f'<div class="eyebrow"><span class="rule"></span><span>{e(t)}</span></div>'

def tagrow(p):
    if 'tag' not in p: return ''
    note = f'<span class="tagnote">{e(p["tagNote"])}</span>' if p.get('tagNote') else ''
    return f'<div class="tagrow"><span class="tag">{e(p["tag"])}</span>{note}</div>'

def page_screen(p):
    im = p['img']; x0, x1, y0 = im['src']
    name = f'p{p["id"]:02d}.png'
    s = crop_card(name, im['t'], x0, x1, y0, INNER, im['cardH'])
    ring = ''
    if 'ring' in im:
        rx0, rx1, ry0, ry1 = im['ring']; pad = 9
        L = (rx0 - x0) * s - pad; T = (ry0 - y0) * s - pad
        ring = (f'<span class="ring" style="left:{L:.1f}px;top:{T:.1f}px;'
                f'width:{(rx1 - rx0) * s + 2 * pad:.1f}px;height:{(ry1 - ry0) * s + 2 * pad:.1f}px"></span>')
    if p.get('variant') == 'price':
        head = (f'<div class="pricerow"><span class="price">{e(p["price"])}</span>'
                f'<span class="specs">{e(p["specs"])}</span></div>')
    else:
        cls = 'title xl' if p.get('variant') == 'cover' else 'title'
        head = f'<h1 class="{cls}">{e(p["title"])}</h1>'
    sub = f'<p class="sub">{e(p["sub"])}</p>' if p.get('sub') else ''
    cue = ''
    if p.get('variant') == 'cover':
        cue = ('<div class="cue">Kaydırın <svg width="34" height="14" viewBox="0 0 34 14"><path d="M0 7H31M25 1L31 7L25 13" '
               'fill="none" stroke="currentColor" stroke-width="2.2"/></svg></div>')
    return (f'<section class="page screen p{p["id"]}">{chrome(p)}<div class="body">{eyebrow(p["eyebrow"])}{head}{tagrow(p)}{sub}{cue}</div>'
            f'<figure class="card" style="height:{im["cardH"]}px"><img src="img/{name}" alt="">{ring}</figure></section>')

def page_list(p):
    rows = ''.join(f'<li><span class="n">{i + 1:02d}</span><span class="t">{e(t)}</span></li>' for i, t in enumerate(p['items']))
    return f'<section class="page list">{chrome(p)}<div class="body">{eyebrow(p["eyebrow"])}<h1 class="title">{e(p["title"])}</h1></div><ol class="items">{rows}</ol></section>'

def page_figures(p):
    rows = ''.join(f'<li><span class="n">{e(r["n"])}</span><span class="lab"><b>{e(r["label"])}</b><span>{e(r["detail"])}</span></span></li>' for r in p['rows'])
    foot = f'<p class="foot"><span class="plus">+</span>{e(p["foot"])}</p>'
    return f'<section class="page figures">{chrome(p)}<div class="body">{eyebrow(p["eyebrow"])}<h1 class="title">{e(p["title"])}</h1></div><ul class="figs">{rows}</ul>{foot}</section>'

def page_steps(p):
    out = ''
    for i, st in enumerate(p['steps']):
        x0, x1, y0, y1 = st['src']
        name = f'p08_{i + 1}.png'
        w, h = crop_scale(name, st['t'], x0, x1, y0, y1, p['scale'])
        out += (f'<li><div class="lab"><span class="n">{i + 1}</span><b>{e(st["label"])}</b></div>'
                f'<figure class="sframe" style="width:{p["frameW"]}px;height:{h}px"><img src="img/{name}" width="{w}" height="{h}" alt=""></figure></li>')
    return f'<section class="page steps">{chrome(p)}<div class="body">{eyebrow(p["eyebrow"])}<h1 class="title">{e(p["title"])}</h1></div><ol class="stp">{out}</ol></section>'

def page_close(p):
    return (f'<section class="page close">{chrome(p)}<div class="body">{eyebrow(p["eyebrow"])}'
            f'<blockquote><span class="q">“</span>{e(p["quote"])}”</blockquote>'
            f'<div class="who"><b>{e(p["name"])}</b><span>{e(p["role"])}</span></div></div>'
            f'<div class="end"><div class="url">{e(p["url"])}</div><div class="urlline">{e(p["urlLine"])}</div>'
            f'<p class="note">{e(p["note"])}</p></div></section>')

R = {'screen': page_screen, 'list': page_list, 'figures': page_figures, 'steps': page_steps, 'close': page_close}

ff = ''
for wt in (400, 500, 600, 700):
    ff += (f"@font-face{{font-family:'Inter';font-weight:{wt};src:url('file://{FONT}/inter-latin-ext-{wt}-normal.woff2') format('woff2');"
           "unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}\n")
    ff += (f"@font-face{{font-family:'Inter';font-weight:{wt};src:url('file://{FONT}/inter-latin-{wt}-normal.woff2') format('woff2');"
           "unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}\n")

css = open(os.path.join(SRC, 'style.css'), encoding='utf-8').read()
pages = '\n'.join(R[p['layout']](p) for p in C['pages'])
doc = f'<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Evlek carousel</title><style>{ff}{css}</style></head><body>{pages}</body></html>'
open(os.path.join(SRC, 'carousel.html'), 'w', encoding='utf-8').write(doc)
print('ok', len(C['pages']), 'sayfa')
