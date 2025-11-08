// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <div style={styles.icon}>🔑</div>
          </div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Staff access for administrators & employees</p>
        </div>

        {/* Login Card */}
        <div style={styles.formCard}>
          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address <span style={{ color: '#059669' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portal.com"
                required
                style={styles.input}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
                disabled={loading}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
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

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* Customer Login Button */}
          <button
            onClick={() => navigate("/login")}
            style={styles.customerButton}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#059669';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#e5e7eb';
              }
            }}
          >
            Customer Login →
          </button>
        </div>

        {/* Role Cards */}
        <div style={styles.roleCards}>
          <div style={styles.roleCard}>
            <div style={styles.roleIcon}>👨‍💼</div>
            <div style={styles.roleTitle}>Administrator</div>
            <div style={styles.roleText}>Full system access and management</div>
          </div>
          <div style={styles.roleCard}>
            <div style={styles.roleIcon}>👔</div>
            <div style={styles.roleTitle}>Employee</div>
            <div style={styles.roleText}>Payment verification and processing</div>
          </div>
        </div>

        {/* Security Info */}
        <div style={styles.securityBadge}>
          <div style={styles.securityIcon}>🛡️</div>
          <div>
            <div style={styles.securityTitle}>Authorized Access Only</div>
            <div style={styles.securityText}>
              All login attempts are monitored and logged for security
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div style={styles.footer}>
          <button
            onClick={() => navigate("/")}
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
          </button>
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
    background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
    padding: '2rem 1rem'
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '480px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  icon: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#064e3b',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#065f46',
    margin: 0,
    fontWeight: '500'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    padding: '2.5rem',
    marginBottom: '1.5rem'
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '0.875rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#dc2626',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginBottom: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'white'
  },
  submitButton: {
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e5e7eb'
  },
  dividerText: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  customerButton: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: 'white',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  roleCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  roleIcon: {
    fontSize: '2rem',
    marginBottom: '0.75rem'
  },
  roleTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: '0.5rem'
  },
  roleText: {
    fontSize: '0.8rem',
    color: '#6b7280',
    lineHeight: '1.4'
  },
  securityBadge: {
    backgroundColor: '#fffbeb',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid #fde68a',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  securityIcon: {
    width: '48px',
    height: '48px',
    background: '#fef3c7',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0
  },
  securityTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#92400e',
    marginBottom: '0.25rem'
  },
  securityText: {
    fontSize: '0.85rem',
    color: '#b45309',
    lineHeight: '1.4'
  },
  footer: {
    textAlign: 'center'
  },
  backLink: {
    color: '#6b7280',
    fontSize: '0.9rem',
    textDecoration: 'none',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '0.5rem'
  }
};

export default AdminLogin;