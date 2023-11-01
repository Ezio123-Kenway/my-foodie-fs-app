import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { MenuCategoryMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuCategoryMenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const menuCategoryMenuSlice = createSlice({
  name: "menuCategoryMenu",
  initialState,
  reducers: {
    setMenuCategoryMenus: (
      state,
      action: PayloadAction<MenuCategoryMenu[]>
    ) => {
      state.items = action.payload;
    },
    addMenuCategoryMenus: (
      state,
      action: PayloadAction<MenuCategoryMenu[]>
    ) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuCategoryMenus: (
      state,
      action: PayloadAction<MenuCategoryMenu[]>
    ) => {
      const menuId = action.payload[0].menuId;
      const otherMenuCategoryMenus = state.items.filter(
        (item) => item.menuId !== menuId
      );
      state.items = [...otherMenuCategoryMenus, ...action.payload];
    },
    removeMenuCategoryMenusByMenuCategoryId: (
      state,
      action: PayloadAction<{ menuCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuCategoryId !== action.payload.menuCategoryId
      );
    },
    removeMenuCategoryMenusByMenuId: (
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
  setMenuCategoryMenus,
  addMenuCategoryMenus,
  replaceMenuCategoryMenus,
  removeMenuCategoryMenusByMenuCategoryId,
  removeMenuCategoryMenusByMenuId,
} = menuCategoryMenuSlice.actions;

export default menuCategoryMenuSlice.reducer;
