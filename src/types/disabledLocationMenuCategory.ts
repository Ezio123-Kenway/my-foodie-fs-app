import { DisabledLocationMenuCategory } from "@prisma/client";

export interface DisabledLocationMenuCategorySlice {
  items: DisabledLocationMenuCategory[];
  isLoading: boolean;
  error: Error | null;
}
