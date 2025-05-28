import React from "react";
import ProductModal from "../ProductModal";
import ProductGrid from "./ProductGrid";
import { useProductModal } from "../hooks/useProductModal";

export default function ProductList({ products }) {
  const { selectedProduct, openModal, closeModal } = useProductModal();

  return (
    <>
      <ProductGrid products={products} onSelect={openModal} />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </>
  );
}
