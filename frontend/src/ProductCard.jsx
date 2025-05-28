import React, { useState } from "react";

export default function ProductCard({ product, onSelectProduct }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onClick={() => onSelectProduct && onSelectProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter") onSelectProduct && onSelectProduct(product);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        style={styles.image}
      />
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.price}>${product.price.toFixed(2)}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid rgb(247, 240, 206)",
    borderRadius: 12,
    padding: 20,
    margin: 12,
    maxWidth: 260,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgb(255, 249, 218)",
    userSelect: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  image: {
    height: 160,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  name: {
    margin: "10px 0 6px",
    fontWeight: "700",
    fontSize: "1.2rem",
    textAlign: "center",
    color: "#2c3e50",
  },
  price: {
    marginTop: 0,
    marginBottom: '0.5em',
    color: "#27ae60",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
};
