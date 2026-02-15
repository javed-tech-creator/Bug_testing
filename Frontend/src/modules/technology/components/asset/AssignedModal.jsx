import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

export const ReassignmentsModal = ({ open, onClose, data }) => {
  return (
    <Transition appear show={open} as={Fragment}>
    <Dialog as="div" onClose={onClose} className="relative z-50">
  {/* Overlay */}
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
  </Transition.Child>

  {/* Modal Container */}
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-6 flex-shrink-0">
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            Assignment History
          </Dialog.Title>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-96 flex-1 mb-6">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left sticky top-0">
              <tr>
                <th className="px-4 py-3 border-b bg-gray-50">Status</th>
                <th className="px-4 py-3 border-b bg-gray-50">Date & Time</th>
                <th className="px-4 py-3 border-b bg-gray-50">Details</th>
              </tr>
            </thead>
            <tbody>
              {/* First row → Always current assignment */}
              {data?.assignedTo && (
                <tr className="hover:bg-gray-50 transition border-b">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      Assigned
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(data.assignedTo.date).toLocaleString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}{" "}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {data.assignedTo.department} — {data.assignedTo.name}{" "}
                    ({data.assignedTo.role})
                  </td>
                </tr>
              )}

              {/* Then reverse reassignments */}
              {data?.reassignments?.length > 0 ? (
                [...data.reassignments].reverse().map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        Reassigned
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(item.date).toLocaleString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}{" "}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.department} — {item.name} ({item.role})
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-6 text-center text-gray-400 italic"
                  >
                    📂 No reassignment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Transition.Child>
  </div>
</Dialog>
    </Transition>
  );
};
