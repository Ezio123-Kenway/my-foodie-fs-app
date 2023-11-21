import { Location } from "@prisma/client";
import { BaseOptions } from "./app";

export interface LocationSliceState {
  items: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: Error | null;
}

export interface CreateLocationOptions extends BaseOptions {
  name: string;
  street: string;
  township: string;
  city: string;
  companyId: number | undefined;
}

export interface UpdateLocationOptions extends BaseOptions {
  id: number;
  name: string;
  street: string;
  township: string;
  city: string;
  companyId: number | undefined;
}

export interface DeleteLocationOptions extends BaseOptions {
  id: number;
}
