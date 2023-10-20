import { Location } from "@prisma/client";

export interface LocationSliceState {
  items: Location[];
  isLoading: boolean;
  error: Error | null;
}

interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface CreateLocationOptions extends BaseOptions {
  name: string;
  address: string;
}
