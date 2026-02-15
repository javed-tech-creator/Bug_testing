const InvoiceHeader = () => {
  return (
    <div className="flex justify-between p-6 items-start mb-10 border-b pb-6">
      <div>
        <img src="/dss_logo.webp" alt="Logo" className="w-44 mb-4" />
        <h1 className="text-blue-600 font-bold text-2xl">
          Digital Signage Solutions PVT. LTD.
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Lucknow, Uttar Pradesh 226028
        </p>
      </div>

      <div className="text-right">
        <h2 className="text-blue-600 font-bold text-xl">TAX INVOICE</h2>
        <p className="text-sm text-gray-600 mt-1">Invoice #: INV-175</p>
      </div>
    </div>
  );
};

export default InvoiceHeader;