import React from "react";
import useProductOrder from "./hooks/useProductOrder";

export default function ProductModal({ product, onClose, onAddToOrder }) {
  const {
    quantity,
    loading,
    error,
    increment,
    decrement,
    handleAddToOrder
  } = useProductOrder(product, onClose, onAddToOrder);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          Created at: {new Date(product.createdAt).toLocaleString()}
          <button onClick={onClose} style={styles.closeBtn}>X</button>
        </div>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={styles.image}
        />
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <p><strong>Available quantity: </strong>{product.quantity}</p>

        <div style={styles.container}>
          <div style={styles.leftGroup}>
            <button
              onClick={handleAddToOrder}
              style={styles.addButton}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add to Order"}
            </button>

            <div style={styles.counter}>
              <button onClick={decrement} disabled={quantity === 1 || loading}>-</button>
              <span style={styles.quantity}>{quantity}</span>
              <button onClick={increment} disabled={quantity >= product.quantity || loading}>+</button>
            </div>
          </div>

          <p style={styles.price}>${ (product.price * quantity).toFixed(2) }</p>
        </div>

        

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );

}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    position: "relative",
    backgroundColor: "rgb(255, 249, 218)",
    padding: "30px",
    borderRadius: "16px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    fontSize: "0.9rem",
    color: "#555",
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
  image: {
    maxHeight: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  addButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease",
    userSelect: "none",
  },
  counter: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  quantity: {
    fontSize: "1.2rem",
    fontWeight: "600",
    minWidth: "30px",
    textAlign: "center",
  },
  price: {
    fontWeight: "700",
    fontSize: "1.1rem",
    color: "#222",
    minWidth: "90px",
    textAlign: "right",
  },

  error: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  }
};
