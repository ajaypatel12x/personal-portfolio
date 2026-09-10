function Technology({ data }) {
  const technologyData = data && typeof data === 'object' ? data : {}

  const groups = [
    {
      number: '01',
      title: 'Programming',
      code: 'PROGRAMMING',
      items: technologyData.programming,
    },
    {
      number: '02',
      title: 'Frontend',
      code: 'FRONTEND',
      items: technologyData.frontend,
    },
    {
      number: '03',
      title: 'Backend',
      code: 'BACKEND',
      items: technologyData.backend,
    },
    {
      number: '04',
      title: 'Database',
      code: 'DATABASE',
      items: technologyData.database,
    },
    {
      number: '05',
      title: 'AI / ML',
      code: 'INTELLIGENCE',
      items: technologyData.ai_ml,
    },
    {
      number: '06',
      title: 'Tools',
      code: 'TOOLS',
      items: technologyData.tools,
    },
  ]

  const normalizeItems = (items) => {
    if (Array.isArray(items)) {
      return items.filter(Boolean)
    }

    if (typeof items === 'string') {
      return items
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return []
  }

  const totalTechnologies = groups.reduce(
    (total, group) =>
      total + normalizeItems(group.items).length,
    0
  )

  return (
    <section
      id="technology"
      className="technology-section"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="technology-header">

        <div className="technology-header-left">

          <div className="technology-section-number">
            <span>04</span>
            <span className="technology-number-line"></span>
          </div>

          <div>

            <p className="technology-eyebrow">
              TECHNICAL CAPABILITIES / STACK
            </p>

            <h2>
              TOOLS I USE
              <br />
              TO BUILD.
            </h2>

          </div>

        </div>

        <div className="technology-header-right">

          <span className="technology-count">
            {String(totalTechnologies).padStart(2, '0')}
          </span>

          <p>
            A growing collection of programming languages,
            frameworks, databases and tools used to design,
            develop and solve problems.
          </p>

        </div>

      </div>

      {/* =====================================================
          TECHNOLOGY GRID
      ===================================================== */}

      <div className="technology-grid">

        {groups.map((group) => {

          const items = normalizeItems(group.items)

          return (
            <article
              className="technology-group"
              key={group.number}
            >

              {/* =================================================
                  GROUP HEADER
              ================================================= */}

              <div className="technology-group-header">

                <span className="technology-number">
                  {group.number}
                </span>

                <span className="technology-code">
                  {group.code}
                </span>

              </div>

              {/* =================================================
                  GROUP TITLE
              ================================================= */}

              <h3>
                {group.title}
              </h3>

              {/* =================================================
                  TECHNOLOGY LIST
              ================================================= */}

              <div className="technology-list">

                {items.length > 0 ? (

                  items.map((technology, index) => (

                    <div
                      className="technology-item"
                      key={`${technology}-${index}`}
                    >

                      <span className="technology-item-index">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="technology-item-name">
                        {technology}
                      </span>

                      <span className="technology-item-arrow">
                        ↗
                      </span>

                    </div>

                  ))

                ) : (

                  <div className="technology-empty">
                    No technologies added yet.
                  </div>

                )}

              </div>

            </article>
          )
        })}

      </div>

      {/* =====================================================
          BOTTOM TECHNICAL STRIP
      ===================================================== */}

      <div className="technology-bottom-strip">

        <span>
          TECHNOLOGY / 04
        </span>

        <span className="technology-strip-line"></span>

        <span>
          {String(totalTechnologies).padStart(2, '0')}
          {' '}SKILLS / STACK
        </span>

        <span className="technology-strip-arrow">
          ↓
        </span>

      </div>

    </section>
  )
}

export default Technology