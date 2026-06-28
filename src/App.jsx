import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './App.css'
import { siteLinks, featuredProjects, tracks, timeline } from './siteData'

const pick = (v, lang) => (typeof v === 'string' ? v : (v[lang] ?? v.en))

const COPY = {
  en: {
    nav: { work: 'Work', tracks: 'Tracks', signals: 'Signals', path: 'Path', beyond: 'Beyond', contact: 'Contact' },
    status: 'Online · open to AI / quant / robotics roles',
    role: 'AI Systems · Quant · Embodied Intelligence',
    intro: 'I build systems that stay alive — agents with memory, runtimes that hold under load, models that meet the physical world. Johns Hopkins MSISAI. Research-grade and builder-grade at once.',
    cta: { github: 'GitHub', email: 'Email', resume: 'Web Game', priv: 'Private' },
    sec: { work: 'Selected Work', tracks: 'Read Me By Track', signals: 'Signals', path: 'Trajectory', beyond: 'Beyond The Terminal', contact: 'Reach Me' },
    flagship: 'Flagship · live',
    open: 'Open repo',
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
    sec: { work: '选录作品', tracks: '按路径阅读', signals: '信号', path: '轨迹', beyond: '终端之外', contact: '联系我' },
    flagship: '旗舰 · 已上线',
    open: '打开仓库',
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
  { v: '$20K', k: { en: 'Ward Infinity grant · 1st', zh: 'Ward Infinity 资助 · 第一' } },
  { v: 'CFA', k: { en: 'Research Challenge', zh: '研究挑战赛' } },
]

const HOBBIES = [
  { code: 'FPV', name: { en: 'FPV Drone', zh: '穿越机' }, note: { en: 'control + reflex', zh: '控制 + 反应' } },
  { code: 'AIR', name: { en: 'Flying', zh: '开飞机' }, note: { en: 'procedure + precision', zh: '流程 + 精度' } },
  { code: 'BOT', name: { en: 'Robotics', zh: '机器人' }, note: { en: 'embodied thinking', zh: '具身思维' } },
  { code: 'PLY', name: { en: 'Gaming', zh: '打游戏' }, note: { en: 'systems intuition', zh: '系统直觉' } },
]

const CSET = 'ABCDEFGHJKMNPQRSTUVWXYZ0123456789/<>{}#$=*'

function useDecode(finalText, active, dur = 900) {
  const [text, setText] = useState(finalText)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!active || reduce) { setText(finalText); return }
    let raf, start
    const step = (now) => {
      if (!start) start = now
      const p = Math.min(1, (now - start) / dur)
      const reveal = Math.floor(p * finalText.length)
      let out = ''
      for (let i = 0; i < finalText.length; i++) {
        out += i < reveal || finalText[i] === ' ' ? finalText[i] : CSET[(Math.random() * CSET.length) | 0]
      }
      setText(out)
      if (p < 1) raf = requestAnimationFrame(step); else setText(finalText)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [finalText, active, dur, reduce])
  return text
}

function Eyebrow({ n, children }) {
  return (
    <div className="eyebrow"><span className="eyebrow-n">{n}</span><span className="eyebrow-t">{children}</span></div>
  )
}

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}

function Hero({ t, lang }) {
  const [booted, setBooted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setBooted(true), 220); return () => clearTimeout(id) }, [])
  const name = useDecode(lang === 'zh' ? '高荣泽' : 'RONGZE GAO', booted, 1000)
  return (
    <section className="hero" id="top">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="status"><span className="pulse" />{t.status}</div>
        <h1 className="name" data-zh={lang === 'zh'}>{name}</h1>
        <p className="role">{t.role}</p>
        <p className="intro">{t.intro}</p>
        <div className="hero-cta">
          <a href={siteLinks.github} target="_blank" rel="noreferrer">{t.cta.github} ↗</a>
          <a href={siteLinks.email}>{t.cta.email}</a>
          <a href="./game.html">{t.cta.resume}</a>
          <a className="priv-link" href="https://private.rongzegao.com">◆ {t.cta.priv}</a>
        </div>
      </motion.div>
    </section>
  )
}

function Work({ t, lang }) {
  return (
    <motion.section className="block" id="work" {...reveal}>
      <Eyebrow n="01">{t.sec.work}</Eyebrow>
      <div className="work-list">
        {featuredProjects.map((p, i) => (
          <a key={p.slug} className={'work-row' + (i === 0 ? ' flagship' : '')} href={p.repo} target="_blank" rel="noreferrer">
            <span className="work-idx">{String(i + 1).padStart(2, '0')}</span>
            <span className="work-main">
              <strong>{p.name}{i === 0 && <em className="flag">{t.flagship}</em>}</strong>
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

function Tracks({ t, lang }) {
  return (
    <motion.section className="block" id="tracks" {...reveal}>
      <Eyebrow n="02">{t.sec.tracks}</Eyebrow>
      <div className="track-grid">
        {tracks.map((tr) => (
          <article key={tr.slug} className="track-card">
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
          <article key={i} className="cred">
            <strong>{c.v}</strong>
            <span>{pick(c.k, lang)}</span>
          </article>
        ))}
      </div>
    </motion.section>
  )
}

function Path({ t, lang }) {
  return (
    <motion.section className="block" id="path" {...reveal}>
      <Eyebrow n="04">{t.sec.path}</Eyebrow>
      <ol className="timeline">
        {[...timeline].reverse().map((e, i) => (
          <li key={i}>
            <span className="tl-period">{e.period}</span>
            <div className="tl-body">
              <strong>{e.title}</strong>
              <span className="tl-place">{e.place}</span>
              <p>{e.summary}</p>
            </div>
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
          <article key={h.code} className="beyond-card">
            <span className="beyond-code">{h.code}</span>
            <strong>{pick(h.name, lang)}</strong>
            <span className="beyond-sub">{pick(h.note, lang)}</span>
          </article>
        ))}
      </div>
    </motion.section>
  )
}

function Contact({ t, lang }) {
  return (
    <motion.section className="block contact" id="contact" {...reveal}>
      <Eyebrow n="06">{t.sec.contact}</Eyebrow>
      <div className="contact-row">
        <a href={siteLinks.email}>{t.cta.email} ↗</a>
        <a href={siteLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={siteLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
      </div>
      <div className="priv-panel">
        <span className="lock">◆</span>
        <div>
          <p>{t.privNote}</p>
          <a href="https://private.rongzegao.com">{t.privCta} →</a>
        </div>
      </div>
    </motion.section>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  const t = COPY[lang]
  const year = new Date().getFullYear()
  return (
    <div className="shell" data-lang={lang}>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="mark" href="#top">RG<span>/</span></a>
        <nav>
          <a href="#work">{t.nav.work}</a>
          <a href="#tracks">{t.nav.tracks}</a>
          <a href="#signals">{t.nav.signals}</a>
          <a href="#path">{t.nav.path}</a>
          <a href="#beyond">{t.nav.beyond}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <button className="lang" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
          {lang === 'en' ? '中文' : 'EN'}
        </button>
      </header>

      <main>
        <Hero t={t} lang={lang} />
        <Work t={t} lang={lang} />
        <Tracks t={t} lang={lang} />
        <Signals t={t} lang={lang} />
        <Path t={t} lang={lang} />
        <Beyond t={t} lang={lang} />
        <Contact t={t} lang={lang} />
      </main>

      <footer className="foot">
        <span>{t.footer}</span>
        <span>© {year} Rongze Gao · rongzegao.com</span>
      </footer>
    </div>
  )
}
