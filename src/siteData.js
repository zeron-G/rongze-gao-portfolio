export const siteLinks = {
  email: 'mailto:rgao28@jh.edu',
  github: 'https://github.com/zeron-G',
  linkedin: 'https://www.linkedin.com/in/rongze-gao-09b488303/',
}

export const introStats = [
  {
    label: 'Current base',
    value: 'JHU MSISAI',
    detail: 'Johns Hopkins master’s work centered on intelligent systems and applied AI.',
  },
  {
    label: 'Cross-domain range',
    value: 'AI ↔ Finance ↔ Robotics',
    detail: 'A profile shaped by agent systems, quantitative research, and embodied workflows.',
  },
  {
    label: 'Operating style',
    value: 'Research-grade + builder-grade',
    detail: 'The site is structured for both academic and industry readers.',
  },
]

export const featuredProjects = [
  {
    slug: 'anima',
    name: 'ANIMA',
    type: 'Agent Systems',
    oneLiner:
      'A modular agent framework focused on persistent behavior, memory architecture, layered perception, and long-lived system design.',
    overview:
      'ANIMA is built around the idea that serious agents should not be treated as prompt wrappers. It treats memory, tool use, internal state, adaptation, and runtime orchestration as first-class concerns.',
    whyItMatters:
      'The project shows how I think about agent design when consistency, retrieval, growth, and multi-model execution all need to coexist in one system.',
    architecture: [
      'Memory-augmented reasoning with layered storage and retrieval behavior.',
      'Heartbeat-driven orchestration instead of simple request-response execution.',
      'Multi-model execution pathways and tool-aware runtime decisions.',
      'A design language that treats persona, state, and interaction history as system problems, not just writing problems.',
    ],
    contributions: [
      'Designed the core system architecture and project direction.',
      'Worked on identity, memory, persona stability, and runtime adaptation concepts.',
      'Pushed the framework toward persistent internal behavior instead of disposable chat sessions.',
    ],
    challenges: [
      'Keeping agent identity stable across different models and prompt contexts.',
      'Balancing retrieval quality, responsiveness, and long-lived state.',
      'Separating cosmetic personality effects from durable behavioral protocols.',
    ],
    outcomes: [
      'Created a portfolio-defining flagship system for agent-oriented roles.',
      'Provides strong evidence for product-thinking plus architecture-thinking in AI.',
      'Acts as the main anchor for agent, applied AI, and systems interviews.',
    ],
    stack: ['Python', 'Vue', 'Tauri', 'SQLite', 'ChromaDB'],
    trackLinks: ['ai-agent-systems', 'healthcare-applied-research'],
    repo: 'https://github.com/zeron-G/anima',
  },
  {
    slug: 'synapse',
    name: 'Synapse',
    type: 'Runtime Infrastructure',
    oneLiner:
      'A cross-language runtime bridge for AI workloads that need Python flexibility without surrendering low-level performance.',
    overview:
      'Synapse sits at the seam between high-level model orchestration and performance-critical execution. It is built around cross-language interoperability and low-latency communication.',
    whyItMatters:
      'It demonstrates that I can work below the application layer and think about systems constraints directly, not only at the product or model interface.',
    architecture: [
      'Shared memory and event-driven communication between runtimes.',
      'Cross-language coordination across Python, Rust, and C++ contexts.',
      'A performance-oriented design mindset rather than a purely convenience-oriented API layer.',
    ],
    contributions: [
      'Developed the concept and architecture framing for the runtime bridge.',
      'Focused on performance-sensitive design decisions and interoperability boundaries.',
      'Used the project to push deeper into systems-level AI infrastructure thinking.',
    ],
    challenges: [
      'Designing a runtime layer that feels usable without losing performance discipline.',
      'Making interoperability legible instead of brittle.',
      'Choosing where abstraction helps and where it hides the real problem.',
    ],
    outcomes: [
      'Adds strong systems credibility to the portfolio.',
      'Supports roles that value infra, runtime, or cross-language engineering.',
      'Differentiates the portfolio from agent-only or app-only candidates.',
    ],
    stack: ['Rust', 'Python', 'C++', 'Shared Memory', 'IPC'],
    trackLinks: ['ai-agent-systems', 'embodied-ai-robotics'],
    repo: 'https://github.com/zeron-G/Synapse',
  },
  {
    slug: 'finrag-agent',
    name: 'FinRAG Agent',
    type: 'Quant / Finance AI',
    oneLiner:
      'A production-minded financial RAG workflow for SEC 10-K analysis with retrieval structure, streaming, and grounded answers.',
    overview:
      'FinRAG Agent connects financial-document analysis with modern AI system design, turning filings into a more structured analytical workflow.',
    whyItMatters:
      'This project lets me present finance fluency and engineering capability in the same artifact, which matters for quant, financial AI, and hybrid analytical roles.',
    architecture: [
      'Retrieval pipeline for long financial documents and structured sections.',
      'Streaming answer design for practical analyst workflows.',
      'Grounded citation behavior instead of generic generated summaries.',
    ],
    contributions: [
      'Built the system framing around finance-specific retrieval and answer generation.',
      'Focused on making the workflow feel useful to an analyst rather than impressive only to developers.',
      'Connected domain knowledge with engineering implementation choices.',
    ],
    challenges: [
      'Handling long structured filings without losing context quality.',
      'Maintaining trust and source-grounding in generated outputs.',
      'Designing for practical use instead of demo-only performance.',
    ],
    outcomes: [
      'Strengthens the quant / finance branch of the portfolio.',
      'Shows domain-specific application of AI rather than generic LLM enthusiasm.',
      'Works well as a bridge project between finance and AI applications.',
    ],
    stack: ['FastAPI', 'FAISS', 'SSE', 'RAG', 'Finance'],
    trackLinks: ['quant-finance'],
    repo: 'https://github.com/zeron-G/FinRAG-Agent',
  },
  {
    slug: 'healthcare-agent-work',
    name: 'Healthcare Agent Work',
    type: 'Healthcare / Applied Research',
    oneLiner:
      'Applied work spanning CDHAI, HAI-Agent, and Ward Infinity around healthcare workflows, monitoring, and human-facing AI systems.',
    overview:
      'This is the applied research and product-facing track of the portfolio: AI systems that interact with clinical or health-related use cases where stakes are higher and vague engineering gets punished quickly.',
    whyItMatters:
      'It shows experience beyond toy systems, especially in domains where usability, trust, and correctness all matter at once.',
    architecture: [
      'Human-facing AI workflows connected to healthcare monitoring and interpretation contexts.',
      'Agent-assisted interaction patterns rather than isolated model outputs.',
      'A strong bias toward systems that support real users and decision contexts.',
    ],
    contributions: [
      'Worked as a research assistant at CDHAI on healthcare-oriented agent systems.',
      'Contributed to Ward Infinity / Vital Guardian style monitoring workflows.',
      'Helped shape how AI could serve real health-related user interactions.',
    ],
    challenges: [
      'Designing systems that need clarity, trust, and practical usefulness.',
      'Balancing model ambition with real-world interpretability constraints.',
      'Working across product, research, and deployment logic at once.',
    ],
    outcomes: [
      'Adds credibility for applied AI, healthcare AI, and research engineering roles.',
      'Demonstrates experience in high-stakes environments rather than only speculative AI work.',
      'Connects strongly with the Johns Hopkins part of the profile.',
    ],
    stack: ['Healthcare AI', 'Agent Workflows', 'Research', 'Monitoring'],
    trackLinks: ['healthcare-applied-research', 'ai-agent-systems'],
    repo: 'https://github.com/zeron-G',
  },
  {
    slug: 'embodied-ai-work',
    name: 'Embodied AI / Robotics Work',
    type: 'Embodied AI / Robotics',
    oneLiner:
      'Engineering work tied to robotics, computer vision, deployment, and systems that extend beyond screen-only intelligence.',
    overview:
      'This track captures the part of the portfolio concerned with perception, action, robotics deployment, and AI systems that meet the physical world.',
    whyItMatters:
      'It differentiates the portfolio from purely software or purely language-model candidates and opens doors to robotics, embodied AI, and perception-heavy teams.',
    architecture: [
      'Embodied workflows where perception and action matter, not only text generation.',
      'Deployment-facing engineering rather than abstract robotics discussion.',
      'A practical connection between AI logic and real operating environments.',
    ],
    contributions: [
      'Worked on robotics-related engineering with Tuskrobots.',
      'Built exposure to CV, deployment, and embodied-system constraints.',
      'Used these experiences to expand the portfolio beyond software-only narratives.',
    ],
    challenges: [
      'Handling the messy interface between software systems and physical deployment.',
      'Thinking about latency, perception quality, and operational constraints together.',
      'Making embodied work legible to a broader hiring audience.',
    ],
    outcomes: [
      'Strengthens robotics and embodied AI applications.',
      'Adds a rare dimension to a portfolio that also spans agent and quant work.',
      'Supports a broader future narrative around perception plus action.',
    ],
    stack: ['Robotics', 'Computer Vision', 'Deployment', 'Embodied AI'],
    trackLinks: ['embodied-ai-robotics'],
    repo: 'https://github.com/zeron-G',
  },
]

