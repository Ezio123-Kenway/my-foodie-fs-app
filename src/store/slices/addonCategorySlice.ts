import {
  AddonCategorySliceState,
  CreateAddonCategoryOptions,
  DeleteAddonCategoryOptions,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuAddonCategories,
  removeMenuAddonCategoriesByAddonCategoryId,
  replaceMenuAddonCategories,
} from "./menuAddonCategorySlice";
import { removeAddons } from "./addonSlice";

const initialState: AddonCategorySliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const createAddonCategory = createAsyncThunk(
  "addonCategory/createAddonCategory",
  async (options: CreateAddonCategoryOptions, thunkApi) => {
    const { name, isRequired, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon-categories`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, isRequired, menuIds }),
      });
      const { newAddonCategory, menuAddonCategories } = await response.json();
      thunkApi.dispatch(addAddonCategory(newAddonCategory));
      thunkApi.dispatch(addMenuAddonCategories(menuAddonCategories));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateAddonCategoryThunk = createAsyncThunk(
  "addonCategory/updateAddonCategoryThunk",
  async (options: UpdateAddonCategoryOptions, thunkApi) => {
    const { id, name, isRequired, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon-categories`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, isRequired, menuIds }),
      });
      const { updatedAddonCategory, createdMenuAddonCategories } =
        await response.json();
      thunkApi.dispatch(replaceAddonCategory(updatedAddonCategory));
      thunkApi.dispatch(replaceMenuAddonCategories(createdMenuAddonCategories));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteAddonCategoryThunk = createAsyncThunk(
  "addonCategory/deleteAddonCategoryThunk",
  async (options: DeleteAddonCategoryOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/addon-categories?id=${id}`,
        {
          method: "DELETE",
        }
      );
      thunkApi.dispatch(deleteAddonCategory({ id }));
      // thunkApi.dispatch(removeMenuAddonCategoriesByAddonCategoryId({ id }));
      thunkApi.dispatch(removeAddons({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const AddonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addAddonCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddonCategory: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    deleteAddonCategory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setAddonCategories,
  addAddonCategory,
  replaceAddonCategory,
  deleteAddonCategory,
} = AddonCategorySlice.actions;

export default AddonCategorySlice.reducer;
