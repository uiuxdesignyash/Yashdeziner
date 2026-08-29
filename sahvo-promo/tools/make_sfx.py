#!/usr/bin/env python3
"""Synthesize the Sahvo promo SFX track (public/audio/sfx.wav).

All effects are generated procedurally (no third-party samples; sound
libraries are unreachable from the build environment and synthesis needs
no licence). Mixing rules from the brief:
  - every effect >= 18 dB below the voiceover (peaks <= 0.10 FS here,
    VO peaks near full scale)
  - a further 6 dB duck whenever the voice is speaking
  - every effect high-passed at 200 Hz
  - nothing longer than 400 ms except the pin-ripple swell
  - nothing alarm-like
  - first and last 0.3 s of the master left clean
"""
import numpy as np
from scipy.signal import butter, sosfilt
import wave

SR = 48000
DUR = 60.19
FPS = 30.0

rng = np.random.default_rng(7)

# Measured VO sentence spans (seconds) — used for ducking.
SPEECH = [(0.00, 5.86), (6.97, 12.95), (13.97, 19.96), (20.85, 24.98),
          (25.96, 38.32), (39.32, 47.29), (48.29, 55.40), (56.35, 60.16)]

def hp(x, hz=200.0, order=2):
    sos = butter(order, hz, "highpass", fs=SR, output="sos")
    return sosfilt(sos, x)

def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], "bandpass", fs=SR, output="sos")
    return sosfilt(sos, x)

def env(n, attack, release, hold=0.0):
    a, r = int(attack * SR), int(release * SR)
    h = max(n - a - r, int(hold * SR))
    e = np.concatenate([
        np.linspace(0, 1, a, endpoint=False),
        np.ones(h),
        np.linspace(1, 0, max(n - a - h, 1)),
    ])
    return e[:n]

def t_axis(dur):
    return np.arange(int(dur * SR)) / SR

# ── effect builders ─────────────────────────────────────────────────────────

def whoosh():
    """300 ms filtered noise sweep. High-passed, subtle, not urgent."""
    d = 0.30
    n = int(d * SR)
    noise = rng.standard_normal(n)
    seg = n // 3
    parts = [bp(noise[i * seg:(i + 1) * seg], 300 + 250 * i, 900 + 700 * i)
             for i in range(3)]
    x = np.concatenate(parts + [np.zeros(n - 3 * seg)])
    return hp(x * env(n, 0.09, 0.14))

def tick(freq=1900.0, d=0.03):
    """Soft mechanical tick — felt more than heard. Not a typewriter clack."""
    t = t_axis(d)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t * 140)
    x += 0.3 * rng.standard_normal(len(t)) * np.exp(-t * 260)
    return hp(x)

def detent():
    """Low mechanical stop — one per landing, never a continuous run."""
    t = t_axis(0.07)
    x = np.sin(2 * np.pi * 320 * t) * np.exp(-t * 70)
    x += 0.45 * np.sin(2 * np.pi * 900 * t) * np.exp(-t * 160)
    return hp(x)

def thud():
    """Pin drop: soft low thud, short tail. High-passed at 200 Hz, so the
    weight sits just above the cutoff."""
    t = t_axis(0.26)
    x = np.sin(2 * np.pi * 235 * t * (1 - 0.25 * t)) * np.exp(-t * 22)
    x += 0.2 * rng.standard_normal(len(t)) * np.exp(-t * 320)
    return hp(x)

def swell():
    """Airy rise-and-fade under the ripple ring — the one long effect."""
    d = 0.95
    n = int(d * SR)
    x = bp(rng.standard_normal(n), 600, 1400)
    return hp(x * env(n, 0.42, 0.5))

def feed():
    """Thermal printer feed: motor-modulated band noise, dry, 350 ms."""
    d = 0.35
    t = t_axis(d)
    x = bp(rng.standard_normal(len(t)), 900, 3200)
    x *= 0.65 + 0.35 * np.sign(np.sin(2 * np.pi * 52 * t))
    return hp(x * env(len(t), 0.02, 0.06, hold=0.2))

def tear():
    """Paper tear on the scallop landing: fast attack, gliding band noise."""
    d = 0.22
    n = int(d * SR)
    thirds = n // 3
    noise = rng.standard_normal(n)
    parts = [bp(noise[i * thirds:(i + 1) * thirds], 2600 - 600 * i, 5200 - 1200 * i)
             for i in range(3)]
    x = np.concatenate(parts + [np.zeros(n - 3 * thirds)])
    return hp(x * env(n, 0.004, 0.12))

# ── timeline ────────────────────────────────────────────────────────────────

def f2s(frame):
    return frame / FPS

events = []  # (time_s, clip, peak)

# Rule sweeps (visuals at [b-8, b+8]); the hook sweep shifts to honour the
# clean first 0.3 s.
events.append((0.32, whoosh(), 0.075))
for b in [192, 404, 612, 764, 1165, 1676]:
    events.append((f2s(b - 8), whoosh(), 0.075))

# Odometer landings — one detent per column stop.
for fr in [270, 276, 282, 288]:
    events.append((f2s(fr), detent(), 0.05))
# Bar settles.
for fr in [320, 326]:
    events.append((f2s(fr), detent(), 0.045))

# Pin drop + ripple swell.
events.append((f2s(570), thud(), 0.095))
events.append((f2s(574), swell(), 0.03))

# Receipt: feed bursts while the sheet advances, tear when it lands.
for ts in [25.9, 27.2, 28.5, 29.3]:
    events.append((ts, feed(), 0.06))
events.append((f2s(896), tear(), 0.075))

# Icon draw-on completions.
for fr in [929, 990, 1038, 1089, 1129]:
    events.append((f2s(fr), tick(1700), 0.028))

# S6 character stagger — one very quiet tick per character.
for i in range(14):
    events.append((f2s(1310 + i * 1.2), tick(2100, 0.022), 0.02))

# ── mix ─────────────────────────────────────────────────────────────────────

master = np.zeros(int(DUR * SR))

def speaking(ts, te):
    return any(not (te < s or ts > e) for s, e in SPEECH)

for ts, clip, peak in events:
    clip = clip / (np.max(np.abs(clip)) + 1e-9) * peak
    te = ts + len(clip) / SR
    if speaking(ts, te):
        clip = clip * 0.5  # -6 dB duck under the voice
    i0 = int(ts * SR)
    i1 = min(i0 + len(clip), len(master))
    master[i0:i1] += clip[: i1 - i0]

# Clean head and tail.
master[: int(0.3 * SR)] = 0
master[-int(0.3 * SR):] = 0

peak = np.max(np.abs(master))
print(f"events: {len(events)}  peak: {peak:.3f} FS ({20*np.log10(peak):.1f} dBFS)")
assert peak < 0.2, "SFX peak too hot"

pcm = (np.clip(master, -1, 1) * 32767).astype(np.int16)
with wave.open("public/audio/sfx.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote public/audio/sfx.wav")
