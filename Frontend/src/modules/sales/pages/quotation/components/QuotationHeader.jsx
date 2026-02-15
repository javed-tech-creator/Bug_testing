import { ArrowLeft } from "lucide-react";

const QuotationHeader = ({ navigate }) => {
  return (
    <div className="flex justify-between mb-6 bg-white p-3 rounded-lg border shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border rounded-md bg-gray-50 hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Quotation</h1>
      </div>

      <div className="flex gap-3">
        <button
          disabled
          className="px-4 py-2 border rounded text-sm cursor-not-allowed opacity-60"
        >
          Saved as Draft
        </button>

        <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
          Print
        </button>

        <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default QuotationHeader;