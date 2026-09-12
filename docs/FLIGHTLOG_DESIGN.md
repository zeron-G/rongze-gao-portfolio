# OFF THE GROUND / 不止于地面
## Art direction / 2026-09-12

### Source and intent
Reference: https://wodniack.dev/ and AntoineW/AW-2025-Portfolio. Studied composition, interaction ownership, large type and personal narrative. Do not copy its code, fonts, photographs, red/black skin or signature wave treatment. This implementation is independently written. Existing owner-approved `src/observatory/content.js` remains unchanged as the source of career and project facts.

Owner's priority: a memorable personal site, not an agent-product landing page. Flight, education, research, finance roots, robotics, games and personality lead. Exactly three compact featured-project entries; detailed cases are optional. Preserve resume, Chinese/English, game and private-space links. Do not change GitHub profile, DNS, credentials or publication permissions.

### Concept
OFF THE GROUND: a personal flight log rather than a dashboard. Three material states: paper-white editorial pages, ultramarine airspace and safety-orange play. An original swept-wing sculpture ties the hero and flight chapter together. It is a generative illustration, not a photograph of the user's aircraft or a physics-certified simulator. No invented aviation qualification, flight hours, travel history or personal photos.

### Static composition before motion
1. Masthead: custom RG route mark; accessible CV, language, paper/night switch and menu.
2. Hero: oversized custom name lettering anchored to a hard grid; original wing sculpture and pressure-line field; a serif personal note. No glass panels or generic glowing orbs.
3. About: large first-person declaration, short factual biography and an asymmetrical tabletop of four illustrated interests. These are illustrations, not fabricated personal artifacts.
4. Flight: full-bleed ultramarine, white type, scroll-mapped horizon and manually controllable bank angle. Persistent keyboard-accessible controls; touch scrolling is never hijacked.
5. Journey: ruled editorial chronology, expandable experiences, education and linked research. Numbers structure the story, not fictitious performance counters.
6. Workshop: three narrow typographic project rows with pointer previews and optional complete case studies.
7. Contact: oversized closing typography, real email/copy action, GitHub, LinkedIn, game and private-space routes.

### Motion score: implemented interactions
| Scene | Trigger | Action | Timing / feedback | Exit / alternative |
|---|---|---|---|---|
| Arrival | first paint | name glyph masks reveal with staggering; aircraft settles | 850 ms glyph animation + 55 ms stagger, 1.05 s object arrival | links usable immediately; static reduced mode |
| Hero | pointer / mouse drag | yaw/pitch the sculpture; pressure lines respond | damped and clamped input; wireframe toggle | resets on leave; keyboard wireframe button; explicit flight controls below |
| Name | fine pointer | small independent glyph offsets | bounded by pointer position | reset/static reduced mode |
| Tabletop | drag or arrow keys | rearrange illustrated interests; Enter/button opens personal note | immediate offset with focused/lifted state | keyboard equivalent, touch-friendly note buttons, reset layout |
| Flight chapter | native scroll | sticky composition banks and crosses the horizon with three notes | progress maps to position, not a timer | single scene in reduced mode |
| Flight controls | buttons/range | manual bank overrides scroll | explicit angle feedback, ±35 degrees | reset returns to the tour; not live telemetry |
| Journey | open entry | native accordion with a brief text reveal | 250 ms reveal | native keyboard and reduced-motion behavior |
| Workshop | hover | small print-like preview follows within work area | 180 ms opacity / 300 ms transform | touch and keyboard open the same details without a hover requirement |
| Navigation | menu | full-viewport blue typography, staggered links | 650 ms links + 55 ms stagger | native dialog Escape and focus return |
| Contact | hover/copy | arrow motion and confirmed clipboard toast | 400 ms arrow / 200 ms toast | mailto remains available if clipboard access fails |

### Performance and interaction contracts
One animation loop, capped DPR 1.5, visible-scene gating, listener teardown, no external model or font downloads. CPU-projected mesh and Canvas rendering; no claimed GPU benchmark. Native scroll. Keyboard and touch alternatives. `prefers-reduced-motion` and explicit motion control halt repeated animation. No fake FPS claims: test on available browsers and state the environment.

### Verification gates
- Functional: cases/archive; EN/ZH roundtrip; menu/Escape/focus; keyboard postcard and bank controls; original CV/game routes; direct deep links; invalid project.
- Layout: 360, 390, 768, 1024, 1440, 1920 px including Chinese; no horizontal overflow.
- Visual: inspect screenshots of hero, flight, tabletop, chronology and mobile, not only counts.
- Build: run Node contracts and actual Vite output over HTTP in CI, with local resource checks. Do not equate source commit, static build and custom-domain deployment.

## Iterative review
1. **Composition:** first captures exposed a collision between RONGZE and GAO baselines and between the wireframe control and serif note. Reduced surname width and separated the controls while retaining the oversized first name.
2. **Responsive/material:** initial mobile aircraft extended outside the viewport. Adjusted camera center/scale and satin-metal contrast. Captured Chinese/English hero, tabletop, flight, chronology and compact work.
3. **Interaction:** project links now open without asynchronous hash timing; open personal notes survive locale switching; Escape closes the archive search; passive pointer response is disabled in reduced motion.

Local review: Chromium 144.0.7559.96, in-memory self-contained document. Twelve layout combinations passed overflow/runtime checks. Interaction review passed wireframe, menu/Escape, note translation, keyboard postcard/reset, bank input/buttons/reset, three cases, archive search, theme and locale roundtrip, plus motion-on Canvas response. This is not a deployed-domain or universal frame-rate test.

`tests/flightlog.browser.mjs` separately checks the actual Vite build. The workflow uploads the root-domain bundle, browser screenshots and machine-readable report. Consult the workflow result before describing a build as passed.

## Maintain / rollback
- UI: `src/flightlog/main.js`, `style.css`, `scene.js`, `art.js`.
- Existing shared content: `src/observatory/content.js` (unchanged).
- Existing `resume.html`, game and private space are retained.
- Restore `index.html` from commit `3876cfc51b2a020c64069638aa1557f2dcc7cfef` to restore the previous personal homepage; previous UI modules were not removed.
- `release.json` identifies this version as `off-the-ground-2026-09-12`.

Real photographs, flight footage and workshop images are not present. Future art direction should use the owner's actual media, rather than impersonating memories or personal evidence with generated stock images.
