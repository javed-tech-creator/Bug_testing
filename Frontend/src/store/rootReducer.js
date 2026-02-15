import { combineReducers } from "@reduxjs/toolkit";
import { salesReducers } from "./modules/sales.store";
import { vendorReducers } from "./modules/vendor.store";
import { financeReducers } from "./modules/finance.store";
import { technologyReducers } from "./modules/technology.store";
import { accountsReducers } from "./modules/accounts.store";
import { marketingReducers } from "./modules/marketing.store";
import { hrReducers } from "./modules/hr.store";
import authReducer from "./slices/authSlice";
import { authApi } from "../api/auth.api";
import { adminReducers } from "./modules/admin.store";
import { designReducers } from "./modules/design.store";
import { projectReducers } from "./modules/project.store";
import { recceReducer } from "./modules/recce.store";

export const rootReducer = combineReducers({
  ...salesReducers,
  ...vendorReducers,
  ...financeReducers,
  ...technologyReducers,
  ...accountsReducers,
  ...marketingReducers,
  ...hrReducers,
  ...adminReducers,
  ...designReducers,
  ...projectReducers,
  ...recceReducer,
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
});
