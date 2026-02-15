import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
  useGetDepartmentByBranchQuery,
  useGetDesignationsByDepIdQuery,
 
} from "@/api/hr/employment.api";

import { useEmplyeeUpdateMutationMutation,
  useGetEmployeeByIdQuery} from '@/api/hr/employee.api'
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";

const schema = yup.object().shape({
  zone: yup.string().required("Zone is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  branch: yup.string().required("Branch is required"),
  department: yup.string().required("Department is required"),
  designation: yup.string().required("Designation is required"),
});

const StepEmployment = ({ goNext, goBack }) => {
  const { id } = useParams();
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

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
  });

  const formValues = watch();

  const { data: employeeData, isLoading: employeeLoading, refetch } = useGetEmployeeByIdQuery({ id }, { 
    skip: !id 
  });

  const [updateEmployee, { isLoading: updateLoading }] = useEmplyeeUpdateMutationMutation();

  // Ensure we're passing string IDs to API queries
  const { data: zonesData, isLoading: zonesLoading } = useGetZonesQuery();
  const { data: statesData, isLoading: statesLoading } = useGetStatesByZoneQuery(
    typeof selectedZone === 'string' ? selectedZone : '', 
    { skip: !selectedZone }
  );
  const { data: citiesData, isLoading: citiesLoading } = useGetCitiesByStateQuery(
    typeof selectedState === 'string' ? selectedState : '', 
    { skip: !selectedState }
  );
  const { data: branchesData, isLoading: branchesLoading } = useGetBranchesByCityQuery(
    typeof selectedCity === 'string' ? selectedCity : '', 
    { skip: !selectedCity }
  );
  const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartmentByBranchQuery(
    typeof selectedBranch === 'string' ? selectedBranch : '', 
    { skip: !selectedBranch }
  );
  const { data: designationsData, isLoading: designationsLoading } = useGetDesignationsByDepIdQuery(
    typeof selectedDepartment === 'string' ? selectedDepartment : '', 
    { skip: !selectedDepartment }
  );

  // Debug selected values
  useEffect(() => {
    console.log("=== SELECTED VALUES DEBUG ===");
    console.log("selectedZone:", selectedZone, "Type:", typeof selectedZone);
    console.log("selectedState:", selectedState, "Type:", typeof selectedState);
    console.log("selectedCity:", selectedCity, "Type:", typeof selectedCity);
    console.log("selectedBranch:", selectedBranch, "Type:", typeof selectedBranch);
    console.log("selectedDepartment:", selectedDepartment, "Type:", typeof selectedDepartment);
    console.log("=================================");
  }, [selectedZone, selectedState, selectedCity, selectedBranch, selectedDepartment]);

  // Main pre-fill effect
  useEffect(() => {
    if (employeeData?.data && !employeeLoading) {
      const employee = employeeData.data;
      
      console.log("=== EMPLOYEE DATA FOR PRE-FILL ===");
      console.log("Employee state:", employee.stateId);
      console.log("Employee city:", employee.cityId);
      console.log("Employee zoneId:", employee.zoneId);
      console.log("Employee branchId:", employee.branchId);
      console.log("Employee departmentId:", employee.departmentId);
      console.log("Employee designationId:", employee.designationId);
      console.log("===================================");

      // Extract IDs safely - ensure we get strings, not objects
      const getSafeId = (value) => {
        if (!value) return "";
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value._id) return value._id;
        return String(value); // Fallback to string conversion
      };

      const stateId = getSafeId(employee.stateId);
      const cityId = getSafeId(employee.cityId);
      const zoneId = getSafeId(employee.zoneId);
      const branchId = getSafeId(employee.branchId);
      const departmentId = getSafeId(employee.departmentId);
      const designationId = getSafeId(employee.designationId);

      const formData = {
        state: stateId,
        city: cityId,
        zone: zoneId,
        branch: branchId,
        department: departmentId,
        designation: designationId,
      };

      console.log("Final form data to set:", formData);
      reset(formData);

       
      if (stateId) {
        setSelectedState(String(stateId));
        console.log(" State set to:", String(stateId));
      }
      if (cityId) {
        setSelectedCity(String(cityId));
        console.log(" City set to:", String(cityId));
      }
      if (zoneId) {
        setSelectedZone(String(zoneId));
        console.log(" Zone set to:", String(zoneId));
      }
      if (branchId) {
        setSelectedBranch(String(branchId));
        console.log(" Branch set to:", String(branchId));
      }
      if (departmentId) {
        setSelectedDepartment(String(departmentId));
        console.log(" Department set to:", String(departmentId));
      }
    }
  }, [employeeData, employeeLoading, reset]);

  // Handle zone change
  const handleZoneChange = (e) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    setValue("zone", zoneId);
    
    setValue("state", "");
    setValue("city", "");
    setValue("branch", "");
    setValue("department", "");
    setValue("designation", "");
    setSelectedState("");
    setSelectedCity("");
    setSelectedBranch("");
    setSelectedDepartment("");
  };

  // Handle state change
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setValue("state", stateId);
    
    setValue("city", "");
    setValue("branch", "");
    setValue("department", "");
    setValue("designation", "");
    setSelectedCity("");
    setSelectedBranch("");
    setSelectedDepartment("");
  };

  // Handle city change
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setValue("city", cityId);
    
    setValue("branch", "");
    setValue("department", "");
    setValue("designation", "");
    setSelectedBranch("");
    setSelectedDepartment("");
  };

  // Handle branch change
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    setValue("branch", branchId);
    
    setValue("department", "");
    setValue("designation", "");
    setSelectedDepartment("");
  };

  // Handle department change
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setValue("department", departmentId);
    
    setValue("designation", "");
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        zoneId: data.zone,
        stateId: data.state,
        cityId: data.city,
        branchId: data.branch,
        departmentId: data.department,
        designationId: data.designation,
      };

      console.log("Sending payload:", payload);

      const response = await updateEmployee({ 
        id, 
        formData: payload 
      }).unwrap();

      console.log("Update response:", response);

      await refetch();
      toast.success("Employment details updated successfully!");
      goNext();
    } catch (err) {
      console.error("Error updating employment details:", err);
      console.error("Error details:", err.data);
      toast.error("Failed to update employment details");
    }
  };

  if (employeeLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone <span className="text-red-500">*</span>
          </label>
          <select
            {...register("zone")}
            onChange={handleZoneChange}
            value={formValues.zone || ""}
            className="w-full px-3 py-1.5 border rounded-sm"
          >
            <option value="">Select Zone</option>
            {zonesData?.data?.map((zone) => (
              <option key={zone._id} value={zone._id}>
                {zone.title}
              </option>
            ))}
          </select>
          {errors.zone && (
            <p className="text-red-500 text-sm">{errors.zone.message}</p>
          )}
          {zonesLoading && (
            <p className="text-gray-500 text-sm">Loading zones...</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            {...register("state")}
            onChange={handleStateChange}
            value={formValues.state || ""}
            disabled={!selectedZone}
            className="w-full px-3 py-1.5 border rounded-sm disabled:bg-gray-100"
          >
            <option value="">Select State</option>
            {statesData?.data?.map((state) => (
              <option key={state._id} value={state._id}>
                {state.title}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
          {statesLoading && (
            <p className="text-gray-500 text-sm">Loading states...</p>
          )}
          {!selectedZone && (
            <p className="text-gray-500 text-sm">Select zone first</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            {...register("city")}
            onChange={handleCityChange}
            value={formValues.city || ""}
            disabled={!selectedState}
            className="w-full px-3 py-1.5 border rounded-sm disabled:bg-gray-100"
          >
            <option value="">Select City</option>
            {citiesData?.data?.map((city) => (
              <option key={city._id} value={city._id}>
                {city.title}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
          {citiesLoading && (
            <p className="text-gray-500 text-sm">Loading cities...</p>
          )}
          {!selectedState && (
            <p className="text-gray-500 text-sm">Select state first</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            {...register("branch")}
            onChange={handleBranchChange}
            value={formValues.branch || ""}
            disabled={!selectedCity}
            className="w-full px-3 py-1.5 border rounded-sm disabled:bg-gray-100"
          >
            <option value="">Select Branch</option>
            {branchesData?.data?.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.title}
              </option>
            ))}
          </select>
          {errors.branch && (
            <p className="text-red-500 text-sm">{errors.branch.message}</p>
          )}
          {branchesLoading && (
            <p className="text-gray-500 text-sm">Loading branches...</p>
          )}
          {!selectedCity && (
            <p className="text-gray-500 text-sm">Select city first</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            {...register("department")}
            onChange={handleDepartmentChange}
            value={formValues.department || ""}
            disabled={!selectedBranch}
            className="w-full px-3 py-1.5 border rounded-sm disabled:bg-gray-100"
          >
            <option value="">Select Department</option>
            {departmentsData?.data?.map((department) => (
              <option key={department._id} value={department._id}>
                {department.title}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm">{errors.department.message}</p>
          )}
          {departmentsLoading && (
            <p className="text-gray-500 text-sm">Loading departments...</p>
          )}
          {!selectedBranch && (
            <p className="text-gray-500 text-sm">Select branch first</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation <span className="text-red-500">*</span>
          </label>
          <select
            {...register("designation")}
            value={formValues.designation || ""}
            disabled={!selectedDepartment}
            className="w-full px-3 py-1.5 border rounded-sm disabled:bg-gray-100"
          >
            <option value="">Select Designation</option>
            {designationsData?.data?.map((designation) => (
              <option key={designation._id} value={designation._id}>
                {designation.title}
              </option>
            ))}
          </select>
          {errors.designation && (
            <p className="text-red-500 text-sm">{errors.designation.message}</p>
          )}
          {designationsLoading && (
            <p className="text-gray-500 text-sm">Loading designations...</p>
          )}
          {!selectedDepartment && (
            <p className="text-gray-500 text-sm">Select department first</p>
          )}
        </div>

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
            disabled={updateLoading}
            className="px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-black/70 cursor-pointer"
          >
            {updateLoading ? "Saving..." : "Save & Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepEmployment;