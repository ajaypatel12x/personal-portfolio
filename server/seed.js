const mongoose = require("mongoose");
require("dotenv").config();

const Portfolio = require("./models/Portfolio");

// ======================================================
// DEFAULT PORTFOLIO DATA
// ======================================================

const defaultPortfolio = {
  personal: {
    name: "AJAY",
    role: "COMPUTER SCIENCE ENGINEER",
    tagline: "Building digital experiences that matter.",
    description:
      "I design and build modern software systems, intelligent applications, and digital experiences focused on solving real-world problems.",
  },

  about: {
    title: "Building technology with purpose.",

    description: [
      "I am a Computer Science undergraduate passionate about software engineering, artificial intelligence and modern web technologies.",

      "I enjoy turning ideas into practical digital products and continuously improving my technical skills through projects and problem solving.",
    ],

    focus: "Software Engineering",

    interests:
      "AI / ML · Full Stack · DSA",

    approach:
      "Build · Learn · Improve",
  },

  projects: [
    {
      id: 1,

      title:
        "AI-Powered Personalized Learning",

      category:
        "AI • MACHINE LEARNING",

      description:
        "An intelligent learning system designed to understand student progress, identify skill gaps and provide personalized learning recommendations.",

      technologies: [
        "AI",
        "RAG",
        "Machine Learning",
        "Generative AI",
      ],

      link: "#",
    },

    {
      id: 2,

      title: "Student Box",

      category:
        "AI • EDUCATION • WEB",

      description:
        "An AI-focused educational platform designed to help students and teachers understand complex concepts through interactive digital experiences.",

      technologies: [
        "React",
        "AI",
        "Computer Vision",
        "Web",
      ],

      link: "#",
    },

    {
      id: 3,

      title: "Personal Portfolio",

      category:
        "SOFTWARE • WEB",

      description:
        "A modern developer portfolio built to showcase projects, technical skills, experience and future work through a clean digital interface.",

      technologies: [
        "React",
        "JavaScript",
        "CSS",
        "Vite",
      ],

      link: "#",
    },
  ],

  technologies: {
    programming: [
      "C",
      "C++",
      "Java",
      "Python",
      "JavaScript",
    ],

    frontend: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
    ],

    backend: [
      "Node.js",
      "Express",
      "REST API",
    ],

    database: [
      "MongoDB",
      "SQL",
    ],

    ai_ml: [
      "Machine Learning",
      "Generative AI",
      "RAG",
    ],

    tools: [
      "Git",
      "GitHub",
      "VS Code",
    ],
  },

  contact: {
    email:
      "your.email@example.com",

    linkedin: "#",

    github: "#",

    resume: "#",
  },

  appearance: {
    activeFrame: "frame01",

    backgroundType:
      "default",

    backgroundImage: "",

    backgroundEnabled: false,

    overlayOpacity: 0.35,

    backgroundBlur: 0,

    backgroundPosition:
      "center",

    backgroundSize: "cover",

    animationsEnabled: true,
  },
};


// ======================================================
// HELPERS
// ======================================================

function isEmptyString(value) {
  return (
    typeof value !== "string" ||
    value.trim() === ""
  );
}


function isEmptyArray(value) {
  return (
    !Array.isArray(value) ||
    value.length === 0
  );
}


// ======================================================
// SAFE SEED
// ======================================================

