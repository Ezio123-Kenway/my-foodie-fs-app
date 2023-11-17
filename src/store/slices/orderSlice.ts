import { CreateOrderOptions, OrderSlice } from "@/types/order";
import { config } from "@/utils/config";
import { Order } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: OrderSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (options: CreateOrderOptions, thunkApi) => {
    const { tableId, cartItems, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tableId, cartItems }),
      });
      const { orders } = await response.json();
      thunkApi.dispatch(setOrders(orders));
      onSuccess && onSuccess(orders);
    } catch (error) {
      console.error(error);
      onError && onError();
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = [...state.items, ...action.payload];
    },
  },
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
