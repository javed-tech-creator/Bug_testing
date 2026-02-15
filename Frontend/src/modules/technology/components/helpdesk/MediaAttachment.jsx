import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {Download, X } from "lucide-react"; // ya jo bhi icons lib use kar rahe ho


const MediaAttachment = ({
  isOpen,
  onClose,
  attachment, // { url, name, type }
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  if (!isOpen || !attachment) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(attachment.url, { mode: "cors" });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = attachment.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative p-4 max-h-[90vh] overflow-y-auto">
        {/* Close + Download buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`p-2 rounded-full shadow-md transition-all duration-200 cursor-pointer
              ${
                isDownloading
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            title="Download"
          >
            {isDownloading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </button>

          {/* Close button */}
          <button
            onClick={() => {
              onClose();
              setIsMediaLoading(true); // reset loader
            }}
            className="p-2 rounded-full shadow-md transition-all duration-200 
              bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Loader */}
        {isMediaLoading && (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-solid"></div>
          </div>
        )}

        {/* Media */}
        {attachment.type.startsWith("image") ? (
          <img
            src={attachment.url}
            alt={attachment.name}
            className={`mx-auto rounded-lg transition-opacity duration-300 max-w-full ${
              isMediaLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsMediaLoading(false)}
          />
        ) : (
          <video
            src={attachment.url}
            controls
            className={`mx-auto rounded-lg transition-opacity duration-300 max-w-full ${
              isMediaLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoadedData={() => setIsMediaLoading(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MediaAttachment;
