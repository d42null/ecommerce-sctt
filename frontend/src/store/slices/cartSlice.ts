import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: Product; quantity: number }>) => {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Selectors using structural typing to avoid circular dependency
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalCost = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

export default cartSlice.reducer;
