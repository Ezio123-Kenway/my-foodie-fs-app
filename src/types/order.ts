import { Addon, Menu, Order, OrderStatus, Table } from "@prisma/client";
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

export interface UpdateOrderOptions extends BaseOptions {
  itemId: string;
  status: OrderStatus;
}

export interface RefreshOrderOptions extends BaseOptions {
  orderSeq: string;
}

export interface OrderAddon {
  addonCategoryId: number;
  addons: Addon[];
}

export interface OrderItem {
  itemId: string;
  status: OrderStatus;
  orderAddons: OrderAddon[];
  menu: Menu;
  table: Table;
}
