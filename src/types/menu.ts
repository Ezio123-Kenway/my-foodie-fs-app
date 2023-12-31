import { Menu } from "@prisma/client";

export interface MenuSliceState {
  items: Menu[];
  isLoading: boolean;
  error: Error | null;
}

interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface GetMenusOptions extends BaseOptions {
  locationId: string;
}

export interface CreateMenuOptions extends BaseOptions {
  name: string;
  price: number;
  menuCategoryIds: number[];
  imageUrl?: string;
}

export interface UpdateMenuOptions extends BaseOptions {
  id: number;
  name: string;
  price: number;
  menuCategoryIds: number[];
  locationId: number;
  isAvailable: boolean;
  imageUrl: string | null;
}

export interface DeleteMenuOptions extends BaseOptions {
  id: number;
}
