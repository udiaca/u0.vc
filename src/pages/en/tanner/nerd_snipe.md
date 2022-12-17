---
layout: ../../../layouts/MarkdownLayout.astro
title: Text Fill a Rectangular Space
description: "Nerd Snipe: text fill a rectangular space (request from Tanner)"
center: true
---

His work in progress:

```python
from PIL import Image, ImageEnhance, ImageFont, ImageDraw
import textwrap

# I'm trying to make text as big as possible within a rectangle for generating labels
text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

MAX_W, MAX_H = 1285, 635
pad = 5

im = Image.open('label.png')
width, height = im.size
draw = ImageDraw.Draw(im)

for size in range(256, 1, -4):
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', size)

    for cols in range(100, 1, -4):
        print('trying size', size, 'cols', cols)

        para = textwrap.wrap(text, width=cols)

        total_h = -pad
        total_w = 0

        for line in para:
            w, h = draw.textsize(line, font=font)
            if w > total_w:
                total_w = w
            total_h += h + pad

        if total_w <= MAX_W and total_h < MAX_H:
            break # both loops


    else:  # hacky double-loop break trick
        continue
    break


offset = height - MAX_H
start_h = (MAX_H - total_h) / 2 + offset

current_h = start_h
for line in para:
    w, h = draw.textsize(line, font=font)
    x, y = (MAX_W - w) / 2, current_h
    draw.text((x, y), line, font=font, fill='black')
    current_h += h + pad


im.save('tmp.png')

print('Dimentions:', height, width)
```

----

[My work in progress](/tanner/big_text_labels.py)
