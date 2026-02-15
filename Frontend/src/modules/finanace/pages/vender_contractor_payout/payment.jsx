import React, { useEffect, useRef, useState } from "react";
import { Search, Plus, Edit3, Trash2, Eye, Filter, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

import {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentStageMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from "@/api/finance/Quatation_Billing/payment.api";

import { useGetPOsQuery } from "@/api/finance/Quatation_Billing/po.api.js";
import { useGetVendorsQuery } from "@/api/finance/Quatation_Billing/vender.api.js";

// ✅ Yup Schema
const paymentSchema = Yup.object().shape({
  po: Yup.string().required("PO is required"),
  vendor: Yup.string().required("Vendor is required"),
  task: Yup.string().min(3, "Task must be at least 3 characters").required("Task is required"),
  tds: Yup.number()
    .typeError("TDS must be a number")
    .min(0, "TDS cannot be negative")
    .required("TDS is required"),
});

const Payments = () => {
  const { data: paymentsData, isLoading, refetch } = useGetPaymentsQuery();
  const { data: posData, isLoading: posLoading } = useGetPOsQuery();
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery();

  const payments = paymentsData?.data || [];
  const pos = posData?.data || [];
  const vendors = vendorsData?.data || [];

  const [createPayment] = useCreatePaymentMutation();
  const [updatePaymentStage] = useUpdatePaymentStageMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Form fields
  const [selectedPo, setSelectedPo] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [task, setTask] = useState("");
  const [tds, setTds] = useState(0);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Error state
  const [errors, setErrors] = useState({});
const modalRef=useRef(null)




  const getStageIcon = (stage) => {
    switch (stage) {
      case "Requested": return <Clock className="w-4 h-4" />;
      case "Approved": return <AlertCircle className="w-4 h-4" />;
      case "Paid": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "Requested": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Approved": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Paid": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsUpdateMode(false);
    setSelectedPaymentId(null);
    setSelectedPo("");
    setSelectedVendor("");
    setTask("");
    setTds(0);
    setErrors({});
    setShowModal(true);
  };

  // Open Update Modal
  const openUpdateModal = (payment) => {
    setIsUpdateMode(true);
    setSelectedPaymentId(payment._id);
    setSelectedPo(payment.po?._id || "");
    setSelectedVendor(payment.vendor?._id || "");
    setTask(payment.task || "");
    setTds(payment.tds || 0);
    setErrors({});
    setShowModal(true);
  };

  // CREATE OR UPDATE PAYMENT
  const handleSubmitPayment = async () => {
    const formData = { po: selectedPo, vendor: selectedVendor, task, tds };

    try {
      // ✅ Yup validation
      await paymentSchema.validate(formData, { abortEarly: false });
      setErrors({}); // clear old errors

      if (isUpdateMode) {
        await updatePayment({
          id: selectedPaymentId,
          ...formData,
          tds: Number(tds),
        }).unwrap();
        toast.success("Payment updated successfully");
      } else {
        await createPayment({
          ...formData,
          tds: Number(tds),
        }).unwrap();
        toast.success("Payment created successfully");
      }

      setShowModal(false);
      refetch();
    } catch (err) {
      if (err.inner) {
        // Collect Yup errors
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);

        // Toast first error
        toast.error(err.inner[0].message);
      } else {
        console.error(err);
        toast.error(isUpdateMode ? "Failed to update payment" : "Failed to create payment");
      }
    }
  };

  // DELETE PAYMENT
  const handlePaymentDelete = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await deletePayment(paymentId).unwrap();
      toast.success("Payment deleted successfully");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete payment");
    }
  };

  // UPDATE STAGE
  const handleStageUpdate = async (paymentId, stage) => {
    try {
      await updatePaymentStage({ id: paymentId, stage }).unwrap();
      toast.success(`Stage updated to ${stage}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stage");
    }
  };
   useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setShowModal(); 
        }
      };
  
      if (showModal) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showModal]);
  

  // Filter and sort payments
  const filteredAndSortedPayments = payments
    .filter(payment => {
      const matchesSearch =
        payment.po?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.task?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterStage || payment.stage === filterStage;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "amount" || sortBy === "netAmount" || sortBy === "tds") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPayments = filteredAndSortedPayments.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredAndSortedPayments.length / rowsPerPage);

  // Calculate statistics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const paidAmount = payments.filter(p => p.stage === "Paid").reduce((sum, p) => sum + (p.netAmount || 0), 0);
  const pendingAmount = payments.filter(p => p.stage !== "Paid").reduce((sum, p) => sum + (p.netAmount || 0), 0);

  if (isLoading || posLoading || vendorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-1">Manage your payments, POs, and vendor transactions</p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Payment
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          {/* Total Payments */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 
                  hover:shadow-xl hover:-translate-y-0 transform transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Payments</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalPayments}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl 
                      flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 
                  hover:shadow-xl hover:-translate-y-0 transform transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-700 rounded-xl 
                      flex items-center justify-center shadow-md">
                <Download className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Paid Amount */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 
                  hover:shadow-xl hover:-translate-y-0 transform transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Paid Amount</p>
                <p className="text-2xl font-extrabold text-green-600 mt-1">
                  ₹{paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl 
                      flex items-center justify-center shadow-md">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 
                  hover:shadow-xl hover:-translate-y-0 transform transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Amount</p>
                <p className="text-2xl font-extrabold text-orange-600 mt-1">
                  ₹{pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl 
                      flex items-center justify-center shadow-md">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>


        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 mb-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Advanced Search Input */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by PO number, vendor, or task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/30 hover:bg-white hover:border-gray-300 placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Stage Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 appearance-none cursor-pointer min-w-[140px] font-medium"
                >
                  <option value="">All Stages</option>
                  <option value="Requested"> Requested</option>
                  <option value="Approved"> Approved</option>
                  <option value="Paid"> Paid</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {filterStage && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    1
                  </span>
                )}
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                </svg>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 appearance-none cursor-pointer min-w-[160px] font-medium"
                >
                  <option value="createdAt-desc"> Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc"> Lowest Amount</option>
                  <option value="netAmount-desc"> Highest Net</option>
                  <option value="netAmount-asc"> Lowest Net</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || filterStage) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStage("");
                  }}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-gray-300 font-medium flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Showing <span className="font-semibold text-gray-900">{filteredAndSortedPayments.length}</span> of <span className="font-semibold text-gray-900">{totalPayments}</span> payments
              {searchTerm && (
                <span className="text-blue-600">
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
            </div>

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-2">
              {["Requested", "Approved", "Paid"].map(stage => {
                const count = payments.filter(p => p.stage === stage).length;
                return (
                  <button
                    key={stage}
                    onClick={() => setFilterStage(filterStage === stage ? "" : stage)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${filterStage === stage
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                      }`}
                  >
                    {stage} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 border-b border-gray-100">
                <tr>
                  <th className="text-left py-2 border border-gray-500 px-4 font-semibold text-white">PO Details</th>
                  <th className="text-left  py-2 border border-gray-500 px-4 font-semibold text-white">Vendor</th>
                  <th className="text-left py-2  border border-gray-500 px-4 font-semibold text-white">Task</th>
                  <th className="text-left  py-2 border border-gray-500 px-4 font-semibold text-white">Amount</th>
                  <th className="text-left py-2 border border-gray-500 px-4 font-semibold text-white">TDS</th>
                  <th className="text-left  py-2 border border-gray-500 px-4 font-semibold text-white">Net Amount</th>
                  <th className="text-left py-2  border border-gray-500 px-4 font-semibold text-white">Status</th>
                  <th className="text-left  py-2 border border-gray-500 px-4 font-semibold text-white">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentPayments.length === 0 ? (

                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center">
                        <Search className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="text-base font-medium">No payments found</p>
                        <p className="text-xs">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-blue-400"
                    >
                      <td className="px-4 border-2">
                        <div>
                          <p className="font-semibold w-25 text-gray-900">{payment.po?.poNumber}</p>
                          <p className="text-xs text-gray-500">{payment.po?.description}</p>
                        </div>
                      </td>

                      <td className="px-4  border-2">
                        <p className="text-xs text-gray-900">{payment.vendor?.name}</p>
                      </td>

                      <td className="px-4  border-2">
                        <p className="text-gray-900">{payment.task}</p>
                      </td>

                      <td className="px-4  border-2">
                        <p className="font-semibold text-gray-900">
                          ₹{payment.amount?.toLocaleString()}
                        </p>
                      </td>

                      <td className="px-4  border-2">
                        <p className="text-gray-900">₹{payment.tds?.toLocaleString()}</p>
                      </td>

                      <td className="px-4  border-2">
                        <p className="font-semibold text-green-600">
                          ₹{payment.netAmount?.toLocaleString()}
                        </p>
                      </td>

                      <td className="px-4  border-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStageColor(
                            payment.stage
                          )}`}
                        >
                          {getStageIcon(payment.stage)}
                          {payment.stage}
                        </span>
                      </td>

                      <td className="py-3 px-4 border-2">
                        <div className="flex items-center  gap-2">
                          {payment.stage?.toLowerCase() === "approved" && (
                            <button
                              onClick={() => handleStageUpdate(payment._id, "Paid")}
                              className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                          {payment.stage === "Requested" && (
                            <button
                              onClick={() => handleStageUpdate(payment._id, "Approved")}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {payment.stage == "Requested" && (
                            <button
                              onClick={() => openUpdateModal(payment)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handlePaymentDelete(payment._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-left gap-2 px-6 py-4 border-t border-gray-200">
          {/* Previous Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 rounded-md border text-sm font-medium 
              text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors 
          ${currentPage === page
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1.5 rounded-md border text-sm font-medium 
              text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>



        {/* Modal */}
    {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-slideIn">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-gray-500 to-gray-600 px-8 py-3 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {isUpdateMode ? (
                      <Edit3 className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {isUpdateMode ? "Update Payment" : "Create New Payment"}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {isUpdateMode ? "Modify payment details below" : "Fill in the payment information"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-2 space-y-2 max-h-96 overflow-y-auto">
                {/* PO Selection */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Purchase Order
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPo}
                      onChange={(e) => setSelectedPo(e.target.value)}
                      className="w-full px-4 py-2 border-3 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white appearance-none cursor-pointer font-medium"
                    >
                      <option value="">Choose Purchase Order</option>
                      {pos.map((po) => (
                        <option key={po._id} value={po._id}>
                          {po.poNumber} - {po.description}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.po && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.po}
                    </div>
                  )}
                </div>

                {/* Vendor Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Vendor
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVendor}
                      onChange={(e) => setSelectedVendor(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white appearance-none cursor-pointer font-medium"
                    >
                      <option value="">Choose Vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.vendor && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.vendor}
                    </div>
                  )}
                </div>

                {/* Task Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Task Description
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter detailed task description..."
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white placeholder-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.task && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.task}
                    </div>
                  )}
                </div>

                {/* TDS Amount */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    TDS Amount
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</div>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={tds}
                      onChange={(e) => setTds(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white placeholder-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.tds && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.tds}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between gap-4 px-8 py-6 bg-gray-50/50 rounded-b-2xl border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  All fields marked with <span className="text-blue-500">●</span> are required
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-1 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    className="px-6  bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    {isUpdateMode ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Update  
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create  
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;