import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent } from 'react';

const GITHUB = 'https://github.com/aayush-github-564';
const LINKEDIN = 'https://www.linkedin.com/in/aayush-mishra564/';
const EMAIL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aayush.m2019@gmail.com';
const RESUME = '/resume.pdf';
const SECTION_IDS = ['about', 'work', 'experience', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

const projects = [
  {
    number: '01',
    name: 'AI-powered research assistant CLI',
    type: 'APPLIED AI · RAG',
    description:
      'A local-first command-line assistant that ingests documents, retrieves the most relevant passages, and answers with its sources attached.',
    stack: ['Python', 'RAG', 'SQLite', 'NumPy', 'Cohere', 'Gemini'],
    href: `${GITHUB}/research-assistant-cli`,
    art: 'research',
    metrics: [
      { value: '80%', label: 'Recall@5 on 20-query test set' },
      { value: '6,760+', label: 'indexed chunks' },
      { value: '56 tests', label: '96% core coverage' },
    ],
  },
  {
    number: '02',
    name: 'Distributed API rate limiter',
    type: 'DISTRIBUTED SYSTEMS',
    description:
      'A Redis-backed rate limiter that enforces limits atomically with Lua scripts, supporting three interchangeable strategies: fixed window, sliding window, and token bucket.',
    stack: ['Java', 'Spring Boot', 'Redis', 'Lua', 'Docker'],
    href: `${GITHUB}/distributed-rate-limiter-service`,
    art: 'rate',
    metrics: [
      { value: '~2,000', label: 'requests / second' },
      { value: '3', label: 'limiting strategies' },
    ],
  },
  {
    number: '03',
    name: 'URL shortener with analytics',
    type: 'BACKEND SERVICE',
    description:
      'A REST service for creating short links, handling redirects, and tracking click analytics, with Redis caching on the redirect path.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
    href: `${GITHUB}/url-shortener-service`,
    art: 'shortener',
    metrics: [
      { value: '~60%', label: 'lower read latency with caching.' },
      { value: '3', label: 'purpose-built APIs' },
    ],
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={`arrow ${diagonal ? 'arrow-diagonal' : ''}`}>↗</span>;
}

type ContactIconName = 'linkedin' | 'github' | 'mail' | 'resume';

function ContactIcon({ name }: { name: ContactIconName }) {
  if (name === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 8.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM3.7 9.7h3v10.1h-3V9.7Zm5.1 0h2.9v1.4h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2 3.8 4.5v5.9h-3v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8v5.3h-2.9V9.7Z" /></svg>;
  if (name === 'github') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.9 2.2 4.2 1.5.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.3 10.3 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.9 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v2.5c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" /></svg>;
  if (name === 'mail') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.5h8l4 4v13H6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M14 3.5v4h4M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function AvatarPortrait({ active }: { active: boolean }) {
  const [motion, setMotion] = useState({ rotateX: 0, rotateY: 0, pointerX: 50, pointerY: 50 });

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    setMotion({ rotateX: (0.5 - y) * 12, rotateY: (x - 0.5) * 12, pointerX: x * 100, pointerY: y * 100 });
  };

  const resetPointer = () => setMotion({ rotateX: 0, rotateY: 0, pointerX: 50, pointerY: 50 });
  const portraitStyle = {
    '--avatar-rotate-x': `${motion.rotateX}deg`,
    '--avatar-rotate-y': `${motion.rotateY}deg`,
    '--avatar-pointer-x': `${motion.pointerX}%`,
    '--avatar-pointer-y': `${motion.pointerY}%`,
  } as CSSProperties;

  return (
    <div className={`avatar-stage ${active ? 'is-journey-visible' : ''}`} style={portraitStyle} onPointerMove={trackPointer} onPointerLeave={resetPointer}>
      <div className="avatar-ground-shadow" aria-hidden="true" />
      <div className="avatar-pointer-glow" aria-hidden="true" />
      <img className="hero-avatar" src="/avatar.webp" alt="Aayush Mishra, software engineer, standing with arms crossed" fetchPriority="high" />
    </div>
  );
}
function ProjectArtwork({ type }: { type: string }) {
  if (type === 'research') {
    return (
      <div className="project-art research-art" aria-hidden="true">
        <div className="research-backdrop-grid" />
        <div className="research-window">
          <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>research-assistant / query</span><span className="window-state">● READY</span></div>
          <div className="terminal-body">
            <div className="terminal-prompt"><span className="prompt-symbol">&gt;_</span><span>Ask a question across your library</span></div>
            <div className="terminal-query">What drives reliable AI systems?<b className="cursor-block" /></div>
            <div className="terminal-divider"><span>RETRIEVAL PIPELINE</span><span>4 / 4 COMPLETE</span></div>
            <div className="pipeline">
              {['ingest', 'chunk', 'retrieve', 'synthesize'].map((step, index) => (
                <div className="pipeline-step" key={step}>
                  <span className="pipeline-index">0{index + 1}</span><span>{step}</span>
                </div>
              ))}
            </div>
            <div className="answer-box"><span className="answer-check">✓</span><span>Answer grounded in <b>retrieved sources</b></span><span className="answer-arrow">↗</span></div>
          </div>
        </div>
        <div className="research-orbit research-orbit-a" /><div className="research-orbit research-orbit-b" />
        <div className="artifact-chip artifact-top">RAG / LOCAL-FIRST</div><div className="artifact-chip artifact-bottom">74 TOPICS INDEXED</div>
      </div>
    );
  }
  if (type === 'rate') {
    return (
      <div className="project-art rate-art" aria-hidden="true">
        <div className="rate-topline"><span>REQUEST FLOW</span><span>FLOW / CONCEPT <b>●</b></span></div>
        <div className="request-stream">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--stream-i': i } as CSSProperties} />)}</div>
        <div className="bucket-wrap"><div className="bucket"><div className="bucket-fill" /><div className="bucket-tick tick-one" /><div className="bucket-tick tick-two" /><div className="bucket-tick tick-three" /><span>TOKEN<br />BUCKET</span></div><span className="bucket-label">REFILL · ATOMIC</span></div>
        <div className="rate-methods"><span>FIXED WINDOW</span><span>SLIDING WINDOW</span><span className="method-active">TOKEN BUCKET</span></div>
        <div className="rate-footer"><span>Redis + Lua</span><span>HTTP 429 when empty</span></div>
      </div>
    );
  }
  return (
    <div className="project-art shortener-art" aria-hidden="true">
      <div className="shortener-card">
        <span className="shortener-overline">ANALYTICS UI / SAMPLE DATA</span>
        <div className="link-row"><span className="link-icon">↗</span><span>example.com/<b>ideas</b></span><span className="link-copy">COPY</span></div>
        <div className="link-metrics"><span><small>CLICKS</small><b>1,284</b></span><span><small>THIS WEEK</small><b>+18.6%</b></span><span className="sparkline" /></div>
        <svg className="mini-chart" viewBox="0 0 360 78" preserveAspectRatio="none"><path d="M0 61 C22 55 27 57 43 46 S72 60 92 44 S120 45 138 35 S161 47 180 37 S205 37 221 24 S243 33 263 25 S286 39 304 19 S335 22 360 5" /><path className="chart-fill" d="M0 61 C22 55 27 57 43 46 S72 60 92 44 S120 45 138 35 S161 47 180 37 S205 37 221 24 S243 33 263 25 S286 39 304 19 S335 22 360 5 V78 H0Z" /></svg>
      </div>
      <div className="shortener-orbit-dot" /><span className="shortener-caption">REDIRECTS THAT FEEL INSTANT</span>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="project-card" data-reveal>
      <a className="project-art-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
        <ProjectArtwork type={project.art} />
        <span className="project-open"><Arrow diagonal /></span>
      </a>
      <div className="project-copy">
        <div className="project-kicker"><span>PROJECT {project.number}</span><span>{project.type}</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="project-metrics">
          {project.metrics.map((metric) => <div className="metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        </div>
        <div className="project-bottom"><div className="tag-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="text-link" href={project.href} target="_blank" rel="noreferrer">View on GitHub <Arrow diagonal /></a></div>
      </div>
    </article>
  );
}

function InProgressProject() {
  return (
    <article className="progress-card" data-reveal aria-labelledby="finpilot-title">
      <div className="progress-copy">
        <span className="progress-badge"><i /> IN PROGRESS</span>
        <h3 id="finpilot-title">FinPilot</h3>
        <p className="progress-description">An AI finance operations copilot for small businesses, covering invoice ingestion, transaction categorization, and cash-flow dashboards, with a chat agent that answers questions about the books.</p>
        <a className="text-link progress-github" href="https://github.com/aayush-github-564/fin-pilot" target="_blank" rel="noreferrer">View on GitHub <Arrow diagonal /></a>
      </div>
      <div className="progress-visual" aria-label="FinPilot project stages">
        <ol className="progress-stages">
          <li className="stage-complete"><span className="stage-node" aria-label="Complete">✓</span><span>Ingest</span></li>
          <li className="stage-complete"><span className="stage-node" aria-label="Complete">✓</span><span>Categorize</span></li>
          <li className="stage-current"><span className="stage-node" aria-label="Building now"><i /></span><span>Dashboards</span></li>
          <li className="stage-next"><span className="stage-node" aria-label="Next" /><span>Chat agent</span></li>
        </ol>
        <div className="progress-legend" aria-label="Stage status legend">
          <span><i className="legend-working" />Working</span>
          <span><i className="legend-building" />Building now</span>
          <span><i className="legend-next" />Next</span>
        </div>
        <p className="progress-status"><span>Status</span> invoice ingestion working, dashboards next</p>
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portraitActive, setPortraitActive] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | ''>('');
  const portraitRangeRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const range = portraitRangeRef.current;
    if (!range) return;
    if (!('IntersectionObserver' in window)) {
      setPortraitActive(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setPortraitActive(entry.isIntersecting), { threshold: 0 });
    observer.observe(range);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
    const hero = document.getElementById('top');
    const initialHash = window.location.hash.slice(1);
    const initialSection = SECTION_IDS.find((id) => id === initialHash) ?? null;
    let initialScrollPending = Boolean(initialSection);
    let initialScrollFrame = 0;
    let initialScrollTimer = 0;
    let observer: IntersectionObserver | undefined;
    const targets = [...(hero ? [hero] : []), ...sections];
    const visibility = new Map<HTMLElement, number>();
    const activeThresholds = new Map<HTMLElement, number>();

    const syncCurrentSection = (sectionId: SectionId | null) => {
      setActiveSection(sectionId ?? '');
      const hash = sectionId ? `#${sectionId}` : '';
      if (window.location.hash !== hash) {
        const url = `${window.location.pathname}${window.location.search}${hash}`;
        window.history.replaceState(window.history.state, '', url);
      }
    };

    if (initialSection) {
      setActiveSection(initialSection);
      initialScrollFrame = requestAnimationFrame(() => {
        const target = document.getElementById(initialSection);
        if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 96);
        initialScrollTimer = window.setTimeout(() => { initialScrollPending = false; }, 500);
      });
    }

    if (!('IntersectionObserver' in window)) return () => {
      if (initialScrollFrame) cancelAnimationFrame(initialScrollFrame);
      if (initialScrollTimer) window.clearTimeout(initialScrollTimer);
    };

    const observeSections = () => {
      observer?.disconnect();
      visibility.clear();
      activeThresholds.clear();
      const rootHeight = Math.max(1, window.innerHeight - 96);
      targets.forEach((target) => activeThresholds.set(target, Math.min(1, (rootHeight * 0.4) / Math.max(target.getBoundingClientRect().height, 1))));
      const thresholds = [...new Set([0, ...activeThresholds.values()])].sort((a, b) => a - b);
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => visibility.set(entry.target as HTMLElement, entry.isIntersecting ? entry.intersectionRatio : 0));
        const active = [...visibility.entries()]
          .filter(([target, ratio]) => SECTION_IDS.includes(target.id as SectionId) && ratio >= (activeThresholds.get(target) ?? 0.4))
          .sort((a, b) => (b[1] / (activeThresholds.get(b[0]) ?? 0.4)) - (a[1] / (activeThresholds.get(a[0]) ?? 0.4)))[0]?.[0];
        if (active) {
          syncCurrentSection(active.id as SectionId);
        } else if (!initialScrollPending && hero && (visibility.get(hero) ?? 0) >= (activeThresholds.get(hero) ?? 0.4)) {
          syncCurrentSection(null);
        }
      }, { rootMargin: '-96px 0px 0px 0px', threshold: thresholds });
      targets.forEach((target) => observer?.observe(target));
    };

    observeSections();
    window.addEventListener('resize', observeSections);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', observeSections);
      if (initialScrollFrame) cancelAnimationFrame(initialScrollFrame);
      if (initialScrollTimer) window.clearTimeout(initialScrollTimer);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const updateScale = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const about = aboutSectionRef.current;
        if (!about) return;
        const aboutBounds = about.getBoundingClientRect();
        const portrait = document.querySelector<HTMLElement>('.avatar-stage');
        if (portrait) {
          const start = window.innerHeight * 0.96;
          const end = window.innerHeight * 0.1;
          const progress = Math.max(0, Math.min(1, (start - aboutBounds.top) / (start - end)));
          const scale = reduceMotion ? 1 : 1 + progress * 0.1;
          portrait.style.setProperty('--avatar-scroll-scale', String(scale));
          const bounds = portrait.getBoundingClientRect();
          const scaleY = bounds.height / Math.max(portrait.offsetHeight, 1);
          const clippedBottom = Math.max(0, Math.min(portrait.offsetHeight, (bounds.bottom - aboutBounds.bottom) / scaleY));
          portrait.style.setProperty('--avatar-clip-bottom', `${clippedBottom}px`);
        }
      });
    };
    window.addEventListener('scroll', updateScale, { passive: true });
    window.addEventListener('resize', updateScale);
    updateScale();
    return () => {
      window.removeEventListener('scroll', updateScale);
      window.removeEventListener('resize', updateScale);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const goToAnchor = (id: SectionId | 'top') => {
    const target = document.getElementById(id);
    if (!target) return;
    const sectionId = SECTION_IDS.find((section) => section === id) ?? null;
    setActiveSection(sectionId ?? '');
    const hash = sectionId ? `#${sectionId}` : '';
    if (window.location.hash !== hash) {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
  };
  const handleAnchorClick = (id: SectionId | 'top') => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();
    goToAnchor(id);
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#top" onClick={handleAnchorClick('top')} aria-label="Aayush Mishra home"><span className="brand-logo-frame"><img src="/logo-dark.jpg" alt="" /></span><span className="brand-name">AAYUSH MISHRA</span></a>
        <button className={`menu-toggle ${menuOpen ? 'menu-open' : ''}`} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
        <nav className={`site-nav ${menuOpen ? 'nav-open' : ''}`} id="site-nav" aria-label="Main navigation">
          <a href="#about" className={activeSection === 'about' ? 'is-active' : undefined} aria-current={activeSection === 'about' ? 'location' : undefined} onClick={handleAnchorClick('about')}>About</a>
          <a href="#work" className={activeSection === 'work' ? 'is-active' : undefined} aria-current={activeSection === 'work' ? 'location' : undefined} onClick={handleAnchorClick('work')}>Work</a>
          <a href="#experience" className={activeSection === 'experience' ? 'is-active' : undefined} aria-current={activeSection === 'experience' ? 'location' : undefined} onClick={handleAnchorClick('experience')}>Experience</a>
          <a href="#contact" className={activeSection === 'contact' ? 'is-active' : undefined} aria-current={activeSection === 'contact' ? 'location' : undefined} onClick={handleAnchorClick('contact')}>Contact</a>
          <a className="nav-resume" href={RESUME} download="Aayush-Mishra-Resume.pdf" onClick={closeMenu}>
            Resume
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.5v7m0 0 2.5-2.5M8 9.5 5.5 7M3 10.5v2h10v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </nav>
      </header>

      <aside className="social-rail" aria-label="Quick links">
        <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><ContactIcon name="linkedin" /></a>
        <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><ContactIcon name="github" /></a>
        <a href={EMAIL} target="_blank" rel="noreferrer" aria-label="Compose an email" title="Email"><ContactIcon name="mail" /></a>
        <a href={RESUME} download aria-label="Download resume" title="Resume"><ContactIcon name="resume" /></a>
      </aside>

      <main id="main">
        <div className="hero-about-range" ref={portraitRangeRef}>
          <section className="hero" id="top">
            <div className="hero-grain" aria-hidden="true" />
            <div className="hero-main page-wrap">
              <div className="hero-content">
                <div className="eyebrow"><span className="availability-dot" /> OPEN TO SOFTWARE ENGINEER · AI-NATIVE · AI ENGINEER ROLES</div>
                <h1><span>Software, AI,</span><span>&amp; the systems</span><span className="hero-accent">that connect them.</span></h1>
                <p className="hero-intro">I'm Aayush, software engineer building backend and applied AI systems.</p>
                <div className="hero-actions"><a className="button button-lime" href="#work" onClick={handleAnchorClick('work')}>View projects <Arrow /></a><a className="button button-quiet" href="#contact" onClick={handleAnchorClick('contact')}>Get in touch <span className="button-dot">↗</span></a></div>
              </div>
            </div>
          </section>

          <section className="about-section" id="about" ref={aboutSectionRef}>
            <div className="about-inner">
              <div className="about-copy">
                <span className="section-index">01 / ABOUT</span>
                <h2>Hi, I'm Aayush.</h2>
                <p className="about-lead">I like software that keeps working at 3 a.m. and stays readable the morning after.</p>
                <p className="about-story">I started out exploring, and building turned into how I figure things out.</p>
                <p className="about-location"><span>Based in</span> Bengaluru, India</p>
                <p className="about-current"><span>Currently</span>Turning an old phone into a small home server, to see how much it can actually run.</p>
              </div>
            </div>
          </section>
          <AvatarPortrait active={portraitActive} />
        </div>

        <section className="work-section section-pad" id="work">
          <div className="page-wrap">
            <div className="section-head" data-reveal><div><span className="section-index">02 / WORK</span><h2>Selected Work.</h2></div><p className="section-aside">Three things I've built,<br />and one I'm building.</p></div>
            <div className="project-list">
              {projects.map((project) => <ProjectCard project={project} key={project.number} />)}
            </div>
            <InProgressProject />
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="experience-inner page-wrap">
            <div className="experience-heading" data-reveal><span className="section-index section-index-light">03 / TIMELINE</span><h2>Experience</h2></div>
            <div className="timeline" data-reveal>
              <article className="timeline-entry timeline-entry-featured">
                <div className="timeline-marker"><span className="timeline-node timeline-node-current" /></div>
                <div className="timeline-date"><span>JUL 2026 – PRESENT</span><span className="role-now"><i /> NOW</span></div>
                <div className="timeline-content">
                  <h3 className="role-title">Software Engineer - Technology &amp; AI</h3>
                  <p className="role-company">Memoire Ventures Pvt Ltd <span>·</span> Bengaluru, India</p>
                  <p className="company-context">Operates Café Memoire - a physical cafe brand, currently expanding into retail, consulting, and technology.</p>
                  <p className="role-lead">I'm the engineer behind Memoire Ventures' technology - I work out what the business needs, then design, build, and ship it.</p>
                  <div className="role-work">
                    <div><span className="role-work-index">01</span><div className="role-work-detail"><p>Building CafeOS, a multi-tenant operations platform for Cafe Memoire: JWT auth, tenant setup, and SOP & checklist management.</p><div className="role-stack"><span>Java</span><span>Spring Boot</span><span>Supabase</span><span>PostgreSQL</span><span>Redis</span></div></div></div>
                    <div><span className="role-work-index">02</span><div className="role-work-detail"><p>Created an AI workflow that monitors Cafe Memoire's Google Reviews, generates & publishes responses, and alerts the team to issues.</p><div className="role-stack"><span>Python</span><span>n8n</span><span>LLM APIs</span></div></div></div>
                  </div>
                  <p className="timeline-next"><span>Next</span> Scoping a company-wide web platform for Memoire Ventures.</p>
                </div>
              </article>
              <article className="timeline-entry timeline-entry-compact">
                <div className="timeline-marker"><span className="timeline-node" /></div>
                <div className="timeline-date"><span>2022 – 2026</span></div>
                <p className="timeline-compact-copy"><strong>B.E.</strong> · R.V. Institute of Technology and Management, Bangalore</p>
              </article>
              <article className="timeline-entry timeline-entry-compact">
                <div className="timeline-marker"><span className="timeline-node" /></div>
                <div className="timeline-date"><span>2025</span></div>
                <p className="timeline-compact-copy"><strong>Robofiesta Hack-A-Day</strong> · 1st out of 18 teams · Built a face-recognition attendance system</p>
              </article>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-grid page-wrap" data-reveal>
            <div className="contact-heading"><span className="contact-index">04 / CONTACT</span><h2>Let's talk.</h2><p>Hiring, or have a problem worth solving? Email is fastest.</p></div>
            <div className="contact-actions">
              <a className="contact-action contact-action-primary" href={EMAIL} target="_blank" rel="noreferrer"><span className="contact-action-icon"><ContactIcon name="mail" /></span><span><small>EMAIL</small><strong>Write me a note</strong><em>aayush.m2019@gmail.com</em></span><Arrow diagonal /></a>
              <a className="contact-action" href={GITHUB} target="_blank" rel="noreferrer"><span className="contact-action-icon"><ContactIcon name="github" /></span><span><small>CODE</small><strong>Explore GitHub</strong><em>Projects & experiments</em></span><Arrow diagonal /></a>
              <a className="contact-action" href={LINKEDIN} target="_blank" rel="noreferrer"><span className="contact-action-icon"><ContactIcon name="linkedin" /></span><span><small>NETWORK</small><strong>Connect on LinkedIn</strong><em>Let’s keep in touch</em></span><Arrow diagonal /></a>
              <a className="contact-action contact-action-resume" href={RESUME} download><span className="contact-action-icon"><ContactIcon name="resume" /></span><span><small>RESUME</small><strong>Download my resume</strong><em>PDF · Aayush Mishra</em></span><Arrow diagonal /></a>
            </div>
          </div>
          <footer className="site-footer page-wrap"><span>© 2026 Aayush Mishra</span><a href="#top" onClick={handleAnchorClick('top')}>Back to top ↑</a></footer>
        </section>
      </main>
    </>
  );
}

export default App;
