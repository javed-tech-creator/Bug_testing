import React from "react";
import { ArrowLeft } from "lucide-react";
import Table from "./../../../components/Table"; 
import PageHeader from "@/components/PageHeader";

const RecceReportProjectWise = () => {
  // --- 1. DATA: Top Table (General) ---
  const generalData = [
    { id: 1, dept: "Recce", activity: "Project Received - Project Allocated", category: "Waiting Time", attempts: "01", start: "", end: "", time: "" },
    { id: 2, dept: "Recce", activity: "Recce In - Recce Out / Office Out", category: "Travel Time", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 3, dept: "Recce", activity: "Client Met - Recce In", category: "Unknow Time", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 4, dept: "Recce", activity: "Raw Recce Started - Client Met", category: "Work Time", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 5, dept: "Recce", activity: "Raw Recce Filled - Raw Recce Started", category: "Turn Around Time", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 6, dept: "Recce", activity: "Product Count Done - Raw Recce Filled", category: "", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
  ];

  // --- 2. DATA: Bottom Table (Total) ---
  const totalData = [
    { id: 8, dept: "Recce", activity: "All Products Recce From Filled - Recce Form Started", category: "", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 9, dept: "Recce", activity: "Recce Submitted - Recce Form Filled", category: "", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 10, dept: "Recce", activity: "Recce Flag Raised Type List(If Any)", category: "", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
    { id: 11, dept: "Recce", activity: "Recce Done - Recce In", category: "", attempts: "01", start: "11/12/25-11:00AM", end: "11/12/25-1:00PM", time: "3 hrs." },
  ];

  // --- 3. CONFIG: Columns for your Reusable Table ---
  const standardColumns = {
    dept: { label: "Department" },
    activity: { label: "Work Activity", render: (val) => <span className="text-gray-900">{val}</span> },
    category: { 
      label: "Time Category", 
      render: (val) => {
        let color = "text-gray-500";
        if (val?.includes("Waiting")) color = "text-yellow-500";
        if (val?.includes("Travel")) color = "text-purple-600";
        if (val?.includes("Unknow")) color = "text-blue-500"; 
        if (val?.includes("Work")) color = "text-green-600";
        if (val?.includes("Turn Around")) color = "text-orange-500";
        return <span className={`${color} font-medium flex items-center gap-1`}>{val} {val && "▼"}</span>;
      }
    },
    attempts: { label: "No. Of Attempts" },
    start: { label: "Start Time" },
    end: { label: "End Time" },
    time: { label: "Time Taken" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-sm">
      {/* --- Header Section --- */}
      

      <PageHeader title="Recce Report (Project Wise)"/>

      {/* --- SECTION 1: Top Standard Table --- */}
      <div className="mb-8 bg-white border border-gray-300 rounded overflow-hidden">
        <Table data={generalData} columnConfig={standardColumns} />
      </div>

      {/* --- SECTION 2: Project Form Filling --- */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">07- Project Form Filling (Product Wise)</h2>
        
        {/* Product 1 */}
        <div className="bg-white border border-gray-400 mb-6 shadow-sm">
          <ProductHeader title="Product - 1" />
          <ProductTable showNested={true} />
        </div>

        {/* Product 2 */}
        <div className="bg-white border border-gray-400 mb-6 shadow-sm">
          <ProductHeader title="Product - 2" />
          <ProductTable showNested={true} />
        </div>
      </div>

      {/* --- SECTION 3: Bottom Total Table --- */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Form Filled (Total)</h2>
        <div className="bg-white border border-gray-300 rounded overflow-hidden">
          {/* FIX IS HERE: Changed totalFormData to totalData */}
          <Table data={totalData} columnConfig={standardColumns} />
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: The Header Strip for Products ---
const ProductHeader = ({ title }) => (
  <div className="flex flex-wrap items-center border-b border-gray-400 bg-white p-2 text-xs md:text-sm text-gray-800">
    <div className="font-bold text-base pr-4 mr-4 border-r border-gray-300">{title}</div>
    <div className="pr-4 mr-4 border-r border-gray-300 font-medium">Dept - Recce</div>
    <div className="pr-4 mr-4 border-r border-gray-300">
      Time Category - <span className="text-yellow-500 font-bold">Waiting Time ▼</span>
    </div>
    <div className="pr-4 mr-4 border-r border-gray-300 font-bold">No. Of Attempts - 01</div>
    <div className="pr-4 mr-4 border-r border-gray-300">Start Time - 11/12/25-11:00AM</div>
    <div className="pr-4 mr-4 border-r border-gray-300">End Time - 11/12/25-1:00PM</div>
    <div className="font-bold">Time Taken - 3 hrs.</div>
  </div>
);

// --- SUB-COMPONENT: Custom Table for Complex Nested Layout ---
const ProductTable = ({ showNested }) => {
  const rows = [
    "Environmental Condition",
    "Product Requirement (Details)",
    "Visual Documentation - Images",
    "Visual Documentation - Videos",
    "Installation Details",
    "Data From Client", // Index 5 - Special Row
    "Instructions or Remarks"
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm text-gray-700">
        <thead className="bg-[#333333] text-white text-xs uppercase font-semibold">
          <tr>
            <th className="p-2 border-r border-gray-500 w-12 text-center">S.No</th>
            <th className="p-2 border-r border-gray-500 w-24">Department</th>
            <th className="p-2 border-r border-gray-500 w-1/3">Work Activity</th>
            <th className="p-2 border-r border-gray-500">Time Category</th>
            <th className="p-2 border-r border-gray-500 w-32">No. Of Attempts</th>
            <th className="p-2 border-r border-gray-500 w-40">Start Time</th>
            <th className="p-2 border-r border-gray-500 w-40">End Time</th>
            <th className="p-2 w-32">Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((activity, idx) => {
            const isDataRow = idx === 5 && showNested; // The row with the nested table
            return (
              <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-2 border-r border-gray-300 text-center">{`0${idx + 1}`}</td>
                <td className="p-2 border-r border-gray-300">Recce</td>
                <td className="p-2 border-r border-gray-300">{activity}</td>
                <td className="p-2 border-r border-gray-300"></td>
                <td className="p-2 border-r border-gray-300 align-middle">
                  {isDataRow ? "02" : "01"}
                </td>

                {/* --- COMPLEX ROW LOGIC --- */}
                {isDataRow ? (
                  <td colSpan="3" className="p-0 border-l border-gray-300">
                    {/* NESTED MINI TABLE */}
                    <table className="w-full h-full text-xs">
                      <thead className="bg-[#1a1a1a] text-white">
                        <tr>
                          <th className="p-2 border-r border-gray-600 font-normal w-12">S.No</th>
                          <th className="p-2 border-r border-gray-600 font-normal">Start Time</th>
                          <th className="p-2 border-r border-gray-600 font-normal">End Time</th>
                          <th className="p-2 font-normal">Time Taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-300">
                          <td className="p-2 border-r border-gray-300 bg-white text-gray-800">01</td>
                          <td className="p-2 border-r border-gray-300 bg-white text-gray-800">11/12/25-11:00AM</td>
                          <td className="p-2 border-r border-gray-300 bg-white text-gray-800">11/12/25-1:00PM</td>
                          <td className="p-2 bg-white text-gray-800">3 hrs.</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="p-2 border-r border-gray-300 bg-white text-gray-800">02</td>
                          <td className="p-2 border-r border-gray-300 bg-white text-gray-800">11/12/25-11:00AM</td>
                          <td className="p-2 border-r border-gray-300 bg-white text-gray-800">11/12/25-1:00PM</td>
                          <td className="p-2 bg-white text-gray-800">3 hrs.</td>
                        </tr>
                        <tr className="font-bold bg-white">
                          <td className="p-2 border-r border-gray-300 text-gray-900">Total</td>
                          <td className="p-2 border-r border-gray-300 text-gray-900">11/12/25-11:00AM</td>
                          <td className="p-2 border-r border-gray-300 text-gray-900">11/12/25-1:00PM</td>
                          <td className="p-2 text-gray-900">3 hrs.</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                ) : (
                  <>
                    <td className="p-2 border-r border-gray-300">11/12/25-11:00AM</td>
                    <td className="p-2 border-r border-gray-300">11/12/25-1:00PM</td>
                    <td className="p-2">3 hrs.</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecceReportProjectWise;