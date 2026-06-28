import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tj_cart") || "[]"); }
    catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("tj_cart", JSON.stringify(items));
  }, [items]);

  function addToCart(item) {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === item.variantId);
      if (existing) {
        return prev.map(i =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }

  function removeFromCart(variantId) {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  }

  function updateQuantity(variantId, quantity) {
    if (quantity < 1) { removeFromCart(variantId); return; }
    setItems(prev => prev.map(i => i.variantId === variantId ? { ...i, quantity } : i));
  }

  function clearCart() { setItems([]); }

  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      total, count, isOpen, setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
