const express = require("express");

const router = express.Router();

const Portfolio = require("../models/Portfolio");

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

function requireAdmin(req, res, next) {
  if (
    req.session &&
    req.session.isAdmin === true
  ) {
    return next();
  }

  return res.status(401).json({
    success: false,
    authenticated: false,
    message:
      "Admin session expired or unauthorized.",
  });
}

// ======================================================
// ADMIN LOGIN
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const correctUsername =
      process.env.ADMIN_USERNAME;

    const correctPassword =
      process.env.ADMIN_PASSWORD;

    if (
      !correctUsername ||
      !correctPassword
    ) {
      console.error(
        "ADMIN_USERNAME or ADMIN_PASSWORD missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Admin credentials are not configured on the server.",
      });
    }

    if (
      username !== correctUsername ||
      password !== correctPassword
    ) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message:
          "Invalid username or password.",
      });
    }

    req.session.regenerate(
      (error) => {
        if (error) {
          console.error(
            "Session regeneration failed:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Unable to create admin session.",
          });
        }

        req.session.isAdmin = true;

        req.session.save(
          (saveError) => {
            if (saveError) {
              console.error(
                "Session save failed:",
                saveError
              );

              return res.status(500).json({
                success: false,
                message:
                  "Unable to save admin session.",
              });
            }

            console.log(
              "================================"
            );

            console.log(
              "ADMIN LOGIN SUCCESS"
            );

            console.log(
              "SESSION:",
              req.sessionID
            );

            console.log(
              "================================"
            );

            return res.json({
              success: true,
              authenticated: true,
              message:
                "Login successful.",
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed.",
    });
  }
});

// ======================================================
// ADMIN STATUS
// ======================================================

router.get(
  "/status",
  (req, res) => {
    const authenticated =
      req.session &&
      req.session.isAdmin === true;

    return res.json({
      authenticated,
    });
  }
);

// ======================================================
// LOGOUT
// ======================================================

router.post(
  "/logout",
  (req, res) => {
    if (!req.session) {
      return res.json({
        success: true,
        message:
          "Already logged out.",
      });
    }

    req.session.destroy(
      (error) => {
        if (error) {
          console.error(
            "Logout failed:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Logout failed.",
          });
        }

        res.clearCookie(
          "portfolio.sid",
          {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
          }
        );

        return res.json({
          success: true,
          message:
            "Logged out successfully.",
        });
      }
    );
  }
);

// ======================================================
// GET ADMIN PORTFOLIO
// ======================================================

router.get(
  "/portfolio",
  requireAdmin,
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio data not found.",
        });
      }

      return res.json(
        portfolio
      );
    } catch (error) {
      console.error(
        "Failed to fetch admin portfolio:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch portfolio.",
      });
    }
  }
);

// ======================================================
// UPDATE PORTFOLIO
// ======================================================

router.put(
  "/portfolio",
  requireAdmin,
  async (req, res) => {
    try {
      const allowedFields = [
        "personal",
        "about",
        "technologies",
        "contact",
        "appearance",
      ];

      const updateData = {};

      allowedFields.forEach(
        (field) => {
          if (
            Object.prototype.hasOwnProperty.call(
              req.body,
              field
            )
          ) {
            updateData[field] =
              req.body[field];
          }
        }
      );

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio data not found.",
        });
      }

      Object.keys(
        updateData
      ).forEach((field) => {
        portfolio[field] =
          updateData[field];
      });

      await portfolio.save();

      return res.json({
        success: true,
        message:
          "Portfolio updated successfully.",
        portfolio,
      });
    } catch (error) {
      console.error(
        "Failed to update portfolio:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update portfolio.",
      });
    }
  }
);

// ======================================================
// PROJECT HELPERS
// ======================================================

