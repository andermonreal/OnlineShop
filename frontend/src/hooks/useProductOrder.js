import { useState } from "react";
import { addProductToOrder } from "../services/orderService";

export default function useProductOrder(product, onClose, onAddToOrder) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const increment = () => setQuantity(q => (q < product.quantity ? q + 1 : q));
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await addProductToOrder(product.id, quantity);
      onAddToOrder?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    quantity,
    loading,
    error,
    increment,
    decrement,
    handleAddToOrder
  };
}
