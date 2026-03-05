import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderUseCases } from '../../application/usecases/OrderUseCases.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    setLoading(true);
    try {
      const order = await orderUseCases.getCart(user.id);
      setCart(order);
      setCartError(null);
    } catch (e) {
      // 404 means user has no active order yet — treat as empty cart
      setCart(null);
      setCartError(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, qty = 1) => {
    if (!user) throw new Error('You must be logged in to add products');
    await orderUseCases.addToCart(user.id, productId, qty);
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    await orderUseCases.removeFromCart(user.id, productId);
    await fetchCart();
  };

  const decreaseQuantity = async (productId, qty) => {
    if (!user) return;
    await orderUseCases.decreaseQuantity(user.id, productId, qty);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await orderUseCases.clearCart(user.id);
    await fetchCart();
  };

  const cartCount = cart?.itemCount() || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, cartError, cartCount,
      addToCart, removeFromCart, decreaseQuantity, clearCart,
      refetch: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