export const projectMap = Object.fromEntries(featuredProjects.map((project) => [project.slug, project]))

export const tracks = [
  {
    slug: 'ai-agent-systems',
    shortLabel: 'AI / Agent',
    kicker: 'Track 01',
    title: 'AI / Agent Systems',
    summary:
      'Best for AI engineer, applied scientist, research engineer, and agent-system roles where memory, orchestration, model behavior, and system architecture matter more than hype.',
    rationale:
      'This track exists because the strongest AI-facing version of the portfolio is not just “I use LLMs.” It is about building persistent systems with memory, reasoning structure, runtime design, and real deployment constraints.',
    roles: ['AI Engineer', 'Research Engineer', 'Applied Scientist', 'Agent Systems Builder'],
    highlights: [
      'ANIMA as the flagship long-lived agent framework.',
      'Synapse as evidence of systems-level and runtime-level thinking.',
      'Healthcare agent work as proof of human-facing, higher-stakes applications.',
      'A profile that combines architecture thinking with actual shipped prototypes.',
    ],
    projectSlugs: ['anima', 'synapse', 'healthcare-agent-work'],
  },
  {
    slug: 'quant-finance',
    shortLabel: 'Quant / Finance',
    kicker: 'Track 02',
    title: 'Quant / Finance',
    summary:
      'Best for quant research, financial engineering, market modeling, and analytical finance roles that reward signal discipline, technical rigor, and domain fluency.',
    rationale:
      'This track reframes the portfolio around analytical structure, finance fluency, and technical implementation. It is for readers who care about signal quality, models, markets, and financial tools rather than agent rhetoric.',
    roles: ['Quant Research', 'Financial Engineering', 'Market Modeling', 'Analytical Finance'],
    highlights: [
      'WorldQuant research and challenge performance.',
      'CQF with Distinction and technical finance preparation.',
      'FinRAG Agent as a finance-facing AI system.',
      'Kaggle Optiver and financial forecasting work as evidence of modeling discipline.',
    ],
    projectSlugs: ['finrag-agent', 'synapse', 'anima'],
  },
  {
    slug: 'embodied-ai-robotics',
    shortLabel: 'Embodied / Robotics',
    kicker: 'Track 03',
    title: 'Embodied AI / Robotics',
    summary:
      'Best for robotics, embodied AI, perception, deployment, and cross-stack engineering roles where software meets the physical world.',
    rationale:
      'This track highlights the side of the portfolio that moves beyond text-only systems and toward perception, action, deployment, and systems engineering under physical constraints.',
    roles: ['Embodied AI Engineer', 'Robotics Engineer', 'Perception Systems', 'Cross-stack AI Builder'],
    highlights: [
      'Tuskrobots experience as practical embodied engineering exposure.',
      'Synapse as a strong indicator of runtime and systems engineering ability.',
      'Embodied AI work as a bridge between model intelligence and operational environments.',
      'A portfolio that can talk both agent logic and deployment logic.',
    ],
    projectSlugs: ['embodied-ai-work', 'synapse', 'anima'],
  },
  {
    slug: 'healthcare-applied-research',
    shortLabel: 'Healthcare / Research',
    kicker: 'Track 04',
    title: 'Healthcare / Applied Research',
    summary:
      'Best for healthcare AI, human-AI interaction, digital health research, and applied research roles that value real deployment context and user-facing systems.',
    rationale:
      'This track is designed for readers who care about how research and engineering translate into useful, trustworthy systems in domains where hand-wavy design does not survive contact with users.',
    roles: ['Healthcare AI', 'Applied Research', 'Human-AI Systems', 'Digital Health'],
    highlights: [
      'CDHAI and HAI-Agent involvement at Johns Hopkins.',
      'Ward Infinity / Vital Guardian as a product-facing outcome signal.',
      'Agent workflow thinking applied in higher-stakes contexts.',
      'A research profile that still feels implementation-aware.',
    ],
    projectSlugs: ['healthcare-agent-work', 'anima', 'synapse'],
  },
]

