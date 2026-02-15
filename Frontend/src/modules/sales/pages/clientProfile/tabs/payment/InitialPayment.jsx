import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertCircle, Lock } from "lucide-react";

import Loader from "@/components/Loader";
import { useGetQuotationByProjectIdQuery } from "@/api/sales/client.api";
import { useGetClientPaymentByProjectIdQuery, useInitialPaymentMutation } from "@/api/sales/payment.api";
import { useSelector } from "react-redux";

const PAYMENT_METHODS = [
  { value: "", label: "Select Payment Method", disabled: true },

  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "OTHER", label: "Other" }
];


const schema = yup.object().shape({
  totalAmount: yup
    .number()
    .required("Total amount is required")
    .min(1, "Total amount must be greater than 0"),
  discountPercent: yup
    .number()
    .nullable()
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100%")
    .test(
      "decimal",
      "Discount percentage can have maximum 2 decimal places",
      (value) => value === null || value === undefined || /^\d+(\.\d{1,2})?$/.test(value?.toString())
    ),
  discount: yup
    .number()
    .nullable()
    .min(0, "Discount amount cannot be negative")
    .test(
      "max-discount",
      "Discount amount cannot exceed total amount",
      function (value) {
        const totalAmount = this.parent.totalAmount;
        return !value || !totalAmount || value <= totalAmount;
      }
    ),
   amount: yup
  .number()
  .typeError("Enter valid amount")
  .required("Initial payment amount is required")
  .min(1, "Payment amount must be greater than 0")
  .test("max-payment", "Payment amount cannot exceed final amount", function (value) {
    const finalAmount = Number(this.parent.finalAmount || 0);
    return Number(value) <= finalAmount;
  })
,
  remarks: yup.string().nullable().max(500, "Remarks cannot exceed 500 characters"),
  mode: yup.string().required("Payment mode is required"),
});

const ErrorMessage = ({ error }) => (
  <p className="text-red-500 text-xs mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 mr-1" />
    <span>{error}</span>
  </p>
);

const ReadOnlyField = ({ label, value, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        readOnly
        value={value}
        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
      />
      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  </div>
);

const InitialPaymentForm = ({ onSuccess = false}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
   const res = useSelector((state) => state.auth.userData);
 const user = res?.user || {}
  
  const { data: quotationRes, isLoading: quotationLoading } = useGetQuotationByProjectIdQuery({ id: projectId });
  const { data: paymentRes, isLoading: paymentLoading } = useGetClientPaymentByProjectIdQuery({ projectId });
  const quotation = quotationRes?.data?.[0];
  const pricing = quotation?.pricing;
  const clientId = quotation?.clientId?._id;

  const paymentData = paymentRes?.data || {}
  const hasInitialPayment = paymentData?.initialPaymentDone;
  const initialPaymentData = paymentData?.payments?.[0];
  const isFormDisabled = hasInitialPayment;

  const [addInitialPayment, { isLoading: submitting }] = useInitialPaymentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      totalAmount: "",
      discountPercent: "",
      discount: "",
      amount: "",
      remarks: "",
      mode: "",
      finalAmount: 0
    },
  });


  useEffect(() => {
    if (!quotationLoading && !quotation) {
      toast.error("Please create quotation first");
      setTimeout(() => {
        navigate(`/sales/project/${projectId}/quotation/`);
      }, 2000);
    }
  }, [quotation, quotationLoading, navigate, projectId]);

  
  useEffect(() => {
    if (hasInitialPayment && initialPaymentData && paymentData) {
      console.log("has initial")
      setValue("totalAmount", paymentData.totalAmount || pricing?.totalAmount || "");
      setValue("discount", paymentData.discount || pricing.discountAmount || "");
      setValue("discountPercent", paymentData.discountPercent ||  pricing.discountPercent || "");
      setValue("amount", initialPaymentData.amount || 0);
      setValue("remarks", initialPaymentData.remark || "");
      setValue("mode", initialPaymentData.mode || "");
    }
  }, [hasInitialPayment, initialPaymentData, paymentData, setValue]);

  // Auto-fill from quotation if no payment exists
  useEffect(() => {
    if (!hasInitialPayment && pricing && !paymentLoading && quotation) {
      setValue("totalAmount", pricing.totalAmount || "");
      setValue("discountPercent", pricing.discountPercent || "");
      setValue("discount", pricing.discountAmount || "");
    }
  }, [pricing, hasInitialPayment, paymentLoading, quotation, setValue]);


  const totalAmount = watch("totalAmount") || 0;
  const discountPercent = watch("discountPercent") || 0;
  const discount = watch("discount") || 0;

  // Calculate amounts
  const calculatedDiscount = discountPercent ? (totalAmount * discountPercent) / 100 : 0;
  const finalDiscount = discount || calculatedDiscount;
  const netAmount = Math.max(0, totalAmount - finalDiscount);
  const gstPercent = 18;
  const gstAmount = netAmount ? (netAmount * gstPercent) / 100 : 0;
  const finalAmount = netAmount + gstAmount;
