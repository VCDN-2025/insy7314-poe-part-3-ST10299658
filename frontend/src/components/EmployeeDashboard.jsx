import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, TrendingUp, User, DollarSign, FileText } from "lucide-react";

const EmployeeDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
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
    setMessage("✅ Payment verified successfully!");
    setTimeout(() => setMessage(""), 3000);
    updateStats();
  };

  const handleComplete = (id) => {
    setPayments(prev => prev.map(p => 
      p._id === id ? { ...p, status: "completed" } : p
    ));
    setMessage("✅ Payment completed successfully!");
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

  const filteredPayments = payments.filter(p => {
    if (activeTab === "pending") {
      return p.status === "pending" || p.status === "verified";
    } else {
      return p.status === "completed";
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
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
        <div className={`message-toast ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
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
          <div className="stat-badge">Needs Action</div>
        </div>
        
        <div className="stat-card verified-card">
          <div className="stat-icon-wrapper verified-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.verified}</div>
            <div className="stat-label">Verified</div>
          </div>
          <div className="stat-badge">Ready</div>
        </div>
        
        <div className="stat-card completed-card">
          <div className="stat-icon-wrapper completed-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-badge">Done</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <Clock size={18} />
          <span>Pending & In Progress</span>
          <span className="tab-count">{stats.pending + stats.verified}</span>
        </button>
        <button
          className={`tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <CheckCircle size={18} />
          <span>Completed</span>
          <span className="tab-count">{stats.completed}</span>
        </button>
      </div>

      {/* Payments Grid */}
      <div className="payments-grid">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === "pending" ? "🎉" : "📭"}
            </div>
            <p className="empty-title">
              {activeTab === "pending" 
                ? "No pending payments to review" 
                : "No completed payments yet"}
            </p>
            <p className="empty-subtitle">
              {activeTab === "pending"
                ? "All caught up! Check back later for new payments."
                : "Completed payments will appear here."}
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment._id} className="payment-card">
              {/* Card Header */}
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

              {/* Card Body */}
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
                      {new Date(payment.createdAt).toLocaleDateString()} at{" "}
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer - Actions */}
              {activeTab === "pending" && (
                <div className="payment-footer">
                  {payment.status === "pending" && (
                    <button
                      onClick={() => handleVerify(payment._id)}
                      className="action-btn verify-btn"
                    >
                      <CheckCircle size={18} />
                      <span>Verify Payment</span>
                    </button>
                  )}
                  {payment.status === "verified" && (
                    <button
                      onClick={() => handleComplete(payment._id)}
                      className="action-btn complete-btn"
                    >
                      <DollarSign size={18} />
                      <span>Submit to SWIFT</span>
                    </button>
                  )}
                </div>
              )}

              {/* Completed Badge */}
              {payment.status === "completed" && (
                <div className="completed-overlay">
                  <CheckCircle size={24} />
                  <span>Completed</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .bg-decoration {
          position: fixed;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
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
          gap: 1.5rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(255,255,255,0.3);
          border-top: 6px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.25rem;
          color: white;
          font-weight: 600;
        }

        .dashboard-header {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
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
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .header-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .message-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease-out;
          z-index: 1000;
        }

        .message-toast.success {
          background: #d1fae5;
          color: #065f46;
          border: 2px solid #10b981;
        }

        .message-toast.error {
          background: #fee2e2;
          color: #991b1b;
          border: 2px solid #ef4444;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          transition: height 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .stat-card:hover::before {
          height: 100%;
          opacity: 0.05;
        }

        .pending-card::before { background: #f59e0b; }
        .verified-card::before { background: #3b82f6; }
        .completed-card::before { background: #10b981; }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 14px;
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
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 600;
        }

        .stat-badge {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pending-card .stat-badge {
          background: #fef3c7;
          color: #92400e;
        }

        .verified-card .stat-badge {
          background: #dbeafe;
          color: #1e40af;
        }

        .completed-card .stat-badge {
          background: #d1fae5;
          color: #065f46;
        }

        .tabs-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: white;
          padding: 0.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: relative;
          z-index: 1;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab:hover {
          background: #f9fafb;
        }

        .tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .tab-count {
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.2);
          font-size: 0.85rem;
          font-weight: 700;
        }

        .tab.active .tab-count {
          background: rgba(255,255,255,0.3);
        }

        .payments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .payment-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          position: relative;
        }

        .payment-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .payment-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .payment-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1f2937;
        }

        .user-account {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          padding: 1.5rem;
        }

        .payment-amount {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
        }

        .currency {
          font-size: 1rem;
          font-weight: 600;
          color: #059669;
        }

        .amount {
          font-size: 2rem;
          font-weight: 800;
          color: #065f46;
        }

        .payment-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 600;
        }

        .detail-value {
          font-size: 0.9rem;
          color: #1f2937;
          font-weight: 600;
          text-align: right;
        }

        .swift-code {
          font-family: monospace;
          background: #eef2ff;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          color: #4338ca;
        }

        .payment-footer {
          padding: 1.5rem;
          border-top: 2px solid #f3f4f6;
        }

        .action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .verify-btn {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .verify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .complete-btn {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .completed-overlay {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          font-size: 1rem;
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

          .tabs-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;