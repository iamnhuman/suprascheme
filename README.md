# TOYOTA // SIGNAL OVERLOAD

48-second experimental motion film, 24 scenes, 150 BPM. The webpage is the film: it autoplays muted, loops, and fills the viewport. It combines kinetic type, mechanical diagrams, particle lettering, waveforms, heat maps, counters and 64-channel instrument walls. Frames and text render cleanly, without glitch distortion or colour separation. The camera stays fixed, without beat-driven scaling or whole-frame shakes.

Open **`index.html`** directly in a browser (double-click the file). It is a self-contained player: the graphics, fonts, styles and JavaScript are embedded, and sound is synthesized locally. No server, package installation or internet connection is needed for playback.

For static hosting, upload `index.html` as the entry point. It also works under a repository subpath such as `/suprascheme/`. `.nojekyll` allows GitHub Pages to serve the committed static files directly. To use GitHub Pages, select the `main` branch and `/ (root)` in the repository's Pages settings.

For local development with Node.js 20+:

```sh
npm run dev
```

Open http://localhost:5173/. This rebuilds the standalone players before starting the local server. Restart the command after editing source files. The server binds to loopback and only serves the player and its assets.

The composition is drawn at the viewport's actual aspect ratio. Portrait screens move the instruments below the main animation; landscape screens place them around it. There are no letterbox bars or scrollable sections. Resizing redraws the current time without restarting the film.

**Controls:** click the picture or press Space to pause/play; arrows seek five seconds; R restarts; M toggles sound; F requests native fullscreen where supported. Controls hide during playback. Sound starts after a user gesture.

## Files

- `renderer.js` — deterministic Canvas graphics, adaptive layout and 24 scenes with clean cuts.
- `app.js` — original procedural score, audio clock and playback controls.
- `index.html` — generated, self-contained full-viewport player; open this file to watch.
- `src/index.html`, `styles.css` — editable player markup and styles.
- `film/index.html` — self-contained offline player, with all artwork and fonts embedded.
- `film/portrait.html` — portable edition with portrait capture format.
- `film/toyota-signal-overload.mp4` — optional local export: 1920×1080, 60 fps, AAC audio.
- `film/toyota-signal-overload-portrait.mp4` — optional local export: 1080×1920, 60 fps, AAC audio.
- `film/FILM.md` — scene treatment, technical notes and verification.
- `film/REFERENCE-AUDIT.md` — references and scope of the skill review.
- `archive/film-v1/`, `archive/landing-v1/` — previous local versions, excluded from Git.

```sh
npm run check
npm run build
```

Edit `src/index.html`, `styles.css`, `renderer.js` or `app.js`, then run `npm run build`. The build embeds the drawing code, car, fonts, favicon and styles into the root `index.html` and both portable editions. Commit the regenerated HTML files alongside source changes. Video exports, WAV audio, screenshots and archived versions are excluded from Git; they are not required for playback.

`window.__film.seek(t)` renders an exact time; `?t=34.7` opens a paused frame. `?capture=1` disables the playback clock, `?format=portrait` chooses vertical capture, and `?ss=2` doubles the capture resolution.

## Animation workflow

The primary skill is `motion-skills/opus-js-animations/SKILL.md`, from https://github.com/klsoen/opus-js-animations. The rendering uses its pure-time motion-film workflow. Sites is not used. Reference catalog: https://github.com/yihui-dev/awesome-opus5-5-videos.

With Node 22+, Chrome and ffmpeg installed:

```sh
node motion-skills/opus-js-animations/scripts/verify.mjs film/index.html --ss 2
node motion-skills/opus-js-animations/scripts/stills.mjs film/index.html --every 2 --sheet
node motion-skills/opus-js-animations/scripts/page_audio.mjs film/index.html --out film/mix.wav
node motion-skills/opus-js-animations/scripts/render.mjs film/index.html --fps 60 --ss 2 --audio film/mix.wav --out film/toyota-signal-overload.mp4 --workers 2
node motion-skills/opus-js-animations/scripts/render.mjs film/portrait.html --fps 60 --ss 2 --audio film/mix.wav --out film/toyota-signal-overload-portrait.mp4 --workers 2
```

Specifications describe the **2025 US Toyota GR Supra 3.0 AT**. Other moving numbers, graphs, mechanical diagrams and thermal fields are illustrative concept signals, not real vehicle telemetry. The car is AI-generated artwork. Sources and asset notes are in `film/FILM.md`; font licenses are in `assets/fonts/`.
