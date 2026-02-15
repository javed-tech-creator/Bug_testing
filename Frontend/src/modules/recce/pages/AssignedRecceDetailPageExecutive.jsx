import React, { useState, useEffect } from "react";
import { MessageSquare, Star, ArrowLeft } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { } from "@/api/recce/recceProject.api.js";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import ReviewModal from "./ReviewModal";
import PlanningLogModal from "../components/PlanningLogModal";
import { toast } from "react-toastify";

const AssignedRecceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hideFeedbackPanel =
    location?.state?.from === "flagRaised" ||
    location?.state?.from === "declined" ||
    location?.state?.from === "waiting" ||
    location?.state?.from === "lost";

  const fromSource = location?.state?.from;

  const authData = useSelector((state) => state.auth?.userData);
  const currentUserId =
    authData?.user?._id || authData?._id || authData?.allData?._id;
  const currentUserDept =
    authData?.user?.department?._id ||
    authData?.user?.department ||
    authData?.department ||
    authData?.allData?.department;

  // Get user role for conditional rendering
  const user = authData?.user || {};
  const userRole = user?.designation?.title?.toLowerCase();
  const isManager = {
    manager: true,
    "recce manager": true,
    hod: true,
    "recce hod": true,
  }[userRole] || false;

  // --- STATIC recce data for demo ---
  const recceDetails = {
    _id: id || "recce-001",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T12:00:00Z",
    address: "24, High Street, Andheri West, Mumbai",
    landmark: "Near Metro Station",
    siteLocation: "19.1197, 72.8468",
    clientId: {
      clientId: "CL-1021",
      name: "GreenFields Pvt Ltd",
      designation: "Owner",
      companyName: "GreenFields Pvt Ltd",
      phone: "9876543210",
      whatsapp: "9876543210",
      altPhone: "9123456780",
      email: "contact@greenfields.com",
      leadId: "LD-8891",
    },
    projectId: {
      projectName: "Retail Store Branding",
      projectId: "PR-7781",
      discussionDone: "Yes",
    },
    dataInstruction: {
      clientToInstall: "Install signage on front elevation",
      recceToInstall: "Measure elevation height accurately",
      otherRemark: "High traffic area",
      clientRequirement: "Weather resistant material",
      clientToCompany: "Finish before month end",
    },
    products: [
      {
        productName: "Flex Sign Board",
        productCode: "FS-1001",
        status: "New",
      },
      {
        productName: "LED Letter Signage",
        productCode: "LED-204",
        status: "New",
      },
    ],
    documents: [
      { name: "Site Image 1", url: "#" },
      { name: "Design Reference", url: "#" },
    ],
    reviewSubmit: {
      approvalStatus: "Accepted",
      accuracyScore: 4,
      comment: "Looks good",
      checks: {
        environmentalConditions: true,
        productRequirements: true,
        uploadedImages: true,
        uploadedVideos: false,
        installationDetails: true,
        instructionsRemarks: true,
        submittedSameDay: true,
      },
    },
    recceAssignment: {
      assignedBy: { name: "Amit Verma" },
      branch: "Mumbai",
      assignedAt: "2025-01-14T09:00:00Z",
      dueDate: "2025-01-20T18:00:00Z",
      priority: "High",
      comments: "Handle with priority",
    },
    flagDetail: {
      type: "Red",
      remark: "Site access issue",
      raisedAt: "2025-01-18T14:30:00Z",
      department: "Recce",
      raisedBy: {
        name: "Amit Verma",
        role: "Recce Manager",
      },
    },
    declineDetail: {
      declinedBy: {
        name: "Neha Singh",
        role: "Design Head",
      },
      declinedAt: "2025-01-17T11:45:00Z",
      reason: "Incomplete measurements",
      remark: "Proper site images not uploaded",
    },
    waitingDetail: {
      reason: "Client approval pending",
      since: "2025-01-16T10:00:00Z",
      department: "Sales",
      markedBy: "Rahul Mehta",
      remark: "Follow up after 2 days",
    },
    lostDetail: {
      reason: "Client budget issue",
      lostAt: "2025-01-19T16:20:00Z",
      department: "Sales",
      markedBy: "Sales Admin",
      remark: "Client may reconnect later",
    },
  };

  const projectObj = recceDetails?.projectId ?? recceDetails ?? {};
  const dataInstruction = recceDetails?.dataInstruction || projectObj || {};

  // Local states
  const [approvalStatus, setApprovalStatus] = useState(
    recceDetails?.reviewSubmit?.approvalStatus || ""
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [reworkInstructions, setReworkInstructions] = useState("");
  const [flagColor, setFlagColor] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [decisionStatus, setDecisionStatus] = useState("");
  const [decisionRemark, setDecisionRemark] = useState("");

  const [products, setProducts] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [assetModal, setAssetModal] = useState({ isOpen: false, assetName: "" });
  const [autoSavedTime, setAutoSavedTime] = useState("");

  const openAssetModal = (name) => {
    setAssetModal({ isOpen: true, assetName: name });
  };

  const closeAssetModal = () => {
    setAssetModal({ isOpen: false, assetName: "" });
  };

  const [remarkModal, setRemarkModal] = useState({
    isOpen: false,
    title: "",
    content: "",
  });
  const [feedbackChecks, setFeedbackChecks] = useState({
    environmentalConditions: false,
    productRequirements: false,
    uploadedImages: false,
    uploadedVideos: false,
    installationDetails: false,
    instructionsRemarks: false,
    submittedSameDay: false,
  });

  const [showDiscussionLogModal, setShowDiscussionLogModal] = useState(false);
  const [showPlanningLogModal, setShowPlanningLogModal] = useState(false);

  const handleDecisionSave = () => {
    toast.success("Decision remark saved successfully");
  };

  const discussionLogs = [
    {
      id: 1,
      date: "15 Jan 2025, 12:00 PM",
      dept: "Sales",
      repName: "Amit Verma",
      designation: "Sales Manager",
      clientRepName: "Rakesh Patel",
      clientDesignation: "Owner",
      discussion:
        "Client discussed preferred LED size, placement above shutter and power availability.",
      remarks: "Need night visibility mockups",
    },
    {
      id: 2,
      date: "16 Jan 2025, 02:30 PM",
      dept: "Design",
      repName: "Neha Singh",
      designation: "Design Lead",
      clientRepName: "Rakesh Patel",
      clientDesignation: "Owner",
      discussion:
        "Finalized font style and color temperature. Client approved sample visuals.",
      remarks: "Proceed with final design",
    },
  ];

  const planningLogs = [
    {
      sno: 1,
      dateTime: "15 Jan 2025, 11:30 AM",
      coordinator: "Amit Verma",
      manager: "Neha Kapoor",
      projectStatus: "On Track",
      planningStatus: "Submitted",
      remark: "Initial plan shared with client for review.",
    },
    {
      sno: 2,
      dateTime: "16 Jan 2025, 03:00 PM",
      coordinator: "Ritika Shah",
      manager: "Neha Kapoor",
      projectStatus: "Approved",
      planningStatus: "Approved",
      remark: "Planning approved. Proceed with next steps.",
    },
  ];

  // Initialize states from API data
  useEffect(() => {
    if (!recceDetails) return;

    const apiAccuracy =
      recceDetails?.reviewSubmit?.accuracyScore ??
      recceDetails?.accuracyScore ??
      projectObj?.reviewSubmit?.accuracyScore ??
      0;
    setAccuracyRating(Number(apiAccuracy));

    let latestComment =
      recceDetails?.reviewSubmit?.comment ||
      projectObj?.reviewSubmit?.comment ||
      "";
    if (!latestComment && recceDetails?.remarks?.length > 0) {
      const lastRemark = recceDetails.remarks[recceDetails.remarks.length - 1];
      latestComment = lastRemark?.type || "";
    }
    setCommentText(latestComment);

    setReworkInstructions(
      recceDetails?.reviewSubmit?.reworkInstructions ||
        projectObj?.reviewSubmit?.reworkInstructions ||
        ""
    );

    setFlagColor(
      recceDetails?.reviewSubmit?.flagColor ||
        projectObj?.reviewSubmit?.flagColor ||
        ""
    );
    setFlagReason(
      recceDetails?.reviewSubmit?.flagReason ||
        projectObj?.reviewSubmit?.flagReason ||
        ""
    );

    setRejectReason(recceDetails?.rejectedDetail?.rejectionReason || "");

    const checksFromRecce = recceDetails?.reviewSubmit?.checks || {};
    const checksFromProject = projectObj?.reviewSubmit?.checks || {};
    setFeedbackChecks((prev) => ({
      ...prev,
      ...checksFromProject,
      ...checksFromRecce,
    }));

    const prodList = recceDetails?.products || projectObj?.products || [];
    setProducts(prodList);

    const docs = recceDetails?.documents || projectObj?.documents || [];
    if (docs?.length) {
      const assets = docs.map((doc) => ({
        name: doc.name || (doc.url ? doc.url.split("/").pop() : "Document"),
        url: doc.url || "",
      }));
      setAssetsList(assets);
    }

    if (recceDetails?.updatedAt) {
      try {
        const dt = new Date(recceDetails.updatedAt);
        setAutoSavedTime(
          dt.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      } catch (e) {
        setAutoSavedTime("");
      }
    }
  }, []);

  useEffect(() => {
    if (approvalStatus !== "Rejected" && approvalStatus !== "Flag Raised") {
      setFlagColor("");
      setFlagReason("");
      setRejectReason("");
    }
  }, [approvalStatus]);

  const handleSave = async () => {
    if (!approvalStatus) {
      toast.info("Please select an action (Accept / Reject / Flag)");
      return;
    }

    if (approvalStatus === "Accepted") {
      toast.success("Recce accepted successfully");
      navigate("/recce/received-recce");
      return;
    }

    if (approvalStatus === "Rejected") {
      if (!rejectReason?.trim()) {
        toast.error("Rejection reason is required");
        return;
      }
      toast.success("Recce rejected successfully");
      navigate("/recce/rejected-recce");
      return;
    }

    if (approvalStatus === "Flag Raised") {
      if (!flagColor || !flagReason?.trim()) {
        toast.error("Flag type and reason are required");
        return;
      }
      toast.success("Recce flagged successfully");
      navigate("/recce/flag-raised-recce");
      return;
    }
  };

  const openRemarkModal = (title, content) => {
    let displayContent = "No remarks available";

    if (typeof content === "string" && content.trim()) {
      displayContent = content;
    } else if (Array.isArray(content) && content.length > 0) {
      displayContent = content
        .map((remark) => {
          if (typeof remark === "string") return remark;
          if (remark?.type) return remark.type;
          return JSON.stringify(remark);
        })
        .join("\n\n");
    } else if (typeof content === "object" && content !== null) {
      displayContent = JSON.stringify(content, null, 2);
    }

    setRemarkModal({
      isOpen: true,
      title,
      content: displayContent,
    });
  };

  const closeRemarkModal = () => {
    setRemarkModal({ isOpen: false, title: "", content: "" });
  };

  const handleRemarkSave = (data) => {
    console.log("Remark saved:", data);
    setRemarkModal({ isOpen: false, title: "", content: data.remark });
  };

  if (!recceDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Recce details not found</p>
          <button
            onClick={() => navigate("/recce/assigned-recce")}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const mapLocationLabel =
    (typeof (recceDetails?.siteLocation || projectObj?.siteLocation) ===
      "string" &&
      (recceDetails?.siteLocation || projectObj?.siteLocation).trim()) ||
    "26.838228, 81.012181";
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    mapLocationLabel
  )}&z=16&output=embed`;

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

  const extractString = (val, fallback = "—") => {
    if (!val) return fallback;
    if (typeof val === "string") return val || fallback;
    if (typeof val === "number") return String(val);
    if (Array.isArray(val)) {
      return (
        val
          .map((item) => extractString(item, ""))
          .filter(Boolean)
          .join(", ") || fallback
      );
    }
    if (typeof val === "object") {
      return (
        val.name ||
        val.description ||
        val._id?.toString() ||
        JSON.stringify(val)
      );
    }
    return fallback;
  };

  const SectionHeader = ({ title }) => (
    <div className="mb-4 pb-2 border-b-2 border-gray-200">
      <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );

  const InfoField = ({ label, value, fullWidth = false, colSpan = 1 }) => (
    <div className={`mb-4 ${fullWidth ? "col-span-full" : `col-span-${colSpan}`}`}>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 min-h-[38px]">
        {value || "—"}
      </div>
    </div>
  );

  const isProcessing = isAccepting || isRejecting || isFlagging;

  const getPageHeader = () => {
    switch (fromSource) {
      case "flagRaised":
        return "Flag Raised Recce Detail";
      case "declined":
        return "Declined Recce Detail";
      case "waiting":
        return "Waiting Recce Detail";
      case "lost":
        return "Lost Recce Detail";
      default:
        return "Next Day Planning";
    }
  };

  return (
    <div className=" bg-gray-50 text-gray-900">
      {/* Header Bar */}
      <div className="bg-white p-4 border-b-2 border-gray-200 flex justify-between items-center mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            {getPageHeader()}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDiscussionLogModal(true)}
            className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Client Discussion Logs
          </button>
          <button
            onClick={() => setShowPlanningLogModal(true)}
            className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Planning Logs
          </button>
        </div>
      </div>

      <div className="max-w-full mx-auto">
        {/* Status Details Section - Full Width at Top if applicable */}
        {(fromSource === "flagRaised" ||
          fromSource === "declined" ||
          fromSource === "waiting" ||
          fromSource === "lost") && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-md p-5 mb-6">
            <SectionHeader
              title={`${
                fromSource === "flagRaised"
                  ? "Flag Raised"
                  : fromSource === "declined"
                  ? "Declined"
                  : fromSource === "waiting"
                  ? "Waiting"
                  : "Lost"
              } Status Details`}
            />
            {fromSource === "flagRaised" && (
              <div className="grid grid-cols-2 gap-x-6">
                <InfoField
                  label="Flag Type"
                  value={recceDetails?.flagDetail?.type || "-"}
                />
                <InfoField
                  label="Flag Date"
                  value={formatDate(recceDetails?.flagDetail?.raisedAt)}
                />
                <InfoField
                  label="Department"
                  value={recceDetails?.flagDetail?.department}
                />
                <InfoField
                  label="Person Name"
                  value={recceDetails?.flagDetail?.raisedBy?.name}
                />
                <InfoField
                  label="Designation"
                  value={recceDetails?.flagDetail?.raisedBy?.role}
                />
                <InfoField
                  label="Remark"
                  value={recceDetails?.flagDetail?.remark}
                  fullWidth
                />
              </div>
            )}
            {fromSource === "declined" && (
              <div className="grid grid-cols-2 gap-x-6">
                <InfoField
                  label="Department"
                  value={
                    recceDetails?.declineDetail?.declinedBy?.role ||
                    recceDetails?.declineDetail?.department
                  }
                />
                <InfoField
                  label="Date"
                  value={formatDate(recceDetails?.declineDetail?.declinedAt)}
                />
                <InfoField
                  label="Person Name"
                  value={recceDetails?.declineDetail?.declinedBy?.name}
                />
                <InfoField
                  label="Designation"
                  value={recceDetails?.declineDetail?.declinedBy?.role}
                />
                <InfoField label="Status" value="Declined" />
                <InfoField
                  label="Remark"
                  value={
                    recceDetails?.declineDetail?.remark ||
                    recceDetails?.declineDetail?.reason
                  }
                  fullWidth
                />
              </div>
            )}
            {fromSource === "waiting" && (
              <div className="grid grid-cols-2 gap-x-6">
                <InfoField
                  label="Department"
                  value={recceDetails?.waitingDetail?.department}
                />
                <InfoField
                  label="Date"
                  value={formatDate(recceDetails?.waitingDetail?.since)}
                />
                <InfoField
                  label="Person Name"
                  value={recceDetails?.waitingDetail?.markedBy}
                />
                <InfoField
                  label="Designation"
                  value={recceDetails?.waitingDetail?.designation || "-"}
                />
                <InfoField label="Status" value="Waiting" />
                <InfoField
                  label="Remark"
                  value={
                    recceDetails?.waitingDetail?.remark ||
                    recceDetails?.waitingDetail?.reason
                  }
                  fullWidth
                />
              </div>
            )}
            {fromSource === "lost" && (
              <div className="grid grid-cols-2 gap-x-6">
                <InfoField
                  label="Department"
                  value={recceDetails?.lostDetail?.department}
                />
                <InfoField
                  label="Person Name"
                  value={recceDetails?.lostDetail?.markedBy}
                />
                <InfoField
                  label="Date"
                  value={formatDate(recceDetails?.lostDetail?.lostAt)}
                />
                <InfoField
                  label="Designation"
                  value={recceDetails?.lostDetail?.designation || "-"}
                />
                <InfoField
                  label="Reason"
                  value={recceDetails?.lostDetail?.reason}
                  fullWidth
                />
              </div>
            )}
          </div>
        )}

        {/* Full Width Sections */}
        <div className="space-y-6">
          {/* Basic Client Information */}
          <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader title="Basic Client Information" />
            <div className="grid grid-cols-4 gap-x-6">
              <InfoField
                label="Client Code"
                value={recceDetails?.clientId?.clientId}
              />
              <InfoField
                label="Client Name (as per Govt ID)"
                value={recceDetails?.clientId?.name}
              />
              <InfoField
                label="Client Designation"
                value={recceDetails?.clientId?.designation}
              />
              <InfoField
                label="Company Name (Optional)"
                value={recceDetails?.clientId?.companyName}
              />
              <InfoField
                label="Mobile Number"
                value={recceDetails?.clientId?.phone}
              />
              <InfoField
                label="WhatsApp Number"
                value={recceDetails?.clientId?.whatsapp}
              />
              <InfoField
                label="Alternate Number"
                value={recceDetails?.clientId?.altPhone}
              />
              <InfoField
                label="Email ID (Official)"
                value={recceDetails?.clientId?.email}
              />
              <InfoField label="Sales Executive" value="Amit Verma" />
              <InfoField
                label="Lead"
                value={extractString(recceDetails?.clientId?.leadId)}
              />
              <InfoField
                label="Deal"
                value={extractString(recceDetails?.dealBy)}
              />
              <InfoField
                label="Relationship"
                value={extractString(recceDetails?.relationshipManager)}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">
                Contact Person Details (On Site)
              </h3>
              <div className="grid grid-cols-4 gap-x-6">
                <InfoField
                  label="Contact Person"
                  value={recceDetails?.clientId?.name}
                />
                <InfoField
                  label="Contact Person Designation"
                  value={recceDetails?.clientId?.designation}
                />
                <InfoField
                  label="Contact Number"
                  value={recceDetails?.clientId?.phone}
                />
                <InfoField
                  label="Alternate Number"
                  value={recceDetails?.clientId?.altPhone}
                />
              </div>
              <div className="grid grid-cols-4 gap-x-6">
                <InfoField
                  label="Email"
                  value={recceDetails?.clientId?.email}
                />
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader title="Project Information" />
            <div className="grid grid-cols-4 gap-x-6">
              <InfoField
                label="Project Name"
                value={projectObj?.projectName || recceDetails?.projectName}
              />
              <InfoField
                label="Project Code"
                value={extractString(
                  projectObj?.projectId || projectObj?._id
                )}
              />
              {fromSource !== "newDayPlanning" && (
                <InfoField
                  label="Assigned Date"
                  value={formatDate(recceDetails?.createdAt)}
                />
              )}
              {fromSource !== "newDayPlanning" && (
                <InfoField
                  label="Final Recce Confirmation"
                  value={extractString(
                    projectObj?.discussionDone ||
                      recceDetails?.discussionDone,
                    "Pending"
                  )}
                />
              )}
            </div>
            {fromSource !== "newDayPlanning" && (
              <div className="grid grid-cols-4 gap-x-6">
                <InfoField
                  label="Received Date"
                  value={formatDate(recceDetails?.updatedAt)}
                />
                <div className="col-span-3">
                  <InfoField
                    label="Recce Notes / Remark"
                    value={
                      Array.isArray(recceDetails?.remarks)
                        ? recceDetails.remarks
                            .map((r) => r?.type || r)
                            .join(", ")
                        : extractString(recceDetails?.remarks)
                    }
                    fullWidth
                  />
                </div>
              </div>
            )}
          </div>

          {/* Site Address */}
          <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader title="Site Address" />
            <div className="grid grid-cols-2 gap-x-6">
              <InfoField
                label="Full Address"
                value={recceDetails?.address}
                fullWidth
              />
              <InfoField
                label="Landmark"
                value={recceDetails?.landmark}
                fullWidth
              />
            </div>
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <div className="p-3 text-xs text-gray-700 bg-gray-100 border-b border-gray-300">
                <span className="font-semibold">Location: </span>
                {mapLocationLabel}
              </div>
              <div className="w-full h-64">
                <iframe
                  title="Site location map"
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader title="Instructions" />

            <div className="grid grid-cols-3 gap-6">
              {/* Client Instructions */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Client Instructions (To Recce)
                </p>
                {dataInstruction?.clientToInstall ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 leading-relaxed">
                    {String(recceDetails.dataInstruction.clientToInstall)
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={`ci-${i}`}>{line}</li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">—</div>
                )}
              </div>

              {/* Sales Instructions */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Sales Instructions (To Recce)
                </p>
                {dataInstruction?.recceToInstall ||
                dataInstruction?.recceToDesign ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 leading-relaxed">
                    {[
                      recceDetails?.dataInstruction?.recceToInstall,
                      recceDetails?.dataInstruction?.recceToDesign,
                    ]
                      .filter(Boolean)
                      .map((item, i) => (
                        <li key={`si-${i}`}>{item}</li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">—</div>
                )}
              </div>

              {/* Site Warnings */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Site Warnings (To Recce)
                </p>
                {dataInstruction?.otherRemark ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 leading-relaxed">
                    {String(recceDetails.dataInstruction.otherRemark)
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={`sw-${i}`}>{line}</li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">—</div>
                )}
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader title="Product Section (From Sales Team)" />

            <div className="space-y-5">
              {/* Client Requirement and Expectation in Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Client Requirement */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Client Requirement
                  </label>
                  <div className="bg-gray-50 p-3.5 text-sm text-gray-700 border border-gray-300 rounded-md leading-relaxed min-h-[100px]">
                    {dataInstruction?.clientRequirement || "—"}
                  </div>
                </div>

                {/* Client Expectation */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Client Expectation
                  </label>
                  <div className="bg-gray-50 p-3.5 border border-gray-300 rounded-md min-h-[100px]">
                    {dataInstruction?.clientToCompany ? (
                      <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1.5">
                        {String(recceDetails.dataInstruction.clientToCompany)
                          .split("\n")
                          .filter(Boolean)
                          .map((line, i) => (
                            <li key={`ce-${i}`}>{line}</li>
                          ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-500">—</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product List Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">
                  Product List
                </h3>
                {products?.length ? (
                  products.map((p, idx) => (
                    <div
                      key={p._id || idx}
                      className="grid grid-cols-12 gap-3 items-end"
                    >
                      <div className="col-span-1">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          S.No.
                        </label>
                        <div className="bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm text-center text-gray-700">
                          {idx + 1}
                        </div>
                      </div>

                      <div className="col-span-5">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Product Name
                        </label>
                        <div className="bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm text-gray-700">
                          {extractString(p.productName)}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Product Code
                        </label>
                        <div
                          className="bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm text-gray-700 truncate"
                          title={extractString(p.productCode || p.productId)}
                        >
                          {extractString(p.productCode || p.productId)}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Status
                        </label>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-2.5 text-sm text-center text-blue-700 font-semibold">
                          {extractString(p.status, "New")}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No products available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Design Assets */}
          <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
            <SectionHeader title="Design Assets Provided by Sales" />
            <div className="flex flex-wrap gap-3">
              {assetsList?.length ? (
                assetsList.map((asset, idx) => (
                  <button
                    key={`${asset.name}-${idx}`}
                    onClick={() => openAssetModal(asset.name)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    {asset.name}
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-4">
                  No assets found
                </div>
              )}
            </div>
          </div>

          {/* Asset Modal */}
          {assetModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop with stronger blur */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={closeAssetModal}
              />

              {/* Modal Content */}
              <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 leading-none">
                    {assetModal.assetName}
                  </h3>
                  <button
                    onClick={closeAssetModal}
                    className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full transition-all"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="flex items-center justify-center min-h-[400px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                    <div className="text-center">
                      <p className="text-gray-400 font-medium italic">
                        Previewing: {assetModal.assetName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 p-4 border-t bg-gray-50/80 backdrop-blur-sm">
                  <button
                    onClick={closeAssetModal}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => window.open(`#`, '_blank')}
                    className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95"
                  >
                    Download Asset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Accept / Decline - Only for Manager */}
          {isManager && (
            <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
              <SectionHeader title="Accept / Decline" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={decisionStatus}
                    onChange={(e) => setDecisionStatus(e.target.value)}
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
                <button
                  onClick={handleDecisionSave}
                  className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remark Modal */}
      <ReviewModal
        isOpen={remarkModal.isOpen}
        onClose={closeRemarkModal}
        title={remarkModal.title}
        remark={remarkModal.content}
        onSave={handleRemarkSave}
      />

      <PlanningLogModal
        isOpen={showPlanningLogModal}
        onClose={() => setShowPlanningLogModal(false)}
        logs={planningLogs}
      />

      {/* Discussion Log Modal */}
      <Dialog
        open={showDiscussionLogModal}
        onClose={() => setShowDiscussionLogModal(false)}
        className="relative z-50"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
      
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-6xl rounded-xl bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold text-gray-800">
                Complete Client Discussion Log
              </Dialog.Title>
              <button
                onClick={() => setShowDiscussionLogModal(false)}
                className="hover:bg-gray-200 rounded-full p-1.5 text-gray-600 hover:text-red-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
      
            {/* Table Container */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Scroll area */}
              <div className="max-h-[65vh] overflow-y-auto">
                <table className="min-w-screen text-sm text-left">
                  {/* STICKY HEADER */}
                  <thead className="bg-gray-800 text-white sticky top-0 z-20">
        <tr>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">S.NO</th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Date & Time
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Department
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Representative Name
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Designation
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Client Name
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Designation
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Discussion with Client
          </th>
          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
            Remarks
          </th>
        </tr>
      </thead>
      
      
                  {/* TABLE BODY */}
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {discussionLogs.map((log, index) => (
                      <tr
                        key={log.id || index}
                        className="hover:bg-gray-50 align-top transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {log.date}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {log.dept}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {log.repName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {log.designation}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {log.clientRepName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {log.clientDesignation}
                        </td>
                        <td className="px-4 py-3 text-gray-600 leading-relaxed">
                          {log.discussion}
                        </td>
                        <td className="px-4 py-3 text-gray-600 leading-relaxed">
                          {log.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      
            {/* Footer */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDiscussionLogModal(false)}
                className="bg-gray-700 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AssignedRecceDetailPage;