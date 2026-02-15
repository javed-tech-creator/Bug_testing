import React, { useEffect, useRef, useState } from "react";
import { Plus, X, Edit2, Trash2, Download, FileText, DollarSign, TrendingUp, TrendingDown, Wallet, Filter, Search } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  useGetLedgersQuery,
  useCreateLedgerMutation,
  useUpdateLedgerMutation,
  useDeleteLedgerMutation,
  useGetOutstandingQuery,
  useGetDashboardQuery,
  useGetClientsQuery,
  useGetVendorsQuery,
} from "@/api/finance/Quatation_Billing/ledger.api";
import {
  useGetExpensesQuery,
 
} from "@/api/finance/Quatation_Billing/expenceE.api";

// import { useGetCategoriesQuery } from "@/api/finance/Quatation_Billing/expenceCategory";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// ===== Yup Validation Schema =====
const ledgerSchema = yup.object().shape({
  clientId: yup.string().required("Client is required"),
  vendorId: yup.string().required("Vendor is required"),
  category: yup.string().required("Category is required"),
  department: yup.string().required("Department is required"),
  description: yup.string().required("Description is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .required("Amount is required"),
  type: yup.string().required("Type is required"),
  status: yup.string().required("Status is required"),
});

const LedgerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState(null);

  const [expenseFilter, setExpenseFilter] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });

  // API Hooks
  const { data: clientsData } = useGetClientsQuery();
  const { data: vendorsData } = useGetVendorsQuery();
  const { data: ledgersData, isLoading: ledgersLoading } = useGetLedgersQuery();
  const [createLedger] = useCreateLedgerMutation();
  const [updateLedger] = useUpdateLedgerMutation();
  const [deleteLedger] = useDeleteLedgerMutation();
  const { data: expenseData } = useGetExpensesQuery(expenseFilter);
  const { data: outstandingData } = useGetOutstandingQuery();
  const { data: dashboardData } = useGetDashboardQuery();
  // const {data: category}=useGetCategoriesQuery()
