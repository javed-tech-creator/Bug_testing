
import { UploadCloud } from "lucide-react";
import CommentWithMedia from "../recording/CommentWithMedia";

const DesignModificationForm = ({
  index,
  data,
  onChange,
  onRemove,
  canRemove,
}) => {

//   const handleSubmit = () => {
//   const payload = {
//     productDetails: formData,
//     design: newDesign,
//   };

//   console.log("Payload ", payload);
// };

  return (
    <div className="border rounded bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">
         Design Version – {String(index + 1).padStart(2, "0")}
        </span>

        {canRemove && (
          <button
            onClick={() => onRemove(data.id)}
            className="text-red-500 text-sm border p-1 cursor-pointer bg-red-50 hover:bg-red-100 transition rounded-sm"
          >
            ❌
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Design Title & Font */}
        <div className="md:col-span-2">
           <Input
            label="Design Title"
            placeholder="Enter design title"
            value={data.designTitle}
            onChange={(e) => onChange(data.id, "designTitle", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
        <Input
            label="Font Name"
            placeholder="Enter font name"
            value={data.fontName}
            onChange={(e) => onChange(data.id, "fontName", e.target.value)}
          />
        </div>

        {/* Uploads */}
        <div className="md:col-span-2">
          <FileInput
            label="Upload Design Option"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            helperText="Images, PDF, Docs only"

            onChange={(e) =>
    onChange(data.id, "designFile", e.target.files[0])
  }


          />
        </div>

        <div className="md:col-span-2">
          <FileInput
            label="Upload Supporting Assets"
            accept="*/*"
            helperText="All file types supported"
             onChange={(e) =>
    onChange(data.id, "assetsFile", e.target.files[0])
  }
          />
        </div>

        {/* Colors */}
        <div className="md:col-span-2">
            <Input
            label="Colors Name"
            placeholder="e.g. Red, White"
            value={data.colors}
            onChange={(e) => onChange(data.id, "colors", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
         <Input
            label="Lit Colors Name"
            placeholder="e.g. Blue LED"
            value={data.litColors}
            onChange={(e) => onChange(data.id, "litColors", e.target.value)}
          />
        </div>
      </div>

      {/* Size */}
      <h4 className="font-semibold mt-3">Size Specification</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <Input
          label="Width"
          placeholder="in inch"
          value={data.width}
          onChange={(e) => onChange(data.id, "width", e.target.value)}
        />{" "}
        <Input
          label="Height"
          placeholder="in inch"
          value={data.height}
          onChange={(e) => onChange(data.id, "height", e.target.value)}
        />
        <Input
          label="Thickness"
          placeholder="in mm"
          value={data.depth}
          onChange={(e) => onChange(data.id, "thickness", e.target.value)}
        />
      </div>

      {/* Description + Media (Half / Half) */}
      {/* <div className="grid grid-cols-2 gap-5">
        <textarea
          rows={4}
          className="w-full border rounded-lg px-3 py-2 bg-gray-50"
          placeholder="Write short description of the design..."
          onChange={(e) => onChange(index, "description", e.target.value)}
        />
 
        <FileInput
          label="Upload Media (Audio / Video)"
          accept="audio/*,video/*"
          helperText="Only audio or video files allowed"
        />
      </div> */}

            {/* Comment with Media */}
      <div className="mt-4">
        <CommentWithMedia
          title="Short Description"
          placeholder="Type here..."
          value={data.description}
          onChange={(val) => onChange(data.id, "description", val)}
          files={data.files}
          onFilesChange={(files) => onChange(data.id, "files", files)}
        />
      </div>

    </div>
  );
};

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

export default DesignModificationForm;
