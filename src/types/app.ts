export interface AppSliceState {
  init: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface GetAppDataOptions extends BaseOptions {
  companyId?: number;
  tableId?: number;
}
