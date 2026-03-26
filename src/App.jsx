import { startTransition, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import './App.css'
import {
  contactLinks,
  focusAreas,
  githubFallback,
  heroFacts,
  manifesto,
  proofPoints,
  roleTicker,
  systems,
  trajectory,
} from './content'
import { SignalField } from './components/SignalField'

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))

const MotionDiv = motion.div
const MotionArticle = motion.article

function SystemStory({ system }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.45, 0.8, 1], [0.92, 1, 1, 0.95])
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [72, 0, -48])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.15, 0.5, 0.4, 0.1])
  const frameRotation = useTransform(scrollYProgress, [0, 1], [-5, 6])

  return (
    <article
      className="system-story"
      id={system.id}
      ref={ref}
      style={{
        '--system-accent': system.accent,
        '--system-glow': system.glow,
        '--system-edge': system.edge,
      }}
    >
      <MotionDiv className="system-panel" style={{ scale }}>
        <MotionDiv
          className="system-halo"
          style={{ opacity: glowOpacity, rotate: frameRotation }}
        />
        <MotionDiv className="system-frame" style={{ y: contentY }}>
          <div className="system-meta">
            <span className="eyebrow">{system.code}</span>
            <h3>{system.name}</h3>
            <p>{system.summary}</p>
            <ul className="system-stack">
              {system.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="system-body">
            <div className="system-body-copy">
              {system.bullets.map((bullet) => (
                <p key={bullet}>{bullet}</p>
              ))}
            </div>

            <div className="system-spec">
              <div className="system-spec-head">
                <span>Mission Outcome</span>
                <a href={system.link} target="_blank" rel="noreferrer">
                  Open Repo
                </a>
              </div>
              <dl>
                {system.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </MotionDiv>
      </MotionDiv>
    </article>
  )
}

function TimelineItem({ item, index }) {
  return (
    <MotionArticle
      className="trajectory-item"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="trajectory-dot" />
      <div className="trajectory-period">{item.period}</div>
      <div className="trajectory-content">
        <span className="trajectory-tag">{item.tag}</span>
        <h3>{item.title}</h3>
        <p className="trajectory-place">{item.place}</p>
        <p>{item.summary}</p>
      </div>
    </MotionArticle>
  )
}

function App() {
  const [githubData, setGithubData] = useState(githubFallback)
  const [githubMode, setGithubMode] = useState('snapshot')

  useEffect(() => {
    const controller = new AbortController()

    async function loadGithubSignal() {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch('https://api.github.com/users/zeron-G', {
            signal: controller.signal,
          }),
          fetch('https://api.github.com/users/zeron-G/repos?per_page=100&sort=updated', {
            signal: controller.signal,
          }),
        ])

        if (!profileResponse.ok || !reposResponse.ok) {
          throw new Error('GitHub API request failed')
        }

        const profile = await profileResponse.json()
        const repos = await reposResponse.json()
        const sortedRepos = [...repos].sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        )

        const languages = Object.entries(
          sortedRepos.reduce((accumulator, repo) => {
            if (repo.language) {
              accumulator[repo.language] = (accumulator[repo.language] || 0) + 1
            }
            return accumulator
          }, {}),
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([language]) => language)

        const totalStars = sortedRepos.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0,
        )

        const recentRepos = sortedRepos.slice(0, 6).map((repo) => ({
          name: repo.name,
          description: repo.description || 'Repository in active rotation.',
          language: repo.language || 'Mixed',
          stars: repo.stargazers_count,
          url: repo.html_url,
          updatedAt: repo.updated_at,
        }))

        startTransition(() => {
          setGithubData({
            profile: {
              publicRepos: profile.public_repos,
              followers: profile.followers,
              totalStars,
              updatedAt: sortedRepos[0]?.updated_at || profile.updated_at,
            },
            languages,
            recentRepos,
          })
          setGithubMode('live')
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setGithubMode('snapshot')
        }
      }
    }

    loadGithubSignal()

    return () => controller.abort()
  }, [])

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.2,
  })

  const heroGlow = useTransform(progress, [0, 1], [0.26, 0.6])
  const heroGradient = useMotionTemplate`radial-gradient(circle at 70% 22%, rgba(55, 207, 255, ${heroGlow}), transparent 38%), radial-gradient(circle at 18% 85%, rgba(255, 184, 106, 0.18), transparent 34%)`

  return (
    <div className="app-shell">
      <MotionDiv className="scroll-progress" style={{ scaleX: progress }} />

      <header className="site-header">
        <a className="site-mark" href="#top">
          Rongze Gao
        </a>
        <nav>
          <a href="#systems">Systems</a>
          <a href="#trajectory">Trajectory</a>
          <a href="#proof">Proof</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="top">
          <MotionDiv className="hero-sheen" style={{ backgroundImage: heroGradient }} />

          <div className="hero-grid">
            <MotionDiv
              className="hero-copy"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">AI Researcher · Quant Builder · Systems Pilot</p>
              <h1>
                Designing intelligent systems that survive contact with reality.
              </h1>
              <p className="hero-summary">
                Johns Hopkins M.S. candidate building healthcare agents, embodied
                AI workflows, quant research pipelines, and runtime tooling with a
                strong bias toward performance, signal, and real deployment.
              </p>

              <div className="hero-actions">
                <a href="mailto:rgao28@jh.edu">Start a conversation</a>
                <a href="https://github.com/zeron-G" target="_blank" rel="noreferrer">
                  Explore GitHub
                </a>
              </div>

              <dl className="hero-facts">
                {heroFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </MotionDiv>

            <MotionDiv
              className="hero-display"
              initial={{ opacity: 0, scale: 0.92, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <SignalField />

              <div className="display-label top-left">Healthcare AI</div>
              <div className="display-label top-right">Quant Research</div>
              <div className="display-label bottom-left">Student Pilot</div>
              <div className="display-label bottom-right">Runtime Systems</div>

              <div className="display-panel panel-profile">
                <span>Current Vector</span>
                <strong>JHU M.S. in Information Systems and AI</strong>
                <p>Bridging research, engineering, and high-stakes decision tools.</p>
              </div>

              <div className="display-panel panel-github">
                <span>GitHub Signal</span>
                <strong>{githubMode === 'live' ? 'Live feed' : 'Research snapshot'}</strong>
                <p>
                  {githubData.profile.publicRepos} repos · {githubData.profile.totalStars}{' '}
                  stars · updated {formatDate(githubData.profile.updatedAt)}
                </p>
              </div>

              <div className="display-focus">
                {focusAreas.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </MotionDiv>
          </div>

          <div className="ticker-shell" aria-hidden="true">
            <div className="ticker-track">
              {[...roleTicker, ...roleTicker].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="manifest-section" id="mission">
          <div className="section-heading">
            <p className="eyebrow">Operating Principles</p>
            <h2>Research-grade thinking with founder-grade execution.</h2>
          </div>

          <div className="manifest-grid">
            <div className="manifest-lead">
              <p>
                Finance and economics taught the language of signal. Healthcare and
                robotics raised the bar for correctness. Building agents made the
                interface between reasoning, memory, and real-world action the main
                obsession.
              </p>
            </div>

            <div className="manifest-points">
              {manifesto.map((item) => (
                <MotionArticle
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span>{item.index}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </MotionArticle>
              ))}
            </div>
          </div>
        </section>

        <section className="systems-section" id="systems">
          <div className="section-heading section-heading-inline">
            <p className="eyebrow">Selected Systems</p>
            <h2>Three builds that define the way Rongze ships.</h2>
          </div>

          <div className="systems-list">
            {systems.map((system) => (
              <SystemStory key={system.id} system={system} />
            ))}
          </div>
        </section>

        <section className="trajectory-section" id="trajectory">
          <div className="section-heading">
            <p className="eyebrow">Trajectory</p>
            <h2>From finance signal work to human-facing intelligent systems.</h2>
          </div>

          <div className="trajectory-rail">
            {trajectory.map((item, index) => (
              <TimelineItem key={item.title} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className="proof-section" id="proof">
          <div className="section-heading section-heading-inline">
            <p className="eyebrow">Proof of Work</p>
            <h2>Public outcomes, competition results, and shipped credibility.</h2>
          </div>

          <div className="proof-grid">
            {proofPoints.map((item) => (
              <MotionArticle
                key={item.title}
                className="proof-item"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="proof-value">{item.value}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </MotionArticle>
            ))}
          </div>
        </section>

        <section className="github-section" id="github">
          <div className="section-heading">
            <p className="eyebrow">GitHub Pulse</p>
            <h2>Live repository activity with a fallback to the latest researched snapshot.</h2>
          </div>

          <div className="github-grid">
            <div className="github-summary">
              <div className="github-chip">{githubMode === 'live' ? 'Live API' : 'Snapshot'}</div>
              <div className="github-metrics">
                <article>
                  <span>Public repos</span>
                  <strong>{githubData.profile.publicRepos}</strong>
                </article>
                <article>
                  <span>Followers</span>
                  <strong>{githubData.profile.followers}</strong>
                </article>
                <article>
                  <span>Total repo stars</span>
                  <strong>{githubData.profile.totalStars}</strong>
                </article>
              </div>

              <div className="github-languages">
                <span>Most active lanes</span>
                <div>
                  {githubData.languages.map((language) => (
                    <p key={language}>{language}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="repo-feed">
              {githubData.recentRepos.map((repo) => (
                <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer">
                  <div>
                    <strong>{repo.name}</strong>
                    <p>{repo.description}</p>
                  </div>
                  <div className="repo-meta">
                    <span>{repo.language}</span>
                    <span>{repo.stars} stars</span>
                    <span>{formatDate(repo.updatedAt)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <MotionDiv
            className="contact-panel"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Open Channel</p>
            <h2>Available for research collaborations, ambitious products, and hard technical builds.</h2>
            <p className="contact-summary">
              The page is intentionally written like a control surface: minimal on
              fluff, maximal on signal. If you want to build something serious in
              healthcare AI, quant infrastructure, or agent systems, Rongze is easy
              to reach.
            </p>

            <div className="contact-links">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                >
                  <span>{link.label}</span>
                  <strong>{link.value}</strong>
                </a>
              ))}
            </div>
          </MotionDiv>
        </section>
      </main>
    </div>
  )
}

export default App
