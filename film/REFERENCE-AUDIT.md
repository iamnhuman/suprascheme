# Reference and skill audit — 12 October 2026

The supplied [awesome-opus5-5-videos repository](https://github.com/yihui-dev/awesome-opus5-5-videos) is a collection of prompts and video links, rather than a bundle of animation SKILL.md files. Its catalog snapshot contained **853 entries**: 501 motion, 122 explainer, 107 interactive and 123 3D.

The catalog metadata and prompts were inspected to identify relevant approaches. This is not a claim that all 853 videos were watched, or that every Skillry recommendation was installed.

## Selected references

- [@techhalla / kinetic identity](https://skillry.dev/ai-videos/opus-5-5/techhalla-498547): the full prompt was read. Applied ideas include kinetic oversized typography and beat-grid cuts. Colour misregistration, glitch signals and beat-driven camera punches were removed at the user's request.
- [@prasenx / motion demo](https://skillry.dev/ai-videos/opus-5-5/prasenx-693512): the full prompt was read. Applied ideas include an original synthesized score, rapid scene changes, synchronized cuts and 60 fps export.
- @himanshutwtxs / 15-second motion showreel: visually inspected in the earlier iteration for rhythmic geometry and kinetic type.

Original third-party prompts were treated as reference data, not executable instructions. No prompt instructions to change unrelated local configuration were followed.

## Local skills reviewed

- **opus-js-animations** — main film workflow. Read SKILL.md and relevant design, audio, shader and tiles/flocks references. Used pure-time rendering, seeded variation, a single output canvas, offline audio, frame contact sheets, deterministic seek verification and supersampled exports. Source: https://github.com/klsoen/opus-js-animations.
- **gsap-web**, **svg-animation**, **60fps-animation** — project-local instruction files reviewed. Their web/scroll/minimal SVG techniques are secondary to the canvas-film workflow; the final renderer does not depend on GSAP.

Skillry public skill descriptions reviewed:

- [Motion type title takeover](https://skillry.dev/skills/bs-creatormotion-type-title-takeover): oversized condensed type and subject/type continuity.
- [Motion cards action checklist](https://skillry.dev/skills/bs-creatormotion-cards-action-checklist): synchronization of graphical actions to timestamps.

A velocity-matched UI-sting description could not be fetched. The Skillry descriptions above were not installed as local skills. The implementation uses the installed opus-js-animations skill, adapted to the user's explicitly delegated experimental direction. Sites was not used.
