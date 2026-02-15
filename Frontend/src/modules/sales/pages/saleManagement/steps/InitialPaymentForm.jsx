import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Loader from "../../../../../components/Loader";
import {
  useAddInitialPaymentMutation,
  useGetPaymentDetailQuery,
  useGetRecceStatusQuery,
  useSubmitToRecceMutation,
} from "../../../../../api/sales/sales.api";
import { useAuth } from "../../../../../store/AuthContext";

const schema = yup.object().shape({
  totalAmount: yup
    .number()
    .positive("Total amount must be positive")
    .required("Total amount is required"),
  discountPercent: yup
    .number()
    .min(0, "Discount percent cannot be negative")
    .max(100, "Discount percent cannot exceed 100%")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .test(
      "discount-percent-validation",
      "Discount percent cannot exceed 100%",
      function (value) {
        if (!value) return true;
        return value <= 100;
      }
    ),
  discount: yup
    .number()
    .min(0, "Discount cannot be negative")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .test(
      "discount-amount-validation",
      "Discount amount cannot exceed total amount",
      function (value) {
        const { totalAmount } = this.parent;
        if (!value || !totalAmount) return true;
        return value <= totalAmount;
      }
    ),
  totalPaid: yup
    .number()
    .nullable()
    .positive("Total paid must be positive")
    .required("Total paid amount is required"),
  remarks: yup.string().nullable(),
  method: yup.string().nullable().required("Payment method is required"),
});

