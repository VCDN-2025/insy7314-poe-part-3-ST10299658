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

  // Calculate stats
  const totalPayments = payments.length;
  
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
      paddingBottom: '3rem',
      marginTop: '-2rem',
      marginLeft: '-1.5rem',
      marginRight: '-1.5rem'
    }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
        padding: '3.5rem 2rem 2.5rem 2rem',
        position: 'relative'
      }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#059669',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            👋 WELCOME BACK
          </div>

          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '0.75rem',
            fontWeight: '900',
            color: '#064e3b',
            letterSpacing: '-1px',
            lineHeight: '1.1'
          }}>
            {user?.fullName || "User"}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#065f46',
              fontSize: '1rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>💳</span>
              <span style={{ fontWeight: '500' }}>Account:</span>
              <span style={{ fontWeight: '700' }}>{user?.accountNumber || "N/A"}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#065f46',
              fontSize: '1rem'
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
      </section>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Stats Overview - Moved to top */}
        <div style={{ 
          marginTop: '-2rem',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Total Payments */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
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
                marginBottom: '1rem'
              }}>
                💰
              </div>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.85rem', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Payments
              </p>
              <h3 style={{ 
                color: '#059669', 
                fontSize: '2.25rem', 
                margin: 0,
                fontWeight: '900'
              }}>
                {loading ? '...' : totalPayments}
              </h3>
            </div>

            {/* Completed */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
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
                marginBottom: '1rem'
              }}>
                ✓
              </div>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.85rem', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Completed
              </p>
              <h3 style={{ 
                color: '#059669', 
                fontSize: '2.25rem', 
                margin: 0,
                fontWeight: '900'
              }}>
                {loading ? '...' : completedPayments}
              </h3>
            </div>

            {/* Pending */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                ⏳
              </div>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.85rem', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Pending
              </p>
              <h3 style={{ 
                color: '#f59e0b', 
                fontSize: '2.25rem', 
                margin: 0,
                fontWeight: '900'
              }}>
                {loading ? '...' : pendingPayments}
              </h3>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Recent Transactions - Left side */}
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
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  color: '#064e3b', 
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '800'
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
                      borderRadius: '12px',
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
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Amount</th>
                        <th style={{ 
                          padding: '0.875rem 1rem', 
                          textAlign: 'left',
                          color: '#064e3b',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Provider</th>
                        <th style={{ 
                          padding: '0.875rem 1rem', 
                          textAlign: 'left',
                          color: '#064e3b',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Status</th>
                        <th style={{ 
                          padding: '0.875rem 1rem', 
                          textAlign: 'left',
                          color: '#064e3b',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
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

          {/* Right Sidebar - Quick Actions & MFA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                color: '#064e3b',
                fontSize: '1.25rem',
                marginBottom: '1.5rem',
                fontWeight: '800'
              }}>
                Quick Actions
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                  to="/make-payment"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      💸
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        color: '#064e3b', 
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: '700'
                      }}>
                        New Payment
                      </h4>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '0.85rem',
                        margin: '0.25rem 0 0 0'
                      }}>
                        Process payment
                      </p>
                    </div>
                    <span style={{ color: '#059669', fontSize: '1.25rem' }}>→</span>
                  </div>
                </Link>

                <Link
                  to="/payments"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      📊
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        color: '#064e3b', 
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: '700'
                      }}>
                        All Transactions
                      </h4>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '0.85rem',
                        margin: '0.25rem 0 0 0'
                      }}>
                        View history
                      </p>
                    </div>
                    <span style={{ color: '#059669', fontSize: '1.25rem' }}>→</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Setup MFA Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                🔒
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '800', 
                marginBottom: '0.75rem', 
                color: '#064e3b' 
              }}>
                Setup 2FA
              </h3>
              <SetupMFA user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;