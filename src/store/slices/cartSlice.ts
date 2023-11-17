import { CartItem } from "@/types/cart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartState {
  isLoading: boolean;
  items: CartItem[];
  error: Error | null;
}

const initialState: CartState = {
  isLoading: false,
  items: [],
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exist = state.items.find((item) => item.id === action.payload.id);
      if (exist) {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      } else {
        state.items = [...state.items, action.payload];
      }
    },
    updateQuantityInCart: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity: incomingQuantity } = action.payload;
      const exist = state.items.find((item) => item.id === id) as CartItem;
      state.items = state.items.map((item) =>
        item.id === id
          ? { ...item, quantity: exist.quantity + incomingQuantity }
          : item
      );
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantityInCart } =
  cartSlice.actions;

export default cartSlice.reducer;
