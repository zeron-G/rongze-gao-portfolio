export const heroFacts = [
  { label: 'Base', value: 'Baltimore / Arlington' },
  { label: 'Program', value: 'JHU MSISAI 2026' },
  { label: 'Credential', value: 'CQF with Distinction' },
  { label: 'Flight', value: 'FAA Part 141 Private Pilot' },
]

export const focusAreas = [
  'Healthcare agents',
  'Embodied AI',
  'Quant signals',
  'Rust runtime bridges',
]

export const roleTicker = [
  'CDHAI research assistant',
  'Ward Infinity grant winner',
  'WorldQuant consultant',
  'Embodied AI builder',
  'Cross-language systems engineer',
  'Published LSTM finance researcher',
]

export const manifesto = [
  {
    index: '01',
    title: 'System first, demo second.',
    body: 'The interesting part is not a shiny surface, but the architecture that keeps memory, models, tools, and latency under control.',
  },
  {
    index: '02',
    title: 'High-stakes domains shape the bar.',
    body: 'Healthcare monitoring, finance, and robotics all punish hand-wavy engineering, which is why the work leans toward grounded, testable systems.',
  },
  {
    index: '03',
    title: 'Performance is part of product quality.',
    body: 'From zero-copy runtime bridges to retrieval pipelines and real-time world simulations, speed is treated as a design material.',
  },
  {
    index: '04',
    title: 'Signal matters more than noise.',
    body: 'Every section in this site mirrors how Rongze works: compress the story, highlight the outcome, and keep the system legible under pressure.',
  },
]

export const systems = [
  {
    id: 'synapse',
    code: 'System 01',
    name: 'Synapse',
    summary:
      'A cross-language runtime bridge designed for AI workloads that need Python ergonomics without surrendering performance.',
    accent: '#37cfff',
    glow: 'rgba(55, 207, 255, 0.32)',
    edge: 'rgba(154, 227, 255, 0.34)',
    stack: ['Rust', 'Python', 'C++', 'Shared memory', 'Zero-copy IPC'],
    bullets: [
      'Built around shared memory and lock-free ring buffers for sub-microsecond message passing across Python, C++, and Rust.',
      'Targets the exact seam between model-heavy orchestration and performance-critical systems, where most tools are either too slow or too tightly coupled.',
      'Represents Rongze at his most systems-focused: protocol design, runtime pragmatism, and a strong feel for where latency actually matters.',
    ],
    specs: [
      { label: 'Focus', value: 'Runtime interoperability for AI systems' },
      { label: 'Signature', value: 'Zero-copy, schema-driven communication' },
      {
        label: 'Why it matters',
        value: 'Makes Python-native AI tooling play well with lower-level execution environments',
      },
    ],
    link: 'https://github.com/zeron-G/Synapse',
  },
  {
    id: 'anima',
    code: 'System 02',
    name: 'ANIMA',
    summary:
      'A modular agent framework that pushes beyond chatbot patterns toward persistent behavior, memory, and adaptive internal state.',
    accent: '#89f0ff',
    glow: 'rgba(137, 240, 255, 0.28)',
    edge: 'rgba(137, 240, 255, 0.28)',
    stack: ['Python', 'Vue', 'Tauri', 'SQLite', 'ChromaDB'],
    bullets: [
      'Built with memory-augmented reasoning, tool orchestration, multi-model execution, and a layered perception stack.',
      'Introduces heartbeat, emotion, and self-optimization concepts as first-class parts of the agent architecture rather than cosmetic add-ons.',
      'Shows Rongze working at the boundary of product, cognition design, and long-lived interactive systems.',
    ],
    specs: [
      { label: 'Focus', value: 'Persistent LLM agent behavior' },
      { label: 'Signature', value: 'Heartbeat-driven, self-evolving architecture' },
      {
        label: 'Why it matters',
        value: 'Turns agent design into an operating system problem instead of a prompt wrapper problem',
      },
    ],
    link: 'https://github.com/zeron-G/anima',
  },
  {
    id: 'finrag',
    code: 'System 03',
    name: 'FinRAG Agent',
    summary:
      'A production-minded financial RAG workflow for SEC 10-K analysis with structured retrieval, streaming, and grounded citations.',
    accent: '#ffb86a',
    glow: 'rgba(255, 184, 106, 0.26)',
    edge: 'rgba(255, 184, 106, 0.28)',
    stack: ['FastAPI', 'FAISS', 'SSE', 'RAG', 'Financial analysis'],
    bullets: [
      'Combines hierarchical chunking, section-aware routing, multi-provider model support, and source-grounded answers for real analytical use.',
      'Reflects the finance side of Rongze’s background while staying unmistakably engineering-led in architecture and delivery.',
      'The project reads like a serious tool, not a classroom toy, which is exactly the design signal worth amplifying.',
    ],
    specs: [
      { label: 'Focus', value: 'Enterprise-grade 10-K intelligence' },
      { label: 'Signature', value: 'Section-aware retrieval with streaming answers' },
      {
        label: 'Why it matters',
        value: 'Connects finance domain fluency with modern agent and RAG system design',
      },
    ],
    link: 'https://github.com/zeron-G/FinRAG-Agent',
  },
]

