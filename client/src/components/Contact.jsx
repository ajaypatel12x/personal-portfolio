function Contact({ data }) {
  const contact = data && typeof data === 'object' ? data : {}

  const email = contact.email || ''
  const linkedin = contact.linkedin || ''
  const github = contact.github || ''
  const resume = contact.resume || ''

  return (
    <section
      id="contact"
      className="contact-section"
    >

      {/* =====================================================
          BACKGROUND DETAILS
      ===================================================== */}

      <div
        className="contact-background-grid"
        aria-hidden="true"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="contact-header">

        <div className="contact-section-number">
          <span>05</span>
          <span className="contact-number-line"></span>
        </div>

        <p className="contact-eyebrow">
          CONTACT / LET'S CONNECT
        </p>

      </div>

      {/* =====================================================
          MAIN CTA
      ===================================================== */}

      <div className="contact-main">

        <div className="contact-headline">

          <span className="contact-headline-small">
            HAVE A PROJECT
          </span>

          <h2>
            LET'S BUILD
            <br />
            SOMETHING
            <br />
            <span>MEANINGFUL.</span>
          </h2>

        </div>

        <div className="contact-introduction">

          <p>
            I'm always interested in new ideas, interesting
            projects and opportunities to build something useful.
          </p>

          {email && (
            <a
              href={`mailto:${email}`}
              className="contact-email"
            >
              <span>{email}</span>
              <span>↗</span>
            </a>
          )}

        </div>

      </div>

      {/* =====================================================
          CONTACT LINKS
      ===================================================== */}

      <div className="contact-links">

        {linkedin && linkedin !== '#' && (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <span className="contact-link-number">
              01
            </span>

            <span className="contact-link-name">
              LINKEDIN
            </span>

            <span className="contact-link-arrow">
              ↗
            </span>
          </a>
        )}

        {github && github !== '#' && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <span className="contact-link-number">
              02
            </span>

            <span className="contact-link-name">
              GITHUB
            </span>

            <span className="contact-link-arrow">
              ↗
            </span>
          </a>
        )}

        {resume && resume !== '#' && (
          <a
            href={resume}
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <span className="contact-link-number">
              03
            </span>

            <span className="contact-link-name">
              RESUME
            </span>

            <span className="contact-link-arrow">
              ↗
            </span>
          </a>
        )}

      </div>

      {/* =====================================================
          EMAIL BUTTON
      ===================================================== */}

      {email && (
        <div className="contact-action-area">

          <a
            href={`mailto:${email}`}
            className="contact-primary-button"
          >
            <span>
              START A CONVERSATION
            </span>

            <span className="contact-button-arrow">
              →
            </span>
          </a>

        </div>
      )}

      {/* =====================================================
          FOOTER STRIP
      ===================================================== */}

      <div className="contact-footer">

        <div className="contact-footer-left">
          <span>
            CONTACT / 05
          </span>

          <span className="contact-footer-line"></span>

          <span>
            DIGITAL ENGINEERING
          </span>
        </div>

        <div className="contact-footer-right">
          <span>
            BUILT WITH CODE
          </span>

          <span>
            © {new Date().getFullYear()}
          </span>
        </div>

      </div>

    </section>
  )
}

export default Contact