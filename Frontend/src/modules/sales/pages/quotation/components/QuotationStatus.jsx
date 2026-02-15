const QuotationStatus = ({
  quotationStatus,
  setQuotationStatus,
  handleStatusSave,
}) => {
  return (
    <div className="max-w-full mx-auto bg-white p-6 mb-8 border shadow rounded-lg mt-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Quotation Status
      </h3>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="w-full md:w-64">
          <label className="block text-xs text-gray-500 mb-1 uppercase">
            Status
          </label>
          <select
            value={quotationStatus}
            onChange={(e) => setQuotationStatus(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="approved">Approved</option>
            <option value="modification">Modification</option>
          </select>
        </div>

        <button
          onClick={handleStatusSave}
          className="px-6 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
        >
          Save Status
        </button>
      </div>
    </div>
  );
};

export default QuotationStatus;