import React, { useState } from "react";
import Header from "./components/Header";
import LeadStats from "./components/LeadStats";
import ClientsPage from "./components/ClientsPage";
import BusinessPipelineFunnel from "./components/BusinessPipelineFunnel";
import OrganizationCharts from "./components/OrganizationCharts";


const FunnelSalesDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("Clients");
  return (
    <div className="space-y-6 mt-6">
      <Header />
      <LeadStats />
      <BusinessPipelineFunnel />
      <OrganizationCharts onDepartmentSelect={setSelectedDepartment} />
      <ClientsPage selectedDepartment={selectedDepartment} />
    </div>
  );
};

export default FunnelSalesDashboard;
