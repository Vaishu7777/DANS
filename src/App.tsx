import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Circle,
  Cpu,
  Gauge,
  Headphones,
  Mic,
  Pause,
  Play,
  Radio,
  Send,
  Shield,
  Sparkles,
  Volume2,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Scenario = 'ENGINE' | 'WIND / ROTOR' | 'IMPULSE' | 'UNKNOWN'

type ChatEntry = {
  request: string
  response: string
}

const scenarioOrder: Scenario[] = ['ENGINE', 'WIND / ROTOR', 'IMPULSE', 'UNKNOWN']

const scenarios: Record<
  Scenario,
  { kind: string; confidence: string; mode: string; detail: string; color: string }
> = {
  ENGINE: {
    kind: 'STATIONARY',
    confidence: '92%',
    mode: 'NLMS FILTERING',
    detail: 'Stable spectral profile · adaptive suppression',
    color: '#bbf77a',
  },
  'WIND / ROTOR': {
    kind: 'NON-STATIONARY',
    confidence: '84%',
    mode: 'LIGHTWEIGHT GRU',
    detail: 'Changing airflow and rotor conditions',
    color: '#72ebd7',
  },
  IMPULSE: {
    kind: 'IMPULSIVE',
    confidence: '98%',
    mode: 'IMPULSE PROTECTION',
    detail: 'Transient detected · fast recovery',
    color: '#ffb36d',
  },
  UNKNOWN: {
    kind: 'UNKNOWN',
    confidence: '41%',
    mode: 'SAFE HYBRID',
    detail: 'Low confidence · preserve speech safely',
    color: '#b6c4d9',
  },
}

