import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  PenTool,
  CreditCard,
  Building2,
  ClipboardList,
} from "lucide-react";

import DesignTab from "./tabs/DesignTab";
import PaymentTab from "./tabs/PaymentTab";
import ProjectTab from "./tabs/ProjectTab";
import RecceToDesignForm from "./tabs/RecceToDesignForm";
import SalesInForm from "./tabs/SalesInForm";
import BesicDetail from "./tabs/BasicDetail";
import TrackProject from "./tabs/TrackProject";
import MainQuotation from "./tabs/QuotationTab";
import { useParams } from "react-router-dom";

const steps = [
  { id: "basic", name: "Basic Details", icon: ClipboardList },
  { id: "project", name: "Projects Details", icon: Building2 },
  { id: "quotation", name: "Project Quotation", icon: LayoutDashboard },
  { id: "payment", name: "Payment Details", icon: CreditCard },
  // अन्य tabs...
];

import {
  useGetClientByIdQuery,
  useSendToManagerMutation,
  useSendToProjectDepartmentMutation,
} from "@/api/sales/client.api";

const ClientProfileMain = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStep, setActiveStep] = useState("basic");
  const { user } = useSelector((state) => state.auth.userData);
  const userRole = user?.designation?.title?.toLowerCase();
  const { id } = useParams();
  const { data: clientData, isFetching, refetch } = useGetClientByIdQuery(
    { id },
    { skip: !id }
  );
  const [sendToManager, { isLoading: isSendingToManager }] =
    useSendToManagerMutation();
  const [
    sendToProjectDepartment,
    { isLoading: isSendingToProjectDept },
  ] = useSendToProjectDepartmentMutation();

  const client = clientData?.data;
  const isSentToManager = client?.isSentToManager;
  const isSentToProjectDepartment = client?.isSentToProjectDepartment;

  const isExecutive = userRole === "sales executive";
  const isManager = userRole?.includes("manager");

  // URL से step parameter को track करें
  useEffect(() => {
    const stepFromUrl = searchParams.get("step");
    if (stepFromUrl) {
      const stepIndex = parseInt(stepFromUrl) - 1;
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setActiveIndex(stepIndex);
        setActiveStep(steps[stepIndex].id);
      }
    }
  }, [searchParams]);

  // Disable conditions...
  const isRecceCallDisabled =
  !id ||
  isSendingToManager ||
  isSendingToProjectDept ||
  isSentToProjectDepartment ||
  (isExecutive && isSentToManager);

  const handleRecceCallClick = async () => {
    if (!id) return;
    try {
      if (isExecutive) {
        const result = await sendToManager({ clientId: id }).unwrap();
        toast.success(
          result?.message || "Client sent to manager successfully"
        );
      } else if (isManager) {
        const result = await sendToProjectDepartment({ clientId: id }).unwrap();
        toast.success(
          result?.message || "Client sent to project department successfully"
        );
      }
      refetch();
    } catch (err) {
      toast.error(
        err?.data?.message || err?.data?.data?.message || "Failed to send"
      );
    }
  };

  const goBack = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveStep(steps[newIndex]?.id);
      setActiveIndex(newIndex);
      setSearchParams({ step: newIndex + 1 });
    }
  };

  const goNext = () => {
    if (activeIndex < steps.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveStep(steps[newIndex]?.id);
      setActiveIndex(newIndex);
      setSearchParams({ step: newIndex + 1 });
    }
  };

  const handleTabClick = (idx) => {
    setActiveStep(steps[idx].id);
    setActiveIndex(idx);
    setSearchParams({ step: idx + 1 });
  };

  const renderStep = () => {
    switch (activeStep) {
      case "sales":
        return <SalesInForm goNext={goNext} />;
      case "basic":
        return <BesicDetail goNext={goNext} />;
      case "recce":
        return <RecceToDesignForm goNext={goNext} goBack={goBack} />;
      case "design":
        return <DesignTab goNext={goNext} goBack={goBack} />;
      case "project":
        return <ProjectTab goNext={goNext} goBack={goBack} />;
      case "payment":
        return <PaymentTab goBack={goBack} goNext={goNext} />;
      case "quotation":
        return <MainQuotation goBack={goBack} goNext={goNext} />;
      case "track":
        return <TrackProject goBack={goBack} goNext={goNext} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 z-20">
      <div className="">
        {/* Header */}
        <div className="sticky top-[-14px] bg-white  rounded-lg mb-4 overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-l to-black from-neutral-800 text-gray-50 px-8 py-3 flex justify-between">
            <div className="">
              <h1 className="text-2xl font-bold">!! Client Profile !!</h1>
              <p className="text-gray-100 text-sm mt-1">
                Manage client details step by step
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isSentToProjectDepartment && (
                <span className="text-xs text-green-400 font-medium">
                  Sent to Project Department
                </span>
              )}
              {isSentToManager && !isSentToProjectDepartment && (
                <span className="text-xs text-amber-400 font-medium">
                  Sent to Manager
                </span>
              )}
              {!isSentToManager && !isSentToProjectDepartment && (
                <span className="text-xs text-gray-400 font-medium">
                  Pending
                </span>
              )}
              <button
                onClick={handleRecceCallClick}
                disabled={isRecceCallDisabled}
                className="px-4 py-2 rounded-lg bg-white text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingToManager || isSendingToProjectDept
                  ? "Sending..."
                  : isExecutive
                  ? "Send to Manager"
                  : isManager
                  ? "Send to Project Department"
                  : "Recce Call"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-5 bg-gray-50">
            <nav className="-mb-px overflow-auto flex justify-between">
              {steps.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(idx)}
                    className={`flex items-center py-4 px-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200
                      ${
                        isActive
                          ? "border-orange-500 text-orange-500"
                          : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                      }`}
                  >
                    <Icon
                      className={`h-4 w-4 mr-2 ${
                        isActive ? "text-orange-500" : ""
                      }`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <div className="p-4">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={goBack}
              disabled={activeIndex === 0}
              className="px-6 py-1.5 border rounded-sm bg-white text-gray-700 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={goNext}
              disabled={activeIndex === steps.length - 1}
              className="px-6 py-1.5 bg-black text-white rounded-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileMain;