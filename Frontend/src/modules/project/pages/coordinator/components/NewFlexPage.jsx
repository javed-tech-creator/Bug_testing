import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssignedQuotationModal from "../../../../quotation/components/AssignedQuotationModal";
import PlanningLogModal from "./PlanningLogModal";
import RecceModal from "./RecceModal";
// Reusable Component: Read-Only Input Field
const ReadOnlyField = ({ label, value, className = "", isUrgent = false }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm font-bold text-gray-800">{label}</label>
    <div
      className={`w-full p-2.5 rounded border text-gray-600 text-sm
        ${
          isUrgent
            ? "bg-white border-red-500 text-red-600"
            : "bg-gray-50 border-gray-200"
        }`}
    >
      {value || "-"}
    </div>
  </div>
);

// Reusable Component: Card Container
const SectionCard = ({ title, children, className = "" }) => (
   
  <div
    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
  >
    <div className="px-6 py-4 border-b border-gray-100">
      <h3 className="text-md font-bold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Reusable Component: File Tag (Blue Pill)
const FileTag = ({ label }) => (
  <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 cursor-pointer transition-colors">
    {label}
  </span>
);

// Reusable Component: Instruction Box
const InstructionBox = ({ title, items }) => (
  <div className="flex flex-col gap-2 mb-4">
    <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const NewFlexPage = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = React.useState(null);
  const [openRecceModalId, setOpenRecceModalId] = React.useState(null);
  
  return (
    <div className="">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Flex Sign Board</h1>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-semibold border border-blue-100">
            Project Code: DSSP-01
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className=" mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* 1. Basic Client Information */}
          <SectionCard title="Basic Client Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadOnlyField label="Client Code" value="CL-2981" />
              <ReadOnlyField
                label="Client Name (as per Govt ID)"
                value="Abc Singh"
              />
              <ReadOnlyField label="Client Designation" value="Manager" />
              <ReadOnlyField
                label="Company Name (Optional)"
                value="Abc Pvt Ltd"
              />
              <ReadOnlyField label="Mobile Number" value="+91 98241 11289" />
              <ReadOnlyField label="WhatsApp Number" value="+91 98241 11289" />
              <ReadOnlyField label="Alternate Number" value="+91 75688 44120" />
              <ReadOnlyField
                label="Email ID (Official)"
                value="shrmedical@gmail.com"
              />
              <ReadOnlyField label="Sales Executive" value="Amit Verma" />
              <ReadOnlyField label="Lead" value="Amit Verma" />
              <ReadOnlyField label="Deal" value="Abc" />
              <ReadOnlyField label="Relationship" value="Xyz" />
            </div>
          </SectionCard>

          {/* 2. Contact Person Details */}
          <SectionCard title="Contact Person Details (On Site)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadOnlyField label="Contact Person" value="Mr. Rohan Sharma" />
              <ReadOnlyField label="Contact Person Designation" value="HR" />
              <ReadOnlyField label="Contact Number" value="+91 9876543210" />
              <ReadOnlyField label="Alternate Number" value="+91 9876543210" />
              <div className="md:col-span-2">
                <ReadOnlyField label="Email" value="abc.98@gmail.com" />
              </div>
            </div>
          </SectionCard>

          {/* 3. Site Address */}
          <SectionCard title="Site Address">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-800">
                  Full Address
                </label>
                <textarea
                  readOnly
                  rows={3}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-gray-600 text-sm resize-none"
                  value="Shop No. 12, Ground Floor, Orbit Plaza, Near Kashi Corporate Road, Vastrapur, Ahmedabad – 380015"
                />
              </div>
              <ReadOnlyField label="Landmark" value="Opp. Shell Petrol Pump" />

              {/* Map Placeholder */}
              <div className="h-48 w-full border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  title="Site Location"
                  src="https://www.google.com/maps?q=Orbit+Plaza+Vastrapur+Ahmedabad&z=15&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* 1. Design Assets */}
          <SectionCard title="Design Assets Provided by Sales">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700">
                  Font File
                </span>
                <FileTag label="brand_font.ttf" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700">
                  Logo File
                </span>
                <FileTag label="logo.ai" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700">
                  Sample Mockup
                </span>
                <FileTag label="reference_mockup.jpg" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700">
                  Brand Guidelines
                </span>
                <FileTag label="color_palette.pdf" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-700">
                Business Details
              </span>
              <div className="flex">
                <FileTag label="color_palette.pdf" />
              </div>
            </div>
          </SectionCard>

          {/* 2. Instructions */}
          <SectionCard title="Instructions">
            <InstructionBox
              title="Client Instructions (To Recce)"
              items={[
                "Wants bright visibility at night",
                "Prefers bold letters",
                "Wants exact positioning above shutter",
              ]}
            />
            <InstructionBox
              title="Sales Instructions (To Recce)"
              items={[
                "Take marking photo exactly where signage will be installed",
                "Confirm client's preferred color tone",
                "Capture at least 8 photos and 360° video",
              ]}
            />
            <InstructionBox
              title="Site Warnings (To Recce)"
              items={[
                "Electrical wires above signage area",
                "Customers crowd during peak hours",
              ]}
            />
          </SectionCard>

          {/* 3. Assigned By */}
          <SectionCard title="Assigned By">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ReadOnlyField label="Project Manager" value="Rahul Singh" />
              <ReadOnlyField label="Date" value="11/07/25 - 11:00AM" />
              <ReadOnlyField label="Deadline" value="11/07/25 - 11:00AM" />
              <ReadOnlyField label="Urgency" value="High" isUrgent={true} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-800">Comment</label>
              <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-gray-600 text-sm">
                All specs verified on-site. Proceed to design with
                client-approved colors
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button 
              onClick={() => setOpenRecceModalId(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow transition-colors cursor-pointer">
                Send To Recce
              </button>
            </div>
          </SectionCard>
        </div>
      </main>
       <PlanningLogModal
        isOpen={!!openPlanningLogId}
        onClose={() => setOpenPlanningLogId(null)}
        logs={[]}
      />
      <RecceModal
        isOpen={!!openRecceModalId}
        onClose={() => setOpenRecceModalId(null)}
      />
    </div>
  );
};

export default NewFlexPage;
