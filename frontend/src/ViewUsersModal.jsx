import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser, changeUserRole, changeUserPassword } from "./services/adminService";
import { usePagination } from "./hooks/usePagination";

export default function ViewUsersModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    currentItems: currentUsers,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePagination(users, 5);

  useEffect(() => {
    const loadUsers = async () => {
      setError("");
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangeRole = async (id) => {
    try {
      await changeUserRole(id);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id
            ? { ...user, role: user.role === "admin" ? "customer" : "admin" }
            : user
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      await changeUserPassword(id, newPassword);
      alert("Password changed successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${year}/${month}/${day} at ${hours}:${minutes}`;
  };


  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Users List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thId }}>ID</th>
                  <th style={styles.th}>Name and Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr style={styles.row}>
                    <td style={{ ...styles.td, ...styles.tdId }}>{user.id}</td>
                    <td style={styles.cell}>
                      {user.name}
                      <p>{user.email}</p>
                    </td>
                    <td style={styles.cell}>{user.role}</td>
                    <td style={styles.cell}>{formatDateTime(user.createdAt)}</td>
                    <td style={styles.cell}>
                      <button
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.changeRoleButton }}
                        onClick={() => handleChangeRole(user.id)}
                      >
                        Change Role
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.changePasswordButton }}
                        onClick={() => handleChangePassword(user.id)}
                      >
                        Change Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.paginationContainer}>
              <button
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === 1 ? styles.paginationButtonDisabled : {}),
                }}
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === totalPages ? styles.paginationButtonDisabled : {}),
                }}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
        <button
          style={styles.closeButton}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}


const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: "rgb(255, 249, 218)",
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    tableLayout: 'fixed', 
  },
  th: {
    padding: '12px 10px',
    backgroundColor: '#2980b9',
    color: 'white',
    fontWeight: '600',
    borderBottom: '2px solid #1f6391',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  thId: {
    width: '40px',
    textAlign: 'center',
  },
  td: {
    padding: '6px 8px',
    borderBottom: '1px solid #ddd',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    verticalAlign: 'middle',

  },
  tdId: {
    width: '40px',
    textAlign: 'center',
  },
  cell: {
    padding: '6px 8px',
    borderBottom: '1px solid #ddd',
    wordWrap: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    verticalAlign: 'middle',  

  },
  row: {
    height: 'auto',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  paginationButton: {
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  paginationButtonDisabled: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
  },
  closeButton: {
    marginTop: '30px',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  button: {
    padding: '8px',
    marginBottom: '8px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#fff',
  },
  deleteButton: {
    marginRight: '5px',
    backgroundColor: '#e74c3c',
  },
  changeRoleButton: {
    backgroundColor: '#3498db',
  },
  changePasswordButton: {
    backgroundColor: '#f39c12',
  },
};

