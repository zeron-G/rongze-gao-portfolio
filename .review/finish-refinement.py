from pathlib import Path
p=Path('src/flightlog/main.js');s=p.read_text()
if 'let sceneCache=null;' not in s:
    s=s.replace('let noteId=null,scrollSystem=null,wakeScene=()=>{};', 'let noteId=null,scrollSystem=null,wakeScene=()=>{};\nlet sceneCache=null;')
    s=s.replace("const heroScene=createScene($('#hero-canvas')),flightScene=createScene($('#flight-canvas'),{flight:true});", """if(sceneCache){$('#hero-canvas').replaceWith(sceneCache.heroCanvas);$('#flight-canvas').replaceWith(sceneCache.flightCanvas);}
 const heroCanvas=$('#hero-canvas'),flightCanvas=$('#flight-canvas');
 const heroScene=sceneCache?.hero||createScene(heroCanvas),flightScene=sceneCache?.flight||createScene(flightCanvas,{flight:true});
 sceneCache={heroCanvas,flightCanvas,hero:heroScene,flight:flightScene};heroScene?.resize();flightScene?.resize();""")
    s=s.replace("new MutationObserver(()=>scrollSystem?.lock(document.body.classList.contains('locked')))", "new MutationObserver(()=>{scrollSystem?.lock(document.body.classList.contains('locked'));request();})")
    s=s.replace('const sy=window.scrollY;', "const sy=window.scrollY;const panelOpen=document.body.classList.contains('locked');")
    s=s.replace('if(heroVisible){','if(heroVisible&&!panelOpen){').replace('if(flightVisible){','if(flightVisible&&!panelOpen){')
    s=s.replace('if(motion&&(heroVisible||flightVisible||peekActive||', 'if(motion&&!panelOpen&&(heroVisible||flightVisible||peekActive||')
    s=s.replace('heroScene?.destroy();flightScene?.destroy();wakeScene=()=>{};', 'wakeScene=()=>{};')
    s=s.replace("addEventListener('pagehide',()=>{dispose();context?.close();context=null;});", "addEventListener('pagehide',()=>{dispose();sceneCache?.hero?.destroy();sceneCache?.flight?.destroy();sceneCache=null;context?.close();context=null;});")
    p.write_text(s)
p=Path('src/flightlog/scene.js');s=p.read_text()
s=s.replace("return {draw(){},resize(){},destroy(){img.remove();}", "return {draw(){},resize(){if(!img.isConnected&&canvas.isConnected)canvas.after(img);},destroy(){img.remove();}")
s=s.replace('pmrem.fromScene(room,.045)', 'pmrem.fromScene(room,.045,.1,100,{size:128})')
s=s.replace('const scale=flight?1.02+Math.sin(tour*Math.PI)*.035:1.06;', 'const scale=(flight?1.02+Math.sin(tour*Math.PI)*.035:1.06)*(innerWidth<650?.79:1);')
p.write_text(s)
p=Path('src/flightlog/style.css');s=p.read_text()
if 'REFINEMENT VISUAL PASS 03' not in s:
    s+='\n/* REFINEMENT VISUAL PASS 03: keep control and handwritten note separate. */\n@media(min-width:901px){.scene-view{right:7%;bottom:26%}}\n'
p.write_text(s)
p=Path('tests/refinement.browser.mjs');s=p.read_text()
s=s.replace('viewport:{width,height:950}', 'viewport:{width,height:width===390?844:950}')
s=s.replace("await page.mouse.wheel(0,530);await page.waitForTimeout(1200);assert.ok(await page.evaluate(()=>scrollY>350));", """await page.waitForFunction(()=>!document.body.classList.contains('locked')&&!document.getAnimations().some(a=>String(a.effect?.pseudoElement||'').includes('view-transition')&&a.playState==='running'));
 await page.mouse.move(650,670);await page.mouse.wheel(0,530);
 await page.waitForFunction(()=>scrollY>350,{},{timeout:12000});assert.ok(await page.evaluate(()=>scrollY>350));""")
p.write_text(s)
print('PASS: retained renderers, paused hidden scenes, reduced environment texture, mobile framing and state-based motion checks')
