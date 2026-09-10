const mongoose = require("mongoose");

// ======================================================
// PROJECT IMAGE SCHEMA
// ======================================================

const projectImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },

    alt: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// PROJECT SCHEMA
// ======================================================

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },

    title: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    technologies: {
      type: [String],
      default: [],
    },

    link: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    liveDemo: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    images: {
      type: [projectImageSchema],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    year: {
      type: String,
      default: "",
    },

    client: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// PORTFOLIO SCHEMA
// ======================================================

const portfolioSchema = new mongoose.Schema(
  {
    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    personal: {
      name: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        default: "",
      },

      tagline: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // ABOUT
    // ==========================================

    about: {
      title: {
        type: String,
        default: "About",
      },

      description: {
        type: [String],
        default: [],
      },

      focus: {
        type: String,
        default: "",
      },

      interests: {
        type: String,
        default: "",
      },

      approach: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // PROJECTS
    // ==========================================

    projects: {
      type: [projectSchema],
      default: [],
    },

    // ==========================================
    // TECHNOLOGIES
    // ==========================================

    technologies: {
      programming: {
        type: [String],
        default: [],
      },

      frontend: {
        type: [String],
        default: [],
      },

      backend: {
        type: [String],
        default: [],
      },

      database: {
        type: [String],
        default: [],
      },

      ai_ml: {
        type: [String],
        default: [],
      },

      tools: {
        type: [String],
        default: [],
      },
    },

    // ==========================================
    // CONTACT
    // ==========================================

    contact: {
      email: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      github: {
        type: String,
        default: "",
      },

      resume: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // APPEARANCE
    // ==========================================

    appearance: {
      activeFrame: {
        type: String,

        // FRAME 01 + FRAME 02 + FRAME 03
        enum: ["frame01", "frame02", "frame03"],

        default: "frame01",
      },

      backgroundType: {
        type: String,
        enum: ["default", "image"],
        default: "default",
      },

      backgroundImage: {
        type: String,
        default: "",
      },

      backgroundEnabled: {
        type: Boolean,
        default: false,
      },

      overlayOpacity: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.35,
      },

      backgroundBlur: {
        type: Number,
        min: 0,
        max: 30,
        default: 0,
      },

      backgroundPosition: {
        type: String,
        default: "center",
      },

      backgroundSize: {
        type: String,
        default: "cover",
      },

      animationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },

  {
    timestamps: true,
  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model(
  "Portfolio",
  portfolioSchema
);