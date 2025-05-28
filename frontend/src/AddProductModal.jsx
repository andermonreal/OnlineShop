import React, { useState } from "react";
import { addProduct } from "./services/adminService";

export default function AddProductModal({ token, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    setError("");
    setSuccess("");

    const { name, price, quantity, description, imageUrl } = formData;

    if (!name || !price || !quantity || !description || !imageUrl) {
      setError("Please fill all fields.");
      return;
    }

    if (isNaN(price) || isNaN(quantity)) {
      setError("Price and quantity must be valid numbers.");
      return;
    }

    setLoadingAdd(true);

    try {
      await addProduct({ name, price, quantity, description, imageUrl });

      setSuccess("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Add New Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          style={styles.input}
          disabled={loadingAdd}
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          style={styles.input}
          disabled={loadingAdd}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          style={styles.input}
          disabled={loadingAdd}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          style={styles.input}
          disabled={loadingAdd}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleInputChange}
          style={styles.input}
          disabled={loadingAdd}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div style={styles.buttons}>
          <button
            onClick={handleAddProduct}
            style={{ ...styles.button, backgroundColor: "#2ecc71" }}
            disabled={loadingAdd}
          >
            {loadingAdd ? "Adding..." : "Add Product"}
          </button>
          <button onClick={onClose} style={styles.button} disabled={loadingAdd}>
            Cancel
          </button>
        </div>
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
    width: 350,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    boxSizing: "border-box",
    backgroundColor: "rgb(255, 250, 225)",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  buttons: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: 4,
    backgroundColor: "#3498db",
    color: "white",
    cursor: "pointer",
  },
};
