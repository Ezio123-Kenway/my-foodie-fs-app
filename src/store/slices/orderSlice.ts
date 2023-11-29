import {
  CreateOrderOptions,
  OrderSlice,
  RefreshOrderOptions,
  UpdateOrderOptions,
} from "@/types/order";
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
      const response = await fetch(`${config.orderApiUrl}/orders`, {
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

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (options: UpdateOrderOptions, thunkApi) => {
    const { itemId, status, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.orderApiUrl}/orders?itemId=${itemId}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const { orders } = await response.json();
      thunkApi.dispatch(setOrders(orders));
      onSuccess && onSuccess(orders);
    } catch (error) {
      console.error(error);
      onError && onError();
    }
  }
);

export const refreshOrder = createAsyncThunk(
  "order/refreshOrder",
  async (options: RefreshOrderOptions, thunkApi) => {
    const { orderSeq, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.orderApiUrl}/orders?orderSeq=${orderSeq}`
      );
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
      state.items = action.payload;
    },
  },
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
