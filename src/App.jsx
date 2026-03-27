import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { SignalField } from './components/SignalField'
import { WaterSurface } from './components/WaterSurface'
import {
  featuredProjects,
  introStats,
  projectMap,
  resumes,
  siteLinks,
  timeline,
  tracks,
} from './siteData'

const MotionSection = motion.section

function useRoute() {
  const parseRoute = () => {
    const hash = window.location.hash.replace(/^#/, '') || '/'
    const normalized = hash.startsWith('/') ? hash : `/${hash}`
    return normalized
  }

  const [route, setRoute] = useState(parseRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}

function NavLink({ href, children }) {
  return (
    <a className="nav-link" href={href}>
      {children}
    </a>
  )
}

function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p className="section-body">{body}</p> : null}
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Rongze Gao · Personal Site</p>
        <h1>I build AI systems, tools, and interfaces that hold up in real use.</h1>
        <p className="hero-body">
          我在做的是信息系统与人工智能，也喜欢把复杂技术做得更可用、更自然。
          这个主页先给你感觉，再给你结构，最后再给你细节。
        </p>

        <div className="hero-actions">
          <a href="#/projects">View projects</a>
          <a href="#/tracks">Explore tracks</a>
          <a href="./game.html">Play Nebula Coil</a>
          <a href={siteLinks.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>

        <div className="hero-stats">
          {introStats.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <SignalField />
        <motion.div
          className="hero-panel panel-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <span>Focus</span>
          <strong>Information Systems and Artificial Intelligence</strong>
          <p>Agent systems, quant tools, embodied AI, and applied research.</p>
        </motion.div>
        <motion.div
          className="hero-panel panel-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          <span>Browse</span>
          <p>Start with projects if you want signal fast, or use tracks for role-specific framing.</p>
        </motion.div>
        <div className="hero-tags">
          <span>Agent Systems</span>
          <span>Quant / Finance</span>
          <span>Embodied AI</span>
          <span>Healthcare AI</span>
        </div>
      </div>
    </section>
  )
}

function QuickEntry() {
  const cards = [
    {
      title: 'Projects',
      body: 'Technical depth, architecture, and concrete outcomes.',
      href: '#/projects',
      cta: 'Open projects',
    },
    {
      title: 'Tracks',
      body: 'Different ways to read the same profile depending on the role.',
      href: '#/tracks',
      cta: 'Open tracks',
    },
    {
      title: 'Resume Paths',
      body: 'Different framing for different applications.',
      href: '#/resumes',
      cta: 'Open resume paths',
    },
    {
      title: 'Arcade',
      body: 'A neon 3D-style snake run with warp gates, combo scoring, and a local leaderboard.',
      href: './game.html',
      cta: 'Play Nebula Coil',
    },
  ]

  return (
    <MotionSection
      className="content-section"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeading
        eyebrow="Overview"
        title="A quick way into the site."
        body="如果你只是想快速判断我做过什么，看这里就够了。想深入的话，再进入具体页面。"
      />
      <div className="track-grid">
        {cards.map((card) => (
          <a key={card.title} className="track-card interactive-card" href={card.href}>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <strong>{card.cta}</strong>
          </a>
        ))}
      </div>
    </MotionSection>
  )
}

function HomeProjectPreview() {
  return (
    <MotionSection
      className="content-section"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeading
        eyebrow="Selected Work"
        title="A few projects worth opening first."
        body="These are the ones that say the most about how I think and build."
      />
      <div className="project-grid">
        {featuredProjects.slice(0, 3).map((project) => (
          <a key={project.slug} className="project-card interactive-card" href={`#/projects/${project.slug}`}>
            <div>
              <span className="project-type">{project.type}</span>
              <h3>{project.name}</h3>
              <p>{project.oneLiner}</p>
            </div>
            <strong>Read project</strong>
          </a>
        ))}
      </div>
    </MotionSection>
  )
}

function GitHubProjectsPreview() {
  const [repos, setRepos] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let canceled = false

    const loadRepos = async () => {
      setStatus('loading')
      try {
        const response = await fetch(
          `https://api.github.com/users/${siteLinks.githubUsername}/repos?per_page=100&sort=updated`,
        )
        if (!response.ok) {
          throw new Error(`GitHub request failed with status ${response.status}`)
        }

        const data = await response.json()
        const personalRepos = data
          .filter((repo) => !repo.fork)
          .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at))
          .slice(0, 6)

        if (!canceled) {
          setRepos(personalRepos)
          setStatus('ready')
        }
      } catch {
        if (!canceled) {
          setStatus('error')
        }
      }
    }

    loadRepos()
    return () => {
      canceled = true
    }
  }, [])

  return (
    <MotionSection
      className="content-section"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeading
        eyebrow="GitHub"
        title="Recent original repositories"
        body="Only my own repositories are listed here, so this section stays focused on original work."
      />
      {status === 'loading' ? <p className="section-body">Loading repositories...</p> : null}
      {status === 'error' ? (
        <p className="section-body">Unable to load repositories right now. Please open GitHub directly.</p>
      ) : null}
      {status === 'ready' ? (
        <div className="project-grid">
          {repos.map((repo) => (
            <a
              key={repo.id}
              className="project-card interactive-card"
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <span className="project-type">Repository</span>
                <h3>{repo.name}</h3>
                <p>{repo.description || 'No description provided yet.'}</p>
              </div>
              <div className="chip-row">
                <span>{repo.language || 'Code'}</span>
                <span>{`Stars ${repo.stargazers_count}`}</span>
                <span>{`Updated ${new Date(repo.pushed_at).toLocaleDateString('en-US')}`}</span>
              </div>
              <strong>Open repository</strong>
            </a>
          ))}
        </div>
      ) : null}
    </MotionSection>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <QuickEntry />
      <HomeProjectPreview />
      <GitHubProjectsPreview />
    </>
  )
}

