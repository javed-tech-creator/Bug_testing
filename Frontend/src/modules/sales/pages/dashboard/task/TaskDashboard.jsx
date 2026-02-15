import React, { useState } from "react";
import { ArrowLeft, History, ChevronDown, Plus } from "lucide-react";

// Main Dashboard Component
const TargetDashboard = () => {
  const [formData, setFormData] = useState({
    executive: "Mr. Shivam",
    branch: "Chinhhat",
    targetType: "Weekly",
    period: "",
    leadGeneration: "",
    clientMeeting: "",
    clientConversion: "",
    revenue: "",
    products: [{ id: 1, name: "", quantity: "", revenue: "" }],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: Date.now(),
          name: "",
          quantity: "",
          revenue: "",
        },
      ],
    }));
  };

  const resetForm = () => {
    setFormData({
      executive: "Mr. Shivam",
      branch: "Chinhhat",
      targetType: "Weekly",
      period: "",
      leadGeneration: "",
      clientMeeting: "",
      clientConversion: "",
      revenue: "",
      products: [{ id: 1, name: "", quantity: "", revenue: "" }],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sales Target Assignment
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Assign Daily, Weekly and Monthly Targets to Sales Executive.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition">
            <History size={18} className="text-gray-600" />
            <span className="text-gray-700 font-medium">
              View Target History
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* First Row: Target Selection and Set Targets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Selection Card - Left */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choose Executive, Branch And Target Period
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Executive */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Select Executive
                </label>
                <div className="relative">
                  <select
                    value={formData.executive}
                    onChange={(e) =>
                      handleInputChange("executive", e.target.value)
                    }
                    className="w-full bg-gray-100 p-3 pr-10 rounded-lg text-gray-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Mr. Shivam</option>
                    <option>Mr. Ramesh</option>
                    <option>Ms. Neha</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Select Branch */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Select Branch
                </label>
                <div className="relative">
                  <select
                    value={formData.branch}
                    onChange={(e) =>
                      handleInputChange("branch", e.target.value)
                    }
                    className="w-full bg-gray-100 p-3 pr-10 rounded-lg text-gray-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Chinnhat</option>
                    <option>Gomti Nagar</option>
                    <option>Indira Nagar</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Target Type */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Target Type
                </label>
                <div className="relative">
                  <select
                    value={formData.targetType}
                    onChange={(e) =>
                      handleInputChange("targetType", e.target.value)
                    }
                    className="w-full bg-gray-100 p-3 pr-10 rounded-lg text-gray-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Select Period */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Select Period
                </label>
                <input
                  type="date"
                  value={formData.period}
                  onChange={(e) => handleInputChange("period", e.target.value)}
                  placeholder="Select Date"
                  className="w-full bg-gray-100 p-3 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Set Targets Card - Right */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Set Targets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lead Generation Target */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Lead Generation Target
                </label>
                <input
                  type="number"
                  value={formData.leadGeneration}
                  onChange={(e) =>
                    handleInputChange("leadGeneration", e.target.value)
                  }
                  placeholder="Enter number of leads"
                  className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Client Meeting Target */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Client Meeting Target
                </label>
                <input
                  type="number"
                  value={formData.clientMeeting}
                  onChange={(e) =>
                    handleInputChange("clientMeeting", e.target.value)
                  }
                  placeholder="Enter number of client meetings"
                  className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Client Conversion Target */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Client Conversion Target
                </label>
                <input
                  type="number"
                  value={formData.clientConversion}
                  onChange={(e) =>
                    handleInputChange("clientConversion", e.target.value)
                  }
                  placeholder="Enter number of conversions"
                  className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Revenue Target */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Revenue Target
                </label>
                <input
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => handleInputChange("revenue", e.target.value)}
                  placeholder="Enter target amount in ₹"
                  className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product-wise Targets - Top Left */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Product-wise Targets
            </h2>

            <div className="space-y-4">
              {formData.products.map((product) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <div className="relative">
                      <select
                        value={product.name}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-100 p-3 pr-10 rounded-lg text-gray-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select product</option>
                        <option>Product A</option>
                        <option>Product B</option>
                        <option>Product C</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>

                  {/* Target Quantity */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Target Quantity
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "quantity",
                          e.target.value
                        )
                      }
                      placeholder="Enter target quantity"
                      className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Expected Revenue */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Expected Revenue
                    </label>
                    <input
                      type="number"
                      value={product.revenue}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "revenue",
                          e.target.value
                        )
                      }
                      placeholder="Enter expected revenue"
                      className="w-full bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addProduct}
              className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-4 py-2 mt-6 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* Target Validity & Rules - Top Right */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Target Validity & Rules
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-bold">•</span>
                <span>Target is mandatory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-bold">•</span>
                <span>No carry forward allowed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-bold">•</span>
                <span>Target linked with incentives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-900 font-bold">•</span>
                <span>Approval required after submission</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Reset Form
          </button>
          <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition">
            Save as Draft
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Assign Target
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetDashboard;
