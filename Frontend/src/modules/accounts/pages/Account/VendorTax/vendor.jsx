import React, { useState, useRef, useEffect } from "react";
import {
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} from "@/api/accounts/vendor_tax/vendor.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Search, Filter, Plus, Edit2, Trash2, X, Building2, Mail, CreditCard, FileText, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

// --- Validation Schema ---
const schema = yup.object().shape({
  name: yup.string().required("Vendor Name is required"),
  pan: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)").required("PAN is required"),
  gst: yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Invalid GST format (e.g., 22AAAAA0000A1Z5)").required("GST is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  bankAccount: yup.string().matches(/^[0-9]{9,18}$/, "Account number must be 9-18 digits").required("Bank Account is required"),
});

// --- Vendor Component ---
const VendorComponent = () => {
  const { data: vendors = [], isLoading, isError, error } = useGetVendorsQuery();
  const [addVendor, { isLoading: isAdding }] = useAddVendorMutation();
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();

  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGST, setFilterGST] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Slightly smaller page size for a cleaner look

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur" // Validate on blur for better UX
  });

  const modalRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  const openModal = (vendor = null) => {
    if (vendor) {
      setEditingId(vendor._id);
      // Use setValue for better form state management with existing data
      setValue("name", vendor.name);
      setValue("pan", vendor.pan);
      setValue("gst", vendor.gst);
      setValue("email", vendor.email);
      setValue("bankAccount", vendor.bankAccount);
    } else {
      setEditingId(null);
      reset({ name: "", pan: "", gst: "", email: "", bankAccount: "" });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    reset(); // Reset form state
  };

  const onSubmit = async (data) => {
    const action = editingId ? updateVendor : addVendor;
    try {
      if (editingId) {
        await action({ id: editingId, ...data }).unwrap();
      } else {
        await action(data).unwrap();
      }
      closeModal();
    } catch (err) {
      // API error handling can be enhanced here
      console.error("API Submission Error:", err);
      alert(`Failed to ${editingId ? 'update' : 'add'} vendor. See console for details.`);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the vendor: ${name}? This action cannot be undone.`)) {
      try {
        await deleteVendor(id).unwrap();
      } catch (err) {
        console.error("Delete Error:", err);
        alert(`Failed to delete vendor. See console for details.`);
      }
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const search = searchTerm.toLowerCase();
    const gstFilter = filterGST.toLowerCase();
    return (
      (v.name.toLowerCase().includes(search) ||
        v.email.toLowerCase().includes(search) ||
        v.pan.toLowerCase().includes(search) ||
        v.bankAccount.toLowerCase().includes(search)) &&
      (gstFilter ? v.gst.toLowerCase().includes(gstFilter) : true)
    );
  });

  const totalPages = Math.ceil(filteredVendors.length / pageSize);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // If search/filter changes, reset to page 1
  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, filterGST]);


  if (isError) {
    return (
        <div className="max-w-7xl mx-auto bg-red-50 p-6 rounded-2xl shadow-lg border border-red-300">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
            <p className="text-red-600">A problem occurred while fetching vendor data. Please check your network connection or the API endpoint.</p>
            <p className="text-sm text-red-500 mt-2">Details: {error?.data?.message || 'Unknown error'}</p>
        </div>
    );
  }

  // --- JSX START ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Stats */}
        <div className="mb-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-gray-100 via-gray-100 to-gray-100 p-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">Vendor Management</h1>
                    <p className="text-blue-500 mt-1 text-sm">Centralized platform to manage all your business partners and tax information.</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal()}
                  className="bg-white text-indigo-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300"
                >
                  <Plus className="w-5 h-5 stroke-2" />
                  Add New Vendor
                </button>
              </div>
               
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Search */}
            <div className="relative md:col-span-2 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by Name, Email, PAN, or Bank Account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all placeholder:text-gray-400"
              />
            </div>
            {/* Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-500 group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Filter by GST number (partial match)..."
                value={filterGST}
                onChange={(e) => setFilterGST(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black">
              <thead>
    <tr className="bg-blue-200">  
        <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[200px] border-r border-blue-100">Vendor Details</th>
        <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[140px] border-r border-blue-100">PAN</th>
        <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[180px] border-r border-blue-100">GST</th>
        <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[180px] border-r border-blue-100">Contact</th>
        <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider min-w-[150px] border-r border-blue-100">Bank Account</th>        
        <th className="px-6 py-2 text-center text-xs font-bold text-black uppercase tracking-wider w-24">Actions</th>
    </tr>
</thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16  text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-200 border-t-indigo-600"></div>
                        <p className="text-gray-600 font-medium text-lg">Loading vendor data...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedVendors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 rounded-full p-4">
                          <Building2 className="w-10 h-10 text-gray-500" />
                        </div>
                        <p className="text-gray-600 font-medium text-lg">No vendors match your search or filter.</p>
                        <p className="text-gray-400 text-sm">Clear the search or try adding a new vendor.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedVendors.map((vendor) => (
                    <tr 
                      key={vendor._id} 
                      className="even:bg-gray-50 hover:bg-indigo-50/70 transition-colors duration-200"
                    >
                      <td className="px-6 py-2 border whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-md ring-2 ring-indigo-200">
                            {vendor.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-base font-semibold text-gray-900">{vendor.name}</div>
                            <div className="text-xs text-gray-500">ID: {vendor._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2  border whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-mono text-gray-700">{vendor.pan}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 border whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-mono text-gray-700">{vendor.gst}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 border whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-pink-500" />
                          <span className="text-sm text-gray-600 truncate">{vendor.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 border whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                          {vendor.bankAccount}
                        </span>
                      </td>
                      <td className="px-6 py-2 border whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openModal(vendor)}
                            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-all duration-150 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Edit Vendor"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vendor._id, vendor.name)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-all duration-150 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Delete Vendor"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 font-medium">
                  Showing <span className="font-extrabold text-indigo-700">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-extrabold text-indigo-700">{Math.min(currentPage * pageSize, filteredVendors.length)}</span> of{" "}
                  <span className="font-extrabold text-indigo-700">{filteredVendors.length}</span> results
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm"
                    aria-label="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform scale-100 opacity-100 transition-all duration-300 ease-out"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-700 via-gray-700 to-gray-600 p-3 sticky top-0 z-10 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-lg shadow-inner">
                    <Building2 className="w-6 h-6 text-black" />
                  </div>
                  <h3 id="modal-title" className="text-2xl font-bold text-white">
                    {editingId ? "Edit Vendor Details" : "Add New Vendor"}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:text-black hover:bg-opacity-20 p-2 rounded-full transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-2">
              
              {/* Vendor Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  {...register("name")}
                  className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl transition-all`}
                  placeholder="e.g., ABC Corp Pvt Ltd"
                  autoComplete="organization"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="font-extrabold mr-1">•</span> {errors.name.message}
                  </p>
                )}
              </div>

              {/* PAN Number */}
              <div className="space-y-2">
                <label htmlFor="pan" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-purple-600" />
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="pan"
                  {...register("pan")}
                  className={`w-full px-4 py-3 border-2 ${errors.pan ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'} rounded-xl transition-all uppercase font-mono`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                {errors.pan && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="font-extrabold mr-1">•</span> {errors.pan.message}
                  </p>
                )}
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <label htmlFor="gst" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CreditCard className="w-4 h-4 text-pink-600" />
                  GST Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="gst"
                  {...register("gst")}
                  className={`w-full px-4 py-3 border-2 ${errors.gst ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 focus:ring-pink-100 focus:border-pink-500'} rounded-xl transition-all uppercase font-mono`}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
                {errors.gst && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="font-extrabold mr-1">•</span> {errors.gst.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl transition-all`}
                  placeholder="vendor@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="font-extrabold mr-1">•</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Bank Account Number */}
              <div className="space-y-2">
                <label htmlFor="bankAccount" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Bank Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="bankAccount"
                  {...register("bankAccount")}
                  type="text"
                  inputMode="numeric"
                  className={`w-full px-4 py-3 border-2 ${errors.bankAccount ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 focus:ring-green-100 focus:border-green-500'} rounded-xl transition-all`}
                  placeholder="1234567890 (Digits only)"
                  autoComplete="off"
                />
                {errors.bankAccount && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="font-extrabold mr-1">•</span> {errors.bankAccount.message}
                  </p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-600 disabled:from-gray-400 disabled:to-gray-500 hover:from-gray-700 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.01] shadow-xl disabled:shadow-md focus:ring-4 focus:ring-indigo-300"
                >
                  {(isAdding || isUpdating) && <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>}
                  {editingId ? (isUpdating ? "Updating..." : "Update Vendor") : (isAdding ? "Adding..." : "Add Vendor")}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorComponent;