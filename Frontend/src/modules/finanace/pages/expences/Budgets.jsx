import React, { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Plus, Edit2, Trash2, DollarSign, Building2, Briefcase, Target, TrendingUp, PieChart, Filter, X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

import {
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} from "@/api/finance/Quatation_Billing/expenceBudget.api";

import { useGetCategoriesQuery } from "@/api/finance/Quatation_Billing/expenceCategory";

const Budgets = () => {
  const { data: budgets, isLoading } = useGetBudgetsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const [createBudget] = useCreateBudgetMutation();
  const [updateBudget] = useUpdateBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const itemsPerPage = 8;
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    category: "",
    department: "",
    project: "",
    amount: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Get unique departments from categories
  const uniqueDepartments = useMemo(() => {
    if (!categories) return [];
    return [...new Set(categories.map(cat => cat.department))];
  }, [categories]);

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    if (!categories) return [];
    return [...new Set(categories.map(cat => cat.category))];
  }, [categories]);

  // Filtered budgets
  const filteredBudgets = useMemo(() => {
    if (!budgets) return [];
    let filtered = budgets.filter(
      (b) =>
        (b.category?.category ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.category?.department ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.project ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(b => b.category?.department === selectedDepartment);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(b => b.category?.category === selectedCategory);
    }

    return filtered;
  }, [budgets, searchTerm, selectedDepartment, selectedCategory]);

  // Budget statistics
  const budgetStats = useMemo(() => {
    if (!budgets) return { total: 0, count: 0, avgBudget: 0, departments: 0 };
    
    const total = budgets.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const uniqueDepts = new Set(budgets.map(b => b.category?.department).filter(Boolean));
    
    return {
      total,
      count: budgets.length,
      avgBudget: budgets.length > 0 ? total / budgets.length : 0,
      departments: uniqueDepts.size
    };
  }, [budgets]);

  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateForm = () => {
    const errors = {};
    if (!form.category) errors.category = "Category is required";
    if (!form.department) errors.department = "Department is required";
    if (!form.amount) errors.amount = "Amount is required";
    if (form.amount && (isNaN(form.amount) || parseFloat(form.amount) <= 0)) {
      errors.amount = "Amount must be a positive number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModalAdd = () => {
    setForm({ category: "", department: "", project: "", amount: "" });
    setFormErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openModalEdit = (b) => {
    setForm({
      category: b.category?._id || "",
      department: b.category?.department || "",
      project: b.project || "",
      amount: b.amount,
    });
    setFormErrors({});
    setEditId(b._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setForm({ category: "", department: "", project: "", amount: "" });
    setFormErrors({});
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editId) {
        await updateBudget({ id: editId, body: form }).unwrap();
        toast.success("Budget updated successfully! 🎉");
      } else {
        await createBudget(form).unwrap();
        toast.success("Budget added successfully! ✅");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err?.data?.error || "Something went wrong! ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget? This action cannot be undone.")) return;
    try {
      await deleteBudget(id).unwrap();
      toast.success("Budget deleted successfully! 🗑️");
    } catch (err) {
      toast.error(err?.data?.error || "Error deleting budget");
    }
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCat = categories?.find(c => c._id === categoryId);
    setForm({
      ...form,
      category: categoryId,
      department: selectedCat?.department || ""
    });
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
  }, [searchTerm, selectedDepartment, selectedCategory]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       <div className="mb-8 shadow-md p-4 bg-white rounded-xl">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-600 rounded-xl text-white">
        <Target className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
    </div>
    <button 
      onClick={openModalAdd} 
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
    >
      <Plus className="w-5 h-5" />
      Add Budget
    </button>
  </div>
  <p className="text-gray-600 ml-12 pb-4">
    Plan and track your departmental budgets effectively
  </p>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1  md:grid-cols-4 gap-6 mb-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center  justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetStats.total)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="textlg font-medium text-gray-600">Total Budgets</p>
                <p className="text-2xl font-bold text-gray-900">{budgetStats.count}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetStats.avgBudget)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{budgetStats.departments}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search budgets, departments, or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Add Button */}
          
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedDepartment !== "all" || selectedCategory !== "all") && (
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
              {selectedDepartment !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Department: {selectedDepartment}
                  <button onClick={() => setSelectedDepartment("all")} className="hover:bg-green-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:bg-purple-200 rounded-full p-0.5">
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading budgets...</span>
            </div>
          ) : paginatedBudgets.length === 0 ? (
            <div className="text-center py-20">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets found</h3>
              <p className="text-gray-600 mb-6">
                {budgets?.length === 0 
                  ? "Get started by creating your first budget" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {budgets?.length === 0 && (
                <button onClick={openModalAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add First Budget
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Budget Amount
                      </th>
                      <th className="px-6 py-2 text-right text-xs font-semibold textwhite0 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedBudgets.map((budget) => (
                      <tr key={budget._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-1 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCategoryIcon(budget.category?.category)}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(budget.category?.category)}`}>
                              {budget.category?.category || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-1 border whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{budget.category?.department || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-1 border whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{budget.project || "No Project"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-1 border whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-semibold text-green-600">
                              {formatCurrency(budget.amount)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-1 border whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openModalEdit(budget)} 
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Edit budget"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(budget._id)} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Delete budget"
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
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBudgets.length)} of {filteredBudgets.length} budgets
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
                                ? 'bg-green-600 text-white shadow-sm' 
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
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all">
              {/* Modal Header */}
             <div className="px-6 py-4 border-b border-gray-700 bg-gray-900 rounded-t-2xl">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-semibold text-white">
      {editId ? "Edit Budget" : "Add New Budget"}
    </h3>
    <button 
      onClick={handleCloseModal}
      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
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
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        formErrors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Category...</option>
                      {categories?.map(c => (
                        <option key={c._id} value={c._id}>
                          {getCategoryIcon(c.category)} {c.category}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Department Input */}
                 <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Department *
  </label>
  <div className="relative">
    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      value={form.department}
      onChange={(e) => setForm({ ...form, department: e.target.value })}
      placeholder="Enter Department"
      className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-gray-700 ${
        formErrors.department ? 'border-red-400' : 'border-gray-300'
      }`}
    />
  </div>
  {formErrors.department && (
    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {formErrors.department}
    </p>
  )}
</div>

                  {/* Project Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project (Optional)
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        value={form.project}
                        onChange={(e) => setForm({ ...form, project: e.target.value })}
                        placeholder="Enter project name..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        placeholder="Enter budget amount..."
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                          formErrors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {formErrors.amount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.amount}
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
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center gap-2"
                  >
                    {editId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editId ? "Update Budget" : "Add Budget"}
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

export default Budgets;