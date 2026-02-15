import { jsPDF } from "jspdf";
import * as Icons from "lucide-react";

export default function InvoiceDownload({ invoice }) {
  const handleDownloadInvoice = (invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 14, 18);

    const amountText = invoice.amount.replace("₹", "INR ");
    const invoiceNumber = invoice?.no || invoice?.id;
    const designsNumber = invoice?.designsNo || invoice?.designNo;
    const numberLabel = invoiceNumber ? "Invoice No" : "Designs No";
    const numberValue = invoiceNumber || designsNumber || "N/A";

    doc.setFontSize(12);
    doc.text(`${numberLabel}: ${numberValue}`, 14, 30);
    doc.text(`Date: ${invoice.date}`, 14, 38);
    doc.text(`Amount: ${amountText}`, 14, 46);
    doc.text(`Status: ${invoice.status}`, 14, 54);

    const safeName = String(numberValue).replace(/\s+/g, "-");
    doc.save(`${safeName}.pdf`);
  };

  return (
    <button
      onClick={() => handleDownloadInvoice(invoice)}
      className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center cursor-pointer hover:bg-blue-200 transition-colors"
    >
      <Icons.Download size={20} />
    </button>
  );
}
