import { AddonSliceState } from "@/types/addon";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AddonSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const AddonSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    setAddons: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setAddons } = AddonSlice.actions;

export default AddonSlice.reducer;
