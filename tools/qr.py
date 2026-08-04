#!/usr/bin/env python3
"""Minimal, self-contained QR encoder (byte mode, EC level M, versions 1-10).
No network, no dependencies beyond Pillow. Validated against the ISO/IEC 18004
worked example before use.  Usage:  python3 qr.py "<text>" out.png
"""
import sys
from PIL import Image

# ---------------------------------------------------------------- GF(256)
EXP = [0] * 512
LOG = [0] * 256
x = 1
for i in range(255):
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if x & 0x100:
        x ^= 0x11D
for i in range(255, 512):
    EXP[i] = EXP[i - 255]


def gmul(a, b):
    if a == 0 or b == 0:
        return 0
    return EXP[LOG[a] + LOG[b]]


def rs_generator(n):
    g = [1]
    for i in range(n):
        g2 = [0] * (len(g) + 1)
        for j, c in enumerate(g):
            g2[j] ^= gmul(c, 1)
            g2[j + 1] ^= gmul(c, EXP[i])
        g = g2
    return g


def rs_encode(data, n):
    gen = rs_generator(n)
    res = list(data) + [0] * n
    for i in range(len(data)):
        f = res[i]
        if f:
            for j, g in enumerate(gen):
                res[i + j] ^= gmul(g, f)
    return res[len(data):]


# ------------------------------------------------- version tables (EC = M)
# version: (total codewords, ec per block, [(blocks, data codewords), ...])
SPEC = {
    1:  (26,  10, [(1, 16)]),
    2:  (44,  16, [(1, 28)]),
    3:  (70,  26, [(1, 44)]),
    4:  (100, 18, [(2, 32)]),
    5:  (134, 24, [(2, 43)]),
    6:  (172, 16, [(4, 27)]),
    7:  (196, 18, [(4, 31)]),
    8:  (242, 22, [(2, 38), (2, 39)]),
    9:  (292, 22, [(3, 36), (2, 37)]),
    10: (346, 26, [(4, 43), (1, 44)]),
}
ALIGN = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
         7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]}
VERSION_INFO = {7: 0x07C94, 8: 0x085BC, 9: 0x09A99, 10: 0x0A4D3}
FORMAT_M = {0: 0x5412, 1: 0x5125, 2: 0x5E7C, 3: 0x5B4B, 4: 0x45F9,
            5: 0x40CE, 6: 0x4F97, 7: 0x4AA0}          # EC level M, mask 0-7


def pick_version(n):
    for v in range(1, 11):
        total, ec, blocks = SPEC[v]
        cap = sum(b * d for b, d in blocks)
        # 4 bits mode + 8 bits length (versions 1-9) / 16 bits (10+)
        overhead = 4 + (8 if v < 10 else 16)
        if n * 8 + overhead <= cap * 8:
            return v
    raise ValueError("payload too long for version 10 at EC level M")


