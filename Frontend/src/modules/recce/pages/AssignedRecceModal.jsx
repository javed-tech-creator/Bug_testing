import React, { useState } from "react";

const AssignedRecceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    executive: "Rahul Singh",
    branch: "Chinnhat",
    deadline: "11/07/25 - 11:00AM",
    priority: "1",
    comment:
      "All specs verified on-site. Proceed to design with client-approved colors",
  });

  const executives = [
    "Rahul Singh",
    "Priya Sharma",
    "Amit Kumar",
    "Neha Patel",
  ];
  const priorities = [
    { value: "1", label: "Priority 1 - Critical", color: "red" },
    { value: "2", label: "Priority 2 - High", color: "orange" },
    { value: "3", label: "Priority 3 - Medium", color: "yellow" },
    { value: "4", label: "Priority 4 - Low", color: "blue" },
    { value: "5", label: "Priority 5 - Minimal", color: "gray" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssign = () => {
    console.log("Assignment Data:", formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: "border-red-500 bg-red-50 text-red-700",
      2: "border-orange-500 bg-orange-50 text-orange-700",
      3: "border-yellow-500 bg-yellow-50 text-yellow-700",
      4: "border-blue-500 bg-blue-50 text-blue-700",
      5: "border-gray-500 bg-gray-50 text-gray-700",
    };
    return colors[priority] || colors["1"];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[75vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-0.5">
              Design Assignment
            </h2>
            <p className="text-slate-300 text-sm">
              Assign recce tasks to design executives
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="w-8 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 text-black rounded-md flex items-center justify-center transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Row 1: Executive and Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Designs Executive */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Design Executive
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.executive}
                    onChange={(e) =>
                      handleInputChange("executive", e.target.value)
                    }
                    className="w-full px-4 py-2.5 text-base text-slate-800 bg-white border-2 border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  >
                    {executives.map((exec) => (
                      <option key={exec} value={exec}>
                        {exec}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Branch Location
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  readOnly
                  className="w-full px-4 py-2.5 text-base text-slate-600 bg-slate-100 border-2 border-slate-200 rounded-xl cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Deadline and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Set Deadline */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Deadline
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) =>
                      handleInputChange("deadline", e.target.value)
                    }
                    className="w-full px-4 py-2.5 pr-12 text-base text-slate-800 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                    placeholder="MM/DD/YY - HH:MM AM/PM"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Set Priority Number */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Priority Level
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 text-base font-semibold border-2 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all duration-200 ${getPriorityColor(formData.priority)}`}
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Manager's Comment */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Design Manager's Comment
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 text-base text-slate-800 bg-white border-2 border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                placeholder="Enter any additional instructions or comments..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Provide specific instructions or requirements for the design
                executive
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span className="text-red-500">*</span> Required fields
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Assign Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedRecceModal;
