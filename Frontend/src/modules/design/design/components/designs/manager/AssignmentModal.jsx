import React, { useRef, useState } from "react";
import { X, Calendar, ChevronDown, Info } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const executives = [
  { id: 1, name: "Er. Satya Prakash", branch: "Chinhat" },
  { id: 2, name: "Ramesh Gupta", branch: "Azamgarh" },
  { id: 3, name: "Javed Akhtar", branch: "Saraimeer" },
  { id: 4, name: "MD Suhel", branch: "Chinhat" },
];

const executiveWorkload = [
  {
    id: 1,
    name: "Er. Satya Prakash",
    designation: "Executive",
    branch: "Chinhat",
    totalAssigned: 200,
    ongoing: 200,
    completed: 200,
    pending: 200,
    load: "High",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Ramesh Gupta",
    designation: "Executive",
    branch: "Azamgarh",
    totalAssigned: 120,
    ongoing: 40,
    completed: 60,
    pending: 20,
    load: "Medium",
    image: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: 3,
    name: "Javed Akhtar",
    designation: "Executive",
    branch: "Saraimeer",
    totalAssigned: 120,
    ongoing: 40,
    completed: 60,
    pending: 20,
    load: "Low",
    image: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: 4,
    name: "MD Suhel",
    designation: "Executive",
    branch: "Chinhat",
    totalAssigned: 120,
    ongoing: 40,
    completed: 60,
    pending: 20,
    load: "High",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

const AssignmentModal = ({ isOpen, onClose, mode = "assign" }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [selected, setSelected] = useState("");
  const datePickerRef = useRef(null);
  const [deadline, setDeadline] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [assignTo, setAssignTo] = useState("executive"); // default executive
  const [reassignReason, setReassignReason] = useState("");

  console.log("deadline", deadline);
  const handleInfoClick = (id) => {
    console.log("Info icon clicked", id);
    const data = executiveWorkload.find((ex) => ex.id === id);
    setSelectedExecutive(data);
    setShowModal(true);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-[600px] rounded-lg shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-semibold">
            {mode === "reassign" ? "Reassignment Form" : "Assignment Form"}
          </h2>
          <button
            onClick={onClose}
            className="bg-red-600 cursor-pointer text-white rounded-full px-2 py-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Assign To */}
          <div>
            <label className="text-sm font-medium">Assign To</label>
            <select
              value={assignTo}
              onChange={(e) => {
                setAssignTo(e.target.value);
                if (e.target.value === "self") {
                  setSelected("");
                  setShowDropDown(false);
                }
              }}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="self">Self</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Row 1 */}
          {assignTo === "executive" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Executive */}
              <div>
                <label className="text-sm font-medium">
                  Select Design Executive
                </label>
                <div className="relative mt-1">
                  {/* Selected Box */}
                  <div
                    onClick={() => setShowDropDown(!showDropDown)}
                    className="w-full border rounded px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
                  >
                    <span className={selected ? "" : "text-gray-400"}>
                      {selected ? selected.name : "Select Design Executive"}
                    </span>
                    <ChevronDown size={16} />
                  </div>

                  {/* showDropDown List */}
                  {showDropDown && (
                    <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow">
                      {executives.map((ex) => (
                        <div
                          key={ex.id}
                          className="flex justify-between items-center px-3 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setSelected(ex);
                            setShowDropDown(!showDropDown);
                          }}
                        >
                          {/* Name → Select */}
                          <span className="cursor-pointer">{ex.name}</span>

                          {/* Info Icon → Only ID Pass */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // IMPORTANT
                              handleInfoClick(ex.id);
                            }}
                            className="bg-black text-white p-1 rounded-full hover:bg-gray-800 cursor-pointer"
                            title="More Info"
                          >
                            <Info size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className="text-sm font-medium">Branch</label>
                <input
                  value={selected?.branch || ""}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 mt-1"
                />
              </div>
            </div>
          )}

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Set Deadline</label>

              <div
                className="relative cursor-pointer rounded  border mt-1"
                onClick={() => datePickerRef.current?.setOpen(true)}
              >
                <DatePicker
                  selected={deadline}
                  ref={datePickerRef}
                  onChange={(date) => setDeadline(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  minDate={new Date()}
                  placeholderText="Select Deadline"
                  withPortal
                  popperPlacement="bottom-start"
                  className="w-full rounded px-3 py-2 cursor-pointer  focus:outline-none focus:ring-0  "
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-3 pointer-events-none text-gray-500"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm font-medium">Set Priority Number</label>
              <div className="relative mt-1">
                <select className="w-full border border-red-500 rounded px-3 py-2 appearance-none">
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-3 text-red-500"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div
            className={`grid gap-4 ${
              mode === "reassign" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* Design Manager Comment */}
            <div className={mode === "reassign" ? "" : "md:col-span-2"}>
              <label className="text-sm font-medium">
                Design Manager Comment
              </label>
              <textarea
                rows={3}
                placeholder="comments..."
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>

            {/* Reassignment Reason (only in reassign mode) */}
            {mode === "reassign" && (
              <div>
                <label className="text-sm font-medium text-red-600">
                  Reassignment Reason
                </label>
                <textarea
                  rows={3}
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  placeholder="Why are you reassigning this design?"
                  className="w-full border border-red-400 rounded px-3 py-2 mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <button
            onClick={onClose}
            className="bg-gray-600 cursor-pointer text-white px-4 py-1.5 rounded"
          >
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer">
            {mode === "reassign" ? "Reassign Now" : "Assign Now"}
          </button>
        </div>
      </div>

      {showModal && selectedExecutive && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[600px] rounded shadow relative">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="font-bold text-lg">Design Executive Workload</h2>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 text-white px-2 py-2 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4 px-5 py-4">
              <img
                src={selectedExecutive.image}
                className="w-20 h-20 rounded-full border-2 border-blue-400"
              />
              <div>
                <h3 className="font-bold">{selectedExecutive.name}</h3>
                <p className="text-xs text-gray-600">
                  Designation: {selectedExecutive.designation}
                </p>
                <p className="text-xs text-gray-600">
                  Branch: {selectedExecutive.branch}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 px-5 mt-2 pb-4">
              <StatBox
                title="Total Assigned"
                value={selectedExecutive.totalAssigned}
                color="blue"
              />
              <StatBox
                title="Ongoing Designs"
                value={selectedExecutive.ongoing}
                color="orange"
              />
              <StatBox
                title="Completed Designs"
                value={selectedExecutive.completed}
                color="green"
              />
              <StatBox
                title="Pending Designs"
                value={selectedExecutive.pending}
                color="red"
              />
            </div>

            {/* Load */}
            <div className="px-4 pb-4 flex items-center justify-center gap-2">
              <span className="font-medium">Current Load</span>
              <span className="bg-red-600 text-white text-sm px-3 py-1 rounded">
                {selectedExecutive.load}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ title, value, color }) => {
  const colorMap = {
    blue: "bg-blue-100 border-blue-400 text-blue-600",
    red: "bg-red-100 border-red-400 text-red-600",
    green: "bg-green-100 border-green-400 text-green-600",
    orange: "bg-orange-100 border-orange-400 text-orange-600",
  };

  return (
    <div className={`border rounded p-3 ${colorMap[color]}`}>
      <p className="text-sm font-bold">{title}</p>
      <p className={`text-2xl font-bold `}>{value}</p>
    </div>
  );
};

export default AssignmentModal;
