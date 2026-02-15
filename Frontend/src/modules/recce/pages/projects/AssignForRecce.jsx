import React, { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useAssignLeadMutation,
  useFetchLeadByIdQuery,
  useGetEmployeeByZoneMutation,
} from "../../../../api/sales/lead.api";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { useAuth } from "../../../../store/AuthContext";

const schema = yup.object().shape({
  concernPersonName: yup.string().required("Cuncern person name is required"),
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
  pinCode: yup
    .string()
    .test("pinCode", "Enter a valid 6-digit pincode", (value) => {
      if (!value) return true;
      return /^\d{6}$/.test(value);
    })
    .nullable(),
  leadType: yup.string().required("Lead type is required"),
  city: yup.string().required("City is required"),
  zone: yup.string().required("Zone is required"),
  requirement: yup.string().required("Requirement is required"),
  saleEmployeeId: yup.string().required("Sales employee is required"),
});

const cityZoneData = {
  Lucknow: ["Lucknow", "Thakurganj"],
  Barabanki: ["Barabanki"],
  Azamgarh: ["Azamgarh"],
  // Chennai: ["Zone 1", "Zone 2", "Zone 3"],
  // Pune: ["Pune Zone A", "Pune Zone B"],
};

const AssignForRecce = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [salesEmployees, setSalesEmployees] = useState([]);
  const [loadingSalesEmployees, setLoadingSalesEmployees] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useFetchLeadByIdQuery({ id });
  const leadData = data?.data?.result;
  console.log("leadData", leadData);

  const [getSalesEmployees] = useGetEmployeeByZoneMutation();
  const [assignLead, { isLoading: assignLoading, error: assignError }] =
    useAssignLeadMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      concernPersonName: leadData?.concernPersonName || "",
      phone: leadData?.phone || "",
      altPhone: leadData?.altPhone || "",
      address: leadData?.address || "",
      pincode: leadData?.pincode || "",
      leadType: leadData?.leadType || "",
      requirement: leadData?.requirement || "",
      city: "",
      cityForZone: "",
      zone: "",
      saleEmployeeId: "",
      saleEmployeeId2: "",
    },
  });

  useEffect(() => {
    if (leadData) {
      reset({
        concernPersonName: leadData.concernPersonName || "",
        phone: leadData.phone || "",
        altPhone: leadData.altPhone || "",
        address: leadData.address || "",
        pincode: leadData.pincode || "",
        leadType: leadData.leadType || "",
        city: leadData.city || "",
        cityForZone: "",
        requirement: leadData.requirement || "",
        zone: leadData.zone || "",
      });
    }
  }, [leadData, reset]);

  // Watch city and zone changes
  const watchedCity = watch("cityForZone");
  const watchedZone = watch("zone");

  useEffect(() => {
    if (watchedZone && watchedZone) {
      setValue("saleEmployeeId", "");
      fetchSalesEmployees(watchedCity, watchedZone);
    }
  }, [watchedZone, watchedCity, setValue]);

  const fetchSalesEmployees = async (city, zone) => {
    setLoadingSalesEmployees(true);
    try {
      const response = await getSalesEmployees({ city, zone }).unwrap();
      const SalesEmployees = response?.data?.result;
      console.log(salesEmployees);
      setSalesEmployees(SalesEmployees);
    } catch (error) {
      console.error("Error fetching sales employees:", error);
      toast.error("Failed to fetch sales employees");
      setSalesEmployees([]);
    } finally {
      setLoadingSalesEmployees(false);
    }
  };
