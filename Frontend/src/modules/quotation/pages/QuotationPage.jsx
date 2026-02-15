import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BoardProductTable from "./quotation-components/tables/BoardProductTable";
import LetterProductTable from "./quotation-components/tables/LetterProductTable";
import BoardLetterProductTable from "./quotation-components/tables/BoardLetterProductTable";
import { toast } from "react-toastify";

const sampleLetterTable = {
  rows: [
    {
      sNo: "01",
      productCode: "L-12345",
      productName: "Acrylic Letters",
      productDescription: "Laser cut acrylic letters",
      letters: "A,B,C",
      thickness: "5",
      length: "12",
      height: "8",
      quantity: "10",
      rate: "50",
      amount: "5000",
      lsp: "1000",
    },
    {
      sNo: "02",
      productCode: "L-67890",
      productName: "Metal Letters",
      productDescription: "Stainless steel letters",
      letters: "D,E,F",
      thickness: "8",
      length: "10",
      height: "6",
      quantity: "5",
      rate: "80",
      amount: "4000",
      lsp: "800",
    },
    {
      sNo: "02",
      productCode: "L-67890",
      productName: "Metal Letters",
      productDescription: "Stainless steel letters",
      letters: "D,E,F",
      thickness: "8",
      length: "10",
      height: "6",
      quantity: "5",
      rate: "80",
      amount: "4000",
      lsp: "800",
    },
  ],
};

