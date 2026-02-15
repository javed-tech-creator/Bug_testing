import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetInvoicePdfQuery } from "@/api/finance/Quatation_Billing/invoice.api";

const InvoicePage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetInvoicePdfQuery(id);
  const [pdfUrl, setPdfUrl] = useState(null);

 useEffect(() => {
  if (data) {
    const url = URL.createObjectURL(data); // now data is Blob
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }
}, [data]);

 if (isLoading) return (
    <div className="flex justify-center mt-60 items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-15 w-15 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading.....</p>
      </div>
    </div>
  );
  if (error) return <p className="p-4 text-red-500">Error loading invoice</p>;
  if (!pdfUrl) return <p className="p-4 text-red-500">PDF not available</p>;

  return (
    <div className="">
     
      <iframe
        src={pdfUrl}
        title="Invoice PDF"
        width="100%"
        height="800px"
        className="border rounded-lg"
      />
    </div>
  );
};

export default InvoicePage;