const InitialPaymentForm = ({ onNext }) => {
  const { userData } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [addInitialPayment, { isLoading: updateLoading }] =
    useAddInitialPaymentMutation();
  const [validationErrors, setValidationErrors] = useState({});
  const [submitToRecce, { isLoading: recceLoading }] =
    useSubmitToRecceMutation();
  const { data, isLoading, error } = useGetPaymentDetailQuery({ id });
  const paymentData = data?.data?.result;

  const {
    data: Status,
    isLoading: recceStatusLoding
  } = useGetRecceStatusQuery({ id });
  const recceStatus = Status?.data?.recceStatus;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      totalAmount: "",
      discountPercent: "",
      discount: "",
      totalPaid: "",
      remarks: "",
      method: "",
    },
  });

  console.log(paymentData);
  useEffect(() => {
    if (paymentData && paymentData?.paidPayments) {
      setValue("totalAmount", paymentData?.totalAmount || "");
      setValue("discount", paymentData?.discount || "");
      setValue("totalPaid", paymentData?.paidPayments?.[0].amount || "");
      setValue("remarks", paymentData?.paidPayments?.[0]?.remarks || "");
      setValue("method", paymentData?.paidPayments?.[0]?.method || "");
    }
  }, [id, paymentData, setValue]);

  const totalAmount = watch("totalAmount");
  const discountPercent = watch("discountPercent");
  const discount = watch("discount");

  const calculatedDiscountFromPercent =
    totalAmount && discountPercent ? (totalAmount * discountPercent) / 100 : 0;
  const finalDiscountAmount = discount || calculatedDiscountFromPercent;
  const netAmount = totalAmount ? totalAmount - finalDiscountAmount : 0;

  const handleDiscountPercentChange = (e) => {
    const value = parseFloat(e.target.value);

    if (e.target.value === "") {
      setValue("discountPercent", "");
      setValue("discount", "");
      clearErrors("discountPercent");
      setValidationErrors((prev) => ({ ...prev, discountPercent: null }));
      return;
    }

    if (value < 0) {
      setError("discountPercent", {
        type: "manual",
        message: "Discount percent cannot be negative",
      });
      setValidationErrors((prev) => ({
        ...prev,
        discountPercent: "Discount percent cannot be negative",
      }));
      return;
    }

    if (value > 100) {
      setError("discountPercent", {
        type: "manual",
        message: "Discount percent cannot exceed 100%",
      });
      setValidationErrors((prev) => ({
        ...prev,
        discountPercent: "Discount percent cannot exceed 100%",
      }));
      return;
    }

    setValue("discountPercent", value);
    setValue("discount", "");
    clearErrors("discountPercent");
    setValidationErrors((prev) => ({ ...prev, discountPercent: null }));
  };

  const handleDiscountAmountChange = (e) => {
    const value = parseFloat(e.target.value);

    if (e.target.value === "") {
      setValue("discount", "");
      setValue("discountPercent", "");
      clearErrors("discount");
      setValidationErrors((prev) => ({ ...prev, discount: null }));
      return;
    }

    if (value < 0) {
      setError("discount", {
        type: "manual",
        message: "Discount cannot be negative",
      });
      setValidationErrors((prev) => ({
        ...prev,
        discount: "Discount cannot be negative",
      }));
      return;
    }

    if (totalAmount && value > totalAmount) {
      setError("discount", {
        type: "manual",
        message: "Discount amount cannot exceed total amount",
      });
      setValidationErrors((prev) => ({
        ...prev,
        discount: "Discount amount cannot exceed total amount",
      }));
      return;
    }

    setValue("discount", value);
    setValue("discountPercent", ""); // Clear percentage when manual amount is used
    clearErrors("discount");
    setValidationErrors((prev) => ({ ...prev, discount: null }));
  };

  const onSubmit = async (data) => {
    if (paymentData?.paidPayments?.[0]) {
      onNext();
      return;
    }

    if (data.discountPercent && data.discountPercent > 100) {
      toast.error("Discount percent cannot exceed 100%");
      return;
    }

    if (data.discount && data.totalAmount && data.discount > data.totalAmount) {
      toast.error("Discount amount cannot exceed total amount");
      return;
    }

    try {
      const finalDiscount =
        data.discount ||
        (data.totalAmount && data.discountPercent
          ? (data.totalAmount * data.discountPercent) / 100
          : 0);

      const formData = {
        projectId: id,
        totalAmount: data.totalAmount.toString(),
        discount: finalDiscount.toString(),
        totalPaid: data.totalPaid.toString(),
        remarks: data.remarks || "Initial payment",
        method: data.method,
      };

      const res = await addInitialPayment({ formData }).unwrap();
      console.log(res);
      toast.success("Initial payment added successfully!");

      setTimeout(() => {
        if (onNext) {
          onNext();
        } else {
          navigate(-1);
        }
      }, 500);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        `${error?.message || "Failed to add payment. Please try again."}`
      );
    }
  };

  const getInputClassName = (fieldName) => {
    const hasError = errors[fieldName] || validationErrors[fieldName];
    return `w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 transition-colors duration-200  ${
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-black focus:border-black"
    } ${
      paymentData?.paidPayments?.[0]
        ? "cursor-not-allowed bg-gray-100"
        : "bg-white"
    }`;
  };

  const getSelectClassName = () => {
    return `w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 text-gray-900 ${
      paymentData?.paidPayments?.[0]
        ? "cursor-not-allowed bg-gray-100"
        : "bg-white"
    }`;
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmittoRecce = () => {
    const formData = {
      recceStatus: true,
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
                  const res = await submitToRecce({ formData, id }).unwrap();
                  console.log(res);
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="flex w-full justify-center items-center">
        <div className="w-full mx-auto border border-gray-200 rounded-xl p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Total Amount */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      disabled={paymentData?.paidPayments?.[0]}
                      readOnly={paymentData?.paidPayments?.[0]}
                      required
                      {...register("totalAmount")}
                      placeholder="Enter total project amount"
                      className={getInputClassName("totalAmount")}
                    />
                    {errors.totalAmount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.totalAmount?.message}
                      </p>
                    )}
                  </div>

                  {/* Discount Percentage */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      disabled={paymentData?.paidPayments?.[0]}
                      readOnly={paymentData?.paidPayments?.[0]}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={discountPercent || ""}
                      onChange={handleDiscountPercentChange}
                      placeholder="Enter discount percentage"
                      className={getInputClassName("discountPercent")}
                    />
                    {(errors.discountPercent ||
                      validationErrors.discountPercent) && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.discountPercent?.message ||
                          validationErrors.discountPercent}
                      </p>
                    )}
                  </div>

                  {/* Discount Amount */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Amount
                    </label>
                    <input
                      disabled={paymentData?.paidPayments?.[0]}
                      readOnly={paymentData?.paidPayments?.[0]}
                      type="number"
                      step="0.01"
                      value={
                        discount ||
                        (calculatedDiscountFromPercent > 0
                          ? calculatedDiscountFromPercent.toFixed(2)
                          : "")
                      }
                      onChange={handleDiscountAmountChange}
                      placeholder="Or enter discount amount directly"
                      className={getInputClassName("discount")}
                    />
                    {(errors.discount || validationErrors.discount) && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.discount?.message || validationErrors.discount}
                      </p>
                    )}
                  </div>

                  {/* Net Amount (Calculated) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Net Amount
                    </label>
                    <input
                      type="number"
                      value={netAmount || ""}
                      readOnly
                      placeholder="Calculated net amount"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Total Paid */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Payment
                    </label>
                    <input
                      disabled={paymentData?.paidPayments?.[0]}
                      readOnly={paymentData?.paidPayments?.[0]}
                      type="number"
                      step="0.01"
                      {...register("totalPaid")}
                      placeholder="Enter amount paid"
                      className={getInputClassName("totalPaid")}
                    />
                    {errors.totalPaid && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.totalPaid?.message}
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      disabled={paymentData?.paidPayments?.[0]}
                      readOnly={paymentData?.paidPayments?.[0]}
                      {...register("method")}
                      className={getSelectClassName()}
                    >
                      <option value="" selected disabled>
                        Select Payment Method
                      </option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online Payment</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.method && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.method?.message}
                      </p>
                    )}
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <input
                      disabled={paymentData?.paidPayments?.[0]}
                      readOnly={paymentData?.paidPayments?.[0]}
                      type="text"
                      {...register("remarks")}
                      placeholder="Enter payment remarks"
                      className={getInputClassName("remarks")}
                    />
                    {errors.remarks && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.remarks?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <h3 className=" mt-2 text-sm font-medium text-gray-700 mb-1">
                Payment Summary
              </h3>
              <div className=" p-3 bg-gray-50 rounded-lg border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Total Amount: </span>
                    <span className="font-medium">₹{totalAmount || 0}</span>
                  </div>
                  {discountPercent && (
                    <div>
                      <span className="text-gray-600">Discount %: </span>
                      <span className="font-medium">{discountPercent}%</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Discount: </span>
                    <span className="font-medium">
                      ₹{finalDiscountAmount.toFixed(2) || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Net Amount: </span>
                    <span className="font-medium text-green-600">
                      ₹{netAmount.toFixed(2) || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 px-2 flex justify-between text-[14px]">
                <button
                  type="button"
                  onClick={handleBack}
                  className="cursor-pointer px-6 py-2 bg-gray-600 rounded-sm text-white focus:ring-offset-2 transform transition-all duration-200 shadow-lg"
                >
                  <ArrowBigLeft className="inline" /> Back
                </button>
                <div className="flex gap-4">
                  {(userData?.role == "SalesTL" ||
                    userData?.role == "SaleHOD") && (
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
                  )}

                  <button
                    type="submit"
                    disabled={updateLoading}
                    className={`${
                      updateLoading ? "cursor-not-allowed" : "cursor-pointer"
                    } px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg`}
                  >
                    {updateLoading
                      ? "Submitting..."
                      : onNext
                      ? "Next"
                      : "Add Payment"}
                    <ArrowBigRight className="inline" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPaymentForm;
