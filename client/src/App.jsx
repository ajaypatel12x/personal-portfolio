import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Technology from "./components/Technology";
import Contact from "./components/Contact";

import Admin from "./admin/Admin";
import Login from "./admin/Login";

import "./App.css";

const API_URL = "/api";

/* =========================================================
   DEFAULT APPEARANCE
   ========================================================= */

const DEFAULT_APPEARANCE = {
  activeFrame: "frame01",
  backgroundType: "default",
  backgroundImage: "",
  backgroundEnabled: false,
  overlayOpacity: 0.35,
  backgroundBlur: 0,
  backgroundPosition: "center",
  backgroundSize: "cover",
  animationsEnabled: true,
};

/* =========================================================
   DEFAULT PORTFOLIO
   ========================================================= */

const DEFAULT_PORTFOLIO = {
  personal: {
    name: "",
    role: "",
    tagline: "",
    description: "",
  },

  about: {
    title: "",
    description: [],
    focus: "",
    interests: "",
    approach: "",
  },

  projects: [],

  technologies: {
    programming: [],
    frontend: [],
    backend: [],
    database: [],
    ai_ml: [],
    tools: [],
  },

  contact: {
    email: "",
    linkedin: "",
    github: "",
    resume: "",
  },

  appearance: DEFAULT_APPEARANCE,
};

/* =========================================================
   NORMALIZE PORTFOLIO
   ========================================================= */

function normalizePortfolio(data) {
  if (!data || typeof data !== "object") {
    return DEFAULT_PORTFOLIO;
  }

  const personal = data.personal || {};
  const about = data.about || {};
  const projects = Array.isArray(data.projects)
    ? data.projects
    : [];

  const technologies =
    data.technologies || {};

  const contact = data.contact || {};

  const savedAppearance =
    data.appearance || {};

  return {
    personal: {
      name:
        typeof personal.name === "string"
          ? personal.name
          : "",

      role:
        typeof personal.role === "string"
          ? personal.role
          : "",

      tagline:
        typeof personal.tagline === "string"
          ? personal.tagline
          : "",

      description:
        typeof personal.description === "string"
          ? personal.description
          : "",
    },

    about: {
      title:
        typeof about.title === "string"
          ? about.title
          : "",

      description:
        Array.isArray(about.description)
          ? about.description
          : [],

      focus:
        typeof about.focus === "string"
          ? about.focus
          : "",

      interests:
        typeof about.interests === "string"
          ? about.interests
          : "",

      approach:
        typeof about.approach === "string"
          ? about.approach
          : "",
    },

    projects: projects.map(
      (project, index) => ({
        id:
          project.id ??
          index + 1,

        _id:
          project._id || "",

        title:
          typeof project.title === "string"
            ? project.title
            : "",

        category:
          typeof project.category === "string"
            ? project.category
            : "",

        description:
          typeof project.description === "string"
            ? project.description
            : "",

        technologies:
          Array.isArray(project.technologies)
            ? project.technologies
            : [],

        link:
          typeof project.link === "string"
            ? project.link
            : "",

        github:
          typeof project.github === "string"
            ? project.github
            : "",

        liveDemo:
          typeof project.liveDemo === "string"
            ? project.liveDemo
            : "",

        coverImage:
          typeof project.coverImage === "string"
            ? project.coverImage
            : "",

        images:
          Array.isArray(project.images)
            ? project.images
            : [],

        featured:
          project.featured === true,

        published:
          project.published !== false,

        order:
          typeof project.order === "number"
            ? project.order
            : index,

        year:
          project.year ?? "",

        client:
          project.client ?? "",

        role:
          project.role ?? "",
      })
    ),

    technologies: {
      programming:
        Array.isArray(
          technologies.programming
        )
          ? technologies.programming
          : [],

      frontend:
        Array.isArray(
          technologies.frontend
        )
          ? technologies.frontend
          : [],

      backend:
        Array.isArray(
          technologies.backend
        )
          ? technologies.backend
          : [],

      database:
        Array.isArray(
          technologies.database
        )
          ? technologies.database
          : [],

      ai_ml:
        Array.isArray(
          technologies.ai_ml
        )
          ? technologies.ai_ml
          : [],

      tools:
        Array.isArray(
          technologies.tools
        )
          ? technologies.tools
          : [],
    },

    contact: {
      email:
        typeof contact.email === "string"
          ? contact.email
          : "",

      linkedin:
        typeof contact.linkedin === "string"
          ? contact.linkedin
          : "",

      github:
        typeof contact.github === "string"
          ? contact.github
          : "",

      resume:
        typeof contact.resume === "string"
          ? contact.resume
          : "",
    },

    appearance: {
      activeFrame:
        savedAppearance.activeFrame ===
        "frame03"
          ? "frame03"
          : savedAppearance.activeFrame ===
            "frame02"
            ? "frame02"
            : "frame01",

      backgroundType:
        savedAppearance.backgroundType ===
        "image"
          ? "image"
          : "default",

      backgroundImage:
        typeof savedAppearance.backgroundImage ===
        "string"
          ? savedAppearance.backgroundImage
          : "",

      backgroundEnabled:
        savedAppearance.backgroundEnabled ===
        true,

      overlayOpacity:
        typeof savedAppearance.overlayOpacity ===
        "number"
          ? Math.min(
              1,
              Math.max(
                0,
                savedAppearance.overlayOpacity
              )
            )
          : 0.35,

      backgroundBlur:
        typeof savedAppearance.backgroundBlur ===
        "number"
          ? Math.min(
              30,
              Math.max(
                0,
                savedAppearance.backgroundBlur
              )
            )
          : 0,

      backgroundPosition:
        typeof savedAppearance.backgroundPosition ===
        "string"
          ? savedAppearance.backgroundPosition
          : "center",

      backgroundSize:
        typeof savedAppearance.backgroundSize ===
        "string"
          ? savedAppearance.backgroundSize
          : "cover",

      animationsEnabled:
        savedAppearance.animationsEnabled !==
        false,
    },
  };
}

