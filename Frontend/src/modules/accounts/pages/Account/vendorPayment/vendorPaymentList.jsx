import React, { useState } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    CreditCard,
    Search,
    Filter,
    Calendar,
    Building,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    MoreVertical
} from "lucide-react";
import { toast } from 'react-toastify'

import {
    useGetVendorPaymentsQuery,
    useCreateVendorPaymentMutation,
    useUpdateVendorPaymentMutation,
    useDeleteVendorPaymentMutation,
} from "@/api/accounts/Payables.api";
import { useGetVendorsQuery } from "@/api/accounts/vendor.api";
import VendorPaymentForm from "./vendorPaymentForm.jsx";

const VendorPaymentList = () => {
    // Your existing API hooks
    const { data: payments, isLoading, isError } = useGetVendorPaymentsQuery();
    const { data: vendors = [] } = useGetVendorsQuery();

    // Your existing mutations
    const [createPayment] = useCreateVendorPaymentMutation();
    const [updatePayment] = useUpdateVendorPaymentMutation();
    const [deletePayment] = useDeleteVendorPaymentMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [payAmountModal, setPayAmountModal] = useState(false);
    const [payingAmount, setPayingAmount] = useState(0);
    const [viewTasksModal, setViewTasksModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    // Your existing functions
    const filteredPayments = payments?.filter(payment => {
        // Search by vendor name or project
        const matchesSearch =
            payment.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.project?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by status
        const matchesStatus =
            filterStatus === "all" ? true : payment.status === filterStatus;

        return matchesSearch && matchesStatus;
    }) || [];
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const openViewTasksModal = (payment) => {
        setSelectedPayment(payment);
        setViewTasksModal(true);
    };
    const goToPage = (page) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        setCurrentPage(page);
    };
    const openCreateModal = () => {
        setEditingPayment(null);
        setModalOpen(true);
    };

    const openEditModal = (payment) => {
        setEditingPayment(payment);
        setModalOpen(true);
    };

    const handleFormSubmit = async (data) => {
        if (editingPayment) {
            await updatePayment({ id: editingPayment._id, ...data });
        } else {
            await createPayment(data);
        }
        setModalOpen(false);
    };

    const openPayModal = (payment) => {
        setEditingPayment(payment);
        setPayingAmount(payment.remainingAmount);
        setPayAmountModal(true);
    };
    const handleApprove = async (payment) => {
        try {
            await updatePayment({
                id: payment._id,
                approvalStatus: "approved",
            }).unwrap();
            toast.success("Payment approved successfully!");
        } catch (err) {
            toast.error("Failed to approve payment");
            console.log(err);

        }
    };
    const handlePaySubmit = async () => {
        if (!payingAmount || payingAmount <= 0) return;

        const updatedPaidAmount = editingPayment.paidAmount + Number(payingAmount);
        const updatedRemaining = editingPayment.totalAmount - updatedPaidAmount;
        const status = updatedRemaining === 0 ? "paid" : "partial";

        await updatePayment({
            id: editingPayment._id,
            paidAmount: updatedPaidAmount,
            remainingAmount: updatedRemaining,
            status: status,
        });

        setPayAmountModal(false);
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg';
            case 'partial':
                return 'bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-lg';
            case 'pending':
                return 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getApprovalStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "pending":
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const getApprovalStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return "✅";
            case "rejected":
                return "❌";
            case "pending":
            default:
                return "⏳";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="w-4 h-4" />;
            case 'partial':
                return <Clock className="w-4 h-4" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payments...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 text-lg">Error loading payments</p>
                    <p className="text-gray-500">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <DollarSign className="w-7 h-7 text-blue-600" />
                            Vendor Payments
                        </h1>
                        <p className="text-gray-600 mt-1">Manage and track all vendor payments</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-2xl flex items-center gap-2 transition-colors shadow-xl"
                    >
                        <Plus className="w-4 h-4" />
                        Create Payment
                    </button>
                </div>
            </div>


            <div className="p-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by vendor, project..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative w-40">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Payments Table */}

                {paginatedPayments.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-blue-100 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Vendor</th>
                                        <th className="px-4 py-3 text-left text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Project</th>
                                        <th className="px-4 py-3 text-center text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Tasks</th>
                                        <th className="px-4 py-3 text-right text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Sub Total</th>
                                        <th className="px-4 py-3 text-right text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Penalties</th>
                                        <th className="px-4 py-3 text-right text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Bonuses</th>
                                        <th className="px-4 py-3 text-right text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Total</th>
                                        <th className="px-4 py-3 text-right text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Paid</th>
                                        <th className="px-4 py-3 text-right text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Remaining</th>
                                        <th className="px-4 py-3 text-center text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold border border-blue-200 uppercase tracking-wider">Approval Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Due Date</th>
                                        <th className="px-4 py-3 text-center text-xs font-nold border border-blue-200 test-black uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">

                                    {paginatedPayments?.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4  border">
                                                <div className="flex items-center">
                                                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                                                    <div className="font-medium text-gray-900">
                                                        {payment.vendor?.name || "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4  border">
                                                <div className="text-sm text-gray-900">{payment.project}</div>
                                            </td>
                                            <td className="border text-center">
                                                <button
                                                    onClick={() => openViewTasksModal(payment)}
                                                    className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-sm font-medium">View</span>
                                                </button>
                                            </td>

                                            <td className="px-4 border text-right text-sm text-gray-900">
                                                ₹{payment.subTotal?.toLocaleString()}
                                            </td>
                                            <td className="px-4 border text-right text-sm">
                                                {payment.penalties > 0 ? (
                                                    <span className="text-red-600">₹{payment.penalties?.toLocaleString()}</span>
                                                ) : (
                                                    <span className="text-gray-400">0</span>
                                                )}
                                            </td>
                                            <td className="px-4 border text-right text-sm">
                                                {payment.bonuses > 0 ? (
                                                    <span className="text-green-600">₹{payment.bonuses?.toLocaleString()}</span>
                                                ) : (
                                                    <span className="text-gray-400">0</span>
                                                )}
                                            </td>
                                            <td className="px-4 border text-right text-sm font-medium text-gray-900">
                                                ₹{payment.totalAmount?.toLocaleString()}
                                            </td>
                                            <td className="px-4 borde text-right text-sm text-green-600">
                                                ₹{payment.paidAmount?.toLocaleString()}
                                            </td>
                                            <td className="px-4 border text-right text-sm">
                                                {payment.remainingAmount > 0 ? (
                                                    <span className="text-red-600 font-medium">₹{payment.remainingAmount?.toLocaleString()}</span>
                                                ) : (
                                                    <span className="text-gray-400">0</span>
                                                )}
                                            </td>
                                            <td className="px-4 border text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    <span className="ml-1">{payment.status?.toUpperCase()}</span>
                                                </span>
                                            </td>

                                            <td className="px-4 border text-center">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(
                                                        payment.approvalStatus
                                                    )}`}
                                                >
                                                    {getApprovalStatusIcon(payment.approvalStatus)}
                                                    <span className="ml-1">{payment.approvalStatus?.toUpperCase()}</span>
                                                </span>
                                            </td>

                                            <td className="px-4 border text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                                    {new Date(payment.dueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 border">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(payment)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Payment"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => deletePayment(payment._id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Payment"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    {payment.approvalStatus === "pending" && (
                                                        <button
                                                            onClick={() => handleApprove(payment)}
                                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}

                                                    {payment.remainingAmount > 0 && payment.approvalStatus === "approved" && (
                                                        <button
                                                            onClick={() => openPayModal(payment)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Make Payment"
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}



                                </tbody>
                            </table>
                            <div className="flex justify-start items-left gap-2 p-4">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Prev
                                </button>

                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goToPage(idx + 1)}
                                        className={`px-3 py-1 border rounded-lg transition ${currentPage === idx + 1
                                            ? "bg-gray-600 text-white border-gray-600"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter</p>
                    </div>
                )}

                {/* Empty State */}
                {payments?.length === 0 && (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first vendor payment</p>
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Payment
                        </button>
                    </div>
                )}
            </div>

            {viewTasksModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1F2937] rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 bg-[#1F2937] rounded-t-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#374151] p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Task Items</h3>
                                    <p className="text-gray-400 text-sm">Tasks for : {selectedPayment.project}</p> {/* Assuming selectedPayment has an invoiceId */}
                                </div>
                            </div>
                            <button
                                onClick={() => setViewTasksModal(false)}
                                className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-4 bg-white rounded-b-xl">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-2 py-3 text-left text-gray-500 uppercase font-medium">DESCRIPTION</th>
                                        <th className="px-2 py-3 text-center text-gray-500 uppercase font-medium">QTY</th>
                                        <th className="px-2 py-3 text-right text-gray-500 uppercase font-medium">RATE</th>
                                        <th className="px-2 py-3 text-right text-gray-500 uppercase font-medium">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPayment.tasks?.map((task) => (
                                        <tr key={task._id} className="border-b border-gray-100 last:border-b-0">
                                            <td className="px-2 py-3 text-gray-800">{task.description}</td>
                                            <td className="px-2 py-3 text-center text-blue-600 font-semibold">{task.quantity}</td>
                                            <td className="px-2 py-3 text-right text-green-600 font-semibold">₹{task.rate.toLocaleString()}</td>
                                            <td className="px-2 py-3 text-right text-gray-900 font-bold">₹{task.amount?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {/* Example static row from the image if tasks array is empty or for initial display */}
                                    {!selectedPayment.tasks || selectedPayment.tasks.length === 0 && (
                                        <tr className="border-b border-gray-100 last:border-b-0">
                                            <td className="px-2 py-3 text-gray-800">Landing Page</td>
                                            <td className="px-2 py-3 text-center text-blue-600 font-semibold">2</td>
                                            <td className="px-2 py-3 text-right text-green-600 font-semibold">₹10,000</td>
                                            <td className="px-2 py-3 text-right text-gray-900 font-bold">₹20,000</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setViewTasksModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Create/Edit Modal */}
            {modalOpen && (
                <VendorPaymentForm
                    vendors={vendors}
                    defaultValues={
                        editingPayment
                            ? {
                                vendor: editingPayment.vendor?._id || editingPayment.vendor || "",
                                project: editingPayment.project || "",
                                tasks: editingPayment.tasks || [{ description: "", quantity: 1, rate: 0 }],
                                penalties: editingPayment.penalties || 0,
                                bonuses: editingPayment.bonuses || 0,
                                dueDate: editingPayment.dueDate ? editingPayment.dueDate.slice(0, 10) : "",
                                notes: editingPayment.notes.length ? editingPayment.notes : [""],
                            }
                            : undefined
                    }
                    onSubmit={handleFormSubmit}
                    closeModal={() => setModalOpen(false)}
                />
            )}

            {/* Pay Amount Modal */}
            {payAmountModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-green-600" />
                            Make Payment
                        </h3>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Vendor</div>
                            <div className="font-medium">{editingPayment?.vendor?.name}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount to Pay
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="number"
                                    value={payingAmount}
                                    onChange={(e) => setPayingAmount(e.target.value)}
                                    max={editingPayment?.remainingAmount}
                                    min="1"
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Remaining: ₹{editingPayment?.remainingAmount?.toLocaleString()}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPayAmountModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaySubmit}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-4 h-4" />
                                Submit Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorPaymentList;