"""sayfa_01..09.png -> onizleme.jpg (3x3 ızgara)."""
import os
from PIL import Image
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
w, h, g = 360, 450, 24
W = Image.new('RGB', (3 * w + 4 * g, 3 * h + 4 * g), (226, 222, 212))
for i in range(9):
    im = Image.open(os.path.join(OUT, f'sayfa_{i + 1:02d}.png')).convert('RGB')
    assert im.size == (1080, 1350), im.size
    W.paste(im.resize((w, h), Image.LANCZOS), (g + (i % 3) * (w + g), g + (i // 3) * (h + g)))
W.save(os.path.join(OUT, 'onizleme.jpg'), quality=90)
print('onizleme.jpg', W.size)

# PDF: 9 PNG -> 1080x1350 pt sayfalı PDF (72 dpi = 1 px : 1 pt), JPEG q95
pages = [Image.open(os.path.join(OUT, f'sayfa_{i + 1:02d}.png')).convert('RGB') for i in range(9)]
pdf = os.path.join(OUT, 'evlek_chatgpt_linkedin_carousel.pdf')
pages[0].save(pdf, save_all=True, append_images=pages[1:], resolution=72.0, quality=95, subsampling=0,
              title='Evlek × ChatGPT · LinkedIn carousel', author='Evlek')
print('pdf', os.path.getsize(pdf))
