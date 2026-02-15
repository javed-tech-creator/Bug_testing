// components/EmployeeOnboarding/steps/StepPersonalInfo.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useCreateEmployeeMutation,
  useEmplyeeUpdateMutationMutation,
  useGetEmployeeByIdQuery,
  useGetHiredCandidateQuery,
} from "@/api/hr/employee.api";
import Loader from "@/components/Loader";
import { Camera, Eye, X } from "lucide-react";

// ✅ Validation Schema
const schema = yup.object().shape({
  candidateId: yup.string().nullable(),
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  workEmail: yup.string().email("Invalid work email").nullable(),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  alternateNo: yup
    .string()
    .nullable()
    .test("altPhone", "Enter a valid 10-digit number", (value) => {
      if (!value) return true;
      return /^[6-9]\d{9}$/.test(value);
    }),
  whatsapp: yup
    .string()
    .nullable()
    .test("whatsapp", "Enter a valid 10-digit number", (value) => {
      if (!value) return true;
      return /^[6-9]\d{9}$/.test(value);
    }),
  dob: yup
    .date()
    .typeError("Invalid date")
    .nullable()
    .max(new Date(), "DOB cannot be in the future"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender")
    .required("Gender is required"),
  qualification: yup.string().nullable(),
  maritalStatus: yup
    .string()
    .oneOf(["Single", "Married", "Divorced", "Widowed"])
    .nullable(),
  bloodGroup: yup.string().nullable(),
  joiningDate: yup
    .date()
    .typeError("Invalid date")
    .required("Joining date is required"),
  employeeType: yup
    .string()
    .oneOf(["Full-time", "Part-time", "Contract", "Intern"])
    .required("Employee type is required"),
  workLocation: yup
    .string()
    .oneOf(["Onsite", "Remote", "Hybrid"])
    .required("Work location is required"),
});

const StepPersonalInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const photoInputRef = useRef(null);
  const { data, isLoading: candidateLoading } = useGetHiredCandidateQuery();
  const candidates = data?.data;
  const [createEmployee, { isLoading: createLoading }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updateLoading }] =
    useEmplyeeUpdateMutationMutation();
  const {
    data: employeeData,
    isLoading: employeeDataLoading,
    refetch,
  } = useGetEmployeeByIdQuery({ id }, { skip: !id });
  const employee = employeeData?.data;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const handlePhotoChange = (file) => {
    setPhotoFile(file);
  };

  useEffect(() => {
    if (employee && !employeeDataLoading) {
      const formData = {
        candidateId: employee.candidateId?._id || "",
        name: employee.name || "",
        email: employee.email || "",
        workEmail: employee.workEmail || "",
        phone: employee.phone || "",
        alternateNo: employee.alternateNo || "",
        whatsapp: employee.whatsapp || "",
        dob: employee.dob ? employee.dob.slice(0, 10) : null,
        gender: employee.gender || "",
        qualification: employee.qualification || "",
        maritalStatus: employee.maritalStatus || "",
        bloodGroup: employee.bloodGroup || "",
        joiningDate: employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split("T")[0]
          : "",
        employeeType: employee.employeeType || "",
        workLocation: employee.workLocation || "",
      };

      reset(formData);
    }
  }, [employee, employeeDataLoading, reset]);
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString() : null,
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate).toISOString()
          : null,
      };
      const formData = new FormData();

      // Existing form fields
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // Photo file
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      if (id) {
        const result = await updateEmployee({ id, formData }).unwrap();
        toast.success("Employee updated successfully!");
        navigate(`/hr/employee/onboarding/${result?.data?._id}?step=2`);
        refetch();
      } else {
        const result = await createEmployee({ formData: payload }).unwrap();
        toast.success("Employee created successfully!");
        navigate(`/hr/employee/onboarding/${result?.data?._id}?step=2`);
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
      toast.error("Failed to save employee");
    }
  };

  if (employeeDataLoading) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* <h2 className="text-xl font-semibold mb-4">Personal Information</h2> */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Candidate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Hired Candidate
            </label>
            <select
              {...register("candidateId")}
              disabled={employee?.candidateId}
              className={`w-full px-3 py-1.5 border rounded-sm ${
                employee?.candidateId ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select Candidate</option>
              {!candidateLoading &&
                candidates?.map((c) => (
                  <option
                    key={c._id}
                    value={employee?.candidateId?._id || c._id}
                  >
                    {employee?.candidateId?.name || c.name} (
                    {employee?.candidateId?.email || c.email})
                  </option>
                ))}
            </select>
            {errors.candidateId && (
              <p className="text-red-500 text-sm">
                {errors.candidateId.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Full Name"
              className="w-full px-3 py-1.5 border rounded-sm"
              maxLength={50}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@email.com"
              className="w-full px-3 py-1.5 border rounded-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              {...register("workEmail")}
              placeholder="work@example.com"
              className="w-full px-3 py-1.5 border rounded-sm"
            />
            {errors.workEmail && (
              <p className="text-red-500 text-sm">{errors.workEmail.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("phone")}
              placeholder="10-Digit Phone"
              className="w-full px-3 py-1.5 border rounded-sm"
              maxLength={10}
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Alternate No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternate No
            </label>
            <input
              type="text"
              placeholder="10-Digit Alternate No"
              {...register("alternateNo")}
              className="w-full px-3 py-1.5 border rounded-sm"
              maxLength={10}
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
            {errors.alternateNo && (
              <p className="text-red-500 text-sm">
                {errors.alternateNo.message}
              </p>
            )}
          </div>

          {/* Whatsapp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              placeholder="Whatsapp Number"
              {...register("whatsapp")}
              className="w-full px-3 py-1.5 border rounded-sm"
              maxLength={10}
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              title="Future dates are blocked"
              onChange={(e) => {
                const value = e.target.value;
                const today = new Date().toISOString().split("T")[0];
                if (value > today) {
                  toast.error("You cannot select a future DOB");
                  e.target.value = today;
                }
              }}
              {...register("dob")}
              className="w-full px-3 py-1.5 border rounded-sm"
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register("gender")}
              className="w-full px-3 py-1.5 border rounded-sm"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              placeholder="Enter Qualification"
              {...register("qualification")}
              className="w-full px-3 py-1.5 border rounded-sm"
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status
            </label>
            <select
              {...register("maritalStatus")}
              className="w-full px-3 py-1.5 border rounded-sm"
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              {...register("bloodGroup")}
              className="w-full px-3 py-1.5 border rounded-sm"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Joining Date */}

          <div className="col-span-3 grid grid-cols-4 items-end gap-4 justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("joiningDate")}
                className="w-full px-3 py-1.5 border rounded-sm"
              />
              {errors.joiningDate && (
                <p className="text-red-500 text-sm">
                  {errors.joiningDate.message}
                </p>
              )}
            </div>
            {/* Employee Type */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("employeeType")}
                className="w-auto px-3 py-1.5 border rounded-sm"
              >
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            {/* Work Location */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Location <span className="text-red-500">*</span>
              </label>
              <select
                {...register("workLocation")}
                className="w-auto px-3 py-1.5 border rounded-sm"
              >
                <option value="">Select</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Employee Photo */}
            <div className=" flex justify-between items-start border px-4 py-1.5 rounded-sm gap-2">
              <label className="text-sm font-medium text-gray-700">Photo</label>

              {/* Photo Container */}
              <div className="relative group">
                {/* Photo Circle */}
                {(photoFile || employee?.photo?.public_url) && (
                  <div className="relative w-15 h-15 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    {photoFile ? (
                      <img
                        src={URL.createObjectURL(photoFile)}
                        alt="Employee Photo"
                        className="w-full h-full object-cover"
                      />
                    ) : employee?.photo?.public_url ? (
                      <img
                        src={employee.photo.public_url}
                        alt="Employee Photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400" />
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Remove button */}
                {(photoFile || employee?.photo?.public_url) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoFile(null);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col gap-1`}>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="text-xs px-3  py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  {photoFile || employee?.photo?.public_url
                    ? "Change"
                    : "Upload"}
                </button>

                {(photoFile || employee?.photo?.public_url) && (
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        photoFile
                          ? URL.createObjectURL(photoFile)
                          : employee.photo.public_url,
                        "_blank"
                      )
                    }
                    className="text-xs px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Validate file size (2MB max)
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error("Photo size should not exceed 2MB");
                      return;
                    }
                    setPhotoFile(file);
                  }
                }}
              />
            </div>
          </div>
        </form>

        {/* Submit */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={createLoading || updateLoading}
            className="px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-black/70 cursor-pointer"
          >
            {id
              ? updateLoading
                ? "Updating..."
                : "Update Employee"
              : createLoading
              ? "Creating..."
              : "Create Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepPersonalInfo;
