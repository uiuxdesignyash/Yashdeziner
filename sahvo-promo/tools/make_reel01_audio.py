#!/usr/bin/env python3
"""Synthesize the Reel 01 music bed and SFX (all original, no licences).

Music follows the master prompt's five phases:
  0-9s   minimal & curious      (soft pad, light pulse)
  9-16s  slight tension         (minor pad, deeper pulse)
  16-20s reduced — space for the "what if" moment
  20-31s brighter & confident   (major pads, rhythm, soft arp)
  31-35s natural resolve, no boom

SFX: restrained system — line draws, tiny pulses, soft clicks, smooth
whooshes, a premium logo reveal, location pulses, one soft end resolve.
Nothing cartoon, nothing siren-like, no loud stings.
"""
import numpy as np
from scipy.signal import butter, sosfilt
import wave

SR = 48000
DUR = 35.0
rng = np.random.default_rng(11)

def hp(x, hz=180.0):
    return sosfilt(butter(2, hz, "highpass", fs=SR, output="sos"), x)

def lp(x, hz):
    return sosfilt(butter(2, hz, "lowpass", fs=SR, output="sos"), x)

def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "bandpass", fs=SR, output="sos"), x)

def env(n, a, r, hold=None):
    ai, ri = int(a * SR), int(r * SR)
    h = n - ai - ri if hold is None else int(hold * SR)
    h = max(h, 0)
    e = np.concatenate([np.linspace(0, 1, ai, endpoint=False), np.ones(h), np.linspace(1, 0, max(n - ai - h, 1))])
    return e[:n]

master_len = int(DUR * SR)

# ── MUSIC ───────────────────────────────────────────────────────────────────
music = np.zeros(master_len)

def add(t, clip, gain):
    i0 = int(t * SR)
    i1 = min(i0 + len(clip), master_len)
    music[i0:i1] += clip[: i1 - i0] * gain

def pad(freqs, dur, a=1.2, r=1.4, detune=0.15, vibrato=0.15):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for d in (-detune, detune):
            x += np.sin(2 * np.pi * (f + d) * t + rng.uniform(0, 6.28))
        x += 0.4 * np.sin(2 * np.pi * f * 2 * t)  # soft octave shimmer
    x *= 1 + 0.06 * np.sin(2 * np.pi * vibrato * t)
    x = lp(x / (len(freqs) * 2.4), 1800)
    return x * env(n, a, r)

def kick(dur=0.16, f0=95.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * f0 * t * np.exp(-t * 9)) * np.exp(-t * 26)

def hat(dur=0.05):
    n = int(dur * SR)
    return bp(rng.standard_normal(n), 5000, 9000) * env(n, 0.002, 0.04)

def pluck(f, dur=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t)
    return x * np.exp(-t * 22)

def bass(f, dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * f * t), 300) * env(n, 0.01, 0.12)

# chords (Hz)
D = [146.83, 220.0, 369.99]          # D-A-F#
Bm = [123.47, 185.0, 293.66]         # B-F#-D
G = [196.0, 246.94, 293.66]          # G-B-D
A = [220.0, 277.18, 329.63]          # A-C#-E
Dhi = [293.66, 369.99, 440.0]

# Phase 1 — 0-9s: curious
add(0.0, pad(D, 5.2), 0.16)
add(4.6, pad(G, 5.0), 0.14)
for i in range(11):
    add(2.0 + i * 0.625, kick(), 0.10)

# Phase 2 — 9-16s: slight tension
add(9.0, pad(Bm, 4.2), 0.17)
add(12.8, pad(G, 3.6), 0.15)
for i in range(22):
    t = 9.0 + i * 0.3125
    add(t, kick(f0=80), 0.10 if i % 2 == 0 else 0.05)
add(9.0, bass(61.7, 3.5), 0.10)  # B1
add(12.8, bass(49.0, 3.0), 0.10)  # G1

# Phase 3 — 16-20s: space
add(16.0, pad(G, 4.6, a=1.6, r=2.0), 0.10)

# Phase 4 — 20-31s: brighter & confident
add(20.0, pad(D, 4.0), 0.17)
add(23.6, pad(A, 3.8), 0.17)
add(27.0, pad(Dhi, 4.4), 0.16)
for i in range(35):
    t = 20.4 + i * 0.3125
    if t > 30.8:
        break
    add(t, kick(), 0.115 if i % 2 == 0 else 0.0)
    if i % 2 == 1:
        add(t, hat(), 0.05)
arp = [587.33, 659.25, 739.99, 880.0]
for i in range(33):
    t = 20.8 + i * 0.3125
    if t > 30.6:
        break
    add(t, pluck(arp[i % 4]), 0.05)
