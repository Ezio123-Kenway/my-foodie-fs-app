import { SnackBarSlice } from "@/types/snackBar";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SnackBarSlice = {
  open: false,
  message: null,
  autoHideDuration: 5000,
  severity: "success",
};

export const snackBarSlice = createSlice({
  name: "snackBar",
  initialState,
  reducers: {
    setOpenSnackbar: (state, action) => {
      const {
        autoHideDuration = 5000,
        message,
        severity = "success",
      } = action.payload;
      state.open = true;
      state.message = message;
      state.autoHideDuration = autoHideDuration;
      state.severity = severity;
    },
    resetSnackbar: (state) => {
      state.open = false;
      state.autoHideDuration = 5000;
      state.severity = "success";
      state.message = null;
    },
  },
});

export const { setOpenSnackbar, resetSnackbar } = snackBarSlice.actions;

export default snackBarSlice.reducer;
