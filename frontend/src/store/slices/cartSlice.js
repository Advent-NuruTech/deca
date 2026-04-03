import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          quantity,
        });
      }

      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item._id === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => {
  return state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
export const selectCartItemsCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};

export default cartSlice.reducer;
