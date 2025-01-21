import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default is localStorage
import authReducer from "./userSlice";

// Persist configuration
const persistConfig = {
  key: "auth", // The key for local storage
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configure the store with customized middleware
const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ], // Ignore these redux-persist actions
      },
    }),
});

// Persistor for rehydrating state
const persistor = persistStore(store);

// Named exports
export { store, persistor };
