import React, { createContext, useContext, useState } from 'react';

// Create CartContext
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add an item (or update quantity if exists)
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_name === newItem.product_name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_name === newItem.product_name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  // Function to update quantity
  const updateCart = (updatedItem, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_name === updatedItem.product_name ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  // Function to remove item

  const removeFromCart = (product) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== product.id));};

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => useContext(CartContext);
