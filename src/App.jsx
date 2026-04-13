import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { SignalField } from './components/SignalField'
import { WaterSurface } from './components/WaterSurface'
import { siteLinks } from './siteData'

const MotionSection = motion.section
const MotionDiv = motion.div

const pick = (value, lang) => (typeof value === 'string' ? value : (value[lang] ?? value.en))

const TEXT = {
  en: {
    nav: {
      about: 'About',
      map: 'Map',
      works: 'Works',
      hobbies: 'Hobbies',
      arcade: 'Arcade',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Personal Signal Hub',
      title: 'Rongze Gao',
      subtitle: 'AI Systems · Quant Tools · Embodied Experiments',
      summary: 'Less text, faster proof. Follow links, explore the graph, open the builds.',
      primary: 'Open GitHub',
      secondary: 'View LinkedIn',
      tertiary: 'Play Web Game',
    },
    stats: [
      { label: 'Current', value: 'JHU MSISAI' },
      { label: 'Focus', value: 'AI + Systems' },
      { label: 'Mode', value: 'Research x Builder' },
    ],
    map: {
      eyebrow: 'Relationship Graph',
      title: 'How work, interests, and projects connect',
      helper: 'Hover nodes to inspect connections.',
    },
    links: {
      sectionTitle: 'High-signal links',
      groups: [
        {
          title: 'Profiles',
          items: [
            { label: 'GitHub', href: siteLinks.github },
            { label: 'LinkedIn', href: siteLinks.linkedin },
            { label: 'Email', href: siteLinks.email },
          ],
        },
        {
          title: 'Featured Builds',
          items: [
            { label: 'ANIMA', href: 'https://github.com/zeron-G/anima' },
            { label: 'Synapse', href: 'https://github.com/zeron-G/Synapse' },
            { label: 'FinRAG Agent', href: 'https://github.com/zeron-G/FinRAG-Agent' },
          ],
        },
        {
          title: 'Live Pages',
          items: [
            { label: 'Portfolio', href: 'https://rongzegao.com' },
            { label: 'Arcade Game', href: './game.html' },
            { label: 'GitHub Repo', href: 'https://github.com/zeron-G/rongze-gao-portfolio' },
          ],
        },
      ],
    },
    works: {
      eyebrow: 'Web + Projects',
      title: 'Compact cards, direct links',
      action: 'Open',
    },
    hobbies: {
      eyebrow: 'Interests',
      title: 'Outside the terminal',
      scale: 'engagement',
    },
    arcade: {
      eyebrow: 'Extra Feature',
      title: 'Nebula Coil',
      summary:
        'A standalone 3D-style snake page with local leaderboard. Built as a playful side mission inside the portfolio.',
      cta: 'Launch game page',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Reach me quickly',
      summary: 'Best response channels are email and GitHub.',
      email: 'Send email',
      github: 'Open GitHub',
      linkedin: 'Open LinkedIn',
    },
    graphDescriptions: {
      core: 'Center node: ties research, engineering, and personal exploration.',
      ai: 'Agent frameworks and applied AI systems.',
      quant: 'Finance, analysis pipelines, and data-driven decisions.',
      embodied: 'Robotics, deployment, and real-world constraints.',
      fpv: 'FPV drone practice for control, rhythm, and spatial judgment.',
      gaming: 'Game design/gameplay as a systems-thinking playground.',
      flight: 'Aviation training mindset: procedure, safety, and precision.',
      web: 'Portfolio and interactive web experiences.',
    },
    footer: 'Designed as a fast-scan interface with multilingual support.',
  },
  'zh-CN': {
    nav: {
      about: '主页',
      map: '关系图',
      works: '作品',
      hobbies: '爱好',
      arcade: '游戏',
      contact: '联系',
    },
    hero: {
      eyebrow: '个人信号中枢',
      title: '高荣泽',
      subtitle: 'AI 系统 · 量化工具 · 具身实验',
      summary: '减少文字，提升信号密度。用链接、关系图和作品快速建立认知。',
      primary: '打开 GitHub',
      secondary: '查看领英',
      tertiary: '打开网页游戏',
    },
    stats: [
      { label: '当前', value: 'JHU MSISAI' },
      { label: '方向', value: 'AI + 系统' },
      { label: '风格', value: '研究 x 构建' },
    ],
    map: {
      eyebrow: '关系图谱',
      title: '工作、兴趣与项目的连接方式',
      helper: '悬停节点可查看关联。',
    },
    links: {
      sectionTitle: '高价值链接',
      groups: [
        {
          title: '主页身份',
          items: [
            { label: 'GitHub', href: siteLinks.github },
            { label: '领英', href: siteLinks.linkedin },
            { label: '邮箱', href: siteLinks.email },
          ],
        },
        {
          title: '代表项目',
          items: [
            { label: 'ANIMA', href: 'https://github.com/zeron-G/anima' },
            { label: 'Synapse', href: 'https://github.com/zeron-G/Synapse' },
            { label: 'FinRAG Agent', href: 'https://github.com/zeron-G/FinRAG-Agent' },
          ],
        },
        {
          title: '在线页面',
          items: [
            { label: '个人网站', href: 'https://rongzegao.com' },
            { label: '网页游戏', href: './game.html' },
            { label: '网站仓库', href: 'https://github.com/zeron-G/rongze-gao-portfolio' },
          ],
        },
      ],
    },
    works: {
      eyebrow: '个人网站与作品',
      title: '少文字，多入口',
      action: '访问',
    },
    hobbies: {
      eyebrow: '个人爱好',
      title: '代码之外',
      scale: '投入度',
    },
    arcade: {
      eyebrow: '其他功能',
      title: 'Nebula Coil',
      summary: '独立网页小游戏，3D 风格贪吃蛇，内置本地排行榜，作为网站内的互动模块。',
      cta: '进入游戏页面',
    },
    contact: {
      eyebrow: '联系方式',
      title: '快速联系',
      summary: '最快的沟通方式是邮箱和 GitHub。',
      email: '发送邮件',
      github: '打开 GitHub',
      linkedin: '打开领英',
    },
    graphDescriptions: {
      core: '中心节点：连接研究、工程和个人探索。',
      ai: '智能体框架与应用型 AI 系统。',
      quant: '金融分析管线与数据驱动决策。',
      embodied: '机器人部署与真实环境约束。',
      fpv: '穿越机训练，强调控制、节奏与空间判断。',
      gaming: '游戏体验与设计，作为系统思维实验场。',
      flight: '飞行训练思维：流程、安全与精度。',
      web: '个人网站与交互式网页体验。',
    },
    footer: '该版本强调快速浏览、可视化和中英切换。',
  },
}

