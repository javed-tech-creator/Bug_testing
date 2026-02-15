import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Search } from "lucide-react";
import { useGetAllEmployeeQuery } from "@/api/hr/employee.api";

const EmployeePerformance = () => {
  const { data: empData } = useGetAllEmployeeQuery();
  const employees =
    empData?.data?.map((emp) => ({
      id: emp._id,
      name: emp?.name || "N/A",
      department: emp.departmentId?.title || "N/A",
      branch: emp.branchId?.name || "N/A",
      designation: emp.designationId?.title || "N/A",
      rating: emp.rating || 0,
      image: emp.photo?.public_url || emp.photo?.url || null,
    })) || [];
  const [branchFilter, setBranchFilter] = useState("All Branch");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch =
      branchFilter === "All Branch" || emp.branch === branchFilter;
    const matchesDepartment =
      departmentFilter === "All Department" ||
      emp.department === departmentFilter;
    return matchesSearch && matchesBranch && matchesDepartment;
  });
  const branches = ["All Branch", ...new Set(employees.map((e) => e.branch))];
  const departments = [
    "All Department",
    ...new Set(employees.map((e) => e.department)),
  ];

  const handleOpenModal = (emp) => {
    setSelectedEmployee(emp);
    setNewRating(0);
    setIsModalOpen(true);
  };

  // Save average rating
  const handleSaveRating = () => {
    if (newRating <= 0 || newRating > 10)
      return alert("Select rating between 1 and 10");
    const updatedRating = (selectedEmployee.rating + newRating) / 2;

    setIsModalOpen(false);
  };

  const sortedByRating = [...filteredData].sort((a, b) => b.rating - a.rating);
  const topThreeIds = sortedByRating.slice(0, 3).map((emp) => emp.id);
  const finalData = [
    ...sortedByRating.filter((emp) => topThreeIds.includes(emp.id)),
    ...sortedByRating.filter((emp) => !topThreeIds.includes(emp.id)),
  ];

  // Rating helpers
  const getRatingText = (rating) => {
    if (rating <= 3) return "Bad";
    if (rating <= 6) return "Good ";
    else if (rating <= 8) return "Very Good";
    else return "Excellent";
  };

  //   const getStars = (rating) => {
  //     const filledStars = Math.round(rating / 2); // convert 0-10 to 0-5 stars
  //     return "⭐".repeat(filledStars) + "☆".repeat(5 - filledStars);
  //   };

  return (
    <>
      <PageHeader title="Employee Performance" />

      {/* Filters */}
      <div className=" mb-6 flex flex-col sm:flex-row items-end justify-between gap-4">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:ml-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="border border-gray-200 py-3 px-5 rounded-xl shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none hover:shadow-md cursor-pointer"
          >
            {branches.map((branch) => (
              <option key={branch}>{branch}</option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-gray-200 py-3 px-5 rounded-xl shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none hover:shadow-md cursor-pointer"
          >
            {departments.map((dep) => (
              <option key={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white relative cursor-pointer rounded-lg shadow-sm border border-gray-200 py-2 px-3 hover:shadow-md transition-shadow duration-200"
            >
              {topThreeIds.includes(emp.id) && (
                <div className="bg-orange-500 text-xs text-white absolute top-2 right-2 rounded-md px-2 py-1 shadow-md">
                  #{topThreeIds.indexOf(emp.id) + 1}
                </div>
              )}

              <div className="w-16 h-16 rounded-full overflow-hidden bg-black text-white flex items-center justify-center font-semibold text-xs mx-auto">
                {emp.image ? (
                  <img
                    src={emp.image}
                    alt={emp.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : emp.name ? (
                  emp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                ) : (
                  "NA"
                )}
              </div>

              <div className="text-left space-y-1">
                <h2 className="font-semibold text-gray-900 text-lg">
                  {emp.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  <strong>Designation:</strong> {emp.designation}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Department:</strong> {emp.department}
                </p>
                <p className="text-gray-600 text-sm">
                  Rating: <strong>{emp.rating.toFixed(1)}</strong>
                </p>
              </div>

              <div className="flex justify-center mt-3">
                <button
                  onClick={() => handleOpenModal(emp)}
                  className="bg-orange-500 text-white border hover:text-black w-full py-1 rounded-md text-sm hover:bg-white transition-all duration-200"
                >
                  + Add Your Rating
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-cedivr col-span-full">
            No employee found matching your filters.
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">
              Give Your Rating (0-10)
            </h2>
            <p className="text-sm text-gray-600 mb-2 text-center">
              {selectedEmployee.name}
            </p>

            {/* Star rating */}
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`cursor-pointer text-3xl ${
                    i < newRating ? "text-orange-500" : "text-gray-300"
                  }`}
                  onClick={() => setNewRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Live rating text based on selected stars */}
            {newRating > 0 && (
              <p className="text-gray-700 text-center text-lg">
                {newRating}/10 - <strong>{getRatingText(newRating)}</strong>
              </p>
            )}

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRating}
                className="px-2 py-1 rounded-lg border border-orange-500 text-black hover:text-white hover:bg-orange-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeePerformance;
