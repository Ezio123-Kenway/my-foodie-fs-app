import { AddonCategory } from "@prisma/client";

export interface AddonCategorySliceState {
  items: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}

interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
