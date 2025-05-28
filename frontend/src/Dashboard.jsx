import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import ProductList from "./components/ProductList";
import OrderModal from "./OrderModal";
import ProfileModal from "./ProfileModal";

import { fetchProducts } from "./services/productService";

export default function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({ items: [], totalPrice: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    loadProducts();
  }, []);

  const handleOpenAdminPanel = () => {
    setIsProfileOpen(false);
    navigate("/admin");
  };

  return (
    <div>
      <Navbar
        user={user}
        order={order}
        onOpenOrder={() => user && setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div style={styles.productList} >
        <ProductList products={products} />
      </div>


      {isCartOpen && (
        <OrderModal
          order={order}
          onClose={() => {
            setIsCartOpen(false);
            window.location.href = "/dashboard";
          }}
        />
      )}
      {isProfileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onLogout={onLogout}
          onOpenAdminPanel={handleOpenAdminPanel}
        />
      )}
    </div>
  );
}

const styles = {
  productList: {
    width: '80%',
    margin: "4em auto",
  },
}