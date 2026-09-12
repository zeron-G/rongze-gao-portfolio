# Aircraft & motion refinement / 2026-09-12

This refines OFF THE GROUND, not the owner's career narrative or GitHub profile. Biography, aviation, education, work, the three compact projects, CV, game and private-space links remain.

## Aircraft

The previous CPU-projected swept-wing sculpture is replaced by an independently modeled low-wing propeller touring aircraft using the repository's existing Three.js dependency. Rounded ivory fuselage, navy strip/tips, copper accents, framed dark canopy, spinner/propeller, tricycle gear and wing-control seams are geometric parts; no outside model or personal aircraft photograph is used. The geometry is illustrative, not a certified aircraft design or a claim to a specific owned airplane.

Mesh buffers are built once. The GPU performs projection and depth testing instead of the previous per-frame JavaScript projection, face-array allocation and sorting. Physically based materials use a small generated room environment. DPR is capped, sustained expensive rendering can reduce resolution, and unavailable WebGL falls back to a static SVG.

## Motion

- A single RAF drives the existing Lenis dependency and aircraft scenes. Pointer and bank-angle response use time-based damping; touch scrolling remains native.
- Hero typography and aircraft depart at different depths. The flight chapter opens from a rounded frame to full bleed; scroll progress drives camera/bank composition and staged captions.
- Menu and detail panels animate both in and out, with cancelled-close protection. Theme and language changes use View Transitions when supported, with an immediate fallback.
- GPU scenes are retained across language/motion rerenders instead of rebuilding renderers and shader environments. Hidden scenes pause; scenes also pause behind dialogs.
- Work previews move by damped translate. Reduced-motion mode and existing keyboard/touch controls remain.

## Iteration and verification

First review caught a clipped mobile wing, a collision between the wireframe control and personal note, and a fixed-delay wheel assertion after expensive locale recreation. The mobile aircraft was reframed, the control moved, renderers retained, and the test now waits for completed transition state before testing real wheel movement. The wheel-movement assertion was preserved, not removed.

Verified candidate: https://github.com/zeron-G/rongze-gao-portfolio/actions/runs/34681510047

Actual Vite output was served over local HTTP in GitHub Linux headless Chromium 153.0.8010.12 with SwiftShader. Eight combinations of 390/768/1440/1920 widths and English/Chinese passed, including WebGL rendering, no horizontal overflow, wireframe, menu entry/exit, personal-note translation, manual bank, project dialogs, search, CV, wheel inertia, palette crossfade and language roundtrip. Four existing content contracts also passed. Static-fallback and DOM behavior were additionally exercised in the local browser.

Each rendered aircraft used 44 draw calls and 38,420 triangles in this test. Sampled JavaScript frame-submission time was approximately 1.0 ms median / 2.4 ms p95 across 48 samples. These are CPU submission samples in a software-rendered test environment, NOT end-to-end frame times, hardware GPU benchmarks, or a guarantee of 60/120 FPS on visitors' devices.

`tests/refinement.browser.mjs` is the current acceptance entry. Older `tests/flightlog.browser.mjs` describes the pre-WebGL version and is retained as historical source.

## Publication and rollback

Production is Cloudflare Pages. The root build uses `SITE_BASE=/`; no DNS or hosting permissions were changed. A committed source revision and passing tests do not establish that rongzegao.com has deployed it. The release marker is `off-the-ground-refined-2026-09-12`.

To restore the prior experience, revert this refinement commit; all career data, original game code and resume sources remain unchanged. Temporary review scripts/workflows on the design branch are deliberately not promoted to main.
