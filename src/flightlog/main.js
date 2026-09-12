import {person,projects,experience,education,publication,honors} from '../observatory/content.js';
import {createScene} from './scene.js';
import {wordArt,interestArt,mark} from './art.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stored=(k,d)=>{try{return localStorage.getItem(k)||d;}catch{return d;}};
const store=(k,v)=>{try{localStorage.setItem(k,v);}catch{/* Storage is optional. */}};
const base=import.meta.env?.BASE_URL||'./';
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const params=new URLSearchParams(location.search);
let lang=params.get('lang')||stored('rg.language',navigator.language.startsWith('zh')?'zh':'en');
if(!['en','zh'].includes(lang))lang='en';
let motion=!motionQuery.matches&&stored('rg.motion','on')==='on',night=stored('rg.night','off')==='on',sound=false;
let noteId=null;
let dispose=()=>{},selected=0,filter='all',priorHash='#top',dialogOpener=null,menuOpener=null,noticeTimer,context;
const t=v=>Array.isArray(v)?v[lang==='zh'?1:0]:v;
const l=(en,zh)=>lang==='zh'?zh:en;
const arrow='<span aria-hidden="true">↗</span>';
const external=(url,label,cls='')=>`<a class="${cls}" href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(label)} ${arrow}</a>`;
const resumeURL=()=>`${base}resume.html?lang=${lang}`;
const gameURL=()=>location.protocol==='file:'?'https://rongzegao.com/game.html':`${base}game.html`;
const topics={sky:['Flying','飞行'],mind:['Research','研究'],play:['Play','游戏'],build:['Making','动手']};
const notes={
 sky:["Flying is one of the ways I step away from the terminal. I train at Washington International Flight Academy through the FAA Part 141 private-pilot course. The checklist matters. So does the view.","飞行是我走出终端的一种方式。我在 Washington International Flight Academy 接受 FAA Part 141 私人飞行员课程训练。检查单很重要，窗外的风景也一样。"],
 mind:["My path started with finance and quantitative modeling. At Johns Hopkins, that curiosity found a new setting: healthcare AI, patient data and questions that need more than a convincing answer.","我的起点是金融与量化建模。在约翰斯·霍普金斯大学，这份好奇心走进了新的场景：医疗 AI、患者数据，以及不能只靠一个漂亮回答解决的问题。"],
 play:["Games and interactive worlds don't have to become a work credential. Sometimes exploring a world, learning its rules and getting pleasantly lost is enough.","游戏和交互世界不必变成一条工作资历。有时候，探索一个世界、发现它的规则，再愉快地迷一会儿路，就已经足够。"],
 build:["Robotics and FPV connect code to things you can touch. I enjoy the stretch between an idea on screen and something that actually moves in the world.","机器人和 FPV 把代码连接到可以触摸的事物。我喜欢从屏幕里的想法，走到真实世界中会动起来的东西的这段过程。"]
};
function chapter(n,label){return `<p class="eyebrow"><span>${n} /</span> ${label}</p>`;}
function topbar(){return `<header class="masthead"><a class="brand" href="#top" aria-label="Rongze Gao — home">${mark}<span>RONGZE GAO<small>${l('PERSONAL FLIGHT LOG','个人飞行日志')}</small></span></a><p class="edition">VOL. 01 <span>© 2026</span></p><div class="nav-tools"><a class="resume-link" href="${resumeURL()}">CV ${arrow}</a><button data-language aria-label="${l('Switch to Chinese','切换为英文')}">${lang==='en'?'中文':'EN'}</button><button data-theme class="theme-button" aria-label="${l('Toggle paper and night palette','切换纸白与夜间配色')}" aria-pressed="${night}">◐</button><button data-menu class="menu-toggle" aria-haspopup="dialog"><span>${l('INDEX','目录')}</span><i aria-hidden="true"><b></b><b></b></i></button></div></header>`;}
function render(){
 dispose();
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';
 document.documentElement.dataset.motion=motion?'on':'off';
 document.documentElement.dataset.theme=night?'night':'paper';
 document.title=l('Rongze Gao — Off the Ground','高荣泽 — 不止于地面');
 $('#app').innerHTML=`${topbar()}<main id="main">
 <section class="hero" id="top"><div class="hero-meta"><p>${l('RESEARCHER. STUDENT PILOT.<br>QUANTITATIVE ROOTS. RESTLESS CURIOSITY.','研究者 · 飞行员学员<br>量化是起点，好奇心没有边界。')}</p><p class="hero-location">HANGZHOU ↔ JOHNS HOPKINS<br><span>${l('A QUESTION / THE NEXT FLIGHT.','下一个问题 / 下一段旅程。')}</span></p></div>
 <div class="hero-name"><h1 class="sr-only">Rongze Gao / 高荣泽</h1><div class="first-name">${wordArt('RONGZE')}</div><div class="last-name">${wordArt('GAO')}<span class="name-cn">高<br>荣<br>泽</span></div></div>
 <div class="hero-scene" data-cursor="${l('STEER','转向')}"><canvas id="hero-canvas" aria-hidden="true"></canvas><span class="object-number">RG—001<br>EXPLORATION / FORM STUDY</span><button class="scene-view" data-wire aria-pressed="false">${l('VIEW WIREFRAME','切换线框')} +</button></div>
 <div class="hero-note"><span class="note-star" aria-hidden="true">✳</span><p>${l('A little closer<br>to the <em>unknown.</em>','向未知，<br><em>再靠近一点。</em>')}</p></div>
 <div class="hero-footer"><a href="#about" class="scroll-link"><span class="down-arrow" aria-hidden="true">↓</span>${l('THE STORY STARTS HERE','故事，从这里开始')}</a><p>${l('MOVE YOUR CURSOR. CHANGE THE PERSPECTIVE.','移动鼠标，换一个视角。')}<br><span>${l('Use the controls below for the flight chapter.','飞行章节也有键盘和触屏控制。')}</span></p><div class="sound-motion"><button data-motion aria-pressed="${motion}">${motion?'◉':'○'} ${l('MOTION','动效')}</button><button data-sound aria-pressed="${sound}">${sound?'♫':'♪'} ${l('SOUND','声音')} ${sound?'ON':'OFF'}</button></div></div></section>
 <div class="chapter-strip" aria-hidden="true"><span>01 / A FEW THINGS ABOUT ME</span><span>↙ NOT A STRAIGHT LINE ↗</span><span>KEEP EXPLORING ↓</span></div>
 <section class="about chapter" id="about">${chapter('01',l('NOT ONE THING. A FEW THINGS.','不是一种身份，是好几个侧面。'))}<div class="about-heading"><h2 class="display-title">${l('NEVER JUST<br><span>ONE THING.</span>','不止一个<br><span>标签。</span>')}</h2><span class="round-stamp" aria-hidden="true">FINANCE<br>↗ RESEARCH<br>↗ FLIGHT<br>↗ ?</span></div>
 <div class="about-body"><p class="personal-line">${l('Hi, I’m Rongze.<br>Not particularly good<br>at staying in one box.','你好，我是高荣泽。<br>总忍不住，<br>去看看边界之外。')}</p><div><p>${l('I started in finance, found my way into AI, and took a few turns toward the sky. I’m a Johns Hopkins graduate and a research assistant at CDHAI, working with Professor Gordon Gao.','我从金融出发，走进 AI，又拐了几个弯，走向天空。我是约翰斯·霍普金斯大学硕士毕业生，目前在 CDHAI 跟随 Gordon Gao 教授担任研究助理。')}</p><p>${l('Patient-data research, robot deployment, a flight lesson, or an evening lost in a game: different settings, same curiosity. I like understanding things—and making something out of that understanding.','患者数据研究、机器人部署、一堂飞行课，或者在游戏里消磨的一个晚上：不同的场景，同一份好奇。我喜欢弄懂事物，也喜欢把这种理解变成一点真实的东西。')}</p><a href="${resumeURL()}" class="underline-link">${l('THE LONGER VERSION / MY CV','更完整的故事 / 我的履历')} ${arrow}</a></div></div>
 <div class="desk-top"><span>${l('A FEW THINGS ON MY DESK','桌面上的几个侧面')}</span><span>${l('DRAG TO REARRANGE · CLICK TO OPEN','拖动重新摆放 · 点击阅读')}</span><button data-reset-desk>${l('RESET','复位')} ↺</button></div>
 <div class="desk" aria-label="${l('Interactive interest postcards','可交互的个人兴趣卡片')}">${Object.entries(topics).map(([id,label],i)=>`<article class="specimen specimen-${id}" data-object="${id}" style="--i:${i};--angle:${[-9,7,-5,11][i]}deg" tabindex="0" aria-label="${safe(t(label))} — ${l('arrow keys to move; Enter to read','方向键移动，回车阅读')}"><div class="specimen-top"><span>0${i+1} / RG</span><span>${id==='sky'?'↗':id==='mind'?'※':id==='play'?'▤':'↔'}</span></div>${interestArt(id)}<div class="specimen-title"><strong>${safe(t(label))}</strong><button data-note="${id}" aria-label="${l('Read about ','阅读：')+safe(t(label))}">↗</button></div><span class="specimen-caption">${['THE SKY / WIFA','THE QUESTIONS / JHU','THE OTHER WORLDS','THE PHYSICAL WORLD'][i]}</span></article>`).join('')}<p class="desk-footnote">${l('ILLUSTRATED INTERESTS. NO PERFECTLY ORGANIZED LIFE IMPLIED.','兴趣的几张插画。生活，不必总是井井有条。')}</p></div></section>
 <section class="flight" id="flying"><div class="flight-sticky">${chapter('02',l('OFF THE GROUND','不止于地面'))}<div class="flight-title"><h2>${l('A DIFFERENT<br><em>POINT OF VIEW.</em>','换一个高度，<br><em>看世界。</em>')}</h2><p>${l('STUDENT PILOT<br>WASHINGTON INTERNATIONAL<br>FLIGHT ACADEMY','飞行员学员<br>WASHINGTON INTERNATIONAL<br>FLIGHT ACADEMY')}</p></div>
 <div class="airspace"><div class="sky-horizon" aria-hidden="true"><span class="horizon-line"></span><b></b><i></i></div><canvas id="flight-canvas" aria-hidden="true"></canvas><div class="flight-side-label">FIELD NOTE — <span id="flight-stage">01</span><br>ILLUSTRATIVE AIRSPACE</div><div class="flight-word" aria-hidden="true">FLY.</div></div>
 <div class="flight-reading"><p id="flight-copy">${flightCopy(0)}</p><div class="flight-controls"><div class="flight-control-label"><label for="bank">${l('TAKE THE CONTROLS','试着掌握方向')}</label><output id="bank-value" for="bank">0°</output></div><div class="bank-row"><button data-bank="-10" aria-label="${l('Bank left','向左倾斜')}">←</button><input id="bank" type="range" min="-35" max="35" value="0" step="1" aria-label="${l('Illustrative bank angle','演示倾斜角度')}"><button data-bank="10" aria-label="${l('Bank right','向右倾斜')}">→</button><button data-reset-flight aria-label="${l('Reset flight controls','重置飞行控制')}">↺</button></div><span>${l('PLAYFUL ILLUSTRATION, NOT A FLIGHT SIMULATOR.','交互式插画，不是飞行模拟器。')}</span></div></div><div class="flight-progress" aria-hidden="true"><i></i><i></i><i></i><span>SCROLL / CHANGE YOUR VIEW</span></div></div></section>
 <section class="journey chapter" id="trajectory"><div class="journey-top">${chapter('03',l('SOME TURNS ALONG THE WAY','一路上，拐过的几个弯'))}<a href="${resumeURL()}" class="underline-link">${l('FULL CV','完整履历')} ${arrow}</a></div><div class="journey-layout"><div class="journey-heading"><h2 class="display-title">${l('TAKING<br>THE LONG<br><em>WAY.</em>','走得<br>远一点，<br><em>再远一点。</em>')}</h2><p>${l('Finance taught me to question the numbers. Research taught me to question the question. Still learning.','金融让我审视数字，研究让我重新审视问题。还在学习。')}</p><span class="journey-arrow" aria-hidden="true">↳</span></div><div class="journey-list">${experience.map((e,i)=>`<details class="journey-entry" ${i<1?'open':''}><summary><span class="entry-index">0${i+1}</span><span><small>${safe(lang==='zh'?e.years.replace('Present','至今').replace('Part-time / Remote','兼职／远程'):e.years)}</small><strong>${safe(t(e.title))}</strong><em>${safe(t(e.role))}</em></span><b aria-hidden="true">+</b></summary><div class="entry-body"><p>${safe(t(e.text))}</p>${e.id==='cdhai'?external(person.professor,'Gordon Gao')+' · '+external(person.lab,'AI Agent Lab'):e.link?external(e.link,l('Related work','相关工作')):''}</div></details>`).join('')}</div></div>
 <div class="education">${education.map((e,i)=>`<article><span>0${i+1} / ${e.years}</span><h3>${safe(t(e.title))}</h3><p>${safe(t(e.detail))}</p><small>${safe(t(e.note))}</small></article>`).join('')}</div></section>
 <section class="research chapter" id="research">${chapter('04',l('IN THE MARGINS / RESEARCH & MILESTONES','页边笔记 / 研究与里程碑'))}<div class="research-layout"><div class="research-note"><span class="hand-note">${l('A note to self:','写给自己：')}</span><h2>${l('Stay<br><em>curious.</em>','保持<br><em>好奇。</em>')}</h2><span class="scribble" aria-hidden="true">↗</span></div><div class="research-details"><a href="${publication.url}" class="paper-link" target="_blank" rel="noopener noreferrer"><div class="paper-top"><span>PUBLICATION / ${publication.year}</span>${arrow}</div><h3>${safe(publication.title)}</h3><p>${safe(publication.venue)}</p><small>DOI ${publication.doi}</small></a><div class="milestones">${honors.map((h,i)=>`<p><span>0${i+1}</span>${safe(t(h))}</p>`).join('')}</div><p class="research-footer">${l('The publication is part of my earlier quantitative research. Current work at CDHAI explores patient forecasting and medical-data analysis.','论文来自早期量化研究。目前在 CDHAI 的工作关注患者预测与医学数据分析。')}</p></div></div></section>
 <section class="work chapter" id="work">${chapter('05',l('A SMALL CORNER OF THE WORKSHOP','作品，只是其中一角'))}<div class="work-heading"><h2>${l('Made along<br><em>the way.</em>','一路上，<br><em>做过的东西。</em>')}</h2><p>${l('Three things I’ve spent time building.<br>Open one to look inside.','选三个花过心思的项目。<br>感兴趣的话，打开看看。')}</p></div><div class="project-rows">${projects.filter(p=>p.featured).map((p,i)=>`<a href="#project/${p.id}" class="project-row" data-preview="${i}"><span>0${i+1}</span><strong>${safe(p.name)}</strong><p>${safe(t(p.type))}<small>${p.private?l('PRIVATE / DEMO AVAILABLE','私有 / 可演示'):l('PUBLIC SOURCE','公开源码')}</small></p><b aria-hidden="true">↗</b></a>`).join('')}</div><div id="project-peek" aria-hidden="true"><div></div></div><div class="work-bottom"><button data-archive class="underline-link">${l('THE REST OF THE NOTEBOOK','其余项目，收在这里')} +</button><a href="${person.github}?tab=repositories" target="_blank" rel="noopener noreferrer">GITHUB ${arrow}</a></div></section>
 <section class="contact chapter" id="contact">${chapter('06',l('END OF THIS PAGE. NOT THE CONVERSATION.','页面到这里，对话才开始。'))}<div class="contact-preamble"><p>${l('An idea. A question.<br>A good story about flying.<br>I’m listening.','一个想法，一个问题，<br>或者一个关于飞行的好故事。<br>我在听。')}</p><a class="contact-launch" href="mailto:${person.email}" aria-label="${l('Send an email','发送邮件')}">↗</a></div><a href="mailto:${person.email}" class="contact-type">${l('OVER<br><em>TO YOU.</em>','接下来，<br><em>换你了。</em>')}</a><div class="contact-links"><div><a class="email" href="mailto:${person.email}">${person.email}</a><button data-copy aria-label="${l('Copy email address','复制邮箱')}">⧉</button></div><nav aria-label="${l('Personal links','个人链接')}">${external(person.github,'GitHub')}${external(person.linkedin,'LinkedIn')}<a href="${gameURL()}">${l('Playground','游乐场')} ${arrow}</a>${external('https://private.rongzegao.com',l('Private space','私域'))}</nav></div><footer><a href="#top">${mark}<span>RONGZE GAO / 高荣泽</span></a><span>OFF THE GROUND · 2026</span><a href="#top">${l('BACK TO TOP','返回顶部')} ↑</a></footer></section></main><div class="page-rail" aria-hidden="true"><i></i><span>RG / FLIGHT LOG</span></div><div class="pointer-note" aria-hidden="true"></div>`;
 mount();
}
function flightCopy(i){return [
 l('The checklist comes first. I train through the FAA Part 141 private-pilot course at Washington International Flight Academy.','先从检查单开始。我在 Washington International Flight Academy 接受 FAA Part 141 私人飞行员课程训练。'),
 l('A new perspective. Procedures, navigation and responsibility share the cockpit with the simple joy of being up here.','换一个视角。程序、导航和责任，与飞在空中的那份纯粹快乐，同在一个驾驶舱里。'),
 l('Bring it back to earth. The best part of exploring is coming back with a different way of seeing.','带着新的视角回到地面。探索最美好的部分，是回来以后，看事情的方式有了一点不同。')
 ][i];}
