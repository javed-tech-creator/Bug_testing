import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  Volume2,
  X,
  Maximize2,
  Ruler,
  Type,
  Palette,
  Zap,
  Download,
  FileText,
  Paperclip,
} from "lucide-react";
import PageHeader from "../../components/dynamic/PageHeader";
import { Link } from "react-router-dom";

/* ===============================
   DUMMY DESIGN DATA
================================ */
const designOptions = [
  {
    id: 1,
    title: "Modern LED Signage",

    description:
      "A sleek modern LED signage design suitable for storefront branding and high visibility.",

    sizeSpecification: {
      width: "6ft",
      height: "3ft",
      depth: "4inch",
    },

    font: "Helvetica Bold",
    color: "Blue & White",
    lighting: "RGB LED",

    //  only URL
    designOption:
      "https://cdn.example.com/design-options/modern-led-signage.ai",

    //  only URL (any file type)
    supportingAssets:
      "https://cdn.example.com/supporting-assets/modern-led-assets.zip",
    media: "https://cdn.example.com/media/modern-led-promo-video.mp4",

    status: "pending",
  },

  {
    id: 2,
    title: "Acrylic Letter Board",

    description:
      "Premium acrylic letter board with a luxurious finish for indoor branding.",

    sizeSpecification: {
      width: "4ft",
      height: "2ft",
      depth: "3inch",
    },

    font: "Arial Black",
    color: "Red & Gold",
    lighting: "Warm White LED",

    designOption:
      "https://drive.google.com/file/d/acrylic-letter-board-design.pdf",

    supportingAssets: "https://figma.com/file/acrylic-letter-board-mockup",
    media: "https://cdn.example.com/media/modern-led-promo-video.mp4",

    status: "selected",
  },

  {
    id: 3,
    title: "Neon Style Sign",

    description:
      "Creative neon-style signage perfect for cafes and entertainment venues.",

    sizeSpecification: {
      width: "5ft",
      height: "2.5ft",
      depth: "5inch",
    },

    font: "Custom Script",
    color: "Pink & Purple",
    lighting: "Neon Effect",

    designOption: "https://cdn.example.com/design-options/neon-sign-design.svg",

    supportingAssets:
      "https://cdn.example.com/supporting-assets/neon-installation-guide.pdf",
    media: "https://cdn.example.com/media/modern-led-promo-video.mp4",

    status: "rejected",
  },
];

/* ===============================
   MAIN COMPONENT
================================ */
const DesignPage = () => {
  const [designs, setDesigns] = useState(designOptions);
  const [showModal, setShowModal] = useState(false);
  const [activeDesign, setActiveDesign] = useState(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  /* ===============================
     HANDLERS
  ================================ */
  const updateStatus = (id, status) => {
    setDesigns((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const openModification = (design) => {
    setActiveDesign(design);
    setShowModal(true);
  };

  const submitModification = () => {
    console.log("Modification Request:", {
      designId: activeDesign.id,
      reason,
      comment,
    });

    updateStatus(activeDesign.id, "modification_requested");

    setShowModal(false);
    setReason("");
    setComment("");
  };

  return (
    <div className="">
      <PageHeader title="Design Options" />

      {/* ================= DESIGN CARDS ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            className="group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* TOP DOWNLOAD LABELS */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200">
              <a
                href={design.designOption}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <FileText size={18} />
                Design File
                <Download size={16} />
              </a>

              <a
                href={design.supportingAssets}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Paperclip size={18} />
                Supporting Assets
                <Download size={16} />
              </a>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {design.title}
                </h3>

                {/* Status Badge */}
                {design.status !== "pending" && (
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                      design.status === "selected"
                        ? "bg-emerald-500 text-white"
                        : design.status === "rejected" ?
                          "bg-red-500 text-white"
                          : "bg-yellow-500 text-white"
                    }`}
                  >
                    {design.status.toUpperCase()}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600">{design.description}</p>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <Ruler size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Size</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {design.sizeSpecification.width} ×{" "}
                      {design.sizeSpecification.height} ×{" "}
                      {design.sizeSpecification.depth}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <Type size={16} className="text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Font</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {design.font}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <Palette size={16} className="text-pink-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Color</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {design.color}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <Zap size={16} className="text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      Lighting
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {design.lighting}
                    </p>
                  </div>
                </div>
              </div>

              {/* MEDIA BUTTON */}
              <a
                href={design.media}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 text-sm font-semibold rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 hover:shadow-md"
              >
                <Volume2 size={18} />
                Play Media
              </a>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateStatus(design.id, "selected")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition"
                >
                  <CheckCircle size={18} />
                  Select
                </button>

                <button
                  onClick={() => updateStatus(design.id, "rejected")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>

              <button
                onClick={() => openModification(design)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition"
              >
                <Edit size={18} />
                Request Modification
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODIFICATION MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h3 className="text-lg font-bold mb-4">Request Modification</h3>

            {/* REASON */}
            <label className="text-sm font-semibold">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded p-2 mb-4 mt-1"
            >
              <option value="">Select reason</option>
              <option>Change Color</option>
              <option>Change Font</option>
              <option>Dimension Issue</option>
              <option>Other</option>
            </select>

            {/* COMMENT */}
            <label className="text-sm font-semibold">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              placeholder="Explain required changes..."
            />

            {/* SUBMIT */}
            <button
              onClick={submitModification}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignPage;
