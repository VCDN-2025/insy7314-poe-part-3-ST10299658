import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { setLoggedIn, setUser, checkAuthStatus } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Client-side validation for initial login
    if (!requiresMfa) {
      if (!/^\d{6,20}$/.test(accountNumber)) {
        setError("Account number must be 6-20 digits");
        setLoading(false);
        return;
      }
      
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
    }
    
    // Validate MFA token if required
    if (requiresMfa && mfaToken.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Attempting login...");
      const response = await loginUser({ 
        accountNumber, 
        password,
        mfaToken: requiresMfa ? mfaToken : undefined
      });
      
      console.log("Login response:", response.data);
      
      // Check if 2FA is required
      if (response.data.requiresMfa) {
        console.log("2FA required, showing MFA input");
        setRequiresMfa(true);
        setTempToken(response.data.tempToken);
        setError("");
        setLoading(false);
        return;
      }
      
      // Update state immediately
      setLoggedIn(true);
      setUser(response.data.user);
      
      // Optionally refresh auth status
      if (checkAuthStatus) {
        await checkAuthStatus();
      }
      
      // Navigate based on role
      const role = response.data.user?.role?.toLowerCase();
      console.log("Navigating after login, role:", role);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/dashboard");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setRequiresMfa(false);
    setMfaToken("");
    setTempToken("");
    setError("");
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <form onSubmit={handleSubmit}>
        {!requiresMfa ? (
          // Initial login form
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Account Number *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 20) {
                    setAccountNumber(value);
                  }
                }}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #dfe6e9',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your account number"
                maxLength="20"
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                6-20 digits only
              </small>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #dfe6e9',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
                maxLength="128"
              />
            </div>
          </>
        ) : (
          // MFA verification form
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
              <h2 style={{ 
                color: '#2c3e50', 
                marginBottom: '0.5rem',
                fontSize: '1.5rem'
              }}>
                Two-Factor Authentication
              </h2>
              <p style={{ 
                color: '#7f8c8d', 
                fontSize: '0.9rem',
                margin: 0
              }}>
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Authentication Code *
              </label>
              <input
                type="text"
                value={mfaToken}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setMfaToken(value);
                }}
                required
                disabled={loading}
                autoFocus
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #dfe6e9',
                  borderRadius: '4px',
                  fontSize: '1.5rem',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '0.5rem',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
                placeholder="000000"
                maxLength="6"
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                Enter the code from Google Authenticator or similar app
              </small>
            </div>

            <button
              type="button"
              onClick={handleBackToLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: '#7f8c8d',
                border: '2px solid #dfe6e9',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              ← Back to Login
            </button>
          </>
        )}
        
        <button 
          type="submit" 
          disabled={loading || (requiresMfa && mfaToken.length !== 6)}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: loading || (requiresMfa && mfaToken.length !== 6) ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading || (requiresMfa && mfaToken.length !== 6) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? "Verifying..." : requiresMfa ? "Verify & Login" : "Login"}
        </button>
        
        {error && (
          <div style={{ 
            color: '#721c24', 
            marginTop: '1rem',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {requiresMfa && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#0c5460'
          }}>
            💡 <strong>Tip:</strong> Your code refreshes every 30 seconds
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;