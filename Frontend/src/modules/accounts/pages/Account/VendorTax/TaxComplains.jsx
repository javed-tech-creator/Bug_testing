import React, { useState, useMemo, useRef, useEffect } from "react";
import {
    useGetTaxDeductsQuery,
    useDeleteTaxDeductMutation,
    useUpdateTaxDeductMutation,
    useUploadChallanMutation,
} from "@/api/accounts/vendor_tax/TaxComplains";
import { toast } from "react-toastify";
import { FolderInput } from "lucide-react";
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    TrashIcon,
    CloudArrowUpIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

// --- Custom Pagination Component ---
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isFirst}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLast}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                        <span className="font-medium">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={isFirst}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={isLast}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

const TaxComplianceLedger = () => {
    const { data: taxData, isLoading, refetch } = useGetTaxDeductsQuery();
    const [deleteTaxDeduct] = useDeleteTaxDeductMutation();
    const [updateTaxDeduct] = useUpdateTaxDeductMutation();
    const [uploadChallan] = useUploadChallanMutation();

    const [editId, setEditId] = useState(null);
    const [tds, setTds] = useState("");
    const [file, setFile] = useState(null);
    const [vendorId, setVendorId] = useState("");
    const [type, setType] = useState("B2B");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const closeModal = () => setIsModalOpen(false);
    // --- Pagination & Filtering State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // एक पेज पर 5 आइटम

    // 1. Filtering Logic
    const filteredData = useMemo(() => {
        if (!taxData) return [];

        return taxData.filter((t) => {
            const matchesSearch = searchTerm
                ? (t.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.gstType?.toLowerCase().includes(searchTerm.toLowerCase()))
                : true;

            const matchesFilter = filterType === "All" ? true : t.gstType === filterType;

            return matchesSearch && matchesFilter;
        });
    }, [taxData, searchTerm, filterType]);

    // 2. Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // ------------------------------------

    // 🗑 Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this record?")) {
            await deleteTaxDeduct(id);
            refetch();
        }
    };
    const modalRef = useRef(null);

    // ✏️ Update TDS / GSTR toggle
    const handleUpdate = async (id, extraData = {}) => {
        const currentRecord = taxData.find((t) => t._id === id);
        if (!currentRecord) return toast.error("Record not found");

        const data = {
            tds: editId === id ? Number(tds) : currentRecord.tds,
            gstr1Filed: currentRecord.gstr1Filed,
            gstr3BFiled: currentRecord.gstr3BFiled,
            ...extraData,
        };

        try {
            await updateTaxDeduct({ id, data }).unwrap();
            toast.success("Updated ✅");
            setEditId(null);
            setTds("");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Update failed");
        }
    };

    const handleChallanUploadClick = (vendorId, currentType) => {
        setVendorId(vendorId);
        setType(currentType || "B2B");
        setIsModalOpen(true);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!vendorId || !file) return toast.error("Vendor and file required!");

        const formData = new FormData();
        formData.append("vendorLedger", vendorId);
        formData.append("type", type);
        formData.append("file", file);

        try {
            await uploadChallan(formData).unwrap();
            toast.success("Challan Uploaded ✅");
            setFile(null);
            setVendorId("");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Upload failed");
        }
    };

    // 📊 Export CSV
    const handleExport = () => {

        const csvHeader = [

            "vendor.name",

            "vendor.gst",

            "vendor.pan",

            "tds",

            "gstType",

            "totalAmount",

            "gstr1Filed",

            "gstr3BFiled",

            "filingDate",

            "dueDate",

            "approved",

            "challanProof",

            "tdsDeposited",

        ].join(",");



        const csv = taxData

            ?.map((t) =>

                [

                    t.vendor?.name || "",

                    t.vendor?.gst || "",

                    t.vendor?.pan || "",

                    t.tds || 0,

                    t.gstType || "",

                    t.payment?.totalAmount || 0,

                    t.gstr1Filed || false,

                    t.gstr3BFiled || false,

                    // t.filingDate || "",

                    t.payment?.dueDate || "",

                    t.payment?.approved || false,

                    t.payment?.paymentProof || t.challanProof || "",

                    t.tdsDeposited || false,

                ].join(",")

            )

            .join("\n");



        const blob = new Blob([csvHeader + "\n" + csv], { type: "text/csv" });

        const a = document.createElement("a");

        a.href = URL.createObjectURL(blob);

        a.download = "Tax_Compliance_Report.csv";

        a.click();

    };



    if (isLoading) return <p className="text-center mt-5 text-gray-500">Loading...</p>;

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">


            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 rounded-lg">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tax & Compliance</h1>
                        <p className="text-sm text-gray-500">
                            Manage vendor payments, tasks, and approvals efficiently.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-white text-indigo-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300"        >
                    <FolderInput className="w-5 h-5 stroke-2" />
                    Export CSV
                </button>
            </div>

            {/* --- Search, Filter & Export --- */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search by vendor or tax type..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page on new search
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                </div>

                <select
                    value={filterType}
                    onChange={(e) => {
                        setFilterType(e.target.value);
                        setCurrentPage(1); // Reset page on new filter
                    }}
                    className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Types</option>
                    <option value="B2B">B2B</option>
                    <option value="C2B">C2B</option>
                    <option value="C2C">C2C</option>
                </select>


            </div>

            {/* --- Table Section --- */}
            <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-300/90  text-black">
                        <tr>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">Vendor</th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">Pan</th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">Type</th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">TDS (₹)</th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">Total (₹)</th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">Net Amount </th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">TDS Deposited </th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">GSTR-1</th>
                            <th className="px-4 py-3 border text-left text-xs  tracking-wider">GSTR-3 </th>
                            <th className="px-4 py-3 border text-center text-xs  tracking-wider">Challan</th>
                            <th className="px-4 py-3 border text-center text-xs  tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((t) => (
                                <tr key={t._id} className="hover:bg-gray-50">
                                    <td className="px-6  border py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {t.vendor?.name || "N/A"}
                                    </td>
                                    <td className="px-6 border  py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {t.vendor?.pan || 'N/A'}
                                    </td>

                                    <td className="px-6  border  py-2 whitespace-nowrap text-sm text-center font-medium">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.gstType === 'GST' ? 'bg-indigo-100 text-indigo-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {t.gstType}
                                        </span>
                                    </td>

                                    {/* TDS Input/Value */}
                                    <td className="px-6 border  py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {editId === t._id ? (
                                            <input
                                                type="number"
                                                defaultValue={t.tds}
                                                onChange={(e) => setTds(e.target.value)}
                                                className="border border-blue-300 px-2 py-1 w-20 text-center rounded-md"
                                            />
                                        ) : (
                                            <span className="font-semibold">₹{t.tds || 0}</span>
                                        )}
                                    </td>

                                    <td className="px-6 border  py-2 whitespace-nowrap text-sm font-semibold text-gray-700 text-center">
                                        ₹{t.payment?.totalAmount || 0}
                                    </td>
                                    <td className="py-2 px-3">₹{t.netPayment || 0}</td>
                                    <td className="py-2  ">{t.tdsDeposited ? "✅Deposited" : "❌ Pending"}</td>

                                    {/* GSTR-1 Toggle */}
                                    <td className="px-6 border  py-2 whitespace-nowrap text-sm text-center">
                                        <button
                                            onClick={() => handleUpdate(t._id, { gstr1Filed: !t.gstr1Filed })}
                                            className={`transition-colors duration-200 ${t.gstr1Filed ? 'text-green-500 hover:text-green-600' : 'text-red-600 hover:text-red-600'}`}
                                            title={t.gstr1Filed ? "Filed" : "Not Filed"}
                                        >
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>
                                    </td>

                                    {/* GSTR-3B Toggle */}
                                    <td className="px-6 border  py-2 whitespace-nowrap text-sm text-center">
                                        <button
                                            onClick={() => handleUpdate(t._id, { gstr3BFiled: !t.gstr3BFiled })}
                                            className={`transition-colors duration-200 ${t.gstr3BFiled ? 'text-green-500 hover:text-green-600' : 'text-red-600 hover:text-red-600'}`}
                                            title={t.gstr3BFiled ? "Filed" : "Not Filed"}
                                        >
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>
                                    </td>

                                    {/* Challan Proof */}
                                    <td className="px-6 border  py-2 whitespace-nowrap text-center text-sm font-medium">
                                        {t?.challanProof ? (
                                            <a
                                                href={t.challanProof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-semibold underline"
                                            >
                                                View Proof
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6  border  py-2 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex gap-2 justify-center">
                                            {editId === t._id ? (
                                                <button
                                                    className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 text-sm"
                                                    onClick={() => handleUpdate(t._id)}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button
                                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                                                    onClick={() => {
                                                        setEditId(t._id);
                                                        setTds(t.tds);

                                                    }}
                                                    title="Edit TDS"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button
                                                className="p-2 border bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-150"
                                                onClick={() => handleChallanUploadClick(t.vendor?._id, t.gstType)} // yeh function call karega
                                                title="Upload Challan"
                                            >
                                                <CloudArrowUpIcon className="w-4 h-4" />
                                            </button>

                                            <button
                                                className="p-2 border  bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150"
                                                onClick={() => handleDelete(t._id)}
                                                title="Delete Record"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-2 text-center text-gray-500">
                                    No records found for the current search/filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Footer */}
                <div className="px-6 py-3 border-t bg-gray-50">
                    <Pagination
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* --- Upload Challan Section --- */}
       {isModalOpen && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
    <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl relative">
      
      {/* Close Button (Matches image) */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light leading-none"
      >
        &times;
      </button>

      {/* Modal Header (Styled to match image) */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
        {/* Using a custom icon, assuming CloudArrowUpIcon is available */}
        <span className="text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </span>
        Upload Challan Proof
      </h3>

      {/* Form (Grid Layout for Two Columns) */}
      <form onSubmit={handleUpload}>

        {/* Two-Column Grid for Vendor and Type Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            
          {/* Vendor Select Field */}
          <div>
            <label htmlFor="vendor-select" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              id="vendor-select"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Vendor for Challan
              </option>
              {/* Assuming taxData is an array of vendor/tax objects */}
              {taxData?.map((t) => (
                <option key={t.vendor._id} value={t.vendor._id}>
                  {t.vendor.name} ({t.gstType})
                </option>
              ))}
            </select>
          </div>

          {/* Type Select Field */}
          <div>
            <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-1">
              Challan Type
            </label>
            <select
              id="type-select"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="GST">GST Challan</option>
              <option value="TDS">TDS Challan</option>
            </select>
          </div>

        </div>
        
        {/* Single Row for File Input (Takes full width) */}
        <div className="mb-8">
            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Proof (PDF Only)
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              // Customized Tailwind styling for the file input button
              className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded-lg shadow-sm"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
        </div>

        {/* Action Buttons (Aligned to the right, matching image) */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            type="button" // Change to type="button" for cancel
            onClick={closeModal}
            className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-md"
          >
            Upload Now
          </button>
        </div>
      </form>
      
    </div>
  </div>
)}
        </div>
    );
};

export default TaxComplianceLedger;