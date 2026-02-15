import React, { useState, useEffect } from "react";
import { SquarePen, Plus, Building2, ChevronDown, ChevronUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";

// Dummy departments
const departments = [
  { id: "1", name: "Sales" },
  { id: "2", name: "HR" },
  { id: "3", name: "IT" }
];

// Dummy branches
const branches = [
  { id: "b1", name: "Head Office" },
  { id: "b2", name: "Regional Office" },
  { id: "b3", name: "Branch Office" }
];

const DesignationList = () => {
  const [designations, setDesignations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Form State
  const [depId, setDepId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    // Dummy Data
    setDesignations([
      {
        _id: "1",
        designationId: "DSG25001",
        title: "Sales Manager",
        description: "Handles sales operations",
        depId: "1",
        branchId: "b1",
        status: "Active"
      },
      {
        _id: "2",
        designationId: "DSG25002",
        title: "HR Executive",
        description: "Manages recruitment",
        depId: "2",
        branchId: "b2",
        status: "Inactive"
      },
      {
        _id: "3",
        designationId: "DSG25003",
        title: "IT Support",
        description: "Maintains systems",
        depId: "3",
        branchId: "b3",
        status: "Active"
      }
    ]);
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setDepId("");
    setBranchId("");
    setTitle("");
    setDescription("");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setDepId(item.depId);
    setBranchId(item.branchId);
    setTitle(item.title);
    setDescription(item.description);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !depId || !branchId) {
      return alert("All fields required");
    }
    if (editing) {
      setDesignations((prev) =>
        prev.map((d) =>
          d._id === editing._id
            ? { ...d, title, description, depId, branchId, status }
            : d
        )
      );
    } else {
      setDesignations((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          designationId: `DSG25${String(prev.length + 1).padStart(3, "0")}`,
          title,
          description,
          depId,
          branchId,
          status
        }
      ]);
    }
    closeModal();
  };

  // Group by department
  const groupsByDept = departments.map((dept) => ({
    name: dept.name,
    id: dept.id,
    designations: designations.filter((d) => d.depId === dept.id)
  }));

  return (
    <div>
      <PageHeader
        title="Designations Management"
        onClick={openAddModal}
        btnTitle="Add"
        icon={<Plus />}
      />

      {/* Department wise listing */}
      {groupsByDept.map(
        (dept) =>
          dept.designations.length > 0 && (
            <div key={dept.id} className="mb-6">
              <h2 className="text-lg font-semibold text-black/80 border border-gray-300 bg-gray-200 rounded w-fit px-6 py-1 mb-3">
               !! {dept.name} !!
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dept.designations.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-4 rounded-md shadow border hover:shadow-md transition"
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Building2
                          size={30}
                          className="bg-orange-500 text-white p-1 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-orange-500 border-2 p-1 border-orange-500 rounded-sm hover:text-orange-600"
                      >
                        <SquarePen size={22} />
                      </button>
                    </div>

                    {/* Status */}
                    {/* <div className="mt-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div> */}

                    {/* Toggle More Info */}
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [item._id]: !prev[item._id]
                        }))
                      }
                      className="mt-3 flex items-center text-sm text-gray-600 hover:text-orange-600"
                    >
                      {expanded[item._id] ? (
                        <>
                          Hide Details <ChevronUp size={16} className="ml-1" />
                        </>
                      ) : (
                        <>
                          View Details <ChevronDown size={16} className="ml-1" />
                        </>
                      )}
                    </button>

                    {expanded[item._id] && (
                      <div className="mt-2 text-xs text-gray-700 space-y-1">
                        <div>
                          <span className="font-semibold">ID:</span>{" "}
                          {item.designationId}
                        </div>
                        <div>
                          <span className="font-semibold">Branch:</span>{" "}
                          {branches.find((b) => b.id === item.branchId)?.name}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] p-4">
            <h2 className="text-lg italic font-semibold mb-3">
              !! {editing ? "Edit Designation" : "Add Designation"} !!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Grid Form */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Department</label>
                  <select
                    value={depId}
                    onChange={(e) => setDepId(e.target.value)}
                    className="border rounded w-full px-2 py-2 mt-1 text-sm"
                  >
                    <option value="">-- Select --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Branch</label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="border rounded w-full px-2 py-2 mt-1 text-sm"
                  >
                    <option value="">-- Select --</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded w-full px-2 py-2 mt-1 text-sm"
                    placeholder="Designation Title"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded w-full px-2 py-2 mt-1 text-sm"
                    placeholder="Short description"
                  />
                </div>
               
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignationList;