console.log(finalAmount)

useEffect(() => {
  setValue("finalAmount", Number(finalAmount), { shouldValidate: true });
}, [finalAmount, setValue]);

  useEffect(() => {
    if (discountPercent > 0 && totalAmount > 0 && !isFormDisabled) {
      const calculated = (totalAmount * discountPercent) / 100;
      setValue("discount", calculated);
      trigger("discount");
    }
  }, [discountPercent, totalAmount, setValue, trigger, isFormDisabled]);


  useEffect(() => {
    if (discount > 0 && totalAmount > 0 && !isFormDisabled) {
      const calculatedPercent = (discount / totalAmount) * 100;
      setValue("discountPercent", parseFloat(calculatedPercent.toFixed(2)));
      trigger("discountPercent");
    }
  }, [discount, totalAmount, setValue, trigger, isFormDisabled]);

  const onSubmit = async (data) => {
    if (hasInitialPayment) {
      toast.info("Initial payment already added");
      return;
    }

    if (!quotation) {
      toast.error("Please create quotation first");
      return;
    }

    if (data.amount > finalAmount) {
      toast.error("Payment amount cannot exceed final amount");
      return;
    }

    try {
      const formData = {
        projectId,
        clientId,
        amount: Number(data.amount),
        mode: data.mode,
        remark: data.remarks || "Initial payment",
        createdBy: user?._id,
      };

      await addInitialPayment({formData}).unwrap();
      toast.success("Initial payment added successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Failed to add payment");
      console.error(error?.data?.message || "Failed to add payment");
    }
  };

  if (quotationLoading || paymentLoading) return <Loader />;

  if (!quotation) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="py-8">
          <p className="text-gray-500">Redirecting to quotation page...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 space-y-2">
        
        {/* Amount Calculation Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Amount - Always Read Only */}
          <ReadOnlyField 
            label="Total Amount" 
            value={totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />

          {/* Discount Percentage - Always Read Only */}
          <ReadOnlyField 
            label="Discount %" 
            value={discountPercent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />

          {/* Discount Amount - Always Read Only */}
          <ReadOnlyField 
            label="Discount Amount" 
            value={finalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />

          {/* Net Amount (Read-only) */}
          <ReadOnlyField 
            label="Net Amount" 
            value={netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />
        </div>

        {/* GST and Final Amount Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReadOnlyField 
            label="GST (%)" 
            value={`${gstPercent}%`}
          />
          
          <ReadOnlyField 
            label="GST Amount" 
            value={gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />
          
          <ReadOnlyField 
            label="Final Amount" 
            value={finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            className="font-semibold"
          />
        </div>

        {/* Payment Details Section */}
        <div className="">
          {/* <h3 className="text-base font-medium text-gray-900 mb-2">Payment Details</h3> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Initial Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Payment Amount
              </label>
              <input
                type="number"
                step="0.01"
                max={finalAmount}
                disabled={isFormDisabled}
                placeholder="Enter payment amount"
                {...register("amount")}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                  isFormDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                } ${errors.amount ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.amount && <ErrorMessage error={errors.amount.message} />}
              
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode
              </label>
              <select
                disabled={isFormDisabled}
                {...register("mode")}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                  isFormDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                } ${errors.mode ? "border-red-500" : "border-gray-300"}`}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value} disabled={m.disabled}>
                    {m.label}
                  </option>
                ))}
              </select>
              {errors.mode && <ErrorMessage error={errors.mode.message} />}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <input
                type="text"
                disabled={isFormDisabled}
                placeholder="Enter payment remarks"
                {...register("remarks")}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                  isFormDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                } ${errors.remarks ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.remarks && <ErrorMessage error={errors.remarks.message} />}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!hasInitialPayment && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <span className="flex items-center">
                  Processing...
                </span>
              ) : (
                "Save Initial Payment"
              )}
            </button>
          </div>
        )}

        {/* Already Paid Message */}
        {hasInitialPayment && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Initial Payment Recorded
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  The initial payment has already been processed for this project.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default InitialPaymentForm;