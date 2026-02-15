import { Dialog } from "@headlessui/react";
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useScheduleFollowUpMutation } from "@/api/sales/lead.api";
import { toast } from "react-toastify";

const ScheduleFollowUpModal = ({ isOpen, onClose, lead }) => {
  const [type, setType] = useState("Call");
  const [remark, setRemark] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [scheduleFollowUp, { isLoading }] = useScheduleFollowUpMutation();

  const handleSubmit = async () => {
    if (!selectedDate || !remark.trim()) {
      toast.warn("All fields required");
      return;
    }

    try {
      await scheduleFollowUp({
        leadId: lead,
        type,
        remark,
        followUpDateTime: selectedDate,
      }).unwrap();

      toast.success("Follow-up Scheduled Successfully");

      // reset fields
      setRemark("");
      setType("Call");
      setSelectedDate(new Date());

      onClose();
    } catch (err) {
      console.error(err);
      toast.warn(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={Boolean(isOpen)} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100 rounded-t-lg">
            <Dialog.Title className="text-lg font-semibold text-blue-600">
              Schedule Follow-up
            </Dialog.Title>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isLoading ? "Scheduling..." : "Schedule"}
              </button>

              <button
                onClick={onClose}
                className="h-8 w-8 cursor-pointer rounded-full bg-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* LEFT SIDE */}
            <div>
              {/* Type */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1">
                  Select Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option>Call</option>
                  <option>Whatsapp</option>
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  maxLength={300}
                  className="w-full border rounded-md p-3 h-60 resize-none"
                  placeholder="Add your remarks here..."
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {300 - remark.length} characters remaining
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - Inline Calendar */}
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                showTimeSelect
                timeIntervals={5}
                shouldCloseOnSelect={false}
                minDate={new Date()}
                calendarClassName="border-none"
              />

              <div className="mt-3 text-sm text-gray-600">
                Selected: {format(selectedDate, "PPPp")}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ScheduleFollowUpModal;
