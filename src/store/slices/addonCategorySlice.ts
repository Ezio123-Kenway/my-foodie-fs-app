import { AddonCategorySliceState } from "@/types/addonCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AddonCategorySliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const AddonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddonCategories: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setAddonCategories } = AddonCategorySlice.actions;

export default AddonCategorySlice.reducer;
