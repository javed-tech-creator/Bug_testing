import React, { useState, useMemo } from "react";
import {
  useGetPaymentsQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
  useApprovePaymentMutation,
  useDeletePaymentMutation,
  useUploadPaymentProofMutation
} from "@/api/accounts/vendor_tax/vendorTaxpayment.api";
import { useGetVendorsQuery } from "@/api/accounts/vendor_tax/vendor.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, CheckCircle, Building2, Edit, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
// ✅ Yup validation schema
const paymentSchema = yup.object().shape({
  vendor: yup.string().required("Vendor is required"),
  dueDate: yup.date().required("Due Date is required"),
  penalties: yup
    .number()
    .typeError("Penalty must be a number")
    .min(0, "Penalty cannot be negative")
    .required(),
  bonuses: yup
    .number()
    .typeError("Bonus must be a number")
    .min(0, "Bonus cannot be negative")
    .required(),
  tasks: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Task name is required"),
      rate: yup
        .number()
        .typeError("Rate must be a number")
        .min(0, "Rate cannot be negative")
        .required(),
      quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .min(0, "Quantity cannot be negative")
        .required(),
    })
  ),
});

const TaxPaymentComponent = () => {
  const { data: payments = [], isLoading, refetch } = useGetPaymentsQuery();
  const { data: vendors = [] } = useGetVendorsQuery();
  const [addPayment] = useAddPaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [approvePayment] = useApprovePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();
  const [uploadPaymentProof] = useUploadPaymentProofMutation();

  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [approvingId, setApprovingId] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadPaymentId, setUploadPaymentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(paymentSchema),
  });

  // ✅ Open modal (Add/Edit)
  // Open modal (Add/Edit)
  const openModal = (payment = null) => {
    if (payment) {
      setEditingId(payment._id);
      // Edit mode - reset with payment data
      reset({
        ...payment,
        vendor: payment.vendor?._id || "", // ensure vendor id string
      });
    } else {
      setEditingId(null);
      // Add mode - reset with empty/default values
      reset({
        vendor: "", // empty string so "Select a vendor" shows
        tasks: [{ name: "", rate: 0, quantity: 0 }],
        penalties: 0,
        bonuses: 0,
        dueDate: "",
      });
    }
    setModalOpen(true);
  };
  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select a file");
    if (!uploadPaymentId) return toast.error("No payment selected");

    try {
      const res = await uploadPaymentProof({ id: uploadPaymentId, file: selectedFile }).unwrap();
      console.log(res, "upload result");

      toast.success("Payment proof uploaded successfully!");
      setSelectedFile(null);
      setUploadPaymentId(null);
      setUploadModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed!");
    }
  };


  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    reset();
  };

  // ✅ Add / Update
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updatePayment({ id: editingId, ...data }).unwrap();
        toast.success("Payment updated successfully!");
      } else {
        await addPayment(data).unwrap();
        toast.success("Payment added successfully!");
      }
      closeModal();
      refetch();
    } catch (err) {
      console.error("Error saving payment:", err);
      toast.error("Failed to save payment!");
    }
  };

  // ✅ Approve Payment
  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      await approvePayment(id).unwrap();
      toast.success("Payment approved!");
      refetch();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve payment!");
    } finally {
      setApprovingId(null);
    }
  };

  // ✅ Delete Payment
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this payment?</span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  await deletePayment(id).unwrap();
                  toast.success("Payment deleted!");
                  refetch();
                } catch (err) {
                  console.error("Delete error:", err);
                  toast.error("Failed to delete payment!");
                }
                closeToast();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  // ✅ Filter + Search
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.vendor?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.tasks?.some((t) =>
          t.name?.toLowerCase().includes(search.toLowerCase())
        );
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "approved" && p.approved === true) ||
        (filterStatus === "pending" && !p.approved);
      return matchesSearch && matchesFilter;
    });
  }, [payments, search, filterStatus]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row shadow md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4 mb-8 ">
          <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm p-4 rounded-xl shadow-inner">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Tax Payment Management</h1>
            <p className="text-blue-500 mt-1 text-sm"> Manage vendor payments, tasks, and approvals efficiently.</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-white text-indigo-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300"
        >
          <Plus className="w-5 h-5 stroke-2" />
          Add New Payment
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by vendor or task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingId ? "✏️ Edit Payment" : "➕ Add Payment"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Vendor & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <select
                    {...register("vendor")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>Select a vendor</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} {v.email ? `(${v.email})` : ""}
                      </option>
                    ))}
                  </select>
                  {errors.vendor && <p className="text-red-500 text-sm mt-1">{errors.vendor.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penalty (₹)</label>
                  <input
                    type="number"
                    {...register("penalties")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  />
                  {errors.penalties && <p className="text-red-500 text-sm mt-1">{errors.penalties.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonus (₹)</label>
                  <input
                    type="number"
                    {...register("bonuses")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                  {errors.bonuses && <p className="text-red-500 text-sm mt-1">{errors.bonuses.message}</p>}
                </div>
              </div>

              {/* Task Section */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h4 className="text-lg font-medium mb-3">Task Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                    <input
                      placeholder="Task Name"
                      {...register("tasks.0.name")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.tasks?.[0]?.name && <p className="text-red-500 text-sm mt-1">{errors.tasks[0].name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                    <input
                      type="number"
                      placeholder="Rate"
                      {...register("tasks.0.rate")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.tasks?.[0]?.rate && <p className="text-red-500 text-sm mt-1">{errors.tasks[0].rate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      {...register("tasks.0.quantity")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.tasks?.[0]?.quantity && <p className="text-red-500 text-sm mt-1">{errors.tasks[0].quantity.message}</p>}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {editingId ? "Update" : "Add"} Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Upload Payment Proof</h3>
              <span>{}</span>
              <button onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>

            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-4"
            />

            <button
              type="button"
              onClick={handleUpload}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-300  text-white">
              <tr>
                <th className="px-3 text-black border py-2">Vendor</th>
                <th className="px-3 text-black border py-2">Tasks</th>
                <th className="px-3 text-black border py-2">Penalties</th>
                <th className="px-3 text-black border py-2">Bonuses</th>
                <th className="px-3 text-black border py-2">Total Amount</th>
                <th className="px-3 text-black border py-2">Due Date</th>
                <th className="px-3 text-black border py-2">Status</th>
                <th className="px-3 text-black border py-2">Payment Proof</th>
                <th className="px-3 text-black border py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((p) => {
                const total = (p.tasks || []).reduce(
                  (sum, t) => sum + t.rate * t.quantity,
                  0
                );
                return (
                  <tr key={p._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 border py-2 font-medium">{p.vendor?.name || "N/A"}</td>
                    <td className="px-4 border py-2">
                      {p.tasks?.map((t, i) => (
                        <div key={i}>{t.name} - {t.rate} × {t.quantity}</div>
                      ))}
                    </td>
                    <td className="px-4 border py-2 text-red-600">{p.penalties}</td>
                    <td className="px-4 border py-2 text-green-600">{p.bonuses}</td>
                    <td className="px-4 border py-2 font-semibold text-blue-700">
                      ₹{total + (p.bonuses || 0) - (p.penalties || 0)}
                    </td>
                    <td className="px-4 border py-2">
                      {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 border py-2">
                      <span className={`px-2 py-1 rounded text-xs ${p.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {p.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 border py-2 text-center">
                      {p.paymentProof ? (
                        <a
                          href={p.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm italic">Not uploaded</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      <button onClick={() => openModal(p)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg">
                        <Edit size={16} />
                      </button>
                               {!p.approved && (
                      <button
                        onClick={() => handleApprove(p._id)}
                        disabled={approvingId === p._id || p.approved}
                        className={`p-2 rounded-lg transition ${p.approved ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
                      >
                        <CheckCircle size={16} />
                      </button>
                        )}
                      {p.approved && (
                        <button
                          onClick={() => {
                            setUploadPaymentId(p._id); // ye payment ke liye upload modal open karega
                            setUploadModalOpen(true);
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg"
                        >
                          Upload
                        </button>
                      )}
                      <button onClick={() => handleDelete(p._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedPayments.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-left items-center gap-3 mt-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>Page <strong>{currentPage}</strong> of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default TaxPaymentComponent;
