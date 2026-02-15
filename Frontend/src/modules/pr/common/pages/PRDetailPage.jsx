import React, { useState } from "react";
import { useSelector } from "react-redux";
import ClientDiscussionModal from "../../../quotation/components/ClientDiscussionModal";
import StatusDetails from "../../../../components/StatusDetails";

// Mock Data for Client Discussion Log
const clientDiscussionMockData = [
  {
    dateTime: "11/12/25 10:00 AM",
    department: "Sales Dept.",
    repName: "Rahul",
    repDesignation: "Sales Executive",
    clientRepName: "Aman",
    clientDesignation: "Founder",
    discussion:
      "Client requested a revision on the main banner size. Agreed to updated dimensions of 12x4ft.",
    remarks: "Urgent priority.",
  },
  {
    dateTime: "12/12/25 02:30 PM",
    department: "Design Dept.",
    repName: "Ajay",
    repDesignation: "Sr. Designer",
    clientRepName: "Javed",
    clientDesignation: "Manager",
    discussion:
      "Showcased 3 variations of the logo. Client approved Variation B with minor color tweaks.",
    remarks: "Final files needed by Friday.",
  },
];
const quotationDetails = {
  flagDetail: {
    type: "High Impact",
    raisedAt: "2025-07-11T11:00:00Z",
    department: "Quotation",
    raisedBy: {
      name: "Rahul Singh",
      role: "Design Manager",
    },
    remark: "Measurement mismatch",
  },

  declineDetail: {
    declinedAt: "2025-07-11T11:00:00Z",
    department: "Quotation",
    declinedBy: {
      name: "Rahul Singh",
      role: "Design Manager",
    },
    remark: "Incomplete information",
  },

  waitingDetail: {
    department: "Sales",
    since: "2025-07-11T11:00:00Z",
    markedBy: "Amit Verma",
    designation: "Sales Manager",
    remark: "Client approval pending",
  },

  lostDetail: {
    department: "Sales",
    lostAt: "2025-07-11T11:00:00Z",
    markedBy: "Sales Admin",
    designation: "Sales",
    reason: "Client budget issue",
  },
};

