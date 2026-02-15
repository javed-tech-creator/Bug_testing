import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Check,
  Play,
  FileText,
  AlertCircle,
  Image as ImageIcon,
  Film,
  Maximize2,
  Star,
  Eye,
  Download,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CommentWithMedia from "../../../../design/components/recording/CommentWithMedia";

// --- UPDATED MOCK DATA (UNCHANGED) ---
const STATIC_RECCE_DETAILS = {
  _id: "RECCE-REVIEW-001",
  reviewSubmit: {
    envData: {
      sunlight: "High",
      rain: "High",
      wind: "High",
      ambient: "High",
      direction: "North-East",
      node: "North-East",
    },
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
    heightFromRoad: "Approx. 10 ft",
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
      name: "Mockup_Design.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
    {
      type: "image",
      label: "Mockup Image",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      name: "Mockup_Night.jpg",
    },
  
  ],
  videoDocumentation: [
    {
      type: "video",
      label: "360° Walkaround",
      name: "360_view.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
    
    {
      type: "video",
      label: "Front Video",
      name: "front_vid.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&h=300&fit=crop",
    },
  ],
  installationDetails: {
    surfaceType: "ACP Sheet",
    surfaceCondition: "Good",
    textureNotes: "Smooth surface suitable for acrylic fabrication",
    stability: "Mount",
    mountDescription: "Direct wall mount",
    civilWork: "No",
    civilDesc:
      "Electrical wire above signage area\nShop awning extends 1 ft outward",
    fabrication: "Yes",
    fabricationDesc:
      "Electrical wire above signage area\nShop awning extends 1 ft outward",
    obstructions:
      "Electrical wire above signage area\nShop awning extends 1 ft outward",
    equipment: {
      ladder: "Yes",
      bamboo: "Yes",
      ironMs: "Yes",
      tableStool: "Yes",
    },
    otherNotes: "Use ladder for top height measurement",
    powerAvail: "Yes",
    switchboardDist: "5 ft",
    cableRoute: "Route cable through right-side pillar area.",
    safetyNotes: "Ensure cable insulation before installation.",
    reqFromClient: "Ensure cable insulation before installation.",
    instrToClient: "Ensure cable insulation before installation.",
  },
  rawRecce: [
    {
      name: "Image 1",
      desc: "Client wants a bright LED board that is clearly visible from the main road.",
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    },
    {
      name: "Image 2",
      desc: "Wall texture closeup for mounting reference.",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    },
    {
      name: "Image 3",
      desc: "Existing wiring condition.",
      url: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=400&h=300&fit=crop",
    },
    {
      name: "Image 4",
      desc: "View from the road entrance.",
      url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop",
    },
  ],
  dataInstruction: {
    content: "ACP Solutions",
    logoOption: "Yes",
    fontType: "Poppins",
    colorDetails: {
      combination: "White background, Blue letters",
      code: "#000000",
      ref: "reference.png",
      summary: "White background, Blue letters",
    },
    lightOption: "Lit",
    lightColor: "#FF0000",
    lightRef: "reference.png",
    lightDesc: "Maintain similar color tone.",
    signageRef: "reference.png",
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
  },
  compliance: {
    score: 95,
    finalNotes:
      "All specs verified on-site. Proceed to design with client-approved colors",
    safetyNotes: "Caution required near staircase; secure ladder footing.",
  },
};

const ReviewSubmit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

  // Get manager review data from navigation state
  const rowData = location.state?.recce || location.state?.rowData;
  const fromSource = location.state?.from;
  const isClientReview = fromSource === "client-review";
  const managerStatus = rowData?.status || "";
  const managerRemark = rowData?.feedback?.[rowData.feedback.length - 1]?.feedback || "";
const isRecceReport = fromSource === "recce-review-manager";

  const normalizedRole =
    {
      executive: "executive",
      "recce executive": "executive",
      manager: "manager",
      "recce manager": "manager",
      hod: "manager",
      "recce hod": "manager",
    }[role] || "executive";

  const isManager = normalizedRole === "manager";
  const isClientFilling = !isManager && isClientReview;
  const data = STATIC_RECCE_DETAILS;

  // === Review States ===
  const [approvalStatus, setApprovalStatus] = useState("");
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [flagColor, setFlagColor] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [modificationReason, setModificationReason] = useState("");
  
  // Manager review for New status
  const [managerReviewStatus, setManagerReviewStatus] = useState("");
  const [managerFeedback, setManagerFeedback] = useState("");
  const [managerFiles, setManagerFiles] = useState([]);
  const isNewStatusFromManager = isRecceReport && managerStatus === "New";

  const [feedbackChecks, setFeedbackChecks] = useState({
    environmentalConditions: false,
    productRequirements: false,
    uploadedImages: false,
    uploadedVideos: false,
    installationDetails: false,
    instructionsRemarks: false,
    submittedSameDay: false,
  });

 const [complianceChecks, setComplianceChecks] = useState({
  signageType: false,
  quantityRequired: false,
  sizeEstimates: false,
  materialPreference: false,
  illuminationNeeded: false,
  photosVerified: false,
  siteMeasurementVerified: false,
  installationEnvironmentChecked: false,
  visibilityDistanceConfirmed: false,
  electricalAccessConfirmed: false,
  mountingMethodDecided: false,
  materialSuitabilityChecked: false,
  fittingProvisionRequired: false,
  additionalEquipmentRequired: false,
});


  const toggleFeedbackCheck = (key) => {
    setFeedbackChecks((s) => ({ ...s, [key]: !s[key] }));
  };

  const toggleComplianceCheck = (key) => {
    setComplianceChecks((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSubmit = () => {
    if (!isConfirmed) {
      toast.error("Please confirm declaration");
      return;
    }
    toast.success("Recce Submitted!");
    navigate("/recce/recce-in-design");
  };

  const decisionColor = {
    Accepted: "bg-green-100 text-green-700 border-green-400",
    Rejected: "bg-red-100 text-red-700 border-red-400",
    "Flag Raised": "bg-yellow-100 text-yellow-800 border-yellow-400",
    Modification: "bg-orange-100 text-orange-800 border-orange-400",
  };

  return (
    <div className="">
      {/* Header with Stepper */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-sm shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold">
            {fromSource === "recce-review-manager" ? "Recce Report" : "Preview & Submit"}
          </h1>
        </div>

        {managerStatus && (
          <div className="mt-2 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                managerStatus === "Approved By Manager"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : managerStatus === "Modification Required"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : managerStatus === "Rejected"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {managerStatus}
            </span>
          </div>
        )}
       
      </div>

      {/* ================= ENVIRONMENTAL CONDITIONS ================= */}
      <div className="border rounded-sm shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Environmental Conditions</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <RenderLevel
              label="Sunlight Exposure"
              selected={data.reviewSubmit.envData.sunlight}
            />
            <RenderLevel
              label="Rain Exposure"
              selected={data.reviewSubmit.envData.rain}
            />
            <RenderLevel
              label="Wind Exposure"
              selected={data.reviewSubmit.envData.wind}
            />
            <RenderLevel
              label="Ambient Light"
              selected={data.reviewSubmit.envData.ambient}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <InfoField
              label="Signage Directions"
              value={data.reviewSubmit.envData.direction}
            />
            <InfoField
              label="Upload Compass Screenshot"
              value="North-East.jpg"
              isFile
            />
            <InfoField
              label="Environmental Node"
              value={data.reviewSubmit.envData.node}
            />
          </div>
        </div>
      </div>

      {/* ================= PRODUCT REQUIREMENTS ================= */}
      <div className="border rounded-sm shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">
            Product Requirements (Detailed)
          </h2>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium block mb-1">
                Client Requirements:
              </label>
              <textarea
                rows={3}
                readOnly
                className="w-full border rounded-sm p-2 bg-gray-50 text-gray-700"
                value={data.clientProductId.requirements}
              />
            </div>
            <div>
              <label className="font-medium block mb-1">
                Client Expectations
              </label>
              <ul className="border rounded-sm p-3 bg-gray-50 list-disc pl-8 space-y-1 text-gray-700">
                {data.clientProductId.expectations.map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InfoField
              label="Product Category"
              value={data.clientProductId.category}
            />
            <InfoField label="Product Name" value={data.clientProductId.name} />
            <InfoField label="Product Code" value={data.clientProductId.code} />
            <InfoField
              label="Visibility"
              value={data.clientProductId.visibility}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-2">
              <div className="w-2/3">
                <InfoField
                  label="Height / Vertical"
                  value={data.clientProductId.height.value}
                />
              </div>
              <div className="w-1/3">
                <InfoField
                  label="Unit"
                  value={data.clientProductId.height.unit}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2/3">
                <InfoField
                  label="Width / Length"
                  value={data.clientProductId.width.value}
                />
              </div>
              <div className="w-1/3">
                <InfoField
                  label="Unit"
                  value={data.clientProductId.width.unit}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2/3">
                <InfoField
                  label="Thickness / Depth"
                  value={data.clientProductId.thickness.value}
                />
              </div>
              <div className="w-1/3">
                <InfoField
                  label="Unit"
                  value={data.clientProductId.thickness.unit}
                />
              </div>
            </div>

            <InfoField label="Quantity" value={data.clientProductId.quantity} />
            <InfoField
              label="Light Option"
              value={data.clientProductId.lightOption}
            />
            <InfoField
              label="Layer Count"
              value={data.clientProductId.layerCount}
            />
          </div>

          <div>
            <label className="font-medium block mb-1">
              Connection Point Details
            </label>
            <input
              readOnly
              value={data.clientProductId.connectionDetails}
              className="w-full border rounded-sm p-2 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField label="Visibility Distance" value="60–80 ft" />
            <InfoField label="Height from Road Level" value="Approx. 10 ft" />
          </div>
        </div>
      </div>

      {/* ================= UPLOADED MEDIA ================= */}
      <div className="border rounded-sm shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Uploaded Photos</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.visualDocumentation.map((img, i) => (
            <MediaCard key={i} data={img} type="image" />
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Uploaded Videos</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.videoDocumentation.map((vid, i) => (
            <MediaCard key={i} data={vid} type="video" />
          ))}
        </div>
      </div>

      {/* ================= INSTALLATION DETAILS ================= */}
      <div className="border rounded-sm shadow-sm bg-white text-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-lg font-bold">Installation Details</h2>
        </div>

        <div className="p-4 grid grid-cols-4 gap-4">
          <InfoField
            label="Surface Type / Base"
            value={data.installationDetails.surfaceType}
          />
          <InfoField
            label="Surface Condition"
            value={data.installationDetails.surfaceCondition}
          />
        </div>
        <div className="px-4 pb-4">
          <InfoField
            label="Texture Notes"
            value={data.installationDetails.textureNotes}
          />
        </div>

        <h2 className="p-4 font-bold border-y-2">Signage Stability</h2>
        <div className="px-4 py-2 grid grid-cols-4 gap-4">
          <InfoField
            label="Stability"
            value={data.installationDetails.stability}
          />
          <InfoField
            label="Mount Description"
            value={data.installationDetails.mountDescription}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 px-4 pb-4 mt-3">
          <div className="col-span-1">
            <YesNoBadge
              label="Civil Work Required"
              value={data.installationDetails.civilWork}
            />
          </div>
          <div className="col-span-3">
            <InfoField
              label="Civil Work Description"
              value={data.installationDetails.civilDesc}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 px-4 pb-4 mt-3">
          <div className="col-span-1">
            <YesNoBadge
              label="Fabrication Work Needed"
              value={data.installationDetails.fabrication}
            />
          </div>
          <div className="col-span-3">
            <InfoField
              label="Fabrication Work Description"
              value={data.installationDetails.fabricationDesc}
            />
          </div>
        </div>

        <h3 className="px-4 py-2 font-semibold border-b">
          Surrounding Obstructions
        </h3>
        <div className="px-4 pb-4 mt-2">
          <InfoField
            label="Obstruction Details"
            value={data.installationDetails.obstructions}
          />
        </div>

        <h2 className="p-4 font-bold border-y-2">Installation Equipment</h2>
        <div className="px-4 py-4 grid grid-cols-4 gap-4">
          <YesNoBadge
            label="Ladder"
            value={data.installationDetails.equipment.ladder}
          />
          <YesNoBadge
            label="Bamboo (Paad)"
            value={data.installationDetails.equipment.bamboo}
          />
          <YesNoBadge
            label="Iron MS / Paad"
            value={data.installationDetails.equipment.ironMs}
          />
          <YesNoBadge
            label="Table-Stool"
            value={data.installationDetails.equipment.tableStool}
          />
        </div>
        <div className="px-4 pb-4">
          <InfoField
            label="Other Notes"
            value={data.installationDetails.otherNotes}
          />
        </div>

        <h3 className="px-4 py-2 font-semibold border-t">
          Electrical Requirements
        </h3>
        <div className="px-4 py-4 grid grid-cols-5 gap-4">
          <div>
            <YesNoBadge
              label="Power Connection Available"
              value={data.installationDetails.powerAvail}
            />
          </div>
          <InfoField
            label="Switchboard Distance"
            value={data.installationDetails.switchboardDist}
          />
        </div>
        <div className="px-4 pb-4 space-y-4">
          <InfoField
            label="Cable Route Notes"
            value={data.installationDetails.cableRoute}
          />
          <InfoField
            label="Safety Notes"
            value={data.installationDetails.safetyNotes}
          />
          <InfoField
            label="Requirement From Client"
            value={data.installationDetails.reqFromClient}
          />
          <InfoField
            label="Instruction to Client"
            value={data.installationDetails.instrToClient}
          />
        </div>
      </div>

      {/* ================= RAW RECCE ================= */}
      <div className="border rounded-sm shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Raw Recce</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          {data.rawRecce.map((item, index) => (
            <div
              key={index}
              className="border rounded-sm overflow-hidden bg-white"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover p-1"
                />
              </div>
              <div className="p-3 text-xs">
                <p className="font-semibold text-gray-700">{item.name}</p>
                <p className="text-gray-500 mt-1 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DATA FROM CLIENT ================= */}
      <div className="border rounded-sm shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Data From Client</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 text-sm">
          <InfoField label="Content" value={data.dataInstruction.content} />
          <FileActionBtn
            label="Content File (Optional)"
            filename="contentfile.png"
          />

          <InfoField
            label="Logo (CDR) (If Need)"
            value={data.dataInstruction.logoOption}
          />
          <FileActionBtn
            label="Upload Logo (If Any)"
            filename="uploadlogo.png"
          />

          <InfoField label="Font Type" value={data.dataInstruction.fontType} />
          <FileActionBtn label="Upload Font" filename="poppins.ttf" />

          <InfoField
            label="Color Combination"
            value={data.dataInstruction.colorDetails.combination}
          />
          <InfoField
            label="Color Code"
            value={data.dataInstruction.colorDetails.code}
          />
          <FileActionBtn
            label="Color Reference"
            filename={data.dataInstruction.colorDetails.ref}
          />

          <div className="md:col-span-2">
            <label className="font-medium">Detail Summary</label>
            <textarea
              rows={2}
              readOnly
              value={data.dataInstruction.colorDetails.summary}
              className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50 text-gray-700"
            />
          </div>

          <InfoField
            label="Light Option"
            value={data.dataInstruction.lightOption}
          />
          <InfoField
            label="Light Color"
            value={data.dataInstruction.lightColor}
          />
          <FileActionBtn
            label="Light Ref"
            filename={data.dataInstruction.lightRef}
          />

          <div className="md:col-span-2">
            <InfoField
              label="Light Desc"
              value={data.dataInstruction.lightDesc}
            />
          </div>
          <div className="md:col-span-2">
            <FileActionBtn
              label="Any Signage Sample"
              filename={data.dataInstruction.signageRef}
            />
          </div>
        </div>
      </div>

      {/* ================= INSTRUCTIONS ================= */}
      <div className="border rounded-sm shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">
            Additional Instructions / Remarks
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
          {Object.entries(data.dataInstruction.remarks).map(([key, val]) => (
            <div key={key}>
              <p className="font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <ul className="list-disc pl-5 bg-gray-50 border rounded-sm p-3 space-y-1 text-gray-700">
                {val.split("\n").map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FINAL NOTES ================= */}
      <div className="bg-white rounded-sm shadow-sm border">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Final Notes</h2>
        </div>
        <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Comments
            </label>
            <div className="bg-gray-50 border rounded-sm p-3 text-sm text-gray-700">
              {data.compliance.finalNotes}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Safety Notes
            </label>
            <div className="bg-gray-50 border rounded-sm p-3 text-sm text-gray-700">
              {data.compliance.safetyNotes}
            </div>
          </div>
        </div>
      </div>

      {/* {isManager && (
        <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-800 mb-3">Declaration</p>
          <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 border border-gray-200 rounded-md p-3">
            I confirm that all measurements and photos are accurate and taken by me.
          </div>
        </div>
      )} */}

      {/* ================= COMPLIANCE CHECKLIST ================= */}
      <div className="rounded-sm shadow-sm border bg-white">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">DSS Compliance Checklist</h2>
            {!isClientFilling && (
              <p className="text-xs text-gray-500 mt-1">View Only - Client Filled</p>
            )}
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
            Score: {data.compliance.score}%
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          { [
  { key: "signageType", label: "Types of Signage Possible (indoor / outdoor)" },
  { key: "quantityRequired", label: "Quantity Required" },
  { key: "sizeEstimates", label: "Size Estimates" },
  { key: "materialPreference", label: "Material Preference possible or not" },
  { key: "illuminationNeeded", label: "Illumination Needed? Possible or not " },
  { key: "photosVerified", label: "Photos / site survey Verified" },
  { key: "siteMeasurementVerified", label: "Site Measurement Verified" },
  { key: "installationEnvironmentChecked", label: "Installation Environment Checked (wall , glass , pole , structure)" },
  { key: "visibilityDistanceConfirmed", label: "Visibility Distance Requirement Confirmed" },
  { key: "electricalAccessConfirmed", label: "Electrical Access Confirmed (if illuminated)" },
  { key: "mountingMethodDecided", label: "Mounting Method Decided" },
  { key: "materialSuitabilityChecked", label: "Material Suitability Checked" },
  { key: "fittingProvisionRequired", label: "Fitting & other Provision Required" },
  { key: "scuffFoldingHydraOtherItemsRequired", label: "Scuff folding hydra other items required" },
].map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center gap-3 px-3 py-2 border rounded-sm transition
        ${isClientFilling ? "cursor-pointer" : "cursor-not-allowed opacity-75"}
        ${complianceChecks[key] ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"}`}
            >
              <input
                type="checkbox"
                checked={complianceChecks[key]}
                onChange={() => isClientFilling && toggleComplianceCheck(key)}
                disabled={!isClientFilling}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-800">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ================= MANAGER REVIEW PANEL ================= */}
     

      {/* Manager Review Summary */}
      {managerStatus && (
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5">
          <h2 className="text-base font-bold text-blue-700 mb-4">Manager Review Summary</h2>
          
          {isNewStatusFromManager ? (
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-700 font-semibold mb-2">Select Review Status</label>
                <select
                  value={managerReviewStatus}
                  onChange={(e) => setManagerReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Status --</option>
                  <option value="Approved By Manager">Approved By Manager</option>
                  <option value="Modification Required">Modification Required</option>
                  <option value="Flag Raised">Flag Raised</option>
                </select>
              </div>
              
              {managerReviewStatus && (
                <CommentWithMedia
                  title="Manager Feedback"
                  placeholder="Enter your feedback here..."
                  value={managerFeedback}
                  onChange={setManagerFeedback}
                  files={managerFiles}
                  onFilesChange={setManagerFiles}
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-1">Status</span>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
                    managerStatus === "Approved By Manager"
                      ? "bg-green-100 text-green-700"
                      : managerStatus === "Modification Required"
                        ? "bg-yellow-100 text-yellow-700"
                        : managerStatus === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {managerStatus}
                </div>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-gray-500 font-medium mb-1">Manager Feedback</span>
                <div className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 min-h-[36px]">
                  {managerRemark || "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= FOOTER ACTIONS ================= */}
     {!isRecceReport && (
  <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
    <p className="text-xs font-bold text-gray-800 mb-3">Declaration</p>

    <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200 mb-6 cursor-pointer">
      <input
        type="checkbox"
        checked={isConfirmed}
        onChange={(e) => setIsConfirmed(e.target.checked)}
        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-xs text-gray-600 leading-relaxed">
        I confirm that all measurements and photos are accurate and taken by me.
      </span>
    </label>

    <div className="flex justify-end items-center gap-3">
      <button
        className="px-5 py-2 bg-gray-600 text-white text-xs font-bold rounded shadow hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>

      <button
        onClick={handleSubmit}
        disabled={!isConfirmed}
        className={`px-5 py-2 text-white text-xs font-bold rounded shadow ${
          isConfirmed
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-300 cursor-not-allowed"
        }`}
      >
        Final Submit
      </button>
    </div>
  </div>
)}

      {/* Action Buttons for Manager Review */}
      {isNewStatusFromManager && managerReviewStatus && managerFeedback.trim() !== "" && (
        <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
          <div className="flex justify-end">
            {managerReviewStatus === "Approved By Manager" ? (
              <button
                onClick={() => {
                  toast.success("Recce sent to design team successfully!");
                  navigate("/recce/recce-in-design");
                }}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
              >
                Send to Design
              </button>
            ) : (
              <button
                onClick={() => {
                  toast.success(`Manager review saved with status: ${managerReviewStatus}`);
                  navigate(-1);
                }}
                className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

/* --- REUSABLE SUB-COMPONENTS (Based on AssignedViewPage Styling) --- */

const InfoField = ({ label, value, isFile }) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <div
      className={`w-full border rounded-sm px-3 py-2 text-sm ${isFile ? "bg-white text-blue-600 flex items-center gap-2" : "bg-gray-50 text-gray-800"}`}
    >
      {value || "-"}
      {isFile && <Download size={14} className="ml-auto cursor-pointer" />}
    </div>
  </div>
);

const FileActionBtn = ({ label, filename }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <div className="w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
      <span className="text-sm truncate">{filename}</span>
      <div className="flex items-center gap-3">
        <Eye size={14} className="cursor-pointer" />
        <Download size={14} className="cursor-pointer" />
      </div>
    </div>
  </div>
);

const RenderLevel = ({ label, selected }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex gap-2">
      {["High", "Medium", "Low"].map((level) => (
        <div
          key={level}
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${selected === level ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-50 text-gray-400 border-gray-200"}`}
        >
          {level}
        </div>
      ))}
    </div>
  </div>
);

const MediaCard = ({ data, type }) => (
  <div className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-sm">
    <div className="h-28 bg-gray-100 relative overflow-hidden group">
      <img
        src={data.url || data.thumbnail}
        alt={data.label}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {type === "video" && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-8 h-8 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
            <Play size={14} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
    <div className="p-2 border-t border-gray-100 bg-white">
      <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold mb-0.5">
        {type === "video" ? <Film size={12} /> : <ImageIcon size={12} />}
        <span className="truncate">{data.label}</span>
      </div>
    </div>
  </div>
);

const YesNoBadge = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-700">{label}</label>
    <div className="flex bg-gray-100 rounded-md p-1 border border-gray-200 w-max text-[10px] font-semibold">
      <div
        className={`px-3 py-1 rounded-sm ${value === "Yes" || value === true ? "bg-blue-100 text-blue-700 border border-blue-200" : "text-gray-400"}`}
      >
        Yes
      </div>
      <div
        className={`px-3 py-1 rounded-sm ${value === "No" || value === false ? "bg-blue-100 text-blue-700 border border-blue-200" : "text-gray-400"}`}
      >
        No
      </div>
    </div>
  </div>
);

const StepCircle = ({ num, active }) => (
  <div
    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-blue-600 text-white" : "bg-gray-400 text-white"}`}
  >
    {num}
  </div>
);
const StepLine = () => <div className="w-8 h-[1px] bg-gray-300 mx-1"></div>;

export default ReviewSubmit;
