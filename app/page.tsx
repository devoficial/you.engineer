const metrics = [
  { value: "15+", label: "products supported" },
  { value: "80%", label: "faster integration" },
  { value: "95%", label: "faster staging deploys" },
  { value: "60%", label: "less manual intervention" },
];

const caseStudies = [
  {
    number: "01",
    type: "PLATFORM ENGINEERING",
    title: "A shared UI platform for a 15+ product fintech suite.",
    summary:
      "Built common components, observability foundations, and configuration-driven localization that helped independent teams ship with a more consistent system.",
    facts: ["React + TypeScript", "15+ products", "3× localization cycles"],
  },
  {
    number: "02",
    type: "PRODUCT ARCHITECTURE",
    title: "Decoupling reconciliation workflows from a monolith.",
    summary:
      "Led a headless-hook architecture with React and Zustand, turning a tightly coupled product surface into composable modules that teams could integrate independently.",
    facts: ["Headless architecture", "80% faster", "2+ weeks saved"],
  },
  {
    number: "03",
    type: "WORKFLOW AUTOMATION",
    title: "Making enterprise tax filing more reliable.",
    summary:
      "Shipped a TypeScript microfrontend and hardened Cypress automation around complex government-site workflows, improving completion while reducing human intervention.",
    facts: ["Microfrontend", "+77.9% success", "−60% intervention"],
  },
];