const QuotationPage = () => {
  const handleSubmit = () => {
    if (!declaration) {
      toast.error("Please accept the declaration before submitting");
      return;
    }

    if (isManager && !managerStatus) {
      toast.error("Please select manager decision");
      return;
    }

    const payload = {
      step: currentStep,
      user: {
        id: userData?._id,
        name: userData?.name,
        designation: userDesignation,
      },
      quotation: {
        products: {
          board: "BoardProductTable data here",
          letter: sampleLetterTable,
          boardLetter: "BoardLetterProductTable data here",
        },
      },
      siteVerification: {
        executiveChecklist: checklist,
        managerChecklist: isManager ? managerChecklist : [],
        managerDecision: isManager ? managerStatus : null,
        declarationAccepted: declaration,
      },
      submittedAt: new Date().toISOString(),
    };

    console.log("===== QUOTATION SUBMIT DATA =====");
    console.log(payload);

    toast.success("Quotation submitted successfully!");

    // optional: next step / redirect
    // navigate("/sales");
  };

  const navigate = useNavigate();
  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;
  const userDesignation = userData?.designation?.title?.trim()?.toLowerCase();
  const isManager = userDesignation === "manager";
  console.log("User Designation:", userDesignation, "Is Manager:", isManager);
  console.log("User Data:", userData);

  const [currentStep, setCurrentStep] = useState(1);
  const [declaration, setDeclaration] = useState(false);
  const [managerStatus, setManagerStatus] = useState("");

  const [checklist, setChecklist] = useState([
    {
      id: 1,
      name: "Final Quotation Issued",
      checked: true,
      completedAt: "10:30 AM",
      completedBy: "Rahul Singh",
    },
    {
      id: 2,
      name: "Cost Breakdown  included",
      checked: true,
      completedAt: "10:35 AM",
      completedBy: "Rahul Singh",
    },
    {
      id: 3,
      name: "Payment Terms Stated",
      checked: true,
      completedAt: "10:40 AM",
      completedBy: "Rahul Singh",
    },
    {
      id: 4,
      name: "Delivery Timeline stated",
      checked: false,
      completedAt: null,
      completedBy: null,
    },
  ]);
  const [managerChecklist, setManagerChecklist] = useState([
    {
      id: 1,
      name: "Final Quotation Issued",
      checked: false,
      verifiedAt: null,
      verifiedBy: null,
    },
    {
      id: 2,
      name: "Cost Breakdown  included",
      checked: false,
      verifiedAt: null,
      verifiedBy: null,
    },
    {
      id: 3,
      name: "Payment Terms Stated",
      checked: false,
      verifiedAt: null,
      verifiedBy: null,
    },
    {
      id: 4,
      name: "Delivery Timeline stated",
      checked: false,
      verifiedAt: null,
      verifiedBy: null,
    },
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
              completedAt: !item.checked
                ? new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
              completedBy: !item.checked ? "Rahul Singh" : null,
            }
          : item,
      ),
    );
  };

  const toggleManagerChecklistItem = (id) => {
    setManagerChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
              verifiedAt: !item.checked
                ? new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
              verifiedBy: !item.checked ? userData?.name || "Manager" : null,
            }
          : item,
      ),
    );
  };

  return (
    <div className="pb-10">
      {/* ================= STEP 1 ================= */}
      {currentStep === 1 && (
        <>
          {/* HEADER */}
          <div className="flex justify-between mb-6 bg-white p-3 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
              >
                <ArrowLeft size={20} className="text-gray-800" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Quotation</h1>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 border rounded text-sm cursor-pointer">
                Saved as Draft
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm cursor-pointer">
                Print
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm cursor-pointer">
                Download PDF
              </button>
            </div>
          </div>

          {/* INVOICE PAPER */}
          <div className="max-w-full bg-white shadow-lg mb-8 border">
            {/* TOP */}
            <div className="flex justify-between p-6 items-start mb-10 border-b pb-6">
              <div>
                <img src="/dss_logo.webp" alt="Logo" className="w-44 mb-4" />
                <h1 className="text-blue-600 font-bold text-2xl">
                  Digital Signage Solutions PVT. LTD.
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Lucknow, Uttar Pradesh 226028
                </p>
              </div>

              <div className="text-right">
                <h2 className="text-blue-600 font-bold text-xl">TAX INVOICE</h2>
                <p className="text-sm text-gray-600 mt-1">Invoice #: INV-175</p>
              </div>
            </div>

            {/* ================= BILLING & PROJECT DETAILS ================= */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="text-white text-sm font-semibold tracking-wide uppercase">
                  Billing & Project Details
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                {/* LEFT */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase">
                      Client Name
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      Abusoac Singh
                    </p>
                    <p className="text-sm text-gray-600">Abcxyz Pvt Ltd</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[11px] text-gray-500 uppercase">
                        Client Code
                      </p>
                      <p className="font-medium text-gray-800">CL-2981</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 uppercase">
                        Project Code
                      </p>
                      <p className="font-medium text-gray-800">PR-87432</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500 uppercase">
                      Billing Address
                    </p>
                    <p className="text-sm text-gray-700">
                      Abc Nagar, Lucknow, Uttar Pradesh
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 border">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Invoice No</span>
                    <span className="font-semibold text-gray-800">INV-175</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Invoice Date</span>
                    <span className="font-semibold text-gray-800">
                      24 Oct 2025
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Date</span>
                    <span className="font-semibold text-gray-800">
                      25 Oct 2025
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">
                      client@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="max-w-[1400px] mx-auto bg-white p-8 border shadow">
            <BoardProductTable showRemove={false} showBorder={false} />
            <LetterProductTable
              table={sampleLetterTable}
              showRemove={false}
              showBorder={false}
            />
            <BoardLetterProductTable showRemove={false} showBorder={false} />

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {currentStep === 2 && (
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">
                Site Verification
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Complete checklist and submit
              </p>
            </div>

            {/* Executive Checklist - Full Width */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm text-gray-900">
                    Executive Checklist
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Completed by Rahul Singh • Today at 11:05 AM
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {checklist.filter((i) => i.checked).length}/
                    {checklist.length} Completed
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        relative border rounded-lg p-4 min-h-[140px] transition-all
                        ${item.checked ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200 bg-white"}
                        ${isManager ? "opacity-50" : "hover:shadow-md"}
                      `}
                    >
                      {/* Checkbox */}
                      <div className="flex items-start justify-end mb-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          disabled={isManager}
                          onChange={() =>
                            !isManager && toggleChecklistItem(item.id)
                          }
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>

                      {/* Item Name */}
                      <span className="text-sm text-gray-900 font-medium block mb-2">
                        {item.name}
                      </span>

                      {/* Completion Info */}
                      {item.checked ? (
                        <div className="mt-2 pt-2 border-t border-green-200">
                          <p className="text-xs text-green-700 font-medium">
                            ✓ Completed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.completedAt}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-400">Pending</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Manager Section */}
            {isManager && (
              <>
                {/* Manager Checklist - Full Width */}
                <div className="bg-white rounded-lg border border-gray-200 mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-sm text-gray-900">
                        Manager Checklist
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Verify executive submissions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {managerChecklist.filter((i) => i.checked).length}/
                        {managerChecklist.length} Verified
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-4">
                      {managerChecklist.map((item) => (
                        <div
                          key={`manager-${item.id}`}
                          className={`
                            relative border rounded-lg p-4 min-h-[140px] transition-all
                            ${item.checked ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 bg-white"}
                            hover:shadow-md
                          `}
                        >
                          {/* Checkbox */}
                          <div className="flex items-start justify-end mb-3">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() =>
                                toggleManagerChecklistItem(item.id)
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                          </div>

                          {/* Item Name */}
                          <span className="text-sm text-gray-900 font-medium block mb-2">
                            {item.name}
                          </span>

                          {/* Verification Info */}
                          {item.checked ? (
                            <div className="mt-2 pt-2 border-t border-blue-200">
                              <p className="text-xs text-blue-700 font-medium">
                                ✓ Verified
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.verifiedAt}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-400">
                                To be verified
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Manager Decision */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Manager Decision
                    </span>
                    <select
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
                      value={managerStatus}
                      onChange={(e) => setManagerStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="approved">Approved</option>
                      <option value="modification">Modification</option>
                      <option value="flag-raised">Flag Raised</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {/* Declaration */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="mt-0.5 w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  I declare that all site details are accurate.
                </span>
              </label>
            </div>

            {/* Submission Summary - Bottom Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-900">
                  Submission Summary
                </h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-6">
                  {/* Info Section */}
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-gray-500">Executive</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Rahul Singh
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Branch</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Chinhat
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        11/07/25 – 11:00 AM
                      </p>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex gap-3 ml-auto">
                    <button
                      className="
                  py-2.5 px-6 text-sm font-semibold
                  bg-white text-gray-700 border border-gray-300 rounded-lg
                  hover:bg-gray-50
                  transition-colors
                "
                    >
                      Save Draft
                    </button>

                    <button
                      disabled={!declaration}
                      onClick={handleSubmit}
                      className="
    py-2.5 px-6 text-sm font-semibold
    bg-green-600 text-white rounded-lg
    hover:bg-green-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  "
                    >
                      Send to Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationPage;
