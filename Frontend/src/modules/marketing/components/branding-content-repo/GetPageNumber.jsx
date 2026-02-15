import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const getPageNumbers = () => {
    let pages = [];
    let maxVisible = 3; // how many pages to show around current page

    // Always show first page
    if (currentPage > 2) {
      pages.push(1);
    }

    // Ellipsis before current range
    if (currentPage > 3) {
      pages.push("...");
    }

    // Pages around current page
    for (
      let i = Math.max(2, currentPage - maxVisible);
      i <= Math.min(totalPages - 1, currentPage + maxVisible);
      i++
    ) {
      pages.push(i);
    }

    // Ellipsis after current range
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl shadow-inner">
        {/* Prev Button */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-purple-100 hover:border-purple-300 text-gray-700"
          }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                currentPage === page
                  ? "bg-purple-600 text-white border-purple-600 shadow-md"
                  : "bg-white text-gray-700 hover:bg-purple-100 hover:border-purple-300"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-purple-100 hover:border-purple-300 text-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
