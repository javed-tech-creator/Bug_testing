import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Search, Filter, FileText, DollarSign, Building2, Calendar, ShoppingCart, Package, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  useGetPOsQuery,
  useCreatePOMutation,
  useUpdatePOMutation,
  useDeletePOMutation,
} from "@/api/finance/Quatation_Billing/po.api.js";

import { useGetVendorsQuery } from "@/api/finance/Quatation_Billing/vender.api.js";

// Validation schema
const poSchema = yup.object().shape({
  vendor: yup.string().required("Vendor is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(100, "Description cannot exceed 200 characters"),
  totalAmount: yup
    .number()
    .typeError("totalAmount must be a number")
    .required("totalAmount is required")
    .min(1, "totalAmount must be at least 1")
    .max(1000000, "totalAmount cannot exceed 1,000,000"),
});

const PurchaseOrders = () => {
  const { data, isLoading } = useGetPOsQuery();
  const { data: vendorsData } = useGetVendorsQuery();
  const [createPO] = useCreatePOMutation();
  const [updatePO] = useUpdatePOMutation();
  const [deletePO] = useDeletePOMutation();

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const modalRef=useRef(null)
  // React Hook Form setup

  
  
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(poSchema),
    defaultValues: { vendor: "", description: "", totalAmount: "" },
    mode:"onChange"
  });

  // Filter POs
  const filteredPOs = data?.data?.filter(po => {
    const matchesSearch = po.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.poNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await updatePO({ id: editingId, ...formData, totalAmount: Number(formData.totalAmount) }).unwrap();
        toast.success("✅ Purchase Order updated successfully");
        setEditingId(null);
      } else {
        await createPO({ ...formData, totalAmount: Number(formData.totalAmount) }).unwrap();
        toast.success("✅ Purchase Order created successfully");
      }
      reset();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to ${editingId ? "update" : "create"} purchase order`);
    }
  };

  const handleEdit = (po) => {
    setValue("vendor", po.vendor?._id || po.vendor || "");
    setValue("description", po.description || "");
    setValue("totalAmount", po.totalAmount || "");
    setEditingId(po._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      await deletePO(id).unwrap();
      toast.success("✅ Purchase Order deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete purchase order");
    }
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCancel(); // ✅ modal close
    }
  };

  if (showForm) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showForm]);
  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingId(null);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount || 0);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Purchase Orders
            </h1>
            <p className="text-gray-600 text-lg">Manage and track all purchase orders efficiently</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            New Purchase Order
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by description, vendor, or PO number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-11 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              
              
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className=" border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText size={24} /> Purchase Orders List
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">PO Details</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Description</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Created</th>
                  <th className="px-6 py-2 text-right text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredPOs?.map((po, index) => (
                  <tr key={po._id} className={`hover:bg-blue-50/50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{po.poNumber || `PO-${po._id?.slice(-6)}`}</div>
                          <div className="text-xs text-gray-500">ID: {po._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-1 text-sm font-medium text-gray-900">{po.vendor?.name || 'N/A'}</td>
                    <td className="px-6 py-1 text-sm text-gray-700 max-w-xs truncate" title={po.description}>{po.description || 'No description'}</td>
                    <td className="px-6 py-1 text-sm font-semibold text-gray-900">{formatCurrency(po.totalAmount)}</td>
                    <td className="px-6 py-1 text-sm font-medium  text-gray-900">{po?.status || 'N/A'}</td>

                    <td className="px-6 py-1 text-sm text-gray-700">{formatDate(po.createdAt)}</td>
                    <td className="px-6 py-1 text-right flex justify-end gap-2">
                      <button onClick={() => handleEdit(po)} className="group bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 p-2 rounded-lg transition-all duration-200 hover:scale-110" title="Edit Purchase Order"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(po._id)} className="group bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 p-2 rounded-lg transition-all duration-200 hover:scale-110" title="Delete Purchase Order"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredPOs?.length && (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No purchase orders found</h3>
              <p className="text-gray-500">{searchTerm || statusFilter !== "All" ? "Try adjusting your search or filter criteria" : "Get started by creating your first purchase order"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form with validation */}
   {showForm && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
    <div
      ref={modalRef}
      className="bg-white w-full max-w-md rounded-xl shadow-xl relative overflow-hidden"
    >
      <div className="bg-gradient-to-r from-gray-700 to-gray-700 text-white p-3 relative">
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-all duration-200"
        >
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold mb-1">
          {editingId ? "Edit Purchase Order" : "New Purchase Order"}
        </h2>
        <p className="text-white/70 text-sm">
          {editingId
            ? "Update purchase order details"
            : "Fill in the details below to create a new purchase order"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-3 space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Vendor</label>
          <select
            {...register("vendor")}
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="">Select Vendor</option>
            {vendorsData?.data?.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.name}
              </option>
            ))}
          </select>
          {errors.vendor && (
            <p className="text-red-500 text-xs">{errors.vendor.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows="2"
            placeholder="Enter description"
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Amount (₹)</label>
          <input
            type="number"
            {...register("totalAmount")}
            placeholder="Enter amount"
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            min="0"
            step="0.01"
          />
          {errors.totalAmount && (
            <p className="text-red-500 text-xs">{errors.totalAmount.message}</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default PurchaseOrders;
