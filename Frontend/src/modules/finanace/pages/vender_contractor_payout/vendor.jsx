import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Search, Filter, Building2, User, Mail, Edit3, Trash2, FileText, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useGetVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} from "@/api/finance/Quatation_Billing/vender.api.js";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const vendorSchema = yup.object().shape({
  name: yup.string().required("Vendor name is required").min(3, "Minimum 3 characters").max(20, "Maximum 50 characters")
  .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  phone: yup.string().required("phone is required"),
  address: yup.string().required("Address is required"),
});

const Vendors = () => {
  const { data, isLoading } = useGetVendorsQuery();
  const [createVendor] = useCreateVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
   
console.log(data,"vendor");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(vendorSchema),
    defaultValues: { name: "", email: "", phone: "",address:"" },
    mode:"onChange"
  });
  

  // Filter vendors
  const filteredVendors = data?.data?.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
                          vendor.phone.toLowerCase().includes(searchTerm.toLowerCase());
                          vendor.address.toLowerCase().includes(searchTerm.toLowerCase());
     
    return matchesSearch ;
  });

  
  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await updateVendor({ id: editingId, ...formData }).unwrap();
        toast.success("✅ Vendor updated");
        setEditingId(null);
      } else {
        await createVendor(formData).unwrap();
        toast.success("✅ Vendor created");
      }
      reset();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save vendor");
    }
  };

  const handleEdit = (vendor) => {
    setValue("name", vendor.name);
    setValue("email", vendor.email);
    setValue("phone", vendor.phone);
    setValue("address", vendor.address);
    setEditingId(vendor._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteVendor(id).unwrap();
      toast.success("✅ Vendor deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete vendor");
    }
  };
  const modalRef = useRef(null);
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

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "N/A";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent mb-2">
              Vendor Management
            </h1>
            <p className="text-gray-600 text-lg">Manage your vendors and contractors efficiently</p>
          </div>
          <button onClick={() => setShowForm(true)} className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            Add New Vendor
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6  flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search vendors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className=" border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText size={24} /> Vendors List
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl  ">
            <table className="w-full ">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Address</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Created</th>
                  <th className="px-6 py-2 text-right text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredVendors?.map((vendor, index) => (
                  <tr key={vendor._id} className={`hover:bg-blue-50/50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-1 text-sm font-medium text-gray-900">{vendor.name}</td>
                    <td className="px-6 py-1 text-sm text-gray-700">{vendor.email}</td>
                    <td className="px-6 py-1 text-sm text-gray-700">{vendor.phone}</td>
                    <td className="px-6 py-1 text-sm text-gray-700">{vendor.address}</td>
                    <td className="px-6 py-1 text-sm text-gray-700">{formatDate(vendor.createdAt)}</td>
                    <td className="px-6 py-1 text-right flex justify-end gap-2">
                      <button onClick={() => handleEdit(vendor)} className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(vendor._id)} className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vendor Modal */}
   {showForm && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
    <div
      ref={modalRef}
      className="bg-white w-full max-w-md rounded-xl shadow-2xl relative overflow-hidden"
    >
      <div className="bg-gradient-to-r from-gray-600 to-gray-600 text-white p-3 relative">
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg"
        >
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold">{editingId ? "Edit Vendor" : "Add New Vendor"}</h2>
        <p className="text-white/70 text-sm">
          {editingId
            ? "Update vendor information"
            : "Fill in the details below to add a new vendor"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-3 space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Vendor Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter Vendor Name"
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter Email"
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Phone</label>
        <input type="phone"
            {...register("phone")}
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
           />       
              {errors.type && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
 <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Address</label>
        <input type="text"
            {...register("address")}
            className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
           />       
              {errors.type && <p className="text-red-500 text-xs">{errors.address.message}</p>}
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-600 text-white rounded-lg text-sm font-medium"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Vendors;
