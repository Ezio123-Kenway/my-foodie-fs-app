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

export interface CreateAddonCategoryOptions extends BaseOptions {
  name: string;
  isRequired: boolean;
  menuIds: number[];
}

export interface UpdateAddonCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  isRequired: boolean;
  menuIds: number[];
}

export interface DeleteAddonCategoryOptions extends BaseOptions {
  id: number;
}
