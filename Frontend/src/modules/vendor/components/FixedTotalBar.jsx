import { FaSpinner } from "react-icons/fa";

const FixedTotalBar = ({ total, handleSaveAndPrint, handleDraft, invoiceloading, createDraftLoading }) => {
  return (
    <div className="w-full sticky -bottom-8 px-6 ">
      <div className="bg-white border-gray-300 shadow-md border-t px-6 py-3 flex justify-between items-center rounded-lg">
        
        {/* TOTAL on the left */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-bold text-sm">TOTAL</span>
          <span className="text-black font-bold text-lg">₹ {total.toFixed(2)}</span>
        </div>

        {/* Buttons on the right */}
        <div className="flex gap-4">
          {/* Save as Draft */}
          <button
            onClick={handleDraft}
            disabled={createDraftLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition 
              ${createDraftLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 cursor-pointer"}`}
          >
            {createDraftLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving Draft...
              </>
            ) : (
              "Save as Draft"
            )}
          </button>

          {/* Save & Print */}
          <button
            onClick={handleSaveAndPrint}
            disabled={invoiceloading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition 
              ${invoiceloading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 cursor-pointer"}`}
          >
            {invoiceloading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FixedTotalBar;
