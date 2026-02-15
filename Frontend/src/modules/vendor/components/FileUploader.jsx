import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const ExcelUploader = ({ onUpload, clearSignal }) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const expectedFields = [
    "productName", "productCode", "description", "brand",
    "size", "unitType", "inStock", "rateUnit","category","gstPercent",
  ];

  const handleFileUpload = (e) => {
   const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate headers
        if (jsonData.length === 0) {
          throw new Error("Empty file.");
        }

        const headers = Object.keys(jsonData[0]);
        const isValid = expectedFields.every((field) =>
          headers.includes(field)
        );

        if (!isValid) {
          throw new Error("Excel headers do not match expected format.");
        }

        onUpload(jsonData);
        toast.success("Excel uploaded!");
      } catch (error) {
        // Clear the input if invalid
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFileName("");
        toast.error(error.message || "Invalid file format.");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Listen to clear signal from parent
  React.useEffect(() => {
    if (clearSignal) {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset input field
      }
      setFileName("");
    }
  }, [clearSignal]);

  return (
<>
   <div className="inline-block">
      <label
        htmlFor="excel-upload"
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400 text-white hover:bg-orange-500 rounded-md text-sm font-medium cursor-pointer transition"
      >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    
 {fileName ? "Change File" : " Excel File"}
      </label>

      <input
        id="excel-upload"
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {fileName && (
        <p className="mt-2 text-xs text-gray-700 text-center font-medium truncate max-w-[180px]">
          ✅ {fileName}
        </p>
      )}
    </div>

</>

  );
};

export default ExcelUploader;
