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