for t, f in [(20.0, 73.4), (23.6, 55.0), (27.0, 73.4)]:
    add(t, bass(f, 3.2), 0.12)

# Phase 5 — 31-35s: resolve
add(31.0, pad(D, 3.9, a=0.5, r=2.6), 0.15)
add(31.0, bass(73.4, 2.8), 0.09)

music[: int(0.2 * SR)] *= np.linspace(0, 1, int(0.2 * SR))
fade = int(1.6 * SR)
music[-fade:] *= np.linspace(1, 0, fade)

mp = np.max(np.abs(music))
music = music / mp * 0.24  # modest bed level, room left for the VO
print(f"music peak normalised to 0.24 (was {mp:.3f})")

# ── SFX ─────────────────────────────────────────────────────────────────────
sfx = np.zeros(master_len)

def sadd(t, clip, gain):
    i0 = int(t * SR)
    i1 = min(i0 + len(clip), master_len)
    sfx[i0:i1] += clip[: i1 - i0] * gain

def draw_line(dur=0.4):
    n = int(dur * SR)
    return hp(bp(rng.standard_normal(n), 1400, 3600) * env(n, 0.08, 0.2), 400)

def tick(f=1900, dur=0.03):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return hp(np.sin(2 * np.pi * f * t) * np.exp(-t * 150))

def pulse_tone(f=620, dur=0.14):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return hp(np.sin(2 * np.pi * f * t) * env(n, 0.02, 0.1), 300)

def whoosh(dur=0.32):
    n = int(dur * SR)
    x = bp(rng.standard_normal(n), 500, 2400)
    return hp(x * env(n, 0.12, 0.14), 300)

def low_pulse(dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 210 * t) * env(n, 0.02, 0.24)

def confirm(dur=0.5):
    # two soft rising tones — the premium confirmation
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 660 * t) * env(n, 0.01, 0.42)
    x[int(0.12 * SR):] += (np.sin(2 * np.pi * 880 * t) * env(n, 0.01, 0.34))[: n - int(0.12 * SR)]
    return hp(x, 300)

F = 1 / 30.0  # frame → seconds

# Scene 1
sadd(34 * F, tick(1500), 0.05)          # pin pulse
sadd(40 * F, draw_line(0.9), 0.05)      # route draw (kept airy)
for fr in (60, 70, 80):
    sadd(fr * F, tick(2100, 0.022), 0.035)
# Scene 2
sadd(120 * F, whoosh(), 0.07)
sadd(150 * F, draw_line(0.5), 0.04)
sadd(190 * F, pulse_tone(560), 0.05)    # ₹ appears
sadd(215 * F, tick(1700), 0.045)        # guide appears
sadd(245 * F, tick(1250), 0.04)
sadd(255 * F, tick(1250), 0.04)
# Scene 3 — three accents
sadd(270 * F, whoosh(), 0.06)
sadd(282 * F, tick(1400), 0.05)         # fare click
sadd(344 * F, pulse_tone(720, 0.12), 0.05)  # verification tick
sadd(415 * F, low_pulse(), 0.07)        # deeper, calm
# Scene 4
sadd(480 * F, whoosh(0.4), 0.06)
sadd(510 * F, pulse_tone(500, 0.2), 0.035)
# Scene 5 — the reveal
sadd(600 * F, draw_line(0.6), 0.05)
sadd(632 * F, whoosh(0.5), 0.09)        # wash
sadd(660 * F, confirm(), 0.07)          # logo reveal
sadd(722 * F, tick(1600), 0.045)        # fare card
sadd(752 * F, tick(1600), 0.045)        # guide card
# Scene 6 — the pin drop (soft low thud + airy swell), then expansion
def thud(dur=0.26):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 225 * t * (1 - 0.25 * t)) * np.exp(-t * 22)
    return hp(x, 160)

def swell(dur=0.9):
    n = int(dur * SR)
    return hp(bp(rng.standard_normal(n), 600, 1400) * env(n, 0.4, 0.46), 300)

sadd(800 * F, thud(), 0.085)
sadd(804 * F, swell(), 0.028)
sadd(840 * F, whoosh(0.45), 0.075)
for fr in (858, 866, 875, 881, 887, 893):
    sadd(fr * F, tick(1800, 0.025), 0.032)
# Scene 7 — resolve
sadd(930 * F, whoosh(0.4), 0.05)
sadd(962 * F, confirm(0.7), 0.055)

sfx[: int(0.3 * SR)] = 0
sfx[-int(0.3 * SR):] = 0
sp = np.max(np.abs(sfx))
print(f"sfx peak {sp:.3f}")
assert sp < 0.2

def write(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("wrote", path)

write("public/audio/reel01-music.wav", music)
write("public/audio/reel01-sfx.wav", sfx)
