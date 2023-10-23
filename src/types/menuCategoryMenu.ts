import { MenuCategoryMenu } from "@prisma/client";

export interface MenuCategoryMenuSlice {
  items: MenuCategoryMenu[];
  isLoading: boolean;
  error: Error | null;
}
