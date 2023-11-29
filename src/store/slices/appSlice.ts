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
import { setOrders } from "./orderSlice";
import { setCompany } from "./companySlice";

const initialState: AppSliceState = {
  init: false,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (options: GetAppDataOptions, thunkApi) => {
    const { tableId, onSuccess, onError } = options;
    try {
      const appDataUrl = tableId
        ? `${config.orderApiUrl}/app?tableId=${tableId}`
        : `${config.backofficeApiUrl}/app`;
      const response = await fetch(appDataUrl);
      const appData = await response.json();
      const {
        company,
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
        orders,
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
      thunkApi.dispatch(setOrders(orders));
      thunkApi.dispatch(setCompany(company));
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
