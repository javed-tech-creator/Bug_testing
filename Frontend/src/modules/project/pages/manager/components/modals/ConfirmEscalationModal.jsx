import React from "react";
import { AlertTriangle, X, ArrowRight } from "lucide-react";

export default function ConfirmEscalationModal({
  open,
  from = "Production",
  to = "Design Dept",
  reason,
  onChangeReason,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[540px] rounded-lg bg-white shadow-2xl">
        
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Confirm Escalation
            </h3>
          </div>

          <button
            onClick={onCancel}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} className="text-red-500" />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="px-6 py-5 space-y-6">

          {/* FROM → TO */}
          <div className="flex items-center justify-center gap-4">
            <div className="min-w-[170px] rounded-md border bg-slate-50 px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                From
              </p>
              <p className="text-sm font-medium text-slate-800">
                {from}
              </p>
            </div>

            <ArrowRight className="text-slate-400" size={18} />

            <div className="min-w-[170px] rounded-md border bg-blue-50 px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                To
              </p>
              <p className="text-sm font-medium text-blue-700">
                {to}
              </p>
            </div>
          </div>

          {/* REASON */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Reason for Escalation <span className="text-red-500">*</span>
            </label>

            <textarea
              value={reason}
              onChange={(e) => onChangeReason(e.target.value)}
              rows={4}
              placeholder="Type reason for escalation"
              className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-md border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={!reason?.trim()}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <AlertTriangle size={14} />
            Confirm Escalation
          </button>
        </div>
      </div>
    </div>
  );
}