export const resumes = [
  {
    slug: 'general',
    label: 'Path 01',
    title: 'General resume framing',
    summary:
      'The broadest version of the profile, suitable when the reader needs to understand the full range before specializing.',
    leadWith: [
      'Johns Hopkins AI training and interdisciplinary systems profile.',
      'Cross-domain builder identity spanning AI, finance, and embodied workflows.',
      'Selected achievements that signal both rigor and range.',
    ],
    proofPoints: ['JHU MSISAI', 'CQF with Distinction', 'WorldQuant Gold Level', '$20K Ward Infinity grant'],
    projectSlugs: ['anima', 'synapse', 'healthcare-agent-work'],
  },
  {
    slug: 'ai-ml',
    label: 'Path 02',
    title: 'AI / ML resume framing',
    summary:
      'Best when applying to AI engineering, research engineering, agent systems, or applied ML roles.',
    leadWith: [
      'ANIMA and persistent-agent architecture work.',
      'Healthcare agent research and system-facing projects.',
      'Systems and runtime credibility from Synapse.',
    ],
    proofPoints: ['Agent frameworks', 'Healthcare research assistantship', 'Runtime systems work'],
    projectSlugs: ['anima', 'synapse', 'healthcare-agent-work'],
  },
  {
    slug: 'quant-finance',
    label: 'Path 03',
    title: 'Quant / finance resume framing',
    summary:
      'Best for quant research, financial AI, market modeling, and analytical finance applications.',
    leadWith: [
      'WorldQuant and CQF as core finance signals.',
      'FinRAG Agent as the applied bridge between finance and AI.',
      'Competition and modeling work that shows signal discipline.',
    ],
    proofPoints: ['WorldQuant Gold', 'CQF Distinction', 'Optiver Bronze Medal', 'CFA Research Challenge'],
    projectSlugs: ['finrag-agent', 'synapse', 'anima'],
  },
]

