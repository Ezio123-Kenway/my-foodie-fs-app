import {
  CreateLocationOptions,
  DeleteLocationOptions,
  LocationSliceState,
  UpdateLocationOptions,
} from "@/types/location";
import { config } from "@/utils/config";
import { Location } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LocationSliceState = {
  items: [],
  isLoading: false,
  error: null,
};

export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (options: CreateLocationOptions, thunkApi) => {
    const { name, address, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/locations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, address }),
      });
      const { newLocation } = await response.json();
      thunkApi.dispatch(addLocation(newLocation));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async (options: UpdateLocationOptions, thunkApi) => {
    const { id, name, address, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/locations`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, address }),
      });
      const { updatedLocation } = await response.json();
      thunkApi.dispatch(replaceLocation(updatedLocation));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (options: DeleteLocationOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/locations?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeLocation({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.items = action.payload;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.items = [...state.items, action.payload];
    },
    replaceLocation: (state, action: PayloadAction<Location>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeLocation: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setLocations, addLocation, replaceLocation, removeLocation } =
  locationSlice.actions;

export default locationSlice.reducer;
