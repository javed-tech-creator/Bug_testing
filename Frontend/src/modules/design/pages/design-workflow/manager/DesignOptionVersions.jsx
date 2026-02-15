import { Input } from "@/modules/design/components/assign-view-page/ProductRequirementsDetailed";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import MockupStartedDetailsCard from "@/modules/design/components/mockup-design/MockupStartedDetailsCard";
import CommentWithMedia from "@/modules/design/components/recording/CommentWithMedia";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

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

const DesignOptionVersions = () => {
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

  const [designOptions, setDesignOptions] = useState(
    designVersionOptionsData.map((item) => ({
      ...item,
      status: "pending", // pending | approved | modification
    }))
  );
  const updateDesignStatus = (id, status) => {
    setDesignOptions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status };
        }
        return { ...item, status: "pending" };
      })
    );
  };

  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    console.log("Comment:", comment);
    console.log("Files:", files);
  };

  const { id } = useParams();
  const location = useLocation();
  const title = location.state.title;

  return (
    <div className="px-5">
      <DesignsHeader
        title="Shared Option's Version Detail"
        showDateFilter={false}
        showPriorityFilter={false}
        submissionDate="12/01/2025 - 11:00AM"
        showSubmissionDate={true}
        showDiscussionBtn={true}
        onDiscussionClick={() => console.log("clicked")}
      />
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
        {designOptions.map((item) => (
          <MockupStartedDetailsCard
            title="Design Version"
            heading="Approved Design Detail"
            key={item.id}
            data={item}
            isStatus={true}
            onApprove={() => updateDesignStatus(item.id, "approved")}
            onModify={() => updateDesignStatus(item.id, "modification")}
          />
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

export default DesignOptionVersions;
