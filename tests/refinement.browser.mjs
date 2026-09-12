import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve('dist');
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.json':'application/json'};
const server=createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://local').pathname);if(p==='/')p='/index.html';const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));
const origin='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const out=path.join(root,'previews');await mkdir(out,{recursive:true});
const errors=[],failures=[],layouts=[];let stats=null;
try{
 for(const width of [390,768,1440,1920])for(const lang of ['en','zh']){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(`${width}/${lang}: ${e.message}`));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)failures.push(r.url());});
  await page.goto(`${origin}/?lang=${lang}&diagnostics=1`);await page.waitForSelector('#hero-canvas[data-renderer="webgl2"]');await page.waitForTimeout(180);
  assert.equal(await page.locator('.project-row').count(),3);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  const gpu=await page.evaluate(()=>window.__flightReview.stats().hero);assert.ok(gpu.triangles>500);assert.ok(gpu.calls<90);
  if(width===390||width===1440){await page.screenshot({path:path.join(out,`${width}-${lang}-hero.png`)});await page.locator('#flying').scrollIntoViewIfNeeded();await page.waitForTimeout(200);await page.screenshot({path:path.join(out,`${width}-${lang}-flight.png`)});}
  layouts.push({width,lang,overflow:false,renderer:gpu.renderer,drawCalls:gpu.calls,triangles:gpu.triangles});await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});const p=await context.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${origin}/?lang=en&diagnostics=1`);await p.waitForSelector('#hero-canvas[data-renderer="webgl2"]');
 await p.locator('[data-wire]').click();assert.equal(await p.locator('[data-wire]').getAttribute('aria-pressed'),'true');
 await p.screenshot({path:path.join(out,'airframe-wire.png')});await p.locator('[data-wire]').click();
 await p.locator('[data-menu]').click();await p.waitForSelector('#menu-dialog[open]');await p.keyboard.press('Escape');await p.waitForSelector('#menu-dialog[open]',{state:'hidden'});
 await p.locator('[data-note="sky"]').click();await p.locator('#detail-dialog [data-language]').click();await p.waitForFunction(()=>document.querySelector('#detail-title')?.textContent==='飞行');await p.keyboard.press('Escape');
 await p.locator('.masthead [data-language]').click();await p.waitForFunction(()=>document.documentElement.lang==='en');
 await p.locator('[data-bank="10"]').click();assert.equal(await p.locator('#bank-value').innerText(),'+10°');await p.locator('[data-reset-flight]').click();
 for(const id of ['anima-family','synapse','hapf']){await p.locator(`.project-row[href="#project/${id}"]`).click();assert.equal(await p.locator('.case-study').count(),1);await p.keyboard.press('Escape');}
 await p.locator('[data-archive]').click();await p.locator('#project-search').fill('Synapse');assert.equal(await p.locator('#archive-results a').count(),1);await p.keyboard.press('Escape');
 await p.goto(`${origin}/resume.html?lang=zh`);await p.waitForSelector('.cv-controls');assert.ok((await p.locator('#cv').innerText()).includes('Gordon Gao'));
 await context.close();
 const live=await browser.newContext({viewport:{width:1440,height:950}});const page=await live.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${origin}/?lang=en&diagnostics=1`);await page.waitForSelector('#hero-canvas[data-renderer="webgl2"]');await page.waitForTimeout(1600);
 assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('lenis')));
 await page.mouse.move(970,450);await page.waitForTimeout(300);await page.screenshot({path:path.join(out,'hero-motion.png')});
 await page.locator('[data-menu]').click();await page.waitForTimeout(800);await page.keyboard.press('Escape');
 await page.waitForSelector('#menu-dialog.closing');await page.waitForSelector('#menu-dialog[open]',{state:'hidden'});
 await page.locator('button[data-theme]').click();await page.waitForFunction(()=>document.documentElement.dataset.theme==='night');await page.waitForTimeout(500);
 await page.screenshot({path:path.join(out,'hero-night.png')});
 await page.locator('button[data-theme]').click();await page.waitForFunction(()=>document.documentElement.dataset.theme==='paper');
 await page.locator('.masthead [data-language]').click();await page.waitForFunction(()=>document.documentElement.lang==='zh-CN');await page.waitForTimeout(600);
 assert.equal(await page.locator('#flying').count(),1);
 await page.locator('.masthead [data-language]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');await page.waitForTimeout(500);
 await page.mouse.wheel(0,530);await page.waitForTimeout(1200);assert.ok(await page.evaluate(()=>scrollY>350));
 const top=await page.locator('#flying').evaluate(e=>e.offsetTop);
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top-420);await page.waitForTimeout(300);await page.screenshot({path:path.join(out,'chapter-entry.png')});
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top+480);await page.waitForTimeout(700);await page.screenshot({path:path.join(out,'flight-motion.png')});
 stats=await page.evaluate(()=>{const s=window.__flightReview.stats();const a=s.cpuFrameMs.slice(15).sort((a,b)=>a-b);return {...s,cpuFrameMs:undefined,cpuMedianMs:a[Math.floor(a.length*.5)]??null,cpuP95Ms:a[Math.floor(a.length*.95)]??null,samples:a.length};});
 await live.close();
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 const report={result:'PASS',browser:browser.version(),renderEnvironment:'GitHub Linux headless Chromium / SwiftShader; CPU submission times are NOT hardware GPU FPS',layouts,checks:['real-webgl','bounded-draw-calls','wireframe','menu-open-and-close','translated-note','manual-bank','project-details','search','resume','wheel-inertia','theme-crossfade','locale-roundtrip','chapter-entry'],stats,errors,failures};
 await writeFile(path.join(out,'refinement-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));}
