import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  X,
  Plus,
  Maximize2,
  Ruler,
  Pencil,
  Image as ImageIcon,
  Map,
  ArrowUp,
} from "lucide-react";
import { Check } from "lucide-react";

// --- STATIC recce details ---
const STATIC_RECCE_DETAILS = {
  _id: "RECCE-VISUAL-001",
  clientProductId: "PROD-STATIC-001",
  visualDocumentation: [],
};

// --- IndexedDB Helper Functions ---
const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("RecceFilesDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };
  });
};

const saveFileToIndexedDB = async (productId, fileKey, fileData) => {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");

    const id = `${productId}_${fileKey}`;
    await store.put({ id, ...fileData });

    console.log(`💾 Saved to IndexedDB: ${id}`);
  } catch (error) {
    console.error("Error saving to IndexedDB:", error);
  }
};

const getFileFromIndexedDB = async (productId, fileKey) => {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(["files"], "readonly");
    const store = transaction.objectStore("files");

    const id = `${productId}_${fileKey}`;
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting from IndexedDB:", error);
    return null;
  }
};

const deleteFileFromIndexedDB = async (productId, fileKey) => {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");

    const id = `${productId}_${fileKey}`;
    await store.delete(id);

    console.log(`🗑️ Deleted from IndexedDB: ${id}`);
  } catch (error) {
    console.error("Error deleting from IndexedDB:", error);
  }
};

const SectionHeader = ({ title }) => (
  <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
    {title}
  </h3>
);

// --- Dynamic Upload Row Component ---
const UploadRow = ({
  label,
  fileKey,
  currentFile,
  onUpload,
  onRemove,
  attemptedNext,
  accept = "*/*",
  storageProductId,
  onAddField = () => {},
  isDynamic = false,
  showAddButton = true,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    console.log("📂 File input triggered for key:", fileKey);
    console.log("🧪 UploadRow props snapshot:", {
      fileKey,
      accept,
      storageProductId,
    });
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("📄 Selected file details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      console.log("🧾 Raw File Object:", file);

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Data = event.target.result;
          console.log("📦 Base64 Data Generated:", {
            fileKey,
            base64Length: base64Data?.length,
            previewSample: base64Data?.substring(0, 50),
          });

          const fileMetadata = {
            name: file.name,
            mimeType: file.type,
            size: file.size,
            preview: URL.createObjectURL(file), // lightweight preview
          };
          console.log("🗂️ File Metadata Stored in State:", fileMetadata);

          // Save to state (metadata only, no base64)
          onUpload(fileKey, fileMetadata);

          // Save base64 data to IndexedDB separately
          const productKey = storageProductId || "";

          if (productKey) {
            await saveFileToIndexedDB(productKey, fileKey, {
              name: file.name,
              mimeType: file.type,
              size: file.size,
              data: base64Data,
            });
            console.log("🧠 IndexedDB Payload Saved:", {
              productKey,
              fileKey,
              name: file.name,
              mimeType: file.type,
              size: file.size,
            });
          }

          console.log(`✅ File uploaded and saved: ${file.name}`);
        };

        reader.readAsDataURL(file);
      } catch (err) {
        console.log("❌ File upload failed for key:", fileKey);
        console.error("Upload Error:", err);
        onUpload(fileKey, null);
      }
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {/* File Input (Hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        {/* Display Box */}
        <div
          onClick={(e) => {
            // prevent click when clicking buttons
            if (e.target.closest("button")) return;
            (!currentFile || typeof currentFile === "object") &&
              fileInputRef.current.click();
          }}
          className={`flex-grow flex items-center bg-white border rounded px-3 py-2 cursor-pointer hover:bg-gray-50 transition 
    ${currentFile ? "border-green-200 bg-green-50" : "border-red-500"}
  `}
        >
          <UploadCloud
            className={`w-4 h-4 mr-2 ${
              currentFile ? "text-green-600" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs flex-grow truncate ${
              currentFile ? "text-green-700 font-medium" : "text-gray-400"
            }`}
          >
            {currentFile
              ? typeof currentFile === "object"
                ? currentFile.name
                : "File Uploaded"
              : "Upload File"}
          </span>
          <CheckCircle2
            className={`w-4 h-4 ${
              currentFile ? "text-green-500" : "text-gray-300"
            }`}
          />
        </div>

        {/* Actions */}
        {(currentFile || isDynamic) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(fileKey);
            }}
            className="bg-red-100 hover:bg-red-200 border border-red-200 text-red-600 p-2 rounded w-10 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {showAddButton && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAddField(fileKey);
            }}
            className="relative z-20 pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-10 flex items-center justify-center transition cursor-pointer"
          >
            <Plus className="w-5 h-5 pointer-events-none" />
          </button>
        )}
      </div>
      {!currentFile && attemptedNext && (
        <p className="text-xs text-red-500 mt-1">This field is required.</p>
      )}
    </div>
  );
};

const RequiredItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
    <Icon className="w-4 h-4 text-blue-500" />
    <span>{text}</span>
  </div>
);

// --- Main Component ---

const VisualDocumentation = () => {
  const navigate = useNavigate();
  // Get IDs from localStorage (same as ProductRequirements component)
  const projectId = localStorage.getItem("active_recce_project_id");
  const productId = localStorage.getItem("active_product_id");
  const [productInternalId, setProductInternalId] = useState(null);
  const [recceId, setRecceId] = useState(null);

  // Use static recce details
  const recceDetails = STATIC_RECCE_DETAILS;

  const storageProductId = productId || productInternalId || "STATIC_PRODUCT";

  useEffect(() => {
    setRecceId(recceDetails._id);
    localStorage.setItem("active_recce_detail_id", recceDetails._id);
  }, []);

  // Step tracking can be handled by parent component or router context

  const initialVisualData = {
    // Images
    mockup: null,
    size_height: null,
    size_length: null,
    size_depth: null,
    other_front: null,
    other_left: null,
    other_right: null,
    other_back: null,
    other_top: null,
    other_bottom: null,
    other_connection: null,
    other_nearby: null,
    other_highrise_bottom: null,
    other_highrise_view: null,
    // Videos
    vid_360: null,
    vid_mockup: null,
    vid_combined: null,
    vid_far_near: null,
    vid_connection: null,
    vid_size_height: null,
    vid_size_length: null,
    vid_size_depth: null,
  };

  // Helper to format a readable label from a key (for duplicated fields)
  const formatLabelFromKey = (key) => {
    const match = key.match(/_(\d+)$/);
    const index = match ? match[1] : null;

    const base = key.replace(/_\d+$/, "").replace(/_/g, " ").toUpperCase();

    return index ? `${base}_${index}` : base;
  };

  const [visualData, setVisualData] = useState(initialVisualData);

  // Add new upload field at the END of the group, not after the clicked key
  const handleAddField = (clickedKey) => {
    setVisualData((prev) => {
      let baseKey = clickedKey;

      const match = clickedKey.match(/^(.*)_(\d+)$/);
      if (match) {
        const possibleBase = match[1];
        if (Object.prototype.hasOwnProperty.call(prev, possibleBase)) {
          baseKey = possibleBase;
        }
      }

      let idx = 1;
      while (Object.prototype.hasOwnProperty.call(prev, `${baseKey}_${idx}`)) {
        idx++;
      }

      const newKey = `${baseKey}_${idx}`;

      return {
        ...prev,
        [newKey]: null,
      };
    });
  };
  const [attemptedNext, setAttemptedNext] = useState(false);

  // Metadata is maintained in state (visualData) and IndexedDB

  // Metadata is maintained in state only

  // Handlers
  const handleUpload = (key, fileName) => {
    setVisualData((prev) => ({ ...prev, [key]: fileName }));
  };

  const handleRemove = (key) => {
    const file = visualData[key];
    if (file?.preview) URL.revokeObjectURL(file.preview);

    setVisualData((prev) => {
      const updated = { ...prev };
      // If dynamic field (_1, _2, etc.) → REMOVE key completely
      if (/_(\d+)$/.test(key)) {
        delete updated[key];
      } else {
        // Base field → just reset value
        updated[key] = null;
      }
      return updated;
    });

    // Also remove from IndexedDB
    if (storageProductId) {
      deleteFileFromIndexedDB(storageProductId, key);
    }
  };

  const handleNextStep = async () => {
    setAttemptedNext(true);

    const uploadedCount = Object.values(visualData).filter(Boolean).length;
    if (uploadedCount < 1) {
      toast.error("Please upload at least one visual file.");
      return;
    }

    toast.success("Visual documentation saved (static)");
    navigate("/recce/installation-step");
  };

  // --- DYNAMIC STEPPER COMPONENT ---
  const renderStepper = () => {
    const steps = [1, 2, 3, 4];
    const currentStep = 2;

    return (
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 
                  ${
                    isActive
                      ? "bg-blue-600 text-white ring-2 ring-blue-200"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
              >
                {isCompleted ? <Check size={16} /> : step}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-1 mx-1 rounded transition-colors duration-300 
                    ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header & Stepper */}
      <div className="max-w-full mx-auto bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            Step 2 – Visual Documentation
          </h1>
        </div>

        {renderStepper()}
      </div>

      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Info Boxes */}
        {/* Box 1: Required */}
        <div className="bg-white p-5 rounded-lg shadow-sm h-full">
          <SectionHeader title="Required" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <RequiredItem icon={UploadCloud} text="Upload Photo (Minimum 6)" />
            <RequiredItem icon={Maximize2} text="Full Front View Photo" />
            <RequiredItem
              icon={Ruler}
              text="Measurement Photos (Hight/Width)"
            />
            <RequiredItem icon={ImageIcon} text="Left Angle Photo" />
            <RequiredItem icon={Pencil} text="Marking Photo" />
            <RequiredItem icon={ImageIcon} text="Right Angle Photo" />
            <RequiredItem icon={Map} text="Surrounding Area Photo" />
            <RequiredItem icon={ImageIcon} text="Wall Texture Close-Up" />
            <RequiredItem icon={ArrowUp} text="Hight Perspective Photo" />
          </div>
        </div>

        {/* Box 2: Guidelines */}
        <div className="bg-white p-5 rounded-lg shadow-sm h-full">
          <SectionHeader title="Guidelines" />
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5 ml-1">
            <li>Capture full wall area.</li>
            <li>Make measurement reference.</li>
            <li>Ensure clarity.</li>
            <li>Required: 360° Walkaround Video (30-60 Sec).</li>
            <li>Optional: Client Explanation Video.</li>
            <li>Optional: Obstruction explanation video.</li>
          </ul>
        </div>

        {/* --- LEFT COLUMN: IMAGE SECTION --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm space-y-6">
          <SectionHeader title="Image Section" />

          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-3">
              Upload Mockup
            </h4>
            <UploadRow
              label=""
              fileKey="mockup"
              accept="image/*"
              currentFile={visualData.mockup}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("mockup_")).length === 0
              }
            />
            {/* Duplicated fields for mockup */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("mockup_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  accept="image/*"
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
          </div>

          {/* ... Other Image Upload Rows (Keeping same structure) ... */}
          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-3">
              Size Images
            </h4>
            <UploadRow
              label="Height Image"
              fileKey="size_height"
              currentFile={visualData.size_height}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("size_height_")).length === 0
              }
            />
            {/* Duplicated fields for size_height */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("size_height_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Length Image"
              fileKey="size_length"
              currentFile={visualData.size_length}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("size_length_")).length === 0
              }
            />
            {/* Duplicated fields for size_length */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("size_length_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Thickness/Depth Image"
              fileKey="size_depth"
              currentFile={visualData.size_depth}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("size_depth_")).length === 0
              }
            />
            {/* Duplicated fields for size_depth */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("size_depth_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-3">
              Other Images
            </h4>
            <UploadRow
              label="Front Image"
              fileKey="other_front"
              currentFile={visualData.other_front}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_front_")).length === 0
              }
            />
            {/* Duplicated fields for other_front */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_front_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Left Image"
              fileKey="other_left"
              currentFile={visualData.other_left}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_left_")).length === 0
              }
            />
            {/* Duplicated fields for other_left */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_left_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Right Image"
              fileKey="other_right"
              currentFile={visualData.other_right}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_right_")).length === 0
              }
            />
            {/* Duplicated fields for other_right */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_right_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Back Image (If Needed)"
              fileKey="other_back"
              currentFile={visualData.other_back}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_back_")).length === 0
              }
            />
            {/* Duplicated fields for other_back */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_back_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Top Image"
              fileKey="other_top"
              currentFile={visualData.other_top}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_top_")).length === 0
              }
            />
            {/* Duplicated fields for other_top */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_top_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Bottom Image"
              fileKey="other_bottom"
              currentFile={visualData.other_bottom}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_bottom_")).length === 0
              }
            />
            {/* Duplicated fields for other_bottom */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_bottom_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Connection Point Image"
              fileKey="other_connection"
              currentFile={visualData.other_connection}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_connection_")).length === 0
              }
            />
            {/* Duplicated fields for other_connection */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_connection_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="Near By Area of Product / Signage Image"
              fileKey="other_nearby"
              currentFile={visualData.other_nearby}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_nearby_")).length === 0
              }
            />
            {/* Duplicated fields for other_nearby */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_nearby_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="From Bottom on Top Image (In High Rise)"
              fileKey="other_highrise_bottom"
              currentFile={visualData.other_highrise_bottom}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_highrise_bottom_")).length === 0
              }
            />
            {/* Duplicated fields for other_highrise_bottom */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_highrise_bottom_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
            <UploadRow
              label="From Viewing Area Image (In High Rise)"
              fileKey="other_highrise_view"
              currentFile={visualData.other_highrise_view}
              onUpload={handleUpload}
              onRemove={handleRemove}
              attemptedNext={attemptedNext}
              storageProductId={storageProductId}
              onAddField={handleAddField}
              showAddButton={
                Object.keys(visualData).filter((k) => k.startsWith("other_highrise_view_")).length === 0
              }
            />
            {/* Duplicated fields for other_highrise_view */}
            {Object.keys(visualData)
              .filter((k) => k.startsWith("other_highrise_view_"))
              .map((k, index, arr) => (
                <UploadRow
                  key={k}
                  label={formatLabelFromKey(k)}
                  fileKey={k}
                  currentFile={visualData[k]}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  attemptedNext={attemptedNext}
                  storageProductId={storageProductId}
                  onAddField={handleAddField}
                  isDynamic={true}
                  showAddButton={index === arr.length - 1}
                />
              ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: VIDEO SECTION --- */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm flex-grow">
            <SectionHeader title="Video Section" />

            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-800 mb-3">
                Upload 360° Walkaround Video
              </h4>
              <UploadRow
                label="360° Walkaround Video"
                fileKey="vid_360"
                accept="video/*"
                currentFile={visualData.vid_360}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_360_")).length === 0
                }
              />
              {/* Duplicated fields for vid_360 */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_360_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
            </div>

            {/* ... Other Videos ... */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-800 mb-3">
                Other Videos
              </h4>
              <UploadRow
                label="Mockup video"
                fileKey="vid_mockup"
                currentFile={visualData.vid_mockup}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_mockup_")).length === 0
                }
              />
              {/* Duplicated fields for vid_mockup */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_mockup_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
              <UploadRow
                label="Left, Right, Top, Bottom & Back Combined Video"
                fileKey="vid_combined"
                currentFile={visualData.vid_combined}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_combined_")).length === 0
                }
              />
              {/* Duplicated fields for vid_combined */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_combined_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
              <UploadRow
                label="Far to Near Video"
                fileKey="vid_far_near"
                currentFile={visualData.vid_far_near}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_far_near_")).length === 0
                }
              />
              {/* Duplicated fields for vid_far_near */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_far_near_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
              <UploadRow
                label="Connection Point Video"
                fileKey="vid_connection"
                currentFile={visualData.vid_connection}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_connection_")).length === 0
                }
              />
              {/* Duplicated fields for vid_connection */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_connection_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-800 mb-3">
                Size Videos
              </h4>
              <UploadRow
                label="Height Videos"
                fileKey="vid_size_height"
                currentFile={visualData.vid_size_height}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_size_height_")).length === 0
                }
              />
              {/* Duplicated fields for vid_size_height */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_size_height_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
              <UploadRow
                label="Length Videos"
                fileKey="vid_size_length"
                currentFile={visualData.vid_size_length}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_size_length_")).length === 0
                }
              />
              {/* Duplicated fields for vid_size_length */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_size_length_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
              <UploadRow
                label="Thickness/Depth Videos"
                fileKey="vid_size_depth"
                currentFile={visualData.vid_size_depth}
                onUpload={handleUpload}
                onRemove={handleRemove}
                attemptedNext={attemptedNext}
                storageProductId={storageProductId}
                onAddField={handleAddField}
                showAddButton={
                  Object.keys(visualData).filter((k) => k.startsWith("vid_size_depth_")).length === 0
                }
              />
              {/* Duplicated fields for vid_size_depth */}
              {Object.keys(visualData)
                .filter((k) => k.startsWith("vid_size_depth_"))
                .map((k, index, arr) => (
                  <UploadRow
                    key={k}
                    label={formatLabelFromKey(k)}
                    fileKey={k}
                    currentFile={visualData[k]}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    attemptedNext={attemptedNext}
                    storageProductId={storageProductId}
                    onAddField={handleAddField}
                    isDynamic={true}
                    showAddButton={index === arr.length - 1}
                  />
                ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex justify-end gap-3">
            <button
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded text-sm font-medium transition cursor-pointer"
              onClick={() => navigate("/recce/product-requirements")}
            >
              Previous
            </button>
            <button
              onClick={() =>
                navigate(
                  `/recce/recce-details/${localStorage.getItem(
                    "active_recce_project_id",
                  )}`,
                )
              }
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            {/* Use projectId for correct recce-details route */}
            {/* Assuming projectId is stored like other steps */}
            <button
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium transition ${
                false ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleNextStep}
              disabled={false}
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDocumentation;
