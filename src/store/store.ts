import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import addonReducer from "./slices/addonSlice";
import addonCategoryReducer from "./slices/addonCategorySlice";
import locationReducer from "./slices/locationSlice";
import menuCategoryReducer from "./slices/menuCategorySlice";
import menuCategoryMenuReducer from "./slices/menuCategoryMenuSlice";
import tableReducer from "./slices/tableSlice";
import appReducer from "./slices/appSlice";
import snackBarReducer from "./slices/snackBarSlice";
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    menu: menuReducer,
    menuCategory: menuCategoryReducer,
    menuCategoryMenu: menuCategoryMenuReducer,
    addonCategory: addonCategoryReducer,
    addon: addonReducer,
    location: locationReducer,
    table: tableReducer,
    snackBar: snackBarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
