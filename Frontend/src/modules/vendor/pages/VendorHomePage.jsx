import React from 'react'

function VendorHomePage() {
  return (
    <div>

      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Select product  */}
        <div className="w-full lg:w-1/3 bg-blue-50 shadow-md rounded p-4 mb-6 print:hidden max-h-[550px] overflow-y-auto">
          <label className="block font-semibold mb-2">
            Search & Select Customer:
          </label>

       

          {/* Show Selected Order Details */}
          {/* {selectedOrders.length > 0 && ( */}
          <div className="border border-blue-200 rounded-xl p-4 shadow-lg bg-white space-y-3 transition-all duration-300 mt-8   ">
            <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
              📦 Selected Product Details
            </h3>

            <div className="space-y-4 max-h-64 overflow-y-auto  hide-scrollbar ">
              {selectedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-xl p-4 bg-white shadow-sm space-y-2"
                >
                  {/* Row 1: Product, Size, Qty */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-semibold">Product:</span>
                      <span className="bg-sky-100 text-sky-800 font-medium px-2 py-0.5 rounded shadow-sm">
                        {order.productName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-semibold">Size:</span>
                      <span className="bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded shadow-sm">
                        {order.size}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-semibold">Qty:</span>
                      <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded shadow-sm">
                        {order.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Rate, Amount, Payment */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-semibold">Rate:</span>
                      <span className="bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded shadow-sm">
                        ₹{order.rateUnit}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-semibold">Amount:</span>
                      <span className="bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded shadow-sm">
                        ₹{order.amount}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-semibold">Payment:</span>
                      <span className="bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded shadow-sm">
                        {order.paymentMode || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addMultipleToInvoice}
              className="w-full mt-2 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold shadow-sm transition-all cursor-pointer"
            >
              ➕ Add {selectedOrders.length} Product(s) to Invoice
            </button>
          </div>
          {/* )} */}
        </div>

        {/* Invoice generate */}

        <div className="w-full px-4 md:px-8 lg:w-2/3 mx-auto print:px-0 print:py-0 print:mx-0 print:w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 print:p-1 print:shadow-none print:rounded-none print:border-none print:overflow-visible print:leading-tight">
            {/* Business Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 border-b pb-4 print:flex-row print:justify-between print:items-start print:gap-0">
              {/* Left Side - Company Info */}
              <div className="print:max-w-[65%]">
                <h2 className="text-xl font-bold text-blue-800">
                  Business Name
                </h2>
                <p className="text-sm text-gray-700 leading-tight">
                  GSTIN: 27AAICD1234A1ZP
                  <br />
                  Regd. Office: 123, Tech Park, Andheri East, Mumbai,
                  Maharashtra 400059
                  <br />
                  Phone: +91-9876543210 | Email: info@3sdss.com
                </p>
              </div>

              {/* Right Side - Invoice Info */}
              <div className="text-sm text-gray-800 self-end md:self-start text-right print:text-right print:max-w-[35%]">
                <p>
                  <strong>Date:</strong> {invoiceDate}
                </p>{" "}
                <p>
                  <strong>Time:</strong> {invoiceTime}
                </p>
                <p>
                  <strong>Invoice #:</strong> {invoiceNumber}
                </p>
              </div>
            </div>

            {/* Billed To Section */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700">Billed To:</p>
              <p className="text-sm text-gray-800 leading-tight">
                Digital Signage Solutions Pvt. Ltd.
                <br />
                501, Palm Grove Complex,
                <br />
                Sector 5, Noida, Uttar Pradesh - 201301
                <br />
              </p>
            </div>

            {/* Invoice Table */}
            <div className="overflow-auto">
              <table className="min-w-full text-xs border-collapse border border-gray-400 mt-4 print:mt-2">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px] text-center">
                      S No
                    </th>
                    <th className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px] text-center">
                      Product
                    </th>
                    <th className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px] text-center">
                      Size
                    </th>
                    <th className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px] text-center">
                      Qty
                    </th>
                    <th className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px] text-center">
                      Rate
                    </th>
                    <th className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px] text-center">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px]">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px]">
                        {item.productName}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px]">
                        {item.size}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px]">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px]">
                        ₹{item.rateUnit}
                      </td>
                      <td className="border border-gray-400 px-2 py-1 print:px-1 print:py-[2px]">
                        ₹{item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="mt-4 w-full max-w-sm ml-auto print:mt-2 print:max-w-[50%] print:mr-0 print:block print:text-xs">
              <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md print:p-1 print:rounded-none print:border print:border-gray-400 print:shadow-none print:leading-tight">
                <div className="flex justify-between mb-2 print:mb-1">
                  <span className="font-medium text-gray-700">Subtotal</span>
                  <span className="text-gray-900">₹{subTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-2 print:mb-1">
                  <span className="font-medium text-gray-700">
                    GST ({gstPercent}%)
                  </span>
                  <span className="text-gray-900">₹{gstAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-2 print:mb-1">
                  <span className="font-medium text-gray-700">Discount</span>
                  <span className="text-gray-900">₹{discount.toFixed(2)}</span>
                </div>

                <hr className="my-2 border-gray-300 print:border-gray-600 print:my-1" />

                <div className="flex justify-between text-base font-semibold text-gray-900 mb-2 print:text-black">
                  <span className="uppercase">Grand Total</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>

                {Number(amountPaid) > 0 && (
                  <>
                    <div className="flex justify-between text-sm font-semibold text-green-700 mb-1 print:text-green-800">
                      <span>Paid</span>
                      <span>₹{amountPaid.toFixed(2)}</span>
                    </div>

                    {Number(amountPaid) !== Number(finalAmount) && (
                      <div className="flex justify-between text-sm font-semibold text-red-600 print:text-red-700">
                        <span>Due</span>
                        <span>₹{amountDue.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Controls & Form */}
            <div className="mt-6 flex flex-col gap-6 print:hidden bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
              {/* Row 1*/}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    GST %
                  </label>
                  <input
                    type="number"
                    value={gstPercent}
                    min={0}
                    max={100}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 18"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Discount ₹
                  </label>
                  <input
                    type="number"
                    value={discount}
                    min={0}
                    max={subTotal + gstAmount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= subTotal + gstAmount) setDiscount(value);
                    }}
                    className="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 500"
                  />
                  <small className="text-xs text-gray-500">
                    Max discount: ₹{subTotal + gstAmount}
                  </small>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Amount Paid ₹
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    min={0}
                    max={finalAmount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= finalAmount) setAmountPaid(value);
                    }}
                    className="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
              {/* Row 2 */}
              {Number(amountPaid) > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    window.print();
                    saveInvoiceToBackend();
                  }}
                  className="p-2 px-4 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition"
                >
                  Save & Print
                </button>
              </div>
            </div>

            {/* footer  */}
            <div className="bg-gray-50 px-3 py-2 mt-2 border-t border-gray-200 print:fixed print:bottom-0 print:left-0 print:right-0 print:px-2 print:py-1 print:bg-white print:border-t print:border-gray-400">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2 print:text-xs print:mb-1">
                  Thank you for your business!
                </p>
                <p className="text-xs text-gray-500 print:text-gray-600">
                  This is a computer-generated invoice. For any queries, please
                  contact us at info@3sdss.com
                </p>
                <div className="mt-3 print:mt-2 flex justify-center items-center gap-4 print:gap-2 text-xs text-gray-500">
                  <span>📧 info@3sdss.com</span>
                  <span>📞 +91-9876543210</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


   {/* modal satrt  */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaTruck className="text-blue-600" />
                Update Order Status
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl cursor-pointer transition duration-200"
                title="Close"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Select New Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option
                  value="Pending"
                  disabled={
                    selectedOrder?.status === "Pending" ||
                    selectedOrder?.status === "Paid" ||
                    selectedOrder?.status === "Paid"
                  }
                  className={
                    selectedOrder?.status === "Pending" ||
                    selectedOrder?.status === "Paid" ||
                    selectedOrder?.status === "Paid"
                      ? "text-gray-400"
                      : ""
                  }
                >
                  Pending
                </option>
                <option
                  value="Pending"
                  disabled={
                    selectedOrder?.status === "Paid" ||
                    selectedOrder?.status === "Paid"
                  }
                  className={
                    selectedOrder?.status === "Paid" ||
                    selectedOrder?.status === "Paid"
                      ? "text-gray-400"
                      : ""
                  }
                >
                  Pending
                </option>
                <option
                  value="Paid"
                  disabled={selectedOrder?.status === "Paid"}
                  className={
                    selectedOrder?.status === "Paid" ? "text-gray-400" : ""
                  }
                >
                  Paid
                </option>
                <option
                  value="Paid"
                  disabled={
                    selectedOrder?.status === "Paid" ||
                    selectedOrder?.status === "Paid"
                  }
                  className={
                    selectedOrder?.status === "Paid" ||
                    selectedOrder?.status === "Paid"
                      ? "text-gray-400"
                      : ""
                  }
                >
                  Paid
                </option>
              </select>
            </div>

            {/* Status progression info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-700 font-medium mb-1">
                Current Status:{" "}
                <span
                  className={`  ${
                    selectedOrder?.status === "Pending"
                      ? "text-yellow-500"
                      : selectedOrder?.status === "Pending"
                      ? "text-blue-500"
                      : selectedOrder?.status === "Paid"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedOrder?.status}
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {selectedOrder?.status === "Pending" &&
                  "Available transitions: Pending, Paid, Paid"}
                {selectedOrder?.status === "Pending" &&
                  "Available transitions: Paid, Paid"}
                {selectedOrder?.status === "Paid" &&
                  "Order Paid - No further changes allowed"}
                {selectedOrder?.status === "Paid" &&
                  "Order Paid - No further changes allowed"}
              </div>
            </div>

            <div className="text-sm">
              Current selection:&nbsp;
              <span
                className={`inline-block px-2 py-1 rounded-full text-white text-xs font-medium
            ${
              newStatus === "Pending"
                ? "bg-yellow-500"
                : newStatus === "Pending"
                ? "bg-blue-500"
                : newStatus === "Paid"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
              >
                {newStatus}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={
                  selectedOrder?.status === newStatus ||
                  (selectedOrder?.status === "Paid" &&
                    newStatus !== "Paid") ||
                  (selectedOrder?.status === "Paid" &&
                    newStatus !== "Paid") ||
                  isLoading
                }
                className={`px-4 py-2 text-sm rounded-md transition ${
                  selectedOrder?.status === newStatus ||
                  (selectedOrder?.status === "Paid" &&
                    newStatus !== "Paid") ||
                  (selectedOrder?.status === "Paid" &&
                    newStatus !== "Paid") ||
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* modal end  */}

     {/* add payment card of generate incoice code  */}
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
            💳 Select Bank
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* GST Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                GST (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={gst}
                onChange={(e) => {
                  const value = Math.min(
                    100,
                    Math.max(0, Number(e.target.value))
                  );
                  setGst(value);
                }}
                className="border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. 18"
              />
            </div>

            {/* Amount Paid */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Amount Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                max={displayTotal}
                value={amountPaid}
                onChange={(e) => {
                  const value = Math.min(Number(e.target.value), displayTotal);
                  setAmountPaid(value);
                }}
                className="border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter amount"
              />
            </div>

            {/* Payment Status */}
            {amountPaid > 0 && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <input
                  type="text"
                  readOnly
                  value={paymentStatus}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>
            )}

            {/* Payment Mode */}
            {amountPaid > 0 && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            )}
          </div>
    </div>
  )
}

export default VendorHomePage