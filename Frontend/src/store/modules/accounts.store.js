import { accountInvoiceApi } from "../../api/accounts/invoice.api";
import { accountQuotationApi } from "../../api/accounts/quatation.api";
import { vendorApis } from "../../api/accounts/vendor.api";
import { vendorPaymentApi } from "../../api/accounts/Payables.api";
import {vendorTaxApi} from "@/api/accounts/vendor_tax/vendor.api"
import {taxPaymentApi} from "@/api/accounts/vendor_tax/vendorTaxpayment.api"
import { taxDeductApi } from "@/api/accounts/vendor_tax/TaxComplains";

export const accountsReducers = {
  [accountInvoiceApi.reducerPath]: accountInvoiceApi.reducer,
  [accountQuotationApi.reducerPath]: accountQuotationApi.reducer,
  [vendorApis.reducerPath]: vendorApis.reducer,
  [vendorPaymentApi.reducerPath]: vendorPaymentApi.reducer,
  [vendorTaxApi.reducerPath]: vendorTaxApi.reducer,
  [taxPaymentApi.reducerPath]: taxPaymentApi.reducer,
  [taxDeductApi.reducerPath]:taxDeductApi.reducer
};

export const accountsMiddleware = [
  accountInvoiceApi.middleware,
  accountQuotationApi.middleware,
  vendorApis.middleware,
  vendorPaymentApi.middleware,
  vendorTaxApi.middleware,
  taxPaymentApi.middleware,
  taxDeductApi.middleware
];
