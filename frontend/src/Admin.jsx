import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRoles } from "./services/userService";

import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";
import ViewUsersModal from "./ViewUsersModal";
import Unauthorized from "./Unauthorized";

export default function Admin() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadRoles = async () => {
      if (!token) {
        setRoles([]);
        setLoadingRoles(false);
        return;
      }

      try {
        const roles = await getUserRoles();
        setRoles(roles);
      } catch {
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, [token]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loadingRoles) return <p>Loading...</p>;

  if (!roles.includes("admin")) {
    return <Unauthorized onBack={handleBack} />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
          ➕ Add Product
        </button>
        <button style={styles.deleteButton} onClick={() => setIsDeleteModalOpen(true)}>
          🗑️ Delete Product
        </button>
        <button style={styles.viewButton} onClick={() => setIsViewUsersModalOpen(true)}>
          👥 View Users
        </button>
        <button style={styles.backButton} onClick={handleBack}>
          🔙 Back
        </button>
      </div>

      {isAddModalOpen && (
        <AddProductModal token={token} onClose={() => setIsAddModalOpen(false)} />
      )}
      {isDeleteModalOpen && (
        <DeleteProductModal token={token} onClose={() => setIsDeleteModalOpen(false)} />
      )}
      {isViewUsersModalOpen && (
        <ViewUsersModal token={token} onClose={() => setIsViewUsersModalOpen(false)} />
      )}
    </div>
  );

}

// Define fuera de "styles"
const baseButton = {
  padding: '14px 22px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  color: '#fff',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
};

const styles = {
  container: {
    padding: '40px 20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#2c3e50',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '15%',
  },
  addButton: {
    ...baseButton,
    backgroundColor: '#27ae60',
  },
  deleteButton: {
    ...baseButton,
    backgroundColor: '#e74c3c',
  },
  viewButton: {
    ...baseButton,
    backgroundColor: '#8e44ad',
  },
  backButton: {
    ...baseButton,
    backgroundColor: '#7f8c8d',
  },
};
