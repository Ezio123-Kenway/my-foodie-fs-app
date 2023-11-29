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
  selectedLocation: null,
  isLoading: false,
  error: null,
};

export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (options: CreateLocationOptions, thunkApi) => {
    const { name, street, township, city, companyId, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/locations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, street, township, city, companyId }),
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
    const { id, name, street, township, city, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/locations`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, street, township, city }),
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
      await fetch(`${config.backofficeApiUrl}/locations?id=${id}`, {
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
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (!selectedLocationId) {
        const firstLocationId = String(action.payload[0].id);
        localStorage.setItem("selectedLocationId", firstLocationId);
        state.selectedLocation = action.payload[0];
      } else {
        const selectedLocation = state.items.find(
          (item) => item.id === Number(selectedLocationId)
        );
        if (selectedLocation) state.selectedLocation = selectedLocation;
      }
    },
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
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

export const {
  setLocations,
  setSelectedLocation,
  addLocation,
  replaceLocation,
  removeLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
