import { useState } from "react";

import "./Login.css";

// Uses the Vercel environment variable in production.
// Falls back to localhost for local development.
const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin`;

function Login({ onLogin }) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ==================================================
      // LOGIN
      // ==================================================

      const response =
        await fetch(
          `${API_URL}/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              username,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid username or password."
        );
      }

      if (
        data.success !== true
      ) {
        throw new Error(
          "Login failed."
        );
      }

      // ==================================================
      // VERIFY ADMIN SESSION
      // ==================================================

      const statusResponse =
        await fetch(
          `${API_URL}/status`,
          {
            method: "GET",

            credentials:
              "include",

            cache: "no-store",
          }
        );

      if (!statusResponse.ok) {
        throw new Error(
          "Unable to verify admin session."
        );
      }

      const statusData =
        await statusResponse.json();

      if (
        statusData.authenticated !==
        true
      ) {
        throw new Error(
          "Login succeeded but the admin session was not created."
        );
      }

      // ==================================================
      // LOGIN SUCCESS
      // ==================================================

      if (onLogin) {
        onLogin();
      }

    } catch (loginError) {
      console.error(
        "Login error:",
        loginError
      );

      setError(
        loginError.message ||
          "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* ================================================
            LOGIN HEADING
        ================================================= */}

        <div className="login-heading">

          <p className="login-label">
            ADMIN ACCESS
          </p>

          <h1>
            Welcome back.
          </h1>

          <p>
            Sign in to manage your
            portfolio.
          </p>

        </div>

        {/* ================================================
            LOGIN FORM
        ================================================= */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* USERNAME */}

          <div className="login-field">

            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              placeholder="Enter username"
              autoComplete="username"
              required
              disabled={loading}
            />

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter password"
              autoComplete="current-password"
              required
              disabled={loading}
            />

          </div>

          {/* ERROR */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "AUTHENTICATING..."
              : "SIGN IN"}
          </button>

        </form>

        {/* ================================================
            BACK TO PORTFOLIO
        ================================================= */}

        <div className="login-footer">

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/";
            }}
          >
            ← Back to Portfolio
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;