import { MenuAddonCategory } from "@prisma/client";

export interface MenuAddonCategorySlice {
  items: MenuAddonCategory[];
  isLoading: boolean;
  error: Error | null;
}
