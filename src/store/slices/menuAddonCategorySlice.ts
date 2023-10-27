import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const menuAddonCategorySlice = createSlice({
  name: "menuAddonCategory",
  initialState,
  reducers: {
    setMenuAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuAddonCategories: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuAddonCategories: (state, action) => {
      const addonCategoryId = action.payload[0].addonCategoryId;
      const otherMenuAddonCategory = state.items.filter(
        (item) => item.addonCategoryId !== addonCategoryId
      );
      state.items = [...otherMenuAddonCategory, ...action.payload];
      console.log(state.items);
    },
    removeMenuAddonCategoriesByAddonCategoryId: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.addonCategoryId !== action.payload.id
      );
    },
    removeMenuAddonCategoriesByMenuId: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.id
      );
    },
  },
});

export const {
  setMenuAddonCategories,
  addMenuAddonCategories,
  replaceMenuAddonCategories,
  removeMenuAddonCategoriesByAddonCategoryId,
  removeMenuAddonCategoriesByMenuId,
} = menuAddonCategorySlice.actions;

export default menuAddonCategorySlice.reducer;
