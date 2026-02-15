import React, { useState } from "react";
import DesignSimpleHeader from "../../components/designs/DesignSimpleHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/assign-view-page/ProductRequirementsDetailed";
import MockupStartedDetailsCard from "../../components/mockup-design/MockupStartedDetailsCard";
import { Check } from "lucide-react";

const designOptionsData = [
  {
    id: 1,
    optionNo: "01",
    selectionDate: "13/01/2025 - 12:00PM",
    submissionDate: "14/01/2025 - 03:30PM",
    selected: true,
    designTitle: "ABC Design",
    fontName: "Montserrat",
    colors: "Red, Blue, Green",
    litColors: "White",
    width: "12 Inch",
    height: "1 Feet",
    depth: "4 CM",
    clientfeedbackDate: "15/01/2025 - 10:15AM",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    clientFeedback:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://images.unsplash.com/photo-1581092588429-7d8a3e9f1b60",
    assetImage: "https://files.example.com/assets/supporting-assets.cdr", // ✅ CDR
  },
];

const designVersionOptionsData = [
  {
    id: 1,
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
    designImage: "https://files.example.com/designs/modern-glow.cdr", //  CDR
    assetImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

const dummyMockups = [
  {
    id: 1,
    mockupVersion: "01",
    submissionDate: "12/01/2025 - 11:00AM",
    selectedDate: "12/01/2025 - 11:00AM",
    approve: true,
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
];

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

const ReviewDesignSubmitPage = () => {
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

  const [checked, setChecked] = useState(false);

  const checklistData = [
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
  ];
  const [selectedChecklist, setSelectedChecklist] = useState(
    checklistData.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {})
  );

  const handleToggle = (item) => {
    setSelectedChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const navigate = useNavigate();
  const { id } = useParams();
  console.log("status, log", id);

  return (
    <div className="px-5">
      <DesignSimpleHeader
        title="Review & Submit Design Report"
        showLog={true}
        clientDiscussionLog={() => console.log("hellow")}
        CompletedOn="12/01/2025 - 11:00AM"
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

      {/* design option  */}
      <div className="space-y-4 mt-4">
        {designOptionsData.map((item) => (
          <MockupStartedDetailsCard
            title="Design Option"
            heading="Selected Design Option Details"
            key={item.id}
            data={item}
          />
        ))}
      </div>

      {/* design version  */}
      <div className="space-y-4 mt-4">
        {designVersionOptionsData.map((item) => (
          <MockupStartedDetailsCard
            title="Design Version"
            heading="Approved Design Detail"
            key={item.id}
            data={item}
          />
        ))}
      </div>

      {/* mockup  */}
      <div className=" mt-4 space-y-4  rounded-sm">
        {dummyMockups.map((mockup) => (
          <div
            key={mockup.id}
            className="bg-white border rounded-sm shadow-sm  space-y-4  relative"
          >
            {mockup?.approve && (
              <span className="bg-blue-500 rounded-sm absolute right-10 top-16 text-white px-3 py-1">
                Approve By Client
              </span>
            )}
            {/* Header */}
            <div className="flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold p-3">Upload Mockup</h2>

              <button className="px-3 py-2 mr-2 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-semibold">
                Media File
              </button>
            </div>

            {/* Version and Submission Date */}
            <div className="flex flex-wrap gap-3 items-center px-4">
              <span className="px-3 py-1 rounded bg-blue-200 text-blue-800 text-sm font-medium">
                Mockup Version - {mockup.mockupVersion}
              </span>
              <span className="px-3 py-1 rounded bg-orange-400 text-white text-sm font-semibold whitespace-nowrap">
                Submission Date: {mockup.submissionDate}
              </span>
              {mockup?.selectedDate && (
                <span className="px-3 py-1 rounded bg-orange-400 text-white text-sm font-semibold whitespace-nowrap">
                  Selection Date: {mockup.selectedDate}
                </span>
              )}
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
        ))}
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

          <style jsx>{`
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

      {/* Checklist */}
      <div className="rounded-sm shadow-sm border mt-4">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Design Executive Checklist</h2>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {checklistData.map((item, index) => {
            const isChecked = selectedChecklist[item];

            return (
              <div
                key={index}
                onClick={() => handleToggle(item)}
                className={`flex items-center gap-3 border rounded-sm px-3 py-2 cursor-pointer transition
        ${isChecked ? "bg-blue-50 border-blue-400" : "bg-gray-50"}
        `}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded-sm
          ${
            isChecked
              ? "bg-blue-500 border-blue-500"
              : "bg-white border-gray-400"
          }
          `}
                >
                  {isChecked && <Check size={14} className="text-white" />}
                </div>

                {/* Label */}
                <span className="text-sm font-medium text-gray-800">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="grid md:grid-cols-2 gap-6 items-center mt-4"> */}
      {/* Declaration Card */}
      <div className="bg-white mt-4 rounded-sm border border-gray-200 p-6 shadow-sm">
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

      {/* Action Buttons */}
      <div className="mt-4 flex justify-center md:justify-end border p-4 shadow-sm">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Cancel
          </button>

          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition">
            Save as Draft
          </button> */}

          <button
            disabled={!checked}
            className={`px-6 py-2 rounded-md font-medium text-white transition
          ${
            checked
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-300 cursor-not-allowed"
          }`}
          >
            Final Submit
          </button>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ReviewDesignSubmitPage;
