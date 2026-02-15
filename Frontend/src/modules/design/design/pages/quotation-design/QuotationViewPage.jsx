import React, { useState } from "react";
import DesignSimpleHeader from "../../components/designs/DesignSimpleHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/assign-view-page/ProductRequirementsDetailed";
import MockupStartedDetailsCard from "../../components/mockup-design/MockupStartedDetailsCard";
import DesignMeasurementForm from "../../components/quotation/DesignMeasurementForm";

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
    designImage: "https://files.example.com/designs/modern-glow.cdr", // ✅ CDR
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

// Dummy data
const feedbacks = [
  {
    date: "12/01/2025 - 11:00AM",
    instruction:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature.",
  },
  {
    date: "12/02/2025 - 02:30PM",
    instruction:
      "Ensure all measurements are verified before sending to production.",
  },
];

const QuotationViewPage = () => {
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

  /* ================= Board State ================= */
  const [board, setBoard] = useState({
    thickness: "3",
    length: "10",
    height: "4",
    size: "40", // 10 * 4
  });

  /* ================= Letters State ================= */
  const [letters, setLetters] = useState([
    { letter: "A", length: "12", height: "8", thickness: "3", unit: "inch" },
    { letter: "B", length: "10", height: "6", thickness: "2", unit: "inch" },
    {
      letter: "Logo",
      length: "20",
      height: "15",
      thickness: "5",
      unit: "inch",
    },
  ]);

  const addLetterRow = () => {
    setLetters([
      ...letters,
      { letter: "", length: "", height: "", thickness: "", unit: "" },
    ]);
  };

  const removeLetterRow = (index) => {
    if (letters.length === 1) return;
    setLetters(letters.filter((_, i) => i !== index));
  };

  const updateLetter = (index, field, value) => {
    const updated = [...letters];
    updated[index][field] = value;
    setLetters(updated);
  };

  const navigate = useNavigate();
  const { status, id } = useParams();
  console.log("status, log", status, id);

  return (
    <div className="px-5">
      <DesignSimpleHeader
        title={
          status === "Started"
            ? "Design Measurement For Quotation"
            : "Submit Design Measurement For Quotation"
        }
        DesignMeasurementForQuotation="12/01/2025 - 11:00AM"
        showLog={true}
        clientDiscussionLog={() => console.log("hello")}
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

      {status === "Started" || status === "Modification Required" ? (
        <DesignMeasurementForm />
      ) : (
        <>
          <div className="bg-white p-4 rounded-sm border shadow space-y-6 mt-4">
            <h2 className="text-lg font-semibold border-b pb-4">
              Upload Design Measurement For Quotation
            </h2>

            <div className="flex justify-between">
              <button className="bg-yellow-500 text-white px-4 py-1.5 rounded">
                Submitted Date : 12/01/2025 - 11:00AM
              </button>

              <button className="bg-blue-500 text-white px-4 py-1.5 rounded">
                Design Measurement for Quotation Approved
              </button>
            </div>
            {/* ================= Upload Section ================= */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Design Measurement Box */}
              <div className="relative border border-green-500 rounded-sm p-2 flex flex-col items-center justify-center h-48">
                <img
                  src="https://plus.unsplash.com/premium_photo-1766408195454-7fc26af72ddf?q=80&w=778&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Design Preview"
                  className="w-full h-full object-cover rounded-sm"
                />
                <span className="absolute bottom-2 left-2 bg-blue-500 text-white font-normal px-3 py-1 rounded">
                  Design Measurement for Quotation
                </span>
              </div>

              {/* Supporting Assets Box */}
              <div className="relative border border-green-500 rounded-sm p-2 flex flex-col items-center justify-center h-48">
                <img
                  src="https://plus.unsplash.com/premium_photo-1766408195454-7fc26af72ddf?q=80&w=778&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Assets Preview"
                  className="w-full h-full object-cover rounded-sm"
                />
                <span className="absolute bottom-2 left-2 bg-blue-500 text-white font-normal px-3 py-1 rounded">
                  Supporting Assets
                </span>
              </div>
            </div>

            {/* ================= Board Measurement ================= */}
            <div>
              <h3 className="font-medium mb-2 border-y py-2">
                Design Measurement of Board
              </h3>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Thickness (MM)
                  </label>
                  <input
                    type="number"
                    value={board.thickness}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Length (Inch)</label>
                  <input
                    type="number"
                    value={board.length}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Height (Inch)</label>
                  <input
                    type="number"
                    value={board.height}
                    readOnly
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Size (Sq.Ft)</label>
                  <input
                    type="text"
                    value={board.size}
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

              {letters.map((row, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-5 gap-4 mb-3 items-end"
                >
                  <div>
                    <label className="text-sm text-gray-600">
                      Letter / Logo
                    </label>
                    <input
                      value={row.letter}
                      readOnly
                      className="input bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Length (inch)
                    </label>
                    <input
                      value={row.length}
                      readOnly
                      className="input bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Height (inch)
                    </label>
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

            {/* ================= Description ================= */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">
                  Design Description
                </label>
                <textarea
                  rows={4}
                  value="This is a dummy description showing material, lighting type, finish..."
                  readOnly
                  className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                />
              </div>

              <label className="border border-dashed rounded-lg p-6 cursor-pointer hover:border-blue-500">
                <p className="font-medium text-sm">Upload Audio / Video</p>
                <p className="text-xs text-gray-500">MP3, MP4, MOV</p>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  className="hidden"
                />
              </label>
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
          <div className="bg-white rounded-sm border space-y-4 p-4">
            <h2 className="text-lg font-semibold">Manager Feedback</h2>

            <div className="space-y-4">
              {feedbacks.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                >
                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Date
                    </label>
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

            {/* Buttons */}
            {/* <div className="flex justify-end gap-3 mt-6">
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={() =>
                  navigate(`/design/executive/designs/review-design-submit/${id}`)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
               Submit Design Report
              </button>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default QuotationViewPage;
