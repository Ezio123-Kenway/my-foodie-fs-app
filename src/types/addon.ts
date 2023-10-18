import { Addon } from "@prisma/client";

export interface AddonSliceState {
  items: Addon[];
  isLoading: boolean;
  error: Error | null;
}

interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
