import React, { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useAssignLeadMutation,
  useFetchLeadByIdQuery,
  useGetUserByBranchQuery,
} from "../../../../api/sales/lead.api";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { useSelector } from "react-redux";
import PageHeader from "@/components/PageHeader";

const schema = yup.object().shape({
  concernPersonName: yup.string().required("Concern person name is required"),
  phone: yup
    .string()
    .matches(
      /^[6-9]\d{9}$/,
      "Phone number must start with 6-9 and be 10 digits"
    )
    .required("Phone number is required"),
  altPhone: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "altPhone",
      "Phone number must start with 6-9 and be 10 digits",
      (value) => {
        if (!value) return true;
        return /^[6-9]\d{9}$/.test(value);
      }
    ),
  address: yup.string(),
  pincode: yup
    .string()
    .test("pincode", "Enter a valid 6-digit pincode", (value) => {
      if (!value) return true;
      return /^\d{6}$/.test(value);
    })
    .nullable(),
  leadLabel: yup.string().required("Lead type is required"),
  city: yup.string().required("City is required"),
  requirement: yup.string().required("Requirement is required"),
  saleEmployeeId: yup.string().required("Sales employee is required"),
});

const LeadAssignPage = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [salesEmployees, setSalesEmployees] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const { data, isLoading, error, refetch } = useFetchLeadByIdQuery({ id });

  const leadData = data?.data;
  console.log("Lead Data:", data);
  const { data: salesEmployeeData, isLoading: loadingSalesEmployees } =
    useGetUserByBranchQuery({
      branchId: user?.branch?._id,
      deptId: user?.department?._id,
      // designationId: user?.designation?._id || '68f21987a28bb4eceb49d83f'
    });

  const [assignLead, { isLoading: assignLoading }] = useAssignLeadMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      concernPersonName: "",
      phone: "",
      altPhone: "",
      address: "",
      pincode: "",
      leadLabel: "",
      requirement: "",
      city: "",
      saleEmployeeId: "",
    },
  });

  useEffect(() => {
    if (salesEmployeeData?.data?.users) {
      setSalesEmployees(salesEmployeeData.data.users);
    }
  }, [salesEmployeeData]);

  useEffect(() => {
    if (leadData) {
      reset({
        concernPersonName:
          leadData?.clientName || leadData?.concernPersonName || "",
        phone: leadData.phone || "",
        altPhone: leadData.altPhone || "",
        address: leadData.address || "",
        pincode: leadData.pincode || "",
        leadLabel: leadData.leadLabel || "",
        city: leadData.city || "",
        requirement: leadData.requirement || "",
        saleEmployeeId: "",
      });
    }
  }, [leadData, reset]);

  const onSubmit = async (data) => {
    console.log("Submit triggered", data);
    try {
      const finalData = {
        assignTo: data.saleEmployeeId,
        assignBy: user?._id,
      };

      const res = await assignLead({ id, formData: finalData }).unwrap();
      toast.success("Lead assigned successfully!");
      refetch();
      setTimeout(() => {
        navigate(`/sales/leads/view`);
      }, 500);
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error(
        error?.message ||
          error?.data?.message ||
          "Failed to assign lead. Please try again."
      );
    }
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
         <div className="bg-gray-50 flex-col justify-center items-center p-4">
        <div className="w-full mb-6 border-l-4 border-black rounded-sm shadow-md bg-white p-3 hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between bg-gray-50 px-4 p-1 border border-gray-200 rounded-md">
            <h2 className="text-xl animate-bounce font-semibold">
              !! Assign Lead !!
            </h2>
           
          </div>
          Network Error: Unable to fetch lead details. Please try again later.
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-gray-50 flex-col justify-center items-center p-4">
        <PageHeader title="Assign Lead"/>

        <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Concern Person Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concern Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("concernPersonName")}
                    readOnly={!isEditable}
                    placeholder="Enter Concern Person Name"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.concernPersonName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.concernPersonName.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    readOnly={!isEditable}
                    placeholder="Enter 10-digit Phone Number"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Alternate Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate / Whatsapp Number
                  </label>
                  <input
                    type="text"
                    {...register("altPhone")}
                    readOnly={!isEditable}
                    placeholder="Enter alternate Phone Number"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.altPhone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.altPhone.message}
                    </p>
                  )}
                </div>

                {/* Lead Label */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Label <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("leadLabel")}
                    disabled={!isEditable}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 text-gray-900 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    <option value="">Select Lead Label</option>
                    <option value="UNTOUCHED">UNTOUCHED</option>
                    <option value="COLD">COLD</option>
                    <option value="WARM">WARM</option>
                    <option value="HOT">HOT</option>
                  </select>
                  {errors.leadLabel && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.leadLabel.message}
                    </p>
                  )}
                </div>

                {/* Pincode */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    {...register("pincode")}
                    readOnly={!isEditable}
                    placeholder="Enter 6-digit Pincode"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.pincode.message}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    disabled={!isEditable}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 text-gray-900 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    rows={1}
                    {...register("address")}
                    readOnly={!isEditable}
                    placeholder="Enter Complete Address"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Requirement */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirement
                  </label>
                  <textarea
                    rows={1}
                    {...register("requirement")}
                    readOnly={!isEditable}
                    placeholder="Enter Complete Requirement"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                  {errors.requirement && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.requirement.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Executive{" "}
                  </label>
                  <select
                    {...register("saleEmployeeId")}
                    disabled={loadingSalesEmployees}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 text-gray-900 bg-white"
                  >
                    <option value="">
                      {loadingSalesEmployees
                        ? "Loading employees..."
                        : "Select Sales Employee"}
                    </option>
                    {!loadingSalesEmployees && salesEmployees?.length === 0 && (
                      <option disabled>
                        Employee Not Found for selected Zone
                      </option>
                    )}
                    {salesEmployees?.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} ({employee.type})
                      </option>
                    ))}
                  </select>
                  {errors.saleEmployeeId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.saleEmployeeId.message}
                    </p>
                  )}
                </div>
              </div>

                
                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bussiness Assosiates{" "}
                  </label>
                  <select
                    {...register("saleEmployeeId")}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 text-gray-900 bg-gray-200"
                  >
                    <option value="">
                      {loadingSalesEmployees
                        ? "Loading employees..."
                        : "Select Sales Employee"}
                    </option>
                    {!loadingSalesEmployees && salesEmployees?.length === 0 && (
                      <option disabled>
                        Employee Not Found for selected Zone
                      </option>
                    )}
                    {salesEmployees?.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} ({employee.empId})
                      </option>
                    ))}
                  </select>
                  {errors.saleEmployeeId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.saleEmployeeId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Sales Freelancer{" "}
                   
                  </label>
                  <select
                    {...register("saleEmployeeId")}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 text-gray-900 bg-gray-200"
                  >
                    <option value="">
                      {loadingSalesEmployees
                        ? "Loading employees..."
                        : "Select Sales Employee"}
                    </option>
                    {!loadingSalesEmployees && salesEmployees?.length === 0 && (
                      <option disabled>
                        Employee Not Found for selected Zone
                      </option>
                    )}
                    {salesEmployees?.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} ({employee.empId})
                      </option>
                    ))}
                  </select>
                  {errors.saleEmployeeId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.saleEmployeeId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Sales Contractor{" "}
                  </label>
                  <select
                    {...register("saleEmployeeId")}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 text-gray-900 bg-gray-200"
                  >
                    <option value="">
                      {loadingSalesEmployees
                        ? "Loading employees..."
                        : "Select Sales Employee"}
                    </option>
                    {!loadingSalesEmployees && salesEmployees?.length === 0 && (
                      <option disabled>
                        Employee Not Found for selected Zone
                      </option>
                    )}
                    {salesEmployees?.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} ({employee.empId})
                      </option>
                    ))}
                  </select>
                  {errors.saleEmployeeId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.saleEmployeeId.message}
                    </p>
                  )}
                </div> */}
             

              {/* Submit Button */}
              <div className="mt-4 flex justify-end text-[14px]">
                <button
                  type="submit"
                  disabled={assignLoading}
                  className={`px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg ${
                    assignLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  {assignLoading ? "Assigning..." : "Assign Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadAssignPage;