function normalizeString(
  value
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function normalizeBoolean(
  value,
  defaultValue
) {
  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  return defaultValue;
}

function normalizeProjectInput(
  body
) {
  const technologies =
    Array.isArray(
      body.technologies
    )
      ? body.technologies
          .map((item) =>
            String(item).trim()
          )
          .filter(Boolean)
      : typeof body.technologies ===
          "string"
        ? body.technologies
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        : [];

  return {
    title:
      normalizeString(
        body.title
      ),

    category:
      normalizeString(
        body.category
      ),

    description:
      normalizeString(
        body.description
      ),

    technologies,

    link:
      normalizeString(
        body.link
      ),

    github:
      normalizeString(
        body.github
      ),

    liveDemo:
      normalizeString(
        body.liveDemo
      ),

    coverImage:
      normalizeString(
        body.coverImage
      ),

    year:
      normalizeString(
        body.year
      ),

    client:
      normalizeString(
        body.client
      ),

    role:
      normalizeString(
        body.role
      ),

    featured:
      normalizeBoolean(
        body.featured,
        false
      ),

    published:
      normalizeBoolean(
        body.published,
        true
      ),
  };
}

function validateProject(
  project
) {
  if (!project.title) {
    return "Project title is required.";
  }

  if (!project.category) {
    return "Project category is required.";
  }

  if (!project.description) {
    return "Project description is required.";
  }

  return null;
}

// ======================================================
// GET ALL PROJECTS
// ======================================================

router.get(
  "/projects",
  requireAdmin,
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio data not found.",
        });
      }

      return res.json({
        success: true,
        projects:
          portfolio.projects ||
          [],
      });
    } catch (error) {
      console.error(
        "Failed to fetch projects:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch projects.",
      });
    }
  }
);

// ======================================================
// CREATE PROJECT
// ======================================================

router.post(
  "/projects",
  requireAdmin,
  async (req, res) => {
    try {
      const project =
        normalizeProjectInput(
          req.body
        );

      const validationError =
        validateProject(
          project
        );

      if (validationError) {
        return res.status(400).json({
          success: false,
          message:
            validationError,
        });
      }

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio data not found.",
        });
      }

      const existingIds =
        portfolio.projects
          .map((item) =>
            Number(item.id)
          )
          .filter(
            (id) =>
              Number.isInteger(id)
          );

      const nextId =
        existingIds.length > 0
          ? Math.max(
              ...existingIds
            ) + 1
          : 1;

      portfolio.projects.push({
        id: nextId,

        ...project,
      });

      await portfolio.save();

      const createdProject =
        portfolio.projects.find(
          (item) =>
            Number(item.id) ===
            nextId
        );

      return res.status(201).json({
        success: true,
        message:
          "Project created successfully.",
        project:
          createdProject,
        projects:
          portfolio.projects,
      });
    } catch (error) {
      console.error(
        "Failed to create project:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create project.",
      });
    }
  }
);

// ======================================================
// UPDATE PROJECT
// ======================================================

router.put(
  "/projects/:projectId",
  requireAdmin,
  async (req, res) => {
    try {
      const projectId =
        Number(
          req.params.projectId
        );

      if (
        !Number.isInteger(
          projectId
        ) ||
        projectId < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID.",
        });
      }

      const project =
        normalizeProjectInput(
          req.body
        );

      const validationError =
        validateProject(
          project
        );

      if (validationError) {
        return res.status(400).json({
          success: false,
          message:
            validationError,
        });
      }

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio data not found.",
        });
      }

      const projectIndex =
        portfolio.projects.findIndex(
          (item) =>
            Number(item.id) ===
            projectId
        );

      if (
        projectIndex === -1
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }

      const currentProject =
        portfolio.projects[
          projectIndex
        ];

      currentProject.title =
        project.title;

      currentProject.category =
        project.category;

      currentProject.description =
        project.description;

      currentProject.technologies =
        project.technologies;

      currentProject.link =
        project.link;

      currentProject.github =
        project.github;

      currentProject.liveDemo =
        project.liveDemo;

      currentProject.coverImage =
        project.coverImage;

      currentProject.year =
        project.year;

      currentProject.client =
        project.client;

      currentProject.role =
        project.role;

      currentProject.featured =
        project.featured;

      currentProject.published =
        project.published;

      await portfolio.save();

      return res.json({
        success: true,
        message:
          "Project updated successfully.",
        project:
          portfolio.projects[
            projectIndex
          ],
        projects:
          portfolio.projects,
      });
    } catch (error) {
      console.error(
        "Failed to update project:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update project.",
      });
    }
  }
);

// ======================================================
// DELETE PROJECT
// ======================================================

router.delete(
  "/projects/:projectId",
  requireAdmin,
  async (req, res) => {
    try {
      const projectId =
        Number(
          req.params.projectId
        );

      if (
        !Number.isInteger(
          projectId
        ) ||
        projectId < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID.",
        });
      }

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio data not found.",
        });
      }

      const originalLength =
        portfolio.projects.length;

      portfolio.projects =
        portfolio.projects.filter(
          (item) =>
            Number(item.id) !==
            projectId
        );

      if (
        portfolio.projects.length ===
        originalLength
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }

      await portfolio.save();

      return res.json({
        success: true,
        message:
          "Project deleted successfully.",
        projects:
          portfolio.projects,
      });
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete project.",
      });
    }
  }
);

module.exports = router;