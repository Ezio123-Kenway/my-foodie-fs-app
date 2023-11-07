import { DisabledLocationMenuCategorySlice } from "@/types/disabledLocationMenuCategory";
import { DisabledLocationMenuCategory } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const disabledLocationMenuCategorySlice = createSlice({
  name: "disabledLocationMenuCategory",
  initialState,
  reducers: {
    setDisabledLocationMenuCategories: (
      state,
      action: PayloadAction<DisabledLocationMenuCategory[]>
    ) => {
      state.items = action.payload;
    },
    addDisabledLocationMenuCategory: (
      state,
      action: PayloadAction<DisabledLocationMenuCategory>
    ) => {
      state.items = [...state.items, action.payload];
    },
    removeDisabledLocationMenuCategory: (
      state,
      action: PayloadAction<{ locationId: number; menuCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.locationId === action.payload.locationId &&
            item.menuCategoryId === action.payload.menuCategoryId
          )
      );
    },
  },
});

export const {
  setDisabledLocationMenuCategories,
  addDisabledLocationMenuCategory,
  removeDisabledLocationMenuCategory,
} = disabledLocationMenuCategorySlice.actions;

export default disabledLocationMenuCategorySlice.reducer;