/* =========================================================
   FRAME 02
   ========================================================= */

function Frame02({
  data,
}) {
  const personal =
    data.personal || {};

  const about =
    data.about || {};

  const projects =
    Array.isArray(data.projects)
      ? data.projects.filter(
          (project) =>
            project.published !== false
        )
      : [];

  const technologies =
    data.technologies || {};

  const contact =
    data.contact || {};

  const technologyItems = [
    ...(technologies.programming || []),
    ...(technologies.frontend || []),
    ...(technologies.backend || []),
    ...(technologies.database || []),
    ...(technologies.ai_ml || []),
    ...(technologies.tools || []),
  ];

  return (
    <div className="frame02-editorial">

      {/* =================================================
          FRAME 02 NAVIGATION
          ================================================= */}

      <nav className="frame02-nav">

        <a
          href="#home"
          className="frame02-brand"
        >
          <span className="frame02-brand-number">
            01
          </span>

          <span className="frame02-brand-name">
            {personal.name || "PORTFOLIO"}
          </span>
        </a>

        <div className="frame02-nav-links">
          <a href="#home">
            HOME
          </a>

          <a href="#about">
            ABOUT
          </a>

          <a href="#work">
            WORK
          </a>

          <a href="#technology">
            STACK
          </a>

          <a href="#contact">
            CONTACT
          </a>
        </div>

        <div className="frame02-status">
          <span className="frame02-status-dot" />
          AVAILABLE FOR WORK
        </div>

      </nav>

      {/* =================================================
          HERO
          ================================================= */}

      <section
        className="frame02-hero"
        id="home"
      >

        <div className="frame02-hero-topline">
          <span>
            COMPUTER SCIENCE / SOFTWARE
          </span>

          <span>
            PORTFOLIO — 2026
          </span>
        </div>

        <div className="frame02-hero-main">

          <div className="frame02-hero-index">
            <span>
              01
            </span>

            <span>
              INTRODUCTION
            </span>
          </div>

          <div className="frame02-hero-title-wrap">

            <p className="frame02-kicker">
              {personal.role ||
                "SOFTWARE ENGINEER"}
            </p>

            <h1 className="frame02-title">
              {personal.tagline ||
                personal.name ||
                "BUILDING DIGITAL EXPERIENCES"}
            </h1>

            <p className="frame02-hero-description">
              {personal.description ||
                "Designing and developing modern digital experiences through software, technology and problem solving."}
            </p>

            <div className="frame02-hero-actions">

              <a
                href="#work"
                className="frame02-primary-action"
              >
                VIEW SELECTED WORK
                <span>↗</span>
              </a>

              <a
                href="#contact"
                className="frame02-text-action"
              >
                START A CONVERSATION →
              </a>

            </div>

          </div>

          <div className="frame02-hero-side">

            <div>
              DIGITAL<br />
              PRODUCTS
            </div>

            <div className="frame02-side-line" />

            <div>
              DEVELOPMENT<br />
              SYSTEMS
            </div>

            <div className="frame02-side-line" />

            <div>
              CREATIVE<br />
              TECHNOLOGY
            </div>

          </div>

        </div>

        <div className="frame02-hero-bottom">

          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="frame02-scroll-line">
            <span />
          </div>

          <span>
            HYDERABAD / INDIA
          </span>

        </div>

      </section>

      {/* =================================================
          ABOUT
          ================================================= */}

      <section
        className="frame02-section"
        id="about"
      >

        <span className="frame02-section-number">
          02
        </span>

        <span className="frame02-section-label">
          ABOUT / PROFILE
        </span>

        <div className="frame02-about-content">

          <h2>
            {about.title ||
              "ABOUT"}
            <br />
            <span>ME.</span>
          </h2>

          <div className="frame02-about-copy">

            {Array.isArray(
              about.description
            ) &&
              about.description.length >
                0 ? (
              about.description.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "frame02-large-copy"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                )
              )
            ) : (
              <p className="frame02-large-copy">
                I build software and digital
                experiences with a focus on
                clean engineering and useful
                technology.
              </p>
            )}

            <div className="frame02-about-meta">

              <div>
                <span>
                  FOCUS
                </span>

                <strong>
                  {about.focus ||
                    "SOFTWARE DEVELOPMENT"}
                </strong>
              </div>

              <div>
                <span>
                  INTERESTS
                </span>

                <strong>
                  {about.interests ||
                    "TECHNOLOGY / DESIGN / SYSTEMS"}
                </strong>
              </div>

              <div>
                <span>
                  APPROACH
                </span>

                <strong>
                  {about.approach ||
                    "LEARN · BUILD · IMPROVE"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          WORK
          ================================================= */}

      <section
        className="frame02-section frame02-work"
        id="work"
      >

        <span className="frame02-section-number">
          03
        </span>

        <span className="frame02-section-label">
          SELECTED WORK
        </span>

        <div className="frame02-work-heading">

          <h2>
            WORK
            <br />
            <span>/ PROJECTS</span>
          </h2>

          <p>
            A selection of projects,
            experiments and digital products
            built across software engineering
            and modern web technology.
          </p>

        </div>

        <div className="frame02-project-list">

          {projects.length === 0 ? (
            <div className="frame02-empty-work">
              <span>
                00
              </span>

              <p>
                Projects will appear here.
              </p>
            </div>
          ) : (
            projects.map(
              (project, index) => {

                const projectImage =
                  project.coverImage ||
                  (
                    Array.isArray(
                      project.images
                    ) &&
                    project.images.length > 0
                  )
                    ? (
                        typeof project.images[0] ===
                        "string"
                          ? project.images[0]
                          : project.images[0]?.url
                      )
                    : "";

                const projectLink =
                  project.liveDemo ||
                  project.link ||
                  "";

                return (
                  <article
                    className="frame02-project"
                    key={
                      project._id ||
                      project.id ||
                      index
                    }
                  >

                    <div className="frame02-project-number">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="frame02-project-info">

                      <p className="frame02-project-category">
                        {project.category ||
                          "PROJECT"}
                      </p>

                      <h3>
                        {project.title ||
                          "Untitled Project"}
                      </h3>

                      <p className="frame02-project-description">
                        {project.description ||
                          "Project description."}
                      </p>

                      {Array.isArray(
                        project.technologies
                      ) &&
                        project.technologies.length >
                          0 && (
                          <div className="frame02-project-tech">
                            {project.technologies.map(
                              (
                                technology,
                                technologyIndex
                              ) => (
                                <span
                                  key={
                                    `${technology}-${technologyIndex}`
                                  }
                                >
                                  {technology}
                                </span>
                              )
                            )}
                          </div>
                        )}

                      <div className="frame02-project-links">

                        {projectLink ? (
                          <a
                            href={
                              projectLink
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            VIEW PROJECT ↗
                          </a>
                        ) : (
                          <span>
                            PROJECT COMING SOON
                          </span>
                        )}

                        {project.github && (
                          <a
                            href={
                              project.github
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            GITHUB ↗
                          </a>
                        )}

                      </div>

                    </div>

                    <div
                      className={`frame02-project-visual ${
                        projectImage
                          ? "has-image"
                          : ""
                      }`}
                      style={
                        projectImage
                          ? {
                              backgroundImage: `url("${projectImage}")`,
                            }
                          : undefined
                      }
                    >

                      {!projectImage && (
                        <div className="frame02-project-placeholder">

                          <span>
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <small>
                            PROJECT
                          </small>

                        </div>
                      )}

                      {project.year && (
                        <div className="frame02-project-year">
                          {project.year}
                        </div>
                      )}

                    </div>

                  </article>
                );
              }
            )
          )}

        </div>

      </section>

      {/* =================================================
          TECHNOLOGY
          ================================================= */}

      <section
        className="frame02-section"
        id="technology"
      >

        <span className="frame02-section-number">
          04
        </span>

        <span className="frame02-section-label">
          TECHNOLOGY / STACK
        </span>

        <div className="frame02-stack-layout">

          <div>

            <p className="frame02-stack-eyebrow">
              TOOLS / TECHNOLOGIES
            </p>

            <h2>
              THE
              <br />
              <span>STACK.</span>
            </h2>

          </div>

          <div className="frame02-tech-grid">

            {technologyItems.length === 0 ? (
              <div className="frame02-empty-tech">
                Technology stack will appear
                here.
              </div>
            ) : (
              technologyItems.map(
                (
                  technology,
                  index
                ) => (
                  <div
                    className="frame02-tech-item"
                    key={`${technology}-${index}`}
                  >

                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>
                      {technology}
                    </strong>

                    <i>
                      ↗
                    </i>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          CONTACT
          ================================================= */}

      <section
        className="frame02-contact"
        id="contact"
      >

        <div className="frame02-contact-top">

          <span>
            05 / CONTACT
          </span>

          <span>
            LET'S BUILD SOMETHING
          </span>

        </div>

        <div className="frame02-contact-main">

          <h2>
            LET'S
            <br />
            <span>TALK.</span>
          </h2>

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="frame02-contact-button"
            >
              SEND AN EMAIL
              <span>
                ↗
              </span>
            </a>
          )}

        </div>

        <div className="frame02-contact-bottom">

          <div>
            <span>
              EMAIL
            </span>

            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            ) : (
              <strong>
                NOT PROVIDED
              </strong>
            )}
          </div>

          <div>
            <span>
              LINKEDIN
            </span>

            {contact.linkedin ? (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                OPEN PROFILE ↗
              </a>
            ) : (
              <strong>
                NOT PROVIDED
              </strong>
            )}
          </div>

          <div>
            <span>
              GITHUB
            </span>

            {contact.github ? (
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
              >
                OPEN PROFILE ↗
              </a>
            ) : (
              <strong>
                NOT PROVIDED
              </strong>
            )}
          </div>

          <div>
            <span>
              RESUME
            </span>

            {contact.resume ? (
              <a
                href={contact.resume}
                target="_blank"
                rel="noreferrer"
              >
                VIEW RESUME ↗
              </a>
            ) : (
              <strong>
                NOT PROVIDED
              </strong>
            )}
          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
          ================================================= */}

      <footer className="frame02-footer">

        <span>
          © {new Date().getFullYear()}{" "}
          {personal.name ||
            "Portfolio"}
        </span>

        <a href="#home">
          BACK TO TOP ↑
        </a>

      </footer>

    </div>
  );
}

