// MorningSalesForm.js - Morning shift form with its own API calls
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAddReportingMutation, useGetTodayReportByIdQuery } from "../../../../api/sales/reporting.api";
import { useAuth } from "../../../../store/AuthContext";
import Loader from "../../../../components/Loader";

const statuses = ["hot", "warm", "cold", "out", "win"];

const schema = yup.object().shape({
  shift: yup.string().oneOf(["Morning"]).required(),
  ...statuses.reduce((acc, key) => {
    acc[key] = yup.array().of(
      yup.object().shape({
        companyName: yup.string().required("Company name is required"),
        amount: yup.number()
          .typeError("Amount must be a number")
          .required("Amount is required")
          .min(0, "Amount cannot be negative")
          .max(1000000, "Amount cannot exceed 10,00,000"),
      })
    );
    return acc;
  }, {}),
});

const defaultValues = {
  shift: "Morning",
  hot: [],
  warm: [],
  cold: [],
  out: [],
  win: [],
};

const MorningSalesForm = () => {
  const { userData } = useAuth();
  const id = userData?.id;
  const shift = "Morning";

  const [formDisabled, setFormDisabled] = useState(false);
  const [addReport , {isLoading:addLoading , error:addError}] = useAddReportingMutation();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetTodayReportByIdQuery({id});

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (Array.isArray(data?.data?.result)) {
      const morningReport = data.data.result.find(r => r.shift === "Morning");

      if (morningReport) {
        const formattedData = {
          shift: "Morning",
          hot: morningReport.hot || [],
          warm: morningReport.warm || [],
          cold: morningReport.cold || [],
          out: morningReport.loss || [],
          win: morningReport.win || [],
        };

        reset(formattedData);
        // setFormDisabled(true);
      } else {
        reset(defaultValues);
        setFormDisabled(false);
      }
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    const payload = {
      shift: "Morning",
      hot: formData.hot,
      warm: formData.warm,
      cold: formData.cold,
      out: formData.out,
      win: formData.win,
    };

    try {
  const res = await addReport({ id, formData: payload }).unwrap();;
  toast.success("Morning report submitted successfully");
  setFormDisabled(true);
  refetch();
} catch (err) {
  const message =
    err?.data.message || "Morning report submission failed";
  toast.error(message);
}

  };

  if (isLoading) return <p className="text-center text-sm"><Loader/></p>;

  return (
    <div className="bg-white border border-gray-200 p-3 rounded">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden shift field */}
        <input type="hidden" {...register("shift")} value="Morning" />

        {/* Grid Layout for Status Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <div key={status} className="border border-gray-200 p-3 rounded bg-gray-50">
              <label className="block font-medium mb-2 text-sm text-black capitalize">
                {status} Status
              </label>

              <Controller
                name={status}
                control={control}
                render={({ field }) => (
                  <>
                    <select
                      disabled={formDisabled}
                      className="w-full border border-gray-300 px-2 py-1 rounded mb-2 bg-white text-sm"
                      value={field.value.length}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        const current = field.value || [];
                        const updated = Array.from({ length: count }).map(
                          (_, i) => current[i] || { companyName: "", amount: "" }
                        );
                        field.onChange(updated);
                      }}
                    >
                      {[...Array(6)].map((_, i) => (
                        <option key={i} value={i}>
                          {i} companies
                        </option>
                      ))}
                    </select>

                    <div className="space-y-2">
                      {field.value.map((item, index) => (
                        <div key={index} className=" grid grid-cols-2 gap-2">
                          <div className="flex gap-1 items-center justify-center">
                          {/* <div className="bg-black text-white h-6 w-7 text-center rounded-full">{index + 1}</div> */}
                          <input
                            type="text"
                            placeholder="Company Name"
                            className="w-full border border-gray-300 px-2 py-1 rounded bg-white text-sm focus:outline-none focus:border-black"
                            value={item.companyName}
                            disabled={formDisabled}
                            onChange={(e) => {
                              const updated = [...field.value];
                              updated[index].companyName = e.target.value;
                              field.onChange(updated);
                            }}
                          />
                          </div>
                          <input
                            type="number"
                            placeholder="Amount"
                            className="w-full border border-gray-300 px-2 py-1 rounded bg-white text-sm focus:outline-none focus:border-black"
                            value={item.amount}
                            disabled={formDisabled}
                            min="0"
                            max="1000000"
                            onChange={(e) => {
                              const value = Math.max(0, Math.min(1000000, Number(e.target.value)));
                              const updated = [...field.value];
                              updated[index].amount = value;
                              field.onChange(updated);
                            }}
                          />
                          {errors?.[status]?.[index]?.companyName && (
                            <p className="text-red-500 text-xs">{errors[status][index].companyName.message}</p>
                          )}
                          {errors?.[status]?.[index]?.amount && (
                            <p className="text-red-500 text-xs">{errors[status][index].amount.message}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              />
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end">
        <button
          type="submit"
          disabled={formDisabled || addLoading}
          className={`text-right px-4 py-2 rounded font-medium text-sm transition-colors ${
            formDisabled  || addLoading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {formDisabled ? (
            data?.data?.result?.length > 0 ? "Report Already Submitted" : 
            new Date().getHours() >= 12 ? "Morning Shift Expired" :
            "Submit Report"
          ) : "Submit Morning Report"}
        </button>
        </div>
      </form>
    </div>
  );
};

export default MorningSalesForm;