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
import { stat } from "fs";

const initialState: MenuSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

// export const getMenus = createAsyncThunk(
//   "menu/getMenus",
//   async (options: GetMenusOptions, thunkApi) => {
//     const { locationId, onSuccess, onError } = options;
//     try {
//       const response = await fetch(
//         `${config.apiBaseUrl}/menu?locationId=${locationId}`
//       );
//       const menus = await response.json();
//       thunkApi.dispatch(setMenus(menus));
//       onSuccess && onSuccess();
//     } catch (error) {
//       onError && onError();
//     }
//   }
// );

export const getMenus = createAsyncThunk(
  "menu/getMenus",
  async (_, thunkApi) => {
    const response = await fetch(`${config.apiBaseUrl}/menus`);
    const menus = await response.json();
    thunkApi.dispatch(setMenus(menus));
  }
);

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (options: CreateMenuOptions, thunkApi) => {
    const { name, price, menuCategoryIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, menuCategoryIds }),
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

export const updateMenuThunk = createAsyncThunk(
  "menu/updateMenuThunk",
  async (options: UpdateMenuOptions, thunkApi) => {
    const { id, name, price, menuCategoryIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, menuCategoryIds }),
      });
      const { updatedMenu, createdMenuCategoryMenus } = await response.json();
      thunkApi.dispatch(replaceMenu(updatedMenu));
      thunkApi.dispatch(replaceMenuCategoryMenus(createdMenuCategoryMenus));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteMenuThunk = createAsyncThunk(
  "menu/deleteMenuThunk",
  async (options: DeleteMenuOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/menus?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(deleteMenu({ id }));
      thunkApi.dispatch(removeMenuAddonCategoriesByMenuId({ id }));
      thunkApi.dispatch(removeMenuCategoryMenusByMenuId({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

// export const updateMenuThunk = createAsyncThunk(
//   "menu/updateMenuThunk",
//   async (payload, thunkApi) => {
//     // const { id, name, price } = payload;
//     const response = await fetch(`${config.apiBaseUrl}/menus`, {
//       method: "PUT",
//       headers: { "content-type": "application/json" },
//       body: JSON.stringify({}),
//     });
//     const updatedMenu = await response.json();
//     thunkApi.dispatch(updateMenu(updatedMenu));
//   }
// );

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
    deleteMenu: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    removeMenus: (state, action: PayloadAction<{ ids: number[] }>) => {
      state.items = state.items.filter(
        (item) => !action.payload.ids.includes(item.id)
      );
    },
  },
});

export const { setMenus, addMenu, replaceMenu, deleteMenu, removeMenus } =
  menuSlice.actions;

export default menuSlice.reducer;
