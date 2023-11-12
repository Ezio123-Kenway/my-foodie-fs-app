import { AppSliceState, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLocations } from "./locationSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setAddonCategories } from "./addonCategorySlice";
import { setMenus } from "./menuSlice";
import { setAddons } from "./addonSlice";
import { setTables } from "./tableSlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuAddonCategories } from "./menuAddonCategorySlice";
import { setDisabledLocationMenuCategories } from "./disabledLocationMenuCategorySlice";
import { setDisabledLocationMenus } from "./disabledLocationMenuSlice";

const initialState: AppSliceState = {
  init: false,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (options: GetAppDataOptions, thunkApi) => {
    const { locationId, tableId, onSuccess, onError } = options;
    try {
      const appDataUrl =
        locationId && tableId
          ? `${config.apiBaseUrl}/app?locationId=${locationId}&tableId=${tableId}`
          : `${config.apiBaseUrl}/app`;
      const response = await fetch(appDataUrl);
      const appData = await response.json();
      const {
        locations,
        menuCategories,
        menus,
        menuCategoryMenus,
        addonCategories,
        menuAddonCategories,
        addons,
        tables,
        disabledLocationMenuCategories,
        disabledLocationMenus,
      } = appData;
      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setLocations(locations));
      thunkApi.dispatch(setMenuCategories(menuCategories));
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
      thunkApi.dispatch(setAddonCategories(addonCategories));
      thunkApi.dispatch(setMenuAddonCategories(menuAddonCategories));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setTables(tables));
      thunkApi.dispatch(
        setDisabledLocationMenuCategories(disabledLocationMenuCategories)
      );
      thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenus));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInit: (state, action) => {
      state.init = action.payload;
    },
  },
});

export const { setInit } = appSlice.actions;

export default appSlice.reducer;
