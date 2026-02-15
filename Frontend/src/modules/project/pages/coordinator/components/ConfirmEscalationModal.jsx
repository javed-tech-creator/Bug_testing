import React, { useState, useEffect } from "react";
import { X, AlertTriangle, ArrowRight } from "lucide-react";

const ConfirmEscalationModal = ({
  isOpen,
  onClose,
  onConfirm,
  fromDept = "Production",
  toDept = "Design Dept",
}) => {
  const [reason, setReason] = useState(
    "Specs need to be re-verified by Design as client is disputing the BOM.",
  );

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      // You can reset the reason here if you want it empty every time
      // setReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // You could add validation here if needed
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-opacity">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 transform scale-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-blue-600 tracking-tight">
              Confirm Escalation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 pt-2">
          {/* Flow Visual */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 flex items-center justify-between border border-gray-100">
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                FROM
              </span>
              <span className="text-lg font-bold text-gray-900">
                {fromDept}
              </span>
            </div>

            <div className="flex items-center justify-center px-4">
              <ArrowRight className="text-gray-400" size={20} />
            </div>

            <div className="flex flex-col items-center flex-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                TO
              </span>
              <span className="text-lg font-bold text-[#2563EB]">{toDept}</span>
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Reason for Escalation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full p-4 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
              placeholder="Enter the reason for escalation..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Confirm Escalation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEscalationModal;
