

import React, { useEffect, useRef, useState } from "react";
import {
  useGetQuotationsQuery,
  useCreateQuotationMutation,
  useDeleteQuotationMutation,
  useUpdateQuotationMutation,

} from "@/api/accounts/quatation.api";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Plus, Edit, Trash2, FileText, Search, DollarSign, Calendar, User, X } from 'lucide-react';

// ✅ Yup Schema
const schema = yup.object().shape({
  client: yup.string().required("Client is required").max(30, "Max 30 chars allowed"),
  projects: yup.string().required("Project is required"),
  gst: yup
    .number()
    .typeError("GST must be a number")
    .min(0, "GST cannot be negative")
    .max(28, "GST cannot exceed 28%")
    .required("GST is required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required("Description is required"),
        quantity: yup
          .number()
          .typeError("Quantity must be a number")
          .positive("Must be greater than 0")
          .integer("Must be an integer")
          .required("Quantity is required"),
        rate: yup
          .number()
          .typeError("Rate must be a number")
          .positive("Must be greater than 0")
          .required("Rate is required"),
      })
    )
    .min(1, "At least one item is required"),
});

const QuotationList = () => {
  const { data, isLoading, isError } = useGetQuotationsQuery();
  const [createQuotation] = useCreateQuotationMutation();
  const [deleteQuotation] = useDeleteQuotationMutation();
  const [updateQuotation] = useUpdateQuotationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingPdfId, setLoadingPdfId] = useState(null);
  const modalRef = useRef(null);
const [openItems, setOpenItems] = useState({}); // track open state by quotationId

// Toggle function
const toggleItems = (id) => {
  setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
};
  // ✅ React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      client: "",
      projects: "",
      gst: 18,
      items: [{ description: "", quantity: 1, rate: 0 }],
    },
  });
  
   // toggle for this row
useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false); // sirf modal close hoga
    }
  };

  if (isModalOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isModalOpen]);
  const watchedItems = watch("items");
  const watchedGst = watch("gst");

  // Calculate totals for form
  const calculateTotals = () => {
    const subTotal = watchedItems?.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.rate));
    }, 0) || 0;

    const gstAmount = (subTotal * Number(watchedGst)) / 100;
    const totalAmount = subTotal + gstAmount;

    return { subTotal, gstAmount, totalAmount };
  };

  const { subTotal, gstAmount, totalAmount } = calculateTotals();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        reset();
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditId(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleViewInvoice = async (quotationId) => {
    try {
      setLoadingPdfId(quotationId); // mark only this quotation as loading

      const url = `http://localhost:3000/api/v1/quat/${quotationId}/Account-invoice`;
      const response = await fetch(url, { method: "POST" }); // or GET if API needs
      if (!response.ok) throw new Error("PDF not found");

      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("Invoice PDF not found!");
    } finally {
      setLoadingPdfId(null); // reset after PDF is fetched
    }
  };


  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateQuotation({ id: editId, ...formData }).unwrap();
        toast.success("Quotation updated successfully!");
      } else {
        await createQuotation(formData).unwrap();
        toast.success("Quotation created successfully!");
      }

      reset({
        client: "",
        projects: "",
        gst: 18,
        items: [{ description: "", quantity: 1, rate: 0 }],
      });

      setIsModalOpen(false);
      setIsEditMode(false);
      setEditId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="font-medium mb-2">Are you sure you want to delete this quotation?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={async () => {
                try {
                  await deleteQuotation(id).unwrap();
                  toast.success("🗑️ Quotation deleted successfully");
                } catch (err) {
                  console.error(err);
                  toast.error("❌ Failed to delete quotation");
                } finally {
                  closeToast();
                }
              }}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-right",
      }
    );
  };

  const handleEdit = (quotation) => {
    reset({
      client: quotation.client,
      projects: quotation.projects,
      gst: quotation.gst,
      items: quotation.items,
    });
    setEditId(quotation._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredQuotations = data?.quotations?.filter(quotation =>
    quotation.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.projects?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalQuotations = data?.quotations?.length || 0;
  const totalValue = data?.quotations?.reduce((sum, q) => sum + (q.totalAmount || 0), 0) || 0;
  const uniqueClients = new Set(data?.quotations?.map(q => q.client)).size || 0;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center text-red-800">
          <X className="h-5 w-5 mr-2" />
          Failed to load quotations. Please try again.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quotation Management</h1>
              <p className="text-sm text-gray-600">Manage all your quotations</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Quotation
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuotations}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuotations}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueClients}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client, quotation number, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Quotations Table */}
       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-medium text-gray-900">All Quotations</h3>
  </div>

  <div className="overflow-x-auto rounded-2xl">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-100">
        <tr>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">No.</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">Client</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">Project</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">Items</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">GST</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">Total</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">Date</th>
          <th className="px-6 py-2 text-left text-xs font-bold border border-blue-200 text-black uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
     <tbody className="bg-white divide-y divide-gray-200">
  {filteredQuotations.length > 0 ? (
    filteredQuotations.map((quotation) => {
    
      return (
        <tr key={quotation._id} className="hover:bg-gray-50 align-top">
          <td className="px-6 py-4 whitespace-nowrap border">{quotation.number || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap border">{quotation.client}</td>
          <td className="px-6 py-4 whitespace-nowrap border">{quotation.projects}</td>

          {/* Items column with toggle */}
       <td className="px-6 py-4 whitespace-nowrap border">
  {quotation.items?.length > 0 ? (
    <div>
      <button
        onClick={() => toggleItems(quotation._id)}
        className="text-gray-600 font-bold hover:text-gray-800"
      >
        {quotation.items.length} item{quotation.items.length > 1 ? 's' : ''} {openItems[quotation._id] ? '▲' : '▼'}
      </button>

      {openItems[quotation._id] && (
        <ul className="mt-2 ml-4 list-disc text-sm text-gray-700 space-y-1">
          {quotation.items.map((item, idx) => (
            <li key={idx}>
              <span className="font-medium">{item.description}</span> — {item.quantity} × ₹{item.rate} = ₹{item.quantity * item.rate}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : (
    <span className="text-gray-400">No items</span>
  )}
</td>


          <td className="px-6 py-4 border whitespace-nowrap">{quotation.gst}%</td>
          <td className="px-6 py-4 whitespace-nowrap border">{formatCurrency(quotation.totalAmount)}</td>
          <td className="px-6 py-4 whitespace-nowrap border">{formatDate(quotation.createdAt)}</td>

          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 border">
            <button onClick={() => handleEdit(quotation)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(quotation._id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewInvoice(quotation._id)}
              className="bg-blue-600 text-white px-2 py-1 rounded"
              disabled={loadingPdfId === quotation._id}
            >
              {loadingPdfId === quotation._id ? "Loading..." : "View Invoice"}
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="8" className="px-6 py-12 text-center">
        <div className="flex flex-col items-center">
          <FileText className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-400 mb-2">{searchTerm ? 'No quotations found' : 'No quotations yet'}</p>
          <p className="text-sm text-gray-400 mb-4">{searchTerm ? 'Try adjusting your search terms' : 'Create your first quotation to get started'}</p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Quotation
            </button>
          )}
        </div>
      </td>
    </tr>
  )}
</tbody>

    </table>
  </div>
</div>

      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? "Edit Quotation" : "Create New Quotation"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditId(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                  <input
                    {...register("client")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter client name"
                  />
                  {errors.client && (
                    <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                  <input
                    {...register("projects")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project name"
                  />
                  {errors.projects && (
                    <p className="text-red-500 text-sm mt-1">{errors.projects.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Items *</h3>
                  <button
                    type="button"
                    onClick={() => append({ description: "", quantity: 1, rate: 0 })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <input
                          {...register(`items.${index}.description`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Item description"
                        />
                        {errors.items?.[index]?.description && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].description.message}</p>
                        )}
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qty *</label>
                        <input
                          type="number"
                          {...register(`items.${index}.quantity`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].quantity.message}</p>
                        )}
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate *</label>
                        <input
                          type="number"
                          {...register(`items.${index}.rate`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                        {errors.items?.[index]?.rate && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].rate.message}</p>
                        )}
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                          {formatCurrency((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.rate || 0))}
                        </div>
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-6 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST (%) *</label>
                  <input
                    type="number"
                    {...register("gst")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="28"
                  />
                  {errors.gst && (
                    <p className="text-red-500 text-sm mt-1">{errors.gst.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 font-medium">
                    {formatCurrency(subTotal)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Amount</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 font-medium">
                    {formatCurrency(gstAmount)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                  <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-600 font-semibold">
                    {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditId(null);
                    reset();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditMode ? "Update Quotation" : "Create Quotation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default QuotationList;
