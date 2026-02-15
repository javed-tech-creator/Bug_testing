import React, { useState } from "react";
import DataLoading from "@/modules/vendor/components/DataLoading";

const TechnologyTable = ({
  columnArray = [], // [{label: "Bill#", key: "invoiceId", render: (row)=> JSX }]
  tableData = [],
  isLoading = false,
  emptyText = "No records found",
  setCurrentPage,
  currentPage,
  total = 0, // <-- total records
  itemsPerPage, // <-- default per page
}) => {
  // Filter logic (generic)
  const [searchQuery, setSearchQuery] = useState("");
  console.log("table data is ", tableData);
  console.log("columnArray data is ", columnArray);

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
    <>
      <div className="bg-white border border-gray-200 p-6  space-y-4 mb-2">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

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
        <div className="overflow-x-auto overflow-y-auto max-h-[58vh]  rounded-lg">
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
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {columnArray.map((col, j) => (
                      <td
                        key={col.key}
                        className="px-4 py-2 border border-gray-200 whitespace-nowrap text-center overflow-hidden text-ellipsis text-sm"
                        style={{ maxWidth: "500px" }}
                      >
                        {col.render
                          ? col.render(row) // ✅ fix kiya
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

    {/* Prev Button */}
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

    {/* Page Numbers with Ellipsis */}
    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => {
        // Always show first and last page
        if (page === 1 || page === totalPages) return true;

        // Show pages near current page
        if (Math.abs(page - currentPage) <= 2) return true;

        // Otherwise skip (will show ... instead)
        return false;
      })
      .reduce((acc, page, idx, arr) => {
        if (idx > 0 && page - arr[idx - 1] > 1) {
          acc.push("ellipsis-" + page); // Add unique ellipsis key
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

    {/* Next Button */}
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
    </>
  );
};

export default TechnologyTable;
