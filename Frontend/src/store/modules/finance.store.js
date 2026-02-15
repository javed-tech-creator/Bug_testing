import { clientApi } from "../../api/finance/Quatation_Billing/client.api";
import { financeprojectApi } from "../../api/finance/Quatation_Billing/project.api";
import { productApi } from "../../api/finance/Quatation_Billing/product.api";
import { quotationApi } from "../../api/finance/Quatation_Billing/quatation.api";
import { invoiceApi } from "../../api/finance/Quatation_Billing/invoice.api";
import { vendorApi } from "../../api/finance/Quatation_Billing/vender.api";
import { poApi } from "../../api/finance/Quatation_Billing/po.api";
import { paymentsApi } from "../../api/finance/Quatation_Billing/payment.api";
import { payoutApi } from "../../api/finance/Quatation_Billing/expencePayout.api";
// import { expenseApi } from "../../api/finance/Quatation_Billing/expence.api";
import { ledgerApi } from "../../api/finance/Quatation_Billing/ledger.api";
import { budgetApis } from "../../api/finance/Quatation_Billing/expenceBudget.api";
import {expenceApis} from "../../api/finance/Quatation_Billing/expenceE.api"

export const financeReducers = {
  [clientApi.reducerPath]: clientApi.reducer,
  [financeprojectApi.reducerPath]: financeprojectApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [quotationApi.reducerPath]: quotationApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  [vendorApi.reducerPath]: vendorApi.reducer,
  [poApi.reducerPath]: poApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  [payoutApi.reducerPath]: payoutApi.reducer,
  [expenceApis.reducerPath]: expenceApis.reducer,
  [ledgerApi.reducerPath]: ledgerApi.reducer,
  [budgetApis.reducerPath]: budgetApis.reducer,
};

export const financeMiddleware = [
  clientApi.middleware,
  financeprojectApi.middleware,
  productApi.middleware,
  quotationApi.middleware,
  invoiceApi.middleware,
  vendorApi.middleware,
  poApi.middleware,
  paymentsApi.middleware,
  payoutApi.middleware,
  expenceApis.middleware,
  ledgerApi.middleware,
  budgetApis.middleware,
];
