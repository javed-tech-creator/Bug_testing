import React from "react";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const RecceIn = () => {
  const navigate = useNavigate();

  // ⭐ Static Dummy Data
  const recceData = [
    {
      date: "2025-11-12",
      client: "GreenFields Co.",
      project: "GF-102",
      submittedBy: "Aman Verma",
      status: "Recce In",
    },
    {
      date: "2025-11-12",
      client: "AgriMart",
      project: "AG-214",
      submittedBy: "Riya Singh",
      status: "Recce In",
    },
    {
      date: "2025-11-11",
      client: "FreshStore",
      project: "FS-331",
      submittedBy: "Neha Rao",
      status: "Recce In",
    },
    {
      date: "2025-11-10",
      client: "SunHarvest",
      project: "SH-208",
      submittedBy: "Karan Patel",
      status: "Recce In",
    },
    {
      date: "2025-11-09",
      client: "AgroHub",
      project: "AH-119",
      submittedBy: "Priya N.",
      status: "Recce In",
    },
  ];

  // ⭐ Table Columns Config
  const columnConfig = {
    date: { label: "Date" },
    client: { label: "Client" },
    project: { label: "Project" },
    submittedBy: { label: "Submitted By" },
    status: {
      label: "Status",
      render: (value) => (
        <span className="bg-orange-100 text-orange-500 text-xs px-3 py-1 rounded-lg">
          {value}
        </span>
      ),
    },
    actions: {
      label: "Actions",
      render: () => (
        <button className="bg-blue-600 p-2 rounded-md text-white mx-auto flex">
          <FaEye size={15} />
        </button>
      ),
    },
  };

  // Adding actions in data
  const tableData = recceData.map((item) => ({ ...item, actions: true }));

  return (
    <div className="p-4">
      {/* Header */}
     <PageHeader title="Recce In"/>

      {/* Table */}
      <Table data={tableData} columnConfig={columnConfig} />
    </div>
  );
};

export default RecceIn;