import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Circle,
  MessageSquare,
  Edit3,
  Flag,
  Info,
  ArrowLeft,
  X,
  Star,
  Eye,
  Lightbulb,
} from "lucide-react";
import ReviewDynamicForm from "../../../quotation/components/ReviewDynamicForm";
import { toast } from "react-toastify";
const PRDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSource = location.state?.from;
  const isFromNextDayPlanning = location.state?.from === "next-day-planning";
  const isFromReceived = location.state?.from === "received";
  const isFromUpcoming = location.state?.from === "upcoming";
  const isFromAssigned = location.state?.from === "assigned";
  const isReadonly = location.state?.readonly === true;

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

  const normalizedRole =
    {
      executive: "executive",
      "quotation executive": "executive",
      manager: "manager",
      "quotation manager": "manager",
      hod: "manager",
      "quotation hod": "manager",
    }[role] || "executive";

  const isManager = normalizedRole === "manager";

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientModalData, setClientModalData] = useState([]);

  const handleOpenClientLog = () => {
    setClientModalData(clientDiscussionMockData);
    setIsClientModalOpen(true);
  };

  const [checklist, setChecklist] = useState({
    "Artwork proof shared": false,
    "Colors Confirmed": true,
    "Fonts Confirmed": false,
    "Scale mockup provided / Sizes Mentioned": true,
    "Speeling / Content checked": false,
  });

  const [declaration, setDeclaration] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]); 
  const [modalImageIdx, setModalImageIdx] = useState(0); 
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    remark: "",
  });
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    decision: "",
    declineRemark: "",
    flagType: "",
    flagRemark: "",
  });

  const [decisionStatus, setDecisionStatus] = useState("");
  const [decisionRemark, setDecisionRemark] = useState("");

  const toggleChecklistItem = (item) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Open modal with images array and index
  const openImageModal = (imagesArr, idx) => {
    setModalImages(imagesArr);
    setModalImageIdx(idx);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setModalImageIdx(0);
  };

  const handleOpenReview = () => {
    setIsReviewOpen(true);
  };

 const handleSubmit = () => {
  if (!formData.decision) {
    toast.warning("Please select final decision");
    return;
  }

  // 🔑 Declaration sirf normal flow me check hogi
  // if (!isFromNextDayPlanning && !declaration) {
  //   toast.warning("Please accept declaration");
  //   return;
  // }

  const payload = {
    checklist,
    declarationAccepted: isFromNextDayPlanning ? true : declaration,
    feedback: {
      comment: formData.comment,
      rating: formData.rating,
      decision: formData.decision,
      declineRemark: formData.declineRemark,
      flagType: formData.flagType,
      flagRemark: formData.flagRemark,
    },
    decisionStatus,
    decisionRemark,
  };

  console.log("📤 QUOTATION SUBMIT DATA:", payload);
  toast.success("Quotation submitted successfully");
  navigate("/quotation/received");
};


  const handleCloseReview = () => {
    setIsReviewOpen(false);
  };

  const handleSaveReview = (data) => {
    setReviewData(data);
    console.log("Review saved:", data);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const decisionColor = {
    accept: "bg-green-50 text-green-700 border-green-300",
    decline: "bg-red-50 text-red-700 border-red-300",
    flag: "bg-orange-50 text-orange-700 border-orange-300",
  };

  const stockImages = {
    exterior:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop",
    interior:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
  };

  // const statusDetails = statusDetailsMap[fromSource];

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const SectionHeader = ({ title }) => (
    <div className="mb-4 pb-2 border-b-2 border-gray-200">
      <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );

  const InfoField = ({ label, value, fullWidth = false, colSpan = 1 }) => (
    <div
      className={`mb-4 ${fullWidth ? "col-span-full" : `col-span-${colSpan}`}`}
    >
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 min-h-[38px]">
        {value || "—"}
      </div>
    </div>
  );

  const InputField = ({ label, value, type = "text", placeholder = "" }) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className="border border-gray-200 rounded p-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
        readOnly
      />
    </div>
  );

  const ProductSection = ({ title, code, children }) => {
    // Images for this section
    const sectionImages = [
      {
        src: stockImages.exterior,
        label: "Design Measurement For Quotation",
      },
      {
        src: stockImages.interior,
        label: "Supporting Assets",
      },
    ];
    return (
      <div className="border border-blue-100 rounded-lg p-4 mb-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-blue-700 text-sm">{title}</h3>
            <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded border border-blue-100">
              Product Code: {code}
            </span>
          </div>
          <div className="flex gap-2">
            {!isReadonly &&
              !isFromNextDayPlanning &&
              !isFromReceived &&
              !["flagRaised", "declined", "waiting", "lost"].includes(
                fromSource,
              ) && (
                <button
                  onClick={handleOpenReview}
                  className="text-blue-500 flex items-center gap-1 text-xs font-medium hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Edit3 size={14} /> Remark
                </button>
              )}
          </div>
        </div>
        {children}
        <div className="flex gap-4 mt-4">
          {sectionImages.map((img, idx) => (
            <div
              key={img.src}
              className="relative w-40 h-24 rounded border overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => openImageModal(sectionImages, idx)}
              />
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal(sectionImages, idx);
                }}
                title="View Image"
                type="button"
                style={{ pointerEvents: "auto" }}
              >
                <Eye size={28} className="text-white drop-shadow" />
              </button>
              <div className="absolute bottom-0 bg-green-600/80 text-[8px] text-white w-full px-1 py-0.5">
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getPageHeader = () => {
    switch (fromSource) {
      case "flagRaised":
        return "Flag Raised";
      case "declined":
        return "Declined";
      case "waiting":
        return "Waiting";
      case "lost":
        return "Lost";
      default:
        return "Design Measurement For Quotation";
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-3 rounded-t-lg border-b shadow-sm mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded border bg-gray-50 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">{getPageHeader()}</h1>
        </div>
        <div className="flex gap-2">
          <button
            title="PSL"
            className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all"
            onClick={() => navigate("/quotation/psl")}
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded font-medium cursor-pointer">
            Priority(N): High
          </span>

          <button
            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={handleOpenClientLog}
          >
            <MessageSquare size={14} />
            Client Discussion Logs
          </button>
          {/* Client Discussion Modal */}
          <ClientDiscussionModal
            isOpen={isClientModalOpen}
            onClose={() => setIsClientModalOpen(false)}
            data={clientModalData}
          />
        </div>
      </div>

      <div className="max-w-full mx-auto">
        <StatusDetails
          fromSource={fromSource}
          details={quotationDetails}
          formatDate={formatDate}
          SectionHeader={SectionHeader}
          InfoField={InfoField}
          titleSuffix="Quotation Status Details"
        />
      </div>

      <div className="bg-white p-4 shadow-sm mb-4">
        <h2 className="font-bold text-sm mb-4 border-b pb-1">
          Project Details
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <InputField label="Project Code" value="PR-87432" />
          <InputField label="Project Name" value="Main Signage Branding" />
          <InputField label="Client Code" value="CL-2981" />
          <InputField label="Client Name" value="Abc Singh" />
          <InputField label="Company Name (Optional)" value="Abc Pvt Ltd" />
          <InputField label="Contact Number" value="9876543210" />
          <InputField label="Email" value="client@gmail.com" />
        </div>

        {/* Product Sections */}
        <ProductSection title="Flex Sign Board" code="P-0887">
          <div className="grid grid-cols-4 gap-4">
            <InputField label="Thickness (MM)" value="12" />
            <InputField label="Length (Inch)" value="1" />
            <InputField label="Height (Inch)" value="4" />
            <InputField label="Size (Square /Inch)" value="4" />
          </div>
        </ProductSection>

        <ProductSection title="Acrylic Sign Board" code="P-0888">
          <div className="grid grid-cols-4 gap-4">
            <InputField label="Thickness (MM)" value="12" />
            <InputField label="Length (Inch)" value="1" />
            <InputField label="Height (Inch)" value="4" />
            <InputField label="Size (Square /Inch)" value="4" />
          </div>
        </ProductSection>

        {/* Signage Details Table-style */}
        <div className="border border-blue-100 rounded-lg p-4 mb-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-blue-700 text-sm">
                LED Channel Letter Signage
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded border border-blue-100">
                Product Code: P-0887
              </span>
            </div>
            <div className="flex gap-2">
              {!isReadonly &&
                !isFromNextDayPlanning &&
                !isFromReceived &&
                !["flagRaised", "declined", "waiting", "lost"].includes(
                  fromSource,
                ) && (
                  <button
                    onClick={handleOpenReview}
                    className="text-blue-500 flex items-center gap-1 text-xs font-medium hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} /> Remark
                  </button>
                )}
            </div>
          </div>
          <div className="space-y-4">
            {[
              { l: "A", u: 2 },
              { l: "B", u: 4 },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <InputField label="Letter" value={row.l} />
                <InputField label="Thickness (MM)" value="4" />
                <InputField label="Length (Inch)" value="1" />
                <InputField label="Height (Inch)" value="2" />
                <InputField label="Unit" value={row.u} />
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {[
              {
                src: stockImages.exterior,
                label: "Design Measurement For Quotation",
              },
              {
                src: stockImages.interior,
                label: "Supporting Assets",
              },
            ].map((img, idx) => (
              <div
                key={img.src}
                className="relative w-40 h-24 rounded border overflow-hidden"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() =>
                    openImageModal(
                      [
                        {
                          src: stockImages.exterior,
                          label: "Design Measurement For Quotation",
                        },
                        {
                          src: stockImages.interior,
                          label: "Supporting Assets",
                        },
                      ],
                      idx,
                    )
                  }
                />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageModal(
                      [
                        {
                          src: stockImages.exterior,
                          label: "Design Measurement For Quotation",
                        },
                        {
                          src: stockImages.interior,
                          label: "Supporting Assets",
                        },
                      ],
                      idx,
                    );
                  }}
                  title="View Image"
                  type="button"
                  style={{ pointerEvents: "auto" }}
                >
                  <Eye size={28} className="text-white drop-shadow" />
                </button>
                <div className="absolute bottom-0 bg-green-600/80 text-[8px] text-white w-full px-1 py-0.5">
                  {img.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assigned Section */}
      {!isFromUpcoming && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
          <h2 className="font-bold text-sm mb-4">Submitted By</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <InputField
              label={isManager ? "Design Manager" : "Quotation Manager"}
              value="Rahul Singh"
            />
            <InputField label="Branch" value="Chinnhat" />
            <InputField
              label={isManager ? "Submission Date" : "Assigned Date"}
              value="11/07/25 - 11:00AM"
            />
            <InputField label="Deadline Date" value="11/07/25 - 11:00AM" />
          </div>
          <InputField
            label={
              isManager
                ? "Design Manager's Comment"
                : "Quotation Manager's Comment"
            }
            value="All specs verified on-site. Proceed to design with client-approved colors"
          />
        </div>
      )}

      {/* Assigned Section - Shows when coming from assigned view */}
      {isFromAssigned && isManager && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
          <h2 className="font-bold text-sm mb-4">Assigned</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <InputField label="Executive Name" value="Priya Sharma" />
            <InputField label="Branch" value="Chinnhat" />
            <InputField label="Assigned Date" value="11/07/25" />
            <InputField label="Assigned Time" value="10:30 AM" />
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <InputField label="Date" value="11/07/25" />
            <InputField label="Status" value="In Progress" />
            <InputField label="Priority Number" value="High (1)" />
            <InputField label="Deadline" value="15/07/25" />
          </div>
          <InputField
            label="Remark"
            value="Quotation needs client approval before proceeding with design"
          />
        </div>
      )}

      {isFromNextDayPlanning && !isReadonly && isManager && (
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm mb-4">
          <h2 className="font-bold text-sm mb-4">Accept / Decline</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={decisionStatus}
                onChange={(e) => {
                  const value = e.target.value;
                  setDecisionStatus(value);

                  if (value === "Accepted") {
                    setFormData((prev) => ({ ...prev, decision: "accept" }));
                  }
                  if (value === "Declined") {
                    setFormData((prev) => ({ ...prev, decision: "decline" }));
                  }
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="Accepted">Accept</option>
                <option value="Declined">Decline</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Remark
              </label>
              <textarea
                value={decisionRemark}
                onChange={(e) => setDecisionRemark(e.target.value)}
                rows={1}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm resize-none h-[42px]"
                placeholder="Add remark"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            {/* <button
              onClick={handleDecisionSave}
              className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save
            </button> */}
          </div>
        </div>
      )}

      {isFromReceived && (
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm mb-4">
          <h2 className="font-bold text-sm mb-4">Received By</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <InputField label="Name" value="Rahul Singh" />
            <InputField label="Designation" value="Quotation Executive" />
            <InputField label="Date" value="11/07/25 - 11:00AM" />
          </div>
          <InputField
            label="Remark"
            value="All quotation requirements received and verified"
          />
        </div>
      )}
      {!isFromNextDayPlanning &&
        !isFromReceived &&
        !["flagRaised", "declined", "waiting", "lost"].includes(fromSource) && (
          <div className="space-y-4">
            {/* Checklist - Full Width */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="font-bold text-sm mb-4">Checklist</h2>

              {/* 4x3 Grid for Checklist Items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {Object.keys(checklist).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => !isReadonly && toggleChecklistItem(item)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded border border-gray-100 text-xs ${!isReadonly && "cursor-pointer hover:bg-gray-100"} transition-colors min-h-[80px]`}
                  >
                    {checklist[item] ? (
                      <CheckCircle
                        size={24}
                        className="text-blue-500 flex-shrink-0"
                      />
                    ) : (
                      <Circle
                        size={24}
                        className="text-gray-300 flex-shrink-0"
                      />
                    )}
                    <span
                      className={`text-center ${
                        checklist[item]
                          ? "text-gray-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <InputField label="Additional Comment" value="NA" />
              </div>

              {/* Declaration */}
              <div className="mt-4">
                <h3 className="font-bold text-sm mb-2">Declaration</h3>
                <div
                  onClick={() => !isReadonly && setDeclaration(!declaration)}
                  className={`flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100 text-xs ${!isReadonly && "cursor-pointer hover:bg-gray-100"} transition-colors`}
                >
                  {declaration ? (
                    <CheckCircle
                      size={18}
                      className="text-blue-500 flex-shrink-0"
                    />
                  ) : (
                    <Circle size={18} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={declaration ? "text-gray-700" : "text-gray-500"}
                  >
                    I confirm that all measurements and photos are accurate and
                    taken by me.
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction - Full Width */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="font-bold text-sm mb-2">Instruction</h2>
              <div className="bg-gray-50 p-4 rounded text-gray-400 text-xs border border-gray-100">
                Quotation Instruction will display here..
              </div>
            </div>

            {/* Receiver - Full Width */}
            {!isFromAssigned && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="font-bold text-sm mb-4">Receiver</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <InputField label="Quotation Executive" value="Rahul Singh" />
                  <InputField label="Branch" value="Chinnhat" />
                  <InputField label="Date" value="11/07/25 - 11:00AM" />
                </div>
                <InputField
                  label="Quotation Executive Comment"
                  value="All specs verified on-site. Proceed to design with client-approved colors"
                />
              </div>
            )}

            {/* Feedback Panel - Full Width */}
            {!isReadonly && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="font-bold text-sm mb-4">Feedback Panel</h2>
                <div className="space-y-4">
                  {/* Design Executive Comment - Full Width */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Comment
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => handleChange("comment", e.target.value)}
                      className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter overall comment"
                      rows={3}
                    />
                  </div>

                  {/* Rating & Decision - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rating
                      </label>
                      <div className="flex items-center justify-between bg-gray-50 border rounded-sm px-3 py-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              onClick={() => handleChange("rating", star)}
                              className={`cursor-pointer ${
                                star <= formData.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {formData.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Decision */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Final Decision
                      </label>
                      <select
                        value={formData.decision}
                        onChange={(e) =>
                          handleChange("decision", e.target.value)
                        }
                        className={`w-full border rounded-sm px-3 py-2 text-sm transition focus:outline-none focus:ring-1 focus:ring-blue-500
                      ${
                        decisionColor[formData.decision] ||
                        "bg-white text-gray-700 border-gray-300"
                      }
                    `}
                      >
                        <option value="">Select Decision</option>
                        <option value="accept">✅ Accept</option>
                        <option value="decline">❌ Decline</option>
                        <option value="flag">🚩 Flag</option>
                      </select>
                    </div>
                  </div>

                  {/* Decline Remark - Full Width */}
                  {formData.decision === "decline" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Decline Remark
                      </label>
                      <textarea
                        value={formData.declineRemark}
                        onChange={(e) =>
                          handleChange("declineRemark", e.target.value)
                        }
                        className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter decline reason"
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Flag Fields - Full Width Grid */}
                  {formData.decision === "flag" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Flag Type
                        </label>
                        <select
                          value={formData.flagType}
                          onChange={(e) =>
                            handleChange("flagType", e.target.value)
                          }
                          className="w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Flag Type</option>
                          <option value="High Impact">🔴 High Impact</option>
                          <option value="Medium Impact">
                            🟡 Medium Impact
                          </option>
                          <option value="Low Impact">🟢 Low Impact</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Flag Remark
                        </label>
                        <textarea
                          value={formData.flagRemark}
                          onChange={(e) =>
                            handleChange("flagRemark", e.target.value)
                          }
                          className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter flag remark"
                          rows={1}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      {!isReadonly &&
        isManager &&
        !isFromReceived &&
        !["flagRaised", "declined", "waiting", "lost"].includes(fromSource) && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => navigate("/quotation/assigned-quotations")}
              className="px-6 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
            >
              Submit
            </button>
          </div>
        )}

      {isReadonly && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>
      )}

      {/* Review Modal */}
      <ReviewDynamicForm
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        title="Installation Details Review"
        remark={reviewData.remark}
        onSave={handleSaveReview}
      />

      {/* button>
        <button className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
          Submit
        </button>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="relative w-full max-w-6xl max-h-[95vh] p-2 sm:p-4 md:p-6 flex flex-col items-center">
            <button
              onClick={closeImageModal}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-40 bg-black/60 rounded-full p-1.5 text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none"
              style={{ lineHeight: 0 }}
            >
              <X className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </button>
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 w-full justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIdx((idx) => Math.max(0, idx - 1));
                }}
                disabled={modalImageIdx === 0}
                className="text-white text-3xl px-2 disabled:opacity-30"
              >
                &#8592;
              </button>
              <div className="flex-1 flex justify-center">
                <img
                  src={modalImages[modalImageIdx]?.src}
                  alt="Full size"
                  className="w-full max-w-[95vw] max-h-[35vh] sm:max-h-[40vh] md:max-h-[50vh] lg:max-h-[60vh] object-contain rounded-lg cursor-default"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIdx((idx) =>
                    Math.min(modalImages.length - 1, idx + 1),
                  );
                }}
                disabled={modalImageIdx === modalImages.length - 1}
                className="text-white text-3xl px-2 disabled:opacity-30"
              >
                &#8594;
              </button>
            </div>
            <div className="mt-2 text-white text-xs text-center w-full break-words px-2">
              <span
                className="font-semibold"
                style={{
                  fontSize: "clamp(1rem, 2vw, 2rem)",
                  wordBreak: "break-word",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                {modalImages[modalImageIdx]?.label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRDetailPage;
