import DigitalCore from './DigitalCore'

function Hero({ data }) {
  const role = data?.role || 'COMPUTER SCIENCE ENGINEER'
  const tagline =
    data?.tagline || 'Building intelligent digital experiences.'
  const description =
    data?.description ||
    'I design and build modern digital products with technology, creativity, and engineering.'

  return (
    <section className="hero" id="home">
      {/* =====================================================
          HERO BACKGROUND GRID
      ===================================================== */}
      <div className="hero-grid-background" aria-hidden="true">
        <div className="hero-grid-line hero-grid-line-1"></div>
        <div className="hero-grid-line hero-grid-line-2"></div>
        <div className="hero-grid-line hero-grid-line-3"></div>
        <div className="hero-grid-line hero-grid-line-4"></div>

        <div className="hero-grid-horizontal hero-grid-horizontal-1"></div>
        <div className="hero-grid-horizontal hero-grid-horizontal-2"></div>
        <div className="hero-grid-horizontal hero-grid-horizontal-3"></div>
      </div>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}
      <div className="hero-content">

        <div className="hero-status">
          <span className="hero-status-dot"></span>
          <span>AVAILABLE FOR OPPORTUNITIES</span>
        </div>

        <p className="hero-label">
          {role}
        </p>

        <h1 className="hero-title">
          {tagline}
        </h1>

        <div className="hero-title-line">
          <span></span>
        </div>

        <p className="hero-description">
          {description}
        </p>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}
        <div className="hero-buttons">

          <a
            href="#work"
            className="primary-button hero-primary-button"
          >
            <span>VIEW MY WORK</span>
            <span className="button-arrow">↗</span>
          </a>

          <a
            href="#contact"
            className="secondary-button hero-secondary-button"
          >
            <span>CONTACT ME</span>
            <span className="button-arrow">→</span>
          </a>

        </div>

        {/* =================================================
            HERO META
        ================================================= */}
        <div className="hero-meta">

          <div className="hero-meta-item">
            <span className="hero-meta-number">01</span>
            <span className="hero-meta-label">ENGINEERING</span>
          </div>

          <div className="hero-meta-divider"></div>

          <div className="hero-meta-item">
            <span className="hero-meta-number">02</span>
            <span className="hero-meta-label">DEVELOPMENT</span>
          </div>

          <div className="hero-meta-divider"></div>

          <div className="hero-meta-item">
            <span className="hero-meta-number">03</span>
            <span className="hero-meta-label">INNOVATION</span>
          </div>

        </div>

      </div>

      {/* =====================================================
          DIGITAL CORE
      ===================================================== */}
      <div className="hero-core-wrapper">
        <DigitalCore />
      </div>

      {/* =====================================================
          HERO SIDE INFORMATION
      ===================================================== */}
      <div className="hero-side-label hero-side-label-left">
        <span>PORTFOLIO</span>
      </div>

      <div className="hero-side-label hero-side-label-right">
        <span>2026</span>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}
      <a
        href="#about"
        className="hero-scroll-indicator"
        aria-label="Scroll to About section"
      >
        <span className="hero-scroll-text">SCROLL TO EXPLORE</span>

        <span className="hero-scroll-arrow">
          ↓
        </span>
      </a>

    </section>
  )
}

export default Hero