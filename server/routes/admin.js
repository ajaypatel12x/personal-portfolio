const express = require("express");
const router = express.Router();

const Portfolio = require("../models/Portfolio");

// ======================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ======================================================

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized",
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

    // --------------------------------------------------
    // CHECK CREDENTIALS
    // --------------------------------------------------

    if (
      username !== correctUsername ||
      password !== correctPassword
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid username or password.",
      });
    }

    // --------------------------------------------------
    // REGENERATE SESSION
    //
    // This creates a fresh session after successful
    // authentication.
    // --------------------------------------------------

    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        console.error(
          "Session regeneration failed:",
          regenerateError
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to create admin session.",
        });
      }

      // ------------------------------------------------
      // MARK SESSION AS ADMIN
      // ------------------------------------------------

      req.session.isAdmin = true;

      // ------------------------------------------------
      // EXPLICITLY SAVE SESSION BEFORE RESPONSE
      // ------------------------------------------------

      req.session.save((saveError) => {
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
          "ADMIN LOGIN SUCCESS"
        );

        console.log(
          "Session ID:",
          req.sessionID
        );

        return res.json({
          success: true,
          authenticated: true,
          message:
            "Login successful.",
        });
      });
    });

  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

// ======================================================
// CHECK ADMIN LOGIN STATUS
// ======================================================

router.get(
  "/status",
  (req, res) => {
    const authenticated =
      req.session?.isAdmin === true;

    console.log(
      "ADMIN STATUS:",
      authenticated
    );

    return res.json({
      success: true,
      authenticated,
      sessionId:
        req.sessionID || null,
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
        authenticated: false,
        message:
          "Already logged out.",
      });
    }

    req.session.destroy((error) => {
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
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite:
            process.env.NODE_ENV ===
            "production"
              ? "none"
              : "lax",
        }
      );

      return res.json({
        success: true,
        authenticated: false,
        message:
          "Logged out successfully.",
      });
    });
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

      return res.json({
        success: true,
        portfolio,
      });

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
// UPDATE ADMIN PORTFOLIO
// ======================================================

router.put(
  "/portfolio",
  requireAdmin,
  async (req, res) => {
    try {
      console.log(
        "Updating portfolio..."
      );

      const portfolio =
        await Portfolio.findOneAndUpdate(
          {},
          {
            $set: req.body,
          },
          {
            new: true,
            runValidators: true,
            upsert: true,
          }
        );

      console.log(
        "Portfolio updated successfully."
      );

      return res.json({
        success: true,
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
        error:
          error.message,
      });
    }
  }
);

// ======================================================
// PROJECT INPUT NORMALIZATION
// ======================================================

function normalizeProjectInput(
  body = {}
) {
  const technologies =
    Array.isArray(body.technologies)
      ? body.technologies
      : typeof body.technologies ===
          "string"
        ? body.technologies
            .split(",")
            .map(
              (item) =>
                item.trim()
            )
            .filter(Boolean)
        : [];

  return {
    title:
      typeof body.title ===
      "string"
        ? body.title.trim()
        : "",

    category:
      typeof body.category ===
      "string"
        ? body.category.trim()
        : "",

    description:
      typeof body.description ===
      "string"
        ? body.description.trim()
        : "",

    technologies,

    link:
      typeof body.link ===
      "string"
        ? body.link.trim()
        : "",

    github:
      typeof body.github ===
      "string"
        ? body.github.trim()
        : "",

    liveDemo:
      typeof body.liveDemo ===
      "string"
        ? body.liveDemo.trim()
        : "",

    coverImage:
      typeof body.coverImage ===
      "string"
        ? body.coverImage.trim()
        : "",

    images:
      Array.isArray(body.images)
        ? body.images.map(
            (image, index) => ({
              url:
                typeof image?.url ===
                "string"
                  ? image.url.trim()
                  : "",

              alt:
                typeof image?.alt ===
                "string"
                  ? image.alt.trim()
                  : "",

              caption:
                typeof image?.caption ===
                "string"
                  ? image.caption.trim()
                  : "",

              order:
                typeof image?.order ===
                "number"
                  ? image.order
                  : index,
            })
          )
        : [],

    featured:
      body.featured === true,

    published:
      body.published !== false,

    order:
      typeof body.order ===
      "number"
        ? body.order
        : undefined,

    year:
      typeof body.year ===
      "string"
        ? body.year.trim()
        : "",

    client:
      typeof body.client ===
      "string"
        ? body.client.trim()
        : "",

    role:
      typeof body.role ===
      "string"
        ? body.role.trim()
        : "",
  };
}

// ======================================================
// CREATE PROJECT
// ======================================================

