import React from "react";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>X</button>
        <h2>{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} style={{ width: "100%" }} />
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
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
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    width: "90%",
    maxWidth: 600,
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "transparent",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
  },
  clearBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 12,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
  },
  productImage: {
    width: 50,
    height: 50,
    objectFit: "cover",
    borderRadius: 4,
  },
  productInfo: {
    flexGrow: 1,
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
  },
  quantity: {
    minWidth: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  removeBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
  footer: {
    marginTop: 16,
    borderTop: "1px solid #ddd",
    paddingTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
};