import {
  CreateMenuCategoryOptions,
  DeleteMenuCategoryOptions,
  MenuCategorySliceState,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { MenuCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeMenuCategoryMenusByMenuCategoryId } from "./menuCategoryMenuSlice";
import { removeMenus } from "./menuSlice";
import { removeAddonCategories } from "./addonCategorySlice";
import { removeAddonsByAddonCategoryIds } from "./addonSlice";

const initialState: MenuCategorySliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const createMenuCategory = createAsyncThunk(
  "menuCategory/createMenuCategory",
  async (options: CreateMenuCategoryOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-categories`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const { newMenuCategory } = await response.json();
      thunkApi.dispatch(addMenuCategory(newMenuCategory));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateMenuCategory = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (options: UpdateMenuCategoryOptions, thunkApi) => {
    const { id, name, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-categories`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const { updatedMenuCategory } = await response.json();
      thunkApi.dispatch(replaceMenuCategory(updatedMenuCategory));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteMenuCategory = createAsyncThunk(
  "menuCategory/deleteMenuCategory",
  async (options: DeleteMenuCategoryOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu-categories?id=${id}`,
        {
          method: "DELETE",
        }
      );
      const { menuIdsToDelete, addonCategoryIdsToDelete } =
        await response.json();
      thunkApi.dispatch(removeMenuCategory({ id }));
      thunkApi.dispatch(removeMenuCategoryMenusByMenuCategoryId({ id }));
      menuIdsToDelete.length > 0 &&
        thunkApi.dispatch(removeMenus({ ids: menuIdsToDelete }));
      addonCategoryIdsToDelete.length > 0 &&
        thunkApi.dispatch(
          removeAddonCategories({ ids: addonCategoryIdsToDelete })
        );
      addonCategoryIdsToDelete.length > 0 &&
        thunkApi.dispatch(
          removeAddonsByAddonCategoryIds({ ids: addonCategoryIdsToDelete })
        );
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const MenuCategorySlice = createSlice({
  name: "menuCategory",
  initialState,
  reducers: {
    setMenuCategories: (state, action: PayloadAction<MenuCategory[]>) => {
      state.items = action.payload;
    },
    addMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenuCategory: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setMenuCategories,
  addMenuCategory,
  replaceMenuCategory,
  removeMenuCategory,
} = MenuCategorySlice.actions;

export default MenuCategorySlice.reducer;
