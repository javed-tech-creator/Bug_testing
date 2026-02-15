import React, { useState, useEffect } from "react";
import { Lock, SquarePen, Plus, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BranchList from "./BranchList";

const branches = ["Branch A", "Branch B", "Branch C"]; 

const DepartmentList = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Form state for modal fields
  const [branch, setBranch] = useState(branches[0]);
  const [deptName, setDeptName] = useState("");

useEffect(() => {
  setDepartments([
    { _id: "1", name: "Sales", branch: "Branch A" },
    { _id: "2", name: "Recce", branch: "Branch A" },
    { _id: "3", name: "Design", branch: "Branch B" },
    { _id: "4", name: "Production", branch: "Branch B" },
    { _id: "5", name: "Installation", branch: "Branch C" },
    { _id: "6", name: "Maintenance & Service", branch: "Branch C" },
    { _id: "7", name: "Procurement / Purchase", branch: "Branch A" },
    { _id: "8", name: "Accounts & Finance", branch: "Branch B" },
    { _id: "9", name: "HR & Admin", branch: "Branch A" },
    { _id: "10", name: "IT / Technical Support", branch: "Branch B" },
    { _id: "11", name: "Marketing", branch: "Branch C" },
    { _id: "12", name: "Project Management", branch: "Branch A" },
  ]);
}, []);


  const openAddModal = () => {
    setEditingDept(null);
    setBranch(branches[0]);
    setDeptName("");
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setBranch(dept.branch || branches[0]);
    setDeptName(dept.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deptName.trim()) return alert("Department Name is required");

    if (editingDept) {
      // Edit existing
      setDepartments((prev) =>
        prev.map((d) =>
          d._id === editingDept._id ? { ...d, name: deptName, branch } : d
        )
      );
    } else {
      // Add new - generate simple id
      const newDept = {
        _id: Date.now().toString(),
        name: deptName,
        branch,
      };
      setDepartments((prev) => [...prev, newDept]);
    }
    closeModal();
  };

  return (
    <>
    <div>
      <PageHeader
        title="Department List"
        onClick={openAddModal}
        btnTitle="Add"
      />
      {/* Department Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="flex items-center justify-between bg-white p-4 rounded-md shadow border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 text-black font-medium">
              <Building2
                size={30}
                className="bg-orange-500 text-white p-1.5 rounded-full"
              />
              <div>
                <div>{dept.name}</div>
                <div className="text-sm text-gray-500">
                  Branch: {dept.branch}
                </div>
              </div>
            </div>
            <button
              onClick={() => openEditModal(dept)}
              className="text-orange-500 border-2 p-0.5 border-orange-500 cursor-pointer rounded-sm  hover:text-orange-600"
              title="Edit"
            >
              <SquarePen size={22} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
    <div
  className={`fixed inset-0 flex items-center justify-center lg:-mt-96 bg-black/40 z-50 
    transition-opacity duration-500 
    ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
>
  <div
    className={`
      bg-white border  rounded-lg shadow-lg w-96 p-4 
      transform transition-transform duration-500 ease-in-out
      ${isModalOpen ? "translate-y-0 " : "-translate-y-full"}
    `}
  >
    <h2 className="text-lg italic  font-semibold mb-4">
      {editingDept ? "!! Edit Department !!" : "!! Add Department !!"}
    </h2>
    <form onSubmit={handleSubmit} className="space-y-2 overflow-auto">
      <div>
        <label className="block mb-0.5 font-medium">Branch</label>
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5"
        >
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-0.5 font-medium">Department Name</label>
        <input
          type="text"
          value={deptName}
          onChange={(e) => setDeptName(e.target.value)}
          placeholder="Enter Department Name"
          className="w-full border border-gray-300 rounded px-2 py-1.5"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={closeModal}
          className="px-6 py-1.5 cursor-pointer rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-1.5 cursor-pointer rounded bg-orange-500 text-white hover:bg-orange-600"
        >
          {editingDept ? "Update" : "Add"}
        </button>
      </div>
    </form>
  </div>
</div>

    </div>
    <div className="mt-10">

    <BranchList />
    </div>
    </>
  );
};

export default DepartmentList;