const {userData} = useAuth()
  const onSubmit = async (data) => {
    try {
      // Lead status ke basis pe employee ID decide karna
      let finalData = {
        leadId: leadData._id,
        salesTLId: userData?.id,
        ...data,
      };

      if (leadData?.leadStatus === "Pending") {
        finalData.saleEmployeeId = data.saleEmployeeId;
        finalData.saleEmployeeId2 = "";
      } else if (leadData?.leadStatus === "In Progress") {
        finalData.saleEmployeeId = "";
        finalData.saleEmployeeId2 = data.saleEmployeeId;
      }
      console.log("formData", finalData);
      const res = await assignLead({ id, formData: finalData }).unwrap();
      toast.success("Lead assigned successfully!");
      refetch();
      setTimeout(() => {
        navigate(`/sales/leads/view`);
      }, 500);
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error(
        `${error?.message || "Failed to assign lead. Please try again."}`
      );
    }
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };
  // if (isLoading)
  //   return (
  //     <div className="p-8 text-center">
  //       <Loader />
  //     </div>
  //   );
  // if (error)
  //   return (
  //     <div className="p-8 text-center text-red-500">
  //       Error loading lead data.
  //     </div>
  //   );

  return (
    <div className="">
      <div className=" bg-gray-50 flex-col justify-center items-center p-4">
        <div className="w-full mb-6 border-l-4 border-black rounded-lg shadow-md bg-white p-3 hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between bg-gray-50 px-4 p-1 border border-gray-200 rounded-md">
            <h2 className="text-xl animate-bounce  font-semibold">
              !! Assign Recce !!
            </h2>
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-3 cursor-pointer py-1 text-sm bg-black text-white rounded hover:bg-black/80 transition-colors"
            >
              {isEditable ? "Lock" : "Edit"}
            </button>
          </div>
        </div>

        <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4        ">
          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Contact Person */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concern Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("concernPersonName")}
                    readOnly={!isEditable}
                    placeholder="Enter Concern Person Name"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
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
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
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
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
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
                {/* Lead Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("leadType")}
                    disabled={!isEditable}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 text-gray-900 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    <option value="">Select Lead Type</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Repeat">Repeat</option>
                  </select>
                  {errors.leadType && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.leadType.message}
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
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
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
                {/* city */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    disabled={!isEditable}
                    {...register("city")}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 text-gray-900 ${
                      !isEditable
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  ></input>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.city.message}
                    </p>
                  )}
                </div>
                {/* Address */}
                <div className="space-y-2 ">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    cols={1}
                    {...register("address")}
                    readOnly={!isEditable}
                    placeholder="Enter Complete Address"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
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

                {/* Lead Requirement - Full Width */}
                <div className=" space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirement
                  </label>
                  <textarea
                    cols={1}
                    {...register("requirement")}
                    readOnly={!isEditable}
                    placeholder="Enter Complete Requirement"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
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
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select City for Employee{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 text-gray-900 bg-white"
                    {...register("cityForZone")}
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {Object.keys(cityZoneData).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("zone")}
                    disabled={!watchedCity}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200  text-gray-900 bg-white`}
                  >
                    <option value="" selected disabled>
                      Select Zone
                    </option>
                    {watchedCity &&
                      cityZoneData[watchedCity]?.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                  </select>
                  {errors.zone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.zone.message}
                    </p>
                  )}
                </div>

                {/* Sales Employee */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Sales Employee{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("saleEmployeeId")}
                    disabled={!watchedZone || loadingSalesEmployees}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 text-gray-900 bg-white`}
                  >
                    <option value="" selected disabled>
                      {loadingSalesEmployees
                        ? "Loading employees..."
                        : "Select Sales Employee"}
                    </option>
                    {!loadingSalesEmployees && salesEmployees.length === 0 && (
                      <option disabled>
                        Employee Not Found for selected Zone
                      </option>
                    )}
                    {salesEmployees.map((employee) => (
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
              </div>

              {/* Submit Button */}
              <div className="mt-4 flex justify-end text-[14px]">
                <button
                  type="submit"
                  disabled={assignLoading}
                  className={` ${
                    assignLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer`}
                >
                  {assignLoading ? "Assigning.." : "Assign Recce"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignForRecce;
