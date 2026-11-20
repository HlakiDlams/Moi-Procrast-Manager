"""Builds every app icon and splash screen from design/app-icon-source.png.
Run from the repo root:  python3 design/make-icons.py
The source is a white mark on a flat colour; the mark is cut out by whiteness."""
from PIL import Image, ImageDraw, ImageChops
import os

SRC = 'design/app-icon-source.png'
src = Image.open(SRC).convert('RGB')
BG = src.getpixel((8, 8))  # brand colour
r, g, b = src.split()
# white mark -> alpha: the channel furthest from white in the background tells mark from background
lo = min(BG)
ch = [r, g, b][BG.index(lo)]
alpha = ch.point(lambda v: max(0, min(255, round((v - lo - 12) * 255 / (255 - lo - 24)))))
mark = Image.new('RGBA', src.size, (255, 255, 255, 0))
mark.putalpha(alpha)
box = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
mark = mark.crop(box)
side = max(mark.size)
sq = Image.new('RGBA', (side, side), (255, 255, 255, 0))
sq.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
mark = sq
mark.save('design/app-mark-white.png')


def canvas(w, h, scale, bg=BG, shape=None):
    """Brand-colour canvas with the mark centred at `scale` of the short side. shape: None | 'round' | 'squircle'."""
    S = 4  # supersample for clean edges
    im = Image.new('RGBA', (w * S, h * S), bg + (255,) if bg else (0, 0, 0, 0))
    m = round(min(w, h) * S * scale)
    mk = mark.resize((m, m), Image.LANCZOS)
    im.alpha_composite(mk, ((w * S - m) // 2, (h * S - m) // 2))
    if shape:
        mask = Image.new('L', im.size, 0)
        d = ImageDraw.Draw(mask)
        if shape == 'round':
            d.ellipse([0, 0, im.width - 1, im.height - 1], fill=255)
        else:
            d.rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=round(im.width * 0.22), fill=255)
        im.putalpha(ImageChops.multiply(im.getchannel('A'), mask))
    return im.resize((w, h), Image.LANCZOS)


def save(im, path, flat=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    (im.convert('RGB') if flat else im).save(path, optimize=True)


# web / PWA
save(canvas(192, 192, 0.66, shape='squircle'), 'public/icon-192.png')
save(canvas(512, 512, 0.66, shape='squircle'), 'public/icon-512.png')
save(canvas(512, 512, 0.56), 'public/icon-maskable-512.png', flat=True)
save(canvas(180, 180, 0.66), 'public/apple-touch-icon.png', flat=True)
save(canvas(64, 64, 0.7, shape='squircle'), 'public/favicon.png')

# Android launcher icons
RES = 'android/app/src/main/res'
for d, k in {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}.items():
    s, f = round(48 * k), round(108 * k)
    save(canvas(s, s, 0.66, shape='squircle'), f'{RES}/mipmap-{d}/ic_launcher.png')
    save(canvas(s, s, 0.62, shape='round'), f'{RES}/mipmap-{d}/ic_launcher_round.png')
    save(canvas(f, f, 0.44, bg=None), f'{RES}/mipmap-{d}/ic_launcher_foreground.png')

# Android splash screens (every existing size)
for root, _, files in os.walk(RES):
    if 'splash.png' in files:
        p = os.path.join(root, 'splash.png')
        w, h = Image.open(p).size
        save(canvas(w, h, 0.3), p, flat=True)

# iOS
IOS = 'ios/App/App/Assets.xcassets'
save(canvas(1024, 1024, 0.66), f'{IOS}/AppIcon.appiconset/AppIcon-512@2x.png', flat=True)
sp = canvas(2732, 2732, 0.22)
for n in ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']:
    save(sp, f'{IOS}/Splash.imageset/{n}', flat=True)

print('brand colour #%02X%02X%02X' % BG)
