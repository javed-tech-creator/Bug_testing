import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const MakePlanningModal = ({ isOpen, onClose, onSubmit }) => {
  // Local state for form fields
  const [formData, setFormData] = useState({
    status: "On Track",
    urgency: "High",
    deadline: "11/07/25 - 11:00AM",
    timeSlot: "10:30 AM",
    remark:
      "All specs verified on-site. Proceed to design with client-approved colors",
  });

  // Reset form when modal opens (optional)
  useEffect(() => {
    if (isOpen) {
      // You could reset data here if needed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Make Planning</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-[#B71C1C] hover:bg-red-800 text-white rounded transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Row 1: Status & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Planning Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Planning Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-2.5 bg-white border border-blue-500 rounded text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                  >
                    <option value="On Track">On Track</option>
                    <option value="Postponed By Company">
                      Postponed By Company
                    </option>
                    <option value="Postponed By Client">Postponed By Client</option>
                    <option value="Hold By Company">Hold By Company</option>
                    <option value="Hold By Client">Hold By Client</option>
                    <option value="Rejected By Client">Rejected By Client</option>
                    <option value="Rejected By Client">
                      Rejected By Client
                    </option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-600">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Set Urgency */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Set Urgency
                </label>
                <div className="relative">
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-2.5 bg-white border border-red-500 rounded text-[#D32F2F] font-medium focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#D32F2F]">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Set Deadline */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Set Deadline
              </label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Row 3: Select Time Slot */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Time Slot
              </label>
              <div className="relative">
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 4: Write Remark */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Write Remark
              </label>
              <textarea
                name="remark"
                rows={3}
                value={formData.remark}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-[#B71C1C] hover:bg-red-800 text-white font-medium rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium rounded transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakePlanningModal;
