import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getInitialCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(i => i.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify([]));
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartTotalCost = (state) => state.cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

export default cartSlice.reducer;
