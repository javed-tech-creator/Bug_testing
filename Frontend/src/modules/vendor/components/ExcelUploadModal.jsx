import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import ExcelUploader from "./FileUploader";
import ShowFileUpload from "./ShowFileUpload";
import { toast } from "react-toastify";
import { useUploadBulkProductsMutation } from "@/api/vendor/product.api";
const expectedFields = [
  "productName",
  "productCode",
  "description",
  "brand",
  "size",
  "unitType",
    "inStock",
  "rateUnit",
  "gstPercent",
  "category",
];

const sampleData = {
  productName: "LED TV",
  productCode: "TV123",
  description: "43 inch Smart TV",
  brand: "Samsung",
  size: "43",
  unitType: "pcs",
    inStock:"243",
  rateUnit: "27999",
  gstPercent:"18",
  category:"Neon",
};

const ExcelUploadModal = ({ isOpen, onClose }) => {
  const [uploadFile, setUploadFile] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);

  const [
    uploadBulkProducts,
    {
      data: BulkProducts,
      error: BulkProductsError,
      isLoading: BulkProductsLoading,
      isSuccess: BulkProductsLoadingSuccess,
    },
  ] = useUploadBulkProductsMutation();

  const handleExcelUpload = (data) => {
    setUploadFile(data);
    console.log("Uploaded Data:", data);
    onClose();
    setShowModal(true);
    setClearSignal(false);
  };
  const handleExcelSubmit = async(data) => {
   try {
       await uploadBulkProducts(data).unwrap();
      if(BulkProductsLoadingSuccess){
      toast.success("Products uploaded successfully!");
      setShowModal(false);
      setUploadFile([]);
      setClearSignal(true);
      }else if(BulkProductsError){
          toast.error(
        BulkProductsError?.data?.message ||
          "❌ Failed to upload products. Please check file format."
      );
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          "❌ Failed to upload products. Please check file format."
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUploadFile([]);
    setClearSignal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                📄 Upload Product Excel Sheet
              </Dialog.Title>
              <button
                onClick={onClose}
                className="cursor-pointer hover:bg-gray-300 rounded-full p-1 text-gray-600 hover:text-red-500"
              >
                <X className="w-5 h-5 " />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Your Excel file must include the following format:
            </p>

            {/* Table Preview */}
            <div className="overflow-auto rounded-md border border-gray-200 mb-4">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    {expectedFields.map((field) => (
                      <th
                        key={field}
                        className="px-4 py-2 font-semibold text-gray-700 text-center"
                      >
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    {expectedFields.map((field) => (
                      <td key={field} className="px-4 py-2 text-gray-800 text-center">
                        {sampleData[field]}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              ⚠️ Ensure all columns exist and are properly formatted before
              uploading.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
              <a
                href="\sample_product_format_final.xlsx"
                download
                className="inline-block bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
              >
                ⬇️ Download Sample
              </a>

              {/* Excel Upload Button */}
              <ExcelUploader
                onUpload={handleExcelUpload}
                clearSignal={clearSignal}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {showModal && (
        <ShowFileUpload
          uploadFile={uploadFile}
          onClose={handleCloseModal}
          onSubmit={handleExcelSubmit}
            isLoading={BulkProductsLoading}
        />
      )}
    </>
  );
};

export default ExcelUploadModal;
