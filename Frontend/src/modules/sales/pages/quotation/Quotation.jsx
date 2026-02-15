import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import BoardProductTable from "./table/BoardProductTable";
import LetterProductTable from "./table/LetterProductTable";
import BoardLetterProductTable from "./table/BoardLetterProductTable";
import QuotationHeader from "./components/QuotationHeader";
import InvoiceHeader from "./components/InvoiceHeader";
import BillingProjectDetails from "./components/BillingProjectDetails";
import FooterTotals from "./components/FooterTotals";
import SignatureSection from "./components/SignatureSection";
import QuotationStatus from "./components/QuotationStatus";

const sampleLetterTable = {
  rows: [
    {
      sNo: "01",
      productCode: "L-12345",
      productName: "Acrylic Letters",
      productDescription: "Laser cut acrylic letters",
      letters: "A,B,C",
      thickness: "5",
      length: "12",
      height: "8",
      quantity: "10",
      rate: "50",
      amount: "5000",
      lsp: "1000",
    },
    {
      sNo: "02",
      productCode: "L-67890",
      productName: "Metal Letters",
      productDescription: "Stainless steel letters",
      letters: "D,E,F",
      thickness: "8",
      length: "10",
      height: "6",
      quantity: "5",
      rate: "80",
      amount: "4000",
      lsp: "800",
    },
  ],
};

const Quotation = () => {
  const navigate = useNavigate();
  const [quotationStatus, setQuotationStatus] = useState("approved");

  const IS_READ_ONLY = quotationStatus === "approved";

 const handleStatusSave = () => {
  if (quotationStatus === "approved") {
    toast.success("Quotation approved successfully");
  } else if (quotationStatus === "modification") {
    toast.info("Quotation modified");
  } else {
    toast.warn("New quotation saved");
  }
  console.log("Saved Status:", quotationStatus);
};


  return (
    <div className="pb-10">
      {/* Header */}
      <QuotationHeader navigate={navigate} />

      {/* Invoice Paper */}
      <div className="max-w-full bg-white shadow-lg mb-8 border">
        {/* Invoice Header */}
        <InvoiceHeader />

        {/* Billing & Project Details */}
        <BillingProjectDetails />
      </div>

      {/* Product Tables */}
      <div className="max-w-[1400px] mx-auto bg-white p-8 border shadow">
        <BoardProductTable
          readOnly={IS_READ_ONLY}
          showRemove={false}
          showBorder={false}
        />

        <LetterProductTable
          table={sampleLetterTable}
          readOnly={IS_READ_ONLY}
          showRemove={false}
          showBorder={false}
        />

        <BoardLetterProductTable
          readOnly={IS_READ_ONLY}
          showRemove={false}
          showBorder={false}
        />

        {/* Footer Totals & Bank Details */}
        <FooterTotals />

        {/* Signatures */}
        <SignatureSection />
      </div>

      {/* Quotation Status */}
      <QuotationStatus
        quotationStatus={quotationStatus}
        setQuotationStatus={setQuotationStatus}
        handleStatusSave={handleStatusSave}
      />
    </div>
  );
};

export default Quotation;