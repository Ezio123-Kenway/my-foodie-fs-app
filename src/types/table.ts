import { Table } from "@prisma/client";

export interface TableSliceState {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}
