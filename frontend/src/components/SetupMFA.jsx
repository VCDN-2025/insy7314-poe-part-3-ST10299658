import React, { useState } from "react";
import api from "../services/api"; // ✅ Use your api instance instead of axios

const SetupMFA = ({ user }) => {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setMessage("Generating QR code...");
      // ✅ Changed: Use api instance with relative path
      const response = await api.post("/mfa/setup", {});

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setMessage("");
    } catch (error) {
      console.error("Setup MFA error:", error);
      setMessage("Failed to generate QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      // ✅ Changed: Use api instance with relative path
      const response = await api.post("/mfa/verify", { token });

      if (response.data.success) {
        setIsVerified(true);
        setMessage("");
        // Clear QR code after successful verification
        setTimeout(() => {
          setQrCode(null);
          setSecret("");
          setToken("");
        }, 100);
      } else {
        setMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Error verifying code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsVerified(false);
    setQrCode(null);
    setSecret("");
    setToken("");
    setMessage("");
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Initial State - Not Started */}
      {!qrCode && !isVerified && (
        <div>
          <p style={{ 
            color: '#7f8c8d', 
            fontSize: '0.95rem',
            marginBottom: '1.25rem',
            lineHeight: '1.6'
          }}>
            Secure your account with two-factor authentication
          </p>
          <button 
            onClick={handleGenerate} 
            disabled={isLoading}
            style={{ 
              padding: '0.9rem 2rem',
              backgroundColor: isLoading ? '#95a5a6' : '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#e67e22';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#f39c12';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></span>
                Generating...
              </>
            ) : (
              <>
                <span>🔐</span>
                Enable 2FA
              </>
            )}
          </button>
        </div>
      )}

      {/* QR Code Display State */}
      {qrCode && !isVerified && (
        <div style={{
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            border: '2px dashed #dee2e6'
          }}>
            <p style={{ 
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📱 Scan with Google Authenticator
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <img 
                src={qrCode} 
                alt="MFA QR Code" 
                style={{ 
                  width: '200px', 
                  height: '200px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  padding: '0.5rem'
                }} 
              />
            </div>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#7f8c8d',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}>
              Manual Entry Code:
            </p>
            <p style={{ 
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#2c3e50',
              backgroundColor: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: '600',
              wordBreak: 'break-all'
            }}>
              {secret}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Enter 6-digit verification code:
            </label>
            <input
              type="text"
              placeholder="000000"
              value={token}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setToken(value);
              }}
              maxLength="6"
              style={{ 
                padding: '0.9rem 1rem',
                width: '100%',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontFamily: 'monospace',
                textAlign: 'center',
                letterSpacing: '0.3rem',
                fontWeight: '600',
                marginBottom: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#f39c12'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
            />
            
            <button 
              onClick={handleVerify} 
              disabled={isLoading || token.length !== 6}
              style={{ 
                padding: '0.9rem 2rem',
                backgroundColor: isLoading || token.length !== 6 ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading || token.length !== 6 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && token.length === 6) {
                  e.currentTarget.style.backgroundColor = '#229954';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && token.length === 6) {
                  e.currentTarget.style.backgroundColor = '#27ae60';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                  Verifying...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Verify & Enable
                </>
              )}
            </button>
          </div>

          {message && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fadbd8',
              color: '#c0392b',
              borderRadius: '8px',
              fontSize: '0.9rem',
              textAlign: 'center',
              border: '1px solid #e74c3c'
            }}>
              {message}
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {isVerified && (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            animation: 'scaleIn 0.5s ease-out'
          }}>
            ✅
          </div>
          <h3 style={{
            color: '#27ae60',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            2FA Enabled Successfully!
          </h3>
          <p style={{
            color: '#7f8c8d',
            fontSize: '0.95rem',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Your account is now protected with two-factor authentication. 
            You'll need to enter a code from your authenticator app when logging in.
          </p>
          <div style={{
            backgroundColor: '#d5f4e6',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #27ae60'
          }}>
            <p style={{
              color: '#27ae60',
              fontSize: '0.85rem',
              margin: 0,
              fontWeight: '600'
            }}>
              🛡️ Your account security has been enhanced
            </p>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#7f8c8d',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#95a5a6';
              e.currentTarget.style.color = '#2c3e50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#dee2e6';
              e.currentTarget.style.color = '#7f8c8d';
            }}
          >
            Close
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SetupMFA;