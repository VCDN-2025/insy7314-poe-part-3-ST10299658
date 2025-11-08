import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Apply input restrictions based on field
    let sanitizedValue = value;
    
    if (name === 'fullName') {
      // Only allow letters, spaces, and common name characters
      sanitizedValue = value.replace(/[^A-Za-z ,.'-]/g, '');
      if (sanitizedValue.length > 100) return;
    } else if (name === 'idNumber') {
      // Only allow digits, max 13
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 13) return;
    } else if (name === 'accountNumber') {
      // Only allow digits, max 20
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 20) return;
    } else if (name === 'password' || name === 'confirmPassword') {
      // Limit password length
      if (value.length > 128) return;
    }
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validateForm = () => {
    const { fullName, idNumber, accountNumber, password, confirmPassword } = form;
    
    if (!fullName || fullName.length < 2) {
      setError("Full name must be at least 2 characters");
      return false;
    }
    
    if (!idNumber || idNumber.length !== 13) {
      setError("ID number must be exactly 13 digits");
      return false;
    }
    
    if (!accountNumber || accountNumber.length < 6) {
      setError("Account number must be at least 6 digits");
      return false;
    }
    
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setError("Password must contain: uppercase, lowercase, number, special character (@$!%*?&), min 8 chars");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      const { confirmPassword, ...submitData } = form;
      await registerUser(submitData);
      setSuccess("Registration successful! You can now login.");
      setError("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 400px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ 
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 1rem'
          }}>
            ✨
          </div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '800',
            color: '#064e3b',
            margin: '0 0 0.5rem 0'
          }}>
            Create Account
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
            margin: 0
          }}>
            Join our secure payment platform
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Full Name <span style={{ color: '#059669' }}>*</span>
            </label>
            <input 
              name="fullName" 
              value={form.fullName} 
              onChange={handleChange}
              required 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                outline: 'none',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="Enter your full name"
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Email <span style={{ color: '#6b7280', fontWeight: '400' }}>(Optional)</span>
            </label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                outline: 'none',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="your.email@example.com"
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          
          {/* ID Number */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              ID Number <span style={{ color: '#059669' }}>*</span>
            </label>
            <input 
              name="idNumber" 
              value={form.idNumber} 
              onChange={handleChange}
              required 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                outline: 'none',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="13-digit ID number"
              maxLength="13"
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          
          {/* Account Number */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Account Number <span style={{ color: '#059669' }}>*</span>
            </label>
            <input 
              name="accountNumber" 
              value={form.accountNumber} 
              onChange={handleChange}
              required 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                outline: 'none',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="6-20 digit account number"
              maxLength="20"
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          
          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Password <span style={{ color: '#059669' }}>*</span>
            </label>
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange}
              required 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                outline: 'none',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="Create a strong password"
              maxLength="128"
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <small style={{ 
              color: '#6b7280', 
              fontSize: '0.8rem',
              display: 'block',
              marginTop: '0.5rem',
              lineHeight: '1.4'
            }}>
              Must contain: uppercase, lowercase, number, special character (@$!%*?&)
            </small>
          </div>
          
          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Confirm Password <span style={{ color: '#059669' }}>*</span>
            </label>
            <input 
              name="confirmPassword" 
              type="password" 
              value={form.confirmPassword} 
              onChange={handleChange}
              required 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                outline: 'none',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="Confirm your password"
              maxLength="128"
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          
          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#dc2626', 
              marginTop: '1rem',
              backgroundColor: '#fef2f2',
              padding: '0.875rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div style={{ 
              color: '#059669', 
              marginTop: '1rem',
              backgroundColor: '#ecfdf5',
              padding: '0.875rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <span>{success}</span>
            </div>
          )}
        </form>

        {/* Footer Link */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{
                color: '#059669',
                textDecoration: 'none',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;