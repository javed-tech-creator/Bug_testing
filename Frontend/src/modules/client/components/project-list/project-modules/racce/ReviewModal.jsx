import * as Icons from "lucide-react";
export default function ReviewModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">Review Panel</h2>
          <button onClick={onClose} className="bg-red-500 text-white p-1 rounded">
            <Icons.X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          <div>
            <label className="text-sm font-medium block mb-1">Status</label>
            <select className="w-full border rounded-md px-3 py-2 text-sm">
              <option>Modification Needed</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Remark</label>
            <div className="relative">
              <textarea
                rows="4"
                placeholder="in the abc product have some issues."
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
              <div className="absolute right-3 bottom-3 flex gap-2 text-lg">
                <span>➕</span>
                <span>🎤</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
            Save
          </button>
        </div>

      </div>
    </div>
  )
}
