import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";

import { ChevronDown, Eye, Download, Play, Film, Check, FileText, Printer } from "lucide-react";
import ReviewModal from "./ReviewModal";

// --- MOCK DATA (Updated with all fields from screenshots) ---
const STATIC_RECCE_DETAILS = {
  _id: "REC-2025-00124",
  status: "Completed",
  submittedDate: "11/07/25",
  clientInfo: {
    code: "CL-2981",
    name: "Abc Singh",
    designation: "Manager",
    company: "Abc Pvt Ltd",
    mobile: "+91 98241 11289",
    whatsapp: "+91 98241 11289",
    altNumber: "+91 75688 44120",
    email: "shrmedical@gmail.com",
    salesExec: "Amit Verma",
    lead: "Amit Verma",
    deal: "Abc",
    relationship: "Xyz",
    contactPerson: "Mr. Rohan Sharma",
    cpDesignation: "HR",
    cpContact: "+91 9876543210",
    cpAltContact: "+91 9876543210",
    cpEmail: "abc.98@gmail.com",
  },
  projectInfo: {
    name: "Main Signage Branding",
    code: "PR-87432",
    assigned: "13 Feb 2025 / 10:00AM",
    confirmed: "15 Feb 2025 / 10:00AM",
    received: "14 Feb 2025 / 10:00AM",
    notes: "Visit store between 3 PM - 6 PM. Client is available",
  },
  clientInteraction: {
    metClient: "No",
    personMet: "Full Name",
    contactNumber: "Full Name",
    reason: "Store closed",
    rescheduleDate: "11/08/26",
    proofImage: "store.jpg",
  },
  envData: {
    sunlight: "High",
    rain: "High",
    wind: "High",
    ambient: "High",
    direction: "North-East",
    compassImg: "North-East.jpg",
    node: "North-East",
  },
  clientProductId: {
    category: "Indoor",
    name: "LED Frontlit Board",
    code: "P-0976",
    visibility: "One side",
    height: { value: 4.5, unit: "Feet" },
    width: { value: 12, unit: "cm" },
    thickness: { value: 2, unit: "Inch" },
    quantity: 1,
    lightOption: "Lit",
    connectionDetails: "Route cable through right-side pillar area.",
    layerCount: "Double",
    visibilityDist: "60-80 ft",
    visibilityDistUnit: "Feet",
    heightFromRoad: "Approx. 10 ft",
    heightFromRoadUnit: "Feet",
    requirements:
      "Client wants a bright LED board that is clearly visible from the main road. Store name should be in bigger font, and the board should have a clean medical-theme color combination.",
    expectations: [
      "Premium look",
      "Night visibility must be strong",
      "Avoid covering CCTV camera",
      "Blue & white theme preferred",
    ],
  },
  visualDocumentation: [
      {
        type: "image",
        label: "Mockup Image",
        url: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=300&fit=crop",
      },
      {
        type: "image",
        label: "Mockup Image",
        url: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=300&fit=crop",
      },
    
  ],
  videoDocumentation: [
   
    {
      type: "video",
      label: "Right Video",
      thumbnail:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Top Video",
      thumbnail:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    },
  ],
  installationDetails: {
    surfaceType: "ACP Sheet",
    surfaceCondition: "Good",
    textureNotes: "Smooth surface suitable for acrylic fabrication",
  },
  signageStability: {
    stability: "Mount",
    description: "Direct wall mount",
  },
  civilWork: {
    required: "Yes",
    description:
      "Electrical wire above signage area\nShop awning extends 1 ft outward",
  },
  fabricationWork: {
    needed: "Yes",
    description:
      "Electrical wire above signage area\nShop awning extends 1 ft outward",
  },
  obstructions: {
    description:
      "Electrical wire above signage area\nShop awning extends 1 ft outward",
  },
  installationEquipment: {
    ladder: "Yes",
    bamboo: "Yes",
    ironMs: "Yes",
    tableStool: "Yes",
    otherNotes: "Use ladder for top height measurement",
  },
  electrical: {
    available: "Yes",
    distance: "5 ft",
    routeNotes: "Route cable through right-side pillar area.",
    safetyNotes: "Ensure cable insulation before installation.",
    clientReq: "Ensure cable insulation before installation.",
    clientInstr: "Ensure cable insulation before installation.",
  },
  rawRecce: [
    {
      name: "Image 1",
      desc: "Client wants a bright LED board that is clearly visible from the main road.",
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    },
    {
      name: "Image 2",
      desc: "Client wants a bright LED board that is clearly visible from the main road.",
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    },
    {
      name: "Image 1",
      desc: "Client wants a bright LED board that is clearly visible from the main road.",
      url: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=400&h=300&fit=crop",
    },
    {
      name: "Image 1",
      desc: "Client wants a bright LED board that is clearly visible from the main road.",
      url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop",
    },
  ],
  dataClient: {
    content: "ACP Solutions",
    contentFile: "Upload Content File",
    logoNeeded: "Yes",
    logoFile: "Upload Logo",
    fontType: "Poppins",
    fontFile: "poppins.ttf",
    colorCombo: "White background, Blue letters",
    colorCode: "#000000",
    colorRef: "reference.png",
    detailSummary: "White background, Blue letters",
    lightOption: "Lit",
    lightColor: "#FF0000",
    lightColorRef: "reference.png",
    lightDesc: "Maintain similar color tone.",
    signageSample: "reference.png",
  },
  remarks: {
    clientReq:
      "Design better Design\nMaintain similar color tone as billing software",
    clientInstall:
      "Install board exactly above shutter\nMaintain similar color tone as billing software",
    clientCompany:
      "Install board exactly above shutter\nMaintain similar color tone as billing software",
    recceDesign:
      "Design better Design\nMaintain similar color tone as billing software",
    recceInstall:
      "Design better Design\nMaintain similar color tone as billing software",
    recceCompany:
      "Design better Design\nMaintain similar color tone as billing software",
    other:
      "Design better Design\nMaintain similar color tone as billing software",
  },
  finalNotes: {
    comments:
      "All specs verified on-site. Proceed to design with client-approved colors",
    safety: "Caution required near staircase; secure ladder footing.",
  },
  compliance: {
    score: 95,
    checklist: [
      "Tools Ready",
      "Form Completely Filled",
      "Client Interaction Done",
      "GPS Camera ON",
      "Clear Marking Photo Taken",
      "Minimum 6 Photos Uploaded",
      "360° Video Uploaded",
      "Accurate Measurements Taken",
      "Dimensions Double-Checked",
      "Recce In & Out Photo Uploaded",
      "Submitted Same Day",
    ],
    recceExec: "Rahul Singh",
    branch: "Chinnhat",
  },
  managerFeedback: {
    checklist: [
      "Environmental Conditions",
      "Product Requirements",
      "Uploaded Images",
      "Uploaded Videos",
      "Installation Details",
      "Raw Recce",
      "Data From Client",
      "Accurate Measurements Taken",
      "Instructions / Remarks",
      "All Signage Name (Product Name) Confirmed",
      "Submitted Same Day",
    ],
    comment: "Looks complete; proceed to design handoff.",
    accuracy: 4.0,
    status: "Approved",
    flagReason: "N/A",
    rework: "N/A",
  },
};