async function seedDatabase() {
  try {
    // --------------------------------------------------
    // CHECK ENVIRONMENT
    // --------------------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from server/.env"
      );
    }

    // --------------------------------------------------
    // CONNECT DATABASE
    // --------------------------------------------------

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "MONGODB CONNECTED"
    );
    console.log(
      "=========================================="
    );


    // --------------------------------------------------
    // FIND EXISTING PORTFOLIO
    // --------------------------------------------------

    let portfolio =
      await Portfolio.findOne();


    // ==================================================
    // NO PORTFOLIO EXISTS
    // ==================================================

    if (!portfolio) {
      console.log(
        "No portfolio document found."
      );

      console.log(
        "Creating initial portfolio..."
      );

      portfolio =
        await Portfolio.create(
          defaultPortfolio
        );

      console.log("");
      console.log(
        "PORTFOLIO CREATED SUCCESSFULLY"
      );

      console.log(
        `Projects: ${portfolio.projects.length}`
      );

      console.log(
        `Name: ${portfolio.personal.name}`
      );

      console.log(
        `Frame: ${portfolio.appearance.activeFrame}`
      );

      console.log("");

      return;
    }


    // ==================================================
    // PORTFOLIO EXISTS
    // ==================================================

    console.log(
      "Existing portfolio found."
    );

    console.log(
      "Running safe recovery..."
    );


    // ==================================================
    // PERSONAL
    // ==================================================

    if (
      isEmptyString(
        portfolio.personal?.name
      )
    ) {
      portfolio.personal.name =
        defaultPortfolio.personal.name;
    }


    if (
      isEmptyString(
        portfolio.personal?.role
      )
    ) {
      portfolio.personal.role =
        defaultPortfolio.personal.role;
    }


    if (
      isEmptyString(
        portfolio.personal?.tagline
      )
    ) {
      portfolio.personal.tagline =
        defaultPortfolio.personal.tagline;
    }


    if (
      isEmptyString(
        portfolio.personal?.description
      )
    ) {
      portfolio.personal.description =
        defaultPortfolio.personal.description;
    }


    // ==================================================
    // ABOUT
    // ==================================================

    if (
      isEmptyString(
        portfolio.about?.title
      )
    ) {
      portfolio.about.title =
        defaultPortfolio.about.title;
    }


    if (
      isEmptyArray(
        portfolio.about?.description
      )
    ) {
      portfolio.about.description =
        [
          ...defaultPortfolio.about.description,
        ];
    }


    if (
      isEmptyString(
        portfolio.about?.focus
      )
    ) {
      portfolio.about.focus =
        defaultPortfolio.about.focus;
    }


    if (
      isEmptyString(
        portfolio.about?.interests
      )
    ) {
      portfolio.about.interests =
        defaultPortfolio.about.interests;
    }


    if (
      isEmptyString(
        portfolio.about?.approach
      )
    ) {
      portfolio.about.approach =
        defaultPortfolio.about.approach;
    }


    // ==================================================
    // PROJECTS
    // ==================================================

    if (
      isEmptyArray(
        portfolio.projects
      )
    ) {
      portfolio.projects =
        defaultPortfolio.projects.map(
          (project) => ({
            ...project,
            technologies: [
              ...project.technologies,
            ],
          })
        );
    }


    // ==================================================
    // TECHNOLOGIES
    // ==================================================

    if (
      isEmptyArray(
        portfolio.technologies?.programming
      )
    ) {
      portfolio.technologies.programming =
        [
          ...defaultPortfolio.technologies.programming,
        ];
    }


    if (
      isEmptyArray(
        portfolio.technologies?.frontend
      )
    ) {
      portfolio.technologies.frontend =
        [
          ...defaultPortfolio.technologies.frontend,
        ];
    }


    if (
      isEmptyArray(
        portfolio.technologies?.backend
      )
    ) {
      portfolio.technologies.backend =
        [
          ...defaultPortfolio.technologies.backend,
        ];
    }


    if (
      isEmptyArray(
        portfolio.technologies?.database
      )
    ) {
      portfolio.technologies.database =
        [
          ...defaultPortfolio.technologies.database,
        ];
    }


    if (
      isEmptyArray(
        portfolio.technologies?.ai_ml
      )
    ) {
      portfolio.technologies.ai_ml =
        [
          ...defaultPortfolio.technologies.ai_ml,
        ];
    }


    if (
      isEmptyArray(
        portfolio.technologies?.tools
      )
    ) {
      portfolio.technologies.tools =
        [
          ...defaultPortfolio.technologies.tools,
        ];
    }


    // ==================================================
    // CONTACT
    // ==================================================

    if (
      isEmptyString(
        portfolio.contact?.email
      )
    ) {
      portfolio.contact.email =
        defaultPortfolio.contact.email;
    }


    if (
      isEmptyString(
        portfolio.contact?.linkedin
      )
    ) {
      portfolio.contact.linkedin =
        defaultPortfolio.contact.linkedin;
    }


    if (
      isEmptyString(
        portfolio.contact?.github
      )
    ) {
      portfolio.contact.github =
        defaultPortfolio.contact.github;
    }


    if (
      isEmptyString(
        portfolio.contact?.resume
      )
    ) {
      portfolio.contact.resume =
        defaultPortfolio.contact.resume;
    }


    // ==================================================
    // APPEARANCE
    // ==================================================

    if (
      !portfolio.appearance
    ) {
      portfolio.appearance = {
        ...defaultPortfolio.appearance,
      };
    } else {

      if (
        !portfolio.appearance.activeFrame
      ) {
        portfolio.appearance.activeFrame =
          defaultPortfolio.appearance.activeFrame;
      }


      if (
        !portfolio.appearance.backgroundType
      ) {
        portfolio.appearance.backgroundType =
          defaultPortfolio.appearance.backgroundType;
      }


      if (
        typeof portfolio.appearance.backgroundImage !==
        "string"
      ) {
        portfolio.appearance.backgroundImage =
          defaultPortfolio.appearance.backgroundImage;
      }


      if (
        typeof portfolio.appearance.backgroundEnabled !==
        "boolean"
      ) {
        portfolio.appearance.backgroundEnabled =
          defaultPortfolio.appearance.backgroundEnabled;
      }


      if (
        typeof portfolio.appearance.overlayOpacity !==
        "number"
      ) {
        portfolio.appearance.overlayOpacity =
          defaultPortfolio.appearance.overlayOpacity;
      }


      if (
        typeof portfolio.appearance.backgroundBlur !==
        "number"
      ) {
        portfolio.appearance.backgroundBlur =
          defaultPortfolio.appearance.backgroundBlur;
      }


      if (
        !portfolio.appearance.backgroundPosition
      ) {
        portfolio.appearance.backgroundPosition =
          defaultPortfolio.appearance.backgroundPosition;
      }


      if (
        !portfolio.appearance.backgroundSize
      ) {
        portfolio.appearance.backgroundSize =
          defaultPortfolio.appearance.backgroundSize;
      }


      if (
        typeof portfolio.appearance.animationsEnabled !==
        "boolean"
      ) {
        portfolio.appearance.animationsEnabled =
          defaultPortfolio.appearance.animationsEnabled;
      }
    }


    // ==================================================
    // SAVE RECOVERED DATA
    // ==================================================

    await portfolio.save();


    // ==================================================
    // SUCCESS
    // ==================================================

    console.log("");
    console.log(
      "=========================================="
    );

    console.log(
      "PORTFOLIO RECOVERY COMPLETED"
    );

    console.log(
      "=========================================="
    );

    console.log(
      `Name: ${portfolio.personal.name}`
    );

    console.log(
      `Role: ${portfolio.personal.role}`
    );

    console.log(
      `Projects: ${portfolio.projects.length}`
    );

    console.log(
      `Frame: ${portfolio.appearance.activeFrame}`
    );

    console.log(
      `Wallpaper: ${
        portfolio.appearance.backgroundEnabled
          ? "Enabled"
          : "Disabled"
      }`
    );

    console.log(
      "=========================================="
    );

    console.log("");
  } catch (error) {
    console.error("");
    console.error(
      "=========================================="
    );

    console.error(
      "SEED / RECOVERY FAILED"
    );

    console.error(
      "=========================================="
    );

    console.error(
      error.message
    );

    console.error("");
    
    process.exitCode = 1;
  } finally {
    // --------------------------------------------------
    // DISCONNECT
    // --------------------------------------------------

    try {
      await mongoose.disconnect();

      console.log(
        "MongoDB disconnected."
      );
    } catch (disconnectError) {
      console.error(
        "MongoDB disconnect error:",
        disconnectError.message
      );
    }
  }
}


// ======================================================
// START
// ======================================================

seedDatabase();