// import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";
import { User, Home, Building, Award, FileText, BookOpen, ShieldCheck } from "lucide-react";

import { useGetEmployeeByIdQuery, useGetTrainingByEmployeeQuery, useCreateUserMutation } from "@/api/hr/employee.api";

import Loader from "@/components/Loader";
 
// ✅ User creation validation
// const schema = yup.object().shape({
//   username: yup.string().required("Username is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//   role: yup.string().required("Role is required"),
//   status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
// });

const EmployeeProfileReview = ({ goBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
 
 

  const { data: employeeData, isLoading } = useGetEmployeeByIdQuery({ id }, { skip: !id });
  const { data: traning } = useGetTrainingByEmployeeQuery({ id }, { skip: !id });
  const employee = employeeData?.data;
 

console.log(employee,"knj");



  // const [createUser, { isLoading: userLoading }] = useCreateUserMutation();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm({
  //   resolver: yupResolver(schema),
  // });

  // useEffect(() => {
  //   if (employee) {
  //     reset({
  //       username: employee.email || "",
  //       email: employee.email || "",
  //       role: "",
  //       status: "Active",
  //     });
  //   }
  // }, [employee, reset]);

  // const onSubmit = async (data) => {
  //   try {
  //     await createUser({ employeeId: id, ...data }).unwrap();
  //     toast.success("User account created successfully!");
  //     navigate("/hr/employee/list"); // redirect to employee list
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to create user");
  //   }
  // };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white p-4 space-y-4">
      {/* Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6 mr-2 text-orange-600" />
            Personal Information
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <span className="text-sm text-gray-900">{employee.name}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <span className="text-sm text-gray-900">{employee.email}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <span className="text-sm text-gray-900">{employee.phone}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Gender</span>
              <span className="text-sm text-gray-900">{employee.gender}</span>
            </div>
          </div>
          <button
            className="mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80 flex"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=1`)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Details
          </button>
        </div>

        {/* Address Details */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Home className="w-6 h-6 mr-2 text-orange-600" />
            Address Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Current</span>
              <span className="text-sm text-gray-900">
                {employee.currentAddress}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Permanent
              </span>
              <span className="text-sm text-gray-900">
                {employee.permanentAddress}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">City</span>
              <span className="text-sm text-gray-900">
                {employee?.cityId?.title}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">State</span>
              <span className="text-sm text-gray-900">
                {employee.stateId.title}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Country</span>
              <span className="text-sm text-gray-900">{employee.country}</span>
            </div>
          </div>
          <button
            className="flex items-center gap-1 mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=2`)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Details
          </button>
        </div>

        {/* Payroll Details */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Building className="w-6 h-6 mr-2 text-orange-600" />
            Payroll Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Allowances
              </span>
              <span className="text-sm text-gray-900">
                {employee?.salary?.allowances}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">CTC</span>
              <span className="text-sm text-gray-900">
                {employee?.salary?.ctc} LPA
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                basic Salary
              </span>
              <span className="text-sm text-gray-900">
                {employee?.salary?.basic}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Deductions
              </span>
              <span className="text-sm text-gray-900">
                {employee?.salary?.deductions}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">HRA</span>
              <span className="text-sm text-gray-900">
                {employee?.salary?.hra}
              </span>
            </div>
          </div>
          <button
            className="flex items-center gap-1 mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=3`)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Details
          </button>
        </div>

        {/* Banking Details */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Award className="w-6 h-6 mr-2 text-orange-600" />
            Banking Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Holder Name
              </span>
              <span className="text-sm text-gray-900">
                {employee.bankDetail?.accountHolderName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Bank Name
              </span>
              <span className="text-sm text-gray-900">
                {employee.bankDetail?.bankName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Branck Name
              </span>
              <span className="text-sm text-gray-900">
                {employee.bankDetail?.branchName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Account Number
              </span>
              <span className="text-sm text-gray-900">
                {employee.bankDetail?.accountNumber}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Account No.
              </span>
              <span className="text-sm text-gray-900">
                {employee.bankDetail?.ifscCode}
              </span>
            </div>
          </div>
          <button
            className="flex items-center gap-1 mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=4`)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Details
          </button>
        </div>

        {/* Documents */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 mr-2 text-orange-600" />
            Documents
          </h2>
          {employee.documents && employee.documents.length > 0 ? (
            <div className="space-y-2">
              {employee.documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between border-b pb-1"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {doc.type}
                  </span>
                  <a
                    href={doc.public_url || doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-colors duration-200">
                      View
                    </span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No documents uploaded.</p>
          )}
          <button
            className="flex items-center gap-1 mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=5`)}
          >
            Edit Details
          </button>
        </div>

        {/* Training Details */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 mr-2 text-orange-600" />
            Training Details
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Training Name
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.trainingName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Start Date
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.trainingStartDate
                  ? new Date(
                      traning?.data?.trainingStartDate
                    ).toLocaleDateString("en-GB")
                  : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                End Date
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.trainingStartDate
                  ? new Date(traning?.data?.trainingEndDate).toLocaleDateString(
                      "en-GB"
                    )
                  : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Training Period
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.trainingPeriod}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Traning type
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.trainingType}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Mentor Name
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.mentorName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Completion Status
              </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.completionStatus}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">Remark </span>
              <span className="text-sm text-gray-900">
                {traning?.data?.remark}
              </span>
            </div>
            <div className="flex items-center py-1 gap-2">
              <span className="text-sm font-medium text-gray-700">
                Training Material
              </span>
              {traning?.data?.materials.map((material, index) => (
                <div key={index}>
                  <a
                    href={material?.public_url || material?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-colors duration-200"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-200"></div>
          </div>
          <button
            className="flex items-center gap-1 mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=6`)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Details
          </button>
        </div>

        {/* Zone */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 mr-2 text-orange-600" />
            Zone
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Zone Name
              </span>
              <span className="text-sm text-gray-900">
                {employee?.zoneId?.title}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                State Name
              </span>
              <span className="text-sm text-gray-900">
                {employee?.stateId?.title}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                City Name
              </span>
              <span className="text-sm text-gray-900">
                {employee?.cityId?.title}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Branch Name
              </span>
              <span className="text-sm text-gray-900">
                {employee?.branchId?.title}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Department Name
              </span>
              <span className="text-sm text-gray-900">
                {employee?.departmentId?.title}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-gray-700">
                Designation Name
              </span>
              <span className="text-sm text-gray-900">
                {employee?.designationId?.title}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
          </div>
          <button
            className="flex items-center gap-1 mt-3 px-3 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
            onClick={() => navigate(`/hr/employee/onboarding/${id}?step=6`)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileReview;
