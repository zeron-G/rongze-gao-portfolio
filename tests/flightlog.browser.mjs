// Exercise the actual Vite output. This is intentionally distinct from the
// in-memory design review, which cannot establish deployed network behavior.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const dist = path.resolve('dist');
const prefix = (process.env.SITE_BASE || '/').replace(/\/$/, '');
const types = {'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
const server = createServer(async(req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    if (prefix && !pathname.startsWith(prefix + '/')) {res.writeHead(404);res.end();return;}
    let relative = pathname.slice(prefix.length);
    if (!relative || relative === '/') relative = '/index.html';
    const file = path.resolve(dist, '.' + relative);
    if (!file.startsWith(dist + path.sep)) {res.writeHead(403);res.end();return;}
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch {res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:4173${prefix}/`;
const browser = await chromium.launch({headless:true});
const errors = [], failures = [], layouts = [];
await mkdir(path.join(dist,'previews'),{recursive:true});
try {
  for (const width of [360,390,768,1024,1440,1920]) for (const lang of ['en','zh']) {
    const context = await browser.newContext({viewport:{width,height:width>650?950:844},reducedMotion:'reduce'});
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', e => errors.push(`${width}/${lang}: ${e.message}`));
    page.on('response', r => {if (r.url().startsWith(origin) && r.status()>=400) failures.push(`${r.status()} ${r.url()}`);});
    await page.goto(`${origin}?lang=${lang}`);
    await page.waitForSelector('#hero-canvas[data-rendered]');
    assert.equal(await page.locator('.project-row').count(), 3);
    assert.equal(await page.locator('#flying').count(), 1);
    assert.ok((await page.locator('#about').innerText()).includes(lang==='zh'?'研究':'research'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1), false, `${width}/${lang} overflow`);
    assert.match(await page.locator('.resume-link').getAttribute('href'), /resume\.html/);
    assert.ok((await page.locator('#flying').innerText()).includes('FAA Part 141'));
    if (width===390 || width===1440) {
      await page.screenshot({path:path.join(dist,'previews',`${width}-${lang}-hero.png`),animations:'disabled'});
      for (const section of ['#about','#flying','#trajectory','#work']) {
        await page.locator(section).scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(dist,'previews',`${width}-${lang}-${section.slice(1)}.png`),animations:'disabled'});
      }
    }
    layouts.push({width,lang,overflow:false});
    await context.close();
  }
  const context = await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});
  const page = await context.newPage();page.setDefaultTimeout(12000);
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${origin}?lang=en`);await page.waitForSelector('#hero-canvas[data-rendered]');
  await page.locator('[data-wire]').click();assert.equal(await page.locator('[data-wire]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-menu]').click();assert.ok(await page.locator('#menu-dialog').isVisible());
  await page.keyboard.press('Escape');assert.equal(await page.locator('#menu-dialog').isVisible(),false);
  await page.locator('[data-note="sky"]').click();assert.equal(await page.locator('#detail-title').innerText(),'Flying');
  await page.locator('#detail-dialog [data-language]').click();assert.equal(await page.locator('#detail-title').innerText(),'飞行');
  await page.keyboard.press('Escape');await page.locator('.masthead [data-language]').click();
  const card=page.locator('[data-object="mind"]');await card.focus();await page.keyboard.press('ArrowRight');
  assert.equal(await card.evaluate(e=>e.style.getPropertyValue('--dx')),'14px');
  await page.locator('[data-reset-desk]').click();assert.equal(await card.evaluate(e=>e.style.getPropertyValue('--dx')),'0px');
  await page.locator('#bank').fill('23');assert.equal(await page.locator('#bank-value').innerText(),'+23°');
  await page.locator('[data-bank="10"]').click();assert.equal(await page.locator('#bank-value').innerText(),'+33°');
  await page.locator('[data-reset-flight]').click();assert.equal(await page.locator('#bank-value').innerText(),'0°');
  for (const id of ['anima-family','synapse','hapf']) {
    await page.locator(`.project-row[href="#project/${id}"]`).click();
    await page.waitForSelector('#detail-dialog[open]');assert.equal(await page.locator('.case-study').count(),1);
    await page.keyboard.press('Escape');
  }
  await page.locator('[data-archive]').click();await page.locator('#project-search').fill('Synapse');
  assert.equal(await page.locator('#archive-results a').count(),1);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#detail-dialog').isVisible(),false);
  await page.locator('button[data-theme]').click();assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'night');
  await page.locator('button[data-theme]').click();await page.locator('.masthead [data-language]').click();await page.locator('.masthead [data-language]').click();
  assert.equal(await page.locator('#flying').count(),1);
  await page.goto(`${origin}?lang=en#project/synapse`);await page.waitForSelector('#detail-dialog[open]');
  assert.equal(await page.locator('#detail-title').innerText(),'Synapse');await page.keyboard.press('Escape');
  await page.goto(`${origin}?lang=en#project/not-a-project`);await page.waitForSelector('#hero-canvas');
  assert.equal(await page.locator('#detail-dialog').isVisible(),false);
  for (const lang of ['en','zh']) {
    await page.goto(`${origin}resume.html?lang=${lang}`);await page.waitForSelector('.cv-controls');
    assert.ok((await page.locator('#cv').innerText()).includes('Gordon Gao'));
  }
  // Existing game remains a separate app: verify its entry and local module
  // assets, not game balance or every gameplay scenario.
  const game = await page.request.get(`${origin}game.html`);assert.equal(game.status(),200);
  const html=await game.text();const sources=[...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(m=>m[1]);
  assert.ok(sources.length>0);for (const src of sources) assert.equal((await page.request.get(new URL(src,origin).href)).status(),200);
  await context.close();
  const live=await browser.newContext({viewport:{width:1440,height:950}});const p=await live.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`${origin}?lang=en`);await p.waitForSelector('#hero-canvas[data-rendered]');await p.waitForTimeout(1100);
  const before=await p.locator('#hero-canvas').evaluate(e=>e.toDataURL());await p.mouse.move(1080,380);await p.waitForTimeout(180);
  assert.notEqual(await p.locator('#hero-canvas').evaluate(e=>e.toDataURL()),before);
  await p.screenshot({path:path.join(dist,'previews','hero-motion.png')});await live.close();
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  const report={result:'PASS',browser:browser.version(),mode:'Actual Vite dist over local HTTP in GitHub Actions',base:prefix||'/',layouts,checks:['wireframe','native menu/Escape','translated personal note','keyboard postcard/reset','bank controls','three case dialogs','archive search/Escape','theme','language roundtrip','deep links','invalid project','bilingual resume','legacy game entry/assets','motion-on scene'],errors,failures};
  await writeFile(path.join(dist,'previews','verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
