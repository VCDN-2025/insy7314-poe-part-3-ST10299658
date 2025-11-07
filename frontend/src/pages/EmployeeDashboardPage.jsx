import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, XCircle, DollarSign, LogOut, AlertCircle, User } from "lucide-react";
import api from "../services/api";
import { logout } from "../services/api";

export default function EmployeeDashboardPage() {
  const [payments, setPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      if (parsed.role?.toLowerCase() !== "employee") {
        navigate("/admin/login", { replace: true });
        return;
      }
    } else {
      navigate("/admin/login", { replace: true });
      return;
    }

    fetchAllPayments();
  }, [navigate]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments/pending/all");
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleVerify = async (id) => {
    if (!window.confirm("Verify this payment? Ensure SWIFT code and account details are correct.")) return;

    try {
      await api.patch(`/payments/${id}/verify`);
      showMessage("✅ Payment verified successfully", "success");
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "verified" } : p))
      );
    } catch (err) {
      showMessage(err.response?.data?.error || "❌ Error verifying payment", "error");
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Submit this payment to SWIFT? This action cannot be undone.")) return;

    try {
      await api.patch(`/payments/${id}/complete`);
      showMessage("✅ Payment submitted to SWIFT successfully", "success");

      // Move to completed and remove from pending
      const completedPayment = payments.find(p => p._id === id);
      if (completedPayment) {
        setCompletedPayments(prev => [...prev, { ...completedPayment, status: "completed", completedAt: new Date() }]);
      }
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      showMessage(err.response?.data?.error || "❌ Error completing payment", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading payments...</p>
      </div>
    );
  }

  const pendingCount = payments.filter(p => p.status === "pending").length;
  const verifiedCount = payments.filter(p => p.status === "verified").length;

  return (
    <div className="dashboard-container">
      <div className="bg-decoration"></div>
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">💼</div>
            <div>
              <h1 className="header-title">Employee Portal</h1>
              <p className="header-subtitle">Verify and process customer payments</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <User size={18} />
              <span>{user?.fullName || "Employee"}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`message-toast ${message.type}`}>
          {message.type === "error" ? <XCircle size={20} /> : <CheckCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon-wrapper total-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{payments.length}</div>
            <div className="stat-label">Total Payments</div>
          </div>
        </div>
        
        <div className="stat-card pending-card">
          <div className="stat-icon-wrapper pending-icon">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending Verification</div>
          </div>
          {pendingCount > 0 && <div className="stat-badge pending-badge">Needs Action</div>}
        </div>
        
        <div className="stat-card verified-card">
          <div className="stat-icon-wrapper verified-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{verifiedCount}</div>
            <div className="stat-label">Ready to Submit</div>
          </div>
          {verifiedCount > 0 && <div className="stat-badge verified-badge">Ready</div>}
        </div>
      </div>

      {/* Instructions */}
      <div className="instruction-card">
        <div className="instruction-header">
          <AlertCircle size={24} />
          <h3>Instructions</h3>
        </div>
        <ul className="instruction-list">
          <li>Review each payment carefully before verification</li>
          <li>Verify that the SWIFT code is correct for the recipient bank</li>
          <li>Check that account information matches the payee details</li>
          <li>Click "Verify" to approve a payment</li>
          <li>Click "Submit to SWIFT" only after verification is complete</li>
        </ul>
      </div>

      {/* Payments Section */}
      <div className="payments-section">
        <h2 className="section-title">Payment Queue</h2>
        
        {payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No pending payments</p>
            <p className="empty-subtitle">All caught up! Check back later for new payments.</p>
          </div>
        ) : (
          <div className="payments-grid">
            {payments.map((payment) => (
              <div key={payment._id} className="payment-card">
                {/* Card Header */}
                <div className="payment-header">
                  <div className="payment-user">
                    <div className="user-avatar">
                      {payment.user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="user-name">{payment.user?.fullName || "N/A"}</div>
                      <div className="user-date">{new Date(payment.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`status-badge ${payment.status}`}>
                    {payment.status === "pending" && <Clock size={14} />}
                    {payment.status === "verified" && <CheckCircle size={14} />}
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
                      <span className="detail-label">Time</span>
                      <span className="detail-value">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Actions */}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Payments Section */}
      {completedPayments.length > 0 && (
        <div className="payments-section completed-section">
          <h2 className="section-title">Completed Payments (This Session)</h2>
          <div className="payments-grid">
            {completedPayments.map((payment) => (
              <div key={payment._id} className="payment-card completed-card">
                <div className="payment-header">
                  <div className="payment-user">
                    <div className="user-avatar completed-avatar">
                      {payment.user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="user-name">{payment.user?.fullName || "N/A"}</div>
                      <div className="user-date">Completed: {new Date(payment.completedAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="status-badge completed">
                    <CheckCircle size={14} />
                    <span>COMPLETED</span>
                  </div>
                </div>

                <div className="payment-body">
                  <div className="payment-amount completed-amount">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          gap: 1.5rem;
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
          background-clip: text;
          margin-bottom: 0.25rem;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f3f4f6;
          border-radius: 12px;
          color: #4b5563;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .message-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
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

        .total-card::before { background: #8b5cf6; }
        .pending-card::before { background: #f59e0b; }
        .verified-card::before { background: #3b82f6; }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .total-icon { background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); }
        .pending-icon { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
        .verified-icon { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); }

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

        .pending-badge {
          background: #fef3c7;
          color: #92400e;
        }

        .verified-badge {
          background: #dbeafe;
          color: #1e40af;
        }

        .instruction-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: relative;
          z-index: 1;
          border-left: 4px solid #3b82f6;
        }

        .instruction-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .instruction-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .instruction-list {
          margin: 0;
          padding-left: 2rem;
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.8;
        }

        .instruction-list li {
          margin-bottom: 0.5rem;
        }

        .payments-section {
          position: relative;
          z-index: 1;
          margin-bottom: 3rem;
        }

        .completed-section {
          margin-top: 3rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .payments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .payment-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .payment-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .completed-card {
          opacity: 0.9;
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
          font-weight: 700;
          font-size: 1.25rem;
        }

        .completed-avatar {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        }

        .user-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1f2937;
        }

        .user-date {
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

        .completed-amount {
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
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

        .empty-state {
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

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .payments-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            flex-wrap: wrap;
          }

          .stat-badge {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}