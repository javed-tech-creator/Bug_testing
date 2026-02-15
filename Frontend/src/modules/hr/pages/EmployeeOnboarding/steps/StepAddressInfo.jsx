import React, { useEffect, useState } from "react";
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

const schema = yup.object().shape({
  currentAddress: yup.string().required("Current address is required"),
  permanentAddress: yup.string().required("Permanent address is required"),
  country: yup.string().required("Country is required"),
  state: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .required("State is required"),
  city: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .required("City is required"),
  emergencyContact: yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed")
      .required("Emergency contact name is required"),
    relation: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed")
      .required("Relation is required"),
    phone: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
      .required("Emergency contact phone is required"),
  }),
});

const StepAddressInfo = ({ goNext, goBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const { data: employeeData, isLoading: employeeDataLoading, refetch } =
    useGetEmployeeByIdQuery({ id }, { skip: !id });

  const employee = employeeData?.data;

  const [updateEmployee, { isLoading: updateLoading }] =
    useEmplyeeUpdateMutationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: { country: "India" },
  });

  // watch for current address changes
  const currentAddr = watch("currentAddress");

  useEffect(() => {
    if (sameAsCurrent) {
      setValue("permanentAddress", currentAddr || "");
    }
  }, [sameAsCurrent, currentAddr, setValue]);

  useEffect(() => {
    if (employee && !employeeDataLoading) {
      reset({
        currentAddress: employee.currentAddress || "",
        permanentAddress: employee.permanentAddress || "",
        country: employee.country || "India",
        state: employee?.stateId?.title || "",
        city: employee?.cityId?.title || "",
        emergencyContact: {
          name: employee.emergencyContact?.name || "",
          relation: employee.emergencyContact?.relation || "",
          phone: employee.emergencyContact?.phone || "",
        },
      });
    }
  }, [employee, employeeDataLoading, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      await updateEmployee({ id, formData: payload }).unwrap();
      toast.success("Address details updated successfully!");
      refetch();
      navigate(`/hr/employee/onboarding/${id}?step=3`);
      goNext();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  if (employeeDataLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-2"
      >
        {/* Current Address */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Address <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("currentAddress")}
            placeholder="Enter current residential address"
            rows={2}
            className="w-full px-3 py-1.5 border rounded-sm"
          />
          {errors.currentAddress && (
            <p className="text-red-500 text-sm">
              {errors.currentAddress.message}
            </p>
          )}
        </div>

        {/* Permanent Address */}
        <div className="lg:col-span-3">
          <div className="flex gap-4 items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permanent Address <span className="text-red-500">*</span>
            </label>
            {/* Same As Current Radio */}
            <div className="flex items-center">
              <input
                id="sameAsCurrent"
                type="checkbox"
                checked={sameAsCurrent}
                onChange={() => setSameAsCurrent(!sameAsCurrent)}
                className="mr-2 cursor-pointer"
              />
              <label
                htmlFor="sameAsCurrent"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Same as Current Address
              </label>
            </div>
          </div>
          <textarea
            {...register("permanentAddress")}
            placeholder="Enter permanent residential address"
            rows={2}
            className="w-full px-3 py-1.5 border rounded-sm"
            readOnly={sameAsCurrent}
          />
          {errors.permanentAddress && (
            <p className="text-red-500 text-sm">
              {errors.permanentAddress.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("country")}
            placeholder="Country"
            className="w-full px-3 py-1.5 border rounded-sm"
            readOnly
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("state")}
            placeholder="Enter state"
            defaultValue={employee?.stateId?.title || ""} 
            onKeyDown={(e) => {
              if (!/[a-zA-Z\s]/.test(e.key) && e.key.length === 1)
                e.preventDefault();
            }}
            className="w-full px-3 py-1.5 border rounded-sm"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("city")}
            placeholder="Enter city"
            defaultValue={employee?.cityId?.title || ""} 
            onKeyDown={(e) => {
              if (!/[a-zA-Z\s]/.test(e.key) && e.key.length === 1)
                e.preventDefault();
            }}
            className="w-full px-3 py-1.5 border rounded-sm"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("emergencyContact.name")}
            placeholder="Enter emergency contact name"
            onKeyDown={(e) => {
              if (!/[a-zA-Z\s]/.test(e.key) && e.key.length === 1)
                e.preventDefault();
            }}
            className="w-full px-3 py-1.5 border rounded-sm"
          />
          {errors.emergencyContact?.name && (
            <p className="text-red-500 text-sm">
              {errors.emergencyContact.name.message}
            </p>
          )}
        </div>

        {/* Relation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("emergencyContact.relation")}
            placeholder="Enter relation"
            onKeyDown={(e) => {
              if (!/[a-zA-Z\s]/.test(e.key) && e.key.length === 1)
                e.preventDefault();
            }}
            className="w-full px-3 py-1.5 border rounded-sm"
          />
          {errors.emergencyContact?.relation && (
            <p className="text-red-500 text-sm">
              {errors.emergencyContact.relation.message}
            </p>
          )}
        </div>

        {/* Emergency Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("emergencyContact.phone")}
            placeholder="10-digit emergency number"
            maxLength={10}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key.length === 1)
                e.preventDefault();
            }}
            className="w-full px-3 py-1.5 border rounded-sm"
          />
          {errors.emergencyContact?.phone && (
            <p className="text-red-500 text-sm">
              {errors.emergencyContact.phone.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-between lg:col-span-3">
          {/* <button
            type="button"
            onClick={goBack}
            className="px-4 py-2 border rounded-sm bg-white text-gray-700"
          >
            Back
          </button> */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              disabled={updateLoading}
              className="px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-black/70 cursor-pointer"
            >
              {updateLoading ? "Saving..." : "Save & Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StepAddressInfo;
