const FooterTotals = () => {
  return (
    <div className="flex justify-between mt-12 border-t border-gray-200 pt-6">
      {/* LEFT - Bank Details & Terms */}
      <div className="w-1/2 text-[10px]">
        <h5 className="font-bold text-sm mb-3 text-gray-800">Bank Details</h5>
        <div className="flex gap-6">
          <div className="space-y-1.5 text-gray-600">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-gray-800">Bank Name:</span>
              <span>State Bank Of India</span>
              <span className="font-bold text-gray-800">Account No:</span>
              <span>00000000000001</span>
              <span className="font-bold text-gray-800">IFSC:</span>
              <span>SBIN0000001</span>
              <span className="font-bold text-gray-800">Branch:</span>
              <span>Gomti Nagar, Lucknow</span>
            </div>
          </div>
          <div className="ml-4">
            <span className="font-bold block mb-2 text-gray-800">
              Pay Using UPI
            </span>
            {/* QR Code */}
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 rounded overflow-hidden">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                alt="UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h5 className="font-bold mb-2 text-gray-800">Terms & Conditions:</h5>
          <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li>
              Payments will be made in favor of Digital Signage Solution Pvt.
              Ltd.
            </li>
            <li>50% Payment required with confirmation.</li>
            <li>50% Post Production or before installation.</li>
            <li>Scuff Folding work by the client side.</li>
          </ol>
        </div>
      </div>

      {/* RIGHT - Totals */}
      <div className="w-1/3 flex flex-col items-end text-xs text-gray-700">
        <div className="w-full flex justify-between py-1.5 border-b border-gray-100">
          <span>Total Discount</span>
          <span>₹800</span>
        </div>
        <div className="w-full flex justify-between py-1.5 border-b border-gray-100">
          <span>Taxable Amount</span>
          <span>₹800</span>
        </div>
        <div className="w-full flex justify-between py-1.5 border-b border-gray-100">
          <span>CGST + SGST</span>
          <span>₹800</span>
        </div>
        <div className="w-full flex justify-between py-3 border-t border-b-2 border-gray-200 font-bold text-lg mt-2 text-blue-600">
          <span>Grand Total</span>
          <span>₹2,25,500</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-2 w-full text-right italic">
          Two Lakh Twenty-Five Thousand Five Hundred Only
        </div>
      </div>
    </div>
  );
};

export default FooterTotals;