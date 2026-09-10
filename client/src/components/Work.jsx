function Work({ data }) {
  const projects = Array.isArray(data) ? data : []

  const visibleProjects = projects.filter(
    (project) => project?.published !== false
  )

  return (
    <section className="work-section" id="work">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="work-header">

        <div className="work-header-left">

          <div className="work-section-number">
            <span>03</span>
            <span className="work-number-line"></span>
          </div>

          <div>
            <p className="work-eyebrow">
              SELECTED WORK / PROJECTS
            </p>

            <h2>
              SELECTED
              <br />
              WORK
            </h2>
          </div>

        </div>

        <div className="work-header-description">
          <span className="work-header-index">
            {String(visibleProjects.length).padStart(2, '0')}
          </span>

          <p>
            A selection of projects, experiments and digital
            products built through engineering and creativity.
          </p>
        </div>

      </div>

      {/* =====================================================
          PROJECT LIST
      ===================================================== */}

      <div className="work-list">

        {visibleProjects.length === 0 ? (

          <div className="work-empty">
            <span>NO PROJECTS PUBLISHED</span>
            <p>
              Publish a project from the Admin Panel to display
              it here.
            </p>
          </div>

        ) : (

          visibleProjects.map((project, index) => {

            const projectNumber = String(index + 1).padStart(2, '0')

            const technologies = Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === 'string'
                ? project.technologies
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                : []

            const projectImage =
              project.coverImage ||
              (Array.isArray(project.images) &&
              project.images.length > 0
                ? project.images[0]?.url
                : '')

            const projectLink =
              project.liveDemo ||
              project.link ||
              ''

            return (
              <article
                className={`work-project ${
                  project.featured ? 'work-project-featured' : ''
                }`}
                key={project._id || project.id || index}
              >

                {/* =================================================
                    PROJECT TOP BAR
                ================================================= */}

                <div className="work-project-top">

                  <div className="work-project-number">
                    {projectNumber}
                  </div>

                  <div className="work-project-meta">

                    {project.category && (
                      <span>
                        {project.category}
                      </span>
                    )}

                    {project.year && (
                      <span>
                        {project.year}
                      </span>
                    )}

                    {project.featured && (
                      <span className="work-featured-label">
                        FEATURED
                      </span>
                    )}

                  </div>

                </div>

                {/* =================================================
                    PROJECT MAIN GRID
                ================================================= */}

                <div className="work-project-grid">

                  {/* =================================================
                      PROJECT VISUAL
                  ================================================= */}

                  <div className="work-project-visual">

                    {projectImage ? (

                      <div className="work-project-image-wrapper">

                        <img
                          src={projectImage}
                          alt={
                            project.title
                              ? `${project.title} project`
                              : 'Project preview'
                          }
                          className="work-project-image"
                          loading="lazy"
                        />

                        <div className="work-image-overlay">
                          <span>
                            VIEW PROJECT
                          </span>

                          <span className="work-image-arrow">
                            ↗
                          </span>
                        </div>

                      </div>

                    ) : (

                      <div className="work-project-placeholder">

                        <span className="work-placeholder-number">
                          {projectNumber}
                        </span>

                        <span className="work-placeholder-label">
                          PROJECT / VISUAL
                        </span>

                        <span className="work-placeholder-arrow">
                          ↗
                        </span>

                      </div>

                    )}

                  </div>

                  {/* =================================================
                      PROJECT INFORMATION
                  ================================================= */}

                  <div className="work-project-content">

                    <div className="work-project-heading">

                      <span className="work-project-small-label">
                        PROJECT {projectNumber}
                      </span>

                      <h3>
                        {project.title || 'Untitled Project'}
                      </h3>

                    </div>

                    {project.description && (
                      <p className="work-project-description">
                        {project.description}
                      </p>
                    )}

                    {/* =================================================
                        TECHNOLOGIES
                    ================================================= */}

                    {technologies.length > 0 && (

                      <div className="work-technologies">

                        <span className="work-tech-label">
                          TECHNOLOGIES
                        </span>

                        <div className="work-tech-list">

                          {technologies.map(
                            (technology, technologyIndex) => (
                              <span
                                className="work-tech-tag"
                                key={`${technology}-${technologyIndex}`}
                              >
                                {technology}
                              </span>
                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* =================================================
                        ADDITIONAL INFORMATION
                    ================================================= */}

                    {(project.role || project.client) && (

                      <div className="work-project-details">

                        {project.role && (
                          <div className="work-project-detail">

                            <span>
                              ROLE
                            </span>

                            <strong>
                              {project.role}
                            </strong>

                          </div>
                        )}

                        {project.client && (
                          <div className="work-project-detail">

                            <span>
                              CLIENT
                            </span>

                            <strong>
                              {project.client}
                            </strong>

                          </div>
                        )}

                      </div>

                    )}

                    {/* =================================================
                        PROJECT ACTIONS
                    ================================================= */}

                    <div className="work-project-actions">

                      {projectLink ? (

                        <a
                          href={projectLink}
                          target="_blank"
                          rel="noreferrer"
                          className="work-action-primary"
                        >
                          <span>
                            VIEW PROJECT
                          </span>

                          <span>
                            ↗
                          </span>
                        </a>

                      ) : (

                        <span className="work-action-disabled">
                          PROJECT COMING SOON
                        </span>

                      )}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="work-action-secondary"
                        >
                          GITHUB
                          <span>↗</span>
                        </a>
                      )}

                    </div>

                  </div>

                </div>

              </article>
            )
          })

        )}

      </div>

      {/* =====================================================
          BOTTOM STRIP
      ===================================================== */}

      <div className="work-bottom-strip">

        <span>
          WORK / 03
        </span>

        <span className="work-strip-line"></span>

        <span>
          {String(visibleProjects.length).padStart(2, '0')}
          {' '}PROJECTS
        </span>

        <span className="work-strip-arrow">
          ↓
        </span>

      </div>

    </section>
  )
}

export default Work