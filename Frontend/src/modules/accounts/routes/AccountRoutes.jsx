import React from 'react'
import { Routes, Route } from "react-router-dom";
 
import AccountDashboard from '../pages/dashboard';
import AccountLayout from '../layouts/accountLayout'; 
 
import InvoiceComponent from '../pages/Account/invoiceComponent'
import QuotationList from '../pages/Account/quatation'
import VendorManager from "../pages/Account/vendorComponent"
import VendorPaymentList from "../pages/Account/vendorPayment/vendorPaymentList"
import VendorComponent from "../pages/Account/VendorTax/vendor.jsx"
import TaxPaymentComponent from "../pages/Account/VendorTax/TaxPayment"
import TaxDeductManager from "../pages/Account/VendorTax/TaxComplains"
const AccountRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Route */}
        {/* <Route path="login" element={<FinanceLoginPage />} /> */}

        {/* Protected routes wrapped inside FinanceLayout */}
        <Route element={<AccountLayout />}>
          <Route path="/dashboard" element={<AccountDashboard />} /> 
          <Route path="/invoice" element={<InvoiceComponent />} />
          <Route path="/quatation" element={<QuotationList />} />
          <Route path="/vendor" element={<VendorManager/>} />
          <Route path="/payable" element={<VendorPaymentList/>} />
          <Route path="/Ven" element={<VendorComponent/>} />
          <Route path="/taxpayment" element={<TaxPaymentComponent/>} />
          <Route path="/Taxdeduct" element={<TaxDeductManager/>} />
         

        </Route>
         

      </Routes>
    </>
  )
}

export default AccountRoutes
