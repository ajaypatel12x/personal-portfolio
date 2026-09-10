function About({ data }) {
  const title = data?.title || 'ABOUT ME'

  const descriptions =
    Array.isArray(data?.description)
      ? data.description.filter(Boolean)
      : []

  const focus = data?.focus || 'Building meaningful digital experiences.'
  const interests = data?.interests || 'Technology • Design • Innovation'
  const approach =
    data?.approach ||
    'I believe great software should be useful, thoughtful, and built to last.'

  return (
    <section className="about-section" id="about">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}
      <div className="about-header">

        <div className="about-section-number">
          <span>02</span>
          <span className="about-number-line"></span>
        </div>

        <div>
          <p className="about-eyebrow">
            PROFILE / INTRODUCTION
          </p>

          <h2>
            {title}
          </h2>
        </div>

      </div>

      {/* =====================================================
          MAIN ABOUT CONTENT
      ===================================================== */}
      <div className="about-content">

        <div className="about-main">

          <div className="about-intro-mark">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <p className="about-lead">
            {descriptions[0] ||
              'A technology-focused developer passionate about building useful digital products.'}
          </p>

          {descriptions.slice(1).map((paragraph, index) => (
            <p
              className="about-paragraph"
              key={`about-paragraph-${index}`}
            >
              {paragraph}
            </p>
          ))}

        </div>

        {/* =================================================
            ABOUT INFORMATION
        ================================================= */}
        <div className="about-details">

          <div className="about-detail-card">

            <div className="about-detail-top">
              <span className="about-detail-number">
                01
              </span>

              <span className="about-detail-label">
                CURRENT FOCUS
              </span>
            </div>

            <p>
              {focus}
            </p>

          </div>

          <div className="about-detail-card">

            <div className="about-detail-top">
              <span className="about-detail-number">
                02
              </span>

              <span className="about-detail-label">
                INTERESTS
              </span>
            </div>

            <p>
              {interests}
            </p>

          </div>

          <div className="about-detail-card">

            <div className="about-detail-top">
              <span className="about-detail-number">
                03
              </span>

              <span className="about-detail-label">
                APPROACH
              </span>
            </div>

            <p>
              {approach}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM TECHNICAL STRIP
      ===================================================== */}
      <div className="about-bottom-strip">

        <span>ABOUT / 02</span>

        <span className="about-strip-line"></span>

        <span>ENGINEERING • DEVELOPMENT • INNOVATION</span>

        <span className="about-strip-end">
          ↘
        </span>

      </div>

    </section>
  )
}

export default About