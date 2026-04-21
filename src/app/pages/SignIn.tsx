import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { onAuthChange, signIn } from "../../config/firebaseUtils";

const getAuthErrorMessage = (error: unknown): string => {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  const message = typeof error === "object" && error && "message" in error ? String(error.message) : "";

  if (message.includes("ERR_BLOCKED_BY_CLIENT") || message.includes("Failed to fetch")) {
    return "Network error: Ad blocker or firewall is blocking Firebase. Please disable ad blocker and try again.";
  }
  if (message.includes("ERR_NAME_NOT_RESOLVED") || message.includes("Network error")) {
    return "Network connection error. Please check your internet connection.";
  }

  switch (code) {
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and disable any ad blockers.";
    case "auth/api-key-not-valid":
      return "Firebase configuration error. Please contact your administrator.";
    default:
      return "Unable to sign in right now. Please try again.";
  }
};

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      console.log("🔐 Attempting to sign in with:", email);
      await signIn(email.trim(), password);
      console.log("✅ Sign in successful, redirecting to dashboard...");
      navigate("/dashboard", { replace: true });
    } catch (signInError) {
      console.error("❌ Sign in failed:", signInError);
      if (typeof signInError === "object" && signInError) {
        console.error("Error details:", {
          code: "code" in signInError ? signInError.code : "unknown",
          message: "message" in signInError ? signInError.message : "unknown",
        });
      }
      setError(getAuthErrorMessage(signInError));
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          style={{
            height: 42,
            border: "none",
            borderRadius: 8,
            background: "#1d4ed8",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
