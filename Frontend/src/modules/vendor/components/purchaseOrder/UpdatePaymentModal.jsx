import { useUpdateInvoicePaymentMutation } from "@/api/vendor/invoice.api";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const paymentTypes = ["UPI", "Cash", "Card", "Net Banking", "Cheque"];

export default function PaymentModal({ isOpen, onClose, invoiceData }) {
  const modalRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const [amount, setAmount] = useState(invoiceData?.amountPending || 0);
  const [error, setError] = useState("");
  const [paymentDate, setPaymentDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [paymentType, setPaymentType] = useState("");
  const [notes, setNotes] = useState("");
  const [sendSMS, setSendSMS] = useState(false);
  const [date, setDate] = useState("");

  console.log("invoice data is ---",invoiceData)
  // Enhanced close function with animation
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

// update payment api 
  const [updatePayment, { isLoading, isError, data }] =
    useUpdateInvoicePaymentMutation();

      const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      setError("Amount is required and must be greater than 0.");
      return;
    }

    if (amount > invoiceData.amountPending) {
      setError(`Amount must be less than or equal to ₹ ${invoiceData.amountPending}`);
      return;
    }

    if (!paymentType) {
      alert("Please select a payment type.");
      return;
    }

    const payload = {
      paymentAmount:amount,
      paymentMode: paymentType,
      paymentDate,
      notes,
      sendSMS,
      customer:invoiceData.customer,
      phone:invoiceData.phone,
    };

    try {
      console.log("Payload for update payment", payload);
     
     const res = await updatePayment({ invoiceId: invoiceData.invoiceId,payload}).unwrap();
     toast.success("Payment updated successfully!");

     setTimeout(() => {
     if(res.sms.success === false){
     toast.error(res.sms.message)
     }else if(res.sms){
           toast.success("SMS sent successfully!");

     }
     }, 800); // 0.8 sec delay

     
    //  console.log("sms data is ",res.sms.message);
     
      // Clear fields after submission
      setAmount("");
      setPaymentType("");
      setNotes("");
      setSendSMS(false);
      setError("");
      handleClose();

    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.data?.error?.message || "Failed to update payment");
    }
  };
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  // Handle opening animation and setup
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setAmount(invoiceData?.amountPending || 0);
      setPaymentType("");
      setNotes("");
      setSendSMS(false);
      setError("");
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, invoiceData?.amountPending]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const today = new Date();
    const formatted = today
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " ");
    setDate(formatted);
  }, []);

  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      setAmount("");
      setError("Amount must be a number.");
      return;
    }

    setAmount(val);
    setError(
      val > invoiceData.amountPending
        ? `Amount must be less than or equal to ₹ ${invoiceData.amountPending}`
        : ""
    );
  };



  if (!isOpen) return null;

  return (
   <div
  className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ease-in-out ${
    isAnimating
      ? "bg-black/30 backdrop-blur-sm"
      : "bg-black/0 backdrop-blur-none"
  }`}
  onClick={handleClickOutside}
>
  <div
    ref={modalRef}
    className={`w-[100%] md:w-[40%] h-full bg-white shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
      isAnimating
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
    }`}
    onClick={(e) => e.stopPropagation()}
  >
    {/* ---------------- Header (Fixed) ---------------- */}
    <div className="flex items-center justify-between border-b p-4 shrink-0">
      <div className="flex items-start gap-3">
        <button
          onClick={handleClose}
          className="text-xl text-gray-400 hover:text-black cursor-pointer transition-colors duration-200 p-1 rounded"
        >
          ✖
        </button>
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Record Payment for{" "}
            <span className="text-gray-700">{invoiceData?.invoiceNo}</span>
          </h2>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded-md disabled:opacity-50 transition-colors duration-200"
        disabled={!!error || !paymentType}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          "Update Payment →"
        )}
      </button>
    </div>

    {/* ---------------- Scrollable Body ---------------- */}
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {/* Info Row */}
      <div className="flex justify-between items-center mb-6 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <span className="text-sm sm:text-base font-medium text-gray-700">
          Payment Info:{" "}
          <span className="font-semibold text-gray-900">
            {invoiceData?.customer}
          </span>
        </span>
        <span className="text-sm sm:text-base font-semibold text-red-600">
          Balance: ₹ {invoiceData?.amountPending?.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">
          <span className="text-red-600">*</span> Amount to be Recorded
        </label>
        <input
          type="number"
          required
          min="1"
          value={amount}
          onChange={handleAmountChange}
          className={`w-full px-4 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Total Amount ₹ {invoiceData?.amountPending?.toLocaleString("en-IN")}</span>
          <span>Amount Pending ₹ {invoiceData?.amountPending?.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Payment Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Payment Date</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Payment Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Payment Type</label>
        <div className="flex flex-wrap gap-2">
          {paymentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setPaymentType(type)}
              className={`px-3 py-1 border rounded-full text-sm cursor-pointer transition-all duration-200 hover:scale-105 ${
                paymentType === type
                  ? "bg-green-100 text-green-700 border-green-500 shadow-md"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:text-green-700 hover:border-green-500"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Your notes on the payment"
          className="w-full px-4 py-2 border border-gray-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          rows={3}
        />
      </div>

      {/* SMS */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">
          SMS to Customers
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sendSMS}
            onChange={(e) => setSendSMS(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors duration-300"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
        </label>
        {sendSMS && (
          <p className="text-xs text-orange-600 mt-1 animate-fade-in">
            SMS will be sent to customer: <span>{invoiceData?.phone}</span>
          </p>
        )}
      </div>
    </div>

    {/* ---------------- Footer (Fixed) ---------------- */}
  <div className="p-4 border-t shrink-0">
  <button
    onClick={handleSubmit}
    className="bg-orange-500 text-white font-semibold py-2 px-5 rounded hover:bg-orange-600 disabled:opacity-50 cursor-pointer transition-all duration-200 hover:scale-105 disabled:hover:scale-100 ml-2"
    disabled={!!error || !paymentType || isLoading}
  >
    {isLoading ? (
      <svg
        className="animate-spin h-5 w-5 text-white inline-block"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    ) : (
      "Update Payment →"
    )}
  </button>
</div>

  </div>

  <style jsx>{`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `}</style>
</div>

  );
}