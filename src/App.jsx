import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import { SignalField } from './components/SignalField'
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
        <p className="eyebrow">Researcher · Builder · Multi-track Operator</p>
        <h1>One portfolio, multiple career narratives.</h1>
        <p className="hero-body">
          I work across AI agents, quantitative modeling, embodied intelligence,
          and real-world decision systems. This site is designed as a central
          hub: broad enough to support different applications, structured enough
          to let each reader enter the right story fast.
        </p>

        <div className="hero-actions">
          <a href="#/tracks">Explore tracks</a>
          <a href="#/projects">View projects</a>
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
        <div className="hero-panel panel-primary">
          <span>Core through-line</span>
          <strong>Intelligent systems under real constraints</strong>
          <p>
            From healthcare agents to market models to robotics workflows, the
            consistent theme is designing systems that stay useful outside the lab.
          </p>
        </div>
        <div className="hero-panel panel-secondary">
          <span>How to use this site</span>
          <p>Choose a track for role-specific framing, or jump into projects for technical depth.</p>
        </div>
        <div className="hero-tags">
          <span>Agent Systems</span>
          <span>Quant / Finance</span>
          <span>Embodied AI</span>
          <span>Healthcare Research</span>
        </div>
      </div>
    </section>
  )
}

function TracksPreview() {
  return (
    <MotionSection className="content-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
      <SectionHeading
        eyebrow="Career Tracks"
        title="Different readers can enter different versions of the story."
        body="Instead of forcing one homepage to fit every role, the site is split into tracks for AI / agent systems, quant / finance, embodied AI / robotics, and healthcare / applied research."
      />
      <div className="track-grid">
        {tracks.map((track) => (
          <a key={track.slug} className="track-card" href={`#/tracks/${track.slug}`}>
            <span className="track-kicker">{track.kicker}</span>
            <h3>{track.title}</h3>
            <p>{track.summary}</p>
            <ul>
              {track.highlights.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <strong>Open track</strong>
          </a>
        ))}
      </div>
    </MotionSection>
  )
}

function FeaturedProjects() {
  return (
    <MotionSection className="content-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
      <SectionHeading
        eyebrow="Selected Work"
        title="Projects that carry across more than one industry."
        body="These are the systems most worth reading first because they show how the same builder can operate in product, research, and high-stakes technical environments."
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
              {project.stack.slice(0, 4).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <strong>Read project</strong>
          </a>
        ))}
      </div>
    </MotionSection>
  )
}

function ResumePreview() {
  return (
    <MotionSection className="content-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
      <SectionHeading
        eyebrow="Resume Paths"
        title="Different applications should not all receive the same framing."
        body="This section makes it easy to point recruiters, professors, and hiring managers toward the most relevant version of the profile."
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
    </MotionSection>
  )
}

function TimelinePreview() {
  return (
    <MotionSection className="content-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
      <SectionHeading
        eyebrow="Trajectory"
        title="A profile built by crossing disciplines instead of staying inside one lane."
      />
      <div className="timeline-list">
        {timeline.map((item) => (
          <article key={item.title} className="timeline-card">
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <p className="timeline-place">{item.place}</p>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </MotionSection>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <TracksPreview />
      <FeaturedProjects />
      <ResumePreview />
      <TimelinePreview />
    </>
  )
}

function TracksIndex() {
  return (
    <section className="page-shell">
      <SectionHeading
        eyebrow="Career Tracks"
        title="Choose the version of the portfolio that matches the role."
        body="Each track reorders projects, experience, and proof so the same background can speak differently to agent labs, finance teams, robotics groups, and applied research environments."
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
      <a className="back-link" href="#/tracks">← Back to tracks</a>
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
        body="The homepage is intentionally selective. These deeper pages are the evidence layer: architecture, motivation, contributions, and outcomes."
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
      <a className="back-link" href="#/projects">← Back to projects</a>
      <div className="page-hero">
        <p className="eyebrow">{project.type}</p>
        <h1>{project.name}</h1>
        <p className="page-body">{project.oneLiner}</p>
        <div className="page-actions">
          <a href={project.repo} target="_blank" rel="noreferrer">Open GitHub</a>
          {project.trackLinks.map((slug) => (
            <a key={slug} href={`#/tracks/${slug}`}>{tracks.find((track) => track.slug === slug)?.shortLabel || slug}</a>
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
        body="This part of the site is built to support multiple job families without diluting the overall personal brand."
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
      <a className="back-link" href="#/resumes">← Back to resume paths</a>
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
      <a className="back-link" href="#/">← Back home</a>
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
      <header className="site-header">
        <a className="site-mark" href="#/">Rongze Gao</a>
        <nav>
          <NavLink href="#/tracks">Tracks</NavLink>
          <NavLink href="#/projects">Projects</NavLink>
          <NavLink href="#/resumes">Resume Paths</NavLink>
          <a className="nav-link" href={siteLinks.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <main>{page}</main>
      <Footer />
    </div>
  )
}

export default App
