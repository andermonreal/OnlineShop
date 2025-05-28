import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useProductModal() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => {
    setSelectedProduct(null);
    navigate("/dashboard"); 
  };

  return {
    selectedProduct,
    openModal,
    closeModal,
  };
}
