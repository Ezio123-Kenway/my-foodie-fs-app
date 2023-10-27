import { Table } from "@prisma/client";
import { BaseOptions } from "./app";

export interface TableSliceState {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateTableOptions extends BaseOptions {
  name: string;
  locationId: number | undefined;
}

export interface UpdateTableOptions extends BaseOptions {
  id: number;
  name: string;
  locationId: number | undefined;
}

export interface DeleteTableOptions extends BaseOptions {
  id: number;
}
