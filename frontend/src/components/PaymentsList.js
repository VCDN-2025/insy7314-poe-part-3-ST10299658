import React, { useState, useEffect } from "react";

// Mock API function for demonstration
const getUserPayments = async () => {
  return {
    data: {
      payments: [
        {
          _id: "pay_1a2b3c4d5e",
          amount: "1250.00",
          currency: "USD",
          status: "completed",
          provider: "SWIFT Network",
          payeeAccount: "GB29NWBK60161331926819",
          swiftCode: "NWBKGB2L",
          createdAt: "2025-11-05T14:30:00Z"
        },
        {
          _id: "pay_2b3c4d5e6f",
          amount: "3750.50",
          currency: "EUR",
          status: "pending",
          provider: "International Bank",
          payeeAccount: "DE89370400440532013000",
          swiftCode: "COBADEFF",
          createdAt: "2025-11-07T09:15:00Z"
        },
        {
          _id: "pay_3c4d5e6f7g",
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

function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getUserPayments();
      setPayments(response.data.payments || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments");
      setLoading(false);
    }
  };

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
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        color: '#6b7280' 
      }}>
        <div style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem',
          animation: 'spin 1s linear infinite'
        }}>
          ⟳
        </div>
        <p style={{ fontSize: '1rem' }}>Loading payments...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '2rem auto'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '2rem 1rem' 
    }}>
      {payments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          border: '2px dashed #d1d5db'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💳</div>
          <h3 style={{ 
            color: '#111827', 
            marginBottom: '0.5rem',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            No Payments Yet
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Your payment history will appear here
          </p>
        </div>
      ) : (
        <div>
          <div style={{
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <h2 style={{ 
              color: '#111827', 
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: '700'
            }}>
              Payment History
            </h2>
            <p style={{
              color: '#6b7280',
              margin: '0.5rem 0 0 0',
              fontSize: '0.95rem'
            }}>
              {payments.length} {payments.length === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {payments.map((payment) => (
              <div
                key={payment._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
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
                {/* Top Row: Amount and Status */}
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
                    <div style={{ 
                      color: '#6b7280', 
                      fontSize: '0.875rem' 
                    }}>
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

                {/* Details Grid */}
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

                  <div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.375rem'
                    }}>
                      Transaction ID
                    </div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace'
                    }}>
                      {payment._id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsList;