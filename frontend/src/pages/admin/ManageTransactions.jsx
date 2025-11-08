// Frontend/src/pages/admin/ManageTransactions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPayments } from "../../services/api";

export default function ManageTransactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch = 
      payment.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.recipientAccount?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.swiftCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === "pending").length,
    verified: payments.filter(p => p.status === "verified").length,
    completed: payments.filter(p => p.status === "completed").length
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate("/admin/dashboard")} style={styles.backBtn}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>Transaction Overview</h1>
            <p style={styles.subtitle}>Monitor and track all payment transactions</p>
          </div>
        </div>
        <button onClick={fetchPayments} style={styles.refreshBtn}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)"}}>
            💰
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Transactions</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"}}>
            ⏳
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.pending}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"}}>
            ✓
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.verified}</div>
            <div style={styles.statLabel}>Verified</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)"}}>
            ✔
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{stats.completed}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by customer name, account number, or SWIFT code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Results Count */}
      <div style={styles.resultsBar}>
        <span style={styles.resultsText}>
          Showing {filteredPayments.length} of {payments.length} transactions
        </span>
        {(searchTerm || filter !== "all") && (
          <button 
            onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}
            style={styles.clearBtn}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div style={styles.tableContainer}>
        {filteredPayments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <h3 style={styles.emptyTitle}>
              {searchTerm || filter !== "all" 
                ? "No Matching Transactions" 
                : "No Transactions Yet"}
            </h3>
            <p style={styles.emptyText}>
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Transaction data will appear here once payments are made"}
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Recipient</th>
                  <th style={styles.th}>SWIFT Code</th>
                  <th style={styles.th}>Provider</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>
                        <div style={styles.date}>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div style={styles.time}>
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.customerCell}>
                        <div style={styles.customerAvatar}>
                          {payment.user?.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span style={styles.customerName}>
                          {payment.user?.fullName || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.amountCell}>
                        <span style={styles.currency}>{payment.currency}</span>
                        <span style={styles.amount}>{payment.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.accountNumber}>{payment.recipientAccount}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.swiftCode}>{payment.swiftCode}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.provider}>{payment.provider}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: 
                          payment.status === "completed" ? "#d1fae5" :
                          payment.status === "verified" ? "#dbeafe" :
                          "#fef3c7",
                        color:
                          payment.status === "completed" ? "#065f46" :
                          payment.status === "verified" ? "#1e40af" :
                          "#92400e"
                      }}>
                        {payment.status === "completed" ? "✓ Completed" :
                         payment.status === "verified" ? "✓ Verified" :
                         "⏳ Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #ecfdf5 0%, #d1fae5 100%)",
    padding: "2rem"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #ecfdf5 0%, #d1fae5 100%)",
    gap: "1rem"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #d1fae5",
    borderTop: "5px solid #059669",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "#064e3b",
    fontWeight: "600"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
    backgroundColor: "white",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem"
  },
  backBtn: {
    padding: "0.75rem 1.25rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s"
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#064e3b",
    margin: 0
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: "0.25rem 0 0 0"
  },
  refreshBtn: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.25rem",
    marginBottom: "2rem"
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "2px solid #e5e7eb",
    transition: "all 0.2s"
  },
  statIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    flexShrink: 0
  },
  statContent: {
    flex: 1
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#064e3b",
    lineHeight: 1,
    marginBottom: "0.25rem"
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#6b7280",
    fontWeight: "600"
  },
  filterSection: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap"
  },
  searchWrapper: {
    flex: 1,
    minWidth: "300px",
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    fontSize: "1.1rem",
    pointerEvents: "none"
  },
  searchInput: {
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 2.75rem",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "white"
  },
  filterSelect: {
    padding: "0.875rem 1rem",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    cursor: "pointer",
    minWidth: "180px",
    backgroundColor: "white",
    fontWeight: "600",
    color: "#374151"
  },
  resultsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    padding: "0.75rem 1rem",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
  },
  resultsText: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "600"
  },
  clearBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    transition: "all 0.2s"
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "2px solid #e5e7eb",
    overflow: "hidden"
  },
  tableWrapper: {
    overflow: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px"
  },
  th: {
    padding: "1rem 1.25rem",
    textAlign: "left",
    backgroundColor: "#f9fafb",
    fontWeight: "700",
    fontSize: "0.8rem",
    color: "#374151",
    borderBottom: "2px solid #e5e7eb",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap"
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
    transition: "all 0.2s"
  },
  td: {
    padding: "1rem 1.25rem",
    fontSize: "0.9rem",
    color: "#1f2937"
  },
  dateCell: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem"
  },
  date: {
    fontWeight: "600",
    color: "#064e3b"
  },
  time: {
    fontSize: "0.8rem",
    color: "#6b7280"
  },
  customerCell: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  customerAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "0.9rem"
  },
  customerName: {
    fontWeight: "600",
    color: "#1f2937"
  },
  amountCell: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.35rem"
  },
  currency: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#059669"
  },
  amount: {
    fontSize: "1rem",
    fontWeight: "800",
    color: "#064e3b"
  },
  accountNumber: {
    fontFamily: "monospace",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#374151"
  },
  swiftCode: {
    fontFamily: "monospace",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#1e40af",
    backgroundColor: "#eff6ff",
    padding: "0.35rem 0.6rem",
    borderRadius: "6px"
  },
  provider: {
    fontWeight: "600",
    color: "#6b7280"
  },
  statusBadge: {
    padding: "0.5rem 0.9rem",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap"
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "white"
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem"
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#064e3b",
    marginBottom: "0.5rem"
  },
  emptyText: {
    fontSize: "1rem",
    color: "#6b7280"
  }
};