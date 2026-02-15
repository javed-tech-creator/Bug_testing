import React, { useState, useEffect } from "react";
import { SquarePen, Plus, ShieldCheck, ChevronDown, ChevronUp, Dot } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const departments = [
  { id: "1", name: "Sales" },
  { id: "2", name: "HR" },
  { id: "3", name: "IT" }
];

const permissionGroups = {
  crud: ["view", "create", "update", "delete"],
  workflow: ["import", "export", "assign", "approve", "reject", "submit"],
  data: ["filter", "search", "sort", "generate_report"],
  system: ["login", "logout", "reset_password", "notify", "track"]
};

const ActionGroupList = () => {
  const [actionGroups, setActionGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [expanded, setExpanded] = useState({}); // track expanded cards

  // Form state
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({
    crud: [],
    workflow: [],
    data: [],
    system: []
  });

  useEffect(() => {
    // Dummy Data
    setActionGroups([
      {
        _id: "1",
        title: "Sales Manager",
        description: "Full sales permissions",
        department: "Sales",
        permissions: {
          crud: ["view", "create"],
          workflow: ["approve"],
          data: ["filter"],
          system: ["login"]
        }
      },
      {
        _id: "2",
        title: "HR Executive",
        description: "HR related actions",
        department: "HR",
        permissions: {
          crud: ["view"],
          workflow: ["assign"],
          data: ["search"],
          system: []
        }
      },
      {
        _id: "3",
        title: "IT Support",
        description: "System handling",
        department: "IT",
        permissions: {
          crud: ["view", "update"],
          workflow: [],
          data: [],
          system: ["reset_password"]
        }
      }
    ]);
  }, []);

  const openAddModal = () => {
    setEditingGroup(null);
    setDepartment("");
    setTitle("");
    setDescription("");
    setPermissions({ crud: [], workflow: [], data: [], system: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setDepartment(group.department);
    setTitle(group.title);
    setDescription(group.description);
    setPermissions(group.permissions);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const togglePermission = (group, perm) => {
    setPermissions((prev) => {
      const exists = prev[group]?.includes(perm);
      return {
        ...prev,
        [group]: exists ? prev[group].filter((p) => p !== perm) : [...prev[group], perm]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    if (!department) return alert("Department is required");

    if (editingGroup) {
      setActionGroups((prev) =>
        prev.map((g) =>
          g._id === editingGroup._id ? { ...g, title, description, department, permissions } : g
        )
      );
    } else {
      const newGroup = {
        _id: Date.now().toString(),
        title,
        description,
        department,
        permissions
      };
      setActionGroups((prev) => [...prev, newGroup]);
    }
    closeModal();
  };

  // Group by department
  const groupsByDept = departments.map((dept) => ({
    name: dept.name,
    groups: actionGroups.filter((g) => g.department === dept.name)
  }));

  return (
    <div>
      <PageHeader title="Action Groups" onClick={openAddModal} btnTitle="Add" icon={<Plus />} />

      {groupsByDept.map(
        (dept) =>
          dept.groups.length > 0 && (
            <div key={dept.name} className="mb-6">
              <h2 className="text-lg font-semibold text-black/80 border border-gray-300 bg-gray-200 rounded w-fit px-6 py-1 mb-3">!! {dept.name} Department !!</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dept.groups.map((group) => (
                  <div
                    key={group._id}
                    className="bg-white p-4 rounded-md shadow border hover:shadow-md transition"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2 text-black">
                        <ShieldCheck size={30} className="bg-orange-500 text-white p-1 rounded-full" />
                        <div>
                          <div className="font-medium">{group.title}</div>
                          <div className="text-sm text-gray-500">{group.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => openEditModal(group)}
                        className="text-orange-500 border-2 cursor-pointer p-1 border-orange-500 rounded-sm hover:text-orange-600"
                      >
                        <SquarePen size={22} />
                      </button>
                    </div>

                    {/* Toggle permissions */}
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [group._id]: !prev[group._id] }))
                      }
                      className="mt-3 flex items-center text-sm text-gray-800 hover:text-orange-600"
                    >
                      {expanded[group._id] ? (
                        <>
                          Hide Permissions <ChevronUp size={16} className="ml-1" />
                        </>
                      ) : (
                        <>
                          View Permissions <ChevronDown size={16} className="ml-1" />
                        </>
                      )}
                    </button>

                    {/* Permission List */}
                    {expanded[group._id] && (
                      <div className="mt-1.5 text-xs text-gray-800 grid grid-cols-1">
                        {Object.entries(group.permissions).map(([key, perms]) =>
                          perms.length > 0 ? (
                            <div key={key} className="">
                              <span className="font-semibold capitalize"><Dot className="inline" />{key}</span>:{" "}
                             <span className="capitalize"> {perms.join(", ")}</span>
                            </div>
                          ) : null
                        )}
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
          <div
            className={`bg-white rounded-lg shadow-lg w-[600px] p-4 
              transform transition-transform duration-500 ease-in-out
              ${isModalOpen ? "translate-y-0" : "-translate-y-full"}
            `}
          >
            <h2 className="text-lg font-semibold mb-3">
              !! {editingGroup ? "Edit Action Group" : "Add Action Group"} !!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-0.5 font-medium">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="border rounded w-full px-2 py-2 text-sm"
                  >
                    <option value="">-- Select --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-0.5 font-medium">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded w-full px-2 py-2 text-sm"
                    placeholder="Group title"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-0.5 font-medium">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded w-full px-2 py-2 text-sm"
                    placeholder="Short description"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(permissionGroups).map(([group, perms]) => (
                  <div key={group} className="border rounded p-2">
                    <h3 className="font-semibold text-sm capitalize mb-1">{group}</h3>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {perms.map((perm) => (
                        <label key={perm} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={permissions[group]?.includes(perm)}
                            onChange={() => togglePermission(group, perm)}
                            className="h-3 w-3"
                          />
                          {perm}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-sm rounded bg-orange-500 text-white hover:bg-orange-600"
                >
                  {editingGroup ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionGroupList;
