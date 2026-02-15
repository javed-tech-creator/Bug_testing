import React from "react";

function RequirementFilesModal({ open, onClose, lead }) {
  if (!open || !lead) return null;

  const getFileType = (url = "") => {
    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    if (["mp3", "wav", "aac", "m4a"].includes(ext)) return "audio";
    return "document";
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-4">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">
            Requirement Uploads – {lead.clientName}
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Files */}
        {lead.requirementFiles?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-auto">

            {lead.requirementFiles.map((file, idx) => {
              const fileUrl = file.public_url || file.url;
              const type = file.type || getFileType(fileUrl);

              return (
                <div
                  key={idx}
                  className="border rounded-md p-2 flex flex-col items-center bg-gray-50"
                >
                  {/* IMAGE */}
                  {type === "image" && (
                    <img
                      src={fileUrl}
                      alt={file.name || "requirement"}
                      className="w-full h-48 object-cover rounded cursor-pointer"
                      onClick={() => window.open(fileUrl, "_blank")}
                    />
                  )}

                  {/* VIDEO */}
                  {type === "video" && (
                    <video
                      controls
                      className="w-full h-48 rounded"
                      src={fileUrl}
                    />
                  )}

                  {/* AUDIO */}
                  {type === "audio" && (
                    <audio controls className="w-full">
                      <source src={fileUrl} />
                    </audio>
                  )}

                  {/* DOCUMENT */}
                  {type === "document" && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm mt-2"
                    >
                      📄 {file.name || "Open Document"}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No requirement files uploaded.
          </p>
        )}
      </div>
    </div>
  );
}

export default RequirementFilesModal;
