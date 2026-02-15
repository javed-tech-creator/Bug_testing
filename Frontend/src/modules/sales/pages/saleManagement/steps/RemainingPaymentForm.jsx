import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  X,
  AlertCircle,
  ArrowBigRight,
  ArrowBigLeft,
} from "lucide-react";
import {
  useAddRemainingPaymentMutation,
  useGetPaymentDetailQuery,
  useGetRecceStatusQuery,
  useSubmitToRecceMutation,
} from "../../../../../api/sales/sales.api";
import Loader from "../../../../../components/Loader";
import { useAuth } from "../../../../../store/AuthContext";

// Constants
const PAYMENT_METHODS = [
  { value: "", label: "Select Payment Method", disabled: true },
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "cheque", label: "Cheque" },
  { value: "online", label: "Online Payment" },
  { value: "other", label: "Other" },
];

// Validation Schema
const createPaymentSchema = (maxAmount) =>
  yup.object().shape({
    amount: yup
      .number()
      .typeError("Please enter a valid amount")
      .positive("Amount must be positive")
      .max(
        maxAmount,
        `Amount cannot exceed ₹${maxAmount.toLocaleString("en-IN")}`
      )
      .required("Amount is required"),
    method: yup.string().required("Payment method is required"),
    remarks: yup.string().required("Remarks are required"),
  });

// Utility Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
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

// Sub-components
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
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center p-2 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-3">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min={0}
              max={remainingAmount || undefined}
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 0, message: "Amount must be positive" },
                max: {
                  value: remainingAmount || Infinity,
                  message: `Amount cannot exceed ${formatCurrency(
                    remainingAmount
                  )}`,
                },
              })}
              placeholder={`Max: ${formatCurrency(remainingAmount || 0)}`}
              onInput={(e) => {
                const val = parseFloat(e.target.value);
                if (val > remainingAmount) {
                  e.target.value = remainingAmount;
                }
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />

            {errors.amount && <ErrorMessage error={errors.amount.message} />}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              {...register("method")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black"
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
            {errors.method && <ErrorMessage error={errors.method.message} />}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("remarks")}
              rows={2}
              placeholder="Enter payment remarks"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black resize-none"
            />
            {errors.remarks && <ErrorMessage error={errors.remarks.message} />}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-1">
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
  const {userData} = useAuth()
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetPaymentDetailQuery({ id });
  const paymentData = data?.data?.result;

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addPayment] = useAddRemainingPaymentMutation();
  const [submitToRecce, { isLoading: recceLoading }] =
    useSubmitToRecceMutation();


 const {
    data: Status,
    isLoading: recceStatusLoding
  } = useGetRecceStatusQuery({ id });
  const recceStatus = Status?.data?.recceStatus;

  // Memoized calculations
  const calculations = useMemo(() => {
    if (!paymentData) return {};

    const netAmount = paymentData.totalAmount - paymentData.discount;
    const hasRemainingAmount = paymentData.remainingAmount > 0;

    return { netAmount, hasRemainingAmount };
  }, [paymentData]);

  // Form setup with dynamic validation
  const paymentSchema = useMemo(
    () => createPaymentSchema(paymentData?.remainingAmount || 0),
    [paymentData?.remainingAmount]
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
      method: "",
      remarks: "",
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
        const paymentFormData = {
          ...formData,
          projectId: id,
        };

        await addPayment({ formData: paymentFormData }).unwrap();
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
    [isSubmitting, id, addPayment, handleCloseModal, refetch]
  );

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!paymentData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 text-sm">
          No payment data found for this project.
        </p>
      </div>
    );
  }

  const { netAmount, hasRemainingAmount } = calculations;

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmittoRecce = () => {
    const formData = {
      recceStatus: true
    };

    let toastId = null;

    toastId = toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to submit for recce?</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  await submitToRecce({ formData , id}).unwrap();
                  toast.update(toastId, {
                    render: "Submitted to Recce successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                  });
                } catch (err) {
                  toast.update(toastId, {
                    render: "Failed to submit to Recce",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                  });
                }
                closeToast();
              }}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        toastId: "recce-confirm-toast",
      }
    );
  };
  return (
    <div className=" relative mx-auto p-4 border border-gray-200 bg-gray-50 rounded-md ">
      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          Payment Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Amount</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(paymentData.totalAmount)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Discount</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(paymentData.discount)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Net Amount</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(netAmount)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Total Paid</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(paymentData.totalPaid)}
            </p>
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Remaining Amount</p>
              <p className="text-xl font-medium text-gray-900">
                {formatCurrency(paymentData.remainingAmount)}
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
              <span className="text-sm text-gray-600 font-medium">
                Fully Paid
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

        {paymentData.paidPayments && paymentData.paidPayments.length > 0 ? (
          <div className=" grid grid-cols-2 gap-4">
            {paymentData.paidPayments.map((payment, index) => (
              <div
                key={payment._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(Number(payment.amount))}
                    </p>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                      {payment.method.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-1">
                    {formatDate(payment.paidAt)}
                  </p>

                  <p className="text-xs text-gray-600">{payment.remarks}</p>
                </div>

                <div className="ml-4 text-right">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
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
        remainingAmount={paymentData.remainingAmount}
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
               {(userData?.role == "SalesTL" || userData?.role == "SaleHOD") &&
              <button
            type="button"
            disabled={recceLoading || recceStatus}
            onClick={handleSubmittoRecce}
            className={`${
                        recceLoading || recceStatus
                          ? "cursor-not-allowed bg-gray-700"
                          : "bg-green-600 cursor-pointer"
                      }   px-6 py-2  rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg`}
          >
                                {
  recceLoading || recceStatusLoding
    ? "Submitting..."
    : recceStatus
    ? "Already Submitted To Recce"
    : "Submit To Recce Department"
}
          </button>
                   }
          

          <div className="flex gap-4">
            <Link
              to="/sales/sales-management-sheet"
              type="submit"
              className={` px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg`}
            >
              Go To Sheet
              <ArrowBigRight className="inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemainingPaymentForm;
