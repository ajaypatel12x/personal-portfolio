import { useEffect, useState } from "react";
import "./ProjectManager.css";

const API_URL =
  (import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api") + "/admin";

/* =========================================================
   EMPTY PROJECT
   ========================================================= */

const EMPTY_PROJECT = {
  title: "",
  category: "",
  description: "",
  technologies: "",

  link: "",
  github: "",
  liveDemo: "",

  coverImage: "",

  year: "",
  client: "",
  role: "",

  featured: false,
  published: true,
};

/* =========================================================
   HELPERS
   ========================================================= */

function getProjects(data) {
  if (Array.isArray(data?.projects)) {
    return data.projects;
  }

  if (
    Array.isArray(
      data?.portfolio?.projects
    )
  ) {
    return data.portfolio.projects;
  }

  return [];
}

function projectToForm(project) {
  return {
    title: project?.title || "",

    category:
      project?.category || "",

    description:
      project?.description || "",

    technologies:
      Array.isArray(project?.technologies)
        ? project.technologies.join(", ")
        : "",

    link:
      project?.link || "",

    github:
      project?.github || "",

    liveDemo:
      project?.liveDemo || "",

    coverImage:
      project?.coverImage || "",

    year:
      project?.year || "",

    client:
      project?.client || "",

    role:
      project?.role || "",

    featured:
      project?.featured === true,

    published:
      project?.published !== false,
  };
}

function formToProject(form) {
  return {
    title: form.title.trim(),

    category:
      form.category.trim(),

    description:
      form.description.trim(),

    technologies:
      form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

    link:
      form.link.trim(),

    github:
      form.github.trim(),

    liveDemo:
      form.liveDemo.trim(),

    coverImage:
      form.coverImage.trim(),

    year:
      form.year.trim(),

    client:
      form.client.trim(),

    role:
      form.role.trim(),

    featured:
      Boolean(form.featured),

    published:
      Boolean(form.published),
  };
}

/* =========================================================
   COMPONENT
   ========================================================= */

function ProjectManager() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState(EMPTY_PROJECT);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD PROJECTS
     ======================================================= */

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/portfolio`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      if (
        response.status === 401
      ) {
        window.location.href =
          "/admin";
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load projects."
        );
      }

      const data =
        await response.json();

      setProjects(
        getProjects(data)
      );
    } catch (err) {
      console.error(
        "Project loading error:",
        err
      );

      setError(
        err.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* =======================================================
     FORM CHANGE
     ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };

  /* =======================================================
     OPEN CREATE FORM
     ======================================================= */

  const handleCreate = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_PROJECT,
    });

    setMessage("");
    setError("");

    setShowForm(true);
  };

  /* =======================================================
     OPEN EDIT FORM
     ======================================================= */

  const handleEdit = (
    project
  ) => {
    setEditingId(
      project._id ||
        project.id
    );

    setForm(
      projectToForm(project)
    );

    setMessage("");
    setError("");

    setShowForm(true);
  };

  /* =======================================================
     CANCEL FORM
     ======================================================= */

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_PROJECT,
    });

    setShowForm(false);

    setMessage("");
    setError("");
  };

  /* =======================================================
     SAVE PROJECT
     ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Project title is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const project =
        formToProject(form);

      let response;

      /* ---------------------------------------------------
         CREATE
         --------------------------------------------------- */

      if (!editingId) {
        response =
          await fetch(
            `${API_URL}/projects`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify(
                project
              ),
            }
          );
      }

      /* ---------------------------------------------------
         UPDATE
         --------------------------------------------------- */

      else {
        response =
          await fetch(
            `${API_URL}/projects/${editingId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify(
                project
              ),
            }
          );
      }

      if (
        response.status ===
        401
      ) {
        window.location.href =
          "/admin";
        return;
      }

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save project."
        );
      }

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project created successfully."
      );

      setEditingId(null);

      setForm({
        ...EMPTY_PROJECT,
      });

      setShowForm(false);

      await loadProjects();

    } catch (err) {
      console.error(
        "Project save error:",
        err
      );

      setError(
        err.message ||
          "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE PROJECT
     ======================================================= */

  const handleDelete = async (
    project
  ) => {
    const id =
      project._id ||
      project.id;

    if (!id) {
      setError(
        "Unable to identify this project."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${project.title}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${API_URL}/projects/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      if (
        response.status ===
        401
      ) {
        window.location.href =
          "/admin";
        return;
      }

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete project."
        );
      }

      setMessage(
        "Project deleted successfully."
      );

      if (
        editingId === id
      ) {
        handleCancel();
      }

      await loadProjects();

    } catch (err) {
      console.error(
        "Project delete error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete project."
      );
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <section className="project-manager">

        <div className="project-manager-header">
          <div>
            <span className="section-eyebrow">
              PROJECTS
            </span>

            <h2>
              PROJECT MANAGER
            </h2>
          </div>
        </div>

        <div className="project-manager-loading">
          LOADING PROJECTS...
        </div>

      </section>
    );
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <section className="project-manager">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="project-manager-header">

        <div>

          <span className="section-eyebrow">
            CONTENT / 03
          </span>

          <h2>
            PROJECT MANAGER
          </h2>

          <p>
            Create and manage the projects
            displayed on your public portfolio.
          </p>

        </div>

        {!showForm && (
          <button
            type="button"
            className="project-add-button"
            onClick={
              handleCreate
            }
          >
            + ADD PROJECT
          </button>
        )}

      </div>

      {/* =================================================
          MESSAGES
          ================================================= */}

      {message && (
        <div className="project-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="project-message error">
          {error}
        </div>
      )}

      {/* =================================================
          FORM
          ================================================= */}

      {showForm && (
        <form
          className="project-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="project-form-header">

            <div>

              <span className="section-eyebrow">
                {editingId
                  ? "EDIT PROJECT"
                  : "NEW PROJECT"}
              </span>

              <h3>
                {editingId
                  ? "UPDATE PROJECT"
                  : "CREATE PROJECT"}
              </h3>

            </div>

            <button
              type="button"
              className="project-cancel-button"
              onClick={
                handleCancel
              }
            >
              CLOSE
            </button>

          </div>

          {/* =============================================
              BASIC INFORMATION
              ============================================= */}

          <div className="project-form-section">

            <div className="project-form-section-title">
              BASIC INFORMATION
            </div>

            <div className="project-form-grid">

              <label>
                <span>
                  PROJECT TITLE *
                </span>

                <input
                  type="text"
                  name="title"
                  value={
                    form.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="My Project"
                  required
                />
              </label>

              <label>
                <span>
                  CATEGORY
                </span>

                <input
                  type="text"
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Web Development"
                />
              </label>

              <label className="project-full-width">
                <span>
                  DESCRIPTION
                </span>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe your project..."
                  rows="5"
                />
              </label>

              <label className="project-full-width">
                <span>
                  TECHNOLOGIES
                </span>

                <input
                  type="text"
                  name="technologies"
                  value={
                    form.technologies
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="React, Node.js, MongoDB"
                />

                <small>
                  Separate technologies with commas.
                </small>
              </label>

            </div>

          </div>

          {/* =============================================
              LINKS
              ============================================= */}

          <div className="project-form-section">

            <div className="project-form-section-title">
              PROJECT LINKS
            </div>

            <div className="project-form-grid">

              <label>
                <span>
                  PROJECT LINK
                </span>

                <input
                  type="url"
                  name="link"
                  value={
                    form.link
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                />
              </label>

              <label>
                <span>
                  LIVE DEMO
                </span>

                <input
                  type="url"
                  name="liveDemo"
                  value={
                    form.liveDemo
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                />
              </label>

              <label className="project-full-width">
                <span>
                  GITHUB
                </span>

                <input
                  type="url"
                  name="github"
                  value={
                    form.github
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://github.com/..."
                />
              </label>

            </div>

          </div>

          {/* =============================================
              VISUAL
              ============================================= */}

          <div className="project-form-section">

            <div className="project-form-section-title">
              PROJECT VISUAL
            </div>

            <div className="project-form-grid">

              <label className="project-full-width">
                <span>
                  COVER IMAGE URL
                </span>

                <input
                  type="url"
                  name="coverImage"
                  value={
                    form.coverImage
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://example.com/project-image.jpg"
                />

                <small>
                  Paste a direct image URL. No
                  image upload system is required.
                </small>
              </label>

            </div>

          </div>

          {/* =============================================
              ADDITIONAL INFORMATION
              ============================================= */}

          <div className="project-form-section">

            <div className="project-form-section-title">
              ADDITIONAL INFORMATION
            </div>

            <div className="project-form-grid">

              <label>
                <span>
                  YEAR
                </span>

                <input
                  type="text"
                  name="year"
                  value={
                    form.year
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="2026"
                />
              </label>

              <label>
                <span>
                  CLIENT
                </span>

                <input
                  type="text"
                  name="client"
                  value={
                    form.client
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Personal / Client"
                />
              </label>

              <label>
                <span>
                  YOUR ROLE
                </span>

                <input
                  type="text"
                  name="role"
                  value={
                    form.role
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Full Stack Developer"
                />
              </label>

            </div>

          </div>

          {/* =============================================
              VISIBILITY
              ============================================= */}

          <div className="project-form-section">

            <div className="project-form-section-title">
              VISIBILITY
            </div>

            <div className="project-checkboxes">

              <label className="project-checkbox">

                <input
                  type="checkbox"
                  name="published"
                  checked={
                    form.published
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  <strong>
                    PUBLISHED
                  </strong>

                  <small>
                    Show this project on the
                    public portfolio.
                  </small>
                </span>

              </label>

              <label className="project-checkbox">

                <input
                  type="checkbox"
                  name="featured"
                  checked={
                    form.featured
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  <strong>
                    FEATURED
                  </strong>

                  <small>
                    Mark this project as featured
                    for future layouts.
                  </small>
                </span>

              </label>

            </div>

          </div>

          {/* =============================================
              ACTIONS
              ============================================= */}

          <div className="project-form-actions">

            <button
              type="button"
              className="project-cancel-button"
              onClick={
                handleCancel
              }
              disabled={
                saving
              }
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="project-save-button"
              disabled={
                saving
              }
            >
              {saving
                ? "SAVING..."
                : editingId
                  ? "UPDATE PROJECT"
                  : "CREATE PROJECT"}
            </button>

          </div>

        </form>
      )}

      {/* =================================================
          PROJECT LIST
          ================================================= */}

      {!showForm && (
        <div className="project-list">

          {projects.length === 0 ? (
            <div className="project-empty">

              <span>
                00
              </span>

              <h3>
                NO PROJECTS YET
              </h3>

              <p>
                Add your first project to
                display it on the portfolio.
              </p>

              <button
                type="button"
                onClick={
                  handleCreate
                }
              >
                + ADD FIRST PROJECT
              </button>

            </div>
          ) : (
            projects.map(
              (
                project,
                index
              ) => (

                <article
                  className="project-card"
                  key={
                    project._id ||
                    project.id ||
                    index
                  }
                >

                  <div className="project-card-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="project-card-main">

                    <div className="project-card-heading">

                      <div>

                        <span className="project-card-category">
                          {project.category ||
                            "PROJECT"}
                        </span>

                        <h3>
                          {project.title ||
                            "Untitled Project"}
                        </h3>

                      </div>

                      <div className="project-card-status">

                        <span
                          className={
                            project.published !==
                            false
                              ? "status-published"
                              : "status-hidden"
                          }
                        >
                          {project.published !==
                          false
                            ? "PUBLISHED"
                            : "HIDDEN"}
                        </span>

                        {project.featured && (
                          <span className="status-featured">
                            FEATURED
                          </span>
                        )}

                      </div>

                    </div>

                    {project.description && (
                      <p className="project-card-description">
                        {
                          project.description
                        }
                      </p>
                    )}

                    <div className="project-card-meta">

                      {project.year && (
                        <span>
                          {project.year}
                        </span>
                      )}

                      {project.role && (
                        <span>
                          {project.role}
                        </span>
                      )}

                      {project.technologies?.length >
                        0 && (
                        <span>
                          {
                            project
                              .technologies
                              .length
                          }{" "}
                          TECHNOLOGIES
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="project-card-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          project
                        )
                      }
                    >
                      EDIT
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          project
                        )
                      }
                    >
                      DELETE
                    </button>

                  </div>

                </article>

              )
            )
          )}

        </div>
      )}

    </section>
  );
}

export default ProjectManager;