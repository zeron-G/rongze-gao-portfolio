from pathlib import Path
p=Path('src/flightlog/main.js');s=p.read_text()
if "from './motion.js'" in s:
    raise SystemExit('Already integrated; no change')
s=s.replace("import {wordArt,interestArt,mark} from './art.js';", "import {wordArt,interestArt,mark} from './art.js';\nimport {scrollDriver,ease,clamp01,damp,animateIn,animateOut,crossfade} from './motion.js';")
s=s.replace('let noteId=null;', 'let noteId=null,scrollSystem=null,wakeScene=()=>{};')
s=s.replace('RG—001<br>EXPLORATION / FORM STUDY', 'RG—002<br>LOW-WING / STUDIO STUDY')
s=s.replace('let frame=0,heroVisible=true,flightVisible=false,wire=false,bank=0,manual=false,pointer=[0,0],flightPointer=[0,0],lastStage=-1,lastDraw=0,scrollProgress=0,measureDirty=true;', '''let frame=0,heroVisible=true,flightVisible=false,wire=false,bank=0,manual=false,pointer=[0,0],flightPointer=[0,0],lastStage=-1,lastDraw=0,scrollProgress=0,measureDirty=true;
 const heroName=$('.hero-name'),heroNote=$('.hero-note'),horizon=$('.sky-horizon'),flightWord=$('.flight-word'),flightTitle=$('.flight-title'),flightText=$('#flight-copy'),flightStage=$('#flight-stage'),rail=$('.page-rail i'),steps=$$('.flight-progress i');
 let smoothedProgress=0,stageAnimation=null,settleUntil=0;
 let peekTarget=[0,0],peekPosition=[0,0],peekActive=false;
 const reviewSamples=[];''')
s=s.replace('const request=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);};', '''const request=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);};
 wakeScene=request;scrollSystem=scrollDriver(motion,request);
 const lockObserver=new MutationObserver(()=>scrollSystem?.lock(document.body.classList.contains('locked')));lockObserver.observe(document.body,{attributes:true,attributeFilter:['class']});''')
