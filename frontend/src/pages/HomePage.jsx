import React from "react";
import { Link, useOutletContext } from "react-router-dom";

function HomePage() {
  const { loggedIn, user } = useOutletContext();

  return (
    <div style={{ marginTop: '-2rem', marginLeft: '-1.5rem', marginRight: '-1.5rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
        padding: '4rem 2rem',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: loggedIn ? '1fr' : '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '0.4rem 1rem',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#059669',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              Trusted Payment Platform
            </div>

            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              color: '#064e3b',
              margin: '0 0 1rem 0',
              lineHeight: '1.1',
              letterSpacing: '-1px'
            }}>
              {loggedIn ? `Welcome back, ${user?.fullName}` : 'PAYMENTS PORTAL'}
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#065f46',
              margin: '0 0 2rem 0',
              lineHeight: '1.7',
              maxWidth: '550px'
            }}>
              {loggedIn 
                ? 'Your dashboard is ready. Manage payments, track transactions, and access all your account features.'
                : 'Streamlined payment solutions for businesses and individuals worldwide. Fast, secure, and reliable.'}
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {loggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    style={{
                      padding: '0.875rem 2rem',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/make-payment"
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: '#ffffff',
                      color: '#059669',
                      textDecoration: 'none',
                      border: '2px solid #059669',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}
                  >
                    New Payment
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{
                      padding: '0.875rem 2rem',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: '#ffffff',
                      color: '#059669',
                      textDecoration: 'none',
                      border: '2px solid #059669',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {!loggedIn && (
            <div style={{
              background: '#ffffff',
              padding: '2.5rem',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'grid',
                gap: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#d1fae5',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    🌐
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#064e3b'
                    }}>
                      International Access
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      Process transactions across multiple countries
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#d1fae5',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    💸
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#064e3b'
                    }}>
                      Quick Processing
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      Efficient automated verification systems
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#d1fae5',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    🔐
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#064e3b'
                    }}>
                      Protected Transactions
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      Modern security standards protect your data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#059669',
              marginBottom: '0.5rem'
            }}>
              100+
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Active Regions
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#059669',
              marginBottom: '0.5rem'
            }}>
              99%
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Service Availability
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#059669',
              marginBottom: '0.5rem'
            }}>
              24/7
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Support Access
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#059669',
              marginBottom: '0.5rem'
            }}>
              Fast
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Transaction Speed
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#064e3b',
              margin: '0 0 1rem 0'
            }}>
              Security Implementation
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              margin: 0
            }}>
              Built with modern security standards to safeguard your operations
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1.25rem'
              }}>
                🔒
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#064e3b',
                margin: '0 0 0.75rem 0'
              }}>
                Encrypted Communications
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Secure data transmission protocols protect information in transit
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1.25rem'
              }}>
                ✅
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#064e3b',
                margin: '0 0 0.75rem 0'
              }}>
                Data Validation
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Comprehensive checks ensure data integrity and prevent malicious input
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1.25rem'
              }}>
                🛡️
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#064e3b',
                margin: '0 0 0.75rem 0'
              }}>
                Access Control
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Robust authentication mechanisms protect user accounts
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1.25rem'
              }}>
                🚦
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#064e3b',
                margin: '0 0 0.75rem 0'
              }}>
                Request Throttling
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Automated systems monitor and limit excessive requests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!loggedIn && (
        <section style={{
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              margin: '0 0 1rem 0'
            }}>
              Start Using Our Platform
            </h2>
            <p style={{
              fontSize: '1.2rem',
              margin: '0 0 2rem 0',
              opacity: '0.95'
            }}>
              Create your account and begin managing payments efficiently
            </p>
            <Link
              to="/register"
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: '#ffffff',
                color: '#059669',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                display: 'inline-block',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}
            >
              Create Account →
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <div style={{
        backgroundColor: '#064e3b',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0.5rem 0', opacity: '0.9' }}>
          © 2025 Payments Portal. All rights reserved.
        </p>
        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', opacity: '0.8' }}>
          Efficient • Reliable • Secure
        </p>
      </div>
    </div>
  );
}

export default HomePage;