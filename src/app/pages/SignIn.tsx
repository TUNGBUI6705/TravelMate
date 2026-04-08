import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(130deg, #0f172a, #1e3a8a 60%, #0f766e)",
        padding: 16,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          borderRadius: 14,
          border: "1px solid #dbe3ee",
          padding: 20,
          display: "grid",
          gap: 14,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>TravelMate Admin</h1>
          <p style={{ margin: "8px 0 0", color: "#647087" }}>Sign in to continue.</p>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
          />
        </label>

        {error && (
          <div style={{ border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", borderRadius: 8, padding: "10px 12px", fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            height: 42,
            border: "none",
            borderRadius: 8,
            background: "#1d4ed8",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
