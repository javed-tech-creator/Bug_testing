import React, { useState } from "react";
import { InputGroup } from "../ui/CommonComponents";

const CustomerDetails = () => {
  const [fields, setFields] = useState({
    projectId: "PR-87432",
    clientCode: "CL-2981",
    clientName: "Abc Singh",
    companyName: "Abc Pvt Ltd",
    contactNumber: "9876543210",
    email: "client@gmail.com",
    billingAddress: "PR-87432",
    invoiceNo: "DSSIN-87432",
    invoiceDate: "2025-10-12",
    dueDate: "2025-10-13",
  });

  // Validation helpers
  const isAlpha = (val) => /^[A-Za-z\s]*$/.test(val);
  const isAlphaNum = (val) => /^[A-Za-z0-9-]*$/.test(val);
  const isNumeric = (val) => /^\d*$/.test(val);
  const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  // Accepts yyyy-mm-dd (HTML date input)
  const isDate = (val) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
    const [y, m, d] = val.split("-").map(Number);
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900) return false;
    const dt = new Date(y, m - 1, d);
    return (
      dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
    );
  };
  // Billing Address: allow only letters, numbers, spaces, comma, period, hyphen, slash
  const isBillingAddressValid = (val) => /^[A-Za-z0-9\s,./-]*$/.test(val);

  const handleChange = (key, value) => {
    if (["clientName", "companyName"].includes(key)) {
      if (!isAlpha(value)) return;
    } else if (["projectId", "clientCode", "invoiceNo"].includes(key)) {
      if (!isAlphaNum(value)) return;
    } else if (key === "contactNumber") {
      if (!isNumeric(value) || value.length > 10) return;
    } else if (key === "email") {
      if (value && !isEmail(value)) return;
    } else if (["invoiceDate", "dueDate"].includes(key)) {
      if (value && !isDate(value)) return;
    } else if (key === "billingAddress") {
      if (!isBillingAddressValid(value)) return;
    }
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">
        Customer Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <InputGroup
          label="Project Id"
          value={fields.projectId}
          readOnly
          tabIndex={-1}
          style={{ pointerEvents: "none" }}
        />
        <InputGroup
          label="Client Code"
          value={fields.clientCode}
          readOnly
          tabIndex={-1}
          style={{ pointerEvents: "none" }}
        />
        <InputGroup
          label="Client Name"
          value={fields.clientName}
          onChange={(e) => handleChange("clientName", e.target.value)}
        />
        <InputGroup
          label="Company Name"
          value={fields.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />
        <InputGroup
          label="Contact Number"
          value={fields.contactNumber}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
        />
        <InputGroup
          label="Email"
          value={fields.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <InputGroup
          label="Billing Address"
          value={fields.billingAddress}
          onChange={(e) => handleChange("billingAddress", e.target.value)}
        />
        <InputGroup
          label="Invoice No."
          value={fields.invoiceNo}
          readOnly
          tabIndex={-1}
          style={{ pointerEvents: "none" }}
        />
        <InputGroup
          label="Invoice Date"
          value={fields.invoiceDate}
          onChange={(e) => handleChange("invoiceDate", e.target.value)}
          type="date"
        />
        <InputGroup
          label="Due Date"
          value={fields.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          type="date"
        />
      </div>
    </div>
  );
};

export default CustomerDetails;
