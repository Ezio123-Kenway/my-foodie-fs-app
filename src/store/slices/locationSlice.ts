import { LocationSliceState } from "@/types/location";
import { createSlice } from "@reduxjs/toolkit";

const initialState: LocationSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setLocations } = locationSlice.actions;

export default locationSlice.reducer;
