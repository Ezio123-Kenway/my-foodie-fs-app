import { AddonCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface AddonCategorySliceState {
  items: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateAddOnCategoryOptions extends BaseOptions {
  name: string;
  isRequired: boolean;
  menuIds: number[];
}

export interface UpdateAddOnCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  isRequired: boolean;
  menuIds: number[];
}

export interface DeleteAddOnCategoryOptions extends BaseOptions {
  id: number;
}
