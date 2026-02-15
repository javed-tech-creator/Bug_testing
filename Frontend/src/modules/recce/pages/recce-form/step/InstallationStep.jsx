import React, { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Basic ObjectId validation
const isValidObjectId = (id) =>
  typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

const InstallationStep = () => {
  const navigate = useNavigate();

  // Use static saving state
  const [isSaving, setIsSaving] = useState(false);

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

  const [attemptedNext, setAttemptedNext] = useState(false);
  const [errors, setErrors] = useState({});

  // --- State Initialization with empty values ---
  const [formData, setFormData] = useState({
    ladder: "",
    bamboo: "",
    ironMs: "",
    tableStool: "",
    civilWork: "",
    fabrication: "",
    powerConnection: "",
    ladderNotes: "",
    bambooNotes: "",
    ironMsNotes: "",
    tableStoolNotes: "",
    surfaceType: "",
    surfaceCondition: "",
    textureNotes: "",
    stability: "",
    mountDescription: "",
    civilDescription: "",
    fabricationDescription: "",
    obstructions: "",
    otherNotes: "",
    switchboardDistance: "",
    cableRouteNotes: "",
    safetyNotes: "",
    clientRequirement: "",
    clientInstruction: "",
  });

  // (No static recceDetails, so skip recceId sync)

  // === UPDATE "LAST STEP" ===
  useEffect(() => {
    if (productInternalId) {
      localStorage.setItem("lastStep", "/recce/installation-step");
      localStorage.setItem("current_product_status", "Draft");
    }
  }, [productInternalId]);

  // Populate data from localStorage (draft) only
  useEffect(() => {
    if (!productInternalId) return;

    const savedLocal = localStorage.getItem(
      `installation_details_${productInternalId}`,
    );

    if (savedLocal) {
      setFormData(JSON.parse(savedLocal));
    }
  }, [productInternalId]);

  // Auto-save to localStorage on formData change
  useEffect(() => {
    if (productInternalId) {
      localStorage.setItem(
        `installation_details_${productInternalId}`,
        JSON.stringify(formData),
      );
    }
  }, [formData, productInternalId]);

  // --- Handlers ---
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error if exists
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["stability", "surfaceType", "surfaceCondition"];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = "Required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- DYNAMIC STEPPER COMPONENT ---
  const renderStepper = () => {
    const steps = [1, 2, 3, 4];
    const currentStep = 3;

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

  return (
    <div className="min-h-screen">
      {/* Top Header & Stepper */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            Step 3 – Installation Details
          </h1>
        </div>
        {renderStepper()}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Section: Wall & Surface Details */}
          <SectionCard title="Wall & Surface Details">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputGroup
                label="Surface Type / Base"
                name="surfaceType"
                value={formData.surfaceType}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
              />
              <InputGroup
                label="Surface Condition"
                name="surfaceCondition"
                value={formData.surfaceCondition}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
              />
            </div>
            <InputGroup
              label="Texture Notes"
              name="textureNotes"
              value={formData.textureNotes}
              onChange={handleChange}
              attemptedNext={attemptedNext}
              errors={errors}
              placeholder="e.g. Smooth / rough / tiled surface"
            />
          </SectionCard>

          {/* Section: Signage Stability */}
          <SectionCard title="Signage Stability">
            <div className="mb-12">
              <label className="block text-sm font-semibold mb-2">
                Stability
              </label>
              <select
                name="stability"
                value={formData.stability}
                onChange={(e) => handleChange("stability", e.target.value)}
                className={`w-full bg-gray-50 border rounded p-2.5 focus:outline-none focus:ring-2 ${
                  attemptedNext && errors["stability"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <option value="">Select Option</option>
                <option value="Mount">Mount</option>
                <option value="Hang">Hang</option>
                <option value="Stand">Stand</option>
              </select>
              {attemptedNext && errors["stability"] && (
                <p className="text-xs text-red-500 mt-1">
                  This field is required.
                </p>
              )}
            </div>

            <div className="mb-4">
              <InputGroup
                label="Mount Description"
                name="mountDescription"
                value={formData.mountDescription}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
                placeholder="e.g. Wall mounted with anchors"
              />
            </div>

            <div className="mb-6">
              <ToggleLabel
                label="Civil Work Required"
                name="civilWork"
                activeValue={formData.civilWork}
                onToggle={handleChange}
              />
              {formData.civilWork === "Yes" && (
                <div className="mt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Civil Work Description
                  </label>
                  <textarea
                    value={formData.civilDescription}
                    onChange={(e) =>
                      handleChange("civilDescription", e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-600 resize-none focus:outline-none focus:border-blue-500"
                    rows={2}
                    placeholder="Describe civil work details..."
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <ToggleLabel
                label="Fabrication Work Needed"
                name="fabrication"
                activeValue={formData.fabrication}
                onToggle={handleChange}
              />
              {formData.fabrication === "Yes" && (
                <div className="mt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Fabrication Work Description
                  </label>
                  <textarea
                    value={formData.fabricationDescription}
                    onChange={(e) =>
                      handleChange("fabricationDescription", e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-600 resize-none focus:outline-none focus:border-blue-500"
                    rows={2}
                    placeholder="Describe fabrication details..."
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Surrounding Obstructions
              </label>
              <textarea
                value={formData.obstructions}
                onChange={(e) => handleChange("obstructions", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-600 resize-none focus:outline-none focus:border-blue-500"
                rows={2}
                placeholder="List obstructions like electrical wires, awning, etc."
              />
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Section: Installation Equipment */}
          <SectionCard title="Installation Equipment">
            <div className="space-y-4">
              {/* Equipment Toggle Buttons - Single Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ToggleLabel
                  label="Ladder"
                  name="ladder"
                  activeValue={formData.ladder}
                  onToggle={handleChange}
                />
                <ToggleLabel
                  label="Bamboo (Paad)"
                  name="bamboo"
                  activeValue={formData.bamboo}
                  onToggle={handleChange}
                />
                <ToggleLabel
                  label="Iron MS"
                  name="ironMs"
                  activeValue={formData.ironMs}
                  onToggle={handleChange}
                />
                <ToggleLabel
                  label="Table-Stool"
                  name="tableStool"
                  activeValue={formData.tableStool}
                  onToggle={handleChange}
                />
              </div>

              {/* Conditional Notes - Each in its own container */}
              {(formData.ladder === "Yes" ||
                formData.bamboo === "Yes" ||
                formData.ironMs === "Yes" ||
                formData.tableStool === "Yes") && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Equipment Notes
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.ladder === "Yes" && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Ladder Notes
                        </label>
                        <textarea
                          value={formData.ladderNotes}
                          onChange={(e) =>
                            handleChange("ladderNotes", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Enter ladder related notes..."
                        />
                      </div>
                    )}

                    {formData.bamboo === "Yes" && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Bamboo (Paad) Notes
                        </label>
                        <textarea
                          value={formData.bambooNotes}
                          onChange={(e) =>
                            handleChange("bambooNotes", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Enter bamboo related notes..."
                        />
                      </div>
                    )}

                    {formData.ironMs === "Yes" && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Iron MS Notes
                        </label>
                        <textarea
                          value={formData.ironMsNotes}
                          onChange={(e) =>
                            handleChange("ironMsNotes", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Enter iron MS related notes..."
                        />
                      </div>
                    )}

                    {formData.tableStool === "Yes" && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Table-Stool Notes
                        </label>
                        <textarea
                          value={formData.tableStoolNotes}
                          onChange={(e) =>
                            handleChange("tableStoolNotes", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Enter table-stool related notes..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other Notes - Full Width with Divider */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Other Notes
                </label>
                <textarea
                  value={formData.otherNotes}
                  onChange={(e) => handleChange("otherNotes", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Enter any additional notes about installation equipment..."
                />
              </div>
            </div>
          </SectionCard>

          {/* Section: Electrical Requirements */}
          <SectionCard title="Electrical Requirements">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-1">
                <ToggleLabel
                  label="Power Connection Available"
                  name="powerConnection"
                  activeValue={formData.powerConnection}
                  onToggle={handleChange}
                />
              </div>
              <div className="col-span-1">
                <InputGroup
                  label="Switchboard Distance"
                  name="switchboardDistance"
                  value={formData.switchboardDistance}
                  onChange={handleChange}
                  attemptedNext={attemptedNext}
                  errors={errors}
                  placeholder="e.g. 5 ft"
                />
              </div>
            </div>

            <div className="space-y-4">
              <InputGroup
                label="Cable Route Notes"
                name="cableRouteNotes"
                value={formData.cableRouteNotes}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
                placeholder="e.g. Through right-side pillar"
              />
              <InputGroup
                label="Safety Notes"
                name="safetyNotes"
                value={formData.safetyNotes}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
                placeholder="e.g. Ensure proper insulation"
              />
              <InputGroup
                label="Requirement From Client"
                name="clientRequirement"
                value={formData.clientRequirement}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
                placeholder="Enter client specific requirements"
              />
              <InputGroup
                label="Instruction to Client"
                name="clientInstruction"
                value={formData.clientInstruction}
                onChange={handleChange}
                attemptedNext={attemptedNext}
                errors={errors}
                placeholder="Enter instructions for client"
              />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* --- Footer / Action Buttons --- */}
      <div className="max-w-full mx-auto mt-6 bg-white p-4 rounded-lg shadow-sm flex justify-between gap-3">
        <button
          onClick={() => navigate("/recce/visual-documentation")}
          className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded transition cursor-pointer"
        >
          Previous
        </button>
        {/* <button
          onClick={() =>
            navigate(
              `/recce/recce-details/${localStorage.getItem(
                "active_recce_project_id",
              )}`,
            )
          }
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded transition cursor-pointer"
        >
          Cancel
        </button> */}
        <button
          onClick={() => {
            setAttemptedNext(true);
            if (!validateForm()) return;

            setIsSaving(true);

            setTimeout(() => {
              localStorage.removeItem(
                `installation_details_${productInternalId}`,
              );
              toast.success(
                "Installation details saved successfully! (static)",
              );
              setIsSaving(false);
              navigate("/recce/data-instruction");
            }, 600);
          }}
          disabled={isSaving}
          className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition ${
            isSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Next Step
        </button>
      </div>

      {/* Spacer for bottom scrolling */}
      <div className="h-10"></div>
    </div>
  );
};

// --- Sub-Components (Modified for Controlled Input) ---

const SectionCard = ({ title, children }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm">
    <h2 className="text-sm font-bold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

const InputGroup = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  attemptedNext,
  errors,
}) => (
  <div className="w-full">
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <input
      name={name}
      value={value || ""} // Bind value to state
      onChange={(e) => onChange(name, e.target.value)} // Trigger state update
      type="text"
      placeholder={placeholder}
      className={`w-full bg-gray-50 border rounded p-2.5 text-gray-700 focus:outline-none focus:ring-2 ${
        attemptedNext && errors[name]
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-200 focus:ring-blue-500"
      }`}
    />
    {attemptedNext && errors[name] && (
      <p className="text-xs text-red-500 mt-1">This field is required.</p>
    )}
  </div>
);

const ToggleLabel = ({ label, name, activeValue, onToggle }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <div className="flex">
      <button
        onClick={() => onToggle(name, "Yes")}
        className={`px-4 py-1.5 text-sm font-medium rounded-l border border-r-0 transition-colors cursor-pointer ${
          activeValue === "Yes"
            ? "bg-blue-100 text-blue-700 border-blue-200"
            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
        }`}
      >
        Yes
      </button>
      <button
        onClick={() => onToggle(name, "No")}
        className={`px-4 py-1.5 text-sm font-medium rounded-r border transition-colors cursor-pointer ${
          activeValue === "No"
            ? "bg-blue-100 text-blue-700 border-blue-200"
            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
        }`}
      >
        No
      </button>
    </div>
  </div>
);

export default InstallationStep;
