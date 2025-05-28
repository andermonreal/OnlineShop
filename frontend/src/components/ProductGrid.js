import React from "react";
import ProductCard from "../ProductCard";

export default function ProductGrid({ products, onSelect }) {
  return (
    <div style={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelect}
        />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
    padding: "16px",
  },
};
