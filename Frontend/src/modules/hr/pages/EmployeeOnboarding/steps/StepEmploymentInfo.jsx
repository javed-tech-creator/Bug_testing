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

// ✅ Validation
const schema = yup.object().shape({
  
  probationPeriod: yup
    .string()
    .required("Probation period is required")
    .matches(/^\d{1,2}$/, "Only 1 or 2 digits allowed"),
  probationPeriodType: yup
    .string()
    .required("Please select Year or Month"),
  pfAccountNo: yup
    .string()
    .nullable()
    .matches(/^\d{12,22}$/, "PF Account No must be 12 to 22 digits"),
  uan: yup
    .string()
    .nullable()
    .matches(/^\d{12}$/, "UAN must be exactly 12 digits"),
  esicNo: yup
    .string()
    .nullable()
    .matches(/^\d{10}$/, "ESIC No must be exactly 10 digits"),
  salary: yup.object().shape({
    ctc: yup
      .number()
      .typeError("CTC must be a number")
      .required("CTC is required")
      .moreThan(0, "CTC must be greater than zero"),

    basic: yup
      .number()
      .typeError("Basic must be a number")
      .required("Basic is required"),

    hra: yup
      .number()
      .typeError("HRA must be a number")
      .nullable(),

    allowances: yup
      .number()
      .typeError("Allowances must be a number")
      .nullable()
      .min(0, "Allowances cannot be negative"),

    deductions: yup
      .number()
      .typeError("Deductions must be a number")
      .nullable()
      .test(
        "deductions-range",
        "Deductions cannot exceed 30% of CTC",
        function (value) {
          const ctc = this.parent.ctc;
          if (!value || !ctc) return true;
          return value <= ctc * 0.3;
        }
      ),
  }),
});

const StepEmploymentInfo = ({ goNext, goBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: employeeData, isLoading: employeeDataLoading, refetch } =
    useGetEmployeeByIdQuery({ id }, { skip: !id });

  const employee = employeeData?.data;
   
  

  const [updateEmployee, { isLoading: updateLoading }] =
    useEmplyeeUpdateMutationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // prefill data
  useEffect(() => {
    if (employee && !employeeDataLoading) {
      reset({
        probationPeriod: employee.probationPeriod || "",
        probationPeriodType: employee.probationPeriodType || "",
        pfAccountNo: employee.pfAccountNo || "",
        uan: employee.uan || "",
        esicNo: employee.esicNo || "",
        salary: {
          ctc: employee.salary?.ctc ?? null,
          basic: employee.salary?.basic ?? null,
          hra: employee.salary?.hra ?? null,
          allowances: employee.salary?.allowances ?? null,
          deductions: employee.salary?.deductions ?? null,
        },
      });
    }
  }, [employee, employeeDataLoading, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      await updateEmployee({ id, formData: payload }).unwrap();
      toast.success("Employment info updated successfully!");
      refetch();
      navigate(`/hr/employee/onboarding/${id}?step=4`);
      goNext();
    } catch (err) {
      console.error("Error updating employment info:", err);
      toast.error("Failed to update employment info");
    }
  };

  if (employeeDataLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        

        {/* Probation Period */}
        <div>
          <label className="block text-sm mb-0.5 font-medium">
            Probation Period *
          </label>

          <div className="flex items-center gap-1">
            <input
              {...register("probationPeriod")}
              className="flex-1 border rounded-md p-2"
              placeholder="Enter Probation Period"
              type="text"
              maxLength={2}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />

            <select
              {...register("probationPeriodType")}
              required
              className="flex-1 border rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="Year">Year</option>
              <option value="Month">Month</option>
            </select>
          </div>

          {errors.probationPeriod && (
            <p className="text-red-500">{errors.probationPeriod.message}</p>
          )}
          {errors.probationPeriodType && (
            <p className="text-red-500">{errors.probationPeriodType.message}</p>
          )}
        </div>

        {/* Salary Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CTC <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("salary.ctc", { valueAsNumber: true })}
            placeholder="Total CTC"
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
          {errors.salary?.ctc && (
            <p className="text-red-500 text-sm">{errors.salary.ctc.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Basic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("salary.basic", { valueAsNumber: true })}
            placeholder="Basic Salary"
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
          {errors.salary?.basic && (
            <p className="text-red-500 text-sm">
              {errors.salary.basic.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            HRA
          </label>
          <input
            type="text"
            {...register("salary.hra", { valueAsNumber: true })}
            placeholder="HRA"
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
          {errors.salary?.hra && (
            <p className="text-red-500 text-sm">{errors.salary.hra.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allowances
          </label>
          <input
            type="text"
            {...register("salary.allowances", { valueAsNumber: true })}
            placeholder="Allowances"
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
          {errors.salary?.allowances && (
            <p className="text-red-500 text-sm">{errors.salary.allowances.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deductions
          </label>
          <input
            type="text"
            {...register("salary.deductions", { valueAsNumber: true })}
            placeholder="Deductions"
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
          {errors.salary?.deductions && (
            <p className="text-red-500 text-sm">{errors.salary.deductions.message}</p>
          )}
        </div>

        {/* PF / UAN / ESIC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PF Account No
          </label>
          <input
            type="text"
            {...register("pfAccountNo")}
            placeholder="Enter PF Account No"
            maxLength={22}
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 22);
            }}
          />
          {errors.pfAccountNo && (
            <p className="text-red-500 text-sm">{errors.pfAccountNo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            UAN
          </label>
          <input
            type="text"
            {...register("uan")}
            placeholder="Enter UAN"
            maxLength={12}
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 12);
            }}
          />
          {errors.uan && (
            <p className="text-red-500 text-sm">{errors.uan.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ESIC No
          </label>
          <input
            type="text"
            {...register("esicNo")}
            placeholder="Enter ESIC Number"
            maxLength={10}
            className="w-full px-3 py-1.5 border rounded-sm"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            }}
          />
          {errors.esicNo && (
            <p className="text-red-500 text-sm">{errors.esicNo.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end lg:col-span-3">
          {/* <button
            type="button"
            onClick={goBack}
            className="px-4 py-2 border rounded-sm bg-white text-gray-700"
          >
            Back
          </button> */}
          <button
            type="submit"
            disabled={!isValid || updateLoading}
            className={`px-4 py-2 rounded-sm shadow 
              ${!isValid || updateLoading 
                ? "bg-gray-400 cursor-not-allowed opacity-60" 
                : "bg-black text-white hover:bg-black/70 cursor-pointer"
              }`}
          >
            {updateLoading ? "Saving..." : "Save & Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepEmploymentInfo;
