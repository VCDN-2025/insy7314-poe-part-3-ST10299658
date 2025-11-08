import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CreditCard, LogOut, TrendingUp, DollarSign, Activity, ShieldCheck } from "lucide-react";
import api, { logout } from "../services/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setLoadingUser(false);

      if (parsed.role !== "admin") {
        navigate("/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);
        const res = await api.get("/payments/all");
        setTransactions(res.data.payments || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    }
  };

  if (loadingUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  // Calculate stats
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedCount = transactions.filter(t => t.status === "completed").length;
  const pendingCount = transactions.filter(t => t.status === "pending" || t.status === "verified").length;

  return (
    <div className="dashboard-container">
      <div className="bg-decoration"></div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <ShieldCheck size={40} className="shield-icon" />
            </div>
            <div>
              <h1 className="header-title">Admin Portal</h1>
              <p className="header-subtitle">System Management & Oversight</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="admin-badge">ADMIN</div>
              <span>{user.fullName}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2 className="welcome-title">Welcome back, {user.fullName}! 👋</h2>
            <p className="welcome-text">
              Manage employees and monitor all system transactions from your dashboard.
            </p>
          </div>
          <div className="welcome-illustration">
            <div className="floating-icon">🏦</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card total-transactions">
            <div className="stat-icon-wrapper">
              <Activity size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Transactions</div>
              <div className="stat-number">{transactions.length}</div>
            </div>
          </div>

          <div className="stat-card total-amount">
            <div className="stat-icon-wrapper">
              <DollarSign size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Amount</div>
              <div className="stat-number">R {totalAmount.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-card completed-stat">
            <div className="stat-icon-wrapper">
              <TrendingUp size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Completed</div>
              <div className="stat-number">{completedCount}</div>
            </div>
          </div>

          <div className="stat-card pending-stat">
            <div className="stat-icon-wrapper">
              <Activity size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending</div>
              <div className="stat-number">{pendingCount}</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-grid">
          <div 
            className="action-card employees-card"
            onClick={() => navigate("/admin/employees")}
          >
            <div className="action-card-header">
              <div className="action-icon employees-icon">
                <Users size={32} />
              </div>
              <div className="action-badge">Management</div>
            </div>
            <h3 className="action-title">Manage Employees</h3>
            <p className="action-text">
              Add, edit, or remove employee accounts and control access permissions
            </p>
            <button className="action-button employees-btn">
              <span>Go to Employees</span>
              <span>→</span>
            </button>
          </div>

          <div 
            className="action-card transactions-card"
            onClick={() => navigate("/admin/transactions")}
          >
            <div className="action-card-header">
              <div className="action-icon transactions-icon">
                <CreditCard size={32} />
              </div>
              <div className="action-badge">Monitor</div>
            </div>
            <h3 className="action-title">View Transactions</h3>
            <p className="action-text">
              Monitor all payment transactions and track system activity
            </p>
            <button className="action-button transactions-btn">
              <span>Go to Transactions</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">All Transactions</h2>
            <div className="section-badge">
              {transactions.length} Total
            </div>
          </div>

          {loadingTransactions ? (
            <div className="table-loading">
              <div className="loading-spinner-small"></div>
              <span>Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p className="empty-title">No transactions yet</p>
              <p className="empty-subtitle">Transactions will appear here once customers make payments</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Recipient</th>
                    <th>SWIFT Code</th>
                    <th>Provider</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <div className="date-cell">
                          <div className="date-primary">{new Date(t.createdAt).toLocaleDateString()}</div>
                          <div className="date-secondary">{new Date(t.createdAt).toLocaleTimeString()}</div>
                        </div>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {t.user?.fullName?.charAt(0) || "?"}
                          </div>
                          <span>{t.user?.fullName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="amount-cell">{t.amount.toLocaleString()}</td>
                      <td><span className="currency-badge">{t.currency}</span></td>
                      <td className="recipient-cell">{t.recipientAccount}</td>
                      <td><code className="swift-code">{t.swiftCode}</code></td>
                      <td className="provider-cell">{t.provider}</td>
                      <td>
                        <span className={`status-badge status-${t.status}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
          position: relative;
          overflow: hidden;
        }

        .bg-decoration {
          position: fixed;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: float 25s linear infinite;
          pointer-events: none;
        }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(40px, 40px) rotate(360deg); }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
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

        .loading-spinner-small {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-top: 4px solid #3b82f6;
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
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          padding: 1.5rem 2rem;
          position: relative;
          z-index: 10;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
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
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .shield-icon {
          color: white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .header-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 12px;
          border: 2px solid #bfdbfe;
          font-weight: 600;
          font-size: 0.95rem;
          color: #1e40af;
        }

        .admin-badge {
          background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
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

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .welcome-banner {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          overflow: hidden;
          position: relative;
        }

        .welcome-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
        }

        .welcome-content {
          flex: 1;
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 0.75rem;
        }

        .welcome-text {
          font-size: 1.1rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .welcome-illustration {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-icon {
          font-size: 5rem;
          animation: bounce 3s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          transition: width 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .stat-card:hover::before {
          width: 100%;
          opacity: 0.05;
        }

        .total-transactions::before { background: #8b5cf6; }
        .total-amount::before { background: #10b981; }
        .completed-stat::before { background: #3b82f6; }
        .pending-stat::before { background: #f59e0b; }

        .stat-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .total-transactions .stat-icon-wrapper { background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); }
        .total-amount .stat-icon-wrapper { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); }
        .completed-stat .stat-icon-wrapper { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); }
        .pending-stat .stat-icon-wrapper { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          line-height: 1;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .action-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          transition: height 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .action-card:hover::before {
          height: 100%;
          opacity: 0.05;
        }

        .employees-card::before { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); }
        .transactions-card::before { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); }

        .action-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .action-icon {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .employees-icon { background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); }
        .transactions-icon { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); }

        .action-badge {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .action-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .action-text {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .action-button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .employees-btn {
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .transactions-btn {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .transactions-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1f2937;
        }

        .section-badge {
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .table-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem;
          color: #6b7280;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
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

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .transactions-table thead {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .transactions-table th {
          padding: 1rem 1.25rem;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 700;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
        }

        .transactions-table tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s ease;
        }

        .transactions-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .transactions-table td {
          padding: 1.25rem;
          font-size: 0.95rem;
          color: #374151;
        }

        .date-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .date-primary {
          font-weight: 600;
          color: #1f2937;
        }

        .date-secondary {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .customer-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .customer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .amount-cell {
          font-weight: 700;
          font-size: 1.05rem;
          color: #059669;
        }

        .currency-badge {
          padding: 0.35rem 0.75rem;
          background: #ecfdf5;
          color: #059669;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .recipient-cell {
          font-family: monospace;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .swift-code {
          padding: 0.35rem 0.75rem;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .provider-cell {
          font-weight: 600;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-block;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-verified {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        @media (max-width: 768px) {
          .main-content {
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

          .welcome-banner {
            flex-direction: column;
            text-align:
                      .welcome-banner {
            flex-direction: column;
            text-align: center;
          }

          .welcome-title {
            font-size: 1.5rem;
          }

          .welcome-text {
            font-size: 1rem;
          }

          .welcome-illustration {
            width: 80px;
            height: 80px;
          }

          .floating-icon {
            font-size: 3rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1.25rem;
          }

          .stat-icon-wrapper {
            width: 50px;
            height: 50px;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .action-grid {
            grid-template-columns: 1fr;
          }

          .action-card {
            padding: 1.5rem;
          }

          .action-icon {
            width: 56px;
            height: 56px;
          }

          .action-title {
            font-size: 1.25rem;
          }

          .transactions-section {
            padding: 1rem;
          }

          .section-title {
            font-size: 1.25rem;
          }

          .table-container {
            border-radius: 8px;
          }

          .transactions-table {
            font-size: 0.85rem;
          }

          .transactions-table th,
          .transactions-table td {
            padding: 0.75rem;
          }

          .user-info {
            font-size: 0.85rem;
            padding: 0.5rem 1rem;
          }

          .logout-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .header-icon {
            width: 48px;
            height: 48px;
          }

          .shield-icon {
            width: 32px;
            height: 32px;
          }

          .header-title {
            font-size: 1.25rem;
          }

          .header-subtitle {
            font-size: 0.85rem;
          }

          .stat-card {
            flex-direction: column;
            text-align: center;
          }

          .action-card-header {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}