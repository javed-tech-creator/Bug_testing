import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Eye, Search } from "lucide-react";
import Table from "../../../components/Table"; 

const RecceTimeReport = () => {
  // 1. Mock Data matching the screenshot
  const [tableData] = useState([
    {
      id: 1,
      client: "GreenFields Co.",
      projectType: "Retails Store",
      exptProducts: 10,
      location: {
        line1: "24, High Street, Andheri West",
        landmark: "Landmark: Near Metro Gate 3",
        cityState: "Mumbai, MH 400053",
      },
      status: "Submitted",
      priority: "High",
    },
    {
      id: 2,
      client: "AgriMart",
      projectType: "Mall Facade",
      exptProducts: 10,
      location: {
        line1: "24, High Street, Andheri West",
        landmark: "Landmark: Near Metro Gate 3",
        cityState: "Mumbai, MH 400053",
      },
      status: "Submitted",
      priority: "Low",
    },
    {
      id: 3,
      client: "FreshStore",
      projectType: "Office Branding",
      exptProducts: 10,
      location: {
        line1: "5th Floor, Omega Tower, MG Road",
        landmark: "Landmark: Next to City Bank",
        cityState: "Bengaluru, KA 560001",
      },
      status: "Submitted",
      priority: "Medium",
    },
    {
      id: 4,
      client: "SunHarvest",
      projectType: "Retails Store Signage",
      exptProducts: 10,
      location: {
        line1: "Plot 12, Central Ave, Sector 18",
        landmark: "Landmark: Opp. Metro Station",
        cityState: "Noida UP 201301",
      },
      status: "Submitted",
      priority: "Low",
    },
    {
      id: 5,
      client: "AgroHub",
      projectType: "Mall Facade",
      exptProducts: 10,
      location: {
        line1: "5th Floor, Omega Tower, MG Road",
        landmark: "Landmark: Next to City Bank",
        cityState: "Bengaluru, KA 560001",
      },
      status: "Submitted",
      priority: "Medium",
    },
  ]);

  // 2. Column Configuration
  const columns = {
    client: {
      label: "Client",
      render: (val) => <span className="font-medium text-gray-900">{val}</span>,
    },
    projectType: {
      label: "Project",
    },
    exptProducts: {
      label: "Expt. Products",
    },
    // We use a custom render for Location to stack the text lines
    location: {
      label: "Project", // Second "Project" column as per image
      render: (val) => (
        <div className="text-left text-sm leading-relaxed">
          <p className="font-medium text-gray-800">{val.line1}</p>
          <p className="text-gray-500 text-xs">{val.landmark}</p>
          <p className="text-gray-500 text-xs">{val.cityState}</p>
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (val) => (
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-semibold">
          {val}
        </span>
      ),
    },
    priority: {
      label: "Priority",
      render: (val) => {
        let colorClass = "bg-gray-100 text-gray-600";
        if (val === "High") colorClass = "bg-red-100 text-red-600";
        if (val === "Medium") colorClass = "bg-orange-100 text-orange-600";
        if (val === "Low") colorClass = "bg-green-100 text-green-600";

        return (
          <span className={`${colorClass} px-3 py-1 rounded-md text-xs font-semibold`}>
            {val}
          </span>
        );
      },
    },
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition">
            <Eye size={16} />
          </button>
          <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-100 transition border border-blue-200">
            Recce Report
          </button>
        </div>
      ),
    },
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Title & Back Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Submitted Recce Time Report
            </h1>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
                {/* Note: Your Table component has internal search via DataTables, 
                    but this matches the visual search bar in the screenshot */}
              {/* <input
                type="text"
                placeholder="Search here.."
                className="w-full bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 transition"
              /> */}
            </div>

            {/* Date Dropdown */}
            <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition">
              Date <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div>
        <Table 
            data={tableData} 
            columnConfig={columns} 
        />
      </div>
    </div>
  );
};

export default RecceTimeReport;