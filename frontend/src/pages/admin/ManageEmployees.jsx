// Frontend/src/pages/admin/ManageEmployees.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../services/api";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    accountNumber: "",
    idNumber: "",
    password: "",
    role: "employee"
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await listEmployees();
      setEmployees(res.data.users || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id, formData);
        showMessage("Employee updated successfully", "success");
      } else {
        await createEmployee(formData);
        showMessage("Employee created successfully", "success");
      }

      setShowModal(false);
      setEditingEmployee(null);
      setFormData({
        fullName: "",
        email: "",
        accountNumber: "",
        idNumber: "",
        password: "",
        role: "employee"
      });
      fetchEmployees();
    } catch (err) {
      showMessage(err.response?.data?.error || "Operation failed", "error");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      accountNumber: employee.accountNumber,
      idNumber: employee.idNumber,
      password: "",
      role: employee.role
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?")) {
      return;
    }

    try {
      await deleteEmployee(id);
      showMessage("Employee deactivated successfully", "success");
      fetchEmployees();
    } catch (err) {
      showMessage(err.response?.data?.error || "Delete failed", "error");
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setFormData({
      fullName: "",
      email: "",
      accountNumber: "",
      idNumber: "",
      password: "",
      role: "employee"
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading employees...</p>
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
            <h1 style={styles.title}>Employee Management</h1>
            <p style={styles.subtitle}>{employees.length} total employees</p>
          </div>
        </div>
        <button onClick={handleAddNew} style={styles.addBtn}>
          + Add New Employee
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === "error" ? "#fee2e2" : "#d1fae5",
          color: message.type === "error" ? "#991b1b" : "#065f46",
          border: message.type === "error" ? "2px solid #ef4444" : "2px solid #10b981"
        }}>
          <span style={styles.messageIcon}>{message.type === "error" ? "❌" : "✅"}</span>
          {message.text}
        </div>
      )}

      {/* Employee Cards */}
      <div style={styles.cardsContainer}>
        {employees.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3 style={styles.emptyTitle}>No Employees Yet</h3>
            <p style={styles.emptyText}>Get started by adding your first employee</p>
            <button onClick={handleAddNew} style={styles.emptyBtn}>
              + Add Employee
            </button>
          </div>
        ) : (
          employees.map((emp) => (
            <div key={emp._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {emp.fullName.charAt(0).toUpperCase()}
                </div>
                <div style={styles.cardHeaderInfo}>
                  <h3 style={styles.employeeName}>{emp.fullName}</h3>
                  <p style={styles.employeeEmail}>{emp.email}</p>
                </div>
                <div style={styles.badges}>
                  <span style={{
                    ...styles.roleBadge,
                    backgroundColor: emp.role === "admin" ? "#dbeafe" : "#d1fae5",
                    color: emp.role === "admin" ? "#1e40af" : "#065f46"
                  }}>
                    {emp.role}
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: emp.isActive ? "#d1fae5" : "#fee2e2",
                    color: emp.isActive ? "#065f46" : "#991b1b"
                  }}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Account Number</span>
                  <span style={styles.infoValue}>{emp.accountNumber}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>ID Number</span>
                  <span style={styles.infoValue}>{emp.idNumber}</span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button
                  onClick={() => handleEdit(emp)}
                  style={styles.editBtn}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  style={styles.deleteBtn}
                >
                  🚫 Deactivate
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="employee@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="6-20 digits"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    backgroundColor: editingEmployee ? "#f3f4f6" : "white",
                    cursor: editingEmployee ? "not-allowed" : "text"
                  }}
                  required={!editingEmployee}
                  disabled={editingEmployee}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  placeholder="13 digits"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    backgroundColor: editingEmployee ? "#f3f4f6" : "white",
                    cursor: editingEmployee ? "not-allowed" : "text"
                  }}
                  required={!editingEmployee}
                  disabled={editingEmployee}
                />
              </div>

              {!editingEmployee && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 8 chars with uppercase, lowercase, number & special char"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                  <small style={styles.hint}>
                    Must include uppercase, lowercase, number and special character
                  </small>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingEmployee ? "Update Employee" : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  addBtn: {
    padding: "0.875rem 1.75rem",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
    transition: "all 0.2s"
  },
  message: {
    padding: "1rem 1.5rem",
    borderRadius: "10px",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    animation: "slideDown 0.3s ease-out"
  },
  messageIcon: {
    fontSize: "1.2rem"
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "2px solid #e5e7eb",
    transition: "all 0.2s"
  },
  cardHeader: {
    padding: "1.5rem",
    borderBottom: "2px solid #f3f4f6",
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem"
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "700",
    flexShrink: 0
  },
  cardHeaderInfo: {
    flex: 1
  },
  employeeName: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 0.25rem 0"
  },
  employeeEmail: {
    fontSize: "0.85rem",
    color: "#6b7280",
    margin: 0
  },
  badges: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "flex-end"
  },
  roleBadge: {
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  },
  statusBadge: {
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "700"
  },
  cardBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px"
  },
  infoLabel: {
    fontSize: "0.8rem",
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  },
  infoValue: {
    fontSize: "0.9rem",
    color: "#1f2937",
    fontWeight: "600",
    fontFamily: "monospace"
  },
  cardFooter: {
    padding: "1rem 1.5rem",
    borderTop: "2px solid #f3f4f6",
    display: "flex",
    gap: "0.75rem"
  },
  editBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s"
  },
  deleteBtn: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "2px solid #ef4444",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s"
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "2px dashed #d1fae5"
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
    color: "#6b7280",
    marginBottom: "1.5rem"
  },
  emptyBtn: {
    padding: "0.875rem 1.75rem",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem"
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "550px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    borderBottom: "2px solid #f3f4f6"
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#064e3b",
    margin: 0
  },
  closeBtn: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.25rem",
    fontWeight: "700",
    transition: "all 0.2s"
  },
  form: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  },
  input: {
    padding: "0.875rem 1rem",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit"
  },
  select: {
    padding: "0.875rem 1rem",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "white",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  hint: {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginTop: "0.25rem"
  },
  modalButtons: {
    display: "flex",
    gap: "1rem",
    marginTop: "0.5rem"
  },
  cancelBtn: {
    flex: 1,
    padding: "0.875rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    transition: "all 0.2s"
  },
  submitBtn: {
    flex: 1,
    padding: "0.875rem",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
    transition: "all 0.2s"
  }
};