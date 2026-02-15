import React, { useState, useEffect, useRef } from "react";
import InputField from "./InputField";
import { useCreateCustomerMutation } from "@/api/vendor/customer.api";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";


const inputGroups = {
  "Basic Details": [
    { label: "Name", key: "fullName", required: true },
    { label: "Phone", key: "phone", required: true, placeholder: "10-digit phone" },
    { label: "Email", key: "email", placeholder: "example@mail.com" },
  ],
  "Company Details (Optional)": [
    { label: "GSTIN", key: "gstin" },
    { label: "Company", key: "companyName" },
  ],
  "Billing Address": [
    { label: "Address Line 1", key: "addressLine1", required: true },
    { label: "Address Line 2", key: "addressLine2" },
    { label: "City", key: "city" },
    { label: "Pincode", key: "pincode" },
    { label: "State", key: "state", required: true },
    { label: "Country", key: "country", disabled: true },
  ],
};


const AddCustomerDrawer = ({ show, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const drawerRef = useRef();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gstin: "",
    companyName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
  });

  const [errors, setErrors] = useState({});

    const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        gstin: "",
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        pincode: "",
        state: "",
        country: "India",
      });
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && show) {
        handleClose();
      }
    };
    if (show) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [show]);

  const handleInputChange = (field, value) => {
    if ((field === "phone" || field === "pincode") && /\D/.test(value)) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (
      formData.email &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    )
      newErrors.email = "Enter a valid email";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // ✅ Validate before saving
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log("Customer data:", formData);

      const res = await createCustomer(formData).unwrap();
      toast.success("Customer created successfully!");

      // ✅ Reset form after success
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        gstin: "",
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        pincode: "",
        state: "",
        country: "India",
      });

      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create customer");
      
    }
  };

  if (!show) return null;

 return (
  <div
    className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ease-in-out ${
      isAnimating ? "bg-black/30 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
    }`}
    onClick={handleBackdropClick}
  >
    <div
      ref={drawerRef}
      className={`relative w-full sm:w-[90%] md:w-[75%] lg:w-[50%] 2xl:w-[45%] bg-white h-full shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out ${
        isAnimating
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header with Save */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 text-xl cursor-pointer transition-all duration-200"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Add Customer</h2>
        </div>
      <button
  type="submit"
  onClick={handleSave}
  disabled={isLoading}
  className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition
    ${isLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-400 hover:bg-orange-500"}`}
>
  {isLoading ? (
    <>
      <FaSpinner className="animate-spin" /> →
    </>
  ) : (
    "Save →"
  )}
</button> 
      </div>

      {/* Scrollable form content */}
<div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm"> {/* Set base font size to small */}
<form className="text-sm">
  {Object.entries(inputGroups).map(([sectionTitle, fields]) => (
    <div
      key={sectionTitle}
      className="bg-white border border-gray-300 mb-2 rounded-2xl p-6 transition-shadow duration-300"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        {sectionTitle}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {fields.map(({ label, key, required, disabled, placeholder }) => (
          <InputField
            key={key}
            label={label}
            keyName={key}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            type={key === "email" ? "email" : "text"}
            value={formData[key]}
            onChange={(value) => handleInputChange(key, value)}
            error={errors[key]}
            className="text-sm"
          />
        ))}
      </div>
    </div>
  ))}
</form>


</div>




      {/* Fixed Cancel Button at Bottom */}
      <div className="border-t bg-white p-4 sticky bottom-0 flex  gap-4 z-10">
    <button
  type="submit"
  onClick={handleSave}
  disabled={isLoading}
  className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition
    ${isLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-400 hover:bg-orange-500"}`}
>
  {isLoading ? (
    <>
      <FaSpinner className="animate-spin" /> →
    </>
  ) : (
    "Save →"
  )}
</button>
        <button
          onClick={handleClose}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-200 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

};

export default AddCustomerDrawer;
