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
      backgroundColor: '#f0f4f0', 
      minHeight: '100vh', 
      marginTop: '-2rem', 
      marginLeft: '-2rem', 
      marginRight: '-2rem',
      paddingBottom: '3rem'
    }}>
      {/* Hero Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        color: 'white',
        padding: '3rem 2rem 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          opacity: '0.6'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          opacity: '0.6'
        }}></div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '0.6rem 1.5rem',
            borderRadius: '50px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px' }}>
              DASHBOARD
            </span>
          </div>

          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            fontWeight: '700',
            letterSpacing: '-1px'
          }}>
            Welcome, {user?.fullName || "User"}!
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ 
                fontSize: '0.85rem', 
                opacity: '0.9',
                margin: '0 0 0.25rem'
              }}>
                Account Number
              </p>
              <p style={{ 
                fontSize: '1.3rem',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '1px'
              }}>
                {user?.accountNumber || "N/A"}
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ 
                fontSize: '0.85rem', 
                opacity: '0.9',
                margin: '0 0 0.25rem'
              }}>
                Status
              </p>
              <p style={{ 
                fontSize: '1.3rem',
                fontWeight: '700',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>✓</span> Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Elevated */}
      <div style={{
        maxWidth: '1200px',
        margin: '-3.5rem auto 2rem',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Total Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            borderTop: '5px solid #43a047',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Total Payments
                </p>
                <h3 style={{ 
                  color: '#2e7d32', 
                  fontSize: '3rem', 
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {loading ? '...' : totalPayments}
                </h3>
                <p style={{ 
                  color: '#43a047', 
                  fontSize: '0.85rem',
                  margin: '0.5rem 0 0',
                  fontWeight: '600'
                }}>
                  All transactions
                </p>
              </div>
              <div style={{
                backgroundColor: '#e8f5e9',
                borderRadius: '16px',
                padding: '1rem',
                fontSize: '2.5rem'
              }}>
                💰
              </div>
            </div>
          </div>

          {/* Completed Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            borderTop: '5px solid #66bb6a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Completed
                </p>
                <h3 style={{ 
                  color: '#2e7d32', 
                  fontSize: '3rem', 
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {loading ? '...' : completedPayments}
                </h3>
                <p style={{ 
                  color: '#66bb6a', 
                  fontSize: '0.85rem',
                  margin: '0.5rem 0 0',
                  fontWeight: '600'
                }}>
                  Successfully processed
                </p>
              </div>
              <div style={{
                backgroundColor: '#e8f5e9',
                borderRadius: '16px',
                padding: '1rem',
                fontSize: '2.5rem'
              }}>
                ✓
              </div>
            </div>
          </div>

          {/* Pending Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            borderTop: '5px solid #ff9800'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pending
                </p>
                <h3 style={{ 
                  color: '#2e7d32', 
                  fontSize: '3rem', 
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {loading ? '...' : pendingPayments}
                </h3>
                <p style={{ 
                  color: '#ff9800', 
                  fontSize: '0.85rem',
                  margin: '0.5rem 0 0',
                  fontWeight: '600'
                }}>
                  In progress
                </p>
              </div>
              <div style={{
                backgroundColor: '#fff3e0',
                borderRadius: '16px',
                padding: '1rem',
                fontSize: '2.5rem'
              }}>
                ⏳
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        padding: '0 2rem'
      }}>
        <h2 style={{
          color: '#2e7d32',
          fontSize: '1.8rem',
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
          {/* Setup MFA Card */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                opacity: 0.1
              }}
            ></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2e7d32' }}>
                Setup 2FA
              </h3>
              <SetupMFA user={user} />
            </div>
          </div>

          {/* Make Payment Card */}
          <Link
            to="/make-payment"
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              textDecoration: 'none',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              display: 'block',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.borderColor = '#43a047';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)',
              opacity: '0.1'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                fontSize: '3.5rem', 
                marginBottom: '1rem'
              }}>💳</div>
              <h3 style={{ 
                color: '#2e7d32', 
                marginBottom: '0.75rem',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                New Payment
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Process secure payments through our platform
              </p>
              <div style={{
                marginTop: '1.5rem',
                color: '#43a047',
                fontWeight: '700',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>Start Payment</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Payment History Card */}
          <Link
            to="/payments"
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              textDecoration: 'none',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              display: 'block',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              e.currentTarget.style.borderColor = '#388e3c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
              opacity: '0.1'
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                fontSize: '3.5rem', 
                marginBottom: '1rem'
              }}>📊</div>
              <h3 style={{ 
                color: '#2e7d32', 
                marginBottom: '0.75rem',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                Transaction History
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                View all your payment transactions and status updates
              </p>
              <div style={{
                marginTop: '1.5rem',
                color: '#388e3c',
                fontWeight: '700',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>View History</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Payments Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <h3 style={{ 
              color: '#2e7d32', 
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Recent Transactions
            </h3>
            
            <Link 
              to="/payments"
              style={{
                color: '#43a047',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
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
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ fontSize: '1.1rem' }}>Loading transactions...</p>
            </div>
          ) : error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              backgroundColor: '#ffebee',
              borderRadius: '12px',
              border: '1px solid #ef5350'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
              <p style={{ color: '#d32f2f', fontSize: '1.1rem', margin: 0 }}>{error}</p>
            </div>
          ) : recentPayments.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              backgroundColor: '#f0f4f0',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <h4 style={{ color: '#2e7d32', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                No Payments Yet
              </h4>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Start processing payments today!
              </p>
              <Link
                to="/make-payment"
                style={{
                  backgroundColor: '#43a047',
                  color: 'white',
                  padding: '1rem 2rem',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'inline-block'
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
                fontSize: '0.95rem'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f4f0' }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      color: '#2e7d32',
                      fontWeight: '700',
                      borderBottom: '2px solid #c8e6c9'
                    }}>Amount</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      color: '#2e7d32',
                      fontWeight: '700',
                      borderBottom: '2px solid #c8e6c9'
                    }}>Currency</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      color: '#2e7d32',
                      fontWeight: '700',
                      borderBottom: '2px solid #c8e6c9'
                    }}>Provider</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      color: '#2e7d32',
                      fontWeight: '700',
                      borderBottom: '2px solid #c8e6c9'
                    }}>Status</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left',
                      color: '#2e7d32',
                      fontWeight: '700',
                      borderBottom: '2px solid #c8e6c9'
                    }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p, index) => {
                    const status = p.status?.toLowerCase() || 'pending';
                    const isCompleted = status === 'completed' || status === 'approved';
                    
                    return (
                      <tr key={p._id || index} style={{ 
                        borderBottom: index !== recentPayments.length - 1 ? '1px solid #f0f0f0' : 'none'
                      }}>
                        <td style={{ 
                          padding: '1rem',
                          fontWeight: '700',
                          color: '#2e7d32'
                        }}>
                          {p.currency} {p.amount}
                        </td>
                        <td style={{ padding: '1rem', color: '#666' }}>
                          {p.currency}
                        </td>
                        <td style={{ padding: '1rem', color: '#666' }}>
                          {p.provider || 'Standard'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            backgroundColor: isCompleted ? '#e8f5e9' : '#fff3e0',
                            color: isCompleted ? '#43a047' : '#ff9800',
                            textTransform: 'capitalize'
                          }}>
                            {p.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#666' }}>
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
  );
}

export default DashboardPage;