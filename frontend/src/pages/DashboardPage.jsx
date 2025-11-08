import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getUserPayments } from "../services/api";
import SetupMFA from "../components/SetupMFA";

function DashboardPage() {
  const { user } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getUserPayments();
        console.log("API Response:", res.data);
        
        // Handle different response structures
        const paymentsData = res.data?.payments || res.data || [];
        console.log("Payments array:", paymentsData);
        
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error("Error fetching payments:", err.response?.data || err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate stats - handle different status formats
  const totalPayments = payments.length;
  
  // Check for both lowercase and capitalized status
  const completedPayments = payments.filter(p => 
    p.status?.toLowerCase() === 'completed' || 
    p.status?.toLowerCase() === 'approved'
  ).length;
  
  const pendingPayments = payments.filter(p => 
    p.status?.toLowerCase() === 'pending'
  ).length;
  
  const recentPayments = payments.slice(0, 5);

  console.log("Stats:", { totalPayments, completedPayments, pendingPayments });

  return (
    <div style={{ 
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      paddingBottom: '3rem'
    }}>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        borderRadius: '0 0 24px 24px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            backgroundColor: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>👋</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#059669' }}>
              WELCOME BACK
            </span>
          </div>

          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            fontWeight: '800',
            color: '#064e3b',
            letterSpacing: '-0.5px'
          }}>
            {user?.fullName || "User"}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#065f46',
              fontSize: '0.95rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>💳</span>
              <span style={{ fontWeight: '600' }}>Account:</span>
              <span style={{ fontWeight: '700' }}>{user?.accountNumber || "N/A"}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#065f46',
              fontSize: '0.95rem'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
              <span style={{ fontWeight: '600' }}>Active</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Quick Actions Section - MOVED UP */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{
            color: '#064e3b',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            fontWeight: '700'
          }}>
            Quick Actions
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Make Payment Card */}
            <Link
              to="/make-payment"
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                display: 'block',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                💸
              </div>
              <h3 style={{ 
                color: '#064e3b', 
                marginBottom: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                New Payment
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.9rem',
                margin: '0 0 1rem 0',
                lineHeight: '1.5'
              }}>
                Process secure payments quickly
              </p>
              <div style={{
                color: '#059669',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>Start Payment</span>
                <span>→</span>
              </div>
            </Link>

            {/* Payment History Card */}
            <Link
              to="/payments"
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                display: 'block',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                📊
              </div>
              <h3 style={{ 
                color: '#064e3b', 
                marginBottom: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                Transaction History
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.9rem',
                margin: '0 0 1rem 0',
                lineHeight: '1.5'
              }}>
                View all your transactions
              </p>
              <div style={{
                color: '#059669',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>View History</span>
                <span>→</span>
              </div>
            </Link>

            {/* Setup MFA Card */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid #e5e7eb'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                🔒
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem', 
                color: '#064e3b' 
              }}>
                Setup 2FA
              </h3>
              <SetupMFA user={user} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{
            color: '#064e3b',
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            fontWeight: '700'
          }}>
            Overview
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Total Payments Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.85rem', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Payments
                  </p>
                  <h3 style={{ 
                    color: '#059669', 
                    fontSize: '2.5rem', 
                    margin: '0 0 0.25rem 0',
                    fontWeight: '800'
                  }}>
                    {loading ? '...' : totalPayments}
                  </h3>
                  <p style={{ 
                    color: '#10b981', 
                    fontSize: '0.8rem',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    All transactions
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  💰
                </div>
              </div>
            </div>

            {/* Completed Payments Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.85rem', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Completed
                  </p>
                  <h3 style={{ 
                    color: '#059669', 
                    fontSize: '2.5rem', 
                    margin: '0 0 0.25rem 0',
                    fontWeight: '800'
                  }}>
                    {loading ? '...' : completedPayments}
                  </h3>
                  <p style={{ 
                    color: '#10b981', 
                    fontSize: '0.8rem',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Successfully processed
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  ✓
                </div>
              </div>
            </div>

            {/* Pending Payments Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.85rem', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pending
                  </p>
                  <h3 style={{ 
                    color: '#f59e0b', 
                    fontSize: '2.5rem', 
                    margin: '0 0 0.25rem 0',
                    fontWeight: '800'
                  }}>
                    {loading ? '...' : pendingPayments}
                  </h3>
                  <p style={{ 
                    color: '#fbbf24', 
                    fontSize: '0.8rem',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    In progress
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  ⏳
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments Section */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <h3 style={{ 
                color: '#064e3b', 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                Recent Transactions
              </h3>
              
              <Link 
                to="/payments"
                style={{
                  color: '#059669',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>View All</span>
                <span>→</span>
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <p style={{ fontSize: '1rem' }}>Loading transactions...</p>
              </div>
            ) : error ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                backgroundColor: '#fef2f2',
                borderRadius: '12px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                <p style={{ color: '#dc2626', fontSize: '1rem', margin: 0 }}>{error}</p>
              </div>
            ) : recentPayments.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                backgroundColor: '#f9fafb',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                <h4 style={{ color: '#064e3b', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '700' }}>
                  No Payments Yet
                </h4>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Start processing payments today!
                </p>
                <Link
                  to="/make-payment"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    padding: '0.875rem 2rem',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  Make Your First Payment →
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ 
                        padding: '0.875rem 1rem', 
                        textAlign: 'left',
                        color: '#064e3b',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>Amount</th>
                      <th style={{ 
                        padding: '0.875rem 1rem', 
                        textAlign: 'left',
                        color: '#064e3b',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>Currency</th>
                      <th style={{ 
                        padding: '0.875rem 1rem', 
                        textAlign: 'left',
                        color: '#064e3b',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>Provider</th>
                      <th style={{ 
                        padding: '0.875rem 1rem', 
                        textAlign: 'left',
                        color: '#064e3b',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>Status</th>
                      <th style={{ 
                        padding: '0.875rem 1rem', 
                        textAlign: 'left',
                        color: '#064e3b',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((p, index) => {
                      const status = p.status?.toLowerCase() || 'pending';
                      const isCompleted = status === 'completed' || status === 'approved';
                      
                      return (
                        <tr key={p._id || index} style={{ 
                          borderBottom: index !== recentPayments.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}>
                          <td style={{ 
                            padding: '1rem',
                            fontWeight: '700',
                            color: '#064e3b'
                          }}>
                            {p.currency} {p.amount}
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>
                            {p.currency}
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>
                            {p.provider || 'Standard'}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.4rem 0.875rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              backgroundColor: isCompleted ? '#ecfdf5' : '#fef3c7',
                              color: isCompleted ? '#059669' : '#f59e0b',
                              textTransform: 'capitalize',
                              border: `1px solid ${isCompleted ? '#a7f3d0' : '#fde68a'}`
                            }}>
                              {p.status || 'Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;