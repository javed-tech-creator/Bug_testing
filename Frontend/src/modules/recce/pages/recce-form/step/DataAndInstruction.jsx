import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, X, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
// No API imports
import { toast } from "react-toastify";

// Basic ObjectId validation (unused, but can be left for now)
const isValidObjectId = (id) =>
  typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

const DataAndInstruction = () => {
  const navigate = useNavigate();

  // Get IDs from localStorage
  const projectId = localStorage.getItem("active_recce_project_id");
  const productId = localStorage.getItem("active_product_id");
  const productInternalId = localStorage.getItem(
    "active_recce_product_internal_id",
  );

  // State for recce ID
  const [recceId, setRecceId] = useState(
    localStorage.getItem("active_recce_detail_id") || null,
  );

  // Saving state (static)
  const [isSaving, setIsSaving] = useState(false);

  // --- State Initialization: EMPTY values only ---
  const [formData, setFormData] = useState({
    content: "",
    contentFile: "",
    logoOption: "",
    logoFile: "",
    logoDescription: "",
    fontType: "",
    fontFile: "",
    colorCombinations: [
      { id: Date.now(), text: "", code: "", ref: "", summary: "" },
    ],
    lightOption: "",
    lightColors: [{ id: Date.now(), color: "", ref: "", description: "" }],
    sampleSignage: "",
    clientRequirement: "",
    clientToInstall: "",
    clientToCompany: "",
    recceToDesign: "",
    recceToInstall: "",
    recceToCompany: "",
    otherRemark: "",
  });

  // === UPDATE "LAST STEP" FOR RESUME FEATURE ===
  useEffect(() => {
    if (productInternalId) {
      localStorage.setItem("lastStep", "/recce/data-instruction");
      localStorage.setItem("current_product_status", "Draft");
    }
  }, [productInternalId]);

  // Load data from localStorage only (no static fallback)
  useEffect(() => {
    if (!productInternalId) return;

    const savedLocal = localStorage.getItem(
      `data_instruction_${productInternalId}`,
    );

    if (savedLocal) {
      setFormData(JSON.parse(savedLocal));
    }
  }, [productInternalId]);

  // Auto-save form to localStorage
  useEffect(() => {
    if (productInternalId) {
      localStorage.setItem(
        `data_instruction_${productInternalId}`,
        JSON.stringify(formData),
      );
    }
  }, [formData, productInternalId]);

  // --- Handlers ---
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addColorCombo = () => {
    setFormData((prev) => ({
      ...prev,
      colorCombinations: [
        ...prev.colorCombinations,
        { id: Date.now(), text: "", code: "", ref: "", summary: "" },
      ],
    }));
  };
  const removeColorCombo = (index) => {
    const updated = formData.colorCombinations.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, colorCombinations: updated }));
  };
  const handleColorChange = (index, field, value) => {
    const updated = [...formData.colorCombinations];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, colorCombinations: updated }));
  };

  const addLightColor = () => {
    setFormData((prev) => ({
      ...prev,
      lightColors: [
        ...prev.lightColors,
        { id: Date.now(), color: "", ref: "", description: "" },
      ],
    }));
  };
  const removeLightColor = (index) => {
    const updated = formData.lightColors.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, lightColors: updated }));
  };
  const handleLightChange = (index, field, value) => {
    const updated = [...formData.lightColors];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, lightColors: updated }));
  };

  // --- DYNAMIC STEPPER COMPONENT ---
  const renderStepper = () => {
    const steps = [1, 2, 3, 4];
    const currentStep = 4;

    return (
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 
                  ${
                    isActive
                      ? "bg-blue-600 text-white ring-2 ring-blue-200"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
              >
                {isCompleted ? <Check size={16} /> : step}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-1 mx-1 rounded transition-colors duration-300 
                    ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // No loader condition, always render

  return (
    <div className="min-h-screen">
      {/* Top Header & Stepper */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            title="Back"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            Step 4 – Data & Instructions
          </h1>
        </div>
        {renderStepper()}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              Data From Client
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <InputGroup
                label="Content"
                placeholder="e.g. Brand name / shop name"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
              />
              <FileUploadGroup
                label="Content File (Optional)"
                onChange={(file) => handleChange("contentFile", file)}
              />

              {/* Logo Section - Full Width */}
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo Options Column */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700 text-xs md:text-sm">
                      Logo (CDR)
                    </label>
                    <div className="flex gap-2">
                      {["Yes", "No", "Want to Make"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleChange("logoOption", opt)}
                          className={`px-4 py-2 font-medium rounded text-xs border transition-colors cursor-pointer ${
                            formData.logoOption === opt
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Upload Logo - Below buttons */}
                    {formData.logoOption === "Yes" && (
                      <div className="mt-2">
                        <FileUploadGroup
                          label="Upload Logo"
                          onChange={(file) => handleChange("logoFile", file)}
                        />
                      </div>
                    )}

                    {/* Logo Description - Below buttons */}
                    {formData.logoOption === "Want to Make" && (
                      <div className="flex flex-col gap-1 mt-2">
                        <label className="font-semibold text-gray-700 text-xs md:text-sm">
                          Logo Description
                        </label>
                        <textarea
                          className="w-full h-[42px] p-2 border border-gray-200 rounded bg-white text-sm resize-none flex items-center"
                          rows={1}
                          placeholder="Describe logo requirement..."
                          value={formData.logoDescription}
                          onChange={(e) =>
                            handleChange("logoDescription", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Font Type Column - Aligned with Logo */}
                  <div className="flex flex-col gap-2">
                    <InputGroup
                      label="Font Type"
                      placeholder="e.g. Poppins, Roboto"
                      value={formData.fontType}
                      onChange={(e) => handleChange("fontType", e.target.value)}
                    />

                    {/* Upload Font - Below Font Type */}
                    <div className="mt-2">
                      <FileUploadGroup
                        label="Upload Font"
                        onChange={(file) => handleChange("fontFile", file)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-semibold text-gray-700 block border-b pb-1">
                Color Combinations
              </label>
              {formData.colorCombinations.map((combo, index) => (
                <div
                  key={combo.id}
                  className="p-4 border rounded bg-gray-50 relative"
                >
                  {formData.colorCombinations.length > 1 && (
                    <button
                      onClick={() => removeColorCombo(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-700 text-xs md:text-sm">
                        Color Combination (If want some specific)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-white text-sm"
                        placeholder="e.g. White background, Blue letters"
                        value={combo.text}
                        onChange={(e) =>
                          handleColorChange(index, "text", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup
                        label="Color Code"
                        value={combo.code}
                        onChange={(e) =>
                          handleColorChange(index, "code", e.target.value)
                        }
                      />
                      <FileUploadGroup
                        label="Color Reference"
                        onChange={(file) =>
                          handleColorChange(index, "ref", file)
                        }
                      />
                    </div>
                    {/* Summary */}
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-700 text-xs md:text-sm">
                        Summary
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-200 rounded bg-white text-sm resize-none"
                        rows={2}
                        placeholder="Enter color summary..."
                        value={combo.summary || ""}
                        onChange={(e) =>
                          handleColorChange(index, "summary", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addColorCombo}
                className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-xs font-medium cursor-pointer"
              >
                <Plus size={16} /> Add Color Combination
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-3">
              Light Option
            </h2>
            <div className="mb-4">
              <select
                className="w-full p-2 border rounded bg-gray-50"
                value={formData.lightOption}
                onChange={(e) => handleChange("lightOption", e.target.value)}
              >
                <option value="" disabled>
                  Select Light Option
                </option>
                <option value="Lit">Lit</option>
                <option value="Non-Lit">Non-Lit</option>
              </select>
            </div>
            <div className="space-y-4">
              {formData.lightColors.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border rounded bg-gray-50 relative"
                >
                  {formData.lightColors.length > 1 && (
                    <button
                      onClick={() => removeLightColor(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {formData.lightOption !== "Non-Lit" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <InputGroup
                        label="Light Color"
                        value={item.color}
                        onChange={(e) =>
                          handleLightChange(index, "color", e.target.value)
                        }
                      />
                      <FileUploadGroup
                        label="Light Color Ref"
                        onChange={(file) =>
                          handleLightChange(index, "ref", file)
                        }
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-700 text-xs">
                      Description
                    </label>
                    <textarea
                      className="p-2 border rounded bg-white text-gray-600 text-sm resize-none"
                      rows={2}
                      value={item.description}
                      onChange={(e) =>
                        handleLightChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              {formData.lightOption === "Lit" && (
                <button
                  onClick={addLightColor}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6 text-xs font-medium cursor-pointer"
                >
                  <Plus size={16} /> Add More Light Color
                </button>
              )}
            </div>
            <div className="mt-4">
              <FileUploadGroup
                label="Signage Sample"
                onChange={(file) => handleChange("sampleSignage", file)}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              Additional Instructions
            </h2>
            <div className="space-y-4">
              <TextAreaGroup
                label="Client's Requirement"
                placeholder="Enter client requirements / expectations"
                value={formData.clientRequirement}
                onChange={(e) =>
                  handleChange("clientRequirement", e.target.value)
                }
              />
              <TextAreaGroup
                label="Client to Installation Instructions"
                placeholder="Instructions client wants installer to follow"
                value={formData.clientToInstall}
                onChange={(e) =>
                  handleChange("clientToInstall", e.target.value)
                }
              />
              <TextAreaGroup
                label="Client to Company Instructions"
                placeholder="Instructions client wants company to follow"
                value={formData.clientToCompany}
                onChange={(e) =>
                  handleChange("clientToCompany", e.target.value)
                }
              />
              <TextAreaGroup
                label="Recce to Design Instructions"
                placeholder="Notes from recce team for design"
                value={formData.recceToDesign}
                onChange={(e) => handleChange("recceToDesign", e.target.value)}
              />
              <TextAreaGroup
                label="Recce to Installation Instructions"
                placeholder="Notes from recce team for installation"
                value={formData.recceToInstall}
                onChange={(e) => handleChange("recceToInstall", e.target.value)}
              />
              <TextAreaGroup
                label="Recce to Company Instructions"
                placeholder="Notes from recce team for company"
                value={formData.recceToCompany}
                onChange={(e) => handleChange("recceToCompany", e.target.value)}
              />
              <TextAreaGroup
                label="Other Remark"
                placeholder="Any additional remarks"
                value={formData.otherRemark}
                onChange={(e) => handleChange("otherRemark", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-full mx-auto mt-6 bg-white p-4 rounded-lg shadow-sm flex justify-between gap-3">
        <button
          onClick={() => navigate("/recce/installation-step")}
          className="bg-orange-400 text-white px-6 py-2 rounded font-semibold hover:bg-orange-500 transition cursor-pointer"
        >
          Back
        </button>
        {/* <button
          onClick={() =>
            navigate(
              `/recce/recce-details/${localStorage.getItem(
                "active_recce_project_id",
              )}`,
            )
          }
          className="bg-gray-600 text-white px-6 py-2 rounded font-semibold hover:bg-gray-700 transition cursor-pointer"
        >
          Cancel
        </button> */}
        <button
          onClick={() => {
            navigate(`/recce/review-submit/${recceId}`, {
              state: { from: "client-review" },
            });
          }}
          className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition cursor-pointer"
        >
          Preview & Submit
        </button>
      </div>
    </div>
  );
};

const InputGroup = ({ label, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="font-semibold text-gray-700 text-xs md:text-sm">
      {label}
    </label>
    <input
      type="text"
      className="w-full p-2.5 border border-gray-200 rounded bg-white focus:outline-none focus:border-blue-400 text-sm"
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

const TextAreaGroup = ({ label, value, placeholder, onChange }) => (
  <div className="border border-gray-200 rounded bg-gray-50 p-3">
    <h3 className="font-bold text-gray-800 mb-2 text-xs md:text-sm">{label}</h3>
    <textarea
      className="w-full p-2 border rounded bg-white text-gray-600 text-xs md:text-sm resize-none focus:outline-none focus:border-blue-400"
      rows={3}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

export default DataAndInstruction;

const FileUploadGroup = ({ label, onChange }) => {
  const [preview, setPreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (file) => {
    onChange(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-semibold text-gray-700 text-xs md:text-sm">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
        onChange={(e) => handleFileChange(e.target.files[0])}
      />

      {preview && (
        <div className="mt-2 border rounded bg-white p-2 w-fit">
          <img
            src={preview}
            alt="Preview"
            className="h-16 object-contain rounded mb-2"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition cursor-pointer"
            >
              Remove
            </button>
            <span className="text-xs text-gray-500">
              Select another file to replace
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
