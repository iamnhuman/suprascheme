# Toyota / Signal Overload

## Direction

A 48-second experimental film that lives inside a responsive, full-viewport webpage. The creative brief is sensory overload through simultaneous motion and density: instruments keep running while the main composition changes every two seconds. Giant display type, small data labels, signals, geometry and mechanical motifs all share the same timeline. The user's latest revision removes glitch effects while preserving the animation density.

Primary workflow: `motion-skills/opus-js-animations/SKILL.md`. No Sites dependency. Earlier landing page and 36-second film are preserved under `archive/`.

## Treatment

24 scenes, 2 seconds each, 150 BPM (five beats per scene), looping. Near-black, ivory, acid lime, red, cyan and pink. Anton display type and IBM Plex Mono labels. A persistent data frame includes animated instrument panels, two moving signal tickers, edge ticks and a 24-part progress ruler. Most scenes use 6–12 surrounding instruments. The climax expands to 64 simultaneously animated panels.

| Time | Scene | Main motion |
| --- | --- | --- |
| 00–02 | SIGNAL OVERLOAD | Seven orbiting rings, Toyota mark, numerical particles |
| 02–04 | ICON SCANNER | Supra entrance, scanner lines, concentric measurement rings |
| 04–06 | SIX CYLINDERS | Six phase-shifted pistons, ignition pulses, dense waveform |
| 06–08 | FIRING ORDER | Three rotating piston banks and pink ignition points |
| 08–10 | TURBO SPIRAL | 28-blade spiral and 96 rotating ring ticks |
| 10–12 | POWER DENSITY | Oversized 382, circular gauge and pulsing bars on lime |
| 12–14 | TORQUE NETWORK | Fourteen branching signal paths around 368 lb-ft |
| 14–16 | GEAR PROTOCOL | Eight gear rows, moving 288-element barcode matrix |
| 16–18 | REAR DRIVE | Top-view drivetrain and travelling rear-axle energy pulses |
| 18–20 | LAUNCH CONTROL | 3.9 seconds, acceleration gauge and 110 speed rays |
| 20–22 | VELOCITY FIELD | Perspective signal floor, wave planes, wire cube and Supra |
| 22–24 | GRIP ENVELOPE | Twelve interference rings and 70 orbiting points |
| 24–26 | SLIP ANGLE | Eight superimposed parametric Lissajous trajectories |
| 26–28 | APEX TRACKER | Four moving concept tracks around the car on red |
| 28–30 | BRAKE FREQUENCY | Spinning brake disc, 24 holes and 100 measurement ticks |
| 30–32 | DYNAMIC LOAD | Five independent spring/damper oscillations on ivory |
| 32–34 | OSCILLOSCOPE | Eighteen overlapping signal traces |
| 34–36 | AIRFLOW ARRAY | Forty streamlines and 160 travelling markers around Supra |
| 36–38 | THERMAL MATRIX | 560-cell heat field, translucent car and scanners |
| 38–40 | PARTICLE REBUILD | Deterministic particle cloud assembles the SUPRA lettering |
| 40–42 | MULTIPLEX | Central twelve-panel matrix plus surrounding instruments |
| 42–44 | 64 CHANNELS | Full-frame 8×8 wall of live graphics |
| 44–46 | SYSTEM OVERDRIVE | Signal floor, six orbiting rings, Supra and oversized type |
| 46–48 | NO LIMIT | Toyota emblem, circular system and car; clean cut to start |

Each frame is rendered from absolute time. Clean cuts land on the two-second downbeats. The camera stays fixed, without beat-driven zoom or whole-frame movement. Canvas output is copied directly to the visible frame. RGB splitting, image tearing, quantised patches, scanline noise, random interruptions, staggered strip transitions and offset title/car duplicates have been removed. Scanner lines that belong to the technical diagrams remain part of those animations.

## Adaptive frame

The browser edition derives the canvas aspect ratio from the current viewport, so the film fills the entire screen without letterboxing. Portrait layouts use a central main animation followed by 3-column instruments. Landscape layouts use flanking instrument columns. The 64-channel wall fills either orientation. Resize preserves the current timeline position.

For export, capture mode uses fixed 1920×1080 or 1080×1920 logical frames. Supersampling draws at twice those dimensions before Lanczos downsampling to the delivery size.

## Sound

Original Web Audio score at 150 BPM: kick, triangle bass, hats, snare, plucks and an impact every five beats. No third-party music or voiceover. Sound and cuts use the same beat grid. Offline synthesis generates the WAV used by both exports; mild tanh saturation controls transients. Measured output: **−17.9 LUFS integrated, −1.1 dBFS true peak**. The soundtrack was checked by meters and browser controls, not auditioned by ear.

## Accuracy and assets

The stated figures are for the **2025 US GR Supra 3.0 with 8-speed automatic**: 382 hp, 368 lb-ft, 3.0 L turbo inline-six, RWD, and Toyota-estimated 0–60 mph in 3.9 seconds.

Sources: [Toyota pressroom](https://pressroom.toyota.com/take-a-victory-lap-in-the-2025-toyota-gr-supra/) and [2025 Toyota brochure](https://www.toyota.com/content/dam/toyota/brochures/pdf/2025/grsupra_ebrochure.pdf).

All other counters, heat fields, dyno/airflow signals, circuit paths and mechanical drawings are conceptual motion graphics, not measured telemetry, engineering simulations or assembly instructions. The moving ticker identifies them as CONCEPT SIGNAL. The white modified Supra is AI-generated artwork, not official product photography. Local font licences are included.

## Verification

- Syntax checks and portable build pass.
- After removing glitch effects, identical-pixel repeated and cold seeks pass at seven landscape times including scene boundaries and the loop ending, rendered at 3840×2160.
- All 24 landscape compositions and six portrait compositions were visually inspected in the previous revision. The clean revision was checked again at six selected times, including immediately before and after a cut.
- Browser checks confirm exact 1440×900 and 390×844 canvas coverage and matching document bounds, without scrolling. Native canvas sizes follow each viewport's aspect ratio.
- Browser play/pause, loop, seek to zero, replay and sound toggle pass. Console contains no warnings or errors during those checks. The Fullscreen API enters and exits successfully in the embedded browser; the canvas fills the resulting 1080×1920 viewport.
- Export and portrait seek results are recorded in `VALIDATION.md` after final encoding.

The film exposes `{ duration, ready, seek, shots, marks, wav }` as `window.__film`. Playback starts muted and loops; controls are available by pointer, touch or keyboard and hide while playing.