function mount(){
 const ac=new AbortController(),sig={signal:ac.signal};
 const heroScene=createScene($('#hero-canvas')),flightScene=createScene($('#flight-canvas'),{flight:true});
 let frame=0,heroVisible=true,flightVisible=false,wire=false,bank=0,manual=false,pointer=[0,0],flightPointer=[0,0],lastStage=-1,lastDraw=0,scrollProgress=0,measureDirty=true;
 let heroDrag=null;
 let heroRect,flightTop=0,flightHeight=1,viewHeight=innerHeight,docHeight=1;
 const hero=$('.hero-scene'),flight=$('#flying'),sticky=$('.flight-sticky');
 const measure=()=>{heroRect=hero.getBoundingClientRect();flightTop=flight.getBoundingClientRect().top+scrollY;flightHeight=flight.offsetHeight;viewHeight=innerHeight;docHeight=document.documentElement.scrollHeight-innerHeight;measureDirty=false;};
 const request=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);};
 const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.target===hero)heroVisible=e.isIntersecting;else flightVisible=e.isIntersecting;});request();},{rootMargin:'80px'});io.observe(hero);io.observe(flight);
 const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('entered');revealObserver.unobserve(e.target);}}),{threshold:.10});
 $$('.display-title,.work-heading h2,.research-note h2,.contact-type').forEach(el=>{el.classList.add('type-reveal');revealObserver.observe(el);});
 const ro=new ResizeObserver(()=>{measureDirty=true;request();});ro.observe($('#app'));
 const updateBank=v=>{bank=Math.max(-35,Math.min(35,Number(v)));manual=true;$('#bank').value=bank;$('#bank-value').textContent=`${bank>0?'+':''}${bank}°`;request();};
 $('#bank').addEventListener('input',e=>updateBank(e.target.value),sig);
 $$('[data-bank]').forEach(b=>b.addEventListener('click',()=>updateBank(bank+Number(b.dataset.bank)),sig));
 $('[data-reset-flight]').addEventListener('click',()=>{manual=false;bank=0;$('#bank').value=0;$('#bank-value').textContent='0°';request();},sig);
 $('[data-wire]').addEventListener('click',e=>{wire=!wire;const b=e.currentTarget;b.setAttribute('aria-pressed',wire);b.textContent=wire?l('VIEW SURFACE −','查看曲面 −'):l('VIEW WIREFRAME +','切换线框 +');request();},sig);
 hero.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.pointerType==='touch')return;heroDrag={x:e.clientX,y:e.clientY};hero.setPointerCapture(e.pointerId);},sig);
 hero.addEventListener('pointerup',e=>{heroDrag=null;if(hero.hasPointerCapture(e.pointerId))hero.releasePointerCapture(e.pointerId);},sig);
 hero.addEventListener('pointercancel',()=>{heroDrag=null;pointer=[0,0];},sig);
 hero.addEventListener('pointermove',e=>{if(!motion||e.pointerType==='touch')return;heroRect=hero.getBoundingClientRect();pointer=[(e.clientX-heroRect.left)/heroRect.width-.5,(e.clientY-heroRect.top)/heroRect.height-.5];if(heroDrag)pointer=pointer.map(v=>Math.max(-1,Math.min(1,v*2)));request();},sig);
 hero.addEventListener('pointerleave',()=>{pointer=[0,0];request();},sig);
 $('.airspace').addEventListener('pointermove',e=>{if(!motion||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();flightPointer=[(e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5];request();},sig);
 $('.airspace').addEventListener('pointerleave',()=>{flightPointer=[0,0];request();},sig);
 function tick(time){frame=0;if(document.hidden)return;if(measureDirty)measure();
  scrollProgress=Math.max(0,Math.min(1,(scrollY-flightTop)/Math.max(1,flightHeight-viewHeight)));
  const stage=Math.min(2,Math.floor(scrollProgress*3));
  if(stage!==lastStage){lastStage=stage;$('#flight-copy').textContent=flightCopy(stage);$('#flight-stage').textContent=String(stage+1).padStart(2,'0');$$('.flight-progress i').forEach((e,i)=>e.classList.toggle('active',i<=stage));}
  const sceneBank=manual?bank:(scrollProgress-.5)*32;
  if(heroVisible)heroScene?.draw({time,pointer,motion,wire,dark:night});
  if(flightVisible)flightScene?.draw({time,pointer:flightPointer,motion,progress:scrollProgress,bank:sceneBank});
  if(flightVisible){$('.sky-horizon').style.transform=`translateY(${motion?(scrollProgress-.5)*42:0}px) rotate(${-sceneBank*.38}deg)`;$('.flight-word').style.transform=`translateX(${motion?(scrollProgress-.5)*80:0}px)`;}
  $('.page-rail i').style.transform=`scaleY(${docHeight>0?scrollY/docHeight:0})`;
  if(motion&&heroVisible){const glyphs=$$('.first-name .name-glyph');glyphs.forEach((g,i)=>{const y=Math.sin(time*.0004+i*.8)*1.5+pointer[1]*(i-2.5)*2;g.style.translate=`0 ${y}px`;});}
  lastDraw=time;
  if(motion&&(heroVisible||flightVisible))request();
 }
 addEventListener('scroll',request,{passive:true,signal:ac.signal});addEventListener('resize',()=>{measureDirty=true;request();},{passive:true,signal:ac.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();},sig);
 // Spatial tabletop: pointer and keyboard can both move each illustrated interest.
 const desk=$('.desk');let z=5;
 $$('.specimen').forEach(card=>{let x=0,y=0,drag=null,moved=false;
  const move=(nx,ny)=>{const r=desk.getBoundingClientRect();x=Math.max(-r.width*.28,Math.min(r.width*.28,nx));y=Math.max(-70,Math.min(70,ny));card.style.setProperty('--dx',`${x}px`);card.style.setProperty('--dy',`${y}px`);};
  card.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.pointerType==='touch')return;drag={px:e.clientX,py:e.clientY,x,y};moved=false;card.style.zIndex=++z;card.classList.add('dragging');card.setPointerCapture(e.pointerId);},sig);
  card.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.px,dy=e.clientY-drag.py;if(Math.abs(dx)+Math.abs(dy)>5)moved=true;move(drag.x+dx,drag.y+dy);},sig);
  card.addEventListener('pointerup',e=>{if(!drag)return;drag=null;card.classList.remove('dragging');if(card.hasPointerCapture(e.pointerId))card.releasePointerCapture(e.pointerId);if(!moved)openNote(card.dataset.object,card);},sig);
  card.addEventListener('pointercancel',()=>{drag=null;card.classList.remove('dragging');},sig);
  card.addEventListener('keydown',e=>{if(e.target!==card)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();card.style.zIndex=++z;move(x+(e.key==='ArrowLeft'?-14:e.key==='ArrowRight'?14:0),y+(e.key==='ArrowUp'?-14:e.key==='ArrowDown'?14:0));}if(e.key==='Enter'||e.key===' '){e.preventDefault();openNote(card.dataset.object,card);}},sig);
  card.addEventListener('click',e=>{if(e.pointerType==='touch'&&!e.target.closest('button'))openNote(card.dataset.object,card);},sig);
  card.resetPosition=()=>{x=0;y=0;move(0,0);};
 });
 $('[data-reset-desk]').addEventListener('click',()=>$$('.specimen').forEach(c=>c.resetPosition()),sig);
 // Preview panel follows the pointer only within the compact work rows.
 const peek=$('#project-peek');
 $$('.project-row').forEach((row,i)=>{const show=()=>{peek.classList.add('shown');peek.dataset.preview=i;peek.firstElementChild.innerHTML=interestArt(['mind','build','sky'][i]);};
  row.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&innerWidth>760)show();},sig);
  row.addEventListener('pointermove',e=>{if(innerWidth<=760)return;const r=$('#work').getBoundingClientRect();peek.style.left=`${Math.min(r.width-280,Math.max(0,e.clientX-r.left-90))}px`;peek.style.top=`${e.clientY-r.top-160}px`;},sig);
  row.addEventListener('pointerleave',()=>peek.classList.remove('shown'),sig);
 });
 measure();request();
 dispose=()=>{ac.abort();io.disconnect();ro.disconnect();revealObserver.disconnect();cancelAnimationFrame(frame);heroScene?.destroy();flightScene?.destroy();};
}
function menu(){
 const d=$('#menu-dialog');menuOpener=document.activeElement;
 d.innerHTML=`<div class="menu-head"><span>RG / INDEX</span><button data-close-menu aria-label="${l('Close menu','关闭目录')}">CLOSE ×</button></div><h2 class="sr-only" id="menu-title">${l('Site navigation','网站目录')}</h2><nav>${[['about','The person','关于我'],['flying','The sky','天空'],['trajectory','The journey','一路走来'],['work','The workshop','作品一角'],['contact','Say hello','打个招呼']].map(([id,en,zh],i)=>`<a href="#${id}" style="--i:${i}"><small>0${i+1}</small><span>${l(en,zh)}</span>${arrow}</a>`).join('')}</nav><div class="menu-bottom"><a href="${resumeURL()}">${l('READ MY CV','阅读履历')} ${arrow}</a>${external(person.github,'GitHub')}${external(person.linkedin,'LinkedIn')}<button data-motion aria-pressed="${motion}">${l('MOTION','动效')} ${motion?'ON':'OFF'}</button></div>`;
 d.showModal();document.body.classList.add('locked');
}
function closeMenu(){const d=$('#menu-dialog');if(d.open)d.close();if(!$('#detail-dialog').open)document.body.classList.remove('locked');menuOpener?.isConnected&&menuOpener.focus({preventScroll:true});}
function modal(content){const d=$('#detail-dialog');d.innerHTML=`<div class="detail-head"><span>RG / FIELD NOTES</span><div><button data-language>${lang==='zh'?'EN':'中文'}</button><button data-close-detail aria-label="${l('Close detail','关闭详情')}">CLOSE ×</button></div></div>${content}`;if(!d.open)d.showModal();document.body.classList.add('locked');d.scrollTop=0;}
function openNote(id,opener){noteId=id;dialogOpener=opener;modal(`<article class="personal-note"><p class="eyebrow">${l('A PERSONAL NOTE','一则个人笔记')}</p><h2 id="detail-title">${safe(t(topics[id]))}</h2><div class="note-illustration">${interestArt(id)}</div><p>${safe(t(notes[id]))}</p>${id==='play'?`<a class="solid-link" href="${gameURL()}">${l('ENTER THE GAME','进入游戏')} ${arrow}</a>`:`<a class="solid-link" href="${resumeURL()}">${l('READ MORE ABOUT ME','阅读完整经历')} ${arrow}</a>`}</article>`);}
function projectDetail(p){noteId=null;modal(`<article class="case-study"><p class="eyebrow">${safe(t(p.type))}</p><h2 id="detail-title">${safe(p.name)}</h2><p class="case-intro">${safe(t(p.summary))}</p><div class="case-meta"><span>${safe(t(p.status))}</span><span>${p.private?l('PRIVATE / DEMO AVAILABLE','私有 / 可演示'):l('PUBLIC SOURCE','公开源码')}</span></div><section><h3>${l('01 / THE QUESTION','01 / 问题')}</h3><p>${safe(t(p.problem))}</p></section><section><h3>${l('02 / WHAT I BUILT','02 / 具体实现')}</h3><ul>${p.build.map(b=>`<li>${safe(t(b))}</li>`).join('')}</ul></section><section><h3>${l('03 / EVIDENCE','03 / 验证与交付')}</h3><p>${safe(t(p.evidence))}</p></section><aside><h3>${l('SCOPE & LIMITS','范围与边界')}</h3><p>${safe(t(p.boundary))}</p></aside><div class="case-links">${p.links.map(([name,url])=>external(url,name)).join('')}</div></article>`);}
function archive(){noteId=null;modal(`<article class="archive"><p class="eyebrow">THE REST OF THE NOTEBOOK</p><h2 id="detail-title">${l('The workshop.','其余作品。')}</h2><label for="project-search">${l('Find a project, topic or technology','搜索项目、主题或技术')}</label><input id="project-search" type="search" autocomplete="off" placeholder="${l('Memory, Python, robotics…','记忆、Python、机器人…')}"><div id="archive-results"></div></article>`);results('');}
function results(query){const q=query.toLowerCase().trim();const list=projects.filter(p=>[p.name,...p.summary,...p.stack].join(' ').toLowerCase().includes(q));$('#archive-results').innerHTML=list.map(p=>`<a href="#project/${p.id}"><strong>${safe(p.name)}</strong><span>${safe(t(p.type))}</span>${arrow}</a>`).join('')||`<p>${l('No matching project.','没有匹配的项目。')}</p>`;}
function route(){let hash;try{hash=decodeURIComponent(location.hash);}catch{hash='';}
 if(hash.startsWith('#project/')){const p=projects.find(p=>p.id===hash.slice(9));if(p)projectDetail(p);else notify(l('That project was not found.','没有找到这个项目。'));}
 else if(hash==='#profile')location.href=resumeURL();
 else if(hash==='#archive')archive();
 else {if($('#detail-dialog').open)closeDetail(false);priorHash=hash||'#top';}
}
function closeDetail(changeURL=true){noteId=null;const d=$('#detail-dialog');d.close();if(!$('#menu-dialog').open)document.body.classList.remove('locked');if(changeURL&&/^#(project\/|archive)/.test(location.hash)){try{history.replaceState(null,'',location.pathname+location.search+priorHash);}catch{location.hash=priorHash;}}dialogOpener?.isConnected&&dialogOpener.focus({preventScroll:true});}
function notify(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600);}
function clickSound(){if(!sound)return;try{context??=new(window.AudioContext||window.webkitAudioContext)();context.resume();const o=context.createOscillator(),g=context.createGain();o.frequency.value=520;g.gain.setValueAtTime(.02,context.currentTime);g.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.065);o.connect(g);g.connect(context.destination);o.start();o.stop(context.currentTime+.075);o.onended=()=>{o.disconnect();g.disconnect();};}catch{sound=false;}}
function changeLanguage(){const y=scrollY,openNoteId=noteId;lang=lang==='en'?'zh':'en';store('rg.language',lang);try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}catch{/* file previews */}closeMenu();render();if(openNoteId)openNote(openNoteId,null);else route();scrollTo({top:y,behavior:'instant'});}
document.addEventListener('click',async e=>{
 const a=e.target.closest('a,button');if(!a)return;clickSound();
 if(a.hasAttribute('data-menu')){menu();return;}
 if(a.hasAttribute('data-close-menu')){closeMenu();return;}
 if(a.hasAttribute('data-close-detail')){closeDetail();return;}
 if(a.hasAttribute('data-language')){changeLanguage();return;}
 if(a.hasAttribute('data-theme')){night=!night;store('rg.night',night?'on':'off');const y=scrollY;render();scrollTo({top:y,behavior:'instant'});return;}
 if(a.hasAttribute('data-motion')){motion=!motion;store('rg.motion',motion?'on':'off');const y=scrollY;closeMenu();render();scrollTo({top:y,behavior:'instant'});return;}
 if(a.hasAttribute('data-sound')){sound=!sound;a.setAttribute('aria-pressed',sound);a.textContent=`${sound?'♫':'♪'} ${l('SOUND','声音')} ${sound?'ON':'OFF'}`;clickSound();return;}
 if(a.hasAttribute('data-note')){openNote(a.dataset.note,a);return;}
 if(a.hasAttribute('data-archive')){dialogOpener=a;archive();return;}
 if(a.hasAttribute('data-copy')){try{await navigator.clipboard.writeText(person.email);notify(l('Email copied. Over to you.','邮箱已复制，换你了。'));}catch{notify(person.email);}return;}
 if(a.closest('#menu-dialog')&&a.hash){closeMenu();}
 if(a.getAttribute('href')?.startsWith('#')){
  e.preventDefault();const hash=a.getAttribute('href');
  if(hash.startsWith('#project/')){dialogOpener=a;const p=projects.find(p=>p.id===hash.slice(9));if(p)projectDetail(p);}
  else {const target=document.getElementById(hash.slice(1));if(target){priorHash=hash;target.scrollIntoView({behavior:motion?'smooth':'instant',block:'start'});}}
  try{history.pushState(null,'',location.pathname+location.search+hash);}catch{/* In-memory and file previews still work without history. */}
 }

});
document.addEventListener('input',e=>{if(e.target.id==='project-search')results(e.target.value);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#detail-dialog').open){e.preventDefault();closeDetail();return;}if($('#menu-dialog').open){e.preventDefault();closeMenu();return;}}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!$('#menu-dialog').open){dialogOpener=document.activeElement;archive();$('#project-search').focus();}}});
$('#menu-dialog').addEventListener('cancel',e=>{e.preventDefault();closeMenu();});$('#detail-dialog').addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
for(const id of ['menu-dialog','detail-dialog'])$('#'+id).addEventListener('click',e=>{const d=e.currentTarget;if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)id==='menu-dialog'?closeMenu():closeDetail();});
addEventListener('hashchange',route);addEventListener('popstate',route);
motionQuery.addEventListener('change',e=>{motion=!e.matches;render();route();});
addEventListener('pagehide',()=>{dispose();context?.close();context=null;});
addEventListener('pageshow',e=>{if(e.persisted){render();route();}});
render();route();
