import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const dist=path.resolve('dist');
const prefix=(process.env.SITE_BASE||'/').replace(/\/$/,'');
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.pdf':'application/pdf'};
const server=createServer(async(req,res)=>{try{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
  if(prefix && !pathname.startsWith(prefix+'/')){res.writeHead(404);res.end();return;}
  let relative=pathname.slice(prefix.length);if(relative==='/'||relative==='')relative='/index.html';
  const file=path.resolve(dist,'.'+relative);if(!file.startsWith(dist+path.sep)){res.writeHead(403);res.end();return;}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:4173${prefix}/`;
const browser=await chromium.launch({headless:true});
const errors=[], failures=[];
await mkdir(path.join(dist,'previews'),{recursive:true});await mkdir(path.join(dist,'resume'),{recursive:true});
try{
 for(const width of [390,1440])for(const lang of ['en','zh']){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${origin}?lang=${lang}`);await page.waitForSelector('#app[data-composition="personal"]');
  const ids=await page.locator('main#main > section').evaluateAll(nodes=>nodes.map(n=>n.id));
  assert.deepEqual(ids,['top','about','flying','trajectory','research','beyond','work','contact']);
  assert.equal(await page.locator('.mini-project').count(),3);
  assert.equal(await page.locator('#project-archive').getAttribute('open'),null);
  assert.ok(await page.locator('#flying').innerText().then(t=>t.includes('FAA Part 141')));
  assert.ok((await page.locator('.hero-actions').innerText()).includes(lang==='zh'?'履历':'CV'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.locator('.mini-project').first().click();await page.waitForSelector('#detail-dialog[open]');
  assert.match(await page.locator('#dialog-title').innerText(),/ANIMA/);await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');await page.waitForSelector('#search-dialog[open]');
  await page.locator('#search-input').fill('Synapse');await page.locator('[data-search-result]').first().click();
  assert.equal(await page.locator('#dialog-title').innerText(),'Synapse');await page.keyboard.press('Escape');
  await page.locator('.header [data-language]').click();assert.equal(await page.locator('#flying').count(),1);
  await page.locator('.header [data-language]').click();assert.equal(await page.locator('.mini-project').count(),3);
  for(const id of ids)await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(dist,'previews',`${width===390?'mobile':'desktop'}-${lang}.png`),fullPage:true,animations:'disabled'});
  await page.goto(`${origin}resume.html?lang=${lang}`);await page.waitForSelector('.cv-controls');
  assert.ok((await page.locator('#cv').innerText()).includes('Gordon Gao'));
  if(width===1440)await page.pdf({path:path.join(dist,'resume',`Rongze_Gao_CV_${lang==='zh'?'CN':'EN'}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 console.log(JSON.stringify({result:'passed',viewports:[390,1440],locales:['en','zh'],checks:['personal-first-order','three-compact-projects','collapsed-archive','flight','CV','dialogs','search','locale-roundtrip','no-overflow','local-resource-status','PDF-output'],errors,failures}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