function TracksIndex() {
  return (
    <section className="page-shell">
      <SectionHeading
        eyebrow="Career Tracks"
        title="Choose the version of the portfolio that matches the role."
        body="Each track reorders projects, experience, and proof so the same background can speak differently to different teams."
      />
      <div className="track-grid">
        {tracks.map((track) => (
          <a key={track.slug} className="track-card" href={`#/tracks/${track.slug}`}>
            <span className="track-kicker">{track.kicker}</span>
            <h3>{track.title}</h3>
            <p>{track.summary}</p>
            <ul>
              {track.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <strong>Open track</strong>
          </a>
        ))}
      </div>
    </section>
  )
}

function TrackPage({ track }) {
  return (
    <section className="page-shell">
      <a className="back-link" href="#/tracks">Back to tracks</a>
      <div className="page-hero">
        <p className="eyebrow">{track.kicker}</p>
        <h1>{track.title}</h1>
        <p className="page-body">{track.summary}</p>
      </div>

      <div className="detail-grid">
        <article className="detail-panel">
          <span className="panel-label">Why this track exists</span>
          <p>{track.rationale}</p>
        </article>
        <article className="detail-panel">
          <span className="panel-label">Best-fit roles</span>
          <ul className="bullet-list">
            {track.roles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="two-column-layout">
        <article className="section-panel">
          <span className="panel-label">Key signals</span>
          <ul className="bullet-list">
            {track.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="section-panel">
          <span className="panel-label">Relevant projects</span>
          <div className="mini-card-list">
            {track.projectSlugs.map((slug) => {
              const project = projectMap[slug]
              return (
                <a key={slug} className="mini-card" href={`#/projects/${slug}`}>
                  <strong>{project.name}</strong>
                  <p>{project.oneLiner}</p>
                </a>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

function ProjectsIndex() {
  return (
    <section className="page-shell">
      <SectionHeading
        eyebrow="Projects"
        title="Project pages are where the technical depth lives."
        body="The homepage is selective. These pages provide architecture, motivation, and outcomes."
      />
      <div className="project-grid">
        {featuredProjects.map((project) => (
          <a key={project.slug} className="project-card" href={`#/projects/${project.slug}`}>
            <div>
              <span className="project-type">{project.type}</span>
              <h3>{project.name}</h3>
              <p>{project.oneLiner}</p>
            </div>
            <div className="chip-row">
              {project.stack.slice(0, 5).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <strong>Read project</strong>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProjectPage({ project }) {
  return (
    <section className="page-shell">
      <a className="back-link" href="#/projects">Back to projects</a>
      <div className="page-hero">
        <p className="eyebrow">{project.type}</p>
        <h1>{project.name}</h1>
        <p className="page-body">{project.oneLiner}</p>
        <div className="page-actions">
          <a href={project.repo} target="_blank" rel="noreferrer">Open GitHub</a>
          {project.trackLinks.map((slug) => (
            <a key={slug} href={`#/tracks/${slug}`}>
              {tracks.find((track) => track.slug === slug)?.shortLabel || slug}
            </a>
          ))}
        </div>
      </div>

      <div className="detail-grid detail-grid-long">
        <article className="detail-panel">
          <span className="panel-label">What it is</span>
          <p>{project.overview}</p>
        </article>
        <article className="detail-panel">
          <span className="panel-label">Why it matters</span>
          <p>{project.whyItMatters}</p>
        </article>
      </div>

      <div className="two-column-layout">
        <article className="section-panel">
          <span className="panel-label">Architecture highlights</span>
          <ul className="bullet-list">
            {project.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="section-panel">
          <span className="panel-label">My contributions</span>
          <ul className="bullet-list">
            {project.contributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="two-column-layout">
        <article className="section-panel">
          <span className="panel-label">Technical challenges</span>
          <ul className="bullet-list">
            {project.challenges.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="section-panel">
          <span className="panel-label">Outcomes</span>
          <ul className="bullet-list">
            {project.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

function ResumesIndex() {
  return (
    <section className="page-shell">
      <SectionHeading
        eyebrow="Resume Paths"
        title="Use the right framing for the right application."
        body="This part of the site supports multiple job families without diluting your overall profile."
      />
      <div className="resume-grid">
        {resumes.map((resume) => (
          <a key={resume.slug} className="resume-card" href={`#/resumes/${resume.slug}`}>
            <span>{resume.label}</span>
            <h3>{resume.title}</h3>
            <p>{resume.summary}</p>
            <strong>Open resume path</strong>
          </a>
        ))}
      </div>
    </section>
  )
}

function ResumePage({ resume }) {
  return (
    <section className="page-shell">
      <a className="back-link" href="#/resumes">Back to resume paths</a>
      <div className="page-hero">
        <p className="eyebrow">{resume.label}</p>
        <h1>{resume.title}</h1>
        <p className="page-body">{resume.summary}</p>
      </div>

      <div className="detail-grid">
        <article className="detail-panel">
          <span className="panel-label">Lead with</span>
          <ul className="bullet-list">
            {resume.leadWith.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-panel">
          <span className="panel-label">Featured proof points</span>
          <ul className="bullet-list">
            {resume.proofPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="section-panel">
        <span className="panel-label">Recommended projects to foreground</span>
        <div className="mini-card-list">
          {resume.projectSlugs.map((slug) => {
            const project = projectMap[slug]
            return (
              <a key={slug} className="mini-card" href={`#/projects/${slug}`}>
                <strong>{project.name}</strong>
                <p>{project.oneLiner}</p>
              </a>
            )
          })}
        </div>
      </article>
    </section>
  )
}

function NotFound() {
  return (
    <section className="page-shell">
      <h1>Page not found.</h1>
      <p className="page-body">The route does not exist yet. Use the navigation to return to the main site.</p>
      <a className="back-link" href="#/">Back home</a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div>
        <span className="panel-label">Contact</span>
        <p>Open to research collaborations, internships, and ambitious technical work.</p>
      </div>
      <div className="footer-links">
        <a href={siteLinks.email}>Email</a>
        <a href={siteLinks.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={siteLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  )
}

function App() {
  const route = useRoute()

  const page = useMemo(() => {
    if (route === '/' || route === '') return <HomePage />
    if (route === '/tracks') return <TracksIndex />
    if (route === '/projects') return <ProjectsIndex />
    if (route === '/resumes') return <ResumesIndex />

    const trackMatch = route.match(/^\/tracks\/([a-z0-9-]+)$/)
    if (trackMatch) {
      const track = tracks.find((item) => item.slug === trackMatch[1])
      return track ? <TrackPage track={track} /> : <NotFound />
    }

    const projectMatch = route.match(/^\/projects\/([a-z0-9-]+)$/)
    if (projectMatch) {
      const project = projectMap[projectMatch[1]]
      return project ? <ProjectPage project={project} /> : <NotFound />
    }

    const resumeMatch = route.match(/^\/resumes\/([a-z0-9-]+)$/)
    if (resumeMatch) {
      const resume = resumes.find((item) => item.slug === resumeMatch[1])
      return resume ? <ResumePage resume={resume} /> : <NotFound />
    }

    return <NotFound />
  }, [route])

  return (
    <div className="app-shell">
      <AuroraBackdrop />
      <WaterSurface />
      <header className="site-header">
        <a className="site-mark" href="#/">Rongze Gao</a>
        <nav>
          <NavLink href="#/tracks">Tracks</NavLink>
          <NavLink href="#/projects">Projects</NavLink>
          <NavLink href="#/resumes">Resume Paths</NavLink>
          <a className="nav-link" href="./game.html">Arcade</a>
          <a className="nav-link" href={siteLinks.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <main>{page}</main>
      <Footer />
    </div>
  )
}

export default App
