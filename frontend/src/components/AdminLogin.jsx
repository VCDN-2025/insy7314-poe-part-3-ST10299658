// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Fixed import path

const AdminLogin = () => {
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
      // Call login API
      const res = await api.post("/auth/login", { email, password });

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
      <div style={styles.formCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>👨‍💼</span>
          </div>
          <h1 style={styles.title}>Administration Portal</h1>
          <p style={styles.subtitle}>Login for Administrators & Employees</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bankportal.com"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              <>🔐 Login to Administration</>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={styles.customerButton}
            disabled={loading}
          >
            👤 Customer Login
          </button>
        </div>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <strong>🔐 Secure Access:</strong> This portal is exclusively for authorized 
            administrators and employees. All login attempts are monitored and logged.
          </p>
        </div>
      </div>

      {/* Side Info Panel */}
      <div style={styles.sidePanel}>
        <h2 style={styles.sidePanelTitle}>Administration Access</h2>
        <div style={styles.featureList}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>👨‍💼</span>
            <div>
              <h3 style={styles.featureTitle}>Administrator</h3>
              <p style={styles.featureText}>
                Manage employees, view all transactions, and oversee system operations
              </p>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>👔</span>
            <div>
              <h3 style={styles.featureTitle}>Employee</h3>
              <p style={styles.featureText}>
                Verify and process customer payments, monitor transaction status
              </p>
            </div>
          </div>
        </div>

        <div style={styles.securityBadge}>
          <span style={styles.securityIcon}>🛡️</span>
          <div>
            <h4 style={styles.securityTitle}>Enterprise Security</h4>
            <p style={styles.securityText}>
              Multi-factor authentication • Encrypted connections • Audit logging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    gap: '3rem'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '3rem',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    backgroundColor: '#f3f4f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  icon: {
    fontSize: '3rem'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#991b1b',
    fontSize: '0.95rem'
  },
  errorIcon: {
    fontSize: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  labelIcon: {
    fontSize: '1.2rem'
  },
  input: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: 'inherit'
  },
  submitButton: {
    padding: '1rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
  },
  footer: {
    marginTop: '2rem'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 1rem',
    color: '#9ca3af',
    fontSize: '0.875rem',
    position: 'relative',
    zIndex: 1
  },
  customerButton: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  infoBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  infoText: {
    fontSize: '0.875rem',
    color: '#4b5563',
    margin: 0,
    lineHeight: '1.6'
  },
  sidePanel: {
    maxWidth: '400px',
    color: 'white'
  },
  sidePanelTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: 'white'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  feature: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  featureIcon: {
    fontSize: '2.5rem',
    flexShrink: 0
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0'
  },
  featureText: {
    fontSize: '0.95rem',
    opacity: 0.9,
    margin: 0,
    lineHeight: '1.5'
  },
  securityBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  securityIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  securityTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0'
  },
  securityText: {
    fontSize: '0.875rem',
    opacity: 0.9,
    margin: 0,
    lineHeight: '1.5'
  }
};

// Add CSS for animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button[type="submit"]:hover:not(:disabled) {
    background-color: #5568d3 !important;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  button[type="submit"]:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 968px) {
    .side-panel {
      display: none;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AdminLogin;