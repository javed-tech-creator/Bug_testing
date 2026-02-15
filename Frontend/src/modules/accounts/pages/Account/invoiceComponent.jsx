import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { Hash, Eye, Edit, Trash2, Download, FileText, X, Calendar, DollarSign } from "lucide-react"
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
  useAddInvoiceNoteMutation,
  useGenerateInvoicePDFMutation,
  useSendPaymentRemindersMutation
} from "@/api/accounts/invoice.api";
import { toast } from "react-toastify";

const invoiceSchema = yup.object().shape({
  client: yup.string().required("Client is required").max(50, "Max 50 characters"),
  project: yup.string().required("Project is required").max(50),
  clientPhone: yup.string().required(),
  clientEmail: yup.string().required(),
  dueDate: yup
    .date()
    .required("Due date is required"),
  gst: yup
    .number()
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100")
    .required("GST is required"),
  items: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Description required"),
      quantity: yup.number().min(1, "Quantity must be at least 1").required(),
      rate: yup.number().min(0, "Rate cannot be negative").required(),
    })
  ),
});

const InvoiceComponent = () => {
  const [modalOpen, setModalOpen] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [noteForm, setNoteForm] = useState({ type: "advance", amount: 0, method: "Cash" });
  const [viewDetailsId, setViewDetailsId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingStates, setLoadingStates] = useState({
    edit: null,
    delete: null,
    pdf: null,
    addNote: false,
    create: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: invoices, isLoading, error } = useGetInvoicesQuery();
  const [sendReminders] = useSendPaymentRemindersMutation();
  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [addNote] = useAddInvoiceNoteMutation();
  const [generatePDF] = useGenerateInvoicePDFMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      client: "",
      project: "",
      clientEmail: "",
      clientPhone: "",
      gst: "",
      dueDate: "",
      items: [{ description: "", quantity: 1, rate: 0 }],
    },
  });


  const handleSendReminder = async (id) => {
    try {
      setLoadingStates(prev => ({ ...prev, reminder: id }));
      await sendReminders({ id }).unwrap();
      toast.success("Payment reminder sent successfully!");
    } catch (err) {
      console.error("Reminder error:", err);
      toast.error("Failed to send reminder");
    } finally {
      setLoadingStates(prev => ({ ...prev, reminder: null }));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoadingStates(prev => ({ ...prev, create: true }));
      if (editingInvoice) {
        await updateInvoice({ id: editingInvoice._id, ...data }).unwrap();
        toast.success("Invoice updated successfully!");
      } else {
        await createInvoice(data).unwrap();
        toast.success("Invoice created successfully!");
      }
      reset();
      setEditingInvoice(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Invoice error:", err);
      toast.error("Failed to save invoice");
    } finally {
      setLoadingStates(prev => ({ ...prev, create: false }));
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setModalOpen(true);
    setValue("client", invoice.client);
    setValue("clientPhone", invoice.clientPhone)
    setValue("clientEmail", invoice.clientEmail)
    setValue("project", invoice.project);
    setValue("gst", invoice.gst);
    setValue("dueDate", invoice.dueDate.split("T")[0]);
    setValue("items", invoice.items);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        setLoadingStates(prev => ({ ...prev, delete: id }));
        await deleteInvoice(id).unwrap();
        toast.success("deleted succesfully !")
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete invoice");
      } finally {
        setLoadingStates(prev => ({ ...prev, delete: null }));
      }
    }
  };

  const handleDownloadPDF = async (id, invoiceNumber) => {
    try {
      setLoadingStates(prev => ({ ...prev, pdf: id }));
      const res = await generatePDF(id).unwrap();
      const blob = new Blob([res], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setLoadingStates(prev => ({ ...prev, pdf: null }));
    }
  };

  const handleNoteChange = (e) =>
    setNoteForm({ ...noteForm, [e.target.name]: e.target.value });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddNote = async () => {
    if (!selectedInvoiceId) return alert("Select an invoice first");
    try {
      setLoadingStates((prev) => ({ ...prev, addNote: true }));

      await addNote({ id: selectedInvoiceId, ...noteForm }).unwrap();

      setNoteForm({ type: "advance", amount: 0, method: "Cash" });

      toast.success("Note added successfully!");
      setIsModalOpen(false); // ✅ Modal close karna
    } catch (err) {
      console.error("Add note error:", err);
      toast.error("Failed to add note");
    } finally {
      setLoadingStates((prev) => ({ ...prev, addNote: false }));
    }
  };

  const selectedInvoice = invoices?.find(inv => inv._id === selectedInvoiceId);


  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    return invoices.filter((inv) => {
      const matchesSearch =
        inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.project.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ? true : inv.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, filterStatus]);


  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-800 font-bold text-2xl">
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 2a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V2zM5 6v14h14V6h-2v2a2 2 0 01-2 2H9a2 2 0 01-2-2V6H5z" />
                </svg>
              </span>
              <span>Invoice Management</span>
            </div>
            <button
              onClick={() => {
                // Your existing logic here
                reset();
                setEditingInvoice(null);
                setModalOpen(true);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-gray-600 transition-colors duration-200 flex items-center gap-1"
            >
              <span className="text-xs">&#x2795;</span>
              Create Invoice
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 p-6 rounded-2xl shadow-lg ">
          <input
            type="text"
            placeholder="🔍 Search by Client or Project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-4 bg-white/90 backdrop-blur-sm border-2 rounded-xl shadow-lg focus:ring-4 focus:ring-white/30 focus:bg-white focus:scale-105 transition-all duration-300 hover:shadow-xl placeholder-gray-500 text-gray-800"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-1/4 p-4 bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-4 focus:ring-white/30 focus:bg-white focus:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer text-gray-800"
          >
            <option value="all"> All Status</option>
            <option value="paid"> Paid</option>
            <option value="pending"> Pending</option>
          </select>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setModalOpen(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>

              <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {editingInvoice ? "Update Invoice" : "Create New Invoice"}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                <div className="grid md:grid-cols-2 gap-1">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Client Name</label>
                    <input
                      type="text"
                      placeholder="Enter client name"
                      {...register("client")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.client && <p className="text-red-500 text-sm">{errors.client.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      placeholder="Enter client email"
                      {...register("clientEmail")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.clientEmail && (
                      <p className="text-red-500 text-sm">{errors.clientEmail.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <input
                      type="number"
                      placeholder="Enter client Phone"
                      {...register("clientPhone")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.number && (
                      <p className="text-red-500 text-sm">{errors.clientPhone.message}</p>
                    )}
                  </div>

                  <div className="">
                    <label className="text-sm font-semibold text-gray-700">Project Name</label>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      {...register("project")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.project && <p className="text-red-500 text-sm">{errors.project.message}</p>}
                  </div>

                  <div className="">
                    <label className="text-sm font-semibold text-gray-700">GST (%)</label>
                    <input
                      type="number"
                      placeholder="GST"
                      {...register("gst")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.gst && <p className="text-red-500 text-sm">{errors.gst.message}</p>}
                  </div>

                  <div className="">
                    <label className="text-sm font-semibold text-gray-700">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("dueDate")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
                  </div>
                </div>

                <div className="">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Invoice Items
                  </h3>

                  <Controller
                    name="items"
                    control={control}
                    render={({ field }) => (
                      <div className="">
                        <div className="grid grid-cols-12 gap-3 text-sm font-semibold text-gray-600 px-3">
                          <div className="col-span-6">Description</div>
                          <div className="col-span-2">Quantity</div>
                          <div className="col-span-3">Rate (₹)</div>
                          <div className="col-span-1"></div>
                        </div>

                        {field.value.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              placeholder="Item description"
                              className="col-span-6 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...field.value];
                                newItems[index].description = e.target.value;
                                field.onChange(newItems);
                              }}
                            />
                            <input
                              type="number"
                              className="col-span-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={item.quantity}
                              min="1"
                              onChange={(e) => {
                                const newItems = [...field.value];
                                newItems[index].quantity = parseInt(e.target.value) ;
                                field.onChange(newItems);
                              }}
                            />
                            <input
                              type="number"
                              className="col-span-3 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={item.rate}
                              min="0"
                              step="0.01"
                              onChange={(e) => {
                                const newItems = [...field.value];
                                newItems[index].rate = parseFloat(e.target.value) || 0;
                                field.onChange(newItems);
                              }}
                            />
                            {field.value.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = field.value.filter((_, i) => i !== index);
                                  field.onChange(newItems);
                                }}
                                className="col-span-1 text-red-500 hover:text-red-700 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            field.onChange([...field.value, { description: "", quantity: 1, rate: 0 }])
                          }
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Item
                        </button>
                      </div>
                    )}
                  />
                  {errors.items && <p className="text-red-500 text-sm">{errors.items.message}</p>}
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingStates.create}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingStates.create ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      editingInvoice ? "Update Invoice" : "Create Invoice"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-2 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              All Invoices
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-500 font-medium">Error fetching invoices</p>
            </div>
          ) : (
            <div className="overflow-x-auto  rounded-2xl">
              <table className="w-full border">
                <thead className="bg-blue-100 ">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Invoice #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Item</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Paid</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Remaining</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border border-blue-200 text-black">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold border border-blue-200 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentInvoices.length > 0 ? (
                    currentInvoices.map((inv) => (
                      <React.Fragment key={inv._id} >
                        <tr className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                          {/* Invoice Number */}
                          <td className="px-6 py-2 border ">
                            <div className="flex items-center gap-3">
                              {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Hash className="w-5 h-5 text-white" />
                              </div> */}
                              <div>
                                <p className="font-mono text-sm font-bold text-gray-900">{inv.invoiceNumber}</p>

                              </div>
                            </div>
                          </td>

                          {/* Client */}
                          <td className="px-6  py-2 border">
                            <div className="flex items-center gap-3 ">
                              {/* <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {inv.client.charAt(0)}
                                </span> 
                              </div> */}
                              <div>
                                <p className="text-sm font-semibold text-gray-900 ">{inv.client}</p>

                              </div>
                            </div>
                          </td>
                          <td className="px-6  py-2 border">
                            <div className="flex items-center gap-3 ">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 ">{inv.clientPhone}</p>

                              </div>
                            </div>
                          </td>
                          <td className="px-6  py-2 border">
                            <div className="flex items-center gap-3 ">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 ">{inv.clientEmail}</p>

                              </div>
                            </div>
                          </td>


                          <td className="px-6  py-2 border">
                            <button
                              onClick={() => setViewDetailsId(viewDetailsId === inv._id ? null : inv._id)}
                              className="group/btn relative text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl flex items-center gap-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-xs">View</span>
                            </button>
                          </td>


                          {/* Total Amount */}
                          <td className="px-6  py-2 border">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">₹{inv.totalAmount.toLocaleString()}</p>

                            </div>
                          </td>

                          {/* Paid Amount */}
                          <td className="px-6   py-2 border">
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">₹{(inv.paidAmount || 0).toLocaleString()}</p>

                            </div>
                          </td>

                          {/* Remaining Amount */}
                          <td className="px-6   py-2 border">
                            <div className="text-right">
                              <p className="text-lg font-bold text-orange-600">₹{(inv.remainingAmount || 0).toLocaleString()}</p>

                            </div>
                          </td>


                          {/* Status */}
                          <td className="px-6   py-2 border">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-2  rounded-full text-xs font-bold uppercase tracking-wider ${inv.status === "paid"
                                ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
                                : "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg"
                                }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${inv.status === "paid" ? "bg-white" : "bg-white animate-pulse"
                                  }`}></div>
                                {inv.status}
                              </span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6  border">
                            <div className="flex items-center justify-center gap-2">
                              {/* View Details Button */}
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEdit(inv)}
                                disabled={loadingStates.edit === inv._id}
                                className="group/btn relative  text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl"
                                title="Edit"
                              >
                                {loadingStates.edit === inv._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Edit className="w-4 h-4" />
                                )}
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                  Edit
                                </div>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(inv._id)}
                                disabled={loadingStates.delete === inv._id}
                                className="group/btn relative  text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl"
                                title="Delete"
                              >
                                {loadingStates.delete === inv._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                  Delete
                                </div>
                              </button>
                              <td className="px-6 py-2 border text-center">
                                <button
                                  onClick={() => handleSendReminder(inv._id)}
                                  disabled={loadingStates.reminder === inv._id || (inv.totalAmount - (inv.paidAmount || 0) <= 0)}
                                  className={`group/btn relative text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl ${inv.totalAmount - (inv.paidAmount || 0) <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                  title="Send Reminder"
                                >
                                  {loadingStates.reminder === inv._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <DollarSign className="w-4 h-4" />
                                  )}
                                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                    Reminder
                                  </div>
                                </button>
                              </td>

                              {/* Download PDF Button */}
                              <button
                                onClick={() => handleDownloadPDF(inv._id, inv.invoiceNumber)}
                                disabled={loadingStates.pdf === inv._id}
                                className="group/btn relative  text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl"
                                title="Download PDF"
                              >
                                {loadingStates.pdf === inv._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                  PDF
                                </div>
                              </button>

                              {/* Add Note Button */}
                              <button
                                onClick={() => {
                                  setSelectedInvoiceId(inv._id);
                                  setIsModalOpen(true);
                                }}
                                className={`group/btn relative  text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl ${selectedInvoiceId === inv._id
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  : "group/btn relative  text-gray-900 p-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform shadow-lg hover:shadow-xl"
                                  }`}
                                title="Add Note"
                              >
                                <FileText className="w-4 h-4" />
                                <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                  Note
                                </div>
                              </button>
                            </div>
                          </td>
                        </tr>


                        {/* Invoice Details Modal */}
                        {viewDetailsId === inv._id && (
                          <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setViewDetailsId(null)} // Background click par close
                          >
                            <div
                              className="bg-white rounded-2xl shadow-2xl w-120 max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
                              onClick={(e) => e.stopPropagation()} // Modal content pe click ignore
                            >
                              {/* Modal Header */}
                              <div className="relative bg-gray-800 text-white p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-bold">Invoice Items</h4>
                                    <p className="text-white/80 font-mono text-sm">{inv.invoiceNumber}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setViewDetailsId(null)}
                                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Table Section */}
                              <div className="flex-1 overflow-auto p-4 bg-gradient-to-br from-gray-50 to-slate-100">
                                {inv.items && inv.items.length > 0 ? (
                                  <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                                    <table className="w-full text-sm border-collapse">
                                      <thead className="bg-gradient-to-r from-slate-100 to-gray-100">
                                        <tr>
                                          <th className="px-4 py-2 text-left font-bold text-slate-700 uppercase">Description</th>
                                          <th className="px-4 py-2 text-center font-bold text-slate-700 uppercase">Qty</th>
                                          <th className="px-4 py-2 text-right font-bold text-slate-700 uppercase">Rate</th>
                                          <th className="px-4 py-2 text-right font-bold text-slate-700 uppercase">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200 bg-white">
                                        {inv.items.map((item, index) => (
                                          <tr
                                            key={index}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                          >
                                            <td className="px-4 py-2 font-medium text-gray-900">{item.description}</td>
                                            <td className="px-4 py-2 text-center font-semibold text-blue-600">{item.quantity}</td>
                                            <td className="px-4 py-2 text-right font-semibold text-green-600">₹{item.rate.toLocaleString()}</td>
                                            <td className="px-4 py-2 text-right font-bold text-gray-900">
                                              ₹{(item.quantity * item.rate).toLocaleString()}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-center py-12 text-gray-500 font-medium">
                                    No items found for this invoice.
                                  </div>
                                )}
                              </div>

                              {/* Modal Footer */}
                              <div className="p-4 flex justify-end border-t border-gray-200">
                                <button
                                  onClick={() => setViewDetailsId(null)}
                                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}


                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500 font-medium">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Next
              </button>
            </div>

            {/* Items per Page Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Payment/Note Section */}

          {/* Modal */}

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setIsModalOpen(false)} // Background click pe close
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
                onClick={(e) => e.stopPropagation()} // Modal content click pe ignore
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
                >
                  ✕
                </button>

                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Add Payment / Note
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={noteForm.type}
                      onChange={handleNoteChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="advance">Advance</option>
                      <option value="payment">Payment</option>
                      <option value="credit">Credit Note</option>
                      <option value="debit">Debit Note</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  {(noteForm.type === "advance" || noteForm.type === "payment") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        name="method"
                        value={noteForm.method}
                        onChange={handleNoteChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Cash">Cash</option>
                        <option value="NEFT">NEFT</option>
                        <option value="UPI">UPI</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={noteForm.amount}
                      onChange={handleNoteChange}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={handleAddNote}
                  disabled={loadingStates.addNote}
                  className="mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingStates.addNote ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Note / Payment
                    </>
                  )}
                </button>

                {/* Notes Details Section - Below Form */}
                {selectedInvoice?.notes && selectedInvoice.notes.length > 0 && (
                  <div className="mt-4 border-t ">
                    <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Payment History ({selectedInvoice.notes.length})
                    </h4>

                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Method</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedInvoice.notes.map((note, index) => (
                            <tr key={index} className="hover:bg-blue-50 transition-colors">
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${note.type === 'advance' ? 'bg-blue-100 text-blue-700' :
                                    note.type === 'payment' ? 'bg-green-100 text-green-700' :
                                      note.type === 'credit' ? 'bg-purple-100 text-purple-700' :
                                        'bg-orange-100 text-orange-700'
                                  }`}>
                                  {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {note.method ? (
                                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                    {note.method}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(note.date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-base font-bold text-gray-800">
                                  ₹{note.amount.toLocaleString('en-IN')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary */}
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                        <span className="text-xl font-bold text-blue-700">
                          ₹{selectedInvoice.notes.reduce((sum, note) => sum + note.amount, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {(!selectedInvoice?.notes || selectedInvoice.notes.length === 0) && (
                  <div className="mt-8 border-t pt-6 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No payment history available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InvoiceComponent;