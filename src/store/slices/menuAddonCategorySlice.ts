import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { createSlice } from "@reduxjs/toolkit";

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
      // console.log("otherMenuAddonCategory: ", otherMenuAddonCategory);
      // console.log("actionPayload: ", action.payload);
      state.items = [...otherMenuAddonCategory, ...action.payload];
      // console.log(state.items);
    },
  },
});

export const {
  setMenuAddonCategories,
  addMenuAddonCategories,
  replaceMenuAddonCategories,
} = menuAddonCategorySlice.actions;

export default menuAddonCategorySlice.reducer;