export const trajectory = [
  {
    period: '2021 - 2025',
    tag: 'Foundation',
    title: 'Finance and economics training',
    place: 'The University of Waikato Joint Institute at Hangzhou City University',
    summary:
      'Built the underlying mental model for markets, valuation, and signal hunting, later sharpened through quantitative finance and research work.',
  },
  {
    period: '2022 - Present',
    tag: 'Quant',
    title: 'WorldQuant Brain research consultant',
    place: 'Remote',
    summary:
      'Conducting alpha factor research and signal exploration, including a 2024 Gold Level result in the WorldQuant Challenge.',
  },
  {
    period: '2023 - 2024',
    tag: 'Credential',
    title: 'CQF Institute distinction',
    place: 'Certificate in Quantitative Finance',
    summary:
      'Deepened the quantitative layer through applied finance, modeling, and technical rigor beyond the standard student profile.',
  },
  {
    period: '2025 - Present',
    tag: 'Research',
    title: 'CDHAI research assistant at Johns Hopkins',
    place: 'Center for Digital Health and Artificial Intelligence',
    summary:
      'Supporting HAI-Agent and healthcare AI workflows focused on patient-provider interaction, data interpretation, and clinical support logic.',
  },
  {
    period: '2025 - 2026',
    tag: 'Startup',
    title: 'Ward Infinity / Vital Guardian',
    place: 'Johns Hopkins University',
    summary:
      'Built AI-enabled monitoring workflows tied to diagnostic devices and contributed to a first-place accelerator finish with a $20,000 grant.',
  },
  {
    period: '2025 - Present',
    tag: 'Embodied AI',
    title: 'Tuskrobots engineering work',
    place: 'Tuskrobots Co., Ltd.',
    summary:
      'Worked on embodied AI, computer vision, and deployment-oriented robotics workflows that move the portfolio beyond software-only systems.',
  },
]

export const proofPoints = [
  {
    value: '$20K',
    title: 'Ward Infinity grant',
    body: 'Part of the Johns Hopkins startup accelerator team that placed first and secured a $20,000 equity-free grant.',
  },
  {
    value: 'Gold',
    title: 'WorldQuant Challenge 2024',
    body: 'Recognized at Gold Level for quantitative factor research and signal quality.',
  },
  {
    value: 'Bronze',
    title: 'Kaggle Optiver medal',
    body: 'Bronze Medal for Trading at the Close with a workflow grounded in practical forecasting and model tuning.',
  },
  {
    value: 'Paper',
    title: 'Published LSTM market research',
    body: 'Published 2024 work on Shanghai Composite trend prediction using LSTM neural networks.',
  },
]

export const contactLinks = [
  {
    label: 'Email',
    value: 'rgao28@jh.edu',
    href: 'mailto:rgao28@jh.edu',
    external: false,
  },
  {
    label: 'GitHub',
    value: 'github.com/zeron-G',
    href: 'https://github.com/zeron-G',
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/rongze-gao-09b488303',
    href: 'https://www.linkedin.com/in/rongze-gao-09b488303/',
    external: true,
  },
]

export const githubFallback = {
  profile: {
    publicRepos: 16,
    followers: 7,
    totalStars: 18,
    updatedAt: '2026-03-25T22:31:53Z',
  },
  languages: ['Python', 'Rust', 'HTML', 'TypeScript'],
  recentRepos: [
    {
      name: 'anima',
      description: 'ANIMA — Modular AI Agent Framework',
      language: 'Python',
      stars: 3,
      url: 'https://github.com/zeron-G/anima',
      updatedAt: '2026-03-25T22:31:53Z',
    },
    {
      name: 'Synapse',
      description: 'Cross-language runtime bridge via shared memory + event bus.',
      language: 'Rust',
      stars: 8,
      url: 'https://github.com/zeron-G/Synapse',
      updatedAt: '2026-03-09T04:57:04Z',
    },
    {
      name: 'FinRAG-Agent',
      description: 'Production-grade RAG agent for SEC 10-K financial analysis.',
      language: 'Python',
      stars: 1,
      url: 'https://github.com/zeron-G/FinRAG-Agent',
      updatedAt: '2026-03-12T02:41:46Z',
    },
    {
      name: 'AgentHome',
      description: 'LLM-driven AI sandbox world with browser-based visualization.',
      language: 'Python',
      stars: 1,
      url: 'https://github.com/zeron-G/AgentHome',
      updatedAt: '2026-02-28T06:49:19Z',
    },
    {
      name: 'airi',
      description: 'Self-hosted companion system with realtime voice chat and cross-platform support.',
      language: 'Mixed',
      stars: 0,
      url: 'https://github.com/zeron-G/airi',
      updatedAt: '2026-03-05T12:33:56Z',
    },
    {
      name: 'paintweb',
      description: 'HTML-based graphical experiments and interfaces.',
      language: 'HTML',
      stars: 3,
      url: 'https://github.com/zeron-G/paintweb',
      updatedAt: '2026-02-24T05:56:43Z',
    },
  ],
}