const WORK_ITEMS = [
  {
    id: 'portfolio',
    title: { en: 'Personal Website', 'zh-CN': '个人网站' },
    tag: { en: 'Web Presence', 'zh-CN': '网站呈现' },
    href: 'https://rongzegao.com',
    accent: 'cyan',
  },
  {
    id: 'anima',
    title: 'ANIMA',
    tag: { en: 'Agent Framework', 'zh-CN': '智能体框架' },
    href: 'https://github.com/zeron-G/anima',
    accent: 'blue',
  },
  {
    id: 'synapse',
    title: 'Synapse',
    tag: { en: 'Runtime Bridge', 'zh-CN': '运行时桥接' },
    href: 'https://github.com/zeron-G/Synapse',
    accent: 'teal',
  },
  {
    id: 'finrag',
    title: 'FinRAG Agent',
    tag: { en: 'Finance AI', 'zh-CN': '金融 AI' },
    href: 'https://github.com/zeron-G/FinRAG-Agent',
    accent: 'gold',
  },
  {
    id: 'github',
    title: 'GitHub Profile',
    tag: { en: 'Open Source', 'zh-CN': '开源档案' },
    href: siteLinks.github,
    accent: 'slate',
  },
  {
    id: 'arcade',
    title: 'Nebula Coil',
    tag: { en: 'Web Game', 'zh-CN': '网页游戏' },
    href: './game.html',
    accent: 'orange',
  },
]

const HOBBIES = [
  {
    id: 'fpv',
    name: { en: 'FPV Drone', 'zh-CN': '穿越机' },
    note: { en: 'Control and reflex training', 'zh-CN': '控制力与反应训练' },
    level: 86,
  },
  {
    id: 'robotics',
    name: { en: 'Robotics', 'zh-CN': '机器人' },
    note: { en: 'Embodied thinking and deployment', 'zh-CN': '具身智能与部署思维' },
    level: 78,
  },
  {
    id: 'gaming',
    name: { en: 'Gaming', 'zh-CN': '打游戏' },
    note: { en: 'System balance and interaction intuition', 'zh-CN': '系统平衡与交互直觉' },
    level: 82,
  },
  {
    id: 'flight',
    name: { en: 'Flying', 'zh-CN': '开飞机' },
    note: { en: 'Procedure discipline and spatial judgment', 'zh-CN': '流程纪律与空间判断' },
    level: 74,
  },
]

