import { ArrowLeft, Eye, ChevronDown, AlertCircle, Filter, Layers, User } from "lucide-react";
import Table from "@/components/Table"; // Adjust path if needed
import { useState } from "react";



export default function ProductionDepartmentPage() {

  // 1. Mock Data matching the Production Department Screenshot
  const [data] = useState([
    {
      id: 1,
      productName: "Flex Sign Board",
      projectName: "Flex Sign Board",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      productionExecutive: "Anil Singh",
      subDepartment: "Fabrication - Donw", // Kept typo as per screenshot
      urgency: "High",
      priority: 1,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
    },
    {
      id: 2,
      productName: "Vinyl Cut Signage",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      productionExecutive: "Aman",
      subDepartment: "Printing - Done",
      urgency: "High",
      priority: 2,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
    },
    {
      id: 3,
      productName: "Acrylic Sign Board",
      projectName: "Acrylic Sign Board",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      productionExecutive: "Aman",
      subDepartment: "Machine Work - Done",
      urgency: "Low",
      priority: 3,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
    },
    {
      id: 4,
      productName: "Acrylic Sign Board",
      projectName: "Vinyl Cut Signage",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      productionExecutive: "Anil Singh",
      subDepartment: "Printing - Pending",
      urgency: "Low",
      priority: 4,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
    },
    {
      id: 5,
      productName: "Vinyl Cut Signage",
      projectName: "Glow Sign Board",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      productionExecutive: "Anil Singh",
      subDepartment: "Fabrication - Done",
      urgency: "High",
      priority: 5,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
    },
    {
      id: 6,
      productName: "Vinyl Cut Signage",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      productionExecutive: "Aman",
      subDepartment: "Machine Work - Done",
      urgency: "Low",
      priority: 6,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
    },
  ]);

  // 2. Column Configuration
  const columnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <button
          className="bg-[#2563EB] hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
          onClick={() => setOpenPlanningLogId(row.id)}
        >
          <Eye size={16} />
        </button>
      ),
    },
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },
    coordinator: { label: "Project Co- Ordinator" },

    // Type of Work Badge
    typeOfWork: {
      label: "Type of work",
      render: (value) => (
        <span className="px-3 py-1 rounded text-xs font-medium whitespace-nowrap bg-[#E6F0FF] text-[#2563EB]">
          {value}
        </span>
      ),
    },

    productionExecutive: { label: "Production Executive" },

    // Sub-Department Column with specific color logic
    subDepartment: {
      label: "Sub -Department",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        // Logic to match the colors in the screenshot
        if (value.toLowerCase().includes("fabrication"))
          styles = "bg-[#FEF2F2] text-[#B91C1C]"; // Redish
        if (value.toLowerCase().includes("printing"))
          styles = "bg-[#FFF7ED] text-[#C2410C]"; // Orange/Yellowish
        if (value.toLowerCase().includes("machine work"))
          styles = "bg-[#E6F0FF] text-[#2563EB]"; // Blueish

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },

    urgency: {
      label: "Urgency",
      render: (value) => {
        const isHigh = value === "High";
        return (
          <span
            className={`px-3 py-1 rounded text-white text-xs font-medium ${isHigh ? "bg-[#C92A2A]" : "bg-[#2563EB]"
              }`}
          >
            {value}
          </span>
        );
      },
    },

    priority: { label: "Priority" },

    deadline: { label: "Production Deadline" },

    completionDate: { label: "Completion Date" },
  };


  // 2.1. Mock Data matching the PR Department Screenshot
  const [waitingData] = useState([
    {
      id: 1,
      department: "PR",
      waitingInDate: "Nov 15, 2024 - 10:00 AM",
      lastInteraction: "Nov 15, 2024 - 10:00 AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 minutes",
      status: "Hold by Client",
      priority: "1",
      leadType: "Hot",
    },
    {
      id: 2,
      department: "PR",
      waitingInDate: "Nov 15, 2024 - 10:00 AM",
      lastInteraction: "Nov 15, 2024 - 10:00 AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 minutes",
      status: "Hold by Company",
      priority: "1",
      leadType: "Warm",
    },
    {
      id: 3,
      department: "PR",
      waitingInDate: "Nov 15, 2024 - 10:00 AM",
      lastInteraction: "Nov 15, 2024 - 10:00 AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 minutes",
      status: "Hold by Client",
      priority: "1",
      leadType: "Cold",
    },
    {
      id: 4,
      department: "PR",
      waitingInDate: "Nov 15, 2024 - 10:00 AM",
      lastInteraction: "Nov 15, 2024 - 10:00 AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 minutes",
      status: "Hold by Client",
      priority: "1",
      leadType: "Hot",
    },
    {
      id: 5,
      department: "PR",
      waitingInDate: "Nov 15, 2024 - 10:00 AM",
      lastInteraction: "Nov 15, 2024 - 10:00 AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 minutes",
      status: "Hold by Client",
      priority: "1",
      leadType: "Hot",
    }
  ]);

  // 2.2. Column Configuration
  const waitingColumnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <button
          className="bg-[#2563EB] hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
          onClick={() => setOpenPlanningLogId(row.id)}
        >
          <Eye size={16} />
        </button>
      ),
    },
    status: {
      label: "Status",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Hold by Client") styles = "bg-[#C92A2A] text-white";
        if (value === "Hold by Company") styles = "bg-[#2563EB] text-white";

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    department: { label: "Department" },
    waitingInDate: { label: "Waiting In Date" },
    lastInteraction: { label: "Last Interaction" },
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },
    waitingTime: { label: "Waiting Time" },
    priority: { label: "Priority" },
    leadType: {
      label: "Lead Type",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value == "Hot") styles = "bg-red-100 text-red-600"
        if (value == "Warm") styles = "bg-orange-100 text-orange-600"
        if (value == "Cold") styles = "bg-blue-100 text-blue-600"

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowarp ${styles}`}
          >{value}</span>
        )

      }

    },
  };


   const handlePrint = () => {
    window.print(); // Triggers the browser's print dialog
  };


  return (
    <div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Production Department
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AlertCircle size={16} /> Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Filter size={16} /> Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Layers size={16} /> Sub Department
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={data} columnConfig={columnConfig} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 mb-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Waiting Works</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AlertCircle size={16} /> Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Filter size={16} /> Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Production Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={waitingData} columnConfig={waitingColumnConfig} />

    </div>
  );
}
