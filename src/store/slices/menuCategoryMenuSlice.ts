import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { createSlice } from "@reduxjs/toolkit";

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
      const otherMenuCategoryMenu = state.items.filter(
        (item) => item.menuId !== menuId
      );
      //   console.log("array: ", [...otherMenuCategoryMenu, ...action.payload]);
      state.items = [...otherMenuCategoryMenu, ...action.payload];
    },
  },
});

export const {
  setMenuCategoryMenus,
  addMenuCategoryMenus,
  replaceMenuCategoryMenus,
} = menuCategoryMenuSlice.actions;

export default menuCategoryMenuSlice.reducer;
