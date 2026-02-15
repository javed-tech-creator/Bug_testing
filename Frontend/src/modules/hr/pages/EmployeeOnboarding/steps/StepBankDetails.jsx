import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useEmplyeeUpdateMutationMutation,
  useGetEmployeeByIdQuery,
} from "@/api/hr/employee.api";
import Loader from "@/components/Loader";

// ==============================
// Validation Schema (yup)
// - bankName: required, min 3
// - accountHolderName: required, min 3
// - accountNumber: digits only, length 9-18
// - ifscCode: uppercase, standard IFSC format (4 letters + 0 + 6 alnum)
// - branchName: letters & spaces only, min 2
// ==============================
const schema = yup.object().shape({
  bankName: yup
    .string()
    .trim()
    .min(3, "Bank name must be at least 3 characters")
    .required("Bank name is required"),
  accountHolderName: yup
    .string()
    .trim()
    .min(3, "Account holder name must be at least 3 characters")
    .required("Account holder name is required"),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .matches(/^[0-9]{9,18}$/, "Enter valid account number (9-18 digits)"),
  ifscCode: yup
    .string()
    .required("IFSC code is required")
    .matches(
      /^[A-Z]{4}0[A-Z0-9]{6}$/,
      "Enter valid IFSC code (e.g. ABCD0XXXXXX)"
    ),
  branchName: yup
    .string()
    .trim()
    .min(2, "Branch name must be at least 2 characters")
    .matches(
      /^[A-Za-z\s'-]+$/,
      "Branch name must contain only letters and spaces"
    )
    .required("Branch name is required"),
});

const StepBankDetails = ({ goNext, goBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: employeeData,
    isLoading: employeeDataLoading,
    refetch,
  } = useGetEmployeeByIdQuery({ id }, { skip: !id });

  const employee = employeeData?.data;

  const [updateEmployee, { isLoading: updateLoading }] =
    useEmplyeeUpdateMutationMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // instant validation while typing
    resolver: yupResolver(schema),
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
    },
  });

  // Prefill
  useEffect(() => {
    if (employee && !employeeDataLoading) {
      const bd = employee?.bankDetail || {};
      reset({
        bankName: bd.bankName || "",
        accountHolderName: bd.accountHolderName || "",
        accountNumber: bd.accountNumber || "",
        ifscCode: bd.ifscCode || "",
        branchName: bd.branchName || "",
      });
    }
  }, [employee, employeeDataLoading, reset]);

  // submit
  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      await updateEmployee({ id, formData: { bankDetail: payload } }).unwrap();
      toast.success("Bank details updated successfully!");
      refetch();
      navigate(`/hr/employee/onboarding/${id}?step=5`);
      if (typeof goNext === "function") goNext();
    } catch (err) {
      console.error("Error updating bank details:", err);
      toast.error("Failed to update bank details");
    }
  };

  if (employeeDataLoading) return <Loader />;

  // Helper handlers used on inputs to enforce allowed characters and auto-uppercase IFSC
  const handleAccountNumberInput = (e) => {
    const raw = e.target.value || "";
    const digits = raw.replace(/\D/g, "").slice(0, 18); // limit to 18 digits
    setValue("accountNumber", digits, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleIfscInput = (e) => {
    const raw = e.target.value || "";
    const upper = raw.toUpperCase().slice(0, 11); // IFSC length is 11
    setValue("ifscCode", upper, { shouldValidate: true, shouldDirty: true });
  };

  const handleBranchInput = (e) => {
    const raw = e.target.value || "";
    // allow letters, spaces, apostrophe, hyphen
    const cleaned = raw.replace(/[^A-Za-z]/g, "").slice(0, 50);
    setValue("branchName", cleaned, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAccountHolderInput = (e) => {
    const raw = e.target.value || "";
    const cleaned = raw.replace(/[^A-Za-z]/g, "").slice(0, 50);
    setValue("accountHolderName", cleaned, { shouldValidate: true, shouldDirty: true });
  };

  const handleBankNameInput = (e) => {
    const raw = e.target.value || "";
    const cleaned = raw.replace(/[^A-Za-z]/g, "").slice(0, 50);
    setValue("bankName", cleaned, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        noValidate
      >
        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("bankName")}
            onInput={handleBankNameInput}
            placeholder="Enter bank name"
            className="w-full px-3 py-1.5 border rounded-sm"
            aria-invalid={errors.bankName ? "true" : "false"}
            title={errors.bankName ? errors.bankName.message : ""}
          />
          {errors.bankName && (
            <p className="text-red-500 text-sm">{errors.bankName.message}</p>
          )}
        </div>

        {/* Account Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("accountHolderName")}
            onInput={handleAccountHolderInput}
            placeholder="Enter account holder name"
            className="w-full px-3 py-1.5 border rounded-sm"
            aria-invalid={errors.accountHolderName ? "true" : "false"}
            title={
              errors.accountHolderName ? errors.accountHolderName.message : ""
            }
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-sm">
              {errors.accountHolderName.message}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={18}
            {...register("accountNumber")}
            onInput={handleAccountNumberInput}
            placeholder="Enter account number (digits only)"
            className="w-full px-3 py-1.5 border rounded-sm"
            aria-invalid={errors.accountNumber ? "true" : "false"}
            title={errors.accountNumber ? errors.accountNumber.message : ""}
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-sm">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* IFSC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("ifscCode")}
            onInput={handleIfscInput}
            placeholder="Enter IFSC code (e.g. ABCD0XXXXXX)"
            className="w-full px-3 py-1.5 border rounded-sm uppercase"
            maxLength={11}
            aria-invalid={errors.ifscCode ? "true" : "false"}
            title={errors.ifscCode ? errors.ifscCode.message : ""}
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-sm">{errors.ifscCode.message}</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("branchName")}
            onInput={handleBranchInput}
            placeholder="Enter branch name"
            className="w-full px-3 py-1.5 border rounded-sm"
            aria-invalid={errors.branchName ? "true" : "false"}
            title={errors.branchName ? errors.branchName.message : ""}
          />
          {errors.branchName && (
            <p className="text-red-500 text-sm">{errors.branchName.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end lg:col-span-3">
          <button
            type="submit"
            disabled={updateLoading || !isValid}
            className={"px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-black/70 cursor-pointer"
            }
            aria-disabled={updateLoading || !isValid}
            title={!isValid ? "Please fix validation errors before saving" : ""}
          >
            {updateLoading ? "Saving..." : "Save & Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepBankDetails;