// --- REUSABLE COMPONENTS ---


const SectionCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
      <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, value, isLink = false }) => {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-gray-500 font-medium mb-1">{label}</span>
      {isLink ? (
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium leading-tight text-blue-500 hover:underline cursor-pointer">
            {value || "-"}
          </span>
          {value &&
            (value.includes(".png") ||
              value.includes(".jpg") ||
              value.includes(".ftt")) && (
              <div className="flex gap-1">
                <Eye size={12} className="text-blue-500" />
                <Download size={12} className="text-blue-500" />
              </div>
            )}
        </div>
      ) : (
        <span className="text-[13px] font-medium leading-tight text-gray-800">
          {value || "-"}
        </span>
      )}
    </div>
  );
};

const InputField = ({ label, value, unit, dropdown }) => (
  <div className="flex flex-col">
    <span className="text-[11px] text-gray-500 font-medium mb-1">{label}</span>
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm">
      <span className="text-[13px] text-gray-800 flex-1 font-medium">
        {value}
      </span>
      {unit && !dropdown && (
        <span className="text-[10px] text-gray-400 border-l border-gray-300 pl-2 ml-2 font-medium">
          {unit}
        </span>
      )}
      {dropdown && (
        <div className="flex items-center border-l border-gray-300 pl-2 ml-2">
          <span className="text-[10px] text-gray-600 font-medium mr-1">
            {unit}
          </span>
          <ChevronDown size={10} className="text-gray-400" />
        </div>
      )}
    </div>
  </div>
);

const ReadOnlyInput = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[11px] text-gray-500 font-medium mb-1">{label}</span>
    <div className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-[13px] text-gray-700 min-h-[36px]">
      {value}
    </div>
  </div>
);

const ToggleGroup = ({ label, options, selected }) => (
  <div className="flex flex-col">
    <span className="text-[11px] text-gray-500 font-medium mb-1">{label}</span>
    <div className="flex gap-2">
      {options.map((opt) => (
        <span
          key={opt}
          className={`text-[11px] px-3 py-1 rounded-md border font-medium transition-colors cursor-default ${
            selected === opt
              ? "bg-blue-50 border-blue-200 text-blue-600"
              : "bg-gray-50 border-gray-200 text-gray-400"
          }`}
        >
          {opt}
        </span>
      ))}
    </div>
  </div>
);

