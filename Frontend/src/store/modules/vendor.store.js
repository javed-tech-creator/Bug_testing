import { vendorProductApi } from "../../api/vendor/product.api";
import { profileManagementApi } from "../../api/vendor/profileManagement.api";
import { vendorInvoiceApi } from "../../api/vendor/invoice.api";
import { vendorCustomerApi } from "../../api/vendor/customer.api";
import { productCategoryApi } from "../../api/vendor/productCategory.api";
import { vendorBankApi } from "../../api/vendor/bankDetails.api";
import { vendorDraftApi } from "../../api/vendor/draft.api";
import { vendorNotificationApi } from "../../api/vendor/notification.api";
import { vendorDashboardApi } from "../../api/vendor/dashboard.api";

export const vendorReducers = {
  [vendorProductApi.reducerPath]: vendorProductApi.reducer,
  [profileManagementApi.reducerPath]: profileManagementApi.reducer,
  [vendorInvoiceApi.reducerPath]: vendorInvoiceApi.reducer,
  [vendorCustomerApi.reducerPath]: vendorCustomerApi.reducer,
  [productCategoryApi.reducerPath]: productCategoryApi.reducer,
  [vendorBankApi.reducerPath]: vendorBankApi.reducer,
  [vendorDraftApi.reducerPath]: vendorDraftApi.reducer,
  [vendorNotificationApi.reducerPath]: vendorNotificationApi.reducer,
  [vendorDashboardApi.reducerPath]: vendorDashboardApi.reducer,
};

export const vendorMiddleware = [
  vendorProductApi.middleware,
  profileManagementApi.middleware,
  vendorInvoiceApi.middleware,
  vendorCustomerApi.middleware,
  productCategoryApi.middleware,
  vendorBankApi.middleware,
  vendorDraftApi.middleware,
  vendorNotificationApi.middleware,
  vendorDashboardApi.middleware,
];
