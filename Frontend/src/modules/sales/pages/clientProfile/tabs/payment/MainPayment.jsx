import React, { useCallback } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import {
  useGetRecceStatusQuery,
  useSubmitToRecceMutation
} from "@/api/sales/sales.api";
import { ArrowBigLeft, ArrowBigRight, DollarSign, CreditCard, IndianRupee } from "lucide-react";

import InitialPaymentForm from "./InitialPayment";
import RemainingPaymentForm from "./RemainingPayment";
import { toast } from "react-toastify";

const MainPayment = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "initial";
  const setTab = (tab) => navigate(`?tab=${tab}`);

  const { data: statusData, isLoading: recceStatusLoading } =
    useGetRecceStatusQuery({ id: projectId });

  const recceStatus = statusData?.data?.recceStatus;
  const [submitToRecce, { isLoading: recceLoading }] = useSubmitToRecceMutation();

  const handleSubmitToRecce = useCallback(() => {
    const formData = { recceStatus: true };

    let toastId = null;

    toastId = toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to submit for recce?</p>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  await submitToRecce({ formData, id: projectId }).unwrap();
                  toast.update(toastId, {
                    render: "Submitted to Recce successfully",
                    type: "success",
                    autoClose: 3000
                  });
                } catch (err) {
                  toast.update(toastId, {
                    render: "Failed to submit to Recce",
                    type: "error",
                    autoClose: 3000
                  });
                }
                closeToast();
              }}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false
      }
    );
  }, [projectId, submitToRecce]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-3">

      {/* Header */}
      <div className="bg-black flex justify-between items-center rounded-lg border border-black/90 p-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            !! Payment Details !!
          </h2>
          <p className="text-sm text-gray-100">
            Manage payment details step by step
          </p>
        </div>
        <div className="space-x-2">
<button
            type="button"
            disabled={recceLoading || recceStatus}
            onClick={handleSubmitToRecce}
            className={`px-4 py-1.5 rounded-md text-black/90 shadow transition-all ${
              recceLoading || recceStatus
                ? "cursor-not-allowed bg-gray-700"
                : "bg-white  cursor-pointer"
            }`}
          >
            {recceLoading || recceStatusLoading
              ? "Submitting..."
              : recceStatus
              ? "Already Submitted To Recce"
              : "Submit To Recce Department"}
          </button>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-1.5 border bg-white rounded-md text-black cursor-pointer hover:bg-gray-100"
        >
          <ArrowBigLeft className="inline w-4 h-4" /> Back
        </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">

            <button
              onClick={() => setTab("initial")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "initial"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <IndianRupee className="w-4 h-4 inline mr-2" />
              Initial Payment
            </button>

            <button
              onClick={() => setTab("remaining")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "remaining"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Remaining Payments
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "initial" ? (
            <InitialPaymentForm />
          ) : (
            <RemainingPaymentForm />
          )}
        </div>
      </div>

    </div>
  );
};

export default MainPayment;
