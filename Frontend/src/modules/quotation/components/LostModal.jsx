import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const RequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedRow,
  loading = false,
}) => {
  const [remark, setRemark] = useState("");

  // Reset when modal closes or row changes
  useEffect(() => {
    if (!isOpen) setRemark("");
  }, [isOpen]);

  const handleSubmit = useCallback(() => {
    if (!remark.trim()) {
      toast.warn("Please enter a remark");
      return;
    }

    if (!selectedRow?._id) {
      toast.error("Invalid quotation selected");
      return;
    }

    onSubmit({
      quotationId: selectedRow._id,
      remark: remark.trim(),
    });
  }, [remark, selectedRow, onSubmit]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">

        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Request Modification
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <label className="text-sm font-medium block mb-1">
            Remark <span className="text-red-500">*</span>
          </label>

          <textarea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={loading}
            placeholder="Explain what modification you need..."
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-1.5 rounded-md border text-gray-600 hover:bg-gray-50 cursor-pointer" 
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