const InstallationToggle = ({ label, value, readOnly = false }) => (
  <div className="flex flex-col">
    <span className="text-[11px] text-gray-800 font-bold mb-1">{label}</span>
    <div className="flex gap-2">
      {readOnly ? (
        <>
          <span
            className={`flex-1 py-1 rounded border text-[11px] font-medium text-center ${value === "Yes" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}
          >
            Yes
          </span>
          <span
            className={`flex-1 py-1 rounded border text-[11px] font-medium text-center ${value === "No" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}
          >
            No
          </span>
        </>
      ) : (
        <>
          <button
            className={`flex-1 py-1 rounded border text-[11px] font-medium ${value === "Yes" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}
          >
            Yes
          </button>
          <button
            className={`flex-1 py-1 rounded border text-[11px] font-medium ${value === "No" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}
          >
            No
          </button>
        </>
      )}
    </div>
  </div>
);

const ImageThumbnail = ({ label, src, type = "image" }) => (
  <div className="flex flex-col gap-1.5">
    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer shadow-sm hover:shadow-md transition-all">
      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <Play
              className="text-blue-600 ml-0.5"
              size={14}
              fill="currentColor"
            />
          </div>
        </div>
      )}
    </div>
    <div className="flex items-center gap-1">
      {type === "video" ? (
        <Film size={10} className="text-blue-500" />
      ) : (
        <div className="w-2.5 h-2.5 rounded-sm bg-blue-100 flex items-center justify-center">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
        </div>
      )}
      <span className="text-[10px] text-blue-500 font-medium truncate">
        {label}
      </span>
    </div>
  </div>
);

