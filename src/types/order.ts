import { Order } from "@prisma/client";
import { BaseOptions } from "./app";
import { CartItem } from "./cart";

export interface OrderSlice {
  items: Order[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateOrderOptions extends BaseOptions {
  tableId: number;
  cartItems: CartItem[];
}
