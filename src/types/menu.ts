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

export interface CreateMenuType {
  id?: number;
  name: string;
  price: number;
  description?: string;
}
