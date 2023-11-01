import {
  AddonSliceState,
  CreateAddonOptions,
  DeleteAddonOptions,
  UpdateAddonOptions,
} from "@/types/addon";
import { config } from "@/utils/config";
import { Addon } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AddonSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const createAddon = createAsyncThunk(
  "addon/createAddon",
  async (options: CreateAddonOptions, thunkApi) => {
    const { name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addons`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, addonCategoryId }),
      });
      const { newAddon } = await response.json();
      thunkApi.dispatch(addAddon(newAddon));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateAddon = createAsyncThunk(
  "addon/updateAddon",
  async (options: UpdateAddonOptions, thunkApi) => {
    const { id, name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addons`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, addonCategoryId }),
      });
      const { updatedAddon } = await response.json();
      thunkApi.dispatch(replaceAddon(updatedAddon));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteAddon = createAsyncThunk(
  "addon/deleteAddon",
  async (options: DeleteAddonOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/addons?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeAddon({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const AddonSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    setAddons: (state, action: PayloadAction<Addon[]>) => {
      state.items = action.payload;
    },
    addAddon: (state, action: PayloadAction<Addon>) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddon: (state, action: PayloadAction<Addon>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    // remove addon with addonId
    removeAddon: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    // remove addons with related addonCategoryId
    removeAddonsByAddonCategoryId: (
      state,
      action: PayloadAction<{ addonCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.addonCategoryId !== action.payload.addonCategoryId
      );
    },
  },
});

export const {
  setAddons,
  addAddon,
  replaceAddon,
  removeAddon,
  removeAddonsByAddonCategoryId,
} = AddonSlice.actions;

export default AddonSlice.reducer;
