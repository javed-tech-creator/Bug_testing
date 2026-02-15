import PageHeader from "@/components/PageHeader";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Recommendation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id && id !== "new";

  const departments = ["Design", "Development", "Marketing", "HR"];
  const employeesData = [
    {
      id: 1,
      name: "Rahul Verma",
      dept: "Design",
      designation: "Graphic Designer",
    },
    {
      id: 2,
      name: "Amit Sharma",
      dept: "Development",
      designation: "Frontend Developer",
    },
    {
      id: 3,
      name: "Sneha Gupta",
      dept: "Marketing",
      designation: "SEO Specialist",
    },
    { id: 4, name: "Vikram Singh", dept: "HR", designation: "HR Manager" },
    {
      id: 5,
      name: "Priya Das",
      dept: "Development",
      designation: "Backend Developer",
    },
  ];

  const [formData, setFormData] = useState({
    department: "",
    employeeName: "",
    designation: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  // Lock body scroll and constrain page height (guaranteed scroll fix)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const existing =
        JSON.parse(localStorage.getItem("givenRecommendations")) || [];
      const recommendation = existing.find((rec) => rec.id === parseInt(id));

      if (recommendation) {
        const deptName = recommendation.department.replace(" Department", "");
        setFormData({
          department: deptName,
          employeeName: recommendation.receiverName,
          designation: recommendation.receiverDesignation,
          message: recommendation.message,
        });
        setCharCount(recommendation.message.length);
      }
    }
  }, [id, isEditMode]);

  const handleDeptChange = (e) => {
    setFormData({
      department: e.target.value,
      employeeName: "",
      designation: "",
      message: formData.message,
    });
    setErrors({ ...errors, department: "" });
  };

  const handleEmpChange = (e) => {
    const emp = employeesData.find((emp) => emp.name === e.target.value);
    setFormData({
      ...formData,
      employeeName: e.target.value,
      designation: emp ? emp.designation : "",
    });
    setErrors({ ...errors, employeeName: "" });
  };

  const handleMessageChange = (e) => {
    const text = e.target.value;
    setFormData({ ...formData, message: text });
    setCharCount(text.length);
    setErrors({ ...errors, message: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.department)
      newErrors.department = "Please select a department";
    if (!formData.employeeName)
      newErrors.employeeName = "Please select an employee";
    if (!formData.message.trim())
      newErrors.message = "Please write a recommendation";
    if (formData.message.trim().length < 20)
      newErrors.message = "Recommendation should be at least 20 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const existing =
      JSON.parse(localStorage.getItem("givenRecommendations")) || [];

    if (isEditMode) {
      const updatedData = existing.map((rec) =>
        rec.id === parseInt(id)
          ? {
              ...rec,
              receiverName: formData.employeeName,
              receiverDesignation: formData.designation,
              department: `${formData.department} Department`,
              message: formData.message,
            }
          : rec,
      );

      localStorage.setItem("givenRecommendations", JSON.stringify(updatedData));
    } else {
      const newRecommendation = {
        id: Date.now(),
        receiverName: formData.employeeName,
        receiverDesignation: formData.designation,
        department: `${formData.department} Department`,
        message: formData.message,
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      localStorage.setItem(
        "givenRecommendations",
        JSON.stringify([...existing, newRecommendation]),
      );
    }

    navigate("/recce/recommendation");
  };

  const filteredEmployees = employeesData.filter(
    (emp) => emp.dept === formData.department,
  );

  const getDepartmentIcon = (dept) => {
    const icons = {
      Design: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      ),
      Development: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      ),
      Marketing: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      ),
      HR: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
    };
    return icons[dept] || icons.Design;
  };

  return (
    <div className="">
      <div className="">
        {/* Back Button */}

        {/* Header */}
        <PageHeader title="Recommendations" />

        {/* Form - 2 Column Layout */}
        <form onSubmit={handleSubmit} className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Department */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Department
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={handleDeptChange}
                    className={`w-full p-4 pl-12 border-2 rounded-xl bg-white appearance-none cursor-pointer transition-all duration-300 ${
                      errors.department
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {formData.department && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {getDepartmentIcon(formData.department)}
                      </svg>
                    </div>
                  )}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.department && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Employee */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Employee Name
                </label>
                <div className="relative">
                  <select
                    value={formData.employeeName}
                    onChange={handleEmpChange}
                    disabled={!formData.department}
                    className={`w-full p-4 pl-12 border-2 rounded-xl appearance-none cursor-pointer transition-all duration-300 ${
                      !formData.department
                        ? "bg-gray-50 cursor-not-allowed"
                        : "bg-white"
                    } ${
                      errors.employeeName
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                  >
                    <option value="">Select Employee</option>
                    {filteredEmployees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div
                      className={`w-5 h-5 rounded-full ${formData.employeeName ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gray-300"} flex items-center justify-center`}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.employeeName && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.employeeName}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Designation
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.designation}
                    readOnly
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                    placeholder="Auto-filled based on employee selection"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 overflow-hidden">
              {/* Message */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full flex flex-col">
                <label className="flex items-center justify-between text-gray-700 font-semibold text-sm mb-3">
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Recommendation Message
                  </span>
                  <span
                    className={`text-xs ${charCount < 20 ? "text-red-500" : charCount > 300 ? "text-orange-500" : "text-gray-400"}`}
                  >
                    {charCount} characters
                  </span>
                </label>
                <div className="relative flex-1">
                  <textarea
                    value={formData.message}
                    onChange={handleMessageChange}
                    className={`w-full h-64 p-4 border-2 rounded-xl resize-none transition-all duration-300 ${
                      errors.message
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                    placeholder="Write a thoughtful recommendation highlighting their skills, achievements, and professional qualities..."
                  />
                  {formData.message && (
                    <div className="absolute bottom-4 right-4">
                      <div
                        className={`w-2 h-2 rounded-full ${charCount >= 20 ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                      ></div>
                    </div>
                  )}
                </div>
                {errors.message && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.message}
                  </p>
                )}
                {!errors.message && charCount > 0 && charCount < 20 && (
                  <p className="text-orange-500 text-sm flex items-center gap-1 mt-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {20 - charCount} more characters needed
                  </p>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons - Full Width Below Both Columns */}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/recce/recommendation")}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group shadow-lg"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2 group"
            >
              {isEditMode ? (
                <>
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Update Recommendation
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Submit Recommendation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recommendation;
