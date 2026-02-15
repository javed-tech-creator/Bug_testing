
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateQuotationMutation } from "@/api/finance/Quatation_Billing/quatation.api";
import { toast } from "react-toastify";

const UpdateQuotationModal = ({ quotation, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    client: "",
    project: "",
    items: [],
    shippingCharges: 0,
    discount: 0,
    paymentStatus: "pending",
    paymentMode: "",
    amountPaid: 0,
    dueDate: "",
  });

  const [updateQuotation, { isLoading }] = useUpdateQuotationMutation();

  // initialize form when modal opens or quotation changes
  useEffect(() => {
    if (quotation && Object.keys(quotation).length > 0) {
      setFormData({
        client: quotation.client?._id || quotation.client?.name || "",
        project:  quotation.project?._id || quotation.project?.name || "",
        items: quotation.items?.length ? quotation.items : [],
        shippingCharges: quotation.shippingCharges || 0,
        discount: quotation.discount || 0,
        paymentStatus: quotation.paymentStatus || "pending",
        paymentMode: quotation.paymentMode || "",
        amountPaid: quotation.amountPaid || 0,
        dueDate: quotation.dueDate ? quotation.dueDate.split("T")[0] : "",
      });
    }
  }, [quotation]);

console.log(quotation,"qi");

  // handle simple input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle item fields
  const handleItemChange = (e, index, field) => {
    const { value } = e.target;

    const updatedItems = formData.items.map((item, i) => {
      if (i !== index) return item;
      const newItem = { ...item };

      if (["cgst", "sgst", "igst"].includes(field)) {
        newItem.taxRates = { ...newItem.taxRates, [field]: Number(value) };
      } else if (["qty", "rate", "discount"].includes(field)) {
        newItem[field] = Number(value);
      } else {
        newItem[field] = value;
      }
      return newItem;
    });

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quotation?._id) {
      toast.error("Quotation ID missing!");
      return;
    }

    try {
        const res = await updateQuotation({ id: quotation._id, ...formData }).unwrap();
        console.log("Updated:", res);
        // 🔹 Update formData with backend response to reflect changes
        setFormData({
          client: res.q.client || "",
          project: res.q.project || "",
        items: res.q.items?.length ? res.q.items : [],
        shippingCharges: res.q.shippingCharges || 0,
        discount: res.q.discount || 0,
        paymentStatus: res.q.paymentStatus || "pending",
        paymentMode: res.q.paymentMode || "",
        amountPaid: res.q.amountPaid || 0,
        dueDate: res.q.dueDate ? res.q.dueDate.split("T")[0] : "",
      });
      

      toast.success("Quotation updated successfully!");
      onClose(); // close modal if needed
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Failed to update quotation.");
    }
  };
  console.log(formData,"form");
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex justify-center items-center z-50 p-4">
     <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden ">
  {/* Header */}
  <div className="flex justify-between items-center p-2  border-b bg-gradient-to-r from-gray-700 to-gray-700">
    <div>
      <h2 className="text-lg font-semibold text-white">Update Quotation</h2>
      <p className="text-xs text-white mt-0.5">Modify quotation details</p>
    </div>
    <button
      onClick={onClose}
      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
    >
      <X className="w-4 h-4 text-gray-600" />
    </button>
  </div>

  {/* Content */}
  <div className="overflow-y-auto  max-h-[calc(90vh-150px)]">
    <div className="p-2  space-y-3">
      {/* Client & Project */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Client
          </label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="Enter client ID"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Project
          </label>
          <input
            type="text"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Enter project ID"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Items */}
  <div className="space-y-2">
  {formData.items.map((item, index) => (
    <div key={index} className="bg-gray-50 p-2 rounded-md border">
      <h4 className="text-xs font-medium text-gray-700 mb-2">
        Item #{index + 1}
      </h4>

      {/* Product */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Product
          </label>
          <input
            type="text"
            value={item.product.name || item.product || ""}
            onChange={(e) => handleItemChange(e, index, "product")}
            placeholder="Product name or code"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Qty, Rate, Discount */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={item.qty || 0}
            onChange={(e) => handleItemChange(e, index, "qty")}
            min="0"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Rate (₹)
          </label>
          <input
            type="number"
            value={item.rate || 0}
            onChange={(e) => handleItemChange(e, index, "rate")}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={item.discount || 0}
            onChange={(e) => handleItemChange(e, index, "discount")}
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* GST Fields */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            CGST (%)
          </label>
          <input
            type="number"
            value={item?.taxRates?.cgst || 0}
            onChange={(e) => handleItemChange(e, index, "cgst")}
            min="0"
            max="50"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            SGST (%)
          </label>
          <input
            type="number"
            value={item?.taxRates?.sgst || 0}
            onChange={(e) => handleItemChange(e, index, "sgst")}
            min="0"
            max="50"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            IGST (%)
          </label>
          <input
            type="number"
            value={item?.taxRates?.igst || 0}
            onChange={(e) => handleItemChange(e, index, "igst")}
            min="0"
            max="50"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Shipping, Discount, Payment */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Shipping Charges (₹)
          </label>
          <input
            type="number"
            name="shippingCharges"
            value={formData.shippingCharges}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Overall Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Payment Section */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Payment Mode
          </label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Mode</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Amount Paid (₹)
          </label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="border-t mb-5 p-2 bg-gray-50">
    <div className="flex justify-end gap-2 ">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-5 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
      >
        {isLoading ? "Updating..." : "Update Quotation"}
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default UpdateQuotationModal;
