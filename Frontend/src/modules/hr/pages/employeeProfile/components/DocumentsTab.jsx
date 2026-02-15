import React from "react";
import { FileText } from "lucide-react"; // ✅ FIXED import

function DocumentsTab({ employee }) {
  const renderValue = (val) => {
    if (!val) return "N/A";
    if (typeof val === "object") {
      return val.name || val.email || JSON.stringify(val);
    }
    return val;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
        <FileText className="w-6 h-6 mr-2 text-gray-600" />
        Documents
      </h2>

      {employee?.documents?.length > 0 ? (
        <div className="space-y-2">
          {employee.documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center justify-between border-b pb-2 last:border-b-0"
            >
              <span className="text-sm font-medium text-gray-800">
                {renderValue(doc.type)}
              </span>

              <a
                href={doc.public_url || doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-md hover:bg-gray-900 transition-colors duration-200">
                  View
                </span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic border border-dashed border-gray-300 p-3 rounded-lg text-center">
          No documents uploaded yet.
        </p>
      )}
    </div>
  );
}

export default DocumentsTab;
