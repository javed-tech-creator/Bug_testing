import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Download, ChevronDown, Upload } from "lucide-react";

const EditableInput = React.memo(
  ({
    label,
    value,
    onChange,
    icon,
    className = "",
    placeholder = "Enter details...",
    type = "text",
    isTextArea = false,
  }) => (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[14px] font-semibold text-gray-900">{label}</label>
      <div className="relative w-full">
        {isTextArea ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-700 text-[15px] rounded-md px-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
        ) : (
          <input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-700 text-[15px] rounded-md px-4 py-3 h-[48px] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
        {icon && (
          <div className="absolute right-3 top-3.5 text-gray-500">{icon}</div>
        )}
      </div>
    </div>
  )
);

const PSLUpdatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "add";
  const isEdit = mode === "edit";

  // State for Product Info
  const [productInfo, setProductInfo] = useState({
    code: "P-0976",
    name: "LED Frontlit Board",
    projectCode: "PR-87432",
    projectName: "Main Signage Branding",
  });

  // State for Department Entries
  const [entries, setEntries] = useState([
    {
      id: 1,
      identifier: "Mr. Rahul Singh",
      category: "Design Measurement",
      problemName: "Design Size Deviation",
      description: "During the design stage, a mismatch was identified...",
      employee: "Mr. Aman Chauhan",
      reason: "Design Development",
      audio: "",
      isUpload: true,
      solution: "The design team coordinated with the site team...",
      learning: "This case reinforced the importance of confirming...",
    },
  ]);

  // Handle Text Change for Entries
  const handleEntryChange = (index, field, value) => {
    setEntries((prevEntries) => {
      const updated = [...prevEntries];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleRemoveEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Add New Entry Function
  const handleAddEntry = () => {
    const newId = Date.now();
    const newEntry = {
      id: newId,
      identifier: "",
      category: "",
      problemName: "",
      description: "",
      employee: "",
      reason: "",
      audio: "",
      isUpload: true,
      solution: "",
      learning: "",
    };
    setEntries([...entries, newEntry]);
  };

  return (
    <div className="min-h-screen  text-gray-900 pb-20">
      {/* ================= HEADER ================= */}
      <div className=" bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-6 py-4 max-w-full mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
            title="Back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">
            {isEdit
              ? "Update Problem - Solution - Learning"
              : "Add Problem - Solution - Learning"}
          </h1>
        </div>
      </div>

      {/* ================= MAIN BODY ================= */}
      <div className="max-w-full mx-auto py-8 space-y-8">
        {/* --- CARD 1: PRODUCT INFORMATION (Editable) --- */}
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <h2 className="text-[16px] font-bold text-gray-900">
              Product Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <EditableInput
                label="Product Code"
                value={productInfo.code}
                onChange={(val) => handleProductChange("code", val)}
              />
              <EditableInput
                label="Product Name"
                value={productInfo.name}
                onChange={(val) => handleProductChange("name", val)}
              />
              <EditableInput
                label="Project Code"
                value={productInfo.projectCode}
                onChange={(val) => handleProductChange("projectCode", val)}
              />
            </div>
            <div className="w-full md:w-1/3 pr-2">
              <EditableInput
                label="Project Name"
                value={productInfo.projectName}
                onChange={(val) => handleProductChange("projectName", val)}
              />
            </div>
          </div>
        </div>

        {/* --- CARD 2: DESIGN DEPARTMENT (Dynamic Entries) --- */}
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <h2 className="text-[16px] font-bold text-gray-900">
              Design Department
            </h2>
          </div>

          <div className="p-6 space-y-10">
            {entries.map((entry, index) => (
              <div key={entry.id} className="space-y-5">
                {/* Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">
                    S. No: {index + 1}
                  </span>

                  {entries.length > 1 && (
                    <button
                      onClick={() => handleRemoveEntry(entry.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold cursor-pointer"
                      title="Remove entry"
                    >
                      ❌
                    </button>
                  )}
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <EditableInput
                    label="Problem Identifier Name"
                    value={entry.identifier}
                    onChange={(val) =>
                      handleEntryChange(index, "identifier", val)
                    }
                  />
                  <EditableInput
                    label="Problem Category"
                    value={entry.category}
                    icon={<ChevronDown size={18} />}
                    onChange={(val) =>
                      handleEntryChange(index, "category", val)
                    }
                  />
                  <EditableInput
                    label="Problem Name"
                    value={entry.problemName}
                    onChange={(val) =>
                      handleEntryChange(index, "problemName", val)
                    }
                  />
                </div>

                {/* Row 2 - Description (Textarea) */}
                <EditableInput
                  label="Problem Description"
                  value={entry.description}
                  isTextArea={true}
                  onChange={(val) =>
                    handleEntryChange(index, "description", val)
                  }
                />

                {/* Row 3 - Employee & Audio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <EditableInput
                    label="Employee/Incident Name"
                    value={entry.employee}
                    onChange={(val) =>
                      handleEntryChange(index, "employee", val)
                    }
                  />
                  <EditableInput
                    label="Expected Reason"
                    value={entry.reason}
                    onChange={(val) => handleEntryChange(index, "reason", val)}
                  />

                  {/* Audio File Section */}
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[14px] font-semibold text-gray-900">
                      Upload Audio/Video
                    </label>
                    <div className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-700 text-[15px] rounded-md px-4 py-3 min-h-[48px] flex items-center justify-between shadow-sm">
                      <label className="w-full h-full flex items-center cursor-pointer text-gray-500 hover:text-blue-600 transition">
                        <span className="flex-1 truncate">
                          {entry.audio ? entry.audio : "Select Audio/Video File"}
                        </span>
                        <Upload size={18} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleEntryChange(index, "audio", file.name);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Row 4 & 5 - Solution & Learning (Textarea) */}
                <EditableInput
                  label="Solution Given"
                  value={entry.solution}
                  isTextArea={true}
                  onChange={(val) => handleEntryChange(index, "solution", val)}
                />
                <EditableInput
                  label="Learning Outcome"
                  value={entry.learning}
                  isTextArea={true}
                  onChange={(val) => handleEntryChange(index, "learning", val)}
                />

                {/* Separator between entries */}
                {index < entries.length - 1 && (
                  <hr className="border-gray-100 mt-8 mb-8" />
                )}
              </div>
            ))}

            {/* Add Button inside the card */}
            <div className="mt-6">
              <button
                onClick={handleAddEntry}
                className="px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ACTIONS --- */}
        <div className="flex justify-end gap-4 mt-8 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-600 text-white font-semibold text-sm rounded hover:bg-gray-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded hover:bg-blue-700 transition cursor-pointer">
            {isEdit ? "Update Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PSLUpdatePage;
