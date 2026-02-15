import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";

import { rootReducer } from "./rootReducer";

// middlewares from different modules
import { salesMiddleware } from "./modules/sales.store";
import { vendorMiddleware } from "./modules/vendor.store";
import { financeMiddleware } from "./modules/finance.store";
import { technologyMiddleware } from "./modules/technology.store";
import { accountsMiddleware } from "./modules/accounts.store";
import { marketingMiddleware } from "./modules/marketing.store";
import { hrMiddleware } from "./modules/hr.store";
import { authApi } from "../api/auth.api";
import { adminMiddleware } from "./modules/admin.store";
import { designMiddleware } from "./modules/design.store";
import { projectMiddleware } from "./modules/project.store";
import { recceMiddleware } from "./modules/recce.store";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      ...salesMiddleware,
      ...vendorMiddleware,
      ...financeMiddleware,
      ...technologyMiddleware,
      ...accountsMiddleware,
      ...marketingMiddleware,
      ...hrMiddleware,
      ...adminMiddleware,
      ...designMiddleware,
      ...projectMiddleware,
      ...recceMiddleware,
      authApi.middleware
    ),
  devTools: import.meta.env.VITE_MODE !== "Pro",
});

export const persistor = persistStore(store);

// RTK Query listener setup
setupListeners(store.dispatch);
