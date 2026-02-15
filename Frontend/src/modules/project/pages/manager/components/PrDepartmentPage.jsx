import { ArrowLeft, Eye, ChevronDown, AlertCircle, Filter, User } from "lucide-react";
import Table from "@/components/Table"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function PrDepartmentPage() {
  const navigate = useNavigate();

  // 1. Mock Data matching the PR Department Screenshot
  const [data] = useState([
    {
      id: 1,
      productName: "Abc Board",
      projectName: "Flex Sign Board",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      designExecutive: "SHOBHA",
      urgency: "High",
      priority: 1,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 2,
      productName: "Xyz Signage",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      designExecutive: "UZMA",
      urgency: "High",
      priority: 2,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 3,
      productName: "Abc Board",
      projectName: "Acrylic Sign Board",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      designExecutive: "SHOBHA",
      urgency: "Low",
      priority: 3,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
    },
    {
      id: 4,
      productName: "Xyz Signage",
      projectName: "Vinyl Cut Signage",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      designExecutive: "UZMA",
      urgency: "Low",
      priority: 4,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
    },
    {
      id: 5,
      productName: "Abc Board",
      projectName: "Glow Sign Board",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      designExecutive: "SHOBHA",
      urgency: "High",
      priority: 5,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
    },
    {
      id: 6,
      productName: "Xyz Signage",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      typeOfWork: "New",
      designExecutive: "UZMA",
      urgency: "Low",
      priority: 6,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
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
    status: {
      label: "Status",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Pending") styles = "bg-[#FFF8E6] text-[#D97706]";
        if (value === "Completed") styles = "bg-[#ECFDF5] text-[#10B981]";

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },
    coordinator: { label: "Project Co- Ordinator" },

    // Custom Render for 'Type of Work' badges (All 'New' in this screenshot)
    typeOfWork: {
      label: "Type of work",
      render: (value) => {
        // Defaulting to blue for 'New' as seen in screenshot
        const styles = "bg-[#E6F0FF] text-[#2563EB]";

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },

    designExecutive: { label: "Design Executive" },

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

    deadline: { label: "Design Deadline" },

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
    leadType: { label: "Lead Type",
      render:(value)=>{
        let styles = "bg-gray-100 text-gray-600";
        if(value == "Hot") styles = "bg-red-100 text-red-600"
        if(value == "Warm") styles= "bg-orange-100 text-orange-600"
        if(value == "Cold") styles= "bg-blue-100 text-blue-600"

        return(
          <span
          className={`px-3 py-1 rounded text-xs font-medium whitespace-nowarp ${styles}`}
          >{value}</span>
        )

      }

     },
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
          <h1 className="text-xl font-bold text-gray-900">PR Department</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AlertCircle size={16} /> Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Filter size={16} /> Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Design Executive
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
            <User size={16} /> Design Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={waitingData} columnConfig={waitingColumnConfig} />



    </div>
  );
}
