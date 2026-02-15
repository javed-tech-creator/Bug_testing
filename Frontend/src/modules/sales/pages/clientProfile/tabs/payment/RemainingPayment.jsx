import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, X, AlertCircle, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useSelector } from "react-redux";

// Import your APIs
import { useGetClientPaymentByProjectIdQuery, useAddPaymentMutation } from "@/api/sales/payment.api";

const PAYMENT_METHODS = [
  { value: "", label: "Select Payment Method", disabled: true },
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "OTHER", label: "Other" },
];

const createPaymentSchema = (maxAmount) =>
  yup.object().shape({
    amount: yup
      .number()
      .typeError("Please enter a valid amount")
      .positive("Amount must be positive")
      .max(
        maxAmount,
        `Amount cannot exceed ₹${maxAmount?.toLocaleString("en-IN") || 0}`
      )
      .required("Amount is required"),
    mode: yup.string().required("Payment method is required"),
    remark: yup.string().required("Remarks are required"),
    transactionId: yup.string().nullable(),
    date: yup.string().required("Payment date is required"),
  });

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ErrorMessage = ({ error }) => (
  <p className="text-red-500 text-xs mt-1 flex items-center" role="alert">
    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
    <span>{error}</span>
  </p>
);

const PaymentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  remainingAmount,
  errors,
  register,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              placeholder={`Max: ${formatCurrency(remainingAmount || 0)}`}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black"
            />
            {errors.amount && <ErrorMessage error={errors.amount.message} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              {...register("mode")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black"
            >
              {PAYMENT_METHODS.map((method) => (
                <option
                  key={method.value}
                  value={method.value}
                  disabled={method.disabled}
                >
                  {method.label}
                </option>
              ))}
            </select>
            {errors.mode && <ErrorMessage error={errors.mode.message} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              {...register("transactionId")}
              placeholder="Enter transaction ID (optional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            {errors.transactionId && <ErrorMessage error={errors.transactionId.message} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            {errors.date && <ErrorMessage error={errors.date.message} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("remark")}
              rows={2}
              placeholder="Enter payment remarks"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black resize-none"
            />
            {errors.remark && <ErrorMessage error={errors.remark.message} />}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RemainingPaymentForm = () => {
  const { projectId } = useParams();
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  
  // Use only payment API
  const { data: paymentRes, isLoading: paymentLoading, refetch } = useGetClientPaymentByProjectIdQuery({ projectId });
  const [addPayment] = useAddPaymentMutation();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentData = paymentRes?.data;

  // Memoized calculations from payment data
  const calculations = useMemo(() => {
    if (!paymentData) return {};

    const finalAmount = paymentData.finalAmount || 0;
    const totalPaid = paymentData.totalPaid || 0;
    const remainingAmount = paymentData.remainingAmount || 0;
    const hasRemainingAmount = remainingAmount > 0;

    return { 
      finalAmount, 
      totalPaid, 
      remainingAmount, 
      hasRemainingAmount 
    };
  }, [paymentData]);

  // Form setup with dynamic validation
  const paymentSchema = useMemo(
    () => createPaymentSchema(calculations.remainingAmount || 0),
    [calculations.remainingAmount]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      amount: "",
      mode: "",
      remark: "",
      transactionId: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Event handlers
  const handleCloseModal = useCallback(() => {
    setShowPaymentForm(false);
    reset();
  }, [reset]);

  const onSubmitPayment = useCallback(
    async (formData) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
        const paymentPayload = {
          projectId,
          clientId: paymentData?.clientId, 
          amount: Number(formData.amount),
          mode: formData.mode,
          type: "REMAINING",
          transactionId: formData.transactionId || undefined,
          remark: formData.remark,
          date: formData.date,
          createdBy: user?._id,
        };

        await addPayment({formData:paymentPayload}).unwrap();
        toast.success("Payment added successfully!");
        handleCloseModal();
        refetch();
      } catch (error) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to add payment. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, projectId, paymentData?.clientId, user?._id, addPayment, handleCloseModal, refetch]
  );

  // Loading state
  if (paymentLoading) {
    return <div className="flex justify-center p-8">Loading payment details...</div>;
  }

  // Error state - no payment data found
  if (!paymentData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 text-sm">
          No payment data found for this project.
        </p>
      </div>
    );
  }

  const { finalAmount, totalPaid, remainingAmount, hasRemainingAmount } = calculations;

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="relative mx-auto p-4 border border-gray-200 bg-gray-50 rounded-md">
      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          Payment Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Final Amount</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(finalAmount)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Total Paid</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Payment Status</p>
            <p className={`font-medium ${
              paymentData.paymentStatus === 'COMPLETED' ? 'text-green-600' : 
              paymentData.paymentStatus === 'PARTIAL' ? 'text-orange-600' : 
              'text-red-600'
            }`}>
              {paymentData.paymentStatus || 'PENDING'}
            </p>
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Remaining Amount</p>
              <p className="text-xl font-medium text-gray-900">
                {formatCurrency(remainingAmount)}
              </p>
            </div>

            {hasRemainingAmount ? (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Payment
              </button>
            ) : (
              <span className="text-sm text-green-600 font-medium">
                Fully Paid ✅
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Payment History
        </h3>

        {paymentData?.payments && paymentData.payments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentData.payments.map((payment, index) => (
              <div
                key={payment._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(Number(payment.amount))}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      payment.type === 'INITIAL' ? 'bg-blue-200 text-blue-700' : 'bg-green-200 text-green-700'
                    }`}>
                      {payment.type} • {payment.mode}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-1">
                    {formatDate(payment.date || payment.createdAt)}
                  </p>

                  <p className="text-xs text-gray-600">{payment.remark}</p>
                  
                  {payment.transactionId && (
                    <p className="text-xs text-gray-500 mt-1">
                      TXN: {payment.transactionId}
                    </p>
                  )}
                </div>

                <div className="ml-4 text-right">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  <p className={`text-xs mt-1 ${
                    payment.status === 'COMPLETED' ? 'text-green-600' : 
                    payment.status === 'PENDING' ? 'text-orange-600' : 
                    'text-red-600'
                  }`}>
                    {payment.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No payment history available
          </p>
        )}
      </div>

      {/* Payment Form Modal */}
      <PaymentFormModal
        isOpen={showPaymentForm}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmitPayment)}
        isSubmitting={isSubmitting}
        remainingAmount={remainingAmount}
        errors={errors}
        register={register}
      />

      <div className="mt-4 px-2 flex justify-between text-[14px]">
        <button
          type="button"
          onClick={handleBack}
          className="cursor-pointer px-6 py-2 bg-gray-600 rounded-sm text-white focus:ring-offset-2 transform transition-all duration-200 shadow-lg"
        >
          <ArrowBigLeft className="inline" /> Back
        </button>
        
        <div className="flex gap-4">
          <Link
            to="/sales/sales-management-sheet"
            className="px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go To Sheet
            <ArrowBigRight className="inline" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RemainingPaymentForm;