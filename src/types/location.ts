import { Location } from "@prisma/client";
import { BaseOptions } from "./app";

export interface LocationSliceState {
  items: Location[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateLocationOptions extends BaseOptions {
  name: string;
  address: string;
}
