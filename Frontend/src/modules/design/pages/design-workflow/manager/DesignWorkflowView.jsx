import { Input } from "@/modules/design/components/assign-view-page/ProductRequirementsDetailed";
import CommentWithMedia from "@/modules/design/components/recording/CommentWithMedia";
import DesignOptionDetailsCard from "@/modules/design/components/design-workflow/DesignOptionDetailsCard";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getDesignWorkFlow } from "@/modules/design/config/DesignWorkFlow";

const designOptionsData = [
  {
    id: 1,
    optionNo: "01",
    // selectionDate: "13/01/2025 - 12:00PM",
    status: "pending",
    selected: false,
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
    // selectionDate: "14/01/2025 - 03:30PM",
    status: "pending",
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
    // selectionDate: "15/01/2025 - 10:15AM",
    status: "pending",
    selected: false,
    designTitle: "Neon Art",
    fontName: "Roboto",
    colors: "Pink, Purple",
    litColors: "RGB",
    width: "24 Inch",
    height: "3 Feet",
    depth: "6 CM",
    description: "Creative neon style signage for modern storefronts.",
    designImage: "https://files.example.com/designs/neon-art.cdr", // ✅ CDR
    assetImage: "https://files.example.com/assets/neon-assets.cdr", // ✅ CDR
  },
];
const DesignWorkflowView = () => {
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
    designOptionsData.map((item) => ({
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

  return (
    <div className="px-5">
      <DesignsHeader
        title="Shared Design Options Detail"
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
        {designOptions.map((item) => (
          <DesignOptionDetailsCard
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

export default DesignWorkflowView;
