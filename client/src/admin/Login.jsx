import { useState } from "react";
import "./Login.css";

const API_URL = "/api/admin";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // ==========================================
      // LOGIN
      // ==========================================

      const loginResponse = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          loginData.message ||
            "Invalid username or password."
        );
      }

      // ==========================================
      // VERIFY SESSION
      // ==========================================

      const statusResponse = await fetch(
        `${API_URL}/status`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const statusData = await statusResponse.json();

      if (
        !statusResponse.ok ||
        statusData.authenticated !== true
      ) {
        throw new Error(
          "Login succeeded but the admin session was not created."
        );
      }

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ==========================================
            HEADING
            ========================================== */}

        <div className="login-heading">
          <p className="login-label">
            ADMIN ACCESS
          </p>

          <h1>
            Welcome
            <br />
            back.
          </h1>

          <p>
            Sign in to manage your portfolio.
          </p>
        </div>

        {/* ==========================================
            LOGIN FORM
            ========================================== */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* USERNAME */}

          <div className="login-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* ERROR */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {/* SIGN IN */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* ==========================================
            FOOTER
            ========================================== */}

        <div className="login-footer">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
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