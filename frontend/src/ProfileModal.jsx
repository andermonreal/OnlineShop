import React from "react";
import useProfile from "./hooks/useProfile";

export default function ProfileModal({ user, onClose, onLogout, onOpenAdminPanel }) {
  const {
    oldPassword, newPassword1, newPassword2,
    isChangingPassword, error, success, loading, isAdmin,
    handleChangePasswordClick, handlePasswordSubmit,
    handleInputChange, handleCancelPasswordChange
  } = useProfile(user);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>X</button>
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>

        {!isChangingPassword ? (
          <div style={styles.buttons}>
            {isAdmin && (
              <button onClick={onOpenAdminPanel} style={{ ...styles.button, backgroundColor: "#9b59b6" }}>Admin Panel</button>
            )}
            <button onClick={handleChangePasswordClick} style={{ ...styles.button, backgroundColor: "#3498db" }}>Change Password</button>
            <button onClick={onLogout} style={{ ...styles.button, backgroundColor: "#e74c3c" }}>Logout</button>
          </div>
        ) : (
          <div>
            <input
              type="password"
              placeholder="Old password"
              name="oldPassword"
              value={oldPassword}
              onChange={handleInputChange}
              style={styles.input}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="New password"
              name="newPassword1"
              value={newPassword1}
              onChange={handleInputChange}
              style={styles.input}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              name="newPassword2"
              value={newPassword2}
              onChange={handleInputChange}
              style={styles.input}
              disabled={loading}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <div style={styles.buttons}>
              <button onClick={handlePasswordSubmit} style={{ ...styles.button, backgroundColor: "#2ecc71" }} disabled={loading}>
                {loading ? "Changing..." : "Submit"}
              </button>
              <button onClick={handleCancelPasswordChange} style={styles.button} disabled={loading}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "rgb(255, 250, 225)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "450px",
    padding: "30px 40px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
    color: "#222",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    userSelect: "none",
  },
  buttons: {
    marginTop: "4em",
    display: "flex",
    flexDirection: "column", 
    gap: "15px",             
    alignItems: "stretch",   
  },
  button: {
    width: "100%",
    padding: "12px 0",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
    transition: "background-color 0.25s ease",
    userSelect: "none",
  },
  input: {
    width: "100%",
    padding: "10px 15px",
    marginTop: "15px",
    borderRadius: "12px",
    border: "2px solid #f1c40f",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#3498db",
  },
  error: {
    color: "#e74c3c",
    marginTop: "12px",
    fontWeight: "600",
    textAlign: "center",
  },
  success: {
    color: "#27ae60",
    marginTop: "12px",
    fontWeight: "600",
    textAlign: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
    padding: 0,
    margin: 0,
  },
};
