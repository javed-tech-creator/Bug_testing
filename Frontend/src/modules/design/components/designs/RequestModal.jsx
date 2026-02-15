import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const RequestModal = ({ isOpen, onClose, onSubmit, selectedRow }) => {
  const [remark, setRemark] = useState("");

  // Modal close/open hone par remark reset
  useEffect(() => {
    if (!isOpen) {
      setRemark("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!remark.trim()) {
      toast.warn("Please enter remark");
      return;
    }

    // remark parent ko bhej rahe
    onSubmit(remark);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Submit Request</h2>
          <button
            onClick={onClose}
            className="
    flex items-center justify-center
    w-7 h-7
    text-2xl font-medium
    text-gray-500
    bg-gray-100
    rounded-full
    hover:bg-gray-200
    hover:text-black
    transition
    cursor-pointer
  "
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Optional Row Info */}
          {selectedRow && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p>
                <b>Design ID:</b> {selectedRow.designId}
              </p>
              <p>
                <b>Order ID:</b> {selectedRow.orderId}
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1">
              Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your request remark..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