const ChecklistItem = ({ label, checked = true }) => (
  <div className="flex items-center gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
    <div
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? "bg-blue-50 border-blue-400" : "border-gray-300"}`}
    >
      {checked && <Check size={10} className="text-blue-600 stroke-[3px]" />}
    </div>
    <span className="text-[11px] text-gray-700 font-medium">{label}</span>
  </div>
);

const RecceReport = () => {
  const location = useLocation();

  let data = location.state?.rowData || STATIC_RECCE_DETAILS;

  // Ensure all nested objects/arrays are always defined to prevent TypeError
  if (!data.clientInfo) data = { ...data, clientInfo: STATIC_RECCE_DETAILS.clientInfo };
  if (!data.projectInfo) data = { ...data, projectInfo: STATIC_RECCE_DETAILS.projectInfo };
  if (!data.clientInteraction) data = { ...data, clientInteraction: STATIC_RECCE_DETAILS.clientInteraction };
  if (!data.envData) data = { ...data, envData: STATIC_RECCE_DETAILS.envData };
  if (!data.clientProductId) data = { ...data, clientProductId: STATIC_RECCE_DETAILS.clientProductId };
  if (!data.visualDocumentation) data = { ...data, visualDocumentation: STATIC_RECCE_DETAILS.visualDocumentation };
  if (!data.videoDocumentation) data = { ...data, videoDocumentation: STATIC_RECCE_DETAILS.videoDocumentation };
  if (!data.installationDetails) data = { ...data, installationDetails: STATIC_RECCE_DETAILS.installationDetails };
  if (!data.signageStability) data = { ...data, signageStability: STATIC_RECCE_DETAILS.signageStability };
  if (!data.civilWork) data = { ...data, civilWork: STATIC_RECCE_DETAILS.civilWork };
  if (!data.fabricationWork) data = { ...data, fabricationWork: STATIC_RECCE_DETAILS.fabricationWork };
  if (!data.obstructions) data = { ...data, obstructions: STATIC_RECCE_DETAILS.obstructions };
  if (!data.installationEquipment) data = { ...data, installationEquipment: STATIC_RECCE_DETAILS.installationEquipment };
  if (!data.electrical) data = { ...data, electrical: STATIC_RECCE_DETAILS.electrical };
  if (!data.remarks) data = { ...data, remarks: STATIC_RECCE_DETAILS.remarks };
  if (!data.finalNotes) data = { ...data, finalNotes: STATIC_RECCE_DETAILS.finalNotes };
  if (!data.compliance) data = { ...data, compliance: STATIC_RECCE_DETAILS.compliance };
  if (!data.managerFeedback) data = { ...data, managerFeedback: STATIC_RECCE_DETAILS.managerFeedback };
  if (!Array.isArray(data.managerFeedback.checklist)) data.managerFeedback = { ...data.managerFeedback, checklist: STATIC_RECCE_DETAILS.managerFeedback.checklist };
  if (!Array.isArray(data.rawRecce)) data.rawRecce = STATIC_RECCE_DETAILS.rawRecce;
  if (!data.dataClient) data = { ...data, dataClient: STATIC_RECCE_DETAILS.dataClient };

  // These should be defined or imported from context/props if needed
  const isFromWorkflow =
    location.state?.from === "workflow" ||
    location.state?.source === "workflow" ||
    location.state?.isFromWorkflow === true;
  const isClientReview =
    location.state?.from === "client-review" ||
    location.state?.source === "client-review" ||
    location.state?.isClientReview === true;

  const showChecklistAndManagerPanel =
    data.status === "Completed" && !isFromWorkflow && !isClientReview;

  const authRes = useSelector((state) => state.auth?.userData);
  const user = authRes?.user || {};
  const role = user?.designation?.title?.toLowerCase();
  const normalizedRole = {
    executive: "executive",
    "recce executive": "executive",
    manager: "manager",
    "recce manager": "manager",
    hod: "manager",
    "recce hod": "manager",
  }[role] || "executive";
  const isExecutive = normalizedRole === "executive";
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const handleOpenReview = () => setIsReviewOpen(true);
  const handleCloseReview = () => setIsReviewOpen(false);
  const handleSaveReview = (data) => {
    console.log("Review Saved →", data);
  };

  // Helper for status badge color
  const reportStatus = data.status || "Pending";
  const statusBadgeClass = {
    Completed: "bg-green-100 text-green-700",
    Draft: "bg-yellow-100 text-yellow-700",
    Started: "bg-red-100 text-red-700",
    Pending: "bg-blue-100 text-blue-700",
    Approved: "bg-green-100 text-green-700",
    "Modify Needed": "bg-yellow-100 text-yellow-700",
    Modify: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
    Declined: "bg-red-100 text-red-700",
  }[reportStatus] || "bg-gray-100 text-gray-700";

  const isStatic = !location.state?.rowData;
  const clientRemark =
    location.state?.clientRemark ||
    location.state?.remark ||
    data.clientReviewRemark ||
    data.reviewRemark ||
    data.clientRemark ||
    data.remark ||
    "";
  const showClientSummary = isClientReview || Boolean(clientRemark);

  // State for client-review action

  const [clientReviewAction, setClientReviewAction] = useState("");
  const [clientReviewRemark, setClientReviewRemark] = useState("");
  const [clientReviewError, setClientReviewError] = useState("");

  // Clear input when action changes
  const handleClientReviewAction = (action) => {
    setClientReviewAction(action);
    setClientReviewRemark("");
    setClientReviewError("");
  };

  // Only allow submit if input is filled
  const handleClientReviewSubmit = () => {
    if (!clientReviewRemark.trim()) {
      setClientReviewError(
        clientReviewAction === "Approve"
          ? "Remark is required."
          : clientReviewAction === "Modify"
          ? "Modification instructions are required."
          : "Reject reason is required."
      );
      return;
    }

    setClientReviewError("");
    // Submit logic here (API call, etc.)
    // ...
    // Example: alert(`Submitted: ${clientReviewAction}\n${clientReviewRemark}`);
  };

  return (
    <>
      <div className="">
        {isStatic && isFromWorkflow && (
          <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded px-4 py-2 mb-4 text-sm">
            <b>Warning:</b> No workflow data received. Showing default report. Please ensure you navigate from workflow with correct data.
          </div>
        )}
        {/* Top Header */}
        <div className="w-full bg-white border-b border-gray-200 mb-6">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left */}
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Recce Report Details
              </h1>
            </div>
            {/* Right */}
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-3 py-1 rounded-md font-medium ${statusBadgeClass}`}>
                {reportStatus}
              </span>
            </div>
          </div>
          {/* ...existing code... */}
          <ReviewModal
            isOpen={isReviewOpen}
            onClose={handleCloseReview}
            title="Recce Review"
            remark=""
            onSave={handleSaveReview}
          />
        </div>
        {!isClientReview && !isFromWorkflow && (
          <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5 mb-6">
            <h2 className="text-base font-bold text-blue-700 mb-4">Client Review Actions</h2>
            <div className="flex gap-3 mb-4">
              {["Approve", "Modify", "Reject"].map((action) => (
                <button
                  key={action}
                  type="button"
                  className={`px-5 py-2 rounded font-semibold border transition-colors text-sm
                    ${clientReviewAction === action
                      ? "bg-blue-600 text-white border-blue-700"
                      : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"}`}
                  onClick={() => handleClientReviewAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
            {clientReviewAction && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  {clientReviewAction === "Approve" && "Remark"}
                  {clientReviewAction === "Modify" && "Modification Instructions"}
                  {clientReviewAction === "Reject" && "Reject Reason"}
                </label>
                <textarea
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded min-h-[80px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={clientReviewRemark}
                  onChange={(e) => setClientReviewRemark(e.target.value)}
                  placeholder={
                    clientReviewAction === "Approve"
                      ? "Enter your remark..."
                      : clientReviewAction === "Modify"
                        ? "Enter modification instructions..."
                        : "Enter reject reason..."
                  }
                  required
                />
              </div>
            )}
            {clientReviewError && (
              <div className="text-red-600 text-xs mb-2">{clientReviewError}</div>
            )}
            <button
              type="button"
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              onClick={handleClientReviewSubmit}
              disabled={!clientReviewAction || !clientReviewRemark.trim()}
            >
              Submit Review
            </button>
          </div>
        )}

          {/* Contact Person Details (On Site) */}
          <SectionCard title="Contact Person Details (On Site)">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <ReadOnlyInput
                label="Contact Person"
                value={data.clientInfo.contactPerson}
              />
              <ReadOnlyInput
                label="Contact Person Designation"
                value={data.clientInfo.cpDesignation}
              />
              <ReadOnlyInput
                label="Contact Number"
                value={data.clientInfo.cpContact}
              />
              <ReadOnlyInput
                label="Alternate Number"
                value={data.clientInfo.cpAltContact}
              />
              <div className="col-span-2">
                <ReadOnlyInput label="Email" value={data.clientInfo.cpEmail} />
              </div>
            </div>
          </SectionCard>

          {/* Project Information */}
          <SectionCard title="Project Information">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <ReadOnlyInput
                label="Project Name"
                value={data.projectInfo.name}
              />
              <ReadOnlyInput
                label="Project Code"
                value={data.projectInfo.code}
              />
              <ReadOnlyInput
                label="Assigned Date"
                value={data.projectInfo.assigned}
              />
              <ReadOnlyInput
                label="Deadline"
                value={data.projectInfo.confirmed}
              />
              <ReadOnlyInput
                label="Received Date"
                value={data.projectInfo.received}
              />
            </div>
            <div className="mt-4">
              <ReadOnlyInput
                label="Recce Notes / Remark"
                value={data.projectInfo.notes}
              />
            </div>
          </SectionCard>

          {/* Client Interaction */}
          <SectionCard title="Client Interaction">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <ToggleGroup
                label="Met Client on Site?"
                options={["Yes", "No"]}
                selected={data.clientInteraction.metClient}
              />
              <ReadOnlyInput
                label="Person Met"
                value={data.clientInteraction.personMet}
              />
              <ReadOnlyInput
                label="Contact Number"
                value={data.clientInteraction.contactNumber}
              />
            </div>
            <div className="w-full">
              <ReadOnlyInput
                label="Reason for Not Meeting"
                value={data.clientInteraction.reason}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <ReadOnlyInput
                label="Suggest Reschedule Date"
                value={data.clientInteraction.rescheduleDate}
              />
              <ReadOnlyInput
                label="Upload Proof Image"
                value={data.clientInteraction.proofImage}
              />
            </div>
          </SectionCard>

          {/* Environmental Conditions */}
          <SectionCard title="Environmental Conditions">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
              <ToggleGroup
                label="Sunlight Exposure"
                options={["High", "Medium", "Low"]}
                selected={data.envData.sunlight}
              />
              <ToggleGroup
                label="Rain Exposure"
                options={["High", "Medium", "Low"]}
                selected={data.envData.rain}
              />
              <ToggleGroup
                label="Wind Exposure"
                options={["High", "Medium", "Low"]}
                selected={data.envData.wind}
              />
              <ToggleGroup
                label="Ambient Light"
                options={["High", "Medium", "Low"]}
                selected={data.envData.ambient}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-50">
              <ReadOnlyInput
                label="Signage Directions"
                value={data.envData.direction}
              />
              <ReadOnlyInput
                label="Upload Compass Screenshot"
                value={data.envData.compassImg}
              />
              <div className="col-span-2">
                <ReadOnlyInput
                  label="Environmental Note"
                  value={data.envData.node}
                />
              </div>
            </div>
          </SectionCard>

          {/* Product Requirements (Detailed) */}
          <SectionCard title="Product Requirements (Detailed)">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] text-gray-500 font-medium">
                  Client Requirements
                </span>
                <p className="text-[12px] text-gray-700 bg-gray-50 p-2.5 rounded-md mt-1 border border-gray-100 leading-relaxed min-h-[60px]">
                  {data.clientProductId.requirements}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-medium">
                  Client Expectations
                </span>
                <ul className="bg-gray-50 p-2.5 rounded-md mt-1 border border-gray-100">
                  {data.clientProductId.expectations.map((exp, i) => (
                    <li
                      key={i}
                      className="text-[11px] text-gray-600 list-disc ml-4"
                    >
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Product Category
                  </span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm justify-between">
                    <span className="text-[13px] text-gray-800 font-medium">
                      {data.clientProductId.category}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <ReadOnlyInput
                  label="Product Name"
                  value={data.clientProductId.name}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyInput
                  label="Product Code"
                  value={data.clientProductId.code}
                />
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Visibility
                  </span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm justify-between">
                    <span className="text-[13px] text-gray-800 font-medium">
                      {data.clientProductId.visibility}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Height / Vertical"
                  value={data.clientProductId.height.value}
                  unit={data.clientProductId.height.unit}
                  dropdown
                />
                <InputField
                  label="Width / length / Horizontal"
                  value={data.clientProductId.width.value}
                  unit={data.clientProductId.width.unit}
                  dropdown
                />
                <InputField
                  label="Thickness / Depth"
                  value={data.clientProductId.thickness.value}
                  unit={data.clientProductId.thickness.unit}
                  dropdown
                />
                <InputField
                  label="Quantity"
                  value={data.clientProductId.quantity}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Light Option
                  </span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm justify-between">
                    <span className="text-[13px] text-gray-800 font-medium">
                      {data.clientProductId.lightOption}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <ReadOnlyInput
                  label="Connection Point Details"
                  value={data.clientProductId.connectionDetails}
                />
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Layer Count (In Letters)
                  </span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm justify-between">
                    <span className="text-[13px] text-gray-800 font-medium">
                      {data.clientProductId.layerCount}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Visibility Distance"
                  value={data.clientProductId.visibilityDist}
                  unit={data.clientProductId.visibilityDistUnit}
                  dropdown
                />
                <InputField
                  label="Height from Road Level"
                  value={data.clientProductId.heightFromRoad}
                  unit={data.clientProductId.heightFromRoadUnit}
                  dropdown
                />
              </div>
            </div>
          </SectionCard>

          {/* Uploaded Photos */}
          <SectionCard title="Uploaded Photos">
            <div className="grid grid-cols-2 gap-3">
              {data.visualDocumentation.map((img, i) => (
                <ImageThumbnail key={i} label={img.label} src={img.url} />
              ))}
            </div>
          </SectionCard>

          {/* Uploaded Videos */}
          <SectionCard title="Uploaded Videos">
            <div className="grid grid-cols-2 gap-3">
              {data.videoDocumentation.map((vid, i) => (
                <ImageThumbnail
                  key={i}
                  label={vid.label}
                  src={vid.thumbnail}
                  type="video"
                />
              ))}
            </div>
          </SectionCard>

          {/* Installation details */}
          <SectionCard title="Installation details">
            <div className="grid grid-cols-2 gap-4">
              <ReadOnlyInput
                label="Surface Type / Base"
                value={data.installationDetails.surfaceType}
              />
              <ReadOnlyInput
                label="Surface Condition"
                value={data.installationDetails.surfaceCondition}
              />
            </div>
            <div className="mt-3">
              <ReadOnlyInput
                label="Texture Notes"
                value={data.installationDetails.textureNotes}
              />
            </div>
          </SectionCard>

          {/* Signage Stability */}
          <SectionCard title="Signage Stability">
            <div className="space-y-4">
              <ReadOnlyInput
                label="Stability"
                value={data.signageStability.stability}
              />
              <ReadOnlyInput
                label="Mount Description"
                value={data.signageStability.description}
              />
            </div>
          </SectionCard>

        {/* === RIGHT COLUMN === */}
        <div className="flex flex-col gap-4">
          {/* Civil Work Required */}
          <SectionCard title="Civil Work Required">
            <div className="space-y-4">
              <ToggleGroup
                label=""
                options={["Yes", "No"]}
                selected={data.civilWork.required}
              />
              <div className="mt-2">
                <span className="text-[11px] text-gray-500 font-medium mb-1 block">
                  Civil Work Description
                </span>
                <ul className="bg-gray-50 p-2.5 rounded-md border border-gray-200">
                  {data.civilWork.description.split("\n").map((line, i) => (
                    <li
                      key={i}
                      className="text-[11px] text-gray-600 list-disc ml-4"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Fabrication Work Needed */}
          <SectionCard title="Fabrication Work Needed">
            <div className="space-y-4">
              <ToggleGroup
                label=""
                options={["Yes", "No"]}
                selected={data.fabricationWork.needed}
              />
              <div className="mt-2">
                <span className="text-[11px] text-gray-500 font-medium mb-1 block">
                  Fabrication Work Description
                </span>
                <ul className="bg-gray-50 p-2.5 rounded-md border border-gray-200">
                  {data.fabricationWork.description.split("\n").map((line, i) => (
                    <li
                      key={i}
                      className="text-[11px] text-gray-600 list-disc ml-4"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Surrounding Obstructions */}
          <SectionCard title="Surrounding Obstructions">
            <div className="mt-1">
              <ul className="bg-gray-50 p-2.5 rounded-md border border-gray-200">
                {data.obstructions.description.split("\n").map((line, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-gray-600 list-disc ml-4"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          {/* Installation Equipment */}
          <SectionCard title="Installation Equipment">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <InstallationToggle
                label="Ladder"
                value={data.installationEquipment.ladder}
                readOnly={isClientReview}
              />
              <InstallationToggle
                label="Bamboo (Paad)"
                value={data.installationEquipment.bamboo}
                readOnly={isClientReview}
              />
              <InstallationToggle
                label="Iron MS / Paad"
                value={data.installationEquipment.ironMs}
                readOnly={isClientReview}
              />
              <InstallationToggle
                label="Table-Stool"
                value={data.installationEquipment.tableStool}
                readOnly={isClientReview}
              />
            </div>
            <div className="mt-3">
              <ReadOnlyInput
                label="Other Notes"
                value={data.installationEquipment.otherNotes}
              />
            </div>
          </SectionCard>

          {/* Electrical Requirements */}
          <SectionCard title="Electrical Requirements">
            <div className="grid grid-cols-2 gap-4">
              <ToggleGroup
                label="Power Connection Available"
                options={["Yes", "No"]}
                selected={data.electrical.available}
              />
              <ReadOnlyInput
                label="Switchboard Distance"
                value={data.electrical.distance}
              />
            </div>
            <div className="mt-3 space-y-3">
              <ReadOnlyInput
                label="Cable Route Notes"
                value={data.electrical.routeNotes}
              />
              <ReadOnlyInput
                label="Safety Notes"
                value={data.electrical.safetyNotes}
              />
              <ReadOnlyInput
                label="Requirement From Client"
                value={data.electrical.clientReq}
              />
              <ReadOnlyInput
                label="Instruction to Client"
                value={data.electrical.clientInstr}
              />
            </div>
          </SectionCard>

          {/* Raw Recce */}
          <SectionCard title="Raw Recce">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {data.rawRecce.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                    <img
                      src={item.url}
                      alt={`Raw Recce ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-800">
                      <span className="font-bold text-gray-900">
                        Product Name:
                      </span>{" "}
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 leading-snug">
                      <span className="font-bold text-gray-900">
                        Description:
                      </span>{" "}
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Data From Client */}
          <SectionCard title="Data From Client">
            <div className="grid grid-cols-2 gap-4">
              <ReadOnlyInput label="Content" value={data.dataClient.content} />
              <ReadOnlyInput
                label="Content File (Optional)"
                value={data.dataClient.contentFile}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <ToggleGroup
                label="Logo (CDR) (If Need)"
                options={["Yes", "No"]}
                selected={data.dataClient.logoNeeded}
              />
              <ReadOnlyInput
                label="Upload Logo (If Any)"
                value={data.dataClient.logoFile}
              />
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyInput
                  label="Font Type (If want specific)"
                  value={data.dataClient.fontType}
                />
                <ReadOnlyInput
                  label="Upload Font File (If Any)"
                  value={data.dataClient.fontFile}
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4">
              <ReadOnlyInput
                label="Color Combination (If want some specific)"
                value={data.dataClient.colorCombo}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <ReadOnlyInput
                label="Color Code (If Available)"
                value={data.dataClient.colorCode}
              />
              <ReadOnlyInput
                label="Color Reference Image (If Available)"
                value={data.dataClient.colorRef}
              />
            </div>
            <div className="mt-3">
              <ReadOnlyInput
                label="Detail Summary"
                value={data.dataClient.detailSummary}
              />
            </div>

            <div className="mt-3">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-medium mb-1">
                  Light Option
                </span>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm justify-between">
                  <span className="text-[13px] text-gray-800 font-medium">
                    {data.dataClient.lightOption}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Light Color
                  </span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1.5 shadow-sm">
                    <span className="text-[13px] text-gray-800 flex-1 font-medium">
                      {data.dataClient.lightColor}
                    </span>
                  </div>
                </div>
                <ReadOnlyInput
                  label="Light Color (If Anything Have)"
                  value={data.dataClient.lightColorRef}
                />
              </div>
              <div className="mt-3">
                <ReadOnlyInput
                  label="Light Color Description"
                  value={data.dataClient.lightDesc}
                />
              </div>
              <div className="mt-3">
                <ReadOnlyInput
                  label="Any Signage Sample (If Want to Give Reference)"
                  value={data.dataClient.signageSample}
                />
              </div>
            </div>
          </SectionCard>

          {/* Additional Instructions / Remarks */}
          <SectionCard title="Additional Instructions / Remarks">
            <div className="space-y-4">
              {[
                { label: "Client's Requirement", val: data.remarks.clientReq },
                {
                  label: "Client to Installation Instructions",
                  val: data.remarks.clientInstall,
                },
                {
                  label: "Client to Company Instructions",
                  val: data.remarks.clientCompany,
                },
                { label: "Recce to Design", val: data.remarks.recceDesign },
                {
                  label: "Recce to Installation",
                  val: data.remarks.recceInstall,
                },
                { label: "Recce to Company", val: data.remarks.recceCompany },
                { label: "Other Remark", val: data.remarks.other },
              ].map((item, idx) => (
                <div key={idx}>
                  <span className="text-[11px] font-bold text-gray-800">
                    {item.label}
                  </span>
                  <ul className="text-[11px] text-gray-600 list-disc ml-4 mt-1 space-y-0.5 whitespace-pre-line bg-gray-50 p-2 rounded border border-gray-100">
                    {item.val.split("\n").map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Final Notes */}
          <SectionCard title="Final Notes">
            <div className="space-y-4">
              <ReadOnlyInput
                label="Additional Comments"
                value={data.finalNotes.comments}
              />
              <ReadOnlyInput
                label="Additional Safety Notes"
                value={data.finalNotes.safety}
              />
            </div>
          </SectionCard>

          {/* DSS Compliance Checklist - REMOVE CHECKBOXES */}
          {showChecklistAndManagerPanel && (
            <SectionCard title="DSS Compliance Checklist">
              <div className="grid grid-cols-1 gap-0">
                {data.compliance.checklist.map((item, i) => (
                  <div key={i} className="py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-[11px] text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-700 w-24">
                  Compliance Score
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${data.compliance.score}%` }}
                  ></div>
                </div>
                <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {data.compliance.score}%
                </span>
              </div>
              <div className="mt-5">
                <h5 className="text-[11px] font-bold text-gray-800 mb-2">
                  Declaration
                </h5>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex gap-3 items-start">
                  <p className="text-[11px] text-gray-600 leading-snug">
                    I confirm that all measurements and photos are accurate and
                    taken by me.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-800 block mb-3 uppercase tracking-wide">
                  Submitted By
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <ReadOnlyInput
                    label="Recce Executive"
                    value={data.compliance.recceExec}
                  />
                  <ReadOnlyInput
                    label="Branch"
                    value={data.compliance.branch}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Manager Feedback Panel - only for Completed */}
          {showChecklistAndManagerPanel && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4 border-l-[3px] border-l-blue-600 relative">
              <h3 className="font-bold text-gray-800 text-xs uppercase mb-4 tracking-wide">
                Manager Feedback Panel
              </h3>
              <div className="grid grid-cols-1 gap-1 mb-5 border-b border-gray-100 pb-4">
                {data.managerFeedback.checklist.map((item, i) => (
                  <div key={i} className="py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-[11px] text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">
                    Manager Comment
                  </span>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-[12px] text-gray-600">
                      {data.managerFeedback.comment}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 block mb-1">
                      Accuracy Score
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm border border-gray-200 rounded px-2 py-1.5 bg-gray-50/50">
                      ★★★★☆{" "}
                      <span className="text-gray-400 text-[10px] ml-1 font-medium">
                        {data.managerFeedback.accuracy}/5
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 block mb-1">
                      Recce Approval Status
                    </span>
                    <div className="border border-green-200 rounded px-3 py-1.5 text-[12px] text-green-700 bg-green-50/50 flex justify-between items-center font-medium">
                      {data.managerFeedback.status} <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">
                    Raise a Flag
                  </span>
                  <div className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-green-600 bg-white flex justify-between items-center">
                    NA <ChevronDown size={14} />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">
                    Flag Raising Reason
                  </span>
                  <div className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-gray-50">
                    {data.managerFeedback.flagReason}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">
                    Rework Instructions
                  </span>
                  <div className="border border-gray-200 rounded px-3 py-1.5 text-[12px] text-gray-500 bg-gray-50">
                    {data.managerFeedback.rework}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Review Summary (read-only) */}
          {showClientSummary && (
            <SectionCard title="Client Review Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Status
                  </span>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-md text-[12px] font-semibold ${statusBadgeClass}`}
                  >
                    {reportStatus}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[11px] text-gray-500 font-medium mb-1">
                    Remark
                  </span>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-[13px] text-gray-700 min-h-[36px]">
                    {clientRemark || "—"}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Footer Actions for Manager (hide for client-review) */}
          {!isClientReview && !isExecutive && (
            <div className="flex flex-wrap justify-end gap-3 pb-6 border-b border-gray-200 mb-6">
              <button className="flex items-center gap-2 bg-gray-600 text-white px-5 py-1.5 rounded shadow-sm text-xs font-medium hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-1.5 rounded shadow-sm text-xs font-medium hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
          )}

          {/* Bottom Action Buttons (hide for client-review) */}
          {!isClientReview && (
            <div className="flex items-center justify-end gap-3 pb-12 flex-wrap">
              {data.status === "Completed" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded shadow-sm text-[11px] font-medium hover:bg-yellow-500 transition-colors"
                >
                  ★ Add Review
                </button>
              )}

              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-[11px] font-medium hover:bg-blue-700 transition-colors">
                <FileText size={14} /> Download Full Report (PDF)
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-[11px] font-medium hover:bg-blue-700 transition-colors">
                <Download size={14} /> Download Images ZIP
              </button>
              <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded shadow-sm text-[11px] font-medium hover:bg-gray-700 transition-colors">
                <Printer size={14} /> Print Summary
              </button>
            </div>
          )}

        </div>
      </div>
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        title="Recce Review"
        remark=""
        onSave={handleSaveReview}
      />
    </>
  );
};

export default RecceReport;
