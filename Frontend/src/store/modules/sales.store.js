import { leadApi } from "../../api/sales/lead.api";
import { salesApi } from "../../api/sales/sales.api";
import { reportingApi } from "../../api/sales/reporting.api";
import { SalesDashboardApi } from "../../api/sales/dashboard.sales.api";
import { clientApi } from "@/api/sales/client.api";
import { paymentApi } from "@/api/sales/payment.api";
import { targetApi } from "@/api/sales/target.api";

export const salesReducers = {
  [leadApi.reducerPath]: leadApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  [reportingApi.reducerPath]: reportingApi.reducer,
  [SalesDashboardApi.reducerPath]: SalesDashboardApi.reducer,
  [clientApi.reducerPath]: clientApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [targetApi.reducerPath]: targetApi.reducer,
};

export const salesMiddleware = [
  leadApi.middleware,
  salesApi.middleware,
  reportingApi.middleware,
  SalesDashboardApi.middleware,
  clientApi.middleware,
  paymentApi.middleware,
  targetApi.middleware,
];
