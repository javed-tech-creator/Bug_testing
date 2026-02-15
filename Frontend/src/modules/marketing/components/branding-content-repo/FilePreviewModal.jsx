// src/components/branding-content-repo/FilePreviewModal.jsx
import React, { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { FaSpinner } from "react-icons/fa"; // for spinner icon

const FilePreviewModal = ({ open, onClose, asset }) => {
  if (!open || !asset) return null;

  const { file, title } = asset;
  const [downloading, setDownloading] = useState(false);

  // 🔹 Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 🔹 Download Function
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || `${title || "file"}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  // 🔹 Render File Preview
  const renderPreview = () => {
    if (!file?.url) {
      return <p className="text-gray-500">No file available for preview</p>;
    }

    if (file.type?.startsWith("image/")) {
      return (
        <img
          src={file.url}
          alt={title}
          className="max-h-[80vh] max-w-full rounded-xl shadow-lg object-contain mx-auto"
        />
      );
    }

    if (file.type?.startsWith("video/")) {
      return (
        <video
          src={file.url}
          controls
          className="max-h-[80vh] w-full rounded-xl shadow-lg mx-auto"
        />
      );
    }

    if (file.type === "application/pdf") {
      return (
        <iframe
          src={file.url}
          title={title}
          className="w-full h-[80vh] rounded-xl border shadow-inner"
        ></iframe>
      );
    }

    return (
      <p className="text-gray-500 text-center">
        Preview not available for this file type.
      </p>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 animate-fadeIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {title || "File Preview"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                downloading
                  ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                  : "hover:bg-indigo-100 text-indigo-600"
              }`}
              title="Download file"
            >
              {downloading ? (
                <FaSpinner className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-100 text-red-500 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-6 flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
          {renderPreview()}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FilePreviewModal;
