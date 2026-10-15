# Signal Overload validation

## Standalone root player — 16 October 2026

`npm run check` and `npm run build` pass. The build now generates the root `index.html` from `src/index.html`, embedding both fonts, the car artwork, favicon, styles and scripts. The root player is identical to `film/index.html` and has no external resource references.

Headless Chrome loaded the root player through `file://` with network access disabled. Both fonts loaded, the loading screen closed and all 24 scenes rendered distinct frames. Returning to 42.7 seconds after seeking elsewhere produced the same canvas pixels. Playback advanced, pause held the current time, seeking reached 12.5 seconds and replay returned to the beginning. The audio context ran, generated a 48-second score and stopped its source when muted; audio was not auditioned by ear.

Desktop (1440×900) and mobile (390×844) canvas and document bounds exactly matched the viewport; screenshots were visually checked. Serving the same standalone HTML at `/suprascheme/index.html` also loaded successfully without requesting supporting files. Chrome reported no browser errors during these checks.

Generated MP4/WAV exports, local screenshots and archived versions are excluded from Git. They are not required by the standalone player.

## Fixed-camera source and playback — 12 October 2026

`npm run check` and `npm run build` pass. The development page loads its local image and fonts without console warnings or errors. Playback, pause, loop, restart, sound toggle, seek-to-zero and Fullscreen API enter/exit were exercised in the browser.

The latest revision removes the whole-frame scale pulse that previously jumped on every 0.4-second beat. Only the camera transform was removed; instrument animations and layout remain intact. Syntax/build checks pass, and a contact sheet at 0.38, 0.40, 0.43, 34.38, 34.40 and 34.43 seconds shows a fixed composition on either side of the beat. The live browser was reloaded and has no console warnings or errors.

The canvas and document bounds match the viewport exactly:

| View | Viewport | Canvas bounds | Document bounds |
| --- | --- | --- | --- |
| Desktop | 1440×900 | 0,0 → 1440,900 | 1440×900 |
| Phone | 390×844 | 0,0 → 390,844 | 390×844 |
| Fullscreen | 1080×1920 | 0,0 → 1080,1920 | 1080×1920 |

The phone uses a vertically recomposed hero and instrument grid. The viewport override was reset after testing. The final preview is the live looping root page.

## Pure-time rendering

The opus-js-animations `verify.mjs` compares a repeated render and a cold return to the same timestamp after seeking elsewhere. After removing the glitch pass, all pixel hashes matched again, with no page errors.

- Clean landscape at 3840×2160: 0.7, 1.94, 2.02, 10.7, 34.7, 42.7, 47.95 seconds.
- Fixed-camera landscape at 3840×2160: 0.40, 2.02 and 42.70 seconds; all repeated/cold pixel hashes match.
- The earlier portrait rendering also passed nine cold/repeated seeks. In the clean revision, portrait composition was visually rechecked at 0.7, 2.02, 34.7 and 42.7 seconds.

All 24 landscape compositions were inspected in the previous revision. After removing glitches, six landscape and four portrait frames were inspected again, along with the live browser frame. The regenerated H.264 files were checked for frame count, duration and a decoded frame in each orientation.

## Exports

| File | Video | Video packets | Duration | Audio |
| --- | --- | --- | --- | --- |
| toyota-signal-overload.mp4 | H.264, 1920×1080, 60/1 fps | 2880 | 48.000 s | AAC, 2251 packets |
| toyota-signal-overload-portrait.mp4 | H.264, 1080×1920, 60/1 fps | 2880 | 48.000 s | AAC, 2251 packets |

Both exports were regenerated after the removal of glitches and again after fixing the camera. They use 2× supersampled drawing, Lanczos downsampling and BT.709 colour tags. The website draws the animation directly and does not download or play the MP4 files.

The generated stereo WAV is 48 seconds at 48 kHz. Metered level: −17.9 LUFS integrated and −1.1 dBFS true peak. Audio was not auditioned by ear. Performance on physical mobile hardware was not measured; responsive layout was checked in the embedded browser.

## Visual evidence

- `output/qa/stable/sheet_0.38-34.43.jpg`
- `output/qa/stable-browser.png`
- `output/qa/stable-before-beat.png`
- `output/qa/stable-on-beat.png`

Earlier clean revision:

- `output/qa/clean-browser.png`
- `output/qa/clean/sheet_0.7-42.7.jpg`
- `output/qa/clean-portrait/sheet_0.7-42.7.jpg`
- `output/qa/clean-encoded-landscape.png`
- `output/qa/clean-encoded-portrait.png`

Earlier screenshot/contact-sheet files remain as evidence of the previous revision and include the removed glitch effects.
