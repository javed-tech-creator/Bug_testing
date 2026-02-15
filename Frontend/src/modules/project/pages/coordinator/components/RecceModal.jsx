import React, { useState } from "react";
import { X } from "lucide-react"; 
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const RecceModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // State for form fields
  const [formData, setFormData] = useState({
    manager: "Rahul Singh",
    branch: "Chinnhat",
    deadline: "2025-07-11T11:00", 
    urgency: "High",
    comment:
      "All specs verified on-site. Proceed to design with client-approved colors",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Send to Recce Department
          </h2>
          <button
            onClick={onClose}
            className="bg-red-700 hover:bg-red-800 text-white rounded px-3 py-1.5 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Grid for top inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manager Select */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">
                Select Recce Manager
              </label>
              <div className="relative">
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600 cursor-pointer"
                >
                  <option>Rahul Singh</option>
                  <option>Amit Kumar</option>
                  <option>Sarah Jenkins</option>
                </select>
                {/* Custom Chevron for aesthetics */}
                <div className="absolute right-3 top-4 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Branch (Read Only) */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                readOnly
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-600 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">
                Set Deadline
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Urgency (High Highlight) */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800">Set Urgency</label>
              <div className="relative">
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className={`w-full p-3 bg-white border rounded-md focus:outline-none appearance-none cursor-pointer ${
                    formData.urgency === "High"
                      ? "border-red-500 text-red-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <option className="text-gray-600">Low</option>
                  <option className="text-gray-600">Medium</option>
                  <option className="text-red-600">High</option>
                </select>
                <div className="absolute right-3 top-4 pointer-events-none">
                  <svg
                    className={`w-4 h-4 ${formData.urgency === "High" ? "text-red-500" : "text-gray-500"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Write Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white font-medium rounded shadow-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => navigate("/project/assigned-projects")}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm transition-colors cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecceModal;