s=s.replace('measureDirty=false;};','measureDirty=false;scrollSystem?.resize();};',1)
s=s.replace("manual=true;$('#bank').value=bank;", "manual=true;settleUntil=performance.now()+700;$('#bank').value=bank;")
a=s.index(' function tick(time)');b=s.index(" addEventListener('scroll',request",a)
s=s[:a]+''' function tick(time){
  frame=0;if(document.hidden)return;const started=performance.now();
  const dt=lastDraw?Math.min(.05,(time-lastDraw)/1000):1/60;
  scrollSystem?.raf(time);if(measureDirty)measure();
  const sy=window.scrollY;
  scrollProgress=clamp01((sy-flightTop)/Math.max(1,flightHeight-viewHeight));
  smoothedProgress=motion?damp(smoothedProgress,scrollProgress,9,dt):scrollProgress;
  const stage=Math.min(2,Math.floor(scrollProgress*3));
  if(stage!==lastStage){
   lastStage=stage;flightStage.textContent=String(stage+1).padStart(2,'0');
   stageAnimation?.cancel();flightText.textContent=flightCopy(stage);
   if(motion)stageAnimation=flightText.animate([{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:440,easing:'cubic-bezier(.22,1,.36,1)'});
   steps.forEach((e,i)=>e.classList.toggle('active',i<=stage));
  }
  const departure=motion?clamp01(sy/viewHeight):0;
  const sceneBank=manual?bank:(smoothedProgress-.5)*26;
  if(heroVisible){
   heroScene?.draw({time,pointer,motion,wire,dark:night,departure});
   hero.style.setProperty('--departure-y',`${departure*72}px`);
   heroName.style.transform=`translate3d(0,${departure*24}px,0)`;
   heroNote.style.opacity=String(1-departure*.65);
  }
  if(flightVisible){
   flightScene?.draw({time,pointer:flightPointer,motion,progress:smoothedProgress,bank:sceneBank});
   const enter=motion?ease((sy-flightTop+viewHeight*.84)/(viewHeight*.84)):1;
   const exit=motion?ease((sy-flightTop-flightHeight+viewHeight)/viewHeight):0;
   sticky.style.borderRadius=`${(1-enter)*Math.min(innerWidth*.08,115)}px ${(1-enter)*Math.min(innerWidth*.08,115)}px ${exit*80}px ${exit*80}px`;
   horizon.style.transform=`translate3d(0,${motion?(smoothedProgress-.5)*30:0}px,0) rotate(${-sceneBank*.33}deg)`;
   flightWord.style.transform=`translate3d(${motion?(smoothedProgress-.5)*65:0}px,0,0)`;
   flightTitle.style.transform=`translate3d(0,${(1-enter)*20}px,0)`;
  }
  if(peekActive){peekPosition[0]=damp(peekPosition[0],peekTarget[0],13,dt);peekPosition[1]=damp(peekPosition[1],peekTarget[1],13,dt);peek.style.translate=`${peekPosition[0]}px ${peekPosition[1]}px`;}
  rail.style.transform=`scaleY(${docHeight>0?sy/docHeight:0})`;
  if(params.has('diagnostics')){reviewSamples.push(performance.now()-started);if(reviewSamples.length>360)reviewSamples.shift();}
  lastDraw=time;
  if(motion&&(heroVisible||flightVisible||peekActive||time<settleUntil||scrollSystem?.active||Math.abs(smoothedProgress-scrollProgress)>.0003))request();
 }
'''+s[b:]
s=s.replace('if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();','if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{lastDraw=0;request();}')
s=s.replace("peek.classList.add('shown');peek.dataset.preview=i;", "peek.classList.add('shown');peekActive=true;peek.dataset.preview=i;request();")
s=s.replace('peek.style.left=`${Math.min(r.width-280,Math.max(0,e.clientX-r.left-90))}px`;peek.style.top=`${e.clientY-r.top-160}px`;', 'peekTarget=[Math.min(r.width-280,Math.max(0,e.clientX-r.left-90)),e.clientY-r.top-160];if(!motion){peekPosition=[...peekTarget];peek.style.translate=`${peekPosition[0]}px ${peekPosition[1]}px`;}request();')
s=s.replace("()=>peek.classList.remove('shown')", "()=>{peekActive=false;peek.classList.remove('shown');}")
s=s.replace('measure();request();\n dispose=()=>', "if(params.has('diagnostics'))window.__flightReview={stats:()=>({hero:heroScene?.getStats(),flight:flightScene?.getStats(),cpuFrameMs:[...reviewSamples],smoothScroll:!!scrollSystem}),version:'flight-refined'};\n measure();request();\n dispose=()=>")
s=s.replace('dispose=()=>{ac.abort();io.disconnect();ro.disconnect();revealObserver.disconnect();cancelAnimationFrame(frame);heroScene?.destroy();flightScene?.destroy();};', 'dispose=()=>{ac.abort();io.disconnect();ro.disconnect();lockObserver.disconnect();revealObserver.disconnect();stageAnimation?.cancel();cancelAnimationFrame(frame);scrollSystem?.destroy();scrollSystem=null;heroScene?.destroy();flightScene?.destroy();wakeScene=()=>{};delete window.__flightReview;};')
s=s.replace("d.showModal();document.body.classList.add('locked');", "animateIn(d,motion);document.body.classList.add('locked');",1)
s=s.replace("function closeMenu(){const d=$('#menu-dialog');if(d.open)d.close();if(!$('#detail-dialog').open)document.body.classList.remove('locked');menuOpener?.isConnected&&menuOpener.focus({preventScroll:true});}", "function closeMenu(immediate=false){const d=$('#menu-dialog');animateOut(d,motion,()=>{if(!$('#detail-dialog').open)document.body.classList.remove('locked');menuOpener?.isConnected&&menuOpener.focus({preventScroll:true});},immediate);}")
s=s.replace("if(!d.open)d.showModal();document.body.classList.add('locked');d.scrollTop=0;", "animateIn(d,motion);document.body.classList.add('locked');d.scrollTop=0;")
a=s.index('function closeDetail(');b=s.index('function notify(',a)
s=s[:a]+'''function closeDetail(changeURL=true,immediate=false){noteId=null;const d=$('#detail-dialog');if(changeURL&&/^#(project\\/|archive)/.test(location.hash)){try{history.replaceState(null,'',location.pathname+location.search+priorHash);}catch{location.hash=priorHash;}}animateOut(d,motion,()=>{if(!$('#menu-dialog').open)document.body.classList.remove('locked');dialogOpener?.isConnected&&dialogOpener.focus({preventScroll:true});},immediate);}
'''+s[b:]
a=s.index('function changeLanguage()');b=s.index("document.addEventListener('click'",a)
s=s[:a]+'''function changeLanguage(){const y=scrollY,openNoteId=noteId;lang=lang==='en'?'zh':'en';store('rg.language',lang);try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}catch{}closeMenu(true);crossfade(()=>{render();if(openNoteId)openNote(openNoteId,null);else route();scrollTo({top:y,behavior:'instant'});scrollSystem?.sync();},motion);}
'''+s[b:]
s=s.replace("if(a.hasAttribute('data-theme')){night=!night;store('rg.night',night?'on':'off');const y=scrollY;render();scrollTo({top:y,behavior:'instant'});return;}", "if(a.hasAttribute('data-theme')){night=!night;store('rg.night',night?'on':'off');crossfade(()=>{document.documentElement.dataset.theme=night?'night':'paper';a.setAttribute('aria-pressed',night);wakeScene();},motion);return;}")
s=s.replace("const y=scrollY;closeMenu();render();scrollTo({top:y,behavior:'instant'});return;", "const y=scrollY;closeMenu(true);render();scrollTo({top:y,behavior:'instant'});scrollSystem?.sync();return;")
s=s.replace("if(a.closest('#menu-dialog')&&a.hash){closeMenu();}","if(a.closest('#menu-dialog')&&a.hash){closeMenu(true);}")
s=s.replace("target.scrollIntoView({behavior:motion?'smooth':'instant',block:'start'});", 'scrollSystem?.to(target);')
p.write_text(s)
css=Path('src/flightlog/style.css');css.write_text(css.read_text()+'\n'+Path('.review/polish.css').read_text())
print('Integrated aircraft/motion refinements without changing biography, CV or project evidence.')
