import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useGetBranchesQuery } from "@/api/admin/department-management/location-heirarchy/master.api";
import { useGetRegisteredUsersQuery } from "@/api/admin/user-management/user.management.api";
import { useAssignCoordinatorMutation } from "@/api/project/clientProjectMap.api";

const AssignCoOrdinatorModal = ({ open, onClose, onSubmit, title, client }) => {
  const [deadline, setDeadline] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [comment, setComment] = useState("");

  const { data: branchesData } = useGetBranchesQuery();
  const { data: usersData } = useGetRegisteredUsersQuery();
  const [assignCoordinator, { isLoading: assigning }] = useAssignCoordinatorMutation();

  useEffect(() => {
    // Reset when modal opens/closes
    if (!open) {
      setDeadline("");
      setCoordinatorId("");
      setBranchId("");
      setUrgency("Medium");
      setComment("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!client || !client._id) {
      toast.error("Client not selected");
      return;
    }

    try {
      const payload = {
        clientId: client._id,
        projectId: client.projectId || null,
        coordinatorId: coordinatorId || null,
        branch: branchId || null,
        deadline: deadline || null,
        urgency: urgency || null,
        comment: comment || null,
      };

      const res = await assignCoordinator(payload).unwrap();
      toast.success(res?.message || "Coordinator assigned successfully");
      onSubmit && onSubmit(res);
      onClose && onClose();
    } catch (err) {
      const message = err?.data?.message || err?.message || "Assignment failed";
      toast.error(message);
      console.error("Assign failed", err);
    }
  };

  return (
    <>
      {/* ===== MODAL BACKDROP ===== */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        {/* ===== MODAL CARD ===== */}
        <div className="bg-white w-full max-w-xl rounded-lg shadow-lg relative p-6">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 bg-red-600 text-white rounded px-2 py-1 text-sm"
            onClick={onClose}
          >
            <X />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-slate-800 mb-1">{title}</h2>

          <hr className="my-4 -mx-6 border-slate-200" />

          {/* ===== FORM ===== */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Select Co-Ordinator */}
            <div>
              <label className="block mb-1 font-medium">Select Project Co-Ordinator</label>
              <select
                value={coordinatorId}
                onChange={(e) => setCoordinatorId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Coordinator --</option>
                {usersData?.data?.users
                  ? usersData.data.users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name || u.userId || u.email}
                      </option>
                    ))
                  : usersData?.users?.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block mb-1  font-medium">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Branch --</option>
                {branchesData?.data
                  ? branchesData.data.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title || b.name}
                      </option>
                    ))
                  : branchesData?.branches?.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title}
                      </option>
                    ))}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block mb-1 font-medium">Set Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block mb-1 font-medium">Set Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            {/* Comment */}
            <div className="col-span-2">
              <label className="block mb-1  font-medium">Write Comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-slate-50 text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="All specs verified on-site. Proceed to design with client-approved colors"
              />
            </div>
          </div>

          {/* ===== ACTIONS ===== */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-5 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={assigning}
            >
              {assigning ? "Assigning..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignCoOrdinatorModal;