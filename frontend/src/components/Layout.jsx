import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/api";

function Layout({ loggedIn, user, setLoggedIn, setUser, checkAuthStatus }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      style={{
        padding: '0.5rem 1rem',
        textDecoration: 'none',
        color: isActive(to) ? '#047857' : '#6b7280',
        fontWeight: isActive(to) ? '600' : '500',
        fontSize: '0.95rem',
        borderRadius: '8px',
        backgroundColor: isActive(to) ? '#ecfdf5' : 'transparent',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </Link>
  );

  // Determine user role
  const isCustomer = user?.role === 'customer' || !user?.role;
  const isEmployee = user?.role === 'employee';
  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Top Navigation Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              💳
            </div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#047857',
              letterSpacing: '-0.5px'
            }}>
              PAYMENTS PORTAL
            </span>
          </Link>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {loggedIn ? (
              <>
                {/* Customer Navigation */}
                {isCustomer && (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/make-payment">New Payment</NavLink>
                    <NavLink to="/payments">Transactions</NavLink>
                  </>
                )}

                {/* Employee Navigation */}
                {isEmployee && (
                  <>
                    <NavLink to="/employee-dashboard">Dashboard</NavLink>
                    <NavLink to="/employee-dashboard">Verify Payments</NavLink>
                  </>
                )}

                {/* Admin Navigation */}
                {isAdmin && (
                  <>
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink to="/admin/employees">Staff</NavLink>
                    <NavLink to="/admin/transactions">All Transactions</NavLink>
                  </>
                )}

                <div style={{
                  height: '30px',
                  width: '1px',
                  backgroundColor: '#e5e7eb',
                  margin: '0 0.5rem'
                }} />

                <div style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  <div style={{ fontWeight: '600' }}>{user?.fullName}</div>
                  {isAdmin && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Admin</div>}
                  {isEmployee && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Staff</div>}
                  {isCustomer && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user?.accountNumber}</div>}
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1.25rem',
                    backgroundColor: '#ffffff',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: '0.5rem 1.25rem',
                    textDecoration: 'none',
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  Register
                </Link>
                <Link
                  to="/admin/login"
                  style={{
                    padding: '0.5rem 1.25rem',
                    backgroundColor: '#ffffff',
                    color: '#059669',
                    textDecoration: 'none',
                    border: '2px solid #059669',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  Admin Portal
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <Outlet context={{ loggedIn, user, setLoggedIn, setUser, checkAuthStatus }} />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem'
        }}>
          {/* Footer Top - Info Sections */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {/* About Section */}
            <div>
              <h4 style={{ 
                fontSize: '1.15rem', 
                marginBottom: '1rem',
                fontWeight: '600',
                color: '#047857'
              }}>
                About
              </h4>
              <p style={{ 
                margin: 0, 
                lineHeight: '1.7',
                color: '#6b7280',
                fontSize: '0.95rem'
              }}>
                Providing reliable payment processing services with secure transaction management for businesses globally.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ 
                fontSize: '1.15rem', 
                marginBottom: '1rem',
                fontWeight: '600',
                color: '#047857'
              }}>
                Navigation
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem'
              }}>
                <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Home
                </Link>
                <Link to="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Login
                </Link>
                <Link to="/register" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Register
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 style={{ 
                fontSize: '1.15rem', 
                marginBottom: '1rem',
                fontWeight: '600',
                color: '#047857'
              }}>
                Services
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#6b7280'
              }}>
                <div>Payment Processing</div>
                <div>Transaction Management</div>
                <div>Account Services</div>
                <div>Support Services</div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ 
                fontSize: '1.15rem', 
                marginBottom: '1rem',
                fontWeight: '600',
                color: '#047857'
              }}>
                Contact
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
                fontSize: '0.95rem',
                color: '#6b7280'
              }}>
                <div>support@portal.com</div>
                <div>+1 (555) 123-4567</div>
                <div>Mon-Fri: 9AM-5PM</div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                💳
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  © 2025 Payment Processing System. All rights reserved.
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                padding: '0.4rem 0.9rem',
                backgroundColor: '#ecfdf5',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#047857',
                border: '1px solid #a7f3d0'
              }}>
                Secure Platform
              </div>
              <div style={{
                padding: '0.4rem 0.9rem',
                backgroundColor: '#ecfdf5',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#047857',
                border: '1px solid #a7f3d0'
              }}>
                Encrypted
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;