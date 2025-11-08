import React, { useEffect, useState } from "react";

// Mock components and API for demonstration
const getUserPayments = async () => {
  return {
    data: {
      payments: [
        {
          _id: "pay_1",
          amount: "1250.00",
          currency: "USD",
          status: "completed",
          provider: "SWIFT Network",
          payeeAccount: "GB29NWBK60161331926819",
          swiftCode: "NWBKGB2L",
          createdAt: "2025-11-05T14:30:00Z"
        },
        {
          _id: "pay_2",
          amount: "3750.50",
          currency: "EUR",
          status: "pending",
          provider: "International Bank",
          payeeAccount: "DE89370400440532013000",
          swiftCode: "COBADEFF",
          createdAt: "2025-11-07T09:15:00Z"
        },
        {
          _id: "pay_3",
          amount: "890.25",
          currency: "GBP",
          status: "processing",
          provider: "Global Transfer",
          payeeAccount: "FR1420041010050500013M02606",
          swiftCode: "BNPAFRPP",
          createdAt: "2025-11-08T11:45:00Z"
        }
      ]
    }
  };
};

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserPayments()
      .then(res => {
        const paymentsData = res.data?.payments || [];
        setPayments(paymentsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#059669';
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⟳</div>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
        <h3 style={{ color: '#111827', marginBottom: '0.5rem' }}>No Payments Yet</h3>
        <p style={{ color: '#6b7280' }}>Your payment history will appear here</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {payments.map((payment) => (
        <div
          key={payment._id}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d1fae5';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}>
            <div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.25rem'
              }}>
                {payment.currency} {parseFloat(payment.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {new Date(payment.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: getStatusColor(payment.status) + '15',
              border: `1px solid ${getStatusColor(payment.status)}30`
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(payment.status)
              }} />
              <span style={{
                color: getStatusColor(payment.status),
                fontWeight: '600',
                fontSize: '0.875rem',
                textTransform: 'capitalize'
              }}>
                {payment.status}
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f3f4f6'
          }}>
            <div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.375rem'
              }}>
                Provider
              </div>
              <div style={{
                color: '#111827',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {payment.provider}
              </div>
            </div>

            <div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.375rem'
              }}>
                Account
              </div>
              <div style={{
                color: '#111827',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                fontWeight: '500'
              }}>
                {payment.payeeAccount}
              </div>
            </div>

            <div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.375rem'
              }}>
                SWIFT Code
              </div>
              <div style={{
                color: '#111827',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                fontWeight: '500'
              }}>
                {payment.swiftCode}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getUserPayments();
        const paymentsData = res.data?.payments || res.data || [];
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => 
    p.status?.toLowerCase() === 'completed' || 
    p.status?.toLowerCase() === 'approved'
  ).length;
  const pendingPayments = payments.filter(p => 
    p.status?.toLowerCase() === 'pending'
  ).length;

  const filteredPayments = filterStatus === 'all' 
    ? payments 
    : payments.filter(p => p.status?.toLowerCase() === filterStatus);

  return (
    <div style={{ 
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      paddingBottom: '3rem'
    }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
        padding: '3rem 2rem',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
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
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                📊 TRANSACTION HISTORY
              </div>

              <h1 style={{ 
                fontSize: '3rem', 
                marginBottom: '0.75rem',
                fontWeight: '900',
                color: '#064e3b',
                letterSpacing: '-1px',
                lineHeight: '1.1'
              }}>
                All Payments
              </h1>
              
              <p style={{ 
                fontSize: '1.1rem',
                color: '#065f46',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Track and manage your international transactions
              </p>
            </div>

            <a
              href="/make-payment"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                padding: '1rem 2rem',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
              }}
            >
              <span>New Payment</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Stats Summary Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            color: '#111827',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Payment Overview
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              padding: '1.25rem',
              borderRight: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>
                Total
              </div>
              <div style={{
                color: '#111827',
                fontSize: '2rem',
                fontWeight: '900'
              }}>
                {loading ? '...' : totalPayments}
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                marginTop: '0.25rem'
              }}>
                Transactions
              </div>
            </div>

            <div style={{
              padding: '1.25rem',
              borderRight: '1px solid #e5e7eb',
              textAlign: 'center',
              backgroundColor: '#ecfdf5'
            }}>
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
                {loading ? '...' : completedPayments}
              </div>
              <div style={{
                color: '#059669',
                fontSize: '0.8rem',
                marginTop: '0.25rem',
                fontWeight: '600'
              }}>
                ✓ Successful
              </div>
            </div>

            <div style={{
              padding: '1.25rem',
              textAlign: 'center',
              backgroundColor: '#fffbeb'
            }}>
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
                {loading ? '...' : pendingPayments}
              </div>
              <div style={{
                color: '#f59e0b',
                fontSize: '0.8rem',
                marginTop: '0.25rem',
                fontWeight: '600'
              }}>
                ⏳ In Review
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>
              Filter:
            </span>
            <button
              onClick={() => setFilterStatus('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: filterStatus === 'all' ? 'none' : '1px solid #e5e7eb',
                backgroundColor: filterStatus === 'all' ? '#059669' : 'white',
                color: filterStatus === 'all' ? 'white' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: filterStatus === 'completed' ? 'none' : '1px solid #e5e7eb',
                backgroundColor: filterStatus === 'completed' ? '#059669' : 'white',
                color: filterStatus === 'completed' ? 'white' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: filterStatus === 'pending' ? 'none' : '1px solid #e5e7eb',
                backgroundColor: filterStatus === 'pending' ? '#059669' : 'white',
                color: filterStatus === 'pending' ? 'white' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Pending
            </button>
          </div>

          <div style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {filteredPayments.length} {filteredPayments.length === 1 ? 'transaction' : 'transactions'}
          </div>
        </div>

        {/* Payments List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            color: '#111827',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Transaction History
          </h3>
          
          <PaymentsList />
        </div>
      </div>
    </div>
  );
}

export default PaymentsPage;