import { MenuCategoryMenu } from "@prisma/client";
import { BaseOptions } from "./app";

export interface MenuCategoryMenuSlice extends BaseOptions {
  items: MenuCategoryMenu[];
  isLoading: boolean;
  error: Error | null;
}
