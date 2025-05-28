import React, { useEffect, useState } from "react";
import {
  getOrder,
  clearOrder,
  removeProductFromOrder,
  addProductToOrder
} from "./services/orderService";

export default function OrderModal({ onClose }) {
  const [order, setOrder] = useState({ items: [], totalPrice: 0 });
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setError("");
    try {
      const data = await getOrder();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleClearCart = async () => {
    setError("");
    try {
      await clearOrder();
      setOrder({ items: [], totalPrice: 0 });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    setError("");
    try {
      if (delta > 0) {
        await addProductToOrder(productId, delta);
      } else {
        await removeProductFromOrder(productId, -delta);
      }
      fetchOrder();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuy = () => {
    alert("Compra simulada! Gracias por su pedido.");
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>X</button>

        <h2>Your Order</h2>
        <button
          onClick={handleClearCart}
          style={styles.clearBtn}
          disabled={order.items.length === 0}
        >
          Clear Cart
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={styles.list}>
          {order.items.length === 0 && <p>Your cart is empty.</p>}

          {order.items.map(({ id, product, quantity }) => (
            <li key={id} style={styles.listItem}>
              <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
              <div style={styles.productInfo}>
                <p><strong>{product.name}</strong></p>
                <p>${product.price.toFixed(2)}</p>
              </div>

              <div style={styles.quantityControl}>
                <button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span style={styles.quantity}>{quantity}</span>

                <button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleQuantityChange(product.id, -quantity)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div style={styles.footer}>
          <p><strong>Total: </strong>${order.totalPrice.toFixed(2)}</p>
          <button
            onClick={handleBuy}
            style={styles.buyBtn}
            disabled={order.items.length === 0}
          >
            Buy Now
          </button>
        </div>
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
    backgroundColor: "rgb(255, 249, 218)",
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
