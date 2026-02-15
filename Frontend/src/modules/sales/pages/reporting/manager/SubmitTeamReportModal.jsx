import React, { useEffect, useState } from "react";

const SubmitTeamReportModal = ({
    open,
    onClose,
    onSubmit,
    loading,
    reportType = "morning",
}) => {
    const [remarks, setRemarks] = useState("");
    const [highlights, setHighlights] = useState("");
    const [challenges, setChallenges] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) {
            setRemarks("");
            setHighlights("");
            setChallenges("");
            setErrors({});
        }
    }, [open]);

    if (!open) return null;

    const validate = () => {
        const e = {};

        if (!remarks || remarks.trim().length < 10) {
            e.remarks = "Remarks must be at least 10 characters";
        }
        if (!highlights || highlights.trim().length < 10) {
            e.highlights = "Highlights must be at least 10 characters";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        onSubmit({
            reportType,
            remarks: remarks.trim(),
            highlights: highlights.trim(),
            challenges: challenges.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-md bg-white shadow-lg">
                {/* Header */}
                <div className="border-b bg-gray-100 rounded-md px-5 py-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Submit Team {reportType === "evening" ? "Evening" : "Morning"} Report
                    </h3>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-1">
                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={2}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.remarks
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-black/20"
                                }`}
                            placeholder="Overall remarks about team performance"
                        />
                        {errors.remarks && (
                            <p className="mt-0.5 text-xs text-red-500">{errors.remarks}</p>
                        )}
                    </div>

                    {/* Highlights */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Highlights <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={2}
                            value={highlights}
                            onChange={(e) => setHighlights(e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.highlights
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-black/20"
                                }`}
                            placeholder="Key achievements or positives"
                        />
                        {errors.highlights && (
                            <p className="mt-0.5 text-xs text-red-500">{errors.highlights}</p>
                        )}
                    </div>

                    {/* challenges */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Challenges
                        </label>
                        <textarea
                            rows={2}
                            value={challenges}
                            onChange={(e) => setChallenges(e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.challenges
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-black/20"
                                }`}
                            placeholder="Challenges faced and action plan"
                        />
                        {errors.challenges && (
                            <p className="mt-0.5 text-xs text-red-500">{errors.challenges}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-5 py-3">
                    <button
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitTeamReportModal;