/* =========================================================
   FRAME 03
   SIMPLE HTML / CSS / JS STYLE
   ========================================================= */

function Frame03({ data }) {
  const personal = data.personal || {};
  const about = data.about || {};
  const projects = Array.isArray(data.projects)
    ? data.projects.filter((project) => project.published !== false)
    : [];
  const technologies = data.technologies || {};
  const contact = data.contact || {};

  const technologyGroups = [
    { label: "PROGRAMMING", items: technologies.programming || [] },
    { label: "FRONTEND", items: technologies.frontend || [] },
    { label: "BACKEND", items: technologies.backend || [] },
    { label: "DATABASE", items: technologies.database || [] },
    { label: "AI / ML", items: technologies.ai_ml || [] },
    { label: "TOOLS", items: technologies.tools || [] },
  ].filter((group) => Array.isArray(group.items) && group.items.length > 0);

  return (
    <div className="frame03-site">
      <header className="frame03-header">
        <a href="#home" className="frame03-logo">
          {personal.name || "MY PORTFOLIO"}
        </a>

        <nav className="frame03-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#technology">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="frame03-hero" id="home">
          <p className="frame03-small">&gt; hello, world!</p>
          <h1>{personal.name || "YOUR NAME"}</h1>
          <h2>{personal.role || "Software Developer"}</h2>
          <p className="frame03-tagline">
            {personal.tagline ||
              "I build simple, useful and reliable digital experiences."}
          </p>
          <p className="frame03-description">
            {personal.description ||
              "Welcome to my portfolio. Here you can find my work, skills and ways to get in touch."}
          </p>

          <div className="frame03-actions">
            <a href="#work">View My Work</a>
            <a href="#contact">Contact Me</a>
          </div>
        </section>

        <section className="frame03-section" id="about">
          <div className="frame03-section-title">
            <span>01.</span>
            <h2>{about.title || "About Me"}</h2>
          </div>

          <div className="frame03-about-content">
            <div>
              {Array.isArray(about.description) && about.description.length > 0 ? (
                about.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>
                  I am a computer science student interested in software
                  development, technology and building practical projects.
                </p>
              )}
            </div>

            <div className="frame03-about-details">
              <p><strong>Focus:</strong> {about.focus || "Software Development"}</p>
              <p><strong>Interests:</strong> {about.interests || "Technology / Design / Systems"}</p>
              <p><strong>Approach:</strong> {about.approach || "Learn · Build · Improve"}</p>
            </div>
          </div>
        </section>

        <section className="frame03-section" id="work">
          <div className="frame03-section-title">
            <span>02.</span>
            <h2>My Work</h2>
          </div>

          <div className="frame03-projects">
            {projects.length === 0 ? (
              <p className="frame03-empty">No projects added yet.</p>
            ) : (
              projects.map((project, index) => {
                const projectImage =
                  project.coverImage ||
                  (Array.isArray(project.images) && project.images.length > 0
                    ? typeof project.images[0] === "string"
                      ? project.images[0]
                      : project.images[0]?.url
                    : "");
                const projectLink = project.liveDemo || project.link || "";

                return (
                  <article
                    className="frame03-project"
                    key={project._id || project.id || index}
                  >
                    <div className="frame03-project-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {projectImage && (
                      <div
                        className="frame03-project-image"
                        style={{ backgroundImage: `url("${projectImage}")` }}
                        aria-label={project.title || "Project image"}
                      />
                    )}

                    <div className="frame03-project-content">
                      <p className="frame03-project-category">
                        {project.category || "PROJECT"}
                      </p>
                      <h3>{project.title || "Untitled Project"}</h3>
                      <p>{project.description || "Project description."}</p>

                      {Array.isArray(project.technologies) &&
                        project.technologies.length > 0 && (
                          <div className="frame03-project-tech">
                            {project.technologies.map((technology, technologyIndex) => (
                              <span key={`${technology}-${technologyIndex}`}>
                                {technology}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="frame03-project-links">
                        {projectLink ? (
                          <a href={projectLink} target="_blank" rel="noreferrer">
                            Live Demo ↗
                          </a>
                        ) : (
                          <span>Coming Soon</span>
                        )}

                        {project.github && (
                          <a href={project.github} target="_blank" rel="noreferrer">
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="frame03-section" id="technology">
          <div className="frame03-section-title">
            <span>03.</span>
            <h2>Skills</h2>
          </div>

          <div className="frame03-skills">
            {technologyGroups.length === 0 ? (
              <p className="frame03-empty">No technologies added yet.</p>
            ) : (
              technologyGroups.map((group) => (
                <div className="frame03-skill-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <div>
                    {group.items.map((technology, index) => (
                      <span key={`${technology}-${index}`}>{technology}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="frame03-section frame03-contact" id="contact">
          <div className="frame03-section-title">
            <span>04.</span>
            <h2>Contact</h2>
          </div>

          <p>Have a project, opportunity or idea? Let's talk.</p>

          {contact.email && (
            <a className="frame03-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          )}

          <div className="frame03-socials">
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            )}
            {contact.resume && (
              <a href={contact.resume} target="_blank" rel="noreferrer">
                Resume ↗
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="frame03-footer">
        <span>© {new Date().getFullYear()} {personal.name || "Portfolio"}</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

/* =========================================================
   MAIN APP
   ========================================================= */

function App() {
  const isAdminPage =
    window.location.pathname ===
    "/admin";

  const [
    portfolioData,
    setPortfolioData,
  ] = useState(null);

  const [
    adminAuthenticated,
    setAdminAuthenticated,
  ] = useState(false);

  const [
    checkingAdmin,
    setCheckingAdmin,
  ] = useState(
    isAdminPage
  );

  const [
    portfolioError,
    setPortfolioError,
  ] = useState(false);

  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (isAdminPage) {
          const response =
            await fetch(
              `${API_URL}/admin/status`,
              {
                method: "GET",
                credentials:
                  "include",
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to check admin status."
            );
          }

          const result =
            await response.json();

          if (!mounted) {
            return;
          }

          setAdminAuthenticated(
            result.authenticated ===
              true
          );

          setCheckingAdmin(false);

          return;
        }

        const response =
          await fetch(
            `${API_URL}/portfolio`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load portfolio."
          );
        }

        const result =
          await response.json();

        if (!mounted) {
          return;
        }

        setPortfolioData(
          normalizePortfolio(
            result
          )
        );

        setPortfolioError(
          false
        );

      } catch (error) {
        console.error(
          "Application loading error:",
          error
        );

        if (!mounted) {
          return;
        }

        if (isAdminPage) {
          setAdminAuthenticated(
            false
          );

          setCheckingAdmin(
            false
          );
        } else {
          setPortfolioError(
            true
          );
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isAdminPage]);

  /* =======================================================
     ADMIN PAGE
     ======================================================= */

  if (isAdminPage) {

    if (checkingAdmin) {
      return (
        <div className="app-loading-screen">

          <div className="app-loading-spinner" />

          <p>
            CHECKING ADMIN ACCESS...
          </p>

        </div>
      );
    }

    if (!adminAuthenticated) {
      return (
        <Login
          onLogin={() => {
            setAdminAuthenticated(
              true
            );
          }}
        />
      );
    }

    return (
      <Admin
        onLogout={() => {
          setAdminAuthenticated(
            false
          );
        }}
      />
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (portfolioError) {
    return (
      <div className="app-error-screen">

        <div className="app-error-card">

          <span>
            PORTFOLIO SYSTEM
          </span>

          <h1>
            Unable to load portfolio
          </h1>

          <p>
            Please make sure the
            backend server is running.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            TRY AGAIN
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     LOADING
     ======================================================= */

  if (!portfolioData) {
    return (
      <div className="app-loading-screen">

        <div className="app-loading-spinner" />

        <p>
          LOADING PORTFOLIO...
        </p>

      </div>
    );
  }

  /* =======================================================
     APPEARANCE
     ======================================================= */

  const appearance =
    portfolioData.appearance ||
    DEFAULT_APPEARANCE;

  const wallpaperActive =
    appearance.backgroundEnabled &&
    appearance.backgroundType ===
      "image" &&
    typeof appearance.backgroundImage ===
      "string" &&
    appearance.backgroundImage.trim() !==
      "";

  const publicStyle = {
    "--portfolio-overlay-opacity":
      appearance.overlayOpacity,

    "--portfolio-background-blur":
      `${appearance.backgroundBlur}px`,

    "--portfolio-background-position":
      appearance.backgroundPosition,

    "--portfolio-background-size":
      appearance.backgroundSize,
  };

  const animationClass =
    appearance.animationsEnabled ===
    false
      ? "animations-off"
      : "";

  /* =======================================================
     FRAME 03
     ======================================================= */

  if (
    appearance.activeFrame ===
    "frame03"
  ) {
    return (
      <div
        className={`public-shell frame03 ${animationClass}`}
        style={publicStyle}
      >
        <Frame03
          data={portfolioData}
        />
      </div>
    );
  }

  /* =======================================================
     FRAME 02
     ======================================================= */

  if (
    appearance.activeFrame ===
    "frame02"
  ) {
    return (
      <div
        className={`public-shell frame02-active ${animationClass}`}
        style={publicStyle}
      >

        {wallpaperActive && (
          <>
            <div
              className="portfolio-wallpaper"
              aria-hidden="true"
              style={{
                backgroundImage:
                  `url("${appearance.backgroundImage}")`,
              }}
            />

            <div
              className="portfolio-wallpaper-overlay"
              aria-hidden="true"
            />
          </>
        )}

        <Frame02
          data={portfolioData}
        />

      </div>
    );
  }

  /* =======================================================
     FRAME 01
     IMPORTANT:
     KEEP ORIGINAL STRUCTURE
     ======================================================= */

  return (
    <div
      className={`public-shell frame01 ${animationClass}`}
      style={publicStyle}
    >

      {/* =================================================
          WALLPAPER
          ================================================= */}

      {wallpaperActive && (
        <div
          className="portfolio-wallpaper"
          aria-hidden="true"
          style={{
            backgroundImage:
              `url("${appearance.backgroundImage}")`,
          }}
        />
      )}

      {/* =================================================
          WALLPAPER OVERLAY
          ================================================= */}

      {wallpaperActive && (
        <div
          className="portfolio-wallpaper-overlay"
          aria-hidden="true"
        />
      )}

      {/* =================================================
          FRAME DECORATION
          ================================================= */}

      <div
        className="portfolio-frame-decoration"
        aria-hidden="true"
      />

      {/* =================================================
          AMBIENT LIGHTS
          ================================================= */}

      <div
        className="portfolio-ambient-light ambient-one"
        aria-hidden="true"
      />

      <div
        className="portfolio-ambient-light ambient-two"
        aria-hidden="true"
      />

      {/* =================================================
          NAVBAR
          ================================================= */}

      <Navbar
        data={
          portfolioData.personal ||
          {}
        }
      />

      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main>

        <Hero
          data={
            portfolioData.personal ||
            {}
          }
        />

        <About
          data={
            portfolioData.about ||
            {}
          }
        />

        <Work
          data={
            portfolioData.projects ||
            []
          }
        />

        <Technology
          data={
            portfolioData.technologies ||
            {}
          }
        />

        <Contact
          data={
            portfolioData.contact ||
            {}
          }
        />

      </main>

    </div>
  );
}

export default App;