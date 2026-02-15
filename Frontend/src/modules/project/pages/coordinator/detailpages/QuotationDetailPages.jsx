import React, { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
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
import ClientDiscussionModal from "../../../../quotation/components/ClientDiscussionModal";
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
const QuotationDetailPages = () => {
  useParams();
  const navigate = useNavigate();

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientModalData, setClientModalData] = useState([]);

  const handleOpenClientLog = () => {
    setClientModalData(clientDiscussionMockData);
    setIsClientModalOpen(true);
  };

  //   const [checklist, setChecklist] = useState({
  //     "Environmental Conditions": false,
  //     "Product Requirements": true,
  //     "Uploaded Images": false,
  //     "Uploaded Videos": true,
  //     "Installation Details": false,
  //     "Raw Recce": true,
  //     "Data From Client": false,
  //     "Accurate Measurements Taken": true,
  //     "Instructions / Remarks": false,
  //     "All Signage Name (Product Name) Confirmed": true,
  //     "Submitted Same Day": false,
  //   });

  //   const [declaration, setDeclaration] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]); // images for current section
  const [modalImageIdx, setModalImageIdx] = useState(0); // index in modalImages
  // const [isReviewOpen, setIsReviewOpen] = useState(false);
  // const [reviewData, setReviewData] = useState({
  // remark: "",
  //   });
  //   const [formData, setFormData] = useState({
  //     rating: 0,
  //     comment: "",
  //     decision: "",
  //     declineRemark: "",
  //     flagType: "",
  //     flagRemark: "",
  //   });

  //   const toggleChecklistItem = (item) => {
  //     setChecklist((prev) => ({
  //       ...prev,
  //       [item]: !prev[item],
  //     }));
  //   };

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

  //   const handleOpenReview = () => {
  //     setIsReviewOpen(true);
  //   };

  //   const handleCloseReview = () => {
  //     setIsReviewOpen(false);
  //   };

  //   const handleSaveReview = (data) => {
  //     setReviewData(data);
  //     console.log("Review saved:", data);
  //   };

  //   const handleChange = (field, value) => {
  //     setFormData((prev) => ({ ...prev, [field]: value }));
  //   };

  //   const decisionColor = {
  //     accept: "bg-green-50 text-green-700 border-green-300",
  //     decline: "bg-red-50 text-red-700 border-red-300",
  //     flag: "bg-orange-50 text-orange-700 border-orange-300",
  //   };

  const stockImages = {
    exterior:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop",
    interior:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
  };

  const _statusDetailsMap = {
    flagRaised: {
      title: "Flag Raised",
      fields: [
        { label: "Flag Type", value: "High" },
        { label: "Date", value: "11/07/25 - 11:00AM" },
        { label: "Department", value: "Quotation" },
        { label: "Person Name", value: "Rahul Singh" },
        { label: "Designation", value: "Design Manager" },
        { label: "Remark", value: "Measurement mismatch" },
      ],
    },
    declined: {
      title: "Declined",
      fields: [
        { label: "Department", value: "Quotation" },
        { label: "Date", value: "11/07/25 - 11:00AM" },
        { label: "Person Name", value: "Rahul Singh" },
        { label: "Designation", value: "Design Manager" },
        { label: "Status", value: "Declined" },
        { label: "Remark", value: "Incomplete information" },
      ],
    },
    waiting: {
      title: "Waiting",
      fields: [
        { label: "Department", value: "Sales" },
        { label: "Date", value: "11/07/25 - 11:00AM" },
        { label: "Person Name", value: "Amit Verma" },
        { label: "Designation", value: "Sales Manager" },
        { label: "Status", value: "Waiting" },
        { label: "Remark", value: "Client approval pending" },
      ],
    },
    lost: {
      title: "Lost",
      fields: [
        { label: "Department", value: "Sales" },
        { label: "Person Name", value: "Sales Admin" },
        { label: "Date", value: "11/07/25 - 11:00AM" },
        { label: "Designation", value: "Sales" },
        { label: "Reason", value: "Client budget issue" },
      ],
    },
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
            {/* <button
                onClick={handleOpenReview}
                className="text-blue-500 flex items-center gap-1 text-xs font-medium hover:text-blue-700 transition-colors cursor-pointer"
                >
                <Edit3 size={14} /> Remark
                </button> */}
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
          <h1 className="font-bold text-lg">
            Design Measurement For Quotation
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            title="PSL"
            className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all"
            onClick={() => navigate("/project/psl")}
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
              {/*              
                <button
                     onClick={handleOpenReview}
                  className="text-blue-500 flex items-center gap-1 text-xs font-medium hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Edit3 size={14} /> Remark
                </button> */}
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

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
        <h2 className="font-bold text-sm mb-4">Submitted By</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <InputField label="Quotation Manager" value="Rahul Singh" />
          <InputField label="Branch" value="Chinnhat" />
          <InputField label="Assigned Date" value="11/07/25 - 11:00AM" />
          <InputField label="Deadline Date" value="11/07/25 - 11:00AM" />
        </div>
        <InputField
          label="Quotation Manager's Comment"
          value="All specs verified on-site. Proceed to design with client-approved colors"
        />
      </div>

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

      {/* <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm mb-4">
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
        </div> */}

      {/* Checklist, Declaration, Instruction, Receiver, and Feedback Panel sections commented out */}

      {/* <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={() => navigate("/quotation/assigned-quotations")}
        className="px-6 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={() => navigate("/quotation/received")}
        className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
      >
        Submit
      </button>
    </div> */}

      {/* <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Back
      </button>
    </div> */}

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

export default QuotationDetailPages;
