import React, { useState } from "react";
import { useApplyLeaveMutation } from "@/api/hr/leave.api";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const leaveTypes = [
  "Casual",
  "Sick",
  "Earned",
  "Maternity",
  "Paternity",
  "Unpaid",
];

const ApplyLeaveModal = ({ isOpen, onClose, employeeId }) => {
  const [applyLeave, { isLoading }] = useApplyLeaveMutation();

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    description: "",
    breakDown: [],
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.leaveType) {
      toast.error("Please select a leave type");
      return;
    }
    if (!["Casual","Sick","Earned","Maternity","Paternity","Unpaid"].includes(form.leaveType)) {
      toast.error("Invalid leave type selected");
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    // Prevent past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(form.startDate) < today) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (new Date(form.endDate) < today) {
      toast.error("End date cannot be in the past");
      return;
    }

    if (!form.reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    if (form.reason.trim().length < 5) {
      toast.error("Reason must be at least 5 characters long");
      return;
    }

    if (form.description && form.description.trim().length > 0 && form.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters if provided");
      return;
    }
    if (/^\d+$/.test(form.reason.trim())) {
      toast.error("Reason cannot be only numbers");
      return;
    }
    try {
      await applyLeave({
        id: employeeId,
        formData: form,
      }).unwrap();

      toast.success("Leave applied successfully!");

      onClose(); // close modal
      setForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        description: "",
        breakDown: [],
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to apply leave");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-4 relative animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Apply for Leave
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Leave Type */}
          <div>
            <label className="text-sm font-medium">Leave Type</label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            >
              <option value="">Select Type</option>
              {leaveTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium">Reason</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Enter Your Reason"
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your leave..."
              className="w-full border rounded-lg px-3 py-2 mt-1 resize-none h-[42px]"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isLoading ? "Applying..." : "Apply Leave"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
