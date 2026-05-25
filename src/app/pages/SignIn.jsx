import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { onAuthChange, signIn } from "../../config/firebaseUtils.js";

const getAuthErrorMessage = (error) => {
  const code = typeof error === "object" && error && error.code ? String(error.code) : "";
  const message = typeof error === "object" && error && error.message ? String(error.message) : "";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await signIn(email, password);
    } catch (signInError) {
      const errorMsg = getAuthErrorMessage(signInError);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 24, color: "#1f2a3d" }}>TravelMate Admin</h1>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#647087" }}>Sign in to access the admin panel</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          {error && (
            <div style={{ padding: 10, borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 12 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1f2a3d", marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="admin@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d9e0ea",
                borderRadius: 8,
                fontSize: 13,
                boxSizing: "border-box",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1f2a3d", marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d9e0ea",
                borderRadius: 8,
                fontSize: 13,
                boxSizing: "border-box",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: isSubmitting ? "#cbd5e1" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: isSubmitting ? "wait" : "pointer",
            }}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ margin: "20px 0 0", fontSize: 12, color: "#647087", textAlign: "center" }}>
          Test account: admin@test.com / password
        </p>
      </div>
    </div>
  );
}
