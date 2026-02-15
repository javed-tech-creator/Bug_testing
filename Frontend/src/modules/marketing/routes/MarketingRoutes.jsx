import { Routes, Route } from "react-router-dom";
import MarketLogin from "../pages/login/MarketLogin";
import MarketingLayouts from "../layouts/MarketingLayouts";
import MarketingDashboard from "../pages/dashboard/MarketingDashboard";
import PageNotFound from "@/pages/PageNotFound";
import CampaignManagement from "../pages/campaign-management/CampaignManagement";
import CampaignAddForm from "../pages/campaign-management/CampaignAddForm";
import LeadGenerationlist from "../pages/lead-generation-capture/LeadGenerationlist";
import Analytics from "../pages/analytics-roi-tracking/Analytics";
import ReferralMarketingPage from "../pages/referral-partner-marketing/ReferralMarketingPage";
import BrandingContentRepository from "../pages/branding-content-repo/BrandingContentRepository";
import PrivateRoutes from "./PrivateRoutes";
import ReferralForm from "../pages/referral-partner-marketing/ReferralForm";


const MarketingRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<MarketLogin />} />

            <Route element={<PrivateRoutes />}> 
      <Route element={<MarketingLayouts />}>
        <Route path="dashboard" element={<MarketingDashboard />} />
        <Route path="campaigns" element={<CampaignManagement />} />
        <Route path="campaigns/form" element={<CampaignAddForm />} />
        <Route path="lead-generation" element={<LeadGenerationlist />} />
        <Route path="analytics-roi-tracking" element={<Analytics />} />
        <Route path="referrals" element={<ReferralMarketingPage />} />
        <Route path="referrals/form" element={<ReferralForm />} />
        <Route path="branding" element={<BrandingContentRepository />} />

        <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
      
    </Routes>
  );
};

export default MarketingRoutes;
