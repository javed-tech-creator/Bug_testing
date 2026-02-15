import { Routes, Route } from "react-router-dom";
import ClientLogin from "../pages/login/ClientLogin";
import ClientLayouts from "../layouts/ClientLayouts";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import PageNotFound from "@/pages/PageNotFound";
import ProjectList from "../pages/projectlist/ProjectList";
import ProjectOverview from "../pages/projectlist/project-view/ProjectOverview";
import SalesDetails from "../pages/projectlist/project-modules/SalesDetails";
import DesignDetails from "../pages/projectlist/project-modules/DesignDetails";
import RecceDetails from "../pages/projectlist/project-modules/RecceDetails";
import MockupDetails from "../pages/projectlist/project-modules/MockupDetails";
import ProductionDetails  from "../pages/projectlist/project-modules/ProductionDetails";
import InstallationDetails  from "../pages/projectlist/project-modules/InstallationDetails";
import QuotationDetails  from "../pages/projectlist/project-modules/QuotationDetails";
import Payments from "../pages/payments/Payments";
import Documents from "../pages/documents/Documents";
import Discussions from "../pages/discussions/Discussions";
import RaisedConcern from "../pages/raised-concern/RaisedConcern";
import UserAccess from "../pages/access-controls/UserAccess";
import SalesPage from "../pages/sectionpages/SalesPage";
import ReccePage from "../pages/sectionpages/ReccePage";
import DesignPage from "../pages/sectionpages/DesignPage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<ClientLogin />} />

      <Route element={<ClientLayouts />}>
        <Route path="dashboard" element={<ClientDashboard />} />

        <Route path="project-list" element={<ProjectList />} />
        <Route path="project-list/project/24" element={<ProjectOverview />} />
        <Route path="project-list/project/24/sales" element={<SalesDetails />} />
        <Route path="project-list/project/24/recce" element={<RecceDetails />} />
        <Route path="project-list/project/24/design" element={<DesignDetails />} />
        <Route path="project-list/project/24/mockup" element={<MockupDetails />} />
        <Route path="project-list/project/24/production" element={<ProductionDetails  />} />
        <Route path="project-list/project/24/installation" element={<InstallationDetails  />} />
        <Route path="project-list/project/24/quotation" element={<QuotationDetails  />} />

        <Route path="payments" element={<Payments />} />
        <Route path="documents" element={<Documents />} />
        <Route path="discussions" element={<Discussions />} />
        <Route path="raised-concern" element={<RaisedConcern />} />
        <Route path="access-controls" element={<UserAccess />} />
        {/* <Route path="project-list-view/:id" element={<ProjectListViewDetails />} />
        <Route path="project-list-view-sales/:id" element={<SalesPage />} />
        <Route path="project-list-view-recce/:id" element={<ReccePage />} /> 
        <Route path="project-list-view-design/:id" element={<DesignPage />} /> */}

        {/* Empanelment End  */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
