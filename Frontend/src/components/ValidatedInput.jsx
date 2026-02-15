import React, { useState, useEffect } from "react";

const ValidatedInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  minLength,
  maxLength,
  placeholder = "",
  onValidChange, //  report validation status to parent
  rows = 4, //  default rows for textarea
  disabled = false,
}) => {
  const [error, setError] = useState("");

  const patterns = {
    text: /^[A-Za-z\s]*$/, // only letters and spaces
    number: /^[0-9]*$/, // only digits
    email:
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const validate = (val) => {
    if (required && !val.trim()) return "This field is required";
    if (minLength && val.length < minLength)
      return `Minimum ${minLength} characters required`;
    if (maxLength && val.length > maxLength)
      return `Maximum ${maxLength} characters allowed`;
    if (val !== val.trim()) return "No leading or trailing spaces allowed";

    const field = name.toLowerCase();

    //  10-digit validation for phone/whatsapp
    if (
      (name === "phone" ||
        name === "whatsapp" ||
        name === "personalInfo.alternateContact" ||
        name === "personalInfo.contactNumber") &&
      val
    ) {
      if (!/^\d{10}$/.test(val)) return "Must be a 10-digit number";
    }
    //  Pincode Validation (6 digits)
    if (
      (name.toLowerCase().includes("pincode") ||
        name.toLowerCase().includes("address.pincode") ||
        name.toLowerCase().includes("zip")) &&
      val
    ) {
      if (!/^[0-9]{6}$/.test(val)) return "Pincode must be 6 digits";
    }

    //  GST Validation
    if ((field.includes("gst") || field.includes("kycDetails.gstNumber"))  && val) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(val)) return "Enter a valid GST Number";
    }

    //  PAN Validation
    if ((field.includes("pan") || field.includes("kycDetails.panNumber")) && val) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(val)) return "Enter a valid PAN Number";
    }

    //  Aadhaar Validation
    if ((field.includes("aadhar") || field.includes("kycDetails.aadharNumber")) && val) {
      if (!/^[0-9]{12}$/.test(val)) return "Aadhaar Number must be 12 digits";
    }

    //  IFSC Validation
    if ((field.includes("ifsc") || field.includes("kycDetails.ifscCode")) && val) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(val)) return "Invalid IFSC Code";
    }

    //  Bank Account Number (9–18 digits)
    if ((field.includes("account") || field.includes("kycDetails.accountNumber")) && val) {
      if (!/^[0-9]{9,18}$/.test(val))
        return "Account Number must be 9–18 digits";
    }

    if (patterns[type] && !patterns[type].test(val)) {
      switch (type) {
        case "text":
          return "Only alphabets are allowed";
        case "number":
          return "Only numeric digits are allowed";
        case "email":
          return "Enter a valid email address";
        case "password":
          return "Password must contain uppercase, lowercase, number & special character";
        default:
          return "Invalid input";
      }
    }
    return "";
  };

  const handleChange = (e) => {
    let val = e.target.value;

    //  Restrict invalid characters only for specific input types
    if (type === "text" && !/^[A-Za-z\s]*$/.test(val)) return;
    if (type === "number" && !/^[0-9]*$/.test(val)) return;

    //  Prevent starting spaces
    if (val.startsWith(" ")) val = val.trimStart();

    onChange({ target: { name, value: val } });

    const err = validate(val);
    setError(err);
    onValidChange && onValidChange(name, !err);
  };

  const handleBlur = () => {
    const err = validate(value);
    setError(err);
    onValidChange && onValidChange(name, !err);
  };

  //  Keep validation synced with parent
  useEffect(() => {
    const err = validate(value);
    onValidChange && onValidChange(name, !err);
  }, [value]);

  const inputClasses = `border rounded-lg px-3 py-2 outline-none focus:ring-2 transition-all duration-150 ${
    error
      ? "border-red-500 ring-red-300"
      : "border-gray-300 focus:ring-blue-300"
  } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : ""}`;

  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && (
        <label htmlFor={name} className="text-gray-700 text-sm font-medium">
          {label}
        </label>
      )}

      {/*  Render textarea or input dynamically */}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default ValidatedInput;
