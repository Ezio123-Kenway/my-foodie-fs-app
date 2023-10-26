import { AddonCategory } from "@prisma/client";

export interface AddonCategorySliceState {
  items: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}
