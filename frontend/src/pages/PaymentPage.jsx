import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { createPayment } from "../services/api";

function PaymentPage() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    provider: "SWIFT",
    payeeAccount: "",
    payeeName: "",
    swiftCode: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const currencies = ["USD", "EUR", "GBP", "ZAR", "JPY", "CAD", "AUD", "CHF"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'amount') {
      sanitizedValue = value.replace(/[^\d.]/g, '');
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1] && parts[1].length > 2) {
        sanitizedValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    } else if (name === 'payeeAccount') {
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 20) return;
    } else if (name === 'swiftCode') {
      sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (sanitizedValue.length > 11) return;
    } else if (name === 'payeeName') {
      sanitizedValue = value.replace(/[^A-Za-z ,.'-]/g, '');
      if (sanitizedValue.length > 100) return;
    } else if (name === 'currency') {
      sanitizedValue = value.toUpperCase();
    }
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validateForm = () => {
    const { amount, currency, payeeAccount, payeeName, swiftCode } = form;
    
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number");
      return false;
    }
    
    if (amountNum > 1000000) {
      setError("Amount exceeds maximum limit of 1,000,000");
      return false;
    }
    
    if (!/^[A-Z]{3}$/.test(currency)) {
      setError("Invalid currency code");
      return false;
    }
    
    if (!payeeName || payeeName.length < 2) {
      setError("Payee name must be at least 2 characters");
      return false;
    }
    
    if (!/^\d{6,20}$/.test(payeeAccount)) {
      setError("Payee account must be 6-20 digits");
      return false;
    }
    
    if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
      setError("SWIFT code must be 8 or 11 characters (format: AAAABBCCXXX)");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      const paymentData = {
        amount: parseFloat(form.amount),
        currency: form.currency,
        provider: form.provider,
        payeeAccount: form.payeeAccount,
        swiftCode: form.swiftCode
      };
      
      const response = await createPayment(paymentData);
      
      setSuccess("Payment successfully created! Payment ID: " + response.data.paymentId);
      setError("");
      
      setTimeout(() => {
        setForm({
          amount: "",
          currency: "USD",
          provider: "SWIFT",
          payeeAccount: "",
          payeeName: "",
          swiftCode: ""
        });
        setSuccess("");
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f9fafb',
      minHeight: '100vh', 
      marginTop: '-2rem', 
      marginLeft: '-1.5rem', 
      marginRight: '-1.5rem',
      paddingBottom: '4rem'
    }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(to bottom right, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
        padding: '3.5rem 2rem 2.5rem 2rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            💸 New Payment
          </div>

          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '0.75rem',
            fontWeight: '900',
            color: '#064e3b',
            letterSpacing: '-1px',
            lineHeight: '1.1'
          }}>
            International Payment
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
              <span style={{ fontWeight: '700' }}>{user?.accountNumber}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#065f46',
              fontSize: '1rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>👤</span>
              <span style={{ fontWeight: '700' }}>{user?.fullName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        padding: '0 2rem',
        marginTop: '-2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Payment Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              color: '#064e3b',
              fontSize: '1.5rem',
              marginBottom: '2rem',
              fontWeight: '800'
            }}>
              Payment Details
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Amount & Currency Row */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#064e3b',
                    fontSize: '0.9rem'
                  }}>
                    Amount *
                  </label>
                  <input 
                    name="amount" 
                    type="text"
                    value={form.amount} 
                    onChange={handleChange}
                    required 
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#064e3b',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="0.00"
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#064e3b',
                    fontSize: '0.9rem'
                  }}>
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#064e3b',
                      cursor: 'pointer',
                      backgroundColor: 'white'
                    }}
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Provider */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#064e3b',
                  fontSize: '0.9rem'
                }}>
                  Payment Provider *
                </label>
                <select
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#064e3b',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="SWIFT">SWIFT</option>
                </select>
              </div>

              {/* Payee Information Section */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  color: '#064e3b', 
                  marginBottom: '1.5rem',
                  fontSize: '1.2rem',
                  fontWeight: '800'
                }}>
                  Recipient Information
                </h3>

                {/* Payee Name */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#064e3b',
                    fontSize: '0.9rem'
                  }}>
                    Recipient Name *
                  </label>
                  <input 
                    name="payeeName" 
                    type="text"
                    value={form.payeeName} 
                    onChange={handleChange}
                    required 
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                    placeholder="Full name of recipient"
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* Payee Account */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#064e3b',
                    fontSize: '0.9rem'
                  }}>
                    Account Number *
                  </label>
                  <input 
                    name="payeeAccount" 
                    type="text"
                    value={form.payeeAccount} 
                    onChange={handleChange}
                    required 
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                    placeholder="6-20 digit account number"
                    maxLength="20"
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* SWIFT Code */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#064e3b',
                    fontSize: '0.9rem'
                  }}>
                    SWIFT Code *
                  </label>
                  <input 
                    name="swiftCode" 
                    type="text"
                    value={form.swiftCode} 
                    onChange={handleChange}
                    required 
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      backgroundColor: 'white'
                    }}
                    placeholder="AAAABBCCXXX"
                    maxLength="11"
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <small style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    8 or 11 characters (e.g., ABCDZAJJXXX)
                  </small>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                  }
                }}
              >
                {loading ? "Processing Payment..." : "Submit Payment"}
              </button>

              {/* Error Message */}
              {error && (
                <div style={{ 
                  color: '#dc2626', 
                  marginTop: '1.5rem',
                  backgroundColor: '#fef2f2',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Error</strong>
                    <span style={{ fontSize: '0.95rem' }}>{error}</span>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div style={{ 
                  color: '#059669', 
                  marginTop: '1.5rem',
                  backgroundColor: '#ecfdf5',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>✓</span>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Success!</strong>
                    <span style={{ fontSize: '0.95rem' }}>{success}</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Information Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Security Notice */}
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
                🔒
              </div>
              <h3 style={{
                color: '#064e3b',
                fontSize: '1.2rem',
                marginBottom: '0.75rem',
                fontWeight: '800'
              }}>
                Secure Payment
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                All payment information is encrypted and validated. Review details carefully before submitting.
              </p>
            </div>

            {/* Payment Info Cards */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                color: '#064e3b',
                fontSize: '1.2rem',
                marginBottom: '1.5rem',
                fontWeight: '800'
              }}>
                Payment Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
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
                    🌐
                  </div>
                  <div>
                    <strong style={{ color: '#064e3b', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                      SWIFT Network
                    </strong>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Secure international payment processing
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
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
                    ⏱️
                  </div>
                  <div>
                    <strong style={{ color: '#064e3b', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                      Processing Time
                    </strong>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                      1-3 business days typically
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
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
                    📧
                  </div>
                  <div>
                    <strong style={{ color: '#064e3b', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                      Confirmation
                    </strong>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Email confirmation sent after processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;