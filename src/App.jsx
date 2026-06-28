import { Component, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import './App.css'
import { ShaderField } from './components/ShaderField'
import { Cursor } from './components/Cursor'
import { siteLinks, featuredProjects, tracks, timeline } from './siteData'

class ErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err, info) { console.error('Portfolio crash:', err, info) }
  render() {
    if (this.state.err) return (
      <div style={{ padding: '48px 6vw', fontFamily: 'monospace', color: '#ECEAE3', background: '#0A0B0E', minHeight: '100vh' }}>
        <p style={{ color: '#F0A93C', letterSpacing: '.1em' }}>RENDER ERROR</p>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#8E8A80', fontSize: 12, marginTop: 12 }}>{String(this.state.err?.stack || this.state.err)}</pre>
      </div>
    )
    return this.props.children
  }
}

const pick = (v, lang) => (typeof v === 'string' ? v : (v[lang] ?? v.en))
const CSET = 'ABCDEFGHJKMNPQRSTUVWXYZ0123456789/<>{}#$=*'

/* imperative scramble onto an element */
function runScramble(el, finalText, dur = 720) {
  let raf, start
  const step = (now) => {
    if (!start) start = now
    const p = Math.min(1, (now - start) / dur)
    const rev = Math.floor(p * finalText.length)
    let o = ''
    for (let i = 0; i < finalText.length; i++) o += (i < rev || finalText[i] === ' ') ? finalText[i] : CSET[(Math.random() * CSET.length) | 0]
    el.textContent = o
    if (p < 1) raf = requestAnimationFrame(step); else el.textContent = finalText
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

/* scramble text when it scrolls into view (once) */
function Scramble({ text, className, as = 'span', dur = 720 }) {
  const ref = useRef(null), done = useRef(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current; if (!el) return
    if (reduce) { el.textContent = text; return }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !done.current) { done.current = true; runScramble(el, text, dur); io.disconnect() } })
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [text, reduce, dur])
  const Tag = as
  return <Tag ref={ref} className={className}>{text}</Tag>
}

/* magnetic pull toward the cursor */
function useMagnetic(strength = 0.28) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el || !matchMedia('(pointer:fine)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px,${(e.clientY - (r.top + r.height / 2)) * strength}px)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return ref
}

function MagLink({ href, children, className, external }) {
  const ref = useMagnetic(0.22)
  return <a ref={ref} href={href} className={className} data-cur {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
}

const COPY = {
  en: {
    nav: { work: 'Work', tracks: 'Tracks', signals: 'Signals', path: 'Path', beyond: 'Beyond', contact: 'Contact' },
    status: 'Online · open to AI / quant / robotics roles',
    role: 'AI Systems · Quant · Embodied Intelligence',
    intro: 'I build systems that stay alive — agents with memory, runtimes that hold under load, models that meet the physical world. Johns Hopkins MSISAI. Research-grade and builder-grade at once.',
    cta: { github: 'GitHub', email: 'Email', resume: 'Web Game', priv: 'Private' },
    scroll: 'Scroll',
    sec: { work: 'Selected Work', tracks: 'Read Me By Track', signals: 'Signals', path: 'Trajectory', beyond: 'Beyond The Terminal', contact: 'Reach Me' },
    flagship: 'Flagship · live', open: 'Open repo',
    beyondNote: 'The instincts behind the systems — control, rhythm, spatial judgement, procedure.',
    privNote: 'A private space — Eva (a living, self-evolving AI) and personal services live behind an email gate.',
    privCta: 'Enter the private hub',
    footer: 'Built + deployed by its owner. Bilingual.',
  },
  zh: {
    nav: { work: '作品', tracks: '路径', signals: '信号', path: '轨迹', beyond: '之外', contact: '联系' },
    status: '在线 · 开放 AI / 量化 / 机器人方向机会',
    role: 'AI 系统 · 量化 · 具身智能',
    intro: '我做"活着"的系统 —— 有记忆的智能体、扛得住负载的运行时、能触及物理世界的模型。约翰霍普金斯 MSISAI。研究级与工程级,二者兼具。',
    cta: { github: 'GitHub', email: '邮箱', resume: '网页游戏', priv: '私域' },
    scroll: '向下',
    sec: { work: '选录作品', tracks: '按路径阅读', signals: '信号', path: '轨迹', beyond: '终端之外', contact: '联系我' },
    flagship: '旗舰 · 已上线', open: '打开仓库',
    beyondNote: '系统背后的直觉 —— 控制、节奏、空间判断、流程。',
    privNote: '一处私域 —— Eva(一个活着的、自进化的 AI)与个人服务,藏在邮箱门之后。',
    privCta: '进入私域',
    footer: '由本人构建并部署。中英双语。',
  },
}
const CREDS = [
  { v: 'JHU', k: { en: 'MSISAI · Johns Hopkins', zh: 'MSISAI · 约翰霍普金斯' } },
  { v: 'CQF', k: { en: 'with Distinction', zh: '优秀等级' } },
  { v: 'Gold', k: { en: 'WorldQuant Brain', zh: 'WorldQuant 金级' } },
  { v: 'Bronze', k: { en: 'Kaggle · Optiver', zh: 'Kaggle · Optiver 铜牌' } },
  { v: '$20K', k: { en: 'Ward Infinity · 1st', zh: 'Ward Infinity 资助 · 第一' } },
  { v: 'CFA', k: { en: 'Research Challenge', zh: '研究挑战赛' } },
]
const HOBBIES = [
  { code: 'FPV', name: { en: 'FPV Drone', zh: '穿越机' }, note: { en: 'control + reflex', zh: '控制 + 反应' } },
  { code: 'AIR', name: { en: 'Flying', zh: '开飞机' }, note: { en: 'procedure + precision', zh: '流程 + 精度' } },
  { code: 'BOT', name: { en: 'Robotics', zh: '机器人' }, note: { en: 'embodied thinking', zh: '具身思维' } },
  { code: 'PLY', name: { en: 'Gaming', zh: '打游戏' }, note: { en: 'systems intuition', zh: '系统直觉' } },
]

const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

function Eyebrow({ n, children }) {
  return <div className="eyebrow"><span className="eyebrow-n">{n}</span><Scramble className="eyebrow-t" text={children} /></div>
}

function Hero({ t, lang }) {
  const nameRef = useRef(null)
  const heroRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const finalName = lang === 'zh' ? '高荣泽' : 'RONGZE GAO'
  useEffect(() => {
    const el = nameRef.current; if (!el) return
    if (reduce) { el.textContent = finalName; return }
    const id = setTimeout(() => runScramble(el, finalName, 1050), 240)
    return () => clearTimeout(id)
  }, [finalName, reduce])
  return (
    <section className="hero" id="top" ref={heroRef}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="status"><span className="pulse" />{t.status}</div>
        <motion.h1 className="name" data-zh={lang === 'zh'} ref={nameRef} style={{ y: nameY }}>{finalName}</motion.h1>
        <p className="role">{t.role}</p>
        <p className="intro">{t.intro}</p>
        <div className="hero-cta">
          <MagLink href={siteLinks.github} external>{t.cta.github} ↗</MagLink>
          <MagLink href={siteLinks.email}>{t.cta.email}</MagLink>
          <MagLink href="./game.html">{t.cta.resume}</MagLink>
          <MagLink href="https://private.rongzegao.com" className="priv-link">◆ {t.cta.priv}</MagLink>
        </div>
      </motion.div>
      <div className="scroll-hint"><span>{t.scroll}</span><i /></div>
    </section>
  )
}

function Work({ t }) {
  return (
    <motion.section className="block" id="work" {...reveal}>
      <Eyebrow n="01">{t.sec.work}</Eyebrow>
      <div className="work-list">
        {featuredProjects.map((p, i) => (
          <a key={p.slug} className={'work-row' + (i === 0 ? ' flagship' : '')} href={p.repo} target="_blank" rel="noreferrer" data-cur>
            <span className="work-idx">{String(i + 1).padStart(2, '0')}</span>
            <span className="work-main">
              <strong><Scramble text={p.name} dur={520} />{i === 0 && <em className="flag">{t.flagship}</em>}</strong>
              <span className="work-one">{p.oneLiner}</span>
              <span className="work-stack">{p.stack.join(' · ')}</span>
            </span>
            <span className="work-type">{p.type}</span>
            <span className="work-go">{t.open} ↗</span>
          </a>
        ))}
      </div>
    </motion.section>
  )
}

function Tracks({ t }) {
  return (
    <motion.section className="block" id="tracks" {...reveal}>
      <Eyebrow n="02">{t.sec.tracks}</Eyebrow>
      <div className="track-grid">
        {tracks.map((tr) => (
          <article key={tr.slug} className="track-card" data-cur>
            <span className="track-kicker">{tr.kicker}</span>
            <h3>{tr.title}</h3>
            <p>{tr.summary}</p>
            <div className="track-roles">{tr.roles.map((r) => <span key={r}>{r}</span>)}</div>
          </article>
        ))}
      </div>
    </motion.section>
  )
}

function Signals({ t, lang }) {
  return (
    <motion.section className="block" id="signals" {...reveal}>
      <Eyebrow n="03">{t.sec.signals}</Eyebrow>
      <div className="cred-grid">
        {CREDS.map((c, i) => (
          <article key={i} className="cred"><strong>{c.v}</strong><span>{pick(c.k, lang)}</span></article>
        ))}
      </div>
    </motion.section>
  )
}

function Path({ t }) {
  return (
    <motion.section className="block" id="path" {...reveal}>
      <Eyebrow n="04">{t.sec.path}</Eyebrow>
      <ol className="timeline">
        {[...timeline].reverse().map((e, i) => (
          <li key={i}>
            <span className="tl-period">{e.period}</span>
            <div className="tl-body"><strong>{e.title}</strong><span className="tl-place">{e.place}</span><p>{e.summary}</p></div>
          </li>
        ))}
      </ol>
    </motion.section>
  )
}

function Beyond({ t, lang }) {
  return (
    <motion.section className="block" id="beyond" {...reveal}>
      <Eyebrow n="05">{t.sec.beyond}</Eyebrow>
      <p className="beyond-note">{t.beyondNote}</p>
      <div className="beyond-grid">
        {HOBBIES.map((h) => (
          <article key={h.code} className="beyond-card" data-cur>
            <span className="beyond-code">{h.code}</span><strong>{pick(h.name, lang)}</strong><span className="beyond-sub">{pick(h.note, lang)}</span>
          </article>
        ))}
      </div>
    </motion.section>
  )
}

function Contact({ t }) {
  return (
    <motion.section className="block contact" id="contact" {...reveal}>
      <Eyebrow n="06">{t.sec.contact}</Eyebrow>
      <div className="contact-row">
        <MagLink href={siteLinks.email}>{t.cta.email} ↗</MagLink>
        <MagLink href={siteLinks.github} external>GitHub ↗</MagLink>
        <MagLink href={siteLinks.linkedin} external>LinkedIn ↗</MagLink>
      </div>
      <div className="priv-panel">
        <span className="lock">◆</span>
        <div><p>{t.privNote}</p><a href="https://private.rongzegao.com" data-cur>{t.privCta} →</a></div>
      </div>
    </motion.section>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  const t = COPY[lang]
  const year = new Date().getFullYear()

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    let lenis, raf
    try {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true })
      const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    } catch (e) { console.warn('Lenis disabled:', e) }
    return () => { cancelAnimationFrame(raf); try { lenis && lenis.destroy() } catch { /* noop */ } }
  }, [])

  return (
    <ErrorBoundary>
    <div className="shell" data-lang={lang}>
      <ShaderField />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="mark" href="#top" data-cur>RG<span>/</span></a>
        <nav>
          <a href="#work">{t.nav.work}</a><a href="#tracks">{t.nav.tracks}</a><a href="#signals">{t.nav.signals}</a>
          <a href="#path">{t.nav.path}</a><a href="#beyond">{t.nav.beyond}</a><a href="#contact">{t.nav.contact}</a>
        </nav>
        <button className="lang" data-cur onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>{lang === 'en' ? '中文' : 'EN'}</button>
      </header>
      <main>
        <Hero t={t} lang={lang} />
        <Work t={t} />
        <Tracks t={t} />
        <Signals t={t} lang={lang} />
        <Path t={t} />
        <Beyond t={t} lang={lang} />
        <Contact t={t} />
      </main>
      <footer className="foot"><span>{t.footer}</span><span>© {year} Rongze Gao · rongzegao.com</span></footer>
    </div>
    </ErrorBoundary>
  )
}