const experience = [
  {
    period: "AUG 2025 — NOW",
    role: "Senior Software Engineer",
    company: "LegalZoom",
    detail:
      "Building full-stack product systems across Go, React, and TypeScript while expanding into AI-enabled workflows.",
  },
  {
    period: "OCT 2021 — JUL 2025",
    role: "Software Engineer II · UI",
    company: "Clear",
    detail:
      "Owned frontend platform and product architecture across shared libraries, reconciliation, enterprise filing, localization, observability, and delivery tooling.",
  },
  {
    period: "APR 2020 — OCT 2021",
    role: "Software Engineer I",
    company: "Clear",
    detail:
      "Built fintech product surfaces, notification and messaging infrastructure, and reusable React systems across the product suite.",
  },
  {
    period: "NOV 2018 — MAR 2020",
    role: "Software Engineer",
    company: "MountBlue Technologies",
    detail:
      "Developed production web applications and established the full-stack foundation behind a platform-focused career.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Debasis Nath, home">
          DN<span className="signal">.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#lab">AI Lab</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </div>
        <a
          className="availability"
          href="https://www.linkedin.com/in/i-m-dev21/"
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true" /> Open to conversations
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">SENIOR SOFTWARE ENGINEER · LEGALZOOM</p>
          <h1>
            I build product systems that make <em>complexity</em> feel simple.
          </h1>
          <p className="hero-summary">
            I’m Debasis Nath, a full-stack engineer with deep frontend-platform
            roots. I work across Go, React, and TypeScript—and I’m extending
            that systems mindset into agentic AI and MCP.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore selected work <span aria-hidden="true">↘</span>
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/devoficial"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <aside className="hero-console" aria-label="Current professional focus">
          <div className="console-top">
            <span>PROFILE / 2026</span>
            <span className="console-status">ONLINE</span>
          </div>
          <div className="console-mark">D/N</div>
          <dl>
            <div>
              <dt>NOW</dt>
              <dd>LegalZoom · Senior Software Engineer</dd>
            </div>
            <div>
              <dt>STACK</dt>
              <dd>Go · React · TypeScript · JavaScript</dd>
            </div>
            <div>
              <dt>FOCUS</dt>
              <dd>Product systems · Agentic AI · MCP</dd>
            </div>
            <div>
              <dt>LEARNING</dt>
              <dd>BS Data Science · IIT Madras</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="metrics" aria-label="Selected impact metrics">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="section work-section" id="work">
        <header className="section-heading">
          <div>
            <p className="eyebrow">SELECTED SYSTEMS / 01—03</p>
            <h2>Work measured by what changed.</h2>
          </div>
          <p>
            Sanitized stories from production work—focused on constraints,
            engineering decisions, and outcomes instead of feature lists.
          </p>
        </header>

        <div className="case-list">
          {caseStudies.map((study) => (
            <article className="case-card" key={study.number}>
              <div className="case-meta">
                <span>{study.number}</span>
                <span>{study.type}</span>
              </div>
              <h3>{study.title}</h3>
              <p>{study.summary}</p>
              <ul aria-label="Case study highlights">
                {study.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              <div className="case-line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="lab-section" id="lab">
        <div className="lab-intro">
          <p className="eyebrow eyebrow-light">AI SYSTEMS LAB / BUILDING IN PUBLIC</p>
          <h2>From product engineer to production AI systems engineer.</h2>
          <p>
            A build-first journey through evaluation, agents, production ML,
            inference, and Edge AI. Progress is earned through tested artifacts,
            benchmarks, and engineering reports—not course completion badges.
          </p>
          <a
            className="text-link text-link-light"
            href="https://github.com/devoficial/edge-ai-journey"
            target="_blank"
            rel="noreferrer"
          >
            Follow the journey <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="lab-board">
          <div className="lab-status">
            <span className="status-dot" aria-hidden="true" />
            CURRENT PHASE · FOUNDATIONS + GEN AI SYSTEMS
          </div>
          <article className="lab-project lab-project-featured">
            <div>
              <span className="project-tag">IN PROGRESS</span>
              <h3>AI Systems Engineering Journey</h3>
            </div>
            <p>
              A public roadmap and engineering journal spanning evaluated RAG,
              bounded agents, production ML, CUDA, TensorRT, and device-aware inference.
            </p>
            <a
              className="project-index"
              href="https://edge-ai-journey.netlify.app/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open the live AI Systems Engineering Journey"
            >
              A01 · LIVE ↗
            </a>
          </article>
          <article className="lab-project">
            <div>
              <span className="project-tag project-tag-built">BUILT</span>
              <h3>Nasdaq Learning Lab</h3>
            </div>
            <p>
              An offline-first learning product with sequential modules, quizzes,
              calculators, journaling, data portability, and installable PWA behavior.
            </p>
            <a
              href="https://github.com/devoficial/trading-journey"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Nasdaq Learning Lab on GitHub"
            >
              A02 ↗
            </a>
          </article>
          <div className="lab-next">
            <span>NEXT EVIDENCE</span>
            <p>Evaluated RAG system · constrained tool agent · benchmark report</p>
          </div>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <header className="section-heading compact-heading">
          <div>
            <p className="eyebrow">EXPERIENCE / 2018—NOW</p>
            <h2>A platform mindset, across the stack.</h2>
          </div>
        </header>
        <div className="timeline">
          {experience.map((item, index) => (
            <article className="timeline-row" key={`${item.company}-${item.role}`}>
              <span className="timeline-index">0{index + 1}</span>
              <time>{item.period}</time>
              <div>
                <h3>{item.role}</h3>
                <p className="company">{item.company}</p>
              </div>
              <p className="timeline-detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-copy">
          <p className="eyebrow">OPERATING PRINCIPLES</p>
          <h2>Build the system. Measure the change. Explain the tradeoff.</h2>
        </div>
        <div className="principles">
          <article>
            <span>01</span>
            <h3>Evidence over theatre.</h3>
            <p>A benchmark, shipped artifact, or measured outcome beats a long technology list.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Platforms serve teams.</h3>
            <p>Good architecture reduces the cost of change for the engineers and products around it.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Reliability is a feature.</h3>
            <p>Observability, fallbacks, evaluation, and failure handling belong in the design from day one.</p>
          </article>
        </div>
        <div className="education-card">
          <span className="education-code">EDU / ACTIVE</span>
          <div>
            <h3>BS in Data Science</h3>
            <p>Indian Institute of Technology Madras · Ongoing</p>
          </div>
          <p className="education-note">
            Formal data-science study alongside independent production AI and Edge AI engineering.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <p className="eyebrow eyebrow-light">LET’S BUILD THE NEXT SYSTEM</p>
        <h2>Have a hard product or platform problem?</h2>
        <div className="contact-actions">
          <a
            className="button button-light"
            href="https://www.linkedin.com/in/i-m-dev21/"
            target="_blank"
            rel="noreferrer"
          >
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
          <a
            className="text-link text-link-light"
            href="https://github.com/devoficial"
            target="_blank"
            rel="noreferrer"
          >
            github.com/devoficial
          </a>
        </div>
      </section>

      <footer>
        <a className="wordmark footer-mark" href="#top">
          DN<span className="signal">.</span>
        </a>
        <p>Senior software engineer · Product systems · AI-enabled workflows</p>
        <p>© 2026 Debasis Nath</p>
      </footer>
    </main>
  );
}
