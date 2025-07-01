import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import userReducer from "./userSlice";
import persistStore from "redux-persist/es/persistStore";

const userConfig = {
  key: "user",
  storage: storage,
  version: 1,
};

const createRootReducer = () =>
  combineReducers({
    user: persistReducer(userConfig, userReducer),
  });

const configureAppStore = () => {
  const rootReducer = createRootReducer();

  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const store = configureAppStore();
export let persistor = persistStore(store);
