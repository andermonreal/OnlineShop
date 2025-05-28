import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addProductToOrder } from "../services/orderService";

export default function useProductOrder(product, onClose, onAddToOrder) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const increment = () => setQuantity(q => (q < product.quantity ? q + 1 : q));
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await addProductToOrder(product.id, quantity);
      onAddToOrder?.(data);
      onClose();

      if (location.pathname === "/dashboard") {
        navigate(0);
      } else {
        navigate("/dashboard");
      }

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
