import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
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
    setMenuCategoryMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategoryMenus: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuCategoryMenus: (state, action) => {
      const menuId = action.payload[0].menuId;
      const otherMenuCategoryMenus = state.items.filter(
        (item) => item.menuId !== menuId
      );
      state.items = [...otherMenuCategoryMenus, ...action.payload];
    },
    removeMenuCategoryMenusByMenuCategoryId: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuCategoryId !== action.payload.id
      );
    },
    removeMenuCategoryMenusByMenuId: (
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
  setMenuCategoryMenus,
  addMenuCategoryMenus,
  replaceMenuCategoryMenus,
  removeMenuCategoryMenusByMenuCategoryId,
  removeMenuCategoryMenusByMenuId,
} = menuCategoryMenuSlice.actions;

export default menuCategoryMenuSlice.reducer;
