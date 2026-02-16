import { Input } from "@/modules/design/components/assign-view-page/ProductRequirementsDetailed";
import DesignOptionDetailsCard, {
  ImageBox,
} from "@/modules/design/components/design-workflow/DesignOptionDetailsCard";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Star } from "lucide-react";
import ReviewDynamicForm from "@/modules/design/components/assign-view-page/ReviewDynamicForm";
import { useAddManagerDesignReviewRatingMutation } from "@/api/design/common_workflow/design-review/design-review.api";
import { toast } from "react-toastify";

const designOptionsData = [
  {
    id: 1,
    optionNo: "01",
    selectionDate: "13/01/2025 - 12:00PM",
    selected: true,
    designTitle: "ABC Design",
    fontName: "Montserrat",
    colors: "Red, Blue, Green",
    litColors: "White",
    width: "12 Inch",
    height: "1 Feet",
    depth: "4 CM",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://images.unsplash.com/photo-1581092588429-7d8a3e9f1b60",
    assetImage: "https://files.example.com/assets/supporting-assets.cdr", // ✅ CDR
  },
  {
    id: 2,
    optionNo: "02",
    selectionDate: "14/01/2025 - 03:30PM",
    selected: false,
    designTitle: "Modern Glow",
    fontName: "Poppins",
    colors: "Black, Yellow",
    litColors: "Warm White",
    width: "18 Inch",
    height: "2 Feet",
    depth: "5 CM",
    description: "Modern illuminated signage with premium acrylic finish.",
    designImage: "https://files.example.com/designs/modern-glow.cdr", // ✅ CDR
    assetImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 3,
    optionNo: "03",
    selectionDate: "15/01/2025 - 10:15AM",
    selected: false,
    designTitle: "Neon Art",
    fontName: "Roboto",
    colors: "Pink, Purple",
    litColors: "RGB",
    width: "24 Inch",
    height: "3 Feet",
    depth: "6 CM",
    description: "Creative neon style signage for modern storefronts.",
    designImage: "https://files.example.com/designs/neon-art.cdr", //  CDR
    assetImage: "https://files.example.com/assets/neon-assets.cdr", //  CDR
  },
];
const designVersionOptionsData = [
  {
    id: 5,
    optionNo: "01",
    submissionDate: "14/01/2025 - 03:30PM",
    selected: false,
    designTitle: "Modern Glow",
    fontName: "Poppins",
    colors: "Black, Yellow",
    litColors: "Warm White",
    width: "18 Inch",
    height: "2 Feet",
    depth: "5 CM",
    description: "Modern illuminated signage with premium acrylic finish.",
    clientfeedbackDate: "15/01/2025 - 10:15AM",
    approved: true,
    clientFeedback:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://files.example.com/designs/modern-glow.cdr", // ✅ CDR
    assetImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 6,
    optionNo: "02",
    submissionDate: "14/01/2025 - 03:30PM",
    selected: true,
    designTitle: "Modern Glow",
    fontName: "Poppins",
    colors: "Black, Yellow",
    litColors: "Warm White",
    width: "18 Inch",
    height: "2 Feet",
    depth: "5 CM",
    description: "Modern illuminated signage with premium acrylic finish.",
    clientfeedbackDate: "15/01/2025 - 10:15AM",
    approved: true,
    clientFeedback:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://files.example.com/designs/modern-glow.cdr", // ✅ CDR
    assetImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

const dummyMockups = [
  {
    id: 8,
    mockupVersion: "01",
    submissionDate: "12/01/2025 - 11:00AM",
    images: [
      {
        label: "Mockup Version - 01",
        url: "https://images.unsplash.com/photo-1590080877777-fc327d6e72c9?auto=format&fit=crop&w=400&q=80",
      },
      {
        label: "Supporting Assets",
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
      },
    ],
    shortDescription:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,",
    clientFeedback: {
      date: "12/01/2025 - 11:00AM",
      instruction:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from",
    },
  },
  {
    id: 9,
    mockupVersion: "02",
    submissionDate: "15/01/2025 - 09:00AM",
    images: [
      {
        label: "Mockup Version - 02",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80",
      },
      {
        label: "Supporting Assets",
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
      },
    ],
    shortDescription:
      "Here is another design description for mockup version 02 to show multiple data entries.",
    clientFeedback: {
      date: "15/01/2025 - 09:00AM",
      instruction:
        "Please review the assets and provide feedback on the layout and color scheme.",
    },
  },
  // Add more mockups as needed
];

// Dummy data
const designMeasurementDummy = {
  id: 15,
  status: "Approved By Client",
  submissionDate: "12/01/2025 - 11:00AM",
  approvedStatus: "Approved By Client",

  images: [
    {
      type: "measurement",
      label: "Design Measurement for Quotation",
      url: "https://plus.unsplash.com/premium_photo-1766408195454-7fc26af72ddf",
    },
    {
      type: "assets",
      label: "Supporting Assets",
      url: "https://plus.unsplash.com/premium_photo-1766408195454-7fc26af72ddf",
    },
  ],

  board: {
    thickness: "3",
    length: "10",
    height: "4",
    size: "40",
  },

  letters: [
    { letter: "A", length: "12", height: "8", thickness: "3", unit: "inch" },
    { letter: "B", length: "10", height: "6", thickness: "2", unit: "inch" },
    {
      letter: "Logo",
      length: "20",
      height: "15",
      thickness: "5",
      unit: "inch",
    },
  ],

  description:
    "This is a dummy description showing material, lighting type, finish...",

  managerFeedbacks: [
    {
      date: "12/01/2025 - 11:00AM",
      instruction:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    },
    {
      date: "12/02/2025 - 02:30PM",
      instruction:
        "Ensure all measurements are verified before sending to production.",
    },
  ],
};

const designChecklist = [
  { label: "Environmental Conditions", checked: true },
  { label: "Product Requirements", checked: true },
  { label: "Uploaded Images", checked: true },
  { label: "Uploaded Videos", checked: true },
  { label: "Installation Details", checked: true },
  { label: "Raw Recce", checked: true },
  { label: "Data From Client", checked: true },
  { label: "Accurate Measurements Taken", checked: true },
  { label: "Instructions / Remarks", checked: true },
  { label: "All Signage Name (Product Name) Confirmed", checked: true },
  { label: "Submitted Same Day", checked: true },
];

const managerChecklistInitial = [
  { key: "environment", label: "Environmental Conditions", checked: false },
  { key: "productReq", label: "Product Requirements", checked: false },
  { key: "images", label: "Uploaded Images", checked: false },
  { key: "videos", label: "Uploaded Videos", checked: false },
  { key: "installation", label: "Installation Details", checked: false },
  { key: "rawRecce", label: "Raw Recce", checked: false },
  { key: "clientData", label: "Data From Client", checked: false },
  { key: "measurement", label: "Accurate Measurements Taken", checked: false },
  {
    key: "productName",
    label: "All Signage Name (Product Name) Confirmed",
    checked: false,
  },
  { key: "instructions", label: "Instructions / Remarks", checked: false },
  { key: "sameDay", label: "Submitted Same Day", checked: false },
];

const ReviewDetails = () => {
  const [formData, setFormData] = useState({
    designId: "D-1001",
    productCode: "P-0976",
    productName: "LED Frontlit Board",
    projectCode: "PR-87432",
    projectName: "Main Signage Branding",
    clientCode: "CL-2981",
    clientName: "Abc Singh",
    companyName: "Abc Pvt Ltd",
  });

  const [formDataFeedback, setFormDataFeedback] = useState({
    rating: 0,
    comment: "",
    decision: "",
    // declineRemark: "",
    flagType: "",
    flagRemark: "",
  });

  const navigate = useNavigate();

  const [managerSubmitReview, { isUpdating }] = useAddManagerDesignReviewRatingMutation();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeDesignId, setActiveDesignId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [checked, setChecked] = useState(false);

  const [reviewData, setReviewData] = useState({});

  const handleOpenReview = (designId, sectionType) => {
    setActiveDesignId(designId);
    setIsReviewOpen(true);
    setActiveSection(sectionType);
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setActiveDesignId(null);
  };

  const handleSaveReview = ({ remark, rating }) => {
    setReviewData((prev) => ({
      ...prev,
      [activeSection]: { remark, rating },
    }));
  };
  const [managerChecklist, setManagerChecklist] = useState(
    managerChecklistInitial
  );

  const handleChecklistToggle = (index) => {
    setManagerChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleChange = (key, value) => {
    setFormDataFeedback((prev) => ({ ...prev, [key]: value }));
  };
  const decisionColor = {
    approve: "bg-green-100 text-green-700 border-green-400",
    // decline: "bg-red-100 text-red-700 border-red-400",
    flag: "bg-yellow-100 text-yellow-800 border-yellow-400",
  };

  const handleSubmit = async (e) => {
    try {
      const formattedCheckList = managerChecklist.map(item => ({
        label: item.label,
        is_checked: item?.checked
      }))

      // base feedback 
      let feedback = {
        rating: formDataFeedback?.rating,
        final_decision: formDataFeedback?.decision,
        remark: formDataFeedback?.comment
      }

      // attach the flag field if decision = flag
      if (formDataFeedback?.decision == "flag") {
        feedback = {
          ...feedback,
          flag_type: formDataFeedback?.flagType,
          flag_remark: formDataFeedback?.flagRemark,
        }
      }

      console.log('formattedCheckList:>', formattedCheckList)

      const payLoad = {
        measurement_submission_id: id,
        declaration: checked,
        checklist: formattedCheckList,
        feedback,
        design_option_remark: reviewData?.design_option || null,
        design_option_modification_remark: reviewData?.design_option_modification || null,
        design_mockup_remark: reviewData?.design_mockup ?? null,
        design_measurement_remark: reviewData?.design_measurement ?? null
      }
      console.log('payLoad:>', payLoad);

      const res = await managerSubmitReview({ data: payLoad }).unwrap();
      console.log("res:>", res)
      toast.success(res?.data?.message ?? res?.message ?? "Submitted successfully.");
    } catch (err) {
      console.log('err:>', err)
      toast.error(err?.error?.message ?? err?.data?.message ?? err?.message ?? "Failed to submit.")
    }

  };

  const { id } = useParams();
  // console.log("id, log", id);

  return (
    <div className="px-5">
      <DesignsHeader
        title="Design Report"
        showDateFilter={false}
        showPriorityFilter={false}
        showSubmissionDate={true}
        submissionDate="12/01/2025 - 11:00 AM"
        showDiscussionBtn={true}
        onDiscussionClick={() => console.log("Open Discussion Logs")}
      />
      {/* Product Details */}
      <div className="bg-white rounded-sm border space-y-4 ">
        <h2 className="text-lg font-semibold border-b px-4 py-2">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 pb-4">
          {/* Select Design ID */}
          <Input label="Design ID" value={formData.designId} />
          <Input label="Product Code" value={formData.productCode} />
          <Input label="Product Name" value={formData.productName} />
          <Input label="Project Code" value={formData.projectCode} />

          <Input label="Project Name" value={formData.projectName} />
          <Input label="Client Code" value={formData.clientCode} />
          <Input
            label="Client Name (as per Govt ID)"
            value={formData.clientName}
          />
          <Input label="Company Name (Optional)" value={formData.companyName} />
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {designOptionsData.map((data, index) => {
          const hasRemark = !!reviewData[data.id]?.remark;
          return (
            <div key={data.id} className="border rounded bg-white space-y-4">
              {/* Header */}

              <div className="flex justify-between items-center border-b bg-white rounded px-4 py-2">
                {/* Left Title */}
                <h2 className="text-lg font-semibold text-gray-800">
                  Design Options Details
                </h2>

                {/* Right Buttons */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                    Media File
                  </button>

                  {index === 0 && (
                    <button
                      onClick={() => handleOpenReview(data.id, "design_option")}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded-md font-medium transition
        ${hasRemark
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-blue-400 bg-blue-50 text-blue-600"
                        }`}
                    >
                      {hasRemark && (
                        <Check size={14} className="text-green-600 mt-[2px]" />
                      )}
                      <span>Remark</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center px-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">
                    Design Option - {data.optionNo}
                  </span>
                  {data.selectionDate && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                      Selection Date: {data.selectionDate}
                    </span>
                  )}
                </div>

                {data.selected && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Selected By Client
                  </span>
                )}
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                {/* Left Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Design Title" value={data.designTitle} />
                    <Input label="Font Name" value={data.fontName} />
                    <Input label="Colors Name" value={data.colors} />
                    <Input label="Lit Colors Name" value={data.litColors} />
                  </div>

                  {/* Size */}
                  <div>
                    <h4 className="font-semibold mb-2 border-b pb-2">
                      Size Specification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="Width" value={data.width} />
                      <Input label="Height" value={data.height} />
                      <Input label="Depth" value={data.depth} />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageBox
                    src={data.designImage}
                    label={`Design Option - ${data.optionNo}`}
                  />
                  <ImageBox src={data.assetImage} label="Supporting Assets" />
                </div>
              </div>

              {/* Description */}
              <div className="px-4 pb-4">
                <label className="font-medium text-sm">Short Description</label>
                <textarea
                  readOnly
                  rows={1}
                  value={data.description}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                />
              </div>
            </div>
          );
        })}

        <ReviewDynamicForm
          isOpen={isReviewOpen}
          onClose={handleCloseReview}
          title="Design Option Review"
          ratingNo={reviewData[activeSection]?.rating}
          remark={reviewData[activeSection]?.remark}
          onSave={handleSaveReview}
        />
      </div>

      <div className="space-y-4 mt-4">
        {designVersionOptionsData.map((data, index) => {
          const hasRemark = !!reviewData[data.id]?.remark;
          return (
            <div key={data.id} className="border rounded bg-white space-y-4">
              {/* Header */}

              <div className="flex justify-between items-center border-b bg-white rounded px-4 py-2">
                {/* Left Title */}
                <h2 className="text-lg font-semibold text-gray-800">
                  Design Modification Details
                </h2>

                {/* Right Buttons */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                    Media File
                  </button>

                  {index === 0 && (
                    <button
                      onClick={() => handleOpenReview(data.id, "design_option_modification")}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded-md font-medium transition
        ${hasRemark
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-blue-400 bg-blue-50 text-blue-600"
                        }`}
                    >
                      {hasRemark && (
                        <Check size={14} className="text-green-600 mt-[2px]" />
                      )}
                      <span>Remark</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center px-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">
                    Design Version - {data.optionNo}
                  </span>
                  {data.selectionDate && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                      Selection Date: {data.selectionDate}
                    </span>
                  )}
                </div>

                {data.selected && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Selected By Client
                  </span>
                )}
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                {/* Left Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Design Title" value={data.designTitle} />
                    <Input label="Font Name" value={data.fontName} />
                    <Input label="Colors Name" value={data.colors} />
                    <Input label="Lit Colors Name" value={data.litColors} />
                  </div>

                  {/* Size */}
                  <div>
                    <h4 className="font-semibold mb-2 border-b pb-2">
                      Size Specification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="Width" value={data.width} />
                      <Input label="Height" value={data.height} />
                      <Input label="Depth" value={data.depth} />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageBox
                    src={data.designImage}
                    label={`Design Option - ${data.optionNo}`}
                  />
                  <ImageBox src={data.assetImage} label="Supporting Assets" />
                </div>
              </div>

              {/* Description */}
              <div className="px-4 pb-4">
                <label className="font-medium text-sm">Short Description</label>
                <textarea
                  readOnly
                  rows={1}
                  value={data.description}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                />
              </div>
            </div>
          );
        })}
        <ReviewDynamicForm
          isOpen={isReviewOpen}
          onClose={handleCloseReview}
          title="Design Option Review"
          ratingNo={reviewData[activeSection]?.rating}
          remark={reviewData[activeSection]?.remark}
          onSave={handleSaveReview}
        />
      </div>

      <div className=" mt-4 space-y-4  rounded-sm">
        {dummyMockups.map((mockup, index) => {
          const hasRemark = !!reviewData[mockup.id]?.remark;
          return (
            <div
              key={mockup.id}
              className="bg-white border rounded-sm shadow-sm  space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold p-3"> Mockup Details</h2>

                <div className="flex gap-2 mr-2">
                  <button className="px-4 py-2 text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                    Media File
                  </button>

                  {index === 0 && (
                    <button
                      onClick={() => handleOpenReview(mockup.id, "design_mockup")}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded-md font-medium transition
        ${hasRemark
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-blue-400 bg-blue-50 text-blue-600"
                        }`}
                    >
                      {hasRemark && (
                        <Check size={14} className="text-green-600 mt-[2px]" />
                      )}
                      <span>Remark</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Version and Submission Date */}
              <div className="flex flex-wrap gap-3 items-center px-4">
                <span className="px-3 py-1 rounded bg-blue-200 text-blue-800 text-sm font-medium">
                  Mockup Version - {mockup.mockupVersion}
                </span>
                <span className="px-3 py-1 rounded bg-orange-400 text-white text-sm font-semibold whitespace-nowrap">
                  Submission Date: {mockup.submissionDate}
                </span>
              </div>

              {/* Images */}
              <div className="flex flex-wrap gap-4  px-4">
                {mockup.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative border border-green-500 rounded-md overflow-hidden w-[280px] h-[160px]"
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded">
                      {img.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Short Description */}
              <div className=" px-4 border">
                <label
                  htmlFor={`shortDescription-${mockup.id}`}
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Short Description
                </label>
                <textarea
                  id={`shortDescription-${mockup.id}`}
                  readOnly
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-700 resize-none bg-gray-100"
                  value={mockup.shortDescription}
                />
              </div>

              {/* Client Feedback */}
              <div className=" px-4 pb-4 border">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Client Feedback
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`feedbackDate-${mockup.id}`}
                      className="block mb-1 font-medium text-gray-600"
                    >
                      Date
                    </label>
                    <input
                      type="text"
                      id={`feedbackDate-${mockup.id}`}
                      readOnly
                      className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
                      value={mockup.clientFeedback.date}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`feedbackInstruction-${mockup.id}`}
                      className="block mb-1 font-medium text-gray-600"
                    >
                      Instruction
                    </label>
                    <input
                      type="text"
                      id={`feedbackInstruction-${mockup.id}`}
                      readOnly
                      className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
                      value={mockup.clientFeedback.instruction}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <ReviewDynamicForm
          isOpen={isReviewOpen}
          onClose={handleCloseReview}
          title="Design Option Review"
          ratingNo={reviewData[activeSection]?.rating}
          remark={reviewData[activeSection]?.remark}
          onSave={handleSaveReview}
        />
      </div>

      <div>
        <div className="bg-white p-4 rounded-t-sm border shadow space-y-6 mt-4">
          <div className="flex justify-between items-center border-b">
            <h2 className="text-lg font-semibold border-b pb-4">
              Design Measurement for Quotation Detail
            </h2>

            <div className="flex gap-2 mr-2">
              <button className="px-4 py-2 text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                Media File
              </button>

              <button
                onClick={() => handleOpenReview(designMeasurementDummy.id, "design_measurement")}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-md font-medium transition
        ${!!reviewData?.[designMeasurementDummy.id]?.remark
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-blue-400 bg-blue-50 text-blue-600"
                  }`}
              >
                {!!reviewData?.[designMeasurementDummy.id]?.remark && (
                  <Check size={14} className="text-green-600 mt-[2px]" />
                )}
                <span>Remark</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="bg-yellow-500 text-white px-4 py-1.5 rounded">
              Submitted Date : {designMeasurementDummy.submissionDate}
            </button>

            <button className="bg-blue-500 text-white px-4 py-1.5 rounded">
              {designMeasurementDummy.status}
            </button>
          </div>

          {/* ================= Upload Section ================= */}
          <div className="grid md:grid-cols-3 gap-6">
            {designMeasurementDummy.images.map((img, index) => (
              <div
                key={index}
                className="relative border border-green-500 rounded-sm p-2 h-48"
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover rounded-sm"
                />
                <span className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-1 rounded">
                  {img.label}
                </span>
              </div>
            ))}
          </div>

          {/* ================= Board Measurement ================= */}
          <div>
            <h3 className="font-medium mb-2 border-y py-2">
              Design Measurement of Board
            </h3>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600">Thickness (MM)</label>
                <input
                  type="number"
                  value={designMeasurementDummy.board.thickness}
                  readOnly
                  className="input bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Length (Inch)</label>
                <input
                  type="number"
                  value={designMeasurementDummy.board.length}
                  readOnly
                  className="input bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Height (Inch)</label>
                <input
                  type="number"
                  value={designMeasurementDummy.board.height}
                  readOnly
                  className="input bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Size (Sq.Ft)</label>
                <input
                  type="text"
                  value={designMeasurementDummy.board.size}
                  readOnly
                  className="input bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* ================= Letters ================= */}
          <div>
            <h3 className="font-medium mb-2 border-y py-2">
              Design Measurement of Letters
            </h3>

            {designMeasurementDummy.letters.map((row, index) => (
              <div
                key={index}
                className="grid md:grid-cols-5 gap-4 mb-3 items-end"
              >
                <div>
                  <label className="text-sm text-gray-600">Letter / Logo</label>
                  <input
                    value={row.letter}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Length (inch)</label>
                  <input
                    value={row.length}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Height (inch)</label>
                  <input
                    value={row.height}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Thickness (mm)
                  </label>
                  <input
                    value={row.thickness}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Unit</label>
                  <input
                    value={row.unit}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            ))}
          </div>

          <style jsx="true">{`
            .input {
              width: 100%;
              border: 1px solid #e5e7eb;
              padding: 0.5rem;
              border-radius: 0.375rem;
            }
          `}</style>
        </div>
        <div className="bg-white rounded-b-sm border space-y-4 p-4">
          <h2 className="text-lg font-semibold">Manager Feedback</h2>

          <div className="space-y-4">
            {designMeasurementDummy.managerFeedbacks.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
              >
                {/* Date */}
                <div>
                  <label className="text-sm font-medium block mb-1">Date</label>
                  <input
                    type="text"
                    value={item.date}
                    readOnly
                    className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Instruction */}
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Instruction
                  </label>
                  <textarea
                    value={item.instruction}
                    readOnly
                    rows={2}
                    className="w-full border border-gray-300 p-2 rounded bg-gray-100 resize-none cursor-not-allowed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mt-4">
        <h2 className="text-lg font-semibold mb-4">
          Design Executive Checklist
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {designChecklist.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border rounded-md px-4 py-3 bg-gray-50"
            >
              <input
                type="checkbox"
                checked={item.checked}
                disabled
                className="h-5 w-5 cursor-not-allowed accent-blue-600"
              />
              <span
                className={`text-sm font-medium ${item.checked ? "text-gray-900" : "text-gray-400"
                  }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mt-4">
        <h2 className="text-lg font-semibold mb-4">
          Manager Verification Checklist
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {managerChecklist.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center gap-3 border rounded-md px-4 py-3 transition
          ${item.checked ? "bg-green-50 border-green-400" : "bg-white"}
        `}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleChecklistToggle(index)}
                className="h-5 w-5 accent-green-600 cursor-pointer"
              />

              <span className="text-sm font-medium text-gray-800">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white my-4 rounded-sm shadow-sm border">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Submitted By</h2>
        </div>

        <div className="p-4 space-y-4 ">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Design Executive
              </label>
              <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                Rahul Singh
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                Chinhhat
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Submitted Date
              </label>
              <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                11/07/25 - 11:00 AM
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deadline Date
              </label>
              <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                11/07/25 - 11:00 AM
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Design Executive Comment
            </label>
            <div className="bg-gray-50 border rounded-sm p-3 text-sm text-gray-700">
              All specs verified on-site. Proceed to design with client-approved
              colors.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border  border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Declaration
        </h2>

        <label className="flex items-start gap-3 border border-gray-200 rounded-lg p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-5 w-5 accent-blue-600"
          />
          <span className="text-gray-700 text-sm leading-relaxed">
            I confirm that all measurements and photos are accurate and taken by
            me.
          </span>
        </label>
      </div>

      <div className="flex justify-end mt-4">
        <div className="rounded-sm shadow-sm border min-w-full">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              Design Manager Feedback Panel
            </h2>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* 📝 Comment – ALWAYS */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Design Manager Comment
              </label>
              <textarea
                value={formDataFeedback.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm"
                placeholder="Enter overall comment"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* ⭐ Rating – ALWAYS */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Remark Score
                </label>
                <div className="flex items-center justify-between bg-gray-50 border rounded-sm px-3 py-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        onClick={() => handleChange("rating", star)}
                        className={`cursor-pointer ${star <= formDataFeedback.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {formDataFeedback.rating}/5
                  </span>
                </div>
              </div>

              {/* Decision */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Final Decision
                </label>
                <select
                  value={formDataFeedback.decision}
                  onChange={(e) => handleChange("decision", e.target.value)}
                  className={`w-full border rounded-sm px-3 py-2 text-sm transition
    ${decisionColor[formDataFeedback.decision] ||
                    "bg-white text-gray-700 border-gray-300"
                    }
  `}
                >
                  <option value="">Select Decision</option>
                  <option value="approve">✅ Approve</option>
                  {/* <option value="decline">❌ Decline</option> */}
                  <option value="flag">🚩 Flag</option>
                </select>
              </div>
            </div>

            {/* Decline Remark */}
            {/* {formDataFeedback.decision === "decline" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Decline Remark
                  </label>
                  <textarea
                    value={formDataFeedback.declineRemark}
                    onChange={(e) =>
                      handleChange("declineRemark", e.target.value)
                    }
                    className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm"
                    placeholder="Enter decline reason"
                  />
                </div>
              )} */}

            {/* Flag Fields */}
            {formDataFeedback.decision === "flag" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Flag Type
                  </label>
                  <select
                    value={formDataFeedback.flagType}
                    onChange={(e) => handleChange("flagType", e.target.value)}
                    className="w-full border rounded-sm px-3 py-2 text-sm"
                  >
                    <option value="">Select Flag Type</option>
                    <option value="High Impact">🔴 High Impact</option>
                    <option value="Medium Impact">🟡 Medium Impact</option>
                    <option value="Low Impact">🟢 Low Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Flag Remark
                  </label>
                  <textarea
                    value={formDataFeedback.flagRemark}
                    onChange={(e) => handleChange("flagRemark", e.target.value)}
                    className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm"
                    placeholder="Enter flag remark"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm rounded-sm bg-gray-600 text-white"
            >
              Cancel
            </button>

            <button
              // onClick={() =>}
              className="px-4 py-2 text-sm rounded-sm bg-blue-600 text-white"
            >
              Print
            </button>

            <button
              onClick={(e) => { handleSubmit(e) }}
              disabled={
                !formDataFeedback.decision ||
                !formDataFeedback.rating ||
                !formDataFeedback.comment ||
                // (formDataFeedback.decision === "decline" &&
                //   !formDataFeedback.declineRemark) ||
                (formDataFeedback.decision === "flag" &&
                  (!formDataFeedback.flagType || !formDataFeedback.flagRemark))
              }
              className="px-4 py-2 text-sm rounded-sm bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
