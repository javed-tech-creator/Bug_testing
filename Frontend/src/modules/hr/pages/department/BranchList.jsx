import React, { useState, useEffect } from "react";
import { SquarePen, Building2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // form states
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");

  useEffect(() => {
    // dummy data
    setBranches([
      { _id: "1", name: "Branch A", address: "123 Main Street, Delhi" },
      { _id: "2", name: "Branch B", address: "45 Connaught Place, Delhi" },
      { _id: "3", name: "Branch C", address: "67 Ring Road, Delhi" },
    ]);
  }, []);

  const openAddModal = () => {
    setEditingBranch(null);
    setBranchName("");
    setBranchAddress("");
    setIsModalOpen(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setBranchName(branch.name);
    setBranchAddress(branch.address);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!branchName.trim() || !branchAddress.trim()) {
      return alert("Branch Name and Address are required");
    }

    if (editingBranch) {
      // update
      setBranches((prev) =>
        prev.map((b) =>
          b._id === editingBranch._id
            ? { ...b, name: branchName, address: branchAddress }
            : b
        )
      );
    } else {
      // add new
      const newBranch = {
        _id: Date.now().toString(),
        name: branchName,
        address: branchAddress,
      };
      setBranches((prev) => [...prev, newBranch]);
    }

    closeModal();
  };

  return (
    <div>
      <PageHeader title="Branch List" onClick={openAddModal} btnTitle="Add" />

      {/* Branch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <div
            key={branch._id}
            className="flex items-center justify-between bg-white p-4 rounded-md shadow border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 text-black font-medium">
              <Building2
                size={30}
                className="bg-orange-500 text-white p-1.5 rounded-full"
              />
              <div>
                <div>{branch.name}</div>
                <div className="text-sm text-gray-500">{branch.address}</div>
              </div>
            </div>
            <button
              onClick={() => openEditModal(branch)}
              className="text-orange-500 border-2 p-0.5 border-orange-500 cursor-pointer rounded-sm hover:text-orange-600"
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
          className={`bg-white border rounded-lg shadow-lg w-96 p-4 
            transform transition-transform duration-500 ease-in-out
            ${isModalOpen ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          <h2 className="text-lg italic font-semibold mb-4">
            {editingBranch ? "!! Edit Branch !!" : "!! Add Branch !!"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-2 overflow-auto">
            <div>
              <label className="block mb-0.5 font-medium">Branch Name</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter Branch Name"
                className="w-full border border-gray-300 rounded px-2 py-1.5"
              />
            </div>
            <div>
              <label className="block mb-0.5 font-medium">Branch Address</label>
              <input
                type="text"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
                placeholder="Enter Branch Address"
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
                {editingBranch ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BranchList;
