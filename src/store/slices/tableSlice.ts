import {
  CreateTableOptions,
  DeleteTableOptions,
  TableSliceState,
  UpdateTableOptions,
} from "@/types/table";
import { config } from "@/utils/config";
import { Table } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TableSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const createTable = createAsyncThunk(
  "table/createTable",
  async (options: CreateTableOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/tables`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const { newTableWithAssetUrl } = await response.json();
      thunkApi.dispatch(addTable(newTableWithAssetUrl));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateTable = createAsyncThunk(
  "table/updateTable",
  async (options: UpdateTableOptions, thunkApi) => {
    const { id, name, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/tables`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const { updatedTable } = await response.json();
      thunkApi.dispatch(replaceTable(updatedTable));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteTable = createAsyncThunk(
  "table/deleteTable",
  async (options: DeleteTableOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.backofficeApiUrl}/tables?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeTable({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const TableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.items = action.payload;
    },
    addTable: (state, action: PayloadAction<Table>) => {
      state.items = [...state.items, action.payload];
    },
    replaceTable: (state, action: PayloadAction<Table>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeTable: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setTables, addTable, replaceTable, removeTable } =
  TableSlice.actions;

export default TableSlice.reducer;
