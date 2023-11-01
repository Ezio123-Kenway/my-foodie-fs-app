import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { MenuAddonCategory } from "@prisma/client";
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
    setMenuAddonCategories: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      state.items = action.payload;
    },
    addMenuAddonCategories: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuAddonCategories: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      const addonCategoryId = action.payload[0].addonCategoryId;
      const otherMenuAddonCategory = state.items.filter(
        (item) => item.addonCategoryId !== addonCategoryId
      );
      state.items = [...otherMenuAddonCategory, ...action.payload];
      console.log(state.items);
    },
    removeMenuAddonCategoriesByAddonCategoryId: (
      state,
      action: PayloadAction<{ addonCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.addonCategoryId !== action.payload.addonCategoryId
      );
    },
    removeMenuAddonCategoriesByMenuId: (
      state,
      action: PayloadAction<{ menuId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.menuId
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
