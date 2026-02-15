import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Plus, Edit2, Trash2, Package, Building2, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/api/finance/Quatation_Billing/expenceCategory";

const Category = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const itemsPerPage = 8;
  const modalRef = useRef(null);

  // Category enum from schema
  const categoryOptions = ["Logistics", "Material", "Office Supplies", "Travel", "AMC", "Repairs"];

  // Validation schema
  const validationSchema = Yup.object().shape({
    category: Yup.string().oneOf(categoryOptions, "Invalid Category").required("Category is required"),
    department: Yup.string().required("Department is required"),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    let filtered = categories.filter(cat =>
      (cat.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (cat.department?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    
    if (selectedFilter !== "all") {
      filtered = filtered.filter(cat => cat.category === selectedFilter);
    }
    
    return filtered;
  }, [categories, searchTerm, selectedFilter]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModalAdd = () => {
    reset({ category: "", department: "" });
    setEditId(null);
    setShowModal(true);
  };

  const openModalEdit = (cat) => {
    setValue("category", cat.category);
    setValue("department", cat.department);
    setEditId(cat._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editId) {
        await updateCategory({ id: editId, data }).unwrap();
        toast.success("Category updated successfully! 🎉");
      } else {
        await createCategory(data).unwrap();
        toast.success("Category added successfully! ✅");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.data?.error || "Something went wrong! ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully! 🗑️");
    } catch (err) {
      toast.error(err.data?.error || "Error deleting category");
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleCloseModal();
    };
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  const getCategoryIcon = (category) => {
    const icons = {
      "Logistics": "🚚",
      "Material": "📦",
      "Office Supplies": "📋",
      "Travel": "✈️",
      "AMC": "🔧",
      "Repairs": "🛠️"
    };
    return icons[category] || "📁";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Logistics": "bg-blue-100 text-blue-800",
      "Material": "bg-green-100 text-green-800",
      "Office Supplies": "bg-purple-100 text-purple-800",
      "Travel": "bg-orange-100 text-orange-800",
      "AMC": "bg-yellow-100 text-yellow-800",
      "Repairs": "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
       <div className="mb-2 "> 
    <div className="flex items-start justify-between  p-4 shadow-md">   
        <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2"> 
                <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg"> 
                    <Package className="w-5 h-5" />
                </div> 
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Expense Categories</h1>
            </div>
    
            <p className="text-gray-500 ml-12 text-base">
                Manage your expense categories and departments efficiently.
            </p>
        </div> 
        <button 
            onClick={openModalAdd} 
            className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
            <Plus className="w-5 h-5" />
            Add Category
        </button>

    </div>
</div>
 
        {/* Controls */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Add Button */}
            
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedFilter !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Category: {selectedFilter}
                  <button onClick={() => setSelectedFilter("all")} className="hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading categories...</span>
            </div>
          ) : paginatedCategories.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-6">
                {categories?.length === 0 
                  ? "Get started by creating your first category" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {categories?.length === 0 && (
                <button onClick={openModalAdd} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add First Category
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-2 text-right text-xs font-semibold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCategories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-1 border whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCategoryIcon(cat.category)}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(cat.category)}`}>
                              {cat.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-1 border whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{cat.department}</span>
                          </div>
                        </td>
                        <td className="px-6 py-1 border whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openModalEdit(cat)} 
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Edit category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(cat._id)} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)} 
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                          <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)} 
                            className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
                              currentPage === i + 1 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)} 
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gray-700 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {editId ? "Edit Category" : "Add New Category"}
                  </h3>
                  <button 
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Type
                    </label>
                    <select 
                      {...register("category")} 
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category...</option>
                      {categoryOptions.map((cat, i) => (
                        <option key={i} value={cat}>
                          {getCategoryIcon(cat)} {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Department Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        {...register("department")} 
                        placeholder="Enter department name..."
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit(onSubmit)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2"
                  >
                    {editId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editId ? "Update Category" : "Add Category"}
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

export default Category;