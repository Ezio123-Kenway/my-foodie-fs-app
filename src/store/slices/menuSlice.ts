import {
  CreateMenuOptions,
  DeleteMenuOptions,
  GetMenusOptions,
  MenuSliceState,
  UpdateMenuOptions,
} from "@/types/menu";
import { config } from "@/utils/config";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuCategoryMenus,
  removeMenuCategoryMenusByMenuId,
  replaceMenuCategoryMenus,
} from "./menuCategoryMenuSlice";
import { removeMenuAddonCategoriesByMenuId } from "./menuAddonCategorySlice";
import { Menu } from "@prisma/client";
import {
  addDisabledLocationMenu,
  removeDisabledLocationMenu,
} from "./disabledLocationMenuSlice";

const initialState: MenuSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (options: CreateMenuOptions, thunkApi) => {
    const { name, price, imageUrl, menuCategoryIds, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, imageUrl, menuCategoryIds }),
      });
      const { newMenu, menuCategoryMenus } = await response.json();
      thunkApi.dispatch(addMenu(newMenu));
      thunkApi.dispatch(addMenuCategoryMenus(menuCategoryMenus));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async (options: UpdateMenuOptions, thunkApi) => {
    const {
      id,
      name,
      price,
      locationId,
      isAvailable,
      menuCategoryIds,
      imageUrl,
      onSuccess,
      onError,
    } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          price,
          locationId,
          isAvailable,
          menuCategoryIds,
          imageUrl,
        }),
      });
      const { updatedMenu, createdMenuCategoryMenus, disabledLocationMenu } =
        await response.json();
      thunkApi.dispatch(replaceMenu(updatedMenu));
      thunkApi.dispatch(replaceMenuCategoryMenus(createdMenuCategoryMenus));
      if (isAvailable === false) {
        if (disabledLocationMenu)
          thunkApi.dispatch(addDisabledLocationMenu(disabledLocationMenu));
      } else {
        thunkApi.dispatch(
          removeDisabledLocationMenu({ locationId, menuId: id })
        );
      }
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (options: DeleteMenuOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/menus?id=${id}`, {
        method: "DELETE",
      });
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.items = action.payload;
    },
    addMenu: (state, action: PayloadAction<Menu>) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenu: (state, action: PayloadAction<Menu>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenu: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setMenus, addMenu, replaceMenu, removeMenu } = menuSlice.actions;

export default menuSlice.reducer;