export const timeline = [
  {
    period: '2021 – 2025',
    title: 'Finance and economics foundation',
    place: 'University of Waikato Joint Institute @ HZU',
    summary:
      'Built a base in markets, valuation, and analytical reasoning that later expanded into quantitative and systems-heavy work.',
  },
  {
    period: '2022 – Present',
    title: 'WorldQuant research consulting',
    place: 'WorldQuant Brain',
    summary:
      'Worked on quantitative signal research and built credibility in finance-facing analytical environments.',
  },
  {
    period: '2023 – 2024',
    title: 'CQF with Distinction',
    place: 'Certificate in Quantitative Finance',
    summary:
      'Added formal quantitative-finance depth and technical discipline beyond the standard student profile.',
  },
  {
    period: '2025 – Present',
    title: 'Healthcare AI and agent research',
    place: 'CDHAI / Johns Hopkins',
    summary:
      'Contributed to healthcare-oriented AI workflows and agent-system thinking in applied research settings.',
  },
  {
    period: '2025 – 2026',
    title: 'Ward Infinity / Vital Guardian',
    place: 'Johns Hopkins accelerator context',
    summary:
      'Worked on AI-enabled monitoring ideas linked to a first-place finish and a $20,000 grant outcome.',
  },
  {
    period: '2025 – Present',
    title: 'Embodied AI / robotics exposure',
    place: 'Tuskrobots',
    summary:
      'Expanded the portfolio beyond screen-only systems into deployment, CV, and embodied engineering contexts.',
  },
]
