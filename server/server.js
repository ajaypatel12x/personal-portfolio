const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const Portfolio = require("./models/Portfolio");
const adminRoutes = require("./routes/admin");

const app = express();

/*
==========================================================
BASIC SETTINGS
==========================================================
*/

app.disable("x-powered-by");

const PORT = process.env.PORT || 5000;

/*
==========================================================
CORS
==========================================================

LOCAL DEVELOPMENT:
http://localhost:5173
http://127.0.0.1:5173

PRODUCTION:
We will add the deployed frontend URL
through FRONTEND_URL environment variable.

Example:
FRONTEND_URL=https://yourportfolio.com

==========================================================
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

/*
----------------------------------------------------------
Add production frontend URL if configured
----------------------------------------------------------
*/

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL.replace(/\/$/, "")
  );
}

app.use(
  cors({
    origin: function (origin, callback) {
      /*
      ----------------------------------------------
      Requests without origin
      ----------------------------------------------
      */

      if (!origin) {
        return callback(null, true);
      }

      /*
      ----------------------------------------------
      Allowed origin
      ----------------------------------------------
      */

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

/*
==========================================================
BODY PARSER
==========================================================
*/

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
==========================================================
SESSION
==========================================================

LOCAL:
secure = false

PRODUCTION:
secure = true

The production setting will automatically activate
when NODE_ENV=production.

==========================================================
*/

const isProduction =
  process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  session({
    name: "portfolio.sid",

    secret:
      process.env.SESSION_SECRET ||
      "portfolio-admin-secret-change-this",

    resave: false,

    saveUninitialized: false,

    rolling: true,

    cookie: {
      httpOnly: true,

      secure: isProduction,

      sameSite: isProduction
        ? "none"
        : "lax",

      maxAge:
        1000 *
        60 *
        60 *
        4,
    },
  })
);

/*
==========================================================
REQUEST LOGGING
==========================================================
*/

app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.originalUrl} | session=${
      req.sessionID || "none"
    } | admin=${
      req.session?.isAdmin === true
    }`
  );

  next();
});

/*
==========================================================
ADMIN ROUTES
==========================================================
*/

app.use(
  "/api/admin",
  adminRoutes
);

/*
==========================================================
PUBLIC PORTFOLIO API
==========================================================
*/

app.get(
  "/api/portfolio",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findOne();

      if (!portfolio) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Portfolio data not found.",
          });
      }

      return res.json(portfolio);
    } catch (error) {
      console.error(
        "Failed to fetch portfolio:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch portfolio.",
        });
    }
  }
);

/*
==========================================================
HEALTH CHECK
==========================================================

IMPORTANT:
Do NOT expose session ID or admin authentication
information through the public health endpoint.

==========================================================
*/

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,

      server: "online",

      environment:
        process.env.NODE_ENV ||
        "development",

      database:
        mongoose.connection.readyState === 1
          ? "connected"
          : "disconnected",
    });
  }
);

/*
==========================================================
ROOT API
==========================================================
*/

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Portfolio API is running.",

      endpoints: {
        portfolio:
          "/api/portfolio",

        health:
          "/api/health",

        admin:
          "/api/admin",
      },
    });
  }
);

/*
==========================================================
404 HANDLER
==========================================================
*/

app.use(
  (req, res) => {
    res
      .status(404)
      .json({
        success: false,
        message:
          "API endpoint not found.",
      });
  }
);

/*
==========================================================
ERROR HANDLER
==========================================================
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res
      .status(500)
      .json({
        success: false,
        message:
          "Internal server error.",
      });
  }
);

/*
==========================================================
MONGODB + SERVER START
==========================================================
*/

async function startServer() {
  try {
    /*
    ------------------------------------------------------
    Validate MongoDB URI
    ------------------------------------------------------
    */

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from server/.env"
      );
    }

    /*
    ------------------------------------------------------
    Connect MongoDB
    ------------------------------------------------------
    */

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

    /*
    ------------------------------------------------------
    Start server
    ------------------------------------------------------
    */

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );

        console.log(
          `Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`
        );

        console.log(
          `Frontend URL: ${
            process.env.FRONTEND_URL ||
            "http://localhost:5173"
          }`
        );

        console.log(
          `Public API: http://localhost:${PORT}/api/portfolio`
        );

        console.log(
          `Health: http://localhost:${PORT}/api/health`
        );
      }
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();