def encode_data(text, version):
    data = text.encode("utf-8")
    total, ecn, blocks = SPEC[version]
    cap = sum(b * d for b, d in blocks)
    bits = []

    def put(val, n):
        for i in range(n - 1, -1, -1):
            bits.append((val >> i) & 1)

    put(0b0100, 4)
    put(len(data), 8 if version < 10 else 16)
    for byte in data:
        put(byte, 8)
    put(0, min(4, cap * 8 - len(bits)))            # terminator
    while len(bits) % 8:
        bits.append(0)
    codewords = [int("".join(map(str, bits[i:i + 8])), 2) for i in range(0, len(bits), 8)]
    pad = [0xEC, 0x11]
    while len(codewords) < cap:
        codewords.append(pad[(len(codewords) - len(bits) // 8) % 2])

    # split into blocks, compute EC, interleave
    dblocks, eblocks, pos = [], [], 0
    for count, dc in blocks:
        for _ in range(count):
            b = codewords[pos:pos + dc]
            pos += dc
            dblocks.append(b)
            eblocks.append(rs_encode(b, ecn))
    out = []
    for i in range(max(len(b) for b in dblocks)):
        for b in dblocks:
            if i < len(b):
                out.append(b[i])
    for i in range(ecn):
        for b in eblocks:
            out.append(b[i])
    return out


def build_matrix(version, codewords, mask):
    size = 17 + 4 * version
    m = [[None] * size for _ in range(size)]

    def finder(r, c):
        for dr in range(-1, 8):
            for dc in range(-1, 8):
                rr, cc = r + dr, c + dc
                if 0 <= rr < size and 0 <= cc < size:
                    inner = 2 <= dr <= 4 and 2 <= dc <= 4
                    ring = dr in (0, 6) or dc in (0, 6)
                    m[rr][cc] = 1 if (inner or ring) and 0 <= dr <= 6 and 0 <= dc <= 6 else 0

    finder(0, 0); finder(0, size - 7); finder(size - 7, 0)
    for i in range(8, size - 8):                       # timing
        m[6][i] = m[i][6] = 1 - (i % 2)
    for r in ALIGN[version]:                            # alignment
        for c in ALIGN[version]:
            if (r < 8 and c < 8) or (r < 8 and c > size - 9) or (r > size - 9 and c < 8):
                continue
            for dr in range(-2, 3):
                for dc in range(-2, 3):
                    m[r + dr][c + dc] = 1 if max(abs(dr), abs(dc)) != 1 else 0
    m[size - 8][8] = 1                                  # dark module

    reserved = [[m[r][c] is not None for c in range(size)] for r in range(size)]
    for i in range(9):                                  # format areas
        for (r, c) in ((8, i), (i, 8)):
            if r < size and c < size:
                reserved[r][c] = True
    for i in range(8):
        reserved[8][size - 1 - i] = True
        reserved[size - 1 - i][8] = True
    if version >= 7:
        for r in range(6):
            for c in range(3):
                reserved[size - 11 + c][r] = True
                reserved[r][size - 11 + c] = True

    bits = []
    for cw in codewords:
        for i in range(7, -1, -1):
            bits.append((cw >> i) & 1)
    idx, up, col = 0, True, size - 1
    while col > 0:
        if col == 6:
            col -= 1
        rows = range(size - 1, -1, -1) if up else range(size)
        for r in rows:
            for c in (col, col - 1):
                if not reserved[r][c]:
                    b = bits[idx] if idx < len(bits) else 0
                    idx += 1
                    if mask == 0:   cond = (r + c) % 2 == 0
                    elif mask == 1: cond = r % 2 == 0
                    elif mask == 2: cond = c % 3 == 0
                    elif mask == 3: cond = (r + c) % 3 == 0
                    elif mask == 4: cond = (r // 2 + c // 3) % 2 == 0
                    elif mask == 5: cond = (r * c) % 2 + (r * c) % 3 == 0
                    elif mask == 6: cond = ((r * c) % 2 + (r * c) % 3) % 2 == 0
                    else:           cond = ((r + c) % 2 + (r * c) % 3) % 2 == 0
                    m[r][c] = b ^ (1 if cond else 0)
        up = not up
        col -= 2

    # format information — two copies. (row, col) exactly per ISO/IEC 18004.
    fmt = FORMAT_M[mask]
    for i in range(15):
        b = (fmt >> i) & 1
        if i < 6:      m[i][8] = b            # column 8, rows 0-5
        elif i == 6:   m[7][8] = b
        elif i == 7:   m[8][8] = b
        elif i == 8:   m[8][7] = b
        else:          m[8][14 - i] = b       # row 8, columns 5-0
        if i < 8:      m[8][size - 1 - i] = b       # row 8, right edge
        else:          m[size - 15 + i][8] = b      # column 8, bottom edge
    if version >= 7:
        vi = VERSION_INFO[version]
        for i in range(18):
            b = (vi >> i) & 1
            m[i // 3][size - 11 + i % 3] = b
            m[size - 11 + i % 3][i // 3] = b
    return [[0 if v is None else v for v in row] for row in m]


def penalty(m):
    size, p = len(m), 0
    for line in list(m) + [list(col) for col in zip(*m)]:
        run, prev = 1, line[0]
        for v in line[1:]:
            if v == prev:
                run += 1
            else:
                if run >= 5: p += 3 + run - 5
                run, prev = 1, v
        if run >= 5: p += 3 + run - 5
    for r in range(size - 1):
        for c in range(size - 1):
            if m[r][c] == m[r][c + 1] == m[r + 1][c] == m[r + 1][c + 1]:
                p += 3
    pat = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]
    for line in list(m) + [list(col) for col in zip(*m)]:
        for i in range(size - 10):
            if line[i:i + 11] == pat or line[i:i + 11] == pat[::-1]:
                p += 40
    dark = sum(sum(r) for r in m)
    p += 10 * (abs(dark * 100 // (size * size) - 50) // 5)
    return p


def make(text):
    v = pick_version(len(text.encode("utf-8")))
    cw = encode_data(text, v)
    best, bestp = None, None
    for mask in range(8):
        m = build_matrix(v, cw, mask)
        s = penalty(m)
        if bestp is None or s < bestp:
            best, bestp = m, s
    return best


def png(text, path, scale=16, quiet=4, fg=(18, 32, 46), bg=(255, 255, 255)):
    m = make(text)
    n = len(m) + 2 * quiet
    im = Image.new("RGB", (n, n), bg)
    px = im.load()
    for r, row in enumerate(m):
        for c, v in enumerate(row):
            if v:
                px[c + quiet, r + quiet] = fg
    im = im.resize((n * scale, n * scale), Image.NEAREST)
    im.save(path)
    return len(m), path


if __name__ == "__main__":
    print(png(sys.argv[1], sys.argv[2]))
