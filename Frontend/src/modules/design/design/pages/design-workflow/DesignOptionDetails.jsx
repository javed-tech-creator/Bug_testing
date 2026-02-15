import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/assign-view-page/ProductRequirementsDetailed";
import DesignsHeader from "../../components/designs/DesignHeader";
import DesignOptionDetailsCard from "../../components/design-workflow/DesignOptionDetailsCard";

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
    designImage: "https://files.example.com/designs/neon-art.cdr", // ✅ CDR
    assetImage: "https://files.example.com/assets/neon-assets.cdr", // ✅ CDR
  },
];                                         

const DesignOptionDetails = () => {
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

  const { id } = useParams();
  const location = useLocation();
  const title = location.state.title;
const navigate = useNavigate()
  return (
    <div className="px-5">
      <DesignsHeader
        title="Design Options Details"
        showDateFilter={false}
        showPriorityFilter={false}
        submissionDate="12/01/2025 - 11:00 AM"
        showDiscussionBtn={true}
        showSubmissionDate={true}
        onDiscussionClick={() => console.log("Open Discussion Logs")}
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
          <DesignOptionDetailsCard key={item.id} data={item} />
        ))}
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4 mt-4">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
          Client’s Instruction For Modification of Selected Design Option
        </h2>

        {/* Instruction Label */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instruction
        </label>

        {/* Instruction Box */}
        <div className="border rounded-md bg-gray-50 p-3 text-sm text-gray-600">
          The client has requested minor modifications in the selected design.
          Please adjust the color palette to a lighter tone, reduce the font
          size of the heading, and align the logo slightly towards the right. No
          changes are required in the overall layout or dimensions of the
          design.
        </div>
      </div>

      {/* Bottom Actions */}
      {/* <div className="flex justify-end gap-3 border p-4 rounded shadow mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded cursor-pointer"
        >
          Cancel
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded cursor-pointer">
          Submit Modified Design
        </button>
      </div> */}

      {/* <div className="flex justify-end gap-3 border p-4 rounded shadow mt-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded cursor-pointer"
        >
          Cancel
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded cursor-pointer">
          Upload Modified Design
        </button>
      </div> */}
    </div>
  );
};

export default DesignOptionDetails;
