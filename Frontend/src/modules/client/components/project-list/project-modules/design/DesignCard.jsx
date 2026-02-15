import { useState, useRef } from "react";
import ModificationModal from "./ModificationModal";

export default function DesignCard({
  option = "Design Option",
  imageSrc,
  selected,
  disabled,

  onSelect,
  onReject,
  onModify,
}) {
  const [openModification, setOpenModification] = useState(false);
  const [remark, setRemark] = useState("");
  const [imgError, setImgError] = useState(false);

  // 🔒 LOCAL LOCK (very important)
  const actionLockRef = useRef(false);

  /* ===================== SAFE ACTION HANDLERS ===================== */

  const safeSelect = () => {
    if (disabled || actionLockRef.current) return;
    actionLockRef.current = true;
    onSelect?.();
  };

  const safeReject = () => {
    if (disabled || actionLockRef.current) return;
    actionLockRef.current = true;
    onReject?.(remark);
  };

  const safeModify = (remark, file) => {
    if (disabled || actionLockRef.current) return;
    actionLockRef.current = true;
    onModify?.(remark, file);
  };

  return (
    <div className="w-full border border-green-500 p-3 rounded-sm overflow-hidden bg-white shadow-sm text-[11px]">
      {/* ================= IMAGE ================= */}
      <div className="relative">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={option}
            className="h-36 w-full object-cover bg-gray-200"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-36 w-full flex items-center justify-center bg-gray-300 text-gray-400">
            Image not available
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white px-2 py-1 font-medium text-[11px]">
          {option}
        </div>
      </div>

      {/* ================= SPECS ================= */}
      <div className="bg-gray-50 p-2 space-y-1 text-gray-700">
        <SpecRow label="Dimensions" value="12’ x 4’" />
        <SpecRow label="Font Style" value="Inter Tight (Bold)" />
        <SpecRow label="Material" value="Acrylic Face" />
        <SpecRow label="Lighting" value="Halo Backlit (Warm)" />
        <SpecRow label="Color" value="Red, Yellow" />
      </div>

      {/* ================= DESIGNER AUDIO ================= */}
      <div className="px-2 py-1 border-t text-green-600 flex items-center gap-1 text-[11px] cursor-pointer">
        ▶ Play Designer's Explanation
      </div>

      {/* ================= REMARK ================= */}
      <div className="p-2">
        <textarea
          placeholder="Add remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full border rounded p-1 text-[11px]"
          rows={2}
          disabled={disabled || actionLockRef.current}
        />
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="p-2 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={safeSelect}
            disabled={disabled || actionLockRef.current || selected}
            className="flex-1 bg-green-600 text-white py-1 rounded text-[11px] font-medium disabled:opacity-50"
          >
            ✔ Select
          </button>

          <button
            onClick={safeReject}
            disabled={disabled || actionLockRef.current}
            className="flex-1 border border-red-500 text-red-500 py-1 rounded text-[11px] font-medium disabled:opacity-50"
          >
            ✖ Reject
          </button>
        </div>

        <button
          onClick={() => {
            if (disabled || actionLockRef.current) return;
            setOpenModification(true);
          }}
          disabled={disabled || actionLockRef.current}
          className="w-full bg-orange-500 text-white py-1 rounded text-[11px] font-medium disabled:opacity-50"
        >
          ✎ Modification
        </button>
      </div>

      {/* ================= MODIFICATION MODAL ================= */}
      {openModification && (
        <ModificationModal
          onClose={() => setOpenModification(false)}
          onSubmit={(remark, file) => {
            safeModify(remark, file);
            setOpenModification(false);
          }}
        />
      )}
    </div>
  );
}

/* ===================== SMALL COMPONENT ===================== */

function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
