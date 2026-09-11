# Observatory / 2026

A bilingual editorial portfolio built on the existing Rongze Gao website repository.

## Design

Midnight surfaces, icy cyan and warm gold; oversized typography, a depth-sorted particle observatory, three purpose-built project illustrations, a searchable/filterable project index and readable case-study dialogs. The original space/engineering identity, game entry and private-hub link are retained.

The homepage is now a small native ES-module application inside the existing Vite project. It does not require new runtime dependencies, remote fonts, image APIs or a third-party animation CDN. The previous React components remain in source; the React game and Vite multi-page build are unchanged. No hosting, DNS, credentials or private-hub access policy was changed.

## Editing

- `src/observatory/content.js`: public career content and 12 curated case studies. Bilingual pairs are `[English, 简体中文]`.
- `src/observatory/main.js`: page structure, native dialogs, hash routing, filters, keyboard search and user controls.
- `src/observatory/orbit.js`: decorative Canvas particles; not measured data or live telemetry.
- `src/observatory/style.css`: design tokens, responsive layouts, motion, focus, dialog and print styles.
- `index.html`: entry, canonical metadata, fallback and Person structured data.

Keep accomplishments tied to their source. Research prototypes are not clinical products. Team work is attributed to the team. Private repository links do not grant access. Do not add phones, school IDs, patient data, credentials or runtime configuration to the public catalog.

## Interaction

Project links use `#project/anima-family`, `#project/synapse`, etc.; the complete background uses `#profile`. Use `?lang=en` or `?lang=zh`. Language preference and motion settings are saved locally when storage is available. Ctrl/Command K opens search; arrows navigate; Enter opens; Escape closes. Dialogs provide browser-native focus containment. Audio is opt-in and never autoplays. Scrolling remains native.

Animation pauses when the Canvas is hidden or offscreen; its device-pixel ratio is capped. Reduced-motion preference is respected, an explicit motion switch is available, and listeners/observers are cleaned up when rerendering or leaving the page.

## Verification

```sh
npm ci
node --check src/observatory/main.js
node --check src/observatory/orbit.js
node --test tests/observatory.test.mjs
npm run build
npm run preview
```

Four local Node contract tests passed. Chromium in-memory acceptance covered English/Chinese at widths 320, 390, 768 and 1440, all 12 cases, six category filters, keyboard search, profile/language switching, malformed hash recovery, mobile navigation and reduced motion; no uncaught runtime errors or horizontal overflow were observed.

That local acceptance loads the same HTML/CSS/JavaScript in memory; it is not a deployed-site network test or a Vite dependency-install/build test. The repository workflow separately runs Node checks, `npm ci`, the actual Vite build and checks both `dist/index.html` and `dist/game.html`. Confirm its result before production promotion. The existing game's implementation was preserved rather than rewritten or claimed newly validated by the homepage test.

## Rollback

The redesign is isolated in `src/observatory/` and a replacement `index.html`. Restore the previous `index.html` from commit `b85c3c2b212f6b638061a7bcc03415ddcb369a2e` to use the original React homepage. Original components and game files were not deleted.
