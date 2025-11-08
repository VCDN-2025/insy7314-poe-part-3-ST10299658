import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, TrendingUp, User, DollarSign, FileText, Send } from "lucide-react";

const EmployeeDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ pending: 0, verified: 0, completed: 0 });

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockPayments = [
        {
          _id: "1",
          createdAt: new Date(),
          user: { fullName: "John Doe", accountNumber: "ACC123456" },
          amount: 15000,
          currency: "ZAR",
          recipientAccount: "REC789012",
          swiftCode: "ABSA-ZA-JHB",
          provider: "ABSA",
          status: "pending"
        },
        {
          _id: "2",
          createdAt: new Date(Date.now() - 86400000),
          user: { fullName: "Jane Smith", accountNumber: "ACC234567" },
          amount: 25000,
          currency: "ZAR",
          recipientAccount: "REC890123",
          swiftCode: "FNB-ZA-CPT",
          provider: "FNB",
          status: "verified"
        },
        {
          _id: "3",
          createdAt: new Date(Date.now() - 172800000),
          user: { fullName: "Mike Johnson", accountNumber: "ACC345678" },
          amount: 8500,
          currency: "ZAR",
          recipientAccount: "REC901234",
          swiftCode: "NEDBANK-ZA",
          provider: "Nedbank",
          status: "completed"
        }
      ];
      
      setPayments(mockPayments);
      setStats({
        pending: mockPayments.filter(p => p.status === "pending").length,
        verified: mockPayments.filter(p => p.status === "verified").length,
        completed: mockPayments.filter(p => p.status === "completed").length
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleVerify = (id) => {
    setPayments(prev => prev.map(p => 
      p._id === id ? { ...p, status: "verified" } : p
    ));
    setMessage("Payment verified successfully!");
    setTimeout(() => setMessage(""), 3000);
    updateStats();
  };

  const handleComplete = (id) => {
    setPayments(prev => prev.map(p => 
      p._id === id ? { ...p, status: "completed" } : p
    ));
    setMessage("Payment submitted to SWIFT successfully!");
    setTimeout(() => setMessage(""), 3000);
    updateStats();
  };

  const updateStats = () => {
    setTimeout(() => {
      setStats({
        pending: payments.filter(p => p.status === "pending").length,
        verified: payments.filter(p => p.status === "verified").length,
        completed: payments.filter(p => p.status === "completed").length
      });
    }, 100);
  };

  const pendingPayments = payments.filter(p => p.status === "pending");
  const verifiedPayments = payments.filter(p => p.status === "verified");
  const completedPayments = payments.filter(p => p.status === "completed");

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading payments...</p>
      </div>
    );
  }

  const PaymentCard = ({ payment, showVerifyButton, showSubmitButton }) => (
    <div className="payment-card">
      <div className="payment-header">
        <div className="payment-user">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div>
            <div className="user-name">{payment.user?.fullName || "N/A"}</div>
            <div className="user-account">Acc: {payment.user?.accountNumber}</div>
          </div>
        </div>
        <div className={`status-badge ${payment.status}`}>
          {payment.status === "pending" && <Clock size={14} />}
          {payment.status === "verified" && <CheckCircle size={14} />}
          {payment.status === "completed" && <CheckCircle size={14} />}
          <span>{payment.status.toUpperCase()}</span>
        </div>
      </div>

      <div className="payment-body">
        <div className="payment-amount">
          <span className="currency">{payment.currency}</span>
          <span className="amount">{payment.amount.toLocaleString()}</span>
        </div>

        <div className="payment-details">
          <div className="detail-row">
            <span className="detail-label">Recipient</span>
            <span className="detail-value">{payment.recipientAccount}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">SWIFT Code</span>
            <span className="detail-value swift-code">{payment.swiftCode}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Provider</span>
            <span className="detail-value">{payment.provider}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span className="detail-value">
              {new Date(payment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {(showVerifyButton || showSubmitButton) && (
        <div className="payment-footer">
          {showVerifyButton && (
            <button
              onClick={() => handleVerify(payment._id)}
              className="action-btn verify-btn"
            >
              <CheckCircle size={18} />
              <span>Verify Payment</span>
            </button>
          )}
          {showSubmitButton && (
            <button
              onClick={() => handleComplete(payment._id)}
              className="action-btn complete-btn"
            >
              <Send size={18} />
              <span>Submit to SWIFT</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="bg-decoration"></div>
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">👔</div>
            <div>
              <h1 className="header-title">Employee Dashboard</h1>
              <p className="header-subtitle">Verify and process customer payments</p>
            </div>
          </div>
          <div className="header-badge">
            <TrendingUp size={20} />
            <span>Live</span>
          </div>
        </div>
      </header>

      {/* Success/Error Message */}
      {message && (
        <div className="message-notification">
          <div className="message-icon">
            <CheckCircle size={20} />
          </div>
          <div className="message-content">
            <div className="message-title">Success</div>
            <div className="message-text">{message}</div>
          </div>
          <button onClick={() => setMessage("")} className="message-close">
            <XCircle size={18} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card pending-card">
          <div className="stat-icon-wrapper pending-icon">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
        
        <div className="stat-card verified-card">
          <div className="stat-icon-wrapper verified-icon">
            <Send size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.verified}</div>
            <div className="stat-label">Ready to Submit</div>
          </div>
        </div>
        
        <div className="stat-card completed-card">
          <div className="stat-icon-wrapper completed-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Section 1: Pending Verification */}
      <div className="payment-section">
        <div className="section-header pending-header">
          <div className="section-title-wrapper">
            <Clock size={24} />
            <h2 className="section-title">Pending Verification</h2>
          </div>
          <div className="section-count">{pendingPayments.length} Payment{pendingPayments.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="payments-grid">
          {pendingPayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <p className="empty-title">All caught up!</p>
              <p className="empty-subtitle">No payments waiting for verification.</p>
            </div>
          ) : (
            pendingPayments.map(payment => (
              <PaymentCard key={payment._id} payment={payment} showVerifyButton={true} />
            ))
          )}
        </div>
      </div>

      {/* Section 2: Ready to Submit to SWIFT */}
      <div className="payment-section">
        <div className="section-header verified-header">
          <div className="section-title-wrapper">
            <Send size={24} />
            <h2 className="section-title">Ready to Submit to SWIFT</h2>
          </div>
          <div className="section-count">{verifiedPayments.length} Payment{verifiedPayments.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="payments-grid">
          {verifiedPayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-title">No payments ready</p>
              <p className="empty-subtitle">Verified payments will appear here.</p>
            </div>
          ) : (
            verifiedPayments.map(payment => (
              <PaymentCard key={payment._id} payment={payment} showSubmitButton={true} />
            ))
          )}
        </div>
      </div>

      {/* Section 3: Completed Payments */}
      <div className="payment-section">
        <div className="section-header completed-header">
          <div className="section-title-wrapper">
            <CheckCircle size={24} />
            <h2 className="section-title">Completed Payments</h2>
          </div>
          <div className="section-count">{completedPayments.length} Payment{completedPayments.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="payments-grid">
          {completedPayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-title">No completed payments</p>
              <p className="empty-subtitle">Completed payments will appear here.</p>
            </div>
          ) : (
            completedPayments.map(payment => (
              <PaymentCard key={payment._id} payment={payment} />
            ))
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(to bottom, #ecfdf5 0%, #d1fae5 100%);
          padding: 2rem;
          position: relative;
        }

        .bg-decoration {
          position: fixed;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(5, 150, 105, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s linear infinite;
          pointer-events: none;
        }

        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(to bottom, #ecfdf5 0%, #d1fae5 100%);
          gap: 1.5rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 6px solid #d1fae5;
          border-top: 6px solid #059669;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.25rem;
          color: #064e3b;
          font-weight: 600;
        }

        .dashboard-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          position: relative;
          z-index: 1;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-icon {
          font-size: 3rem;
        }

        .header-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #064e3b;
          margin-bottom: 0.25rem;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
        }

        .message-notification {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          max-width: 400px;
          border-left: 4px solid #10b981;
          animation: slideIn 0.3s ease-out;
          z-index: 1000;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .message-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
        }

        .message-title {
          font-weight: 700;
          font-size: 1rem;
          color: #064e3b;
          margin-bottom: 0.25rem;
        }

        .message-text {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .message-close {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .message-close:hover {
          color: #4b5563;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 2px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .pending-icon { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
        .verified-icon { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); }
        .completed-icon { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #064e3b;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 600;
        }

        .payment-section {
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          color: white;
        }

        .pending-header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }

        .verified-header {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        }

        .completed-header {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        }

        .section-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .section-count {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.25);
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .payments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.25rem;
        }

        .payment-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 2px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .payment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          border-color: #059669;
        }

        .payment-header {
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .payment-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-name {
          font-weight: 700;
          font-size: 1rem;
          color: #1f2937;
        }

        .user-account {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.15rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.verified {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .payment-body {
          padding: 1.25rem;
        }

        .payment-amount {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          padding: 1rem;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-radius: 10px;
        }

        .currency {
          font-size: 0.95rem;
          font-weight: 700;
          color: #059669;
        }

        .amount {
          font-size: 1.75rem;
          font-weight: 900;
          color: #064e3b;
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.65rem 0.85rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 600;
        }

        .detail-value {
          font-size: 0.85rem;
          color: #1f2937;
          font-weight: 600;
          text-align: right;
        }

        .swift-code {
          font-family: monospace;
          background: #eff6ff;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          color: #1e40af;
        }

        .payment-footer {
          padding: 1.25rem;
          border-top: 2px solid #f3f4f6;
        }

        .action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.875rem;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .verify-btn {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .verify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .complete-btn {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 12px;
          border: 2px dashed #d1fae5;
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 0.75rem;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #064e3b;
          margin-bottom: 0.35rem;
        }

        .empty-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .payments-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;