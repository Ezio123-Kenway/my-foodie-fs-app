import { CreateMenuType, GetMenusOptions, MenuSliceState } from "@/types/menu";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  async (payload: CreateMenuType, thunkApi) => {
    const response = await fetch(`${config.apiBaseUrl}/menus`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const newMenu = await response.json();
    thunkApi.dispatch(addMenu(newMenu));
  }
);

export const updateMenuThunk = createAsyncThunk(
  "menu/updateMenuThunk",
  async (payload: CreateMenuType, thunkApi) => {
    const { id, name, price } = payload;
    const response = await fetch(`${config.apiBaseUrl}/menus/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    const updatedMenu = await response.json();
    thunkApi.dispatch(updateMenu(updatedMenu));
  }
);

export const deleteMenuThunk = createAsyncThunk(
  "menu/deleteMenuThunk",
  async (payload: number, thunkApi) => {
    await fetch(`${config.apiBaseUrl}/menus/${payload}`, {
      method: "DELETE",
    });
    thunkApi.dispatch(deleteMenu(payload));
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenu: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    updateMenu: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, name: action.payload.name, price: action.payload.price }
          : item
      );
    },
    deleteMenu: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setMenus, addMenu, updateMenu, deleteMenu } = menuSlice.actions;

export default menuSlice.reducer;