console.log(outstandingData,"dddd");
console.log(expenseData,"aa");
console.log(dashboardData,"cc");

  const filteredLedgers = ledgersData?.data || [];

  // ===== React Hook Form Setup =====
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ledgerSchema),
    mode:"onChange",
    defaultValues: {
      clientId: "",
      vendorId: "",
      category: "",
      department: "",
      description: "",
      amount: "",
      type: "collection",
      status: "Pending",
    },
  });

  // ===== Save Ledger =====
  const onSubmit = async (formData) => {
    try {
      if (isEditMode && selectedLedger) {
        await updateLedger({ id: selectedLedger._id, ...formData }).unwrap();
        toast.success("Ledger updated successfully!");
      } else {
        await createLedger(formData).unwrap();
        toast.success("Ledger created successfully!");
      }
      reset();
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedLedger(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save ledger!");
    }
  };

  // ===== Edit Ledger =====
  const handleEditLedger = (ledger) => {
    setIsEditMode(true);
    setSelectedLedger(ledger);

    // Populate form fields
    setValue("clientId", ledger.client?._id || "");
    setValue("vendorId", ledger.vendor?._id || "");
    setValue("category", ledger.category || "");
    setValue("department", ledger.department || "");
    setValue("description", ledger.description || "");
    setValue("amount", ledger.amount || "");
    setValue("type", ledger.type || "collection");
    setValue("status", ledger.status || "Pending");

    setIsModalOpen(true);
  };

  const modalRef=useRef(null)
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      reset();       // form reset
      setIsModalOpen(false); // modal close
    }
  };

  if (setIsModalOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [setIsModalOpen]);

  // ===== Delete Ledger =====
  const handleDeleteLedger = async (id) => {
    if (window.confirm("Are you sure you want to delete this ledger entry?")) {
      try {
        await deleteLedger(id).unwrap();
        toast.success("Ledger deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete ledger!");
      }
    }
  };

  // ===== Export to Excel =====
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLedgers.map((l) => ({
        Client: l.client?.name || "-",
        Vendor: l.vendor?.name || "-",
        Category: l.category || "-",
        Department: l.department || "-",
        Amount: l.amount,
        Type: l.type,
        Status: l.status,
        Description: l.description || "-",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger Report");
    XLSX.writeFile(workbook, "Ledger_Report.xlsx");
    toast.success("Excel file exported successfully!");
  };

  // ===== Export to PDF =====
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Ledger Report", 14, 10);

    autoTable(doc, {
      head: [
        [
          "Client",
          "Vendor",
          "Category",
          "Department",
          "Amount",
          "Type",
          "Status",
          "Description",
        ],
      ],
      body: filteredLedgers.map((l) => [
        l.client?.name || "-",
        l.vendor?.name || "-",
        l.category || "-",
        l.department || "-",
        l.amount,
        l.type,
        l.status,
        l.description || "-",
      ]),
      startY: 20,
    });

    doc.save("Ledger_Report.pdf");
    toast.success("PDF file exported successfully!");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'collection': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payout': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expense': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
              Ledger & Reports
            </h1>
            <p className="text-gray-600 mt-1">Manage your financial transactions and generate detailed reports</p>
          </div>
          <button
            onClick={() => {
              reset();
              setIsModalOpen(true);
              setIsEditMode(false);
              setSelectedLedger(null);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus size={20} />
            Add Ledger Entry
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credit</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ₹{outstandingData?.totalCredit?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-2xl">
                <TrendingUp className="text-green-600" size={12} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Debit</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  ₹{outstandingData?.totalDebit?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded-2xl">
                <TrendingDown className="text-red-600" size={12} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  ₹{((outstandingData?.totalCredit || 0) - (outstandingData?.totalDebit || 0)).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Wallet className="text-blue-600" size={12} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collection</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  ₹{dashboardData?.totalCollection?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-2xl">
                <DollarSign className="text-purple-600 " size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Ledger Entries</h2>
              <div className="flex gap-3">
                <button
                  onClick={exportToExcel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FileText size={16} />
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download size={16} />
                  PDF
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-2xl">
            {ledgersLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 text-lg">Loading ledger entries...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLedgers.length ? (
                    filteredLedgers.map((ledger) => (
                      <tr key={ledger._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ledger.client?.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ledger.vendor?.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ledger.category || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ledger.department || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{ledger.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {ledger.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ledger.status)}`}>
                            {ledger.status || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(ledger.type)}`}>
                            {ledger.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditLedger(ledger)}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteLedger(ledger._id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500 text-lg">
                        No ledger entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Expense Reports */}
        <div className="bg-white rounded-2xl  shadow-lg border border-gray-100  overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-2 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Expense Reports</h2>
              <Filter className="text-gray-400" size={20} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by category..."
                  value={expenseFilter.category}
                  onChange={(e) =>
                    setExpenseFilter({ ...expenseFilter, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              <input
                type="date"
                value={expenseFilter.startDate}
                onChange={(e) =>
                  setExpenseFilter({ ...expenseFilter, startDate: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={expenseFilter.endDate}
                onChange={(e) =>
                  setExpenseFilter({ ...expenseFilter, endDate: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto  rounded-2xl mt-3">
            <table className="w-full ">
              <thead className="bg-gray-800 ">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Project</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenseData?.length ? (
                  expenseData.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{exp.category?.category || "-"}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{exp.department || "-"}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{exp.project || "-"}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">₹{exp.amount?.toLocaleString()}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {exp.createdAt
                          ? new Date(exp.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-lg">No expense data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             
              <div className="bg-gradient-to-r from-gray-700 to-gray-700 text-white p-2  relative">
                                 <button
                                   onClick={() =>  setIsModalOpen(false)}
                                   className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                                 >
                                   <X size={20} />
                                 </button>
                                 <h2 className="text-2xl font-bold mb-2"> {isEditMode ? "Edit Ledger Entry" : "Add New Ledger Entry"}</h2>
                                 <p className="text-white/80 text-sm">Fill in the details below to create a new Expence</p>
                               </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <select
                    {...register("clientId")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Client</option>
                    {clientsData?.data?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
                  <select
                    {...register("vendorId")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Vendor</option>
                    {vendorsData?.data?.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  {errors.vendorId && (
                    <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Material">Material</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Travel">Travel</option>
                    <option value="AMC">AMC</option>
                    <option value="Repairs">Repairs</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    placeholder="Enter department..."
                    {...register("department")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    placeholder="Enter amount..."
                    {...register("amount")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    {...register("type")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="collection">Collection</option>
                    <option value="payout">Payout</option>
                    <option value="expense">Expense</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    placeholder="Enter description..."
                    rows={3}
                    {...register("description")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8  border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {isEditMode ? "Update Entry" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerPage;