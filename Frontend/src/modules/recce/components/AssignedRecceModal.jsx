import React, { useState, useRef, useEffect } from "react";
import { X, Info, ChevronDown } from "lucide-react";
import { useGetDepartmentExecutivesQuery, useManagerAssignRecceMutation } from "@/api/recce/manager/request-all/request-all.api";
import { toast } from "react-toastify";


const AssignedRecceModal = ({ isOpen, onClose, recceData, variant = "reassignment" }) => {

  const recceDetailId = recceData?._id || recceData?.id;


  const [assignRecce, { isLoading }] = useManagerAssignRecceMutation();

  const [formData, setFormData] = useState({
    assignToType: "Self",
    selectedExecutiveId: "",
    branch: "",
    deadline: "",
    priority: "1",
    managerComment: "",
    reassignmentReason: ""
  });

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  // const selectedExec = MOCK_EXECUTIVES.find((ex) => ex.id === formData.selectedExecutiveId);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectExecutive = (exec) => {
    setFormData((prev) => ({
      ...prev,
      selectedExecutiveId: exec._id,
    }));
    setIsDropdownOpen(false);
  };

  const handleAssignToChange = (e) => {
    setFormData({
      ...formData,
      assignToType: e.target.value,
      selectedExecutiveId: "",
      branch: ""
    });
  };

  const isAssignment = variant === "assignment";




  // ====================================== [api related start] ==============================


  const handleSubmitAssignment = async () => {
    try {
      if (!recceDetailId) {
        toast.error("Recce ID not found");
        return;
      }

      if (!formData.deadline) {
        toast.error("Please select a deadline");
        return;
      }

      let payload = {
        recce_detail_id: recceDetailId, // pass this as prop to modal
        assignment_type:
          formData.assignToType === "Self" ? "self" : "executive",
        deadline: new Date(formData.deadline).toISOString(),
        priority_number: Number(formData.priority),
        recce_manager_comment: formData.managerComment,
      };

      // If Executive selected
      if (formData.assignToType === "Executive") {
        if (!formData.selectedExecutiveId) {
          toast.error("Please select an executive");
          return;
        }

        payload.assigned_to = formData.selectedExecutiveId;
      }

      await assignRecce(payload).unwrap();

      toast.success("Recce assigned successfully");
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message ||
        error?.error?.message ||
        "Assignment failed"
      );
    }
  };

  const {
    data: executivesResponse,
    isLoading: execLoading,
    error: execError,
  } = useGetDepartmentExecutivesQuery(undefined, {
    skip: !isOpen, //  important
  });


  const executives =
    executivesResponse?.data?.users?.filter(
      (user) => user?.designation?.title === "Executive"
    ) ?? [];


  const selectedExec = executives.find(
    (ex) => ex._id === formData.selectedExecutiveId
  );



  // ====================================== [api related end] ==============================


  
  if (!isOpen) return null; 

  return (
    <>
      {/* MAIN REASSIGNMENT FORM MODAL */}
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
          {/* Main Form Header */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {isAssignment ? "Assignment Form" : "Reassignment Form"}
            </h2>
            <button
              onClick={onClose}
              className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-4 space-y-3">
            {/* 1. Assign To Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">Assign To</label>
              <select
                value={formData.assignToType}
                onChange={handleAssignToChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="Self">Self</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            {/* 2. Select Executive & Branch (only show when Executive is selected) */}
            {formData.assignToType === "Executive" && (
              <div className="grid grid-cols-2 gap-3">
                {/* Executive Selection Dropdown with Info Icon */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">
                    Select Recce Executive
                  </label>
                  <div className="flex items-stretch border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex-1 px-3 py-1.5 text-left text-sm text-gray-700 outline-none flex justify-between items-center"
                    >
                      <span className={selectedExec ? "text-gray-900" : "text-gray-400"}>
                        {selectedExec ? selectedExec.name : "Select Recce Executive"}
                      </span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {/* Info Icon Button */}
                    <button
                      type="button"
                      disabled={!selectedExec}
                      onClick={() => setIsInfoOpen(true)}
                      className={`px-2.5 border-l border-gray-300 transition-colors ${selectedExec
                        ? "text-blue-600 hover:bg-blue-50 cursor-pointer"
                        : "text-gray-300 cursor-not-allowed bg-gray-50"
                        }`}
                    >
                      <Info size={18} />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">

                      {execError ? (
                        <div className="px-3 py-2 text-sm text-red-500">
                          Failed to load executives
                        </div>
                      ) : execLoading ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : executives.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No Executives Found
                        </div>
                      ) : (
                        executives.map((exec) => (
                          <div
                            key={exec._id}
                            onClick={() => handleSelectExecutive(exec)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs font-medium text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-semibold text-sm">{exec.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {exec.designation?.title}
                            </div>
                          </div>
                        ))
                      )}


                    </div>
                  )}
                </div>

                {/* Branch Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    disabled
                    placeholder="Auto-filled"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* 3. Deadline and Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Set Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  placeholder="Select Deadline"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Set Priority Number</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            {/* 4. Recce Manager Comment */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">Recce Manager Comment</label>
              <textarea
                value={formData.managerComment}
                onChange={(e) => setFormData({ ...formData, managerComment: e.target.value })}
                placeholder="comments..."
                rows="3"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* 5. Reassignment Reason (Remark) */}
            {!isAssignment && (
              <div>
                <label className="block text-xs font-bold text-red-600 mb-1.5">Reassignment Reason</label>
                <textarea
                  value={formData.reassignmentReason}
                  onChange={(e) => setFormData({ ...formData, reassignmentReason: e.target.value })}
                  placeholder="Why are you reassigning this recce?"
                  rows="3"
                  className="w-full px-3 py-1.5 text-sm border border-red-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-sm bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"

                onClick={handleSubmitAssignment}
                disabled={isLoading}
              >
                {isLoading ? "Assigning..." : "Assign Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE INFO POPUP (Separate Overlay) */}
      {isInfoOpen && selectedExec && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] relative p-4 animate-in zoom-in duration-200">

            {/* Close Circle Button */}
            <button
              onClick={() => setIsInfoOpen(false)}
              className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Header Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recce Executive Workload</h3>

            {/* Profile Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
                <img src={selectedExec.pic} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 leading-tight">{selectedExec.name}</h4>
                <p className="text-xs text-gray-600">Designation: {selectedExec.designation}</p>
                <p className="text-xs text-gray-600">Branch: {selectedExec.branch}</p>
              </div>
            </div>

            {/* Workload Stats Grid (2x2) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Box 1: Blue - Total Assigned */}
              <div className="bg-[#dbeafe] border border-blue-300 rounded-lg p-3">
                <p className="text-blue-700 font-bold text-xs mb-1">Total Assigned</p>
                <p className="text-blue-700 text-3xl font-bold">{selectedExec.totalAssigned}</p>
              </div>

              {/* Box 2: Orange - Ongoing */}
              <div className="bg-[#fed7aa] border border-orange-300 rounded-lg p-3">
                <p className="text-orange-700 font-bold text-xs mb-1">Ongoing Recce</p>
                <p className="text-orange-700 text-3xl font-bold">{selectedExec.ongoing}</p>
              </div>

              {/* Box 3: Green - Completed */}
              <div className="bg-[#bbf7d0] border border-green-300 rounded-lg p-3">
                <p className="text-green-700 font-bold text-xs mb-1">Completed Recce</p>
                <p className="text-green-700 text-3xl font-bold">{selectedExec.completed}</p>
              </div>

              {/* Box 4: Red - Pending */}
              <div className="bg-[#fecaca] border border-red-300 rounded-lg p-3">
                <p className="text-red-700 font-bold text-xs mb-1">Pending Recce</p>
                <p className="text-red-700 text-3xl font-bold">{selectedExec.pending}</p>
              </div>
            </div>

            {/* Current Load Section (Centered) */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-200">
              <span className="text-base font-bold text-gray-900">Current Load</span>
              <span className={`px-4 py-1 rounded-md text-sm font-bold text-white ${selectedExec.currentLoad === "High" ? "bg-red-600" :
                selectedExec.currentLoad === "Medium" ? "bg-orange-500" :
                  "bg-green-600"
                }`}>
                {selectedExec.currentLoad}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedRecceModal;