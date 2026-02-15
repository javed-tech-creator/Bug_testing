import DataLoading from "@/modules/admin/components/Loading";
import React, { useState } from "react";
// import DataLoading from "../DataLoading";
// import DataLoading from "@/modules/vendor/components/DataLoading";

const Table = ({
  columnArray = [],
  tableData = [],
  isLoading = false,
  emptyText = "No records found",
  setCurrentPage,
  currentPage,
  total = 0,
  itemsPerPage,
  setItemsPerPage,
  showActiveFilter = false, //  parent se control
  isActive,
  setIsActive,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = tableData.filter((row) => {
    const query = searchQuery.toLowerCase();
    return Object.values(row).some((val) =>
      String(val || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="bg-white border border-gray-200 p-6 space-y-4 mb-2">
      {/* ---------- Search + Filter Row ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex gap-3 items-center">
          {/* Items Per Page Dropdown */}
          {setItemsPerPage && (
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to page 1 on change
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium bg-white"
            >
              {[25, 50, 75, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          )}
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          {/*  Active/Inactive Filter (Dynamic) */}
          {showActiveFilter && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 font-medium">Status:</span>

              <div className="relative">
                <select
                  value={
                    isActive === true
                      ? "active"
                      : isActive === false
                      ? "inactive"
                      : "all"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "active") setIsActive(true);
                    else if (val === "inactive") setIsActive(false);
                    else setIsActive(null);
                  }}
                  className={`block appearance-none w-32 bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium transition-all duration-200`}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                {/* Dropdown arrow icon */}
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <span
                className={`text-sm font-medium ${
                  isActive === true
                    ? "text-green-600"
                    : isActive === false
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {/* {isActive === true
        ? "Active"
        : isActive === false
        ? "Inactive"
        : "All"} */}
              </span>
            </div>
          )}
        </div>

        {/* Total Count */}
        <div className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold shadow-sm flex items-center gap-1">
          <span>Total:</span>
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-gray-500"></div>
          ) : (
            <span>{total}</span>
          )}
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="overflow-x-auto overflow-y-auto max-h-[58vh] rounded-lg">
        <table className="table-auto w-full border-collapse text-sm text-left">
          {/* ---------- HEADERS ---------- */}
          <thead className="bg-black text-white sticky top-0 z-5">
            <tr>
              {columnArray.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 font-semibold text-center border border-gray-300 whitespace-nowrap"
                  style={{ maxWidth: col.width || "500px" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columnArray.length}
                  className="text-start py-6 text-gray-500 bg-white"
                >
                  <DataLoading />
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td
                  colSpan={columnArray.length}
                  className="text-center py-6 text-gray-500 bg-white"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              filteredList.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columnArray.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-2 border border-gray-200 whitespace-nowrap text-center overflow-hidden text-ellipsis text-sm"
                      style={{ maxWidth: "500px" }}
                    >
                      {col.render
                        ? col.render(row[col.key], row,i)
                        : typeof row[col.key] === "object"
                        ? JSON.stringify(row[col.key])
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION ---------- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded-md transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 2) return true;
              return false;
            })
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) {
                acc.push("ellipsis-" + page);
              }
              acc.push(page);
              return acc;
            }, [])
            .map((item) =>
              typeof item === "string" ? (
                <span key={item} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-1 border rounded-md transition-colors ${
                    currentPage === item
                      ? "bg-orange-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