router.post(
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

      const project =
        normalizeProjectInput(
          req.body
        );

      if (!project.title) {
        return res.status(400).json({
          success: false,
          message:
            "Project title is required.",
        });
      }

      if (!project.category) {
        return res.status(400).json({
          success: false,
          message:
            "Project category is required.",
        });
      }

      if (!project.description) {
        return res.status(400).json({
          success: false,
          message:
            "Project description is required.",
        });
      }

      // ------------------------------------------------
      // GENERATE PROJECT ID
      // ------------------------------------------------

      const existingIds =
        portfolio.projects
          .map(
            (item) =>
              Number(item.id)
          )
          .filter(
            (id) =>
              !Number.isNaN(id)
          );

      const nextId =
        existingIds.length > 0
          ? Math.max(
              ...existingIds
            ) + 1
          : 1;

      // ------------------------------------------------
      // PROJECT ORDER
      // ------------------------------------------------

      const nextOrder =
        portfolio.projects.length;

      const newProject = {
        id: nextId,

        title:
          project.title,

        category:
          project.category,

        description:
          project.description,

        technologies:
          project.technologies,

        link:
          project.link,

        github:
          project.github,

        liveDemo:
          project.liveDemo,

        coverImage:
          project.coverImage,

        images:
          project.images,

        featured:
          project.featured,

        published:
          project.published,

        order:
          nextOrder,

        year:
          project.year,

        client:
          project.client,

        role:
          project.role,
      };

      portfolio.projects.push(
        newProject
      );

      await portfolio.save();

      return res.status(201).json({
        success: true,
        message:
          "Project created successfully.",
        project:
          newProject,
        portfolio,
      });

    } catch (error) {
      console.error(
        "Create project error:",
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
  "/projects/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const projectId =
        Number(req.params.id);

      if (
        Number.isNaN(projectId)
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
            "Portfolio not found.",
        });
      }

      const projectIndex =
        portfolio.projects.findIndex(
          (project) =>
            Number(project.id) ===
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

      // ------------------------------------------------
      // BASIC FIELDS
      // ------------------------------------------------

      if (
        typeof req.body.title ===
        "string"
      ) {
        currentProject.title =
          req.body.title.trim();
      }

      if (
        typeof req.body.category ===
        "string"
      ) {
        currentProject.category =
          req.body.category.trim();
      }

      if (
        typeof req.body.description ===
        "string"
      ) {
        currentProject.description =
          req.body.description.trim();
      }

      // ------------------------------------------------
      // TECHNOLOGIES
      // ------------------------------------------------

      if (
        Array.isArray(
          req.body.technologies
        )
      ) {
        currentProject.technologies =
          req.body.technologies
            .map(
              (technology) =>
                String(
                  technology
                ).trim()
            )
            .filter(Boolean);
      }

      // ------------------------------------------------
      // LINKS
      // ------------------------------------------------

      if (
        typeof req.body.link ===
        "string"
      ) {
        currentProject.link =
          req.body.link.trim();
      }

      if (
        typeof req.body.github ===
        "string"
      ) {
        currentProject.github =
          req.body.github.trim();
      }

      if (
        typeof req.body.liveDemo ===
        "string"
      ) {
        currentProject.liveDemo =
          req.body.liveDemo.trim();
      }

      // ------------------------------------------------
      // COVER IMAGE
      // ------------------------------------------------

      if (
        typeof req.body.coverImage ===
        "string"
      ) {
        currentProject.coverImage =
          req.body.coverImage.trim();
      }

      // ------------------------------------------------
      // PROJECT GALLERY
      // ------------------------------------------------

      if (
        Array.isArray(
          req.body.images
        )
      ) {
        currentProject.images =
          req.body.images.map(
            (image, index) => ({
              url:
                typeof image?.url ===
                "string"
                  ? image.url.trim()
                  : "",

              alt:
                typeof image?.alt ===
                "string"
                  ? image.alt.trim()
                  : "",

              caption:
                typeof image?.caption ===
                "string"
                  ? image.caption.trim()
                  : "",

              order:
                typeof image?.order ===
                "number"
                  ? image.order
                  : index,
            })
          );
      }

      // ------------------------------------------------
      // STATUS
      // ------------------------------------------------

      if (
        typeof req.body.featured ===
        "boolean"
      ) {
        currentProject.featured =
          req.body.featured;
      }

      if (
        typeof req.body.published ===
        "boolean"
      ) {
        currentProject.published =
          req.body.published;
      }

      // ------------------------------------------------
      // ORDER
      // ------------------------------------------------

      if (
        typeof req.body.order ===
        "number"
      ) {
        currentProject.order =
          req.body.order;
      }

      // ------------------------------------------------
      // OPTIONAL INFORMATION
      // ------------------------------------------------

      if (
        typeof req.body.year ===
        "string"
      ) {
        currentProject.year =
          req.body.year.trim();
      }

      if (
        typeof req.body.client ===
        "string"
      ) {
        currentProject.client =
          req.body.client.trim();
      }

      if (
        typeof req.body.role ===
        "string"
      ) {
        currentProject.role =
          req.body.role.trim();
      }

      await portfolio.save();

      return res.json({
        success: true,
        message:
          "Project updated successfully.",
        project:
          portfolio.projects[
            projectIndex
          ],
        portfolio,
      });

    } catch (error) {
      console.error(
        "Update project error:",
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
  "/projects/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const projectId =
        Number(req.params.id);

      if (
        Number.isNaN(projectId)
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
            "Portfolio not found.",
        });
      }

      const originalLength =
        portfolio.projects.length;

      portfolio.projects =
        portfolio.projects.filter(
          (project) =>
            Number(project.id) !==
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

      // ------------------------------------------------
      // REBUILD ORDER
      // ------------------------------------------------

      portfolio.projects =
        portfolio.projects
          .sort(
            (a, b) =>
              (a.order || 0) -
              (b.order || 0)
          )
          .map(
            (project, index) => {
              project.order =
                index;

              return project;
            }
          );

      await portfolio.save();

      return res.json({
        success: true,
        message:
          "Project deleted successfully.",
        portfolio,
      });

    } catch (error) {
      console.error(
        "Delete project error:",
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

// ======================================================
// REORDER PROJECTS
// ======================================================

router.put(
  "/projects/reorder",
  requireAdmin,
  async (req, res) => {
    try {
      const {
        projectIds,
      } = req.body;

      if (
        !Array.isArray(
          projectIds
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "projectIds must be an array.",
        });
      }

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio not found.",
        });
      }

      const projectMap =
        new Map();

      portfolio.projects.forEach(
        (project) => {
          projectMap.set(
            String(project.id),
            project
          );
        }
      );

      const reorderedProjects =
        [];

      projectIds.forEach(
        (id) => {
          const project =
            projectMap.get(
              String(id)
            );

          if (project) {
            reorderedProjects.push(
              project
            );

            projectMap.delete(
              String(id)
            );
          }
        }
      );

      // ------------------------------------------------
      // KEEP ANY PROJECTS NOT INCLUDED
      // ------------------------------------------------

      projectMap.forEach(
        (project) => {
          reorderedProjects.push(
            project
          );
        }
      );

      // ------------------------------------------------
      // APPLY NEW ORDER
      // ------------------------------------------------

      portfolio.projects =
        reorderedProjects.map(
          (project, index) => {
            project.order =
              index;

            return project;
          }
        );

      await portfolio.save();

      return res.json({
        success: true,
        message:
          "Projects reordered successfully.",
        portfolio,
      });

    } catch (error) {
      console.error(
        "Reorder projects error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to reorder projects.",
      });
    }
  }
);