function CinematicVideo({
  src,
  poster,
  className = '',
}: {
  src: string
  poster?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.play().catch(() => undefined)
          } else {
            element.pause()
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  if (missing || !src) {
    return (
      <div
        className={`video-fallback ${className}`}
        style={{ backgroundImage: poster ? `url(${poster})` : undefined }}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      onError={() => setMissing(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

function Waveform({ active = true, impulse = false }: { active?: boolean; impulse?: boolean }) {
  const heights = [16, 24, 18, 30, 42, 58, 36, 22, 44, 64, 32, 20, 48, 70, 34, 18, 40, 66, 28, 14, 52, 62, 38, 24, 46, 68, 26, 12, 58, 54, 30, 18]

  return (
    <div className={`wave ${active ? 'on' : ''} ${impulse ? 'impulse' : ''}`}>
      {heights.map((height, index) => (
        <span key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  )
}

function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="mountain back" />
      <div className="mountain mid" />
      <div className="mountain front" />
      <div className="fog fog-a" />
      <div className="fog fog-b" />
      <div className="helicopter">✦</div>
      <div className="convoy">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function Section({
  id,
  eyebrow,
  title,
  children,
  dark = false,
}: {
  id: string
  eyebrow: string
  title: React.ReactNode
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <section id={id} className={`section ${dark ? 'dark' : ''}`}>
      <div className="section-head">
        <span className="label accent">{eyebrow}</span>
        <span className="label muted">DANS / SYSTEM FIELD</span>
      </div>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function App() {
  const [scenario, setScenario] = useState<Scenario>('ENGINE')
  const [demoMode, setDemoMode] = useState(false)
  const [danOpen, setDanOpen] = useState(false)
  const [danInput, setDanInput] = useState('')
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      request: 'What is DANS?',
      response:
        'DANS is a confidence-aware hybrid AI-DSP system for adaptive defence communication. It learns the environment, estimates confidence, and routes audio to the safest processing path.',
    },
  ])

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.1])

  const active = scenarios[scenario]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const submitDan = (raw: string) => {
    const question = raw.trim()
    if (!question) return

    const lower = question.toLowerCase()

    if (lower.includes('stationary') || lower.includes('nlms')) setScenario('ENGINE')
    if (lower.includes('wind') || lower.includes('rotor') || lower.includes('gru')) setScenario('WIND / ROTOR')
    if (lower.includes('impulse') || lower.includes('simulate')) setScenario('IMPULSE')
    if (lower.includes('safe hybrid') || lower.includes('unknown')) setScenario('UNKNOWN')
    if (lower.includes('start demo') || lower.includes('start the demo')) setDemoMode(true)
    if (lower.includes('stop') || lower.includes('stop demo')) setDemoMode(false)

    let response =
      'DANS is currently in demonstration mode. It detects the acoustic environment, estimates confidence, and selects the safest adaptive processing strategy.'

    if (lower.includes('what is dans')) {
      response =
        'DANS is a confidence-aware hybrid AI-DSP system for adaptive defence communication. It listens to the environment, estimates noise type and confidence, then routes the signal to the appropriate processing path.'
    }
    if (lower.includes('routing') || lower.includes('adaptive')) {
      response =
        'The adaptive router compares the current noise class and confidence level, then selects the most suitable path: NLMS for stationary noise, GRU for non-stationary conditions, impulse protection for transients, or safe hybrid when confidence drops.'
      scrollToSection('routing')
    }
    if (lower.includes('prototype') || lower.includes('device')) {
      response =
        'The field device concept is a tactical headset with a boom microphone and compact edge processor, designed to preserve speech in noisy defence environments.'
      scrollToSection('device')
    }
    if (lower.includes('validation') || lower.includes('measure')) {
      response =
        'Validation is kept honest: live measurements are displayed only when connected to the real pipeline. Benchmarks remain pending unless measured results are available.'
      scrollToSection('validation')
    }
    if (lower.includes('system status') || lower.includes('what is dans doing') || lower.includes('right now')) {
      response = `DANS is currently in demonstration mode. Noise class is ${active.kind}, confidence is ${active.confidence}, and the active processing path is ${active.mode}.`
    }
    if (lower.includes('how does dans work')) {
      response =
        'A microphone captures speech and noise, the signal is framed and analysed, a confidence engine estimates the environment, and the router selects the best processing branch before speech is protected and restored.'
      scrollToSection('intelligence')
    }
    if (lower.includes('explain') && lower.includes('route')) {
      response =
        'The adaptive router is the decision layer of DANS. It is not a single algorithm: it switches between stationary filtering, lightweight GRU adaptation, impulse protection, or safe fallback depending on signal conditions.'
      scrollToSection('routing')
    }

    setMessages((prev) => [...prev, { request: question, response }])
    setDanInput('')
  }

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />

      <nav className="topbar">
        <a href="#top" className="brand">
          DANS <span>01 / 07</span>
        </a>

        <div className="nav-links">
          <a href="#problem">PROBLEM</a>
          <a href="#intelligence">INTELLIGENCE</a>
          <a href="#routing">ROUTING</a>
          <a href="#demo">DEMO</a>
          <a href="#technology">TECHNOLOGY</a>
          <a href="#device">DEVICE</a>
          <a href="#validation">VALIDATION</a>
        </div>

        <button className="nav-cta" onClick={() => scrollToSection('demo')}>
          <Circle size={8} fill="currentColor" />
          <span>SYSTEM READY</span>
          <ArrowUpRight size={14} />
        </button>
      </nav>

      <motion.header id="top" className="hero" style={{ y: heroY, opacity: heroOpacity }}>
        <Atmosphere />

        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="status-strip">
            <span className="pulse-dot" />
            DANS SYSTEM READY
            <span className="mono">// DEMO MODE</span>
          </div>

          <h1>
            <span className="display-name">DANS</span>
            <span className="display-title">DEFENCE ADAPTIVE NOISE SUPPRESSION SYSTEM</span>
          </h1>

          <p className="hero-quote">
            “WHEN THE NOISE CHANGES,<br />
            DANS CHANGES WITH IT.”
          </p>

          <p className="hero-lead">
            A confidence-aware hybrid AI-DSP system for adaptive defence communication.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollToSection('demo')}>
              START JURY DEMO
              <ArrowUpRight size={16} />
            </button>
            <button className="ghost-button" onClick={() => scrollToSection('intelligence')}>
              EXPLORE DANS
              <ArrowDown size={16} />
            </button>
          </div>
        </div>

        <div className="hero-footer">
          <span className="label muted">LADAKH SECTOR · 34°09′N 77°34′E</span>
          <div className="mic-readout">
            <Mic size={15} />
            <Waveform />
            <span className="mono">CAPTURING SIGNAL</span>
          </div>
          <span className="label muted">SCROLL TO ENTER SYSTEM ↓</span>
        </div>
      </motion.header>

      <Section id="problem" eyebrow="01 / THE PROBLEM" title={<>The battlefield<br /><i>is not one sound.</i></>}>
        <div className="problem-layout">
          <div className="scene-frame">
            <CinematicVideo
              src="/videos/dans-problem.mp4"
              poster="/images/dans-problem-poster.jpg"
              className="scene-video"
            />
            <div className="scene-meta">
              <span className="label accent">LIVE ENVIRONMENT</span>
              <strong>VALLEY / 06:42</strong>
              <span className="mono">WIND · ENGINE · ROTOR</span>
            </div>
          </div>

          <div className="problem-copy">
            <p>
              Defence communication environments continuously change between stationary,
              non-stationary and impulsive noise.
            </p>

            <div className="noise-list">
              {['ENGINE', 'WIND', 'ROTOR', 'IMPULSE'].map((entry, index) => (
                <div key={entry} className="noise-item">
                  <span className="label">0{index + 1}</span>
                  <span>{entry}</span>
                  <Waveform active={index < 3} />
                </div>
              ))}
            </div>

            <div className="speech-loss">
              <span className="label accent">SPEECH SIGNAL</span>
              <Waveform impulse />
            </div>
          </div>
        </div>
      </Section>

      <Section id="intelligence" eyebrow="02 / DANS INTELLIGENCE" title={<>DANS listens.<br /><i>DANS decides.</i></>} dark>
        <div className="intelligence-layout">
          <div className="core-visual">
            <div className="orbit orbit-1" />
            <div className="orbit orbit-2" />
            <div className="dans-core">
              <Sparkles size={22} />
              <b>
                DANS
                <br />
                AI CORE
              </b>
              <span className="mono">PROCESSING</span>
            </div>
          </div>

          <div className="intel-panel">
            <div className="panel-header">
              <span className="label accent">AUDIO CLASSIFIER / ONLINE</span>
              <span className="status-pill">● DEMO VALUE</span>
            </div>

            <div className="metric-row">
              <span>NOISE CLASS</span>
              <b>{active.kind}</b>
            </div>
            <div className="metric-row">
              <span>CONFIDENCE</span>
              <b className="green-text">{active.confidence}</b>
            </div>
            <div className="metric-row">
              <span>PROCESSING</span>
              <b>{active.mode}</b>
            </div>

            <Waveform />
          </div>
        </div>

        <div className="pipeline">
          {['MICROPHONE', 'STFT', 'VAD', 'NOISE CLASSIFIER', 'CONFIDENCE', 'ROUTER'].map((item, index) => (
            <div key={item} className="pipeline-step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{item}</b>
              {index < 5 && <ChevronRight size={14} />}
            </div>
          ))}
        </div>
      </Section>

      <Section id="routing" eyebrow="03 / ADAPTIVE ROUTER" title={<>One system.<br /><i>Four responses.</i></>}>
        <div className="router-layout">
          <div className="router-core">
            <Radio size={18} />
            <span className="label accent">DANS</span>
            <b>
              ADAPTIVE
              <br />
              ROUTER
            </b>
            <small className="mono">ACTIVE PATH →</small>
          </div>

          <div className="route-grid">
            {scenarioOrder.map((name) => (
              <button
                key={name}
                className={`route-card ${scenario === name ? 'selected' : ''}`}
                onClick={() => setScenario(name)}
                style={{ ['--accent' as string]: scenarios[name].color }}
              >
                <div className="route-line" />
                <span className="label">{name}</span>
                <strong>{scenarios[name].kind}</strong>
                <b>{scenarios[name].mode}</b>
                <small>{scenario === name ? '● SIGNAL ROUTED' : 'SELECT SCENARIO'}</small>
              </button>
            ))}
          </div>
        </div>

        <p className="router-quote">
          DANS does not force one algorithm.<br />
          <i>It selects the appropriate processing strategy.</i>
        </p>
      </Section>

      <Section id="demo" eyebrow="04 / LIVE DANS DEMO" title={<>Watch DANS<br /><i>adapt.</i></>} dark>
        <div className="demo-layout">
          <div className="demo-visual">
            <div className="demo-status">
              <span className="pulse-dot" />
              DEMO MODE / NO BACKEND CONNECTED
            </div>

            <div className="signal-box">
              <Waveform impulse={scenario === 'IMPULSE'} />
              <span className="mono">INPUT AUDIO STREAM</span>
            </div>

            <div className="demo-result">
              <span className="label accent">ACTIVE PROCESSING PATH</span>
              <strong style={{ color: active.color }}>{active.mode}</strong>
              <p>{active.detail}</p>
            </div>
          </div>

          <div className="demo-controls">
            <div className="control-header">
              <span className="label accent">SCENARIO SELECT</span>
              <span className="mono">{scenario}</span>
            </div>

            {scenarioOrder.map((name) => (
              <button
                key={name}
                className={scenario === name ? 'control-button active' : 'control-button'}
                onClick={() => setScenario(name)}
              >
                <span>
                  <span className="dot" />
                  {name}
                </span>
                <ChevronRight size={14} />
              </button>
            ))}

            <div className="control-actions">
              <button className="primary-button small" onClick={() => setDemoMode((prev) => !prev)}>
                {demoMode ? <Pause size={15} /> : <Play size={15} />}
                {demoMode ? 'STOP' : 'START'} MICROPHONE
              </button>
              <button className="ghost-button small" onClick={() => setScenario('IMPULSE')}>
                <Zap size={15} />
                SIMULATE IMPULSE
              </button>
            </div>
          </div>
        </div>

        <div className="telemetry-grid">
          {[
            ['LATENCY', '—'],
            ['CPU', '—'],
            ['RAM', '—'],
            ['SYSTEM STATUS', demoMode ? 'LIVE' : 'DEMO MODE'],
          ].map(([label, value]) => (
            <div key={label} className="telemetry-box">
              <span className="label muted">{label}</span>
              <b>{value}</b>
              <small>NOT MEASURED</small>
            </div>
          ))}
        </div>
      </Section>

      <Section id="technology" eyebrow="05 / THE STACK" title={<>Designed for the<br /><i>edge.</i></>}>
        <div className="tech-grid">
          {[
            ['STFT / iSTFT', 'Audio processing', Radio],
            ['WEBRTC VAD', 'Speech protection', Mic],
            ['NLMS', 'Stationary noise', Gauge],
            ['LIGHTWEIGHT GRU', 'Non-stationary noise', Cpu],
            ['IMPULSE GUARD', 'Transient protection', Shield],
            ['ONNX + INT8', 'Edge optimization', Zap],
          ].map(([label, text, Icon]) => (
            <div key={label as string} className="tech-card">
              <Icon size={18} />
              <span className="label accent">{label as string}</span>
              <b>{text as string}</b>
              <div className="tech-line" />
            </div>
          ))}
        </div>
      </Section>

      <Section id="device" eyebrow="06 / FIELD DEVICE" title={<>From signal<br /><i>to field.</i></>} dark>
        <div className="device-layout">
          <div className="device-visual">
            <div className="device-glow" />
            <div className="device-box">
              <span>DANS</span>
              <small>EDGE PROCESSOR</small>
              <div className="leds">● ● ●</div>
            </div>
            <div className="headset-visual">
              <Headphones size={94} />
            </div>
          </div>

          <div className="callout-list">
            {[
              ['MICROPHONE', 'Speech + noise capture'],
              ['AI + DSP', 'Adaptive processing'],
              ['CONFIDENCE ROUTING', 'Decision engine'],
              ['IMPULSE PROTECTION', 'Transient protection'],
              ['CLEAR SPEECH', 'Enhanced output'],
            ].map(([label, text], index) => (
              <div key={label} className="callout-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <b>{label}</b>
                <small>{text}</small>
              </div>
            ))}
            <p className="device-note">CONCEPT / TARGET FORM FACTOR<br />Not a finished production device.</p>
          </div>
        </div>
      </Section>

      <Section id="validation" eyebrow="07 / VALIDATION" title={<>Don't just claim it.<br /><i>Measure it.</i></>}>
        <div className="validation-layout">
          <div className="comparison-chart">
            <div className="chart-header">
              <span className="label accent">OFFLINE VALIDATION</span>
              <span className="mono">BENCHMARK PENDING</span>
            </div>

            {['NOISY', 'NLMS', 'AI', 'DANS'].map((label, index) => (
              <div key={label} className="chart-bar">
                <span>{label}</span>
                <div className="bar-wrap">
                  <i style={{ height: `${25 + index * 18}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="metric-list">
            {['SNR IMPROVEMENT', 'STOI', 'PESQ', 'SI-SNR', 'LATENCY', 'CPU / RAM'].map((label) => (
              <div key={label} className="metric-item">
                <span className="label">{label}</span>
                <b>BENCHMARK PENDING</b>
              </div>
            ))}
          </div>
        </div>

        <p className="validation-note">
          <Shield size={16} />
          Measured results are displayed only when connected to the real validation pipeline.
        </p>
      </Section>

      <footer className="final-footer">
        <div>
          <span className="brand small">DANS</span>
          <p>
            Adaptive AI-DSP for reliable
            <br />
            defence communication.
          </p>
        </div>

        <div className="footer-quote serif">
          WHEN THE NOISE CHANGES,
          <br />
          <i>DANS CHANGES WITH IT.</i>
        </div>

        <div className="mono footer-meta">© 2026 / DEMO BUILD<br />SYSTEM READY ●</div>
      </footer>

      <div className="dan-float-wrap">
        <button className={`dan-orb ${danOpen ? 'open' : ''}`} onClick={() => setDanOpen((prev) => !prev)}>
          <span>
            <Sparkles size={18} />
          </span>
          <small>DAN</small>
        </button>

        <AnimatePresence>
          {danOpen && (
            <motion.aside
              className="dan-panel"
              initial={{ opacity: 0, y: 20, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 12 }}
            >
              <div className="dan-header">
                <div>
                  <b>DAN</b>
                  <span className="label accent">DANS AI NAVIGATOR · ONLINE</span>
                </div>
                <button className="close-button" onClick={() => setDanOpen(false)}>
                  <X size={15} />
                </button>
              </div>

              <div className="dan-body">
                <div className="dan-intro">
                  <Sparkles size={15} />
                  Ask me about DANS, adaptive routing, validation, or the field device.
                </div>

                {messages.map((entry, index) => (
                  <div key={`${entry.request}-${index}`} className="chat-entry">
                    <div className="chat-bubble user">
                      <span className="label">YOU</span>
                      <p>{entry.request}</p>
                    </div>
                    <div className="chat-bubble dan">
                      <span className="label">DAN</span>
                      <p>{entry.response}</p>
                    </div>
                  </div>
                ))}

                <div className="quick-actions">
                  <button onClick={() => submitDan('What is DANS doing right now?')}>SYSTEM STATUS</button>
                  <button onClick={() => submitDan('Explain adaptive routing')}>ROUTING</button>
                </div>
              </div>

              <form
                className="dan-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitDan(danInput)
                }}
              >
                <input
                  value={danInput}
                  onChange={(event) => setDanInput(event.target.value)}
                  placeholder="Ask DAN anything…"
                />
                <button type="submit">
                  <Send size={15} />
                </button>
              </form>

              <div className="dan-footer">
                <Volume2 size={14} />
                VOICE READY · STRUCTURED COMMANDS ONLY
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
