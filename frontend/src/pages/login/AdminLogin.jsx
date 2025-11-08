// Frontend/src/pages/login/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });

      console.log("Login response:", res.data);

      // Save token
      localStorage.setItem("token", res.data.token);
      
      // Save user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "employee") {
         navigate("/employee-dashboard");
      } else {
        setError("Access denied. Admin or Employee access only.");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <div style={styles.icon}>🔑</div>
          </div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Secure staff access only</p>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          {error && (
            <div style={styles.error}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address <span style={{ color: '#059669' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="admin@portal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password <span style={{ color: '#059669' }}>*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                }
              }}
            >
              {loading ? "Verifying..." : "Access Portal"}
            </button>
          </form>
        </div>

        {/* Access Badge */}
        <div style={styles.badge}>
          <div style={styles.badgeIcon}>🛡️</div>
          <div>
            <div style={styles.badgeTitle}>Authorized Personnel Only</div>
            <div style={styles.badgeText}>Admin and Staff Access</div>
          </div>
        </div>

        {/* Back to Main */}
        <div style={styles.footer}>
          <Link
            to="/"
            style={styles.backLink}
            onMouseEnter={(e) => {
              e.target.style.color = '#059669';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6b7280';
              e.target.style.textDecoration = 'none';
            }}
          >
            ← Back to Main Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
    padding: "2rem 1rem"
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "440px"
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem"
  },
  icon: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    boxShadow: "0 8px 20px rgba(5, 150, 105, 0.3)"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#064e3b",
    margin: "0 0 0.5rem 0",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    fontSize: "1rem",
    color: "#065f46",
    margin: 0,
    fontWeight: "500"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    padding: "2.5rem",
    marginBottom: "1.5rem"
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "0.875rem",
    borderRadius: "10px",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    border: "1px solid #fecaca",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#374151"
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    transition: "all 0.2s",
    outline: "none",
    backgroundColor: "white"
  },
  button: {
    padding: "0.875rem",
    border: "none",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "white",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "0.5rem",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)"
  },
  badge: {
    backgroundColor: "#fffbeb",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid #fde68a",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  badgeIcon: {
    width: "48px",
    height: "48px",
    background: "#fef3c7",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    flexShrink: 0
  },
  badgeTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#92400e",
    marginBottom: "0.25rem"
  },
  badgeText: {
    fontSize: "0.85rem",
    color: "#b45309"
  },
  footer: {
    textAlign: "center"
  },
  backLink: {
    color: "#6b7280",
    fontSize: "0.9rem",
    textDecoration: "none",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s"
  }
};