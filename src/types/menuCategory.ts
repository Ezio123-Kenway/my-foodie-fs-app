import { MenuCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface MenuCategorySliceState {
  items: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}

// to create a menu-category, we need name and companyId but companyId can be gained from locationId and we work with locationId in app
export interface CreateMenuCategoryOptions extends BaseOptions {
  name: string;
  locationId: number;
}

export interface UpdateMenuCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  locationId: number;
  isAvailable: boolean;
}

export interface DeleteMenuCategoryOptions extends BaseOptions {
  id: number;
}
