import { Link } from "react-router-dom";
import { Input } from "../assign-view-page/ProductRequirementsDetailed";

const MockupStartedDetailsCard = ({
  heading,
  title,
  data,
  isStatus = false,
  onApprove,
  onModify,
}) => {
  return (
    <div className="border rounded bg-white space-y-4">
      {/* Header */}

      {heading && (
        <div className="flex justify-between items-center border-b bg-white rounded px-4 py-2">
          {/* Left Title */}
          <h2 className="text-lg font-semibold text-gray-800">{heading}</h2>
          {/* Right Buttons */}
          <div className="flex gap-2 ">
            <button className="px-4 py-2 text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
              Media File
            </button>
            {/* Action Buttons */}
            {isStatus && (
              <>
                {data.status === "pending" ? (
                  /* ACTION BUTTONS */
                  <div className="flex gap-2">
                    <button
                      onClick={onApprove}
                      className="bg-green-500 hover:bg-green-600
          text-white text-sm px-3 py-1.5 rounded"
                    >
                      Mark as Approved
                    </button>

                    <button
                      onClick={onModify}
                      className="bg-yellow-500 hover:bg-yellow-600
          text-white text-sm px-3 py-1.5 rounded"
                    >
                      Mark as Modification
                    </button>
                  </div>
                ) : (
                  /* STATUS BADGE */
                  <span
                    className={`px-4 py-1 rounded font-medium
          ${
            data.status === "approved"
              ? "bg-green-600 text-white"
              : "bg-yellow-600 text-white"
          }`}
                  >
                    {data.status === "approved"
                      ? "Approved"
                      : "Modification Required"}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="relative flex flex-wrap justify-between items-center px-2 gap-2">
        <div
          className={`flex items-center gap-2 px-2 ${!heading ? "py-4" : ""}`}
        >
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm ">
            {title} - {data.optionNo}
          </span>
          {data?.submissionDate && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
              Submission Date: {data.submissionDate}
            </span>
          )}
          {data?.selectionDate && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
              Selection Date: {data.selectionDate}
            </span>
          )}
        </div>

        {!heading && (
          <div className="absolute right-5">
            <button className="px-4 py-2   text-sm font-medium rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
              Media File
            </button>
          </div>
        )}

        <div className="absolute right-3 top-0 flex gap-2">
          {data?.approved && (
            <span className="py-1 px-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 border text-sm">
              Approved By Client
            </span>
          )}

          {data?.selected && (
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Selected By Client
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* Left Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Design Title" value={data.designTitle} />
            <Input label="Font Name" value={data.fontName} />
            <Input label="Colors Name" value={data.colors} />
            <Input label="Lit Colors Name" value={data.litColors} />
          </div>

          {/* Size */}
          <div>
            <h4 className="font-semibold mb-2 border-b pb-2">
              Size Specification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Width" value={data.width} />
              <Input label="Height" value={data.height} />
              <Input label="Depth" value={data.depth} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageBox
            src={data.designImage}
            label={`Design Option - ${data.optionNo}`}
          />
          <ImageBox src={data.assetImage} label="Supporting Assets" />
        </div>
      </div>

      {/* Description */}
      <div className="px-4">
        <label className="font-medium text-sm">Short Description</label>
        <textarea
          readOnly
          rows={1}
          value={data.description}
          className="w-full border rounded px-3 py-2 bg-gray-50"
        />
      </div>
      {data.clientFeedback && (
        <div className="px-4 pb-4 space-y-2">
          <h4 className="font-bold text-sm text-gray-700 border-b pb-2">
            Client Feedback
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date */}
            <Input label="Date" value={data.clientfeedbackDate} readOnly />

            {/* Feedback */}
            <div className="md:col-span-3">
              <label className="text-sm font-semibold text-gray-900">
                Feedback
              </label>
              <textarea
                readOnly
                value={data.clientFeedback}
                rows={1}
                className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-50
                     resize-none h-[42px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MockupStartedDetailsCard;
const ImageBox = ({ src, label }) => {
  return (
    <div className="border rounded-md p-3">
      <p className="text-sm font-medium mb-2">{label}</p>

      {isImageFile(src) && (
        <img
          src={src}
          alt={label}
          className="w-full h-48 object-contain rounded border"
        />
      )}

      {isCDRFile(src) && (
        <div className="flex flex-col items-center justify-center h-48 border rounded bg-gray-50">
          <img src="/cdr-icon.png" alt="CDR File" className="w-16 mb-2" />
          <p className="text-xs text-gray-600 mb-2">CorelDRAW File</p>

          <Link
            to={src}
            target="_blank"
            download
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            Download CDR
          </Link>
        </div>
      )}

      {!isImageFile(src) && !isCDRFile(src) && (
        <p className="text-sm text-gray-500">File preview not available</p>
      )}
    </div>
  );
};

const isCDRFile = (file) => {
  if (!file) return false;
  return /\.cdr$/i.test(file);
};

const isImageFile = (file) => {
  if (!file) return false;

  // agar CDR hai to image nahi
  if (isCDRFile(file)) return false;

  // http / https URL ko image treat karo
  if (file.startsWith("http")) return true;

  return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
};
