import { TableSliceState } from "@/types/table";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TableSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const TableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setTables } = TableSlice.actions;

export default TableSlice.reducer;
