import React from "react";
import {
  Eye,
  X,
  Check,
  Calendar,
  Flag,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";

const PossibeRecce = () => {
  const navigate = useNavigate();

  const handleStatusUpdate = () => {}; 

  const handleViewDetails = (item) => {
    navigate(`/recce/recce-details/${item.id}`);
  };

  const columnConfig = {
   
    client: { label: "Client" },
    project: { label: "Project" },
    exptProducts: { label: "Expt. Products" },
    address: {
      label: "Address",
      render: (value) => (
        <div className="text-sm whitespace-pre-line">
          {value}
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-600 border-blue-100">
          {value}
        </span>
      )
    },
    leadType: {
      label: "Lead Type",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === "Hot"
              ? "bg-red-50 text-red-600 border-red-100"
              : value === "Cold"
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : "bg-orange-50 text-orange-600 border-orange-100"
          }`}
        >
          {value}
        </span>
      )
    },
    actions: {
      label: "Actions",
      render: (value, row) => (
        <button
          className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-200 shadow-sm"
          onClick={() => handleViewDetails(row)}
          title="View Details"
        >
          <Eye size={16} strokeWidth={2} />
        </button>
      ),
    },
  };

  const formattedData = [
    {
     
      client: "GreenFields Co.",
      project: "Retails Store",
      exptProducts: "10",
      address: "24, High Street, Andheri West\nLandmark: Near Metro Gate 3\nMumbai, MH 400053",
      status: "Up Coming",
      leadType: "Hot"
    },
    {
    
      client: "AgriMart",
      project: "Mall Facade",
      exptProducts: "10",
      address: "24, High Street, Andheri West\nLandmark: Near Metro Gate 3\nMumbai, MH 400053",
      status: "Up Coming",
      leadType: "Cold"
    },
    {
     
      client: "FreshStore",
      project: "Office Branding",
      exptProducts: "10",
      address: "5th Floor, Omega Tower, MG Road\nLandmark: Next to City Bank\nBengaluru, KA 560001",
      status: "Up Coming",
      leadType: "Warm"
    },
    {
      
      client: "SunHarvest",
      project: "Retails Store Signage",
      exptProducts: "10",
      address: "Plot 12, Central Ave, Sector 18\nLandmark: Opp. Metro Station\nNoida UP 201301",
      status: "Up Coming",
      leadType: "Cold"
    },
    {
     
      client: "AgroHub",
      project: "Mall Facade",
      exptProducts: "10",
      address: "5th Floor, Omega Tower, MG Road\nLandmark: Next to City Bank\nBengaluru, KA 560001",
      status: "Up Coming",
      leadType: "Warm"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader title="Possible Recce"/>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table data={formattedData} columnConfig={columnConfig} />
        </div>
      </div>
    </div>
  );
};

export default PossibeRecce;
