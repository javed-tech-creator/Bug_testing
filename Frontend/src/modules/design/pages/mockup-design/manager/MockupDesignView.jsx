import { Input } from "@/modules/design/components/assign-view-page/ProductRequirementsDetailed";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import MockupStartedDetailsCard from "@/modules/design/components/mockup-design/MockupStartedDetailsCard";
import CommentWithMedia from "@/modules/design/components/recording/CommentWithMedia";
import React, { useState } from "react";

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
    id: 2,
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

const MockupDesignView = () => {
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

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

  return (
    <div className="px-5">
      <DesignsHeader
        title="Shared Design Mockup Detail"
        showDateFilter={false}
        showPriorityFilter={false}
        submissionDate="12/01/2025 - 11:00AM"
        showSubmissionDate={true}
        showDiscussionBtn={true}
        onDiscussionClick={() => console.log("clicked")}
      />

      <div className="bg-white  rounded-md border space-y-4 ">
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
        {designOptionsData.map((item) => (
          <MockupStartedDetailsCard
            title="Design Option"
            heading="Selected Design Option Details"
            key={item.id}
            data={item}
          />
        ))}
      </div>

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

      <div className=" mt-4 space-y-4  rounded-sm">
        {dummyMockups.map((mockup) => (
          <div
            key={mockup.id}
            className="bg-white border rounded-sm shadow-sm  space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold p-3">Uploaded Mockup</h2>

              <div className="flex gap-2 mr-2 ">
                <button className="px-4 py-2 text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                  Media File
                </button>

                {mockup.status === "pending" ? (
                  /* ACTION BUTTONS */
                  <div className="flex gap-2">
                    <button
                      // onClick={onApprove}
                      className="bg-green-500 hover:bg-green-600
          text-white text-sm px-3 py-1.5 rounded"
                    >
                      Mark as Approved
                    </button>

                    <button
                      // onClick={onModify}
                      className="bg-yellow-500 hover:bg-yellow-600
          text-white text-sm px-3 py-1.5 rounded"
                    >
                      Mark as Modification
                    </button>
                  </div>
                ) : (
                  /* STATUS BADGE */
                  <span
                    className={`px-4 py-1 rounded font-medium
          ${
            mockup.status === "approved"
              ? "bg-green-600 text-white"
              : "bg-yellow-600 text-white"
          }`}
                  >
                    {mockup.status === "approved"
                      ? "Approved"
                      : "Modification Required"}
                  </span>
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
        ))}
      </div>

      <CommentWithMedia
        title="Write Comment"
        placeholder="Type here..."
        value={comment}
        onChange={setComment}
        files={files}
        onFilesChange={setFiles}
      />

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 border p-4 rounded shadow mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded cursor-pointer"
        >
          Cancel
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded cursor-pointer">
          Reject
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded cursor-pointer">
          Send To Executive
        </button>
      </div>
    </div>
  );
};

export default MockupDesignView;
