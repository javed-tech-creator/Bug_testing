import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "react-toastify";

// --- STATIC DATA FOR DEMO PURPOSES ---
const STATIC_RECCE_DETAILS = {
  clientId: {
    clientId: "CL-001",
    name: "Rakesh Patel",
    designation: "Owner",
    companyName: "Patel Electronics",
    phone: "9876543210",
    whatsapp: "9876543210",
    altPhone: "9123456789",
    email: "rakesh@patel.com",
    leadId: ["Retail"],
  },
  projectName: "LED Signage Installation",
  projectId: "PRJ-101",
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-01-16T14:00:00Z",
  discussionDone: "Pending",
  remarks: "Urgent visibility required",
  relationshipManager: "Amit Verma",
  dealBy: "Corporate Deal",
  products: [
    {
      productId: "PROD-001",
      productName: "LED Sign Board",
      category: "Outdoor",
      visibility: "One side",
      height: "4",
      width: "8",
      depth: "3",
      quantity: "1",
      light: "Lit",
      connection: "Main Line",
      layer: "Double",
      visDist: "30",
      heightRoad: "12",
    },
  ],
};

// --- REUSABLE UI COMPONENTS ---
const InputField = ({
  label,
  value,
  placeholder,
  type = "text",
  className = "",
  readOnly = true,
  onChange,
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={readOnly ? () => {} : onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none transition-all min-h-[48px]
      ${
        readOnly
          ? "bg-gray-50 cursor-not-allowed text-gray-600"
          : "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }`}
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  placeholder,
  rows = 3,
  className = "",
  readOnly = true,
  onChange,
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      value={value || ""}
      placeholder={placeholder}
      onChange={readOnly ? () => {} : onChange}
      rows={rows}
      readOnly={readOnly}
      className={`border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none resize-none transition-all
      ${
        readOnly
          ? "bg-gray-50 cursor-not-allowed text-gray-600"
          : "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }`}
    />
  </div>
);

const SelectField = ({
  label,
  options,
  value,
  className = "",
  disabled = true,
  onChange,
}) => (
  <div className={`flex flex-col relative ${className}`}>
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value || ""}
      onChange={disabled ? undefined : onChange}
      disabled={disabled}
      className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all min-h-[48px] w-full relative z-10"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const DimensionInput = ({
  label,
  value,
  unit,
  unitOptions,
  readOnly = true,
  onChange,
  onUnitChange,
}) => (
  <div className="flex flex-col w-full relative">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-2 w-full">
      <input
        type="text"
        value={value || ""}
        onChange={readOnly ? () => {} : onChange}
        readOnly={readOnly}
        className={`border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 flex-1 transition-all min-h-[48px]
        ${readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"}`}
      />
      <select
        value={unit}
        onChange={onUnitChange || (() => {})}
        className="border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white min-w-[80px] max-w-[100px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[48px] relative z-10"
      >
        {unitOptions.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const EnvButton = ({ label, value, onChange }) => (
  <div className="flex flex-col w-full">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex bg-gray-100 rounded-lg p-1.5 gap-1.5">
      {["High", "Medium", "Low"].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={`flex-1 text-sm py-2.5 rounded-md transition-all font-medium cursor-pointer whitespace-nowrap ${
            value === level
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function ProductRequirements() {
  const navigate = useNavigate();
  const [currentStep] = useState(1);

  const projectId = localStorage.getItem("active_recce_project_id");
  const productId = localStorage.getItem("active_product_id");
  const recceDetails = STATIC_RECCE_DETAILS;

  const [basicData, setBasicData] = useState({});
  const [contactData, setContactData] = useState({});
  const [projectData, setProjectData] = useState({});

  const [productDetails, setProductDetails] = useState(() => {
    const saved = localStorage.getItem("product_requirements_details");
    return saved ? JSON.parse(saved) : {};
  });

  const [envData, setEnvData] = useState(() => {
    const saved = localStorage.getItem("product_requirements_env");
    return saved
      ? JSON.parse(saved)
      : {
          sunlight: "",
          rain: "",
          wind: "",
          ambient: "",
          direction: "",
          compassImg: null,
          node: "",
        };
  });

  useEffect(() => {
    console.log("[UPDATED STATE] Product Details:", productDetails);
    const savedInLocal = localStorage.getItem("product_requirements_details");
    if (savedInLocal) {
      console.log("[LOCAL STORAGE] Saved Data:", JSON.parse(savedInLocal));
    }
  }, [productDetails]);

  useEffect(() => {
    localStorage.setItem("lastStep", "/recce/product-requirements");
    localStorage.setItem("current_product_status", "Draft");
  }, []);

  useEffect(() => {
    setProductDetails({
      category: "",
      prodName: "",
      prodCode: "",
      visibility: "",
      reqs: "",
      height: "",
      width: "",
      depth: "",
      qty: "",
      light: "",
      connection: "",
      layer: "",
      visDist: "",
      heightRoad: "",
      clientExpectations: "",
    });
  }, []);

  useEffect(() => {
    if (Object.keys(productDetails).length > 0) {
      localStorage.setItem(
        "product_requirements_details",
        JSON.stringify(productDetails),
      );
    }
  }, [productDetails]);

  useEffect(() => {
    if (Object.keys(envData).length > 0) {
      localStorage.setItem("product_requirements_env", JSON.stringify(envData));
    }
  }, [envData]);

  const renderStepper = () => {
    const steps = [1, 2, 3, 4];
    const currentStep = 1;

    return (
      <div className="flex items-center space-x-2 sm:space-x-3">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm transition-all duration-300 
                  ${
                    isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
              >
                {isCompleted ? <Check size={18} /> : step}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-1.5 rounded-full transition-all duration-300 
                    ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className=" bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">
              Step 1 – Product Requirements
            </h1>
          </div>

          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            {renderStepper()}
          </div>
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="space-y-6">
          {/* Onsite Protocol */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Onsite Protocol / Instructions
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="bg-blue-50 rounded-lg p-4 sm:p-5 border border-blue-100">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </span>
                    <span className="text-sm leading-relaxed">
                      Send "Recce In" message with GPS photo in DSS@Measurement
                      Communication Group.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </span>
                    <span className="text-sm leading-relaxed">
                      Take wide-angle photo of placement area with surroundings.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </span>
                    <span className="text-sm leading-relaxed">
                      Measure height, width, depth, and spacing from
                      surroundings.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      4
                    </span>
                    <span className="text-sm leading-relaxed">
                      Note footfall direction, sunlight angle, and visibility
                      obstructions.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      5
                    </span>
                    <span className="text-sm leading-relaxed">
                      Ask about lighting preferences, mockup expectations, and
                      size ideas.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      6
                    </span>
                    <span className="text-sm leading-relaxed">
                      Mark the area where the design will appear and photograph
                      it.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Environmental Conditions
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                <EnvButton
                  label="Sunlight Exposure"
                  value={envData.sunlight}
                  onChange={(val) => setEnvData({ ...envData, sunlight: val })}
                />
                <EnvButton
                  label="Rain Exposure"
                  value={envData.rain}
                  onChange={(val) => setEnvData({ ...envData, rain: val })}
                />
                <EnvButton
                  label="Wind Exposure"
                  value={envData.wind}
                  onChange={(val) => setEnvData({ ...envData, wind: val })}
                />
                <EnvButton
                  label="Ambient Light"
                  value={envData.ambient}
                  onChange={(val) => setEnvData({ ...envData, ambient: val })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Signage Direction
                  </label>
                  <input
                    type="text"
                    value={envData.direction || ""}
                    placeholder="e.g. North-East / Towards main road"
                    onChange={(e) =>
                      setEnvData({ ...envData, direction: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-[48px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Compass Screenshot
                  </label>

                  <label
                    htmlFor="compass-upload"
                    className="flex items-center justify-center border border-gray-300 rounded-lg px-4 h-[48px] cursor-pointer transition-all text-center"
                  >
                    <span className="text-sm font-semibold text-blue-600">
                      Click to upload
                    </span>
                    

                    {envData.compassImg && (
                      <span className="mt-2 text-xs text-green-600 font-medium">
                        {envData.compassImg.name}
                      </span>
                    )}
                  </label>

                  <input
                    id="compass-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setEnvData({
                        ...envData,
                        compassImg:
                          e.target.files && e.target.files.length > 0
                            ? e.target.files[0]
                            : null,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Environmental Note
                  </label>
                  <input
                    type="text"
                    value={envData.node || ""}
                    placeholder="e.g. Direct sunlight in afternoon, nearby trees present"
                    onChange={(e) =>
                      setEnvData({ ...envData, node: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-[48px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Product Requirements (Detailed)
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              {/* Client Requirements & Expectations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <TextAreaField
                  label="Client Requirements"
                  value={productDetails.reqs}
                  rows={4}
                  readOnly={false}
                  placeholder="Enter client requirements (material, size preference, budget, etc.)"
                  onChange={(e) =>
                    setProductDetails((prev) => ({
                      ...prev,
                      reqs: e.target.value,
                    }))
                  }
                />

                <TextAreaField
                  label="Client Expectations"
                  value={productDetails.clientExpectations}
                  rows={4}
                  readOnly={false}
                  placeholder="Enter client expectations (look & feel, visibility, color preference, etc.)"
                  onChange={(e) =>
                    setProductDetails((prev) => ({
                      ...prev,
                      clientExpectations: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Product Basic Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Product Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  <div className="relative z-40">
                    <SelectField
                      label="Product Category"
                      options={["Indoor", "Outdoor"]}
                      value={productDetails.category}
                      disabled={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative z-30">
                    <InputField
                      label="Product Name"
                      value={productDetails.prodName}
                      placeholder="e.g. LED Sign Board"
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          prodName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative z-20">
                    <InputField
                      label="Product Code"
                      value={productDetails.prodCode}
                      placeholder="e.g. PROD-001"
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          prodCode: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative z-10">
                    <SelectField
                      label="Visibility"
                      options={["One side", "Two side"]}
                      value={productDetails.visibility}
                      disabled={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          visibility: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="">
                <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5"></span>
                  Dimensions & Quantity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <DimensionInput
                      label="Height / Vertical"
                      value={productDetails.height}
                      unit="Feet"
                      unitOptions={["Feet", "Meter", "Inch"]}
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                    />
                    <DimensionInput
                      label="Width / Length"
                      value={productDetails.width}
                      unit="cm"
                      unitOptions={["cm", "Feet", "Meter", "Inch"]}
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          width: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <DimensionInput
                      label="Thickness / Depth"
                      value={productDetails.depth}
                      unit="Inch"
                      unitOptions={["Inch", "cm", "Feet"]}
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          depth: e.target.value,
                        }))
                      }
                    />
                    <InputField
                      label="Quantity"
                      value={productDetails.qty}
                      type="number"
                      placeholder="e.g. 1"
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          qty: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Additional Specifications */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Additional Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <div className="relative z-50">
                    <SelectField
                      label="Light Option"
                      options={["Lit", "Non-Lit"]}
                      value={productDetails.light}
                      disabled={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          light: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="relative z-40">
                    <SelectField
                      label="Layer Count"
                      options={["Single", "Double", "Triple"]}
                      value={productDetails.layer}
                      disabled={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          layer: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="relative z-30">
                    <InputField
                      label="Connection Point Details"
                      value={productDetails.connection}
                      placeholder="e.g. Main line from left side"
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          connection: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="relative z-20">
                    <DimensionInput
                      label="Visibility Distance"
                      value={productDetails.visDist}
                      unit="Feet"
                      unitOptions={["Feet", "Meter"]}
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          visDist: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="relative z-10">
                    <DimensionInput
                      label="Height from Road"
                      value={productDetails.heightRoad}
                      unit="Feet"
                      unitOptions={["Feet", "Meter"]}
                      readOnly={false}
                      onChange={(e) =>
                        setProductDetails((prev) => ({
                          ...prev,
                          heightRoad: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 py-4 mt-3 flex justify-end">
          <div className="flex flex-col sm:flex-row flex-wrap justify-end items-stretch sm:items-center gap-3">
            {/* <button
              onClick={() => navigate(`/recce/recce-details/${projectId}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer w-full sm:w-auto"
            >
              Previous
            </button>
            <button
              onClick={() => navigate(`/recce/recce-details/${projectId}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button> */}
            <button
              onClick={() => {
                const uploadStatus = localStorage.getItem(
                  "cloudinary_upload_status",
                );
                if (uploadStatus === "success") {
                  toast.success("✅ Files successfully uploaded to Cloudinary");
                } else if (uploadStatus === "uploading") {
                  toast.info("⏳ Files are uploading to Cloudinary...");
                } else if (uploadStatus === "failed") {
                  toast.error("❌ Cloudinary file upload failed");
                } else {
                  toast.warn("⚠️ No Cloudinary upload activity found");
                }
                navigate("/recce/visual-documentation");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer w-full sm:w-auto"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
