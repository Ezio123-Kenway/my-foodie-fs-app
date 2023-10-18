import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import addonReducer from "./slices/addonSlice";
import addonCategoryReducer from "./slices/addonCategorySlice";
import locationReducer from "./slices/locationSlice";
import menuCategoryReducer from "./slices/menuCategorySlice";
import tableReducer from "./slices/tableSlice";
import appReducer from "./slices/appSlice";
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    menu: menuReducer,
    menuCategory: menuCategoryReducer,
    addonCategory: addonCategoryReducer,
    addon: addonReducer,
    location: locationReducer,
    table: tableReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
