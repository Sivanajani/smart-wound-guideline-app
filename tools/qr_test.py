#!/usr/bin/env python3
"""Validates qr.py: (1) Reed-Solomon against the ISO/IEC 18004 worked example,
(2) the format-information table against a freshly computed BCH(15,5),
(3) a full independent read-back of the finished matrix."""
import qr

ok = True


def check(name, cond, detail=""):
    global ok
    print(("PASS  " if cond else "FAIL  ") + name + (("  — " + detail) if detail and not cond else ""))
    ok = ok and cond


# ---- 1. Reed-Solomon, ISO/IEC 18004 Annex I worked example (1-M, "01234567")
data = [0x10, 0x20, 0x0C, 0x56, 0x61, 0x80, 0xEC, 0x11, 0xEC, 0x11,
        0xEC, 0x11, 0xEC, 0x11, 0xEC, 0x11]
want = [0xA5, 0x24, 0xD4, 0xC1, 0xED, 0x36, 0xC7, 0x87, 0x2C, 0x55]
got = qr.rs_encode(data, 10)
check("Reed-Solomon vs. ISO worked example", got == want, f"{got} != {want}")


# ---- 2. format information: recompute BCH(15,5) + mask 0x5412
def bch_format(ec_bits, mask):
    d = (ec_bits << 3) | mask
    v = d << 10
    for i in range(4, -1, -1):
        if v & (1 << (i + 10)):
            v ^= 0x537 << i
    return ((d << 10) | v) ^ 0x5412


check("format-info table (EC level M, masks 0-7)",
      all(qr.FORMAT_M[m] == bch_format(0b00, m) for m in range(8)),
      str({m: (hex(qr.FORMAT_M[m]), hex(bch_format(0, m))) for m in range(8)}))


# ---- 3. independent read-back of the finished symbol
def read_back(m, version):
    size = len(m)
    # recover mask from the format information (first copy)
    bits = 0
    for i in range(15):
        if i < 6:      b = m[i][8]
        elif i == 6:   b = m[7][8]
        elif i == 7:   b = m[8][8]
        elif i == 8:   b = m[8][7]
        else:          b = m[8][14 - i]
        bits |= b << i
    d = (bits ^ 0x5412) >> 10
    ec_bits, mask = d >> 3, d & 7
    assert ec_bits == 0b00, f"EC level not M: {ec_bits:02b}"

    # rebuild the function-module map exactly as the encoder does
    probe = qr.build_matrix(version, [0] * qr.SPEC[version][0], mask)
    reserved = [[False] * size for _ in range(size)]

    def mark(r, c, h, w):
        for rr in range(r, r + h):
            for cc in range(c, c + w):
                if 0 <= rr < size and 0 <= cc < size:
                    reserved[rr][cc] = True
    mark(0, 0, 9, 9); mark(0, size - 8, 9, 8); mark(size - 8, 0, 8, 9)
    for i in range(size):
        reserved[6][i] = reserved[i][6] = True
    for r in qr.ALIGN[version]:
        for c in qr.ALIGN[version]:
            if (r < 8 and c < 8) or (r < 8 and c > size - 9) or (r > size - 9 and c < 8):
                continue
            mark(r - 2, c - 2, 5, 5)
    if version >= 7:
        mark(size - 11, 0, 3, 6); mark(0, size - 11, 6, 3)

    out, up, col = [], True, size - 1
    while col > 0:
        if col == 6:
            col -= 1
        for r in (range(size - 1, -1, -1) if up else range(size)):
            for c in (col, col - 1):
                if not reserved[r][c]:
                    if mask == 0:   cond = (r + c) % 2 == 0
                    elif mask == 1: cond = r % 2 == 0
                    elif mask == 2: cond = c % 3 == 0
                    elif mask == 3: cond = (r + c) % 3 == 0
                    elif mask == 4: cond = (r // 2 + c // 3) % 2 == 0
                    elif mask == 5: cond = (r * c) % 2 + (r * c) % 3 == 0
                    elif mask == 6: cond = ((r * c) % 2 + (r * c) % 3) % 2 == 0
                    else:           cond = ((r + c) % 2 + (r * c) % 3) % 2 == 0
                    out.append(m[r][c] ^ (1 if cond else 0))
        up = not up
        col -= 2

    cws = [int("".join(map(str, out[i:i + 8])), 2) for i in range(0, len(out) // 8 * 8, 8)]
    total, ecn, blocks = qr.SPEC[version]
    sizes = [dc for count, dc in blocks for _ in range(count)]
    dblocks = [[] for _ in sizes]
    idx = 0
    for i in range(max(sizes)):
        for b, sz in enumerate(sizes):
            if i < sz:
                dblocks[b].append(cws[idx]); idx += 1
    stream = [x for b in dblocks for x in b]

    bitstr = "".join(f"{c:08b}" for c in stream)
    assert bitstr[:4] == "0100", f"mode is not byte: {bitstr[:4]}"
    ln = int(bitstr[4:12], 2)
    payload = bytes(int(bitstr[12 + 8 * i:20 + 8 * i], 2) for i in range(ln))
    return payload.decode("utf-8"), mask


URL = "https://github.com/Sivanajani/smart-wound-guideline-app"
for text in ["HELLO", URL, "https://example.org/a/rather/longer/path/to/test/version/growth/xyz"]:
    v = qr.pick_version(len(text.encode()))
    m = qr.make(text)
    got, mask = read_back(m, v)
    check(f"round-trip v{v} mask{mask}  {text[:46]}", got == text, f"read back {got!r}")

# structural spot-checks on the real symbol
m = qr.make(URL)
size = len(m)
check("timing pattern (row 6)", all(m[6][i] == (1 - i % 2) for i in range(8, size - 8)))
check("timing pattern (col 6)", all(m[i][6] == (1 - i % 2) for i in range(8, size - 8)))
check("dark module", m[size - 8][8] == 1)
check("finder centre top-left", all(m[r][c] == 1 for r in range(2, 5) for c in range(2, 5)))
check("quiet ring under finder", all(m[7][c] == 0 for c in range(0, 8)))

print()
print("ALL CHECKS PASSED" if ok else "FAILURES PRESENT")
raise SystemExit(0 if ok else 1)