const GRAPH_NODES = [
  { id: 'core', x: 50, y: 50, size: 8, label: { en: 'Rongze', 'zh-CN': '荣泽' }, tone: 'core' },
  { id: 'ai', x: 22, y: 24, size: 5.4, label: { en: 'AI', 'zh-CN': 'AI' }, tone: 'cyan' },
  { id: 'quant', x: 76, y: 22, size: 5.2, label: { en: 'Quant', 'zh-CN': '量化' }, tone: 'blue' },
  { id: 'embodied', x: 17, y: 72, size: 5.1, label: { en: 'Robotics', 'zh-CN': '机器人' }, tone: 'teal' },
  { id: 'web', x: 81, y: 67, size: 5.2, label: { en: 'Web', 'zh-CN': '网页' }, tone: 'cyan' },
  { id: 'fpv', x: 39, y: 14, size: 4.4, label: { en: 'FPV', 'zh-CN': '穿越机' }, tone: 'orange' },
  { id: 'gaming', x: 64, y: 84, size: 4.5, label: { en: 'Gaming', 'zh-CN': '游戏' }, tone: 'orange' },
  { id: 'flight', x: 89, y: 48, size: 4.4, label: { en: 'Flight', 'zh-CN': '飞行' }, tone: 'gold' },
]

const GRAPH_EDGES = [
  ['core', 'ai'],
  ['core', 'quant'],
  ['core', 'embodied'],
  ['core', 'web'],
  ['core', 'fpv'],
  ['core', 'gaming'],
  ['core', 'flight'],
  ['ai', 'quant'],
  ['ai', 'web'],
  ['embodied', 'fpv'],
  ['web', 'gaming'],
]

function LanguageSwitch({ lang, onChange }) {
  return (
    <div className="language-switch" role="tablist" aria-label="Language selector">
      <button
        type="button"
        role="tab"
        aria-selected={lang === 'en'}
        className={lang === 'en' ? 'is-active' : ''}
        onClick={() => onChange('en')}
      >
        EN
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={lang === 'zh-CN'}
        className={lang === 'zh-CN' ? 'is-active' : ''}
        onClick={() => onChange('zh-CN')}
      >
        简体中文
      </button>
    </div>
  )
}

