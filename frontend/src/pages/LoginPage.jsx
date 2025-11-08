import React from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  return (
    <div style={{ 
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)'
          }}>
            💳
          </div>

          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            fontWeight: '800',
            color: '#064e3b',
            letterSpacing: '-0.5px'
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            fontSize: '1rem', 
            color: '#6b7280',
            margin: 0
          }}>
            Sign in to access your payment portal
          </p>
        </div>

        {/* Login Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <Login />
        </div>

        {/* Register CTA Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            color: '#6b7280',
            marginBottom: '1rem',
            fontSize: '0.95rem'
          }}>
            Don't have an account yet?
          </p>
          
          <Link
            to="/register"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              padding: '0.875rem 2rem',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              display: 'inline-block',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            Create Account →
          </Link>
        </div>

        {/* Security Features - MOVED UP */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            color: '#064e3b',
            fontSize: '1rem',
            marginBottom: '1.25rem',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Secure Platform
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1rem 0.5rem'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 0.75rem'
              }}>
                🔐
              </div>
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                Encrypted
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '1rem 0.5rem'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 0.75rem'
              }}>
                🛡️
              </div>
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                Secured
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '1rem 0.5rem'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 0.75rem'
              }}>
                ✓
              </div>
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                Validated
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice Card - MOVED TO BOTTOM */}
        <div style={{
          backgroundColor: '#fffbeb',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #fde68a'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#fef3c7',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              ⚠️
            </div>
            <div>
              <h4 style={{ 
                color: '#92400e', 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700'
              }}>
                Account Protection
              </h4>
              <p style={{ 
                color: '#b45309', 
                fontSize: '0.85rem', 
                margin: 0,
                lineHeight: '1.5'
              }}>
                Multiple failed login attempts will result in temporary account restrictions for your protection.
              </p>
            </div>
          </div>
        </div>

        {/* Admin Portal Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <Link
            to="/admin/login"
            style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#059669';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6b7280';
              e.target.style.textDecoration = 'none';
            }}
          >
            <span>🔑</span>
            <span>Admin Portal Access</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;