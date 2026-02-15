import React, { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useUpdateStatusMutation,
  useBudgetReportQuery,
} from "@/api/finance/Quatation_Billing/expenceE.api";

import { useGetCategoriesQuery } from "@/api/finance/Quatation_Billing/expenceCategory";
import {Package} from "lucide-react"
 
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  category: yup.string().required("Category is required"),
  department: yup.string().required("Department is required"),
  project: yup.string(),
  task: yup.string(),
  receipt: yup.mixed(),
});

const Expenses = () => {
  const { data: expenses, isLoading, isError, refetch } = useGetExpensesQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [createExpense] = useCreateExpenseMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const { data: report } = useBudgetReportQuery({ project: "", department: "" });

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchReport, setSearchReport] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");
  const itemsPerPage = 8;
  const modalRef = useRef(null);
 

  const reportMap = report
    ? Object.keys(report).reduce((acc, key) => {
      acc[key] = report[key];
      return acc;
    }, {})
    : {};

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const getDailySummary = (expenses) => {
    const summary = {};
    expenses.forEach((e) => {
      const date = new Date(e.createdAt).toLocaleDateString('en-IN');
      if (!summary[date]) summary[date] = 0;
      summary[date] += e.amount || 0;
    });
    return summary;
  };

  const getMonthlySummary = (expenses) => {
    const summary = {};
    expenses.forEach((e) => {
      const date = new Date(e.createdAt);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!summary[monthKey]) summary[monthKey] = 0;
      summary[monthKey] += e.amount || 0;
    });
    return summary;
  };

  const dailySummary = useMemo(() => getDailySummary(expenses || []), [expenses]);
  const monthlySummary = useMemo(() => getMonthlySummary(expenses || []), [expenses]);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter((e) => {
      const categoryName = typeof e.category === "string"
        ? categories?.find((c) => c._id === e.category)?.category || e.category
        : e.category?.category || "";

      return (
        (e.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.department ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.project ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.task ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [expenses, searchTerm, categories]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModalAdd = () => {
    reset({
      title: "",
      amount: "",
      category: "",
      department: "",
      project: "",
      task: "",
      receipt: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setIsSubmitting(false);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      await createExpense(formData).unwrap();
      toast.success("Expense created successfully!");
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error(err);
      const errorMessage = err?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id).unwrap();
      toast.success("Expense deleted successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      const errorMessage = err?.data?.message || "Delete failed";
      toast.error(errorMessage);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this expense?")) return;
    try {
      await updateStatus({ id, status: "Approved" }).unwrap();
      toast.success("Expense approved successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      const errorMessage = err?.data?.message || "Failed to approve expense";
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-500 text-white',
      'Approved': 'bg-green-500 text-white',
      'Rejected': 'bg-red-500 text-white',
    };

    const config = statusConfig[status] || statusConfig['Pending'];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config} shadow-sm`}>
        {status || 'Pending'}
      </span>
    );
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'HR': 'bg-purple-100 text-purple-800',
      'Finance': 'bg-green-100 text-green-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'IT': 'bg-blue-100 text-blue-800',
      'Operations': 'bg-orange-100 text-orange-800',
      'Logistics': 'bg-indigo-100 text-indigo-800',
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleCloseModal();
    };
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading expenses...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">Failed to load expenses. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const totalExpenseAmount = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  // const approvedExpenses = filteredExpenses.filter(exp => exp.status === 'Approved').length;
  // const pendingExpenses = filteredExpenses.filter(exp => exp.status === 'Requested').length;

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto ">

        {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-3 border border-gray-100">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    {/* Left: Icon + Title */}
    <div className="flex items-center gap-4">
      <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg">
        <Package className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Expense Management System
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Track and manage your business expenses efficiently
        </p>
      </div>
    </div>

    {/* Right: Stats */}
    <div className="text-right">
      <div className="text-sm text-gray-500">Total Amount</div>
      <div className="text-2xl md:text-3xl font-bold text-blue-600">
        ₹{totalExpenseAmount.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{filteredExpenses.length} entries</div>
    </div>

  </div>
 

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            
            <div className="bg-gradient-to-br from-gray-100 to-gray-100 text-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition duration-300 ease-in-out border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">Total Expenses</p>
                  <p className="text-4xl font-extrabold text-indigo-400">{filteredExpenses.length}</p>
                </div>
                <div className="text-4xl opacity-70">📊</div>
              </div>
            </div>  
            <div className="bg-gradient-to-br from-gray-100 to-gray-100 text-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition duration-300 ease-in-out border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">Approved</p>
                  <p className="text-4xl font-extrabold text-green-400">{approvedExpenses}</p>
                </div>
                <div className="text-4xl opacity-70">✅</div>
              </div>
            </div> 
            <div className="bg-gradient-to-br from-gray-100 to-gray-100 text-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition duration-300 ease-in-out border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">Pending</p>
                  <p className="text-4xl font-extrabold text-yellow-400">{pendingExpenses}</p>
                </div>
                <div className="text-4xl opacity-70">⏳</div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Search and Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-3 mb-3 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search expenses by title, department, project, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border-2  rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={openModalAdd}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg font-semibold flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Expense
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'expenses', name: 'All Expenses', icon: '' },
                { id: 'daily', name: 'Daily Summary', icon: '' },
                { id: 'monthly', name: 'Monthly Summary', icon: '' },
                { id: 'budget', name: 'Budget Report', icon: '' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center gap-2`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Expenses Table */}
            {activeTab === 'expenses' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase  border-gray-500 tracking-wider rounded-tl-lg">#</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Title</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Department</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Category</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase  border border-gray-500 tracking-wider">Amount</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Project/Task</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Status</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Receipt</th>
                      <th className="px-6 py-2 text-left text-xs font-bold uppercase border border-gray-500 tracking-wider">Date</th>
                      <th className="px-6 py-2 text-right text-xs font-bold uppercase borde tracking-wider rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses found</h3>
                            <p className="text-gray-500">Try adjusting your search or add a new expense</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedExpenses.map((exp, index) => (
                        <tr key={exp._id} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{exp.title}</div>
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(exp.department)}`}>
                              {exp.department}
                            </span>
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap text-sm text-gray-900">
                            {typeof exp.category === "string"
                              ? categories?.find((c) => c._id === exp.category)?.category || exp.category
                              : exp.category?.category || "-"}
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            <div className="text-lg font-bold text-green-600">₹{exp.amount?.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {exp.project && <div className="font-medium">Project: {exp.project}</div>}
                              {exp.task && <div className="text-gray-600">Task: {exp.task}</div>}
                              {!exp.project && !exp.task && <span className="text-gray-400">-</span>}
                            </div>
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            {getStatusBadge(exp.status)}
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                            {exp.receiptUrl ? (
                              <button
                                onClick={() => window.open(exp.receiptUrl, "_blank")}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-xs font-semibold"
                              >
                                View PDF
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">No receipt</span>
                            )}
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap text-sm text-gray-600">
                            <div>{new Date(exp.createdAt).toLocaleDateString('en-IN')}</div>
                            <div className="text-xs text-gray-400">{new Date(exp.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td className="px-6 py-1 border border-gray-200 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {exp.status !== "Approved" && (
                                <button
                                  onClick={() => handleApprove(exp._id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-xs font-semibold"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(exp._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Daily Summary Table */}
            {activeTab === 'daily' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider rounded-tl-lg">#</th>
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider">Date</th>
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider rounded-tr-lg">Percentage of Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {Object.entries(dailySummary).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No daily data available
                        </td>
                      </tr>
                    ) : (
                      Object.entries(dailySummary)
                        .sort(([a], [b]) => new Date(b) - new Date(a))
                        .map(([date, total], index) => {
                          const percentage = totalExpenseAmount > 0 ? ((total / totalExpenseAmount) * 100).toFixed(1) : 0;
                          return (
                            <tr key={date} className="hover:bg-blue-50 transition-colors duration-150">
                              <td className="px-6 py-1  border border-gray-200 whitespace-nowrap">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-1  border border-gray-200 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">{date}</div>
                              </td>
                              <td className="px-6 py-1  border border-gray-200 whitespace-nowrap">
                                <div className="text-lg font-bold text-green-600">₹{total.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-1  border border-gray-200 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Monthly Summary Table */}
            {activeTab === 'monthly' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-800 text-white">
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider rounded-tl-lg">#</th>
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider">Month-Year</th>
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-2 border border-gray-500  text-left text-xs font-bold uppercase tracking-wider rounded-tr-lg">Percentage of Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {Object.entries(monthlySummary).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No monthly data available
                        </td>
                      </tr>
                    ) : (
                      Object.entries(monthlySummary)
                        .sort(([a], [b]) => {
                          const [monthA, yearA] = a.split(' ');
                          const [monthB, yearB] = b.split(' ');
                          return new Date(`${monthB} 1, ${yearB}`) - new Date(`${monthA} 1, ${yearA}`);
                        })
                        .map(([month, total], index) => {
                          const percentage = totalExpenseAmount > 0 ? ((total / totalExpenseAmount) * 100).toFixed(1) : 0;
                          return (
                            <tr key={month} className="hover:bg-purple-50 transition-colors duration-150">
                              <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                                <div className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full text-sm font-bold">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">{month}</div>
                              </td>
                              <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                                <div className="text-lg font-bold text-green-600">₹{total.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-1 border border-gray-200 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Budget Report Table */}
            {activeTab === 'budget' && report && (
              <div>
                <div className="mb-4">
                  <div className="relative w-full max-w-sm">

                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <input
                      type="text"
                      placeholder="Search budget report..."
                      value={searchReport}
                      onChange={(e) => setSearchReport(e.target.value)}
                      // Pushes the text right to make space for the icon (pl-10)
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-800 text-white">
                        <th className="px-6 py-2 text-left text-xs border border-gray-500 font-bold uppercase tracking-wider rounded-tl-lg">#</th>
                        <th className="px-6 py-2 text-left text-xs border border-gray-500 font-bold uppercase tracking-wider">Category</th>
                        <th className="px-6 py-2 text-left text-xs border border-gray-500 font-bold uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-2 text-left text-xs border border-gray-500 font-bold uppercase tracking-wider">Actual</th>
                        <th className="px-6 py-2 text-left text-xs border border-gray-500 font-bold uppercase tracking-wider">Remaining</th>
                        <th className="px-6 py-2 text-left text-xs border border-gray-500 font-bold uppercase tracking-wider rounded-tr-lg">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {Object.values(reportMap)
                        .filter((r) => (r.categoryName ?? r.categoryId).toLowerCase().includes(searchReport.toLowerCase()))
                        .map((r, index) => {
                          const progressPercentage = r.budget > 0 ? (r.actual / r.budget) * 100 : 0;
                          const isOverBudget = progressPercentage > 100;

                          return (
                            <tr key={r.categoryName || r.categoryId} className="hover:bg-green-50 transition-colors duration-150">
                              <td className="px-6 py-1 border whitespace-nowrap">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-1 border whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">
                                  {r?.categoryName || r?.categoryId}
                                </div>
                              </td>
                              <td className="px-6 py-1 border whitespace-nowrap">
                                <div className="text-lg font-bold text-blue-600">₹{r.budget?.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-1 border whitespace-nowrap">
                                <div className="text-lg font-bold text-gray-900">₹{r.actual?.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-1 border whitespace-nowrap">
                                <div className={`text-lg font-bold ${r.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ₹{r.remaining?.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-1 border whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div
                                      className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget
                                        ? 'bg-red-500'
                                        : progressPercentage > 80
                                          ? 'bg-yellow-500'
                                          : 'bg-green-500'
                                        }`}
                                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                    />
                                  </div>
                                  <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : progressPercentage > 80 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                    {progressPercentage.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {activeTab === 'expenses' && totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * itemsPerPage, filteredExpenses.length)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{filteredExpenses.length}</span> results
              </div>

              <nav className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${currentPage === i + 1
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-800 px-8 py-4 rounded-t-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Add New Expense</h3>
                    <p className="text-blue-100 mt-1">Fill in the details to create a new expense record</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Expense Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    placeholder="Enter expense title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                    <input
                      {...register("amount")}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                </div>

                {/* Category & Department Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>{c.category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("department")}
                      placeholder="Enter Department"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    />
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                  </div>
                </div>

                {/* Project & Task Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Project <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      {...register("project")}
                      placeholder="Project name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Task <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      {...register("task")}
                      placeholder="Task description"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Receipt <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setValue("receipt", e.target.files[0])}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload image or PDF file</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Expense"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
