import React from "react";
import { Button } from "../../components/dashboard/Button";
import { StatCard } from "../../components/dashboard/StatCard";
import { ProjectCard } from "../../components/dashboard/ProjectCard";
import PendingInvoices from "../../components/dashboard/PendingInvoices";
import ActionRequired from "../../components/dashboard/ActionRequired";
import ActiveProjects from "../../components/dashboard/ActiveProjects";
import * as Icons from "lucide-react";
const stats = [
  {
    label: "Total Projects",
    value: "12",
    Icon: Icons.Briefcase,
    styles: {
      border: "border-blue-500",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
    },
  },
  {
    label: "Active Projects",
    value: "4",
    Icon: Icons.CheckCircle,
    styles: {
      border: "border-red-400",
      text: "text-red-600",
      iconBg: "bg-red-100",
      iconText: "text-red-600",
      bg: "bg-red-50",
    },
  },
  {
    label: "Pending Approvals",
    value: "2",
    Icon: Icons.Clock,
    styles: {
      border: "border-green-400",
      text: "text-green-600",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      bg: "bg-green-50",
    },
  },
  {
    label: "Completed",
    value: "8",
    Icon: Icons.IndianRupee,
    styles: {
      border: "border-orange-400",
      text: "text-orange-600",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
      bg: "bg-orange-50",
    },
  },
  { label: "Total Order Value", value: "₹26K", Icon: Icons.FileCheck },
  {
    label: "Pending Payment",
    value: "₹13K",
    warning: true,
    Icon: Icons.Briefcase,
  },
];
const ClientDashboard = () => {
  // Handler for downloading report as PDF
  const handleDownloadReport = () => {
    window.print();
  };

  // Handler for exporting data to CSV
  const handleExportData = () => {
    // Prepare CSV data
    const csvData = [
      ["Metric", "Value"],
      ...stats.map((stat) => [stat.label, stat.value]),
    ];

    // Convert to CSV string
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dashboard_data_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for printing summary
  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <div className="flex gap-3">
          <Button
            text="Download Report"
            Icon={Icons.PanelBottomClose}
            onClick={handleDownloadReport}
          />
          <Button
            text="Export Data"
            Icon={Icons.ArrowBigDownDash}
            onClick={handleExportData}
          />
          <Button
            text="Print Summary"
            Icon={Icons.Printer}
            onClick={handlePrintSummary}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      {/* Project */}
      <ProjectCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mt-7">
        {/* Left Section */}
        <div className="lg:col-span-2 h-full">
          <ActiveProjects />
        </div>

        {/* Right Section */}
        <div className="h-full">
          <ActionRequired />
        </div>
      </div>

      <PendingInvoices />
    </div>
  );
};

export default ClientDashboard;
