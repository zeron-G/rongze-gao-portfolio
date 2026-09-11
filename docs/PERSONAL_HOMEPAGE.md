# Personal-first correction

The owner requested a personal homepage, not a project catalog. Biography, flight, quantitative roots, education, work history, research and personal interests now lead. Projects occupy three compact cards, with the full index collapsed. The existing project dialogs, search, animations, bilingual state, game and private-space links are retained.

`src/observatory/personal.js` composes the existing app after initial render and its synchronous locale/motion refresh. `personal.css` supplies the new biography and flight layouts. `resume.html` is a separate bilingual, printable CV entry built from the existing verified content.

The profile repository separately retains its activity graph, trophies, typing SVG, skills icons, contribution snake and research notes, plus bilingual biography and CV files. Student-pilot / FAA Part 141 training wording is used without claiming an issued certificate.

## Publication is distinct from source control

Changes are committed to main. The new release workflow tests the actual Vite output in Chromium at mobile/desktop widths in both languages, produces screenshots and CV PDFs, and publishes to the repository's already-configured GitHub Pages site. It does not enable a new Pages site, modify DNS, migrate the custom domain, expose secrets or alter private-site authentication.

The custom domain can still be served by another provider. `release.json` identifies this version; an old title or missing marker at rongzegao.com means the production hosting connection remains separate from this commit. The workflow exposes a working Pages URL when deployment succeeds and retains the tested output as an artifact.

Original components, the game, and the prior content catalog were not deleted.