// ======================================================
// FEATURE / UNFEATURE PROJECT
// ======================================================

router.patch(
  "/projects/:id/featured",
  requireAdmin,
  async (req, res) => {
    try {
      const projectId =
        Number(req.params.id);

      const {
        featured,
      } = req.body;

      if (
        Number.isNaN(projectId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID.",
        });
      }

      if (
        typeof featured !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "featured must be boolean.",
        });
      }

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio not found.",
        });
      }

      const project =
        portfolio.projects.find(
          (item) =>
            Number(item.id) ===
            projectId
        );

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }

      project.featured =
        featured;

      await portfolio.save();

      return res.json({
        success: true,
        message:
          featured
            ? "Project featured."
            : "Project unfeatured.",
        project,
      });

    } catch (error) {
      console.error(
        "Featured project error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update featured status.",
      });
    }
  }
);

// ======================================================
// PUBLISH / UNPUBLISH PROJECT
// ======================================================

router.patch(
  "/projects/:id/published",
  requireAdmin,
  async (req, res) => {
    try {
      const projectId =
        Number(req.params.id);

      const {
        published,
      } = req.body;

      if (
        Number.isNaN(projectId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID.",
        });
      }

      if (
        typeof published !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "published must be boolean.",
        });
      }

      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message:
            "Portfolio not found.",
        });
      }

      const project =
        portfolio.projects.find(
          (item) =>
            Number(item.id) ===
            projectId
        );

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }

      project.published =
        published;

      await portfolio.save();

      return res.json({
        success: true,
        message:
          published
            ? "Project published."
            : "Project unpublished.",
        project,
      });

    } catch (error) {
      console.error(
        "Publish project error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update published status.",
      });
    }
  }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;