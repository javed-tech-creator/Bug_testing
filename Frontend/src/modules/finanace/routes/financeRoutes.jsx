import React from 'react'
import { Routes, Route } from "react-router-dom";
import FinanceLoginPage from '../pages/financelogin'
import FinanceDashboard from '../pages/dashboard/financeDashboard';
import FinanceLayout from '../layouts/financeLayout';
import ClientComponent from '../pages/Quatation_Billing/Clients';
import ProjectComponent from '../pages/Quatation_Billing/Projects';
import ProductComponent from '../pages/Quatation_Billing/Products';
import QuotationComponent from '../pages/Quatation_Billing/Quotations';
import InvoicePage from '../pages/Quatation_Billing/Invoices';
import Vendors from '../pages/vender_contractor_payout/vendor';
import Payments from '../pages/vender_contractor_payout/payment';
import PurchaseOrders from '../pages/vender_contractor_payout/purchase';
 
import LedgerPage from  '../pages/ledger/ledger'
import Category from "../pages/expences/Category"
import Expenses from "../pages/expences/Expences"
import Budgets from "../pages/expences/Budgets"
const FinanceRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="login" element={<FinanceLoginPage />} />

        {/* Protected routes wrapped inside FinanceLayout */}
        <Route element={<FinanceLayout />}>
          <Route path="/dashboard" element={<FinanceDashboard />} />
          <Route path="/clients" element={<ClientComponent />} />
          <Route path="/projects" element={<ProjectComponent />} />
          <Route path="/products" element={<ProductComponent />} />
          <Route path="/quatations" element={<QuotationComponent />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/purchaseorders" element={<PurchaseOrders />} /> 
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budgets" element={<Budgets />} />

        </Route>
          <Route path="invoices/:id" element={<InvoicePage />} />

      </Routes>
    </>
  )
}

export default FinanceRoutes
