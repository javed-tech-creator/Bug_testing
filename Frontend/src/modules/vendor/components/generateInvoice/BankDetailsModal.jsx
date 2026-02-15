import { useAddBankMutation } from "@/api/vendor/bankDetails.api";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const BankDetailsModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
  });

  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false); // <--- animation control

  // add bank details api
  const [addBank, { isLoading }] = useAddBankMutation();

  // Trigger opening animation on mount
  useEffect(() => {
    setTimeout(() => setIsOpen(true), 50);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.accountHolderName.trim())
      newErrors.accountHolderName = "Account holder name is required.";
    if (!formData.accountNumber.trim())
      newErrors.accountNumber = "Account number is required.";
    if (!formData.confirmAccountNumber.trim())
      newErrors.confirmAccountNumber = "Please confirm your account number.";
    if (formData.accountNumber !== formData.confirmAccountNumber)
      newErrors.confirmAccountNumber = "Account numbers do not match.";
    if (!formData.ifscCode.trim())
      newErrors.ifscCode = "IFSC code is required.";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode))
      newErrors.ifscCode = "Invalid IFSC code format.";
    if (!formData.bankName.trim())
      newErrors.bankName = "Bank name is required.";
    if (!formData.branchName.trim())
      newErrors.branchName = "Branch name is required.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("✅ Bank Form Details Submitted:", formData);
    try {
      const res = await addBank(formData).unwrap();
      toast.success("Bank details saved successfully ✅");

      setFormData({
        accountHolderName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        upiId: "",
      });

      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save bank details ❌");
    }
  };

  const fetchBankDetails = async () => {
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${formData.ifscCode}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        bankName: data.BANK || "",
        branchName: data.BRANCH || "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        ifscCode: "Invalid IFSC or unable to fetch bank details.",
      }));
    }
  };

  // Smooth closing animation before actual close
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300); // delay unmount to allow animation
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`
          h-full bg-white flex flex-col overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? "w-full sm:w-[50%] opacity-100" : "w-0 opacity-0"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="text-2xl text-gray-600 font-bold hover:text-orange-600 transition"
              title="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Bank Details
            </h2>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading} // जब loading हो तो disable भी कर दो
            className={`flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
              </>
            ) : (
              "Save "
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-black">
          <div className="p-4 bg-white shadow rounded-md">
            {[
              {
                label: "Account Holder Name",
                name: "accountHolderName",
                required: true,
              },
              { label: "Account No", name: "accountNumber", required: true },
              {
                label: "Confirm Bank Account No",
                name: "confirmAccountNumber",
                required: true,
              },
              { label: "IFSC Code", name: "ifscCode", required: true },
              { label: "Bank Name", name: "bankName", required: true },
              { label: "Branch Name", name: "branchName", required: true },
              { label: "UPI (optional)", name: "upiId", required: false },
            ].map((field, index) =>
              field.name === "ifscCode" ? (
                <div className="flex flex-col gap-1 w-full" key={index}>
                  <label className="block font-medium mb-1 text-sm text-gray-700">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>

                  <div className="flex gap-2 w-full">
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`flex-1 border px-3 py-2 rounded bg-white text-black ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder={field.label}
                    />
                    <button
                      onClick={fetchBankDetails}
                      className="px-4 py-2 bg-gray-100 text-black border border-gray-300 rounded hover:bg-gray-200 text-sm h-[38px]"
                    >
                      Fetch
                    </button>
                  </div>

                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ) : (
                <div key={index}>
                  <label className="block font-medium mb-1 text-sm text-gray-700">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>
                  <input
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-black"
                    placeholder={field.label}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                  {field.name === "upiId" && (
                    <p className="text-xs text-gray-500 mt-1">
                      This UPI ID will be used to generate{" "}
                      <strong>Dynamic QR codes</strong> on invoices.
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
