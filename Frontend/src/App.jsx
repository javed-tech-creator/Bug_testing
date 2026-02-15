import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Loader from "./components/Loader";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import ProductionRoutes from "./modules/production/routes/ProductionRoutes";
import MultiUnitFactories from "./pages/MultiUnitFactories";
import DesignRoutes from "./modules/design/routes/DesignRoutes";
import ScrollToTop from "./components/ScrollToTop";
import ClientRoutes from "./modules/client/routes/ClientRoutes";
import QuotationRoutes from "./modules/quotation/routes/QuotationRoutes";
import ProjectRoutes from "./modules/project/routes/ProjectRoutes";
import PrRoutes from "./modules/pr/routes/PrRoutes";
// import ManagerRoutes from "./modules/manager/routes/ManagerRoutes";

import Projects from "./pages/Projects"

// Lazy load all modules
const VendorRoutes = lazy(() => import("./modules/vendor/routes/VendorRoutes"));
const CustomerRoutes = lazy(() =>
  import("./modules/customer/routes/CustomerRoutes")
);
const SalesRoutes = lazy(() => import("./modules/sales/routes/SalesRoutes"));
const RecceRoutes = lazy(() => import("./modules/recce/routes/RecceRoutes"));
const HrRoutes = lazy(() => import("./modules/hr/routes/HrRoutes"));
const TechRoutes = lazy(() => import("./modules/technology/routes/TechRoutes"));
const FinanceRoutes = lazy(() =>
  import("./modules/finanace/routes/financeRoutes")
);
const AccountRoutes = lazy(() =>
  import("./modules/accounts/routes/AccountRoutes")
);
const MarketingRoutes = lazy(() =>
  import("./modules/marketing/routes/MarketingRoutes")
);
const AdminRoutes = lazy(() => import("./modules/admin/routes/AdminRoutes"));

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="text-center text-white py-20">
            <Loader />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/pahses" element={<MultiUnitFactories />} />

          <Route path="/projects" element={<Projects />} />

          {/* Protected module routes */}
          <Route
            path="/vendor/*"
            element={
              <ProtectedRoute module="vendor">
                <VendorRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute module="customer">
                <CustomerRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/*"
            element={
              <ProtectedRoute module="sales">
                <SalesRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recce/*"
            element={
              // <ProtectedRoute module="recce">
              <RecceRoutes />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/hr/*"
            element={
              <ProtectedRoute module="hr">
                <HrRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tech/*"
            element={
              <ProtectedRoute module="tech">
                <TechRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/*"
            element={
              <ProtectedRoute module="finance">
                <FinanceRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/*"
            element={
              <ProtectedRoute module="account">
                <AccountRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing/*"
            element={
              <ProtectedRoute module="marketing">
                <MarketingRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute module="admin">
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/production/*"
            element={
              <ProtectedRoute module="production">
                <ProductionRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/design/*"
            element={
              <ProtectedRoute module="design">
                <DesignRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotation/*"
            element={
              <ProtectedRoute module="quotation">
                <QuotationRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/*"
            element={
              <ProtectedRoute module="client">
                <ClientRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/*"
            element={
              <ProtectedRoute module="project">
                <ProjectRoutes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/pr/*"
            element={
              <ProtectedRoute module="pr">
                <PrRoutes />
              </ProtectedRoute>
            }
          />


          {/* <Route
            path="/manager/*"
            element={
              <ProtectedRoute module="manager">
                <ManagerRoutes />
              </ProtectedRoute>
            }
          /> */}

        </Routes>
      </Suspense>
    </>
  );
}

export default App;
