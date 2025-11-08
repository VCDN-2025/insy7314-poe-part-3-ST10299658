import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, XCircle, DollarSign, LogOut, AlertCircle, User, TrendingUp, FileCheck } from "lucide-react";
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
        <p className="loading-text">Loading payment queue...</p>
      </div>
    );
  }

  const pendingCount = payments.filter(p => p.status === "pending").length;
  const verifiedCount = payments.filter(p => p.status === "verified").length;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon-box">
              <FileCheck size={32} />
            </div>
            <div>
              <h1 className="header-title">Employee Portal</h1>
              <p className="header-subtitle">Payment Verification & Processing</p>
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
        <div className="stat-card">
          <div className="stat-icon total">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{payments.length}</div>
            <div className="stat-label">Total in Queue</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Awaiting Review</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon verified">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{verifiedCount}</div>
            <div className="stat-label">Ready to Submit</div>
          </div>
        </div>
      </div>

      {/* Instructions Banner */}
      <div className="instruction-banner">
        <div className="instruction-icon">
          <AlertCircle size={22} />
        </div>
        <div className="instruction-content">
          <h3>Verification Guidelines</h3>
          <p>Review payment details carefully • Verify SWIFT codes • Confirm account information • Process in order of priority</p>
        </div>
      </div>

      {/* Payments Section */}
      <div className="payments-section">
        <div className="section-header">
          <h2 className="section-title">Payment Queue</h2>
          <div className="section-badge">{payments.length} Payment{payments.length !== 1 ? 's' : ''}</div>
        </div>
        
        {payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3 className="empty-title">All Clear!</h3>
            <p className="empty-subtitle">No pending payments at this time. Great work!</p>
          </div>
        ) : (
          <div className="payments-list">
            {payments.map((payment) => (
              <div key={payment._id} className="payment-item">
                <div className="payment-left">
                  <div className="payment-header-row">
                    <div className="payment-id">
                      <span className="id-label">Payment ID:</span>
                      <span className="id-value">{payment._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className={`status-pill ${payment.status}`}>
                      {payment.status === "pending" && <Clock size={14} />}
                      {payment.status === "verified" && <CheckCircle size={14} />}
                      <span>{payment.status === "pending" ? "Pending Review" : "Verified"}</span>
                    </div>
                  </div>

                  <div className="payment-amount-display">
                    <span className="currency-sign">{payment.currency}</span>
                    <span className="amount-large">{payment.amount.toLocaleString()}</span>
                  </div>

                  <div className="payment-info-grid">
                    <div className="info-item">
                      <span className="info-label">Customer</span>
                      <span className="info-value">{payment.user?.fullName || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Recipient Account</span>
                      <span className="info-value">{payment.recipientAccount}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">SWIFT Code</span>
                      <span className="info-value swift">{payment.swiftCode}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Provider</span>
                      <span className="info-value">{payment.provider}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Submitted</span>
                      <span className="info-value">
                        {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="payment-actions">
                  {payment.status === "pending" && (
                    <button
                      onClick={() => handleVerify(payment._id)}
                      className="action-button verify"
                    >
                      <CheckCircle size={18} />
                      <span>Verify</span>
                    </button>
                  )}
                  {payment.status === "verified" && (
                    <button
                      onClick={() => handleComplete(payment._id)}
                      className="action-button submit"
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
        <div className="payments-section">
          <div className="section-header">
            <h2 className="section-title">Completed This Session</h2>
            <div className="section-badge success">{completedPayments.length} Completed</div>
          </div>
          
          <div className="payments-list">
            {completedPayments.map((payment) => (
              <div key={payment._id} className="payment-item completed">
                <div className="payment-left">
                  <div className="payment-header-row">
                    <div className="payment-id">
                      <span className="id-label">Payment ID:</span>
                      <span className="id-value">{payment._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="status-pill completed">
                      <CheckCircle size={14} />
                      <span>Completed</span>
                    </div>
                  </div>

                  <div className="payment-amount-display">
                    <span className="currency-sign">{payment.currency}</span>
                    <span className="amount-large">{payment.amount.toLocaleString()}</span>
                  </div>

                  <div className="payment-info-grid">
                    <div className="info-item">
                      <span className="info-label">Customer</span>
                      <span className="info-value">{payment.user?.fullName || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Recipient Account</span>
                      <span className="info-value">{payment.recipientAccount}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">SWIFT Code</span>
                      <span className="info-value swift">{payment.swiftCode}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Completed At</span>
                      <span className="info-value">
                        {new Date(payment.completedAt).toLocaleTimeString()}
                      </span>
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
          background: linear-gradient(to bottom, #ecfdf5 0%, #d1fae5 100%);
          padding: 2rem;
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
          border: 5px solid #d1fae5;
          border-top: 5px solid #059669;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.1rem;
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
          gap: 1.25rem;
        }

        .header-icon-box {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
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
          font-weight: 500;
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
          border-radius: 10px;
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
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
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.total {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        }

        .stat-icon.pending {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
        }

        .stat-icon.verified {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
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

        .instruction-banner {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
        }

        .instruction-icon {
          color: #1e40af;
          flex-shrink: 0;
        }

        .instruction-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 0.25rem;
        }

        .instruction-content p {
          font-size: 0.9rem;
          color: #1e40af;
          line-height: 1.5;
        }

        .payments-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #064e3b;
        }

        .section-badge {
          padding: 0.5rem 1rem;
          background: #d1fae5;
          color: #065f46;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .section-badge.success {
          background: #a7f3d0;
          color: #064e3b;
        }

        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-item {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          transition: all 0.2s ease;
        }

        .payment-item:hover {
          border-color: #059669;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
        }

        .payment-item.completed {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .payment-left {
          flex: 1;
        }

        .payment-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .payment-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .id-label {
          font-size: 0.8rem;
          color: #9ca3af;
          font-weight: 600;
        }

        .id-value {
          font-size: 0.85rem;
          color: #374151;
          font-weight: 700;
          font-family: monospace;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .status-pill.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-pill.verified {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-pill.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .payment-amount-display {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .currency-sign {
          font-size: 1.1rem;
          font-weight: 700;
          color: #059669;
        }

        .amount-large {
          font-size: 2.25rem;
          font-weight: 900;
          color: #064e3b;
        }

        .payment-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .info-value {
          font-size: 0.9rem;
          color: #1f2937;
          font-weight: 600;
        }

        .info-value.swift {
          font-family: monospace;
          background: #eff6ff;
          color: #1e40af;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .payment-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 160px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .action-button.verify {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .action-button.verify:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .action-button.submit {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        }

        .action-button.submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          border: 2px dashed #d1fae5;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: #059669;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #064e3b;
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

          .payment-item {
            flex-direction: column;
          }

          .payment-actions {
            width: 100%;
          }

          .payment-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}