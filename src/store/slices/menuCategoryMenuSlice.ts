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
  },
});

export const { setMenuCategoryMenus, addMenuCategoryMenus } =
  menuCategoryMenuSlice.actions;

export default menuCategoryMenuSlice.reducer;
