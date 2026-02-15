import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentWithMedia from "../recording/CommentWithMedia";
import { useSelector } from "react-redux";
import { useCreateMeasurementQuotationMutation } from "@/api/design/common_workflow/view-design-option.api";
import { toast } from "react-toastify";

export default function DesignMeasurementForm() {
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  const [designFile, setDesignFile] = useState(null);
  const [supportingAsset, setSupportingAsset] = useState(null);

  const [createMeasurementQuotation, { isLoading }] =
    useCreateMeasurementQuotationMutation();



  /* ================= Board State ================= */
  const [board, setBoard] = useState({
    thickness: "",
    length: "",
    height: "",
    size: "",
  });

  /* ================= Letters State ================= */
  const [letters, setLetters] = useState([
    { letter: "", length: "", height: "", thickness: "", unit: "" },
  ]);

  const addLetterRow = () => {
    setLetters([
      ...letters,
      { letter: "", length: "", height: "", thickness: "", unit: "" },
    ]);
  };

  const removeLetterRow = (index) => {
    if (letters.length === 1) return;
    setLetters(letters.filter((_, i) => i !== index));
  };

  const updateLetter = (index, field, value) => {
    const updated = [...letters];
    updated[index][field] = value;
    setLetters(updated);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log({
  //     board,
  //     letters,
  //     description: e.target.description.value,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // ===== IDs (replace with real values) =====
      formData.append("design_mockup_id", "65f2a0c1b4d2a9e123456789");
      formData.append("design_option_id", "65f2a0c1b4d2a9e123456789");
      formData.append("design_request_id", "65f2a0c1b4d2a9e123456789");
      formData.append("design_assigned_id", "65f2a0c1b4d2a9e123456789");

      // ===== Board (OBJECT AS STRING) =====
      formData.append(
        "board",
        JSON.stringify({
          thickness: board.thickness,
          length: board.length,
          height: board.height,
          size: board.size,
        })
      );

      // ===== Remark =====
      formData.append("remark", comment);

      // ===== Letters (ARRAY FORMAT EXACT LIKE POSTMAN) =====
      letters.forEach((item, index) => {
        formData.append(`letters[${index}][letter]`, item.letter);
        formData.append(`letters[${index}][height]`, item.height);
        formData.append(`letters[${index}][length]`, item.length);
        formData.append(`letters[${index}][thickness]`, item.thickness);
        formData.append(`letters[${index}][unit]`, item.unit);
      });

      // ===== Files =====
      if (designFile) {
        formData.append("upload_measurement_file", designFile);
      }

      if (supportingAsset) {
        formData.append("upload_supporting_asset", supportingAsset);
      }

      // ===== Media (MULTIPLE FILES – SAME KEY) =====
      if (files?.length) {
        files.forEach((file) => {
          formData.append("media", file);
        });
      }

      // ===== API CALL =====
      const res = await createMeasurementQuotation({ data: formData }).unwrap();

      toast.success(res?.data?.message ?? res?.message ?? "Measurement submitted successfully");
      navigate(-1);
    } catch (error) {
      console.error("Measurement submit failed", error);
      toast.error(error?.error?.message ?? error?.data?.message ?? error?.message ?? "Failed to submit measurement");
    }
  };


  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/design/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-sm border shadow space-y-6 mt-4"
    >
      <h2 className="text-lg font-semibold">
        Upload Design Measurement For Quotation
      </h2>
      <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <FileInput
            label="Upload Design with Measurement"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            helperText="Images, PDF, Docs only"
            onChange={(e) => setDesignFile(e.target.files[0])}
          />
        </div>

        <div className="flex-1">
          <FileInput
            label="Upload Supporting Assets"
            accept="*/*"
            helperText="All file types supported"
            onChange={(e) => setSupportingAsset(e.target.files[0])}
          />
        </div>
      </div>

      {/* ================= Board Measurement ================= */}
      <div>
        <h3 className="font-medium mb-2 border-y py-2">
          Design Measurement of Board
        </h3>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-600">Thickness (MM)</label>
            <input
              type="number"
              placeholder="e.g. 3"
              value={board.thickness}
              onChange={(e) =>
                setBoard({ ...board, thickness: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Length (Inch)</label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={board.length}
              onChange={(e) => {
                const length = e.target.value;
                const size = length * board.height || "";
                setBoard({ ...board, length, size });
              }}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Height (Inch)</label>
            <input
              type="number"
              placeholder="e.g. 4"
              value={board.height}
              onChange={(e) => {
                const height = e.target.value;
                const size = board.length * height || "";
                setBoard({ ...board, height, size });
              }}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Size (Sq.Ft)</label>
            <input
              type="text"
              placeholder="Auto calculated"
              value={board.size}
              readOnly
              className="input bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* ================= Letters ================= */}
      <div>
        <h3 className="font-medium mb-2 border-y py-2">
          Design Measurement of Letters
        </h3>

        {letters.map((row, index) => (
          <div key={index} className="grid md:grid-cols-6 gap-4 mb-3 items-end">
            {/* Letter */}
            <div>
              <label className="text-sm text-gray-600">Letter / Logo</label>
              <input
                placeholder="A, B, Logo"
                value={row.letter}
                onChange={(e) => updateLetter(index, "letter", e.target.value)}
                className="input"
              />
            </div>

            {/* Length */}
            <div>
              <label className="text-sm text-gray-600">Length (inch)</label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={row.length}
                onChange={(e) => updateLetter(index, "length", e.target.value)}
                className="input"
              />
            </div>

            {/* Height */}
            <div>
              <label className="text-sm text-gray-600">Height (inch)</label>
              <input
                type="number"
                placeholder="e.g. 8"
                value={row.height}
                onChange={(e) => updateLetter(index, "height", e.target.value)}
                className="input"
              />
            </div>

            {/* Thickness */}
            <div>
              <label className="text-sm text-gray-600">Thickness (mm)</label>
              <input
                type="number"
                placeholder="e.g. 3"
                value={row.thickness}
                onChange={(e) =>
                  updateLetter(index, "thickness", e.target.value)
                }
                className="input"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm text-gray-600">Unit</label>
              <input
                placeholder=""
                value={row.unit}
                onChange={(e) => updateLetter(index, "unit", e.target.value)}
                className="input"
              />
            </div>

            {/* Remove Button */}
            <div>
              <label className="text-sm text-transparent">Action</label>
              <button
                type="button"
                disabled={letters.length === 1}
                onClick={() => removeLetterRow(index)}
                className={`px-3 py-2 rounded text-white text-sm w-full ${letters.length === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addLetterRow}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Letter
        </button>
      </div>

      {/* ================= Description ================= */}

      {/* Comment with Media */}
      <CommentWithMedia
        title="Short Description"
        placeholder="Type here..."
        value={comment}
        onChange={setComment}
        files={files}
        onFilesChange={setFiles}
      />

      {/* <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          border-radius: 0.375rem;
        }
      `}</style> */}

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          border-radius: 0.375rem;
        }
      `}</style>


      {/* button  */}
      <div className="flex justify-end gap-3 border p-4 rounded shadow mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded cursor-pointer"
        >
          Cancel
        </button>
        {userRole !== "manager" ? (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer"
          >
            Send To Manager
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2" />
  </div>
);

const FileInput = ({ label, helperText, ...props }) => (
  <div
    className="border-2 border-dashed border-gray-300 rounded-lg p-4
                  hover:border-blue-400 transition bg-gray-50"
  >
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="file"
      {...props}
      className="w-full text-sm
        file:mr-3 file:py-2 file:px-4
        file:border-0 file:rounded
        file:bg-blue-100 file:text-blue-700
        hover:file:bg-blue-200"
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);
