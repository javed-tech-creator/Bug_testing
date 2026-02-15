// InvoiceGenerator.jsx
import React, { useEffect, useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { BranchSelector } from "../components/ProductSelector";
import BillingApp from "../components/BillingApp";
import AddCustomerDrawer from "../components/generateInvoice/AddCustomerDrawer";
import { useGetNextInvoiceNumberQuery } from "@/api/vendor/invoice.api";


export default function GenerateInvoice() {


const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`; // "2025-08-18"
// console.log("formattedDate", formattedDate)
const [invoiceDate, setInvoiceDate] = useState(formattedDate);
  const [dueDate, setDueDate] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  
  const { data: nextInvoiceData, isLoading: isInvoiceNumLoading,refetch } = useGetNextInvoiceNumberQuery();
 

//   const location = useLocation();
// const { draftId } = location.state || {};

const [invoiceNumber, setInvoiceNumber] = useState("");

useEffect(() => {
  if (nextInvoiceData?.previewInvoiceId) {
    setInvoiceNumber(nextInvoiceData.previewInvoiceId);
  }
}, [nextInvoiceData]);

  return (
    <>
    <div className=" font-poppins">
   <div className="w-full rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-[1px] shadow mb-4 print:hidden">
  <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
      {/* Title and Business Name */}
      <div className="flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FaFileInvoice className="w-6 h-6 text-orange-500" />
          <span>Create Invoice</span>
        </h2>
        {/* <span className="text-sm text-gray-500 mt-0.5">YOUR BUSINESS NAME</span> */}
      </div>

      {/* Invoice Number Box */}
    <div className="ml-auto flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
  <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 border-r border-gray-300">
    INV-
  </span>

  {invoiceNumber ? (
    <span className="px-3 py-1 text-sm font-semibold text-gray-800">
      {invoiceNumber.replace("INV-", "")}
    </span>
  ) : (
    <span className="px-3 py-1 text-sm text-gray-400 animate-pulse">
      Loading...
    </span>
  )}
</div>
    </div>
  </div>
</div>


<div className="bg-white border border-gray-200 rounded-xl shadow p-3  sm:p-4  space-y-4">
  {/* Top Label + Add Customer */}
  <div className="flex items-center gap-5 mb-1">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
      Customer Details
      <span className="text-gray-400 cursor-help" title="Choose an existing customer or add a new one.">?</span>
    </label>
    <button
      onClick={() => setShowCustomerModal(true)}
      className="flex items-center text-sm font-medium text-orange-500 cursor-pointer hover:underline"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Add New Customer?
    </button>
  </div>

  {/* Branch Selector and Date Pickers */}
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Branch Selector */}
    <div className="w-full sm:w-1/2">
      <BranchSelector
        selectedBranchId={selectedBranchId}
        setSelectedBranchId={setSelectedBranchId}
      />
    </div>

{/* Date Inputs */}
<div className="w-full sm:flex-1">
  <div className="bg-blue-50 border border-gray-200 rounded-xl shadow px-4 py-4 space-y-4">
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Invoice Date */}
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Invoice Date
        </label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="border bg-white border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col w-full sm:w-1/2 relative ">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          Due Date
          <span className="group relative cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 011.5 0v.25a.75.75 0 01-1.5 0v-.25zm0-6a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0V6.75z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
              Select when payment is due
            </div>
          </span>
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border bg-white border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
</div>


  </div>



      <BillingApp 
        dueDate={dueDate}
        setDueDate={setDueDate}
         invoiceDate={invoiceDate}
         setInvoiceDate={setInvoiceDate}
         selectedBranchId={selectedBranchId}
         setSelectedBranchId={setSelectedBranchId}
         refetch={refetch}
     
         />
</div>
    </div>


  {/* Right Drawer Modal */}
      <AddCustomerDrawer
        show={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      
      />
    </>
  );
}
