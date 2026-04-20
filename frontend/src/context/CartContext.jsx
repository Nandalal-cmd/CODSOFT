import { useEffect, useState } from 'react';
import { CartContext } from './cart-context';

const CART_STORAGE_KEY = 'stylecart-cart';

const readCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

const createCartKey = ({ id, selectedSize = 'M', selectedColor = 'Default' }) =>
  `${id}-${selectedSize}-${selectedColor}`;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, options = {}) => {
    const selectedSize = options.selectedSize || 'M';
    const selectedColor = options.selectedColor || 'Default';
    const quantity = options.quantity || 1;
    const cartKey = createCartKey({ id: product.id, selectedSize, selectedColor });

    setCart((prev) => {
      const existingItem = prev.find((item) => item.cartKey === cartKey);

      if (existingItem) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, qty: item.qty + quantity } : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          selectedSize,
          selectedColor,
          cartKey,
          qty: quantity,
        },
      ];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, qty) => {
    if (qty < 1) {
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, qty } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.qty, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
