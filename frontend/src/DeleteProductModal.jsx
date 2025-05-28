import React, { useState, useEffect } from "react";
import { deleteProduct } from "./services/adminService"; 
import { fetchProducts } from "./services/productService";

export default function DeleteProductModal({ token, onClose }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(productId);
    setError("");

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Delete Products</h2>

        {loadingProducts && <p>Loading products...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loadingProducts && products.length === 0 && <p>No products found.</p>}

        {!loadingProducts && products.length > 0 && (
          <ul style={styles.list}>
            {products.map((product) => (
              <li key={product.id} style={styles.listItem}>
                <div>
                  <strong>{product.name}</strong> - ${product.price} - Qty: {product.quantity}
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={styles.deleteButton}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Deleting..." : "Eliminar"}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1300,
  },
  modal: {
    backgroundColor: "rgb(255, 249, 218)",
    padding: 24,
    borderRadius: 8,
    width: 400,
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  closeButton: {
    marginTop: 16,
    padding: "10px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
