/** Personal-first composition. Keep existing dialogs, search, motion and game.
 * Recompose after the existing synchronous locale/motion rerender; no polling.
 */
import './main.js';
import {person, projects} from './content.js';
import './personal.css';
const $ = selector => document.querySelector(selector);
const root = import.meta.env?.BASE_URL || '/';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
let sectionObserver;
function enhance() {
  const app = $('#app');
  if (!app || app.dataset.composition === 'personal') return;
  app.dataset.composition = 'personal';
  const zh = document.documentElement.lang.startsWith('zh');
  const text = (en, cn) => zh ? cn : en;
  const pair = value => Array.isArray(value) ? value[zh ? 1 : 0] : value;
  const cv = `${root}resume.html?lang=${zh ? 'zh' : 'en'}`;
  document.title = text('Rongze Gao — Research, Flight & Curiosity', '高荣泽 Rongze Gao — 研究、飞行与好奇心');
  $('.name-label').innerHTML = `<span class="live-dot"></span>${text('RESEARCHER. STUDENT PILOT. QUANT. EXPLORER.', '研究者 · 飞行员学员 · 量化背景 · 探索者')}`;
  $('.hero-top .eyebrow').innerHTML = 'PERSONAL FIELD NOTES <span class="dash"></span> VOL. 2026';
  $('.coordinates').textContent = 'LIFE / RESEARCH / FLIGHT / PLAY';
  $('.hero-statement').innerHTML = text('A life led by<br><em>curiosity.</em>', '认真探索，<br><em>也尽兴生活。</em>');
  $('.hero-intro').textContent = text('I’m Rongze. Researcher at Johns Hopkins, student pilot, and a builder with quantitative roots. This is where my work, interests and the paths between them come together.', '我是高荣泽。JHU 研究者、飞行员学员，也是有量化背景、喜欢动手探索的人。这里记录我的工作、兴趣，以及它们之间不断延伸的路径。');
  $('.hero-actions').innerHTML = `<a class="button primary" href="#about">${text('Meet Rongze', '认识高荣泽')} ${arrow}</a><a class="button quiet" href="${cv}">${text('Read my CV', '阅读完整履历')} ${arrow}</a><a class="button quiet" href="${root}game.html">${text('Play', '游乐场')} ${arrow}</a>`;
  $('.label-top span').textContent = '01 / CURIOSITY';
  $('.label-top small').textContent = text('Across disciplines', '跨越学科');
  $('.label-bottom span').textContent = '02 / EXPLORATION';
  $('.label-bottom small').textContent = text('From the terminal to the sky', '从终端到天空');
  $('.hero-affiliations').innerHTML = '<span>JOHNS HOPKINS</span><i>·</i><span>CDHAI</span><i>·</i><span>FLIGHT</span><i>·</i><span>CQF</span>';
  $('.scroll-cue').href = '#about';
  $('#navigation').innerHTML = [
    ['about',text('About','关于我')],['flying',text('Flight','飞行')],['trajectory',text('Journey','经历')],
    ['research',text('Research','研究')],['work',text('Workshop','作品一角')],['contact',text('Contact','联系')]
  ].map(([id,label])=>`<a href="#${id}">${label}</a>`).join('');
  $('.marquee > div').innerHTML = Array(2).fill(`<span>CURIOSITY</span><i>✳</i><span class="outline-word">FLIGHT</span><i>✳</i><span>RESEARCH</span><i>✳</i><span class="outline-word">PLAY</span><i>✳</i>`).join('');
  const about = document.createElement('section');
  about.id='about'; about.className='section personal-about';
  about.innerHTML=`<div class="section-heading"><div><p class="eyebrow"><span>01</span> ${text('THE PERSON','关于这个人')}</p><h2>${text('Hello. I’m <em>Rongze.</em>','你好，我是<em>高荣泽。</em>')}</h2></div><p class="section-note">${text('A few different interests.<br>One very curious person.','一些看似不同的兴趣，<br>一个始终保持好奇的人。')}</p></div><div class="about-layout"><p class="about-lead">${text('My story starts with finance, but it doesn’t stay there. It continues through research, engineering, flight lessons and the worlds I like to explore.', '我的故事从金融开始，却没有停在那里。它延伸到研究、工程、飞行训练，以及我喜欢探索的各种世界。')}</p><div class="about-detail"><p>${text('I completed my M.S. in Information Systems & Artificial Intelligence at Johns Hopkins in August 2026. At CDHAI, I work with Professor Gordon Gao on healthcare AI and intelligent applications. I also support U.S.-market robotics projects at Tuskrobots through internship and part-time work.', '2026 年 8 月，我完成了约翰斯·霍普金斯大学信息系统与人工智能硕士学业。在 CDHAI 跟随 Gordon Gao 教授参与医疗 AI 和智能应用研究，也以实习、兼职形式支持塔斯克机器人美国市场项目。')}</p><p>${text('Outside work, I make time for flying, FPV, robotics and games. I like the discipline of understanding how things work—and the freedom of trying something simply because it interests me.', '工作之外，我喜欢飞行、FPV、机器人和游戏。我享受弄懂事物如何运作的严谨，也珍惜单纯因为感兴趣就去尝试的自由。')}</p><a class="text-link" href="${cv}">${text('My complete CV', '我的完整履历')} ${arrow}</a></div></div><div class="life-threads"><a href="#research"><small>01 / RESEARCH</small><strong>${text('Think deeply.','认真思考。')}</strong><span>${text('Healthcare AI · Johns Hopkins','医疗 AI · Johns Hopkins')}</span></a><a href="#flying"><small>02 / AVIATION</small><strong>${text('Look further.','看向更远。')}</strong><span>${text('Student pilot · FAA Part 141','飞行员学员 · FAA Part 141')}</span></a><a href="#trajectory"><small>03 / QUANTITATIVE ROOTS</small><strong>${text('Question the numbers.','审视每个数字。')}</strong><span>${text('Finance · CQF · Research','金融 · CQF · 研究')}</span></a><a href="#beyond"><small>04 / PERSONAL INTERESTS</small><strong>${text('Keep a sense of play.','保留一点玩心。')}</strong><span>FPV · Robotics · Gaming</span></a></div>`;
  const flying=document.createElement('section'); flying.id='flying'; flying.className='section flying-section';
  flying.innerHTML=`<div class="section-heading"><div><p class="eyebrow"><span>02</span> ${text('FROM THE TERMINAL TO THE SKY','从终端到天空')}</p><h2>${text('Another kind<br>of <em>freedom.</em>','在天空中，<br>寻找另一种<em>自由。</em>')}</h2></div><p class="section-note">${text('Flying is part of who I am,<br>not a footnote to my work.','飞行是我的一部分，<br>不是工作经历后的一句附注。')}</p></div><div class="flight-spread"><div class="aviation-visual" aria-hidden="true"><div class="horizon-sun"></div><div class="horizon-grid"></div><span class="flight-stamp">RG / FLIGHT NOTES</span><svg viewBox="0 0 650 400"><g fill="none" stroke="#7caebf" opacity=".25"><circle cx="335" cy="205" r="135"/><circle cx="335" cy="205" r="87"/><path d="M30 205h590M335 38v327" stroke-dasharray="3 9"/></g><path d="M28 329C155 331 110 74 299 122S448 339 619 117" fill="none" stroke="#e6bd86" stroke-width="2" stroke-dasharray="4 8"/><g transform="translate(407 223) rotate(-29)" fill="#e9dfcc"><path d="m0-53 9 40 55 24v10L10 8 6 40l16 10v7L0 49l-22 8v-7l16-10-4-32-54 13V11l55-24Z"/></g><text x="43" y="367" font-family="monospace" font-size="10" letter-spacing="3" fill="#a7bdc9">PROCEDURE / PRECISION / PERSPECTIVE</text></svg><span class="flight-illustration-label">FLIGHT-PATH STUDY</span></div><div class="flying-copy"><p class="eyebrow">WIFA / FAA PART 141</p><h3>${text('Student pilot.<br>Always learning.','飞行员学员，<br>也始终在学习。')}</h3><p>${text('I train at Washington International Flight Academy through the FAA Part 141 private-pilot course. Flight brings procedures, navigation, spatial judgment and responsibility into the same cockpit.', '我在 Washington International Flight Academy 接受 FAA Part 141 私人飞行员课程训练。程序、导航、空间判断与责任，在驾驶舱里相遇。')}</p><p>${text('It is a different setting from the lab or a terminal—and just as much a part of my life. FPV and interactive flight worlds keep that curiosity alive on the ground, too.', '这与实验室、终端是很不一样的场景，却同样属于我的生活。在地面上，FPV 和交互式飞行世界也延续着这份好奇。')}</p><div class="flight-marks"><span>FLYING</span><span>FPV</span><span>EXPLORATION</span></div></div></div>`;
  const main=$('main#main');
  const hero=$('#top'), journey=$('#trajectory'), research=$('#research'), beyond=$('#beyond'), work=$('#work'), contact=$('#contact');
  main.replaceChildren(hero, $('.marquee'), about, flying, journey, research, beyond, work, contact);
  journey.querySelector('.section-heading h2').innerHTML=text('The path<br><em>so far.</em>','一路走来，<br><em>还在继续。</em>');
  journey.querySelector('.eyebrow > span').textContent='03';
  journey.querySelector('.trajectory-aside .text-link').href=cv;
  research.querySelector('.eyebrow > span').textContent='04';
  beyond.querySelector('.eyebrow > span').textContent='05';
  beyond.querySelector('.flight-card').innerHTML=`<div class="interest-orbit" aria-hidden="true"><span>✳</span></div><div><p class="eyebrow">FPV / ROBOTICS / CURIOSITY</p><h3>${text('The joy of<br>making things move.','让事物动起来，<br>本身就很有趣。')}</h3><p>${text('Robotics tinkering and FPV connect software with the physical world. Sometimes the most interesting part is exploring what happens next.','折腾机器人和 FPV，把软件连接到真实世界。有时候，最有趣的就是探索下一步会发生什么。')}</p></div>`;
  work.querySelector('.section-heading').innerHTML=`<div><p class="eyebrow"><span>06</span> ${text('A SMALL CORNER OF MY WORKSHOP','我的作品，只占这里的一角')}</p><h2>${text('Things I’ve <em>built.</em>','我做过的一些<em>东西。</em>')}</h2></div><p class="section-note">${text('Three examples. Details are here when you need them; the rest of the story is above.','选三个例子放在这里。感兴趣时再打开看细节，上面还有更完整的我。')}</p>`;
  const stack=work.querySelector('.featured-stack');
  stack.className='compact-projects';
  stack.innerHTML=projects.filter(p=>p.featured).map(p=>`<a class="mini-project" href="#project/${p.id}"><small>${esc(p.number)} / ${esc(pair(p.type))}</small><h3>${esc(p.name)} ${arrow}</h3><p>${esc(pair(p.summary))}</p><span>${p.private?text('Private · demonstration available','私有 · 可演示'):text('Public repository','公开仓库')}</span></a>`).join('');
  const archive=document.createElement('details');archive.id='project-archive';archive.className='project-archive';
  archive.innerHTML=`<summary>${text('Open the complete project index','展开完整项目索引')} <span>${projects.length} / +</span></summary>`;
  for(const selector of ['.filter-bar','#project-list','.archive-note'])archive.append(work.querySelector(selector));
  work.querySelector('.archive-heading').remove(); work.append(archive);
  $('.contact-title').innerHTML=text('Say hello.<br><em>Let’s compare notes.</em>','来打个招呼，<br><em>交换一些有趣的想法。</em>')+arrow;
  $('.contact-kicker .eyebrow').textContent='07 / KEEP IN TOUCH';
  document.querySelectorAll('a[href="/game.html"]').forEach(a=>a.href=`${root}game.html`);
  const release=document.createElement('span');release.className='release-marker';release.textContent='PERSONAL / 2026-09-12';$('.footer').append(release);
  sectionObserver?.disconnect();
  sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('#navigation a').forEach(a=>a.setAttribute('aria-current',a.hash===`#${e.target.id}`?'location':'false'));}),{rootMargin:'-15% 0px -65% 0px'});
  [about,flying].forEach(s=>sectionObserver.observe(s));
}
enhance();
document.addEventListener('click',e=>{if(e.target.closest('[data-language],[data-motion]'))enhance();});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',enhance);
addEventListener('pageshow',e=>{if(e.persisted)enhance();});
addEventListener('pagehide',()=>sectionObserver?.disconnect());
