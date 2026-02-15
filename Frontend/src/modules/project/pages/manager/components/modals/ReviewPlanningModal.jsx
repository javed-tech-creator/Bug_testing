import { X } from "lucide-react";

const ReviewPlanningModal = ({ open, onClose, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="
          bg-white
          w-full
          max-w-[520px]
          max-h-[90vh]
          rounded-lg
          shadow-lg
          flex
          flex-col
        "
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">
            Review Planning
          </h2>
          <button
            onClick={onClose}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* ===== BODY (SCROLLABLE) ===== */}
        <div className="px-6 py-5 text-sm overflow-y-auto flex-1 space-y-5">

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Project Status
              </label>
              <select className="w-full border border-blue-500 rounded-md px-3 py-2 bg-blue-50 text-blue-600">
                <option>On Track</option>
                <option>Hold By Client</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Urgency
              </label>
              <select className="w-full border border-red-500 rounded-md px-3 py-2 bg-red-50 text-red-600">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Deadline
              </label>
              <input
                readOnly
                value="11/07/25 - 11:00AM"
                className="w-full border rounded-md px-3 py-2 bg-slate-50"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Planned By
              </label>
              <input
                readOnly
                value="Abhay Yadav"
                className="w-full border rounded-md px-3 py-2 bg-slate-50"
              />
            </div>
          </div>

          {/* Planning Date */}
          <div>
            <label className="block mb-1 font-medium">
              Planning Date
            </label>
            <input
              readOnly
              value="11/07/25 - 11:00AM"
              className="w-full border rounded-md px-3 py-2 bg-slate-50"
            />
          </div>

          {/* Read-only Remark */}
          <div>
            <label className="block mb-1 font-medium">
              Remark
            </label>
            <textarea
              readOnly
              rows={3}
              value="All specs verified on-site. Proceed to design with client-approved colors"
              className="w-full border rounded-md px-3 py-2 bg-slate-50 resize-none"
            />
          </div>

          {/* ===== APPROVAL SECTION ===== */}
          <div className="pt-4 border-t space-y-4">
            <div>
              <label className="block mb-1 font-medium">
                Approval Status
              </label>
              <select className="w-full border border-blue-500 rounded-md px-3 py-2 bg-blue-50 text-blue-600">
                <option>Select Status</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Remark
              </label>
              <textarea
                rows={3}
                placeholder="Write your remark"
                className="w-full border rounded-md px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPlanningModal;
