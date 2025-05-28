import React, { useState, useEffect } from "react";
import { getOrder } from "./services/orderService";

export default function Navbar({ user, onLogout, onOpenProfile, onOpenOrder }) {
  const [productCount, setProductCount] = useState(0);

  const storedUser = localStorage.getItem("user");
  const userName = storedUser ? JSON.parse(storedUser).name : "";

  const fetchOrderCount = async () => {
    try {
      const data = await getOrder();
      const totalItems = data.items?.length || 0;
      setProductCount(totalItems);
    } catch (err) {
      console.error(err);
      setProductCount(0);
    }
  };

  useEffect(() => {
    fetchOrderCount();
  }, [user]);

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>
        {userName
          ? `Welcome ${userName} to Online Shop`
          : "Welcome to Online Shop"}
      </h1>

      <div style={styles.buttons}>
        {user ? (
          <>
            <button onClick={onOpenOrder} style={styles.button}>
              View Order ({productCount})
            </button>
            <button onClick={onOpenProfile} style={styles.button}>
              Profile
            </button>
          </>
        ) : (
          <p style={styles.loginPrompt}>Please log in</p>
        )}
      </div>
    </nav>
  );

}

const styles = {
  navbar: {
    width: '90%',
    height: '4em',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(255, 249, 218)",
    color: "#000",
    padding: "20px 40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
    borderRadius: '20px',
    margin: "1em auto",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    margin: 0,
    color: "black",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#21574a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  loginPrompt: {
    fontStyle: "italic",
    fontSize: "0.95rem",
    color: "#f1c40f",
  },
};

