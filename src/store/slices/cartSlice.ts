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
        const { menu, addons } = action.payload;
        const sameMenuItems = state.items.filter(
          (item) => item.menu.id === menu.id
        );
        if (sameMenuItems.length) {
          const sameCartItem = sameMenuItems.find((item) => {
            const selectedAddons = addons.filter((addon) =>
              item.addons.includes(addon)
            );
            return selectedAddons.length === addons.length ? true : false;
          });
          if (sameCartItem) {
            const newQuantity = sameCartItem.quantity + action.payload.quantity;
            state.items = state.items.map((item) =>
              item.id === sameCartItem.id
                ? { ...item, quantity: newQuantity }
                : item
            );
          } else {
            state.items = [...state.items, action.payload];
          }
        } else {
          state.items = [...state.items, action.payload];
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