function RelationshipGraph({ lang, descriptions, helper }) {
  const [activeId, setActiveId] = useState('core')

  const nodeMap = useMemo(
    () => Object.fromEntries(GRAPH_NODES.map((node) => [node.id, node])),
    [],
  )

  const activeNode = nodeMap[activeId]

  return (
    <div className="graph-shell">
      <svg viewBox="0 0 100 100" className="relation-graph" aria-label="Relationship graph">
        {GRAPH_EDGES.map(([from, to]) => {
          const left = nodeMap[from]
          const right = nodeMap[to]
          const isActive = activeId === from || activeId === to

          return (
            <line
              key={`${from}-${to}`}
              x1={left.x}
              y1={left.y}
              x2={right.x}
              y2={right.y}
              className={isActive ? 'graph-edge is-active' : 'graph-edge'}
            />
          )
        })}

        {GRAPH_NODES.map((node) => (
          <g
            key={node.id}
            className={activeId === node.id ? 'graph-node is-active' : 'graph-node'}
            onPointerEnter={() => setActiveId(node.id)}
            onFocus={() => setActiveId(node.id)}
            tabIndex={0}
          >
            <circle cx={node.x} cy={node.y} r={node.size} data-tone={node.tone} />
            <text x={node.x} y={node.y + node.size + 4.2}>
              {pick(node.label, lang)}
            </text>
          </g>
        ))}
      </svg>

      <div className="graph-caption">
        <strong>{pick(activeNode.label, lang)}</strong>
        <p>{descriptions[activeNode.id]}</p>
        <small>{helper}</small>
      </div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState('en')
  const t = TEXT[lang]
  const year = new Date().getFullYear()

  return (
    <div className="app-shell">
      <AuroraBackdrop />
      <WaterSurface />

      <header className="site-header">
        <a className="site-mark" href="#about">
          Rongze Gao
        </a>

        <nav>
          <a href="#about">{t.nav.about}</a>
          <a href="#map">{t.nav.map}</a>
          <a href="#works">{t.nav.works}</a>
          <a href="#hobbies">{t.nav.hobbies}</a>
          <a href="#arcade">{t.nav.arcade}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>

        <LanguageSwitch lang={lang} onChange={setLang} />
      </header>

      <main>
        <MotionSection
          className="hero-section"
          id="about"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="hero-subtitle">{t.hero.subtitle}</p>
            <p className="hero-summary">{t.hero.summary}</p>

            <div className="hero-actions">
              <a href={siteLinks.github} target="_blank" rel="noreferrer">
                {t.hero.primary}
              </a>
              <a href={siteLinks.linkedin} target="_blank" rel="noreferrer">
                {t.hero.secondary}
              </a>
              <a href="./game.html">{t.hero.tertiary}</a>
            </div>

            <div className="stat-grid">
              {t.stats.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <SignalField />
            <div className="hero-radar">
              <p>{lang === 'en' ? 'Signal density' : '信号密度'}</p>
              <strong>High</strong>
            </div>
            <div className="hero-radar second">
              <p>{lang === 'en' ? 'Narrative mode' : '叙事模式'}</p>
              <strong>{lang === 'en' ? 'Visual first' : '视觉优先'}</strong>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          className="map-section"
          id="map"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-heading">
            <p className="eyebrow">{t.map.eyebrow}</p>
            <h2>{t.map.title}</h2>
          </div>

          <div className="map-layout">
            <RelationshipGraph
              lang={lang}
              descriptions={t.graphDescriptions}
              helper={t.map.helper}
            />

            <aside className="link-matrix">
              <h3>{t.links.sectionTitle}</h3>
              {t.links.groups.map((group) => (
                <article key={group.title}>
                  <span>{group.title}</span>
                  <div>
                    {group.items.map((item) => (
                      <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </aside>
          </div>
        </MotionSection>

        <MotionSection
          className="works-section"
          id="works"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-heading">
            <p className="eyebrow">{t.works.eyebrow}</p>
            <h2>{t.works.title}</h2>
          </div>

          <div className="work-grid">
            {WORK_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="work-card"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                data-accent={item.accent}
              >
                <span>{pick(item.tag, lang)}</span>
                <strong>{pick(item.title, lang)}</strong>
                <em>{t.works.action}</em>
              </a>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          className="hobbies-section"
          id="hobbies"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-heading">
            <p className="eyebrow">{t.hobbies.eyebrow}</p>
            <h2>{t.hobbies.title}</h2>
          </div>

          <div className="hobby-grid">
            {HOBBIES.map((hobby) => (
              <article key={hobby.id} className="hobby-card">
                <div className="hobby-top">
                  <strong>{pick(hobby.name, lang)}</strong>
                  <span>{hobby.level}%</span>
                </div>
                <p>{pick(hobby.note, lang)}</p>
                <div className="hobby-meter" aria-label={`${pick(hobby.name, lang)} ${t.hobbies.scale}`}>
                  <div style={{ width: `${hobby.level}%` }} />
                </div>
              </article>
            ))}
          </div>
        </MotionSection>

        <MotionDiv
          className="arcade-banner"
          id="arcade"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="arcade-copy">
            <p className="eyebrow">{t.arcade.eyebrow}</p>
            <h2>{t.arcade.title}</h2>
            <p>{t.arcade.summary}</p>
          </div>
          <a href="./game.html">{t.arcade.cta}</a>
        </MotionDiv>

        <MotionSection
          className="contact-section"
          id="contact"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-heading">
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2>{t.contact.title}</h2>
            <p className="contact-summary">{t.contact.summary}</p>
          </div>
          <div className="contact-links">
            <a href={siteLinks.email}>{t.contact.email}</a>
            <a href={siteLinks.github} target="_blank" rel="noreferrer">
              {t.contact.github}
            </a>
            <a href={siteLinks.linkedin} target="_blank" rel="noreferrer">
              {t.contact.linkedin}
            </a>
          </div>
        </MotionSection>
      </main>

      <footer className="site-footer">
        <span>{t.footer}</span>
        <span>{year}</span>
      </footer>
    </div>
  )
}

export default App
