import React from "react";
import ClientsTable from "./ClientsTable";

const sampleData = [
  {
    client: "Abc",
    project: "xyz",
    total_products: 15,
    source: "Website",
    lead_type: "Hot",
    amount: "12,000",
    department: "Clients",
  },
  {
    client: "xyz",
    project: "Abc",
    total_products: 10,
    source: "Referral",
    lead_type: "Warm",
    amount: "1,10,000",
    department: "Clients",
  },
  {
    client: "Abc",
    project: "xyz",
    total_products: 15,
    source: "Website",
    lead_type: "Hot",
    amount: "12,000",
    department: "Franchise's",
  },
  {
    client: "xyz",
    project: "Abc",
    total_products: 10,
    source: "Referral",
    lead_type: "Warm",
    amount: "1,10,000",
    department: "Franchise's",
  },
];

const ClientsPage = ({ selectedDepartment }) => {
  const filteredData = selectedDepartment
    ? sampleData.filter((d) => d.department === selectedDepartment)
    : sampleData;
  const formattedTitle =
    selectedDepartment === "Business Associate's"
      ? "Business Associates"
      : selectedDepartment === "Franchise's"
      ? "Franchises"
      : selectedDepartment || "Clients";
  return (
    <div className="p-4 space-y-4">
      {/* Header + Filters Layout */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">{formattedTitle}</h2>

        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
        />

        <div className="flex gap-3 flex-wrap">
          <select className="border px-3 py-2 rounded-md">
            <option>All</option>
          </select>
          <select className="border px-3 py-2 rounded-md">
            <option>Client Type</option>
          </select>
          <select className="border px-3 py-2 rounded-md">
            <option>Created By</option>
          </select>
          <select className="border px-3 py-2 rounded-md">
            <option>Lead Source</option>
          </select>
          <select className="border px-3 py-2 rounded-md">
            <option>Lead Status</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <ClientsTable data={filteredData} />
    </div>
  );
};

export default ClientsPage;
