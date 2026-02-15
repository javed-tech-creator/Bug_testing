import React from "react";
import { useLocation, useParams } from "react-router-dom";
import DesignsHeader from "../../components/designs/DesignHeader";
import DesignOptionCard from "../../components/waiting-view-page/DesignOptionCard";
import DesignWaitingLogs from "../../components/waiting-view-page/DesignWaitingLogs";

const WaitingViewPage = () => {
  const { type, id } = useParams();
  const location = useLocation();

  const title = location.state?.title;

  const productDetails = {
    designId: "D-8226",
    productCode: "P-0976",
    productName: "LED Frontlit Board",
    projectCode: "PR-87432",
    projectName: "Main Signage Branding",
    clientCode: "CL-2981",
    clientName: "Abc Singh",
    companyName: "Abc Pvt Ltd",
  };
  const fields = [
    {
      label: "Design ID",
      key: "designId",
      required: true,
    },
    {
      label: "Product Code",
      key: "productCode",
    },
    {
      label: "Product Name",
      key: "productName",
    },
    {
      label: "Project Code",
      key: "projectCode",
    },
    {
      label: "Project Name",
      key: "projectName",
    },
    {
      label: "Client Code",
      key: "clientCode",
    },
    {
      label: "Client Name (as per Govt ID)",
      key: "clientName",
    },
    {
      label: "Company Name (Optional)",
      key: "companyName",
    },
  ];

  const designOptions = [
    {
      id: 1,
      optionLabel: "Design Option - 01",
      designTitle: "ABC Design",
      fontName: "Montserrat",
      colorsName: "Red, Blue, Green",
      litColorsName: "White",
      size: {
        width: "12 Inch",
        height: "1 Feet",
        depth: "4 CM",
      },
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in classical Latin literature.",
      images: {
        design: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        asset: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      },
    },
    {
      id: 2,
      optionLabel: "Design Option - 02",
      designTitle: "XYZ Branding",
      fontName: "Poppins",
      colorsName: "Black, Yellow",
      litColorsName: "Warm White",
      size: {
        width: "18 Inch",
        height: "2 Feet",
        depth: "5 CM",
      },
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: {
        design: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        asset: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      },
    },
    {
      id: 3,
      optionLabel: "Design Option - 03",
      designTitle: "Premium Signage",
      fontName: "Roboto",
      colorsName: "White, Blue",
      litColorsName: "Cool White",
      size: {
        width: "24 Inch",
        height: "3 Feet",
        depth: "6 CM",
      },
      description:
        "It is a long established fact that a reader will be distracted by readable content.",
      images: {
        design: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
        asset: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      },
    },
  ];

  const waitingLogsData = {
    designOptionId: 1,
    status: "Hold By Client",
    askingDate: "11/12/25 10:00 AM",
    waitingTime: "1 Day, 3 hrs, 44 Minutes",
    lastUpdated: "11/12/25 10:00 AM",
    discussions: [
      {
        date: "11/12/25 08:00 AM",
        summary:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
      },
      {
        date: "12/12/25 10:00 AM",
        summary:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
      },
    ],
    remark:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  };

  return (
    <div className="px-5">
      <DesignsHeader
        title={title}
        showDateFilter={false}
        showPriorityFilter={false}
        submissionDate="12/01/2025 - 11:00 AM"
        showDiscussionBtn={true}
        showSubmissionDate={true}
        onDiscussionClick={() => console.log("Open Discussion Logs")}
      />

      {/* Design basic details  */}
      <div className="bg-white border rounded-sm shadow-sm">
        {/* HEADER */}
        <div className="px-5 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Product Details
          </h3>
        </div>

        {/* BODY */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>

              <input
                value={productDetails[field.key]}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Design option card  */}
      {/* HEADER */}
      <div className="px-5 py-3 border rounded-t-sm shadow-sm  mt-5 bg-white">
        <h3 className="text-lg font-semibold text-gray-800">
          Design Options Details
        </h3>
      </div>
      <div className="space-y-6 mb-5">
        {designOptions.map((option) => (
          <DesignOptionCard key={option.id} data={option} />
        ))}
      </div>

      <DesignWaitingLogs waitingLogsData={waitingLogsData} />
    </div>
  );
};

export default WaitingViewPage;
