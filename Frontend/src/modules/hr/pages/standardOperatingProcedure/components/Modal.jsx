import React from "react";

const Modal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  console.log("Modal Data form modal:", data);

  const handleImageClick = (e) => {
    const src = e.target.src;
    const imgWindow = window.open(src, "_blank");
    imgWindow.focus();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* MODAL BOX */}
      <div className="relative rounded-md z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* HEADER */}
        <div className="sticky top-0 bg-black/95 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            SOP For : {data?.designationId?.title || "N/A"}
          </h2>
          <button
            className="text-white cursor-pointer hover:text-orange-500 transition-colors text-2xl leading-none"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-6 py-5  space-y-4">
          {/* TITLE */}
          <div className="border-l-4 border-orange-500 pl-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Title
            </p>
            <p className="text-base font-medium text-black">
              {data?.title || "-"}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="border-l-4 border-black pl-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Description
            </p>
            <p className="text-base text-gray-800 leading-relaxed">
              {data?.description || "-"}
            </p>
          </div>

          {/* IMAGES */}
          {Array.isArray(data?.files) && data.files.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                Attachments ({data.files.length})
              </p>

              <div className="grid grid-cols-3 gap-3">
                {data.files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square border-2 border-gray-200 overflow-hidden bg-gray-50 hover:border-orange-500 transition-colors">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${file.url}`}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={handleImageClick}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
