import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Share2,
  Info,
  CheckCircle2,
  CloudUpload,
  Hammer,
  PenTool,
  MapPin,
  ArrowUpCircle,
  Check,
} from "lucide-react";
import ConfirmEscalationModal from "../components/ConfirmEscalationModal";

const FlagResolutionPage = () => {
  const navigate = useNavigate();
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  // --- State for Form Fields ---
  const [resolutionData, setResolutionData] = useState({
    resolutionType: "Needs Escalation",
    summary:
      "Budget approval is still not received. This is blocking the material procurement. Since this has been pending for 6 days, I am escalating this back to Design team to re-verify specs while Sales chases the client.",
    actionDate: "2024-10-28",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResolutionData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="">
      {/* --- Header --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Flag Resolution</h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto cursor-pointer">
            <Printer size={16} /> Print Report
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto cursor-pointer">
            <Share2 size={16} /> Share
          </button>
        </div>
      </header>

      {/* --- Main Content Grid --- */}
      <main className="max-w-7xl mx-auto p-6  grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Details & Action) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Flag Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Info className="text-blue-600" size={20} />
              <h2 className="text-base font-bold text-gray-900">
                Flag Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {/* Project & Client */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Project
                </label>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  PRJ-2401 (Apex Towers)
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Client
                </label>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  Apex Developers Group
                </div>
              </div>

              {/* Product & Type */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Product Name
                </label>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  External Wayfinding Signage
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Flag Type
                </label>
                <div className="mt-1">
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100">
                    Red
                  </span>
                </div>
              </div>

              {/* Reason (Full Width) */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Flag Reason
                </label>
                <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                  Budget confirmation for additional LED modules pending from
                  client side. Sales team input required to proceed with
                  production PO.
                </p>
              </div>

              {/* Raised By */}
              <div className="flex items-center gap-3">
                <img
                  src="/api/placeholder/40/40"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    Raised By
                  </label>
                  <div className="text-sm font-medium text-gray-900">
                    David Miller (Production Executive)
                  </div>
                </div>
              </div>

              {/* Raised On */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Raised On
                </label>
                <div className="text-sm font-medium text-gray-900">
                  Oct 24, 2024 • 10:30 AM
                </div>
              </div>
            </div>
          </div>

          {/* 2. Resolution Action Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col h-auto">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="text-green-600" size={20} />
              <h2 className="text-base font-bold text-gray-900">
                Resolution Action
              </h2>
            </div>

            <div className="space-y-5">
              {/* Resolution Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Resolution Type
                </label>
                <input
                  type="text"
                  name="resolutionType"
                  value={resolutionData.resolutionType}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Resolution / Action Summary{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="summary"
                  rows={4}
                  value={resolutionData.summary}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Action Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Action Date
                  </label>
                  <input
                    type="date"
                    name="actionDate"
                    value={resolutionData.actionDate}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Supporting Documents
                  </label>
                  <label className="w-full p-2.5 bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center gap-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
                    <CloudUpload size={16} />
                    <span>Click to upload</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        console.log("Uploaded files:", e.target.files);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4 mt-2">
                <button
                  onClick={() => setIsEscalationOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-500 text-red-600 font-medium rounded hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <ArrowUpCircle size={18} />
                  Escalate to Previous Dept
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#4F86F7] text-white font-medium rounded hover:bg-blue-600 transition-colors shadow-sm cursor-pointer">
                  <Check size={18} />
                  Resolve Flag
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Responsibility Chain) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h2 className="text-base font-bold text-gray-900 mb-8">
              Responsibility Chain
            </h2>

            <div className="relative pl-4">
              {/* Vertical Line */}
              <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-gray-200"></div>

              {/* Step 1: Production (Current) */}
              <div className="relative  flex gap-4 mb-10">
                <div className="w-14 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md ring-4 ring-white">
                    <Hammer size={18} />
                  </div>
                </div>
                <div className="flex-1 bg-white border-2 border-blue-500 rounded-lg p-4 relative shadow-sm">
                  {/* Left arrow tip css trick */}
                  <div className="absolute top-3 -left-[7px] w-3 h-3 bg-white border-l-2 border-b-2 border-blue-500 transform rotate-45"></div>

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Production
                    </h3>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex text-xs">
                      <span className="text-gray-400 w-14">Manager</span>
                      <span className="text-gray-800 font-medium">
                        David Miller
                      </span>
                    </div>
                    <div className="flex text-xs">
                      <span className="text-gray-400 w-14">Exec</span>
                      <span className="text-gray-800 font-medium">
                        Steve K.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Design */}
              <div className="relative flex gap-4 mb-10">
                <div className="w-14 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm ring-4 ring-white">
                    <PenTool size={18} />
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">Design</h3>
                    <button
                      onClick={() => setIsEscalationOpen(true)}
                      className="text-red-600 hover:underline font-medium cursor-pointer"
                    >
                      Escalate to Previous Dept
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex text-xs">
                      <span className="text-gray-400 w-14">Manager</span>
                      <span className="text-gray-800 font-medium">
                        Jessica Pearson
                      </span>
                    </div>
                    <div className="flex text-xs">
                      <span className="text-gray-400 w-14">Exec</span>
                      <span className="text-gray-800 font-medium">
                        Mike Ross
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Recce */}
              <div className="relative flex gap-4">
                <div className="w-14 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm ring-4 ring-white">
                    <MapPin size={18} />
                  </div>
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">Recce</h3>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Passed
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex text-xs">
                      <span className="text-gray-400 w-14">Manager</span>
                      <span className="text-gray-800 font-medium">
                        Louis Litt
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ConfirmEscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        onConfirm={(reason) => {
          console.log("Escalation confirmed:", reason);
          setIsEscalationOpen(false);
        }}
        fromDept="Production"
        toDept="Design Dept"
      />
    </div>
  );
};

export default FlagResolutionPage;
