import React, { useEffect, useState } from "react";

// Mock data and API for demonstration
const mockTransactions = [
  {
    _id: "1",
    amount: 1250.00,
    currency: "USD",
    status: "completed",
    provider: "SWIFT Network",
    recipientAccount: "GB29NWBK60161331926819",
    swiftCode: "NWBKGB2L",
    createdAt: "2025-11-05T14:30:00Z",
    user: { fullName: "John Smith" }
  },
  {
    _id: "2",
    amount: 3750.50,
    currency: "EUR",
    status: "pending",
    provider: "International Bank",
    recipientAccount: "DE89370400440532013000",
    swiftCode: "COBADEFF",
    createdAt: "2025-11-07T09:15:00Z",
    user: { fullName: "Sarah Johnson" }
  },
  {
    _id: "3",
    amount: 890.25,
    currency: "GBP",
    status: "verified",
    provider: "Global Transfer",
    recipientAccount: "FR1420041010050500013M02606",
    swiftCode: "BNPAFRPP",
    createdAt: "2025-11-08T11:45:00Z",
    user: { fullName: "Michael Chen" }
  }
];

export default function AdminDashboard() {
  const [user] = useState({ fullName: "Admin User", role: "admin" });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    window.location.href = "/admin/login";
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedCount = transactions.filter(t => t.status === "completed").length;
  const pendingCount = transactions.filter(t => t.status === "pending" || t.status === "verified").length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
      case 'pending':
        return { bg: '#fef3c7', color: '#f59e0b', border: '#fde68a' };
      case 'verified':
        return { bg: '#dbeafe', color: '#3b82f6', border: '#bfdbfe' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #d1fae5',
          borderTop: '4px solid #059669',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ marginTop: '1.5rem', color: '#064e3b', fontSize: '1.1rem', fontWeight: '600' }}>
          Loading dashboard...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 100%)',
        borderBottom: '1px solid #a7f3d0',
        padding: '1.5rem 2rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}>
              🛡️
            </div>
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: '#064e3b',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                Admin Portal
              </h1>
              <p style={{
                fontSize: '0.9rem',
                color: '#065f46',
                margin: 0,
                fontWeight: '500'
              }}>
                System Management Dashboard
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #d1fae5'
            }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                ADMIN
              </span>
              <span style={{ color: '#064e3b', fontWeight: '600', fontSize: '0.95rem' }}>
                {user.fullName}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Welcome back, {user.fullName}! 👋
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              margin: 0
            }}>
              Manage employees and monitor all system transactions
            </p>
          </div>
        </div>

        {/* Stats Overview Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: '#111827',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            System Overview
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              padding: '1.5rem',
              borderRight: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                📊
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>
                Total Transactions
              </div>
              <div style={{
                color: '#111827',
                fontSize: '2rem',
                fontWeight: '900'
              }}>
                {transactions.length}
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRight: '1px solid #e5e7eb',
              textAlign: 'center',
              backgroundColor: '#ecfdf5'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                💰
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>
                Total Amount
              </div>
              <div style={{
                color: '#059669',
                fontSize: '2rem',
                fontWeight: '900'
              }}>
                R {totalAmount.toLocaleString()}
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRight: '1px solid #e5e7eb',
              textAlign: 'center',
              backgroundColor: '#ecfdf5'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                ✓
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>
                Completed
              </div>
              <div style={{
                color: '#059669',
                fontSize: '2rem',
                fontWeight: '900'
              }}>
                {completedCount}
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              textAlign: 'center',
              backgroundColor: '#fffbeb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                ⏳
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>
                Pending
              </div>
              <div style={{
                color: '#f59e0b',
                fontSize: '2rem',
                fontWeight: '900'
              }}>
                {pendingCount}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <a
            href="/admin/employees"
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              padding: '2rem',
              textDecoration: 'none',
              display: 'block',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d1fae5';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.1)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
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
              👥
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Manage Employees
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '0.95rem',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Add, edit, or remove employee accounts and permissions
            </p>
          </a>

          <a
            href="/admin/transactions"
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              padding: '2rem',
              textDecoration: 'none',
              display: 'block',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d1fae5';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.1)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
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
              💳
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              View Transactions
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '0.95rem',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Monitor all payment transactions and system activity
            </p>
          </a>
        </div>

        {/* Transactions Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>
              Recent Transactions
            </h3>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {transactions.length} Total
            </div>
          </div>

          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      color: '#6b7280',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Date & Time
                    </th>
                    <th style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      color: '#6b7280',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Customer
                    </th>
                    <th style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      color: '#6b7280',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Amount
                    </th>
                    <th style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      color: '#6b7280',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Currency
                    </th>
                    <th style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      color: '#6b7280',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Provider
                    </th>
                    <th style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      color: '#6b7280',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => {
                    const statusStyle = getStatusColor(t.status);
                    return (
                      <tr
                        key={t._id}
                        style={{
                          borderBottom: index !== transactions.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td style={{ padding: '1rem' }}>
                          <div style={{ color: '#111827', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {new Date(t.createdAt).toLocaleDateString()}
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                            {new Date(t.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#059669',
                              fontWeight: '700',
                              fontSize: '0.9rem'
                            }}>
                              {t.user?.fullName?.charAt(0) || "?"}
                            </div>
                            <span style={{ color: '#111827', fontWeight: '500' }}>
                              {t.user?.fullName || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '700', color: '#059669' }}>
                          {t.amount.toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '700'
                          }}>
                            {t.currency}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280', fontWeight: '500' }}>
                          {t.provider}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}